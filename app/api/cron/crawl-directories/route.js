/**
 * India Business Directory Crawler
 *
 * Crawls:
 *   - Indiamart  — supplier listings with phone, product, location
 *   - JustDial   — local business listings with phone, rating, address
 *   - Sulekha    — service providers with phone, city, category
 *   - IndiaBiz   — SME directory with email, website
 *
 * These are DIFFERENT from MCA data:
 *   MCA data   = legally registered companies (formal sector)
 *   Directory  = active businesses that market themselves (higher purchase intent)
 *
 * The intersection is gold: company that is BOTH MCA registered AND on Indiamart
 * = verified, active, B2B business that is looking for customers right now.
 *
 * GET /api/cron/crawl-directories
 */

import { NextResponse }           from "next/server";
import { getAdminDb }             from "@/lib/firebaseAdmin";
import { fetchPage, crawlPaginated, extractContacts, stripHtml } from "@/lib/crawler";
import { serperSearch }           from "@/lib/scraperUtils";

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

// ── Category × City rotation ──────────────────────────────────────────────────
const CATEGORIES = [
  "software company", "digital marketing agency", "export company",
  "manufacturing company", "consulting firm", "healthcare company",
  "logistics company", "pharma company", "food processing", "textile company",
  "real estate", "education company", "ecommerce company", "fintech",
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Ahmedabad", "Surat", "Jaipur", "Kolkata",
  "Lucknow", "Indore", "Bhopal", "Chandigarh", "Kochi",
];

