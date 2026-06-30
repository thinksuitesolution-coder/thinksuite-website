// Lead scoring, insight generation, and priority helpers

export function buildLeadInsight(lead, allLeads) {
  const name    = lead.business_name;
  const cat     = lead.category || "";
  const city    = lead.city || "";
  const rating  = lead.rating;
  const reviews = lead.total_ratings || 0;
  const hasWeb  = !!lead.website;

  const ratedLeads = allLeads.filter(l => l.rating && l.total_ratings);
  const avgReviews = ratedLeads.length
    ? ratedLeads.reduce((s, l) => s + (l.total_ratings || 0), 0) / ratedLeads.length
    : 0;

  const parts = [];
  if (rating && reviews) {
    const rNote  = rating >= 4.5 ? "exceptional" : rating >= 4.0 ? "strong" : rating >= 3.5 ? "decent" : "lower";
    const rvNote = reviews > avgReviews * 1.5 ? "very high review count indicating established credibility"
      : reviews > avgReviews ? "above-average review count" : "growing review base";
    parts.push(`${name}${cat ? ` (${cat})` : ""} in ${city} has ${rating}⭐ with ${reviews} reviews - ${rNote} ratings and a ${rvNote}.`);
  } else {
    parts.push(`${name}${cat ? ` (${cat})` : ""} in ${city}.`);
  }

  parts.push(hasWeb
    ? "Existing website signals digital awareness - likely open to marketing investments."
    : "No website found - strong opportunity to pitch web presence + digital marketing from scratch.");

  parts.push(
    (rating >= 4.0 && reviews > 50 && hasWeb)
      ? "High priority lead - established presence with strong budget potential."
      : (rating >= 3.5 || reviews > 20)
        ? "Medium priority - growing business, good outreach candidate."
        : "Early-stage lead - personalized and educational approach recommended."
  );

  return parts.join(" ");
}

export function computeLeadPriority(lead) {
  const rating  = lead.rating || 0;
  const reviews = lead.total_ratings || 0;
  const hasWeb  = !!lead.website;
  if (rating >= 4.0 && reviews > 50 && hasWeb) return "high";
  if (rating >= 3.5 || reviews > 20)           return "medium";
  return "low";
}

export const PRIORITY_CONFIG = {
  high:   { label: "Hot",  color: "#7c3aed", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
  medium: { label: "Warm", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)" },
  low:    { label: "Cold", color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" },
};

export function formatCopySection(key, result) {
  const r = result[key];
  if (!r) return "N/A";
  switch (key) {
    case "google":    return `Headlines:\n1. ${r.headlines?.[0]}\n2. ${r.headlines?.[1]}\n3. ${r.headlines?.[2]}\n\nDescriptions:\n1. ${r.descriptions?.[0]}\n2. ${r.descriptions?.[1]}`;
    case "instagram": return `Hook:\n${r.hook}\n\nCaption:\n${r.caption}\n\nHashtags:\n${r.hashtags}`;
    case "linkedin":  return r.post;
    case "inmail":    return `Subject: ${r.subject}\n\n${r.body}`;
    case "email":     return `Subject: ${r.subject}\n\n${r.body}`;
    case "whatsapp":  return r.message;
    default:          return JSON.stringify(r, null, 2);
  }
}

export function buildLinkedInInsight(lead) {
  const parts = [];
  const name    = lead.name || lead.linkedinId || "This professional";
  const title   = lead.title || "";
  const company = lead.company || "";

  const seniority = /founder|owner|ceo|cto|cmo|president/i.test(title) ? "decision-maker"
    : /director|vp|head/i.test(title) ? "senior leader"
    : /manager|lead/i.test(title) ? "mid-level manager"
    : "professional";

  if (title && company) {
    parts.push(`${name} is a ${title} at ${company} -a ${seniority} with direct influence on business decisions.`);
  } else if (title) {
    parts.push(`${name} holds a ${title} role -a ${seniority} worth reaching out to directly.`);
  } else {
    parts.push(`${name} is a LinkedIn professional in your target niche.`);
  }

  if (lead.email || lead.phone) {
    parts.push("Direct contact info available -high conversion potential, reach out with a personalized message.");
  } else {
    parts.push("No direct contact info found -connect via LinkedIn DM or InMail for best results.");
  }

  if (seniority === "decision-maker") {
    parts.push("High priority: Founder/CEO-level leads respond best to ROI-focused pitches -show concrete business impact.");
  } else if (seniority === "senior leader") {
    parts.push("Medium-high priority: Director-level leads appreciate strategic benefits and team productivity angles.");
  } else {
    parts.push("Good lead -managers and professionals can be internal champions who introduce your solution to their team.");
  }

  return parts.join(" ");
}

export function buildInstagramInsight(lead) {
  const parts       = [];
  const name        = lead.name || `@${lead.handle}` || "This account";
  const followersNum = parseInt((lead.followers || "").replace(/[^0-9]/g, "")) || 0;
  const tierLabel   = followersNum >= 1000000 ? "macro-influencer (1M+)"
    : followersNum >= 100000 ? "macro-influencer (100k+)"
    : followersNum >= 10000  ? "micro-influencer (10k–100k)"
    : followersNum > 0       ? "nano-influencer (<10k)"
    : "account";

  if (lead.category) {
    parts.push(`${name} is a ${lead.category} ${tierLabel}${lead.location ? ` based in ${lead.location}` : ""}.`);
  } else {
    parts.push(`${name} is an Instagram ${tierLabel}${lead.location ? ` based in ${lead.location}` : ""}.`);
  }

  if (lead.email || lead.phone) {
    parts.push("Direct contact info found -reach out via email or phone for higher response rate than DMs.");
  } else {
    parts.push("No direct contact info -send a DM or reach out via Instagram's 'Email' button in their bio.");
  }

  if (followersNum >= 100000) {
    parts.push("High-reach account -great for brand awareness campaigns. Expect higher collaboration rates.");
  } else if (followersNum >= 10000) {
    parts.push("Micro-influencer with high engagement potential -ideal for niche campaigns with strong ROI.");
  } else {
    parts.push("Growing account with niche audience -cost-effective for targeted outreach and brand building.");
  }

  return parts.join(" ");
}
