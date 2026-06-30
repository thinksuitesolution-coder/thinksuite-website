import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifyToken } from "@/lib/saveOutput";

const TOOL_LABELS = {
  "google-map":       "Google Map Leads",
  "intl-map":         "Intl Map Leads",
  "website-leads":    "Website Leads",
  "intl-web":         "Intl Website Leads",
  "instagram":        "Instagram Leads",
  "instagram-intl":   "Intl Instagram",
  "linkedin":         "LinkedIn Leads",
  "linkedin-intl":    "Intl LinkedIn",
  "exim":             "Traders/Suppliers",
  "intl-exim":        "Intl Traders",
  "group-finder":     "Group Finder",
  "mca":              "MCA Companies",
  "mca-fresh":        "MCA Fresh Companies",
  "startup-founders": "Startup Founders",
  "freelancer":       "Freelancer Leads",
};

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getActivityTitle(slug, count) {
  const map = {
    "google-map":       "Lead list generated",
    "intl-map":         "Intl lead list generated",
    "website-leads":    `${count} leads exported`,
    "instagram":        "Instagram leads collected",
    "instagram-intl":   "Intl Instagram leads",
    "linkedin":         "LinkedIn leads scraped",
    "linkedin-intl":    "Intl LinkedIn leads",
    "mca":              "MCA Companies fetched",
    "mca-fresh":        "MCA Fresh Companies fetched",
    "exim":             "Trader leads exported",
    "intl-exim":        "Intl trader leads",
    "group-finder":     "Groups found",
    "startup-founders": "Startup founders fetched",
    "freelancer":       "Freelancer clients found",
  };
  return map[slug] || `${count} leads collected`;
}

export async function POST(req) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const uid = await verifyToken(idToken);
    const db  = getAdminDb();
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Fetch search history (last 200 records, filtered to last 30 days)
    const snap = await db.collection("searchHistory")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const searches = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(s => s.expiresAt > now && s.createdAt > thirtyDaysAgo);

    // Monthly quota (used leads)
    const monthKey = new Date().toISOString().slice(0, 7);
    const quotaDoc = await db.collection("leadGenQuota").doc(uid).get();
    const usedLeads = quotaDoc.exists ? (quotaDoc.data()[monthKey] || 0) : 0;

    // Wallet balance
    const walletDoc = await db.collection("leadWallet").doc(uid).get();
    const walletBalance = walletDoc.exists ? (walletDoc.data().balance || 0) : 0;

    // Aggregate stats
    let totalLeads = 0;
    const toolCounts    = {};
    const countryCounts = {};
    const dailyCounts   = {};
    const recentActivity = [];

    for (const s of searches) {
      const count = s.details?.resultsCount ?? s.results?.length ?? 0;
      totalLeads += count;

      const slug = s.toolSlug || "unknown";
      toolCounts[slug] = (toolCounts[slug] || 0) + count;

      const country = s.details?.country;
      if (country) countryCounts[country] = (countryCounts[country] || 0) + count;

      if (s.createdAt) {
        const day = new Date(s.createdAt).toISOString().slice(0, 10);
        dailyCounts[day] = (dailyCounts[day] || 0) + count;
      }

      if (recentActivity.length < 8) {
        const queryStr = typeof s.query === "string"
          ? s.query
          : (s.query?.niche || s.query?.keyword || s.query?.city || "");
        recentActivity.push({
          slug,
          title:    getActivityTitle(slug, count),
          subtitle: TOOL_LABELS[slug] || slug,
          time:     timeAgo(s.createdAt),
          count,
          query:    queryStr,
        });
      }
    }

    // Daily data for chart (last 30 days)
    const dailyData = Array.from({ length: 30 }, (_, i) => {
      const d   = new Date(now - (29 - i) * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      return { date: key, count: dailyCounts[key] || 0 };
    });

    // Top tools sorted by lead count
    const toolStats = Object.entries(toolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([slug, count]) => ({ slug, count, label: TOOL_LABELS[slug] || slug }));

    // Top countries
    const countryStats = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // contactRate = % of all collected leads that were actually used/contacted this month
    const contactRate = totalLeads > 0
      ? +((usedLeads / totalLeads) * 100).toFixed(1)
      : 0;

    // pendingLeads = leads collected but not yet contacted this month
    const pendingLeads = Math.max(0, totalLeads - usedLeads);

    return NextResponse.json({
      ok: true,
      totalLeads,
      usedLeads,
      pendingLeads,
      contactRate,
      walletBalance,
      dailyData,
      toolStats,
      recentActivity,
      countryStats,
      leadsStatus: {
        total:   totalLeads,
        used:    usedLeads,
        pending: pendingLeads,
      },
    });
  } catch (e) {
    console.error("[dashboard/lead-stats]", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
