import { getAIClient } from "@/lib/aiClient";

export const maxDuration = 30;

const client = getAIClient();

/* ══════════════════════════════════════════════════════════════════════════
   STATIC KNOWLEDGE BASE - instant responses, zero AI cost
   Covers the 90% of common failure patterns for each tool
══════════════════════════════════════════════════════════════════════════ */
const KNOWLEDGE = {

  /* ── Google Map Leads ─────────────────────────────────────────────────── */
  "google-map": {
    "no_results": ({ category = "", city = "", state = "" }) => ({
      headline: `${category ? `"${category}"` : "Search"} ke liye 0 leads mile`,
      whyNote: `Google Maps pe crores of businesses registered hain - ${category || "yeh category"} bhi wahan hai. Problem yeh hai ki bahut se small businesses ne apna phone number ya website apne Google My Business (GMB) dashboard pe add/verify nahi kiya hota. Isliye Places API ka response mein contact info empty aata hai aur lead filter ho jaati hai.`,
      tip: `Area narrow karo - "${city || "city"}" ki jagah specific locality try karo jaise "Lajpat Nagar", "Koramangala", "Sector 18". Small area mein zyada verified GMB profiles hote hain.`,
      chips: [
        { label: "Add specific area/locality", icon: "📍" },
        { label: "Try alternate spelling (e.g. Beauty Parlour, Hair Salon)", icon: "🔤" },
        { label: "Switch to Website Leads for this niche", icon: "🌐", action: "switch_tool", value: "website-leads" },
      ],
      sources: "Google Maps (Places API)",
    }),
    "few_results": ({ category = "", city = "", count = 0 }) => ({
      headline: `Sirf ${count} verified leads mile`,
      whyNote: `${city || "Is area"} mein ${category || "is niche"} ke businesses Google Maps pe hain, lekin unme se kai ne phone/website GMB pe listed nahi ki. Yeh India mein common hai especially tier-2/3 cities aur local mohalla businesses ke liye.`,
      tip: "Load More try karo pehle - system automatically nearby areas se fresh leads dhundta hai. Aur specific locality add karo zyada results ke liye.",
      chips: [
        { label: "Load More Leads", icon: "⬇", action: "load_more" },
        { label: "Try specific area (e.g. Sector 18, MG Road)", icon: "📍" },
        { label: "Switch to Website Leads", icon: "🌐", action: "switch_tool", value: "website-leads" },
      ],
      sources: "Google Maps (Places API)",
    }),
  },

  /* ── Website Leads ────────────────────────────────────────────────────── */
  "website-leads": {
    "no_results": ({ query = "", city = "", state = "" }) => ({
      headline: `"${query || "Is search"}" ke liye leads extract nahi ho sake`,
      whyNote: `Web scraping mein yeh tab hota hai jab: (1) search results mein is niche ki actual company websites nahi aati - sirf directories aati hain, ya (2) websites hain par contact info publicly listed nahi - phone/email hidden hai ya contact form ke peeche hai.`,
      tip: `Query aur specific karo - "${query}" ki jagah city + niche try karo jaise "JEE Coaching Gurgaon contact" ya niche ke saath "phone email" explicitly likho.`,
      chips: [
        { label: "Google Map Leads try karo (local businesses best)", icon: "🗺️", action: "switch_tool", value: "google-map-leads" },
        { label: "LinkedIn Leads try karo (decision makers)", icon: "💼", action: "switch_tool", value: "linkedin-india" },
        { label: "Query mein city + niche specific likho", icon: "✏️" },
      ],
      sources: "Google Search (Serper) + Firecrawl",
    }),
    "no_contact": ({ query = "" }) => ({
      headline: `Leads mile par contact info nahi`,
      whyNote: `Companies mil gayi "${query}" ke liye, lekin unke websites pe phone/email public nahi hai. Bohot si companies contact info sirf inquiry form ke peeche rakhti hain - direct scraping se nahi milta.`,
      tip: "Google Map Leads use karo is niche ke liye - wahan directly GMB se verified phone number aata hai without scraping.",
      chips: [
        { label: "Google Map Leads - verified phone numbers", icon: "🗺️", action: "switch_tool", value: "google-map-leads" },
        { label: "Instagram Leads - direct DM option", icon: "📸", action: "switch_tool", value: "instagram-india" },
        { label: "Different niche/keyword try karo", icon: "🔤" },
      ],
      sources: "Google Search + Firecrawl",
    }),
  },

  /* ── Instagram Leads ──────────────────────────────────────────────────── */
  "instagram": {
    "no_results": ({ niche = "", city = "", accountType = "business", minFollowers, maxFollowers }) => ({
      headline: `Instagram pe "${niche}" ${city ? `in ${city}` : ""} nahi mila`,
      whyNote: `Instagram search specific account types aur content patterns pe depend karta hai. ${niche} ke liye ya toh accounts limited hain, ya search terms Instagram ke algorithm se match nahi ho rahi. ${minFollowers ? `${minFollowers}-${maxFollowers} follower range bhi results restrict kar raha hai.` : ""}`,
      tip: `Niche English mein aur broader rakho. "Salon" ki jagah "Beauty" ya "Skincare" try karo. Location filter hatao - phir manually city filter karo results mein.`,
      chips: [
        ...(minFollowers ? [{ label: "Follower filter hatao", icon: "👥", action: "clear_follower_filter" }] : []),
        { label: "Try Influencer instead of Business", icon: "⭐", action: "set_account_type", value: "influencer" },
        { label: "Try D2C Brand", icon: "🛍️", action: "set_account_type", value: "d2c-brand" },
        { label: "Location hatao - broader search", icon: "📍", action: "clear_location" },
      ],
      tip2: accountType === "business"
        ? "Business accounts pe Instagram contact info nahi deti. Try 'Influencer' ya 'D2C Brand' - wahan WhatsApp/email zyada milta hai."
        : null,
      sources: "Instagram Search + Profile Scraping",
    }),
    "follower_range": ({ niche = "", minFollowers, maxFollowers }) => ({
      headline: `${minFollowers?.toLocaleString()}-${maxFollowers?.toLocaleString()} follower range mein ${niche} accounts nahi mile`,
      whyNote: `Yeh follower range bahut narrow ya bahut specific hai. India mein ${niche} niche mein zyada accounts nano (1K-10K) aur micro (10K-100K) category mein hain. 100K+ accounts rare hain aur usually already agencies ke through book hain.`,
      tip: "1,000-10,000 (nano-influencers) best ROI dete hain - high engagement, easy to contact, affordable. Yeh range try karo.",
      chips: [
        { label: "Try 1K - 10K (Nano)", icon: "📊", action: "set_followers", min: 1000, max: 10000 },
        { label: "Try 10K - 100K (Micro)", icon: "📊", action: "set_followers", min: 10000, max: 100000 },
        { label: "Follower filter completely hatao", icon: "🗑️", action: "clear_follower_filter" },
      ],
      sources: "Instagram Search",
    }),
  },

  /* ── LinkedIn Leads ───────────────────────────────────────────────────── */
  "linkedin": {
    "no_results": ({ niche = "", city = "", state = "", country = "", jobTitle = "" }) => ({
      headline: `LinkedIn pe "${niche}" ${city || state ? `in ${city || state}` : ""} nahi mile`,
      whyNote: `LinkedIn India mein tier-2/3 cities mein professionals ki listing kam hoti hai. ${niche} ke liye job titles alag ho sakti hain LinkedIn pe - jaise "CA" ki jagah "Chartered Accountant" ya "Finance Professional". ${state && !["Delhi","Maharashtra","Karnataka","Telangana"].includes(state) ? `${state} mein LinkedIn users metropolitan cities se kam hain.` : ""}`,
      tip: `Location broader karo - "${city || state || "current location"}" ki jagah "${["Delhi NCR", "Mumbai", "Bangalore"].includes(city) ? "All India" : "Delhi NCR ya Mumbai"}" try karo. LinkedIn pe tier-1 cities mein zyada professionals actively listed hain.`,
      chips: [
        { label: "Try Delhi NCR", icon: "📍", action: "set_location", value: "Delhi" },
        { label: "Try Mumbai", icon: "📍", action: "set_location", value: "Maharashtra" },
        { label: "Try All India", icon: "🇮🇳", action: "set_location", value: "" },
        ...(jobTitle ? [{ label: "Job title hatao - broader search", icon: "💼", action: "clear_job_title" }] : []),
      ],
      sources: "LinkedIn (Serper + Firecrawl)",
    }),
  },

  /* ── Group Finder ─────────────────────────────────────────────────────── */
  "group-finder": {
    "no_results": ({ niche = "", platforms = [], country = "" }) => ({
      headline: `"${niche}" ke groups nahi mile`,
      whyNote: `Group search specific keywords pe depend karta hai. Groups usually generic industry terms se named hote hain - specific product names se nahi. ${platforms.includes("telegram") && !platforms.includes("whatsapp") ? "Telegram pe India mein WhatsApp se kam B2B groups hain." : ""} ${country && country !== "India" ? `${country} mein WhatsApp/Telegram group discovery limited hai.` : ""}`,
      tip: `English terms use karo aur broader rakho - "${niche}" ki jagah generic words try karo jaise "Business", "Buyers", "Sellers", "Network", "Deals". WhatsApp India mein sabse zyada active hai.`,
      chips: [
        { label: "WhatsApp add karo", icon: "💬", action: "add_platform", value: "whatsapp" },
        { label: "Telegram add karo", icon: "✈️", action: "add_platform", value: "telegram" },
        { label: "Niche broad karo (e.g. Business → Buyers)", icon: "🔤" },
        { label: "English keywords try karo", icon: "🇬🇧" },
      ],
      sources: "WhatsApp / Telegram / Facebook Groups",
    }),
  },

  /* ── Exim (domestic) ──────────────────────────────────────────────────── */
  "exim": {
    "no_results": ({ product = "", state = "", tradeType = "both" }) => ({
      headline: `"${product}" ${tradeType} ${state ? `in ${state}` : ""} - leads nahi mile`,
      whyNote: `${state ? `${state} mein` : "Is location par"} "${product}" ke ${tradeType === "exporter" ? "exporters" : tradeType === "importer" ? "importers" : "exporters/importers"} ki public data availability limited hai. India mein export-import data primarily major trade hubs mein concentrate hota hai.`,
      tip: `Product term simplify karo - "${product}" ki jagah shorter keyword try karo. Ya state broader rakhke "India" level search karo.`,
      chips: [
        { label: "Try All India (state hatao)", icon: "🇮🇳", action: "clear_state" },
        { label: "Product term simplify karo", icon: "✏️" },
      ],
      sources: "DGFT + IndiaMart + Zauba + ImportYeti",
    }),
  },
};

