import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import getAdmin from "@/lib/firebaseAdmin";
import { getAIClient } from "@/lib/aiClient";
import { scraperFetch } from "@/lib/scraperUtils";
import { verifyUser } from "@/lib/authUtils";
import { Redis } from "@upstash/redis";
import { saveLeadHistory } from "@/lib/leadGenQuota";
const SCRAPER_KEY   = process.env.SCRAPER_API_KEY   || null;
const SERPER_KEY    = process.env.SERPER_API_KEY    || null;
const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY || null;

export const maxDuration = 60;

const GOOGLE_KEY        = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CX         = process.env.GOOGLE_SEARCH_CX;
const GOOGLE_GROUPS_KEY = process.env.GOOGLE_GROUPS_API_KEY;
const GOOGLE_GROUPS_CX  = process.env.GOOGLE_GROUPS_CX;

const MONTHLY_LIMIT = 300;
const PER_PLATFORM  = 10;

const SEARCH_CACHE_TTL = 60 * 60 * 6;  // 6 hours same niche repeat search = 0 Serper calls
const LINK_CACHE_TTL   = 60 * 60 * 2;  // 2 hours WA/TG link status cache

// Redis client gracefully disabled if env vars missing
let redis = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch { redis = null; }

async function cacheGet(key) {
  if (!redis) return null;
  try { return await redis.get(key); } catch { return null; }
}

async function cacheSet(key, value, ttl) {
  if (!redis) return;
  try { await redis.set(key, value, { ex: ttl }); } catch {}
}

// Fire-and-forget: push a failed link into the Redis DLQ for nightly re-verification
function pushDlq(link, platform) {
  if (!redis) return;
  const item = JSON.stringify({ link, platform, failedAt: Date.now() });
  redis.lpush("dlq:failed-verifications", item)
    .then(() => redis.ltrim("dlq:failed-verifications", 0, 999))
    .catch(() => {});
}

/* ─── Monthly quota ──────────────────────────────────────────────────────────*/
function currentMonth() { return new Date().toISOString().slice(0, 7); }

const OWNER_EMAILS = new Set(
  (process.env.OWNER_EMAILS || "thinksuitesolution@gmail.com,info@Thinksuite.in,subscriptionaakash@gmail.com")
    .split(",").map(e => e.trim().toLowerCase()).filter(Boolean)
);

const _adminCache = new Map();
async function isAdmin(userId) {
  const hit = _adminCache.get(userId);
  if (hit && Date.now() < hit.expiresAt) return hit.value;
  try {
    const rec = await getAdmin().auth().getUser(userId);
    const email = rec.email?.toLowerCase();
    if (email && OWNER_EMAILS.has(email)) { _adminCache.set(userId, { value: true, expiresAt: Date.now() + 300_000 }); return true; }
    const snap = await getAdminDb().doc("config/admins").get();
    const admins = new Set(snap.exists ? (snap.data().emails || []).map(e => e.toLowerCase()) : []);
    const result = admins.has(email || "");
    _adminCache.set(userId, { value: result, expiresAt: Date.now() + 300_000 });
    return result;
  } catch { return false; }
}

async function checkQuota(userId) {
  if (!userId) return { ok: false, used: 0, remaining: 0 };
  try {
    if (await isAdmin(userId)) return { ok: true, used: 0, remaining: 999_999, unlimited: true };
    const db   = getAdminDb();
    const snap = await db.collection("groupFinderQuota").doc(userId).get();
    const used = snap.exists ? (snap.data()[currentMonth()] || 0) : 0;
    return { ok: used < MONTHLY_LIMIT, used, remaining: MONTHLY_LIMIT - used };
  } catch { return { ok: true, used: 0, remaining: MONTHLY_LIMIT }; }
}

// Atomically grants up to `count` slots against the monthly cap inside a single
// Firestore transaction, so concurrent requests can't both read the same "used"
// value and race past MONTHLY_LIMIT (the old read-then-write version could).
async function incrementQuota(userId, count) {
  if (!userId || count <= 0) return { granted: 0, used: 0, remaining: MONTHLY_LIMIT };
  try {
    if (await isAdmin(userId)) {
      const db  = getAdminDb();
      const ref = db.collection("groupFinderQuota").doc(userId);
      await ref.set({ [currentMonth()]: getAdmin().firestore.FieldValue.increment(count) }, { merge: true });
      return { granted: count, used: 0, remaining: 999_999, unlimited: true };
    }
    const db  = getAdminDb();
    const ref = db.collection("groupFinderQuota").doc(userId);
    let granted = 0, finalUsed = 0;
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const used = snap.exists ? (snap.data()[currentMonth()] || 0) : 0;
      granted   = Math.max(0, Math.min(count, MONTHLY_LIMIT - used));
      finalUsed = used + granted;
      if (granted > 0) tx.set(ref, { [currentMonth()]: finalUsed }, { merge: true });
    });
    return { granted, used: finalUsed, remaining: Math.max(0, MONTHLY_LIMIT - finalUsed) };
  } catch {
    return { granted: count, used: 0, remaining: MONTHLY_LIMIT };
  }
}

/* ─── URL normalizers ────────────────────────────────────────────────────────*/
function normalizeTelegram(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith("t.me")) return null;
    const parts = u.pathname.replace(/^\/s\//, "/").split("/").filter(Boolean);
    const seg = parts[0] || "";
    if (/^\+[A-Za-z0-9]{10,}$/.test(seg)) return `https://t.me/${seg}`;
    if (seg === "joinchat" && parts[1]) return `https://t.me/joinchat/${parts[1]}`;
    if (/^[A-Za-z][A-Za-z0-9_]{3,}$/.test(seg)) return `https://t.me/${seg}`;
    return null;
  } catch { return null; }
}

function normalizeFacebook(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("facebook.com")) return null;
    const m = u.pathname.match(/^\/groups\/([A-Za-z0-9._-]+)/);
    if (!m) return null;
    return `https://www.facebook.com/groups/${m[1]}/`;
  } catch { return null; }
}

function normalizeLinkedIn(url) {
  let m = url.match(/linkedin\.com\/groups\/([0-9]+)/);
  if (m) return `https://www.linkedin.com/groups/${m[1]}/`;
  m = url.match(/linkedin\.com\/groups\/([A-Za-z][A-Za-z0-9-]{2,})/);
  return m ? `https://www.linkedin.com/groups/${m[1]}/` : null;
}

/* ─── Instagram normalizers ──────────────────────────────────────────────────*/
const IG_SKIP = new Set([
  "p","reel","explore","accounts","stories","tv","reels","tags","about","help",
  "legal","privacy","press","api","directory","lite","developer","_api","hashtag",
  "blog","challenge","contact","email","favicon","graphql","healthcheck","icons",
  "image-proxy","logging","logout","oauth","robots","run","shareddata","slow-proxy",
  "static","switch","video","web","ar","nametag","your_activity","settings",
]);

function normalizeInstagramChannel(url) {
  const m = url.match(/instagram\.com\/channel\/([A-Za-z0-9_-]{5,})/);
  return m ? `https://www.instagram.com/channel/${m[1]}/` : null;
}