// ── Indiamart Parser ──────────────────────────────────────────────────────────
function parseIndiamartContent(content) {
  const leads = [];
  // Indiamart markdown from Jina has structured supplier blocks
  const blocks = content.split(/\n#{2,3}\s+/);

  for (const block of blocks) {
    if (block.length < 50) continue;

    const nameM  = block.match(/^([A-Z][A-Za-z0-9\s&.,'-]{5,80})/);
    const name   = nameM?.[1]?.trim().replace(/[*_#]/g, "") || "";
    if (!name || name.length < 4) continue;

    const contacts = extractContacts(block);
    const addrM    = block.match(/(?:Address|Location)[:\s]+([^\n]{10,100})/i);
    const prodM    = block.match(/(?:Products?|Offerings?)[:\s]+([^\n]{10,150})/i);
    const webM     = contacts.websites[0] || "";

    if (contacts.phones.length === 0 && !contacts.emails[0] && !webM) continue;

    leads.push({
      businessName: name,
      phone:        contacts.phones[0]  || "",
      email:        contacts.emails[0]  || "",
      whatsapp:     contacts.whatsapp   || "",
      website:      webM,
      address:      addrM?.[1]?.trim()  || "",
      industry:     prodM?.[1]?.trim().slice(0, 100) || "",
      source:       "indiamart",
      type:         "company",
    });
  }
  return leads;
}

// ── JustDial Parser ───────────────────────────────────────────────────────────
function parseJustDialContent(content) {
  const leads = [];
  const lines  = content.split("\n").map(l => l.trim()).filter(l => l.length > 10);

  for (let i = 0; i < lines.length - 3; i++) {
    const line = lines[i];
    // JustDial Jina output: company name is usually a header/bold line
    if (!line.match(/^[A-Z][A-Za-z\s&.,'-]{4,60}$/)) continue;

    const context  = lines.slice(i, i + 8).join(" ");
    const phoneM   = context.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
    const ratingM  = context.match(/([0-9]\.[0-9])\s*(?:rating|stars?|\/5)/i);
    const addrM    = context.match(/(?:Address|Location)[:\s]+([^,]{10,80}(?:,[^,]{5,30}){0,2})/i);
    const catM     = context.match(/(?:Category|Type)[:\s]+([A-Za-z\s&]{5,60})/i);

    if (!phoneM) continue;

    leads.push({
      businessName: line.replace(/[*_#]/g, ""),
      phone:        phoneM[0].replace(/[\s-]/g, ""),
      email:        "",
      website:      "",
      address:      addrM?.[1]?.trim() || "",
      industry:     catM?.[1]?.trim()  || "",
      rating:       ratingM ? parseFloat(ratingM[1]) : null,
      source:       "justdial",
      type:         "company",
    });
    i += 4; // Skip next few lines — same business
  }
  return leads;
}

// ── Search-then-scrape: use SERP to find directory listing URLs ───────────────
async function crawlViaSearch(category, city, directoryDomain, parseFunc, limit = 15) {
  const q = `site:${directoryDomain} "${category}" "${city}" phone`;
  const results = await serperSearch(q, "in", 10);

  const leads = [];
  // Take top 3 result pages and scrape them
  for (const r of results.slice(0, 3)) {
    const page = await fetchPage(r.link, { strategy: "jina", timeoutMs: 12000 });
    if (!page.success) continue;
    const items = parseFunc(page.content);
    leads.push(...items);
    if (leads.length >= limit) break;
  }

  return leads.slice(0, limit).map(l => ({ ...l, city, searchCategory: category }));
}

// ── Save leads to Firestore ───────────────────────────────────────────────────
async function saveLeads(db, leads) {
  if (leads.length === 0) return 0;
  const col = db.collection("lead_database");

  const entries = leads
    .filter(l => l.businessName && l.businessName.length > 3)
    .map(l => {
      const key   = `${l.businessName.toLowerCase().replace(/\s+/g,"").slice(0,40)}_${(l.city||"").toLowerCase().slice(0,15)}`;
      const docId = Buffer.from(key).toString("base64").replace(/[^a-zA-Z0-9]/g,"").slice(0, 50);
      return { l, docId };
    });

  if (entries.length === 0) return 0;

  const existing = await Promise.all(entries.map(({ docId }) => col.doc(docId).get()));

  let saved    = 0;
  let batchOps = 0;
  let batch    = db.batch();

  for (let i = 0; i < entries.length; i++) {
    const { l, docId } = entries[i];
    const ex = existing[i];

    if (ex.exists) {
      // Merge: fill gaps only
      const cur = ex.data();
      const upd = {};
      if (!cur.phone   && l.phone)   upd.phone   = l.phone;
      if (!cur.email   && l.email)   upd.email   = l.email;
      if (!cur.website && l.website) upd.website = l.website;
      if (!cur.address && l.address) upd.address = l.address;
      if (!cur.rating  && l.rating)  upd.rating  = l.rating;
      if (Object.keys(upd).length > 0) {
        upd.lastUpdated = Date.now();
        batch.update(col.doc(docId), upd);
        batchOps++;
      }
      continue;
    }

    batch.set(col.doc(docId), {
      id:           docId,
      businessName: l.businessName,
      city:         l.city         || "",
      state:        "",
      industry:     l.industry     || l.searchCategory || "",
      phone:        l.phone        || "",
      email:        l.email        || "",
      whatsapp:     l.whatsapp     || "",
      website:      l.website      || "",
      address:      l.address      || "",
      rating:       l.rating       || null,
      linkedinUrl:  "",
      contactPerson: "",
      source:       l.source       || "directory",
      type:         "company",
      tags:         [l.source || "directory", "active_business"],
      emailVerified: false,
      emailConfidence: 0,
      collectedAt:  Date.now(),
      lastUpdated:  Date.now(),
      collectedBy:  "cron_crawl_directories",
    });
    saved++;
    batchOps++;

    if (batchOps === 400) {
      await batch.commit();
      batch    = db.batch();
      batchOps = 0;
    }
  }

  if (batchOps > 0) await batch.commit();
  return saved;
}

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  const isVercel   = req.headers.get("x-vercel-cron") === "1";
  if (!isVercel && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db  = getAdminDb();
  let total = 0;
  const log = [];

  // Rotate category + city by day
  const day  = new Date().getDate();
  const cat  = CATEGORIES[day % CATEGORIES.length];
  const city = CITIES[day % CITIES.length];

  const sources = [
    { domain: "www.indiamart.com", parser: parseIndiamartContent, label: "Indiamart" },
    { domain: "www.justdial.com",  parser: parseJustDialContent,  label: "JustDial"  },
  ];

  for (const src of sources) {
    try {
      const leads = await crawlViaSearch(cat, city, src.domain, src.parser, 20);
      const saved = await saveLeads(db, leads);
      total += saved;
      log.push({ source: src.label, category: cat, city, found: leads.length, saved });
    } catch (err) {
      log.push({ source: src.label, category: cat, city, error: err.message });
    }
  }

  await db.collection("cron_logs").add({
    job:       "crawl-directories",
    total,
    category:  cat,
    city,
    runAt:     Date.now(),
    log,
  });

  return NextResponse.json({ success: true, total, category: cat, city, log });
}
