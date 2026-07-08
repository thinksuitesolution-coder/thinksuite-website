import { getAIClient } from "@/lib/aiClient";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { scraperFetch, extractEmails, extractPhones, applyQualityGate } from "@/lib/scraperUtils";
import { verifyUser } from "@/lib/authUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
const SCRAPER_KEY = null;
const FIRECRAWL = null;

export const maxDuration = 90;

const anthropic   = getAIClient();
const GOOGLE_KEY  = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CX   = process.env.GOOGLE_SEARCH_CX;



async function ddgSearchIntl(query, num = 10) {
  try {
    const body = new URLSearchParams({ q: query, b: "", kl: "us-en" });
    const res  = await fetch("https://html.duckduckgo.com/html/", {
      method: "POST",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Content-Type": "application/x-www-form-urlencoded", "Accept": "text/html", "Referer": "https://duckduckgo.com/" },
      body: body.toString(), signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const html  = await res.text();
    const snips = [...html.matchAll(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)].map(m => m[1].replace(/<[^>]+>/g,"").trim());
    const links = [...html.matchAll(/<h2[^>]*class="result__title"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    return links.slice(0, num).map((m, i) => {
      let url = m[1]; try { const u = new URL(m[1],"https://duckduckgo.com"); url = u.searchParams.get("uddg") ? decodeURIComponent(u.searchParams.get("uddg")) : m[1]; } catch {}
      let source = ""; try { source = new URL(url).hostname; } catch {}
      return { source, title: m[2].replace(/<[^>]+>/g,"").trim(), body: snips[i]||"", url };
    });
  } catch { return []; }
}

async function googleSearch(query) {
  if (GOOGLE_KEY && GOOGLE_CX) {
    try {
      const url  = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&num=10`;
      const data = await fetch(url, { signal: AbortSignal.timeout(10000) }).then(r => r.json());
      if (!data.error) return (data.items || []).map(i => ({ source: i.displayLink||i.link, title: i.title||"", body: i.snippet||"", url: i.link }));
    } catch {}
  }
  return ddgSearchIntl(query);
}

async function bingSearch(query) {
  if (SCRAPER_KEY) {
    try {
      const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10`;
      const apiUrl  = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(bingUrl)}`;
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(18000) });
      if (res.ok) {
        const html = await res.text();
        const items = [], seen = new Set();
        for (const m of html.matchAll(/<h2[^>]*>\s*<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
          const url = m[1];
          if (seen.has(url) || /bing\.com|microsoft\.com/.test(url)) continue;
          seen.add(url);
          let hostname = ""; try { hostname = new URL(url).hostname; } catch {}
          items.push({ source: hostname, title: m[2].replace(/<[^>]+>/g,"").trim(), body:"", url });
          if (items.length >= 10) break;
        }
        if (items.length) return items;
      }
    } catch {}
  }
  return ddgSearchIntl(query);
}

async function firecrawlScrape(pageUrl) {
  if (FIRECRAWL) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST", headers: { Authorization: `Bearer ${FIRECRAWL}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: pageUrl, formats: ["markdown"], onlyMainContent: true }),
        signal: AbortSignal.timeout(18000),
      });
      const d = await res.json();
      if (d.success) return (d.data?.markdown || "").slice(0, 8000);
    } catch {}
  }
  try {
    const headers = { Accept: "text/plain", "X-Return-Format": "markdown" };
    const k = process.env.JINA_API_KEY; if (k) headers["Authorization"] = `Bearer ${k}`;
    const res = await fetch(`https://r.jina.ai/${pageUrl}`, { headers, signal: AbortSignal.timeout(18000) });
    return res.ok ? (await res.text()).slice(0, 8000) : "";
  } catch { return ""; }
}

