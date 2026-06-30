import { NextResponse } from "next/server";
import { getAdminDb, firebaseAdmin } from "@/lib/firebaseAdmin";
import { verifyUser }  from "@/lib/authUtils";

export const maxDuration = 30;

// Deduplicate key for a lead
function dedupKey(lead) {
  const name = (lead.businessName || lead.name || "").toLowerCase().replace(/\s+/g, "").slice(0, 40);
  const city = (lead.city || lead.location || "").toLowerCase().replace(/\s+/g, "").slice(0, 20);
  return `${name}_${city}`;
}

function sanitize(lead) {
  return {
    businessName:      (lead.businessName || lead.name || "").slice(0, 200),
    cin:               (lead.cin           || "").slice(0, 21),
    industry:          (lead.industry      || lead.category || "").slice(0, 100),
    state:             (lead.state         || "").slice(0, 50),
    city:              (lead.city          || (lead.location || "").split(",")[0] || "").slice(0, 80),
    location:          (lead.location      || lead.address  || "").slice(0, 200),
    phone:             (lead.phone         || "").replace(/\D/g, "").slice(0, 15),
    email:             (lead.email         || "").toLowerCase().slice(0, 150),
    emailVerified:     false,
    emailConfidence:   0,
    website:           (lead.website       || "").slice(0, 200),
    linkedinUrl:       (lead.linkedinUrl   || lead.profileUrl || "").slice(0, 300),
    linkedinId:        (lead.linkedinId    || lead.linkedinCompanyId || "").slice(0, 80),
    contactPerson:     (lead.contactPerson || lead.name     || "").slice(0, 150),
    contactTitle:      (lead.contactTitle  || lead.title    || lead.contactDesignation || "").slice(0, 150),
    companySize:       (lead.companySize   || "").slice(0, 50),
    founded:           (lead.founded       || lead.incorporationDate || "").slice(0, 20),
    description:       (lead.description   || "").slice(0, 500),
    source:            (lead.source        || "unknown").slice(0, 50),
    type:              lead.type === "person" ? "person" : "company",
    rating:            typeof lead.rating === "number" ? lead.rating : null,
    mapsUrl:           (lead.mapsUrl       || "").slice(0, 300),
    tags:              Array.isArray(lead.tags) ? lead.tags.slice(0, 10) : [],
    collectedAt:       lead.collectedAt    || Date.now(),
    lastUpdated:       Date.now(),
  };
}

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body  = await req.json();
    const leads = Array.isArray(body.leads) ? body.leads : body.lead ? [body.lead] : [];
    if (leads.length === 0) return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    if (leads.length > 50)  return NextResponse.json({ error: "Max 50 leads per batch" }, { status: 400 });

    const db  = getAdminDb();
    const col = db.collection("lead_database");

    // Pre-sanitize and filter valid leads
    const validLeads = leads
      .map(raw => {
        const lead = sanitize(raw);
        if (!lead.businessName) return null;
        const key   = dedupKey(lead);
        const docId = Buffer.from(key).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 50);
        return { lead, docId };
      })
      .filter(Boolean);

    let saved   = 0;
    let skipped = leads.length - validLeads.length;

    if (validLeads.length === 0) {
      return NextResponse.json({ success: true, saved: 0, skipped, total: leads.length });
    }

    // Parallel existence checks — no more serial awaits inside a loop
    const existingDocs = await Promise.all(validLeads.map(({ docId }) => col.doc(docId).get()));

    const batch = db.batch();

    for (let i = 0; i < validLeads.length; i++) {
      const { lead, docId } = validLeads[i];
      const existing        = existingDocs[i];

      if (existing.exists) {
        // Merge: only update fields that are now better (non-empty)
        const cur = existing.data();
        const upd = {};
        if (!cur.email   && lead.email)   upd.email   = lead.email;
        if (!cur.phone   && lead.phone)   upd.phone   = lead.phone;
        if (!cur.website && lead.website) upd.website = lead.website;
        if (!cur.cin     && lead.cin)     upd.cin     = lead.cin;
        if (Object.keys(upd).length > 0) {
          upd.lastUpdated = Date.now();
          batch.update(col.doc(docId), upd);
        }
        skipped++;
      } else {
        batch.set(col.doc(docId), { ...lead, id: docId, collectedBy: userId });
        saved++;
      }
    }

    await batch.commit();

    // Atomic increment — no race condition vs get-then-set
    if (saved > 0) {
      await db.collection("database_contributors").doc(userId).set(
        {
          contributed:     firebaseAdmin.firestore.FieldValue.increment(saved),
          lastContributed: Date.now(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({ success: true, saved, skipped, total: leads.length });
  } catch (err) {
    console.error("[database/collect]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
