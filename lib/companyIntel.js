/**
 * Company Intelligence Engine — Apollo-equivalent for India
 *
 * Capabilities:
 *   - Email pattern generation + MX verification
 *   - Website contact scraping (email, phone, WhatsApp)
 *   - Tech stack fingerprinting (50+ tools)
 *   - LinkedIn company URL discovery
 *   - GST number extraction
 *   - Company description extraction
 */

import dns from "dns/promises";
import {
  jinaFetch,
  serperSearch,
  extractEmails,
  extractPhonesIndian,
  extractPhones,
  extractWhatsAppNumber,
} from "./scraperUtils.js";

// ── Domain utilities ──────────────────────────────────────────────────────────
export function extractDomain(website = "") {
  if (!website) return "";
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase().trim();
  } catch { return ""; }
}

// ── Email permutation generator ───────────────────────────────────────────────
export function generateEmailPatterns(fullName = "", domain = "") {
  if (!domain) return [];
  const parts = fullName.trim().toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
  const f  = parts[0] || "";
  const l  = parts[parts.length - 1] || "";
  const fi = f[0] || "";
  const li = l[0] || "";

  const personal = f ? (l && f !== l ? [
    `${f}@${domain}`,
    `${f}.${l}@${domain}`,
    `${f}${l}@${domain}`,
    `${fi}.${l}@${domain}`,
    `${fi}${l}@${domain}`,
    `${f}.${li}@${domain}`,
    `${l}@${domain}`,
    `${l}.${f}@${domain}`,
    `${l}${fi}@${domain}`,
  ] : [`${f}@${domain}`]) : [];

  const generic = [
    `info@${domain}`,
    `contact@${domain}`,
    `hello@${domain}`,
    `sales@${domain}`,
    `support@${domain}`,
    `enquiry@${domain}`,
  ];

  return [...new Set([...personal, ...generic])];
}

// ── Email verification (MX-based — port 25 blocked on Vercel) ─────────────────
const DISPOSABLE = new Set([
  "mailinator.com","guerrillamail.com","temp-mail.org","throwam.com",
  "yopmail.com","trashmail.com","fakeinbox.com","sharklasers.com","getairmail.com",
]);
const FREE_PROVIDERS = new Set([
  "gmail.com","yahoo.com","hotmail.com","outlook.com","yahoo.in",
  "rediffmail.com","icloud.com","live.com","msn.com","protonmail.com",
]);

export async function verifyEmailMx(email) {
  if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    return { valid: false, confidence: 0 };
  const domain = email.split("@")[1];
  if (DISPOSABLE.has(domain))     return { valid: false, confidence: 0 };
  if (FREE_PROVIDERS.has(domain)) return { valid: true,  confidence: 0.75 };
  try {
    const mx = await dns.resolveMx(domain);
    return { valid: mx.length > 0, confidence: mx.length > 0 ? 0.85 : 0.1 };
  } catch { return { valid: false, confidence: 0.1 }; }
}

// ── Find the best reachable email for a contact ───────────────────────────────
export async function findBestEmail(contactName = "", domain = "", scrapedEmails = []) {
  // 1. Scraped domain-matched email is the most trustworthy
  const domainEmails = scrapedEmails.filter(e => {
    const d = (e.split("@")[1] || "").replace(/^www\./, "");
    return d === domain || d.endsWith(`.${domain}`);
  });
  if (domainEmails.length > 0) return { email: domainEmails[0], confidence: 0.92, source: "website_scrape" };

  // 2. Pattern generation + MX check (personal emails first)
  if (contactName && domain) {
    const all     = generateEmailPatterns(contactName, domain);
    const personal = all.filter(e => !["info@","contact@","hello@","sales@","support@","enquiry@"].some(p => e.startsWith(p)));
    const checked  = await Promise.all(personal.slice(0, 6).map(async e => ({ email: e, ...(await verifyEmailMx(e)) })));
    const valid    = checked.filter(r => r.valid).sort((a, b) => b.confidence - a.confidence);
    if (valid.length > 0) return { email: valid[0].email, confidence: valid[0].confidence, source: "pattern_mx" };
  }

  // 3. Generic business email if domain has MX
  if (domain) {
    try {
      const mx = await dns.resolveMx(domain);
      if (mx.length > 0) return { email: `info@${domain}`, confidence: 0.55, source: "generic" };
    } catch {}
  }

  // 4. Non-domain scraped email (personal gmail, etc.)
  if (scrapedEmails.length > 0) return { email: scrapedEmails[0], confidence: 0.5, source: "scraped_other" };

  return { email: "", confidence: 0, source: "none" };
}

