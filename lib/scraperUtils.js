// Firecrawl and ScraperAPI removed — Jina (free) + DataForSEO On-Page cover both use cases

// SSRF protection: blocks requests to localhost, link-local, and private ranges
function isSafeUrl(url) {
  try {
    const { hostname } = new URL(url);
    if (/^(localhost|127\.|0\.0\.0\.|::1$)/.test(hostname)) return false;
    if (/^10\./.test(hostname)) return false;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false;
    if (/^192\.168\./.test(hostname)) return false;
    if (/^169\.254\./.test(hostname)) return false; // AWS metadata
    if (/^fd[0-9a-f]{2}:/i.test(hostname)) return false; // IPv6 ULA
    return true;
  } catch { return false; }
}

// DataForSEO: gl code → location_code
const DFS_LOCATION = {
  in:2356, us:2840, gb:2826, au:2036, ca:2124, ae:2784, sg:2702,
  de:2276, fr:2250, nl:2528, it:2380, es:2724, br:2076, mx:2484,
  jp:2392, kr:2410, id:2360, my:2458, th:2764, ph:2608, za:2710,
  ke:2404, ng:2566, eg:2818, sa:2682, pk:2586, bd:2050, lk:2144,
  np:2524, vn:2704, cn:2156, tr:2792, il:2376, se:2752, no:2578,
  dk:2208, fi:2246, ch:2756, at:2040, pl:2616, qa:2634, kw:2414,
  bh:2048, om:2512,
};

async function dataForSeoSearch(query, gl = "in", num = 10) {
  const login = process.env.DATAFORSEO_LOGIN;
  const pass  = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pass) return null;
  try {
    const auth = Buffer.from(`${login}:${pass}`).toString("base64");
    const res  = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/regular", {
      method:  "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify([{
        keyword: query, location_code: DFS_LOCATION[gl] || 2840,
        language_code: "en", device: "desktop", depth: num,
      }]),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const items = data.tasks?.[0]?.result?.[0]?.items || [];
    const results = items
      .filter(i => i.type === "organic")
      .slice(0, num)
      .map(i => ({ link: i.url, title: i.title, snippet: i.description || "" }));
    return results.length > 0 ? results : null;
  } catch { return null; }
}

// ── Jina AI Reader — free with key (higher limits + commercial rights) ────────
export async function jinaFetch(url, timeoutMs = 15000) {
  if (!url?.startsWith("http")) return "";
  if (!isSafeUrl(url)) return "";
  try {
    const headers = { Accept: "text/plain", "X-Return-Format": "markdown" };
    const jinaKey = process.env.JINA_API_KEY;
    if (jinaKey) headers["Authorization"] = `Bearer ${jinaKey}`;
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return "";
    return (await res.text()).slice(0, 8000);
  } catch { return ""; }
}

