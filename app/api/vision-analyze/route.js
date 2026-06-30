import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

const FEATURE_PROMPTS = {
  describe: `Analyze this image thoroughly and provide:
1. A detailed scene description (objects, people, setting, mood, atmosphere)
2. Dominant colors (top 5 with hex codes if possible)
3. Lighting quality and direction
4. Potential use cases for this image
5. Overall mood/emotion conveyed
Format your response clearly with these sections.`,

  ocr: `Extract ALL text visible in this image.
- Include every word, number, symbol you can see
- Preserve the original layout/structure as much as possible
- If text appears in multiple sections, separate them clearly
- Note the language(s) detected
- If no text found, say so clearly`,

  objects: `Detect and list everything visible in this image:
1. ALL objects present (with approximate count if multiple)
2. Brand logos or text identified (with confidence level: High/Medium/Low)
3. People count (if any) and brief description
4. Scene/environment type
5. Any notable or unusual elements
Be thorough and systematic.`,

  ad_analysis: `Analyze this image as an advertising creative:
1. Effectiveness Score: Rate 1-10 with reasoning
2. CTA Detection: Is there a call-to-action? What is it?
3. Visual Hierarchy: What draws the eye first, second, third?
4. Target Audience: Who is this ad targeting?
5. Brand Messaging: What is the core message?
6. Improvement Suggestions: 3 specific actionable tips to make this ad more effective
Format as a professional ad analysis report.`,
};

export async function POST(req) {
  try {
    const { imageBase64, mimeType, feature } = await req.json();

    if (!imageBase64 || !feature) {
      return NextResponse.json({ error: "Image and feature are required" }, { status: 400 });
    }

    const prompt = FEATURE_PROMPTS[feature];
    if (!prompt) {
      return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    return NextResponse.json({ result: response.content[0].text });
  } catch (err) {
    console.error("Vision analyze error:", err);
    return NextResponse.json({ error: err.message || "Analysis failed" }, { status: 500 });
  }
}