function normalizeInstagramProfile(url) {
  const m = url.match(/instagram\.com\/([a-zA-Z0-9._]{2,30})\/?(?:[?#]|$)/);
  if (!m) return null;
  const h = m[1].toLowerCase();
  if (IG_SKIP.has(h) || h.startsWith("channel")) return null;
  return `https://www.instagram.com/${m[1]}/`;
}

function normalizeUrl(url, platform) {
  switch (platform) {
    case "telegram":  return normalizeTelegram(url);
    case "facebook":  return normalizeFacebook(url);
    case "linkedin":  return normalizeLinkedIn(url);
    case "whatsapp": {
      // Reject community links - only real group invite links
      if (/\/community\//i.test(url)) return null;
      if (/wa\.me\//i.test(url)) return null; // individual contact, not group
      const m = url.match(/chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/);
      return m ? `https://chat.whatsapp.com/${m[1]}` : null;
    }
    default: return null;
  }
}

/* ─── Google Custom Search API ──────────────────────────────────────────────*/
async function googleCSESearch(query, start = 1) {
  if (!GOOGLE_KEY || !GOOGLE_CX) return [];
  const cacheKey = `cse:${query}:${start}`;
  const cached   = await cacheGet(cacheKey);
  if (cached) return cached;
  try {
    const clampedStart = Math.min(Math.max(1, start), 91);
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&num=10&start=${clampedStart}`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const data = await res.json();
    if (data.error) return [];
    const results = (data.items || []).map(r => ({ title: r.title || "", link: r.link || "", snippet: r.snippet || "" }));
    await cacheSet(cacheKey, results, SEARCH_CACHE_TTL);
    return results;
  } catch { return []; }
}

/* ─── Google Groups-dedicated CSE (separate API key + CX for groups) ────────*/
async function googleGroupsSearch(query, start = 1) {
  if (!GOOGLE_GROUPS_KEY || !GOOGLE_GROUPS_CX) return [];
  const cacheKey = `gcse_grp:${query}:${start}`;
  const cached   = await cacheGet(cacheKey);
  if (cached) return cached;
  try {
    const clampedStart = Math.min(Math.max(1, start), 91);
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_GROUPS_KEY}&cx=${GOOGLE_GROUPS_CX}&q=${encodeURIComponent(query)}&num=10&start=${clampedStart}`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const data = await res.json();
    if (data.error) return [];
    const results = (data.items || []).map(r => ({ title: r.title || "", link: r.link || "", snippet: r.snippet || "" }));
    await cacheSet(cacheKey, results, SEARCH_CACHE_TTL);
    return results;
  } catch { return []; }
}

/* ─── FREE: DDG fallback for group search ────────────────────────────────────*/
async function ddgGroupSearch(query, num = 10) {
  try {
    const body = new URLSearchParams({ q: query, b: "", kl: "in-en" });
    const res  = await fetch("https://html.duckduckgo.com/html/", {
      method: "POST",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Content-Type": "application/x-www-form-urlencoded", "Accept": "text/html", "Referer": "https://duckduckgo.com/" },
      body: body.toString(), signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const html  = await res.text();
    const snips = [...html.matchAll(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)].map(m => m[1].replace(/<[^>]+>/g,"").trim());
    const links = [...html.matchAll(/<h2[^>]*class="result__title"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    return links.slice(0, num).map((m, i) => {
      let url = m[1]; try { const u = new URL(m[1],"https://duckduckgo.com"); url = u.searchParams.get("uddg") ? decodeURIComponent(u.searchParams.get("uddg")) : m[1]; } catch {}
      return { title: m[2].replace(/<[^>]+>/g,"").trim(), link: url, snippet: snips[i]||"" };
    });
  } catch { return []; }
}

/* ─── Serper search ──────────────────────────────────────────────────────────*/
const DFS_LOC_GF = {
  in:2356,us:2840,gb:2826,au:2036,ca:2124,ae:2784,sg:2702,de:2276,fr:2250,
  nl:2528,it:2380,es:2724,br:2076,mx:2484,jp:2392,kr:2410,za:2710,sa:2682,
};

async function serperSearch(query, gl = "in", num = 10, tbs = null, page = 1) {
  const cacheKey = `serper:${gl}:${tbs || ""}:${page}:${query}`;
  const cached   = await cacheGet(cacheKey);
  if (cached) return cached;

  // Primary: DataForSEO
  const dfsLogin = process.env.DATAFORSEO_LOGIN;
  const dfsPass  = process.env.DATAFORSEO_PASSWORD;
  if (dfsLogin && dfsPass) {
    try {
      const auth = Buffer.from(`${dfsLogin}:${dfsPass}`).toString("base64");
      const res  = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/regular", {
        method:  "POST",
        headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify([{ keyword: query, location_code: DFS_LOC_GF[gl] || 2840, language_code: "en", device: "desktop", depth: num }]),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data  = await res.json();
        const items = (data.tasks?.[0]?.result?.[0]?.items || []).filter(i => i.type === "organic").slice(0, num);
        if (items.length > 0) {
          const results = items.map(i => ({ title: i.title, link: i.url, snippet: i.description || "" }));
          await cacheSet(cacheKey, results, SEARCH_CACHE_TTL);
          return results;
        }
      }
    } catch {}
  }

  const results = await ddgGroupSearch(query, num);
  if (results.length) await cacheSet(cacheKey, results, SEARCH_CACHE_TTL);
  return results;
}

/* ─── HTML helpers ───────────────────────────────────────────────────────────*/
function cleanHtmlText(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&[a-z]+;/g, "").replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ").trim().slice(0, 60);
}

function extractNameNearLink(html, linkCode) {
  const idx = html.indexOf(linkCode);
  if (idx === -1) return "";

  const before = html.slice(Math.max(0, idx - 700), idx);
  const headingRe = /<(?:h[1-4]|strong|b)(?:\s[^>]*)?>([^<]{4,70})<\/(?:h[1-4]|strong|b)>/gi;
  let last = null, m;
  while ((m = headingRe.exec(before)) !== null) last = m[1];
  if (last) return cleanHtmlText(last);

  const after = html.slice(idx, idx + 500);
  const classRe = /<[^>]+class="[^"]*(?:title|name|peer-title|channel-name|group-name)[^"]*"[^>]*>([^<]{4,70})</gi;
  while ((m = classRe.exec(after)) !== null) { last = m[1]; break; }
  if (last) return cleanHtmlText(last);

  const afterHeadRe = /<(?:h[1-4]|strong|b)(?:\s[^>]*)?>([^<]{4,70})<\/(?:h[1-4]|strong|b)>/gi;
  while ((m = afterHeadRe.exec(after)) !== null) { last = m[1]; break; }
  if (last) return cleanHtmlText(last);

  const nearBefore = html.slice(Math.max(0, idx - 250), idx);
  const tagRe = /<(?:li|p|span)(?:\s[^>]*)?>([^<]{4,60})<\/(?:li|p|span)>/gi;
  while ((m = tagRe.exec(nearBefore)) !== null) last = m[1];
  return last ? cleanHtmlText(last) : "";
}

function nameFromTelegramUrl(url) {
  const m = url.match(/t\.me\/([A-Za-z][A-Za-z0-9_]{3,})/);
  if (!m) return "";
  return m[1].replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

/* ─── Firecrawl scrape for Linktree / bio pages ──────────────────────────────
   These pages contain actual group links shared by community owners in their bio.
   Returns { waLinks, tgLinks, fbLinks, liLinks }
────────────────────────────────────────────────────────────────────────────── */
async function scrapeLinktreePage(pageUrl) {
  const result = { waLinks: [], tgLinks: [], fbLinks: [], liLinks: [] };
  if (!FIRECRAWL_KEY || !pageUrl?.startsWith("http")) return result;
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method:  "POST",
      headers: { Authorization: `Bearer ${FIRECRAWL_KEY}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ url: pageUrl, formats: ["markdown"], onlyMainContent: false }),
      signal:  AbortSignal.timeout(12000),
    });
    const d = await res.json();
    if (!d.success) return result;
    const text = d.data?.markdown || "";

    // WhatsApp groups only (exclude community/)
    for (const m of text.matchAll(/chat\.whatsapp\.com\/(?!community\/)([A-Za-z0-9]{10,})/g)) {
      result.waLinks.push(`https://chat.whatsapp.com/${m[1]}`);
    }
    // Telegram groups (invite links only)
    for (const m of text.matchAll(/t\.me\/((?:\+[A-Za-z0-9]{10,}|joinchat\/[A-Za-z0-9_-]+))/g)) {
      result.tgLinks.push(`https://t.me/${m[1]}`);
    }
    // Facebook groups
    for (const m of text.matchAll(/facebook\.com\/groups\/([A-Za-z0-9._-]+)\/?/g)) {
      result.fbLinks.push(`https://www.facebook.com/groups/${m[1]}/`);
    }
    // LinkedIn groups
    for (const m of text.matchAll(/linkedin\.com\/groups\/([0-9A-Za-z-]+)\/?/g)) {
      result.liLinks.push(`https://www.linkedin.com/groups/${m[1]}/`);
    }
  } catch {}
  return result;
}

/* ─── Find all group links from Linktree / bio link pages in niche ───────────*/
async function findGroupsFromBioPages(niche, loc, gl, platform) {
  const locStr = loc ? ` "${loc}"` : "";
  const platformQ = platform === "whatsapp"
    ? `"chat.whatsapp.com" OR "whatsapp group"`
    : platform === "telegram"
    ? `"t.me/+" OR "telegram group"`
    : platform === "facebook"
    ? `"facebook.com/groups"`
    : platform === "linkedin"
    ? `"linkedin.com/groups"`
    : `"whatsapp" OR "telegram" OR "facebook group" OR "linkedin group"`;

  // Search for bio pages (Linktree, bio.link, beacons.ai, taplink) that contain group links
  const queries = [
    `site:linktr.ee "${niche}"${locStr}`,
    `site:bio.link "${niche}"${locStr} group`,
    `site:beacons.ai "${niche}"${locStr} group`,
    `"linktr.ee" "${niche}"${locStr} ${platformQ}`,
    `"${niche}"${locStr} linktree ${platformQ} join`,
  ];

  const searchResults = await Promise.allSettled(
    queries.map(q => serperSearch(q, gl, 8))
  );

  const pagesToScrape = new Set();
  for (const r of searchResults) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (item.link && (
        item.link.includes("linktr.ee") ||
        item.link.includes("bio.link") ||
        item.link.includes("beacons.ai") ||
        item.link.includes("taplink") ||
        // Also scrape any page that mentions group links in snippet
        /chat\.whatsapp\.com|t\.me\/\+|facebook\.com\/groups|linkedin\.com\/groups/i.test(item.snippet + item.link)
      )) {
        pagesToScrape.add(item.link);
      }
    }
  }

  const allLinks = { waLinks: [], tgLinks: [], fbLinks: [], liLinks: [] };
  if (pagesToScrape.size === 0) return allLinks;

  const scraped = await Promise.allSettled(
    [...pagesToScrape].slice(0, 10).map(url => scrapeLinktreePage(url))
  );

  for (const s of scraped) {
    if (s.status !== "fulfilled") continue;
    allLinks.waLinks.push(...s.value.waLinks);
    allLinks.tgLinks.push(...s.value.tgLinks);
    allLinks.fbLinks.push(...s.value.fbLinks);
    allLinks.liLinks.push(...s.value.liLinks);
  }

  // Deduplicate
  allLinks.waLinks = [...new Set(allLinks.waLinks)];
  allLinks.tgLinks = [...new Set(allLinks.tgLinks)];
  allLinks.fbLinks = [...new Set(allLinks.fbLinks)];
  allLinks.liLinks = [...new Set(allLinks.liLinks)];

  return allLinks;
}

/* ─── Page scrapers ──────────────────────────────────────────────────────────*/
async function fetchWaLinksWithNames(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal:  AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const html  = await res.text();
    const WA_RE = /chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/g;
    const found = new Map();
    let m;
    while ((m = WA_RE.exec(html)) !== null) {
      if (!found.has(m[1])) found.set(m[1], { url: `https://chat.whatsapp.com/${m[1]}`, name: extractNameNearLink(html, m[0]) });
    }
    return [...found.values()];
  } catch { return []; }
}

async function fetchTelegramLinksWithNames(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal:  AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const html  = await res.text();
    const TG_RE = /https?:\/\/t\.me\/((?:\+[A-Za-z0-9]{10,}|joinchat\/[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_]{3,}))/g;
    const found = new Map();
    let m;
    while ((m = TG_RE.exec(html)) !== null) {
      const url = `https://t.me/${m[1]}`;
      if (!found.has(url)) found.set(url, { url, name: extractNameNearLink(html, m[0]) || nameFromTelegramUrl(url) });
    }
    return [...found.values()];
  } catch { return []; }
}

async function fetchWaArticleUrls(searchUrl, hostname) {
  try {
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal:  AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const hostEsc = hostname.replace(/\./g, "\\.");
    const RE = new RegExp(`href="(https://${hostEsc}/[a-z0-9][a-z0-9-]{4,}/?)(?:[?"][^"]*)?"`,"g");
    const urls = new Set();
    let m;
    while ((m = RE.exec(html)) !== null) {
      const u = m[1];
      if (!/\/(page|category|tag|author|wp-|feed|search|submit|channel)/.test(u)) urls.add(u);
    }
    return [...urls].slice(0, 5);
  } catch { return []; }
}

/* ─── Instagram page scraper ────────────────────────────────────────────────*/
async function fetchInstagramLinks(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal:  AbortSignal.timeout(10000),
    });
    if (!res.ok) return { channels: [], profiles: [] };
    const html = await res.text();
    const channels = [...new Set(
      [...html.matchAll(/instagram\.com\/channel\/([A-Za-z0-9_-]{5,})/g)]
        .map(m => `https://www.instagram.com/channel/${m[1]}/`)
    )];
    const profiles = [...new Set(
      [...html.matchAll(/instagram\.com\/([a-zA-Z0-9._]{2,30})\/?(?:[?#"'>\s]|$)/g)]
        .map(m => ({ raw: m[1], lower: m[1].toLowerCase() }))
        .filter(({ lower }) => !IG_SKIP.has(lower) && !lower.startsWith("channel"))
        .map(({ raw }) => `https://www.instagram.com/${raw}/`)
    )];
    return { channels, profiles };
  } catch { return { channels: [], profiles: [] }; }
}

/* ─── Snippet extractors ─────────────────────────────────────────────────────*/
function extractWaLinksFromSerper(results) {
  // Negative lookahead: exclude /community/ paths
  const RE = /chat\.whatsapp\.com\/(?!community\/)([A-Za-z0-9]{10,})/g;
  const links = [];
  for (const r of results) {
    const text = `${r.link} ${r.snippet || ""}`;
    RE.lastIndex = 0; let m;
    while ((m = RE.exec(text)) !== null) {
      const url = `https://chat.whatsapp.com/${m[1]}`;
      links.push(url);
    }
  }
  return links;
}

function extractTelegramLinksFromSerper(results) {
  const RE = /t\.me\/((?:\+[A-Za-z0-9]{10,}|joinchat\/[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_]{3,}))/g;
  const links = [];
  for (const r of results) {
    const text = `${r.link} ${r.snippet || ""}`;
    RE.lastIndex = 0; let m;
    while ((m = RE.exec(text)) !== null) links.push(`https://t.me/${m[1]}`);
  }
  return links;
}

function extractInstagramLinksFromSerper(results) {
  const channels = [];
  const profiles = [];
  for (const r of results) {
    const text = `${r.link} ${r.snippet || ""}`;
    for (const m of text.matchAll(/instagram\.com\/channel\/([A-Za-z0-9_-]{5,})/g)) {
      channels.push(`https://www.instagram.com/channel/${m[1]}/`);
    }
    const pm = r.link.match(/instagram\.com\/([a-zA-Z0-9._]{2,30})\/?(?:[?#]|$)/);
    if (pm && !IG_SKIP.has(pm[1].toLowerCase()) && !pm[1].toLowerCase().startsWith("channel")) {
      profiles.push(`https://www.instagram.com/${pm[1]}/`);
    }
  }
  return { channels, profiles };
}

/* ─── WA link status checker ─────────────────────────────────────────────────
   Returns:
     "open"    freely joinable right now (Join Group button present)
     "request" group exists but requires admin approval to join (skip these)
     "invalid" link expired / revoked / dead
     "unknown" couldn't determine (treat as suspicious, skip)
─────────────────────────────────────────────────────────────────────────────*/
/* WhatsApp invite pages serve og:title with the real group name for valid groups (for social
   sharing previews). Expired/invalid links serve a generic "WhatsApp" or "Group Chat Invite"
   title. Additional reliable signals:
   1. Redirect away from chat.whatsapp.com → definitely dead
   2. Explicit error text in HTML → definitely dead
   3. Generic og:title ("WhatsApp", "Group Chat Invite") → expired/invalid
   4. Real group name in og:title → confirmed active group */
async function checkWaLinkStatus(inviteUrl) {
  const cacheKey = `wa:${inviteUrl}`;
  const cached   = await cacheGet(cacheKey);
  if (cached) return cached;
  try {
    const res = await fetch(inviteUrl, {
      headers: {
        "User-Agent":      "Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
        "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal:   AbortSignal.timeout(8000),
      redirect: "follow",
    });

    // If WhatsApp redirected to main site → link is dead
    const finalUrl = res.url || "";
    if (!finalUrl.includes("chat.whatsapp.com")) {
      const r = { status: "invalid", name: "" };
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }

    if (!res.ok) {
      const r = { status: "invalid", name: "" };
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }

    const html = await res.text();

    // Explicit error signals (expanded patterns)
    if (/invalid|revoked|expired|no longer valid|link not found|does not exist|link isn.t valid|invite link has expired|link you followed|couldn.t find this/i.test(html)) {
      const r = { status: "invalid", name: "" };
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }

    // Extract og:title - valid WA groups show the real group name here for social sharing
    const titleMatch = html.match(/<meta\s[^>]*property="og:title"[^>]*content="([^"]+)"/i)
                    || html.match(/<meta\s[^>]*content="([^"]+)"[^>]*property="og:title"/i);
    const ogTitle = titleMatch?.[1]?.trim() || "";

    // Generic/error titles → expired or invalid link
    if (ogTitle && /^WhatsApp$|^Group Chat Invite$|^WhatsApp Group$|^Join Group$/i.test(ogTitle)) {
      const r = { status: "invalid", name: "" };
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }

    // Real group name MUST be present in og:title for us to confirm the link is active.
    // An empty og:title is ambiguous - WhatsApp sometimes serves no title for expired links
    // without an explicit error string, so we treat missing title as "unknown" not "open".
    if (!ogTitle || ogTitle.length <= 2) {
      const r = { status: "unknown", name: "" };
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }
    const r = { status: "open", name: ogTitle };
    await cacheSet(cacheKey, r, LINK_CACHE_TTL);
    return r;
  } catch {
    pushDlq(inviteUrl, "whatsapp");
    return { status: "unknown", name: "" };
  }
}

/* ─── Telegram link checker ──────────────────────────────────────────────────
   t.me pages ARE server-side rendered tgme_page_title + Join text are in HTML.
   Returns { valid: true/false, memberCount: number|null }
─────────────────────────────────────────────────────────────────────────────*/
async function checkTelegramLink(url) {
  const cacheKey = `tg:${url}`;
  const cached   = await cacheGet(cacheKey);
  if (cached) return cached;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal:   AbortSignal.timeout(5000),
      redirect: "follow",
    });
    if (!res.ok) return { valid: false, memberCount: null };
    const html = await res.text();
    if (/Channel\s+not\s+found|Invite\s+link\s+invalid|This\s+channel\s+can.*private|link\s+(has\s+)?expired|no\s+longer\s+valid|link\s+is\s+not\s+valid|Invalid\s+(invite\s+)?link|couldn.t\s+find|This\s+invite\s+link\s+has|join\s+request.*expired/i.test(html)) {
      const r = { valid: false, memberCount: null };
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }
    // Must have page title AND at least one actionable element (join button or member count)
    if (!html.includes("tgme_page_title") || (!html.includes("tgme_page_action") && !html.match(/members?|subscribers?/i))) {
      const r = { valid: false, memberCount: null };
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }
    const m = html.match(/([\d,.]+[kKmM]?)\s+(members?|subscribers?)/i);
    let memberCount = null;
    let isGroup = true; // default assume group; channels have "subscribers"
    if (m) {
      const raw = m[1].toLowerCase().replace(/,/g, "");
      memberCount = raw.endsWith("k") ? Math.round(parseFloat(raw) * 1000)
        : raw.endsWith("m") ? Math.round(parseFloat(raw) * 1_000_000)
        : parseInt(raw, 10) || null;
      isGroup = /members?/i.test(m[2]); // "members" = group, "subscribers" = channel
    }
    const r = { valid: true, memberCount, isGroup };
    await cacheSet(cacheKey, r, LINK_CACHE_TTL);
    return r;
  } catch {
    pushDlq(url, "telegram");
    return { valid: false, memberCount: null };
  }
}

/* ─── Facebook group verifier ────────────────────────────────────────────────
   Uses Facebook's own crawler UA - public groups serve the real group name in
   og:title. Private/deleted/login-required groups return a generic "Facebook"
   or "Facebook – Log In or Sign Up" title.
   Returns: "public" | "private" | "unknown"
─────────────────────────────────────────────────────────────────────────────*/
async function checkFacebookGroup(groupUrl) {
  const cacheKey = `fb:${groupUrl}`;
  const cached   = await cacheGet(cacheKey);
  if (cached) return cached;
  try {
    const res = await fetch(groupUrl, {
      // facebookexternalhit is Facebook's own link-preview crawler; public groups serve full OG tags to it
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept":     "text/html,application/xhtml+xml",
      },
      signal:   AbortSignal.timeout(8000),
      redirect: "follow",
    });

    // Redirected away from facebook.com → group dead or login required
    const finalUrl = res.url || "";
    if (!finalUrl.includes("facebook.com")) {
      await cacheSet(cacheKey, "private", LINK_CACHE_TTL);
      return "private";
    }
    if (!res.ok) {
      const r = res.status === 404 ? "private" : "unknown";
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }

    const html     = await res.text();
    const titleM   = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)
                  || html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:title"/i);
    const ogTitle  = titleM?.[1]?.trim() || "";

    // Generic titles served for private/deleted groups
    if (!ogTitle || /^Facebook$|^Facebook\s*[-–]|Log\s+[Ii]n\s+or\s+Sign\s+[Uu]p|Sign\s+[Uu]p\s+for/i.test(ogTitle)) {
      await cacheSet(cacheKey, "private", LINK_CACHE_TTL);
      return "private";
    }

    await cacheSet(cacheKey, "public", LINK_CACHE_TTL);
    return "public";
  } catch {
    return "unknown";
  }
}

/* ─── LinkedIn group verifier ────────────────────────────────────────────────
   LinkedIn redirects deleted/private groups to /authwall or /login.
   Public groups serve the group name in og:title.
   Returns: "public" | "private" | "unknown"
─────────────────────────────────────────────────────────────────────────────*/
async function checkLinkedInGroup(groupUrl) {
  const cacheKey = `li:${groupUrl}`;
  const cached   = await cacheGet(cacheKey);
  if (cached) return cached;
  try {
    const res = await fetch(groupUrl, {
      headers: {
        "User-Agent": "LinkedInBot/1.0 (compatible; +http://www.linkedin.com/)",
        "Accept":     "text/html,application/xhtml+xml",
      },
      signal:   AbortSignal.timeout(8000),
      redirect: "follow",
    });

    // Redirect to authwall/login → group deleted or private
    const finalUrl = res.url || "";
    if (/\/authwall|\/login|\/uas\/login/i.test(finalUrl)) {
      await cacheSet(cacheKey, "private", LINK_CACHE_TTL);
      return "private";
    }
    if (!res.ok) {
      const r = res.status === 404 ? "private" : "unknown";
      await cacheSet(cacheKey, r, LINK_CACHE_TTL);
      return r;
    }

    const html    = await res.text();
    const titleM  = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)
                 || html.match(/<title[^>]*>([^<]{5,})<\/title>/i);
    const ogTitle = titleM?.[1]?.trim() || "";

    if (!ogTitle || /^LinkedIn$|^Sign\s+[Ii]n|^Log\s+[Ii]n/i.test(ogTitle)) {
      await cacheSet(cacheKey, "private", LINK_CACHE_TTL);
      return "private";
    }

    await cacheSet(cacheKey, "public", LINK_CACHE_TTL);
    return "public";
  } catch {
    return "unknown";
  }
}

