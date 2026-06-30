/**
 * MSME / Udyam Registration Data Integration
 *
 * Sources:
 *   1. Udyam registration portal — udyamregistration.gov.in (official, searchable)
 *   2. MSME Sambandh / Samadhaan portals — additional data
 *   3. DataForSEO/DDG SERP search for Udyam number + company snippets
 *   4. Direct Jina scrape of Udyam verification pages
 *
 * What MSME/Udyam gives us (unique vs Apollo):
 *   - Udyam registration number (format: UDYAM-XX-00-0000000)
 *   - Enterprise type: Micro / Small / Medium
 *   - NIC activity code → exact business type
 *   - Owner/proprietor name (for sole prop / partnership)
 *   - District + state + PIN
 *   - Major activity: Manufacturing / Services
 *   - Date of incorporation + Udyam registration date
 *   - ~6.5 crore MSMEs registered — most are NOT on Apollo/ZoomInfo
 */

import { serperSearch, jinaFetch } from "../scraperUtils.js";
import { fetchPage, extractContacts } from "../crawler.js";

const UDYAM_REGEX = /UDYAM-[A-Z]{2}-\d{2}-\d{7}/g;

// NIC code → Business category (most common MSME types)
const NIC_CATEGORIES = {
  "10": "Food Products", "11": "Beverages", "13": "Textiles", "14": "Apparel",
  "15": "Leather", "16": "Wood Products", "17": "Paper Products", "18": "Printing",
  "20": "Chemicals", "21": "Pharma", "22": "Rubber/Plastics", "23": "Non-metallic",
  "24": "Basic Metals", "25": "Fabricated Metals", "26": "Electronics",
  "27": "Electrical Equipment", "28": "Machinery", "29": "Motor Vehicles",
  "30": "Other Transport", "31": "Furniture", "32": "Other Manufacturing",
  "41": "Construction", "45": "Wholesale Trade", "46": "Wholesale Trade",
  "47": "Retail Trade", "49": "Transport", "50": "Water Transport",
  "51": "Air Transport", "52": "Warehousing/Storage", "55": "Accommodation",
  "56": "Food Service", "58": "Publishing", "59": "Media Production",
  "61": "Telecom", "62": "IT Services", "63": "Information Services",
  "64": "Financial Services", "65": "Insurance", "66": "Financial Services",
  "68": "Real Estate", "69": "Legal/Accounting", "70": "Management Consulting",
  "71": "Architecture/Engineering", "72": "R&D", "73": "Advertising",
  "74": "Other Professional", "75": "Veterinary", "77": "Rental Services",
  "78": "Employment Services", "79": "Travel/Tourism", "80": "Security Services",
  "81": "Facility Management", "82": "Business Support", "85": "Education",
  "86": "Healthcare", "87": "Residential Care", "88": "Social Work",
  "90": "Arts/Entertainment", "91": "Libraries/Museums", "92": "Gambling",
  "93": "Sports/Recreation", "94": "Membership Organizations",
  "95": "Repair Services", "96": "Personal Services",
};

export function nicToCategory(nicCode = "") {
  const prefix = String(nicCode).slice(0, 2);
  return NIC_CATEGORIES[prefix] || "Other";
}

// ── Extract Udyam numbers from text ────────────────────────────────────────────
export function extractUdyamNumbers(text = "") {
  return [...new Set((text.match(UDYAM_REGEX) || []))];
}

// ── Lookup Udyam number via official verification portal ────────────────────────
export async function lookupUdyam(udyamNo) {
  if (!udyamNo || !/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/.test(udyamNo)) return null;

  // Try Udyam verification portal via Jina scrape
  try {
    const verifyUrl = `https://udyamregistration.gov.in/UdyamSearch?udyamno=${udyamNo}`;
    const content = await jinaFetch(verifyUrl, 12000);
    if (content && content.length > 200) {
      return parseUdyamPage(content, udyamNo);
    }
  } catch {}

  // Fallback: search SERP for the Udyam number
  try {
    const results = await serperSearch(`"${udyamNo}" enterprise name address`, "in", 5);
    for (const r of results) {
      const numbers = extractUdyamNumbers(r.snippet + " " + r.title);
      if (numbers.includes(udyamNo)) {
        return {
          udyamNo,
          businessName: extractNameFromSnippet(r.snippet + " " + r.title),
          source: "serp_snippet",
        };
      }
    }
  } catch {}

  return null;
}

