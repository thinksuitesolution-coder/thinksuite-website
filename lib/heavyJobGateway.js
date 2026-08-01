import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

const RAILWAY_BASE = process.env.HEAVY_JOBS_BASE_URL;
const IS_RAILWAY = process.env.IS_RAILWAY === "true";
const CACHE_TTL_SEC = 24 * 60 * 60; // 24h

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

async function cacheKeyFor(request) {
  const url = new URL(request.url);
  let bodyText = "";
  if (request.method !== "GET" && request.method !== "HEAD") {
    bodyText = await request.clone().text();
  }
  const hash = crypto.createHash("sha256")
    .update(url.pathname + "|" + url.search + "|" + bodyText)
    .digest("hex")
    .slice(0, 32);
  return `heavycache:${hash}`;
}

/**
 * Gateway for expensive lead-gen routes: serves from a 24h Redis cache when
 * possible, otherwise forwards the request to the Railway deployment (flat
 * compute pricing) instead of running the expensive work on Vercel's
 * per-invocation Fluid Compute. Returns null when the caller should just
 * run its own logic locally — this happens on Railway itself (IS_RAILWAY),
 * on a cache miss with no Railway target configured, or if Railway is
 * unreachable (graceful fallback so the feature never just breaks).
 */
export async function heavyJobGateway(request) {
  if (IS_RAILWAY) return null;

  const key = redis ? await cacheKeyFor(request) : null;

  if (key) {
    try {
      const cached = await redis.get(key);
      if (cached) return NextResponse.json(cached, { headers: { "x-cache": "HIT" } });
    } catch { /* ignore cache errors, fall through */ }
  }

  if (!RAILWAY_BASE) return null;

  const url = new URL(request.url);
  const target = `${RAILWAY_BASE}${url.pathname}${url.search}`;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const init = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    // Clone so the original request body stream is left untouched — if the
    // proxy attempt fails below, the caller falls back to reading `request`
    // itself for local processing.
    init.body = await request.clone().text();
  }

  let res;
  try {
    res = await fetch(target, init);
  } catch {
    return null; // Railway unreachable — fall back to running locally on Vercel
  }

  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not JSON, skip caching */ }

  if (res.ok && key && json) {
    try { await redis.set(key, json, { ex: CACHE_TTL_SEC }); } catch { /* ignore cache write errors */ }
  }

  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json", "x-cache": "MISS" },
  });
}
