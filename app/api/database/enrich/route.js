/**
 * Lead Enrichment API — Apollo-equivalent single-lead enrichment
 *
 * Given a company (leadId or raw data), finds:
 *   - Best reachable email (website scrape → pattern+MX → generic)
 *   - Phone number (contact page scrape)
 *   - WhatsApp number
 *   - Tech stack (what software they use)
 *   - LinkedIn company URL
 *   - GST number
 *   - Company description
 *
 * POST /api/database/enrich
 * Body: { leadId?, businessName, website, contactPerson, state, city }
 */

import { NextResponse }            from "next/server";
import { getAdminDb }              from "@/lib/firebaseAdmin";
import { verifyUser }              from "@/lib/authUtils";
import {
  extractDomain,
  scrapeWebsiteContacts,
  findBestEmail,
  findLinkedInCompany,
  findGSTNumber,
  extractEmployeeCount,
} from "@/lib/companyIntel";

export const maxDuration = 60;

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { leadId, businessName, website, contactPerson, state, city, cin } = body;

    if (!leadId && !businessName) {
      return NextResponse.json({ error: "Provide leadId or businessName" }, { status: 400 });
    }

    const db = getAdminDb();
    let current = { businessName, website, contactPerson, state, city, cin };

    // If enriching an existing DB lead, load current data first
    if (leadId) {
      const doc = await db.collection("lead_database").doc(leadId).get();
      if (!doc.exists) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      current = { ...doc.data(), ...Object.fromEntries(Object.entries(body).filter(([, v]) => v)) };
    }

    const name     = current.businessName || "";
    const site     = current.website      || "";
    const contact  = current.contactPerson|| "";
    const stateStr = current.state        || "";
    const cityStr  = current.city         || "";

    // ── Run all enrichment steps in parallel ────────────────────────────────
    const [websiteData, linkedinUrl, gstNumber] = await Promise.all([
      site ? scrapeWebsiteContacts(site) : Promise.resolve({ emails: [], phones: [], whatsapp: "", description: "", techStack: [], domain: "" }),
      !current.linkedinUrl ? findLinkedInCompany(name, cityStr || stateStr) : Promise.resolve(current.linkedinUrl || ""),
      !current.gstNumber   ? findGSTNumber(name, stateStr)                  : Promise.resolve(current.gstNumber   || ""),
    ]);

    const domain      = websiteData.domain || extractDomain(site);
    const emailResult = await findBestEmail(contact, domain, websiteData.emails);

    // Employee count from description
    const allText      = `${websiteData.description} ${websiteData.emails.join(" ")}`;
    const employeeCount = extractEmployeeCount(allText) || current.employeeCount || null;

    // ── Build enrichment diff (only upgrade, never blank out) ───────────────
    const enriched = {};

    if (emailResult.email && !current.email) {
      enriched.email           = emailResult.email;
      enriched.emailConfidence = parseFloat(emailResult.confidence.toFixed(2));
      enriched.emailSource     = emailResult.source;
    }
    if (websiteData.phones[0] && !current.phone)     enriched.phone       = websiteData.phones[0];
    if (websiteData.whatsapp  && !current.whatsapp)  enriched.whatsapp    = websiteData.whatsapp;
    if (websiteData.description && !current.description) enriched.description = websiteData.description.slice(0, 500);
    if (websiteData.techStack?.length)                enriched.techStack   = websiteData.techStack;
    if (linkedinUrl && !current.linkedinUrl)          enriched.linkedinUrl = linkedinUrl;
    if (gstNumber   && !current.gstNumber)            enriched.gstNumber   = gstNumber;
    if (employeeCount && !current.employeeCount)      enriched.employeeCount = employeeCount;
    if (domain      && !current.domain)               enriched.domain      = domain;

    const hasChanges = Object.keys(enriched).length > 0;
    if (hasChanges) {
      enriched.lastEnriched = Date.now();
      enriched.lastUpdated  = Date.now();
    }

    // ── Persist to Firestore ────────────────────────────────────────────────
    if (leadId && hasChanges) {
      await db.collection("lead_database").doc(leadId).update(enriched);
    }

    return NextResponse.json({
      success:     true,
      leadId:      leadId || null,
      enriched:    { ...current, ...enriched },
      fieldsAdded: Object.keys(enriched).filter(k => !["lastEnriched","lastUpdated"].includes(k)),
      hasChanges,
    });
  } catch (err) {
    console.error("[database/enrich]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
