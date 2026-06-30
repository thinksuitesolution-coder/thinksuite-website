import { getAIClient } from "@/lib/aiClient";
const client = getAIClient();

/* ── POST /api/video-studio/analyze ─────────────────────────────────────── */
export async function POST(request) {
  try {
    const { script, duration, style, language } = await request.json();

    if (!script?.trim()) {
      return Response.json({ error: "Script is required" }, { status: 400 });
    }

    const durationSec = parseInt(duration) || 60;
    // Each segment is 5-8 seconds; calculate number of segments
    const segmentDuration = 6;
    const numSegments = Math.max(3, Math.min(Math.round(durationSec / segmentDuration), 25));

    const systemPrompt = `You are a professional video script analyzer for Indian content.
You break scripts into timed visual segments and suggest Indian stock footage keywords.
ALWAYS respond with valid JSON only - no markdown, no explanation.`;

    const userPrompt = `Analyze this ${language || "English"} script for a ${durationSec}-second ${style || "cinematic"} video.

Script:
"""
${script.trim()}
"""

Break it into exactly ${numSegments} segments of roughly ${segmentDuration} seconds each.
For each segment extract visual keywords that match Indian stock footage on Pexels/Pixabay.

Return JSON array:
[
  {
    "index": 0,
    "text": "exact script portion for this segment",
    "duration": ${segmentDuration},
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "mood": "energetic|calm|emotional|professional|inspirational",
    "cameraAngle": "wide shot|close-up|aerial|medium|POV",
    "description": "one-line visual description for this segment"
  }
]

Rules:
- keywords must be 1-3 words each, suitable for stock footage search
- Prefer Indian context: "Indian office", "Mumbai skyline", "Indian entrepreneur", etc.
- mood and cameraAngle must match the style: ${style}
- total segment durations must add up to ${durationSec}
- Return ONLY valid JSON array, no other text`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText = message.content[0].text.trim();

    // Extract JSON if wrapped in code blocks
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Thinksuite did not return valid JSON array");
    }

    const segments = JSON.parse(jsonMatch[0]);

    // Validate and normalize segments
    const validated = segments.map((seg, i) => ({
      index: i,
      text: seg.text || "",
      duration: Number(seg.duration) || segmentDuration,
      keywords: Array.isArray(seg.keywords) ? seg.keywords.slice(0, 5) : ["India", "business"],
      mood: seg.mood || "professional",
      cameraAngle: seg.cameraAngle || "wide shot",
      description: seg.description || `Scene ${i + 1}`,
    }));

    return Response.json({ segments: validated, totalDuration: durationSec });

  } catch (err) {
    console.error("[video-studio/analyze]", err);
    return Response.json({ error: err.message || "Script analysis failed" }, { status: 500 });
  }
}
