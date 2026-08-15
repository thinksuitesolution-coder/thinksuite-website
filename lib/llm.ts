import OpenAI from 'openai';

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'build-placeholder',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Groq model tiers — llama-3.2-90b-text-preview, gemma2-9b-it, and
// llama3-groq-8b-8192-tool-use-preview were removed from the chain below:
// Groq decommissioned all three, they only ever return 400s.
// TPM figures below are what Groq's 413s actually report for this org on the
// on_demand tier, not the published free-tier table — the fast model rejected a
// 7140-token request citing "Limit 6000", so both ceilings are 6K here.
export const GROQ_MODEL_HIGH = 'llama-3.3-70b-versatile'; // 100K TPD, 6K TPM
export const GROQ_MODEL_FAST = 'llama-3.1-8b-instant';    // 500K TPD, 6K TPM
export const GROQ_MODEL = GROQ_MODEL_HIGH;

// Gemini free tier — separate quota pool from Groq entirely
const GEMINI_MODEL = 'gemini-2.5-flash';

// Z.ai / Zhipu AI — OpenAI-compatible endpoint, separate quota pool from Groq/Gemini
export const glm = new OpenAI({
  apiKey: process.env.ZAI_API_KEY || 'build-placeholder',
  baseURL: 'https://api.z.ai/api/paas/v4/',
});
export const GLM_MODEL = 'glm-5.2';

// OpenAI — paid, last resort fallback so a free-tier quota wipeout across
// Groq/Gemini/GLM doesn't stall the whole pipeline (this happened 2026-07-13:
// all free providers were rate-limited/decommissioned at the same time and
// zero articles published for the day).
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'build-placeholder',
});
export const OPENAI_MODEL = 'gpt-4o-mini';

async function callGLM(prompt: string, maxTokens: number): Promise<string> {
  const key = process.env.ZAI_API_KEY;
  if (!key || key === 'build-placeholder') throw new Error('ZAI_API_KEY not configured — skipping GLM');
  const completion = await glm.chat.completions.create({
    model: GLM_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return completion.choices[0].message.content || '{}';
}

async function callOpenAI(prompt: string, maxTokens: number): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === 'build-placeholder') throw new Error('OPENAI_API_KEY not configured — skipping OpenAI');
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return completion.choices[0].message.content || '{}';
}

async function callGemini(prompt: string, maxTokens: number): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          // Without this Gemini answers the "return JSON" prompts in markdown
          // ("**AI's Energy Appetite**…"), which extractJSON cannot salvage —
          // so the one provider still holding quota was failing every article.
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text (possibly blocked or truncated)');
  return text;
}

// Groq enforces tokens-per-minute per model, and an article prompt is large
// enough that two or three back-to-back calls trip the 6K TPM ceiling on the
// 70B model. Every provider after it in the chain is now dead or free-tier
// limited too, so a tripped TPM used to cascade into a run that published
// nothing. Spending a few seconds waiting is cheaper than losing the article.
const TPM_BUDGET: Record<string, number> = {
  [GROQ_MODEL_HIGH]: 6000,
  [GROQ_MODEL_FAST]: 6000,
};

// Prompt + completion has to fit the 6000 TPM ceiling above, and an article
// prompt is already ~1500 tokens, so this is about as much as Groq can be
// asked to return without a 413.
const GROQ_MAX_TOKENS = 3000;

const recentSpend: Record<string, { at: number; tokens: number }[]> = {};

// Groq bills prompt + completion; ~4 chars per token is close enough to pace
// against, and over-estimating just makes us a little more conservative.
function estimateTokens(prompt: string, maxTokens: number): number {
  return Math.ceil(prompt.length / 4) + maxTokens;
}

async function awaitTpmBudget(model: string, prompt: string, maxTokens: number): Promise<void> {
  const budget = TPM_BUDGET[model];
  if (!budget) return;

  const cost = estimateTokens(prompt, maxTokens);

  for (;;) {
    const now = Date.now();
    const window = (recentSpend[model] ?? []).filter((e) => now - e.at < 60_000);
    recentSpend[model] = window;

    const spent = window.reduce((total, e) => total + e.tokens, 0);
    // An empty window means this single call is bigger than the whole budget;
    // let it through and let the fallback chain deal with the 429.
    if (spent + cost <= budget || window.length === 0) break;

    const waitMs = 60_000 - (now - window[0].at) + 250;
    console.log(`[LLM] ${model} at ${spent}/${budget} TPM — waiting ${Math.ceil(waitMs / 1000)}s`);
    await new Promise((r) => setTimeout(r, waitMs));
  }

  recentSpend[model].push({ at: Date.now(), tokens: cost });
}

async function callGroq(model: string, prompt: string, maxTokens: number): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === 'build-placeholder') throw new Error('GROQ_API_KEY not configured — skipping Groq');
  await awaitTpmBudget(model, prompt, maxTokens);
  const completion = await groq.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return completion.choices[0].message.content || '{}';
}

function extractJSON<T>(raw: string): T {
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : cleaned) as T;
}

// Fallback chain across independent free-tier providers (Groq, Gemini, GLM),
// with paid OpenAI last so one shared free-quota wipeout doesn't stall the
// whole pipeline the way it did on 2026-07-13.
type Provider = {
  name: string;
  call: (prompt: string, maxTokens: number) => Promise<string>;
  // Groq bills the completion reserve against its 6000 tokens-per-minute
  // ceiling, so a request there cannot ask for much more than 3000 without
  // being rejected outright. That cap used to apply to every provider, and an
  // article prompt — 800+ words of markdown plus ten more fields in one JSON
  // object — does not fit in it: the response was truncated mid-object and
  // JSON.parse failed on every provider in turn. Only Groq needs the cap.
  maxTokensCap?: number;
};

