import { NextResponse } from "next/server";
import { checkLeadQuota, incrementLeadQuota } from "@/lib/leadGenQuota";
import { verifyUser } from "@/lib/authUtils";

export async function POST(request) {
  try {
    const userId = await verifyUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { business_id, company_name } = await request.json();

    if (!business_id && !company_name) {
      return NextResponse.json(
        { error: "business_id or company_name required" },
        { status: 400 }
      );
    }

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return NextResponse.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    // Explorium enrich endpoint
    const payload = business_id
      ? { business_id }
      : { name: company_name };

    const exploriumRes = await fetch("https://api.explorium.ai/v1/businesses/enrich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXPLORIUM_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!exploriumRes.ok) {
      const errText = await exploriumRes.text();
      console.error("[enrich-lead] Explorium API error:", exploriumRes.status, errText);
      return NextResponse.json(
        { error: `Explorium API error: ${exploriumRes.status}` },
        { status: 502 }
      );
    }

    const raw = await exploriumRes.json();
    const b = raw.result || raw.business || raw;

    // Normalize to our format
    const data = {
      email: b.email || b.contact_email || "",
      phone: b.phone || b.contact_phone || "",
      linkedin: b.linkedin_url || b.linkedin || "",
      tech_stack: b.technologies || b.tech_stack || [],
      description: b.description || b.company_description || "",
      decision_makers: (b.decision_makers || b.contacts || []).map((p) => ({
        name: p.name || p.full_name || "",
        title: p.title || p.job_title || "",
        email: p.email || "",
        linkedin: p.linkedin_url || p.linkedin || "",
      })),
      enriched: true,
    };

    const { granted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, 1);

    // Fail closed: quota/wallet exhausted between check and increment (or quota DB unavailable)
    if (granted < 1) {
      return NextResponse.json({ quotaExceeded: true, needsTopup: true }, { status: 402 });
    }

    return NextResponse.json({ ...data, quotaUsed, quotaRemaining, quotaLimit });
  } catch (err) {
    console.error("[enrich-lead]", err);
    return NextResponse.json({ error: err.message || "Enrichment failed" }, { status: 500 });
  }
}
