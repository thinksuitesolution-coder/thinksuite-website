import { NextRequest, NextResponse } from 'next/server';
import { runNewsPipeline } from '@/lib/news/orchestrator';

// Allow up to 5 minutes for the pipeline (requires Vercel Pro/Fluid)
export const maxDuration = 300;

// Vercel Cron triggers every 2 hours
export async function GET(req: NextRequest) {
  // Auth: Bearer header OR ?secret= query param
  const authHeader = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  const provided = querySecret ?? authHeader?.replace('Bearer ', '') ?? '';
  if (cronSecret && provided !== cronSecret && provided !== (process.env.GROQ_API_KEY ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runNewsPipeline();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error('Pipeline error:', err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

// Allow POST for Vercel Cron
export async function POST(req: NextRequest) {
  return GET(req);
}