function parseUdyamPage(content, udyamNo) {
  const result = { udyamNo, source: "udyam_portal" };

  const nameMatch = content.match(/Enterprise\s+Name\s*[:\|]\s*([^\n\r|]+)/i);
  if (nameMatch) result.businessName = nameMatch[1].trim();

  const ownerMatch = content.match(/Owner\s+Name\s*[:\|]\s*([^\n\r|]+)/i)
    || content.match(/Proprietor\s*[:\|]\s*([^\n\r|]+)/i);
  if (ownerMatch) result.ownerName = ownerMatch[1].trim();

  const typeMatch = content.match(/(Micro|Small|Medium)\s+Enterprise/i);
  if (typeMatch) result.enterpriseType = typeMatch[1];

  const activityMatch = content.match(/Major\s+Activity\s*[:\|]\s*([^\n\r|]+)/i);
  if (activityMatch) result.majorActivity = activityMatch[1].trim();

  const nicMatch = content.match(/NIC\s+(?:Code|Activity)\s*[:\|]\s*([0-9]{2,5})/i);
  if (nicMatch) {
    result.nicCode = nicMatch[1];
    result.industry = nicToCategory(nicMatch[1]);
  }

  const stateMatch = content.match(/State\s*[:\|]\s*([^\n\r|]+)/i);
  if (stateMatch) result.state = stateMatch[1].trim();

  const districtMatch = content.match(/District\s*[:\|]\s*([^\n\r|]+)/i);
  if (districtMatch) result.city = districtMatch[1].trim();

  const pinMatch = content.match(/PIN\s*[:\|]?\s*([0-9]{6})/i);
  if (pinMatch) result.pincode = pinMatch[1];

  const dateMatch = content.match(/Date\s+of\s+(?:Incorporation|Registration)\s*[:\|]\s*([^\n\r|]+)/i);
  if (dateMatch) result.incorporationDate = dateMatch[1].trim();

  const udyamDateMatch = content.match(/Udyam\s+Registration\s+Date\s*[:\|]\s*([^\n\r|]+)/i);
  if (udyamDateMatch) result.udyamRegistrationDate = udyamDateMatch[1].trim();

  return Object.keys(result).length > 2 ? result : null;
}

