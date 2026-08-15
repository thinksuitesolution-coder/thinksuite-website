// Runs a single app/api/cron/<slug>/route.ts handler as a plain Node process
// (invoked by GitHub Actions, or a Railway Cron Job service) instead of over
// HTTP against the Vercel deployment. Reuses the exact same route files - zero
// duplicated cron logic - so the routes stay the single source of truth and
// still work if ever hit directly over HTTP too.
//
// Why this exists: Vercel Hobby's Fluid Active CPU budget (4h/month) was being
// exhausted by scheduled cron work executing as Vercel functions - the news
// pipeline alone ran every 2h at ~166s a run, roughly an hour of CPU a day.
// Moving execution off Vercel means it only ever serves real site traffic,
// not cron work.
//
// Ported from the same script in the visibilityai project, which hit this
// first and solved it this way.
//
// Usage: tsx scripts/run-cron.ts <slug>
// Requires the same env vars the route needs (CRON_SECRET + whatever the
// route's lib/ dependencies read) to be present in the environment already -
// the runner (GitHub Actions, Railway) injects them from its own secrets.
import { NextRequest } from 'next/server';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: tsx scripts/run-cron.ts <cron-slug>');
  process.exit(1);
}

const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error('CRON_SECRET is not set in the environment');
  process.exit(1);
}

// Absolute backstop, independent of whatever budget the pipeline logic itself
// keeps. GitHub Actions had timeout-minutes as an external kill switch; a
// Railway Cron Job has no such thing; its own docs say a cron service "is
// expected to execute a task, and terminate as soon as that task is
// finished" and Railway "does not automatically force termination" if it
// doesn't. A hang here — a fetch that never resolves, a promise that never
// settles — would otherwise run (and bill) forever, and Railway skips every
// subsequent scheduled run for as long as the previous one is still "running".
// unref() so a normal fast exit isn't held open waiting on this timer; it
// only fires if something else is still keeping the process alive past the
// deadline.
const HARD_TIMEOUT_MS = 15 * 60 * 1000;
const hardTimeout = setTimeout(() => {
  console.error(`[${slug}] HARD TIMEOUT after ${HARD_TIMEOUT_MS / 60000}m — force exiting`);
  process.exit(1);
}, HARD_TIMEOUT_MS);
hardTimeout.unref();

// Only needs to be a valid host for constructing the NextRequest - the route
// handlers don't read it.
const baseUrl = 'https://www.thinksuite.in';

async function main() {
  const routePath = `api/cron/${slug}`;
  const routeModule = await import(`../app/${routePath}/route.ts`);
  const handler = routeModule.GET ?? routeModule.POST;
  if (typeof handler !== 'function') {
    throw new Error(`app/${routePath}/route.ts exports no GET or POST handler`);
  }

  const req = new NextRequest(`${baseUrl}/${routePath}`, {
    method: routeModule.GET ? 'GET' : 'POST',
    headers: { authorization: `Bearer ${secret}` },
  });

  const res: Response = await handler(req);
  const body = await res.text();
  console.log(`[${slug}] status=${res.status}`);
  console.log(body);

  // Explicit exit rather than letting the event loop drain on its own: this
  // script has previously kept running past its own logical completion (see
  // the route's history) on a dangling background promise neither this
  // process nor the caller was still awaiting. Nothing here should still be
  // pending once the handler above has resolved, but exiting explicitly means
  // that is guaranteed rather than assumed.
  process.exit(res.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(`[${slug}] threw:`, err);
  process.exit(1);
});
