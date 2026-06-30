/**
 * MCA Bulk Collection Cron — Apollo-like India company database builder
 *
 * Sources:
 *   - Zaubacorp (MCA registered companies + CIN + director)
 *   - Tofler (incorporation dates + company details)
 *   - GST search (GSTIN for fresh businesses)
 *   - IndiaFilings / VakilSearch (company contact info)
 *
 * Runs daily at 1 AM UTC (6:30 AM IST)
 * Rotates 2 states × 3 business types per run to stay within 5-min limit
 */

import { NextResponse }  from "next/server";
import { getAdminDb }    from "@/lib/firebaseAdmin";
import { serperSearch }  from "@/lib/scraperUtils";

export const maxDuration = 300; // 5 minutes

const CRON_SECRET = process.env.CRON_SECRET;

const ALL_STATES = [
  { name: "Maharashtra",      code: "MH" },
  { name: "Delhi",            code: "DL" },
  { name: "Karnataka",        code: "KA" },
  { name: "Gujarat",          code: "GJ" },
  { name: "Tamil Nadu",       code: "TN" },
  { name: "Uttar Pradesh",    code: "UP" },
  { name: "West Bengal",      code: "WB" },
  { name: "Telangana",        code: "TS" },
  { name: "Andhra Pradesh",   code: "AP" },
  { name: "Rajasthan",        code: "RJ" },
  { name: "Haryana",          code: "HR" },
  { name: "Punjab",           code: "PB" },
  { name: "Kerala",           code: "KL" },
  { name: "Madhya Pradesh",   code: "MP" },
];

const BUSINESS_TYPES = [
  "technology", "digital marketing", "ecommerce", "manufacturing",
  "consulting", "healthcare", "trading", "real estate", "education",
  "finance", "logistics", "pharma", "food processing", "textile", "exports",
];

// ── Parse company data from search snippets ───────────────────────────────────
function parseFromSnippets(items, state) {
  const companies = [];
  for (const item of items) {
    const text = `${item.title} ${item.snippet}`;

    // CIN number — official MCA format
    const cinM    = text.match(/[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/);
    const cin     = cinM?.[0] || "";

    // GSTIN — 15-char GST number
    const gstM    = text.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]\b/);
    const gstNumber = gstM?.[0] || "";

    // Company name — strip site names from title
    let name = item.title
      .replace(/\s*[-–|]\s*(Zaubacorp|Tofler|IndiaFilings|VakilSearch|Indiamart|MCA|MCA21).*/i, "")
      .replace(/\s*[-–]\s*Company.*$/i, "")
      .replace(/CIN\s*:.*/i, "")
      .replace(/\s*(Private Limited|Pvt\.?\s*Ltd\.?|LLP|OPC)\s*$/i, s => s) // keep suffix
      .trim();

    // Incorporation date (various formats)
    const dateM   = text.match(/(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}-\d{2}-\d{2})/);
    const incDate = dateM?.[0] || "";

    // Director / founder name
    const dirM    = text.match(/(?:Director|Founder|Promoter|DIN)[:\s]+([A-Z][A-Za-z\s]{5,50})(?:\s|,|$)/);
    const director = dirM?.[1]?.trim() || "";

    // DIN number (Director Identification Number)
    const dinM    = text.match(/DIN[:\s]*([0-9]{8})/i);
    const din     = dinM?.[1] || "";

    // Email
    const emailM  = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email   = emailM?.[0] || "";

    // Phone (Indian format)
    const phoneM  = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
    const phone   = phoneM?.[0]?.replace(/[\s-]/g, "") || "";

    // Website from source or snippet
    const webM    = (item.snippet || "").match(/https?:\/\/(?!zaubacorp|tofler)[^\s"<>]+\.[a-z]{2,}/i);
    const website = webM?.[0]?.replace(/[.,>]+$/, "") || "";

    // Industry from business type context in snippet
    const industryM = text.match(/(?:engaged in|deals in|specializes in|industry[:\s]+)([A-Za-z\s&,]{10,60})/i);
    const industry  = industryM?.[1]?.trim().slice(0, 80) || "";

    if (name && name.length > 3) {
      companies.push({ name, cin, gstNumber, incDate, director, din, email, phone, website, industry, state });
    }
  }
  // Dedup by name within this batch
  const seen = new Set();
  return companies.filter(c => { const k = c.name.toLowerCase().slice(0, 30); if (seen.has(k)) return false; seen.add(k); return true; });
}

const STATE_MAP = { MH:"Maharashtra",DL:"Delhi",KA:"Karnataka",GJ:"Gujarat",TN:"Tamil Nadu",UP:"Uttar Pradesh",WB:"West Bengal",TS:"Telangana",AP:"Andhra Pradesh",RJ:"Rajasthan",HR:"Haryana",PB:"Punjab",KL:"Kerala",MP:"Madhya Pradesh" };

