import { getAIClient } from "@/lib/aiClient";
import { firecrawlScrape, scraperFetch, extractEmails, extractPhones, applyQualityGate, getGl, serperSearch } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";

export const maxDuration = 90;

const anthropic = getAIClient();

// Fetch full Reddit post gets the complete selftext with contact info
async function fetchRedditPost(permalink) {
  try {
    const url = `https://www.reddit.com${permalink}.json?limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadGen/1.0)" },
      signal:  AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data?.[0]?.data?.children?.[0]?.data?.selftext || "";
  } catch { return ""; }
}

// Reddit search returns posts with FULL selftext (emails/phones often inside)
// t: "day" | "week" | "month" | "year"
async function fetchRedditPosts(subreddit, query, limit = 30, t = "week") {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&sort=new&limit=${limit}&restrict_sr=1&t=${t}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadGen/1.0)" },
      signal:  AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data?.children || [])
      .filter(p => p.data.is_self !== false) // skip image/link posts only text posts have contact info
      .map(p => ({
        title:     p.data.title,
        selftext:  (p.data.selftext || "").slice(0, 2000),
        author:    p.data.author,
        url:       `https://www.reddit.com${p.data.permalink}`,
        subreddit: p.data.subreddit,
        permalink: p.data.permalink,
        created:   p.data.created_utc,
      }));
  } catch { return []; }
}