// Providers that failed for a reason no retry can cure — a rejected key, an
// exhausted balance, a missing env var. Dropped for the rest of the process so
// the remaining articles don't each pay for the same doomed attempts.
const deadProviders = new Set<string>();

// The OpenAI SDK (Groq/GLM/OpenAI all go through it) sets `.status` on the
// error it throws; callGemini attaches the same for its own fetch-based 401s.
// Reading that beats scanning err.message for "401"/"403"/"429" as bare
// substrings — a JSON parse error whose text happens to be "...at position
// 401 (line 4..." matched `msg.includes('401')` and got a provider that had
// simply returned a truncated response permanently blacklisted as if its key
// were rejected, for the rest of that run.
function statusOf(err: unknown): number | undefined {
  const status = (err as { status?: unknown } | null)?.status;
  return typeof status === 'number' ? status : undefined;
}

function isDead(err: Error, status?: number): boolean {
  if (status === 401 || status === 403) return true;
  const m = err.message.toLowerCase();
  return m.includes('insufficient balance')
    || m.includes('api key not valid')
    || m.includes('incorrect api key')
    || m.includes('not configured')
    || m.includes('invalid_api_key');
}

function buildChain(preferFast: boolean): Provider[] {
  const groqHigh: Provider = { name: GROQ_MODEL_HIGH, call: (p, t) => callGroq(GROQ_MODEL_HIGH, p, t), maxTokensCap: GROQ_MAX_TOKENS };
  const groqFast: Provider = { name: GROQ_MODEL_FAST, call: (p, t) => callGroq(GROQ_MODEL_FAST, p, t), maxTokensCap: GROQ_MAX_TOKENS };
  const gemini: Provider = { name: GEMINI_MODEL, call: callGemini };
  const glmProvider: Provider = { name: GLM_MODEL, call: callGLM };
  const openaiProvider: Provider = { name: OPENAI_MODEL, call: callOpenAI };

  // Two different orders, because the two kinds of call want opposite things.
  //
  // The small calls — fact-checks, a few hundred tokens — fit inside Groq's
  // ceiling comfortably and were the one stage still working, so they keep
  // leading with the free providers.
  //
  // The article calls do not fit, and leading with free providers meant every
  // article paid four truncated responses before reaching one that could
  // answer in full. OpenAI leads there instead: it is the provider with credit
  // on it, and its cost on this volume is a couple of dollars a month. GLM is
  // last on both — its balance is empty, so it is dropped from the chain after
  // its first failure of a run anyway.
  return preferFast
    ? [groqFast, gemini, groqHigh, openaiProvider, glmProvider]
    : [openaiProvider, gemini, groqHigh, groqFast, glmProvider];
}

export async function groqJSON<T = Record<string, unknown>>(
  prompt: string,
  maxTokens = 3000,
  preferFast = false
): Promise<T> {
  const chain = buildChain(preferFast).filter((p) => !deadProviders.has(p.name));

  let lastErr: Error | null = null;
  for (const provider of chain) {
    try {
      const cap = provider.maxTokensCap;
      const raw = await provider.call(prompt, cap ? Math.min(maxTokens, cap) : maxTokens);
      return extractJSON<T>(raw);
    } catch (err) {
      const e = err as Error;
      const msg = e.message || '';
      const status = statusOf(e);

      // A bad key or an empty balance will not fix itself mid-run, so retrying
      // it once per article only wastes time and buries the real reason under
      // "rate limited" — the catch-all below treats 401/403 as throttling.
      if (isDead(e, status)) {
        deadProviders.add(provider.name);
        console.warn(`[LLM] ${provider.name} unusable this run (${msg.slice(0, 80)}) — dropping from chain`);
        lastErr = e;
        continue;
      }

      const isRateLimit = status === 429 || status === 401 || status === 403
        || msg.toLowerCase().includes('rate limit') || msg.includes('quota')
        || msg.includes('tokens per day') || msg.includes('exceeded')
        || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('tokens per minute')
        || msg.includes('TPM') || msg.includes('model_not_found')
        || msg.toLowerCase().includes('not configured');
      const isTooLarge = status === 413 || msg.toLowerCase().includes('too large')
        || msg.includes('tokens per minute') || msg.includes('TPM');
      const isParseErr = msg.includes('JSON') || msg.includes('parse') || e instanceof SyntaxError;
      // Any known transient/capacity error → try next provider instead of failing the whole call
      if (isRateLimit || isTooLarge || isParseErr) {
        console.warn(`[LLM] ${provider.name} ${isRateLimit ? 'rate limited' : isTooLarge ? 'request too large' : 'parse error'}, trying next...`);
        lastErr = e;
        continue;
      }
      console.warn(`[LLM] ${provider.name} unrecognized error, trying next anyway:`, msg.slice(0, 100));
      lastErr = e;
    }
  }
  throw lastErr || new Error('All LLM models failed');
}

// Fast variant — uses 8b-instant by default (saves Claude + 70b quota)
export async function groqJSONFast<T = Record<string, unknown>>(
  prompt: string,
  maxTokens = 1000
): Promise<T> {
  return groqJSON<T>(prompt, maxTokens, true);
}
