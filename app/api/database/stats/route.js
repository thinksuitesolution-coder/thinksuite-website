import { NextResponse } from "next/server";
import { getAdminDb }  from "@/lib/firebaseAdmin";
import { verifyUser }  from "@/lib/authUtils";

export const maxDuration = 20;

export async function GET(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db   = getAdminDb();

    // Total count
    const snap = await db.collection("lead_database").count().get();
    const total = snap.data().count;

    // Count by source (last 500 for speed)
    const recent = await db.collection("lead_database").orderBy("collectedAt", "desc").limit(500).get();
    const sourceCounts = {};
    const stateCounts  = {};
    let withEmail = 0, withPhone = 0;

    for (const doc of recent.docs) {
      const d = doc.data();
      sourceCounts[d.source] = (sourceCounts[d.source] || 0) + 1;
      if (d.state) stateCounts[d.state] = (stateCounts[d.state] || 0) + 1;
      if (d.email) withEmail++;
      if (d.phone) withPhone++;
    }

    // Top contributors
    const contribSnap = await db.collection("database_contributors")
      .orderBy("contributed", "desc").limit(10).get();
    const contributors = contribSnap.docs.map(d => ({
      userId: d.id,
      contributed: d.data().contributed || 0,
    }));

    // User's own contribution
    const myContrib = await db.collection("database_contributors").doc(userId).get();
    const myCount   = myContrib.exists ? (myContrib.data().contributed || 0) : 0;

    return NextResponse.json({
      success: true,
      total,
      withEmail,
      withPhone,
      sourceCounts,
      stateCounts,
      topStates: Object.entries(stateCounts).sort((a,b) => b[1]-a[1]).slice(0,10).map(([state,count]) => ({ state, count })),
      contributors,
      myContribution: myCount,
    });
  } catch (err) {
    console.error("[database/stats]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