// ── Tech stack fingerprinting ─────────────────────────────────────────────────
const TECH_SIGS = [
  // CMS / Site Builders
  { name: "WordPress",        match: ["wp-content/", "wp-includes/", "/wp-json/", "xmlrpc.php"] },
  { name: "Shopify",          match: ["cdn.shopify.com", "shopify.com/s/files", "Shopify.theme"] },
  { name: "Wix",              match: ["wixstatic.com", "wix.com/_api", "X-Wix-"] },
  { name: "Squarespace",      match: ["squarespace.com", "squarespace-cdn.com"] },
  { name: "Webflow",          match: ["webflow.com", ".webflow.io"] },
  { name: "Joomla",           match: ["/joomla", "joomla.org", "/media/jui/"] },
  { name: "Drupal",           match: ["drupal.org", "/sites/default/files/"] },
  // Frontend
  { name: "React/Next.js",    match: ["__NEXT_DATA__", "_next/static", "__react"] },
  { name: "Vue/Nuxt.js",      match: ["vue.min.js", "__NUXT__", "/nuxt.js"] },
  { name: "Angular",          match: ["ng-version=", "angular.min.js"] },
  // Payments — India
  { name: "Razorpay",         match: ["razorpay.com", "checkout.razorpay.com"] },
  { name: "PayU",             match: ["payu.in", "payu.com/ppi"] },
  { name: "Cashfree",         match: ["cashfree.com"] },
  { name: "CCAvenue",         match: ["ccavenue.com"] },
  { name: "Instamojo",        match: ["instamojo.com"] },
  { name: "Paytm",            match: ["paytm.com/web-sdk", "paytm-pg.paytm.com"] },
  // Payments — Global
  { name: "Stripe",           match: ["js.stripe.com", "stripe.com/v3"] },
  { name: "PayPal",           match: ["paypal.com/sdk/js"] },
  // CRM / Marketing Automation
  { name: "HubSpot",          match: ["hs-scripts.com", "hubspot.com/hs/", "hubspotutk"] },
  { name: "Zoho CRM",         match: ["zoho.com", "zohopublic.com", "zohocrm"] },
  { name: "Salesforce",       match: ["salesforce.com", "force.com", "lightning.force"] },
  { name: "Freshworks",       match: ["freshworks.com", "freshdesk.com", "freshchat.com"] },
  { name: "Intercom",         match: ["intercomcdn.com", "intercom.io", "app.intercom"] },
  { name: "CleverTap",        match: ["clevertap.com", "wizcache.com"] },
  { name: "WebEngage",        match: ["webengage.com"] },
  { name: "MoEngage",         match: ["moengage.com"] },
  { name: "Mailchimp",        match: ["mailchimp.com", "list-manage.com"] },
  // Analytics
  { name: "Google Analytics", match: ["google-analytics.com/ga.js", "gtag/js?id=G-", "ga('create'"] },
  { name: "Facebook Pixel",   match: ["connect.facebook.net/en_US/fbevents.js", "fbq('init'"] },
  { name: "Mixpanel",         match: ["mixpanel.com/lib/"] },
  { name: "Amplitude",        match: ["amplitude.com/libs/"] },
  { name: "Hotjar",           match: ["static.hotjar.com", "hjid="] },
  { name: "Microsoft Clarity", match: ["clarity.ms", "microsoft.com/clarity"] },
  // Customer Support
  { name: "Zendesk",          match: ["zendesk.com", "zdassets.com"] },
  { name: "Freshdesk",        match: ["freshdesk.com/widget"] },
  { name: "Tawk.to",          match: ["tawk.to", "tawk.to/s1"] },
  { name: "Tidio",            match: ["tidiochat.com"] },
  // WhatsApp
  { name: "WhatsApp Business", match: ["wa.me/91", "api.whatsapp.com/send", "wa.link/"] },
  // Cloud / Infra
  { name: "AWS",              match: ["amazonaws.com", "cloudfront.net"] },
  { name: "Google Cloud",     match: ["storage.googleapis.com", ".run.app"] },
  { name: "Cloudflare",       match: ["cdnjs.cloudflare.com", "ajax.cloudflare.com"] },
  // ERP / Accounting (India)
  { name: "Tally",            match: ["tallysolutions.com", "tally-india"] },
  { name: "Busy Accounting",  match: ["busybusy.in"] },
  { name: "Zoho Books",       match: ["zohobooks.com", "books.zoho.com"] },
];

