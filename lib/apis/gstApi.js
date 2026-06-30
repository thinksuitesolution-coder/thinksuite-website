/**
 * India GST Government API Integration
 *
 * Sources:
 *   1. Official GST portal  — services.gst.gov.in (free, no auth for GSTIN lookup)
 *   2. MasterGST aggregator — mastergst.com (search by name, scrape-based)
 *   3. DataForSEO fallback  — search snippets for GSTIN on public sites
 *
 * What GST data gives us (that Apollo doesn't have for India):
 *   - Legal registered name (exact, from government record)
 *   - Trade name (brand name)
 *   - Full address with PIN code
 *   - Business type (Regular, Composite, SEZ, etc.)
 *   - Nature of business activity (what they actually do)
 *   - Registration date
 *   - Active / cancelled / suspended status
 *   - Additional places of business (branches)
 */

import { serperSearch, jinaFetch } from "../scraperUtils.js";

// ── Official GST Portal Lookup by GSTIN ──────────────────────────────────────
export async function lookupGSTIN(gstin) {
  if (!gstin || !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/.test(gstin)) {
    return null;
  }

  // Primary: Official GST services API (public endpoint, no auth)
  try {
    const res = await fetch(
      `https://services.gst.gov.in/services/api/public/gstin?gstin=${gstin}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Referer: "https://services.gst.gov.in/",
          "User-Agent": "Mozilla/5.0",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data.lgnm) return normalizeGSTData(data, gstin);
    }
  } catch {}

  // Fallback: Scrape gstsearch.in
  try {
    const page = await jinaFetch(`https://www.gstsearch.in/gstin/${gstin}`, 10000);
    if (page) return parseGSTFromPage(page, gstin);
  } catch {}

  return null;
}

function normalizeGSTData(d, gstin) {
  const addr = d.pradr?.addr || d.pradr || {};
  const addressStr = [
    addr.bnm, addr.st, addr.loc, addr.dst,
    addr.stcd, addr.pncd,
  ].filter(Boolean).join(", ");

  return {
    gstin,
    legalName:        d.lgnm       || "",
    tradeName:        d.tradeNam   || d.lgnm || "",
    businessType:     d.ctb        || "",       // "Private Limited Company", "Proprietorship", etc.
    status:           d.sts        || "Active",
    registrationDate: d.rgdt       || "",       // "2024-03-01"
    state:            addr.stcd    || d.stj || "",
    city:             addr.dst     || addr.loc || "",
    pincode:          addr.pncd    || "",
    address:          addressStr,
    natureOfBusiness: Array.isArray(d.nba) ? d.nba.join(", ") : (d.nba || ""),
    additionalPlaces: d.adadr?.length || 0,
    cancelDate:       d.cxdt       || null,
  };
}

function parseGSTFromPage(content, gstin) {
  const legalM  = content.match(/Legal\s+Name[:\s]+([A-Z\s&.,'-]{5,80})/i);
  const tradeM  = content.match(/Trade\s+Name[:\s]+([A-Z\s&.,'-]{5,80})/i);
  const stateM  = content.match(/State[:\s]+([A-Za-z\s]{5,40})/i);
  const dateM   = content.match(/Registration\s+Date[:\s]+(\d{2}[-/]\d{2}[-/]\d{4})/i);
  const statusM = content.match(/Status[:\s]+(Active|Cancelled|Suspended)/i);
  const typeM   = content.match(/(?:Type|Business Type)[:\s]+([A-Za-z\s]{5,40})/i);

  const legalName = legalM?.[1]?.trim() || "";
  if (!legalName) return null;

  return {
    gstin,
    legalName,
    tradeName:        tradeM?.[1]?.trim()  || legalName,
    businessType:     typeM?.[1]?.trim()   || "",
    status:           statusM?.[1]?.trim() || "Active",
    registrationDate: dateM?.[1]?.trim()   || "",
    state:            stateM?.[1]?.trim()  || "",
    city:             "",
    pincode:          "",
    address:          "",
    natureOfBusiness: "",
    additionalPlaces: 0,
    cancelDate:       null,
  };
}

// ── Find GSTIN for a company name (search-based) ──────────────────────────────
export async function findGSTINByName(companyName, state = "") {
  if (!companyName) return [];

  const q = `"${companyName}" GSTIN "${state || "India"}" site:gstsearch.in OR site:mastergst.com OR site:taxpayersearch.in`;
  const results = await serperSearch(q, "in", 8);

  const found = [];
  for (const r of results) {
    const text = `${r.title} ${r.snippet}`;
    const m = text.match(/\b([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z])\b/g);
    if (m) found.push(...m);
  }

  return [...new Set(found)].slice(0, 3);
}

// ── Enrich a lead with GST data ───────────────────────────────────────────────
export async function enrichLeadWithGST(lead) {
  const updates = {};

  // If we already have GSTIN, look it up directly
  if (lead.gstNumber) {
    const gstData = await lookupGSTIN(lead.gstNumber);
    if (gstData) {
      if (!lead.description && gstData.natureOfBusiness)
        updates.description = gstData.natureOfBusiness;
      if (!lead.city    && gstData.city)         updates.city    = gstData.city;
      if (!lead.state   && gstData.state)        updates.state   = gstData.state;
      if (gstData.pincode)                       updates.pincode = gstData.pincode;
      if (gstData.address && !lead.address)      updates.address = gstData.address;
      if (gstData.tradeName && !lead.tradeName)  updates.tradeName = gstData.tradeName;
      if (gstData.registrationDate)              updates.gstRegistrationDate = gstData.registrationDate;
      updates.gstStatus = gstData.status;
    }
    return updates;
  }

  // Otherwise, search for GSTIN first
  const gstins = await findGSTINByName(lead.businessName, lead.state);
  if (gstins.length > 0) {
    updates.gstNumber = gstins[0];
    const gstData = await lookupGSTIN(gstins[0]);
    if (gstData) {
      if (!lead.city  && gstData.city)    updates.city    = gstData.city;
      if (!lead.state && gstData.state)   updates.state   = gstData.state;
      if (gstData.pincode)                updates.pincode = gstData.pincode;
      if (gstData.address && !lead.address) updates.address = gstData.address;
      if (gstData.registrationDate)       updates.gstRegistrationDate = gstData.registrationDate;
      updates.gstStatus = gstData.status;
    }
  }

  return updates;
}

// ── Parse state code from GSTIN (first 2 digits) ─────────────────────────────
const GST_STATE_CODES = {
  "01":"Jammu and Kashmir","02":"Himachal Pradesh","03":"Punjab","04":"Chandigarh",
  "05":"Uttarakhand","06":"Haryana","07":"Delhi","08":"Rajasthan","09":"Uttar Pradesh",
  "10":"Bihar","11":"Sikkim","12":"Arunachal Pradesh","13":"Nagaland","14":"Manipur",
  "15":"Mizoram","16":"Tripura","17":"Meghalaya","18":"Assam","19":"West Bengal",
  "20":"Jharkhand","21":"Odisha","22":"Chhattisgarh","23":"Madhya Pradesh",
  "24":"Gujarat","26":"Dadra and Nagar Haveli","27":"Maharashtra","28":"Andhra Pradesh",
  "29":"Karnataka","30":"Goa","31":"Lakshadweep","32":"Kerala","33":"Tamil Nadu",
  "34":"Puducherry","35":"Andaman and Nicobar Islands","36":"Telangana",
  "37":"Andhra Pradesh (New)","38":"Ladakh",
};

export function getStateFromGSTIN(gstin = "") {
  const code = gstin.slice(0, 2);
  return GST_STATE_CODES[code] || "";
}
