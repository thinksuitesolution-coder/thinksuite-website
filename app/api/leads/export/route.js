import { NextResponse } from "next/server";

function escapeCSV(val) {
  if (val === null || val === undefined) return "";
  const str = String(val).replace(/"/g, '""');
  return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
}

function generateCSV(leads) {
  const headers = [
    "Business Name", "Email", "Phone", "WhatsApp", "Website",
    "City", "State", "Country", "Industry", "Company Size",
    "AI Score", "Urgency", "Email Verified", "Email Score",
    "Website Active", "Tech Stack", "Best Channel", "Best Time",
    "Source", "Status", "Rating", "Reviews",
    "LinkedIn", "Instagram", "Facebook",
    "AI Summary", "Pain Points", "Opportunity Type",
    "Outreach Email", "Outreach WhatsApp", "Tags",
    "Is Favorite", "Created At",
  ];

  const rows = leads.map(l => [
    l.businessName || l.name,
    l.email,
    l.phone,
    l.whatsapp,
    l.website,
    l.city,
    l.state,
    l.country,
    l.industry,
    l.companySize,
    l.aiLeadScore,
    l.urgency,
    l.emailValid === true ? "Yes" : l.emailValid === false ? "No" : "",
    l.emailScore,
    l.websiteActive === true ? "Yes" : l.websiteActive === false ? "No" : "",
    (l.techStack || []).join("; "),
    l.aiBestChannel,
    l.aiBestTime,
    l.source,
    l.status,
    l.rating,
    l.reviewCount,
    l.socialLinks?.linkedin,
    l.socialLinks?.instagram,
    l.socialLinks?.facebook,
    l.aiSummary,
    (l.aiPainPoints || []).join("; "),
    l.opportunityType,
    l.aiOutreachEmail,
    l.aiOutreachWhatsapp,
    (l.tags || []).join("; "),
    l.isFavorite ? "Yes" : "No",
    l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "",
  ].map(escapeCSV));

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken, leadIds, source, status, all } = body;

    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const adminModule = await import("@/lib/firebase-admin");
    const adminApp = adminModule.default();
    if (!adminApp) return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });

    const decoded = await adminApp.auth().verifyIdToken(idToken);
    const userId = decoded.uid;
    const db = adminApp.firestore();

    let leads = [];

    if (Array.isArray(leadIds) && leadIds.length > 0) {
      // Export specific leads
      const snaps = await Promise.all(leadIds.map(id => db.collection("leads").doc(id).get()));
      leads = snaps.filter(s => s.exists && s.data().userId === userId).map(s => s.data());
    } else {
      // Export by filter
      let query = db.collection("leads").where("userId", "==", userId).orderBy("createdAt", "desc");
      if (source) query = query.where("source", "==", source);
      if (status) query = query.where("status", "==", status);
      if (!all) query = query.limit(500);
      const snap = await query.get();
      leads = snap.docs.map(d => d.data());
    }

    if (leads.length === 0) {
      return NextResponse.json({ error: "No leads found to export" }, { status: 404 });
    }

    // Mark as exported
    const batch = db.batch();
    for (const l of leads) {
      if (!l.isExported) batch.update(db.collection("leads").doc(l.id), { isExported: true });
    }
    await batch.commit();

    const csv = generateCSV(leads);
    const filename = `Thinksuite-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
