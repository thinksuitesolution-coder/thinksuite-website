import { getAIClient } from "@/lib/aiClient";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const client = getAIClient();

const TOOL_CONTEXT = {
  "google-map-leads": {
    name: "Google Map Leads",
    what: "Extracts real, verified businesses from Google Maps — phone numbers, websites, ratings, addresses.",
    how: "You choose a business category (niche) and a city. AI fetches up to 20 real businesses with verified contact details.",
    searchTips: [
      "Be specific with niche: 'dental clinic', 'interior designer', 'cloud kitchen', 'gym' — not just 'business'.",
      "City-level search gives best results. Add area/locality for hyper-local leads.",
      "Use the AI Filter to get only high-rating (4.0+) businesses — these are established clients with budget.",
    ],
    results: "Business name, phone number, website, Google Maps rating, review count, address, Maps link. Export to CSV.",
    bestFor: "Local service businesses: restaurants, clinics, gyms, salons, IT companies, retailers, hotels, real estate agents.",
    avgLeads: "10–20 verified leads per search.",
    pitch: "Call or WhatsApp directly with the phone number. AI generates a personalized cold email for each lead.",
  },
  "website-leads": {
    name: "Website Leads",
    what: "Scrapes business leads from directories, company websites, and online listings using AI.",
    how: "Enter a business type and location. AI searches multiple sources and extracts business contacts.",
    searchTips: [
      "Works best for B2B niches: 'IT company Pune', 'law firm Delhi', 'export agency Ahmedabad'.",
      "Add 'directory' or 'listing' to find aggregated business lists.",
      "Use for industries where businesses list on Just Dial, Sulekha, India Mart etc.",
    ],
    results: "Business name, website URL, email, phone, address. AI-generated cold email included.",
    bestFor: "B2B businesses, agencies, professional services, consultants.",
    avgLeads: "10–20 leads per search.",
    pitch: "Email outreach works best for these leads — they have websites and email addresses.",
  },
  "instagram-india": {
    name: "Instagram Leads (India)",
    what: "Finds Indian businesses with Instagram presence — small businesses that need social media help.",
    how: "Enter your target niche and city. AI finds relevant business Instagram accounts with follower counts and contact info.",
    searchTips: [
      "Filter by followers: 500–5,000 = small businesses (best clients for agencies). 5K–50K = growing brands.",
      "Search: 'cafe Mumbai', 'boutique Jaipur', 'fitness trainer Bangalore', 'salon Delhi'.",
      "Business accounts often have email or phone in bio — that's your direct contact.",
    ],
    results: "Instagram handle, profile URL, followers, bio, email/phone if listed.",
    bestFor: "Social media agencies, content creators, digital marketers, influencer marketers.",
    avgLeads: "10–20 Instagram business leads.",
    pitch: "DM them on Instagram directly, or call/email if contact is in bio.",
  },
  "instagram-leads": {
    name: "Instagram Leads (International)",
    what: "Finds international businesses with Instagram presence across global markets.",
    how: "Enter niche and country/city. AI finds international business accounts with contact details.",
    searchTips: [
      "UAE, UK, USA, Australia have active business Instagram profiles.",
      "Try: 'restaurant Dubai', 'boutique London', 'fitness studio NYC'.",
      "Business profiles in UAE often have WhatsApp in bio.",
    ],
    results: "Instagram handle, profile URL, followers, bio, contact info.",
    bestFor: "International social media management, global digital agencies.",
    avgLeads: "10–20 international Instagram leads.",
    pitch: "DM or email. UAE businesses respond to WhatsApp outreach well.",
  },
  "linkedin-india": {
    name: "LinkedIn Leads (India)",
    what: "Finds Indian decision-makers and professionals on LinkedIn — CEOs, Founders, Marketing Heads, CTOs.",
    how: "Enter industry/niche, city, and target job title. AI extracts matching LinkedIn profiles.",
    searchTips: [
      "Target: 'founder startup Bangalore', 'marketing head ecommerce Mumbai', 'CTO SaaS Pune'.",
      "Decision-maker roles give best results: CEO, Founder, Director, VP, Head of Department.",
      "Add industry for precision: 'HR manager manufacturing Surat', 'accountant CA firm Delhi'.",
    ],
    results: "Name, LinkedIn profile, job title, company, city. AI-generated personalized outreach message.",
    bestFor: "B2B sales, SaaS companies, HR software, recruitment, professional services, consultants.",
    avgLeads: "10–15 LinkedIn decision-maker profiles.",
    pitch: "LinkedIn InMail or connect request with a personalized note using the AI-generated message.",
  },
  "linkedin-leads": {
    name: "LinkedIn Leads (International)",
    what: "Finds international decision-makers on LinkedIn across global markets.",
    how: "Enter industry, country, and target job title. AI extracts relevant LinkedIn profiles.",
    searchTips: [
      "UAE, Singapore, UK, USA have high LinkedIn activity.",
      "Try: 'CMO fintech Singapore', 'startup founder UAE', 'CTO SaaS UK'.",
      "Founder/C-suite = high deal value.",
    ],
    results: "Name, LinkedIn profile, title, company, location.",
    bestFor: "International B2B, global SaaS, cross-border professional services.",
    avgLeads: "10–15 international LinkedIn leads.",
    pitch: "LinkedIn InMail with a personalized message. International founders respond well to clear ROI pitches.",
  },
  "exim-domestic": {
    name: "Exporter / Importer Leads (India)",
    what: "Finds verified Indian exporters and importers with direct contact details.",
    how: "Enter the product/commodity and state. AI finds active traders in that product category.",
    searchTips: [
      "Be specific with product: 'textile exporter Gujarat', 'spice exporter Kerala', 'IT equipment importer Delhi'.",
      "Use HS code for precision (e.g., HS 8471 for computers).",
      "Exporters = high-revenue businesses. Importers = need your sourcing services.",
    ],
    results: "Company name, contact person, phone, email, city, product, trade type, HS code.",
    bestFor: "Freight/logistics, trade finance, packaging, B2B product sales, custom clearance agents.",
    avgLeads: "10–20 verified trader leads.",
    pitch: "Call directly — traders are very responsive to phone calls. Mention their product specifically.",
  },
  "exim-intl": {
    name: "International Exporters / Importers",
    what: "Finds verified international traders and import-export companies globally.",
    how: "Enter product and country. AI finds matching international trade companies.",
    searchTips: [
      "UAE = major import hub. Germany, USA = large importers of manufactured goods.",
      "Try: 'electronics importer USA', 'pharmaceutical buyer Germany', 'textile buyer UAE'.",
      "Combine HS code with country for precise results.",
    ],
    results: "Company, country, contact, product, trade volume.",
    bestFor: "International logistics, freight, trade finance, B2B product exporters.",
    avgLeads: "10–20 international trader leads.",
    pitch: "Email with product specifications and pricing. International traders respond to clear business proposals.",
  },
  "tender-india": {
    name: "Government Tenders (India)",
    what: "Finds active Indian government tenders from GEM, eProcure CPPP, and 20+ state portals.",
    how: "Describe your business to the AI bot. It analyzes your profile and finds matching tenders.",
    searchTips: [
      "Describe your business naturally: 'solar panel supplier', 'IT software company', 'road construction firm'.",
      "Filter by state to find local government contracts.",
      "Tender type filter: Goods, Works, Services, Consultancy.",
    ],
    results: "Tender title, issuing authority, tender value, deadline, source portal, AI suitability score.",
    bestFor: "Government contractors, product suppliers, IT companies, construction firms, consultants.",
    avgLeads: "10–20 relevant tender opportunities.",
    pitch: "Read the tender document carefully. AI generates a bid summary to help you decide.",
  },
  "tender-intl": {
    name: "International Government Tenders",
    what: "Finds international government and multilateral tenders — World Bank, ADB, UN, bilateral agencies.",
    how: "Select sector and country. AI finds matching international procurement opportunities.",
    searchTips: [
      "World Bank + UN tenders = large value. India-eligible filter for Indian companies.",
      "Africa has massive infrastructure tenders. UAE has IT and services tenders.",
      "Filter by funding source to find your best opportunities.",
    ],
    results: "Tender title, country, authority, value, deadline, funding source.",
    bestFor: "International contractors, consultancies, NGOs, large product suppliers.",
    avgLeads: "10–20 international tender listings.",
    pitch: "Check eligibility carefully. World Bank tenders require DUNS number and company registration.",
  },
  "group-domestic": {
    name: "Group Finder (India)",
    what: "Finds relevant WhatsApp, Telegram, Facebook, LinkedIn groups where your target customers gather.",
    how: "Enter your business niche. AI finds groups on multiple platforms with their join links.",
    searchTips: [
      "Try: 'real estate buyers WhatsApp Delhi', 'restaurant owners Telegram India', 'startup founders Facebook'.",
      "WhatsApp groups = direct access to decision-makers in smaller businesses.",
      "LinkedIn groups = professional buyers with budget.",
    ],
    results: "Group name, platform, join link, member count, activity level.",
    bestFor: "Community selling, finding concentrated target audiences, networking.",
    avgLeads: "10–20 relevant group links.",
    pitch: "Join the group. Observe for a few days. Then introduce yourself naturally with value first.",
  },
  "group-intl": {
    name: "Group Finder (International)",
    what: "Finds international WhatsApp, Telegram, and LinkedIn groups of potential customers globally.",
    how: "Enter niche and country. AI finds global groups on multiple platforms.",
    searchTips: [
      "Telegram groups are common in UAE, Middle East, and Southeast Asia.",
      "Facebook groups are popular in Africa and Latin America.",
      "LinkedIn groups work for professional niches in UK, USA, Europe.",
    ],
    results: "Group name, platform, join link, country, member count.",
    bestFor: "International community selling, global audience discovery.",
    avgLeads: "10–20 international group links.",
    pitch: "Join and observe first. Position yourself as an expert, not a spammer.",
  },
  "freelancer-leads": {
    name: "Projects (Freelancer Client Leads)",
    what: "Finds people actively posting that they need your exact service done — real hiring intent with budget.",
    how: "Enter your service/skill. AI scans Reddit, IndieHackers, HackerNews, ProductHunt for live project posts.",
    searchTips: [
      "Use specific service terms: 'web development', 'logo design', 'SEO services', 'content writing'.",
      "Posts with [HIRING] tag in Reddit r/forhire often have budget mentioned.",
      "IndieHackers = startup founders with real budget and recurring needs.",
    ],
    results: "Poster name, platform, project requirement, budget, email/phone if available, direct post URL.",
    bestFor: "Freelancers, agencies, consultants looking for active, warm project leads.",
    avgLeads: "10–15 client project leads with hiring intent.",
    pitch: "Reply to their post immediately — speed matters. Reference their specific requirement.",
  },
  "startup-founders": {
    name: "Startup Founder Leads",
    what: "Finds startup founders actively looking for your service — people building products who need help.",
    how: "Enter your service. AI finds founders on IndieHackers, ProductHunt, HN, Reddit who need that service.",
    searchTips: [
      "Try: 'mobile app development', 'UI/UX design', 'digital marketing', 'growth hacking'.",
      "Startup founders have recurring needs and often become long-term clients.",
      "IndieHackers founders are bootstrapped but motivated buyers.",
    ],
    results: "Founder name, platform, what they're building, service they need, contact info.",
    bestFor: "Agencies, freelancers, tools/software targeting early-stage startups.",
    avgLeads: "10–15 startup founder leads.",
    pitch: "Show you understand their product. Founders respond to peers, not salespeople.",
  },
  "mca-companies": {
    name: "MCA Fresh Companies",
    what: "Finds companies freshly registered with MCA (Ministry of Corporate Affairs) — brand new businesses.",
    how: "Select state, company type, registration date range. AI finds newly incorporated companies.",
    searchTips: [
      "New companies need everything: website, GST, accounting software, banking, office supplies.",
      "Filter: last 30 days = hottest leads. Last 90 days = still early-stage.",
      "Private Limited companies have bigger budgets than sole proprietors.",
    ],
    results: "Company name, director name, registration date, city, state, contact info, AI-generated pitch.",
    bestFor: "B2B products/services: web design, accounting software, HR tools, insurance, office supplies.",
    avgLeads: "10–20 freshly registered company leads.",
    pitch: "Contact immediately — you're the first vendor they talk to. Lead with congratulations on their incorporation.",
  },
  "intl-companies": {
    name: "Global Companies",
    what: "Finds international companies by country and industry with AI-enriched contact details.",
    how: "Select country, industry, company size. AI sources companies and generates contact details.",
    searchTips: [
      "UAE, Singapore = easy international B2B. High English proficiency, fast decision-making.",
      "Filter by company size: SMBs (10–200 employees) = faster decisions, smaller deal cycles.",
      "Industry filter: fintech UAE, manufacturing Germany, retail Australia.",
    ],
    results: "Company name, country, industry, size, director, phone, website, AI pitch and call script.",
    bestFor: "International B2B expansion, global service providers, SaaS going international.",
    avgLeads: "10–20 international company leads.",
    pitch: "Personalize to their country. UAE = WhatsApp. UK/USA = email. Germany = formal structured email.",
  },
  "trigger-leads": {
    name: "Trigger Leads (Job Intent)",
    what: "Companies posting job ads = buying signal. Converts job postings into your sales opportunities.",
    how: "Select the job role they're hiring + state. AI finds companies hiring that role and generates a pitch.",
    searchTips: [
      "Hiring 'Digital Marketing Manager' → they need an agency that does what the hire would do.",
      "Hiring 'React Developer' → they're building a product and need a dev agency/partner.",
      "Hiring 'Sales Executive' → pitch CRM, lead gen, or sales automation tools.",
    ],
    results: "Company name, director, phone, website, job posting details, AI pitch, ready-to-use call script.",
    bestFor: "Digital agencies, SaaS companies, service providers targeting companies with proven budgets.",
    avgLeads: "6–12 high-intent trigger leads.",
    pitch: "Call with the script provided. Open with: 'I noticed you're hiring X — we help companies like yours get the same results without the full-time hire cost.'",
  },
  "intl-map-leads": {
    name: "International Google Map Leads",
    what: "Extracts real businesses from Google Maps in international markets with contact details.",
    how: "Choose business category, country, and city. AI fetches verified businesses from Google Maps.",
    searchTips: [
      "UAE, Singapore, UK, USA have rich Google Maps data with phone + website.",
      "Try: 'restaurant Dubai', 'clinic Singapore', 'IT company London', 'gym NYC'.",
      "Filter by rating to target established businesses.",
    ],
    results: "Business name, phone, website, rating, review count, address, Maps link.",
    bestFor: "International market entry, cross-border B2B, global service providers.",
    avgLeads: "10–20 verified international business leads.",
    pitch: "Cold email or call. Mention their rating or number of reviews — shows you did your research.",
  },
  "intl-web-leads": {
    name: "International Website Leads",
    what: "Scrapes international business leads from directories and online listings globally.",
    how: "Enter business type and country. AI searches directories and extracts business contacts.",
    searchTips: [
      "European businesses often list emails on websites — high email deliverability.",
      "Try: 'marketing agencies UAE', 'tech startups Australia', 'consulting firms UK'.",
      "US businesses are well-indexed — search with specific niche and city.",
    ],
    results: "Business name, website, email, phone, location.",
    bestFor: "International B2B email campaigns, global agency outreach.",
    avgLeads: "10–20 international business leads.",
    pitch: "Short, personalized email. Mention something specific about their market or industry.",
  },
};

