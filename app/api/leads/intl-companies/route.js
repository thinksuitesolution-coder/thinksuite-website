import { NextResponse }  from "next/server";
import { getAIClient }   from "@/lib/aiClient";
import { extractEmails, extractPhones, getGl, serperSearch } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";
const FIRECRAWL = null;

export const maxDuration = 90;

const client    = getAIClient();

const INDUSTRY_MAP = {
  "any":           "company",
  "technology":    "IT software technology SaaS",
  "ecommerce":     "ecommerce online retail",
  "manufacturing": "manufacturing industrial production",
  "trading":       "import export trading",
  "healthcare":    "healthcare medical pharma",
  "real-estate":   "real estate construction",
  "education":     "education edtech training",
  "finance":       "finance fintech banking",
  "logistics":     "logistics supply chain transport",
  "retail":        "retail consumer goods distribution",
  "hospitality":   "hospitality travel hotel tourism",
  "media":         "media entertainment publishing",
  "consulting":    "consulting professional services advisory",
  "food-beverage": "food beverage FMCG",
  "energy":        "energy renewable solar oil gas",
  "automotive":    "automotive transport vehicles",
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */

async function firecrawlScrape(url) {
  if (FIRECRAWL) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${FIRECRAWL}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
        signal: AbortSignal.timeout(14000),
      });
      const d = await res.json();
      if (d.success) return (d.data?.markdown || "").slice(0, 6000);
    } catch {}
  }
  try {
    const headers = { Accept: "text/plain", "X-Return-Format": "markdown" };
    const k = process.env.JINA_API_KEY; if (k) headers["Authorization"] = `Bearer ${k}`;
    const res = await fetch(`https://r.jina.ai/${url}`, { headers, signal: AbortSignal.timeout(14000) });
    return res.ok ? (await res.text()).slice(0, 6000) : "";
  } catch { return ""; }
}


/* ── Enrich company with contact ─────────────────────────────────────────── */
async function enrichWithContact(companyName, country, gl) {
  const results = await serperSearch(`"${companyName}" ${country} email phone contact website`, gl, 5);
  let email = "", phone = "", website = "";
  for (const r of results) {
    const text = `${r.snippet} ${r.link}`;
    if (!email) { const e = extractEmails(text); if (e[0]) email = e[0]; }
    if (!phone) { const p = extractPhones(text); if (p[0]) phone = p[0]; }
    if (!website && r.link && !/linkedin|crunchbase|google|facebook|instagram|bloomberg|reuters/i.test(r.link)) website = r.link;
    if (email && phone && website) break;
  }
  // Try scraping website for contact
  if (website && (!email || !phone)) {
    try {
      const md = await firecrawlScrape(website);
      if (!email) { const e = extractEmails(md); if (e[0]) email = e[0]; }
      if (!phone) { const p = extractPhones(md); if (p[0]) phone = p[0]; }
    } catch {}
  }
  return { email, phone, website };
}

