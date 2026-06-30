import { getAIClient } from "@/lib/aiClient";
export const maxDuration = 60;

const anthropic = getAIClient();

export async function POST(request) {
  try {
    const { tender } = await request.json();
    if (!tender) return Response.json({ error: "No tender data provided" }, { status: 400 });

    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system:     "You are a senior government tender consultant in India. Analyse tenders deeply and return ONLY valid compact JSON  no markdown, no extra text.",
      messages: [{
        role:    "user",
        content: `Perform 14-layer tender intelligence on this tender. Return ONLY valid JSON:

{
  "eligibility_result": "Eligible|Partial|Not Eligible",
  "eligibility_explanation": "1-2 lines explaining why",
  "missing_criteria": ["list missing items or empty array"],
  "compliance_matrix": [
    {"requirement":"...","status":"YES|NO|PARTIAL","proof_required":"document name","risk_level":"Low|Medium|High","critical":false}
  ],
  "risk_overall": "Low|Medium|High",
  "risk_breakdown": {"financial":"...","operational":"...","compliance":"...","penalty":"..."},
  "risk_flags": ["flag1","flag2"],
  "market_price_range": "₹X – ₹Y (infer if not given)",
  "aggressive_bid_price": "₹X",
  "safe_bid_price": "₹X",
  "profit_margin_estimate": "X–Y%",
  "reverse_auction_likely": false,
  "pricing_advice": "2-3 line strategy",
  "competition_level": "Low|Medium|High",
  "estimated_bidder_count": "Low (<5)|Medium (5–15)|High (15+)",
  "competition_type": "Local|National|Big Players|Mixed",
  "entry_difficulty_score": 5,
  "repeat_buyer": false,
  "buyer_preference": "Price|Quality|Balanced",
  "buyer_behavior": "1-2 lines",
  "win_probability_pct": 45,
  "win_probability_explanation": "Why this %",
  "effort_level": "Low|Medium|High",
  "profit_potential": "Low|Medium|High",
  "time_urgency": "Low|Medium|High",
  "final_verdict": "APPLY|SKIP",
  "final_verdict_emoji": "✅",
  "verdict_reason": "clear concise reason (no vague language)",
  "verdict_hinglish": "Plain English business reasoning (concise)",
  "verdict_confidence_pct": 75,
  "execution_plan": [
    {"day":"Day 1","task":"First action to take"},
    {"day":"Day 2-3","task":"Next step"},
    {"day":"Day 4-5","task":"Document preparation"},
    {"day":"Submission Day","task":"Final steps"}
  ],
  "winning_tips": ["tip1","tip2","tip3"],
  "apply_link_type": "GeM Portal|CPPP|Direct Portal|Login Required|Offline",
  "apply_special_step": "Any special step like RA, verification, offline submission or N/A"
}

Rules: Be decisive. Infer intelligently when data is missing. Think like a bidder trying to WIN. Compliance matrix should have 4–6 rows for key requirements. Keep execution_plan to 4–5 steps.

Tender: ${JSON.stringify(tender)}`,
      }],
    });

    const raw   = res.content[0]?.text?.trim() || "";
    const start = raw.indexOf("{");
    const end   = raw.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("AI returned invalid response");

    const analysis = JSON.parse(raw.slice(start, end + 1));
    return Response.json({ success: true, analysis });
  } catch (err) {
    console.error("[tender-intelligence]", err);
    return Response.json({ error: err.message || "Analysis failed" }, { status: 500 });
  }
}
