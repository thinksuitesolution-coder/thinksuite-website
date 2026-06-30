// CSV / Word download helpers — browser-only, no server dependency

function triggerDownload(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function dateSuffix() {
  return new Date().toISOString().slice(0, 10);
}

// Google Maps leads
export function exportCSV(leads, niche, city) {
  const headers = ["#","Business Name","Phone","Website","Rating","Reviews","Category","City","Address","Maps URL","Status"];
  const rows = leads.map((l, i) => [
    i + 1,
    `"${(l.business_name || "").replace(/"/g, '""')}"`,
    l.phone || "", l.website || "",
    l.rating ?? "", l.total_ratings ?? "",
    l.category || "", l.city || city,
    `"${(l.address || "").replace(/"/g, '""')}"`,
    l.maps_url || "", l.status || "new",
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  triggerDownload(csv, `leads_${niche}_${city}_${dateSuffix()}.csv`);
}

// LinkedIn leads
export function exportLinkedInCSV(leads, niche) {
  const headers = ["#","Name","LinkedIn ID","Profile URL","Email","Phone","Title","Company","Location","Bio"];
  const rows = leads.map((l, i) => [
    i + 1,
    `"${(l.name || "").replace(/"/g, '""')}"`,
    l.linkedinId || "",
    l.profileUrl || `https://www.linkedin.com/in/${l.linkedinId}/`,
    l.email || "", l.phone || "",
    `"${(l.title || "").replace(/"/g, '""')}"`,
    `"${(l.company || "").replace(/"/g, '""')}"`,
    l.location || "",
    `"${(l.bio || "").replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  triggerDownload(csv, `linkedin_leads_${(niche || "results").replace(/\s+/g, "_")}_${dateSuffix()}.csv`);
}

// Instagram leads
export function exportInstagramCSV(leads, niche) {
  const headers = ["#","Name","Handle","Profile URL","Email","Phone","Location","Category","Followers","Bio"];
  const rows = leads.map((l, i) => [
    i + 1,
    `"${(l.name || "").replace(/"/g, '""')}"`,
    l.handle || "",
    l.profileUrl || `https://www.instagram.com/${l.handle}/`,
    l.email || "", l.phone || "",
    l.location || "", l.category || "", l.followers || "",
    `"${(l.bioSnippet || "").replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  triggerDownload(csv, `instagram_leads_${(niche || "results").replace(/\s+/g, "_")}_${dateSuffix()}.csv`);
}

// Export-Import leads
export function exportEximCSV(leads, product) {
  const headers = ["#","Company","Contact Person","Phone","Email","City","State","Product","HS Code","Type","Shipment Volume","Top Port","Website","Source","Verified","Lead Score","Past History"];
  const rows = leads.map((l, i) => [
    i + 1,
    `"${(l.company_name || "").replace(/"/g, '""')}"`,
    `"${(l.contact_person || "").replace(/"/g, '""')}"`,
    l.phone || "", l.email || "",
    l.city || "", l.state || "",
    `"${(l.product || "").replace(/"/g, '""')}"`,
    l.hs_code || "", l.type || "",
    `"${(l.shipment_volume || "").replace(/"/g, '""')}"`,
    l.top_port || "", l.website || "", l.source || "",
    l.verified ? "Yes" : "No",
    l.lead_score || "",
    `"${(l.past_history || "").replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  triggerDownload(csv, `exim_leads_${(product || "export-import").replace(/\s+/g, "_")}_${dateSuffix()}.csv`);
}

// Website / AI leads
export function exportWebsiteLeadsCSV(leads, queryLabel) {
  const headers = ["#","Name","Phone","Email","Category","Location","Address","Website","Description","Source"];
  const rows = leads.map((l, i) => [
    i + 1,
    `"${(l.name || "").replace(/"/g, '""')}"`,
    l.phone || "", l.email || "",
    `"${(l.category || "").replace(/"/g, '""')}"`,
    `"${(l.location || "").replace(/"/g, '""')}"`,
    `"${(l.address || "").replace(/"/g, '""')}"`,
    l.website || "",
    `"${(l.description || "").replace(/"/g, '""')}"`,
    l.source || "",
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  triggerDownload(csv, `ai-leads_${(queryLabel || "export").replace(/\s+/g, "-")}_${dateSuffix()}.csv`);
}

// Government tenders
export function exportTCSV(tenders, isIndia) {
  const headers = [
    "#", "Title", "Tender ID", "Organization",
    ...(isIndia ? ["State/City"] : ["Country", "State/City"]),
    "Value", "EMD", "Doc Fee", "Published Date", "Last Date",
    "Bid Opening", "Days Remaining", "Eligibility",
    ...(isIndia ? [] : ["Indian Firms Eligible"]),
    "Scope", "Sector", "Funding Agency", "Source Portal", "Link",
  ];
  const rows = tenders.map((t, i) => [
    i + 1,
    `"${(t.title || "").replace(/"/g, '""')}"`,
    t.tender_id || "N/A",
    `"${(t.organization || "").replace(/"/g, '""')}"`,
    ...(!isIndia ? [t.country || "N/A"] : []),
    t.state_city || "N/A", t.value || "N/A", t.emd || "N/A",
    t.document_fee || "N/A", t.published_date || "N/A",
    t.last_date || "N/A", t.bid_opening_date || "N/A",
    t.days_remaining >= 0 ? t.days_remaining : "N/A",
    `"${(t.eligibility || "N/A").replace(/"/g, '""')}"`,
    ...(!isIndia ? [t.indian_firms_eligible || "Check Required"] : []),
    `"${(t.scope || "N/A").replace(/"/g, '""')}"`,
    t.sector || "N/A", t.funding_agency || "N/A",
    t.source_portal || "N/A", t.direct_link || "N/A",
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  // BOM for Excel UTF-8 compatibility
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), {
    href:     url,
    download: `${isIndia ? "india" : "international"}_tenders_${dateSuffix()}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

// Copy gen Word download
export function downloadWord(result, productName) {
  function section(title, body) {
    return `<h2 style="color:#0f4c81;font-size:14pt;margin-top:24pt;">${title}</h2><pre style="white-space:pre-wrap;font-size:11pt;line-height:1.8;">${body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
  }
  const { google, instagram, linkedin, inmail, email, whatsapp } = result;
  const bodyHtml = [
    section("🔵 GOOGLE SEARCH ADS",
      `Headlines:\n1. ${google.headlines[0]}\n2. ${google.headlines[1]}\n3. ${google.headlines[2]}\n\nDescriptions:\n1. ${google.descriptions[0]}\n2. ${google.descriptions[1]}`),
    section("🟣 INSTAGRAM REEL HOOK + CAPTION",
      `Hook: ${instagram.hook}\n\nCaption:\n${instagram.caption}\n\n${instagram.hashtags}`),
    section("🔷 LINKEDIN ORGANIC POST", linkedin.post),
    section("📩 LINKEDIN INMAIL",
      `Subject: ${inmail.subject}\n\n${inmail.body}`),
    section("📧 COLD EMAIL TEMPLATE",
      `Subject: ${email.subject}\n\n${email.body}`),
    section("💬 WHATSAPP OUTREACH", whatsapp.message),
  ].join("\n\n");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AI Ad Campaign - ${productName}</title></head><body style="font-family:Calibri,sans-serif;max-width:800px;margin:40px auto;color:#1a1a2e;">${bodyHtml}</body></html>`;
  const blob = new Blob([html], { type: "application/msword;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `AI_AdCampaign_${(productName || "product").replace(/\s+/g, "_")}_${dateSuffix()}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}
