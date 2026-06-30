import { getAIClient } from "@/lib/aiClient";

const anthropic = getAIClient();

/* ── Type-aware refinement instructions ───────────────────────────────────── */

const REFINE_BY_TYPE = {
  image: {
    improve:  "Enhance this image prompt -add richer visual details, more specific style references, better lighting description, stronger composition guidance, and additional quality modifiers. Keep it as a flowing image prompt (no headers/sections).",
    creative: "Make this image prompt significantly more creative and visually unique. Add unexpected stylistic choices, unusual lighting or color combinations, imaginative scene elements, and artistic references. Keep the core subject but make it visually stunning and distinctive.",
    shorter:  "Condense this image prompt to the most essential visual elements -subject, style, lighting, and 2-3 key quality modifiers. Remove redundancies while keeping it punch-ready for image generation.",
    longer:   "Expand this image prompt with more specific visual detail -add camera lens specs, color palette details, texture descriptions, background elements, atmospheric effects, and additional quality/style parameters.",
  },
  writing: {
    improve:  "Improve this writing prompt -make the hook formula more specific, add clearer CTA guidance, strengthen the audience targeting, and add more actionable structure instructions. Keep the [CONTENT TYPE][AUDIENCE][HEADLINE][STRUCTURE][CTA][TONE][FORMAT] sections.",
    creative: "Make this writing prompt generate more creative, engaging, and memorable content. Add storytelling elements, emotional triggers, pattern-interrupt techniques, and vivid language instructions.",
    shorter:  "Condense this writing prompt to the essential instructions -remove redundancies, keep the core content type, audience, key message, and CTA. Aim for tight, clear directives.",
    longer:   "Expand this writing prompt with more detail -add specific headline formulas, example subheadings, more granular structure, additional SEO or platform specs, and enhanced CTA scripts.",
  },
  video: {
    improve:  "Improve this video prompt -make the hook more attention-grabbing, add more specific scene transitions, refine the pacing instructions, and strengthen the CTA. Keep the scene breakdown structure.",
    creative: "Make this video prompt generate more visually compelling and viral content. Add unexpected visual hooks, creative transitions, dynamic pacing changes, and emotionally resonant storytelling beats.",
    shorter:  "Condense this video prompt to the essential structure -hook, 2-3 key scenes, and CTA. Remove filler while keeping the core visual and narrative direction.",
    longer:   "Expand this video prompt with more detailed scene breakdowns, specific B-roll shot lists, music/sound design instructions, on-screen text directions, and a detailed CTA sequence.",
  },
  chatbot: {
    improve:  "Improve this system prompt -make the persona more distinctive, add clearer behavioral rules, strengthen the constraints section, and make the example interaction more realistic and useful.",
    creative: "Make this chatbot system prompt create a more unique, memorable, and engaging AI persona. Add personality quirks, creative response patterns, and distinctive communication style details.",
    shorter:  "Condense this system prompt to the essential identity, key capabilities, main constraints, and one example. Remove redundant rules while keeping the bot deployable.",
    longer:   "Expand this system prompt with more specific behavioral rules, additional example interactions showing edge cases, more detailed response format guidance, and comprehensive constraint rules.",
  },
  all: {
    improve:  "Improve this AI prompt -make it more specific, clearer, and higher-performing. Enhance structure, add missing details, and boost effectiveness.",
    creative: "Make this AI prompt significantly more creative, vivid, and imaginative. Add richer details and inspired language.",
    shorter:  "Make this AI prompt more concise. Remove unnecessary words while keeping all critical instructions.",
    longer:   "Expand this AI prompt with more detail, context, examples, and nuance.",
  },
};

const TONE_INSTRUCTIONS = {
  professional: "Rewrite so it generates professional, authoritative, formal content. Use industry-level specificity and confident language.",
  casual:       "Rewrite so it generates casual, friendly, conversational content. Warm tone, everyday language, relatable.",
  urgent:       "Rewrite so it generates urgency-driven, persuasive content with strong calls-to-action and emotional triggers.",
  storytelling: "Rewrite so it generates narrative-driven, emotionally engaging content with storytelling hooks and journey.",
  humorous:     "Rewrite so it generates witty, light-hearted, humorous content that entertains while informing.",
};

