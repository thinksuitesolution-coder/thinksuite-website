import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";

export const maxDuration = 30;

const client = getAIClient();

export async function POST(request) {
  try {
    const { leads, requirement } = await request.json();

    if (!leads?.length || !requirement?.trim()) {
      const safeLeads = leads || [];
      return NextResponse.json({
        filteredIndices: safeLeads.map((_, i) => i),
        total: safeLeads.length,
        matched: safeLeads.length,
      });
    }

    const leadsForAI = leads.map((l, i) => ({
      i,
      name:        l.business_name || l.name || "",
      has_website: !!l.website,
      has_phone:   !!l.phone,
      rating:      l.rating ?? null,
      reviews:     l.total_ratings ?? null,
      category:    l.category || null,
    }));

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: `You are a precise business lead filtering assistant.

Each lead has:
- i: index (integer)
- name: business name
- has_website: true = has a website, false = no website
- has_phone: true = phone available, false = no phone
- rating: Google Maps rating (1.0–5.0) or null if unrated
- reviews: review count or null
- category: business type

Understand requirements written in English.

Examples of how to interpret requirements:
- "no website / without website" → has_website === false
- "has website / with website" → has_website === true
- "below rating 4 / rating under 4 / low rating" → rating < 4.0 (include null-rated too)
- "above rating 4 / 4+ rating / high rating" → rating >= 4.0
- "no phone" → has_phone === false
- "has phone / with phone" → has_phone === true
- "100+ reviews / many reviews" → reviews >= 100
- "new business / unrated" → rating is null

Be strict only include leads that clearly satisfy the requirement.
Return ONLY a raw JSON array of matching i values. No explanation, no markdown.`,
      messages: [{
        role: "user",
        content: `Requirement: "${requirement}"\n\nLeads:\n${JSON.stringify(leadsForAI)}\n\nReturn JSON array only.`,
      }],
    });

    const text = message.content[0]?.text?.trim() || "[]";
    // Extract JSON array from response robustly
    const match = text.match(/\[[\s\S]*?\]/);
    let filteredIndices;
    if (match) {
      try {
        filteredIndices = JSON.parse(match[0]).filter(n => Number.isInteger(n));
      } catch {
        console.warn("[ai-gmb-filter] AI returned unparseable array, passing all leads through");
        filteredIndices = leads.map((_, i) => i);
      }
    } else {
      // No JSON array found in the AI response — pass all leads through instead of
      // silently filtering everything out with an empty index list.
      console.warn("[ai-gmb-filter] no JSON array in AI response, passing all leads through");
      filteredIndices = leads.map((_, i) => i);
    }

    return NextResponse.json({
      success: true,
      filteredIndices,
      total:   leads.length,
      matched: filteredIndices.length,
    });
  } catch (err) {
    console.error("[ai-gmb-filter]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
