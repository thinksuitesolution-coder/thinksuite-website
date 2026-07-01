import OpenAI from 'openai';

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'build-placeholder',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Groq model tiers (all valid as of 2025)
export const GROQ_MODEL_HIGH    = 'llama-3.3-70b-versatile';     // 100K TPD, 6K TPM
export const GROQ_MODEL_FAST    = 'llama-3.1-8b-instant';        // 500K TPD, 30K TPM
export const GROQ_MODEL_BACKUP  = 'llama-3.2-90b-text-preview';  // separate quota pool
export const GROQ_MODEL_BACKUP2 = 'gemma2-9b-it';                // separate quota pool
export const GROQ_MODEL_BACKUP3 = 'llama3-groq-8b-8192-tool-use-preview'; // separate pool
export const GROQ_MODEL = GROQ_MODEL_HIGH;

// Gemini free tier — separate quota pool from Groq entirely
const GEMINI_MODEL = 'gemini-2.5-flash';

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
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text (possibly blocked or truncated)');
  return text;
}

async function callGroq(model: string, prompt: string, maxTokens: number): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === 'build-placeholder') throw new Error('GROQ_API_KEY not configured — skipping Groq');
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

// Free-tier fallback chain across two independent providers (Groq + Gemini)
// so one provider's daily quota exhaustion doesn't stall the whole pipeline.
type Provider = { name: string; call: (prompt: string, maxTokens: number) => Promise<string> };

// openai/gpt-oss-120b has only an 8000 TPM cap on Groq — too small for big writer
// prompts, so it goes last in the high-maxTokens chain but stays early for fast calls.
function buildChain(preferFast: boolean): Provider[] {
  const groqHigh: Provider = { name: GROQ_MODEL_HIGH, call: (p, t) => callGroq(GROQ_MODEL_HIGH, p, t) };
  const groqFast: Provider = { name: GROQ_MODEL_FAST, call: (p, t) => callGroq(GROQ_MODEL_FAST, p, t) };
  const groqBackup: Provider = { name: GROQ_MODEL_BACKUP, call: (p, t) => callGroq(GROQ_MODEL_BACKUP, p, t) };
  const groqBackup2: Provider = { name: GROQ_MODEL_BACKUP2, call: (p, t) => callGroq(GROQ_MODEL_BACKUP2, p, t) };
  const groqBackup3: Provider = { name: GROQ_MODEL_BACKUP3, call: (p, t) => callGroq(GROQ_MODEL_BACKUP3, p, t) };
  const gemini: Provider = { name: GEMINI_MODEL, call: callGemini };

  return preferFast
    ? [groqFast, gemini, groqBackup2, groqBackup3, groqBackup, groqHigh]
    : [groqHigh, gemini, groqBackup3, groqFast, groqBackup2, groqBackup];
}

export async function groqJSON<T = Record<string, unknown>>(
  prompt: string,
  maxTokens = 3000,
  preferFast = false
): Promise<T> {
  const chain = buildChain(preferFast);

  let lastErr: Error | null = null;
  for (const provider of chain) {
    try {
      const raw = await provider.call(prompt, maxTokens);
      return extractJSON<T>(raw);
    } catch (err) {
      const msg = (err as Error).message || '';
      const isRateLimit = msg.toLowerCase().includes('rate limit') || msg.includes('429')
        || msg.includes('quota') || msg.includes('tokens per day') || msg.includes('exceeded')
        || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('401') || msg.includes('403')
        || msg.includes('tokens per minute') || msg.includes('TPM') || msg.includes('model_not_found')
        || msg.toLowerCase().includes('not configured');
      const isTooLarge = msg.includes('413') || msg.toLowerCase().includes('too large')
        || msg.includes('tokens per minute') || msg.includes('TPM');
      const isParseErr = msg.includes('JSON') || msg.includes('parse') || err instanceof SyntaxError;
      // Any known transient/capacity error → try next provider instead of failing the whole call
      if (isRateLimit || isTooLarge || isParseErr) {
        console.warn(`[LLM] ${provider.name} ${isRateLimit ? 'rate limited' : isTooLarge ? 'request too large' : 'parse error'}, trying next...`);
        lastErr = err as Error;
        continue;
      }
      console.warn(`[LLM] ${provider.name} unrecognized error, trying next anyway:`, msg.slice(0, 100));
      lastErr = err as Error;
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
