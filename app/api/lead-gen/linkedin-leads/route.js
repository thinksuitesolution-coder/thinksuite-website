import { getAIClient } from "@/lib/aiClient";
import { firecrawlScrape, extractEmails, extractPhones, extractWebsites, applyQualityGate, getGl, serperSearch } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";
const SCRAPER_KEY = null;

export const maxDuration = 90;

const anthropic   = getAIClient();

/* ─── LinkedIn profile ID extractors ────────────────────────────────────────*/
const SKIP_PERSON_IDS  = new Set(["feed","pub","jobs","company","school","groups","events","mynetwork","messaging","notifications","in"]);
const SKIP_COMPANY_IDS = new Set(["company","school","groups","events","mynetwork","messaging","notifications","search","showcase"]);

function extractLinkedInPersonId(url = "") {
  const m = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]{3,60})/);
  if (!m) return null;
  const id = m[1].toLowerCase();
  return SKIP_PERSON_IDS.has(id) ? null : m[1];
}

function extractLinkedInCompanyId(url = "") {
  const m = url.match(/linkedin\.com\/company\/([a-zA-Z0-9_-]{2,80})/);
  if (!m) return null;
  const id = m[1].toLowerCase();
  return SKIP_COMPANY_IDS.has(id) ? null : m[1];
}

function cleanName(title = "", fallback = "") {
  return title
    .replace(/\s*[-–|]\s*LinkedIn.*/i, "")
    .replace(/\s*\|\s*LinkedIn.*/i, "")
    .replace(/LinkedIn Profile/i, "")
    .trim() || fallback;
}

const SOCIAL_DOMAINS = /(?:instagram|facebook|twitter|youtube|linkedin|tiktok|snapchat)\.com/i;

