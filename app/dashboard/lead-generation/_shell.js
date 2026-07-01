"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { usePlan } from "@/app/contexts/PlanContext";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  pageBg:       "linear-gradient(135deg,#0f172a 0%,#1a1040 60%,#0f172a 100%)",
  sidebarBg:    "rgba(10,12,28,0.97)",
  navBg:        "rgba(10,12,28,0.97)",
  navBorder:    "rgba(255,255,255,0.07)",
  cardBg:       "rgba(255,255,255,0.05)",
  cardBorder:   "rgba(255,255,255,0.08)",
  text:         "#ffffff",
  textMuted:    "rgba(255,255,255,0.42)",
  accent:       "#7c3aed",
  accentDim:    "rgba(124,58,237,0.12)",
  accentBorder: "rgba(124,58,237,0.3)",
  success:      "#3b82f6",
};

/* ── All tools for sidebar ─────────────────────────────────────────────────── */
const SIDEBAR_TOOLS = [
  { slug: "studio",          icon: "◈",  label: "Content Studio",   color: "#7c3aed" },
  { slug: "imagestudio",     icon: "🖼",  label: "Image Studio",     color: "#7c3aed" },
  { slug: "voice",           icon: "🎙",  label: "Voice Studio",     color: "#3b82f6" },
  { slug: "ai-video-studio",   icon: "🎬",  label: "AI Video Studio",     color: "#7c3aed" },
  { slug: "lead-generation", icon: "🎯",  label: "Lead Generation",  color: "#3b82f6" },
  { slug: "prompt-maker",    icon: "✨",  label: "Prompt Maker",     color: "#7c3aed" },
  { slug: "vision-ai",       icon: "👁️",  label: "Vision AI",        color: "#3b82f6" },
  { slug: "website-analyzer",    icon: "🌐",  label: "Website Analyzer", color: "#3b82f6" },
  { slug: "government-tenders",  icon: "📋",  label: "Gov Tenders",      color: "#3b82f6" },
  { slug: "database",            icon: "🗄️",  label: "Lead Database",    color: "#10b981" },
];

/* ── Quick Tips data per tool ──────────────────────────────────────────────── */
const TOOL_QUICK_TIPS = {
  "studio": {
    what: "Content Studio instantly generates blog posts, articles, social media content, product descriptions, and all types of marketing copy using AI.",
    how: "Select a topic, target audience, and desired tone. AI structures SEO-friendly, engaging content ready to publish directly.",
    benefits: ["Hours of writing work done in minutes", "Maintain a consistent brand voice", "Multiple content formats in one tool"],
    english: "Content Studio runs 4 AI agents together -Trend Scout finds what's going viral, Viral Potential Score (1-100) predicts success, Script Generator creates complete scripts, and Hook Generator produces 5 psychological opening variations for A/B testing.",
    flow: ["Enter niche or topic", "Trend Scout scans in real time", "Viral Score calculated (70+ = Go!)", "Full hook+body+CTA script generated", "5 hook variations choose the best"],
    detail: "4 AI agents: (1) Trend Scout → real-time trending topics across 50+ niches YouTube, Twitter, Google Trends, Reddit sources; (2) Viral Potential Score → scores 5 factors (emotional trigger, timeliness, uniqueness, hook strength, shareability) proceed at 70+; (3) Script Generator → complete hook+body+CTA structure, platform-specific length; (4) Hook Generator → 5 hook types (Curiosity, Benefit, Shock, Story, Question). Pro workflow: Trend Scout → high-score topic → Script → choose best Hook.",
  },
  "imagestudio": {
    what: "Image Studio is a professional AI-powered image editing tool background removal, generative AI fill, image enhancement, and bulk batch processing, all in one place.",
    how: "Upload an image and choose an operation (background remove / AI fill / upscale). AI automatically generates a high-quality output.",
    benefits: ["Professional photos without a photographer", "Save time and cost with bulk editing", "Create e-commerce-ready visuals instantly"],
    english: "AI Image Studio puts DALL-E 3, GPT Image 1, and Gemini in one platform. Generate images from prompts, create 10+ bulk variations for A/B testing, upscale any image to 4x HD resolution, and remove backgrounds with one click.",
    flow: ["Choose mode (Generate / Bulk / Upscale / BG Remove)", "Write prompt or upload image", "Select model and style settings", "Click Generate / Process", "Download ready image"],
    detail: "4 key features: Generate (text → image, DALL-E 3 for artistic / GPT Image 1 for photorealism specific prompts give best results, mention lighting+mood+style), Bulk Mode (one prompt → 10+ A/B test variations for campaigns), Upscale (any low-res image → 4x HD print-ready, AI intelligently fills detail unlike blurry regular resize), Background Remove (one-click transparent PNG, accurate on complex edges too). Pro tip: shoot product photos on a plain background AI creates a transparent cutout, no photographer needed.",
  },
  "voice": {
    what: "Voice Studio converts text to 100+ realistic AI voices. Hindi, English, and regional languages are supported perfect for voiceovers, podcasts, and audio content.",
    how: "Paste your text and choose a voice style and language. AI generates natural, human-like audio that you can download and use directly.",
    benefits: ["Professional voiceovers without a studio", "Make content accessible for visually impaired audiences", "Instant audio for videos and presentations"],
    english: "AI Voice Studio converts text to studio-quality audio in 28+ languages with 100+ voice options. Key features: voice cloning from a 30-second sample (99% accuracy), speed and pitch control, emotional presets, and instant MP3/WAV download in under 10 seconds.",
    flow: ["Paste your script", "Choose language + voice", "Adjust speed / pitch (optional)", "Click Generate", "Download MP3 in 10 seconds"],
    detail: "Key features: Language Selection (28+ languages especially strong Indian accents: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada), Voice Cloning (upload 30-sec clear audio → exact clone created → use unlimited times ideal for brand voice consistency), Speed Control (0.5x for audiobooks → 1.5x for social media), Emotional Presets (Excited, Calm, Serious, Friendly one-click mood change). Download formats: MP3 (192kbps most compatible), WAV (uncompressed, for studio editing), OGG (web streaming). Voice cloning tip: recording without background noise gives the best results.",
  },
  "video": {
    what: "Video Studio uses AI to enhance existing videos 4K upscale, text/watermark removal, frame interpolation, and overall video quality improvement.",
    how: "Upload a video and choose an enhancement type. AI automatically completes the processing and prepares an improved version.",
    benefits: ["Transform low-quality videos to HD/4K", "Restore old footage", "Professional post-production without expensive software"],
    english: "AI Video Studio creates videos from text (Veo 2 by Google), generates talking avatars, syncs new audio to existing face videos (lip sync), and animates static images -four powerful modes powered by Google's latest AI.",
    flow: ["Choose mode (Text to Video / Avatar / Lip Sync / Image to Video)", "Provide input (text script / face photo / audio file / static image)", "Select style + duration settings", "AI processes it", "Download video"],
    detail: "4 modes breakdown: Text to Video use Veo 2, specific scene descriptions give best results (camera angle, setting, mood, lighting), commercial license included; Avatar Generation 20+ photorealistic presenter styles, can also create a custom avatar from your photo, speaks in 20+ languages; Lip Sync replace audio in existing videos (95%+ accuracy, perfect for Hindi dubbing); Image to Video Ken Burns/Parallax/Zoom/Ambient motion styles available. Best use cases: product demos → Text to Video, multilingual reach → Lip Sync, e-commerce → Image to Video animations.",
  },
  "video-studio": {
    what: "AI Video Studio creates complete AI-generated videos from just a text description AI handles everything from script to visuals.",
    how: "Write a video concept or script and choose a style and duration. AI automatically generates scenes, transitions, and a complete video.",
    benefits: ["Video production cost is practically zero", "No technical skills or equipment needed", "Convert content ideas into video instantly"],
    english: "AI Video Studio generates complete videos from just a text description -scenes, visuals, and transitions all AI-generated using the latest generation video models. No camera, crew, or editing software needed.",
    flow: ["Describe your video concept", "Choose style + duration", "AI generates scenes", "Preview the result", "Download and publish"],
    detail: "For text-to-video, specific scene descriptions give best results: camera angle (close-up, wide shot, aerial view), setting (modern office, busy street, nature), mood (professional, energetic, emotional), lighting style (soft natural light, dramatic studio). Duration: 5-30 second clips generated per scene. Combine multiple clips to build a full video. Commercial license included use freely on YouTube, ads, and social media. Pro tip: add 'cinematic', 'photorealistic', '4K quality' to your prompt for premium output.",
  },
  "lead-generation": {
    what: "The Lead Generation tool automatically extracts verified real business contacts from Google Maps, websites, and Instagram build a complete lead pipeline with zero manual research.",
    how: "Select a location, industry, and target niche. AI scrapes real-time data and builds a clean, deduplicated lead list ready for direct CSV export.",
    benefits: ["Hundreds of qualified leads in minutes", "Completely eliminate manual prospecting", "Get immediately ready data for sales outreach"],
    english: "Lead Generation finds 100+ targeted B2B leads from Google Maps, websites, and Instagram using Vibe Prospecting AI. Includes AI cold email via Gmail, auto meeting booking with Google Calendar, personalized copy generation, and CSV/CRM export.",
    flow: ["Choose lead source (Maps/Website/Instagram)", "Set filters (industry/location/size)", "AI finds leads", "Cold email + meeting booking", "Export to CSV or CRM"],
    detail: "4 lead sources: Google Maps (local businesses by city+niche, verified phone+address+website), Website Leads (decision-maker contacts from any directory or company website), Instagram Leads (active business profiles by niche hashtag/location), LinkedIn Leads (professional B2B contacts). Plus: AI Copy Generator (personalized cold email, WhatsApp, LinkedIn DM for selected leads 3-5x higher response rates than generic). Auto meeting booking: Google Calendar integration lets prospects book a time slot directly no more back-and-forth emails. Lead scoring: contact priority leads first.",
    features: {
      "maps": {
        what: "Google Map Leads extracts verified names, phone numbers, addresses, and websites of Google Maps-listed businesses based on city and business type.",
        how: "Choose a state, city, and business niche. AI scans Google Maps results and delivers contact details in a clean format.",
        benefit: "Find prospects in the local market instantly no phone directory or manual Google search needed.",
        english: "Google Map Leads fetches verified business names, phone numbers, addresses, and websites from Google Maps for any city and business type. Each result includes Google rating, review count, and website URL -ready for immediate outreach.",
        flow: ["Choose state + city", "Enter business type / niche", "AI scans Google Maps", "Verified contacts list ready", "Download CSV or send cold email"],
        detail: "Best use cases for Google Map Leads: local service businesses (digital agencies, CA firms, clinics, salons, restaurants, real estate offices). Each lead includes: business name, phone number, address, website URL, Google Maps rating, total review count. 20 leads per search (current plan). Pro tip: use specific niche keywords 'digital marketing agency Mumbai' instead of just 'marketing' leads are far more targeted. Rating filter: contact 4+ star businesses first they have budgets for quality services.",
      },
      "website": {
        what: "Website Leads automatically extracts contact persons, email addresses, phone numbers, and business information from any company or directory website.",
        how: "Paste the target website URL. AI analyzes the page structure and compiles all contact details into a clean table.",
        benefit: "Get direct decision-maker contacts for cold outreach without hours of manual research.",
        english: "Website Leads extracts all contact persons, email addresses, phone numbers, and business details from any company or directory website automatically. Works on company 'Contact Us' pages, business directories, and industry portals.",
        flow: ["Paste target website URL", "Choose extract mode", "AI analyzes page structure", "Contacts extracted", "Download CSV"],
        detail: "Website extraction works on: company websites (decision-maker info from About/Contact pages name, designation, email, phone), business directories (Justdial, IndiaMART, Sulekha, TradeIndia), industry portals. Multi-page extraction: process multiple pages of a site at once. Output: name, designation, email, phone, department, company. Pro tip: company sites with 'Contact Us' and 'Our Team' pages give best results both email and phone are more often available. Bulk extraction from directories: pull 50+ company contacts in one session.",
      },
      "instagram": {
        what: "Instagram Leads finds business Instagram profiles using niche-specific hashtags or location-based search and gathers their contact information.",
        how: "Enter industry keywords or hashtags. AI scans relevant business profiles and collects email, website, and contact details.",
        benefit: "Get warm leads from social media who are already active and engaged in your niche.",
        english: "Instagram Leads finds business profiles in your target niche using hashtag and location search. Gathers email, website, phone (from bio), follower count, and engagement data -warm leads who are actively marketing their business on social media.",
        flow: ["Enter industry hashtags (#digitalmarketing etc)", "Add location (optional)", "AI scans business profiles", "Contact details + social data ready", "Outreach list ready"],
        detail: "Best use cases for Instagram Leads: fashion brands, fitness studios, restaurants, real estate agents, event organizers, beauty salons any business actively posting on Instagram. Search by: industry hashtags (#realestate, #fitnessindia, #digitalmarketing), location-based discovery (businesses in a specific city), competitor followers (potential customers in their audience). Each lead: Instagram handle, bio text, email (if in bio), website link, follower count, estimated engagement rate. Warm lead advantage: these businesses are already investing in marketing receptive to social media services or products.",
      },
      "__copy__": {
        what: "Copy Generator instantly creates AI-powered personalized sales messages, cold emails, WhatsApp outreach scripts, and LinkedIn messages for selected leads.",
        how: "Select a lead and choose a message type. AI creates compelling, personalized outreach copy based on the lead's industry and business context.",
        benefit: "Increase response rates 3x with personalized outreach targeted messages instead of generic templates.",
        english: "Lead Ad Campaign Generator creates personalized cold emails, WhatsApp messages, LinkedIn InMails, and SMS for selected leads using AI. Each message is tailored to the lead's specific industry, company context, and pain points -not generic templates.",
        flow: ["Select lead(s)", "Choose message type (Email/WhatsApp/LinkedIn/SMS)", "Describe tone and offer", "AI generates personalized copy", "Review, copy, send"],
        detail: "AI personalizes Copy Generator output using: lead's industry-specific pain points, company size-appropriate messaging tone, your value proposition aligned with their needs. Output types: Cold Email (subject line A/B variants + body + CTA), WhatsApp Message (conversational, mobile-first format), LinkedIn InMail (professional, connection-first approach), SMS (ultra-concise, urgency-focused). Generate multiple variations pick the best-performing one. Follow-up sequence: AI also suggests a 3-touch follow-up plan (Day 1 intro → Day 4 value add → Day 8 final follow-up). Response rates 3-5x higher than generic templates.",
      },
    },
  },
  "lead-copy": {
    what: "Lead Copy Generator instantly creates powerful sales emails, cold DMs, LinkedIn InMail, and WhatsApp outreach scripts using AI that deliver real results.",
    how: "Describe the lead info and your product/service. AI prepares personalized, conversion-optimized copy tailored to the prospect's pain points.",
    benefits: ["Higher email open and reply rates", "Instantly create multiple A/B test variants", "Dramatically increase sales team productivity"],
    english: "Lead Copy Generator creates high-converting personalized sales copy for any prospect -cold emails, LinkedIn InMails, WhatsApp messages, and SMS. AI tailors each message to the prospect's industry, role, and pain points for maximum response rates.",
    flow: ["Provide prospect info (industry/role/company)", "Choose message type", "Describe your offer + USP", "AI generates personalized copy", "A/B test and use the best version"],
    detail: "Copy Generator features: Multiple message types (Cold Email with subject line variants, LinkedIn connection message + InMail, WhatsApp conversational format, SMS ultra-short), A/B test variants (3-5 different angles per message), Follow-up sequences (complete 3-5 touch sequence plan), Industry customization (B2B SaaS, real estate, agency, consulting different language and hooks). Personalization checklist: always include the prospect's company name, one specific observation about their business, a clear value proposition, easy CTA (5-min call, quick demo). Generic messages = 1-2% reply rate; Personalized = 8-15% reply rate.",
  },
  "prompt-maker": {
    what: "Prompt Maker provides expert guidance for designing perfect, structured, and highly effective prompts for AI tools like ChatGPT, MyThinkAI, Midjourney, and more.",
    how: "Describe what you want to achieve. AI uses the best prompting techniques, chain-of-thought structures, and context optimization to prepare the ideal prompt.",
    benefits: ["Get significantly better quality outputs from AI", "Professionally develop your prompting skills", "Stop wasting time on poor prompts"],
    english: "Prompt Maker lets you write your idea in plain English - AI asks 5 smart clarifying questions, then MyThinkAI synthesizes everything into a perfect, structured English prompt ready for DALL-E, ChatGPT, Midjourney, or any AI tool.",
    flow: ["Write your raw idea in English", "AI analyzes your input", "5 clarifying questions", "Provide answers (minimum 2)", "Perfect structured English prompt ready"],
    detail: "3-step process: (1) Input - write your idea in English; (2) Clarification - 5 targeted questions: audience, style/tone, specific elements, output format, examples/references - answer at least 2; (3) Output - MyThinkAI professional prompt engineering format: role definition + context + detailed instructions + output format + constraints. 7 categories: Image Generation (DALL-E/Midjourney), Writing/Blogs, Code, AI Chatbot systems, Video Scripts, Marketing Copy, Custom. Pro tip: answer more questions = more accurate prompt = dramatically better AI output.",
  },
  "vision-ai": {
    what: "Vision AI deeply analyzes images extract handwritten text, pull data from charts, identify objects, and get detailed insights from visual content.",
    how: "Upload an image or paste a URL and describe what you want to know. AI processes the visual content and delivers structured, actionable information.",
    benefits: ["Instantly digitize documents and receipts", "Convert visual data to usable text", "Dramatically speed up image-based research and analysis"],
    english: "Vision AI analyzes any image with MyThinkAI's vision model -generate content from images, extract text via OCR (printed and handwritten), detect brand logos and count objects, and score ad creative effectiveness on a 0-100 scale.",
    flow: ["Upload image (max 3MB)", "Choose analysis mode (Content/OCR/Brand/Ad Score)", "AI analyzes with MyThinkAI Vision", "Structured results ready", "Use or copy data"],
    detail: "4 analysis modes: (1) Create Content from Image product photos auto-generate Instagram captions+hashtags, Facebook posts, alt text, product descriptions in multiple languages; (2) Extract Data OCR extracts all fields from invoices/receipts/business cards/forms, tables are accurate, handwritten text ~80% accuracy; (3) Analyze Brand & Objects logo detection, object counting, text reading, scene understanding retail shelf audits, brand monitoring; (4) Ad Performance Insights scores 6 factors (visual hierarchy, text-image balance, color psychology, CTA clarity, emotional trigger, platform fit) + improvement suggestions. Pro tip: improve your ad score to 75+ before launching don't waste budget on poor creatives.",
  },
  "website-analyzer": {
    what: "Website Analyzer performs a comprehensive 360-degree audit of any website SEO health, page speed, content quality, technical issues, and competitor comparison in one detailed report.",
    how: "Enter the website URL. AI performs a complete site crawl and generates an actionable report with a prioritized issue list and specific fix recommendations.",
    benefits: ["Instant professional audit reports for client proposals", "Fix hidden issues and bottlenecks on your own site", "Reverse-engineer your competitor's winning strategy"],
    english: "Website Analyzer performs a comprehensive 360-degree audit of any website -SEO health score, page speed, Core Web Vitals, content quality, technical issues, backlink overview, and competitor comparison -all in one prioritized report.",
    flow: ["Enter website URL", "Start audit (AI crawls the site)", "Score + prioritized issues returned", "View competitor comparison", "Download PDF report"],
    detail: "Audit covers: SEO (title tags, meta descriptions, heading structure, keyword density, internal links), Performance (page speed, LCP, FID, CLS Core Web Vitals), Technical (HTTPS, robots.txt, sitemap, canonical tags, redirects), Content (word count, readability, duplicate content, thin pages), Mobile (viewport, tap targets, font sizes). Each issue: severity level (Critical/Warning/Info) + exact URL + step-by-step fix. White-label PDF: add your logo and deliver a professional report to the client. Best use: show a competitor audit in new client proposals highlight problems on their site and how you'll fix them.",
  },
  "government-tenders": {
    what: "Government Tenders tool finds India and International government tenders in real time extracting live open tenders from GEM, eProcure, UN, World Bank, ADB, EU TED, and 150+ portals.",
    how: "Select a sector, state, and keywords. AI searches multiple government portals and extracts structured tender data deadline, value, EMD, eligibility all in one place.",
    benefits: ["Find crore-value government contracts in seconds", "Both India and international tenders in one tool", "Instantly share with your team via CSV export"],
    english: "Government Tenders searches India (GEM, eProcure, BidAssist, state portals) and International (UN, World Bank, ADB, EU, 150+ portals) for live open tenders in real time. Full details: deadline, value, EMD, eligibility, and document links -all in one structured table.",
    flow: ["Select India or International", "Choose sector + state/region", "AI searches multiple portals", "Live open tenders returned", "Export to CSV, then apply"],
    detail: "India Tenders coverage: GEM (IT/equipment/services all central government departments), eProcure NIC (central ministries direct), BidAssist/TendersInfo (aggregated state + central), State e-tender portals (Maharashtra, UP, Gujarat, Rajasthan major states covered). International: World Bank (IBRD/IDA projects Indian firms fully eligible globally), UN Agencies (UNDP, UNICEF, WHO procurement), ADB (Asian Development Bank including India-focused projects), EU TED, USAID. Daily alert tip: save sector keywords new tenders arrive in daily notifications apply before the competition does.",
    features: {
      "india-tenders": {
        what: "India Government Tenders fetches live tenders from GEM, eProcure NIC, BidAssist, TendersInfo, and state portals.",
        how: "Choose a sector (IT/Construction/Medical etc.) and state. AI searches India's major tender portals and brings full details of open tenders.",
        benefit: "Cover both central and state government tenders from GEM to state e-tender portals, all in one place.",
        english: "India Government Tenders fetches live active tenders from GEM, eProcure NIC, BidAssist, and all major state portals in real time. Full details per tender: tender title, issuing organization, estimated value, EMD amount, submission deadline, eligibility criteria, and document download link.",
        flow: ["Choose sector (IT/Construction/Medical/etc)", "Select state or 'All India'", "Add keywords (optional)", "AI searches multiple portals", "Open tender list + details ready"],
        detail: "India Tenders portal coverage: GEM (Government e-Marketplace IT products, services, equipment every central government department tenders here), eProcure NIC (direct portal for central ministries Railways, Defence, Highways), BidAssist + TendersInfo (aggregated state + central most comprehensive coverage), State Portals (Maharashtra, UP, Gujarat, Rajasthan, Karnataka, Tamil Nadu and other major states). Each tender: Title, Issuing Authority, Bid Value, EMD (Earnest Money Deposit), Submission Deadline, Opening Date, Eligibility Criteria summary, Direct document download link. Pro tip: 'IT' + 'All India' filter gives the highest-volume GEM tenders most opportunities for IT firms. Export as CSV and share with your team to divide eligibility checks.",
      },
      "intl-tenders": {
        what: "International Tenders searches UN, World Bank, ADB, EU, UNDP, and procurement portals from 150+ countries for global opportunities.",
        how: "Choose a region, funding agency, and sector. The 'Indian Firms Only' toggle filters tenders where Indian companies can apply.",
        benefit: "Participate in crore-dollar multilateral projects Indian firms are globally eligible for World Bank-funded tenders.",
        english: "International Tenders searches UN, World Bank, ADB, EU, UNDP and 150+ procurement portals for global opportunities. 'Indian Firms Only' filter shows tenders where Indian companies are explicitly eligible -multilateral bank projects often have no nationality restrictions.",
        flow: ["Choose region (South Asia/Global/Africa/etc)", "Filter by funding agency (World Bank/UN/ADB/EU)", "Select sector", "Toggle 'Indian Firms Only'", "Matching tenders + apply links ready"],
        detail: "International tender sources and opportunities for Indian firms: World Bank (IBRD/IDA funded IT, consulting, engineering, construction globally Indian firms fully eligible, USD payment), UN Agencies (UNDP, UNICEF, WHO, WFP procurement IT systems, services, supplies Indian vendors actively sought), ADB (Asian Development Bank South/Southeast Asia projects strongest footing for Indian firms), EU TED (European procurement international firms allowed for many categories), USAID (US foreign aid funded). Indian firm advantage: lower-cost skilled workforce + growing technical capability = competitive in international bids. Typical values: $100K–$50M range. 'Indian Firms Only' toggle: filters tenders explicitly mentioning Indian firms, ICB (International Competitive Bidding) tenders, or those issued in India by multilateral banks. Pro tip: IT + Consulting are the sectors where Indian firms are most internationally competitive start there.",
      },
    },
  },
};

