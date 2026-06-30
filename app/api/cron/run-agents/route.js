import { NextResponse } from "next/server";
import { runAllAgents } from "@/agents/engine";

/**
 * GET /api/cron/run-agents
 * Called by Vercel Cron every morning at 7:00 AM IST (1:30 UTC).
 * Runs all active agent subscriptions across all users.
 */
export async function GET(req) {
  // Vercel cron sends this header; protect against accidental external calls
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
