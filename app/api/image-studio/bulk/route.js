import OpenAI from "openai";
import Replicate from "replicate";
import { NextResponse } from "next/server";

const openai    = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

/* ── Generate N unique image prompts from topic ── */
async function generatePromptVariants(topic, count) {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Generate ${count} unique marketing image prompts for: "${topic}".
Each should show a different scene/angle (e.g., product close-up, lifestyle shot, flat lay, aerial view, studio, outdoor, etc.).
Make them professional, cinematic, suitable for social media ads.
Return ONLY a JSON array of strings with no explanation. Example: ["prompt1","prompt2"]`,
      }],
      max_tokens: count * 80 + 100,
      temperature: 1.0,
    });
    const raw = res.choices[0].message.content.trim().replace(/```json|```/g, "").trim();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length >= count) return arr.slice(0, count);
  } catch { /* fall through */ }
  return Array.from({ length: count }, (_, i) =>
    `${topic}, professional marketing photo, variation ${i + 1}, cinematic lighting, no text`
  );
}

/* ── Model generators ── */
async function withFlux(prompt, aspectRatio) {
  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input: {
      prompt: `${prompt}. Pure background visual. No text, no typography, no watermarks.`,
      aspect_ratio: aspectRatio || "1:1",
      num_outputs: 1,
      output_format: "png",
      output_quality: 90,
      go_fast: true,
      megapixels: "1",
    },
  });
  const raw = Array.isArray(output) ? output[0] : output;
  const url = typeof raw === "string" ? raw : raw?.toString?.() ?? "";
  if (!url) return null;
  const buf = await (await fetch(url)).arrayBuffer();
  return `data:image/png;base64,${Buffer.from(buf).toString("base64")}`;
}

async function withDallE3(prompt, aspectRatio) {
  const sizeMap = { "1:1": "1024x1024", "16:9": "1792x1024", "9:16": "1024x1792", "4:3": "1024x1024" };
  const res = await openai.images.generate({
    model: "dall-e-3",
    prompt: `${prompt}. No text or typography inside the image.`,
    n: 1,
    size: sizeMap[aspectRatio] || "1024x1024",
    quality: "standard",
    response_format: "b64_json",
  });
  return `data:image/png;base64,${res.data[0].b64_json}`;
}

async function withGemini(prompt, aspectRatio) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set in environment");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-001:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Create a marketing background image: ${prompt}. No text in image.` }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    }
  );
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("Gemini returned no image data");
  return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
}

/* ── Main handler ── */
export async function POST(req) {
  try {
    const { prompt, prompts: rawPrompts, count = 4, aspectRatio = "1:1", model = "flux" } = await req.json();

    const n = Math.min(Math.max(1, parseInt(count) || 4), 30);

    let prompts;
    if (Array.isArray(rawPrompts) && rawPrompts.length > 0) {
      prompts = rawPrompts.slice(0, n).map(p => p?.trim()).filter(Boolean);
      if (prompts.length === 0) return NextResponse.json({ error: "At least one prompt required" }, { status: 400 });
      if (prompts.length < n) prompts = [...prompts, ...Array(n - prompts.length).fill(prompts[prompts.length - 1])];
    } else {
      if (!prompt?.trim()) return NextResponse.json({ error: "Prompt required" }, { status: 400 });
      prompts = await generatePromptVariants(prompt.trim(), n);
    }

    /* Concurrency: DALL-E 3 → 2 at a time (rate limit); others → 4 */
    const CONCURRENCY = model === "dall-e-3" ? 2 : 4;
    const images      = [];

    for (let i = 0; i < n; i += CONCURRENCY) {
      const batch = prompts.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map(p => {
          if (model === "dall-e-3") return withDallE3(p, aspectRatio);
          if (model === "gemini")   return withGemini(p, aspectRatio);
          return withFlux(p, aspectRatio);
        })
      );
      for (const r of results) {
        images.push(r.status === "fulfilled" ? r.value : null);
      }
      /* Throttle between DALL-E 3 batches */
      if (model === "dall-e-3" && i + CONCURRENCY < n) {
        await new Promise(r => setTimeout(r, 4000));
      }
    }

    return NextResponse.json({ images });
  } catch (err) {
    console.error("Bulk generate error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
