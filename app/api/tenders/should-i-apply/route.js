import { getAIClient } from "@/lib/aiClient";

export const maxDuration = 30;

const anthropic = getAIClient();

export async function POST(request) {
  try {
    const { tender, company } = await request.json();
    /* company: { type, annual_turnover, experience_years, msme_registered,
                  state, certifications[], sectors[] } */

    if (!tender || !company) {
      return Response.json({ error: "tender and company required" }, { status: 400 });
    }

    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      system:     "You are an expert GeM/government tender consultant for Indian SMEs. Be realistic and practical. Return ONLY valid JSON.",
      messages: [{
        role:    "user",
        content: `Analyse if this company should apply for this tender across 12 intelligence layers. Be honest and practical.

COMPANY PROFILE:
- Type: ${company.type || "Not specified"}
- Annual Turnover: ${company.annual_turnover || "Not specified"}
- Years in Business: ${company.experience_years || "Not specified"}
- MSME Registered: ${company.msme_registered ? "Yes" : "No"}
- State: ${company.state || "Not specified"}
- Certifications: ${(company.certifications || []).join(", ") || "None listed"}
- Sectors they work in: ${(company.sectors || []).join(", ") || "Not specified"}

TENDER:
${JSON.stringify({
  title: tender.title,
  organization: tender.organization,
  sector: tender.sector,
  value: tender.value,
  emd: tender.emd,
  state_city: tender.state_city,
  eligibility: tender.eligibility,
  who_can_apply: tender.who_can_apply,
  who_cannot_apply: tender.who_cannot_apply,
  min_turnover_required: tender.min_turnover_required,
  min_experience_required: tender.min_experience_required,
  required_certifications: tender.required_certifications,
  delivery_location: tender.delivery_location || tender.state_city,
  days_remaining: tender.days_remaining,
  compliance_matrix: tender.compliance_matrix,
  risk_level: tender.risk_level,
  competition_level: tender.competition_level,
})}

Return JSON with ALL these fields:
{
  "verdict": "APPLY" | "MAYBE" | "SKIP",
  "score": 1-10,
  "win_probability_pct": number 0-100,
  "score_label": "Strong Match / Moderate Match / Poor Match",
  "verdict_emoji": "✅" | "⚠️" | "❌",
  "verdict_reason": "1-2 line main reason in clear English",
  "eligibility_status": "Eligible" | "Partially Eligible" | "Not Eligible",
  "eligibility_explanation": "why in 1 line",
  "strengths": ["2-4 things in company's favour"],
  "gaps": ["2-4 things missing or at risk"],
  "action_items": ["3-5 specific things company must do"],
  "estimated_win_chance": "e.g. 35% - if you price correctly",
  "pricing_advice": "specific price range or strategy for this company",
  "aggressive_price": "e.g. bid 12% below estimate",
  "safe_price": "e.g. bid 6% below estimate",
  "time_warning": "is there enough time?",
  "msme_benefit": "specific MSME advantage if any",
  "location_match": "Good / Partial / Poor",
  "compliance_matrix": [
    {"requirement": "GST Registration", "company_status": "YES" | "NO" | "CHECK", "proof": "GST certificate", "critical": true},
    ... (6-8 key requirements)
  ],
  "document_categories": {
    "legal": [{"doc": "GST Certificate", "status": "have" | "need" | "check"}],
    "financial": [{"doc": "ITR last 3 years", "status": "have" | "need" | "check"}],
    "technical": [{"doc": "Experience certificates", "status": "have" | "need" | "check"}],
    "compliance": [{"doc": "Self-declaration form", "status": "have" | "need" | "check"}]
  },
  "quick_checklist": [
    {"item": "GST Certificate", "status": "have" | "need" | "check"},
    ... (6-8 items)
  ],
  "risk_assessment": {
    "overall": "Low" | "Medium" | "High",
    "financial": "...",
    "operational": "...",
    "compliance": "..."
  },
  "timeline_plan": [
    {"day": "Day 1-2", "task": "Gather all legal documents"},
    {"day": "Day 3-4", "task": "Prepare financial package"},
    ... (5-6 entries based on days_remaining)
  ],
  "negotiation_approach": "1-line tip if applicable",
  "execution_strategy": "2-line specific execution advice"
}`,
      }],
    });

    const raw   = res.content[0]?.text?.trim() || "";
    const start = raw.indexOf("{");
    const end   = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return Response.json({ error: "AI parse failed" }, { status: 500 });
    }

    return Response.json({
      success: true,
      analysis: JSON.parse(raw.slice(start, end + 1)),
    });

  } catch (err) {
    console.error("[should-i-apply]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
