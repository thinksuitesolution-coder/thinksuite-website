import { NextResponse } from "next/server";
import { runAgent } from "@/agents/engine";

/* ── POST /api/agents/run
   Body: { userId, agentId }
   Manual trigger — also used by "Run Now" button on results page.
── */
export async function POST(req) {
  try {
    const { userId, agentId } = await req.json();
    if (!userId || !agentId) {
      return NextResponse.json({ error: "userId and agentId are required" }, { status: 400 });
    }

    const result = await runAgent(userId, agentId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/agents/run]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export const maxDuration = 60;