/* ─── WhatsApp ───────────────────────────────────────────────────────────────*/
async function findWhatsAppGroups(niche, loc, gl, excludeSet, tbs, searchPage = 1) {
  const seen    = new Set(excludeSet);
  const links   = [];
  const nameMap = new Map();
  const qLoc = encodeURIComponent(loc ? `${niche} ${loc}` : niche);
  const isIndia = !loc || loc === "India";
  const indiaExclude = isIndia ? "" : ` -India -indian`;

  const addWaLink = (url, name = "") => {
    const clean = normalizeUrl(url, "whatsapp");
    if (!clean || seen.has(clean)) return;
    seen.add(clean); links.push(clean);
    if (name) nameMap.set(clean, name);
  };

  const [
    wg, waIn, wt, wl,
    listRes, bestRes, igRes,
    grpRes1, grpRes2,
    globalListRes, globalBestRes,
    linktreeRes,
  ] = await Promise.allSettled([
    fetchWaArticleUrls(`https://whatgroups.com/?s=${qLoc}`,     "whatgroups.com"),
    isIndia ? fetchWaArticleUrls(`https://wagroups.in/?s=${qLoc}`,       "wagroups.in")       : Promise.resolve([]),
    fetchWaArticleUrls(`https://whatsapptopic.com/?s=${qLoc}`,  "whatsapptopic.com"),
    isIndia ? fetchWaArticleUrls(`https://whtsgruplinks.com/?s=${qLoc}`, "whtsgruplinks.com") : Promise.resolve([]),
    serperSearch(`"whatsapp group" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join invite link`, gl, 8, tbs, searchPage),
    serperSearch(`"whatsapp group links" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join`, gl, 8, tbs, searchPage),
    serperSearch(`site:instagram.com "chat.whatsapp.com" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`, gl, 10, tbs, searchPage),
    googleGroupsSearch(`"chat.whatsapp.com" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`),
    googleGroupsSearch(`whatsapp group "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join link`),
    !isIndia ? serperSearch(`"whatsapp group" "${niche}"${indiaExclude} join invite link`, "us", 8, tbs, searchPage) : Promise.resolve([]),
    !isIndia ? googleGroupsSearch(`whatsapp group "${niche}" join members international${indiaExclude}`) : Promise.resolve([]),
    // Linktree / bio pages search - find real group links shared in bios
    findGroupsFromBioPages(niche, loc, gl, "whatsapp"),
  ]);

  const pagesToScrape = new Set([
    ...(wg.status  === "fulfilled" ? wg.value  : []),
    ...(waIn.status === "fulfilled" ? waIn.value: []),
    ...(wt.status  === "fulfilled" ? wt.value  : []),
    ...(wl.status  === "fulfilled" ? wl.value  : []),
  ]);

  for (const r of [listRes, bestRes, igRes, grpRes1, grpRes2, globalListRes, globalBestRes]) {
    if (r.status !== "fulfilled") continue;
    for (const l of extractWaLinksFromSerper(r.value)) addWaLink(l);
    for (const item of r.value) {
      if (!item.link.includes("whatsapp.com") && pagesToScrape.size < 10) pagesToScrape.add(item.link);
    }
  }

  // Inject Linktree / bio-page discovered WA links
  if (linktreeRes.status === "fulfilled" && linktreeRes.value?.waLinks) {
    for (const url of linktreeRes.value.waLinks) addWaLink(url);
  }

  if (pagesToScrape.size > 0) {
    const scraped = await Promise.allSettled([...pagesToScrape].slice(0, 10).map(fetchWaLinksWithNames));
    for (const s of scraped) {
      if (s.status !== "fulfilled") continue;
      for (const { url, name } of s.value) addWaLink(url, name);
    }
  }

  // Verify collected links only keep "open" (freely joinable) groups.
  const verified       = [];
  const explicitlyBad  = new Set(); // links confirmed invalid/expired never show these
  const toCheck        = links.slice(0, 20);

  const checkJobs = toCheck.map(url =>
    checkWaLinkStatus(url).catch(() => ({ status: "unknown", name: "" }))
  );
  const checkResults = await Promise.allSettled(checkJobs);

  for (let i = 0; i < checkResults.length; i++) {
    if (verified.length >= PER_PLATFORM) break;
    const r = checkResults[i];
    if (r.status !== "fulfilled") continue;
    const { status, name } = r.value;
    if (status === "invalid") { explicitlyBad.add(toCheck[i]); continue; }
    if (status === "request")  { explicitlyBad.add(toCheck[i]); continue; }
    if (status !== "open") continue;
    const url = toCheck[i];
    if (name && !nameMap.has(url)) nameMap.set(url, name);
    verified.push(url);
  }

  // Only return verified "open" links - never return unverified/unknown links
  if (verified.length === 0) return [];

  return verified.map((url, i) => {
    const resolvedName = nameMap.get(url);
    return {
      platform:      "whatsapp",
      name:          resolvedName || `${niche} WhatsApp Group ${i + 1}`,
      url,
      description:   "WhatsApp group invite link - click Join to enter. If the link has expired, admin may have reset it; use ❌ Remove and try the next one.",
      isDirectLink:  true,
      isMayExpire:   true,
      isVerified:    !!resolvedName, // true only if we confirmed real group name from WA servers
      isAiSuggested: false,
      status:        "active",
      country_hint:  isIndia ? "India" : (loc || "International"),
    };
  });
}

