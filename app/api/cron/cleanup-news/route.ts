import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldNews } from '@/lib/news/pipeline/cleanup';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  const provided = querySecret ?? authHeader?.replace('Bearer ', '') ?? '';
  if (cronSecret && provided !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await cleanupOldNews();
  return NextResponse.json({ success: true, ...result });
}
