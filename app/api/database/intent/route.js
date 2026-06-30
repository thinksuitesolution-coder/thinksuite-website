/**
 * Intent Signals API — Apollo B2B Intent equivalent for India
 *
 * Detects companies that are actively looking to buy something:
 *   hiring_marketing  → need marketing services / agency
 *   hiring_tech       → need IT services / SaaS tools
 *   hiring_sales      → scaling sales team, need CRM/tools
 *   funded            → just raised money, buying everything
 *   expanding         → new office/city, need local vendors
 *   ecommerce_launch  → going online, need web/digital
 *   new_incorporation → brand new company, need everything
 *   tenders           → govt procurement intent
 *
 * POST /api/database/intent
 * Body: { industry?, location?, signal_type, limit? }
 */

import { NextResponse }  from "next/server";
import { verifyUser }    from "@/lib/authUtils";
import { serperSearch }  from "@/lib/scraperUtils";
import { extractEmails, extractPhonesIndian } from "@/lib/scraperUtils";

export const maxDuration = 45;

// ── Signal definitions ────────────────────────────────────────────────────────
const SIGNALS = {
  hiring_marketing: {
    label:   "Hiring: Marketing",
    why:     "Companies hiring marketing roles need agencies, tools, and ad spend support",
    queries: [
      'site:naukri.com "digital marketing manager" OR "SEO manager" OR "content marketing" 2026',
      'site:linkedin.com/jobs "digital marketing" OR "growth marketing" india hiring 2026',
      '"looking for" "digital marketing" agency vendor india site:indiamart.com OR site:justdial.com',
    ],
  },
  hiring_tech: {
    label:   "Hiring: Tech",
    why:     "Companies building tech teams need SaaS tools, cloud, development vendors",
    queries: [
      'site:naukri.com "software engineer" OR "full stack developer" OR "cloud architect" bangalore OR mumbai OR delhi 2026',
      '"hiring" "CTO" OR "VP Engineering" OR "engineering manager" India startup 2026',
    ],
  },
  hiring_sales: {
    label:   "Hiring: Sales",
    why:     "Companies scaling sales teams need CRM, calling tools, lead gen",
    queries: [
      'site:naukri.com "sales manager" OR "business development manager" OR "BDM" india 2026',
      '"hiring" "VP Sales" OR "sales director" OR "sales head" india startup 2026',
    ],
  },
  funded: {
    label:   "Recently Funded",
    why:     "Funded companies aggressively buy tools and services",
    queries: [
      '"raised" "funding" OR "seed round" OR "Series A" OR "Series B" india startup 2026',
      'site:entrackr.com OR site:inc42.com OR site:yourstory.com "funding" "crore" OR "million" 2026',
    ],
  },
  expanding: {
    label:   "Expanding / New Office",
    why:     "Expanding companies need local vendors, logistics, real estate, staffing",
    queries: [
      '"expanding to" OR "new office" OR "new branch" OR "opening in" india 2026 business',
      '"hiring in" OR "now hiring" multiple cities india company 2026',
    ],
  },
  ecommerce_launch: {
    label:   "Going Online / E-commerce Launch",
    why:     "Businesses launching online need web dev, digital marketing, payment gateway",
    queries: [
      '"launching" OR "launched" "online store" OR "e-commerce" OR "website" india business 2026',
      '"looking for" web developer OR website designer india site:indiamart.com',
      '"looking for" "digital marketing" OR "SEO" OR "social media" site:indiamart.com india',
    ],
  },
  new_incorporation: {
    label:   "Freshly Incorporated",
    why:     "Brand new companies need literally everything — accounting, website, insurance, cloud",
    queries: [
      'site:zaubacorp.com "Private Limited" incorporated 2026 india',
      'site:tofler.in "incorporated" OR "registered" 2026 "Private Limited" india',
    ],
  },
  tenders: {
    label:   "Government Tender Intent",
    why:     "Companies actively quoting tenders need compliance, logistics, manufacturing support",
    queries: [
      'site:gem.gov.in OR site:eprocure.gov.in bid 2026 "last date"',
      '"request for proposal" OR "RFP" OR "tender" india government 2026',
    ],
  },
};

// ── Parse company leads from search results ───────────────────────────────────
function parseIntentLeads(results, signal) {
  return results
    .map(r => {
      const text = `${r.title} ${r.snippet || ""}`;

      // Company name: take text before dash, pipe, colon, or "Naukri"
      const nameRaw = r.title.replace(/\s*[-|–]\s*(Naukri|LinkedIn|IndiaMART|JustDial|Entrackr|Inc42|YourStory).*/i, "").trim();
      const businessName = nameRaw.split(/[|\-–:]/)[0].trim();
      if (!businessName || businessName.length < 3) return null;

      // Location from snippet
      const locationM = text.match(/\b(Mumbai|Delhi|Bangalore|Bengaluru|Hyderabad|Chennai|Pune|Kolkata|Ahmedabad|Jaipur|Surat|Lucknow|Chandigarh|Noida|Gurgaon|Gurugram)\b/i);

      // Phone / email if visible in snippet
      const phoneM = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
      const emailM = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

      // Funding amount if present
      const fundingM = text.match(/(?:raised?|funding)\s+(?:Rs\.?\s*)?([₹$]?\d+[\d.,]*\s*(?:crore|lakh|million|billion|cr|L)?)/i);

      return {
        businessName,
        city:         locationM?.[0] || "",
        phone:        phoneM?.[0]?.replace(/[\s-]/g, "") || "",
        email:        emailM?.[0] || "",
        sourceUrl:    r.link || "",
        snippet:      (r.snippet || "").slice(0, 200),
        fundingAmount: fundingM?.[1] || "",
        signal:       signal.label,
        detectedAt:   Date.now(),
      };
    })
    .filter(Boolean)
    .filter((c, i, arr) => arr.findIndex(x => x.businessName === c.businessName) === i); // dedup by name
}

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { industry = "", location = "", signal_type = "hiring_marketing", limit = 20 } = await req.json();

    const signal = SIGNALS[signal_type];
    if (!signal) {
      return NextResponse.json({
        error: `Invalid signal_type. Available: ${Object.keys(SIGNALS).join(", ")}`,
        available: Object.entries(SIGNALS).map(([k, v]) => ({ key: k, label: v.label, why: v.why })),
      }, { status: 400 });
    }

    // Inject industry + location into first query
    const locationTag = location ? `"${location}"` : "";
    const industryTag = industry ? `"${industry}"` : "";
    const queries = signal.queries.map((q, i) =>
      i === 0 ? `${industryTag} ${locationTag} ${q}`.trim() : q
    );

    // Run all queries in parallel, deduplicate results
    const allResults = await Promise.all(queries.map(q => serperSearch(q, "in", 10)));
    const flat       = allResults.flat();
    const seen       = new Set();
    const unique     = flat.filter(r => {
      const key = r.link || r.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const companies = parseIntentLeads(unique, signal).slice(0, Math.min(limit, 50));

    return NextResponse.json({
      success:      true,
      signal_type,
      signal:       signal.label,
      why:          signal.why,
      companies,
      total:        companies.length,
      filters:      { industry, location },
    });
  } catch (err) {
    console.error("[database/intent]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: list all available signal types
export async function GET(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({
      success:  true,
      signals:  Object.entries(SIGNALS).map(([key, s]) => ({ key, label: s.label, why: s.why })),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
