import Anthropic      from "@anthropic-ai/sdk";
import { getAIClient } from "@/lib/aiClient";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const maxDuration = 300;
export const dynamic     = "force-dynamic";

/* ── Tender Portal Sources ─────────────────────────────────────────────── */

// GeM: ScraperAPI paginated. NIC portals: 2captcha CAPTCHA solving.
const INDIA_SOURCES = [
  // GeM  10 pages, 3-level fallback: AJAX API → ScraperAPI(wait_for_css) → Firecrawl
  { url: "https://bidplus.gem.gov.in/all-bids",               portal: "GeM-P1",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=2",     portal: "GeM-P2",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=3",     portal: "GeM-P3",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=4",     portal: "GeM-P4",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=5",     portal: "GeM-P5",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=6",     portal: "GeM-P6",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=7",     portal: "GeM-P7",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=8",     portal: "GeM-P8",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=9",     portal: "GeM-P9",         country: "India", type: "india", method: "scraper" },
  { url: "https://bidplus.gem.gov.in/all-bids?page_no=10",    portal: "GeM-P10",        country: "India", type: "india", method: "scraper" },
  // NIC state portals  Central + 19 states
  { url: "https://eprocure.gov.in/eprocure/app?page=FrontEndLatestActiveTenders&service=page",                 portal: "eProcure",       country: "India", type: "india", method: "nic" },
  { url: "https://mahatenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                portal: "Maharashtra",    country: "India", type: "india", method: "nic" },
  { url: "https://etenders.up.nic.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                portal: "UP",             country: "India", type: "india", method: "nic" },
  { url: "https://eproc.rajasthan.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",            portal: "Rajasthan",      country: "India", type: "india", method: "nic" },
  { url: "https://tntenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                  portal: "TamilNadu",      country: "India", type: "india", method: "nic" },
  { url: "https://wbtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                  portal: "WestBengal",     country: "India", type: "india", method: "nic" },
  { url: "https://ddtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                  portal: "Delhi",          country: "India", type: "india", method: "nic" },
  { url: "https://etenders.kerala.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",            portal: "Kerala",         country: "India", type: "india", method: "nic" },
  { url: "https://hptenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                  portal: "HimachalPradesh",country: "India", type: "india", method: "nic" },
  { url: "https://jharkhandtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",           portal: "Jharkhand",      country: "India", type: "india", method: "nic" },
  { url: "https://tendersodisha.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",              portal: "Odisha",         country: "India", type: "india", method: "nic" },
  { url: "https://eproc.punjab.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",               portal: "Punjab",         country: "India", type: "india", method: "nic" },
  { url: "https://etenders.hry.nic.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",               portal: "Haryana",        country: "India", type: "india", method: "nic" },
  { url: "https://mptenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                  portal: "MadhyaPradesh",  country: "India", type: "india", method: "nic" },
  { url: "https://eproc.bihar.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                portal: "Bihar",          country: "India", type: "india", method: "nic" },
  { url: "https://assamtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",               portal: "Assam",          country: "India", type: "india", method: "nic" },
  { url: "https://uktenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                  portal: "Uttarakhand",    country: "India", type: "india", method: "nic" },
  { url: "https://jktenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                  portal: "JammuKashmir",   country: "India", type: "india", method: "nic" },
  { url: "https://goatenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",                 portal: "Goa",            country: "India", type: "india", method: "nic" },
  // Non-NIC state portals  own eProcurement systems, use ScraperAPI premium (residential) + AI extraction
  { url: "https://eproc.karnataka.gov.in/eprocportal/pages/index.jsp",    portal: "Karnataka",      country: "India", type: "india", method: "scraper", scraperPremium: true },
  { url: "https://tender.nprocure.com/TenderSearch.aspx",                 portal: "Gujarat",        country: "India", type: "india", method: "scraper", scraperPremium: true },
  { url: "https://eprocurement.telangana.gov.in",                          portal: "Telangana",      country: "India", type: "india", method: "scraper", scraperPremium: true },
];

const TED_RSS_BASE = "https://ted.europa.eu/rss-feed/search?scope=ACTIVE&sortField=PUBLICATION_DATE_OJ&sortOrder=DESC&language=EN&channelTitle=Tenders&channelDescription=EU+Tenders&channelLink=https://ted.europa.eu&fields=identifier-part,deadline-receipt-tender-date-lot,organisation-country-buyer,contract-nature-main-proc,description-glo";

// UK/Australia/Singapore: ScraperAPI. TED-EU: direct RSS (no ScraperAPI needed). UNGM/WorldBank/SAM block scrapers.
const INTL_SOURCES = [
  // UK Gov
  { url: "https://www.find-tender.service.gov.uk/Search/Results",                                                                      portal: "UK-Tenders",        country: "UK",             type: "international", method: "scraper" },
  // EU TED RSS  6 contract types
  { url: `${TED_RSS_BASE}&query=contract-nature-main-proc%3Dworks`,                                                                    portal: "TED-Works",         country: "European Union", type: "international", method: "rss" },
  { url: `${TED_RSS_BASE}&query=contract-nature-main-proc%3Dservices`,                                                                 portal: "TED-Services",      country: "European Union", type: "international", method: "rss" },
  { url: `${TED_RSS_BASE}&query=contract-nature-main-proc%3Dsupplies`,                                                                 portal: "TED-Supplies",      country: "European Union", type: "international", method: "rss" },
  // Australia  AusTender (open government data, no auth)
  { url: "https://www.tenders.gov.au/Atm/ShowList",                                                                                    portal: "Australia-Tenders", country: "Australia",      type: "international", method: "scraper" },
  // Singapore GeBIZ
  { url: "https://www.gebiz.gov.sg/ptn/opportunity/BOListing.xhtml?origin=menu",                                                       portal: "Singapore-GeBIZ",   country: "Singapore",      type: "international", method: "scraper" },
  // World Bank active projects API  covers 100+ countries
  { url: "https://search.worldbank.org/api/v2/projects",                                                                              portal: "WorldBank",         country: "Global",         type: "international", method: "worldbank" },
  // UNGM  UN Global Marketplace (ScraperAPI)
  { url: "https://www.ungm.org/Public/Notice",                                                                                         portal: "UNGM",              country: "United Nations", type: "international", method: "scraper" },
  // ADB  Asian Development Bank
  { url: "https://www.adb.org/projects/tenders/all",                                                                                   portal: "ADB",               country: "Asia-Pacific",   type: "international", method: "scraper" },
];

const ALL_SOURCES = [...INDIA_SOURCES, ...INTL_SOURCES];

/* ── Helpers ───────────────────────────────────────────────────────────── */

function parseDate(dateStr) {
  if (!dateStr || dateStr === "N/A") return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  return isNaN(date.getTime()) ? null : date;
}

function getStatus(deadlineDate) {
  if (!deadlineDate) return "unknown";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return "expired";
  if (diff === 0) return "closing_today";
  if (diff <= 7)  return "closing_soon";
  if (diff <= 30) return "open";
  return "upcoming";
}

function getUniqueId(tender, portal) {
  const raw = tender.tender_id && tender.tender_id !== "N/A" ? tender.tender_id : null;
  return raw
    ? `${portal}_${raw}`.replace(/[^a-zA-Z0-9_]/g, "_")
    : `${portal}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

const PORTAL_LINKS = {
  // GeM - use the public bid listing page (no login needed to browse)
  "GeM-P1":  "https://bidplus.gem.gov.in/all-bids", "GeM-P2":  "https://bidplus.gem.gov.in/all-bids",
  "GeM-P3":  "https://bidplus.gem.gov.in/all-bids", "GeM-P4":  "https://bidplus.gem.gov.in/all-bids",
  "GeM-P5":  "https://bidplus.gem.gov.in/all-bids", "GeM-P6":  "https://bidplus.gem.gov.in/all-bids",
  "GeM-P7":  "https://bidplus.gem.gov.in/all-bids", "GeM-P8":  "https://bidplus.gem.gov.in/all-bids",
  "GeM-P9":  "https://bidplus.gem.gov.in/all-bids", "GeM-P10": "https://bidplus.gem.gov.in/all-bids",
  // NIC state portals
  eProcure:         "https://eprocure.gov.in/eprocure/app",
  Maharashtra:      "https://mahatenders.gov.in",
  UP:               "https://etenders.up.nic.in",
  Rajasthan:        "https://eproc.rajasthan.gov.in",
  TamilNadu:        "https://tntenders.gov.in",
  WestBengal:       "https://wbtenders.gov.in",
  Delhi:            "https://ddtenders.gov.in",
  Kerala:           "https://etenders.kerala.gov.in",
  HimachalPradesh:  "https://hptenders.gov.in",
  Jharkhand:        "https://jharkhandtenders.gov.in",
  Odisha:           "https://tendersodisha.gov.in",
  Punjab:           "https://eproc.punjab.gov.in",
  Haryana:          "https://etenders.hry.nic.in",
  MadhyaPradesh:    "https://mptenders.gov.in",
  Bihar:            "https://eproc.bihar.gov.in",
  Assam:            "https://assamtenders.gov.in",
  Uttarakhand:      "https://uktenders.gov.in",
  JammuKashmir:     "https://jktenders.gov.in",
  Goa:              "https://goatenders.gov.in",
  // Non-NIC India
  Karnataka:        "https://eproc.karnataka.gov.in",
  Gujarat:          "https://tender.nprocure.com",
  Telangana:        "https://tender.telangana.gov.in",
  // International
  "UK-Tenders":         "https://www.find-tender.service.gov.uk",
  "TED-Works":          "https://ted.europa.eu",
  "TED-Services":       "https://ted.europa.eu",
  "TED-Supplies":       "https://ted.europa.eu",
  "Australia-Tenders":  "https://www.tenders.gov.au",
  "Singapore-GeBIZ":    "https://www.gebiz.gov.sg",
  WorldBank:            "https://projects.worldbank.org/en/projects-operations/procurement",
  UNGM:                 "https://www.ungm.org/Public/Notice",
  ADB:                  "https://www.adb.org/projects/tenders/all",
};

const HOW_TO_APPLY_INDIA = {
  step1: "Register on source portal as vendor",
  step2: "Download and read tender document carefully",
  step3: "Arrange all required documents",
  step4: "Get DSC - Digital Signature Certificate",
  step5: "Pay EMD via DD/BG/NEFT as specified",
  step6: "Submit bid online before deadline",
  step7: "Attend bid opening on scheduled date",
};

const HOW_TO_APPLY_INTL = {
  step1: "Register on the international portal",
  step2: "Complete vendor/supplier registration",
  step3: "Download tender/RFP documents",
  step4: "Prepare technical and financial proposal",
  step5: "Arrange required certifications",
  step6: "Submit bid before deadline online",
  step7: "Track bid status on portal",
};

function enrichTender(raw, source) {
  const deadlineDate  = parseDate(raw.deadline_date);
  const status        = getStatus(deadlineDate);
  const today         = new Date(); today.setHours(0, 0, 0, 0);
  const daysRemaining = deadlineDate
    ? Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
    : -1;
  const uniqueId = getUniqueId(raw, source.portal);

  return {
    ...raw,
    unique_id:                uniqueId,
    source_portal:            source.portal,
    tender_type:              source.type,
    status,
    days_remaining:           daysRemaining,
    deadline_timestamp:       deadlineDate  || null,
    published_timestamp:      parseDate(raw.published_date) || null,
    scraped_at:               new Date(),
    how_to_apply:             source.type === "india" ? HOW_TO_APPLY_INDIA : HOW_TO_APPLY_INTL,
    portal_registration_link: PORTAL_LINKS[source.portal] || source.url,
    required_documents:       source.type === "india"
      ? "GST Certificate, PAN Card, Company Registration, Work Experience Certificates, Turnover Proof (CA certified), EMD proof, DSC"
      : "Company Registration, Tax Compliance Certificate, Financial Statements, Technical Capability Proof, Bid Security/Bank Guarantee",
  };
}

/* ── Scrape via ScraperAPI + Thinksuite ────────────────────────────────────── */

function htmlToText(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&#[0-9]+;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function scrapeViaFirecrawl(firecrawlKey, claude, source) {
  if (!firecrawlKey) {
    console.log(`[FC] ${source.portal}: FIRECRAWL_API_KEY not set, skipping`);
    return [];
  }
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method:  "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${firecrawlKey}` },
    body:    JSON.stringify({
      url:     source.url,
      formats: ["markdown"],
      actions: [{ type: "wait", milliseconds: 5000 }],
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) {
    console.log(`[FC] ${source.portal}: Firecrawl HTTP ${res.status}`);
    return [];
  }
  const json = await res.json();
  const text = json?.data?.markdown || json?.markdown || "";
  console.log(`[FC] ${source.portal}: markdown length=${text.length}`);
  return extractTendersFromText(text, source, claude, "FC");
}

async function scrapeViaScraper(scraperApiKey, claude, source) {
  const premiumParam = source.scraperPremium ? "&premium=true" : "";
  const scraperUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(source.url)}&render=true&wait=5000${premiumParam}`;
  const res = await fetch(scraperUrl, { signal: AbortSignal.timeout(60000) });

  if (!res.ok) {
    console.log(`[scraper] ${source.portal}: ScraperAPI ${res.status}`);
    return [];
  }

  const text = htmlToText(await res.text());
  return extractTendersFromText(text, source, claude, "scraper");
}

/* ── Scrape TED-EU via RSS (no ScraperAPI needed) ──────────────────────── */

function parseTEDDate(str) {
  // "01/06/2026 (UTC+02)" → "01/06/2026"
  const m = str.match(/(\d{2}\/\d{2}\/\d{4})/);
  return m ? m[1] : "N/A";
}

async function scrapeViaRSS(source) {
  const res = await fetch(source.url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    console.log(`[scraper] ${source.portal}: RSS fetch ${res.status}`);
    return [];
  }

  const xml   = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  return items.map(item => {
    const get = (tag) => {
      const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? (m[1] || m[2] || "").trim() : "";
    };

    const rawTitle = get("title");
    const desc     = get("description");
    const link     = get("link");
    const pubDate  = get("pubDate");

    // "300133-2026: France – Surface work for roads – ORG -- Title"
    const titleMatch = rawTitle.match(/^([\d-]+):\s*([^–]+?)\s*–\s*([^–]+?)\s*–\s*(.+)/);
    const notice_id  = titleMatch?.[1] || "N/A";
    const country    = titleMatch?.[2]?.trim() || "N/A";
    const sector     = titleMatch?.[3]?.trim() || "N/A";
    const rest       = titleMatch?.[4] || rawTitle;
    const [org, tenderTitle] = rest.includes(" -- ") ? rest.split(" -- ") : ["N/A", rest];

    const deadlineMatch = desc.match(/Deadline[^:]*:\s*([^;]+)/i);
    const deadline_date = deadlineMatch ? parseTEDDate(deadlineMatch[1]) : "N/A";

    const published_date = pubDate
      ? new Date(pubDate).toLocaleDateString("en-GB").replace(/\//g, "/")
      : "N/A";

    return {
      title:          tenderTitle?.trim() || rawTitle,
      tender_id:      notice_id,
      organization:   org?.trim() || "N/A",
      state_city:     country,
      value:          "N/A",
      currency:       "EUR",
      emd:            "N/A",
      deadline_date,
      published_date,
      sector,
      direct_link:    link,
      description:    desc,
    };
  });
}

/* ── Universal AI extractor  adapts when HTML structure changes ────────── */

// Primary Thinksuite extraction attempt
async function claudeExtract(text, source, claude, tag) {
  const msg = await claude.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system:     "You are a government tender data extractor. Extract ALL tenders. Return ONLY a valid JSON array starting with [. No markdown. If none found return [].",
    messages: [{
      role:    "user",
      content: `Extract all tenders/bids from this ${tag} portal page (${source.portal}, ${source.country}).
Return JSON array with these fields per tender:
- title, tender_id, organization, state_city, value, currency, emd
- deadline_date (DD/MM/YYYY), published_date (DD/MM/YYYY)
- sector, direct_link, description
- search_keywords: array of 8-12 lowercase synonyms/related terms for this tender (e.g. for "Solar Street Light Supply": ["solar","led","solar light","street light","outdoor lighting","photovoltaic","solar lamp","renewable","luminaire","solar lantern"])

${text.slice(0, 22000)}`,
    }],
  });
  const raw = msg.content[0]?.text || "[]";
  const m = raw.match(/\[[\s\S]*\]/);
  return m ? JSON.parse(m[0]) : [];
}

// Adaptive fallback  re-prompts Thinksuite with broader context when structure changed
async function aiAdaptExtract(text, source, claude) {
  console.log(`[AI-ADAPT] ${source.portal}: retrying with adaptive extraction`);
  const msg = await claude.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system:     "You are a procurement data extractor. The page structure may have changed. Find ANY repeated pattern  table rows, list items, divs  that represents a tender, bid, or contract notice. Return ONLY a JSON array starting with [.",
    messages: [{
      role:    "user",
      content: `Government procurement portal: ${source.portal} (${source.country}).
HTML structure may differ from expected. Look for ANY tender/bid/contract listings  tables, cards, lists, anything repeated.

Return JSON array: title, tender_id, organization, state_city, value, currency, emd, deadline_date (DD/MM/YYYY), published_date (DD/MM/YYYY), sector, direct_link, description. Use "N/A" for missing fields.

Full page text (${text.length} chars):
${text.slice(0, 28000)}`,
    }],
  });
  const raw = msg.content[0]?.text || "[]";
  const m = raw.match(/\[[\s\S]*\]/);
  return m ? JSON.parse(m[0]) : [];
}

// Shared extractor used by both scrapeViaScraper and scrapeViaNIC
async function extractTendersFromText(text, source, claude, tag) {
  if (text.length < 300) {
    console.log(`[${tag}] ${source.portal}: response too short (${text.length} chars)`);
    return [];
  }
  try {
    const result = await claudeExtract(text, source, claude, tag);
    if (result.length > 0) return result;
    // Thinksuite returned []  page structure may have changed, retry adaptively
    console.log(`[${tag}] ${source.portal}: primary extraction returned 0  trying adaptive`);
    return await aiAdaptExtract(text, source, claude);
  } catch {
    try { return await aiAdaptExtract(text, source, claude); } catch { return []; }
  }
}

/* ── Scrape NIC portals via 2captcha CAPTCHA solving ───────────────────── */

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";

function extractHidden(html, name) {
  const m = html.match(new RegExp(`name="${name}"\\s+value="([^"]*)"`) ) ||
            html.match(new RegExp(`name="${name}"[^>]*value="([^"]*)"`));
  return m ? m[1] : "";
}

// AI-adaptive: when regex fails to locate CAPTCHA or Tapestry form fields,
// Thinksuite reads the raw HTML and finds them regardless of attribute order / portal version
async function aiAdaptNICPage(html, source, claude) {
  console.log(`[NIC-AI] ${source.portal}: running AI-adaptive page analysis`);
  try {
    const msg = await claude.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:     "You analyse Indian government NIC tender portal HTML. Return ONLY valid JSON, no explanation.",
      messages: [{
        role:    "user",
        content: `Analyse this NIC tender portal HTML and extract form parameters.

Find:
1. Any base64 CAPTCHA image  any img tag whose src starts with "data:image/" (attribute order may vary)
2. The hidden input named "seedids"  its value attribute
3. The hidden input named "formids"  its value attribute
4. Any hidden inputs named If_\\d+ (Tapestry component IDs)

Return ONLY this JSON (no markdown):
{
  "captchaBase64": "<base64 string after the comma in data:image/...;base64,  omit the prefix> or null",
  "seedids": "<value or empty string>",
  "formids": "<value or empty string>",
  "extraFields": { "<If_N>": "<value>" }
}

HTML (first 14000 chars):
${html.slice(0, 14000)}`,
      }],
    });
    const raw = msg.content[0]?.text || "{}";
    const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
    if (s === -1) return null;
    const parsed = JSON.parse(raw.slice(s, e + 1));
    console.log(`[NIC-AI] ${source.portal}: AI found captcha=${!!parsed.captchaBase64}, seedids=${!!parsed.seedids}, formids=${!!parsed.formids}`);
    return parsed;
  } catch (err) {
    console.log(`[NIC-AI] ${source.portal}: AI analysis error: ${err.message}`);
    return null;
  }
}

async function solve2captcha(apiKey, base64img) {
  const body = new URLSearchParams({ key: apiKey, method: "base64", body: base64img, json: "1" });
  const submitRes  = await fetch("https://2captcha.com/in.php", { method: "POST", body });
  const { status, request: id } = await submitRes.json();
  if (status !== 1) throw new Error(`2captcha submit failed: ${id}`);

  // Poll every 3s, max 60s
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const pollRes  = await fetch(`https://2captcha.com/res.php?key=${apiKey}&action=get&id=${id}&json=1`);
    const { status: s, request: result } = await pollRes.json();
    if (s === 1)                   return result;
    if (result !== "CAPCHA_NOT_READY") throw new Error(`2captcha error: ${result}`);
  }
  throw new Error("2captcha timeout");
}

async function scrapeViaNIC(source, twoCaptchaKey, claude, scraperApiKey) {
  if (!twoCaptchaKey) {
    console.log(`[NIC] ${source.portal}: TWO_CAPTCHA_KEY not set, skipping`);
    return [];
  }

  // Route through ScraperAPI residential proxies to improve reach to Indian gov portals
  const sessionNum   = Math.floor(Math.random() * 9999);
  const makeScraperUrl = (targetUrl) =>
    scraperApiKey
      ? `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}&render=true&premium=true&session_number=${sessionNum}`
      : targetUrl;

  // 1. Load the page
  const fetchUrl = makeScraperUrl(source.url);
  const pageRes = await fetch(fetchUrl, {
    headers: scraperApiKey ? {} : {
      "User-Agent":      UA,
      "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection":      "keep-alive",
      "Cache-Control":   "no-cache",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(45000),
  });
  const html         = await pageRes.text();
  const cookieHeader = pageRes.headers.get("set-cookie") || "";
  const cookies      = cookieHeader.split(",").map(c => c.split(";")[0].trim()).join("; ");

  console.log(`[NIC] ${source.portal}: HTML length=${html.length}`);

  // ── Extract CAPTCHA: try multiple regex patterns before AI fallback ──────
  const captchaPatterns = [
    /captchaImage[^>]*src="data:image\/[^;]+;base64,([^"]+)"/,
    /id="captchaImage"\s[^>]*src="data:image\/[^;]+;base64,([^"]+)"/,
    /src="data:image\/[^;]+;base64,([^"]+)"[^>]*id="captchaImage"/,
    /<img[^>]*id="captcha[^"]*"[^>]*src="data:image\/[^;]+;base64,([^"]+)"/i,
    /src="data:image\/png;base64,([A-Za-z0-9+/=\r\n]{100,})"/,
  ];
  let captchaBase64 = null;
  for (const pat of captchaPatterns) {
    const m = html.match(pat);
    if (m) { captchaBase64 = m[1].replace(/[\s\r\n]/g, ""); break; }
  }

  // ── Extract Tapestry tokens: regex first ─────────────────────────────────
  let seedids    = (html.match(/name="seedids"[^>]*value="([^"]+)"/) || [])[1] || "";
  let formidsVal = (html.match(/id="LatestActiveTendershidden"[\s\S]*?name="formids"\s+value="([^"]+)"/) || [])[1] || "";

  // ── AI fallback: one call covers all missing fields ──────────────────────
  if (!captchaBase64 || !seedids || !formidsVal) {
    const ai = await aiAdaptNICPage(html, source, claude);
    if (ai) {
      if (!captchaBase64 && ai.captchaBase64) captchaBase64 = ai.captchaBase64.replace(/[\s\r\n]/g, "");
      if (!seedids        && ai.seedids)       seedids       = ai.seedids;
      if (!formidsVal     && ai.formids)        formidsVal    = ai.formids;
    }
  }

  if (!captchaBase64) {
    console.log(`[NIC] ${source.portal}: CAPTCHA not found even with AI  skipping`);
    return [];
  }
  if (!formidsVal) formidsVal = "tokenSecret,TenderId,TenderTitle,size,captchaText,captcha,Submit";

  const fieldIds = formidsVal.split(",");
  console.log(`[NIC] ${source.portal}: formids=${formidsVal}, seedids=${seedids ? "found" : "MISSING"}`);

  // 2. Solve CAPTCHA via 2captcha
  const captchaSolution = await solve2captcha(twoCaptchaKey, captchaBase64);
  console.log(`[NIC] ${source.portal}: CAPTCHA solved → "${captchaSolution}"`);

  // 3. POST the search form
  const parsedUrl = new URL(source.url);
  const postTarget = `${parsedUrl.origin}${parsedUrl.pathname}`;
  const postUrl    = makeScraperUrl(postTarget);

  const formData = new URLSearchParams({
    formids:    formidsVal,
    seedids,
    component:  "LatestActiveTenders",
    page:       "FrontEndLatestActiveTenders",
    service:    "direct",
    session:    "T",
    submitmode: "",
    submitname: "",
  });

  // Dynamically populate fields  different NIC portals use different If_N numbers
  for (const fid of fieldIds) {
    if      (fid === "captchaText")                                  formData.set(fid, captchaSolution);
    else if (["TenderId","TenderTitle","captcha"].includes(fid))     formData.set(fid, "");
    else if (fid === "size")                                         formData.set(fid, "1");
    else if (fid === "Submit")                                       formData.set(fid, "Search");
    else                                                             formData.set(fid, extractHidden(html, fid));
  }

  const postHeaders = scraperApiKey
    ? { "Content-Type": "application/x-www-form-urlencoded" }
    : {
        "Content-Type":    "application/x-www-form-urlencoded",
        "User-Agent":      UA,
        "Cookie":          cookies,
        "Referer":         source.url,
        "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      };

  const formRes = await fetch(postUrl, {
    method:   "POST",
    body:     formData,
    redirect: "follow",
    headers:  postHeaders,
    signal:   AbortSignal.timeout(45000),
  });

  const resultHtml = await formRes.text();
  console.log(`[NIC] ${source.portal}: POST ${formRes.status}, HTML=${resultHtml.length}, url=${formRes.url}`);

  if (resultHtml.length < 5000) {
    console.log(`[NIC] ${source.portal}: small response: ${htmlToText(resultHtml).slice(0, 400)}`);
  }

  const text = htmlToText(resultHtml);

  // 4. Extract via Thinksuite  with AI-adapt fallback if result is thin
  const extractResult = await extractTendersFromText(text, source, claude, "NIC");
  return extractResult;
}

/* ── World Bank procurement API ────────────────────────────────────────── */

async function scrapeViaWorldBank() {
  // World Bank Active Projects API  returns bank-funded projects with procurement
  const url = "https://search.worldbank.org/api/v2/projects?format=json&status=Active&rows=50&fl=id,project_name,countryname,totalamt,closingdate,boardapprovaldate,url,sector,theme";
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    console.log(`[WB] World Bank API ${res.status}`);
    return [];
  }
  const json  = await res.json();
  // Response is an object keyed by project ID, not an array
  const docs  = Object.values(json?.projects || json || {}).filter(d => d?.id);
  console.log(`[WB] World Bank: ${docs.length} active projects`);

  return docs.map(d => {
    const country  = Array.isArray(d.countryname) ? d.countryname[0] : (d.countryname || "N/A");
    const deadline = d.closingdate
      ? new Date(d.closingdate).toLocaleDateString("en-GB")
      : "N/A";
    const published = d.boardapprovaldate
      ? new Date(d.boardapprovaldate).toLocaleDateString("en-GB")
      : "N/A";
    return {
      title:          d.project_name || "N/A",
      tender_id:      d.id || "N/A",
      organization:   "World Bank",
      state_city:     country,
      value:          d.totalamt ? `USD ${Number(d.totalamt).toLocaleString()}` : "N/A",
      currency:       "USD",
      emd:            "N/A",
      deadline_date:  deadline,
      published_date: published,
      sector:         Array.isArray(d.sector) ? d.sector[0] : (d.sector || "N/A"),
      direct_link:    d.url || `https://projects.worldbank.org/en/projects-operations/project-detail/${d.id}`,
      description:    d.project_name || "N/A",
    };
  });
}

