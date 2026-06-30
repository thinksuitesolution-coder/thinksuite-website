/**
 * Content Marketing Runner
 * Handles all marketing-department agents across all industries.
 * Uses Gemini to generate: WhatsApp broadcasts, Instagram captions, offers, Google review responses.
 *
 * Works for: Retail, Restaurant, Salon, Gym, Healthcare, Real Estate marketing agents.
 */

import { getAIClient } from "@/lib/aiClient";

const INDUSTRY_CONTEXT = {
  "retail":          "retail store / general store",
  "restaurant":      "restaurant / food & beverage business",
  "salon-beauty":    "salon / beauty parlour",
  "gym-fitness":     "gym / fitness centre",
  "healthcare":      "clinic / hospital",
  "real-estate":     "real estate agency",
  "education":       "coaching centre / school",
  "hotel":           "hotel / hospitality business",
  "ecommerce":       "e-commerce business",
  "it-software":     "IT / software company",
  "finance-ca":      "CA firm / accounting firm",
  "legal":           "law firm",
  "manufacturing":   "manufacturing company",
  "logistics":       "logistics / courier company",
  "travel":          "travel agency",
  "automobile":      "car dealership / automobile business",
  "marketing-agency":"marketing agency",
};

export async function run(agent, config) {
  const businessName = config.businessName || "Our Business";
  const city         = config.city         || "India";
  const products     = config.products     || config.services || "";
  const tone         = config.tone         || "Friendly";
  const language     = config.language     || "Hinglish";
  const offers       = config.offers       || "";
  const industryCtx  = INDUSTRY_CONTEXT[agent.industry] || "business";

  const prompt = `You are a marketing expert creating daily content for a ${industryCtx} called "${businessName}" in ${city}.

${products ? `Products/Services: ${products}` : ""}
${offers   ? `Current Offers: ${offers}` : ""}
Tone: ${tone}
Language: ${language} (mix of Hindi and English if Hinglish)

Generate a complete daily content package. Return ONLY valid JSON, no markdown, no explanation.

{
  "results": [
    {
      "type": "whatsapp_broadcast",
      "title": "Good Morning Broadcast",
      "content": "WhatsApp message 100-150 words. Start with a greeting. Include business name, today's highlight or offer. End with a CTA. Use emojis."
    },
    {
      "type": "whatsapp_broadcast",
      "title": "Evening Reminder",
      "content": "Short WhatsApp broadcast 60-80 words. Evening timing. Reminder about offer or service. Include address/contact hint."
    },
    {
      "type": "instagram_caption",
      "title": "Instagram Post 1",
      "content": "Instagram caption 80-120 words. Engaging hook. Story or tip. Relevant hashtags (10-15) at the end."
    },
    {
      "type": "instagram_caption",
      "title": "Instagram Reel Script",
      "content": "15-30 second reel script. Hook (3 sec) + Main content (20 sec) + CTA (5 sec). Format as HOOK: / CONTENT: / CTA:"
    },
    {
      "type": "offer",
      "title": "Today's Promotion",
      "content": "Promotional message for any platform. Clear offer, urgency, how to avail. 50-80 words."
    },
    {
      "type": "content",
      "title": "Google Review Response Template",
      "content": "Template response for a positive Google review. Professional, warm, mentions the business name. 40-60 words."
    }
  ]
}`;

  const client = getAIClient();
  const res    = await client.messages.create({
    model:      "claude-fable-5",
    max_tokens: 2000,
    messages:   [{ role: "user", content: prompt }],
  });
  const raw = res.content?.[0]?.text || "";

  try {
    // Strip any markdown code fences if present
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed  = JSON.parse(cleaned);
    return parsed.results || [];
  } catch {
    // Fallback if JSON parse fails — return the raw text as one content item
    return [{ type: "content", title: "Daily Content", content: raw }];
  }
}
