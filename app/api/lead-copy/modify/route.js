import OpenAI from "openai";
import { getAIClient } from "@/lib/aiClient";

const openai    = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "build-placeholder" });
const anthropic = getAIClient();

const SYSTEM_PROMPT = `You are a senior B2B/B2C growth marketer and ad copy specialist.
You will receive an existing multi-platform ad campaign JSON and a modification request from the user.
The user may provide raw data, instructions, new audience info, tone changes, or any other direction.
Update the campaign exactly as requested while keeping all 6 platform sections intact and maintaining conversion quality.
Psychological triggers to keep: FOMO, Social Proof, Aspiration, Curiosity, Loss Aversion, Urgency.
Return ONLY valid JSON – same structure as input, no markdown, no explanation, no backticks.`;

export async function POST(request) {
  try {
    const { existingCampaign, modificationRequest, productName, model = "openai" } = await request.json();

    if (!modificationRequest?.trim()) {
      return Response.json({ error: "Modification instruction required" }, { status: 400 });
    }
    if (!existingCampaign) {
      return Response.json({ error: "Existing campaign data required" }, { status: 400 });
    }

    const userMessage = `Product: ${productName || "Unknown"}

Current Campaign (JSON):
${JSON.stringify(existingCampaign, null, 2)}

User's Modification Request:
${modificationRequest}

Update all 6 platform sections (google, instagram, linkedin, inmail, email, whatsapp) based on the modification request. Return the complete updated campaign JSON with identical structure.`;

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
        temperature:     0.7,
        response_format: { type: "json_object" },
      });
      raw = completion.choices[0]?.message?.content?.trim() || "";
    }

    const jsonStart = raw.indexOf("{");
    const jsonEnd   = raw.lastIndexOf("}");
    const jsonStr   = jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
    const result    = JSON.parse(jsonStr);

    return Response.json({ success: true, result });
  } catch (err) {
    console.error("Lead-copy modify error:", err);
    return Response.json({ error: err.message || "Modification failed" }, { status: 500 });
  }
}