function dedupKey(userId, product, tradeType, country) {
  return `intl_${userId}_${product.toLowerCase().replace(/\s+/g, "_").slice(0, 35)}_${tradeType}_${country.toLowerCase().replace(/\s+/g, "_").slice(0, 20)}`;
}

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { product, tradeType, country, city, hsCode, specialInstructions } = await request.json();
    if (!product?.trim()) return Response.json({ error: "Product required" }, { status: 400 });
    if (!country?.trim()) return Response.json({ error: "Country required" }, { status: 400 });

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return Response.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    const location    = city ? `${city}, ${country}` : country;
    const typeKeyword = tradeType === "exporter" ? "exporter" : tradeType === "importer" ? "importer" : "exporter importer";
    const prodSlug    = product.toLowerCase().replace(/\s+/g, "+");
    const countrySlug = country.toLowerCase().replace(/\s+/g, "-");

    /* ── 1. Load seen names from Firestore ──────────────────────────────── */
    let seenNames  = [];
    let seenDocRef = null;
    if (userId) {
      try {
        const db   = getAdminDb();
        seenDocRef = db.collection("eximSeenLeads").doc(dedupKey(userId, product, tradeType, country));
        const snap = await seenDocRef.get();
        if (snap.exists) seenNames = snap.data().names || [];
      } catch { /* non-critical */ }
    }

    /* ── 2. Parallel fetch from global trade sources ────────────────────── */

    // ImportYeti  US Customs Bill of Lading (companies that trade with USA)
    const importYetiUrl = `https://www.importyeti.com/search?search=${prodSlug}`;

    // Volza  global trade data (public search)
    const volzaUrl = `https://www.volza.com/p/${prodSlug}/export/export-from-${countrySlug}/`;

    const [
      googleR1, googleR2, googleR3, googleR4, googleR5, googleR6, googleR7, googleR8,
      importYetiMd, volzaMd,
    ] = await Promise.all([
      googleSearch(`${product} ${typeKeyword} ${location} contact phone email`),
      googleSearch(`${product} ${typeKeyword} ${country} company manufacturer supplier`),
      googleSearch(`"${product}" ${typeKeyword} ${location} site:linkedin.com OR site:alibaba.com`),
      googleSearch(`${product} ${typeKeyword} ${country} wholesale bulk trade directory`),
      googleSearch(`${product} ${hsCode || ""} ${typeKeyword} ${country} export import shipment`),
      googleSearch(`${product} ${typeKeyword} ${country} customs data trade company verified`),
      // 2 extra contact-targeted searches
      googleSearch(`${product} ${typeKeyword} ${country} phone number "contact us" email`),
      googleSearch(`${product} supplier ${country} email enquiry "@" contact office`),
      firecrawlScrape(importYetiUrl),
      firecrawlScrape(volzaUrl),
    ]);

    /* ── 2b. ScraperAPI  fetch top Alibaba/TradeIndia pages for full contact info ── */
    const tradeUrls = [...googleR1, ...googleR2, ...googleR3, ...googleR4, ...googleR5, ...googleR6, ...googleR7, ...googleR8]
      .filter(i => /alibaba\.com|tradeindia\.com|globalsources\.com|made-in-china\.com/.test(i.url))
      .slice(0, 5)
      .map(i => i.url);

    const tradePages = tradeUrls.length
      ? await Promise.all(tradeUrls.map(u => scraperFetch(u, false, 10000)))
      : [];

    const tradePhones = [...new Set(tradePages.flatMap(html => extractPhones(html)))].slice(0, 30);
    const tradeEmails = [...new Set(tradePages.flatMap(html => extractEmails(html)))].slice(0, 20);

    const tradeBlock = (tradePhones.length || tradeEmails.length)
      ? `\n\n[ALIBABA/TRADE DIRECTORIES  Full contact numbers extracted]\n📞 ${tradePhones.join(" | ")}\n📧 ${tradeEmails.join(" | ")}`
      : "";

    /* ── 3. Build unified content block ─────────────────────────────────── */
    let googleItems = [...googleR1, ...googleR2, ...googleR3, ...googleR4, ...googleR5, ...googleR6, ...googleR7, ...googleR8];

    // Bing fallback when Google CSE returns nothing (quota exhausted or no results)
    if (googleItems.length === 0 && SCRAPER_KEY) {
      console.log("[intl-export-import] Google CSE empty  trying Bing fallback");
      const [b1, b2, b3] = await Promise.all([
        bingSearch(`${product} ${typeKeyword} ${location} contact phone email`),
        bingSearch(`${product} ${typeKeyword} ${country} company manufacturer supplier alibaba`),
        bingSearch(`${product} supplier ${country} contact wholesale bulk trade directory`),
      ]);
      googleItems = [...b1, ...b2, ...b3];
    }

    const seenUrls    = new Set();
    const uniqueGoogle = googleItems.filter(i => {
      if (!i.url || seenUrls.has(i.url)) return false;
      seenUrls.add(i.url);
      return true;
    });

    const googleBlock = uniqueGoogle.slice(0, 25).map(i =>
      `[GOOGLE | ${i.source}]\nTitle: ${i.title}\nSnippet: ${i.body}\nURL: ${i.url}`
    ).join("\n---\n");

    const importYetiBlock = importYetiMd
      ? `\n\n[IMPORTYETI  US Customs Bill of Lading]\n${importYetiMd}`
      : "";

    const volzaBlock = volzaMd
      ? `\n\n[VOLZA  Global Trade Data for ${country}]\n${volzaMd}`
      : "";

    const fullContent = googleBlock + importYetiBlock + volzaBlock + tradeBlock;

    if (!fullContent.trim()) {
      return Response.json({ success: false, leads: [], error: "No live data found. Try changing the product or country, or try again later." }, { status: 422 });
    }

    /* ── 4. Exclusion list ───────────────────────────────────────────────── */
    const exclusion = seenNames.length > 0
      ? `\n\n⚠️ CRITICAL  These companies were ALREADY shown to this user. DO NOT include ANY of them:\n${seenNames.slice(-300).join(" | ")}`
      : "";

    /* ── 4b. Pre-extract phone/email from snippets ───────────────────────── */
    const allSnippets = googleItems.map(i => `${i.title} ${i.body}`).join(" ");
    const prePhones = [...new Set((allSnippets.match(/\+?\d[\d\s\-().]{7,16}\d/g) || []))].slice(0, 20);
    const preEmails = [...new Set((allSnippets.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []))].slice(0, 20);
    const preWhatsApp = [...new Set((allSnippets.match(/wa\.me\/(\+?[0-9]{7,15})/g) || []).map(m => m.replace("wa.me/","+")))].slice(0, 10);
    const contactHint = (prePhones.length || preEmails.length)
      ? `\n\n📞 Phones: ${prePhones.join(" | ")}\n📧 Emails: ${preEmails.join(" | ")}${preWhatsApp.length ? `\n💬 WhatsApp: ${preWhatsApp.join(" | ")}` : ""}`
      : "";

    /* ── 5. Thinksuite extraction ────────────────────────────────────────────── */
    const msg = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 7000,
      system: `You are a global B2B trade lead extraction specialist. Extract verified international trade leads from multi-source data. NEVER fabricate contact info. Return ONLY a valid JSON array.${specialInstructions ? `\n\nSPECIAL USER INSTRUCTIONS (follow strictly): ${specialInstructions}` : ""}`,
      messages: [{
        role:    "user",
        content: `Extract 20 unique ${typeKeyword} company leads for: "${product}" in ${location}.
${exclusion}

Data from ImportYeti (US Customs), Volza (Global Trade), LinkedIn, Alibaba, trade directories:
${fullContent}
${contactHint}

Return raw JSON array only (no markdown, start with [):
[
  {
    "company_name": "exact company/trade name from data",
    "contact_person": "owner / director / export manager name if found else N/A",
    "phone": "complete phone number from data (7+ digits, international format) else N/A",
    "email": "email from data else N/A",
    "whatsapp": "WhatsApp number if wa.me link found else N/A",
    "city": "${city || "city if found"}",
    "region": "state/province/region",
    "country": "${country}",
    "product": "specific product description",
    "hs_code": "6-digit international HS code for this product",
    "type": "exporter or importer or both",
    "annual_turnover": "estimated annual trade value from shipment data e.g. '$2.4M/year' or '€500K/year' else N/A",
    "company_size": "employee count or company size if mentioned else N/A",
    "certifications": "ISO, CE, FDA, SGS, BRC, HALAL etc. from data else N/A",
    "shipment_volume": "'48 shipments to USA/year' or '200 MT/month' if in customs data else N/A",
    "target_countries": "countries they export to/import from (from customs data) else N/A",
    "top_port": "UAE→Jebel Ali, USA→Los Angeles/New York/Houston, UK→Felixstowe, Germany→Hamburg, China→Shanghai/Shenzhen, Australia→Sydney/Melbourne, Singapore→Port of Singapore, else N/A",
    "website": "URL if found else N/A",
    "about_us": "1-2 lines: what they trade, key markets, certifications, size",
    "source": "importyeti.com / volza.com / alibaba.com / linkedin.com etc",
    "verified": true if phone or email present,
    "past_history": "shipment counts, buyer/supplier countries from customs data else N/A",
    "lead_score": "10=phone+email+shipment data, 7-9=partial contact+trade info, 4-6=company info only, 1-3=name only"
  }
]

Rules: only real companies from ${country}, no duplicates, NEVER fabricate contacts or turnover figures.`,
      }],
    });

    const raw   = msg.content.find(b => b.type === "text")?.text?.trim() || "[]";
    const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    let leads   = [];
    try {
      const parsed = JSON.parse(clean);
      leads = Array.isArray(parsed) ? parsed : (parsed.leads || []);
    } catch { leads = []; }

    // ANTI-HALLUCINATION: phone/email must exist in actual scraped source data
    const allSourceText = fullContent + " " + tradeBlock;
    leads = leads.map(l => {
      const phone = (l.phone && l.phone !== "N/A")
        ? (allSourceText.replace(/[\s\-().]/g, "").includes(l.phone.replace(/[\s\-().]/g, "").slice(-8)) ? l.phone : "N/A")
        : "N/A";
      const email = (l.email && l.email !== "N/A")
        ? (allSourceText.toLowerCase().includes(l.email.toLowerCase()) ? l.email : "N/A")
        : "N/A";
      const rawType = (l.type || "").toLowerCase();
      const type = rawType.includes("export") && rawType.includes("import") ? "both"
        : rawType.includes("export") ? "exporter"
        : rawType.includes("import") ? "importer"
        : "both";
      return { ...l, phone, email, type, verified: phone !== "N/A" || email !== "N/A" };
    });

    // Keep any lead with a real company name exporter leads rarely have profileUrl so "limited" gate kills them
    leads = applyQualityGate(
      leads.filter(l => l.company_name && l.company_name !== "N/A"),
      "info_only"
    );

    const { granted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, leads.length || 1);
    // Fail closed: quota/wallet exhausted between check and increment (or quota DB unavailable)
    if (granted === 0 && leads.length > 0) {
      return Response.json({ quotaExceeded: true, needsTopup: true }, { status: 402 });
    }
    leads = leads.slice(0, Math.max(granted, 0));

    /* ── 6. Save seen names to Firestore ─────────────────────────────────── */
    if (userId && seenDocRef && leads.length > 0) {
      try {
        const newNames     = leads.map(l => l.company_name).filter(Boolean);
        const updatedNames = [...new Set([...seenNames, ...newNames])].slice(-500);
        await seenDocRef.set({ names: updatedNames, updatedAt: Date.now(), product, tradeType, country });
      } catch { /* non-critical */ }
    }

    await saveLeadHistory(userId, { type: "intl-exim", niche: product, location, leadCount: leads.length, leads: leads.slice(0, 50) });

    return Response.json({
      success:       true,
      leads,
      total_leads:   leads.length,
      total_seen:    seenNames.length + leads.length,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
      sources_used:  ["ImportYeti (US Customs)", "Volza (Global Trade)", "LinkedIn", "Alibaba", "Google Trade Search"],
      query_summary: `${product} ${typeKeyword} in ${location}`,
    });
  } catch (err) {
    console.error("[intl-export-import-leads]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