/* ── Feature-level Quick Tips (keyed by slug → featureId) ─────────────────── */
const TOOL_FEATURE_TIPS = {
  /* ── SEO Optimizer ── */
  seo: {
    analyze: {
      label: "Site SEO Audit",
      english: "Enter any URL for a full audit across 200+ ranking factors -technical health, on-page tags, page speed, Core Web Vitals, mobile-friendliness -with a prioritized fix list.",
      flow: ["Enter URL", "Start audit", "AI checks 200+ factors", "Score + prioritized issues", "Fix and re-audit"],
      detail: "Audit sections: Technical (crawlability, HTTPS, redirects, canonical), On-Page (title/meta length, heading hierarchy, keyword density), Performance (page speed, LCP/FID/CLS), Content (word count, readability, duplicate), Mobile (viewport, tap targets). Each issue includes Critical / Warning / Info severity + step-by-step fix. Fix critical issues first they have the highest ranking impact.",
    },
    research: {
      label: "Keyword Research",
      english: "Find high-traffic, low-competition keywords. Get search volume, difficulty score (1-100), CPC, and SERP analysis showing who ranks and why.",
      flow: ["Enter seed keyword", "Filter by industry + location", "Related keyword list returned", "Filter by difficulty + volume", "Finalize target keywords"],
      detail: "Difficulty guide: 0-30 = Easy (new sites), 31-60 = Medium, 61+ = Hard. Long-tail keywords (3-4 words) = lower competition, higher intent, better conversion. High CPC ($5+) = buyers searching = strong commercial intent. SERP analysis: if big brands dominate, avoid; SME results = opportunity. Export and build your content calendar.",
    },
    autofix: {
      label: "Auto-Fix Code",
      english: "AI generates exact copy-paste code fixes for detected SEO issues -meta tags, schema markup, robots.txt, sitemaps, canonical tags. Ready for your developer or CMS.",
      flow: ["Run Site Audit first", "Open Auto-Fix tab", "Choose an issue", "AI generates code fix", "Give to developer or paste into CMS"],
      detail: "Fix types: Meta title/description tags (paste in <head>), Schema JSON-LD (Product, FAQ, HowTo, LocalBusiness markup), robots.txt additions, XML sitemap fixes, Canonical tags, Open Graph + Twitter Card tags, hreflang (multilingual). Compatible with WordPress (Yoast/RankMath), Shopify (theme.liquid), Webflow, Wix, custom HTML. Share with your developer as-is no editing needed.",
    },
    competition_gap: {
      label: "Competitor Gap",
      english: "Find keywords and content topics your competitors rank for that your site completely misses. Reveals ready-made content opportunities to capture traffic you're losing.",
      flow: ["Enter your domain", "Add 3-5 competitor URLs", "AI runs gap analysis", "Missing keywords + topics identified", "Create pages, capture traffic"],
      detail: "Gap keywords are proven-valuable: competitors' rankings confirm real search demand and conversions. Priority: keywords where 2-3 competitors simultaneously rank = highest opportunity. Action: create a comprehensive page better than the competitor's best page (Skyscraper Technique). Content gap → content calendar → systematic execution.",
    },
    schema_audit: {
      label: "Schema Audit",
      english: "Extract, validate, and fix schema markup on any page. Detect missing schema types, fix errors, and generate new structured data code for Google rich snippets.",
      flow: ["Enter URL", "Run Schema Audit", "Current schemas detected", "Missing schemas + errors found", "Generate fix code and implement"],
      detail: "Schema types: Product (price, availability, reviews), Article (author, date), FAQ (expandable in SERP), HowTo (step-by-step rich results), LocalBusiness (map pack), BreadcrumbList, Organization, Event. Rich snippet benefits: FAQ schema = double SERP space, Product schema = price visible in results, LocalBusiness = map pack eligibility. JSON-LD format generated → paste in <head> or inject via Google Tag Manager.",
    },
    keyword_sniper: {
      label: "Keyword Sniper",
      english: "Generate 20 high-intent, buyer-ready local keywords for any business in any city. These are searches people make when they're ready to buy -highest conversion potential.",
      flow: ["Enter business type (e.g. 'digital agency')", "Specify city", "AI generates 20 buyer-intent keywords", "Review volume + difficulty", "Build content + ads on these keywords"],
      detail: "Buyer-intent signals: 'near me', 'in [city]', 'best [service]', '[service] price', 'hire [service]', 'affordable [service]'. These convert 3-5x better than informational keywords. Use for: Google Ads (immediate ROI), Local landing pages (SEO), Google Business Profile (description + posts). Tip: create a separate landing page for each city location-specific pages are powerful for local SEO.",
    },
    competitor_xray: {
      label: "Competitor X-Ray",
      english: "Full side-by-side SEO comparison between your site and any competitor -keywords, backlinks, content, technical metrics. See exactly what's ranking them higher and how to beat them.",
      flow: ["Enter your URL", "Enter competitor URL", "AI analyzes both", "Side-by-side comparison returned", "Identify gaps, build action plan"],
      detail: "X-Ray covers: Domain Authority comparison, Total backlinks + referring domains, Keyword overlap + gap, Content quality metrics (word count, pages), Technical score difference, Page speed comparison. Most actionable: keyword gap (their top keywords your site is missing) + backlink sources (sites linking to them becomes your outreach list). Close the biggest gap first = fastest ranking improvement.",
    },
    gbp_hijack: {
      label: "GBP Post Generator",
      english: "Analyze any Google Business Profile and generate optimized posts, Q&A responses, and service descriptions. Stay active on GBP to dominate local search rankings.",
      flow: ["Enter business name or GBP URL", "AI analyzes GBP", "Post ideas + content generated", "Q&A responses returned", "Post to GBP weekly"],
      detail: "GBP optimization: Regular posts (Google recommends weekly → algorithm boost), Q&A pre-fill (answer common questions before customers ask), keyword-rich service descriptions, top keywords in business description. Post types: promotional (offers), event, product showcase, seasonal. Most competitors neglect their GBP regular posting delivers easy local ranking wins.",
    },
  },

  /* ── SEO Analytics ── */
  "seo-analytics": {
    "site-analysis": {
      label: "Site Analysis",
      english: "Analyze any website's organic traffic -total sessions, traffic sources breakdown, top landing pages, referring domains, and month-over-month growth trends.",
      flow: ["Enter domain", "Select date range", "View traffic sources breakdown", "Identify top pages", "Analyze growth trend"],
      detail: "Key metrics: Organic vs Direct vs Referral split (high organic = strong SEO), Top Landing Pages (keep these fresh and updated), Referring Domains (quality > quantity 10 high-DA links beat 100 spammy ones), Traffic Trend (declining? → check Google update dates). Competitor analysis: find their top traffic pages → create better content → capture that traffic.",
    },
    "keyword-research": {
      label: "Keyword Research",
      english: "Comprehensive keyword data -search volume, difficulty (1-100), CPC, SERP top-10 analysis, seasonality trends, and related keyword suggestions.",
      flow: ["Enter seed keyword", "View volume + difficulty data", "Analyze SERP top-10", "Explore related keywords", "Finalize target list"],
      detail: "SERP analysis tip: if mostly big brands (Amazon, Wikipedia) rank → difficult, avoid. SMEs and niche blogs → opportunity. Seasonality: AC repair keywords peak in summer, gift keywords in December plan timing accordingly. CPC $5+ → commercial intent → likely better conversion. Prioritize these even if volume is lower.",
    },
    "site-audit": {
      label: "Site Audit",
      english: "Full technical SEO health check scoring 0-100. Detects broken links, missing meta tags, slow pages, duplicate content, and mobile issues across your entire site.",
      flow: ["Enter domain", "Start full site audit", "AI crawls the site", "Score + issue categories returned", "Fix critical issues first"],
      detail: "Score guide: 90-100 = Excellent, 70-89 = Good, 50-69 = Average, below 50 = Urgent. Common critical issues: missing meta descriptions (write a unique one for each page), broken internal links (fix or redirect), slow speed (compress images, enable caching), duplicate titles (each page needs a unique title). Run a monthly audit to track new issues. Target: 90+ score.",
    },
    "backlink-analysis": {
      label: "Backlink Analysis",
      english: "Complete backlink profile -total links, referring domains, domain rating, anchor text distribution, toxic link detection, and new/lost backlinks monitoring.",
      flow: ["Enter domain", "Open backlinks tab", "View referring domains + quality", "Check anchor text distribution", "Disavow toxic links"],
      detail: "Health indicators: Referring Domain diversity (100 different sites > 100 links from same site), Domain Rating 50+ sites = most valuable, Anchor text variety (over-optimized exact-match anchors = Google penalty risk). Action: find competitor backlinks (link gap) → contact the same websites. Toxic links: disavow in Google Search Console. Monthly monitoring: if valuable links are being lost → contact the site owner.",
    },
    "keyword-intelligence": {
      label: "Keyword Intelligence",
      english: "Advanced keyword analysis -ranking potential scores, keyword clusters, semantic groups, question-based keywords, and page-2 opportunity keywords for quick wins.",
      flow: ["Enter keyword or topic", "AI runs advanced analysis", "Clusters + opportunities identified", "Page-2 keywords returned", "Optimize quick-win keywords first"],
      detail: "Specialties: Keyword Clusters (target similar keywords on one comprehensive page), Question Keywords (Who/What/How format → featured snippet opportunities), Opportunity Keywords (positions 11-20 → small optimization can push to page 1 fastest ROI), Semantic Keywords (related terms that build topical authority). Focus: opportunity keywords first = quickest ranking improvements.",
    },
    "rank-prediction": {
      label: "Rank Prediction",
      english: "AI predicts your probability of ranking in top-10 for any keyword, based on your domain strength, content quality, and competition -with a realistic timeline.",
      flow: ["Enter target keyword", "Provide your domain", "AI analyzes competition + domain", "Ranking probability score returned", "Get timeline + action plan"],
      detail: "Prediction factors: Domain Authority (older, stronger = faster ranking), Content Quality (depth, word count, multimedia), Backlink gap vs competitors, On-page score, Content freshness. Timeline: Low difficulty = 1-3 months, Medium = 3-9 months, High = 9-18+ months. Target keywords where the prediction is 60%+ prioritize realistic, achievable goals.",
    },
    "content-research": {
      label: "Content Research",
      english: "Discover the highest-performing content in your niche -topics getting the most traffic, shares, and backlinks. Find content gaps and data-backed topic ideas.",
      flow: ["Enter niche or topic", "View top content by traffic", "Identify backlink-rich content", "Spot gaps", "Plan better content"],
      detail: "Workflow: Find top competitor content → analyze why it works (length, format, angle) → build a better version. Content gap = topics being searched but no quality content exists → blue ocean opportunity. Freshness opportunity: 2018-2020 content on important topics → update with fresh data → quick ranking boost without new backlinks. Skyscraper Technique: take the competitor's best page and build a better, longer, updated version.",
    },
    "ai-insights": {
      label: "AI Insights",
      english: "AI-generated strategic SEO recommendations from all your data -prioritized action items, growth opportunities, risk alerts, and a customized 30/60/90 day SEO roadmap.",
      flow: ["Analytics data auto-collected", "AI analyzes all metrics", "Patterns + opportunities identified", "Prioritized recommendations returned", "Execute action plan"],
      detail: "Insights: Quick Wins (low effort, high impact do these first), Strategic Opportunities (medium-term plays), Risk Alerts (declining metrics, Google update impacts), Competitive Intel (where competitors are pulling ahead), Custom Roadmap (30/60/90 day plan). Check weekly new insights are generated as data changes. Most valuable: Quick Wins section simple fixes with immediate ranking impact.",
    },
  },

  /* ── Content Studio ── */
  studio: {
    blogpost: {
      label: "Blog Post",
      english: "Generate full SEO-optimized blog posts (1,000–5,000 words) with proper H1/H2/H3 structure, natural keyword integration, meta description, hook introduction, and conclusion with CTA.",
      flow: ["Enter topic + target keyword", "Choose word count", "Select tone", "Click Generate", "Review + publish"],
      detail: "AI blog structure: Hook Introduction (start with a stat or question), Problem Setup, Solution Sections (H2/H3 hierarchy), Examples + Data (credibility), Conclusion + CTA. SEO auto-included: keyword in title, first 100 words, H2 headings, and throughout. 100% plagiarism-free output. Pro tip: mention your product/service in the context → AI writes a branded post.",
    },
    caption: {
      label: "Social Media Caption",
      english: "Generate platform-optimized captions for Instagram, LinkedIn, Twitter, Facebook, and YouTube -right tone, length, and hashtag strategy per platform.",
      flow: ["Describe content idea", "Select platform", "Choose tone", "Generate caption + hashtags", "Copy and post"],
      detail: "Platform specifics: Instagram (hook + story + 30 hashtags -high/medium/niche mix), LinkedIn (professional insight + 3-5 hashtags + CTA), Twitter/X (punchy 280-char + 2-3 hashtags), Facebook (conversational, emojis OK), YouTube (first 150 chars critical for search). Instagram tip: first line = most critical 'more' is only clicked when the first line is compelling.",
    },
    ad_copy: {
      label: "Ad Copy",
      english: "Create high-converting ad copy for Facebook, Google, Instagram, and LinkedIn. Multiple headline variations, body copy, and CTAs -platform-specific psychological triggers built in.",
      flow: ["Describe product/service", "Choose platform", "Define target audience", "AI generates multiple variations", "Choose best version, launch"],
      detail: "Formats: Facebook (Primary text + Headline + Description), Google RSA (15 headlines + 4 descriptions, auto-mix and test), Instagram (caption + story overlay text), LinkedIn (InMail + Sponsored Content). AI-applied triggers: Urgency ('48 hours only'), Social Proof ('10,000+ customers'), Benefit-focused ('Save 3 hours daily'), Problem-solution. Generate 3-5 variants → A/B test → pick the winner from data.",
    },
    email: {
      label: "Email Campaign",
      english: "Write complete email campaigns -5 subject line A/B variants, preview text, engaging body copy, and strong CTA -optimized for high open rates and click-throughs.",
      flow: ["Define campaign goal", "Describe audience", "Enter key offer", "Generate full email", "A/B test subjects, then send"],
      detail: "Components: Subject Line (5 variants curiosity/benefit/urgency/personal/question), Preview Text (85 chars ideal), Opening Hook, Body (Problem → Agitate → Solution formula), Social Proof, Single clear CTA. Best practices: short paragraphs, bullet points, mobile-friendly. Subject line tip: use an emoji as the first character → 25% higher open rates. A/B test 2 variants → send winner to full list.",
    },
    video_script: {
      label: "Video Script",
      english: "Generate complete video scripts with an attention-grabbing hook, structured body, and strong CTA. Platform-specific length and pacing for YouTube, Reels, TikTok, and Shorts.",
      flow: ["Choose topic + platform", "Select duration", "Full script generated", "Check hook especially", "Record and publish"],
      detail: "Structure: Hook (0-3 sec: bold claim/question), Context Bridge (why this matters), Main Content (numbered points = retention), Social Proof, CTA. Lengths: TikTok/Reels 30-60s, YouTube Shorts 60s, YouTube long-form 5-15 min. Hook = 70% of success a weak hook causes viewers to scroll away in 3 seconds. Tip: write the hook first, before the rest of the script.",
    },
    product_desc: {
      label: "Product Description",
      english: "Generate conversion-focused product descriptions that translate features into benefits -optimized for e-commerce listings, landing pages, and catalogs.",
      flow: ["Enter product name + key specs", "Describe target customer", "Choose tone", "Generate description + bullets", "Use on product page"],
      detail: "Formula: Opening benefit statement → Key Features as Benefits (3-5 bullets: 'Feature X means YOU get Y') → Social Proof hook → Objection handling → CTA. Feature vs Benefit: '10000mAh battery' → 'Use for 3 days without charging'. Customers care about benefits, not specs. Length: premium products = longer (more justification), impulse buy = shorter. Include search keywords naturally.",
    },
    landing_page: {
      label: "Landing Page Copy",
      english: "Create complete landing page copy -hero headline, value propositions, feature/benefit sections, objection handling, testimonials, and CTA sections -conversion-optimized structure.",
      flow: ["Describe product/service + USP", "Define target audience", "Specify goal + tone", "Full landing page copy generated", "Implement on website"],
      detail: "Structure: Above-fold (Headline + Subhead + CTA + social proof), Problem section, Solution section, Features as Benefits, How It Works (3 steps), Testimonials, FAQ/Objections, Final CTA + urgency. Headline tip: test 3-5 variants -headline alone can change conversion 200%. CTA: 'Start Today Trial' > 'Submit'. Above-fold content most critical -half your visitors never scroll down.",
    },
    whatsapp: {
      label: "WhatsApp Message",
      english: "Generate engaging WhatsApp business messages -promotions, follow-up sequences, cart recovery, appointment reminders, and customer support templates. 98% open rate channel.",
      flow: ["Select message purpose", "Describe product/service", "Choose tone", "WhatsApp-optimized message generated", "Send via WhatsApp Business"],
      detail: "Message types: Promotional (offer + urgency + link), Follow-up (Day 1 intro → Day 3 value → Day 7 offer), Cart Recovery ('Your item is waiting!'), Appointment Reminders, Support Templates. Best practices built-in: short paragraphs (1-2 lines), emojis for scannability, clear CTA with link at end, personal tone. Keep under 300 chars for best engagement. 98% open rate = 5x more likely to be read than email.",
    },
  },

  /* ── AI Content Generator ── */
  content: {
    blogpost: { label: "Blog Post", english: "Generate SEO-optimized blog posts (1,000–5,000 words) with proper headings, natural keywords, meta description, and engaging structure -ready to publish.", flow: ["Enter topic + keyword", "Choose word count + tone", "Click Generate", "Review", "Publish"], detail: "H1/H2/H3 structure automatic, keyword density natural, plagiarism-free. Add product/service context for branded content." },
    caption: { label: "Social Caption", english: "Platform-optimized captions for Instagram, LinkedIn, Twitter, Facebook with the right tone, length, and hashtag strategy per platform.", flow: ["Describe topic", "Choose platform", "Caption + hashtags ready", "Copy", "Post"], detail: "Instagram: hook + 30 mixed hashtags. LinkedIn: professional + 3-5 hashtags. Twitter: 280-char optimized. First line most critical on Instagram." },
    ad_copy: { label: "Ad Copy", english: "High-converting ad copy for Facebook, Google, Instagram, LinkedIn with multiple headline + body + CTA variations for A/B testing.", flow: ["Describe product", "Choose platform", "Generate multiple variants", "Pick best", "Launch"], detail: "Urgency, social proof, benefit-focused triggers auto-included. Generate 3-5 variants, test, scale winner." },
    email: { label: "Email Campaign", english: "Complete email campaign -5 subject line variants, preview text, body copy, and CTA -optimized for high open rates.", flow: ["Enter goal + audience", "Enter key message", "Generate email", "A/B test", "Send"], detail: "5 subject variants (curiosity/benefit/urgency/personal/question). Short paras, bullet points, mobile-friendly. Emoji in subject = +25% opens." },
    video_script: { label: "Video Script", english: "Complete video scripts with hook, body, and CTA -platform-specific length for YouTube, Reels, TikTok.", flow: ["Enter topic + platform", "Select duration", "Generate script", "Check hook", "Record"], detail: "Hook = 70% of success (first 3 sec). Lengths: Reels 30-60s, Shorts 60s, YouTube 5-15 min." },
    product_desc: { label: "Product Description", english: "Conversion-focused descriptions that translate features into customer benefits -for e-commerce, catalogs, and landing pages.", flow: ["Enter product + specs", "Describe customer", "Generate description", "Copy", "Use on listing"], detail: "Feature → Benefit formula. Benefits sell, specs don't. Keywords naturally included." },
    landing_page: { label: "Landing Page Copy", english: "Full landing page copy -headline, value props, benefits, testimonials, objection handling, and CTAs -conversion-optimized.", flow: ["Enter USP + audience", "Specify goal", "Generate full page copy", "Add to website", "Launch"], detail: "Above-fold most critical -many visitors don't scroll. Test 3-5 headline variants." },
    whatsapp: { label: "WhatsApp Message", english: "WhatsApp business messages -promos, follow-ups, cart recovery, reminders -for the 98% open rate channel.", flow: ["Select purpose", "Generate message", "Send via WhatsApp Business", "Schedule follow-up", "Track results"], detail: "Under 300 chars for best engagement. Emojis add scannability. Clear CTA + link at end." },
  },

  /* ── AI Voice Studio ── */
  voice: {
    tts: {
      label: "Text to Speech",
      english: "Convert any text to natural-sounding voice in 28+ languages with 100+ AI voice options -male/female, multiple accents per language. Download in MP3, WAV, or OGG.",
      flow: ["Paste text", "Choose language (28+)", "Select voice (100+)", "Adjust speed + pitch", "Generate → download"],
      detail: "Language tips: For Hindi, choose 'Hindi (India)' multiple speakers available; for Indian audiences, 'English (India)' is more relatable. All voices are ElevenLabs-powered = most natural available. Add natural punctuation (commas, periods) for better speech rhythm. Character limit: 1,000 free / unlimited paid.",
    },
    ad: {
      label: "Ad / Promo Voice",
      english: "Energetic, attention-grabbing voiceovers for ads and promotions. Pre-configured for high-energy ad-style delivery -radio ads, video ads, social media promos.",
      flow: ["Write ad script (30-60 sec ideal)", "Choose energetic voice", "Set energy level", "Generate", "Use in video/ad"],
      detail: "Script length: 30-sec ad = ~75-80 words, 60-sec = ~150-160 words, 15-sec = ~35-40 words. Structure: Attention hook → Problem → Solution → Benefit → CTA. Speed 1.1-1.2x = energetic feel. Pro tip: voiceover + background music combination is far more effective than bare voiceover alone.",
    },
    podcast: {
      label: "Podcast",
      english: "Natural, conversational podcast-style narration optimized for long-form audio -warm tone, proper pacing, and the natural rhythm of a human podcast host.",
      flow: ["Write podcast script", "Choose podcast voice", "Set pacing 0.9x-1.0x", "Generate", "Upload to platform"],
      detail: "Natural tone tips: use contractions (it's, you're, we'll). Add '[pause]' markers for breathing room. Intro formula: 'Welcome to [Podcast]. I'm [Name]. Today we talk about [Topic].' Length: 3-7 min = high retention, 10-20 min = standard. A consistent voice builds brand recognition over time.",
    },
    ivr: {
      label: "IVR / Calls",
      english: "Professional IVR messages, on-hold messages, voicemail greetings, and business call scripts -clear, professional tone optimized for phone audio quality.",
      flow: ["Type IVR script", "Choose professional/formal voice", "Generate", "Upload to phone system", "Test"],
      detail: "IVR types: Welcome Greeting, Menu Options (fewer than 5 options, most popular first), On-Hold (repeat every 30-45 sec, include brand + wait time), Voicemail (business hours + callback promise), After-Hours (hours info + emergency contact). Best practice: always offer a 'speak to agent' option. Numbers, URLs, and emails should be read extra slowly.",
    },
  },

  /* ── AI Image Studio ── */
  imagestudio: {
    "prompt-maker": {
      label: "Image Prompt Maker",
      english: "Design perfect image generation prompts for DALL-E, Midjourney, and Stable Diffusion. Input your concept and AI crafts a detailed, optimized prompt for stunning results.",
      flow: ["Describe image concept", "Specify AI tool", "Add style + mood", "Optimized prompt generated", "Copy and use in AI tool"],
      detail: "Prompt elements: Subject, Environment/setting, Art style (photorealistic/artistic/anime), Lighting (soft morning/dramatic studio), Camera angle (portrait/aerial/close-up), Color palette, Quality markers ('8K ultra-detailed, professional photography'). Specific > vague: 'Indian entrepreneur in Mumbai office, natural light, corporate style' > 'business woman'.",
    },
    bulk: {
      label: "AI Bulk Images",
      english: "Generate 10+ image variations from one prompt in one click. AI creates systematic composition, color, and style variations -perfect for A/B testing ad creatives.",
      flow: ["Write base prompt", "Enable Bulk Mode", "Select variation count", "Generate", "Download all, choose best"],
      detail: "Use cases: Ad creative A/B testing (10 variants → scale winner), Client presentations (multiple options), Social media calendar (month ka content ek session mein), Festival creatives (Diwali/Holi/Eid variations). Variation types: color palette, composition, style, mood. Bulk ZIP download. Generic prompt = more diverse variations; specific prompt = more polished similar variations.",
    },
    "remove-bg": {
      label: "Background Remover",
      english: "Remove image backgrounds with AI precision in one click. Get clean transparent PNG cutouts -perfect for e-commerce products, posters, and any design work.",
      flow: ["Upload product/subject image", "Click Background Remove", "AI detects edges", "Transparent PNG ready", "Download"],
      detail: "Accuracy: simple products 90%+, complex (hair/fur) 80-85%. Fine-tune: edge eraser/restore tool available. Best input: high contrast, well-lit, sharp focus image. E-commerce hack: phone se plain background pe photo → BG remove → professional white background → listing pe upload. No photographer needed. Batch: multiple images ek session mein.",
    },
    upscale: {
      label: "Image Upscaler",
      english: "Enhance any image to 4x resolution with AI -intelligently fills realistic detail unlike blurry regular resize. Print-ready quality up to 4096×4096.",
      flow: ["Upload image", "Select 4x Upscale", "AI processes", "Preview HD result", "Download"],
      detail: "AI upscaling vs regular resize: Regular = stretch pixels = blurry. AI = analyze + fill realistic new detail = sharp professional result. Use cases: making old logos HD (for print/signage), making low-res product photos e-commerce-ready, restoring compressed images, making screenshots presentation-ready. Output max: 4096×4096 = A3 print quality. Noisy/blurry input → AI denoise option also available.",
    },
  },

  /* ── AI Video Studio ── */
  video: {
    "ai-studio": {
      label: "AI Video Studio (Veo 2)",
      english: "Generate cinematic quality videos from text descriptions using Google's Veo 2 model. Describe scenes, choose style and duration -AI creates realistic video with natural motion.",
      flow: ["Describe scene in text", "Choose style + duration", "Veo 2 AI processes", "Preview result", "Download"],
      detail: "Best results: specific scene descriptions (camera angle, setting, mood, lighting). Quality keywords: 'cinematic 4K, photorealistic, high production value'. Duration: 5-15 sec clips per generation. Combine multiple clips in editing. Commercial license included. Shorter specific clips (5-8 sec) outperform long complex scenes for quality.",
    },
    "ai-model-video": {
      label: "AI Model Video (Avatar)",
      english: "Create photorealistic talking avatar videos -choose from 20+ AI presenters or upload your photo. AI delivers your script in any of 20+ languages with perfect lip sync.",
      flow: ["Choose avatar (library / custom photo)", "Write or paste script", "Choose language + voice", "Generate video", "Download ready video"],
      detail: "Library presenters: Corporate, Teacher, Doctor, Fitness Trainer, News Anchor, Casual Influencer (20+ styles). Custom avatar: clear front-facing photo → AI builds your avatar from it. Same avatar speaks in 20+ languages. Background: default studio or custom image upload. Use: Product demos, Course content, Multilingual videos, Brand spokesperson.",
    },
    "video-edit": {
      label: "Video Edit (Lip Sync + Image to Video)",
      english: "Two features: Lip Sync (replace audio in existing face videos -perfect for Hindi dubbing) and Image to Video (animate static images with AI motion effects for social media).",
      flow: ["Choose mode (Lip Sync / Image to Video)", "Upload source media", "Select new audio / motion style", "AI processes", "Download video"],
      detail: "Lip Sync: existing video + new audio → AI syncs lips (95%+ accuracy). Use: Hindi dubbing, outdated scripts update, multilingual localization. Best input: clear face, good lighting, minimal head movement. Image to Video motion styles: Ken Burns (zoom+pan), Parallax 3D (depth illusion), Ambient Motion (subtle movement), Zoom Pulse (rhythmic). Best for: product reels, story animations, portfolio pieces.",
    },
  },

  /* ── Vision AI ── */
  "vision-ai": {
    describe: {
      label: "Create Content from Image",
      english: "Upload any image and AI generates captions, descriptions, product copy, social posts, and alt text based on the actual image content -not generic templates.",
      flow: ["Upload image (max 3MB)", "Choose content type", "Specify platform / use case", "AI analyzes + generates", "Copy"],
      detail: "Content types: Instagram Caption + hashtags, Facebook Post, Product Description (feature-benefit focused), Alt Text (SEO + accessibility), LinkedIn Post. AI identifies: products/objects, emotions, colors/mood, setting, brand elements, text in image. Pro tip: use product images to generate direct e-commerce copy AI translates features into customer benefits.",
    },
    ocr: {
      label: "Extract Data (OCR)",
      english: "Extract text from printed or handwritten documents -invoices, receipts, business cards, forms, screenshots. Tables recognized and output in structured, editable format.",
      flow: ["Upload document image", "Select extract mode", "AI OCR processes", "Structured text returned", "Copy or CSV export"],
      detail: "Accuracy: Printed text 99%+, Handwritten ~80% (clear handwriting = best). Tables: export as CSV → open in Excel/Sheets. Languages: Hindi + English + regional scripts. Use cases: Invoice data → accounting, Business cards → contacts, Paper forms → digital database. Flat, well-lit document = best OCR results. Avoid shadows.",
    },
    objects: {
      label: "Analyze Brand & Objects",
      english: "Detect logos, count objects, read visible text, and identify scenes in any image. Ideal for retail shelf audits, brand monitoring, competitive analysis, and inventory verification.",
      flow: ["Upload image", "Choose analysis type", "AI runs visual analysis", "Detailed report returned", "Use data"],
      detail: "Analysis types: Object Detection+Counting (shelf inventory, crowd size), Brand/Logo Recognition (competitor logos, event brand visibility, trademark monitoring), Scene Understanding (location type, setting identification), Text Reading (billboards, labels, price tags, handwritten signs). Real use: retail chain store shelf photos analyze → in-stock vs out-of-stock detect → inventory alert.",
    },
    ad_analysis: {
      label: "Ad Performance Insights",
      english: "Upload any ad creative for a comprehensive AI effectiveness score (0-100) analyzing visual impact, CTA clarity, text-image balance, color psychology, and platform fit.",
      flow: ["Upload ad creative", "Specify platform", "AI analyzes 6 dimensions", "Score + feedback returned", "Improve and re-test"],
      detail: "6 scoring dimensions: Visual Hierarchy (does the eye land on the CTA?), Text-Image Balance (Facebook 20% text rule), Color Psychology (red=urgency, blue=trust, green=growth), CTA Clarity (compelling + visible?), Emotional Trigger (urgency/desire/FOMO?), Platform Fit (follows platform guidelines?). Score: 80+ = launch, 60-79 = minor tweak, below 60 = rework. Most common failure: too much text + weak generic CTA.",
    },
  },

  /* ── Prompt Maker ── */
  "prompt-maker": {
    image: {
      label: "Image Generation Prompts",
      english: "Create detailed prompts for DALL-E, Midjourney, and Stable Diffusion. Describe your concept in English - AI crafts a technically optimized prompt for stunning visuals.",
      flow: ["Describe your image concept", "Add style + mood", "AI asks 5 questions", "Provide answers", "Detailed image prompt ready"],
      detail: "Prompt elements: Subject (detailed), Setting/Environment, Lighting style, Art style, Camera angle, Color palette, Quality tags ('8K ultra-detailed, professional photography, award-winning'). Tool-specific: DALL-E 3 natural language; Midjourney '--ar 16:9 --style raw --v 6' parameters; Stable Diffusion negative prompts important. Specific prompts = dramatically better results.",
    },
    writing: {
      label: "Writing & Content Prompts",
      english: "Generate expert-level prompts for blogs, articles, copywriting, and SEO content -structured, detailed prompts that produce publishable quality output from any AI.",
      flow: ["Share writing goal/topic", "Specify audience + tone", "AI asks clarifying questions", "Provide answers", "Structured writing prompt ready"],
      detail: "Prompt components: Role definition ('You are an expert financial copywriter...'), Context paragraph, Detailed instructions (structure, must-include points), Output format (word count, sections), Constraints (what NOT to include), Quality markers. Specific > vague: mention target audience, location, pain points, and budget range = targeted, valuable output.",
    },
    video: {
      label: "Video Generation Prompts",
      english: "Create precise video prompts for Veo 2, Sora, and Runway -describing scenes, camera movements, lighting, and mood in technical detail for cinematic results.",
      flow: ["Share video concept", "Define visual style + mood", "AI asks 5 questions", "Provide technical details", "Copy video prompt"],
      detail: "Prompt elements: Scene description (setting, characters, actions), Camera work (static/zoom/tracking/aerial), Lighting (soft morning/dramatic/neon), Motion (ambient/action/slow-motion), Style (cinematic/documentary/commercial), Duration. Veo 2 tip: describe atmosphere + mood in natural language that works best. Short specific clips (5-8 sec) = better quality than long complex.",
    },
    chatbot: {
      label: "Chatbot System Prompt",
      english: "Design comprehensive AI chatbot system prompts -define persona, knowledge base, behavioral rules, response format, and fallback handling for any use case.",
      flow: ["Share chatbot purpose", "Define target users + tone", "AI asks questions", "Specify rules + constraints", "Complete system prompt ready"],
      detail: "System prompt components: Role definition, Knowledge scope (what it knows/doesn't know), Personality traits, Response format rules (bullet points, max length, always end with question), Boundaries (topics to avoid, when to escalate), Language preference, Fallback handling ('I'll check with our team within 24 hours'). Add 'Always maintain character' instruction prevents jailbreak.",
    },
    website: {
      label: "Website Analyzer Prompts",
      english: "Generate detailed prompts to get comprehensive website analysis feedback on UX, design, conversion, SEO, and messaging from any AI tool.",
      flow: ["Share website URL + goal", "Specify focus area", "AI asks questions", "Provide business context", "Analysis prompt ready"],
      detail: "Analysis covers: First impression (value prop clarity), UX evaluation (navigation, mobile), CRO (CTA placement, friction points), Messaging audit (headline effectiveness), SEO on-page, Competitive positioning, Improvement recommendations. Pro tip: have the AI role-play as your target customer 'You are a first-time visitor who found this via a Google ad, narrate your experience browsing the homepage.'",
    },
  },

  /* ── Lead Generation ── */
  "lead-generation": {
    "google-map-leads": {
      label: "Google Map Leads (Domestic)",
      english: "Extract verified business leads from Google Maps -name, phone, email, address, ratings, website. Filter by industry, city, and state across India for hyper-targeted B2B prospecting.",
      flow: ["Select industry + city/state", "Start Google Maps AI search", "Business listings extracted", "Phone/email/address verified", "Export to CSV"],
      detail: "Best practices: Tier-2 cities (Surat, Ludhiana, Coimbatore) have less competition start there. Target specific niches (e.g. 'IT companies' not just 'companies'). 4+ star rating filter = quality leads. Phone-verified leads have higher cold call conversion. After exporting, deduplicate and filter invalid numbers before outreach.",
      business: [
        { icon: "💰", title: "Sell Lead Lists for Revenue" },
        { icon: "📈", title: "Scale Your Sales Pipeline" },
        { icon: "🎯", title: "Target Competitor Customers" },
      ],
    },
    "website-leads": {
      label: "Website Leads (Domestic)",
      english: "Scrape Indian business websites for contact details -emails, phone numbers, social profiles, decision-maker names. Works on any site URL or bulk domain list.",
      flow: ["Provide a domain list or single URL", "AI crawls the website", "Contact info is extracted", "Decision-maker roles identified", "Verified lead list ready"],
      detail: "Extraction targets: Contact page emails, footer phone numbers, About Us section (founders/CEOs), LinkedIn profile links, social handles. Pro tip: if you know the company domain, website leads beat Google Maps because you get a direct email no guessing. Bulk mode: process 50-100 domains at once.",
      business: [
        { icon: "💼", title: "Reach Decision-Makers Directly" },
        { icon: "🤝", title: "Find B2B Partnerships" },
        { icon: "🚀", title: "Start a Lead Gen Agency" },
      ],
    },
    "exim-domestic": {
      label: "Exporters / Importers (Domestic)",
      english: "Find Indian exporters and importers by product, HS code, or commodity. Real shipping data -who is exporting what, to where, and with which buyers/suppliers.",
      flow: ["Enter product or HS code", "Toggle Export/Import", "AI searches trade data", "Company + buyer/supplier list returned", "Contact and close deals"],
      detail: "Use cases: Manufacturer → find distributors in target countries. Service provider → find exporters who need your service. Trader → find suppliers for a product. 6-digit HS code level gives the most accurate results. Top export sectors for Indian SMEs: Textiles, Pharma, Engineering goods, Agro products, IT services.",
      business: [
        { icon: "🌏", title: "Launch an Export Business" },
        { icon: "💰", title: "Reduce Supplier Costs" },
        { icon: "📦", title: "Start a Trading Business" },
      ],
    },
    "instagram-india": {
      label: "Instagram Leads (Domestic)",
      english: "Find Indian businesses active on Instagram -accounts with business contact info enabled. Filter by niche, follower count, location, engagement rate for quality leads.",
      flow: ["Choose niche + location", "Set follower range", "AI scans Instagram", "Business accounts + contacts returned", "DM or email outreach"],
      detail: "Best niches on Instagram India: Fashion, Beauty, Food, Fitness, Education, Real Estate, Interior Design. High engagement (>3%) = active audience = responsive to outreach. Micro-influencers (10K-100K followers) convert better than mega accounts. Check for 'Business Account' + email/phone in bio these are your qualified leads.",
      business: [
        { icon: "📱", title: "Build a Social Selling Machine" },
        { icon: "🤝", title: "Get Influencer Partnerships" },
        { icon: "💰", title: "Client Acquisition for SMM Agency" },
      ],
    },
    "linkedin-india": {
      label: "LinkedIn Leads (Domestic)",
      english: "Find Indian decision-makers on LinkedIn -CEOs, founders, managers -by industry, company size, and location. Get profile URLs, job titles, and company info for targeted B2B outreach.",
      flow: ["Define target role + industry", "Filter by company size + location", "AI scans LinkedIn profiles", "Decision-maker list returned", "Send connection request + InMail"],
      detail: "Conversion tip: Connect first (no message), then send a value-add message 2-3 days later. Don't pitch immediately. Personalize using their recent post or activity. InMail > Connection request for cold outreach (higher open rate). Target 2nd degree connections mutual connections = higher trust. Title keywords: 'Founder', 'CEO', 'Director', 'Head of', 'VP' for decision-makers.",
      business: [
        { icon: "🏢", title: "Accelerate B2B Sales" },
        { icon: "💵", title: "Land High-Ticket Clients" },
        { icon: "👥", title: "Reduce Recruitment Costs" },
      ],
    },
    "tender-india": {
      label: "Government Tenders (Domestic)",
      english: "Live Indian government tenders from GEM, eProcure, and state portals. Filtered by your sector and state -deadline, EMD, value, eligibility in one table.",
      flow: ["Choose sector (IT/Construction)", "Select state or All India", "AI searches portals", "Open tenders + details returned", "Check deadline + apply"],
      detail: "Top sectors on GEM: IT Hardware, IT Services, Office Supplies, Medical Equipment, Civil Works. Start with GEM largest volume, fastest onboarding. Tenders with EMD < ₹50K are best for SMEs (lower barrier). Set alerts for recurring tenders same departments re-tender annually. MSME sellers get 25% procurement reservation on GEM.",
      business: [
        { icon: "🏛️", title: "Government = Guaranteed Payment" },
        { icon: "📈", title: "Scale Your Business 10x" },
        { icon: "💡", title: "Low Competition Opportunity" },
      ],
    },
    "group-domestic": {
      label: "Group Finder (Domestic)",
      english: "Discover active WhatsApp and Facebook groups in India relevant to your industry or niche. Find communities where your target customers are already engaged.",
      flow: ["Enter industry/niche", "Choose platform (WhatsApp/Facebook)", "AI searches relevant groups", "Active groups + join links returned", "Join and share value"],
      detail: "Strategy: Join, observe for 1-2 weeks, share value-add posts (tips, free resources), then soft pitch. Never spam. WhatsApp groups = high engagement but limited reach. Facebook groups = searchable, larger communities. Best for: B2C businesses, local services, professional communities. Consistent value → trust → inbound leads without direct selling.",
      business: [
        { icon: "🎯", title: "Free Leads - Zero Ad Spend" },
        { icon: "📢", title: "Product Launch Platform" },
        { icon: "🤝", title: "Network = Business Growth" },
      ],
    },
    "intl-map-leads": {
      label: "Google Map Leads (International)",
      english: "Extract verified business leads from Google Maps globally -name, phone, email, address, ratings. Target specific countries, cities, and industries for international B2B prospecting.",
      flow: ["Select country + city", "Choose industry/niche", "AI scans Google Maps", "Business contacts extracted", "CSV export + outreach"],
      detail: "Best international markets for Indian B2B: UAE (high receptivity to Indian vendors), USA (IT/software, high value), UK (business services), Singapore (Southeast Asia gateway), Australia/Canada (strong Indian diaspora = trust factor). Time zone-aligned outreach: Email US leads early morning IST, UAE leads afternoon IST. Verify country calling codes before cold calling.",
      business: [
        { icon: "🌍", title: "Land Export Clients Directly" },
        { icon: "💵", title: "Earn in Dollar/Euro" },
        { icon: "🚀", title: "Build a Global Lead Gen Agency" },
      ],
    },
    "intl-web-leads": {
      label: "Website Leads (International)",
      english: "Scrape international business websites for contact details -emails, phone, decision-maker names, social profiles. Target companies in specific countries for export and global client acquisition.",
      flow: ["Enter country + target website list", "AI crawls websites", "International contact info extracted", "Decision-makers identified", "Localized outreach"],
      detail: "International outreach tips: Localize your pitch (UK English vs US English). Mention your time zone in the email. Use country-specific value props (e.g., 'cost-effective Indian alternative' works well). GDPR caution: use consent-based outreach for EU contacts. Best response rates: Australia, Canada, Singapore smaller markets, less inbox competition.",
      business: [
        { icon: "🌐", title: "International B2B Pipeline" },
        { icon: "💰", title: "Premium Client Acquisition" },
        { icon: "📧", title: "Email Outreach at Scale" },
      ],
    },
    "exim-intl": {
      label: "Exporters / Importers (International)",
      english: "Find international importers looking for Indian products, or global exporters supplying goods to India. Real trade data -shipping records, buyer-supplier relationships, import volumes.",
      flow: ["Enter product or HS code", "Target a country", "AI searches international trade data", "Importer/exporter company list returned", "Direct contact + close deals"],
      detail: "High opportunity sectors: India exports Pharma to Africa/Southeast Asia, Textiles to Europe/USA, IT services globally, Spices/Agriculture to Middle East. Use HS codes for precision -8-digit level = most specific. Real buyer names from shipping manifests = direct contact vs cold discovery. Verify company on LinkedIn before reaching out for credibility.",
      business: [
        { icon: "🌏", title: "Contact Proven Buyers Directly" },
        { icon: "💵", title: "Unlock Export Revenue" },
        { icon: "🤝", title: "Find the Best Supplier Globally" },
      ],
    },
    "instagram-leads": {
      label: "Instagram Leads (International)",
      english: "Find international businesses active on Instagram by country, niche, and follower count. Get business contact info for global social selling and international client outreach.",
      flow: ["Choose country + niche", "Set follower range", "AI scans Instagram", "International business accounts returned", "Localized DM/email outreach"],
      detail: "Top markets on Instagram by niche: Fashion → Italy, France, USA. Food → USA, UK, Australia. Fitness → USA, UAE, Australia. Beauty → USA, UK, France. Engagement rate matters more than follower count internationally. Business accounts with email in bio = highest qualified leads. Use translation tools for non-English market outreach.",
      business: [
        { icon: "🌍", title: "Land Global Clients Without Travel" },
        { icon: "💰", title: "International Influencer Collabs" },
        { icon: "📱", title: "Build Export Brand Awareness" },
      ],
    },
    "linkedin-leads": {
      label: "LinkedIn Leads (International)",
      english: "Find international decision-makers on LinkedIn -by country, industry, company size, and job title. LinkedIn's most powerful B2B lead channel for global sales and partnership development.",
      flow: ["Define country + target role", "Filter by industry + company size", "AI scans LinkedIn profiles", "International decision-maker list returned", "Send personalized outreach"],
      detail: "International LinkedIn strategy: English messaging works globally. Reference something local (their city, recent company news) for personalization. InMail has higher open rates internationally vs domestic. Premium accounts respond faster. 1st degree connection requests with no pitch = highest acceptance rate. Follow up 3x max -3 days, 7 days, 14 days spacing.",
      business: [
        { icon: "💼", title: "International B2B Sales" },
        { icon: "🤝", title: "Strategic Global Partnerships" },
        { icon: "🚀", title: "International Expansion Blueprint" },
      ],
    },
    "tender-intl": {
      label: "Government Tenders (International)",
      english: "Search UN, World Bank, ADB, EU and 150+ international procurement portals. 'Indian Firms Only' filter shows opportunities where Indian companies are explicitly eligible.",
      flow: ["Choose region (South Asia/Global)", "Filter by funding agency", "Select sector", "Toggle 'Indian Firms Only'", "Matching tenders + apply links returned"],
      detail: "Best agencies for Indian firms: World Bank (IBRD/IDA) -Indian firms globally eligible, USD payment. UNDP -IT + consulting + development sector, Indian vendors actively preferred. ADB -South/Southeast Asia projects, Indian engineering firms strong. EU TED -ICB tenders open to international firms. Typical values $100K-$50M. IT, Consulting, Engineering most competitive sectors for India.",
      business: [
        { icon: "💵", title: "Win Dollar-Value Contracts" },
        { icon: "🌍", title: "Land a Global Government Client" },
        { icon: "📈", title: "Validate Your Business Internationally" },
      ],
    },
    "__copy__": {
      label: "Lead Ad Campaign",
      english: "AI generates complete ad copies for Google, Instagram, LinkedIn, Email, and WhatsApp outreach -tailored to your product, audience, and platform style. Ready to publish in minutes.",
      flow: ["Describe product/service", "Define target audience", "Choose platforms", "AI generates platform-specific copies", "Edit (optional) + publish"],
      detail: "Platform-specific tips: Google Ads keywords in headline, strong CTA, USP in description. Instagram use emojis, story angle, hashtags essential. LinkedIn professional tone, lead with a stat, no hard sell. Cold Email subject line = 80% of open rate, personalize first line, single CTA. WhatsApp conversational, short, personal. Always structure copy as: Problem → Solution → Proof → CTA.",
      business: [
        { icon: "⚡", title: "Launch 10x Faster" },
        { icon: "💰", title: "Sell Copywriting Services" },
        { icon: "📈", title: "A/B Test at Scale" },
      ],
    },
  },

  /* ── Government Tenders (already has features -enhance them) ── */
  "government-tenders": {
    "india-tenders": {
      label: "India Government Tenders",
      english: "Fetch live active tenders from GEM, eProcure NIC, BidAssist, and all major state portals -with full details: deadline, EMD, tender value, eligibility, and document links.",
      flow: ["Choose sector (IT/Construction/Medical)", "Select state or 'All India'", "Add keywords (optional)", "AI searches multiple portals", "Open tenders + details returned"],
      detail: "Portal coverage: GEM (IT/equipment/services, every central department), eProcure NIC (central ministries direct), BidAssist+TendersInfo (aggregated state+central, most comprehensive), State Portals (MH, UP, Gujarat, Rajasthan, Karnataka, Tamil Nadu). Each tender: Title, Issuing Authority, Value, EMD, Submission Deadline, Eligibility summary, Document link. Pro tip: 'IT' + 'All India' filter = highest-volume tenders on GEM most opportunities for IT firms.",
    },
    "intl-tenders": {
      label: "International Tenders",
      english: "Search UN, World Bank, ADB, EU, UNDP and 150+ procurement portals. 'Indian Firms Only' filter shows opportunities where Indian companies are explicitly eligible.",
      flow: ["Choose region (South Asia/Global)", "Filter by funding agency (World Bank/UN/ADB)", "Select sector", "Toggle 'Indian Firms Only'", "Matching tenders + apply links"],
      detail: "Sources for Indian firms: World Bank IBRD/IDA (Indian firms fully eligible globally, USD payment), UN Agencies (UNDP/UNICEF/WHO Indian vendors actively sought), ADB (South/Southeast Asia Indian firms strongest here), EU TED (international firms allowed for many categories). Values: typically $100K–$50M. Pro tip: IT + Consulting + Engineering are the sectors where Indian firms are most internationally competitive start there. The 'Indian Firms' filter specifically finds ICB (International Competitive Bidding) tenders.",
    },
  },
};