export async function POST(request) {
  try {
    const { toolId, businessDesc, language = "english", history = [], followUp = "" } = await request.json();

    if (!businessDesc?.trim() && !followUp?.trim()) {
      return NextResponse.json({ error: "Business description is required" }, { status: 400 });
    }

    const ctx = TOOL_CONTEXT[toolId] || TOOL_CONTEXT["google-map-leads"];

    const isHinglish = language === "hinglish";

    const systemPrompt = `You are a lead generation expert and business advisor for Thinksuite's "${ctx.name}" tool.

TOOL CONTEXT:
- Tool: ${ctx.name}
- What it does: ${ctx.what}
- How it works: ${ctx.how}
- Best results for: ${ctx.bestFor}
- Average leads per search: ${ctx.avgLeads}
- Search tips: ${ctx.searchTips.map((t, i) => `${i + 1}. ${t}`).join(" ")}
- Data you get: ${ctx.results}
- Pitch advice: ${ctx.pitch}

YOUR JOB:
1. Understand the user's business from their description
2. Give SPECIFIC, ACTIONABLE advice for using "${ctx.name}" for THEIR business
3. Tell them EXACTLY what to type in the search fields (give real examples)
4. Tell them what results they'll get and how to use them
5. Give 2-3 power tips specific to their business + this tool
6. Keep it conversational and friendly — not a list of features

LANGUAGE RULE: ${isHinglish
  ? "Respond in Hinglish (mix of Hindi and English). Use Roman script for Hindi words. Keep technical terms in English. Sound like a knowledgeable friend explaining to another Indian professional. Example style: 'Bhai, agar tu digital marketing agency chalata hai, toh Google Map Leads mein restaurant ya salon search kar — unhe social media manager chahiye hi hoga, aur directly phone number milega.'"
  : "Respond in clear, friendly English. Sound like a knowledgeable colleague, not a salesperson."
}

RULES:
- Be specific — use their exact business type in your advice
- Give real search term examples they can copy-paste
- Keep response under 200 words
- No bullet-point dumps — write naturally in short paragraphs
- End with ONE specific action they should take right now`;

    const userMessage = followUp?.trim()
      ? followUp.trim()
      : `My business: ${businessDesc.trim()}. Tell me how to best use ${ctx.name} for my specific business.`;

    const messages = [
      ...history.slice(-6),
      { role: "user", content: userMessage },
    ];

    const res = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 450,
      system:     systemPrompt,
      messages,
    });

    const reply = res.content.find(b => b.type === "text")?.text?.trim() || "";

    return NextResponse.json({ reply, toolId, language });
  } catch (err) {
    console.error("[guide-bot]", err);
    return NextResponse.json({ error: err.message || "Guide bot failed" }, { status: 500 });
  }
}
