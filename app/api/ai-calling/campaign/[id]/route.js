import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const db = getAdminDb();
    const snap = await db.collection("aiCallingCampaigns").doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const d = snap.data();
    if (d.userId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    return NextResponse.json({
      id: snap.id,
      name:           d.name,
      goal:           d.goal,
      language:       d.language,
      businessContext: d.businessContext,
      status:         d.status,
      totalLeads:     d.totalLeads,
      completedCalls: d.completedCalls,
      successCalls:   d.successCalls,
      createdAt:      d.createdAt?.toDate?.()?.toISOString() ?? null,
      completedAt:    d.completedAt?.toDate?.()?.toISOString() ?? null,
      leads: (d.leads || []).map(l => ({
        phone:       l.phone,
        name:        l.name,
        callStatus:  l.callStatus,
        outcome:     l.outcome,
        score:       l.score,
        duration:    l.duration,
        transcript:  l.transcript,
        summary:     l.summary,
        calledAt:    l.calledAt?.toDate?.()?.toISOString() ?? null,
        completedAt: l.completedAt?.toDate?.()?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    console.error("[campaign detail]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
