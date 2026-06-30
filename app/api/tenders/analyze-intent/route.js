import { getAIClient } from "@/lib/aiClient";

export const maxDuration = 30;

const anthropic = getAIClient();

export async function POST(req) {
  try {
    const { businessDesc } = await req.json();
    if (!businessDesc?.trim()) {
      return Response.json({ error: "Business description required" }, { status: 400 });
    }

    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `You are a government tender expert. A user described their business/requirement in any language.
Analyze it and return a JSON object with:
- "english_summary": 1-2 sentence plain English summary of what tenders they need (e.g. "You are looking for solar panel installation and supply tenders")
- "hinglish_summary": same as english_summary (keep for backward compat)
- "sector": the best matching sector from this list: ["IT Software Technology", "Construction Civil Works", "Medical Healthcare Drugs", "Supply Equipment Goods", "Consultancy Advisory", "Infrastructure Roads", "Power Energy Solar", "Agriculture Food", "Education Training", "Water Sanitation", "Transport Logistics", "Security Defense", "Printing Publishing", "Telecommunications", "Environment Waste", "others"]
- "keywords": array of 3-5 key search terms in English
- "tender_type": "Works" | "Goods" | "Services" | "All" based on what they do

User input: "${businessDesc.trim().slice(0, 500)}"

Return ONLY valid JSON, no explanation.`,
      }],
    });

    let result;
    try {
      const raw = msg.content[0]?.text?.trim() || "{}";
      const jsonStr = raw.startsWith("{") ? raw : raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
      result = JSON.parse(jsonStr);
    } catch {
      return Response.json({ error: "Could not parse AI response" }, { status: 500 });
    }

    return Response.json(result);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
