/**
 * MSME/Udyam On-Demand Search
 * POST /api/database/msme-search
 *
 * Body: { niche, state, city?, page? }
 * Returns: { leads[], total, source: "msme_udyam" }
 *
 * First checks lead_database for cached MSME leads.
 * If insufficient, runs live search + saves results.
 */

import { NextResponse }              from "next/server";
import { getAdminDb, firebaseAdmin } from "@/lib/firebaseAdmin";
import { searchMSMEs }               from "@/lib/apis/msmeApi";

export const maxDuration = 45;

async function getAuthUser(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  try {
    const { getAuth } = await import("firebase-admin/auth");
    return await getAuth().verifyIdToken(token);
  } catch { return null; }
}

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { niche, state, city = "", page = 1 } = await req.json();
  if (!niche || !state) {
    return NextResponse.json({ error: "niche and state are required" }, { status: 400 });
  }

  const db  = getAdminDb();
  const col = db.collection("lead_database");

  // Check cache first — MSME leads already in DB for this state/niche
  let cachedLeads = [];
  try {
    const snap = await col
      .where("source", "==", "msme_udyam")
      .where("state", "==", state)
      .orderBy("collectedAt", "desc")
      .limit(50)
      .get();

    cachedLeads = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(l => {
        const text = `${l.industry} ${l.businessName} ${l.niche || ""}`.toLowerCase();
        return text.includes(niche.toLowerCase()) || !niche;
      });
  } catch {}

  // If cache has enough, return it
  if (cachedLeads.length >= 10) {
    return NextResponse.json({
      leads:  cachedLeads.slice(0, 20),
      total:  cachedLeads.length,
      source: "cache",
    });
  }

  // Live search
  let leads = [];
  try {
    leads = await searchMSMEs({ niche, state, city, maxResults: 20 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // Save to DB in background (fire and forget)
  if (leads.length > 0) {
    const batch = db.batch();
    let ops = 0;
    for (const l of leads) {
      if (!l.businessName) continue;
      const key = `${l.businessName.toLowerCase().replace(/\s+/g, "").slice(0, 40)}_${state.toLowerCase().slice(0, 8)}_msme`;
      const docId = Buffer.from(key).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 50);
      batch.set(col.doc(docId), {
        ...l,
        collectedBy: user.uid,
        collectedAt: Date.now(),
      }, { merge: true });
      ops++;
      if (ops >= 400) break;
    }
    if (ops > 0) batch.commit().catch(() => {});
  }

  return NextResponse.json({
    leads,
    total:  leads.length,
    source: "live_search",
  });
}
