import { NextRequest, NextResponse } from 'next/server';
import { runNewsPipeline } from '@/lib/news/orchestrator';

// Sync pipeline run — for local/manual triggering only, NOT used by Vercel cron
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET && secret !== process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const start = Date.now();
  try {
    const result = await runNewsPipeline();
    return NextResponse.json({ success: true, durationMs: Date.now() - start, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
