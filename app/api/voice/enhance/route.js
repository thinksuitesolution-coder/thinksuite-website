import { getAIClient } from "@/lib/aiClient";

export const maxDuration = 30;

const anthropic = getAIClient();

const MODE_PROMPTS = {
  ad: {
    system: "You are an expert ad scriptwriter. Reformat the given text into a punchy, energetic advertisement script. Add natural pauses (...), emphasis cues, and a strong call-to-action at the end. Keep it concise and impactful. Return ONLY the enhanced script, no commentary.",
    instruction: "Transform this into a compelling ad/promo script with natural pauses and energy:",
  },
  podcast: {
    system: "You are a professional podcast scriptwriter. Reformat the given text into a warm, conversational podcast-style script. Add a brief intro hook, natural transitions, and a friendly closing line. Make it flow like natural speech. Return ONLY the enhanced script, no commentary.",
    instruction: "Transform this into a natural, engaging podcast-style script:",
  },
  ivr: {
    system: "You are an IVR/telephony script specialist. Reformat the given text into a clear, professional IVR call script. Use short sentences, add natural pauses (...), ensure menu options are clearly stated. Make it sound calm and professional. Return ONLY the enhanced script, no commentary.",
    instruction: "Transform this into a clear, professional IVR/phone call script:",
  },
};

export async function POST(request) {
  try {
    const { text, mode } = await request.json();
    if (!text?.trim()) return Response.json({ error: "Text required" }, { status: 400 });
    if (!mode || mode === "tts") return Response.json({ enhanced: text });

    const config = MODE_PROMPTS[mode];
    if (!config) return Response.json({ enhanced: text });

    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: config.system,
      messages: [{
        role: "user",
        content: `${config.instruction}\n\n${text.trim()}`,
      }],
    });

    const enhanced = msg.content[0]?.text?.trim() || text;
    return Response.json({ enhanced });
  } catch (err) {
    console.error("[voice/enhance]", err);
    return Response.json({ enhanced: "" + (err.message || "Error") }, { status: 500 });
  }
}
