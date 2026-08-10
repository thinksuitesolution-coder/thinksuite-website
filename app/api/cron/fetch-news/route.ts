import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { runNewsPipeline } from '@/lib/news/orchestrator';

// Fluid/background execution — no hard timeout
export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  const provided = querySecret ?? authHeader?.replace('Bearer ', '') ?? '';
  if (cronSecret && provided !== cronSecret && provided !== (process.env.GROQ_API_KEY ?? '')) {
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
