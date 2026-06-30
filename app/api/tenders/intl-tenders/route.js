import { getAIClient } from "@/lib/aiClient";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { serperSearch } from "@/lib/scraperUtils";

export const maxDuration = 90;

const anthropic = getAIClient();

/* ── Fuzzy sector matching ───────────────────────────────────────────── */
function sectorMatches(dbSector, filterSector) {
  if (!filterSector || filterSector === "all") return true;
  if (!dbSector) return false;
  const db  = dbSector.toLowerCase().replace(/[/,\-_]/g, " ");
  const fil = filterSector.toLowerCase().replace(/[/,\-_]/g, " ");
  if (db.includes(fil) || fil.includes(db)) return true;
  const words = fil.split(/\s+/).filter(w => w.length > 2);
  return words.some(w => db.includes(w));
}

/* ── Country → Official Tender Portal ───────────────────────────────────
   Each entry: { portal, url, site, gl, notes }
   `site` = the domain to pass to Serper site: query
────────────────────────────────────────────────────────────────────────── */
const COUNTRY_PORTAL_MAP = {
  "United States":    { portal:"SAM.gov",              url:"https://sam.gov/opportunities/",           site:"sam.gov",                          gl:"us", notes:"Official US Federal Procurement Portal" },
  "United Kingdom":   { portal:"Find a Tender (FTS)",  url:"https://www.find-tender.service.gov.uk/",  site:"find-tender.service.gov.uk",        gl:"gb", notes:"Post-Brexit UK Procurement Portal" },
  "European Union":   { portal:"TED (EU TED)",          url:"https://ted.europa.eu/",                   site:"ted.europa.eu",                     gl:"de", notes:"EU Tenders Electronic Daily" },
  "Australia":        { portal:"AusTender",             url:"https://www.tenders.gov.au/",              site:"tenders.gov.au",                    gl:"au", notes:"Official Australian Government Procurement" },
  "Singapore":        { portal:"GeBIZ",                 url:"https://www.gebiz.gov.sg/",                site:"gebiz.gov.sg",                      gl:"sg", notes:"Singapore Government Electronic Business" },
  "UAE":              { portal:"Tejari / Beehive",      url:"https://www.tejari.com/",                  site:"tejari.com",                        gl:"ae", notes:"UAE Government Procurement" },
  "Canada":           { portal:"CanadaBuys",            url:"https://canadabuys.canada.ca/",            site:"canadabuys.canada.ca",              gl:"ca", notes:"Government of Canada Procurement" },
  "Germany":          { portal:"DTVP / TED",            url:"https://www.dtvp.de/",                     site:"dtvp.de",                           gl:"de", notes:"German Procurement + EU TED" },
  "France":           { portal:"BOAMP / TED",           url:"https://www.boamp.fr/",                    site:"boamp.fr",                          gl:"fr", notes:"French Official Procurement Journal" },
  "Japan":            { portal:"JETRO / GEPS",          url:"https://www.geps.go.jp/",                  site:"geps.go.jp",                        gl:"jp", notes:"Japan Government e-Procurement" },
  "South Africa":     { portal:"eTenders SA",           url:"https://www.etenders.gov.za/",             site:"etenders.gov.za",                   gl:"za", notes:"South African National Treasury eTenders" },
  "Nigeria":          { portal:"BPP / NIPPA",           url:"https://www.bpp.gov.ng/",                  site:"bpp.gov.ng",                        gl:"ng", notes:"Bureau of Public Procurement Nigeria" },
  "Kenya":            { portal:"PPRA Kenya",            url:"https://tenders.go.ke/",                   site:"tenders.go.ke",                     gl:"ke", notes:"Public Procurement Regulatory Authority Kenya" },
  "World Bank":       { portal:"World Bank ECOS",       url:"https://projects.worldbank.org/",          site:"projects.worldbank.org",            gl:"us", notes:"World Bank Procurement Notices" },
  "United Nations":   { portal:"UNGM",                  url:"https://www.ungm.org/",                    site:"ungm.org",                          gl:"us", notes:"UN Global Marketplace" },
  "Asia-Pacific":     { portal:"ADB",                   url:"https://www.adb.org/projects/tenders/all", site:"adb.org",                           gl:"us", notes:"Asian Development Bank Tenders" },
  "Pakistan":         { portal:"PPRA Pakistan",         url:"https://www.ppra.org.pk/",                 site:"ppra.org.pk",                       gl:"pk", notes:"Pakistan Public Procurement Regulatory Authority" },
  "Bangladesh":       { portal:"CPTU",                  url:"https://cptu.gov.bd/",                     site:"cptu.gov.bd",                       gl:"bd", notes:"Central Procurement Technical Unit Bangladesh" },
  "Malaysia":         { portal:"MyProcurement",         url:"https://www.eperolehan.com.my/",           site:"eperolehan.com.my",                 gl:"my", notes:"Malaysia Government eProcurement" },
  "Philippines":      { portal:"PhilGEPS",              url:"https://www.philgeps.gov.ph/",             site:"philgeps.gov.ph",                   gl:"ph", notes:"Philippine Government Electronic Procurement System" },
  "Saudi Arabia":     { portal:"Etimad / MONAFASAT",    url:"https://www.etimad.sa/",                   site:"etimad.sa",                         gl:"sa", notes:"Saudi Arabia Government Procurement" },
  "Egypt":            { portal:"GGPIS Egypt",           url:"https://www.ggpis.finance.gov.eg/",        site:"ggpis.finance.gov.eg",              gl:"eg", notes:"Egypt Tender Portal" },
  "Tanzania":         { portal:"PPRA Tanzania",         url:"https://www.ppra.go.tz/",                  site:"ppra.go.tz",                        gl:"tz", notes:"PPRA Tanzania Procurement" },
  "Ghana":            { portal:"PPA Ghana",             url:"https://ppaghana.org/",                    site:"ppaghana.org",                      gl:"gh", notes:"Public Procurement Authority Ghana" },
  "Ethiopia":         { portal:"FPPA Ethiopia",         url:"https://www.fppa.gov.et/",                 site:"fppa.gov.et",                       gl:"et", notes:"Federal Public Procurement Agency Ethiopia" },
  "Uganda":           { portal:"PPDA Uganda",           url:"https://gpp.ppda.go.ug/",                  site:"gpp.ppda.go.ug",                    gl:"ug", notes:"PPDA Uganda Government Procurement" },
  "Nepal":            { portal:"PPMO Nepal",            url:"https://ppmo.gov.np/",                     site:"ppmo.gov.np",                       gl:"np", notes:"Public Procurement Monitoring Office Nepal" },
  "Sri Lanka":        { portal:"ICTAD Sri Lanka",       url:"https://www.ictad.gov.lk/",                site:"ictad.gov.lk",                      gl:"lk", notes:"Sri Lanka Procurement" },
  "Vietnam":          { portal:"Vietnam Procurement",   url:"https://muasamcong.mpi.gov.vn/",           site:"muasamcong.mpi.gov.vn",             gl:"vn", notes:"Vietnam National Procurement Portal" },
  "Indonesia":        { portal:"LPSE / INAPROC",        url:"https://inaproc.id/",                      site:"inaproc.id",                        gl:"id", notes:"Indonesia National Procurement Portal" },
  "Thailand":         { portal:"GPP Thailand",          url:"https://www.gprocurement.go.th/",          site:"gprocurement.go.th",                gl:"th", notes:"Thailand Government Procurement" },
  "Brazil":           { portal:"ComprasNet",            url:"https://www.comprasnet.gov.br/",           site:"comprasnet.gov.br",                 gl:"br", notes:"Brazil Federal Procurement Portal" },
  "Mexico":           { portal:"CompraNet Mexico",      url:"https://compranet.hacienda.gob.mx/",       site:"compranet.hacienda.gob.mx",         gl:"mx", notes:"Mexico Government Procurement" },
  "Rwanda":           { portal:"RPPA Rwanda",           url:"https://rppa.gov.rw/",                     site:"rppa.gov.rw",                       gl:"rw", notes:"Rwanda Public Procurement Authority" },
  "Zambia":           { portal:"ZPPA Zambia",           url:"https://www.zppa.org.zm/",                 site:"zppa.org.zm",                       gl:"zm", notes:"Zambia Public Procurement Authority" },
  "Cambodia":         { portal:"PRDB Cambodia",         url:"https://www.mef.gov.kh/",                  site:"mef.gov.kh",                        gl:"kh", notes:"Cambodia Public Procurement" },
  "Mozambique":       { portal:"UFSA Mozambique",       url:"https://www.ufsa.gov.mz/",                 site:"ufsa.gov.mz",                       gl:"mz", notes:"Mozambique Public Procurement" },
  "Qatar":            { portal:"MBAASHER Qatar",        url:"https://www.mbaasher.com.qa/",             site:"mbaasher.com.qa",                   gl:"qa", notes:"Qatar Government Procurement" },
  "Kuwait":           { portal:"MPW Kuwait",            url:"https://www.mpw.gov.kw/",                  site:"mpw.gov.kw",                        gl:"kw", notes:"Kuwait Ministry of Public Works Tenders" },
  "South Korea":      { portal:"KONEPS",                url:"https://www.g2b.go.kr/",                   site:"g2b.go.kr",                         gl:"kr", notes:"Korea On-line E-Procurement System" },
};

