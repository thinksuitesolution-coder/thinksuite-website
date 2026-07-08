import { getAIClient } from "@/lib/aiClient";
import { firecrawlScrape, extractEmails, extractPhones, applyQualityGate, getGl, serperSearch } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";

export const maxDuration = 90;

const anthropic = getAIClient();

// Full selftext fetch gets complete post including contact info in body
async function fetchRedditPosts(subreddit, query, limit = 30) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&sort=new&limit=${limit}&restrict_sr=1&t=year`;
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
        selftext:  (p.data.selftext || "").slice(0, 2000), // full text contact info lives here
        author:    p.data.author,
        url:       `https://www.reddit.com${p.data.permalink}`,
        subreddit: p.data.subreddit,
      }));
  } catch { return []; }
}



export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { service, country = "global", count = 15, previousUrls = [] } = body;

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return Response.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }
    if (!service?.trim()) return Response.json({ error: "Service required" }, { status: 400 });

    const gl         = getGl(country, "us");
    const seenUrls   = new Set(previousUrls);
    const countryTag = country && country !== "global" ? ` ${country}` : "";

    // ── Parallel data fetch from all sources ──
    const [
      rForHire, rStartups, rEntrepreneur, rWebDev, rSmallBiz,
      sIndieHackers, sHNHiring, sEmailSearch,
      sProductHunt, sWellfound, sGitHub,
    ] = await Promise.allSettled([
      // Reddit people posting that they need services
      fetchRedditPosts("forhire",        `[HIRING] ${service}`, 30),
      fetchRedditPosts("startups",       `${service} looking for OR need OR outsource`, 20),
      fetchRedditPosts("entrepreneur",   `${service} looking for OR need`, 20),
      fetchRedditPosts("webdev",         `${service} client OR need freelancer`, 20),
      fetchRedditPosts("smallbusiness",  `${service} hire OR looking for OR need`, 15),
      // IndieHackers individual founder posts looking for a service (not "we're hiring" posts)
      serperSearch(`site:indiehackers.com/post "looking for" "${service}" OR "need" "${service}" OR "recommend" "${service}" -"I'm hiring" -"we're hiring"`, gl, 8),
      // HN "Ask HN" posts where founders ask for tool/service recommendations (not job boards)
      serperSearch(`site:news.ycombinator.com "Ask HN" "recommend" "${service}" OR "looking for" "${service}" OR "need" "${service}" -"who is hiring" -"who's hiring"`, gl, 8),
      // Broad search targeting posts where email is visible in Google snippet
      serperSearch(`"${service}" startup founder "@gmail.com" OR "@yahoo.com" OR "email:" hire${countryTag} 2025`, gl, 10),
      // ProductHunt makers often post what they need
      serperSearch(`site:producthunt.com "${service}" looking for OR need OR hire`, gl, 8),
      // Wellfound (AngelList) startup freelance/contract postings
      serperSearch(`site:wellfound.com "${service}" freelance OR contract remote`, gl, 8),
      // GitHub discussions / issues devs asking for help
      serperSearch(`site:github.com "${service}" "looking for" OR "help wanted" OR hiring`, gl, 8),
    ]);

    // ── Step 1: Extract emails/phones DIRECTLY from Reddit selftext ──
    const redditPosts = [
      ...(rForHire.status      === "fulfilled" ? rForHire.value      : []),
      ...(rStartups.status     === "fulfilled" ? rStartups.value     : []),
      ...(rEntrepreneur.status === "fulfilled" ? rEntrepreneur.value : []),
      ...(rWebDev.status       === "fulfilled" ? rWebDev.value       : []),
      ...(rSmallBiz.status     === "fulfilled" ? rSmallBiz.value     : []),
    ].filter(p => !seenUrls.has(p.url));

    // Extract contact from Reddit selftext immediately
    const redditLeads = redditPosts.map(p => {
      const allText = `${p.title} ${p.selftext}`;
      const emails  = extractEmails(allText);
      const phones  = extractPhones(allText);
      return {
        name:          p.author,
        platform:      "reddit",
        profileUrl:    p.url,
        project:       "",
        requirement:   p.title,
        email:         emails[0] || "",
        phone:         phones[0] || "",
        website:       "",
        location:      "",
        startup_stage: "mvp",
        _rawText:      p.selftext,
      };
    });

    // ── Step 2: Serper items extract from snippets immediately ──
    const SKIP_DOMAINS_SF = /instagram\.com|facebook\.com|twitter\.com|x\.com|youtube\.com|tiktok\.com|pinterest\.com/i;

    const serperItems = [
      ...(sIndieHackers.status === "fulfilled" ? sIndieHackers.value : []),
      ...(sHNHiring.status     === "fulfilled" ? sHNHiring.value     : []),
      ...(sEmailSearch.status  === "fulfilled" ? sEmailSearch.value  : []),
      ...(sProductHunt.status  === "fulfilled" ? sProductHunt.value  : []),
      ...(sWellfound.status    === "fulfilled" ? sWellfound.value    : []),
      ...(sGitHub.status       === "fulfilled" ? sGitHub.value       : []),
    ].filter(i => !seenUrls.has(i.link) && !SKIP_DOMAINS_SF.test(i.link));

    const serperLeads = serperItems.map(i => {
      const emails = extractEmails(i.snippet);
      const phones = extractPhones(i.snippet);
      return {
        name:          "",
        platform:      i.link?.includes("indiehackers")  ? "indiehackers"
                     : i.link?.includes("ycombinator")   ? "hackernews"
                     : i.link?.includes("producthunt")   ? "producthunt"
                     : i.link?.includes("wellfound")     ? "wellfound"
                     : i.link?.includes("angel.co")      ? "wellfound"
                     : i.link?.includes("github.com")    ? "github"
                     : "other",
        profileUrl:    i.link,
        project:       i.title,
        requirement:   i.snippet,
        email:         emails[0] || "",
        phone:         phones[0] || "",
        website:       "",
        location:      "",
        startup_stage: "mvp",
        _rawText:      i.snippet,
      };
    });

    const totalFound = redditLeads.length + serperLeads.length;
    if (totalFound === 0) {
      return Response.json({
        success: false, leads: [],
        error:  `No posts found for "${service}". Try keywords like "web development", "design", "SEO", or "marketing".`,
      });
    }

    // ── Step 4: Firecrawl IndieHackers + any lead with a website URL ──
    // IndieHackers pages often have full email/contact on the page
    const scrapeTargets = serperLeads
      .filter(l => l.profileUrl?.startsWith("http") && !l.email && !l.phone)
      .slice(0, 8);

    if (scrapeTargets.length > 0) {
      const scraped = await Promise.allSettled(
        scrapeTargets.map(l => firecrawlScrape(l.profileUrl, 8000))
      );
      for (let k = 0; k < scrapeTargets.length; k++) {
        if (scraped[k].status !== "fulfilled" || !scraped[k].value) continue;
        const md  = scraped[k].value;
        const we  = extractEmails(md)[0] || "";
        const wp  = extractPhones(md)[0] || "";
        const idx = serperLeads.indexOf(scrapeTargets[k]);
        if (we) serperLeads[idx] = { ...serperLeads[idx], email: we };
        if (wp) serperLeads[idx] = { ...serperLeads[idx], phone: wp };
      }
    }

    // ── Step 5: Build verified contact map (regex-only, never Thinksuite) ──
    // This is the source of truth for email/phone Thinksuite cannot modify these.
    const contactMap = new Map();
    redditLeads.forEach(l => {
      if (l.profileUrl) contactMap.set(l.profileUrl, { email: l.email, phone: l.phone });
    });
    serperLeads.forEach(l => {
      if (l.profileUrl) contactMap.set(l.profileUrl, { email: l.email, phone: l.phone });
    });

    // ── Step 6: Thinksuite classifies + labels contact fields are READ-ONLY ──
    const allData = [
      ...redditLeads.slice(0, 30).map(l => ({
        src: "reddit", author: l.name, url: l.profileUrl,
        title: l.requirement, text: l._rawText,
        email_found: l.email, phone_found: l.phone,
      })),
      ...serperLeads.slice(0, 20).map(l => ({
        src: l.platform, author: l.name, url: l.profileUrl,
        title: l.project, text: l._rawText,
        email_found: l.email, phone_found: l.phone,
      })),
    ];

    const msg = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system:     "Find startup founders/builders who are LOOKING FOR or NEED a specific service. Return ONLY valid JSON.",
      messages: [{
        role:    "user",
        content: `Find people who NEED "${service}" services (they posted asking for recommendations, looking to hire/outsource, or requesting help). Country: ${country}.

CRITICAL: email_found and phone_found are pre-verified by regex from actual source text. Copy them EXACTLY as-is into the output. Do NOT invent, guess, or modify any email or phone. If email_found is empty string, output "". If phone_found is empty string, output "".

Your ONLY job for contacts: copy email_found → email, phone_found → phone.
Your job for other fields: extract name, project, requirement, website, location, startup_stage.
SKIP posts where people are offering "${service}" - only include people who are SEEKING or BUYING "${service}".
SKIP generic "who is hiring" aggregator posts - only individual founders/companies actively seeking your service.

For "requirement" field: write a clear 1-sentence summary of WHAT they need, e.g. "Looking for a freelance web developer to build their SaaS dashboard" - make it obvious WHY this is a lead.

DATA:
${JSON.stringify(allData, null, 2)}

Return ONLY:
{
  "leads": [
    {
      "name": "founder/company name or Reddit username",
      "platform": "reddit|indiehackers|hackernews|producthunt|wellfound|github",
      "profileUrl": "url (must match the url field above exactly)",
      "project": "what they're building (their startup/product)",
      "requirement": "1 sentence: what they need and why they're a lead for ${service}",
      "email": "copy from email_found exactly, never invent",
      "phone": "copy from phone_found exactly, never invent",
      "website": "startup website if mentioned in text",
      "location": "string",
      "startup_stage": "idea|mvp|growth"
    }
  ],
  "queryLabel": "3-4 words"
}

Max ${count} leads. PRIORITIZE leads where email_found or phone_found is non-empty.`,
      }],
    });

    const raw    = msg.content[0]?.text || "";
    const js     = raw.indexOf("{");
    const je     = raw.lastIndexOf("}");
    let   parsed = {};
    try { parsed = JSON.parse(js !== -1 && je !== -1 ? raw.slice(js, je + 1) : raw); } catch (e) { console.log(`[startup-founders] JSON parse failed: ${e.message} | raw[:200]: ${raw.slice(0, 200)}`); }

    let leads = (parsed.leads || []).filter(l => l.profileUrl || l.name);

    // ── ANTI-HALLUCINATION: overwrite email/phone with regex-verified values only ──
    // Fuzzy URL match: Claude sometimes returns URLs with/without trailing slash or http vs https.
    const normUrl = u => (u || "").replace(/\/$/, "").replace(/^http:\/\//, "https://").toLowerCase();
    const contactMapNorm = new Map([...contactMap.entries()].map(([k, v]) => [normUrl(k), { key: k, ...v }]));

    leads = leads.map(l => {
      const hit     = contactMapNorm.get(normUrl(l.profileUrl));
      const trusted = hit ? { email: hit.email, phone: hit.phone } : { email: "", phone: "" };
      const validUrl = hit ? hit.key : (l.profileUrl?.startsWith("http") ? l.profileUrl : "");
      return { ...l, email: trusted.email, phone: trusted.phone, profileUrl: validUrl };
    }).filter(l => l.profileUrl || l.name);

    // Strip image/media URLs from website field (AI sometimes hallucinates these)
    leads = leads.map(l => ({
      ...l,
      website: (l.website && /\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)(\?|$)/i.test(l.website)) ? "" : l.website,
    }));

    // ── Step 7: Firecrawl startup websites re-run regex after scrape, still no Thinksuite ──
    const websiteJobs = leads
      .slice(0, 6)
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

    // ── Step 8: Quality gate include all leads with at least a post URL ──
    // HN/IndieHackers posts rarely expose email directly; post URL is still useful to contact founder
    let finalLeads = applyQualityGate(leads, "limited");

    if (finalLeads.length === 0) {
      return Response.json({
        success: false, leads: [],
        error:  `No founder posts found for "${service}". Try "web development", "design", "SEO", or "marketing".`,
      });
    }

    const { granted: sfGranted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, finalLeads.length);
    // Fail closed: quota/wallet exhausted between check and increment (or quota DB unavailable)
    if (sfGranted === 0 && finalLeads.length > 0) {
      return Response.json({ quotaExceeded: true, needsTopup: true }, { status: 402 });
    }
    finalLeads = finalLeads.slice(0, sfGranted);
    await saveLeadHistory(userId, { type: "startup-founders", niche: service, location: country, leadCount: finalLeads.length, leads: finalLeads.slice(0, 50) });
    return Response.json({
      success:        true,
      leads:          finalLeads,
      queryLabel:     parsed.queryLabel || `${service} Founders`,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
    });

  } catch (err) {
    console.error("[startup-founders]", err);
    return Response.json({ error: err.message || "Error finding startup founders" }, { status: 500 });
  }
}
