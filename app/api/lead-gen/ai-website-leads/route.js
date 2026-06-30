import { getAIClient } from "@/lib/aiClient";
import { applyQualityGate, extractEmails, extractPhones, extractEmailFromHtml, extractPhoneFromHtml, extractWhatsAppNumber, getGl, ddgSearch, scraperFetch } from "@/lib/scraperUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";

export const maxDuration = 90;

const anthropic = getAIClient();

/* ── WhatsApp number extraction ─────────────────────────────────────────── */

/* ── Social media link extraction ───────────────────────────────────────── */
const SKIP_IG  = new Set(["p","reel","explore","accounts","stories","reels","tags"]);
const SKIP_LI  = new Set(["feed","jobs","company","school","groups","events","mynetwork","notifications","in"]);
const SKIP_FB  = new Set(["pages","groups","events","marketplace","watch","profile.php"]);

function extractSocialLinks(text = "") {
  const links = { instagram: "", linkedin: "", facebook: "" };

  const ig = text.match(/instagram\.com\/([a-zA-Z0-9_.]{2,40})\/?/);
  if (ig && !SKIP_IG.has(ig[1].toLowerCase())) links.instagram = `https://instagram.com/${ig[1]}`;

  const li = text.match(/linkedin\.com\/(in|company)\/([a-zA-Z0-9_-]{2,80})\/?/);
  if (li && !SKIP_LI.has(li[2].toLowerCase())) links.linkedin = `https://linkedin.com/${li[1]}/${li[2]}`;

  const fb = text.match(/facebook\.com\/([a-zA-Z0-9_.]{2,60})\/?/);
  if (fb && !SKIP_FB.has(fb[1].toLowerCase()) && fb[1] !== "sharer") links.facebook = `https://facebook.com/${fb[1]}`;

  return links;
}

/* ── FREE: DuckDuckGo search fallback (maps to local {url,markdown} format) ─ */
async function jinaSearchLocal(query, num = 10) {
  const results = await ddgSearch(query, num);
  return results.map(r => ({ url: r.link, markdown: `${r.title}\n${r.snippet}` }));
}

/* ── Serper search ───────────────────────────────────────────────────────── */
const DFS_LOC_AW = {
  in:2356,us:2840,gb:2826,au:2036,ca:2124,ae:2784,sg:2702,de:2276,fr:2250,
  nl:2528,it:2380,es:2724,br:2076,mx:2484,jp:2392,kr:2410,za:2710,sa:2682,
};

async function serperSearch(query, gl = "in", num = 10) {
  const dfsLogin = process.env.DATAFORSEO_LOGIN;
  const dfsPass  = process.env.DATAFORSEO_PASSWORD;
  console.log(`[wl] search source: ${dfsLogin ? "DataForSEO" : "DDG"} | query: ${query.slice(0, 60)}`);
  if (dfsLogin && dfsPass) {
    try {
      const auth = Buffer.from(`${dfsLogin}:${dfsPass}`).toString("base64");
      const res  = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/regular", {
        method:  "POST",
        headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify([{ keyword: query, location_code: DFS_LOC_AW[gl] || 2840, language_code: "en", device: "desktop", depth: num }]),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data  = await res.json();
        const items = (data.tasks?.[0]?.result?.[0]?.items || []).filter(i => i.type === "organic").slice(0, num);
        if (items.length > 0) return items.map(i => ({ url: i.url, markdown: `${i.title}\n${i.description || ""}` }));
        console.log(`[wl] DataForSEO returned 0 items, falling back to DDG`);
      }
    } catch (e) { console.log(`[wl] DataForSEO error: ${e.message}, falling back to DDG`); }
  }
  return jinaSearchLocal(query, num);
}

/* ── Scrape a company website — DataForSEO On-Page (JS-rendered) → Jina fallback ── */
async function enrichCompanyWebsite(url) {
  if (!url?.startsWith("http")) return null;
  const content = (await scraperFetch(url, true, 20000)) || "";
  if (!content) return null;

  // HTML-aware extractors find tel:/mailto: links first (most reliable), then regex fallback
  const emailHtml = extractEmailFromHtml(content);
  const phoneHtml = extractPhoneFromHtml(content);
  const emails = [...new Set([emailHtml, ...extractEmails(content)].filter(Boolean))];
  const phones = [...new Set([phoneHtml, ...extractPhones(content)].filter(Boolean))];
  const wa     = extractWhatsAppNumber(content);
  const social = extractSocialLinks(content);
  return { emails, phones, whatsapp: wa, social, content };
}

