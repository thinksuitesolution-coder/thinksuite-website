import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { runNewsPipeline } from '@/lib/news/orchestrator';
import { verifyCronAuth } from '@/lib/cron-auth';

// Fluid/background execution — no hard timeout
export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return immediately so the HTTP request doesn't timeout.
  // waitUntil keeps the function alive in the background.
  waitUntil(
    runNewsPipeline()
      .then(r => console.log('[Pipeline] Done:', JSON.stringify(r)))
      .catch(e => console.error('[Pipeline] Error:', e.message))
  );

  return NextResponse.json({ success: true, message: 'Pipeline started in background' });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
