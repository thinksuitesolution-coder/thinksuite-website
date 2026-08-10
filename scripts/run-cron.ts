// Runs a single app/api/cron/<slug>/route.ts handler as a plain Node process
// (invoked by GitHub Actions) instead of over HTTP against the Vercel
// deployment. Reuses the exact same route files - zero duplicated cron logic -
// so the routes stay the single source of truth and still work if ever hit
// directly over HTTP too.
//
// Why this exists: Vercel Hobby's Fluid Active CPU budget (4h/month) was being
// exhausted by scheduled cron work executing as Vercel functions - the news
// pipeline alone ran every 2h at ~166s a run, roughly an hour of CPU a day.
// Moving execution to GitHub Actions (2000 free minutes/month on a private
// repo) means Vercel only ever serves real site traffic, not cron work.
//
// Ported from the same script in the visibilityai project, which hit this
// first and solved it this way.
//
// Usage: tsx scripts/run-cron.ts <slug>
// Requires the same env vars the route needs (CRON_SECRET + whatever the
// route's lib/ dependencies read) to be present in the environment already -
// GitHub Actions injects them from repo secrets.
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

  if (!res.ok) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`[${slug}] threw:`, err);
  process.exit(1);
});
