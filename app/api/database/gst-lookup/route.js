/**
 * GST Lookup API
 *
 * Given a GSTIN or company name, returns full GST registration details:
 *   - Legal name (exact from government record)
 *   - Trade name
 *   - Full address with PIN code
 *   - Business type (Pvt Ltd, Proprietorship, Partnership, etc.)
 *   - Nature of business
 *   - Registration date
 *   - Active / cancelled status
 *   - State decoded from GSTIN first 2 digits
 *
 * Also: if leadId provided, updates lead_database with the enriched data.
 *
 * POST /api/database/gst-lookup
 * Body: { gstin?, companyName?, state?, leadId? }
 */

import { NextResponse }    from "next/server";
import { getAdminDb }      from "@/lib/firebaseAdmin";
import { verifyUser }      from "@/lib/authUtils";
import {
  lookupGSTIN,
  findGSTINByName,
  enrichLeadWithGST,
  getStateFromGSTIN,
} from "@/lib/apis/gstApi";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { gstin, companyName, state, leadId } = await req.json();

    if (!gstin && !companyName && !leadId) {
      return NextResponse.json({ error: "Provide gstin, companyName, or leadId" }, { status: 400 });
    }

    const db = getAdminDb();
    let lead = null;

    // Load existing lead if leadId provided
    if (leadId) {
      const doc = await db.collection("lead_database").doc(leadId).get();
      if (!doc.exists) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      lead = doc.data();
    }

    let gstData   = null;
    let gstinUsed = gstin || lead?.gstNumber || "";

    // Mode 1: Direct GSTIN lookup
    if (gstinUsed) {
      gstData = await lookupGSTIN(gstinUsed);
    }

    // Mode 2: Search by name → find GSTIN → lookup
    if (!gstData) {
      const nameToSearch = companyName || lead?.businessName || "";
      const stateToUse   = state       || lead?.state        || "";
      if (nameToSearch) {
        const gstins = await findGSTINByName(nameToSearch, stateToUse);
        if (gstins.length > 0) {
          gstinUsed = gstins[0];
          gstData   = await lookupGSTIN(gstinUsed);
        }
      }
    }

    if (!gstData) {
      return NextResponse.json({
        success: false,
        message: gstinUsed
          ? `GSTIN ${gstinUsed} not found or GST portal unavailable`
          : "No GSTIN found for this company. Try providing the GSTIN directly.",
        gstin: gstinUsed || null,
      });
    }

    // Build Firestore update
    const updates = {
      gstNumber:           gstinUsed,
      gstStatus:           gstData.status,
      gstRegistrationDate: gstData.registrationDate,
    };
    if (gstData.legalName  && (!lead?.legalName))  updates.legalName  = gstData.legalName;
    if (gstData.tradeName  && (!lead?.tradeName))   updates.tradeName  = gstData.tradeName;
    if (gstData.city       && (!lead?.city))        updates.city       = gstData.city;
    if (gstData.state      && (!lead?.state))       updates.state      = gstData.state;
    if (gstData.pincode)                            updates.pincode    = gstData.pincode;
    if (gstData.address    && (!lead?.address))     updates.address    = gstData.address;
    if (gstData.natureOfBusiness && (!lead?.description)) updates.description = gstData.natureOfBusiness;
    if (gstData.businessType && (!lead?.gstBusinessType)) updates.gstBusinessType = gstData.businessType;
    updates.lastEnriched = Date.now();
    updates.lastUpdated  = Date.now();

    // Persist to Firestore if leadId provided
    if (leadId) {
      await db.collection("lead_database").doc(leadId).update(updates);
    }

    return NextResponse.json({
      success:      true,
      gstin:        gstinUsed,
      gstData,
      stateDecoded: getStateFromGSTIN(gstinUsed),
      updates:      Object.keys(updates).filter(k => !["lastEnriched","lastUpdated"].includes(k)),
      leadId:       leadId || null,
    });
  } catch (err) {
    console.error("[database/gst-lookup]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
