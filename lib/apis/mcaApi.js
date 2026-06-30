/**
 * MCA (Ministry of Corporate Affairs) Data Integration
 *
 * Sources in order of quality:
 *   1. Zaubacorp company list pages — direct pagination (free, no DataForSEO)
 *   2. Tofler company search        — additional details
 *   3. MCA21 portal                 — official but has CAPTCHA for full access
 *   4. DataForSEO SERP fallback     — paid but reliable
 *
 * CIN Format: [L/U][5-digit NIC][2-letter state code][4-digit year][3-letter entity][6-digit serial]
 * Example:    U72900MH2026PTC123456
 *             U = Unlisted, 72900 = NIC code (IT), MH = Maharashtra, 2026 = year, PTC = Private Co, serial
 */

import { fetchPage, stripHtml, crawlPaginated, discoverUrls } from "../crawler.js";
import { serperSearch } from "../scraperUtils.js";

const CIN_REGEX = /[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/g;
const DIN_REGEX = /\b[0-9]{8}\b/;

// ── State code → State name ───────────────────────────────────────────────────
export const STATE_MAP = {
  MH:"Maharashtra", DL:"Delhi",       KA:"Karnataka",    GJ:"Gujarat",
  TN:"Tamil Nadu",  UP:"Uttar Pradesh", WB:"West Bengal", TS:"Telangana",
  AP:"Andhra Pradesh", RJ:"Rajasthan", HR:"Haryana",     PB:"Punjab",
  KL:"Kerala",      MP:"Madhya Pradesh", OR:"Odisha",    BR:"Bihar",
  JH:"Jharkhand",   AS:"Assam",       CG:"Chhattisgarh", UK:"Uttarakhand",
  HP:"Himachal Pradesh", GA:"Goa",    CH:"Chandigarh",   JK:"Jammu & Kashmir",
};

export function stateFromCIN(cin = "") {
  return STATE_MAP[cin.slice(7, 9)] || "";
}

export function yearFromCIN(cin = "") {
  return cin.slice(9, 13) || "";
}

export function typeFromCIN(cin = "") {
  const t = cin.slice(13, 16);
  const types = { PTC:"Private Limited", FLC:"Foreign", GOI:"Govt", PLL:"Public Limited", OPC:"One Person Co" };
  return types[t] || t;
}

// ── Parse CIN from any text block ─────────────────────────────────────────────
export function extractCINs(text) {
  return [...new Set((text.match(CIN_REGEX) || []))];
}

// ── Parse a Zaubacorp company-list page ───────────────────────────────────────
export function parseZaubacorpListPage(content) {
  const companies = [];
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // CIN is the anchor — every real company entry has one
    const cinMatch = line.match(/[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/);
    if (!cinMatch) continue;

    const cin       = cinMatch[0];
    const state     = stateFromCIN(cin);
    const year      = yearFromCIN(cin);
    const compType  = typeFromCIN(cin);

    // Company name: usually in the same line or previous line
    const context    = lines.slice(Math.max(0, i - 2), i + 3).join(" ");
    const nameMatch  = context.match(/([A-Z][A-Za-z0-9\s&.,'-]{5,80}(?:Private Limited|Pvt\.?\s*Ltd\.?|LLP|OPC|Public Limited|Limited))/i);
    let   name       = nameMatch?.[1]?.trim() || "";

    // Remove "Zaubacorp" or "Tofler" suffixes from title line
    name = name.replace(/\s*[-|–]\s*(Zaubacorp|Tofler|MCA).*/i, "").trim();
    if (!name || name.length < 5) continue;

    // Director
    const dirMatch  = context.match(/(?:Director|DIN)[:\s-]+([A-Z][A-Za-z\s]{5,50})/i);
    const director  = dirMatch?.[1]?.trim() || "";
    const dinMatch  = context.match(/DIN[:\s]*([0-9]{8})/i);
    const din       = dinMatch?.[1] || "";

    // Incorporation date
    const dateMatch = context.match(/(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}-\d{2}-\d{2})/);
    const incDate   = dateMatch?.[0] || "";

    // Email
    const emailMatch = context.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email      = emailMatch?.[0] || "";

    companies.push({ name, cin, state, year, companyType: compType, director, din, incDate, email });
  }

  // Dedup by CIN within this page
  const seen = new Set();
  return companies.filter(c => { if (seen.has(c.cin)) return false; seen.add(c.cin); return true; });
}

// ── Crawl Zaubacorp paginated company list (NO DataForSEO needed) ─────────────
/**
 * @param {object} opts
 * @param {string} opts.state       State name e.g. "maharashtra"
 * @param {string} opts.year        Year e.g. "2026"
 * @param {string} opts.business    "private+limited" | "llp" | "opc"
 * @param {number} opts.maxPages    Max pages to crawl (each page ~20 companies)
 */
export async function crawlZaubacorpList(opts = {}) {
  const {
    state    = "maharashtra",
    year     = new Date().getFullYear().toString(),
    business = "private+limited",
    maxPages = 3,
  } = opts;

  const slug = state.toLowerCase().replace(/\s+/g, "+");

  const getUrl = (page) =>
    `https://www.zaubacorp.com/company-list/state=${slug}/business=${business}/incorporation_year=${year}/page=${page}`;

  return crawlPaginated(getUrl, parseZaubacorpListPage, {
    maxPages,
    delayMs: 2000, // polite delay — 2 seconds between pages
    fetchOpts: { strategy: "jina", timeoutMs: 15000 },
  });
}

// ── Crawl Zaubacorp company detail page for richer data ──────────────────────
export async function scrapeZaubacorpDetail(cin) {
  if (!cin) return null;
  const url  = `https://www.zaubacorp.com/company/${cin.replace(/\s+/g, "-")}/${cin}`;
  const page = await fetchPage(url, { strategy: "jina", timeoutMs: 15000 });
  if (!page.success) return null;

  const c    = page.content;
  const nameM = c.match(/^#+\s*(.+?)(?:\n|$)/m);
  const emailM = c.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneM = c.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);

  const directors = [];
  const dirRe     = /Director[:\s]+([A-Z][A-Za-z\s]{5,50})\s+DIN[:\s]*([0-9]{8})/gi;
  let dm;
  while ((dm = dirRe.exec(c)) !== null) {
    directors.push({ name: dm[1].trim(), din: dm[2] });
  }

  const incDateM  = c.match(/(?:Date of Incorporation|Incorporated)[:\s]+([0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4})/i);
  const capitalM  = c.match(/(?:Authorised Capital|Paid Up Capital)[:\s]+(?:Rs\.?\s*)?([0-9,]+)/i);

  return {
    cin,
    name:           nameM?.[1]?.trim() || "",
    email:          emailM?.[0] || "",
    phone:          phoneM?.[0]?.replace(/[\s-]/g, "") || "",
    directors,
    directorName:   directors[0]?.name || "",
    din:            directors[0]?.din  || "",
    incorporationDate: incDateM?.[1] || "",
    authorizedCapital: capitalM?.[1]?.replace(/,/g, "") || "",
    state:          stateFromCIN(cin),
    companyType:    typeFromCIN(cin),
  };
}

// ── Tofler search — for companies that Zaubacorp misses ──────────────────────
export async function searchTofler(query, state = "") {
  const q  = `site:tofler.in "${query}" ${state} "Private Limited" incorporated`;
  const rs = await serperSearch(q, "in", 10);
  return rs.map(r => {
    const text   = `${r.title} ${r.snippet}`;
    const cinM   = text.match(/[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/);
    const dateM  = text.match(/(\d{2}[/-]\d{2}[/-]\d{4})/);
    const emailM = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const name   = r.title.replace(/\s*[-|–].*$/,"").trim();
    if (!name || name.length < 4) return null;
    return {
      name,
      cin:    cinM?.[0]     || "",
      incDate: dateM?.[0]   || "",
      email:  emailM?.[0]   || "",
      state,
      source: "tofler",
    };
  }).filter(Boolean);
}