// ── FREE: DuckDuckGo web search — no API key needed ──────────────────────────
export async function ddgSearch(query, num = 10) {
  try {
    const body = new URLSearchParams({ q: query, b: "", kl: "in-en" });
    const res  = await fetch("https://html.duckduckgo.com/html/", {
      method:  "POST",
      headers: {
        "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type":    "application/x-www-form-urlencoded",
        "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer":         "https://duckduckgo.com/",
      },
      body:   body.toString(),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const html = await res.text();

    const snips = [];
    const snippetRe = /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    let m;
    while ((m = snippetRe.exec(html)) !== null)
      snips.push(m[1].replace(/<[^>]+>/g, "").trim());

    const results = [];
    const titleRe = /<h2[^>]*class="result__title"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let idx = 0;
    while ((m = titleRe.exec(html)) !== null && results.length < num) {
      const title = m[2].replace(/<[^>]+>/g, "").trim();
      let url = m[1];
      try {
        const u = new URL(m[1], "https://duckduckgo.com");
        url = u.searchParams.get("uddg") ? decodeURIComponent(u.searchParams.get("uddg")) : m[1];
      } catch {}
      results.push({ link: url, title, snippet: snips[idx++] || "" });
    }
    return results;
  } catch { return []; }
}

// ── Shared country → Google gl code map (single source of truth) ────────────
export const COUNTRY_GL = {
  "india":"in","usa":"us","united states":"us","uk":"gb","united kingdom":"gb",
  "uae":"ae","united arab emirates":"ae","australia":"au","canada":"ca",
  "singapore":"sg","germany":"de","france":"fr","netherlands":"nl","italy":"it",
  "spain":"es","brazil":"br","mexico":"mx","japan":"jp","south korea":"kr",
  "indonesia":"id","malaysia":"my","thailand":"th","philippines":"ph",
  "south africa":"za","kenya":"ke","nigeria":"ng","egypt":"eg","saudi arabia":"sa",
  "qatar":"qa","kuwait":"kw","bahrain":"bh","oman":"om","new zealand":"nz",
  "sweden":"se","norway":"no","denmark":"dk","finland":"fi","switzerland":"ch",
  "austria":"at","poland":"pl","turkey":"tr","israel":"il","pakistan":"pk",
  "bangladesh":"bd","sri lanka":"lk","nepal":"np","vietnam":"vn","china":"cn",
  "global":"us",
};

/**
 * Map a location string to a Google search gl code.
 * Parses comma-separated parts in reverse (rightmost = country).
 * @param {string} locationStr
 * @param {string} [defaultGl="in"]  Explicit default - pass "us" for international routes.
 */
export function getGl(locationStr = "", defaultGl = "in") {
  const parts = locationStr.toLowerCase().split(",").map(s => s.trim());
  for (const part of [...parts].reverse()) {
    if (COUNTRY_GL[part]) return COUNTRY_GL[part];
  }
  return defaultGl;
}

/**
 * Shared Serper search. Returns an array of { link, title, snippet } objects.
 * Silent on error - callers should treat an empty array as a search miss.
 */
export async function serperSearch(query, gl = "in", num = 10, tbs = null) {
  // Primary: DataForSEO (pay-as-you-go, real Google results)
  const dfs = await dataForSeoSearch(query, gl, num);
  if (dfs) return dfs;

  return ddgSearch(query, num);
}

/**
 * Extract a WhatsApp contact number from any text blob.
 * Handles wa.me links, api.whatsapp.com/send links, and inline "WhatsApp: +..." text.
 */
export function extractWhatsAppNumber(text = "") {
  let m = text.match(/wa\.me\/(\+?[0-9]{7,15})/);
  if (m) return "+" + m[1].replace(/^\+/, "");
  m = text.match(/api\.whatsapp\.com\/send\?phone=(\+?[0-9]{7,15})/);
  if (m) return "+" + m[1].replace(/^\+/, "");
  m = text.match(/[Ww]hats[Aa]pp[\s:]*(\+[0-9]{7,15})/);
  if (m) return m[1];
  return "";
}

// ── Business account detection (ported from instagram-lead-scraper) ──────────

export const BUSINESS_KEYWORDS = [
  "store","brand","shop","clinic","salon","restaurant","agency",
  "studio","company","foods","cafe","boutique","services","co.",
  "pvt","ltd","enterprises","hub","mart","fashion","beauty",
  "wellness","health","digital","media","photography","design",
  "school","academy","institute","gym","fitness","hotel","resort",
  "retail","jewellery","jewelry","bakery","kitchen","organic",
  "creations","solutions","products","exports","imports","traders",
  "dealers","distributors","supplier","manufacturer","industry",
  "industries","group","foundation","trust","ngo","charity",
];

export function isBusinessLead(lead) {
  const text = `${lead.name || ""} ${lead.category || ""} ${lead.bioSnippet || ""}`.toLowerCase();
  if (lead.email || lead.phone || lead.website) return true;
  return BUSINESS_KEYWORDS.some(kw => text.includes(kw));
}

// Extract email - prefer mailto: link over regex in bio/HTML
export function extractEmailFromHtml(html = "") {
  const mailtoMatch = html.match(/href="mailto:([^"?]+)/i);
  if (mailtoMatch) {
    const email = mailtoMatch[1].trim();
    if (email.includes("@")) return email;
  }
  return extractEmails(html)[0] || "";
}

// Extract phone - prefer tel: link over regex in bio/HTML
export function extractPhoneFromHtml(html = "") {
  const telMatch = html.match(/href="tel:([^"]+)/i);
  if (telMatch) {
    const phone = telMatch[1].trim();
    if (phone) return phone;
  }
  return extractPhonesIndian(html)[0] || extractPhones(html)[0] || "";
}

// Indian-specific phone extraction (more precise than generic)
export function extractPhonesIndian(text = "") {
  const patterns = [
    /(\+91[\s\-]?)?[6-9]\d{9}/g,
    /(\+1[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/g,
    /\+\d{1,3}[\s\-]?\d{6,14}/g,
  ];
  const found = new Set();
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      const cleaned = m[0].replace(/[\s\-]/g, "");
      if (cleaned.replace(/\D/g, "").length >= 7) found.add(cleaned);
    }
  }
  return [...found];
}

// JS-rendered sites: DataForSEO On-Page API; static sites: Jina (free fallback)
export async function scraperFetch(targetUrl, renderJs = false, timeoutMs = 12000) {
  if (!isSafeUrl(targetUrl)) return "";
  if (renderJs) {
    const login = process.env.DATAFORSEO_LOGIN;
    const pass  = process.env.DATAFORSEO_PASSWORD;
    if (login && pass) {
      try {
        const auth = Buffer.from(`${login}:${pass}`).toString("base64");
        const res  = await fetch("https://api.dataforseo.com/v3/on_page/raw_html/live", {
          method:  "POST",
          headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
          body:    JSON.stringify([{ url: targetUrl, enable_javascript: true }]),
          signal:  AbortSignal.timeout(timeoutMs),
        });
        if (res.ok) {
          const data = await res.json();
          const html = data.tasks?.[0]?.result?.[0]?.raw_html || "";
          if (html.length > 300) return html;
        }
      } catch { /* fall through to Jina */ }
    }
  }
  return jinaFetch(targetUrl, timeoutMs);
}