/* ─── Telegram ───────────────────────────────────────────────────────────────*/
async function findTelegramGroups(niche, loc, gl, excludeSet, tbs, searchPage = 1) {
  const seen   = new Set(excludeSet);
  const groups = [];
  const q    = encodeURIComponent(niche);
  const qLoc = encodeURIComponent(loc ? `${niche} ${loc}` : niche);

  const addTgGroup = (url, name = "", description = "") => {
    const n = normalizeTelegram(url);
    if (!n || seen.has(n)) return;
    seen.add(n);
    groups.push({ url: n, name: name || nameFromTelegramUrl(n) || `${niche} Telegram Group`, description });
  };

  const isIndia = !loc || loc === "India";
  const indiaExclude = isIndia ? "" : ` -India -indian`;
  const cseStart = (searchPage - 1) * 10 + 1;
  const [cseRes, grpTgRes] = await Promise.allSettled([
    googleCSESearch(`site:t.me "${niche}" group${loc ? ` "${loc}"` : ""}${indiaExclude}`, cseStart),
    googleGroupsSearch(`telegram group "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join members`),
  ]);
  for (const r of (cseRes.status === "fulfilled" ? cseRes.value : [])) {
    const cleanName = r.title.replace(/\s*[|\-–]\s*(Telegram|Channel|Group|Bot).*/i, "").trim();
    addTgGroup(r.link, cleanName || "", r.snippet);
  }
  for (const r of (grpTgRes.status === "fulfilled" ? grpTgRes.value : [])) {
    addTgGroup(r.link, r.title, r.snippet || "");
  }

  const [
    tgstatLoc, tgstatQ, tgchLoc, tgchQ,
    serperDirect,
    listRes, igRes,
    globalTgRes,
    tgLinktreeRes,
  ] = await Promise.allSettled([
    fetchTelegramLinksWithNames(`https://tgstat.com/search?q=${qLoc}`),
    fetchTelegramLinksWithNames(`https://tgstat.com/search?q=${q}`),
    fetchTelegramLinksWithNames(`https://telegramchannels.me/search?query=${qLoc}&language=en`),
    fetchTelegramLinksWithNames(`https://telegramchannels.me/search?query=${q}&language=en`),
    serperSearch(`site:t.me "${niche}" group${loc ? ` "${loc}"` : ""}${indiaExclude}`, gl, 15, tbs, searchPage),
    serperSearch(`"telegram group" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join members`, gl, 8, tbs),
    serperSearch(`site:instagram.com "t.me" "${niche}" group join${indiaExclude}`, gl, 10, tbs),
    !isIndia ? serperSearch(`site:t.me "${niche}" group OR channel members${indiaExclude}`, "us", 10, tbs, searchPage) : Promise.resolve([]),
    // Linktree / bio pages for Telegram groups
    findGroupsFromBioPages(niche, loc, gl, "telegram"),
  ]);

  for (const r of [tgstatLoc, tgstatQ, tgchLoc, tgchQ]) {
    if (r.status !== "fulfilled") continue;
    for (const { url, name } of r.value) addTgGroup(url, name);
    if (groups.length >= PER_PLATFORM * 2) break;
  }
  if (serperDirect.status === "fulfilled") {
    for (const r of serperDirect.value) addTgGroup(r.link, r.title, r.snippet || "");
  }
  if (globalTgRes.status === "fulfilled") {
    for (const r of globalTgRes.value) addTgGroup(r.link, r.title, r.snippet || "");
  }

  const pagesToScrape = new Set();
  for (const r of [listRes, igRes]) {
    if (r.status !== "fulfilled") continue;
    for (const l of extractTelegramLinksFromSerper(r.value)) addTgGroup(l);
    for (const item of r.value) {
      if (!item.link.includes("t.me/") && pagesToScrape.size < 8) pagesToScrape.add(item.link);
    }
  }

  if (pagesToScrape.size > 0) {
    const scraped = await Promise.allSettled([...pagesToScrape].slice(0, 8).map(fetchTelegramLinksWithNames));
    for (const s of scraped) {
      if (s.status !== "fulfilled") continue;
      for (const { url, name } of s.value) addTgGroup(url, name);
      if (groups.length >= PER_PLATFORM * 2) break;
    }
  }

  // Inject Linktree / bio-page discovered Telegram GROUP invite links
  if (tgLinktreeRes.status === "fulfilled" && tgLinktreeRes.value?.tgLinks) {
    for (const url of tgLinktreeRes.value.tgLinks) addTgGroup(url, "", "Found via bio/linktree page");
  }

  if (groups.length === 0) return [];

  // Verify top candidates t.me pages are SSR so this check is reliable
  const candidates = groups.slice(0, PER_PLATFORM * 2);
  const checks = await Promise.allSettled(candidates.map(g => checkTelegramLink(g.url)));

  const verified = [];
  const verifiedChannels = [];
  for (let i = 0; i < checks.length; i++) {
    const r = checks[i];
    if (r.status !== "fulfilled" || !r.value.valid) continue;
    const g = candidates[i];
    const entry = {
      platform:     "telegram",
      name:         g.name,
      url:          g.url,
      description:  g.description || (r.value.memberCount ? `${r.value.memberCount.toLocaleString()} members` : "Telegram Group"),
      memberCount:  r.value.memberCount,
      isGroup:      r.value.isGroup,
      isDirectLink: true, isAiSuggested: false, status: "active",
      country_hint: isIndia ? "India" : (loc || "International"),
    };
    if (r.value.isGroup) verified.push(entry);
    else verifiedChannels.push(entry);
    if (verified.length >= PER_PLATFORM) break;
  }

  // Return groups first. Only fill remaining slots with channels if we have < 3 groups -
  // channels are one-way broadcasts (not communities) so we deprioritise them.
  const needChannels = verified.length < 3;
  const combined = needChannels
    ? [...verified, ...verifiedChannels].slice(0, PER_PLATFORM)
    : verified.slice(0, PER_PLATFORM);
  return combined.map(g => ({ ...g, isVerified: true }));
}

