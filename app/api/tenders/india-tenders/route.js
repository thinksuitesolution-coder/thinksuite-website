import { getAIClient } from "@/lib/aiClient";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const maxDuration = 90;

const anthropic = getAIClient();

/* ── Fuzzy sector matching ────────────────────────────────────────────────
   DB may store "IT/Software", "Construction", "Medical" etc.
   Frontend sends "IT Software Technology", "Construction Civil Works" etc.
   Fix: check if ANY keyword (>2 chars) from the filter appears in DB value,
   or if the DB value appears in the filter string.
──────────────────────────────────────────────────────────────────────── */
function sectorMatches(dbSector, filterSector) {
  if (!filterSector || filterSector === "all") return true;
  if (!dbSector) return false;
  const db  = dbSector.toLowerCase().replace(/[/,\-_]/g, " ");
  const fil = filterSector.toLowerCase().replace(/[/,\-_]/g, " ");
  if (db.includes(fil) || fil.includes(db)) return true;
  const words = fil.split(/\s+/).filter(w => w.length > 2);
  return words.some(w => db.includes(w));
}

function tenderTypeMatches(tender, tenderType) {
  if (!tenderType || tenderType === "all") return true;
  const type = String(tenderType).toLowerCase();
  const haystack = [
    tender.title,
    tender.description,
    tender.scope,
    tender.sector,
    tender.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const keywordMap = {
    goods: ["supply", "supply of", "procurement", "purchase", "equipment", "item", "material", "goods", "lights", "solar light", "solar lights"],
    works: ["construction", "repair", "installation", "erection", "civil", "road", "building", "work", "works"],
    services: ["service", "services", "maintenance", "amc", "operation", "manpower", "consultant", "software", "development", "support"],
    consultancy: ["consultancy", "consultant", "advisory", "survey", "design", "dpr", "audit", "feasibility"],
  };

  return (keywordMap[type] || []).some(keyword => haystack.includes(keyword));
}

/* ── State matching ───────────────────────────────────────────────────────
   Frontend sends "Maharashtra", "Uttar Pradesh" etc.
   DB may store state_city as "Mumbai" (no state), "Mumbai, Maharashtra", or
   source_portal as "Maharashtra", "UP", "TamilNadu" etc.
──────────────────────────────────────────────────────────────────────── */
const STATE_PORTAL_MAP = {
  "uttar pradesh":      ["up", "uttarpradesh"],
  "tamil nadu":         ["tn", "tamilnadu"],
  "west bengal":        ["wb", "westbengal"],
  "madhya pradesh":     ["mp", "madhyapradesh"],
  "himachal pradesh":   ["hp", "himachalpradesh"],
  "jammu & kashmir":    ["jk", "jammukashmir", "j&k"],
  "andhra pradesh":     ["ap", "andhrapradesh"],
  "arunachal pradesh":  ["ar", "arunachalpradesh"],
};

function stateMatches(tender, stateFilter) {
  if (!stateFilter) return true;
  const sf      = stateFilter.toLowerCase();
  const sc      = (tender.state_city   || "").toLowerCase();
  const portal  = (tender.source_portal || "").toLowerCase().replace(/\s+/g, "");
  const sfNoSp  = sf.replace(/\s+/g, "");

  if (sc.includes(sf) || portal.includes(sfNoSp)) return true;

  // Handle abbreviated portal names (e.g. "UP" matches "Uttar Pradesh")
  const aliases = STATE_PORTAL_MAP[sf] || [];
  if (aliases.some(a => portal.includes(a))) return true;

  // Reverse: if filter is an alias, match the full state name
  for (const [full, abbrs] of Object.entries(STATE_PORTAL_MAP)) {
    if (abbrs.includes(sfNoSp)) {
      const fullNoSp = full.replace(/\s+/g, "");
      if (sc.includes(full) || portal.includes(fullNoSp)) return true;
    }
  }
  return false;
}

/* ── AI enrichment ───────────────────────────────────────────────────── */
async function enrichWithThinksuite(tender) {
  try {
    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system:     "Indian government tender analyst. Return ONLY valid compact JSON, no markdown.",
      messages: [{
        role:    "user",
        content: `Analyse this tender. Return JSON with these fields only:
- ai_summary_english: 2-line plain English summary
- ai_summary_hinglish: same summary in simple, plain English (concise)
- who_can_apply: who can apply (1 line)
- eligibility_status: "Eligible for most SMEs"|"Partially Eligible"|"High barrier"
- min_turnover_required: e.g. "₹10 Lakh" or "Not specified"
- required_certifications: array e.g. ["GST","MSME"]
- should_apply_score: 1-10
- win_probability: e.g. "35% - medium competition"
- difficulty_level: Easy|Medium|Hard
- risk_level: Low|Medium|High
- red_flags: array of warning signs (empty if none)
- strategy_advice: Yes/Maybe/Skip + 1-line reason
- bid_tips: 2-3 winning tips as single string
- application_steps: JSON array of 5 steps. Step 1 MUST be: "Open the tender portal: [use direct_link if it is a real tender URL, else use portal_registration_link from the tender data]. Search for this tender by Tender ID or title." Step 2: "Register/login as vendor on the portal." Step 3: "Download the tender document and read all terms carefully." Step 4: "Arrange all required documents (GST, PAN, EMD, experience certificates)." Step 5: "Submit your bid online before the deadline."

Tender: ${JSON.stringify(tender)}`,
      }],
    });

    const raw   = res.content[0]?.text?.trim() || "";
    const start = raw.indexOf("{");
    const end   = raw.lastIndexOf("}");
    if (start === -1 || end === -1) return tender;
    return { ...tender, ...JSON.parse(raw.slice(start, end + 1)) };
  } catch {
    return tender;
  }
}