const JUNK_EMAILS = new Set(["public-schemaorg@w3.org","noreply@linkedin.com","no-reply@linkedin.com"]);
function extractContact(snippet = "") {
  const rawEmail = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "";
  const email    = JUNK_EMAILS.has(rawEmail) ? "" : rawEmail;
  // Match phone numbers: must have 10-15 digits, not look like a date (YYYY-MM-DD)
  const phoneMatches = [...snippet.matchAll(/(?<!\d)(\+?(?:91[\-\s]?)?[6-9]\d{9}|\+\d{1,3}[\s\-]?\d{6,13})(?!\d)/g)];
  const phone = phoneMatches[0]?.[0]?.replace(/[\s\-]/g, "") || "";
  const urls    = snippet.match(/https?:\/\/[^\s"<>]+/g) || [];
  const website = (urls.find(u => !SOCIAL_DOMAINS.test(u)) || "").replace(/[,.)]+$/, "");
  return { email, phone, website };
}

function safeParseJSON(text) {
  try {
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const start   = cleaned.indexOf("{");
    const end     = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch { return null; }
}

/* ─── FREE: DDG LinkedIn search (used when ScraperAPI not available) ─────────*/
async function ddgLinkedInSearch(query) {
  try {
    const body = new URLSearchParams({ q: `site:linkedin.com/in ${query}`, b: "", kl: "in-en" });
    const res  = await fetch("https://html.duckduckgo.com/html/", {
      method: "POST",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Content-Type": "application/x-www-form-urlencoded", "Accept": "text/html", "Referer": "https://duckduckgo.com/" },
      body: body.toString(), signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const html  = await res.text();
    const snips = [...html.matchAll(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)].map(m => m[1].replace(/<[^>]+>/g,"").trim());
    const links = [...html.matchAll(/<h2[^>]*class="result__title"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    const seen = new Set(), items = [];
    links.forEach((m, i) => {
      let url = m[1];
      try { const u = new URL(m[1],"https://duckduckgo.com"); url = u.searchParams.get("uddg") ? decodeURIComponent(u.searchParams.get("uddg")) : m[1]; } catch {}
      const liId = extractLinkedInPersonId(url) || extractLinkedInCompanyId(url);
      if (!liId || seen.has(liId)) return;
      seen.add(liId);
      items.push({ link: url, title: m[2].replace(/<[^>]+>/g,"").trim(), snippet: snips[i]||"", type: url.includes("/company/") ? "company" : "person" });
    });
    return items;
  } catch { return []; }
}

/* ─── ScraperAPI Bing fallback ───────────────────────────────────────────────*/
async function scraperLinkedInSearch(query) {
  if (!SCRAPER_KEY) return ddgLinkedInSearch(query);
  try {
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=20&mkt=en-IN`;
    const apiUrl  = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(bingUrl)}&country_code=in`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return [];
    const html = await res.text();
    if (!html || html.length < 500) return [];
    const seen  = new Set();
    const items = [];
    for (const m of html.matchAll(/linkedin\.com\/in\/([a-zA-Z0-9_-]{3,60})/gi)) {
      const raw = m[1]; const id = raw.toLowerCase();
      if (seen.has(id) || SKIP_PERSON_IDS.has(id)) continue;
      seen.add(id);
      const idx     = html.indexOf(m[0]);
      const snippet = html.slice(Math.max(0, idx - 200), idx + 200).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      items.push({ link: `https://www.linkedin.com/in/${raw}/`, title: raw.replace(/-/g, " "), snippet, type: "person" });
    }
    for (const m of html.matchAll(/linkedin\.com\/company\/([a-zA-Z0-9_-]{2,80})/gi)) {
      const raw = m[1]; const id = raw.toLowerCase();
      if (seen.has(id) || SKIP_COMPANY_IDS.has(id)) continue;
      seen.add(id);
      const idx     = html.indexOf(m[0]);
      const snippet = html.slice(Math.max(0, idx - 200), idx + 200).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      items.push({ link: `https://www.linkedin.com/company/${raw}/`, title: raw.replace(/-/g, " "), snippet, type: "company" });
    }
    return items;
  } catch (e) {
    console.warn("[linkedin-leads] scraper fallback:", e.message);
    return [];
  }
}

/* ─── Build leads from Serper results ───────────────────────────────────────*/
function buildLeadsFromItems(items, seenIds, locationStr, count, searchType = "both", niche = "") {
  const seenUrls  = new Set();
  const leads     = [];
  // Niche keywords from the search term for relevance check
  const nicheWords = niche.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  for (const item of items) {
    if (leads.length >= count) break;
    const url      = item.link || "";
    const snippet  = item.snippet || "";
    const fullText = `${url} ${snippet} ${item.title || ""}`.toLowerCase();
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    // Skip if none of the niche words appear anywhere in the result
    if (nicheWords.length > 0 && !nicheWords.some(w => fullText.includes(w))) continue;

    const { email, phone, website } = extractContact(snippet);

    // Person lead - check URL first, then scan snippet/title for linkedin.com/in/ links
    const personId = extractLinkedInPersonId(url) || extractLinkedInPersonId(fullText);
    if (personId && searchType !== "company") {
      const key = `person:${personId.toLowerCase()}`;
      if (seenIds.has(key)) continue;
      seenIds.add(key);
      const companyMatch  = snippet.match(/\bat\s+([A-Z][^\n|·•,]{2,50})/);
      const industryMatch = snippet.match(/(?:industry|sector|field):\s*([^|.\n]{3,40})/i);
      leads.push({
        type:       "person",
        linkedinId: personId,
        name:       cleanName(item.title, personId),
        profileUrl: `https://www.linkedin.com/in/${personId}/`,
        email, phone, website,
        title:      (snippet.split(/[.\n]/)[0] || "").slice(0, 100),
        company:    companyMatch?.[1]?.trim() || "",
        industry:   industryMatch?.[1]?.trim() || "",
        location:   locationStr,
        bio:        snippet.slice(0, 200),
      });
      continue;
    }

    // Company lead - check URL first, then scan snippet/title for linkedin.com/company/ links
    const companyId = extractLinkedInCompanyId(url) || extractLinkedInCompanyId(fullText);
    if (companyId && searchType !== "person") {
      const key = `company:${companyId.toLowerCase()}`;
      if (seenIds.has(key)) continue;
      seenIds.add(key);
      const sizeMatch  = snippet.match(/(\d[\d,]+)\s+(?:employees|staff|members)/i);
      const foundMatch = snippet.match(/(?:founded|est\.?)\s+(\d{4})/i);
      leads.push({
        type:          "company",
        companyId,
        linkedinId:    companyId,
        name:          cleanName(item.title, companyId),
        profileUrl:    `https://www.linkedin.com/company/${companyId}/`,
        email, phone, website,
        title:         "",
        company:       cleanName(item.title, companyId),
        companySize:   sizeMatch ? parseInt(sizeMatch[1].replace(/,/g, "")) : null,
        founded:       foundMatch?.[1] || "",
        industry:      "",
        location:      locationStr,
        bio:           snippet.slice(0, 200),
      });
    }
  }
  return leads;
}

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { niche, location, jobTitle, searchType = "both", count = 20, previousIds = [], specialInstructions } = body;

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return Response.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    if (!niche?.trim()) {
      return Response.json({ error: "Niche required" }, { status: 400 });
    }

    const locationStr = location?.trim() || "India";
    const titleLabel  = jobTitle || "founder OR owner OR CEO OR director OR manager";
    const seenIds     = new Set(previousIds.map(id => `person:${id.toLowerCase()}`));

    const locationVariants = (() => {
      const parts    = locationStr.split(",").map(s => s.trim()).filter(Boolean);
      const variants = [locationStr];
      if (parts.length > 1) variants.push(parts.slice(1).join(", "));
      const isIndia = /india$/i.test(locationStr) || locationStr.toLowerCase() === "india";
      if (isIndia && !variants.includes("India")) variants.push("India");
      return [...new Set(variants)];
    })();

    let allItems     = [];
    let usedLocation = locationStr;
    const gl = getGl(locationStr);

    {
      const isIndia = gl === "in";
      for (const loc of locationVariants) {
        const personQueries = searchType !== "company" ? (isIndia ? [
          // India-specific: non-site queries work better since LinkedIn blocks site: in India
          serperSearch(`"linkedin.com/in/" "${niche}" "${loc}" email OR phone`, gl, 10),
          serperSearch(`${niche} ${loc} linkedin founder OR owner OR director email contact`, gl, 10),
          serperSearch(`"${niche}" "${loc}" "linkedin.com/in" owner founder email phone`, gl, 10),
          serperSearch(`${niche} ${loc} B2B linkedin profile contact email`, gl, 10),
          serperSearch(`"${niche}" India ${loc} linkedin decision maker email phone`, gl, 10),
        ] : [
          serperSearch(`"linkedin.com/in/" "${niche}" ${loc} ${titleLabel}`, gl, 10),
          serperSearch(`${niche} ${loc} linkedin profile ${titleLabel} email contact`, gl, 10),
          serperSearch(`site:linkedin.com/in "${niche}" ${loc}`, gl, 10),
          serperSearch(`${niche} ${loc} CEO founder director "linkedin.com/in"`, gl, 10),
          serperSearch(`"${niche}" ${loc} professional linkedin phone email`, gl, 10),
        ]) : [];

        const companyQueries = searchType !== "person" ? (isIndia ? [
          serperSearch(`"linkedin.com/company/" "${niche}" "${loc}" email phone`, gl, 10),
          serperSearch(`${niche} company ${loc} linkedin "contact" OR "email" OR "phone"`, gl, 10),
          serperSearch(`site:linkedin.com/company "${niche}" ${loc} India`, gl, 10),
        ] : [
          serperSearch(`"linkedin.com/company/" "${niche}" ${loc}`, gl, 10),
          serperSearch(`site:linkedin.com/company "${niche}" ${loc}`, gl, 10),
          serperSearch(`${niche} company ${loc} "linkedin.com/company" about`, gl, 10),
        ]) : [];

        const results = await Promise.all([...personQueries, ...companyQueries]);
        allItems = results.flat();
        if (allItems.length > 0) { usedLocation = loc; break; }
      }
    }

    // ScraperAPI Bing fallback - Bing HTML parsing extracts linkedin.com URLs from result pages
    if (allItems.length === 0) {
      for (const loc of locationVariants) {
        const scraped = await Promise.all([
          scraperLinkedInSearch(`"linkedin.com/in" ${niche} ${titleLabel} ${loc}`),
          scraperLinkedInSearch(`${niche} ${loc} linkedin profile founder director email`),
          searchType !== "person" ? scraperLinkedInSearch(`"linkedin.com/company" ${niche} ${loc}`) : Promise.resolve([]),
        ]);
        const flat = scraped.flat();
        if (flat.length > 0) { allItems = flat; usedLocation = loc; break; }
      }
    }

    let leads = buildLeadsFromItems(allItems, seenIds, usedLocation, count, searchType, niche);

    if (leads.length === 0) {
      return Response.json({
        success: false, leads: [],
        error: `No LinkedIn profiles found for "${niche}" in ${locationStr}. Try a broader keyword, different job title, or check spelling.`,
      });
    }

    // ── Phase 1: Parallel directory + website contact search ─────────────────
    // LinkedIn profiles are behind a login wall - scraping them directly yields nothing.
    // The right strategy: use the LinkedIn ID to find the company/person in open directories
    // (JustDial, IndiaMart, Sulekha for India; Google for international) which publish phone/email.
    const isIndiaSrch = gl === "in";
    const SOCIAL_SKIP = /linkedin|instagram|facebook|twitter|youtube|x\.com/i;

    const websiteJobs = [];
    {
      // Run directory searches for ALL top-10 leads in parallel (not just those missing contacts)
      const dirSearches = await Promise.allSettled(
        leads.slice(0, 10).map((l, i) => {
          const q = l.company || l.name;
          if (!q) return Promise.resolve([]);
          if (isIndiaSrch) {
            // Two parallel queries: directories + open web
            return Promise.allSettled([
              serperSearch(
                `"${q}" (site:justdial.com OR site:indiamart.com OR site:sulekha.com OR site:yellowpages.in)`,
                "in", 8
              ),
              serperSearch(`"${q}" ${niche} email OR phone OR contact India`, "in", 5),
            ]).then(results =>
              results.filter(r => r.status === "fulfilled").flatMap(r => r.value)
            );
          }
          return serperSearch(`"${q}" ${niche} email phone website contact`, gl, 8);
        })
      );

      for (let i = 0; i < Math.min(leads.length, 10); i++) {
        if (dirSearches[i].status !== "fulfilled") continue;
        const items = dirSearches[i].value;
        for (const item of items) {
          const text   = `${item.snippet} ${item.link} ${item.title}`;
          const emails = extractEmails(text);
          const phones = extractPhones(text);
          const webs   = extractWebsites(text).filter(w => !SOCIAL_SKIP.test(w));
          if (!leads[i].email   && emails[0]) leads[i] = { ...leads[i], email:   emails[0] };
          if (!leads[i].phone   && phones[0]) leads[i] = { ...leads[i], phone:   phones[0] };
          if (!leads[i].website && webs[0])   leads[i] = { ...leads[i], website: webs[0] };
          if (leads[i].email && leads[i].phone) break;
        }
        // Queue website for Firecrawl if we found one
        if (leads[i].website && !leads[i].email && !leads[i].phone) {
          websiteJobs.push({ index: i, website: leads[i].website });
        }
      }
    }

    // ── Phase 2: Firecrawl company contact pages ──────────────────────────────
    // Try /contact sub-page first - most companies list phone/email there specifically
    if (websiteJobs.length > 0) {
      const crawled = await Promise.allSettled(
        websiteJobs.slice(0, 5).map(async j => {
          const base       = j.website.replace(/\/+$/, "");
          const contactUrl = base + "/contact";
          const contactMd  = await firecrawlScrape(contactUrl, 7000);
          if (contactMd && (extractEmails(contactMd).length || extractPhones(contactMd).length)) {
            return contactMd;
          }
          return firecrawlScrape(base, 7000);
        })
      );
      for (let j = 0; j < Math.min(websiteJobs.length, 5); j++) {
        if (crawled[j].status !== "fulfilled" || !crawled[j].value) continue;
        const { index } = websiteJobs[j];
        const md = crawled[j].value;
        const we = extractEmails(md)[0] || "";
        const wp = extractPhones(md)[0]  || "";
        if (!leads[index].email && we) leads[index] = { ...leads[index], email: we };
        if (!leads[index].phone && wp) leads[index] = { ...leads[index], phone: wp };
      }
    }

    // Decision maker score
    function getDmScore(title = "") {
      const t = title.toLowerCase();
      if (/\b(founder|co-founder|proprietor|owner|ceo|chief executive|managing director|md)\b/.test(t)) return 10;
      if (/\b(director|vp|vice president|cto|cmo|cfo|coo|head of|president)\b/.test(t)) return 8;
      if (/\b(general manager|gm|senior manager|manager|partner)\b/.test(t)) return 6;
      if (/\b(executive|associate|analyst|intern|trainee|assistant|junior)\b/.test(t)) return 3;
      return 5;
    }

    // Skills extraction from bio/title text
    function extractSkills(bio = "", title = "") {
      const text = `${bio} ${title}`.toLowerCase();
      const SKILL_KEYWORDS = [
        "seo","ppc","google ads","meta ads","digital marketing","social media",
        "react","nodejs","python","java","javascript","typescript","flutter","swift",
        "ui/ux","figma","photoshop","video editing","content writing","copywriting",
        "sales","b2b sales","crm","hubspot","salesforce","lead generation",
        "supply chain","logistics","import","export","manufacturing","procurement",
        "accounting","taxation","audit","gst","finance","banking","investment",
        "real estate","construction","architecture","interior design",
        "healthcare","pharma","clinical","medical","dental",
        "ai","machine learning","data science","cloud","aws","azure",
        "hr","recruitment","talent acquisition","payroll",
        "legal","compliance","ip","trademark","corporate law",
      ];
      return SKILL_KEYWORDS.filter(k => text.includes(k)).slice(0, 6);
    }

    // Add DM score + skills to all leads
    leads = leads.map(l => ({
      ...l,
      dm_score: l.type === "person" ? getDmScore(l.title || l.bio || "") : null,
      skills:   extractSkills(l.bio || "", l.title || ""),
    }));

    // Build contactMap BEFORE AI - regex-verified, AI cannot override
    const contactMap = new Map(
      leads.map(l => [
        `${l.type}:${(l.linkedinId || l.companyId || "").toLowerCase()}`,
        { email: l.email, phone: l.phone },
      ])
    );

    // AI clean - decision maker focus, exact niche match, skills
    let cleaned = null;
    try {
      const cleanMsg = await anthropic.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system:     `You are a LinkedIn B2B lead specialist. Clean leads for exact niche match "${niche}".
HARD RULES:
1. email and phone are READ-ONLY - copy exactly as given, never change, never invent.
2. DISCARD any lead where title, company, AND bio give NO evidence of "${niche}" - be strict.
3. DISCARD leads with no name (name is slug-like random string with no spaces or recognizable words).
4. Clean name: remove " - LinkedIn", " | LinkedIn", "| India" suffixes.
5. Clean title: job title only - remove company name from title field.
6. Extract skills array from bio/title if missing.
7. Preserve dm_score exactly.
8. Keep ALL other fields exactly as given.${specialInstructions ? `\n9. SPECIAL INSTRUCTIONS: ${specialInstructions}` : ""}
Return ONLY raw JSON, no markdown.`,
        messages: [{
          role:    "user",
          content: `Clean these ${leads.length} LinkedIn leads for "${niche}" in "${usedLocation}".
Preserve ALL fields: type, linkedinId, companyId, profileUrl, name, email, phone, website, title, company, companySize, industry, location, bio, founded, dm_score, skills.
Contact fields are pre-verified - copy exactly, do NOT change.
DISCARD leads where title/company/bio clearly doesn't match "${niche}".

Data: ${JSON.stringify(leads)}
Return ONLY: {"leads":[{...all fields...}],"queryLabel":"3-4 words"}`,
        }],
      });
      cleaned = safeParseJSON(cleanMsg.content[0]?.text || "");
    } catch (claudeErr) {
      console.warn("[linkedin-leads] AI clean skipped:", claudeErr.message);
    }

    const idMap = new Map(leads.map(l => [
      `${l.type}:${(l.linkedinId || l.companyId || "").toLowerCase()}`,
      l,
    ]));

    const mergedLeads = (cleaned?.leads || leads).map(l => {
      const key    = `${l.type}:${(l.linkedinId || l.companyId || "").toLowerCase()}`;
      const orig   = idMap.get(key) || {};
      const lid    = l.linkedinId || orig.linkedinId;
      // ANTI-HALLUCINATION: always restore regex-verified email/phone, never trust Claude's output
      const trusted = contactMap.get(key) || { email: orig.email || "", phone: orig.phone || "" };
      return {
        ...orig, ...l, linkedinId: lid,
        email:      trusted.email,
        phone:      trusted.phone,
        profileUrl: l.profileUrl || orig.profileUrl ||
          (lid ? `https://www.linkedin.com/${l.type === "company" ? "company" : "in"}/${lid}/` : ""),
      };
    });

    // "limited": profileUrl counts — LinkedIn hides contacts behind login, enrichment handles them
    const finalLeads = applyQualityGate(mergedLeads, "limited");

    if (finalLeads.length === 0) {
      return Response.json({
        success: false, leads: [],
        error: "Leads found but none had contact info (phone/email/website). Try a broader niche.",
      });
    }

    // AI insights
    let ai_insight = "";
    try {
      const insightRes = await anthropic.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 350,
        system:     `You are a LinkedIn lead analyst. Give a sharp 2-3 line insight: name the top 2-3 most valuable leads and exactly why (decision maker score, contact completeness, niche relevance). Then write one personalized LinkedIn connection request message (under 70 words, professional, mention their specific role + niche). Return ONLY valid JSON: {"insight":"...","connection_request":"..."}`,
        messages: [{
          role:    "user",
          content: `Niche: "${niche}", Location: ${usedLocation}\nLeads:\n${JSON.stringify(finalLeads.slice(0, 6).map(l => ({ name: l.name, title: l.title, company: l.company, dm_score: l.dm_score, email: l.email, phone: l.phone, skills: l.skills })), null, 2)}`,
        }],
      });
      const ib = insightRes.content.find(b => b.type === "text");
      const ip = JSON.parse((ib?.text || "{}").replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"").trim());
      ai_insight = ip.insight || "";
    } catch {}

    const { granted: liGranted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, finalLeads.length);
    // Fail closed: quota/wallet exhausted between check and increment (or quota DB unavailable)
    if (liGranted === 0 && finalLeads.length > 0) {
      return Response.json({ quotaExceeded: true, needsTopup: true }, { status: 402 });
    }
    const liLeads = finalLeads.slice(0, liGranted);
    await saveLeadHistory(userId, { type: "linkedin", niche, location: usedLocation, leadCount: liLeads.length, leads: liLeads.slice(0, 50) });
    return Response.json({
      success:        true,
      leads:          liLeads,
      ai_insight,
      queryLabel:     cleaned?.queryLabel || `${niche} - ${usedLocation}`,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
    });

  } catch (err) {
    console.error("[linkedin-leads] error:", err);
    return Response.json({ error: err.message || "Error generating LinkedIn leads" }, { status: 500 });
  }
}
