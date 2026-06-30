import { NextResponse }  from "next/server";
import { getAIClient }   from "@/lib/aiClient";
import { extractEmails, extractPhones, serperSearch } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";
const SCRAPER_KEY = null;
const FIRECRAWL = null;

export const maxDuration = 90;

const client      = getAIClient();

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const BUSINESS_TYPE_MAP = {
  "any":               "company",
  "it-software":       "IT software technology",
  "digital-marketing": "digital marketing advertising",
  "ecommerce":         "ecommerce online retail",
  "manufacturing":     "manufacturing production",
  "trading":           "trading import export",
  "consulting":        "consulting management advisory",
  "healthcare":        "healthcare medical pharma",
  "real-estate":       "real estate construction builders",
  "education":         "education edtech training",
  "finance":           "finance NBFC accounting",
  "logistics":         "logistics transport courier",
  "retail":            "retail distribution",
  "food-beverage":     "food beverage FMCG",
  "media-entertainment":"media entertainment",
};

const STATE_CODE_MAP = {
  "Delhi":"DL","Maharashtra":"MH","Karnataka":"KA","Gujarat":"GJ","Tamil Nadu":"TN",
  "Uttar Pradesh":"UP","Rajasthan":"RJ","West Bengal":"WB","Telangana":"TS",
  "Andhra Pradesh":"AP","Madhya Pradesh":"MP","Punjab":"PB","Haryana":"HR",
  "Kerala":"KL","Bihar":"BR","Jharkhand":"JH","Odisha":"OD","Assam":"AS",
  "Chhattisgarh":"CG","Goa":"GA","Himachal Pradesh":"HP","Uttarakhand":"UK",
};


async function jinaFetch(url) {
  try {
    const headers = { Accept: "text/plain", "X-Return-Format": "markdown" };
    const key = process.env.JINA_API_KEY;
    if (key) headers["Authorization"] = `Bearer ${key}`;
    const res = await fetch(`https://r.jina.ai/${url}`, { headers, signal: AbortSignal.timeout(15000) });
    return res.ok ? (await res.text()).slice(0, 6000) : "";
  } catch { return ""; }
}

async function firecrawlScrape(url) {
  if (FIRECRAWL) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${FIRECRAWL}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
        signal: AbortSignal.timeout(15000),
      });
      const d = await res.json();
      if (d.success) return (d.data?.markdown || "").slice(0, 6000);
    } catch {}
  }
  return jinaFetch(url);
}

