import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

/* ── Type-specific question focus ─────────────────────────────────────────── */

const TYPE_QUESTION_FOCUS = {
  image: `You are analyzing for an IMAGE GENERATION prompt (Midjourney, DALL-E, Stable Diffusion, Flux).

Ask questions focused on:
- Visual style (photorealistic, cinematic, anime, digital art, oil painting, watercolor, 3D render, etc.)
- Lighting (golden hour, studio, dramatic, soft natural, neon, moody, etc.)
- Composition & framing (close-up portrait, wide landscape, aerial view, rule of thirds, etc.)
- Color palette or mood (warm & golden, cool & blue, dark & moody, vibrant, monochrome, etc.)
- Subject specifics (gender, age, outfit, expression, action, environment details)
- Aspect ratio or platform (square for Instagram, 16:9 for wallpaper, portrait for phone, etc.)

DO NOT ask about CTAs, target audience, tone of voice, or content goals -those are for writing.`,

  writing: `You are analyzing for a WRITING / CONTENT prompt (blog, ad copy, email, social media, website copy).

Ask questions focused on:
- Content format (blog post, Instagram caption, ad copy, email newsletter, website homepage, LinkedIn post, etc.)
- Target audience (age group, profession, pain point, awareness level)
- Tone & voice (professional, casual, urgent, storytelling, humorous, inspirational)
- Key message or value proposition (what's the #1 thing they must take away)
- CTA -call to action (buy now, sign up, learn more, contact us, share, etc.)
- Length & platform (short-form for social, long-form for blog, specific word count)

DO NOT ask about visual style, lighting, or image parameters.`,

  video: `You are analyzing for a VIDEO GENERATION or VIDEO SCRIPT prompt (YouTube, Reels, TikTok, AI video tools).

Ask questions focused on:
- Platform (YouTube long-form, Instagram Reels, TikTok, LinkedIn, Facebook)
- Duration (15-30 seconds, 1 minute, 3-5 minutes, 10+ minutes)
- Video style (talking head, cinematic B-roll, animated explainer, screen recording, documentary style)
- Hook type (shocking stat, controversial question, relatable story, bold claim, visual pattern interrupt)
- Narration energy (calm & educational, high-energy & hype, conversational, professional voiceover)
- CTA goal (subscribe, follow, buy, visit website, comment)

DO NOT ask about image style, writing format, or chatbot behavior.`,

  chatbot: `You are analyzing for a CHATBOT / SYSTEM PROMPT (for ChatGPT, Thinksuite, Gemini, or custom AI assistant).

Ask questions focused on:
- Bot's persona name and role (e.g., "Aria -Customer Support for ShopEasy")
- Language & communication style (formal, casual, friendly, professional, concise)
- Primary function (customer support, sales assistant, FAQ answering, personal productivity, tutoring)
- Key constraints (what the bot should NEVER do -competitor mentions, pricing, off-topic replies)
- Response format preference (bullet points, short answers, step-by-step, conversational paragraphs)
- Special behavior rules (always ask a follow-up question, escalate to human after 3 failed attempts, etc.)

DO NOT ask about visual design, content format, or video scripts.`,

  all: `You are analyzing for a GENERAL PURPOSE AI prompt that could be used for any type of output.

Ask balanced questions covering:
- Primary use case (what tool will this prompt be used in)
- Tone and style preferences
- Target audience or end user
- Specific outcomes or deliverables expected
- Any constraints or requirements`,
};

export async function POST(request) {
  try {
    const { rawInput, promptType } = await request.json();

    if (!rawInput?.trim()) {
      return Response.json({ error: "Please enter your idea or raw input!" }, { status: 400 });
    }

    const wordCount    = rawInput.trim().split(/\s+/).filter(Boolean).length;
    const typeFocus    = TYPE_QUESTION_FOCUS[promptType] || TYPE_QUESTION_FOCUS.all;
    const targetQs     = wordCount >= 50 ? 2 : wordCount >= 25 ? 3 : 4;
    const canSkipHint  = wordCount >= 60
      ? "The user's input is detailed -set canSkip: true and provide a skipInsight."
      : "The user's input needs clarification -set canSkip: false.";

    const systemPrompt = `You are a friendly, conversational AI prompt engineer. A user shares their raw idea. Your job:

1. Understand their idea in context of the prompt TYPE
2. Generate ${targetQs} smart, targeted clarifying questions specific to this prompt type
3. For each question, provide exactly 4 relevant, specific multiple-choice options
4. Generate 1-2 smart content insights relevant to their specific use case

${typeFocus}

QUESTION QUALITY RULES:
- Questions must be SPECIFIC to the prompt type (see focus above)
- Options must be SHORT (2-5 words), specific, and relevant to their actual idea
- Don't ask obvious things already clear from the user's input
- Each question should unlock something that makes the final prompt significantly better

${canSkipHint}

LANGUAGE RULES:
- Always respond in clear, friendly English
- Be conversational and helpful

Content insights should be specific to their use case, e.g.:
- For image: "Cinematic style works best with golden hour lighting for this subject"
- For writing: "This angle has strong viral potential for Instagram Reels"
- For video: "A 60-second format will maximize Reels completion rate for this topic"
- For chatbot: "Adding a persona name significantly improves user trust"

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "detectedLanguage": "english",
  "summary": "1 sentence -what you understood they want (in user's language)",
  "canSkip": false,
  "skipInsight": "message shown if canSkip is true, in user's language",
  "contentInsights": ["insight 1", "insight 2"],
  "questions": [
    {"id": 1, "question": "...", "options": ["option1", "option2", "option3", "option4"]},
    {"id": 2, "question": "...", "options": ["option1", "option2", "option3", "option4"]}
  ]
}`;

    const userMessage = `User's raw idea: "${rawInput.trim()}"
Word count: ${wordCount}
Prompt type: ${promptType}

Generate type-specific questions in the user's language.`;

    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 1200,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userMessage }],
    });

    const raw     = message.content[0]?.text || "{}";
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const result  = JSON.parse(cleaned);

    return Response.json({
      success:          true,
      detectedLanguage: result.detectedLanguage || "english",
      summary:          result.summary          || "",
      canSkip:          result.canSkip          || false,
      skipInsight:      result.skipInsight       || "",
      contentInsights:  result.contentInsights   || [],
      questions:        result.questions         || [],
    });
  } catch (err) {
    console.error("Prompt-maker analyze error:", err);
    return Response.json(
      { error: err.message || "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