/* ── Dispatch by method ────────────────────────────────────────────────── */

async function scrapeSource(scraperApiKey, claude, source, twoCaptchaKey, firecrawlKey) {
  try {
    console.log(`[scraper] Starting: ${source.portal}`);

    let raw;
    if      (source.method === "rss")        raw = await scrapeViaRSS(source);
    else if (source.method === "nic")        raw = await scrapeViaNIC(source, twoCaptchaKey, claude, scraperApiKey);
    else if (source.method === "worldbank")  raw = await scrapeViaWorldBank();
    else if (source.method === "firecrawl")  raw = await scrapeViaFirecrawl(firecrawlKey, claude, source);
    else                                     raw = await scrapeViaScraper(scraperApiKey, claude, source);

    const enriched = raw
      .map(t => enrichTender(t, source))
      .filter(t => t.status !== "expired");

    console.log(`[scraper] ${source.portal}: ${raw.length} found, ${enriched.length} active`);
    return enriched;
  } catch (err) {
    console.error(`[scraper] ${source.portal} failed:`, err.message);
    return [];
  }
}

/* ── Batch save to Firestore ───────────────────────────────────────────── */

async function batchSave(db, tenders, collection) {
  const BATCH_SIZE = 400;
  let saved = 0;
  for (let i = 0; i < tenders.length; i += BATCH_SIZE) {
    const batch = db.batch();
    tenders.slice(i, i + BATCH_SIZE).forEach(t => {
      const ref = db.collection(collection).doc(t.unique_id);
      batch.set(ref, t, { merge: true });
    });
    await batch.commit();
    saved += Math.min(BATCH_SIZE, tenders.length - i);
  }
  return saved;
}