const CONVERT_INSTRUCTIONS = {
  "instagram-caption": "Convert into a prompt that generates a short, punchy Instagram caption (under 150 chars) with hook, emojis, and 5-8 hashtags.",
  "linkedin-post":     "Convert into a prompt that generates a professional LinkedIn thought leadership post (600-1000 words) with personal story, insights, and engagement question.",
  "email":             "Convert into a prompt that generates a marketing email with compelling subject line, personalized opener, value body, and single clear CTA.",
  "ad-copy":           "Convert into a prompt that generates high-converting ad copy with pattern-interrupt hook, clear benefit, social proof, urgency, and direct CTA.",
  "video-script":      "Convert into a prompt that generates a YouTube video script with attention-grabbing hook, structured body with transitions, and strong outro CTA.",
  "tweet":             "Convert into a prompt that generates a viral Twitter/X thread -strong opener, 6-8 value-packed tweets, closing engagement CTA.",
};

export async function POST(request) {
  try {
    const { prompt, promptType, action, target } = await request.json();

    if (!prompt?.trim()) return Response.json({ error: "Prompt missing" }, { status: 400 });
    if (!action)         return Response.json({ error: "Action missing" }, { status: 400 });

    const typeKey = REFINE_BY_TYPE[promptType] ? promptType : "all";

    let instruction = "";
    if (action === "tone" && target) {
      instruction = TONE_INSTRUCTIONS[target] || TONE_INSTRUCTIONS.professional;
    } else if (action === "convert" && target) {
      instruction = CONVERT_INSTRUCTIONS[target] || CONVERT_INSTRUCTIONS["instagram-caption"];
    } else {
      instruction = REFINE_BY_TYPE[typeKey]?.[action] || REFINE_BY_TYPE.all[action] || REFINE_BY_TYPE.all.improve;
    }

    const typeFormatNote = {
      image:   "IMPORTANT: Always start the refined prompt with 'Create an image of'. Keep the appropriate format -flowing paragraph for photography/art, or [Scene][Style][Typography][Text on Image][Technical] structure for social media/promotional images. NEVER use placeholders for text -always use actual content. NEVER add disclaimers about text rendering.",
      writing: "IMPORTANT: Keep the [CONTENT TYPE][AUDIENCE][HEADLINE][STRUCTURE][CTA][TONE][FORMAT] section structure.",
      video:   "IMPORTANT: Keep the [VIDEO BRIEF][HOOK][SCENE BREAKDOWN][VISUAL STYLE][NARRATION][MUSIC][CTA] section structure.",
      chatbot: "IMPORTANT: Keep the [IDENTITY][PERSONALITY][CAPABILITIES][CONSTRAINTS][BEHAVIOR RULES][RESPONSE FORMAT][LANGUAGE][EXAMPLE INTERACTION] section structure.",
      all:     "IMPORTANT: Keep the [ROLE][TASK][CONTEXT][REQUIREMENTS][OUTPUT FORMAT] structure if present.",
    };

    const systemPrompt = `You are a world-class AI prompt engineer. Refine the given prompt according to instructions.

${typeFormatNote[typeKey] || typeFormatNote.all}

OUTPUT RULES:
1. Output ONLY the refined prompt -no intro, no explanation
2. Keep it in English
3. Make the refinement clearly noticeable and genuinely valuable
4. Start directly with the prompt content`;

    const userMessage = `Original prompt:
${prompt.trim()}

Refinement instruction:
${instruction}

Output the refined prompt directly:`;

    const message = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 2000,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userMessage }],
    });

    const refined = message.content[0]?.text?.trim() || prompt;

    return Response.json({ success: true, prompt: refined, action, target });
  } catch (err) {
    console.error("Prompt-maker refine error:", err);
    return Response.json(
      { error: err.message || "An error occurred during refinement. Please try again." },
      { status: 500 }
    );
  }
}
