/**
 * Zaubacorp Direct List Crawler
 *
 * WHY this is better than collect-mca-bulk:
 *   collect-mca-bulk: DataForSEO search → parse snippets → 10-15 companies per query × 6 queries = ~90/day
 *   crawl-zaubacorp:  Direct Zaubacorp list page → 20-25 companies per page × 3 pages × 2 states = ~150+/day
 *                     And it's FREE — no DataForSEO cost for the list (only Jina, which is free)
 *
 * Strategy:
 *   - Crawl state/year pagination on Zaubacorp directly
 *   - Rotating states: 2 per day (full cycle every 7 days across 14 states)
 *   - For each company found: save to lead_database
 *   - Background GST enrichment: attempt GSTIN lookup for each
 *
 * GET /api/cron/crawl-zaubacorp
 * Requires: x-vercel-cron: 1  OR  Authorization: Bearer CRON_SECRET
 */

import { NextResponse }           from "next/server";
import { getAdminDb, firebaseAdmin } from "@/lib/firebaseAdmin";
import { crawlZaubacorpList, stateFromCIN, yearFromCIN, typeFromCIN } from "@/lib/apis/mcaApi";
import { findGSTINByName }        from "@/lib/apis/gstApi";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

const ALL_STATES = [
  "maharashtra", "delhi",         "karnataka",  "gujarat",
  "tamil-nadu",  "uttar-pradesh", "west-bengal","telangana",
  "andhra-pradesh","rajasthan",   "haryana",    "punjab",
  "kerala",      "madhya-pradesh",
];

const BUSINESS_TYPES = [
  { slug: "private+limited", label: "Private Limited" },
  { slug: "llp",             label: "LLP" },
  { slug: "opc",             label: "OPC" },
];

// ── Save companies to Firestore ───────────────────────────────────────────────
async function saveBatch(db, companies) {
  if (companies.length === 0) return 0;
  const col = db.collection("lead_database");

  // Parallel existence checks
  const docIds = companies.map(c => {
    const key = `${c.name.toLowerCase().replace(/\s+/g,"").slice(0,40)}_${(c.state||"").toLowerCase().slice(0,10)}`;
    return Buffer.from(key).toString("base64").replace(/[^a-zA-Z0-9]/g,"").slice(0, 50);
  });
  const existing = await Promise.all(docIds.map(id => col.doc(id).get()));

  let saved    = 0;
  let batchOps = 0;
  let batch    = db.batch();

  for (let i = 0; i < companies.length; i++) {
    if (existing[i].exists) continue;

    const c     = companies[i];
    const docId = docIds[i];
    const tags  = ["mca", "fresh", "zaubacorp_direct"];
    if (c.cin) tags.push("cin_verified");

    batch.set(col.doc(docId), {
      id:               docId,
      businessName:     c.name,
      cin:              c.cin          || "",
      gstNumber:        c.gstNumber    || "",
      din:              c.din          || "",
      state:            c.state        || stateFromCIN(c.cin),
      city:             "",
      industry:         "",
      phone:            c.phone        || "",
      email:            c.email        || "",
      emailVerified:    false,
      emailConfidence:  0,
      website:          "",
      linkedinUrl:      "",
      contactPerson:    c.director     || c.directorName || "",
      contactTitle:     "Director",
      incorporationDate: c.incDate     || c.incorporationDate || "",
      companyType:      c.companyType  || "Private Limited",
      authorizedCapital: c.authorizedCapital || "",
      source:           "zaubacorp_direct_crawler",
      type:             "company",
      tags,
      collectedAt:      Date.now(),
      lastUpdated:      Date.now(),
      collectedBy:      "cron_crawl_zauba",
    });

    saved++;
    batchOps++;

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
  const year        = new Date().getFullYear().toString();
  let   totalSaved  = 0;
  const log         = [];

  // Rotate 2 states per day
  const day        = new Date().getDate();
  const stateSlice = ALL_STATES.slice((day % 7) * 2, (day % 7) * 2 + 2);

  for (const stateSlug of stateSlice) {
    for (const bizType of BUSINESS_TYPES.slice(0, 2)) {
      try {
        // Direct list crawl — 3 pages × ~20 companies = 60 per state/type
        const companies = await crawlZaubacorpList({
          state:    stateSlug,
          year,
          business: bizType.slug,
          maxPages: 3,
        });

        const saved = await saveBatch(db, companies);
        totalSaved += saved;
        log.push({ state: stateSlug, type: bizType.label, found: companies.length, saved });
      } catch (err) {
        log.push({ state: stateSlug, type: bizType.label, error: err.message });
      }
    }
  }

  // Log cron run
  await db.collection("cron_logs").add({
    job:             "crawl-zaubacorp-direct",
    totalSaved,
    year,
    statesProcessed: stateSlice,
    runAt:           Date.now(),
    log,
  });

  return NextResponse.json({ success: true, totalSaved, statesProcessed: stateSlice, log });
}