async function enrichAll(tenders, concurrency = 5) {
  const results = [];
  for (let i = 0; i < tenders.length; i += concurrency) {
    const batch = await Promise.all(
      tenders.slice(i, i + concurrency).map(t => enrichWithThinksuite(t))
    );
    results.push(...batch);
  }
  return results;
}

/* ── Semantic keyword expansion  "solar lights" → ["solar","led","luminaire",...] ── */
async function expandKeywords(userQuery) {
  try {
    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system:     "You expand a user's business/product description into related search keywords for Indian government tender matching. Return ONLY a JSON array of lowercase strings.",
      messages: [{
        role:    "user",
        content: `Expand to 12-18 related terms/synonyms for government tender keyword search.
User input: "${userQuery}"

Include: product names, synonyms, abbreviations, related items, brand-neutral generic terms, Hindi equivalents.
Examples:
- "solar lights" → ["solar","led","luminaire","street light","solar lamp","photovoltaic","solar lantern","solar street light","outdoor lighting","led light","solar panel","renewable","green energy"]
- "CCTV" → ["cctv","surveillance","camera","security","nvr","dvr","video","monitoring","ip camera"]
- "road construction" → ["road","highway","civil","construction","bitumen","asphalt","pavement","culvert","bridge","earthwork"]

Return ONLY a JSON array, no explanation.`,
      }],
    });
    const raw = res.content[0]?.text?.trim() || "[]";
    const s = raw.indexOf("["), e = raw.lastIndexOf("]");
    if (s === -1) return [];
    return JSON.parse(raw.slice(s, e + 1)).map(k => String(k).toLowerCase());
  } catch {
    return [];
  }
}