/* ── Business card English texts (per lead-gen feature, 3 cards each) ──────── */
const LEAD_GEN_BUSINESS_EN = {
  "google-map-leads":  ["Build niche-specific verified lead lists and sell for Rs.5K-Rs.25K each. Tool costs Rs.999/month - earn Rs.50K-Rs.2L monthly.","500 targeted leads, 50 calls, 5-10 deals closed. Google Maps leads eliminate wasted calls and maximize sales team productivity.","Directly approach businesses in your competitors niche. A ready-made prospect list is your biggest sales asset."],
  "website-leads":     ["Extract CEO and Founder emails directly from websites. Bypasses gatekeepers - cold email delivers the highest ROI. One deal recovers months of cost.","Get contacts of complementary businesses for referral partnerships, white-label deals, and bulk orders. One partnership brings 10x organic leads.","Extract leads from all websites in your clients industry and deliver on monthly retainer. Build a Rs.15K-Rs.50K/month recurring service."],
  "exim-domestic":     ["Find international importers already buying the same product - proven buyer, direct deal, maximum margin. No middleman.","Real trade data shows actual market rates. Find best-price supplier and enter negotiations from the strongest position. 20-40% cost savings possible.","Identify high-demand products from real import data, source from suppliers, connect with buyers. One successful trade delivers 10-30% margin."],
  "instagram-india":   ["Pitch directly using business contact info from active Instagram accounts. Social proof plus DM follow-up builds a high-conversion pipeline cheaper than ads.","Find micro-influencers (10K-100K followers) in your niche and collaborate. Authentic reach at lower cost delivers 3x better ROI than mega influencers.","Active Instagram businesses wanting to grow their social presence are your ideal clients. Pitch your social media services directly."],
  "linkedin-india":    ["Build a direct list of CEOs, Founders, and Purchase Managers. Personalized LinkedIn messages achieve 40%+ open rates - best B2B channel for high-ticket deals.","Target VPs and Directors of enterprise companies. One deal equals Rs.5L-Rs.50L+ contract value. LinkedIn leads are your highest-value pipeline tool.","Find candidates for specific skills and roles directly. Cost-per-hire drops dramatically - 5x cheaper than job portals. Direct approach means faster hiring."],
  "tender-india":      ["Government contracts never default on payment. Once registered as a vendor, you receive recurring annual contracts. Build a stable, predictable revenue stream.","Go from SME to enterprise: one government project generates lakhs to crores in revenue. GEM registration gives you reach to thousands of departments.","Most SMEs ignore government tenders - less competition, higher success rate. Indian SMEs consistently win IT, Supply, and Services contracts."],
  "group-domestic":    ["Your target audience already exists in these groups. Share value, build trust, and inbound leads arrive - Rs.0 marketing spend with consistent results.","When launching a new product, announce across 10-20 relevant groups and reach 10,000+ potential customers organically in minutes.","Staying active in industry groups brings referrals, partnerships, and co-promotions. One group connection can create multiple business opportunities."],
  "intl-map-leads":    ["Contact businesses in target countries that can use your product or service. No middleman - direct international deals with maximum margin.","International clients mean dollar or euro billing. Same service, 5-10x the revenue compared to domestic clients. The fastest way to go global.","Build country-specific lead lists and sell them to international companies. Run a global lead gen service from India at premium USD pricing."],
  "intl-web-leads":    ["Get direct emails of decision-makers at global companies. International cold outreach lands high-value contracts - most powerful channel for Indian IT firms.","US, UK, and Australia clients offer 5-10x higher project values versus domestic. Direct pitching via website leads is the biggest revenue upgrade for agencies.","Generate 1,000+ international business emails in hours. Automated drip campaigns plus your expertise means global client acquisition on near-autopilot."],
  "exim-intl":         ["Shipping records contain companies already importing your product. A proven buyer has the highest conversion potential - no cold discovery needed.","Real trade data proves international demand. Validate your export market then negotiate directly with importers and eliminate middlemen.","Identify suppliers with proven international trade histories. Compare quality and price using real data - never overpay on sourcing decisions again."],
  "instagram-leads":   ["Contact international businesses via Instagram. Pitch your product globally and land overseas clients and deals without buying a flight ticket.","Do product promotions and affiliate deals with global micro-influencers. Reach niche international audiences at low cost - cheaper than paid ads.","Tag, DM, and collaborate with businesses in your target country. Build international brand presence organically before investing in expensive paid campaigns."],
  "linkedin-leads":    ["Pitch CEOs in the US, UK, and UAE with personalized messages. Land premium contracts, dollar billing, and long-term retainers while sitting in India.","Connect with international founders and directors for white-label deals, distribution partnerships, and joint ventures. One global partnership delivers years of stable revenue.","Identify key players in your target market via LinkedIn. Market research plus direct outreach is the fastest and most affordable international expansion strategy."],
  "tender-intl":       ["UN and World Bank tenders mean USD payment at crore-level values. Indian IT, Engineering, and Consulting firms are already winning - check eligibility and apply.","One international tender win means a 2-5 year contract, guaranteed payment, and worldwide credibility. The strongest portfolio entry for future tenders.","An international tender shortlist proves to domestic clients that you meet global standards - justifying premium pricing for your business."],
  "__copy__":          ["Manual copywriting takes hours. AI copy takes minutes. Faster campaigns mean faster revenue. Turn todays idea into a live campaign before competitors react.","Deliver AI-generated and reviewed copy for clients. Charge Rs.5K-Rs.20K per platform set. Tool costs Rs.999/month while client value exceeds Rs.50K/month.","Easily create multiple copy variations, test them, and scale the best performer. Data-driven marketing lowers CAC, raises conversion, and improves ROI on every rupee."],
};

