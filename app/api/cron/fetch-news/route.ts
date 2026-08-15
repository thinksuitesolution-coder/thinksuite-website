import { NextRequest, NextResponse } from 'next/server';
import { runNewsPipeline } from '@/lib/news/orchestrator';
import { verifyCronAuth } from '@/lib/cron-auth';

// Nothing schedules this route over HTTP any more (the last such caller,
// cron-job.org, was decommissioned when this moved to a script-invoked
// runner) — see scripts/run-cron.ts. Backgrounding the pipeline with
// waitUntil() and returning immediately was built for that HTTP path, on
// Vercel's Fluid runtime. The script runner never had that runtime: it called
// this handler directly, got back "started in background" while the
// pipeline kept running as an un-awaited promise, and then returned from its
// own main() — after which the only thing standing between that dangling
// promise and a runaway process was the caller's own external kill switch
// (GitHub Actions' timeout-minutes, and Railway has no equivalent). Awaiting
// the pipeline here means run-cron.ts's own await returns only once the work
// is actually done, and the process can exit cleanly on its own.
export const runtime = 'nodejs';
export const maxDuration = 800;

export async function GET(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runNewsPipeline();
  return NextResponse.json({ success: true, ...result });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
