import OpenAI from "openai";
import { getAIClient } from "@/lib/aiClient";

const openai    = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "build-placeholder" });
const anthropic = getAIClient();

const SYSTEM_PROMPT = `You are a senior B2B/B2C growth marketer and lead generation strategist with 10+ years of experience.
You specialize in AI-powered marketing tools, SaaS platforms, and full-funnel lead generation across all major ad platforms.
You write conversion-obsessed, platform-native copy that attracts, nurtures, and converts high-intent prospects.

Core psychological triggers to embed: FOMO, Social Proof, Aspiration, Curiosity, Loss Aversion, Urgency.
Always respect the brand tone, campaign objective, budget context, language preference, and any offer/CTA provided.

Platform-specific rules:
- Google Search Ads: Max 30 chars per headline, max 90 chars per description. High-intent, keyword-rich, action-oriented.
- Instagram Reel: Scroll-stopping 3-second hook, emotional caption with line breaks and emojis, relevant hashtags.
- LinkedIn Organic: Thought leadership voice, hook first line, value-packed body, subtle CTA. Founders & decision-makers as audience.
- LinkedIn InMail: Highly personalized, short, respectful of their time. Subject under 60 chars. Body under 100 words.
- Cold Email: Curiosity-driven subject, 3 tight paragraphs (problem → solution → CTA), under 150 words total.
- WhatsApp: Conversational, punchy, casual tone. Under 60 words. Feels like it's from a real person, not a brand.

You will generate 6 platform-specific copy pieces. Return ONLY valid JSON – no markdown, no explanation, no backticks.

JSON structure (all fields required, no placeholders):
{
  "google": {
    "headlines": ["headline1 (max 30 chars)", "headline2 (max 30 chars)", "headline3 (max 30 chars)"],
    "descriptions": ["description1 (max 90 chars)", "description2 (max 90 chars)"]
  },
  "instagram": {
    "hook": "3-second scroll-stopping hook line",
    "caption": "Full Instagram caption with emojis, value prop, pain agitation, CTA",
    "hashtags": "15-20 relevant hashtags as a single string"
  },
  "linkedin": {
    "post": "Full thought leadership post, 150-200 words, line breaks for readability, strong CTA at end"
  },
  "inmail": {
    "subject": "InMail subject line (under 60 chars)",
    "body": "Personalized cold DM/InMail for founders and marketing heads, under 100 words"
  },
  "email": {
    "subject": "Email subject line (curiosity + urgency)",
    "body": "3-paragraph cold email body + CTA, under 150 words total"
  },
  "whatsapp": {
    "message": "Casual, punchy WhatsApp message, under 60 words, includes website link"
  }
}`;

const OBJECTIVE_LABELS = {
  "lead-gen":        "Lead Generation (capture contact info, book demos)",
  "brand-awareness": "Brand Awareness (reach, impressions, recall)",
  "sales":           "Direct Sales / Conversion (buy now, sign up, pay)",
  "traffic":         "Website Traffic (clicks to landing page)",
  "app-downloads":   "App Downloads (installs, signups via app)",
};

const TONE_LABELS = {
  "bold":         "Bold & Aggressive – in-your-face, urgent, disruption-driven",
  "professional": "Professional & Trustworthy – authoritative, data-backed, credible",
  "casual":       "Casual & Friendly – conversational, relatable, approachable",
  "luxury":       "Luxury & Premium – aspirational, exclusive, high-end language",
  "educational":  "Educational – informative, value-first, thought leadership",
};

const BUDGET_LABELS = {
  "small":  "Small budget (under ₹5k/month) – focus on organic reach, word-of-mouth CTAs, low-risk hooks",
  "medium": "Medium budget (₹5k–₹25k/month) – balanced paid + organic, test multiple angles",
  "large":  "Large budget (₹25k+/month) – go all-in on paid, bold claims, retargeting language OK",
};

export async function POST(request) {
  try {
    const {
      productName, website, usp, targetAudience, pain,
      objective = "lead-gen", tone = "bold", language = "english",
      budget = "medium", offer = "", competitor = "",
      model = "openai",
    } = await request.json();

    if (!productName?.trim()) {
      return Response.json({ error: "Product name required" }, { status: 400 });
    }

    const langNote = "Write all copy in fluent, natural English.";

    const userMessage = `Generate a complete, conversion-ready lead generation campaign for this product:

Product Name: ${productName}
Website: ${website || "Not provided"}
USP / Key Benefit: ${usp || "Not provided"}
Target Audience: ${targetAudience || "Small business owners, digital marketers, startup founders"}
Core Pain Point: ${pain || "Too much time wasted on marketing, high agency costs, inconsistent results"}
Campaign Objective: ${OBJECTIVE_LABELS[objective] || objective}
Brand Tone: ${TONE_LABELS[tone] || tone}
Language: ${langNote}
Ad Budget Context: ${BUDGET_LABELS[budget] || budget}
Offer / CTA: ${offer || "Not specified – create a compelling generic CTA"}
Competitors to differentiate from: ${competitor || "Not provided"}

Rules:
- Use the product name, website URL, and USPs throughout all copy
- Every word must earn its place – no filler, no generic lines
- Respect the tone and objective in every platform section
- If competitors are provided, subtly position against them without naming them directly
- If an offer is provided, feature it prominently in CTAs
- ${langNote}

Return ONLY the JSON object – no other text.`;

    let raw = "";

    if (model === "claude") {
      const msg = await anthropic.messages.create({
        model:      "claude-sonnet-4-6",
        max_tokens: 2500,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: "user", content: userMessage }],
      });
      raw = msg.content[0]?.text?.trim() || "";
    } else {
      const completion = await openai.chat.completions.create({
        model:       "gpt-4o",
        messages:    [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userMessage },
        ],
        max_tokens:      2500,
        temperature:     0.75,
        response_format: { type: "json_object" },
      });
      raw = completion.choices[0]?.message?.content?.trim() || "";
    }

    const jsonStart = raw.indexOf("{");
    const jsonEnd   = raw.lastIndexOf("}");
    const jsonStr   = jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
    const result    = JSON.parse(jsonStr);

    return Response.json({ success: true, result, model });
  } catch (err) {
    console.error("Lead-copy generate error:", err);
    return Response.json(
      { error: err.message || "Copy generation mein error aaya" },
      { status: 500 }
    );
  }
}