// ── Save companies to Firestore database ─────────────────────────────────────
async function saveToDatabase(db, companies) {
  if (companies.length === 0) return 0;
  const col = db.collection("lead_database");

  // Pre-compute docIds and filter invalid entries
  const entries = companies
    .filter(c => c.name && c.name.length >= 4)
    .map(c => {
      const key   = `${c.name.toLowerCase().replace(/\s+/g,"").slice(0,40)}_${(c.state||"").toLowerCase().slice(0,10)}`;
      const docId = Buffer.from(key).toString("base64").replace(/[^a-zA-Z0-9]/g,"").slice(0, 50);
      const stateCode = c.cin ? c.cin.slice(7,9) : "";
      return { c, docId, stateName: c.state || STATE_MAP[stateCode] || "" };
    });

  if (entries.length === 0) return 0;

  // Parallel existence checks instead of serial awaits in loop
  const existingDocs = await Promise.all(entries.map(({ docId }) => col.doc(docId).get()));

  // Build batches — Firestore limit is 500 ops per batch, use 400 for safety
  let saved    = 0;
  let batchOps = 0;
  let batch    = db.batch();

  for (let i = 0; i < entries.length; i++) {
    if (existingDocs[i].exists) continue;
    const { c, docId, stateName } = entries[i];

    const tags = ["mca", "fresh"];
    if (c.gstNumber) tags.push("gst_verified");
    if (c.din)       tags.push("din_available");

    batch.set(col.doc(docId), {
      id:               docId,
      businessName:     c.name,
      cin:              c.cin        || "",
      gstNumber:        c.gstNumber  || "",
      din:              c.din        || "",
      state:            stateName,
      city:             "",
      industry:         c.industry   || "company",
      phone:            c.phone      || "",
      email:            c.email      || "",
      emailVerified:    false,
      emailConfidence:  0,
      website:          c.website    || "",
      linkedinUrl:      "",
      contactPerson:    c.director   || "",
      contactTitle:     "Director",
      incorporationDate: c.incDate   || "",
      companyType:      "Private Limited",
      source:           "mca_bulk_cron",
      type:             "company",
      tags,
      collectedAt:      Date.now(),
      lastUpdated:      Date.now(),
      collectedBy:      "cron",
    });
    saved++;
    batchOps++;

    // Commit and create FRESH batch — committed batch cannot receive new ops
    if (batchOps === 400) {
      await batch.commit();
      batch    = db.batch();
      batchOps = 0;
    }
  }

  if (batchOps > 0) await batch.commit();
  return saved;
}

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  const isVercel   = req.headers.get("x-vercel-cron") === "1";
  if (!isVercel && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db          = getAdminDb();
  const year        = new Date().getFullYear();
  let   totalSaved  = 0;
  const log         = [];

  // Rotate states: 2 per day, full cycle every 7 days
  const dayOfMonth = new Date().getDate();
  const stateSlice = ALL_STATES.slice((dayOfMonth % 7) * 2, (dayOfMonth % 7) * 2 + 2);

  for (const state of stateSlice) {
    // 4 business types per state per run (up from 3)
    for (const biz of BUSINESS_TYPES.slice(0, 4)) {
      try {
        // Multi-source queries: Zaubacorp + Tofler + GST + IndiaFilings + VakilSearch
        const queries = [
          // Source 1: Zaubacorp — CIN + director data
          `site:zaubacorp.com "${state.name}" "${biz}" "Private Limited" ${year}`,
          // Source 2: Tofler — incorporation details
          `site:tofler.in "${state.name}" "${biz}" incorporated ${year}`,
          // Source 3: GST search — GSTIN + contact info
          `"${biz}" "${state.name}" GSTIN OR "GST number" "Private Limited" ${year} site:gstsearch.in OR site:mastergst.com`,
          // Source 4: IndiaFilings / VakilSearch — often has email/phone
          `"${biz}" "${state.name}" "Private Limited" registered ${year} contact site:indiafilings.com OR site:vakilsearch.com`,
          // Source 5: General web — catches press releases, news, directories
          `"${biz}" company "${state.name}" incorporated ${year} director "Private Limited" email OR phone`,
        ];

        const allItems = [];
        for (const q of queries) {
          const results = await serperSearch(q, "in", 10);
          allItems.push(...results);
          await new Promise(r => setTimeout(r, 250)); // rate limit
        }

        const companies = parseFromSnippets(allItems, state.name);
        const saved     = await saveToDatabase(db, companies);
        totalSaved += saved;
        log.push({ state: state.name, biz, found: companies.length, saved });
      } catch (err) {
        log.push({ state: state.name, biz, error: err.message });
      }
    }
  }

  // Update cron run log
  await db.collection("cron_logs").add({
    job:        "collect-mca-bulk",
    totalSaved,
    statesProcessed: stateSlice.map(s => s.name),
    runAt:      Date.now(),
    log,
  });

  return NextResponse.json({ success: true, totalSaved, statesProcessed: stateSlice.map(s => s.name), log });
}