/* ── Steps ─────────────────────────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Input",      icon: "✦" },
  { n: 2, label: "Processing", icon: "⟳" },
  { n: 3, label: "Result",     icon: "◈" },
];

/* ── Loading screen ────────────────────────────────────────────────────────── */
function AuthLoading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.pageBg, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 4 }}>
          <img src="/assets/img/fevicon.svg" alt="ThinkSuite" style={{ height: 44, width: 44, borderRadius: 12, objectFit: "contain" }} />
          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em", fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ color: "#fff" }}>Think</span><span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Suite</span>
          </div>
        </div>
        <div style={{ marginBottom: 20 }} />
        <div style={{ width: 36, height: 36, border: `3px solid ${T.accentBorder}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

/* ── Subscription badge ────────────────────────────────────────────────────── */
function SubBadge({ slug, onSubscribe }) {
  const { getToolStatus, getTrialDaysLeft } = usePlan();
  const status = getToolStatus(slug);
  const daysLeft = status === "trial" ? getTrialDaysLeft(slug) : null;

  if (status === "active") {
    return (
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 6, padding: "3px 8px" }}>
        PRO
      </div>
    );
  }
  if (status === "trial") {
    return (
      <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 6, padding: "3px 8px" }}>
        {daysLeft}d left
      </div>
    );
  }
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSubscribe(); }}
      style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}
    >
      Subscribe
    </button>
  );
}

/* ── Sidebar ───────────────────────────────────────────────────────────────── */
function Sidebar({ currentSlug, isMobileOpen, isMobile, onClose, features, activeFeature, onFeatureChange, onSuggest, onFeedback, sidebarBottom }) {
  const { showSubscribe } = usePlan();

  // Current tool info for header
  const currentTool = SIDEBAR_TOOLS.find((t) => t.slug === currentSlug);
  const hasFeatures = features && features.length > 0;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        />
      )}

      <aside style={{
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        width: 220,
        background: T.sidebarBg,
        borderRight: `1px solid ${T.navBorder}`,
        backdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
        transform: isMobile
          ? (isMobileOpen ? "translateX(0)" : "translateX(-100%)")
          : undefined,
        transition: "transform 0.25s ease",
        overflowY: "auto",
      }}>

        {/* Logo */}
        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${T.navBorder}` }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/assets/img/fevicon.svg" alt="ThinkSuite" style={{ height: 28, width: 28, borderRadius: 6, objectFit: "contain", flexShrink: 0 }} />
            <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", fontFamily: "'Outfit',sans-serif" }}>
              <span style={{ color: "#fff" }}>Think</span><span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Suite</span>
            </div>
          </Link>
        </div>

        {/* Dashboard back link */}
        <div style={{ padding: "10px 10px 6px" }}>
          <Link href="/dashboard"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 10,
              textDecoration: "none", color: T.textMuted,
              fontSize: 12, fontWeight: 600, transition: "all 0.18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; }}
          >
            <span style={{ fontSize: 11 }}>←</span> Dashboard
          </Link>
        </div>

        {/* ── If features provided: show tool header + features list ── */}
        {hasFeatures && currentTool && (
          <>
            {/* Tool name header */}
            <div style={{ padding: "6px 10px 4px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "10px 10px", borderRadius: 10,
                background: `${currentTool.color}12`,
                border: `1px solid ${currentTool.color}28`,
              }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: `${currentTool.color}20`,
                  border: `1px solid ${currentTool.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  flexShrink: 0,
                }}>{currentTool.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{currentTool.label}</span>
              </div>
            </div>

            {/* Features list */}
            <div style={{ padding: "4px 10px", flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: T.textMuted, textTransform: "uppercase", padding: "8px 10px 8px", }}>
                Features
              </div>
              {features.map((f) => {
                // Section group headers
                if (f.id === "__domestic__" || f.id === "__intl__") {
                  return (
                    <div key={f.id}>
                      {f.id === "__intl__" && (
                        <div style={{ margin: "8px 10px 6px", height: 1, background: "rgba(255,255,255,0.07)" }} />
                      )}
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: T.textMuted, textTransform: "uppercase", padding: "6px 10px 4px" }}>
                        {f.label}
                      </div>
                    </div>
                  );
                }

                // Visual separator before Copy Generator sentinel
                if (f.id === "__copy__") {
                  const isActive = activeFeature === f.id;
                  return (
                    <div key={f.id}>
                      <div style={{ margin: "10px 10px 8px", height: 1, background: "rgba(255,255,255,0.07)" }} />
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: T.textMuted, textTransform: "uppercase", padding: "0 10px 6px" }}>
                        Lead Ad Campaign
                      </div>
                      <button
                        onClick={() => { onFeatureChange(f.id); if (isMobileOpen) onClose(); }}
                        style={{
                          width: "100%", textAlign: "left",
                          display: "flex", alignItems: "center", gap: 9,
                          padding: "9px 10px", borderRadius: 10, marginBottom: 2,
                          background: isActive ? "rgba(124,58,237,0.18)" : "transparent",
                          border: `1px solid ${isActive ? "rgba(124,58,237,0.35)" : "transparent"}`,
                          cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                        }}
                        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; } }}
                        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
                      >
                        <span style={{ fontSize: 14, flexShrink: 0, width: 20, textAlign: "center" }}>{f.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : T.textMuted, lineHeight: 1.3 }}>
                          {f.label}
                        </span>
                        {isActive && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                      </button>
                    </div>
                  );
                }

                const isActive = activeFeature === f.id;
                const bgColor = isActive
                  ? `${currentTool.color}18`
                  : f.isNew
                    ? "rgba(59,130,246,0.06)"
                    : "transparent";
                const borderColor = isActive
                  ? `${currentTool.color}35`
                  : f.isNew
                    ? "rgba(59,130,246,0.18)"
                    : "transparent";
                return (
                  <button
                    key={f.id}
                    onClick={() => { onFeatureChange(f.id); if (isMobileOpen) onClose(); }}
                    style={{
                      width: "100%", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "9px 10px", borderRadius: 10, marginBottom: 2,
                      background: bgColor,
                      border: `1px solid ${borderColor}`,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = f.isNew ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = f.isNew ? "rgba(59,130,246,0.28)" : "rgba(255,255,255,0.06)"; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = f.isNew ? "rgba(59,130,246,0.06)" : "transparent"; e.currentTarget.style.borderColor = f.isNew ? "rgba(59,130,246,0.18)" : "transparent"; } }}
                  >
                    <span style={{ fontSize: 14, flexShrink: 0, width: 20, textAlign: "center" }}>{f.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : f.isNew ? "rgba(255,255,255,0.85)" : T.textMuted, lineHeight: 1.3, flex: 1 }}>
                      {f.label}
                    </span>
                    {f.testing && (
                      <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 4, background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)", letterSpacing: 0.3, flexShrink: 0 }}>
                        BETA
                      </span>
                    )}
                    {f.isNew && !isActive && (
                      <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)", letterSpacing: 0.3, flexShrink: 0 }}>
                        NEW
                      </span>
                    )}
                    {isActive && !f.testing && (
                      <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: currentTool.color, flexShrink: 0 }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Optional injected content above bottom buttons */}
            {sidebarBottom && (
              <div style={{ padding: "0 10px 4px" }}>{sidebarBottom}</div>
            )}
          </>
        )}

        {/* ── Default: show all tools list (when no features provided) ── */}
        {!hasFeatures && (
          <>
            <div style={{ padding: "4px 10px", flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: T.textMuted, textTransform: "uppercase", padding: "6px 10px 10px", marginBottom: 2 }}>
                AI Tools
              </div>

              {SIDEBAR_TOOLS.map((t) => {
                const isActive = currentSlug === t.slug;
                return (
                  <Link
                    key={t.slug}
                    href={`/dashboard/${t.slug}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 10px", borderRadius: 10, marginBottom: 2,
                      background: isActive ? `${t.color}14` : "transparent",
                      border: `1px solid ${isActive ? `${t.color}35` : "transparent"}`,
                      textDecoration: "none",
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: isActive ? `${t.color}20` : "rgba(255,255,255,0.05)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                        border: `1px solid ${isActive ? `${t.color}30` : "transparent"}`,
                        flexShrink: 0,
                      }}>{t.icon}</span>
                      <span style={{ fontSize: 12.5, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : T.textMuted, lineHeight: 1.2, letterSpacing: -0.1 }}>
                        {t.label}
                      </span>
                    </div>
                    <SubBadge slug={t.slug} onSubscribe={() => showSubscribe(t.slug)} />
                  </Link>
                );
              })}
            </div>

          </>
        )}
      </aside>
    </>
  );
}