/* ─── Facebook Groups (enhanced) ────────────────────────────────────────────*/
async function findFacebookGroups(niche, loc, gl, excludeSet, tbs, searchPage = 1) {
  const seen    = new Set(excludeSet);
  const results = [];
  const isIndia = !loc || loc === "India";
  const indiaExclude = isIndia ? "" : ` -India -indian`;

  const addResult = (link, title, snippet) => {
    const normalized = normalizeFacebook(link);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    const cleanTitle = (title || "")
      .replace(/\s*[-–|]\s*Facebook.*/i, "")
      .replace(/Facebook\s+Group.*/i, "")
      .trim();
    // Extract member count hint from snippet
    const memberMatch = (snippet || "").match(/(\d[\d,]+)\s+members?/i);
    results.push({
      platform:      "facebook",
      name:          cleanTitle || `${niche} Facebook Group`,
      url:           normalized,
      description:   snippet || "Facebook Group",
      memberCount:   memberMatch ? parseInt(memberMatch[1].replace(/,/g, "")) : null,
      isDirectLink:  true,
      isAiSuggested: false,
      status:        "active",
      country_hint:  isIndia ? "India" : (loc || "International"),
    });
  };

  // Primary: both CSE instances in parallel ensures results even when Serper is rate-limited
  const cseStart = (searchPage - 1) * 10 + 1;
  const [cseRes, grpFbRes] = await Promise.allSettled([
    googleCSESearch(`site:facebook.com/groups "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`, cseStart),
    googleGroupsSearch(`facebook group "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join members`),
  ]);
  for (const r of (cseRes.status === "fulfilled" ? cseRes.value : [])) addResult(r.link, r.title, r.snippet);
  for (const r of (grpFbRes.status === "fulfilled" ? grpFbRes.value : [])) addResult(r.link, r.title, r.snippet);

  const queries = [
    `site:facebook.com/groups "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`,
    `site:facebook.com/groups ${niche}${loc ? ` ${loc}` : ""}${indiaExclude} members join`,
    `"facebook.com/groups" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join members`,
    `"join our facebook group" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`,
    `"${niche}" facebook group${loc ? ` "${loc}"` : ""}${indiaExclude} join link members`,
  ];

  const allSearches = await Promise.allSettled(
    queries.map(q => serperSearch(q, gl, 10, tbs, searchPage))
  );

  for (const r of allSearches) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (item.link.includes("facebook.com/groups")) {
        addResult(item.link, item.title, item.snippet);
      } else {
        // Extract FB group URL embedded in snippet
        const fbMatch = (item.snippet || "").match(/facebook\.com\/groups\/([A-Za-z0-9._-]+)/);
        if (fbMatch) addResult(`https://www.facebook.com/groups/${fbMatch[1]}/`, item.title, item.snippet);
      }
    }
    if (results.length >= PER_PLATFORM * 2) break;
  }

  // Linktree / bio pages for Facebook groups
  try {
    const ltFb = await findGroupsFromBioPages(niche, loc, gl, "facebook");
    for (const url of (ltFb.fbLinks || [])) addResult(url, "", "Found via bio/linktree page");
  } catch {}

  if (results.length === 0) return [];

  // Quality pre-filter: prefer numeric-ID groups (stable) and those with member count evidence
  const withEvidence = results.filter(r => {
    const hasNumericId   = /\/groups\/\d{6,}/.test(r.url);
    const hasMemberCount = r.memberCount !== null && r.memberCount > 0;
    const hasRealName    = r.name.length > 5 && !/^(Buy|Sell|Free|India|Group|Facebook)\s*\d*$/i.test(r.name);
    return (hasNumericId || hasMemberCount) && hasRealName;
  });

  const pool = withEvidence.length >= 3 ? withEvidence : results;
  pool.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
  const candidates = pool.slice(0, PER_PLATFORM * 2);

  // Verify top candidates: fetch og:title to confirm group is public, not deleted/private
  const checks = await Promise.allSettled(
    candidates.map(g => checkFacebookGroup(g.url))
  );

  const verified = [];
  for (let i = 0; i < candidates.length; i++) {
    if (verified.length >= PER_PLATFORM) break;
    const r = checks[i];
    if (r.status !== "fulfilled") continue;
    const result = r.value;
    if (result === "private") continue; // deleted or requires login
    // "unknown" means we couldn't verify - include it with a note, but deprioritise
    verified.push({ ...candidates[i], isVerified: result === "public" });
  }

  // Sort: verified groups first, then unknowns, all by member count
  verified.sort((a, b) => {
    if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
    return (b.memberCount || 0) - (a.memberCount || 0);
  });

  return verified;
}