/* ── Fetch tenders from country-specific portal via DataForSEO → DDG ── */
async function fetchFromCountryPortal(country, keywords, sector) {
  const portal = COUNTRY_PORTAL_MAP[country];
  if (!portal) return [];

  const kw = keywords || sector || "tender procurement";
  const queries = [
    `site:${portal.site} ${kw} tender`,
    `site:${portal.site} ${kw} contract opportunity`,
    `"${country}" ${kw} government tender procurement 2025`,
  ];

  const allResults = await Promise.allSettled(
    queries.map(q => serperSearch(q, portal.gl, 10))
  );

  const items = [];
  const seenLinks = new Set();
  for (const r of allResults) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (!seenLinks.has(item.link) && item.title) {
        seenLinks.add(item.link);
        items.push(item);
      }
    }
  }

  if (items.length === 0) return [];

  /* Ask AI to extract structured tender data from search snippets */
  try {
    const snippetText = items.slice(0, 20)
      .map(i => `Title: ${i.title}\nSnippet: ${i.snippet}\nURL: ${i.link}`)
      .join("\n---\n");

    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      system:     "Extract government tender information from search results. Return ONLY valid JSON array. Never invent data not in the snippets.",
      messages: [{
        role:    "user",
        content: `Extract tenders from these ${portal.portal} search results for ${country}.

${snippetText}

Return JSON array (max 15):
[{
  "title": "tender title from search result",
  "organization": "issuing organization/ministry if mentioned",
  "country": "${country}",
  "sector": "sector/category from title",
  "status": "open",
  "deadline": "deadline date if mentioned in snippet else ''",
  "value": "contract value if mentioned else ''",
  "source_portal": "${portal.portal}",
  "direct_link": "the URL from results",
  "portal_registration_link": "${portal.url}",
  "description": "1-2 line description from snippet",
  "days_remaining": null,
  "data_source": "live_portal"
}]

Only include entries that look like real tender/procurement opportunities. Return [] if none found.`,
      }],
    });

    const raw = res.content[0]?.text?.trim() || "[]";
    const s = raw.indexOf("["), e = raw.lastIndexOf("]");
    if (s === -1) return [];
    const parsed = JSON.parse(raw.slice(s, e + 1));
    return Array.isArray(parsed) ? parsed.filter(t => t.title && t.title.length > 5) : [];
  } catch { return []; }
}