async function scraperFetch(url) {
  if (SCRAPER_KEY) {
    try {
      const apiUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(url)}&render=false`;
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(15000) });
      if (res.ok) return await res.text();
    } catch {}
  }
  return jinaFetch(url);
}

/* ── Extract companies from Zaubacorp page ────────────────────────────────── */
function parseZaubacorpPage(markdown, state, businessTypeLabel) {
  const companies = [];
  const lines = markdown.split('\n');
  let currentCompany = null;

  for (const line of lines) {
    // Company name patterns in Zaubacorp markdown
    const nameMatch = line.match(/\[([A-Z][A-Z0-9\s&.,'-]{4,80}(?:PRIVATE LIMITED|LIMITED|LLP|OPC))\]/i);
    if (nameMatch) {
      if (currentCompany?.name) companies.push(currentCompany);
      currentCompany = {
        name:       nameMatch[1].trim(),
        cin:        "",
        director:   "",
        city:       "",
        state,
        category:   businessTypeLabel,
        capital:    "",
        incDate:    "",
        status:     "Active",
      };
    }
    if (currentCompany) {
      const cinMatch = line.match(/\b([UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6})\b/);
      if (cinMatch) currentCompany.cin = cinMatch[1];
      const dateMatch = line.match(/\b(\d{2}[\/-]\d{2}[\/-]\d{4}|\d{4}-\d{2}-\d{2})\b/);
      if (dateMatch && !currentCompany.incDate) currentCompany.incDate = dateMatch[1];
      const capitalMatch = line.match(/₹?\s*([\d,]+(?:\s+Lakhs?|\s+Crores?|\s+Lakh)?)/i);
      if (capitalMatch && line.toLowerCase().includes("capital") && !currentCompany.capital) currentCompany.capital = capitalMatch[1].trim();
    }
  }
  if (currentCompany?.name) companies.push(currentCompany);
  return companies.slice(0, 20);
}

/* ── Enrich a company with contact info via Google ────────────────────────── */
async function enrichWithContact(companyName, city, state) {
  const results = await serperSearch(`"${companyName}" ${city || state} email phone contact`, "in", 5);
  let email = "", phone = "", website = "";

  for (const r of results) {
    const text = `${r.snippet} ${r.link}`;
    if (!email) { const e = extractEmails(text); if (e[0]) email = e[0]; }
    if (!phone) { const p = extractPhones(text); if (p[0]) phone = p[0]; }
    if (!website && r.link && !/zaubacorp|tofler|mca\.gov|google|linkedin|facebook|instagram/i.test(r.link)) {
      website = r.link;
    }
    if (email && phone && website) break;
  }

  // Try to scrape company website for contact
  if (website && (!email || !phone)) {
    try {
      const md = await firecrawlScrape(website);
      if (md) {
        if (!email) { const e = extractEmails(md); if (e[0]) email = e[0]; }
        if (!phone) { const p = extractPhones(md); if (p[0]) phone = p[0]; }
      }
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
    const { state, city, businessType = "any", registrationType = "new", daysRange = 30, yearRange, count = 15 } = body;

    if (!state) return NextResponse.json({ error: "State required" }, { status: 400 });

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return NextResponse.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    const businessKeywords = BUSINESS_TYPE_MAP[businessType] || "company";
    const businessLabel    = businessKeywords;
    const location         = city ? `${city}, ${state}` : state;
    const stateCode        = STATE_CODE_MAP[state] || state.substring(0, 2).toUpperCase();
    const today            = new Date();
    const year             = today.getFullYear();

    /* ── Step 1: Search Zaubacorp + Google for real MCA companies ─────────── */
    let yearFilter = year.toString();
    if (registrationType === "new") {
      yearFilter = year.toString();
    } else if (registrationType === "established" && yearRange) {
      yearFilter = yearRange.split("-")[0]; // start year
    }

    const searchQueries = [
      // Zaubacorp listings
      `site:zaubacorp.com "${businessKeywords}" "${state}" incorporated ${yearFilter}`,
      `site:zaubacorp.com "${state}" "${businessKeywords}" "Private Limited" ${year}`,
      // Tofler
      `site:tofler.in "${businessKeywords}" "${state}" "${yearFilter}"`,
      // Google for newly registered companies
      `"Private Limited" "${businessKeywords}" ${location} registered ${yearFilter} director email`,
      `"${businessKeywords}" company ${location} incorporated ${yearFilter} "contact us"`,
      // India-specific business directories
      `"${businessKeywords}" startup ${location} ${year} email phone website`,
    ];

    const searchResults = await Promise.allSettled(
      searchQueries.map(q => serperSearch(q, "in", 10))
    );

    const allItems = [];
    const seenLinks = new Set();
    for (const r of searchResults) {
      if (r.status !== "fulfilled") continue;
      for (const item of r.value) {
        if (!seenLinks.has(item.link)) {
          seenLinks.add(item.link);
          allItems.push(item);
        }
      }
    }

    /* ── Step 2: Scrape Zaubacorp pages for real company lists ───────────── */
    const zaubacorpUrls = allItems
      .filter(i => i.link.includes("zaubacorp.com") || i.link.includes("tofler.in"))
      .slice(0, 5)
      .map(i => i.link);

    let rawCompanies = [];

    if (zaubacorpUrls.length > 0) {
      const scraped = await Promise.allSettled(
        zaubacorpUrls.map(u => firecrawlScrape(u))
      );
      for (const s of scraped) {
        if (s.status !== "fulfilled" || !s.value) continue;
        const parsed = parseZaubacorpPage(s.value, state, businessLabel);
        rawCompanies.push(...parsed);
      }
    }

    /* ── Step 3: Also try direct Zaubacorp state listing ──────────────────── */
    if (rawCompanies.length < 5) {
      const zaubaDirect = `https://www.zaubacorp.com/company-list/p-1/state:${stateCode}/incorporation_date_after:${year}-01-01.html`;
      const html = await scraperFetch(zaubaDirect);
      if (html && html.length > 500) {
        // Extract company names and CINs from HTML
        const cinMatches = [...html.matchAll(/([UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6})/g)];
        const nameMatches = [...html.matchAll(/class="company-name"[^>]*>([^<]+)</gi)];
        for (let i = 0; i < Math.min(cinMatches.length, nameMatches.length, 20); i++) {
          rawCompanies.push({
            name:     nameMatches[i]?.[1]?.trim() || `Company ${i+1}`,
            cin:      cinMatches[i]?.[1] || "",
            director: "",
            city:     city || "",
            state,
            category: businessLabel,
            capital:  "",
            incDate:  "",
            status:   "Active",
          });
        }
      }
    }

    /* ── Step 4: AI extraction from search snippets if Zaubacorp empty ────── */
    if (rawCompanies.length < 3) {
      const snippetText = allItems.map(i => `${i.title}\n${i.snippet}\n${i.link}`).join("\n---\n");

      const msg = await client.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        system:     `You extract real company registrations from search results. ONLY extract companies that appear to be real companies from actual search results - do NOT invent any data. If a company name, CIN, or director is not found in the text, leave it as empty string. Return ONLY valid JSON array.`,
        messages: [{
          role:    "user",
          content: `Extract real ${businessLabel} companies in ${location} from these search results. Only include companies that actually appear in the text.

Search results:
${snippetText.slice(0, 8000)}

Return JSON array (max ${count}):
[{"name":"company name from text","cin":"CIN if found else ''","director":"director name if found else ''","city":"${city || ''}","state":"${state}","category":"${businessLabel}","incDate":"date if found else ''","capital":"capital if found else ''"}]

Return ONLY the JSON array. If no real companies found, return [].`,
        }],
      });

      const raw = msg.content[0]?.text?.trim() || "[]";
      const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) rawCompanies.push(...parsed);
      } catch {}
    }

    // Deduplicate by name
    const seen = new Set();
    rawCompanies = rawCompanies.filter(c => {
      if (!c.name || seen.has(c.name.toLowerCase())) return false;
      seen.add(c.name.toLowerCase());
      return true;
    }).slice(0, count);

    if (rawCompanies.length === 0) {
      return NextResponse.json({
        error: `No MCA companies found for "${businessLabel}" in ${location}. Try a broader category or different state.`,
        leads: [],
      });
    }

    /* ── Step 5: Enrich top companies with contact info ──────────────────── */
    const toEnrich = rawCompanies.slice(0, 8);
    const enriched = await Promise.allSettled(
      toEnrich.map(c => enrichWithContact(c.name, c.city || city, state))
    );

    const leads = rawCompanies.map((c, i) => {
      const contact = (i < 8 && enriched[i]?.status === "fulfilled") ? enriched[i].value : {};
      const loc = c.city || city ? `${c.city || city}, ${state}` : state;
      const aiPitch = `${c.name} is a newly registered ${businessLabel} company in ${loc}. As a fresh business, they likely need ${
        businessType === "it-software" ? "website development, cloud hosting, and digital marketing" :
        businessType === "digital-marketing" ? "SEO, paid ads, and social media management" :
        businessType === "ecommerce" ? "an e-commerce platform, logistics, and digital marketing" :
        businessType === "healthcare" ? "medical billing software, digital presence, and CRM" :
        businessType === "real-estate" ? "lead generation, CRM software, and digital ads" :
        "accounting software, digital marketing, and IT support"
      } to get started. Contact their director with a tailored onboarding proposal.`;
      return {
        id:               `mca-real-${Date.now()}-${i}`,
        source:           "mca_real",
        businessName:     c.name,
        cin:              c.cin || "",
        incorporationDate:c.incDate || "",
        daysAgo:          0,
        state:            c.state || state,
        city:             c.city  || city || "",
        businessActivity: c.category || businessLabel,
        authorizedCapital:c.capital || "",
        companyType:      "Private Limited",
        directorName:     c.director || "",
        phone:            contact.phone   || "",
        email:            contact.email   || "",
        website:          contact.website || "",
        address:          "",
        needsServices:    [],
        industryTag:      businessLabel,
        registrationType,
        urgency:          registrationType === "new" ? "high" : "medium",
        dataSource:       "real",
        aiPitch,
      };
    });

    const { granted } = await incrementLeadQuota(userId, leads.length);
    const finalLeads  = leads.slice(0, granted);
    await saveLeadHistory(userId, { type: "mca-companies", niche: businessType, location: `${city || ""} ${state || ""}`.trim(), leadCount: finalLeads.length, leads: finalLeads.slice(0, 50) });
    return NextResponse.json({ success: true, leads: finalLeads, total: finalLeads.length });

  } catch (err) {
    console.error("[mca-companies]", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
