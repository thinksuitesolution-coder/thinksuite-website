import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";
import { firecrawlScrape, scraperFetch, extractEmails, extractPhones, extractWebsites } from "@/lib/scraperUtils";

export const maxDuration = 90;

const client = getAIClient();

/* ─── Helpers ────────────────────────────────────────────────────────────────*/
function normalizeInputUrl(raw = "") {
  raw = raw.trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try { return new URL(raw).href; } catch { return null; }
}

function extractSocialLinks(text = "") {
  const social = { instagram: "", linkedin: "", facebook: "", twitter: "", youtube: "" };
  const patterns = {
    instagram: /(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9._]{2,30})/i,
    linkedin:  /linkedin\.com\/(?:in|company)\/([a-zA-Z0-9._-]{2,60})/i,
    facebook:  /facebook\.com\/([a-zA-Z0-9._-]{3,60})/i,
    twitter:   /(?:twitter|x)\.com\/([a-zA-Z0-9_]{1,50})/i,
    youtube:   /youtube\.com\/(?:channel\/|c\/|@)([a-zA-Z0-9._-]{2,60})/i,
  };
  for (const [platform, re] of Object.entries(patterns)) {
    const m = text.match(re);
    if (m) social[platform] = `https://www.${platform === "twitter" ? "x" : platform}.com/${platform === "linkedin" ? (m[0].includes("/company/") ? "company/" : "in/") : ""}${m[1]}`;
  }
  return social;
}

/* ─── Core scrape + analyze for one URL ────────────────────────────────────*/
async function analyzeWebsite(siteUrl) {
  // Parallel: Firecrawl (clean markdown) + ScraperAPI (raw HTML for contacts)
  const [fcResult, scraperHtml] = await Promise.allSettled([
    firecrawlScrape(siteUrl, 20000),
    scraperFetch(siteUrl, false, 15000),
  ]);

  const markdown  = fcResult.status   === "fulfilled" ? fcResult.value   : "";
  const rawHtml   = scraperHtml.status === "fulfilled" ? scraperHtml.value : "";

  // Direct extraction from raw HTML (most reliable for contacts)
  const allHtmlText = rawHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const emails   = extractEmails(allHtmlText + " " + markdown);
  const phones   = extractPhones(allHtmlText + " " + markdown);
  const websites = extractWebsites(allHtmlText);
  const socials  = extractSocialLinks(allHtmlText + " " + markdown);

  // Use the best content for AI analysis
  const content = (markdown || allHtmlText).slice(0, 7000);

  if (!content || content.length < 100) {
    return {
      url: siteUrl,
      error: "Could not load website content",
      emails, phones,
    };
  }

  // Thinksuite Sonnet for deep business intelligence extraction
  const msg = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 1800,
    system:     "You are a senior business intelligence analyst. Extract structured lead data from website content. Return ONLY valid JSON no markdown, no explanation.",
    messages: [{
      role:    "user",
      content: `Analyze this website and extract complete business lead intelligence:

URL: ${siteUrl}
Content:
${content}

Return JSON with this exact structure:
{
  "business_name": "exact company/brand name",
  "tagline": "their main tagline or value proposition (1 line)",
  "industry": "primary industry (e.g. EdTech, SaaS, Real Estate, Healthcare)",
  "business_type": "B2B|B2C|B2B2C|D2C|Unknown",
  "company_size": "1-10|11-50|51-200|201-500|500+|Unknown",
  "founded_year": "year or empty string",
  "description": "2-3 sentence business summary",
  "services": ["list", "of", "main", "services/products"],
  "target_audience": "who they serve",
  "email": "${emails[0] || ""}",
  "phone": "${phones[0] || ""}",
  "whatsapp": "",
  "address": "",
  "city": "",
  "state": "",
  "country": "",
  "pincode": "",
  "social_links": {
    "instagram": "${socials.instagram || ""}",
    "linkedin":  "${socials.linkedin  || ""}",
    "facebook":  "${socials.facebook  || ""}",
    "twitter":   "${socials.twitter   || ""}",
    "youtube":   "${socials.youtube   || ""}"
  },
  "decision_makers": [
    {"name": "", "title": "", "email": "", "linkedin": ""}
  ],
  "tech_stack": ["list detected technologies, CMS, frameworks"],
  "certifications": ["ISO, NASSCOM, etc."],
  "lead_quality": "hot|warm|cold",
  "lead_score": 0,
  "lead_score_reason": "explain the score in 1 sentence",
  "outreach_angle": "best angle to approach this business (1 sentence)"
}

Scoring guide:
- hot (70-100): has email + phone, clear B2B/B2C, active business, decision makers visible
- warm (40-69): partial contact info, clear business, reachable
- cold (0-39):  no contact info, unclear business, or purely informational site

Only include data actually present. Use "" for missing fields.`,
    }],
  });

  const rawText = msg.content[0]?.text || "{}";
  const start   = rawText.indexOf("{");
  const end     = rawText.lastIndexOf("}");
  let parsed    = {};
  try {
    parsed = start !== -1 && end !== -1 ? JSON.parse(rawText.slice(start, end + 1)) : {};
  } catch {
    parsed = {};
  }

  // Merge AI extraction with direct regex extraction (regex wins for emails/phones)
  return {
    url: siteUrl,
    ...parsed,
    email:      parsed.email      || emails[0]   || "",
    phone:      parsed.phone      || phones[0]   || "",
    all_emails: [...new Set(emails)],
    all_phones: [...new Set(phones)],
    social_links: {
      instagram: parsed.social_links?.instagram || socials.instagram || "",
      linkedin:  parsed.social_links?.linkedin  || socials.linkedin  || "",
      facebook:  parsed.social_links?.facebook  || socials.facebook  || "",
      twitter:   parsed.social_links?.twitter   || socials.twitter   || "",
      youtube:   parsed.social_links?.youtube   || socials.youtube   || "",
    },
    scraped_at: new Date().toISOString(),
  };
}

/* ─── Main handler ───────────────────────────────────────────────────────────*/
export async function POST(request) {
  try {
    const body = await request.json();
    const rawUrls = body.urls || (body.url ? [body.url] : []);

    if (!rawUrls.length) {
      return NextResponse.json({ error: "Provide url or urls array" }, { status: 400 });
    }

    const urlList = rawUrls
      .map(normalizeInputUrl)
      .filter(Boolean)
      .slice(0, 5); // max 5 at once

    if (!urlList.length) {
      return NextResponse.json({ error: "No valid URLs" }, { status: 400 });
    }

    // Analyze all websites in parallel
    const settled = await Promise.allSettled(urlList.map(analyzeWebsite));

    const results = [];
    const errors  = [];

    for (const r of settled) {
      if (r.status === "fulfilled") {
        if (r.value.error) errors.push({ url: r.value.url, error: r.value.error });
        else results.push(r.value);
      } else {
        errors.push({ error: r.reason?.message || "Unknown error" });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      total: results.length,
    });

  } catch (err) {
    console.error("[website-analyzer]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