/* ── AI enrichment ───────────────────────────────────────────────────── */
async function enrichWithThinksuite(tender) {
  try {
    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system:     "International tender analyst for Indian firms. Return ONLY valid JSON, no markdown.",
      messages: [{
        role:    "user",
        content: `Analyse this tender and return a JSON with ALL original fields PLUS:
- ai_summary_english: 2-3 line plain English summary
- ai_summary_hinglish: 2-3 line plain English summary (concise, simplified)
- who_can_apply: eligibility in simple words (1-2 lines)
- who_cannot_apply: who cannot apply (1 line)
- bid_tips: 2 specific winning tips as a single string
- risk_level: Low / Medium / High
- win_probability: e.g. "45% - moderate competition"
- difficulty_level: Easy / Medium / Hard
- strategy_advice: Should apply? Yes/Maybe/No + 1-line reason
- required_documents_list: comma-separated 5-8 key documents needed
- application_steps: 5 numbered steps to apply (JSON array of strings). Step 1 MUST be "Open this exact link: [insert the direct_link value from the tender data below if it starts with http, otherwise insert the portal_registration_link value]. Do NOT write 'search yourself' - always write the actual URL." Step 2: "Register/login as a vendor on the portal." Step 3: "Download the RFP/tender documents and read all requirements." Step 4: "Prepare technical proposal + financial bid + all required documents." Step 5: "Submit your bid online before the deadline shown above."
- compliance_note: key international compliance for Indian firms (UN vendor reg, ISO, bid bond %)
- indian_firms_eligible: Yes / No / Check portal

The direct_link for this tender is: ${tender.direct_link || "N/A"}
The portal_registration_link is: ${tender.portal_registration_link || "N/A"}

Tender data: ${JSON.stringify(tender)}`,
      }],
    });

    const raw   = res.content[0]?.text?.trim() || "";
    const start = raw.indexOf("{");
    const end   = raw.lastIndexOf("}");
    if (start === -1 || end === -1) return tender;
    return { ...tender, ...JSON.parse(raw.slice(start, end + 1)) };
  } catch {
    return tender;
  }
}

