import { NextRequest, NextResponse } from 'next/server';
import { runNewsPipeline } from '@/lib/news/orchestrator';

// Vercel Cron + manual trigger endpoint
// cron-job.org will call this every 10 minutes
export async function GET(req: NextRequest) {
  // Secure with a secret token
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
