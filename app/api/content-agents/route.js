import { getAIClient } from "@/lib/aiClient";

const anthropic = getAIClient();

/* ── helpers ─────────────────────────────────────────────── */
function safeParseJSON(text) {
  try {
    // Extract JSON from markdown code blocks if present
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1].trim());
    // Try raw parse
    const start = text.indexOf("{");
    const end   = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) return JSON.parse(text.slice(start, end + 1));
  } catch (_) {}
  return null;
}

async function callThinksuite(systemPrompt, userPrompt) {
  const response = await anthropic.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 2500,
    system:     systemPrompt,
    messages:   [{ role: "user", content: userPrompt }],
  });
  return response.content[0]?.text || "";
}

/* ── POST handler ────────────────────────────────────────── */
export async function POST(req) {
  const { niche, tone, language, platforms, contentGoal, creatorBio } =
    await req.json();

  if (!niche?.trim()) {
    return Response.json({ error: "Niche is required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const platformList = (platforms || ["Instagram", "YouTube", "Twitter", "Reddit"]).join(", ");
  const langLabel =
    language === "hindi"    ? "Hindi"
    : language === "hinglish" ? "English (casual, conversational)"
    : "English";

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        } catch (_) {}
      };

      try {
        /* ══════════════════════════════════════════════════
           AGENT 1 -Trend Scout
        ══════════════════════════════════════════════════ */
        send({
          type:    "agent_start",
          agent:   1,
          name:    "Trend Scout",
          message: `Scanning ${platformList} for trending content in "${niche}"…`,
        });

        const a1Text = await callThinksuite(
          `You are an expert social media trend researcher who deeply understands viral content patterns across ${platformList}. You analyze engagement data, hashtag velocity, and content format performance.`,
          `Research the latest trending topics in the "${niche}" niche across ${platformList}.

Generate a realistic trend report as if you just scraped these platforms right now. Think about:
- Current events, seasons, cultural moments relevant to ${niche}
- What creators and brands in this space are posting
- What's getting massive engagement this week

Return ONLY valid JSON (no markdown) in this exact format:
{
  "trends": [
    {
      "title": "Short catchy topic name",
      "platform": "Platform where it's hottest",
      "allPlatforms": ["list", "of", "platforms"],
      "engagementScore": 8,
      "viewsRange": "500K–2M",
      "format": "Reel / Short / Thread / Post",
      "whyTrending": "One sentence explanation",
      "hashtags": ["#tag1", "#tag2", "#tag3"]
    }
  ]
}

Include exactly 10 trends, mix of formats and platforms. Make titles punchy and specific.`
        );

        const a1Data = safeParseJSON(a1Text) || { trends: [] };
        send({ type: "agent_complete", agent: 1, data: a1Data });

        /* ══════════════════════════════════════════════════
           AGENT 2 -Viral Analyst
        ══════════════════════════════════════════════════ */
        send({
          type:    "agent_start",
          agent:   2,
          name:    "Viral Analyst",
          message: "Analyzing engagement patterns and predicting viral potential…",
        });

        const trendsStr = JSON.stringify(a1Data.trends || []);
        const a2Text = await callThinksuite(
          `You are a viral content strategist with deep expertise in social media algorithms, engagement psychology, and content performance metrics. You predict which topics will explode in the next 7 days.`,
          `Analyze these trending topics and identify the top opportunities for a ${niche} creator:

TRENDS DATA:
${trendsStr}

CREATOR CONTEXT:
- Niche: ${niche}
- Preferred content goal: ${contentGoal || "Reel / Short Video"}
- Creator bio/style: ${creatorBio || "Not specified"}

Your task:
1. Rank the top 5 topics by viral potential for THIS creator
2. For each, explain WHY it will work and what angle to take
3. Predict the #1 BEST topic to create content on RIGHT NOW

Return ONLY valid JSON (no markdown):
{
  "rankedTopics": [
    {
      "rank": 1,
      "title": "Topic title",
      "viralScore": 9,
      "whyItWorks": "Specific reason for this creator",
      "angle": "Unique angle to take",
      "bestFormat": "Reel / Short / Thread",
      "estimatedReach": "100K–500K",
      "urgency": "Post in next 24h / This week / This month"
    }
  ],
  "winnerTopic": "The single best topic title",
  "winnerReason": "Why this is the #1 pick right now",
  "winnerAngle": "Exact angle/hook direction to pursue"
}`
        );

        const a2Data = safeParseJSON(a2Text) || { rankedTopics: [], winnerTopic: "", winnerReason: "" };
        send({ type: "agent_complete", agent: 2, data: a2Data });

        /* ══════════════════════════════════════════════════
           AGENT 3 -Script Writer
        ══════════════════════════════════════════════════ */
        const winnerTopic = a2Data.winnerTopic || a2Data.rankedTopics?.[0]?.title || niche;
        const winnerAngle  = a2Data.winnerAngle  || a2Data.rankedTopics?.[0]?.angle  || "";

        send({
          type:    "agent_start",
          agent:   3,
          name:    "Script Writer",
          message: `Writing complete script for "${winnerTopic}" in your tone…`,
        });

        const a3Text = await callThinksuite(
          `You are an elite short-form video scriptwriter who has written scripts for 50M+ view reels. You write in natural, conversational tones that feel authentic -never corporate or stiff. You understand pacing, pattern interrupts, and the exact moment to deliver value.`,
          `Write a complete ${contentGoal || "Reel"} script on this topic:

TOPIC: ${winnerTopic}
ANGLE: ${winnerAngle}
NICHE: ${niche}
TONE: ${tone || "Conversational and energetic"}
LANGUAGE: ${langLabel}
CREATOR STYLE: ${creatorBio || "Authentic and direct"}

Script requirements:
- Duration: 45–60 seconds (approx 120–160 words spoken)
- Structure: Hook (0–3s) → Problem/Intrigue (3–10s) → Value/Story (10–45s) → CTA (45–60s)
- Include [VISUAL CUE] notes in brackets
- Include [PAUSE] and [EMPHASIS] markers for delivery
- Write EXACTLY as it should be spoken -contractions, natural flow
- End with a strong CTA

Return ONLY valid JSON (no markdown):
{
  "script": {
    "hook": "The exact opening line (first 3 seconds)",
    "body": "The full middle section with visual cues",
    "cta": "The closing call to action",
    "fullScript": "The complete script from start to finish",
    "wordCount": 140,
    "estimatedDuration": "52 seconds",
    "visualNotes": ["Key visual suggestion 1", "Key visual suggestion 2"],
    "deliveryTips": ["Tip 1", "Tip 2"]
  }
}`
        );

        const a3Data = safeParseJSON(a3Text) || { script: { fullScript: a3Text } };
        send({ type: "agent_complete", agent: 3, data: a3Data });

        /* ══════════════════════════════════════════════════
           AGENT 4 -Hook Architect
        ══════════════════════════════════════════════════ */
        send({
          type:    "agent_start",
          agent:   4,
          name:    "Hook Architect",
          message: "Engineering 5 scroll-stopping hooks for maximum retention…",
        });

        const scriptPreview = a3Data.script?.fullScript?.slice(0, 300) || winnerTopic;
        const a4Text = await callThinksuite(
          `You are the world's best hook writer for short-form video content. You study every viral hook pattern -curiosity gaps, shock value, relatable moments, bold claims, and social proof. Your hooks stop thumbs mid-scroll.`,
          `Generate 5 distinct, powerful hooks for this content:

TOPIC: ${winnerTopic}
NICHE: ${niche}
SCRIPT PREVIEW: ${scriptPreview}
LANGUAGE: ${langLabel}

Create 5 hooks using these proven formulas -each DIFFERENT from the others:
1. CURIOSITY GAP -Create an irresistible information void
2. BOLD CLAIM / CONTROVERSY -Make a statement that demands attention
3. RELATABLE PAIN -Hit a shared frustration or desire
4. STORY OPENER -Drop into the middle of a dramatic moment
5. STATISTIC / SHOCK -Lead with a surprising number or fact

Rules:
- Each hook must be 1–2 sentences MAX (under 15 words)
- Must work as the first spoken words of a video
- In ${langLabel}
- No fluff -every word earns its place
- Rank them by predicted virality

Return ONLY valid JSON (no markdown):
{
  "hooks": [
    {
      "rank": 1,
      "type": "Curiosity Gap",
      "text": "The exact hook text",
      "whyItWorks": "One-line psychology explanation",
      "viralScore": 9,
      "emoji": "🔥"
    }
  ],
  "bestHook": "The single best hook to use",
  "proTip": "One advanced tip for delivering these hooks"
}`
        );

        const a4Data = safeParseJSON(a4Text) || { hooks: [] };
        send({ type: "agent_complete", agent: 4, data: a4Data });

        /* ══════════════════════════════════════════════════
           PIPELINE COMPLETE
        ══════════════════════════════════════════════════ */
        send({
          type: "pipeline_complete",
          summary: {
            niche,
            winnerTopic,
            totalTrends:    a1Data.trends?.length || 0,
            topicsAnalyzed: a2Data.rankedTopics?.length || 0,
            hooksGenerated: a4Data.hooks?.length || 0,
          },
        });
      } catch (err) {
        send({ type: "error", message: err.message || "Pipeline failed" });
      } finally {
        try { controller.close(); } catch (_) {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
