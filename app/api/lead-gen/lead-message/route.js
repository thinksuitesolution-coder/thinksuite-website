import { getAIClient } from "@/lib/aiClient";
import { NextResponse } from "next/server";

const client = getAIClient();

export async function POST(request) {
  try {
    const { lead, userServices, searchCategory, extraContext } = await request.json();
    if (!lead?.business_name) {
      return NextResponse.json({ error: "lead data required" }, { status: 400 });
    }

    const services = userServices?.trim() || "our services";
    const category = searchCategory || lead.category || "Business";
    const extra = extraContext?.trim() || "";

    const prompt = `You are a sales expert. Generate two personalized cold outreach messages for this business:

Business: ${lead.business_name}
Search Category: ${category}
Business Type: ${lead.category || category}
City: ${lead.city || ""}
Rating: ${lead.rating ? `${lead.rating} ⭐ (${lead.total_ratings || 0} reviews)` : "N/A"}
Website: ${lead.website || "None"}

The sender offers: ${services}
${extra ? `\nAdditional instructions from sender: ${extra}\n` : ""}
IMPORTANT: The sender found this lead by searching for "${category}" businesses. Tailor your messages specifically for this type of business.${extra ? " Follow the additional instructions above carefully." : ""}

Return ONLY a valid JSON object (no markdown):
{
  "english": "A professional cold outreach message in English, 80-100 words. Mention their business name and city. Explain why ${services} specifically helps ${category} businesses like theirs. Be warm, specific about their niche, and end with a clear CTA.",
  "casual": "A friendly, casual cold outreach message in English only (no Hindi or mixed language), 80-100 words. Mention their business name and city. Explain how ${services} can specifically help their ${category} business. Keep it warm and conversational, and end with a clear CTA."
}`;

    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = res.content.find(b => b.type === "text")?.text?.trim() || "{}";
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const { english, casual } = JSON.parse(json);

    return NextResponse.json({ english, hinglish: casual });
  } catch (err) {
    console.error("[lead-message]", err);
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 });
  }
}
