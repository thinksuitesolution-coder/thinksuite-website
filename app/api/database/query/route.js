import { NextResponse } from "next/server";
import { getAdminDb }  from "@/lib/firebaseAdmin";
import { verifyUser }  from "@/lib/authUtils";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      search = "",
      state = "",
      industry = "",
      source = "",
      type = "",        // "company" | "person"
      hasEmail = false,
      hasPhone = false,
      hasWebsite = false,
      emailVerified = false,
      limit: lim = 50,
      offset = 0,
    } = await req.json();

    const db  = getAdminDb();
    let query = db.collection("lead_database");

    // Apply Firestore filters (only equality filters work without composite indexes)
    if (state)    query = query.where("state",    "==", state);
    if (source)   query = query.where("source",   "==", source);
    if (type)     query = query.where("type",     "==", type);
    if (emailVerified) query = query.where("emailVerified", "==", true);

    query = query.orderBy("collectedAt", "desc").limit(500);

    const snap = await query.get();
    let leads  = snap.docs.map(d => ({ ...d.data(), id: d.id }));

    // In-memory filters for flexibility
    if (industry) {
      const kw = industry.toLowerCase();
      leads = leads.filter(l => (l.industry || "").toLowerCase().includes(kw));
    }
    if (hasEmail)   leads = leads.filter(l => !!l.email);
    if (hasPhone)   leads = leads.filter(l => !!l.phone);
    if (hasWebsite) leads = leads.filter(l => !!l.website);

    if (search) {
      const kw = search.toLowerCase();
      leads = leads.filter(l =>
        (l.businessName  || "").toLowerCase().includes(kw) ||
        (l.contactPerson || "").toLowerCase().includes(kw) ||
        (l.industry      || "").toLowerCase().includes(kw) ||
        (l.city          || "").toLowerCase().includes(kw) ||
        (l.email         || "").toLowerCase().includes(kw)
      );
    }

    const total    = leads.length;
    const paginated = leads.slice(offset, offset + Math.min(lim, 100));

    return NextResponse.json({ success: true, leads: paginated, total, offset, limit: lim });
  } catch (err) {
    console.error("[database/query]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