// Uses DataForSEO On-Page (JS-rendered) when credentials are set, Jina otherwise
export async function firecrawlScrape(pageUrl, timeoutMs = 12000) {
  return scraperFetch(pageUrl, true, timeoutMs);
}

const SOCIAL_RE = /(?:instagram|facebook|twitter|youtube|linkedin|tiktok|snapchat|google)\.com/i;

// Infrastructure/schema domains that are never a real business website
const JUNK_WEBSITE_RE = /(?:schema\.org|w3\.org|openssl\.org|cloudflare\.com|gstatic\.com|googleapis\.com|gravatar\.com|wordpress\.org|jquery\.com|fontawesome\.com|bootstrapcdn\.com|unpkg\.com|cdnjs\.com|jsdelivr\.net|amazonaws\.com|cloudfront\.net|akamai(?:hd)?\.net|doubleclick\.net|googletagmanager\.com|google-analytics\.com|gtag|bing\.com|yahoo\.com|apple\.com\/DTD|xmlsoap\.org|opengraph\.io)/i;

// Junk email addresses that are never real contact emails
const JUNK_EMAIL_RE = /^(?:noreply|no-reply|donotreply|mailer-daemon|postmaster|webmaster|admin@(?:instagram|facebook|twitter|linkedin|google|microsoft|apple)|public-schemaorg@|support@(?:instagram|facebook)|info@(?:instagram|facebook))/i;

export function extractEmails(text = "") {
  const all = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  return [...new Set(all.filter(e => !JUNK_EMAIL_RE.test(e)))];
}

// ISO dates (YYYY-MM-DD, DD/MM/YYYY, MM-DD-YYYY) are never phone numbers
const DATE_RE = /^\+?\d{4}[-/]\d{2}[-/]\d{2}$|^\+?\d{2}[-/]\d{2}[-/]\d{4}$/;

export function extractPhones(text = "") {
  const raw = text.match(/(\+?[\d][\d\s\-().]{7,15}\d)/g) || [];
  return [...new Set(raw.filter(p => {
    const digits  = p.replace(/\D/g, "");
    const hasPlus = p.trimStart().startsWith("+");
    const maxDigits = hasPlus ? 15 : 12;
    if (digits.length < 7 || digits.length > maxDigits) return false;
    if (DATE_RE.test(p.trim())) return false;
    // Reject sequences that look like year-month-day (8 digits, two separators at position 4 and 6/7)
    if (/^\d{4}[-\/]\d{2}[-\/]\d{2}$/.test(p.trim())) return false;
    return true;
  }))];
}

export function extractWebsites(text = "") {
  const all = text.match(/https?:\/\/[^\s"<>\]()]+/g) || [];
  return [...new Set(
    all
      .filter(u => !SOCIAL_RE.test(u))
      .filter(u => !JUNK_WEBSITE_RE.test(u))
      .map(u => u.replace(/[,.)>]+$/, ""))
  )];
}

// Run N async tasks in parallel, return results (never throws)
export async function parallelSafe(fns) {
  return Promise.all(fns.map(fn => fn().catch(() => null)));
}

// Quality gate  score each lead and filter out junk
export function qualityScore(lead) {
  const email      = lead.email      || lead.contact_email || "";
  const phone      = lead.phone      || lead.contact_phone || "";
  const website    = lead.website    || lead.websiteUri    || "";
  const profileUrl = lead.profileUrl || "";

  const hasEmail      = !!(email   && email   !== "N/A" && email.includes("@"));
  const hasPhone      = !!(phone   && phone   !== "N/A" && phone.replace(/\D/g, "").length >= 7);
  const hasWebsite    = !!(website    && website    !== "N/A" && website.startsWith("http"));
  const hasProfileUrl = !!(profileUrl && profileUrl !== "N/A" && profileUrl.startsWith("http"));

  if (hasEmail && hasPhone)           return "verified";   // full contact
  if (hasEmail || hasPhone)           return "partial";    // one contact
  if (hasWebsite || hasProfileUrl)    return "limited";    // website or social profile
  return "info_only";                                      // name only
}

const QUALITY_RANK = { verified: 3, partial: 2, limited: 1, info_only: 0 };

// Attach data_quality field + optionally filter below minQuality
// minQuality: "verified" | "partial" | "limited" | "info_only"
export function applyQualityGate(leads, minQuality = "limited") {
  const min = QUALITY_RANK[minQuality] ?? 0;
  return leads
    .map(l => ({ ...l, data_quality: qualityScore(l) }))
    .filter(l => QUALITY_RANK[l.data_quality] >= min)
    .sort((a, b) => QUALITY_RANK[b.data_quality] - QUALITY_RANK[a.data_quality]);
}