/* ── Step indicator ────────────────────────────────────────────────────────── */
function StepBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "18px 24px" }}>
      {STEPS.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, transition: "all 0.3s",
                background: done ? T.success : active ? T.accent : "rgba(255,255,255,0.06)",
                border: `2px solid ${done ? T.success : active ? T.accent : "rgba(255,255,255,0.1)"}`,
                color: (done || active) ? "#fff" : T.textMuted,
                boxShadow: active ? `0 0 18px rgba(124,58,237,0.4)` : "none",
              }}>
                {done ? "✓" : s.icon}
              </div>
              <div style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: done ? T.success : active ? T.accent : T.textMuted, letterSpacing: 0.3 }}>
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="step-connector" style={{ width: 72, height: 2, margin: "0 6px", marginBottom: 18, background: done ? T.success : `linear-gradient(90deg,${active ? T.accent : "rgba(255,255,255,0.07)"},rgba(255,255,255,0.07))`, borderRadius: 2, transition: "all 0.3s" }}>
                <style>{`@media(max-width:480px){.step-connector{width:36px !important;}}`}</style>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Quick Tips Section ────────────────────────────────────────────────────── */
function QuickTipsSection({ slug, activeFeature }) {
  const [open, setOpen]             = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => { setShowDetail(false); }, [activeFeature]);

  const featureTip = activeFeature ? TOOL_FEATURE_TIPS[slug]?.[activeFeature] : null;
  const toolTip    = TOOL_QUICK_TIPS[slug];
  const displayTip = featureTip || toolTip;

  if (!displayTip?.english && !displayTip?.flow) return null;

  const label = featureTip?.label || toolTip?.label || slug;

  return (
    <div style={{ marginTop: 40 }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: open ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.06)",
          border: "1px solid rgba(124,58,237,0.2)", borderRadius: open ? "16px 16px 0 0" : 16,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", transition: "all 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd" }}>
            {label} How to Use
          </span>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", display: "inline-block", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▼</span>
      </button>

      {open && (
        <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.2)", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "20px 20px 24px" }}>

          {/* Flow Diagram */}
          {displayTip.flow && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Step-by-Step Flow</div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                {displayTip.flow.map((step, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 12px",
                      background: idx === 0 ? "rgba(124,58,237,0.18)" : idx === displayTip.flow.length - 1 ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${idx === 0 ? "rgba(124,58,237,0.4)" : idx === displayTip.flow.length - 1 ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 20,
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: idx === 0 ? "#7c3aed" : idx === displayTip.flow.length - 1 ? "#3b82f6" : "rgba(255,255,255,0.3)", lineHeight: 1 }}>{idx + 1}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: idx === 0 || idx === displayTip.flow.length - 1 ? "#fff" : "rgba(255,255,255,0.62)", whiteSpace: "nowrap" }}>{step}</span>
                    </div>
                    {idx < displayTip.flow.length - 1 && (
                      <span style={{ fontSize: 12, color: "rgba(124,58,237,0.55)", flexShrink: 0 }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview card */}
          {displayTip.english && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Overview</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>{displayTip.english}</div>
              </div>
            </div>
          )}

          {/* Pro Tips (collapsible) */}
          {displayTip.detail && (
            <div style={{ marginBottom: displayTip.business ? 18 : 0 }}>
              <button
                onClick={() => setShowDetail(d => !d)}
                style={{
                  background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 7, padding: "4px 0", marginBottom: showDetail ? 10 : 0,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2, textTransform: "uppercase" }}>📖 Pro Tips / Detail</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", transform: showDetail ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
              </button>
              {showDetail && (
                <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.52)", lineHeight: 1.85 }}>{displayTip.detail}</div>
                </div>
              )}
            </div>
          )}

          {/* ── Business Impact ── */}
          {displayTip.business && displayTip.business.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(59,130,246,0.15)", paddingTop: 18, marginTop: displayTip.detail ? 0 : 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 15 }}>💼</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#3b82f6", letterSpacing: 1.5, textTransform: "uppercase" }}>How Will This Feature Grow Your Business?</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 10 }}>
                {displayTip.business.map((item, i) => {
                  const englishText = (LEAD_GEN_BUSINESS_EN[activeFeature] || [])[i] || item.english || item.desc || null;
                  return (
                    <div key={i} style={{ padding: "14px 15px", background: "linear-gradient(135deg,rgba(59,130,246,0.08),rgba(59,130,246,0.03))", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 12 }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#6ee7b7", marginBottom: 9 }}>{item.title}</div>
                      {englishText && (
                        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>{englishText}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Feedback Modal ──────────────────────────────────────────────────────── */
function FeedbackModal({ onClose, slug, toolTitle, activeFeature, features }) {
  const { user } = useAuth();
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");

  const featureLabel = features?.find(f => f.id === activeFeature)?.label;

  async function submit() {
    if (!message.trim()) { setError("Feedback likhna zaroori hai"); return; }
    setLoading(true); setError("");
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken, toolSlug: slug, toolName: toolTitle,
          featureId: activeFeature || null, featureName: featureLabel || null,
          message: message.trim(), rating: rating || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true); setMessage(""); setRating(0);
      setTimeout(() => { setSuccess(false); onClose(); }, 2200);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 498, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 499, width: "min(480px,94vw)", maxHeight: "90vh", overflowY: "auto",
        background: "rgba(10,12,28,0.98)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "28px", boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>💬 Give Feedback</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>
              Share your experience with {featureLabel ? `${toolTitle} → ${featureLabel}` : toolTitle}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.6)", width: 32, height: 32, cursor: "pointer", fontSize: 16, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.52)", marginBottom: 8 }}>Rating (optional)</div>
          <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setRating(s === rating ? 0 : s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
                  fontSize: 28, lineHeight: 1,
                  color: s <= (hoverRating || rating) ? "#3b82f6" : "rgba(255,255,255,0.13)",
                  transition: "color 0.12s, transform 0.1s",
                  transform: s <= (hoverRating || rating) ? "scale(1.2)" : "scale(1)",
                }}
              >★</button>
            ))}
          </div>
        </div>

        <textarea
          value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Share your experience, suggestions, or any feedback here..."
          rows={4}
          style={{
            width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 14,
            outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
          }}
          onFocus={e => { e.target.style.borderColor = T.accent; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />

        {error   && <div style={{ fontSize: 12, color: "#f87171", marginTop: 8 }}>⚠ {error}</div>}
        {success && <div style={{ fontSize: 12, color: T.success, marginTop: 8 }}>✓ Feedback submitted! Thank you 🙏</div>}

        <button
          onClick={submit}
          disabled={loading || !message.trim()}
          style={{
            marginTop: 14, width: "100%", padding: "13px", borderRadius: 10,
            cursor: loading || !message.trim() ? "not-allowed" : "pointer",
            background: loading || !message.trim()
              ? "rgba(255,255,255,0.06)"
              : `linear-gradient(135deg,${T.accent},${T.success})`,
            border: "none", color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit",
            opacity: !message.trim() ? 0.5 : 1,
          }}
        >
          {loading ? "Sending..." : "Submit Feedback →"}
        </button>
      </div>
    </>
  );
}

/* ── Suggestion Modal ──────────────────────────────────────────────────────── */
function SuggestionModal({ onClose, slug }) {
  const { user } = useAuth();
  const [type, setType]               = useState("feature");
  const [relatedTool, setRelatedTool] = useState(slug || "");
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");

  async function submit() {
    if (!title.trim() || !description.trim()) { setError("Title and description are both required"); return; }
    setLoading(true); setError("");
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken, type, title: title.trim(), description: description.trim(),
          relatedTool: type === "feature" ? relatedTool : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 2200);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const inputSt = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 498, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 499, width: "min(500px,94vw)", maxHeight: "90vh", overflowY: "auto",
        background: "rgba(10,12,28,0.98)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "28px", boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>💡 Give a Suggestion</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>Share your idea for a new tool or feature</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.6)", width: 32, height: 32, cursor: "pointer", fontSize: 16, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[
            { id: "feature", label: "🔧 New Feature", sub: "In an existing tool" },
            { id: "tool",    label: "🛠 New Tool",    sub: "A brand new tool" },
          ].map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                background: type === t.id ? T.accentDim : "rgba(255,255,255,0.04)",
                border: `1px solid ${type === t.id ? T.accentBorder : "rgba(255,255,255,0.08)"}`,
                color: type === t.id ? "#7c3aed" : T.textMuted, textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.65 }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {type === "feature" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.52)", display: "block", marginBottom: 6 }}>Which tool?</label>
            <select value={relatedTool} onChange={e => setRelatedTool(e.target.value)}
              style={{ ...inputSt, cursor: "pointer", appearance: "none" }}
            >
              <option value="" style={{ background: "#0f2640" }}>Select a tool...</option>
              {SIDEBAR_TOOLS.map(t => (
                <option key={t.slug} value={t.slug} style={{ background: "#0f2640" }}>{t.label}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.52)", display: "block", marginBottom: 6 }}>
            {type === "tool" ? "Name of new tool" : "Feature name / title"}
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder={type === "tool" ? "e.g. Email Marketing Tool" : "e.g. Bulk Export Feature"}
            style={inputSt}
            onFocus={e => { e.target.style.borderColor = T.accent; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.52)", display: "block", marginBottom: 6 }}>
            Describe it what do you need and why would it be useful?
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="The more detail you provide, the better we can implement it..."
            rows={4}
            style={{ ...inputSt, resize: "vertical" }}
            onFocus={e => { e.target.style.borderColor = T.accent; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
        </div>

        {error   && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 12 }}>⚠ {error}</div>}
        {success && <div style={{ fontSize: 12, color: T.success, marginBottom: 12 }}>✓ Suggestion submitted! We'll definitely consider it 🙏</div>}

        <button onClick={submit} disabled={loading || !title.trim() || !description.trim()}
          style={{
            width: "100%", padding: "13px", borderRadius: 10,
            cursor: loading || !title.trim() || !description.trim() ? "not-allowed" : "pointer",
            background: loading || !title.trim() || !description.trim()
              ? "rgba(255,255,255,0.06)"
              : `linear-gradient(135deg,${T.accent},${T.success})`,
            border: "none", color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit",
            opacity: !title.trim() || !description.trim() ? 0.5 : 1,
          }}
        >
          {loading ? "Sending..." : "Send Suggestion →"}
        </button>
      </div>
    </>
  );
}

/* ── Main ToolShell export ─────────────────────────────────────────────────── */
/**
 * Props:
 *   title          : tool name shown in topbar
 *   icon           : emoji icon
 *   slug           : tool slug
 *   step           : 1|2|3
 *   maxWidth       : content max-width (default 900)
 *   features       : Array<{ id, icon, label }> -shown in sidebar
 *   activeFeature  : string -currently selected feature id
 *   onFeatureChange: (id) => void -called on sidebar feature click
 *   children
 */
export default function ToolShell({ title = "AI Tool", icon = "✦", slug = "tool", step = 1, maxWidth = 900, hideSteps = false, features, activeFeature, onFeatureChange, sidebarBottom, children }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { getToolStatus, canUseTool, showSubscribe, subsLoaded, isAdmin, getToolPrice } = usePlan();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [suggestOpen, setSuggestOpen]   = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/tools/lead-generation");
  }, [loading, user, router]);

  if (loading || !user) return <AuthLoading />;

  // Wait for Firestore subs to load before deciding lock state
  // This prevents the "flash of locked screen" right after payment
  if (!subsLoaded) return <AuthLoading />;

  const toolStatus = getToolStatus(slug);
  const isLocked   = !isAdmin && !canUseTool(slug) && (toolStatus === "none" || toolStatus === "expired");

  const SIDEBAR_W = 220;

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, color: T.text, fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif", overflowX: "hidden" }}>

      {/* ── Sidebar ── */}
      <Sidebar
        currentSlug={slug} isMobileOpen={sidebarOpen} isMobile={isMobile}
        onClose={() => setSidebarOpen(false)} features={features}
        activeFeature={activeFeature} onFeatureChange={onFeatureChange}
        onSuggest={() => setSuggestOpen(true)}
        onFeedback={() => setFeedbackOpen(true)}
        sidebarBottom={sidebarBottom}
      />

      {/* ── Main content area (offset by sidebar on desktop) ── */}
      <div style={{ marginLeft: isMobile ? 0 : SIDEBAR_W, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── Top Navbar ── */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: T.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.navBorder}`, padding: "0 20px" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Mobile hamburger */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.navBorder}`, borderRadius: 8, color: "#fff", fontSize: 16, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  ☰
                </button>
              )}

              {/* Tool identifier */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{icon}</span>
                {/* Tool name is clickable → goes to landing page */}
                <Link href={`/tools/${slug}`} style={{ fontSize: 14, fontWeight: 700, color: T.text, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = T.text}
                >
                  {title}
                </Link>
              </div>
            </div>

            {/* Right: subscription status + user */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {!isMobile && (
                isLocked
                  ? (
                    <button
                      onClick={() => router.push(`/tools/${slug}`)}
                      style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                    >
                      Choose MyThinkAI →
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/tools/${slug}`)}
                      style={{ fontSize: 11, fontWeight: 700, color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = T.accentDim; }}
                    >
                      Access MyThinkAI →
                    </button>
                  )
              )}

              <div style={{ width: 1, height: 18, background: T.navBorder }} />
              {!isMobile && <span style={{ fontSize: 11, color: T.textMuted }}>{user.email?.split("@")[0]}</span>}

              {/* Profile button + dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${T.accent},#3b82f6)`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, cursor: "pointer", boxShadow: profileOpen ? "0 0 0 3px rgba(124,58,237,0.3)" : "none", transition: "box-shadow 0.2s" }}
                >
                  {(user.email?.[0] ?? "U").toUpperCase()}
                </button>

                {profileOpen && (
                  <>
                    <div onClick={() => setProfileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 299 }} />
                    <div style={{ position: "absolute", top: 36, right: 0, zIndex: 300, width: 230, background: "rgba(10,22,38,0.98)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", backdropFilter: "blur(20px)" }}>
                      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${T.accent},#3b82f6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                          {(user.email?.[0] ?? "U").toUpperCase()}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{user.displayName || "User"}</div>
                        <div style={{ fontSize: 11, color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                      </div>

                      <button onClick={() => { router.push("/dashboard"); setProfileOpen(false); }}
                        style={{ width: "100%", padding: "12px 18px", background: "rgba(124,58,237,0.08)", border: "none", display: "flex", alignItems: "center", gap: 12, color: "#7c3aed", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: "inherit" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
                      >
                        <span style={{ fontSize: 16 }}>🏠</span> Dashboard
                      </button>

                      {[
                        { icon: "🏠", label: "My Dashboard",     action: () => { router.push("/dashboard/me"); setProfileOpen(false); } },
                        { icon: "👤", label: "Edit Profile",     action: () => { router.push("/dashboard/profile"); setProfileOpen(false); } },
                        { icon: "💳", label: "My Subscriptions", action: () => { router.push("/dashboard/subscriptions"); setProfileOpen(false); } },
                        { icon: "⚙️", label: "Settings",         action: () => { router.push("/dashboard/settings"); setProfileOpen(false); } },
                      ].map(item => (
                        <button key={item.label} onClick={item.action}
                          style={{ width: "100%", padding: "12px 18px", background: "transparent", border: "none", display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "inherit" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                        >
                          <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
                        </button>
                      ))}

                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "6px 0" }}>
                        <button onClick={async () => { setProfileOpen(false); await signOut(); router.replace("/tools/lead-generation"); }}
                          style={{ width: "100%", padding: "11px 18px", background: "transparent", border: "none", display: "flex", alignItems: "center", gap: 12, color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "inherit" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{ fontSize: 16 }}>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* ── Suggestion Modal ── */}
        {suggestOpen && <SuggestionModal onClose={() => setSuggestOpen(false)} slug={slug} />}

        {/* ── Feedback Modal ── */}
        {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} slug={slug} toolTitle={title} activeFeature={activeFeature} features={features} />}

        {/* ── Locked overlay ── */}
        {isLocked && (
          <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(7,14,24,0.88)", backdropFilter: "blur(12px)", marginLeft: isMobile ? 0 : SIDEBAR_W }}>
            <div style={{ textAlign: "center", padding: "40px 32px", background: "#0d1f35", border: `1px solid ${T.navBorder}`, borderRadius: 24, maxWidth: 360, width: "90%" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 1.7 }}>
                Subscribe for full access <strong style={{ color: "#3b82f6" }}>₹{getToolPrice(slug).toLocaleString("en-IN")}/month</strong>.
              </p>
              <button
                onClick={() => showSubscribe(slug)}
                style={{ padding: "13px 32px", background: `linear-gradient(135deg,${T.accent},#3b82f6)`, border: "none", borderRadius: 12, color: "#ffffff", fontSize: 15, fontWeight: 800, cursor: "pointer", width: "100%", fontFamily: "inherit" }}
              >
                Subscribe Now ₹{getToolPrice(slug).toLocaleString("en-IN")}/month
              </button>
              <Link href="/dashboard" style={{ display: "block", marginTop: 14, fontSize: 12, color: T.textMuted, textDecoration: "none" }}>
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* ── Step Indicator ── */}
        {!hideSteps && <StepBar current={step} />}

        {/* ── Tool Content ── */}
        <main className="tool-main" style={{ maxWidth, margin: "0 auto", padding: "0 20px 80px", width: "100%", flex: 1 }}>
          <style>{`@media(max-width:600px){.tool-main{padding:0 12px 60px !important;}}`}</style>
          {children}
          <QuickTipsSection slug={slug} activeFeature={activeFeature} />
        </main>
      </div>
    </div>
  );
}

/* ── Re-usable exports ─────────────────────────────────────────────────────── */
export function ToolCard({ children, style = {} }) {
  return (
    <div className="tool-card" style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: "32px 28px", ...style }}>
      <style>{`@media(max-width:600px){.tool-card{padding:20px 16px !important;border-radius:14px !important;}}`}</style>
      {children}
    </div>
  );
}

export function ToolHeading({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, marginBottom: 6 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: T.textMuted, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, loading, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 28px", borderRadius: 12, border: "none",
        background: disabled || loading ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg,${T.accent},#3b82f6)`,
        color: disabled || loading ? T.textMuted : "#fff",
        fontSize: 14, fontWeight: 700, cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        boxShadow: disabled || loading ? "none" : `0 0 30px rgba(124,58,237,0.25)`,
        ...style,
      }}
    >
      {loading && <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

export function ToolInput({ label, value, onChange, placeholder, type = "text", style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{label}</label>}
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 14, outline: "none", transition: "border-color 0.2s", fontFamily: "inherit" }}
        onFocus={(e) => e.target.style.borderColor = T.accent}
        onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
      />
    </div>
  );
}

export function ToolSelect({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{label}</label>}
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 14, outline: "none", cursor: "pointer", fontFamily: "inherit", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2322D3EE' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#0f2640", color: "#fff" }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 12, padding: "12px 16px", marginTop: 16, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, fontSize: 13, color: "#fca5a5" }}>
      <span style={{ flex: 1, minWidth: 0, wordBreak: "break-word", overflowWrap: "break-word" }}>⚠ {message}</span>
      {onDismiss && <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 16, padding: 0, flexShrink: 0 }}>×</button>}
    </div>
  );
}

export function ModeGrid({ label, options, value, onChange, minWidth = 220 }) {
  return (
    <div>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 10 }}>{label}</label>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`, gap: 8 }}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value} onClick={() => onChange(opt.value)}
              style={{ textAlign: "left", padding: "12px 14px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", background: active ? T.accentDim : "rgba(255,255,255,0.03)", border: `1px solid ${active ? T.accentBorder : "rgba(255,255,255,0.08)"}`, transition: "all 0.18s", boxShadow: active ? `0 0 0 1px ${T.accentBorder}` : "none" }}
            >
              <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? T.accent : "rgba(255,255,255,0.75)", marginBottom: opt.hint ? 3 : 0 }}>
                {opt.label}
              </div>
              {opt.hint && <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.4 }}>{opt.hint}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { T };

