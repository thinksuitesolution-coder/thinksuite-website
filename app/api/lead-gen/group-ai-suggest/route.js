import { getAIClient } from "@/lib/aiClient";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const anthropic = getAIClient();

/* ─── Mode 1: User describes business → suggest niches + platforms + message */
async function suggestFromBusiness(business, isInternational) {
  const location = isInternational ? "international markets" : "India";
  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    system: `You are an expert Indian digital marketing consultant. A user describes their business and you tell them exactly which online groups to target to find customers.
Return ONLY valid JSON (no markdown, no code blocks, no explanation):
{"niches":[{"label":"Short category name 2-4 words","reason":"1 line why this niche has buyers"}],"platforms":["whatsapp","telegram","facebook"],"message":"Short outreach message under 80 words","tip":"One smart targeting tip"}
Rules: niches = 4-5 items. Platforms = only from: whatsapp, telegram, facebook, discord, reddit, linkedin, slack.`,
    messages: [{
      role: "user",
      content: `Business: "${business}"\nTarget market: ${location}`,
    }],
  });
  const raw = res.content[0]?.text?.trim() || "{}";
  // strip markdown code blocks if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

/* ─── Mode 2: User typed a niche → return synonyms + related group categories */
async function relatedNiches(niche, isInternational) {
  const location = isInternational ? "international" : "India";
  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    system: `Return ONLY valid JSON (no markdown, no code blocks): {"related":["term1","term2","term3","term4","term5","term6"]}
Rules: 6 related group search terms for ${location}. Mix synonyms, broader/narrower, related niches. Each under 4 words.`,
    messages: [{ role: "user", content: `Niche: "${niche}"` }],
  });
  const raw     = res.content[0]?.text?.trim() || "{}";
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req) {
  try {
    const { mode, business, niche, isInternational } = await req.json();

    if (mode === "business" && business?.trim()) {
      const result = await suggestFromBusiness(business.trim(), isInternational);
      return NextResponse.json({ success: true, ...result });
    }

    if (mode === "related" && niche?.trim()) {
      const result = await relatedNiches(niche.trim(), isInternational);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (err) {
    console.error("[group-ai-suggest]", err?.message || err);
    return NextResponse.json({ success: false, error: err?.message || "AI suggest failed" }, { status: 500 });
  }
}
