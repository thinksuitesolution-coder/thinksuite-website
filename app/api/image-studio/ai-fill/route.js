import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: `You are a marketing copywriter. Extract structured overlay content from a business description.
Return ONLY valid JSON with these exact keys:
- badge: short label like "New Launch" or "Diwali Sale" (max 3 words, or empty string)
- headline: main catchy headline (max 8 words)
- subheadline: supporting line (max 12 words)
- features: array of exactly 4 strings - short feature/benefit bullets (max 5 words each, use empty string if fewer than 4)
- cta: call-to-action button text like "Book Now" or "Order Today" (max 3 words)
- phone: phone number if mentioned, else empty string
- website: website URL if mentioned, else empty string
No markdown, no explanation - raw JSON only.`,
      }, {
        role: "user",
        content: prompt.trim(),
      }],
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const raw = res.choices[0]?.message?.content || "{}";
    const data = JSON.parse(raw);

    return NextResponse.json({
      badge:       String(data.badge       || ""),
      headline:    String(data.headline    || ""),
      subheadline: String(data.subheadline || ""),
      features:    Array.isArray(data.features) ? data.features.slice(0, 4).map(f => String(f || "")) : ["", "", "", ""],
      cta:         String(data.cta         || ""),
      phone:       String(data.phone       || ""),
      website:     String(data.website     || ""),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || "AI fill failed" }, { status: 500 });
  }
}