/* ─── LinkedIn Groups (enhanced) ─────────────────────────────────────────────*/
async function findLinkedInGroups(niche, loc, gl, excludeSet, tbs, searchPage = 1) {
  const seen    = new Set(excludeSet);
  const results = [];
  const isIndia = !loc || loc === "India";
  const indiaExclude = isIndia ? "" : ` -India -indian`;

  const pushGroup = (url, title, snippet) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    const cleanTitle = (title || "")
      .replace(/\s*[-–|]\s*LinkedIn.*/i, "")
      .replace(/\s*\|\s*LinkedIn.*/i, "")
      .trim();
    const memberMatch = (snippet || "").match(/(\d[\d,]+)\s+members?/i);
    results.push({
      platform:      "linkedin",
      name:          cleanTitle || `${niche} LinkedIn Group`,
      url,
      description:   snippet || "LinkedIn professional networking group",
      memberCount:   memberMatch ? parseInt(memberMatch[1].replace(/,/g, "")) : null,
      isDirectLink:  true,
      isAiSuggested: false,
      status:        "active",
      country_hint:  isIndia ? "India" : (loc || "International"),
    });
  };

  // Extract LinkedIn group URLs from both the link field AND snippet text
  // (LinkedIn group pages are often blocked from indexing, but URLs appear in snippets)
  const addResult = (link, title, snippet) => {
    const fromLink = normalizeLinkedIn(link || "");
    if (fromLink) pushGroup(fromLink, title, snippet);

    // Also scan snippet + title for linkedin.com/groups/... patterns
    const combined = `${title || ""} ${snippet || ""}`;
    const matches = combined.match(/linkedin\.com\/groups\/([0-9]+|[A-Za-z][A-Za-z0-9_-]{2,})/gi) || [];
    for (const m of matches) {
      const normalized = normalizeLinkedIn(`https://www.${m}`);
      if (normalized) pushGroup(normalized, title, snippet);
    }
  };

  // Primary: both CSE instances in parallel
  const cseStart = (searchPage - 1) * 10 + 1;
  const [cseRes, grpLiRes] = await Promise.allSettled([
    googleCSESearch(`site:linkedin.com/groups "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`, cseStart),
    googleGroupsSearch(`linkedin group "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} professionals members`),
  ]);
  for (const r of (cseRes.status === "fulfilled" ? cseRes.value : [])) addResult(r.link, r.title, r.snippet);
  for (const r of (grpLiRes.status === "fulfilled" ? grpLiRes.value : [])) addResult(r.link, r.title, r.snippet);

  const queries = [
    `site:linkedin.com/groups "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`,
    `"linkedin.com/groups" "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude}`,
    `best linkedin groups "${niche}"${loc ? ` ${loc}` : ""}${indiaExclude}`,
    `linkedin group "${niche}"${loc ? ` "${loc}"` : ""}${indiaExclude} join members`,
    `"${niche}" linkedin group members professionals join${indiaExclude}`,
    `linkedin community "${niche}"${loc ? ` ${loc}` : ""}${indiaExclude} group link`,
  ];

  const allSearches = await Promise.allSettled(
    queries.map(q => serperSearch(q, gl, 10, tbs, searchPage))
  );

  for (const r of allSearches) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) addResult(item.link, item.title, item.snippet);
    if (results.length >= PER_PLATFORM * 2) break;
  }

  if (results.length === 0) return [];

  // Sort by member count before verification so we check the best candidates first
  results.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
  const candidates = results.slice(0, PER_PLATFORM * 2);

  // Verify: LinkedIn redirects deleted/private groups to authwall → we can detect this
  const checks = await Promise.allSettled(
    candidates.map(g => checkLinkedInGroup(g.url))
  );

  const verified = [];
  for (let i = 0; i < candidates.length; i++) {
    if (verified.length >= PER_PLATFORM) break;
    const r = checks[i];
    if (r.status !== "fulfilled") continue;
    const result = r.value;
    if (result === "private") continue; // deleted or requires login - skip
    verified.push({ ...candidates[i], isVerified: result === "public" });
  }

  return verified;
}

