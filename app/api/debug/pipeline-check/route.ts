import { NextRequest, NextResponse } from 'next/server';
import { runNewsPipeline } from '@/lib/news/orchestrator';

export const runtime = 'nodejs';
export const maxDuration = 300;

// Temporary diagnostic endpoint — remove once the "no new news" issue is resolved.
export async function GET(req: NextRequest) {
  const querySecret = req.nextUrl.searchParams.get('secret');
  if (querySecret !== process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runNewsPipeline();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({
      ok: false,
      message: e.message,
      stack: e.stack,
    }, { status: 500 });
  }
}
