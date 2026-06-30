/* ─────────────────────────────────────────────────────────────────────────
   Voice Agent powered by Vapi AI
   $10 free on signup · $0.05/min · Best developer API
   Signup: https://vapi.ai  →  Dashboard → API Keys + Phone Numbers
   Env vars needed:
     VAPI_API_KEY             from Vapi dashboard → API Keys
     VAPI_PHONE_NUMBER_ID     from Vapi dashboard → Phone Numbers (buy +91)
   ───────────────────────────────────────────────────────────────────────── */

const VAPI_BASE = "https://api.vapi.ai";

function authHeader() {
  const key = process.env.VAPI_API_KEY;
  if (!key) throw new Error("VAPI_API_KEY not set in environment");
  return { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" };
}

/* ── Language config for Sarvam STT + TTS ──────────────────────────────── */
const LANG_CONFIG = {
  hindi:     { sarvamLang: "hi-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Namaste! Kya main business owner se baat kar sakta hoon?" },
  hinglish:  { sarvamLang: "hi-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Hello! Kya main business owner se baat kar sakta hoon?" },
  tamil:     { sarvamLang: "ta-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Vanakkam! Ungal business owner kitta pesalama?" },
  telugu:    { sarvamLang: "te-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Namaskaram! Business owner gari tho matladavacha?" },
  kannada:   { sarvamLang: "kn-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Namaskara! Business owner avara jothe maatanadadavenu?" },
  malayalam: { sarvamLang: "ml-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Namaskaram! Business owner aayi samsarikkamo?" },
  marathi:   { sarvamLang: "mr-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Namaskar! Tumhi business owner ahat ka?" },
  gujarati:  { sarvamLang: "gu-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Kem chho! Shum business owner sathe vaat thai shake?" },
  bengali:   { sarvamLang: "bn-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Namaskar! Ki ami business owner er shathe kotha bolte pari?" },
  punjabi:   { sarvamLang: "pa-IN",  voiceId: "bulbul:v1",    sttModel: "saarika:v1", firstMsg: "Sat Sri Akal! Ki main business owner naal gal kar sakda haan?" },
  english:   { sarvamLang: null,     voiceId: "jennifer",     sttModel: "nova-2",     firstMsg: "Hello! Am I speaking with the business owner?" },
};

function buildSystemPrompt(goal, language, businessContext) {
  const langInstr = {
    hindi:     "Sirf Hindi mein baat karo. Clear aur friendly tone.",
    hinglish:  "Hinglish mein baat karo Hindi aur English ka natural mix. Friendly tone.",
    tamil:     "Tamil mein baat karo. Polite aur professional tone.",
    telugu:    "Telugu mein baat karo. Polite aur professional tone.",
    kannada:   "Kannada mein baat karo. Polite aur professional tone.",
    malayalam: "Malayalam mein baat karo. Polite aur professional tone.",
    marathi:   "Marathi mein baat karo. Friendly tone.",
    gujarati:  "Gujarati mein baat karo. Friendly aur professional.",
    bengali:   "Bengali mein baat karo. Warm aur professional.",
    punjabi:   "Punjabi mein baat karo. Friendly tone.",
    english:   "Speak in clear professional English. Be warm and concise.",
  };

  return `You are an AI sales assistant for ThinkSuite. ${langInstr[language] || langInstr.hinglish}

${businessContext ? `About our business: ${businessContext}\n\n` : ""}Your goal: ${goal}

Rules:
- Never claim to be human if asked say you are an AI assistant
- Keep each response SHORT (1-2 sentences max)
- If interested: ask for best callback time, note their preference
- If not interested: thank them politely and end the call
- Never be pushy. Respect any refusal immediately.
- End call gracefully after: getting clear answer, 4 minutes, or if asked to end

After the call, the system will capture outcome automatically.`;
}

/* ── Build inline Vapi assistant config ────────────────────────────────── */
function buildAssistant({ goal, language, businessContext, webhookUrl }) {
  const cfg = LANG_CONFIG[language] || LANG_CONFIG.hinglish;
  const systemPrompt = buildSystemPrompt(goal, language, businessContext);

  const transcriber = cfg.sarvamLang
    ? { provider: "sarvam", model: cfg.sttModel, language: cfg.sarvamLang }
    : { provider: "deepgram", model: "nova-2", language: "en-IN" };

  const voice = cfg.sarvamLang
    ? { provider: "sarvam", voiceId: cfg.voiceId, language: cfg.sarvamLang }
    : { provider: "cartesia", voiceId: cfg.voiceId };

  return {
    name:              "ThinkSuite_AI_Agent",
    firstMessage:      cfg.firstMsg,
    transcriber,
    voice,
    model: {
      provider: "anthropic",
      model:    "claude-haiku-4-5-20251001",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.6,
      maxTokens:   150,
    },
    silenceTimeoutSeconds:    8,
    maxDurationSeconds:       300,
    backgroundSound:          "off",
    backchannelingEnabled:    false,
    backgroundDenoisingEnabled: true,
    ...(webhookUrl ? { serverUrl: webhookUrl } : {}),
    analysisPlan: {
      summaryPrompt:   "Summarize this sales call in 2-3 sentences. What was the lead's interest level and any key information shared?",
      successEvaluationPrompt: "Was the call successful? Mark true if lead showed interest or agreed to callback, false if not interested or no answer.",
      successEvaluationRubric: "PercentageScale",
    },
  };
}

/* ─── Launch a single outbound call via Vapi ────────────────────────────── */
export async function launchBolnaCall({ agentId: _ignored, phoneNumber, leadData = {}, goal, language, businessContext, webhookUrl }) {
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  if (!phoneNumberId) throw new Error("VAPI_PHONE_NUMBER_ID not set in environment");

  const phone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/\D/g, "")}`;

  const assistant = buildAssistant({ goal, language, businessContext, webhookUrl });

  const body = {
    assistant,
    phoneNumberId,
    customer: {
      number: phone,
      name:   leadData.name || undefined,
    },
  };

  const res = await fetch(`${VAPI_BASE}/call/phone`, {
    method:  "POST",
    headers: authHeader(),
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    throw new Error(`Vapi call failed (${res.status}): ${err}`);
  }
  return res.json(); // { id, status, ... }
}

/* ─── Stub Vapi doesn't need pre-created agents (inline per call) ────── */
export async function createBolnaAgent(_config) {
  return { agent_id: "vapi_inline" };
}

/* ─── Get call status ───────────────────────────────────────────────────── */
export async function getBolnaCallStatus(callId) {
  const res = await fetch(`${VAPI_BASE}/call/${callId}`, {
    headers: authHeader(),
  });
  if (!res.ok) return null;
  return res.json();
}