/* ── AI semantic filter  matches by meaning not just exact words ─────── */
async function aiFilterTenders(tenders, userQuery) {
  if (!userQuery || !userQuery.trim()) return tenders;
  try {
    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system:     "You are a tender matching AI. Match by MEANING and SEMANTIC SIMILARITY, not just exact keywords. Return ONLY a JSON array of indices.",
      messages: [{
        role:    "user",
        content: `User's business/requirement: "${userQuery}"

Match tenders SEMANTICALLY  if user says "solar lights", also match:
- LED Luminaire, Street Lighting, Solar Lamp, Photovoltaic Light, Outdoor LED, Solar Street Light
- Any tender for supply/installation of lighting products

Match by INTENT:
- Understand what product/service the user provides
- Match ANY tender that could be fulfilled by this supplier
- Include related/adjacent products if in same category
- A "solar lights" supplier can also bid for: LED lights, solar panels, solar equipment

INCLUDE if: same product family, related supply, similar sector work
EXCLUDE only if: completely unrelated sector (e.g. construction tender for IT company)

Return a JSON array of indices (0-based), most relevant first. Be INCLUSIVE not exclusive.

Tenders:
${tenders.map((t, i) => `${i}: ${t.title} | Sector: ${t.sector || "N/A"} | Org: ${t.organization || ""}`).join("\n")}`,
      }],
    });
    const raw   = res.content[0]?.text?.trim() || "";
    const start = raw.indexOf("[");
    const end   = raw.lastIndexOf("]");
    if (start === -1 || end === -1) return tenders;
    const indices = JSON.parse(raw.slice(start, end + 1));
    if (!Array.isArray(indices) || indices.length === 0) return tenders;
    return indices.map(i => tenders[i]).filter(Boolean);
  } catch {
    return tenders;
  }
}

async function triggerBackgroundScrape() {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXTAUTH_URL || "http://localhost:3000");
    fetch(`${base}/api/cron/scrape-tenders?type=gem`, {
      headers: { "x-cron-secret": process.env.CRON_SECRET || "dev-secret" },
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  } catch {}
}