/* ─── Instagram Communities & Channels ──────────────────────────────────────*/
async function findInstagramCommunities(niche, loc, gl, excludeSet, tbs, searchPage = 1) {
  const seen   = new Set(excludeSet);
  const groups = [];

  const addGroup = (url, name = "", description = "", isChannel = false) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    const cleanName = (name || "")
      .replace(/\s*[•|·]\s*Instagram.*/i, "")
      .replace(/\s*[-–]\s*Instagram.*/i, "")
      .replace(/\s*\(@.*?\).*/g, "")
      .trim();
    groups.push({
      platform:      "instagram",
      name:          cleanName || `${niche} Instagram ${isChannel ? "Channel" : "Community"}`,
      url,
      description:   description || (isChannel
        ? "Instagram broadcast channel tap Join to follow"
        : "Instagram community hub"),
      isDirectLink:  true,
      isChannel,
      isAiSuggested: false,
      status:        "active",
    });
  };

  // Broadcast channels (priority) + community accounts + Groups CSE single parallel batch
  const [
    chanDirect, chanWeb, chanLinktr,
    chanIGDirect, comIGCom, comWeb,
    grpIgChan, grpIgComm,
  ] = await Promise.allSettled([
    serperSearch(`site:instagram.com/channel/ "${niche}"`, gl, 10, tbs, searchPage),
    serperSearch(`"instagram.com/channel" "${niche}" join link`, gl, 10, tbs, searchPage),
    serperSearch(`site:linktr.ee "instagram.com/channel" "${niche}"`, gl, 8, tbs, searchPage),
    serperSearch(`site:instagram.com "${niche}" channel broadcast`, gl, 10, tbs, searchPage),
    serperSearch(`site:instagram.com "${niche}" community`, gl, 10, tbs, searchPage),
    serperSearch(`instagram "${niche}"${loc ? ` "${loc}"` : ""} community group join`, gl, 8, tbs, searchPage),
    googleGroupsSearch(`instagram channel "${niche}"${loc ? ` "${loc}"` : ""} join`),
    googleGroupsSearch(`instagram community "${niche}"${loc ? ` "${loc}"` : ""}`),
  ]);

  const pagesToScrape = new Set();

  // Extract channels from external sites first
  for (const r of [chanDirect, chanWeb, chanLinktr]) {
    if (r.status !== "fulfilled") continue;
    const { channels } = extractInstagramLinksFromSerper(r.value);
    for (const ch of channels) addGroup(ch, "", "Instagram broadcast channel tap Join to follow", true);
    for (const item of r.value) {
      if (!item.link.includes("instagram.com") && pagesToScrape.size < 8) pagesToScrape.add(item.link);
    }
  }

  // Instagram direct results + Groups CSE results channels > community profiles
  for (const r of [chanIGDirect, comIGCom, comWeb, grpIgChan, grpIgComm]) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (item.link.includes("instagram.com")) {
        const ch = normalizeInstagramChannel(item.link);
        if (ch) {
          addGroup(ch, item.title, item.snippet || "", true);
          continue;
        }
        const prof = normalizeInstagramProfile(item.link);
        if (prof) addGroup(prof, item.title, item.snippet || "", false);
      } else if (pagesToScrape.size < 8) {
        pagesToScrape.add(item.link);
      }
    }
  }

  // Scrape external pages (linktr.ee, blogs, etc.) for hidden channel links
  if (pagesToScrape.size > 0) {
    const scraped = await Promise.allSettled([...pagesToScrape].slice(0, 8).map(fetchInstagramLinks));
    for (const s of scraped) {
      if (s.status !== "fulfilled") continue;
      const { channels, profiles } = s.value;
      for (const ch of channels) addGroup(ch, "", "Instagram broadcast channel", true);
      for (const p of profiles.slice(0, 2)) addGroup(p, "", "Instagram community account", false);
    }
  }

  // Only return actual broadcast channels (joinable) skip generic profile pages
  const channelsOnly = groups.filter(g => g.isChannel);
  const result = channelsOnly.length > 0 ? channelsOnly : groups;
  return result.slice(0, PER_PLATFORM);
}

/* ─── Instagram Bio → Group Links ───────────────────────────────────────────
   Many Indian businesses post WhatsApp/TG/FB group links in their Instagram
   bio or Linktree. This scanner:
     1. Finds niche Instagram pages via Serper
     2. ScraperAPI fetches each profile (JS-rendered) → extracts all group links
     3. Follows any Linktree / bio.link / taplink pages found → extracts more
   Returns a map of { platform → Set<url> } to merge into main results.
─────────────────────────────────────────────────────────────────────────────*/

function extractAllGroupLinks(text) {
  const found = { whatsapp: [], telegram: [], facebook: [], linkedin: [] };

  for (const m of text.matchAll(/chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/g))
    found.whatsapp.push(`https://chat.whatsapp.com/${m[1]}`);

  for (const m of text.matchAll(/t\.me\/((?:\+[A-Za-z0-9]{10,}|joinchat\/[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_]{3,}))/g)) {
    const n = normalizeTelegram(`https://t.me/${m[1]}`);
    if (n) found.telegram.push(n);
  }

  for (const m of text.matchAll(/facebook\.com\/groups\/([A-Za-z0-9._-]+)/g)) {
    const n = normalizeFacebook(`https://www.facebook.com/groups/${m[1]}/`);
    if (n) found.facebook.push(n);
  }

  for (const m of text.matchAll(/linkedin\.com\/groups\/([0-9A-Za-z-]+)/g)) {
    const n = normalizeLinkedIn(`https://www.linkedin.com/groups/${m[1]}/`);
    if (n) found.linkedin.push(n);
  }

  return found;
}

function extractBioLinkUrls(html) {
  const urls = new Set();
  for (const m of html.matchAll(/https?:\/\/(linktr\.ee|bio\.link|beacons\.ai|linkin\.bio|lnk\.bio|taplink\.cc|allmylinks\.com|linkpop\.com|biosite\.me|campsite\.bio)\/([A-Za-z0-9._%-]+)/gi))
    urls.add(`https://${m[1]}/${m[2]}`);
  return [...urls];
}

async function scrapeBioLinks(igHandle) {
  if (!SCRAPER_KEY) return null;
  try {
    const html = await scraperFetch(`https://www.instagram.com/${igHandle}/`, true, 14000);
    if (!html || html.length < 200) return null;
    return {
      groups:   extractAllGroupLinks(html),
      bioLinks: extractBioLinkUrls(html),
    };
  } catch { return null; }
}

async function scrapeExternalBioPage(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1" },
      signal:  AbortSignal.timeout(10000),
    });
    if (!res.ok) return {};
    const html = await res.text();
    return extractAllGroupLinks(html);
  } catch { return {}; }
}

async function findGroupsViaInstaBios(niche, loc, gl, tbs) {
  // Step 1: find Instagram pages that mention groups/links in their bio context (2 queries only)
  const [r1, r2] = await Promise.allSettled([
    serperSearch(`site:instagram.com "${niche}"${loc ? ` "${loc}"` : ""} whatsapp OR telegram OR "join group"`, gl, 10, tbs),
    serperSearch(`site:instagram.com "${niche}"${loc ? ` "${loc}"` : " India"} linktr.ee OR "bio.link" OR taplink`, gl, 8, tbs),
  ]);

  const handles = new Set();
  for (const r of [r1, r2]) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      const m = item.link.match(/instagram\.com\/([a-zA-Z0-9._]{2,30})\/?(?:[?#]|$)/);
      if (m && !IG_SKIP.has(m[1].toLowerCase())) handles.add(m[1]);
    }
  }

  if (!handles.size) return {};

  // Step 2: scrape each Instagram profile (JS-rendered) for group links + bio link services
  const bioResults = await Promise.allSettled(
    [...handles].slice(0, 8).map(h => scrapeBioLinks(h))
  );

  const merged   = { whatsapp: new Set(), telegram: new Set(), facebook: new Set(), linkedin: new Set() };
  const ltUrls   = new Set();

  for (const r of bioResults) {
    if (r.status !== "fulfilled" || !r.value) continue;
    const { groups, bioLinks } = r.value;
    for (const [plat, urls] of Object.entries(groups))
      for (const u of urls) merged[plat]?.add(u);
    for (const u of bioLinks) ltUrls.add(u);
  }

  // Step 3: follow Linktree / bio.link pages for more group links
  if (ltUrls.size > 0) {
    const ltResults = await Promise.allSettled(
      [...ltUrls].slice(0, 10).map(scrapeExternalBioPage)
    );
    for (const r of ltResults) {
      if (r.status !== "fulfilled") continue;
      for (const [plat, urls] of Object.entries(r.value))
        for (const u of urls) merged[plat]?.add(u);
    }
  }

  return merged; // { whatsapp: Set<url>, telegram: Set<url>, facebook: Set<url>, linkedin: Set<url> }
}

/* ─── AI Validation Layer ────────────────────────────────────────────────────
   Thinksuite validates each group for relevance + authenticity.
   Rejects spam, bot groups, and off-topic communities.
─────────────────────────────────────────────────────────────────────────────*/
async function aiValidateGroups(groups, niche, targetCountry = "") {
  if (!groups.length) return groups;
  const isIntl = targetCountry && targetCountry.toLowerCase() !== "india";
  try {
    const client = getAIClient();
    const N      = Math.min(groups.length, 40);
    const batch  = groups.slice(0, N).map((g, i) => ({
      i,
      p: g.platform,
      n: (g.name || "").slice(0, 55),
      u: (g.url  || "").slice(0, 85),
    }));

    const countryNote = isIntl
      ? `\n- Target country: ${targetCountry}. Set "co":"IN" for groups that appear India-only (name/URL contains India/Indian/Bharat/Desi with no other country mention). Set "co":"INTL" for international groups. Score India-only groups 1-3 lower.`
      : ``;

    const msg = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [{
        role:    "user",
        content: `You are a lead quality auditor. Score these social communities for niche "${niche}" on a 0–10 scale (10 = perfect match, 0 = pure spam/unrelated).${countryNote}

Groups: ${JSON.stringify(batch)}

Rules:
- Keep groups scoring >= 7 (>= 5 for LinkedIn platform "p":"linkedin" - LinkedIn group names are often generic)
- Reject: spam handles, adult content, unrelated niches (e.g. gaming group for real estate), generic unrelated groups, groups where niche name doesn't appear in name/URL and topic seems unrelated, groups with generic names like "Business India" or "Earn Money" unrelated to niche
- Reward: niche name in group name/URL, city/country mentions, professional or industry keywords
- Score exactly 7 if group seems related but name is generic; score 6 or below if name is vague, off-topic, or unrelated

Return ONLY valid JSON array (no extra text): [{"i":0,"s":8,"co":"INTL"}]`,
      }],
    });

    const text     = msg.content[0]?.text || "[]";
    const arrMatch = text.match(/\[[\s\S]*?\]/);
    if (!arrMatch) return groups;

    const rated    = JSON.parse(arrMatch[0]);
    const scoreMap = new Map(rated.map(r => [Number(r.i), { s: Number(r.s), co: r.co || "" }]));

    const validated = [];
    for (let i = 0; i < N; i++) {
      const scored = scoreMap.get(i);
      // LinkedIn group names are often generic; use lower threshold (5) for them
      const minScore = groups[i]?.platform === "linkedin" ? 5 : 7;
      if (scored && scored.s >= minScore) {
        validated.push({
          ...groups[i],
          aiScore:        scored.s,
          aiValidated:    true,
          country_origin: scored.co || groups[i].country_hint || "",
        });
      }
    }

    const remaining = groups.slice(N).map(g => ({ ...g, aiValidated: false }));
    const combined = [
      ...validated.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)),
      ...remaining,
    ];

    // Safety: if AI filtered out every group, bypass validation and return originals
    if (combined.length === 0 && groups.length > 0) {
      return groups.map(g => ({ ...g, aiValidated: false }));
    }

    return combined;
  } catch (err) {
    console.warn("[group-finder] AI validation skipped:", err.message);
    return groups;
  }
}

