import { NextRequest } from 'next/server';
import { timingSafeEqualString } from './secure-compare';

// Fails closed: if CRON_SECRET isn't configured, every request is rejected.
// The cron routes previously did `if (cronSecret && provided !== cronSecret)`
// - when the env var was unset, that check short-circuited to false and the
// route ran with no auth at all instead of refusing to run.
export function verifyCronAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET || '';
  if (!secret) return false;

  const authHeader = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');
  const provided = querySecret ?? authHeader?.replace('Bearer ', '') ?? '';
  if (!provided) return false;

  return timingSafeEqualString(provided, secret);
}
