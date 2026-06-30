import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

/* ── POST /api/agents/configure
   Body: { userId, agentId, config: { businessName, city, ... } }
── */
export async function POST(req) {
  try {
    const { userId, agentId, config } = await req.json();
    if (!userId || !agentId || !config) {
      return NextResponse.json({ error: "userId, agentId and config are required" }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection("users").doc(userId).collection("active_agents").doc(agentId).set(
      { config, updatedAt: Date.now() },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/agents/configure]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
