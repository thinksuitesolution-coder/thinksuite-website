import { withCreditGuard } from "@/lib/apiCreditMonitor";
import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      contentType,
      topic,
      tone,
      language,
      keywords,
      extraContext,
      wordCount,
      blogStyle,
      extraDetail,
    } = body;

    if (!topic?.trim()) {
      return Response.json({ error: "Please enter a topic!" }, { status: 400 });
    }

    // ── Build prompt ──────────────────────────────────────────────────────────
    const langMap = {
      hinglish: "English (casual, conversational tone)",
      hindi: "English (formal tone)",
      english: "English",
    };

    const toneMap = {
      professional: "Professional & authoritative",
      casual: "Casual & conversational",
      persuasive: "Persuasive & compelling",
      educational: "Educational & informative",
      humorous: "Humorous & witty",
      urgent: "Urgent & action-driven",
    };

    const blogStyleGuides = {
      filmy_story: `Structure this like a Bollywood film:
## OPENING SCENE: Start mid-action - a dramatic, cinematic moment that pulls the reader in
## ACT 1 - THE SETUP: Introduce the struggle/conflict with vivid emotion and stakes
## ACT 2 - THE TURNING POINT: The moment everything changes (topic/product as the hero)
## ACT 3 - THE TRANSFORMATION: Glorious resolution with rich detail
## MORAL & TAKEAWAY: The life lesson, clearly stated
## CALL TO ACTION: Emotional, inspiring - make them feel the next step
Use dramatic language, cultural references, dialogue snippets, and vivid imagery.`,

      emotional: `Write with raw emotional honesty:
## THE MOMENT: Open with a deeply personal, universally relatable experience or pain
## THE STRUGGLE: Describe the feeling in detail - make the reader feel truly seen and understood
## THE REALIZATION: A turning point - a moment of clarity or discovery
## THE SHIFT: How things changed and what made the difference
## HEART OF THE MESSAGE: Speak directly to the reader - "you are not alone"
## GENTLE CTA: Invite warmly, don't push
Use "you", short sentences for impact, vulnerability, and empathy throughout.`,

      motivational: `Write to ignite unstoppable action:
## POWER HOOK: A bold statement or confronting question that disrupts their comfort zone
## THE TRUTH BOMB: Reveal an uncomfortable reality about where they currently are
## THE VISION: Paint a vivid, specific picture of what becomes possible
## THE PATH: Break down exactly how to get there (3-5 clear steps)
## DESTROY THE DOUBTS: Tackle their #1 internal excuse head-on
## THE RALLY CRY: High-energy close - short punchy sentences, make them want to leap up NOW
Use "you can", "you will", power verbs, and momentum-building rhythm.`,

      sales_pitch: `Write to convert readers into buyers:
## HOOK: Lead with the #1 transformation or a bold, specific claim
## THE PROBLEM: Make the pain crystal clear - what it's costing them daily
## THE SOLUTION: Introduce the product/service as the logical, inevitable answer
## WHY IT WORKS: Core mechanism - what makes this different from everything else they've tried
## PROOF: Results, numbers, testimonials, social proof
## OBJECTION CRUSHER: Address the top 2 hesitations directly
## CTA: Urgency + clarity - exactly what to do next, and why now
Every sentence earns its place. No fluff. Benefit-driven language throughout.`,

      problem_solution: `Use the PAS framework (Problem → Agitate → Solve):
## THE PROBLEM: Name it clearly - call out exactly who this is for and what they're dealing with
## AGITATE: Go deeper - what does this problem cost them? How frustrating is it? What's at stake if unsolved?
## WHY EXISTING SOLUTIONS FAIL: Why haven't they fixed it yet? What's missing?
## THE SOLUTION: Introduce the answer - clear, logical, satisfying
## HOW IT WORKS: Step-by-step or key benefits that make it real
## PROOF & CREDIBILITY: Evidence that it works
## CTA: The obvious, frictionless next step`,

      case_study: `Tell a compelling before-and-after transformation story:
## MEET [NAME/TYPE]: Introduce a relatable person or brand in 2-3 lines
## THE BEFORE: Their exact situation - struggles, what they tried, why it wasn't working
## THE DISCOVERY: How they found this solution - the "aha" moment
## THE IMPLEMENTATION: What they actually did, step by step
## THE RESULTS: Specific, measurable outcomes - numbers, timelines, changes
## THE LESSON: What this proves and why it matters broadly
## YOUR TURN: CTA framed as "you can have the same results"
Make it specific, credible, and aspirational.`,
    };

    const extraDetailSuffix = extraDetail ? `

EXTRA DETAILING MODE - ACTIVE:
- Include at least 3 statistics, data points, or research-backed insights
- Add real-world examples or mini case studies within each major section
- Use expert-level analysis - go beyond surface observations
- Address nuance and counterpoints where relevant
- Each section should be substantive, not just a paragraph - develop the ideas fully
- Aim for at least ${Math.max(800, parseInt(wordCount || 500) + 400)} words total` : "";

    const typeInstructions = {
      blogpost: `Write a complete SEO-optimized blog post.

BLOG STYLE TO FOLLOW:
${blogStyleGuides[blogStyle] || blogStyleGuides.problem_solution}

REQUIREMENTS:
- H1 headline at the top (make it click-worthy)
- Use H2/H3 subheadings matching the style structure above
- End with a 1-line meta description (160 chars) prefixed with "Meta:"
- Target length: ~${wordCount || 500} words${extraDetailSuffix}`,

      caption: `Write 3 social media caption variations:
**VARIATION 1 -SHORT** (under 100 chars): Punchy, emoji-rich
**VARIATION 2 -MEDIUM** (150-200 chars): With hashtags
**VARIATION 3 -LONG** (300-400 chars): Storytelling style with CTA
Include 10-15 relevant hashtags at end.`,

      ad_copy: `Write ad copy in 3 formats:
**GOOGLE AD**
- Headline 1 (max 30 chars)
- Headline 2 (max 30 chars)  
- Description (max 90 chars)

**META/FACEBOOK AD**
- Primary Text (2-3 lines)
- Headline (max 40 chars)
- CTA Button: [text]

**YOUTUBE 15-SEC SCRIPT**
Hook → Problem → Solution → CTA`,

      email: `Write a complete email:
- Subject Line (3 variations)
- Preview Text
- Email Body (scannable, with bullet points)
- CTA Button Text
Keep professional but warm.`,

      whatsapp: `Write 3 WhatsApp broadcast messages:
**1. ANNOUNCEMENT** (friendly, brief, under 150 chars)
**2. OFFER** (urgent, emoji-heavy, under 180 chars)
**3. FOLLOW-UP** (casual reminder, under 120 chars)
Use relevant emojis throughout.`,

      product_desc: `Write a compelling product/service description:
- Hook Headline
- What it is (1 line)
- Key Benefits (4-5 bullet points)
- Who it's for
- USP statement
- CTA
Target: ~${wordCount || 300} words.`,

      video_script: `Write a complete video script (~${wordCount || 400} words):
**[HOOK - 0-5 sec]** (attention grabber)
**[INTRO - 5-20 sec]** (problem/context)
**[MAIN CONTENT]** (3 key points with [VISUAL CUE] notes)
**[OUTRO]** (summary + CTA)
Include timing notes and visual direction.`,

      seo_meta: `Generate complete SEO package:
**PAGE TITLES** (3 variations, 50-60 chars each)
**META DESCRIPTIONS** (2 variations, 150-160 chars each)
**PRIMARY KEYWORDS** (10 high-intent keywords)
**LSI/SECONDARY KEYWORDS** (10 related terms)
**OG TITLE** (for social sharing)
**OG DESCRIPTION** (for social sharing)`,
    };

    const prompt = `You are an expert marketing copywriter and content strategist based in India.

Task: Create ${contentType} content
Topic/Product: ${topic}
Tone: ${toneMap[tone] || "Professional"}
Language: ${langMap[language] || "English"}
${keywords ? `Keywords/USP: ${keywords}` : ""}
${extraContext ? `Additional Context: ${extraContext}` : ""}

${typeInstructions[contentType] || `Write high-quality ${contentType} content.`}

Important:
- Write directly -no meta-commentary or explanations
- Start content immediately
- Make it authentic, not generic AI-sounding`;

    // ── Call Thinksuite API ───────────────────────────────────────────────────────
    const message = await withCreditGuard(
      () => client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
      "anthropic",
      { tool: "content", route: "/api/content" }
    );

    const generatedText = message.content[0]?.text || "";

    return Response.json({
      success: true,
      content: generatedText,
      usage: {
        input_tokens: message.usage?.input_tokens,
        output_tokens: message.usage?.output_tokens,
      },
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return Response.json(
      { error: error.message || "Failed to generate content. Please try again." },
      { status: error.statusCode || 500 }
    );
  }
}