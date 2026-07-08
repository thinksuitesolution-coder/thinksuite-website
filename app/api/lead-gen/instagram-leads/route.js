import { getAIClient } from "@/lib/aiClient";
import { firecrawlScrape, extractEmails, extractPhones, extractWebsites, extractWhatsAppNumber, applyQualityGate, isBusinessLead, getGl, serperSearch } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";
const SCRAPER_KEY = null;
const SERPER_KEY = null;

export const maxDuration = 90;

const anthropic   = getAIClient();

const SKIP_PATHS = new Set([
  "p","reel","explore","accounts","stories","tv","reels","tags","about","help",
  "legal","privacy","press","api","directory","lite","developer","channel",
]);
const SOCIAL_RE = /(?:instagram|facebook|twitter|youtube|linkedin|tiktok|snapchat)\.com/i;

function extractHandle(url = "") {
  const match  = url.match(/instagram\.com\/([^/?#]+)/);
  const handle = match?.[1];
  return handle && !SKIP_PATHS.has(handle) ? handle : null;
}

function cleanName(title = "", handle = "") {
  return title
    .replace(/\s*[•|·]\s*Instagram.*/i, "")
    .replace(/\s*[-–]\s*Instagram.*/i, "")
    .replace(/\s*\(@.*?\).*/g, "")
    .replace(/Instagram photos and videos/i, "")
    .trim() || handle;
}

function extractWebsite(snippet = "") {
  const urls  = snippet.match(/https?:\/\/[^\s"<>]+/g) || [];
  const found = urls.find(u => !SOCIAL_RE.test(u));
  return found ? found.replace(/[,.)]+$/, "") : "";
}

function extractHandlesFromText(title = "", snippet = "") {
  const combined = `${title} ${snippet}`;
  const handles  = [];
  for (const m of combined.matchAll(/instagram\.com\/([a-zA-Z0-9][a-zA-Z0-9._]{2,28}[a-zA-Z0-9])\/?/gi)) {
    if (!SKIP_PATHS.has(m[1].toLowerCase())) handles.push(m[1]);
  }
  if (combined.toLowerCase().includes("instagram")) {
    for (const m of combined.matchAll(/@([a-zA-Z0-9][a-zA-Z0-9._]{2,28}[a-zA-Z0-9])/g)) {
      if (!SKIP_PATHS.has(m[1].toLowerCase())) handles.push(m[1]);
    }
  }
  return [...new Set(handles)];
}

/* ─── Follower helpers ───────────────────────────────────────────────────────*/
function formatFollowers(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function parseFollowerCount(val) {
  if (!val) return null;
  const s = String(val).trim().replace(/,/g, "");
  if (/^\d+$/.test(s)) return parseInt(s);
  const k = s.match(/^([\d.]+)[Kk]$/);
  if (k) return Math.round(parseFloat(k[1]) * 1000);
  const m = s.match(/^([\d.]+)[Mm]$/);
  if (m) return Math.round(parseFloat(m[1]) * 1_000_000);
  return null;
}

// Extract followers from HTML/JSON (multiple current patterns)
function extractFollowersFromHtml(html = "") {
  const patterns = [
    /"edge_followed_by":\{"count":(\d+)\}/,
    /"followers_count":(\d+)/,
    /"follower_count":(\d+)/,
    /"followerCount":(\d+)/,
    /follower_count["']?\s*:\s*(\d+)/,
    /("|\s)followers":(\d+)/,
    /(\d[\d,]+)\s+[Ff]ollowers/,
    /[Ff]ollowers[:\s"]+(\d[\d,]+)/,
    /"count_followers":(\d+)/,
    /"social_context":"([\d,]+)\s+[Ff]ollowers/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const raw = (m[2] || m[1]).replace(/,/g, "");
      const num = parseInt(raw);
      if (num > 0) return formatFollowers(num);
    }
  }
  return "";
}

// Fetch public Instagram profile JSON via /?__a=1 (no JS render needed)
async function fetchIgPublicData(handle) {
  if (!SCRAPER_KEY) return null;
  try {
    const url = `https://www.instagram.com/${handle}/?__a=1&__d=dis`;
    const params = new URLSearchParams({ api_key: SCRAPER_KEY, url, country_code: "us" });
    const res = await fetch(`https://api.scraperapi.com/?${params}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim().startsWith("<")) return null; // got HTML (login wall), not JSON
    const json = JSON.parse(text);
    const user = json?.graphql?.user || json?.data?.user || json?.user || null;
    if (!user) return null;
    const followerCount = user.edge_followed_by?.count || user.follower_count || user.followers_count || 0;
    return {
      followers:  followerCount > 0 ? formatFollowers(followerCount) : "",
      email:      user.business_email || user.public_email || "",
      phone:      user.business_phone_number || user.contact_phone_number || "",
      website:    user.external_url || "",
      bioSnippet: user.biography || "",
    };
  } catch { return null; }
}

// Extract followers from Google snippet text (most reliable source)
function extractFollowersFromSnippet(text = "") {
  const patterns = [
    /([\d,.]+[KkMm]?)\s+[Ff]ollowers/,
    /[Ff]ollowers[:\s]+([\d,.]+[KkMm]?)/,
    /([\d,.]+[KkMm]?)\s+seguidores/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    const raw = m[1].replace(/,/g, "");
    if (/[Kk]$/.test(raw)) return raw.toUpperCase().replace(/k$/i,"K");
    if (/[Mm]$/.test(raw)) return raw.toUpperCase().replace(/m$/i,"M");
    const n = parseInt(raw);
    if (n > 0) return formatFollowers(n);
  }
  return "";
}

/* ─── WhatsApp / Telegram extraction ────────────────────────────────────────*/

function extractWhatsAppGroup(text = "") {
  const m = text.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
  return m ? `https://chat.whatsapp.com/${m[1]}` : "";
}

function extractTelegram(text = "") {
  const m = text.match(/(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{3,32})/);
  return m ? `https://t.me/${m[1]}` : "";
}

/* ─── Opportunity tag ────────────────────────────────────────────────────────*/
function getOpportunityTag(lead) {
  const fc = parseFollowerCount(lead.followers);
  if (lead.whatsapp_group) return "whatsapp-community";
  if (fc && fc >= 5000 && fc <= 200000 && (lead.email || lead.phone)) return "brand-collab";
  if (!lead.website && (lead.phone || lead.email || lead.whatsapp_number)) return "needs-website";
  if (!lead.email && !lead.phone && !lead.whatsapp_number && lead.website) return "needs-digital-setup";
  if (lead.website && (lead.email || lead.phone)) return "multi-platform";
  return "";
}

/* ─── Enrich website (Firecrawl) for email/phone/WhatsApp/Telegram ──────────*/
async function enrichWebsite(websiteUrl) {
  if (!websiteUrl || !websiteUrl.startsWith("http")) return {};
  try {
    const md = await firecrawlScrape(websiteUrl, 10000);
    return {
      website_email:    extractEmails(md)[0]       || "",
      website_phone:    extractPhones(md)[0]        || "",
      website_whatsapp: extractWhatsAppNumber(md)   || "",
      website_wa_group: extractWhatsAppGroup(md)    || "",
      website_telegram: extractTelegram(md)         || "",
    };
  } catch { return {}; }
}

/* ─── Search for leads ───────────────────────────────────────────────────────*/
async function searchForLocation(niche, typeLabel, loc, gl, isInternational = false) {
  const isNano    = typeLabel === "nano";
  const isCreator = typeLabel === "creator" || typeLabel === "influencer";
  // For international, never append "India" and use broader terms
  const localTag  = isInternational ? "" : "local";
  const notIndia  = isInternational ? `-india -"in India"` : "";

  const queries = isNano ? [
    `site:instagram.com ${niche} ${loc} small account contact email ${notIndia}`,
    `site:instagram.com ${niche} ${loc} micro account 1000 OR 2000 OR 5000 followers ${notIndia}`,
    `${niche} nano account ${loc} instagram under 10k followers contact ${notIndia}`,
    `${niche} instagram ${loc} small ${localTag} 1k 2k 3k followers email ${notIndia}`,
    `small business ${niche} instagram ${loc} contact DM ${notIndia}`,
    `${niche} ${loc} instagram new small account "DM for" OR "contact us" ${notIndia}`,
    `${niche} instagram ${loc} nano micro small creator contact ${notIndia}`,
    `site:instagram.com ${niche} ${loc} small bio email ${notIndia}`,
    `${niche} ${loc} instagram account 500 1000 2000 followers contact ${notIndia}`,
    `${niche} instagram ${loc} new account growing followers email ${notIndia}`,
  ] : isCreator ? [
    `site:instagram.com "${niche}" creator ${loc} "collaboration" OR "collab" OR "DM for" ${notIndia}`,
    `site:instagram.com ${niche} ${loc} micro influencer 1000 OR 2000 OR 5000 followers ${notIndia}`,
    `${niche} micro influencer ${loc} instagram collab email ${notIndia}`,
    `${niche} content creator ${loc} instagram "paid collab" OR "brand deal" OR "UGC" ${notIndia}`,
    `${niche} nano influencer ${loc} instagram 1k 2k 5k followers contact ${notIndia}`,
    `site:instagram.com ${niche} ${loc} content creator email contact ${notIndia}`,
    `${niche} ${loc} instagram creator "DM for collab" OR "collab enquiry" ${notIndia}`,
    `${niche} instagram ${loc} creator 1000 2000 3000 followers "contact" ${notIndia}`,
    `${niche} UGC creator ${loc} instagram email rates ${notIndia}`,
    `site:instagram.com ${niche} creator ${loc} contact email ${notIndia}`,
  ] : [
    `site:instagram.com ${niche} ${typeLabel} ${loc} email OR contact ${notIndia}`,
    `site:instagram.com ${niche} ${loc} business contact ${notIndia}`,
    `site:instagram.com "${niche}" ${loc} email contact ${notIndia}`,
    `${niche} instagram ${loc} business email phone ${notIndia}`,
    `${localTag} ${niche} instagram ${loc} contact email ${notIndia}`.trim(),
    `${niche} instagram ${loc} DM OR "contact us" ${notIndia}`,
    `${niche} instagram ${loc} shop OR store OR studio email ${notIndia}`,
    `${niche} ${loc} instagram bio email OR phone ${notIndia}`,
    `"instagram.com" ${niche} ${loc} ${typeLabel} email OR phone ${notIndia}`,
    `${niche} ${loc} instagram account contact order enquiry ${notIndia}`,
  ];

  const results = await Promise.all(queries.map(q => serperSearch(q.trim(), gl, 10)));
  return results.flat();
}

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { niche, location, accountType, count = 20, previousHandles = [], isInternational = false, specialInstructions, minFollowers, maxFollowers } = body;

    if (!niche?.trim()) {
      return Response.json({ error: "Niche required" }, { status: 400 });
    }

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return Response.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    // International must never default to India
    const locationStr = location?.trim() || (isInternational ? "United States" : "India");
    const typeLabel   = { business: "business", influencer: "influencer", d2c: "brand", creator: "creator", nano: "nano" }[accountType] || accountType || "business";

    const locationVariants = (() => {
      const parts    = locationStr.replace(/, ?India$/i, "").split(",").map(s => s.trim()).filter(Boolean);
      const variants = [locationStr];
      if (parts.length > 1) {
        variants.push(isInternational
          ? parts.slice(1).join(", ")
          : `${parts.slice(1).join(", ")}, India`
        );
      }
      // Only add "India" fallback for domestic searches
      if (!isInternational && !locationStr.match(/India$/i)) variants.push("India");
      return [...new Set(variants)];
    })();

    const seenHandles = new Set(previousHandles.map(h => h.toLowerCase()));
    const seenUrls    = new Set();
    let allItems      = [];
    let usedLocation  = locationStr;

    const gl = getGl(locationStr);
    const seenItemUrls = new Set();
    for (const loc of locationVariants) {
      const items = await searchForLocation(niche, typeLabel, loc, gl, isInternational);
      for (const item of items) {
        const key = item.link || `${item.title}::${item.snippet}`;
        if (!seenItemUrls.has(key)) { seenItemUrls.add(key); allItems.push(item); }
      }
      if (allItems.length === 0) usedLocation = loc;
    }

    if (allItems.length === 0) {
      return Response.json({
        success: false, leads: [],
        error: `No Instagram profiles found for "${niche}" in ${locationStr}. Try a broader keyword or different location.`,
      });
    }

    // Build initial leads array
    const addLead = (handle, item, snippet) => {
      const key = handle.toLowerCase();
      if (seenHandles.has(key)) return;
      seenHandles.add(key);
      const JUNK_IG_EMAILS = new Set(["public-schemaorg@w3.org","noreply@instagram.com"]);
      const rawEmail     = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "";
      const phoneMatches = [...snippet.matchAll(/(?<!\d)(\+?(?:91[\-\s]?)?[6-9]\d{9}|\+\d{1,3}[\s\-]?\d{6,13})(?!\d)/g)];
      // Extract WhatsApp/Telegram from snippet too
      const snippetText    = `${item.title} ${snippet}`;
      const snippetFollowers = extractFollowersFromSnippet(snippetText);
      leads.push({
        handle,
        name:            cleanName(item.title, handle),
        email:           JUNK_IG_EMAILS.has(rawEmail) ? "" : rawEmail,
        phone:           phoneMatches[0]?.[0]?.replace(/[\s\-]/g, "") || "",
        whatsapp_number: extractWhatsAppNumber(snippetText),
        whatsapp_group:  extractWhatsAppGroup(snippetText),
        telegram:        extractTelegram(snippetText),
        website:         extractWebsite(snippet),
        category:        niche,
        followers:       snippetFollowers,
        location:        usedLocation,
        bioSnippet:      snippet.slice(0, 200),
        profileUrl:      `https://www.instagram.com/${handle}/`,
      });
    };

    let leads = [];
    for (const item of allItems) {
      if (leads.length >= count) break;
      const url     = item.link || "";
      const snippet = item.snippet || "";
      if (seenUrls.has(url)) continue;
      seenUrls.add(url);
      const directHandle = extractHandle(url);
      if (directHandle) { addLead(directHandle, item, snippet); continue; }
      // When direct extraction fails (tag/explore/reel pages or non-IG URLs),
      // always try snippet - snippets often mention @handles or instagram.com/handle
      const snippetHandles = extractHandlesFromText(item.title, snippet);
      for (const h of snippetHandles) {
        if (leads.length >= count) break;
        addLead(h, { title: h.replace(/[._]/g, " ") }, snippet);
      }
    }

    if (leads.length === 0) {
      return Response.json({
        success: false, leads: [],
        error: `No verified Instagram profiles found for "${niche}" in ${locationStr}. Try broader keyword or different location.`,
      });
    }

    // ── Phase 1: IG JSON + parallel Serper contact search ────────────────────
    // IG /?__a=1 is heavily rate-limited but still works for some public profiles.
    // We run Serper contact searches IN PARALLEL - far more reliable for finding
    // emails/phones because it searches the handle's entire web footprint, not just IG.
    const TOP_N = 10;
    const toEnrich = leads.slice(0, TOP_N);

    const [igJsonArr, contactSearchArr] = await Promise.all([
      // Quick IG JSON attempt (often blocked, but free and fast)
      Promise.all(toEnrich.map(l => fetchIgPublicData(l.handle))),
      // Contact search via DataForSEO → DDG — name+handle across web
      Promise.all(toEnrich.map(l => {
        const name = l.name?.replace(/[^a-zA-Z0-9 ]/g, "").trim() || l.handle;
        return Promise.allSettled([
          serperSearch(`"@${l.handle}" OR "${l.handle}" email phone contact`, gl, 5),
          serperSearch(`"${name}" ${niche} ${usedLocation} email OR phone`, gl, 5),
          serperSearch(
            `site:linktr.ee "${l.handle}" OR site:beacons.ai "${l.handle}" OR site:bio.link "${l.handle}"`,
            gl, 3
          ),
        ]);
      })),
    ]);

    // Collect Firecrawl jobs
    const websiteEnrichJobs = [];
    leads = leads.map((lead, i) => {
      if (i >= TOP_N) return lead;

      let emails = [], phones = [], websites = [], followersRaw = "", bioSnippet = "";
      let wa_num = lead.whatsapp_number || "", wa_grp = lead.whatsapp_group || "", tg = lead.telegram || "";

      // Merge IG JSON data (when available)
      const igData = igJsonArr[i];
      if (igData) {
        followersRaw = igData.followers || "";
        bioSnippet   = igData.bioSnippet || lead.bioSnippet || "";
        if (igData.email)   emails.push(igData.email);
        if (igData.phone)   phones.push(igData.phone);
        if (igData.website) websites.push(igData.website);
      }

      // Merge Serper contact search results
      const searchSets = contactSearchArr[i];
      if (Array.isArray(searchSets)) {
        const combined = searchSets
          .filter(r => r?.status === "fulfilled")
          .flatMap(r => r.value || [])
          .map(r => `${r.snippet} ${r.link}`)
          .join(" ");
        if (combined) {
          emails   = [...emails,   ...extractEmails(combined)];
          phones   = [...phones,   ...extractPhones(combined)];
          websites = [...websites, ...extractWebsites(combined)];
          if (!wa_num) wa_num = extractWhatsAppNumber(combined);
          if (!wa_grp) wa_grp = extractWhatsAppGroup(combined);
          if (!tg)     tg     = extractTelegram(combined);
          // Queue bio link pages (linktr.ee, beacons.ai etc) for Firecrawl
          const bioM = combined.match(
            /(?:linktr\.ee|bio\.link|beacons\.ai|taplink\.cc|linkin\.bio)\/[A-Za-z0-9._%-]+/i
          );
          if (bioM) {
            const bioUrl = `https://${bioM[0].replace(/^https?:\/\//, "")}`;
            websiteEnrichJobs.push({ index: i, website: bioUrl, isBio: true });
          }
        }
      }

      const followers       = lead.followers || followersRaw;
      const enrichedWebsite = lead.website || websites[0] || "";
      // Queue company website for Firecrawl contact-page scrape
      if (enrichedWebsite && !emails[0] && !phones[0] && !wa_num) {
        websiteEnrichJobs.push({ index: i, website: enrichedWebsite, isBio: false });
      }

      return {
        ...lead,
        email:           lead.email          || emails[0]  || "",
        phone:           lead.phone          || phones[0]  || "",
        whatsapp_number: wa_num,
        whatsapp_group:  wa_grp,
        telegram:        tg,
        website:         enrichedWebsite,
        bioSnippet:      bioSnippet || lead.bioSnippet,
        followers,
      };
    });

    // ── Phase 2: Firecrawl website / bio-link pages ───────────────────────────
    // For business websites, we also try /contact which often has the phone number
    if (websiteEnrichJobs.length > 0) {
      const jobs = websiteEnrichJobs.slice(0, 5);
      const crawled = await Promise.allSettled(
        jobs.map(async j => {
          if (!j.isBio) {
            // Try /contact sub-page first - most businesses put phone/email there
            const contactUrl = j.website.replace(/\/+$/, "") + "/contact";
            const contactMd  = await firecrawlScrape(contactUrl, 7000);
            if (contactMd && (extractEmails(contactMd).length || extractPhones(contactMd).length)) {
              return contactMd;
            }
          }
          return firecrawlScrape(j.website, 8000);
        })
      );
      for (let j = 0; j < jobs.length; j++) {
        if (crawled[j].status !== "fulfilled" || !crawled[j].value) continue;
        const { index } = jobs[j];
        const md  = crawled[j].value;
        const we  = extractEmails(md)[0]       || "";
        const wp  = extractPhones(md)[0]        || "";
        const ww  = extractWebsites(md)[0]      || "";
        const wwa = extractWhatsAppNumber(md)   || "";
        const wwg = extractWhatsAppGroup(md)    || "";
        const wtg = extractTelegram(md)         || "";
        if (!leads[index].email           && we)  leads[index] = { ...leads[index], email:           we };
        if (!leads[index].phone           && wp)  leads[index] = { ...leads[index], phone:           wp };
        if (!leads[index].website         && ww)  leads[index] = { ...leads[index], website:         ww };
        if (!leads[index].whatsapp_number && wwa) leads[index] = { ...leads[index], whatsapp_number: wwa };
        if (!leads[index].whatsapp_group  && wwg) leads[index] = { ...leads[index], whatsapp_group:  wwg };
        if (!leads[index].telegram        && wtg) leads[index] = { ...leads[index], telegram:        wtg };
      }
    }

    // ── Phase 3: Final sweep - leads still missing email+phone get a name search ─
    // Covers leads beyond TOP_N and any from the first batch still missing contacts
    const stillMissing = leads
      .map((l, idx) => ({ idx, l }))
      .filter(({ l }) => !l.email && !l.phone && !l.whatsapp_number && !l.telegram)
      .slice(0, 6);
    if (stillMissing.length > 0) {
      const sweepResults = await Promise.allSettled(
        stillMissing.map(({ l }) => {
          const name = l.name?.replace(/[^a-zA-Z0-9 ]/g, "").trim() || l.handle;
          return serperSearch(`"${name}" ${niche} ${usedLocation} email phone contact`, gl, 5);
        })
      );
      for (let k = 0; k < stillMissing.length; k++) {
        if (sweepResults[k].status !== "fulfilled") continue;
        const { idx } = stillMissing[k];
        const combined = sweepResults[k].value.map(r => `${r.snippet} ${r.link}`).join(" ");
        const fe  = extractEmails(combined)[0]       || "";
        const fp  = extractPhones(combined)[0]        || "";
        const fw  = extractWebsites(combined)[0]      || "";
        const fwa = extractWhatsAppNumber(combined)   || "";
        const fwg = extractWhatsAppGroup(combined)    || "";
        const ftg = extractTelegram(combined)         || "";
        if (!leads[idx].email           && fe)  leads[idx] = { ...leads[idx], email:           fe };
        if (!leads[idx].phone           && fp)  leads[idx] = { ...leads[idx], phone:           fp };
        if (!leads[idx].website         && fw)  leads[idx] = { ...leads[idx], website:         fw };
        if (!leads[idx].whatsapp_number && fwa) leads[idx] = { ...leads[idx], whatsapp_number: fwa };
        if (!leads[idx].whatsapp_group  && fwg) leads[idx] = { ...leads[idx], whatsapp_group:  fwg };
        if (!leads[idx].telegram        && ftg) leads[idx] = { ...leads[idx], telegram:        ftg };
      }
    }

    // For nano type: enforce follower ceiling in code (Claude sometimes keeps large accounts)
    if (typeLabel === "nano") {
      leads = leads.filter(l => {
        const f = l.followers || "";
        if (!f) return true;
        if (/[Mm]$/.test(f)) return false;
        const kMatch = f.match(/^([\d.]+)[Kk]$/);
        if (kMatch && parseFloat(kMatch[1]) >= 10) return false;
        return true;
      });
    }

    const minF = minFollowers ? Number(minFollowers) : null;
    const maxF = maxFollowers ? Number(maxFollowers) : null;
    if (minF || maxF) {
      leads = leads.filter(l => {
        const cnt = parseFollowerCount(l.followers);
        if (cnt === null) return true; // no follower data → keep (Instagram blocks scraping, can't verify)
        if (minF && cnt < minF) return false;
        if (maxF && cnt > maxF) return false;
        return true;
      });
    }

    // Build contactMap - all contact fields READ-ONLY (AI cannot change them)
    const contactMap = new Map(
      leads.map(l => [l.handle?.toLowerCase(), {
        email:           l.email,
        phone:           l.phone,
        whatsapp_number: l.whatsapp_number,
        whatsapp_group:  l.whatsapp_group,
        telegram:        l.telegram,
      }])
    );

    const isInfluencer = ["influencer","creator","nano"].includes(typeLabel);

    const systemPrompt = isInfluencer
      ? `You are an Instagram influencer lead specialist. Clean and validate influencer profiles for the niche "${niche}".
HARD RULES:
1. email, phone, whatsapp_number, whatsapp_group, telegram are ALL READ-ONLY - copy exactly, never change, never invent.
2. DISCARD accounts where handle contains random digits (user12345678), "earn_money", "deals_", "investment_" patterns.
3. DISCARD accounts with empty or very short bio (under 15 chars in bioSnippet).
4. DISCARD accounts not related to "${niche}" - handle or bio must suggest the niche.
5. Clean name: remove "• Instagram", "- Instagram", "| Instagram" suffixes.
6. Set category to "${niche}".
7. Keep all other fields exactly as given.${specialInstructions ? `\n8. SPECIAL INSTRUCTIONS: ${specialInstructions}` : ""}
Return ONLY valid JSON, no markdown.`
      : `You are an Instagram business lead specialist. Clean and validate business accounts for the niche "${niche}".
HARD RULES:
1. email, phone, whatsapp_number, whatsapp_group, telegram are ALL READ-ONLY - copy exactly, never change, never invent.
2. DISCARD personal accounts with no business indicators in name, handle, or bio.
3. DISCARD spam handles: random digits (user12345678), "earn_money", "deals_", "investment_" patterns.
4. DISCARD accounts not related to "${niche}" - handle or bio must suggest the niche.
5. PREFER accounts where handle or name contains niche keywords.
6. Clean name: remove "• Instagram", "- Instagram", "| Instagram" suffixes.
7. Set category to "${niche}".
8. Keep all other fields exactly as given.${specialInstructions ? `\n9. SPECIAL INSTRUCTIONS: ${specialInstructions}` : ""}
Return ONLY valid JSON, no markdown.`;

    let result = { leads: null, queryLabel: null };
    try {
      const msg = await anthropic.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system:     systemPrompt,
        messages: [{
          role:    "user",
          content: `Clean these Instagram ${isInfluencer ? "influencer" : "business"} leads for "${niche}" in "${usedLocation}":
${JSON.stringify(leads, null, 2)}

Preserve ALL fields: handle, profileUrl, name, email, phone, whatsapp_number, whatsapp_group, telegram, website, category, location, bioSnippet, followers.
Contact fields are pre-verified - copy them EXACTLY, do not change.

Return ONLY: {"leads":[{...all fields...}],"queryLabel":"3-4 words"}`,
        }],
      });

      const raw = msg.content[0]?.text?.trim() || "{}";
      const js  = raw.indexOf("{");
      const je  = raw.lastIndexOf("}");
      result = JSON.parse(js !== -1 && je !== -1 ? raw.slice(js, je + 1) : raw);
    } catch (claudeErr) {
      console.warn("[instagram-leads] AI clean failed:", claudeErr.message);
    }

    const handleMap   = new Map(leads.map(l => [l.handle?.toLowerCase(), l]));
    const mergedLeads = (result.leads || leads).map(l => {
      const orig    = handleMap.get(l.handle?.toLowerCase()) || {};
      const handle  = l.handle || orig.handle;
      const trusted = contactMap.get(handle?.toLowerCase()) || {};
      return {
        ...orig, ...l, handle,
        email:           trusted.email           ?? orig.email           ?? "",
        phone:           trusted.phone           ?? orig.phone           ?? "",
        whatsapp_number: trusted.whatsapp_number ?? orig.whatsapp_number ?? "",
        whatsapp_group:  trusted.whatsapp_group  ?? orig.whatsapp_group  ?? "",
        telegram:        trusted.telegram        ?? orig.telegram        ?? "",
        profileUrl:      l.profileUrl || orig.profileUrl || (handle ? `https://www.instagram.com/${handle}/` : ""),
      };
    });

    // Quality gate - must have at least one actionable contact method
    // bioSnippet-only leads are useless to marketers - they can't be contacted
    const qualifiedLeads = mergedLeads.filter(l =>
      (l.email           && l.email           !== "") ||
      (l.phone           && l.phone           !== "") ||
      (l.whatsapp_number && l.whatsapp_number !== "") ||
      (l.whatsapp_group  && l.whatsapp_group  !== "") ||
      (l.telegram        && l.telegram        !== "") ||
      (l.website         && l.website.startsWith("http"))
    );

    // Add opportunity tags
    const taggedLeads = qualifiedLeads.map(l => ({
      ...l,
      opportunity_tag: getOpportunityTag(l),
    }));

    const businessLeads = taggedLeads.filter(isBusinessLead);
    // "limited": profileUrl counts — Instagram contacts are rarely in bio, enrichment handles them
    const finalLeads = applyQualityGate(businessLeads.length > 0 ? businessLeads : taggedLeads, "limited");

    if (finalLeads.length === 0) {
      return Response.json({
        success: false, leads: [],
        error: (minF || maxF)
          ? `No leads found in follower range ${minF?.toLocaleString() || "0"} – ${maxF?.toLocaleString() || "∞"}. Try a wider range or remove the filter.`
          : isInternational
            ? `No verified Instagram ${niche} leads found for ${locationStr}. Try a broader niche or different location.`
            : "Leads found but none had contact info. Try a broader niche.",
      });
    }

    // AI insights
    let ai_insight = "";
    try {
      const insightRes = await anthropic.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 350,
        system:     `You are an Instagram lead analyst. Give a sharp 2-3 line insight: name the top 2-3 most valuable accounts and exactly why (follower count, contact completeness, niche match, opportunity tag). Then write one DM outreach message (under 60 words, casual, mention their niche). Return ONLY valid JSON: {"insight":"...","dm_message":"..."}`,
        messages: [{
          role:    "user",
          content: `Niche: "${niche}", Type: ${isInfluencer ? "Influencer" : "Business"}, Location: ${usedLocation}\nLeads:\n${JSON.stringify(finalLeads.slice(0, 6).map(l => ({ name: l.name, handle: l.handle, followers: l.followers, email: l.email, phone: l.phone, whatsapp_number: l.whatsapp_number, opportunity_tag: l.opportunity_tag })), null, 2)}`,
        }],
      });
      const ib = insightRes.content.find(b => b.type === "text");
      const ip = JSON.parse((ib?.text || "{}").replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"").trim());
      ai_insight = ip.insight || "";
    } catch {}

    const { granted: igGranted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, finalLeads.length);
    // Fail closed: quota/wallet exhausted between check and increment (or quota DB unavailable)
    if (igGranted === 0 && finalLeads.length > 0) {
      return Response.json({ quotaExceeded: true, needsTopup: true }, { status: 402 });
    }
    const igLeads = finalLeads.slice(0, igGranted);
    await saveLeadHistory(userId, { type: "instagram", niche, location: usedLocation, leadCount: igLeads.length, leads: igLeads.slice(0, 50) });
    return Response.json({
      success:        true,
      leads:          igLeads,
      ai_insight,
      queryLabel:     result.queryLabel || `${niche} - ${usedLocation}`,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
    });

  } catch (err) {
    console.error("[instagram-leads] error:", err);
    return Response.json({ error: err.message || "Error generating Instagram leads" }, { status: 500 });
  }
}