/* ── Get static response ──────────────────────────────────────────────────── */
function getStaticResponse(tool, issue, context) {
  const toolKnowledge = KNOWLEDGE[tool];
  if (!toolKnowledge) return null;
  const issueHandler = toolKnowledge[issue];
  if (!issueHandler) return null;
  return issueHandler(context || {});
}

/* ══════════════════════════════════════════════════════════════════════════
   POST handler
══════════════════════════════════════════════════════════════════════════ */
export async function POST(request) {
  try {
    const { tool, issue, context = {} } = await request.json();

    if (!tool || !issue) {
      return Response.json({ error: "tool and issue required" }, { status: 400 });
    }

    // Static fast-path first (instant, no AI cost)
    const staticResult = getStaticResponse(tool, issue, context);
    if (staticResult) {
      return Response.json({ success: true, source: "static", ...staticResult });
    }

    // AI fallback for unknown tool/issue combinations
    const toolLabels = {
      "google-map": "Google Map Leads",
      "website-leads": "Website Leads",
      "instagram": "Instagram Leads",
      "linkedin": "LinkedIn Leads",
      "group-finder": "Group Finder",
      "exim": "Export/Import Leads",
    };

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: `You are an expert on Indian B2B lead generation tools. When a user's search fails, explain why in Hinglish (Hindi + English mix) and give actionable tips. Return ONLY valid JSON.`,
      messages: [{
        role: "user",
        content: `Tool: ${toolLabels[tool] || tool}
Issue: ${issue}
Context: ${JSON.stringify(context)}

Return JSON:
{
  "headline": "short title for what happened",
  "whyNote": "2-3 lines in Hinglish explaining why this failed and what the tool actually does",
  "tip": "one specific actionable tip to get results",
  "chips": [
    { "label": "action suggestion 1", "icon": "emoji" },
    { "label": "action suggestion 2", "icon": "emoji" }
  ],
  "sources": "data sources this tool uses"
}
Only return the JSON.`,
      }],
    });

    const raw = msg.content[0]?.text?.trim() || "{}";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    let result = {};
    try { result = JSON.parse(start !== -1 ? raw.slice(start, end + 1) : raw); } catch { result = {}; }

    return Response.json({
      success: true,
      source: "ai",
      headline: result.headline || `${toolLabels[tool] || tool} - search unsuccessful`,
      whyNote: result.whyNote || "Search mein koi issue hua. Different keywords ya location try karo.",
      tip: result.tip || "Search parameters change karke retry karo.",
      chips: result.chips || [],
      sources: result.sources || "",
    });

  } catch (err) {
    console.error("[advisor]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
