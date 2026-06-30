/**
 * Bulk Enrichment API — Enrich up to 10 leads in one call
 *
 * Apollo equivalent: "Bulk Enrich" / CSV enrichment
 * Given a list of partial leads, fills in: email, phone, WhatsApp,
 * tech stack, description, LinkedIn URL for each.
 *
 * POST /api/database/bulk-enrich
 * Body: { leads: [{ businessName, website, contactPerson, state, city }] }
 *
 * Also supports persisting results back to lead_database if leadId provided.
 */

import { NextResponse }   from "next/server";
import { getAdminDb }     from "@/lib/firebaseAdmin";
import { verifyUser }     from "@/lib/authUtils";
import {
  extractDomain,
  scrapeWebsiteContacts,
  findBestEmail,
  findLinkedInCompany,
  extractEmployeeCount,
} from "@/lib/companyIntel";

export const maxDuration = 60;

async function enrichOneLead(lead) {
  try {
    const site    = lead.website      || "";
    const contact = lead.contactPerson|| lead.directorName || "";
    const city    = lead.city         || "";
    const state   = lead.state        || "";

    // Scrape website for contact info + tech stack
    const websiteData = site
      ? await scrapeWebsiteContacts(site)
      : { emails: [], phones: [], whatsapp: "", description: "", techStack: [], domain: "" };

    const domain      = websiteData.domain || extractDomain(site);
    const emailResult = await findBestEmail(contact, domain, websiteData.emails);

    // LinkedIn discovery only if missing and name is available
    const linkedinUrl = (!lead.linkedinUrl && lead.businessName)
      ? await findLinkedInCompany(lead.businessName, city || state)
      : lead.linkedinUrl || "";

    const employeeCount = extractEmployeeCount(`${websiteData.description}`) || lead.employeeCount || null;

    // Build enriched lead — only fill gaps, never overwrite existing data
    const result = { ...lead };
    if (emailResult.email  && !lead.email)       { result.email = emailResult.email; result.emailConfidence = emailResult.confidence; result.emailSource = emailResult.source; }
    if (websiteData.phones[0] && !lead.phone)    result.phone       = websiteData.phones[0];
    if (websiteData.whatsapp  && !lead.whatsapp) result.whatsapp    = websiteData.whatsapp;
    if (websiteData.description && !lead.description) result.description = websiteData.description.slice(0, 500);
    if (websiteData.techStack?.length)           result.techStack   = websiteData.techStack;
    if (linkedinUrl && !lead.linkedinUrl)        result.linkedinUrl = linkedinUrl;
    if (domain      && !lead.domain)             result.domain      = domain;
    if (employeeCount && !lead.employeeCount)    result.employeeCount = employeeCount;

    result.enriched    = true;
    result.enrichedAt  = Date.now();
    result.lastUpdated = Date.now();
    return result;
  } catch (err) {
    console.error("[bulk-enrich] lead error:", lead.businessName, err.message);
    return { ...lead, enriched: false, enrichError: err.message };
  }
}

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const leads = Array.isArray(body.leads) ? body.leads : [];

    if (leads.length === 0) return NextResponse.json({ error: "leads array is required" }, { status: 400 });
    if (leads.length > 10)  return NextResponse.json({ error: "Max 10 leads per bulk-enrich call (API cost control)" }, { status: 400 });

    // Enrich all leads in parallel
    const enriched = await Promise.all(leads.map(enrichOneLead));

    // If any lead has leadId, persist updates to Firestore
    const db          = getAdminDb();
    const withId      = enriched.filter(l => l.leadId && l.enriched);
    if (withId.length > 0) {
      await Promise.all(withId.map(async l => {
        const { leadId, ...data } = l;
        const update = {
          ...(data.email        ? { email: data.email, emailConfidence: data.emailConfidence, emailSource: data.emailSource } : {}),
          ...(data.phone        ? { phone: data.phone }        : {}),
          ...(data.whatsapp     ? { whatsapp: data.whatsapp }  : {}),
          ...(data.description  ? { description: data.description } : {}),
          ...(data.techStack    ? { techStack: data.techStack } : {}),
          ...(data.linkedinUrl  ? { linkedinUrl: data.linkedinUrl } : {}),
          ...(data.domain       ? { domain: data.domain }      : {}),
          ...(data.employeeCount ? { employeeCount: data.employeeCount } : {}),
          lastEnriched: Date.now(),
          lastUpdated:  Date.now(),
        };
        if (Object.keys(update).length > 2) { // more than just timestamps
          await db.collection("lead_database").doc(leadId).update(update).catch(() => {});
        }
      }));
    }

    const successCount = enriched.filter(l => l.enriched).length;

    return NextResponse.json({
      success:      true,
      leads:        enriched,
      total:        enriched.length,
      enrichedCount: successCount,
      failedCount:  enriched.length - successCount,
    });
  } catch (err) {
    console.error("[database/bulk-enrich]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
