import { getAIClient } from "@/lib/aiClient";
import { jinaFetch } from "@/lib/scraperUtils";
export const maxDuration = 60;

const anthropic = getAIClient();

/* ── Fetch page via DataForSEO On-Page (JS render) → Jina fallback ─── */
async function fetchPage(url) {
  const login = process.env.DATAFORSEO_LOGIN;
  const pass  = process.env.DATAFORSEO_PASSWORD;
  if (login && pass) {
    try {
      const auth = Buffer.from(`${login}:${pass}`).toString("base64");
      const res  = await fetch("https://api.dataforseo.com/v3/on_page/raw_html/live", {
        method:  "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body:    JSON.stringify([{ url, enable_javascript: true }]),
        signal:  AbortSignal.timeout(30000),
      });
      if (res.ok) {
        const data = await res.json();
        const html = data.tasks?.[0]?.result?.[0]?.raw_html || "";
        if (html.length > 500) return html;
      }
    } catch { /* fall through */ }
  }
  const content = await jinaFetch(url, 25000);
  if (!content) throw new Error("Page fetch failed — DataForSEO and Jina both unavailable");
  return content;
}

/* ── Extract deep tender intelligence from HTML ─────────────────────── */
async function extractDeepDetails(html, tender) {
  /* Truncate to 12k chars so it fits in context */
  const truncated = html.slice(0, 12000);

  const res = await anthropic.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 1200,
    system:     "You are a GeM/government tender analyst. Extract ALL information from the HTML page. Return ONLY valid JSON, no markdown.",
    messages: [{
      role:    "user",
      content: `Extract complete tender intelligence from this page HTML. Return JSON with these fields (use "N/A" if not found):

{
  "scope_of_work": "detailed description of what work/supply is required",
  "technical_specifications": "key specs, standards, make/model requirements",
  "quantity": "exact quantity and unit",
  "delivery_location": "delivery address or state/city",
  "delivery_timeline": "days after order / specific date",
  "eligibility_criteria": "who can apply - turnover, experience, registration",
  "min_turnover_required": "e.g. ₹10 Lakh or N/A",
  "min_experience_required": "e.g. 3 years or N/A",
  "required_certifications": ["GST", "MSME", ...],
  "emd_amount": "EMD amount if mentioned",
  "security_deposit": "SD percentage or amount",
  "payment_terms": "advance / credit period",
  "penalty_clauses": "penalty for delay or non-compliance",
  "bid_type": "Open / Limited / BOQ / RA (Reverse Auction)",
  "evaluation_criteria": "L1 / QCBS / Technical + Financial",
  "previous_buyer_orders": "any info about past orders from this buyer",
  "buyer_name": "exact buyer/department name",
  "bid_start_date": "DD/MM/YYYY",
  "bid_end_date": "DD/MM/YYYY",
  "estimated_value": "government's estimated value",
  "consignee_location": "delivery state/city",
  "mse_exemption": "yes/no - whether MSE/MSME are exempt from EMD",
  "startup_exemption": "yes/no - whether startups are exempt",
  "splitting_allowed": "yes/no - partial bid allowed",
  "documents_required": ["list of documents needed for bid submission"]
}

Tender context (for reference): ${JSON.stringify({ title: tender.title, organization: tender.organization, sector: tender.sector, value: tender.value })}

HTML:
${truncated}`,
    }],
  });

  const raw   = res.content[0]?.text?.trim() || "";
  const start = raw.indexOf("{");
  const end   = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  return JSON.parse(raw.slice(start, end + 1));
}

/* ── Build buyer intelligence from available data ───────────────────── */
async function buildBuyerIntelligence(tender, deepDetails) {
  const res = await anthropic.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system:     "GeM tender analyst. Return ONLY valid JSON.",
    messages: [{
      role:    "user",
      content: `Based on this tender data, analyse buyer behavior and return JSON:

{
  "buyer_reputation": "Good / Average / Unknown",
  "payment_speed": "Fast (within 30 days) / Normal (30-60 days) / Slow / Unknown",
  "is_repeat_buyer": "Yes / No / Likely",
  "buying_pattern": "brief note about what they typically buy",
  "preferred_vendor_profile": "what kind of vendors they typically select",
  "l1_price_estimate": "₹X - ₹Y (estimated range based on tender value and market rates)",
  "competition_level": "Low / Medium / High",
  "estimated_bidders": "5-10 / 10-20 / 20+ / Unknown",
  "typical_l1_discount": "how much below estimate L1 usually is, e.g. 10-15% below estimate",
  "pricing_strategy": "specific 2-3 line advice on how to price this bid to win",
  "red_flags": ["list any warning signs in this tender"],
  "hidden_conditions": ["any conditions that are easy to miss"],
  "pro_tips": ["2-3 actionable insider tips to win this specific tender"]
}

Tender: ${JSON.stringify({ ...tender, ...(deepDetails || {}) })}`,
    }],
  });

  const raw   = res.content[0]?.text?.trim() || "";
  const start = raw.indexOf("{");
  const end   = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return {};
  return JSON.parse(raw.slice(start, end + 1));
}

/* ── POST handler ────────────────────────────────────────────────────── */
export async function POST(request) {
  try {
    const { tender } = await request.json();
    if (!tender) return Response.json({ error: "tender required" }, { status: 400 });

    const results = { tender_id: tender.tender_id, title: tender.title };
    let deepDetails = null;

    /* ── Try to fetch the actual bid page ──────────────────────────── */
    if (tender.direct_link && tender.direct_link !== "N/A") {
      try {
        const html = await fetchPage(tender.direct_link);
        deepDetails = await extractDeepDetails(html, tender);
        if (deepDetails) Object.assign(results, deepDetails);
      } catch (e) {
        console.warn("[gem-bid-detail] page fetch failed:", e.message);
        /* Continue without page data  still run buyer intelligence */
      }
    }

    /* ── Always run buyer intelligence ─────────────────────────────── */
    const buyerIntel = await buildBuyerIntelligence(tender, deepDetails);
    Object.assign(results, buyerIntel);

    return Response.json({ success: true, details: results });

  } catch (err) {
    console.error("[gem-bid-detail]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
