import { NextResponse } from 'next/server';

/**
 * Retired alongside /api/cron/fetch-news. This was the synchronous door to the
 * same pipeline — `maxDuration = 300` and a blocking `runNewsPipeline()` — so
 * leaving it live would have re-opened the exact Fluid CPU drain that moving
 * the pipeline to GitHub Actions was meant to close.
 *
 * To run the pipeline on demand now, dispatch the fetch-news workflow.
 */
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      error: 'Gone',
      message:
        'The news pipeline no longer runs on Vercel. Trigger the fetch-news ' +
        'workflow on GitHub Actions instead.',
    },
    { status: 410 },
  );
}
