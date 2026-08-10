import { NextResponse } from 'next/server';

/**
 * Retired. The news pipeline moved to GitHub Actions
 * (.github/workflows/fetch-news.yml → scripts/run-news-pipeline.ts), which
 * writes straight to Turso; Vercel only serves reads now.
 *
 * The route is kept as a cheap 410 rather than deleted because external
 * schedulers still point at this URL, and a 404 from a Next app costs about
 * as much to serve. What it must never do again is start the pipeline: this
 * used to run it under `waitUntil` with `maxDuration = 300`, so every hit —
 * from any scheduler, authorized or not — burned up to five minutes of Fluid
 * Active CPU on a Hobby plan that has no budget for it.
 */
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GONE = {
  error: 'Gone',
  message:
    'The news pipeline no longer runs on Vercel. It runs on GitHub Actions ' +
    '(fetch-news workflow). Point any scheduler at that workflow instead — ' +
    'hitting this URL does nothing.',
};

export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function POST() {
  return NextResponse.json(GONE, { status: 410 });
}
