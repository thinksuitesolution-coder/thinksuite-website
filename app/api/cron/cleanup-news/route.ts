import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldNews } from '@/lib/news/pipeline/cleanup';
import { verifyCronAuth } from '@/lib/cron-auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await cleanupOldNews();
  return NextResponse.json({ success: true, ...result });
}