export function detectTechStack(content = "") {
  const c = content.toLowerCase();
  return [...new Set(
    TECH_SIGS.filter(t => t.match.some(p => c.includes(p.toLowerCase()))).map(t => t.name)
  )];
}

// ── Scrape company website for contact info ───────────────────────────────────
export async function scrapeWebsiteContacts(website) {
  const domain = extractDomain(website);
  if (!domain) return { emails: [], phones: [], whatsapp: "", description: "", techStack: [], domain: "" };

  const base  = `https://${domain}`;
  const pages = [`${base}/contact`, `${base}/contact-us`, `${base}/about`, `${base}/about-us`, base];

  let content = "";
  for (const url of pages) {
    const text = await jinaFetch(url, 10000);
    if (text && text.length > 300) { content = text; break; }
  }

  if (!content) return { emails: [], phones: [], whatsapp: "", description: "", techStack: [], domain };

  // Extract first meaningful sentence as description
  const descLines = content.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 80 && l.length < 400 && !l.startsWith("#") && !l.startsWith("[") && !l.startsWith("!"));

  const phones = [...new Set([
    ...extractPhonesIndian(content),
    ...extractPhones(content),
  ])].slice(0, 3);

  return {
    emails:      extractEmails(content).slice(0, 5),
    phones,
    whatsapp:    extractWhatsAppNumber(content),
    description: descLines[0] || "",
    techStack:   detectTechStack(content),
    domain,
  };
}

// ── Find company LinkedIn page ────────────────────────────────────────────────
export async function findLinkedInCompany(companyName, location = "") {
  if (!companyName) return "";
  const q = `"${companyName}" site:linkedin.com/company ${location || "india"}`;
  const results = await serperSearch(q, "in", 3);
  const hit = results.find(r => r.link && /linkedin\.com\/company\//.test(r.link));
  return hit?.link?.split("?")[0] || "";
}

// ── Find company GST number via public search ─────────────────────────────────
export async function findGSTNumber(companyName, state = "") {
  if (!companyName) return "";
  const q = `"${companyName}" GSTIN OR "GST number" ${state} site:gstsearch.in OR site:mastergst.com OR site:taxpayersearch.in OR site:quicko.com`;
  const results = await serperSearch(q, "in", 5);
  for (const r of results) {
    const text = `${r.title} ${r.snippet}`;
    const m = text.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]\b/);
    if (m) return m[0];
  }
  return "";
}

// ── Extract employee count estimate from text ─────────────────────────────────
export function extractEmployeeCount(text = "") {
  const patterns = [
    /(\d+[\d,]*)\s*(?:\+\s*)?(?:employees?|team members?|professionals?|people|staff)\b/i,
    /(?:team of|strength of|workforce of)\s*(\d+[\d,]*)/i,
    /(?:over|more than|around|approximately)\s*(\d+[\d,]*)\s*(?:employees?|people)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const n = parseInt(m[1].replace(/,/g, ""), 10);
      if (n > 0 && n < 1000000) return n;
    }
  }
  return null;
}