async function enrichAll(tenders, concurrency = 5) {
  const results = [];
  for (let i = 0; i < tenders.length; i += concurrency) {
    const batch = await Promise.all(
      tenders.slice(i, i + concurrency).map(t => enrichWithThinksuite(t))
    );
    results.push(...batch);
  }
  return results;
}

/* ── Semantic keyword expansion ─────────────────────────────────────── */
async function expandKeywords(query) {
  try {
    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system:     "Expand a user's business/product description into related search keywords for international government tender matching. Return ONLY a JSON array of lowercase strings.",
      messages: [{
        role:    "user",
        content: `Expand to 12-18 related terms/synonyms for tender keyword search.
User input: "${query}"
Include: product names, synonyms, abbreviations, related items, generic terms.
Example: "solar lights" → ["solar","led","luminaire","street light","photovoltaic","solar lamp","outdoor lighting","renewable","solar lantern","solar panel"]
Return ONLY a JSON array, no explanation.`,
      }],
    });
    const raw = res.content[0]?.text?.trim() || "[]";
    const s = raw.indexOf("["), e = raw.lastIndexOf("]");
    if (s === -1) return [];
    return JSON.parse(raw.slice(s, e + 1)).map(k => String(k).toLowerCase());
  } catch { return []; }
}

/* ── AI semantic filter ──────────────────────────────────────────────── */
async function aiFilterTenders(tenders, query) {
  if (!query || !query.trim()) return tenders;
  try {
    const res = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system:     "International tender matching AI. Match by MEANING and SEMANTIC SIMILARITY. Return ONLY a JSON array of indices.",
      messages: [{
        role:    "user",
        content: `User's business/requirement: "${query}"

Match tenders SEMANTICALLY - if user says "solar lights", also match LED Luminaire, Street Lighting, Solar Lamp, Photovoltaic, etc.
Match by INTENT: what product/service does this user provide? Include any tender they could fulfil.
INCLUDE if: same product family, related supply, similar work.
EXCLUDE only if: completely unrelated sector.

Return a JSON array of indices (0-based), most relevant first. Be INCLUSIVE.

Tenders:
${tenders.map((t, i) => `${i}: ${t.title} | ${t.sector || ""} | ${t.state_city || ""}`).join("\n")}`,
      }],
    });
    const raw = res.content[0]?.text?.trim() || "";
    const s = raw.indexOf("["), e = raw.lastIndexOf("]");
    if (s === -1) return tenders;
    const indices = JSON.parse(raw.slice(s, e + 1));
    if (!Array.isArray(indices) || indices.length === 0) return tenders;
    return indices.map(i => tenders[i]).filter(Boolean);
  } catch { return tenders; }
}

