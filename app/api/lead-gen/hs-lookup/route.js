import { getAIClient } from "@/lib/aiClient";
import { NextResponse } from "next/server";

export const maxDuration = 20;

const anthropic = getAIClient();

export async function POST(req) {
  try {
    const { product } = await req.json();
    if (!product?.trim()) return NextResponse.json({ error: "product required" }, { status: 400 });

    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1000,
      system: `You are an international trade expert. Return ONLY valid JSON (no markdown).`,
      messages: [{
        role: "user",
        content: `Find the top 5 most relevant HS/ITC codes for: "${product}"

Return JSON:
{"codes":[
  {"code":"100630","description":"Semi-milled or wholly milled rice","chapter":"Chapter 10 - Cereals","commonlyUsed":true},
  ...
]}
Each code must be a real HS code (4-8 digits) with accurate description. Mark 1-2 as commonlyUsed:true.`,
      }],
    });

    const raw     = res.content[0]?.text?.trim() || "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed  = JSON.parse(cleaned);

    return NextResponse.json({ success: true, codes: parsed.codes || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