/* ─── Main handler ───────────────────────────────────────────────────────────*/
const SUPPORTED_PLATFORMS = ["whatsapp", "telegram", "facebook", "linkedin", "instagram"];

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      category, platforms, isInternational, country,
      excludeUrls = [], recency, searchPage = 1,
    } = await req.json();

    if (!category) return NextResponse.json({ error: "Category required" }, { status: 400 });

    const quota = await checkQuota(userId);
    if (!quota.ok) {
      return NextResponse.json(
        { success: false, quotaExceeded: true, used: quota.used, limit: MONTHLY_LIMIT },
        { status: 402 }
      );
    }

    const selected   = (platforms || SUPPORTED_PLATFORMS).filter(p => SUPPORTED_PLATFORMS.includes(p));
    const loc        = isInternational ? (country || "") : "India";
    const gl         = isInternational ? "us" : "in";
    const excludeSet = new Set(excludeUrls);
    const tbs        = recency === "week" ? "qdr:w" : recency === "month" ? "qdr:m" : null;

    const jobs = selected.map(platform => {
      if (platform === "whatsapp")  return findWhatsAppGroups(category, loc, gl, excludeSet, tbs, searchPage);
      if (platform === "telegram")  return findTelegramGroups(category, loc, gl, excludeSet, tbs, searchPage);
      if (platform === "facebook")  return findFacebookGroups(category, loc, gl, excludeSet, tbs, searchPage);
      if (platform === "linkedin")  return findLinkedInGroups(category, loc, gl, excludeSet, tbs, searchPage);
      if (platform === "instagram") return findInstagramCommunities(category, loc, gl, excludeSet, tbs, searchPage);
      return Promise.resolve([]);
    });

    // Bio scraping only makes sense when searching for platforms whose links appear in IG bios
    const bioPlatforms = ["whatsapp", "telegram", "facebook", "linkedin"];
    const shouldScrapeIGBios = selected.some(p => bioPlatforms.includes(p));

    // Run bio-scraping in parallel with platform searches
    const [settled, bioResult] = await Promise.all([
      Promise.allSettled(jobs),
      shouldScrapeIGBios ? findGroupsViaInstaBios(category, loc, gl, tbs) : Promise.resolve({}),
    ]);

    let groups = [];
    for (const r of settled) {
      if (r.status === "fulfilled") groups.push(...(r.value || []));
    }

    // Merge bio-discovered links - WhatsApp links MUST be verified before inclusion;
    // other platforms are normalised + tagged but not individually fetched here.
    const bioSeenUrls     = new Set(groups.map(g => g.url));
    const unverifiedWaLinks = [];

    for (const [platform, urlSet] of Object.entries(bioResult)) {
      if (!selected.includes(platform)) continue;
      for (const rawUrl of urlSet) {
        const url = normalizeUrl(rawUrl, platform) || rawUrl;
        if (!url || bioSeenUrls.has(url)) continue;
        bioSeenUrls.add(url);
        if (platform === "whatsapp") {
          unverifiedWaLinks.push(url); // defer - need checkWaLinkStatus
        } else {
          groups.push({
            platform,
            name:          `${category} Group (via Instagram bio)`,
            url,
            description:   "Found in an Instagram business page bio or Linktree - high-intent community link",
            isDirectLink:  true,
            isBioSourced:  true,
            isAiSuggested: false,
            status:        "active",
          });
        }
      }
    }

    // Verify bio-sourced WhatsApp links - only "open" (with confirmed group name) are added
    if (unverifiedWaLinks.length > 0) {
      const waChecks = await Promise.allSettled(
        unverifiedWaLinks.slice(0, 8).map(url => checkWaLinkStatus(url))
      );
      for (let i = 0; i < Math.min(unverifiedWaLinks.length, 8); i++) {
        const r = waChecks[i];
        if (r.status !== "fulfilled") continue;
        const { status, name } = r.value;
        if (status !== "open") continue; // "unknown" and "invalid" are both rejected
        groups.push({
          platform:      "whatsapp",
          name:          name || `${category} WhatsApp Group (via Instagram bio)`,
          url:           unverifiedWaLinks[i],
          description:   "Verified active group found via Instagram bio or Linktree",
          isDirectLink:  true,
          isBioSourced:  true,
          isVerified:    true,
          isAiSuggested: false,
          status:        "active",
        });
      }
    }

    // Cross-platform deduplication
    const seenFinal = new Set(excludeUrls);
    groups = groups.filter(g => {
      if (seenFinal.has(g.url)) return false;
      seenFinal.add(g.url); return true;
    });

    // AI validation: filters spam/irrelevant, ranks by relevance, tags country origin
    groups = await aiValidateGroups(groups, category, loc);

    // For international searches: push confirmed India-only groups to the end
    if (isInternational && country) {
      groups.sort((a, b) => {
        const aIndia = (a.country_origin || "").toUpperCase() === "IN" ? 1 : 0;
        const bIndia = (b.country_origin || "").toUpperCase() === "IN" ? 1 : 0;
        return aIndia - bIndia;
      });
    }

    // Per-platform bucketing + scoring sort
    const byPlatform = {};
    for (const g of groups) {
      if (!byPlatform[g.platform]) byPlatform[g.platform] = [];
      byPlatform[g.platform].push(g);
    }
    for (const p of Object.keys(byPlatform)) {
      byPlatform[p].sort((a, b) => {
        const indiaA = (a.country_origin || "").toUpperCase() === "IN" && isInternational && country ? -5 : 0;
        const indiaB = (b.country_origin || "").toUpperCase() === "IN" && isInternational && country ? -5 : 0;
        const scoreA = (a.aiScore || 0) * 10 + (a.isBioSourced ? 8 : 0) + (a.isVerified ? 5 : 0) + (a.isGroup ? 4 : 0) + (a.isDirectLink ? 1 : 0) + indiaA;
        const scoreB = (b.aiScore || 0) * 10 + (b.isBioSourced ? 8 : 0) + (b.isVerified ? 5 : 0) + (b.isGroup ? 4 : 0) + (b.isDirectLink ? 1 : 0) + indiaB;
        return scoreB - scoreA;
      });
    }

    const final = [];
    for (const p of selected) final.push(...(byPlatform[p] || []).slice(0, PER_PLATFORM));

    const { granted, used: quotaUsed, remaining: quotaRemaining } = await incrementQuota(userId, final.length);
    const grantedFinal = final.slice(0, granted);

    await saveLeadHistory(userId, {
      type: "group-finder",
      niche: category,
      location: loc,
      leadCount: grantedFinal.length,
      leads: grantedFinal.slice(0, 50).map(g => ({
        name: g.name || g.title || "",
        website: g.url || g.link || "",
        platform: g.platform || "",
        members: g.members || "",
        description: g.description || "",
      })),
    });

    return NextResponse.json({
      success:        true,
      groups:         grantedFinal,
      total:          grantedFinal.length,
      quotaUsed,
      quotaRemaining,
      quotaLimit:     MONTHLY_LIMIT,
    });
  } catch (err) {
    console.error("[group-finder]", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