/* ── Directory domain list ───────────────────────────────────────────────── */
const DIRECTORY_DOMAINS = new Set([
  "justdial","indiamart","sulekha","yellowpages","tradeindia","exportersindia",
  "alibaba","amazon","flipkart","snapdeal","meesho","olx","quikr","practo",
  "zomato","swiggy","magicbricks","99acres","commonfloor","makaan","housing",
  "nestaway","naukri","linkedin","facebook","instagram","twitter","youtube",
  "glassdoor","bing","google","wikipedia","yelp","clutch","g2","trustpilot",
  "foursquare","tripadvisor","askme","grotal","clickindia","tradeford",
]);

function isDirectoryUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return DIRECTORY_DOMAINS.has(host.split(".")[0]);
  } catch { return false; }
}

/* ════════════════════════════════════════════════════════════════════════════
   POST handler
═══════════════════════════════════════════════════════════════════════════ */
export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const {
      query, previousLeadNames = [], count = 20,
      isInternational = false, country = "India", specialInstructions = "",
    } = await request.json();

    const leadCount = Math.min(Math.max(Number(count) || 20, 5), 30);

    if (!query?.trim()) return Response.json({ error: "Query required" }, { status: 400 });

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return Response.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    /* ── Build search queries ─────────────────────────────────────────────── */
    const gl           = isInternational ? getGl(country) : "in";
    const locationHint = isInternational ? ` ${country}` : " India";

    const seenUrls   = new Set();
    const allResults = [];
    const addResults = (items) => {
      for (const r of items) {
        if (r.markdown?.trim() && !seenUrls.has(r.url)) { seenUrls.add(r.url); allResults.push(r); }
      }
    };

    // DataForSEO → DDG fallback (4 parallel queries)
    const [s1, s2, s3, s4] = await Promise.all([
      serperSearch(`"${query}"${locationHint} contact phone email`, gl, 10),
      serperSearch(`${query}${locationHint} directory list`, gl, 10),
      serperSearch(`${query}${locationHint} official website`, gl, 10),
      serperSearch(`${query}${locationHint} company owner contact`, gl, 10),
    ]);
    addResults([...s1, ...s2, ...s3, ...s4]);

    if (allResults.length === 0) {
      return Response.json({ success: false, leads: [], error: `No results found for "${query}". Try a more specific search.` });
    }

    /* ── Pre-extract verified contacts from ALL source text ──────────────── */
    const combinedContent  = allResults.slice(0, 20)
      .map(r => `\n\n--- Source: ${r.url} ---\n${(r.markdown || "").slice(0, 5000)}`)
      .join("");
    const allSourceText   = combinedContent;
    const verifiedPhones  = [...new Set(extractPhones(allSourceText))].slice(0, 40);
    const verifiedEmails  = [...new Set(extractEmails(allSourceText))].slice(0, 40);
    const verifiedWA      = extractWhatsAppNumber(allSourceText);

    const contactHintBlock = (verifiedPhones.length || verifiedEmails.length)
      ? `\n\n⚠️ VERIFIED CONTACTS (regex-extracted - ONLY use these, never invent):\n📞 Phones: ${verifiedPhones.join(" | ") || "none"}\n📧 Emails: ${verifiedEmails.join(" | ") || "none"}\n💬 WhatsApp: ${verifiedWA || "none"}\nDo NOT put any phone/email/whatsapp not in the above lists.`
      : `\n\n⚠️ No phones or emails found in scraped content. Set phone, email, whatsapp to empty string "" for all leads.`;

    const prevExclusion = previousLeadNames.length > 0
      ? `\nThese leads already shown - SKIP: ${previousLeadNames.slice(0, 80).join(", ")}`
      : "";

    /* ── AI extraction ───────────────────────────────────────────────────── */
    const locationCtx = isInternational ? `Country: ${country}` : "Country: India";
    const systemPrompt = `You are a B2B lead extraction specialist. Extract ONLY businesses that EXACTLY match the user's niche query - no loosely related businesses.
${locationCtx}

HARD RULES - never break:
1. EXACT NICHE MATCH: if user searched "${query}", only include businesses directly in that niche. Discard unrelated businesses even if they appear in the content.
2. name is MANDATORY - skip lead if business name not clearly found in content.
3. phone: ONLY from verified Phones list - never invent. Empty string if not found.
4. email: ONLY from verified Emails list - never invent. Empty string if not found.
5. whatsapp: ONLY from verified WhatsApp value - never invent. Empty string if not found.
6. INCLUDE lead even if phone, email, website are all missing - as long as name and location are found. Contacts will be enriched separately.
7. website: company's OWN domain ONLY - never a directory URL (justdial/indiamart/yelp/clutch/linkedin/facebook).
8. owner_name: extract proprietor/owner/director/founder name if found, else empty string.
9. social_links.instagram / social_links.linkedin / social_links.facebook: extract from content if found, else empty string.
10. description: MUST mention specific services/products. FORBIDDEN: "leading company", "best service provider", "trusted name", "quality services", "wide range", "years of experience".${specialInstructions ? `\n11. SPECIAL INSTRUCTIONS: ${specialInstructions}` : ""}
Return ONLY valid JSON, no markdown.`;

    const extractMsg = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 5000,
      system:     systemPrompt,
      messages: [{
        role:    "user",
        content: `Niche query: "${query}"
${prevExclusion}
${contactHintBlock}

Scraped content:
${combinedContent.slice(0, 26000)}

Extract up to ${leadCount} leads that EXACTLY match "${query}". DO NOT fabricate.
Return:
{
  "leads": [
    {
      "name": "Business name (mandatory)",
      "owner_name": "owner/proprietor/founder name or empty string",
      "phone": "from verified Phones list only, else empty string",
      "email": "from verified Emails list only, else empty string",
      "whatsapp": "from verified WhatsApp only, else empty string",
      "category": "exact business type matching the niche",
      "location": "city/area",
      "address": "full address or empty string",
      "website": "company own domain only, else empty string",
      "social_links": {
        "instagram": "instagram.com/handle or empty string",
        "linkedin": "linkedin.com/company/name or empty string",
        "facebook": "facebook.com/page or empty string"
      },
      "description": "1-2 lines - specific services/products only, no generic phrases",
      "source": "source domain"
    }
  ],
  "queryLabel": "3-4 word label"
}
Return ONLY the JSON.`,
      }],
    });

    const raw      = extractMsg.content[0]?.text?.trim() || "{}";
    const jsStart  = raw.indexOf("{");
    const jsEnd    = raw.lastIndexOf("}");
    let jsonStr    = jsStart !== -1 && jsEnd !== -1 ? raw.slice(jsStart, jsEnd + 1) : raw;
    jsonStr        = jsonStr.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
    let result     = {};
    try { result = JSON.parse(jsonStr); } catch (e) { console.log(`[wl] JSON parse failed: ${e.message} | raw[:200]: ${raw.slice(0, 200)}`); result = { leads: [] }; }

    /* ── Dedup ───────────────────────────────────────────────────────────── */
    const seenNames = new Set(previousLeadNames.map(n => n.toLowerCase()));
    let deduped = (result.leads || []).filter(l => {
      const key = (l.name || "").toLowerCase().trim();
      if (!key || seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    });

    /* ── Anti-hallucination: validate phone/email against source ─────────── */
    const normalizedSource = allSourceText.replace(/[\s\-().]/g, "");
    deduped = deduped.map(l => {
      const phone = (l.phone && l.phone !== "")
        ? (normalizedSource.includes(l.phone.replace(/[\s\-().]/g, "").slice(-8)) ? l.phone : "")
        : "";
      const email = (l.email && l.email !== "")
        ? (allSourceText.toLowerCase().includes(l.email.toLowerCase()) ? l.email : "")
        : "";
      const whatsapp = (l.whatsapp && l.whatsapp !== "")
        ? (normalizedSource.includes(l.whatsapp.replace(/[\s\-().+]/g, "").slice(-8)) ? l.whatsapp : "")
        : "";

      // Website fallback from source URL
      let website = l.website || "";
      if (!website && l.source) {
        const srcLower  = (l.source || "").toLowerCase().replace(/^www\./, "");
        const sourceUrl = allResults.find(r => {
          try { return new URL(r.url).hostname.replace(/^www\./, "").startsWith(srcLower.split(".")[0]); }
          catch { return false; }
        })?.url || "";
        if (sourceUrl && !isDirectoryUrl(sourceUrl)) website = sourceUrl;
      }

      return { ...l, phone, email, whatsapp, website, social_links: l.social_links || { instagram: "", linkedin: "", facebook: "" } };
    });

    /* ── Firecrawl enrich top 6 leads that have a website ────────────────── */
    const toEnrich = deduped.filter(l => l.website && !isDirectoryUrl(l.website)).slice(0, 6);
    if (toEnrich.length > 0) {
      const enriched = await Promise.allSettled(toEnrich.map(l => enrichCompanyWebsite(l.website)));
      enriched.forEach((res, i) => {
        if (res.status !== "fulfilled" || !res.value) return;
        const idx  = deduped.indexOf(toEnrich[i]);
        if (idx === -1) return;
        const data = res.value;
        const lead = deduped[idx];
        if (!lead.email    && data.emails[0])   deduped[idx] = { ...deduped[idx], email:    data.emails[0] };
        if (!lead.phone    && data.phones[0])   deduped[idx] = { ...deduped[idx], phone:    data.phones[0] };
        if (!lead.whatsapp && data.whatsapp)     deduped[idx] = { ...deduped[idx], whatsapp: data.whatsapp };
        const sl = deduped[idx].social_links || {};
        if (!sl.instagram && data.social.instagram) deduped[idx].social_links = { ...sl, instagram: data.social.instagram };
        if (!sl.linkedin  && data.social.linkedin)  deduped[idx].social_links = { ...deduped[idx].social_links, linkedin: data.social.linkedin };
        if (!sl.facebook  && data.social.facebook)  deduped[idx].social_links = { ...deduped[idx].social_links, facebook: data.social.facebook };
      });
    }

    /* ── Secondary website lookup for leads missing website ──────────────── */
    const needsWebsite = deduped.filter(l => !l.website && l.name).slice(0, 10);
    if (needsWebsite.length > 0) {
      const webResults = await Promise.allSettled(
        needsWebsite.map(l => serperSearch(`"${l.name}"${l.location ? " " + l.location : locationHint} official website`, gl, 3))
      );
      webResults.forEach((res, k) => {
        if (res.status !== "fulfilled") return;
        const idx = deduped.indexOf(needsWebsite[k]);
        if (idx === -1) return;
        for (const item of res.value) {
          if (item.url && !isDirectoryUrl(item.url) && !/linkedin|instagram|facebook|twitter|youtube|x\.com/i.test(item.url)) {
            try { if (new URL(item.url).hostname.includes(".")) { deduped[idx] = { ...deduped[idx], website: item.url }; break; } }
            catch {}
          }
        }
      });
    }

    /* ── Quality gate ────────────────────────────────────────────────────── */
    // Use "info_only" so partial results (name only) still surface rather than
    // returning nothing - the AI insight below flags contact completeness.
    const finalLeads = applyQualityGate(deduped, "info_only");

    if (finalLeads.length === 0) {
      return Response.json({
        success: false, leads: [],
        error:   "No leads could be extracted for this query. Try a different niche or add a specific city.",
      });
    }

    /* ── AI insights ─────────────────────────────────────────────────────── */
    let ai_insight = "";
    try {
      const insightRes = await anthropic.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system:     `You are a B2B sales analyst. Give a sharp 2-3 line insight about these leads - name the top 2-3 most valuable ones and exactly why (contact completeness, business type, location). Then write one WhatsApp outreach message (under 80 words, conversational, mention their business name and niche). Return ONLY valid JSON: {"insight":"...","whatsapp_message":"..."}`,
        messages: [{
          role:    "user",
          content: `Niche: "${query}"${isInternational ? `, Country: ${country}` : ", India"}\nLeads:\n${JSON.stringify(finalLeads.slice(0, 8).map(l => ({ name: l.name, phone: l.phone, email: l.email, whatsapp: l.whatsapp, category: l.category, location: l.location })), null, 2)}`,
        }],
      });
      const iBlock = insightRes.content.find(b => b.type === "text");
      const iParsed = JSON.parse((iBlock?.text || "{}").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim());
      ai_insight = iParsed.insight || "";
    } catch {}

    /* ── Save & return ───────────────────────────────────────────────────── */
    const { granted: wsGranted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, finalLeads.length);
    const returnLeads = finalLeads.slice(0, wsGranted);
    await saveLeadHistory(userId, { type: "website-leads", niche: query, location: country, leadCount: returnLeads.length, leads: returnLeads.slice(0, 50) });

    return Response.json({
      success:         true,
      leads:           returnLeads,
      ai_insight,
      queryLabel:      result.queryLabel || query,
      sourcesSearched: allResults.length,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
    });

  } catch (err) {
    console.error("[ai-website-leads] error:", err);
    return Response.json({ error: err.message || "Error generating leads." }, { status: 500 });
  }
}
