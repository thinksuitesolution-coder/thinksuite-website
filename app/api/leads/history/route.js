import { NextResponse } from "next/server";
import { verifyUser }  from "@/lib/authUtils";
import { getAdminDb }  from "@/lib/firebaseAdmin";

export const maxDuration = 30;

// Human-readable label for each search type
const TYPE_LABELS = {
  "google-map":     "Google Map Leads",
  "website-leads":  "Website Leads",
  "instagram":      "Instagram Leads",
  "linkedin":       "LinkedIn Leads",
  "freelancer":     "Projects",
  "startup-founders": "Startup Founders",
  "mca-companies":  "MCA Fresh Companies",
  "intl-companies": "Global Companies",
  "job-intent":     "Job Intent Leads",
  "group-finder":   "Group Finder",
  "exim":           "Exporter / Importer",
};

// GET /api/leads/history?page=1&limit=20&type=google-map
export async function GET(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const type  = searchParams.get("type") || null; // optional filter

    const db = getAdminDb();
    let q = db
      .collection("leadGenHistory")
      .doc(userId)
      .collection("searches")
      .orderBy("createdAt", "desc");

    if (type) q = q.where("type", "==", type);

    // Fetch one page worth — Firestore doesn't support true offset on subcollections
    // so we use startAfter via a cursor token
    const cursor = searchParams.get("cursor") || null;
    if (cursor) {
      try {
        const cursorDoc = await db
          .collection("leadGenHistory").doc(userId)
          .collection("searches").doc(cursor).get();
        if (cursorDoc.exists) q = q.startAfter(cursorDoc);
      } catch { /* ignore invalid cursor */ }
    }

    const snap = await q.limit(limit).get();
    const sessions = snap.docs.map(d => {
      const data = d.data();
      return {
        id:         d.id,
        type:       data.type || "unknown",
        typeLabel:  TYPE_LABELS[data.type] || data.type || "Search",
        niche:      data.niche || data.category || "",
        location:   data.location || "",
        leadCount:  data.leadCount || (data.leads?.length) || 0,
        leads:      data.leads || [],
        createdAt:  data.createdAt || 0,
      };
    });

    // Next cursor = last doc id
    const nextCursor = snap.docs.length === limit ? snap.docs[snap.docs.length - 1].id : null;

    // Stats: total sessions per type
    let stats = null;
    if (page === 1 && !type && !cursor) {
      try {
        const allSnap = await db
          .collection("leadGenHistory").doc(userId)
          .collection("searches")
          .select("type", "leadCount")
          .get();
        const byType = {};
        let totalLeads = 0;
        for (const d of allSnap.docs) {
          const t = d.data().type || "unknown";
          byType[t] = (byType[t] || 0) + 1;
          totalLeads += d.data().leadCount || 0;
        }
        stats = {
          totalSessions: allSnap.size,
          totalLeads,
          byType,
        };
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({
      success: true,
      sessions,
      nextCursor,
      hasMore: !!nextCursor,
      stats,
    });
  } catch (err) {
    console.error("[history]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/leads/history  — delete a single session (body: { sessionId })
export async function DELETE(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const db = getAdminDb();
    await db
      .collection("leadGenHistory").doc(userId)
      .collection("searches").doc(sessionId)
      .delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
