import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime    = "nodejs";
export const maxDuration = 60;

const DLQ_KEY    = "dlq:failed-verifications";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const LINK_TTL   = 60 * 60 * 2; // 2h same TTL as checkWaLinkStatus / checkTelegramLink

const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const HEADERS = { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" };

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function notifySlack(text) {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text }),
    });
  } catch {}
}

// Re-verify a WA invite link. Returns true if now accessible.
async function reverifyWa(link) {
  try {
    const res  = await fetch(link, { headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(6000) });
    if (!res.ok) return false;
    const html = await res.text();
    if (/invalid|revoked|expired|no longer valid|does not work|link not found|404/i.test(html)) return false;
    if (html.includes("og:title")) {
      await redis.set(`wa:${link}`, { status: "open", name: "" }, { ex: LINK_TTL });
      return true;
    }
    return false;
  } catch { return false; }
}

// Re-verify a Telegram link. Returns true if now accessible.
async function reverifyTg(link) {
  try {
    const res  = await fetch(link, { headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(6000) });
    if (!res.ok) return false;
    const html = await res.text();
    if (!html.includes("tgme_page_title")) return false;
    if (/Channel\s+not\s+found|Invite\s+link\s+invalid/i.test(html)) return false;
    const m = html.match(/([\d,.]+[kKmM]?)\s+(?:members?|subscribers?)/i);
    let memberCount = null;
    if (m) {
      const raw = m[1].toLowerCase().replace(/,/g, "");
      memberCount = raw.endsWith("k") ? Math.round(parseFloat(raw) * 1000)
        : raw.endsWith("m") ? Math.round(parseFloat(raw) * 1_000_000)
        : parseInt(raw, 10) || null;
    }
    await redis.set(`tg:${link}`, { valid: true, memberCount }, { ex: LINK_TTL });
    return true;
  } catch { return false; }
}

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now      = Date.now();
  const allRaw   = await redis.lrange(DLQ_KEY, 0, -1);
  const allItems = allRaw.map(i => (typeof i === "string" ? JSON.parse(i) : i));

  const stale = allItems.filter(item => now - item.failedAt > ONE_DAY_MS);
  const fresh = allItems.filter(item => now - item.failedAt <= ONE_DAY_MS);

  if (stale.length === 0) {
    return NextResponse.json({ requeued: 0, remaining: fresh.length, message: "No stale DLQ items" });
  }

  // Re-verify stale items in parallel (batched to avoid hammering)
  const BATCH = 10;
  let recovered = 0;
  const stillFailed = [];

  for (let i = 0; i < stale.length; i += BATCH) {
    const batch = stale.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(item => {
      if (item.platform === "whatsapp") return reverifyWa(item.link);
      if (item.platform === "telegram") return reverifyTg(item.link);
      return Promise.resolve(false);
    }));
    results.forEach((r, idx) => {
      if (r.status === "fulfilled" && r.value === true) {
        recovered++;
      } else {
        // Still failing keep in DLQ with updated timestamp so we retry again tomorrow
        stillFailed.push({ ...batch[idx], failedAt: now });
      }
    });
  }

  // Rebuild DLQ: fresh items + items that still failed
  const remaining = [...fresh, ...stillFailed];
  await redis.del(DLQ_KEY);
  if (remaining.length > 0) {
    await redis.lpush(DLQ_KEY, ...remaining.map(i => JSON.stringify(i)));
    await redis.ltrim(DLQ_KEY, 0, 999);
  }

  const dlqSize = remaining.length;
  const DLQ_ALERT = parseInt(process.env.DLQ_ALERT_THRESHOLD || "100");
  if (dlqSize >= DLQ_ALERT) {
    await notifySlack(
      `:rotating_light: DLQ still at ${dlqSize} after nightly requeue. ` +
      `${recovered} recovered, ${stillFailed.length} still failing. Manual investigation needed.`
    );
  }

  return NextResponse.json({
    processed:  stale.length,
    recovered,
    requeued:   stillFailed.length,
    remaining:  dlqSize,
    message:    `Processed ${stale.length} stale items: ${recovered} recovered, ${stillFailed.length} re-queued`,
  });
}