function dedupe(arr) {
  const seen = new Set();
  return arr.filter(t => {
    if (seen.has(t.unique_id)) return false;
    seen.add(t.unique_id);
    return true;
  });
}

/* ── GET handler ───────────────────────────────────────────────────────── */

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scraperApiKey  = process.env.SCRAPER_API_KEY;
  const twoCaptchaKey  = process.env.TWO_CAPTCHA_KEY;
  const firecrawlKey   = process.env.FIRECRAWL_API_KEY;
  const claude         = getAIClient();
  const db             = getAdminDb();

  // ?portal=GeM-P1  → test one portal
  // ?type=fast      → RSS + scraper + worldbank (no GeM, no NIC)  ~80s
  // ?type=gem       → GeM pages only  ~60-150s
  // ?type=nic       → NIC portals only  ~200s
  // no param        → all (will timeout; use type= for production crons)
  const { searchParams } = new URL(request.url);
  const portalFilter = searchParams.get("portal");
  const typeFilter   = searchParams.get("type");

  const sources = portalFilter
    ? ALL_SOURCES.filter(s => s.portal === portalFilter)
    : typeFilter === "nic"
    ? ALL_SOURCES.filter(s => s.method === "nic")
    : typeFilter === "gem"
    ? ALL_SOURCES.filter(s => s.portal.startsWith("GeM"))
    : typeFilter === "fast"
    ? ALL_SOURCES.filter(s => s.method !== "nic" && !s.portal.startsWith("GeM"))
    : typeFilter === "intl"
    ? INTL_SOURCES
    : ALL_SOURCES;

  const indiaTenders = [];
  const intlTenders  = [];
  const perPortal    = {};

  // Run sources in parallel batches  NIC portals capped at 3 concurrent (2captcha rate limit)
  // Firecrawl GeM capped at 2 concurrent (API rate limits), fast sources 5 at a time
  async function runBatch(batch, concurrency) {
    for (let i = 0; i < batch.length; i += concurrency) {
      const slice   = batch.slice(i, i + concurrency);
      const results = await Promise.all(
        slice.map(s => scrapeSource(scraperApiKey, claude, s, twoCaptchaKey, firecrawlKey))
      );
      results.forEach((tenders, idx) => {
        const source = slice[idx];
        perPortal[source.portal] = tenders.length;
        if (source.type === "india") indiaTenders.push(...tenders);
        else                         intlTenders.push(...tenders);
      });
    }
  }

  const nicSources  = sources.filter(s => s.method === "nic");
  const gemSources  = sources.filter(s => s.portal.startsWith("GeM"));
  const fastSources = sources.filter(s => s.method !== "nic" && !s.portal.startsWith("GeM"));

  // Fast sources (RSS + scraper + worldbank)  5 concurrent
  await runBatch(fastSources, 5);
  // GeM pages  2 concurrent (render=true ScraperAPI, heavy JS)
  await runBatch(gemSources,  2);
  // NIC portals  3 concurrent (2captcha rate limits)
  await runBatch(nicSources,  3);

  /* Deduplicate */
  const uniqueIndia = dedupe(indiaTenders);
  const uniqueIntl  = dedupe(intlTenders);

  /* Save to Firestore */
  const savedIndia = await batchSave(db, uniqueIndia, "tenders_india");
  const savedIntl  = await batchSave(db, uniqueIntl,  "tenders_international");

  const indiaPortals = Object.fromEntries(
    INDIA_SOURCES.map(s => [s.portal, perPortal[s.portal] ?? 0])
  );
  const intlPortals = Object.fromEntries(
    INTL_SOURCES.map(s => [s.portal, perPortal[s.portal] ?? 0])
  );

  return Response.json({
    success:    true,
    scraped_at: new Date().toISOString(),
    india: {
      total_saved: savedIndia,
      per_portal:  indiaPortals,
    },
    international: {
      total_saved: savedIntl,
      per_portal:  intlPortals,
    },
  });
}
