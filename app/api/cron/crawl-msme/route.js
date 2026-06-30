/**
 * MSME / Udyam Bulk Crawler
 *
 * Runs at 2:00 AM UTC daily — after Zaubacorp (1:30 AM) completes.
 *
 * WHY: Apollo doesn't have Udyam data. 6.5 crore MSMEs are registered —
 * most are small manufacturers, traders, service providers who are
 * actively running businesses and need vendors, software, marketing.
 *
 * Strategy:
 *   - Rotating 2 states/day × 3 niches × SERP + directory crawl
 *   - Each run: ~100-150 MSME leads with enterprise type, NIC code, state
 *   - Merge with existing lead_database — fill gaps if company already there
 *
 * GET /api/cron/crawl-msme
 * Requires: x-vercel-cron: 1  OR  Authorization: Bearer CRON_SECRET
 */

import { NextResponse }              from "next/server";
import { getAdminDb, firebaseAdmin } from "@/lib/firebaseAdmin";
import { crawlMSMEDirectory, searchMSMEs, stateCode } from "@/lib/apis/msmeApi";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

const ALL_STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Gujarat", "Tamil Nadu",
  "Uttar Pradesh", "West Bengal", "Telangana", "Rajasthan", "Haryana",
  "Punjab", "Kerala", "Madhya Pradesh", "Andhra Pradesh",
];

const MSME_NICHES = [
  "textile manufacturer", "food processing", "engineering components",
  "chemical manufacturer", "plastic products", "packaging manufacturer",
  "pharma manufacturer", "auto parts", "garment manufacturer",
  "IT services", "printing press", "hardware store", "electrical goods",
  "construction materials", "furniture manufacturer", "handicrafts",
  "ayurvedic products", "agricultural equipment", "cold storage",
  "logistics transport",
];

function getTodayStateIndices() {
  const day = Math.floor(Date.now() / 86400000);
  const i1 = day % ALL_STATES.length;
  const i2 = (i1 + 1) % ALL_STATES.length;
  return [i1, i2];
}

function getTodayNicheIndices() {
  const day = Math.floor(Date.now() / 86400000);
  const i1 = day % MSME_NICHES.length;
  const i2 = (i1 + 1) % MSME_NICHES.length;
  const i3 = (i1 + 2) % MSME_NICHES.length;
  return [i1, i2, i3];
}

// ── Save leads to Firestore with deduplication ────────────────────────────────
async function saveBatch(db, leads) {
  if (leads.length === 0) return 0;
  const col = db.collection("lead_database");

  const docIds = leads.map(l => {
    const key = `${(l.businessName || "").toLowerCase().replace(/\s+/g, "").slice(0, 40)}_${(l.state || "").toLowerCase().slice(0, 8)}_msme`;
    return Buffer.from(key).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 50);
  });

  const existingDocs = await Promise.all(docIds.map(id => col.doc(id).get()));

  let saved    = 0;
  let batchOps = 0;
  let batch    = db.batch();

  for (let i = 0; i < leads.length; i++) {
    const lead    = leads[i];
    const docId   = docIds[i];
    const docSnap = existingDocs[i];

    if (docSnap.exists) {
      // Fill gaps only — never overwrite existing data
      const existing = docSnap.data();
      const updates  = {};
      if (!existing.phone && lead.phone)           updates.phone = lead.phone;
      if (!existing.email && lead.email)           updates.email = lead.email;
      if (!existing.enterpriseType && lead.enterpriseType) updates.enterpriseType = lead.enterpriseType;
      if (!existing.udyamNo && lead.udyamNo)       updates.udyamNo = lead.udyamNo;
      if (!existing.majorActivity && lead.majorActivity) updates.majorActivity = lead.majorActivity;
      if (Object.keys(updates).length > 0) {
        updates.lastUpdated = Date.now();
        batch.update(col.doc(docId), updates);
        batchOps++;
      }
      continue;
    }

    batch.set(col.doc(docId), {
      ...lead,
      businessName:    lead.businessName || "",
      state:           lead.state || "",
      city:            lead.city || "",
      industry:        lead.industry || lead.niche || "",
      phone:           lead.phone || "",
      email:           lead.email || "",
      website:         lead.website || "",
      udyamNo:         lead.udyamNo || "",
      enterpriseType:  lead.enterpriseType || "",
      majorActivity:   lead.majorActivity || "",
      source:          "msme_udyam",
      type:            "msme",
      tags:            lead.tags || ["msme"],
      collectedAt:     Date.now(),
      lastUpdated:     Date.now(),
    });
    saved++;
    batchOps++;

    if (batchOps >= 400) {
      await batch.commit();
      batch    = db.batch();
      batchOps = 0;
    }
  }

  if (batchOps > 0) await batch.commit();
  return saved;
}

// ── Auth check ────────────────────────────────────────────────────────────────
function isAuthorized(req) {
  if (req.headers.get("x-vercel-cron") === "1") return true;
  const auth = req.headers.get("authorization") || "";
  return CRON_SECRET && auth === `Bearer ${CRON_SECRET}`;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime  = Date.now();
  const stateIdxs  = getTodayStateIndices();
  const nicheIdxs  = getTodayNicheIndices();
  const runStates  = stateIdxs.map(i => ALL_STATES[i]);
  const runNiches  = nicheIdxs.map(i => MSME_NICHES[i]);

  const db      = getAdminDb();
  const logRef  = db.collection("cron_logs").doc(`crawl-msme-${Date.now()}`);

  let totalSaved = 0;
  let totalFound = 0;
  const errors   = [];

  await logRef.set({ status: "running", startedAt: Date.now(), states: runStates, niches: runNiches });

  for (const state of runStates) {
    for (const niche of runNiches) {
      try {
        // SERP-based discovery
        const leads = await searchMSMEs({ niche, state, maxResults: 20 });
        totalFound += leads.length;

        // Directory crawl (page 1)
        const dirLeads = await crawlMSMEDirectory({ state, niche, page: 1 });
        totalFound += dirLeads.length;

        const allLeads = [...leads, ...dirLeads];
        const saved    = await saveBatch(db, allLeads);
        totalSaved    += saved;

      } catch (err) {
        errors.push({ state, niche, error: err.message });
      }
    }
  }

  const duration = Math.round((Date.now() - startTime) / 1000);
  const result   = {
    status:      "done",
    states:      runStates,
    niches:      runNiches,
    totalFound,
    totalSaved,
    errors:      errors.length,
    durationSec: duration,
    completedAt: Date.now(),
  };

  await logRef.update(result);

  return NextResponse.json(result);
}
