import { getAIClient } from "@/lib/aiClient";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { scraperFetch, extractEmails, extractPhones, applyQualityGate, ddgSearch } from "@/lib/scraperUtils";
import { verifyUser } from "@/lib/authUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";
const SCRAPER_KEY = null;
const FIRECRAWL = null;

export const maxDuration = 90;

const anthropic   = getAIClient();

/* ── FREE: DuckDuckGo search fallback (maps to local {source,title,body,url}) ─ */
async function jinaSearchExim(query, num = 10) {
  const results = await ddgSearch(query, num);
  return results.map(r => {
    let source = "";
    try { source = new URL(r.link).hostname; } catch {}
    return { source, title: r.title, body: r.snippet, url: r.link };
  });
}

/* ── helpers ─────────────────────────────────────────────────────────────── */
const DFS_LOC_EXIM = {
  in:2356,us:2840,gb:2826,au:2036,ca:2124,ae:2784,sg:2702,de:2276,fr:2250,
  nl:2528,it:2380,es:2724,br:2076,mx:2484,jp:2392,kr:2410,za:2710,sa:2682,
};

async function serperSearch(query, gl = "in", num = 10) {
  // Primary: DataForSEO
  const dfsLogin = process.env.DATAFORSEO_LOGIN;
  const dfsPass  = process.env.DATAFORSEO_PASSWORD;
  if (dfsLogin && dfsPass) {
    try {
      const auth = Buffer.from(`${dfsLogin}:${dfsPass}`).toString("base64");
      const res  = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/regular", {
        method:  "POST",
        headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify([{ keyword: query, location_code: DFS_LOC_EXIM[gl] || 2840, language_code: "en", device: "desktop", depth: num }]),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data  = await res.json();
        const items = (data.tasks?.[0]?.result?.[0]?.items || []).filter(i => i.type === "organic").slice(0, num);
        if (items.length > 0) return items.map(i => ({
          source: (() => { try { return new URL(i.url).hostname; } catch { return i.url; } })(),
          title: i.title || "", body: i.description || "", url: i.url,
        }));
      }
    } catch {}
  }
  return jinaSearchExim(query, num);
}

async function bingSearch(query) {
  if (!SCRAPER_KEY) return [];
  try {
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10`;
    const apiUrl  = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(bingUrl)}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(18000) });
    if (!res.ok) return [];
    const html  = await res.text();
    const items = [];
    const seen  = new Set();
    for (const m of html.matchAll(/<h2[^>]*>\s*<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      const url   = m[1];
      if (seen.has(url) || /bing\.com|microsoft\.com/.test(url)) continue;
      seen.add(url);
      const titleRaw = m[2].replace(/<[^>]+>/g, "").trim();
      let hostname = "";
      try { hostname = new URL(url).hostname; } catch { hostname = ""; }
      items.push({ source: hostname, title: titleRaw, body: "", url });
      if (items.length >= 10) break;
    }
    return items;
  } catch { return []; }
}

async function firecrawlScrape(pageUrl) {
  if (FIRECRAWL) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method:  "POST",
        headers: { Authorization: `Bearer ${FIRECRAWL}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ url: pageUrl, formats: ["markdown"], onlyMainContent: true }),
        signal:  AbortSignal.timeout(18000),
      });
      const d = await res.json();
      if (d.success) return (d.data?.markdown || "").slice(0, 8000);
    } catch {}
  }
  // FREE fallback: Jina AI Reader
  try {
    const res = await fetch(`https://r.jina.ai/${pageUrl}`, {
      headers: { Accept: "text/plain", "X-Return-Format": "markdown" },
      signal:  AbortSignal.timeout(18000),
    });
    return res.ok ? (await res.text()).slice(0, 8000) : "";
  } catch { return ""; }
}

/* ── Firestore dedup key ─────────────────────────────────────────────────── */
function dedupKey(userId, product, tradeType) {
  return `${userId}_${product.toLowerCase().replace(/\s+/g, "_").slice(0, 40)}_${tradeType}`;
}

