import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import getAdmin from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken, leads, lead, action } = body;

    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const adminApp = await getAdmin();
    const decoded = await adminApp.auth().verifyIdToken(idToken);
    const userId = decoded.uid;

    const db = adminApp.firestore();

    // Save single lead
    if (action === "save" && lead) {
      const docRef = db.collection("leads").doc();
      const now = new Date().toISOString();
      await docRef.set({
        id: docRef.id,
        userId,
        source: lead.source || "google_maps",
        type: lead.type || "domestic",
        status: "raw",
        name: lead.name || "",
        businessName: lead.businessName || lead.name || "",
        phone: lead.phone || null,
        whatsapp: lead.whatsapp || null,
        email: lead.email || null,
        website: lead.website || null,
        address: lead.address || "",
        city: lead.city || "",
        state: lead.state || "",
        country: lead.country || "India",
        rating: lead.rating || null,
        reviewCount: lead.reviewCount || null,
        emailValid: null,
        phoneValid: null,
        websiteActive: null,
        industry: lead.industry || null,
        companySize: null,
        techStack: lead.techStack || [],
        socialLinks: lead.socialLinks || {},
        aiLeadScore: null,
        aiSummary: null,
        aiPainPoints: null,
        aiOutreachEmail: null,
        aiOutreachWhatsapp: null,
        aiOutreachLinkedin: null,
        aiBestChannel: null,
        aiNotes: null,
        tags: lead.tags || [],
        isFavorite: false,
        isExported: false,
        campaignId: lead.campaignId || null,
        createdAt: now,
        enrichedAt: null,
      });
      // Increment pre-aggregated stats counter (O(1) reads on GET)
      const src = lead.source || "google_maps";
      await db.collection("lead_stats").doc(userId).set({
        total:    getAdmin().firestore.FieldValue.increment(1),
        [`bySource.${src}.total`]: getAdmin().firestore.FieldValue.increment(1),
        updatedAt: now,
      }, { merge: true });
      return NextResponse.json({ success: true, leadId: docRef.id });
    }

    // Bulk save leads
    if (action === "bulk_save" && Array.isArray(leads)) {
      const batch = db.batch();
      const now = new Date().toISOString();
      const ids = [];

      for (const lead of leads.slice(0, 50)) {
        const docRef = db.collection("leads").doc();
        ids.push(docRef.id);
        batch.set(docRef, {
          id: docRef.id,
          userId,
          source: lead.source || "google_maps",
          type: lead.type || "domestic",
          status: "raw",
          name: lead.name || "",
          businessName: lead.businessName || lead.name || "",
          phone: lead.phone || null,
          whatsapp: lead.whatsapp || null,
          email: lead.email || null,
          website: lead.website || null,
          address: lead.address || "",
          city: lead.city || "",
          state: lead.state || "",
          country: lead.country || "India",
          rating: lead.rating || null,
          reviewCount: lead.reviewCount || null,
          emailValid: null, phoneValid: null, websiteActive: null,
          industry: lead.industry || null, companySize: null,
          techStack: lead.techStack || [], socialLinks: lead.socialLinks || {},
          aiLeadScore: null, aiSummary: null, aiPainPoints: null,
          aiOutreachEmail: null, aiOutreachWhatsapp: null, aiOutreachLinkedin: null,
          aiBestChannel: null, aiNotes: null, tags: lead.tags || [],
          isFavorite: false, isExported: false, campaignId: lead.campaignId || null,
          createdAt: now, enrichedAt: null,
        });
      }

      await batch.commit();
      return NextResponse.json({ success: true, count: ids.length, ids });
    }

    // Update single lead field
    if (action === "update" && lead?.id) {
      const { id, ...updates } = lead;
      const docRef = db.collection("leads").doc(id);
      const snap = await docRef.get();
      if (!snap.exists || snap.data().userId !== userId) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }
      await docRef.update({ ...updates, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    // Toggle favorite
    if (action === "favorite" && lead?.id) {
      const docRef = db.collection("leads").doc(lead.id);
      const snap = await docRef.get();
      if (!snap.exists || snap.data().userId !== userId) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }
      await docRef.update({ isFavorite: !snap.data().isFavorite });
      return NextResponse.json({ success: true, isFavorite: !snap.data().isFavorite });
    }

    // Delete lead
    if (action === "delete" && lead?.id) {
      const docRef = db.collection("leads").doc(lead.id);
      const snap = await docRef.get();
      if (!snap.exists || snap.data().userId !== userId) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }
      const src = snap.data().source || "google_maps";
      await docRef.delete();
      // Decrement stats counter
      await db.collection("lead_stats").doc(userId).set({
        total: getAdmin().firestore.FieldValue.increment(-1),
        [`bySource.${src}.total`]: getAdmin().firestore.FieldValue.increment(-1),
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idToken = searchParams.get("idToken");
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const adminApp = await getAdmin();
    const decoded = await adminApp.auth().verifyIdToken(idToken);
    const userId = decoded.uid;
    const db = adminApp.firestore();

    // Single lead fetch
    const singleId = searchParams.get("leadId");
    if (singleId) {
      const snap = await db.collection("leads").doc(singleId).get();
      if (!snap.exists || snap.data().userId !== userId) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }
      return NextResponse.json({ lead: snap.data() });
    }

    let query = db.collection("leads").where("userId", "==", userId).orderBy("createdAt", "desc");
    if (source) query = query.where("source", "==", source);
    if (status) query = query.where("status", "==", status);

    // Stats — read from pre-aggregated counter doc (O(1)) rather than full collection scan
    const [statsDoc, snap] = await Promise.all([
      db.collection("lead_stats").doc(userId).get(),
      query.limit(limit).get(),
    ]);
    const stats = statsDoc.exists
      ? statsDoc.data()
      : { total: 0, verified: 0, enriched: 0, highScore: 0, bySource: {} };

    // Paginated leads — use cursor-based pagination via startAfter when page > 1
    const offset = (page - 1) * limit;
    const leads = offset > 0
      ? (await query.offset(offset).limit(limit).get()).docs.map(d => d.data())
      : snap.docs.map(d => d.data());

    return NextResponse.json({ leads, stats, page, total: stats.total });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
