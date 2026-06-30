/**
 * Sales Leads Runner
 * Handles sales-department agents: real estate, healthcare, manufacturing, IT, etc.
 * Uses Gemini to generate: outreach messages, lead qualification tips, follow-up scripts.
 *
 * Note: Full lead scraping requires DataForSEO / Google Maps integration (separate keys).
 * This runner generates ready-to-use outreach content and lead strategy instead.
 */

import { getAIClient } from "@/lib/aiClient";

const INDUSTRY_PROMPTS = {
  "real-estate": `Generate 5 property lead follow-up scripts for a real estate agent.
Each script should be a WhatsApp message for a specific buyer persona:
1. First-time buyer asking about 2BHK
2. NRI investor looking for commercial property
3. Buyer who visited site but didn't convert
4. Referral from existing client
5. Someone who saw the Instagram ad`,

  "healthcare": `Generate 5 corporate outreach messages for a hospital sales executive targeting:
1. Mid-size IT company (200+ employees) for annual health check packages
2. Insurance company for empanelment
3. A school for student health packages
4. A factory for occupational health tie-up
5. A sports club for physiotherapy partnership`,

  "it-software": `Generate 5 LinkedIn outreach messages for a software company BDM targeting:
1. CTO of a 50-person company
2. Founder of a D2C brand looking to build an app
3. HR head looking for HRMS software
4. Operations head in a logistics company
5. Marketing head at a retail chain`,

  "manufacturing": `Generate 5 B2B outreach messages for a manufacturing company targeting:
1. Distributor in a new city
2. Export buyer from IndiaMART inquiry
3. Government tender follow-up
4. Existing client for upsell
5. Competitor's client who posted a complaint online`,

  "default": `Generate 5 sales outreach messages for different buyer personas relevant to the business.
Make each message personalized, concise (under 100 words), and end with a clear CTA.`,
};

export async function run(agent, config) {
  const businessName = config.businessName || "Our Business";
  const city         = config.city         || "India";
  const targetAudience = config.targetAudience || config.niche || "";

  const industryPrompt = INDUSTRY_PROMPTS[agent.industry] || INDUSTRY_PROMPTS.default;

  const prompt = `You are a senior sales consultant for "${businessName}" based in ${city}.
${targetAudience ? `Target audience: ${targetAudience}` : ""}

${industryPrompt}

Return ONLY valid JSON, no markdown:
{
  "results": [
    {
      "type": "lead",
      "title": "Lead persona name",
      "content": "The outreach message / script"
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
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed  = JSON.parse(cleaned);
    return parsed.results || [];
  } catch {
    return [{ type: "lead", title: "Sales Outreach", content: raw }];
  }
}
