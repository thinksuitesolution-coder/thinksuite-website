import { notifyApiAlert } from "./adminNotifier";

/* ── Credit/quota exhaustion signatures per provider ─────────────────────── */
const CREDIT_SIGNATURES = {
  openai: {
    statusCodes: [429, 402],
    errorCodes: ["insufficient_quota", "billing_hard_limit_reached"],
    messagePatterns: ["exceeded your current quota", "insufficient_quota", "billing", "hard limit", "You exceeded"],
  },
  anthropic: {
    statusCodes: [529, 429, 402],
    errorCodes: ["overloaded_error", "rate_limit_error"],
    messagePatterns: ["credit balance is too low", "your credit balance", "insufficient credits", "overloaded"],
  },
  replicate: {
    statusCodes: [402, 429],
    errorCodes: [],
    messagePatterns: ["payment", "billing", "quota exceeded", "credits"],
  },
  google: {
    statusCodes: [429, 402, 403],
    errorCodes: ["RESOURCE_EXHAUSTED", "QUOTA_EXCEEDED"],
    messagePatterns: ["quota", "RESOURCE_EXHAUSTED", "billing", "exceeded", "Quota exceeded"],
  },
  firecrawl: {
    statusCodes: [402, 429],
    errorCodes: [],
    messagePatterns: ["credits", "quota", "billing", "limit exceeded"],
  },
};

/* ── Detect if an error is credit/quota exhaustion ───────────────────────── */
export function detectCreditError(error, provider) {
  const sig = CREDIT_SIGNATURES[provider];
  if (!sig) return false;

  const status = error?.status || error?.statusCode || error?.response?.status;
  const code = error?.code || error?.error?.code || error?.type;
  const message = (error?.message || error?.error?.message || error?.toString() || "").toLowerCase();

  if (sig.statusCodes.includes(Number(status))) return true;
  if (sig.errorCodes.some((c) => String(code).toLowerCase().includes(c.toLowerCase()))) return true;
  if (sig.messagePatterns.some((p) => message.includes(p.toLowerCase()))) return true;

  return false;
}

/* ── Log alert delegates to unified adminNotifier ─────────────────────── */
export async function logApiAlert(ctx) {
  try {
    await notifyApiAlert(ctx);
  } catch (e) {
    console.error("[apiCreditMonitor] logApiAlert failed:", e.message);
  }
}

/* ── Convenience wrapper for API routes ─────────────────────────────────── */
export async function withCreditGuard(fn, provider, context = {}) {
  try {
    return await fn();
  } catch (error) {
    if (detectCreditError(error, provider)) {
      await logApiAlert({ provider, error, ...context });
      const friendly = new Error(
        "Yeh service abhi temporarily unavailable hai. Admin ko notify kar diya gaya hai. Thodi der baad try karein."
      );
      friendly.isCreditAlert = true;
      friendly.statusCode = 503;
      throw friendly;
    }
    throw error;
  }
}
