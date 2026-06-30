import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const db = getAdminDb();
    const snap = await db.collection("aiCallingCampaigns")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const campaigns = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id:             doc.id,
        name:           d.name,
        status:         d.status,
        totalLeads:     d.totalLeads,
        completedCalls: d.completedCalls,
        successCalls:   d.successCalls,
        language:       d.language,
        createdAt:      d.createdAt?.toDate?.()?.toISOString() ?? null,
        completedAt:    d.completedAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("[campaigns list]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