/* ── Main handler ─────────────────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { country, city, industry = "any", companySize = "any", count = 15 } = body;
    if (!country) return NextResponse.json({ error: "Country required" }, { status: 400 });

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return NextResponse.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    const industryKeywords = INDUSTRY_MAP[industry] || "company";
    const location = city ? `${city}, ${country}` : country;
    const gl = getGl(country, "us");

    let sizeFilter = "";
    if (companySize === "startup")    sizeFilter = "startup OR early-stage OR founded 2020 2021 2022 2023 2024";
    if (companySize === "small")      sizeFilter = "small business 10-50 employees";
    if (companySize === "sme")        sizeFilter = "SME medium business";
    if (companySize === "midmarket")  sizeFilter = "mid-market company 50-500 employees";
    if (companySize === "enterprise") sizeFilter = "enterprise large company";

    /* ── Step 1: Search company directories for real companies ──────────── */
    const queries = [
      // LinkedIn company search
      `site:linkedin.com/company "${industryKeywords}" "${country}" ${sizeFilter}`,
      // Crunchbase for startups
      `site:crunchbase.com/organization "${industryKeywords}" "${country}" ${sizeFilter}`,
      // Country-specific directories
      `"${industryKeywords}" company ${location} email contact website ${sizeFilter}`,
      `"${industryKeywords}" "${country}" business directory phone email contact`,
      // Specific trade/business directories
      ...(country === "USA" ? [`site:dnb.com "${industryKeywords}" "${city || country}"`] : []),
      ...(["UK","United Kingdom"].includes(country) ? [`site:companieshouse.gov.uk "${industryKeywords}"`] : []),
      ...(["UAE","United Arab Emirates"].includes(country) ? [`site:yellowpages.ae "${industryKeywords}" "${city || country}"`] : []),
      ...(["Germany"].includes(country) ? [`site:europages.com "${industryKeywords}" "Germany"`] : []),
      // Clutch for agencies/tech companies
      `site:clutch.co "${industryKeywords}" "${country}" ${city || ""}`,
      // G2 for tech/software
      ...(["technology","ecommerce"].includes(industry) ? [`site:g2.com company "${industryKeywords}" "${country}"`] : []),
    ].filter(Boolean);

    const searchResults = await Promise.allSettled(
      queries.map(q => serperSearch(q, gl, 10))
    );

    const allItems = [];
    const seenLinks = new Set();
    for (const r of searchResults) {
      if (r.status !== "fulfilled") continue;
      for (const item of r.value) {
        if (!seenLinks.has(item.link)) { seenLinks.add(item.link); allItems.push(item); }
      }
    }

    if (allItems.length === 0) {
      return NextResponse.json({ error: `No companies found for "${industryKeywords}" in ${location}. Try a broader industry or different city.`, leads: [] });
    }

    /* ── Step 2: AI extract real companies from search results ───────────── */
    const snippetText = allItems.map(i => `Title: ${i.title}\nSnippet: ${i.snippet}\nURL: ${i.link}`).join("\n---\n");

    const msg = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 4000,
      system:     `You extract REAL company information from search results. ONLY extract companies that genuinely appear in the search results. DO NOT invent any company name, phone, email, or URL. If a field is not found, use empty string "". Return ONLY valid JSON array.`,
      messages: [{
        role:    "user",
        content: `Extract real ${industryKeywords} companies in ${location} from these search results. Only include companies that actually appear in the results.

Search results:
${snippetText.slice(0, 8000)}

Return JSON array (max ${count}):
[{
  "companyName": "real company name from results",
  "industry": "${industryKeywords}",
  "country": "${country}",
  "city": "${city || ""}",
  "phone": "phone if found in snippet else ''",
  "email": "email if found in snippet else ''",
  "website": "company website URL if found else ''",
  "linkedinUrl": "linkedin company URL if found else ''",
  "contactPerson": "contact name if found else ''",
  "contactDesignation": "job title if found else ''",
  "employeeCount": "employee count if mentioned else ''",
  "founded": "founding year if mentioned else ''",
  "annualRevenue": "revenue if mentioned else ''",
  "description": "1-2 line description of what they do from the snippet"
}]

Return ONLY the JSON array. If no real companies found in results, return [].`,
      }],
    });

    const raw = msg.content[0]?.text?.trim() || "[]";
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    let rawCompanies = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) rawCompanies = parsed.filter(c => c.companyName && c.companyName.trim());
    } catch {}

    if (rawCompanies.length === 0) {
      return NextResponse.json({ error: `Could not extract companies from results for ${location}. Try again.`, leads: [] });
    }

    /* ── Step 3: Enrich top companies with contact info ───────────────────── */
    const toEnrich = rawCompanies.filter(c => !c.email && !c.phone).slice(0, 8);
    const enriched = await Promise.allSettled(
      toEnrich.map(c => enrichWithContact(c.companyName, country, gl))
    );

    const leads = rawCompanies.map((c, i) => {
      const enrichIdx = toEnrich.indexOf(c);
      const contact = (enrichIdx >= 0 && enriched[enrichIdx]?.status === "fulfilled") ? enriched[enrichIdx].value : {};
      const loc = c.city ? `${c.city}, ${c.country || country}` : (c.country || country);
      const aiPitch = `${c.companyName} is a ${industryKeywords} company based in ${loc}. ${c.description ? c.description + " " : ""}${
        c.contactPerson ? `Connect with ${c.contactPerson}${c.contactDesignation ? ` (${c.contactDesignation})` : ""} via LinkedIn or email for a B2B partnership discussion.` :
        "Reach out via their website or LinkedIn to explore B2B collaboration opportunities."
      }`;
      return {
        id:                `intl-real-${Date.now()}-${i}`,
        source:            "intl_companies_real",
        type:              "international",
        dataSource:        "real",
        businessName:      c.companyName,
        industry:          c.industry || industryKeywords,
        country:           c.country || country,
        city:              c.city || city || "",
        phone:             c.phone  || contact.phone   || "",
        email:             c.email  || contact.email   || "",
        website:           c.website || contact.website || "",
        linkedinUrl:       c.linkedinUrl || "",
        contactPerson:     c.contactPerson || "",
        contactDesignation:c.contactDesignation || "",
        employeeCount:     c.employeeCount || "",
        founded:           c.founded || "",
        annualRevenue:     c.annualRevenue || "",
        description:       c.description || "",
        needsServices:     [],
        urgency:           "medium",
        aiPitch,
      };
    });

    const { granted } = await incrementLeadQuota(userId, leads.length);
    const finalLeads  = leads.slice(0, granted);
    await saveLeadHistory(userId, { type: "intl-companies", niche: industry, location: `${city || ""} ${country || ""}`.trim(), leadCount: finalLeads.length, leads: finalLeads.slice(0, 50) });
    return NextResponse.json({ success: true, leads: finalLeads, total: finalLeads.length });

  } catch (err) {
    console.error("[intl-companies]", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