function triggerCountrySpecificScrape(country) {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXTAUTH_URL || "http://localhost:3000");
    fetch(`${base}/api/cron/scrape-tenders?type=intl&country=${encodeURIComponent(country)}`, {
      headers: { "x-cron-secret": process.env.CRON_SECRET || "dev-secret" },
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  } catch {}
}

export async function POST(request) {
  try {
    const {
      sector          = "all",
      country         = "",
      stateProvince   = "",
      funding         = "all",
      keywords        = "",
      tenderType      = "all",
      quantity        = 15,
      status_filter   = "all",
      indianFirmsOnly = false,
      customQuery     = "",
    } = await request.json();

    const db = getAdminDb();
    const countryPortalInfo = country ? COUNTRY_PORTAL_MAP[country] || null : null;
    const userQuery = customQuery || keywords;

    /* ── Step 1: Parallel fetch - Firestore + Country Portal ────────────── */
    const [snap, livePortalTenders] = await Promise.all([
      db.collection("tenders_international")
        .where("status", "in", ["open", "closing_soon", "closing_today", "upcoming"])
        .limit(500)
        .get(),
      country
        ? fetchFromCountryPortal(country, userQuery || keywords, sector !== "all" ? sector : "")
        : Promise.resolve([]),
    ]);

    const today = new Date(); today.setHours(0, 0, 0, 0);

    let tenders = snap.docs.map(d => {
      const data = d.data();
      if (data.deadline_timestamp) {
        const dl = data.deadline_timestamp.toDate ? data.deadline_timestamp.toDate() : new Date(data.deadline_timestamp);
        const diff = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
        data.days_remaining = diff;
        if (diff < 0)       data.status = "expired";
        else if (diff === 0) data.status = "closing_today";
        else if (diff <= 7)  data.status = "closing_soon";
        else if (diff <= 30) data.status = "open";
        else                 data.status = "upcoming";
      }
      return data;
    });

    tenders = tenders.filter(t => t.status !== "expired");

    tenders.sort((a, b) => {
      const da  = typeof a.days_remaining === "number" ? a.days_remaining : 9999;
      const db2 = typeof b.days_remaining === "number" ? b.days_remaining : 9999;
      if (da >= 0 && db2 >= 0) return da - db2;
      if (da >= 0) return -1;
      if (db2 >= 0) return 1;
      return 0;
    });

    /* ── Step 2: Merge live portal results - put them FIRST ─────────────── */
    if (livePortalTenders.length > 0) {
      const firestoreLinks = new Set(tenders.map(t => t.direct_link).filter(Boolean));
      const freshOnes = livePortalTenders.filter(t => !firestoreLinks.has(t.direct_link));
      tenders = [...freshOnes, ...tenders];
    }

    /* ── Step 3: Hard filters ────────────────────────────────────────────── */
    if (country) {
      const filtered = tenders.filter(t =>
        t.country?.toLowerCase().includes(country.toLowerCase()) ||
        t.state_city?.toLowerCase().includes(country.toLowerCase()) ||
        t.source_portal?.toLowerCase().includes(country.toLowerCase().replace(/\s+/g, "")) ||
        t.data_source === "live_portal"
      );
      if (filtered.length < 3) triggerCountrySpecificScrape(country);
      if (filtered.length > 0) tenders = filtered;
    }
    if (stateProvince) {
      const filtered = tenders.filter(t =>
        t.state_city?.toLowerCase().includes(stateProvince.toLowerCase())
      );
      if (filtered.length > 0) tenders = filtered;
    }
    if (status_filter !== "all") {
      tenders = tenders.filter(t => t.status === status_filter);
    }
    if (funding && funding !== "all") {
      const filtered = tenders.filter(t =>
        t.organization?.toLowerCase().includes(funding.toLowerCase()) ||
        t.source_portal?.toLowerCase().includes(funding.toLowerCase())
      );
      if (filtered.length > 0) tenders = filtered;
    }
    if (sector && sector !== "all" && sector !== "others") {
      const filtered = tenders.filter(t => sectorMatches(t.sector, sector));
      if (filtered.length > 0) tenders = filtered;
    }
    if (tenderType && tenderType !== "all") {
      const filtered = tenders.filter(t => sectorMatches(t.sector, tenderType));
      if (filtered.length > 0) tenders = filtered;
    }

    /* ── Step 4: Semantic keyword expansion + fuzzy pre-filter ──────────── */
    if (userQuery && userQuery.trim()) {
      const expandedKws = await expandKeywords(userQuery);
      const allKws = [
        ...(keywords ? keywords.toLowerCase().split(/\s+/) : []),
        ...expandedKws,
      ].filter(k => k.length > 2);

      if (allKws.length > 0) {
        const semanticMatched = tenders.filter(t => {
          const storedKws = Array.isArray(t.search_keywords) ? t.search_keywords.join(" ") : "";
          const hay = [t.title, t.description, t.sector, t.organization, storedKws]
            .filter(Boolean).join(" ").toLowerCase();
          return allKws.some(kw => hay.includes(kw));
        });
        if (semanticMatched.length > 0) tenders = semanticMatched;
      }
    }

    /* ── Step 5: AI semantic filter ─────────────────────────────────────── */
    if (userQuery && userQuery.trim()) {
      const aiFiltered = await aiFilterTenders(tenders.slice(0, 150), userQuery);
      tenders = aiFiltered.length > 0 ? aiFiltered : tenders;
    }

    tenders = tenders.slice(0, quantity);

    if (tenders.length === 0) {
      return Response.json({
        success: false,
        error:   "No international tenders found. Try changing your filters.",
        tenders: [],
        total:   0,
      });
    }

    /* ── Step 6: AI enrichment - top 3 only to stay under 60s ──────────── */
    const toEnrich = tenders.slice(0, 3);
    const noEnrich = tenders.slice(3);
    const enriched = [...(await enrichAll(toEnrich, 3)), ...noEnrich];

    const finalTenders = indianFirmsOnly
      ? enriched.filter(t => t.indian_firms_eligible !== "No")
      : enriched;

    /* ── Step 7: Summary stats ───────────────────────────────────────────── */
    const urgentCount   = finalTenders.filter(t => t.status === "closing_soon" || t.status === "closing_today").length;
    const upcomingCount = finalTenders.filter(t => t.status === "upcoming").length;
    const liveCount     = finalTenders.filter(t => t.data_source === "live_portal").length;
    const bestForIndia  = finalTenders
      .filter(t => t.indian_firms_eligible === "Yes")
      .slice(0, 3)
      .map(t => t.title);
    const highestValue  = finalTenders.reduce((best, t) => {
      const v  = parseFloat((t.value || "0").replace(/[^0-9.]/g, "")) || 0;
      const bv = parseFloat((best?.value || "0").replace(/[^0-9.]/g, "")) || 0;
      return v > bv ? t : best;
    }, null);
    const lastUpdated = finalTenders.reduce((newest, t) => {
      const ts = t.scraped_at?.toDate?.() || t.scraped_at;
      return ts && (!newest || ts > newest) ? ts : newest;
    }, null);

    return Response.json({
      success:        true,
      tenders:        finalTenders,
      total:          finalTenders.length,
      urgent_count:   urgentCount,
      upcoming_count: upcomingCount,
      live_count:     liveCount,
      best_for_india: bestForIndia,
      highest_value:  highestValue ? { title: highestValue.title, value: highestValue.value } : null,
      last_updated:   lastUpdated,
      country_portal: countryPortalInfo ? { name: countryPortalInfo.portal, url: countryPortalInfo.url, notes: countryPortalInfo.notes } : null,
      powered_by:     "Live Portal Scraping + Firebase + Thinksuite",
      data_freshness: liveCount > 0 ? "Live from official portal" : "Updated every 2 hours",
    });

  } catch (err) {
    console.error("[intl-tenders]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