/* ── Main handler ─────────────────────────────────────────────────────────── */
export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { product, tradeType, state, city, hsCode, specialInstructions } = await request.json();
    if (!product?.trim()) return Response.json({ error: "Product required" }, { status: 400 });

    // Quota enforcement — same policy as intl-export-import-leads
    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return Response.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    const location    = city ? `${city}${state ? ", " + state : ""}` : (state || "India");
    const typeKeyword = tradeType === "exporter" ? "exporter" : tradeType === "importer" ? "importer" : "exporter importer";
    const gl          = /india$/i.test(location) || location.toLowerCase() === "india" ? "in" : "in";

    /* ── 1. Load seen names from Firestore ─────────────────────────────── */
    let seenNames   = [];
    let seenDocRef  = null;
    if (userId) {
      try {
        const db   = getAdminDb();
        seenDocRef = db.collection("eximSeenLeads").doc(dedupKey(userId, product, tradeType));
        const snap = await seenDocRef.get();
        if (snap.exists) seenNames = snap.data().names || [];
      } catch { /* non-critical */ }
    }

    /* ── 2. Parallel Serper search 8 targeted queries ──────────────── */
    const prodSlug = product.toLowerCase().replace(/\s+/g, "+");

    const [
      r1, r2, r3, r4, r5, r6, r7, r8, r9, r10,
      importYetiMd, zaubaExportMd, zaubaImportMd,
    ] = await Promise.all([
      serperSearch(`${product} ${typeKeyword} ${location} contact phone email`, gl, 10),
      serperSearch(`${product} ${typeKeyword} ${state || "India"} IEC DGFT registered`, gl, 10),
      serperSearch(`"${product}" ${typeKeyword} ${location} site:indiamart.com OR site:tradeindia.com`, gl, 10),
      serperSearch(`${product} manufacturer supplier ${location} export import India`, gl, 10),
      serperSearch(`${product} ${hsCode || ""} ${typeKeyword} ${location} wholesale bulk`.trim(), gl, 10),
      serperSearch(`${product} ${typeKeyword} India ${state || ""} shipment customs zauba volza`.trim(), gl, 10),
      serperSearch(`${product} ${typeKeyword} India "+91" phone number "contact us"`, gl, 10),
      serperSearch(`${product} ${typeKeyword} ${location} email enquiry "@" supplier`, gl, 10),
      // Extra: company directory searches with phone visible in snippet
      serperSearch(`${product} ${typeKeyword} India company "91" mobile contact site:exportersindia.com OR site:dir.indiamart.com`, gl, 10),
      serperSearch(`${product} ${state || "India"} ${typeKeyword} "GST" company address phone`, gl, 10),

      // Direct trade data page scrapes
      firecrawlScrape(`https://www.importyeti.com/search?search=${prodSlug}`),
      firecrawlScrape(`https://zauba.com/export-${prodSlug}-india.htm`),
      firecrawlScrape(`https://zauba.com/import-${prodSlug}-india.htm`),
    ]);

    /* ── 2b. ScraperAPI fetch top IndiaMart/TradeIndia pages ─────────── */
    let allItems = [...r1, ...r2, ...r3, ...r4, ...r5, ...r6, ...r7, ...r8, ...r9, ...r10];

    // Bing fallback when Serper returns nothing
    if (allItems.length === 0 && SCRAPER_KEY) {
      console.log("[export-import] Serper empty trying Bing fallback");
      const [b1, b2, b3] = await Promise.all([
        bingSearch(`${product} ${typeKeyword} ${location} contact phone email India`),
        bingSearch(`${product} exporter importer India company indiamart tradeindia`),
        bingSearch(`${product} supplier manufacturer ${location} wholesale bulk contact`),
      ]);
      allItems = [...b1, ...b2, ...b3];
    }

    const indiamartUrls = allItems
      .filter(i => /indiamart\.com|tradeindia\.com/.test(i.url))
      .slice(0, 5)
      .map(i => i.url);

    const indiamartPages = indiamartUrls.length
      ? await Promise.all(indiamartUrls.map(u => scraperFetch(u, false, 10000)))
      : [];

    const indiamartPhones = [...new Set(indiamartPages.flatMap(html => extractPhones(html)))].slice(0, 30);
    const indiamartEmails = [...new Set(indiamartPages.flatMap(html => extractEmails(html)))].slice(0, 20);

    const indiamartBlock = (indiamartPhones.length || indiamartEmails.length)
      ? `\n\n[INDIAMART/TRADEINDIA Full contact numbers extracted]\n📞 ${indiamartPhones.join(" | ")}\n📧 ${indiamartEmails.join(" | ")}`
      : "";

    /* ── 3. Build unified content block ──────────────────────────────── */
    const seenUrls    = new Set();
    const uniqueItems = allItems.filter(i => {
      if (!i.url || seenUrls.has(i.url)) return false;
      seenUrls.add(i.url);
      return true;
    });

    const googleBlock = uniqueItems.slice(0, 25).map(i =>
      `[GOOGLE | ${i.source}]\nTitle: ${i.title}\nSnippet: ${i.body}\nURL: ${i.url}`
    ).join("\n---\n");

    const importYetiBlock = importYetiMd
      ? `\n\n[IMPORTYETI US Customs Bill of Lading for Indian exporters]\n${importYetiMd}`
      : "";

    const zaubaBlock = [zaubaExportMd, zaubaImportMd].filter(Boolean).join("\n")
      ? `\n\n[ZAUBA India Customs Shipment Records]\n${[zaubaExportMd, zaubaImportMd].filter(Boolean).join("\n\n")}`
      : "";

    const fullContent = googleBlock + importYetiBlock + zaubaBlock + indiamartBlock;

    if (!fullContent.trim()) {
      return Response.json({
        success: false,
        leads:   [],
        error:   `No live data found for "${product}" in ${location}. Try a broader keyword or different location, or try again later.`,
      });
    }

    /* ── 4. Exclusion + contact hints ────────────────────────────────── */
    const exclusion = seenNames.length > 0
      ? `\n\n⚠️ CRITICAL These companies were ALREADY shown. DO NOT include ANY of them:\n${seenNames.slice(-300).join(" | ")}`
      : "";

    const allSnippets = allItems.map(i => `${i.title} ${i.body}`).join(" ");
    const prePhones = [...new Set((allSnippets.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\+\d{1,3}[\s-]?\d{6,14}/g) || []))].slice(0, 20);
    const preEmails    = [...new Set((allSnippets.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []))].slice(0, 20);
    const preWhatsApp  = [...new Set((allSnippets.match(/wa\.me\/(\+?[0-9]{7,15})/g) || []).map(m => m.replace("wa.me/","+")))].slice(0, 10);
    const contactHint  = (prePhones.length || preEmails.length)
      ? `\n\n📞 Phones: ${prePhones.join(" | ")}\n📧 Emails: ${preEmails.join(" | ")}${preWhatsApp.length ? `\n💬 WhatsApp: ${preWhatsApp.join(" | ")}` : ""}`
      : "";

    /* ── 5. Thinksuite extraction ────────────────────────────────────────── */
    const msg = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 7000,
      system: `You are an India export-import B2B lead extraction specialist with deep knowledge of ITC-HS codes, Indian trade ports, and customs data. Extract verified trade leads from multi-source data. NEVER fabricate contact info. Return ONLY a valid JSON array.${specialInstructions ? `\n\nSPECIAL USER INSTRUCTIONS (follow strictly): ${specialInstructions}` : ""}`,
      messages: [{
        role:    "user",
        content: `Extract 20 unique Indian ${typeKeyword} company leads for: "${product}". Prioritize companies in ${location}, but include other Indian companies if local results are insufficient - mark their actual city/state.
${exclusion}

Data from Google, ImportYeti (US Customs), Zauba (India Customs), IndiaMart, TradeIndia:
${fullContent}
${contactHint}

Return raw JSON array only (no markdown, start with [):
[
  {
    "company_name": "exact company/trade name from data",
    "contact_person": "owner / director / export manager name if found else N/A",
    "phone": "complete phone number from data (8+ digits, no masked numbers) else N/A",
    "email": "email from data else N/A",
    "whatsapp": "WhatsApp number if wa.me link found else N/A",
    "city": "city",
    "state": "Indian state",
    "product": "specific product description",
    "hs_code": "most accurate 8-digit ITC-HS code for this product",
    "type": "exporter or importer or both",
    "annual_turnover": "estimated annual export/import turnover from shipment data e.g. '₹5 Crore/year' or '$2.4M exports/year' else N/A",
    "company_size": "employee count or size indicator if found else N/A",
    "certifications": "comma-separated: APEDA, FSSAI, ISO 9001, IEC, BIS, MSME etc. from data else N/A",
    "iec_number": "IEC registration number if found else N/A",
    "shipment_volume": "e.g. '48 shipments to USA/year', '200 MT/month' if in customs data else N/A",
    "target_countries": "countries they export to or import from (from customs data) else N/A",
    "top_port": "Gujarat→Kandla/JNPT, Maharashtra→Nhava Sheva/JNPT, TamilNadu→Chennai, AP→Visakhapatnam, Karnataka→Mangalore, WestBengal→Kolkata, Delhi→ICD Tughlakabad else N/A",
    "website": "URL if found else N/A",
    "about_us": "1-2 lines: what they trade, since when, key markets, certifications",
    "source": "importyeti.com / zauba.com / indiamart.com etc",
    "verified": true if phone or email present,
    "past_history": "shipment counts, buyer/supplier countries from customs data else N/A",
    "lead_score": "10=phone+email+shipment data, 7-9=partial contact+trade info, 4-6=company info only, 1-3=name only"
  }
]

Rules: only real Indian companies from actual data, no duplicates, NEVER fabricate contacts or turnover figures.`
      }],
    });

    const raw   = msg.content.find(b => b.type === "text")?.text?.trim() || "[]";
    const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    let leads   = [];
    try {
      const parsed = JSON.parse(clean);
      leads = Array.isArray(parsed) ? parsed : (parsed.leads || []);
    } catch { leads = []; }

    // ANTI-HALLUCINATION: phone/email must exist in actual scraped data
    const allSourceText = fullContent + " " + indiamartBlock;
    leads = leads.map(l => {
      const phone = (l.phone && l.phone !== "N/A")
        ? (allSourceText.replace(/[\s\-().]/g, "").includes(l.phone.replace(/[\s\-().]/g, "").slice(-8)) ? l.phone : "N/A")
        : "N/A";
      const email = (l.email && l.email !== "N/A")
        ? (allSourceText.toLowerCase().includes(l.email.toLowerCase()) ? l.email : "N/A")
        : "N/A";
      // Normalize type to exactly "exporter" | "importer" | "both"
      const rawType = (l.type || "").toLowerCase();
      const type = rawType.includes("export") && rawType.includes("import") ? "both"
        : rawType.includes("export") ? "exporter"
        : rawType.includes("import") ? "importer"
        : "both";
      return { ...l, phone, email, type, verified: phone !== "N/A" || email !== "N/A" };
    });

    const JUNK_NAMES = new Set(["n/a", "na", "null", "unknown", "company", "n\\a"]);
    leads = applyQualityGate(
      leads.filter(l => {
        const n = (l.company_name || "").trim();
        return n.length > 2 && !JUNK_NAMES.has(n.toLowerCase());
      }),
      "info_only"
    );

    if (leads.length === 0) {
      return Response.json({
        success: false,
        leads:   [],
        error:   `No verified companies found for "${product}" in ${location}. Try a broader keyword (e.g. "Pharma" instead of "Pharmaceuticals") or select a different state.`,
      });
    }

    const { granted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, leads.length);
    // Fail closed: quota/wallet exhausted between check and increment (or quota DB unavailable)
    if (granted === 0 && leads.length > 0) {
      return Response.json({ quotaExceeded: true, needsTopup: true }, { status: 402 });
    }
    leads = leads.slice(0, granted);

    /* ── 6. Save seen names to Firestore ─────────────────────────────── */
    if (userId && seenDocRef && leads.length > 0) {
      try {
        const newNames     = leads.map(l => l.company_name).filter(Boolean);
        const updatedNames = [...new Set([...seenNames, ...newNames])].slice(-500);
        await seenDocRef.set({ names: updatedNames, updatedAt: Date.now(), product, tradeType });
      } catch { /* non-critical */ }
    }

    await saveLeadHistory(userId, {
      type: "exim",
      niche: `${product} ${typeKeyword}`,
      location,
      leadCount: leads.length,
      leads: leads.slice(0, 50).map(l => ({
        name:    l.company_name || "",
        phone:   l.phone || "",
        email:   l.email || "",
        website: l.website || l.url || "",
        address: l.address || "",
        type:    l.type || tradeType || "",
        source:  "exim",
      })),
    });

    return Response.json({
      success:       true,
      leads,
      total_leads:   leads.length,
      total_seen:    seenNames.length + leads.length,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
      sources_used:  ["Google (Serper)", "ImportYeti (US Customs)", "Zauba (India Customs)", "IndiaMart", "TradeIndia"],
      query_summary: `${product} ${typeKeyword} in ${location}`,
    });
  } catch (err) {
    console.error("[export-import-leads]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
