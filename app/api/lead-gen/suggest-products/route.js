import { getAIClient } from "@/lib/aiClient";
import { NextResponse } from "next/server";

export const maxDuration = 20;

const anthropic = getAIClient();

export async function POST(req) {
  try {
    const { tradeType = "exporter", country = "", industry = "" } = await req.json();

    const context = [
      tradeType === "importer" ? "importing goods" : tradeType === "both" ? "importing & exporting" : "exporting goods",
      country ? `to/from ${country}` : "",
      industry ? `in the ${industry} sector` : "",
    ].filter(Boolean).join(" ");

    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 800,
      system: `Return ONLY valid JSON (no markdown). Suggest 8 popular products for trade.`,
      messages: [{
        role: "user",
        content: `Suggest 8 popular products commonly used for ${context}. Return JSON: {"products":["Product 1","Product 2",...]}. Each product should be a real trade commodity name (2-4 words).`,
      }],
    });

    const raw     = res.content[0]?.text?.trim() || "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed  = JSON.parse(cleaned);

    return NextResponse.json({ success: true, products: parsed.products || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
