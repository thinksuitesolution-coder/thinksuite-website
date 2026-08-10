import { NextResponse } from "next/server";
import { runAllAgents } from "@/agents/engine";
import { verifyCronAuth } from "@/lib/cron-auth";

/**
 * GET /api/cron/run-agents
 * Called by Vercel Cron every morning at 7:00 AM IST (1:30 UTC).
 * Runs all active agent subscriptions across all users.
 */
export async function GET(req) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[cron/run-agents] Starting daily agent run at", new Date().toISOString());

  const log = await runAllAgents();

  const succeeded = log.filter(l => l.success).length;
  const failed    = log.filter(l => !l.success).length;

  console.log(`[cron/run-agents] Done. ${succeeded} succeeded, ${failed} failed.`);
  return NextResponse.json({ ok: true, total: log.length, succeeded, failed, log });
}

export const maxDuration = 300;