export async function POST(request) {
  try {
    const {
      aiQuery       = "",   // legacy param name
      customQuery   = "",   // frontend param name
      state         = "",
      sector        = "",
      keywords      = "",
      tenderType    = "all",
      quantity      = 15,
      status_filter = "all",
    } = await request.json();

    const userQuery = customQuery || aiQuery;

    const db = getAdminDb();

    /* ── Step 1: Fetch all open tenders from Firestore ───────────────────── */
    const snap = await db
      .collection("tenders_india")
      .where("status", "in", ["open", "closing_soon", "closing_today", "upcoming", "unknown"])
      .limit(500)
      .get();

    /* ── DB empty check  trigger background scrape ──────────────────────── */
    if (snap.empty) {
      triggerBackgroundScrape();
      return Response.json({
        success:    false,
        refreshing: true,
        error:      "Tender database is currently empty. Fresh data is being fetched from GEM in the background please try again in 2-3 minutes.",
        tenders:    [],
        total:      0,
      });
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);

    let tenders = snap.docs.map(d => {
      const data = d.data();
      // Recalculate days_remaining & status dynamically so stale stored values don't leak expired tenders
      if (data.deadline_timestamp) {
        const dl = data.deadline_timestamp.toDate ? data.deadline_timestamp.toDate() : new Date(data.deadline_timestamp);
        const diff = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
        data.days_remaining = diff;
        if (diff < 0)       data.status = "expired";
        else if (diff === 0) data.status = "closing_today";
        else if (diff <= 7)  data.status = "closing_soon";
        else if (diff <= 30) data.status = "open";
        else                 data.status = "upcoming";
      }
      return data;
    });

    // Drop expired tenders (deadline passed)
    tenders = tenders.filter(t => t.status !== "expired");

    // Drop "unknown" tenders scraped more than 30 days ago (no parseable deadline)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    tenders = tenders.filter(t => {
      if (t.status !== "unknown") return true;
      const scraped = t.scraped_at?.toDate ? t.scraped_at.toDate() : (t.scraped_at ? new Date(t.scraped_at) : null);
      return !scraped || scraped > thirtyDaysAgo;
    });

    tenders.sort((a, b) => {
      const da = typeof a.days_remaining === "number" ? a.days_remaining : 9999;
      const db2 = typeof b.days_remaining === "number" ? b.days_remaining : 9999;
      if (da >= 0 && db2 >= 0) return da - db2;
      if (da >= 0) return -1;
      if (db2 >= 0) return 1;
      return 0;
    });

    /* ── Step 2: State & status hard filters ────────────────────────────── */
    if (state) {
      const filtered = tenders.filter(t => stateMatches(t, state));
      if (filtered.length > 0) tenders = filtered;
    }
    if (status_filter !== "all") {
      tenders = tenders.filter(t => t.status === status_filter);
    }
    if (tenderType && tenderType !== "all") {
      const filtered = tenders.filter(t => tenderTypeMatches(t, tenderType));
      if (filtered.length > 0) tenders = filtered;
    }

    /* ── Step 3: Semantic keyword expansion + fuzzy pre-filter ──────────── */
    if (userQuery && userQuery.trim()) {
      // Expand query to related terms ("solar lights" → ["solar","led","luminaire",...])
      const [expandedKws] = await Promise.all([expandKeywords(userQuery)]);

      // Build combined keyword list: explicit keywords + AI-expanded
      const allKws = [
        ...(keywords ? keywords.toLowerCase().split(/\s+/) : []),
        ...expandedKws,
      ].filter(k => k.length > 2);

      if (allKws.length > 0) {
        const semanticMatched = tenders.filter(t => {
          // Check title, description, sector + AI-generated search_keywords stored on tender
          const storedKws = Array.isArray(t.search_keywords) ? t.search_keywords.join(" ") : "";
          const hay = [t.title, t.description, t.sector, t.category, t.organization, storedKws]
            .filter(Boolean).join(" ").toLowerCase();
          return allKws.some(kw => hay.includes(kw));
        });
        // Use semantic matches if any found, else keep all for AI filter
        if (semanticMatched.length > 0) tenders = semanticMatched;
      }
    } else if (keywords) {
      // Plain keyword search when no AI query
      const kw = keywords.toLowerCase();
      const filtered = tenders.filter(t =>
        t.title?.toLowerCase().includes(kw) ||
        t.description?.toLowerCase().includes(kw)
      );
      if (filtered.length > 0) tenders = filtered;
    }

    // Sector soft-filter (only if it doesn't eliminate everything)
    if (sector && sector !== "all" && sector !== "others") {
      const filtered = tenders.filter(t => sectorMatches(t.sector, sector));
      if (filtered.length > 0) tenders = filtered;
    }

    /* ── Step 4: AI semantic filter  re-ranks and removes irrelevant ───── */
    if (userQuery && userQuery.trim()) {
      const aiFiltered = await aiFilterTenders(tenders.slice(0, 80), userQuery);
      tenders = aiFiltered.length > 0 ? aiFiltered : tenders;
    }

    tenders = tenders.slice(0, quantity);

    if (tenders.length === 0) {
      return Response.json({
        success: false,
        error:   "No tenders found. Try loosening your filters or wait for the data to update.",
        tenders: [],
        total:   0,
      });
    }

    /* ── Step 4: Thinksuite enrichment  top 3 only to stay under 60s ───────── */
    const toEnrich = tenders.slice(0, 3);
    const noEnrich = tenders.slice(3);
    const enriched = [...(await enrichAll(toEnrich, 3)), ...noEnrich];

    /* ── Step 5: Summary stats ───────────────────────────────────────────── */
    const urgentCount   = enriched.filter(t => t.status === "closing_soon" || t.status === "closing_today").length;
    const upcomingCount = enriched.filter(t => t.status === "upcoming").length;
    const highestValue  = enriched.reduce((best, t) => {
      const v  = parseFloat(String(t.value  ?? "0").replace(/[^0-9.]/g, "")) || 0;
      const bv = parseFloat(String(best?.value ?? "0").replace(/[^0-9.]/g, "")) || 0;
      return v > bv ? t : best;
    }, null);
    const lastUpdated = enriched.reduce((newest, t) => {
      const ts = t.scraped_at?.toDate?.() || t.scraped_at;
      return ts && (!newest || ts > newest) ? ts : newest;
    }, null);

    return Response.json({
      success:        true,
      tenders:        enriched,
      total:          enriched.length,
      urgent_count:   urgentCount,
      upcoming_count: upcomingCount,
      highest_value:  highestValue ? { title: highestValue.title, value: highestValue.value } : null,
      last_updated:   lastUpdated,
      powered_by:     "Firecrawl AI + Firebase + Thinksuite",
      data_freshness: "Updated every 2 hours",
    });

  } catch (err) {
    console.error("[india-tenders]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
