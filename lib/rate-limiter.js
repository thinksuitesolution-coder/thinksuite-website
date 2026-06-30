import { Redis } from "@upstash/redis";

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* ── checkRateLimit ──────────────────────────────────────────────────────────
 *  Sliding-window rate limiter using Upstash Redis.
 *
 *  @param uid        Firebase user ID
 *  @param action     Identifier for the action (e.g. "generate-avatar")
 *  @param max        Max requests allowed in the window
 *  @param windowSec  Window size in seconds (default 3600 = 1 hour)
 *
 *  Returns { allowed: boolean, remaining: number, resetIn: number (seconds) }
 * ──────────────────────────────────────────────────────────────────────────── */
export async function checkRateLimit(uid, action, max = 5, windowSec = 3600) {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    // Graceful degradation: allow if Redis not configured
    return { allowed: true, remaining: max, resetIn: windowSec };
  }

  const key = `rl:${action}:${uid}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    // Increment counter, set TTL on first write
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSec);

    const ttl = await redis.ttl(key);
    const remaining = Math.max(0, max - count);

    return {
      allowed:   count <= max,
      remaining,
      resetIn:   ttl > 0 ? ttl : windowSec,
      count,
    };
  } catch {
    // Redis failure → allow request (don't block users on Redis outage)
    return { allowed: true, remaining: max, resetIn: windowSec };
  }
}

/* ── buildRateLimitResponse ─────────────────────────────────────────────────
 *  Returns a 429 Response with Retry-After header.
 * ──────────────────────────────────────────────────────────────────────────── */
export function buildRateLimitResponse(resetIn) {
  return Response.json(
    {
      success: false,
      error: {
        code:    "RATE_LIMITED",
        message: "Too many requests. Please wait before generating another video.",
        resetIn,
      },
    },
    {
      status:  429,
      headers: { "Retry-After": String(resetIn) },
    }
  );
}
