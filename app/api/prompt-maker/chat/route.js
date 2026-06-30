import { getAIClient } from "@/lib/aiClient";

const anthropic = getAIClient();

const TYPE_CONTEXT = {
  image: `This is an IMAGE GENERATION prompt (Midjourney/DALL-E 3/Ideogram/Flux format).

CRITICAL RULES FOR IMAGE PROMPTS:
- NEVER say "image tools can't render text" -Ideogram v2, DALL-E 3, Adobe Firefly render text well
- ALWAYS include actual text content in the prompt -headings, CTAs, brand names, taglines -as part of the visual description
- NEVER use placeholders like [YOUR TEXT] or [ADD CTA] -fill in REAL content based on context
- If user asks to add a heading/CTA/brand name they haven't specified, INVENT something smart and relevant -don't ask them to fill it in
- ALWAYS start the prompt with "Create an image of" -every image prompt must begin with these words
- For social media/promotional images: use [Scene][Style][Typography][Technical] structured format
- For photography/art: use flowing descriptive text after "Create an image of"
- When modifying: keep the format type (structured for promo, flowing for photography)`,

  writing: `This is a WRITING/CONTENT prompt with structured sections.
- Sections: [CONTENT TYPE & GOAL][TARGET AUDIENCE][HEADLINE/HOOK][BODY STRUCTURE][CTA][TONE & VOICE][FORMAT & LENGTH]
- When modifying: update relevant sections, keep the section structure intact
- Valid modifications: change tone, update CTA, adjust audience, change format, add examples`,

  video: `This is a VIDEO SCRIPT/GENERATION prompt with scene structure.
- Sections: [VIDEO BRIEF][HOOK][SCENE BREAKDOWN][VISUAL STYLE][NARRATION][MUSIC][CTA]
- When modifying: update relevant sections, keep the scene breakdown structure
- Valid modifications: change platform, adjust duration, update hook, modify scenes, change style`,

  chatbot: `This is a CHATBOT SYSTEM PROMPT for deployment.
- Sections: [IDENTITY][PERSONALITY][CAPABILITIES][CONSTRAINTS][BEHAVIOR RULES][RESPONSE FORMAT][LANGUAGE][EXAMPLE INTERACTION]
- When modifying: update relevant sections, keep the full system prompt structure
- Valid modifications: change persona, update language rules, add capabilities, modify constraints`,

  all: `This is a general-purpose AI prompt with [ROLE][TASK][CONTEXT][REQUIREMENTS][OUTPUT FORMAT] structure.`,
};

export async function POST(request) {
  try {
    const { prompt, promptType, message, history = [] } = await request.json();

    if (!prompt?.trim()) return Response.json({ error: "Prompt missing" }, { status: 400 });
    if (!message?.trim()) return Response.json({ error: "Message missing" }, { status: 400 });

    const typeContext = TYPE_CONTEXT[promptType] || TYPE_CONTEXT.all;

    const systemPrompt = `You are a confident, expert AI prompt engineer assistant. The user wants to refine their prompt through conversation -just like ChatGPT or Thinksuite.

PROMPT TYPE CONTEXT:
${typeContext}

YOUR JOB:
- If user wants to MODIFY ("add X", "make it shorter", "change Y", "remove Z", "add my brand", "add CTA", "add text") → update the prompt with REAL content, set promptChanged: true
- If user is ASKING something ("what does this mean?", "is this good?") → answer, set promptChanged: false

ABSOLUTE RULES -NEVER BREAK THESE:
1. NEVER say "image tools can't render text" or "you'll need to add text in Canva" or any disclaimer about limitations
2. NEVER add placeholders -always use ACTUAL content (if user says "add my company name" and they told you it's ThinkSuite → write "ThinkSuite", not "[Company Name]")
3. NEVER ask the user to fill something in -if you don't have the info, invent something smart and contextually appropriate
4. Just DO it -modify the prompt directly, confidently, completely
5. If user says "add heading" without specifying text → invent a powerful, relevant heading and add it
6. If user says "make it complete" or "add everything" → add all missing elements (text, CTA, brand, mood, etc.) with real content

RESPONSE FORMAT -always return valid JSON:
{
  "promptChanged": true/false,
  "updatedPrompt": "the COMPLETE updated prompt (full text, not just changed part)",
  "reply": "2-3 sentences -friendly, specific, tell them exactly what you added/changed. Reply in same language as user."
}

- Keep updated prompt in English
- Always reply in clear, friendly English`;

    const recentHistory = history.slice(-8);

    const messages = [
      ...recentHistory.map((m, i) => ({
        role: m.role,
        content: m.role === "user"
          ? `User message: ${m.content}`
          : m.content,
      })),
      {
        role: "user",
        content: `Current prompt:\n\`\`\`\n${prompt.trim()}\n\`\`\`\n\nUser message: ${message.trim()}`,
      },
    ];

    const response = await anthropic.messages.create({
      model:     "claude-sonnet-4-6",
      max_tokens: 2200,
      system:    systemPrompt,
      messages,
    });

    const raw = response.content[0]?.text?.trim() || "{}";

    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] || raw);
    } catch {
      parsed = { promptChanged: false, reply: raw };
    }

    return Response.json({
      success:       true,
      promptChanged: !!parsed.promptChanged,
      updatedPrompt: parsed.promptChanged ? (parsed.updatedPrompt || prompt) : undefined,
      reply:         parsed.reply || "Got it! Anything else you'd like to change?",
    });
  } catch (err) {
    console.error("Prompt-maker chat error:", err);
    return Response.json(
      { error: err.message || "An error occurred in chat. Please try again." },
      { status: 500 }
    );
  }
}
