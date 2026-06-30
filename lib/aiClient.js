/**
 * Unified AI client - Gemini only (gemini-2.5-flash)
 * Provider toggle removed — always Gemini.
 */

import { getAdminDb } from "@/lib/firebaseAdmin";

const MODEL_MAP = {
  "claude-fable-5":             "gemini-2.5-flash",
  "claude-haiku-4-5-20251001":  "gemini-2.5-flash",
  "claude-haiku-4-5":           "gemini-2.5-flash",
  "claude-haiku-4-5-20250307":  "gemini-2.5-flash",
  "claude-sonnet-4-6":          "gemini-2.5-flash",
  "claude-sonnet-4-20250514":   "gemini-2.5-flash",
  "claude-3-5-sonnet-20241022": "gemini-2.5-flash",
  "claude-opus-4-8":            "gemini-2.5-flash",
  "claude-opus-4-5":            "gemini-2.5-flash",
};

function toGeminiModel(claudeModel) {
  return MODEL_MAP[claudeModel] || "gemini-2.5-flash";
}

function geminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
}

async function geminiChat(model, messages, maxTokens) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${geminiApiKey()}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_completion_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(55000),
    }
  );
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    const friendlyMsg =
      res.status === 429 ? "AI rate limit reached. Please try again in a few minutes." :
      res.status === 403 ? "AI service temporarily unavailable. Please try again later." :
      `AI service error (${res.status}). Please try again.`;
    const err = new Error(friendlyMsg);
    err.status = res.status;
    err._raw = errText;
    throw err;
  }
  return res.json();
}

function normalizeMessages(messages) {
  return (messages || []).map(m => {
    if (typeof m.content === "string") return m;
    if (Array.isArray(m.content)) {
      const text = m.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n");
      return { role: m.role, content: text };
    }
    return m;
  });
}

export function getAIClient() {
  return {
    messages: {
      create: async (params) => {
        const geminiModel = toGeminiModel(params.model || "claude-sonnet-4-6");

        const msgs = [];
        if (params.system) {
          const sysText = Array.isArray(params.system)
            ? params.system.filter(b => b.type === "text").map(b => b.text).join("\n")
            : String(params.system);
          msgs.push({ role: "system", content: sysText });
        }
        msgs.push(...normalizeMessages(params.messages));

        const isThinkingModel = geminiModel.includes("2.5");
        const maxTokens = isThinkingModel
          ? Math.max(params.max_tokens || 4096, 4096)
          : (params.max_tokens || 2048);

        const data = await geminiChat(geminiModel, msgs, maxTokens);
        const text = data.choices?.[0]?.message?.content || "";
        return {
          content: [{ type: "text", text }],
          model:   geminiModel,
          usage: {
            input_tokens:  data.usage?.prompt_tokens     || 0,
            output_tokens: data.usage?.completion_tokens || 0,
          },
        };
      },
    },
  };
}

export function invalidateProviderCache() {}
