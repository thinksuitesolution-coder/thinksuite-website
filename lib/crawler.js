/**
 * Advanced Web Crawler Engine
 *
 * Strategy waterfall per request:
 *   1. Jina AI Reader  — markdown conversion, handles most static sites
 *   2. Direct HTTP     — raw HTML, fastest, works on open sites
 *   3. DataForSEO Page — for JS-rendered + bot-protected pages (paid)
 *
 * Features:
 *   - Per-domain rate limiting (in-memory, resets on cold start — fine for crons)
 *   - Pagination crawling with auto-stop on empty pages
 *   - Smart contact extraction from any page content
 *   - SSRF protection on all outgoing URLs
 */

import {
  jinaFetch,
  serperSearch,
  extractEmails,
  extractPhonesIndian,
  extractPhones,
  extractWhatsAppNumber,
  extractWebsites,
} from "./scraperUtils.js";

// ── SSRF protection ───────────────────────────────────────────────────────────
function isSafeUrl(rawUrl) {
  try {
    const { hostname, protocol } = new URL(rawUrl);
    if (!["http:", "https:"].includes(protocol)) return false;
    return !/^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1|0\.0\.0\.0)/
      .test(hostname);
  } catch { return false; }
}

// ── In-memory per-domain rate limit ───────────────────────────────────────────
const _domainTs = new Map();

async function domainDelay(url, minMs = 1200) {
  let host = "";
  try { host = new URL(url).hostname; } catch {}
  if (!host) return;
  const elapsed = Date.now() - (_domainTs.get(host) || 0);
  if (elapsed < minMs) await new Promise(r => setTimeout(r, minMs - elapsed));
  _domainTs.set(host, Date.now());
}

// ── Strategy 1: Jina AI Reader ────────────────────────────────────────────────
async function fetchViaJina(url, timeoutMs) {
  const content = await jinaFetch(url, timeoutMs);
  return content && content.length > 200 ? { content, strategy: "jina" } : null;
}

// ── Strategy 2: Direct HTTP (raw HTML) ────────────────────────────────────────
async function fetchDirect(url, timeoutMs) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
        "Cache-Control": "no-cache",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.length > 300 ? { content: text, strategy: "direct" } : null;
  } catch { return null; }
}

// ── Strategy 3: DataForSEO On-Page (paid) ────────────────────────────────────
async function fetchViaDataForSeo(url, timeoutMs) {
  const login = process.env.DATAFORSEO_LOGIN;
  const pass  = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pass) return null;
  try {
    const auth = Buffer.from(`${login}:${pass}`).toString("base64");
    const res  = await fetch("https://api.dataforseo.com/v3/on_page/raw_html/live", {
      method:  "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body:    JSON.stringify([{ url, enable_javascript: true }]),
      signal:  AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const html = data.tasks?.[0]?.result?.[0]?.raw_html || "";
    return html.length > 300 ? { content: html, strategy: "dataforseo_page" } : null;
  } catch { return null; }
}

// ── Public: Fetch a single page with strategy waterfall ──────────────────────
/**
 * @param {string} url
 * @param {object} opts
 * @param {"auto"|"jina"|"direct"|"dataforseo"} opts.strategy
 * @param {number}  opts.timeoutMs
 * @param {number}  opts.minDomainDelayMs  Politeness delay between requests to same domain
 * @param {boolean} opts.jsRendered         Skip Jina+direct, go straight to DataForSEO
 */
export async function fetchPage(url, opts = {}) {
  const {
    strategy         = "auto",
    timeoutMs        = 12000,
    minDomainDelayMs = 1200,
    jsRendered       = false,
  } = opts;

  if (!isSafeUrl(url)) return { content: "", success: false, strategy: "blocked_ssrf", url };
  await domainDelay(url, minDomainDelayMs);

  let result = null;

  if (!jsRendered) {
    if (strategy === "auto" || strategy === "jina")   result = await fetchViaJina(url, timeoutMs);
    if (!result && (strategy === "auto" || strategy === "direct")) result = await fetchDirect(url, timeoutMs);
  }
  if (!result && (strategy === "auto" || strategy === "dataforseo" || jsRendered)) {
    result = await fetchViaDataForSeo(url, timeoutMs);
  }

  return {
    content:  result?.content || "",
    success:  !!(result?.content && result.content.length > 200),
    strategy: result?.strategy || "failed",
    url,
  };
}

// ── Public: Crawl paginated lists ─────────────────────────────────────────────
/**
 * @param {(page: number) => string}             getUrl     Returns URL for page N
 * @param {(content: string, page: number) => T[]} parseFunc  Extracts items from content
 * @param {object} opts
 * @param {number} opts.maxPages
 * @param {number} opts.delayMs     Between pages
 * @param {object} opts.fetchOpts   Passed to fetchPage()
 */
export async function crawlPaginated(getUrl, parseFunc, opts = {}) {
  const { maxPages = 5, delayMs = 1500, fetchOpts = {} } = opts;
  const all = [];

  for (let page = 1; page <= maxPages; page++) {
    const url    = getUrl(page);
    const result = await fetchPage(url, fetchOpts);
    if (!result.success) { console.warn(`[crawler] page ${page} failed: ${url}`); break; }

    const items = parseFunc(result.content, page);
    if (items.length === 0) break; // empty page = end of list
    all.push(...items);

    if (page < maxPages) await new Promise(r => setTimeout(r, delayMs + Math.random() * 400));
  }

  return all;
}

// ── Public: Extract all contact signals from any page content ─────────────────
export function extractContacts(content) {
  return {
    emails:   extractEmails(content).slice(0, 5),
    phones:   [...new Set([...extractPhonesIndian(content), ...extractPhones(content)])].slice(0, 3),
    whatsapp: extractWhatsAppNumber(content),
    websites: extractWebsites(content).slice(0, 3),
  };
}

// ── Public: Strip HTML tags (for direct-fetched pages) ────────────────────────
export function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi,  " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Public: URL discovery via search (when direct crawl fails) ────────────────
/**
 * Find URLs to crawl by searching — fallback when direct list pages are unavailable.
 * @param {string} query   Search query
 * @param {string} domain  Restrict to this domain (e.g. "zaubacorp.com")
 * @param {number} limit
 */
export async function discoverUrls(query, domain = "", limit = 20) {
  const q = domain ? `site:${domain} ${query}` : query;
  const results = await serperSearch(q, "in", limit);
  return results.map(r => r.link).filter(Boolean);
}