function extractNameFromSnippet(text) {
  const patterns = [
    /([A-Z][A-Za-z\s&.'-]{3,50}(?:Pvt|Ltd|LLP|Enterprises|Industries|Traders|Agency|Services|Solutions|Works|Manufacturing|Export|Import)\.?(?:\s+Ltd\.?)?)/,
    /([A-Z][A-Za-z\s&.'-]{3,50})\s+is\s+(?:a|an)\s+(?:Micro|Small|Medium)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return "";
}

// ── Search MSMEs by business type + state ─────────────────────────────────────
export async function searchMSMEs({ niche, state, city = "", maxResults = 20 }) {
  const leads = [];
  const seen = new Set();

  const queries = buildSearchQueries(niche, state, city);

  for (const query of queries.slice(0, 3)) {
    try {
      const results = await serperSearch(query, "in", 10);
      for (const r of results) {
        const udyamNos = extractUdyamNumbers(r.snippet + " " + r.title + " " + (r.link || ""));

        if (udyamNos.length > 0) {
          for (const udyamNo of udyamNos) {
            if (seen.has(udyamNo)) continue;
            seen.add(udyamNo);
            const lead = await extractLeadFromResult(r, udyamNo, niche, state);
            if (lead) leads.push(lead);
          }
        } else {
          // No Udyam number found — still extract contact info from snippet
          const nameKey = r.title?.toLowerCase().trim();
          if (nameKey && !seen.has(nameKey)) {
            seen.add(nameKey);
            const lead = await extractLeadFromResult(r, null, niche, state);
            if (lead && lead.businessName) leads.push(lead);
          }
        }

        if (leads.length >= maxResults) break;
      }
    } catch {}

    if (leads.length >= maxResults) break;
  }

  return leads.slice(0, maxResults);
}

function buildSearchQueries(niche, state, city) {
  const location = city ? `${city}, ${state}` : state;
  return [
    `UDYAM ${niche} ${location} site:udyamregistration.gov.in OR site:msme.gov.in`,
    `"UDYAM-${stateCode(state)}" ${niche} ${location} enterprise`,
    `${niche} MSME registered ${location} Udyam certificate`,
    `${niche} small enterprise ${location} manufacturer supplier`,
    `Udyam ${niche} ${state} contact phone email`,
  ];
}

// State to Udyam 2-letter code mapping
const STATE_UDYAM_CODE = {
  "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", "Assam": "AS",
  "Bihar": "BR", "Chhattisgarh": "CG", "Goa": "GA", "Gujarat": "GJ",
  "Haryana": "HR", "Himachal Pradesh": "HP", "Jharkhand": "JH",
  "Karnataka": "KA", "Kerala": "KL", "Madhya Pradesh": "MP",
  "Maharashtra": "MH", "Manipur": "MN", "Meghalaya": "ML",
  "Mizoram": "MZ", "Nagaland": "NL", "Odisha": "OD", "Punjab": "PB",
  "Rajasthan": "RJ", "Sikkim": "SK", "Tamil Nadu": "TN",
  "Telangana": "TS", "Tripura": "TR", "Uttar Pradesh": "UP",
  "Uttarakhand": "UA", "West Bengal": "WB", "Delhi": "DL",
  "Jammu & Kashmir": "JK", "Ladakh": "LA", "Chandigarh": "CH",
};

export function stateCode(stateName = "") {
  return STATE_UDYAM_CODE[stateName] || "MH";
}

async function extractLeadFromResult(result, udyamNo, niche, state) {
  const lead = {
    source: "msme_udyam",
    type: "msme",
    tags: ["msme", "udyam"],
    niche,
    state,
    collectedAt: Date.now(),
  };

  if (udyamNo) {
    lead.udyamNo = udyamNo;
    lead.tags.push("udyam_number");
  }

  // Parse business name from title
  const title = result.title || "";
  lead.businessName = title
    .replace(/\s*[-|:]\s*.*/g, "")
    .replace(/UDYAM[- ][A-Z]{2}-\d{2}-\d{7}/g, "")
    .trim() || title;

  // Parse contacts from snippet
  const snippet = result.snippet || "";
  const contacts = extractContacts(snippet + " " + title);
  if (contacts.phones.length > 0) lead.phone = contacts.phones[0];
  if (contacts.emails.length > 0) lead.email = contacts.emails[0];
  if (contacts.websites.length > 0) lead.website = contacts.websites[0];

  // Parse enterprise type
  const typeMatch = snippet.match(/(Micro|Small|Medium)\s+Enterprise/i);
  if (typeMatch) {
    lead.enterpriseType = typeMatch[1];
    lead.tags.push(typeMatch[1].toLowerCase());
  }

  // Parse major activity
  if (/manufactur/i.test(snippet)) lead.majorActivity = "Manufacturing";
  else if (/service/i.test(snippet)) lead.majorActivity = "Services";

  lead.sourceUrl = result.link || "";

  return lead.businessName ? lead : null;
}

// ── Scrape MSME Sambandh (CPSE data) ─────────────────────────────────────────
export async function scrapeUdyamVerification(udyamNo) {
  if (!udyamNo) return null;

  const url = `https://udyamregistration.gov.in/UdyamSearch?udyamno=${encodeURIComponent(udyamNo)}`;
  const content = await jinaFetch(url, 15000);
  if (!content || content.length < 100) return null;
  return parseUdyamPage(content, udyamNo);
}

// ── Batch: crawl MSME directory for a state + business type ─────────────────
export async function crawlMSMEDirectory({ state, niche, page = 1 }) {
  const leads = [];

  // Udyam Help portal has searchable data
  const searchUrl = `https://udyamhelp.in/search?state=${encodeURIComponent(state)}&activity=${encodeURIComponent(niche)}&page=${page}`;
  try {
    const content = await jinaFetch(searchUrl, 15000);
    if (content && content.length > 500) {
      const parsed = parseUdyamDirectoryPage(content, state, niche);
      leads.push(...parsed);
    }
  } catch {}

  if (leads.length === 0) {
    // Fallback: SERP-based discovery
    const discovered = await searchMSMEs({ niche, state, maxResults: 15 });
    leads.push(...discovered);
  }

  return leads;
}

function parseUdyamDirectoryPage(content, state, niche) {
  const leads = [];
  const lines = content.split("\n");

  let current = {};
  for (const line of lines) {
    const udyamMatch = line.match(/UDYAM-[A-Z]{2}-\d{2}-\d{7}/);
    if (udyamMatch) {
      if (current.businessName) leads.push(current);
      current = {
        udyamNo: udyamMatch[0],
        source: "msme_udyam",
        type: "msme",
        tags: ["msme", "udyam"],
        state,
        niche,
        collectedAt: Date.now(),
      };
    }

    if (current.udyamNo) {
      if (/enterprise\s+name/i.test(line)) {
        const nameMatch = line.match(/enterprise\s+name\s*[:\|]\s*([^\n]+)/i);
        if (nameMatch) current.businessName = nameMatch[1].trim();
      }
      if (/(micro|small|medium)\s+enterprise/i.test(line)) {
        const typeMatch = line.match(/(micro|small|medium)/i);
        if (typeMatch) current.enterpriseType = typeMatch[1];
      }
      if (/district\s*[:\|]/i.test(line)) {
        const distMatch = line.match(/district\s*[:\|]\s*([^\n]+)/i);
        if (distMatch) current.city = distMatch[1].trim();
      }
      if (/phone|mobile/i.test(line)) {
        const phones = line.match(/[6-9]\d{9}/g);
        if (phones) current.phone = phones[0];
      }
    }
  }

  if (current.businessName) leads.push(current);
  return leads;
}