const PLATFORM_PATTERNS = {
  upwork:       /upwork\.com/i,
  fiverr:       /fiverr\.com/i,
  freelancer:   /freelancer\.com/i,
  reddit:       /reddit\.com/i,
  indiehackers: /indiehackers\.com/i,
  guru:         /guru\.com/i,
  peopleperhour:/peopleperhour\.com/i,
  wellfound:    /wellfound\.com|angel\.co/i,
  producthunt:  /producthunt\.com/i,
  github:       /github\.com/i,
};
function detectPlatform(url = "") {
  for (const [name, re] of Object.entries(PLATFORM_PATTERNS)) {
    if (re.test(url)) return name;
  }
  return "other";
}

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { service, country = "global", count = 15, previousUrls = [], recency = "day" } = body;

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return Response.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }
    if (!service?.trim()) return Response.json({ error: "Service required" }, { status: 400 });

    const gl         = getGl(country, "us");
    const countryTag = country && country !== "global" ? ` ${country}` : "";
    const seenLinks  = new Set(previousUrls);

    // Normalize service for queries: "SEO / Digital Marketing" → "SEO Digital Marketing"
    const serviceQ   = service.replace(/[\/&+|]/g, " ").replace(/\s+/g, " ").trim();
    // Primary keyword (first word) for broader fallback queries
    const primaryKw  = serviceQ.split(/\s+/)[0];

    // recency → Serper tbs + Reddit t param
    // "day" = last 24h, "week" = last 7 days, "any" = no filter
    // Default to "week" - "day" returns near-zero results for most niches
    const effectiveRecency = recency === "day" ? "day" : recency === "week" ? "week" : "week";
    const tbs      = effectiveRecency === "day" ? "qdr:d" : effectiveRecency === "week" ? "qdr:w" : null;
    const redditT  = effectiveRecency === "day" ? "day"  : "week";

    const isIndia = gl === "in";

    // ── Service-aware extra subreddits ────────────────────────────────────────
    const svcLower = serviceQ.toLowerCase();
    const extraSubs = [];
    if (/seo|search engine|keyword|backlink|rank/.test(svcLower))
      extraSubs.push("SEO", "bigseo", "juststart");
    if (/digital market|social media|content market|smm|ppc|ads|facebook ads|google ads/.test(svcLower))
      extraSubs.push("digital_marketing", "socialmedia", "PPC", "content_marketing");
    if (/web dev|website|app dev|react|node|flutter|mobile app/.test(svcLower))
      extraSubs.push("webdev", "reactjs", "learnprogramming");
    if (/design|logo|brand|ui|ux|graphic/.test(svcLower))
      extraSubs.push("graphic_design", "logodesign", "web_design");
    if (/video|youtube|reel|edit/.test(svcLower))
      extraSubs.push("videography", "editors", "NewTubers");
    if (/copywr|content writ|blog/.test(svcLower))
      extraSubs.push("copywriting", "blogging");

    // ── Strategy: find anyone who wants work done - startups, SMBs, individuals ──
    const queries = [
      // Reddit - posts from people who need work done
      `site:reddit.com/r/forhire "[HIRING]" "${serviceQ}"`,
      `site:reddit.com/r/forhire "${serviceQ}" email OR contact`,
      // Broad - anyone saying they need this service done (use normalized term)
      `"I need" "${serviceQ}" "looking for" budget OR price OR cost${countryTag}`,
      `"need someone" "${serviceQ}" project budget OR contact${countryTag}`,
      `"looking for" "${serviceQ}" "project" email OR WhatsApp${countryTag}`,
      // Posts with visible contact info in snippet
      `"${serviceQ}" "email me" OR "email:" OR "contact me" project${countryTag}`,
      `"${serviceQ}" "@gmail.com" OR "@yahoo.com" project OR hire${countryTag}`,
      `"${serviceQ}" "WhatsApp" OR "DM me" project OR need${countryTag}`,
      // Startup / founder posts
      `site:indiehackers.com "${primaryKw}" "looking for" OR "need" OR "hire"`,
      `site:news.ycombinator.com "Ask HN" "${primaryKw}" "looking for" OR "recommend" OR "need"`,
      `site:wellfound.com "${serviceQ}" freelance OR contract OR project`,
      `site:producthunt.com "${serviceQ}" "looking for" OR "need" OR hire`,
      // GitHub
      `site:github.com "${primaryKw}" "looking for" OR "help wanted" OR "need developer"`,
      // India-specific
      ...(isIndia ? [
        `"${serviceQ}" project India "contact" OR "WhatsApp" OR "call" 2024 2025`,
        `"${serviceQ}" "need" project India email OR phone 2025`,
        `site:internshala.com "${serviceQ}" project`,
        `"${serviceQ}" startup India "looking for" freelancer OR agency OR developer`,
        `"${serviceQ}" India budget "contact us" OR "reach out" project 2025`,
      ] : [
        // International
        `"${serviceQ}" startup "looking for" freelancer OR agency budget${countryTag}`,
        `"${serviceQ}" project "need someone" budget OR price${countryTag}`,
      ]),
    ];

    // ── Parallel fetch: Reddit subreddits + Serper (with time filter) ──
    const extraRedditJobs = extraSubs.slice(0, 4).map(sub =>
      fetchRedditPosts(sub, `${serviceQ} need OR hire OR looking`, 15, redditT)
    );

    const [redditForHire, redditStartups, redditEntrepreneur, redditSmallBiz, redditFreelance, ...rest] = await Promise.allSettled([
      fetchRedditPosts("forhire",          serviceQ, 50, redditT),
      fetchRedditPosts("startups",         `${serviceQ} need OR looking for OR hire`, 25, redditT),
      fetchRedditPosts("entrepreneur",     `${serviceQ} looking for OR need OR outsource`, 25, redditT),
      fetchRedditPosts("smallbusiness",    `${serviceQ} hire OR need OR project`, 20, redditT),
      fetchRedditPosts("freelance",        `${serviceQ} client looking project`, 20, redditT),
      ...extraRedditJobs,
      ...queries.map(q => serperSearch(q, gl, 10, tbs)),
    ]);

    const extraRedditResults = rest.slice(0, extraRedditJobs.length);
    const serperResults      = rest.slice(extraRedditJobs.length);

    const redditPosts = [
      ...(redditForHire.status      === "fulfilled" ? redditForHire.value      : []),
      ...(redditStartups.status     === "fulfilled" ? redditStartups.value     : []),
      ...(redditEntrepreneur.status === "fulfilled" ? redditEntrepreneur.value : []),
      ...(redditSmallBiz.status     === "fulfilled" ? redditSmallBiz.value     : []),
      ...(redditFreelance.status    === "fulfilled" ? redditFreelance.value    : []),
      ...extraRedditResults.flatMap(r => r.status === "fulfilled" ? r.value : []),
    ].filter(p => !seenLinks.has(p.url));

    // ── Step 1: Immediately extract emails/phones from Reddit selftext ──
    const redditLeads = redditPosts.map(p => {
      const allText  = `${p.title} ${p.selftext}`;
      const emails   = extractEmails(allText);
      const phones   = extractPhones(allText);
      return {
        name:         p.author,
        platform:     "reddit",
        profileUrl:   p.url,
        requirement:  p.title,
        budget:       "",
        email:        emails[0] || "",
        phone:        phones[0] || "",
        website:      "",
        location:     "",
        service_needed: service,
        _rawText:     p.selftext, // for Thinksuite to read
      };
    });

    // Social media URLs are not client job postings skip them
    const SKIP_DOMAINS = /instagram\.com|facebook\.com|twitter\.com|x\.com|youtube\.com|tiktok\.com|pinterest\.com|snapchat\.com/i;

    // ── Step 2: Serper results extract contacts from snippets immediately ──
    const serperItems = [];
    for (const r of serperResults) {
      if (r.status !== "fulfilled") continue;
      for (const item of r.value) {
        if (seenLinks.has(item.link)) continue;
        if (SKIP_DOMAINS.test(item.link)) continue; // not a job posting
        seenLinks.add(item.link);
        const emails = extractEmails(item.snippet);
        const phones = extractPhones(item.snippet);
        serperItems.push({
          ...item,
          platform: detectPlatform(item.link),
          email:    emails[0] || "",
          phone:    phones[0] || "",
        });
      }
    }

    if (redditLeads.length === 0 && serperItems.length === 0) {
      return Response.json({
        success: false, leads: [],
        error: `No job postings found for "${service}". Try a different keyword.`,
      });
    }

    // ── Step 3: Firecrawl scrape full pages of promising Serper results ──
    // Priority: results that LOOK like they have contact info, or IndieHackers pages
    const scrapeTargets = serperItems
      .filter(i => i.link?.startsWith("http") && !i.email && !i.phone)
      .slice(0, 8);

    if (scrapeTargets.length > 0) {
      const scraped = await Promise.allSettled(
        scrapeTargets.map(i => firecrawlScrape(i.link, 8000))
      );
      for (let k = 0; k < scrapeTargets.length; k++) {
        if (scraped[k].status !== "fulfilled" || !scraped[k].value) continue;
        const md  = scraped[k].value;
        const we  = extractEmails(md)[0] || "";
        const wp  = extractPhones(md)[0] || "";
        const idx = serperItems.indexOf(scrapeTargets[k]);
        if (we) serperItems[idx] = { ...serperItems[idx], email: we };
        if (wp) serperItems[idx] = { ...serperItems[idx], phone: wp };
      }
    }

    // ── Step 4: Build verified contact map (regex-only, never Thinksuite) ──
    // This is the source of truth for email/phone Thinksuite cannot modify these.
    const contactMap = new Map();
    redditLeads.forEach(l => {
      if (l.profileUrl) contactMap.set(l.profileUrl, { email: l.email, phone: l.phone });
    });
    serperItems.forEach(i => {
      if (i.link) contactMap.set(i.link, { email: i.email, phone: i.phone });
    });

    // ── Step 5: Thinksuite cleans + classifies contact fields are READ-ONLY ──
    const allRaw = [
      ...redditLeads.slice(0, 25).map(l => ({
        source: "reddit", name: l.name, url: l.url || l.profileUrl,
        text: l._rawText, email_found: l.email, phone_found: l.phone, title: l.requirement,
      })),
      ...serperItems.slice(0, 20).map(i => ({
        source: i.platform, name: "", url: i.link,
        text: i.snippet, email_found: i.email, phone_found: i.phone, title: i.title,
      })),
    ];

    const msg = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system:     `You are a project lead extractor. Find anyone who wants "${service}" work done - startups, individuals, SMBs, companies. INCLUDE posts from Reddit, IndieHackers, HN, ProductHunt. SKIP posts by service PROVIDERS. Return ONLY valid JSON.`,
      messages: [{
        role:    "user",
        content: `Extract PROJECT leads - people/companies who want "${service}" work done. Country: ${country}.

CRITICAL: email_found and phone_found are pre-verified by regex. Copy them EXACTLY as-is. NEVER invent or modify.
Your ONLY job for contacts: copy email_found → email, phone_found → phone.
Extract from text: project_name, requirement, budget, location, website.
INCLUDE: startups, individuals, SMBs, anyone needing this service.
SKIP: service providers, agencies offering services, job listings from staffing firms.

DATA:
${JSON.stringify(allRaw, null, 2)}

Return ONLY:
{
  "leads": [
    {
      "name": "poster name or company name",
      "platform": "reddit/indiehackers/hackernews/producthunt/wellfound/other",
      "profileUrl": "url (must match the url field above exactly)",
      "project_name": "short project title if mentioned else empty string",
      "requirement": "what they need done (1-2 specific sentences)",
      "budget": "exact budget if mentioned else ''",
      "email": "copy from email_found exactly, never invent",
      "phone": "copy from phone_found exactly, never invent",
      "website": "their website/startup URL if mentioned",
      "location": "city/country if mentioned",
      "service_needed": "2-4 words describing the service"
    }
  ],
  "queryLabel": "3-4 word label"
}

Max ${count} leads. PRIORITIZE leads where email_found or phone_found is non-empty.`,
      }],
    });

    const raw    = msg.content[0]?.text || "";
    const js     = raw.indexOf("{");
    const je     = raw.lastIndexOf("}");
    let   parsed = {};
    try { parsed = JSON.parse(js !== -1 && je !== -1 ? raw.slice(js, je + 1) : raw); } catch (e) { console.log(`[freelancer] JSON parse failed: ${e.message} | raw[:200]: ${raw.slice(0, 200)}`); }

    let leads = (parsed.leads || []).filter(l => l.profileUrl || l.name);

    // ── ANTI-HALLUCINATION: overwrite email/phone with regex-verified values only ──
    // Thinksuite's contact output is discarded; only what regex found in real source text counts.
    leads = leads.map(l => {
      const trusted = contactMap.get(l.profileUrl) || { email: "", phone: "" };
      return { ...l, email: trusted.email, phone: trusted.phone };
    });

    // ── Step 6: Firecrawl website enrichment for leads that have a website but no contact ──
    const websiteJobs = leads
      .slice(0, 5)
      .map((l, i) => ({ i, website: l.website }))
      .filter(j => j.website?.startsWith("http") && !leads[j.i].email && !leads[j.i].phone);

    if (websiteJobs.length > 0) {
      const enriched = await Promise.allSettled(
        websiteJobs.map(j => firecrawlScrape(j.website, 8000))
      );
      for (let k = 0; k < websiteJobs.length; k++) {
        if (enriched[k].status !== "fulfilled" || !enriched[k].value) continue;
        const md = enriched[k].value;
        const we = extractEmails(md)[0] || "";
        const wp = extractPhones(md)[0] || "";
        const { i } = websiteJobs[k];
        if (we) leads[i] = { ...leads[i], email: we };
        if (wp) leads[i] = { ...leads[i], phone: wp };
      }
    }

    // ── Step 7: Quality gate include all leads with at least a job post URL ──
    // Platforms like Upwork/PeoplePerHour/IndieHackers rarely expose email in snippets
    // but the post URL itself is valuable sorted best-first (verified > partial > limited)
    let finalLeads = applyQualityGate(leads, "limited");

    if (finalLeads.length === 0) {
      return Response.json({
        success: false, leads: [],
        error: `No project posts found for "${service}". Try keywords like "website design", "logo design", "app development", "SEO".`,
      });
    }

    const { granted: flGranted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, finalLeads.length);
    finalLeads = finalLeads.slice(0, flGranted);
    await saveLeadHistory(userId, { type: "freelancer", niche: service, location: country, leadCount: finalLeads.length, leads: finalLeads.slice(0, 50) });
    return Response.json({
      success:        true,
      leads:          finalLeads,
      queryLabel:     parsed.queryLabel || `${service} Clients`,
      recency,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
    });

  } catch (err) {
    console.error("[freelancer-leads]", err);
    return Response.json({ error: err.message || "Error finding freelancer clients" }, { status: 500 });
  }
}
