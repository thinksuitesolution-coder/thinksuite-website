import OpenAI from "openai";
import Replicate from "replicate";
import { NextResponse } from "next/server";
import { withCreditGuard } from "@/lib/apiCreditMonitor";

const openai    = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// STEP 1: GPT se enhanced prompt banao
async function enhancePrompt(userPrompt) {
  const res = await withCreditGuard(
    () => openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a world-class AI image prompt engineer specializing in high-converting marketing creatives.
Convert user input into a highly detailed image prompt that generates premium advertisement visuals.
Structure the prompt EXACTLY like this:
1. Scene Description (clear subject and context)
2. Style (ultra-realistic, cinematic, commercial photography)
3. Composition (framing, depth, spacing for text overlay)
4. Lighting (dramatic, soft glow, realistic shadows)
5. Environment (modern, clean, professional)
6. Quality (8k, highly detailed, sharp focus)
7. Negative instructions (no blur, no distortion, no artifacts)
IMPORTANT RULES:
- Do NOT include text or typography inside the image
- Focus on background visuals suitable for ads
- Always make it look like a premium brand campaign
- Indian context when relevant (people, environment)
Return ONLY the final prompt.`
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    max_tokens: 300,
    }),
    "openai",
    { tool: "generate", route: "/api/generate" }
  );
  return res.choices[0].message.content.trim();
}

// STEP 2: Generate image with Replicate FLUX-schnell
async function generateBgImage(prompt, aspectRatio = "1:1") {
  const ratioMap = { "1:1": "1:1", "16:9": "16:9", "9:16": "9:16", "4:3": "4:3", "3:4": "3:4" };

  try {
    const enhancedPrompt = await enhancePrompt(prompt);
    console.log("Enhanced prompt:", enhancedPrompt.substring(0, 100));

    const output = await withCreditGuard(
      () => replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: enhancedPrompt,
        aspect_ratio: ratioMap[aspectRatio] || "1:1",
        num_outputs: 1,
        output_format: "png",
        output_quality: 90,
        go_fast: true,
        megapixels: "1",
      },
      }),
      "replicate",
      { tool: "generate", route: "/api/generate" }
    );

    // output is FileOutput array - convert to string URL
    const raw    = Array.isArray(output) ? output[0] : output;
    const urlStr = typeof raw === "string" ? raw : raw?.toString?.() || "";
    if (!urlStr) return null;

    // Fetch and convert to base64 so canvas compositing works without CORS issues
    const imgRes = await fetch(urlStr);
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;

  } catch (e) {
    console.error("Image generation error:", e.message);
    return null;
  }
}

// Generate AI poster HTML
async function generatePosterHTML(userPrompt, phone, website) {
  const completion = await withCreditGuard(() => openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert social media poster designer for Indian businesses. 
Generate a complete, beautiful HTML poster that looks exactly like professional Indian social media marketing posts.

DESIGN RULES:
- Portrait format: exactly 540px wide, 810px tall (4:3 ratio portrait)
- Look like professional Canva designs - clean, modern, corporate
- Use inline styles only - no external CSS
- Light background (white/light blue/light gradient) - NOT dark
- Include: bold headline at top, subheadline, 4 feature boxes with emoji icons in a 2x2 grid, CTA button, contact bar at bottom
- Make it visually stunning with proper typography
- Use Google Fonts link tag for Poppins font
- Contact phone: ${phone}
- Contact website: ${website}
- The poster should have a main visual area in the middle for background image
- Return ONLY the complete HTML code, no markdown, no explanation`
      },
      {
        role: "user",
        content: `Create a professional social media marketing poster for: ${userPrompt}

Requirements:
1. Bold attention-grabbing headline targeting the right audience (like "Doctors! Grow Your Clinic with AI" or "Real Estate Brokers! Close More Deals with AI")
2. Subheadline with 3-4 bullet points of key benefits
3. 4 feature boxes in 2x2 grid with emoji + feature name + short description
4. Strong CTA button (like "Book a Free Demo Today" or "Contact Us Now")
5. Contact bar at bottom with phone and website
6. Professional color scheme (blues, whites, navy - similar to LinkedIn/corporate style)
7. Clean white/light background - NOT dark

Make it look exactly like the My ThinkAI examples - clean, professional, corporate Indian marketing post.`
      }
    ],
    max_tokens: 4000,
    temperature: 0.7,
  }), "openai", { tool: "generate", route: "/api/generate" });

  let html = completion.choices[0].message.content.trim();
  html = html.replace(/```html|```/g, "").trim();
  return html;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      category, topics, tone, platforms, 
      single, topic, imageProvider,
      imageOnly, prompt, promptOnly, aspectRatio,
      posterPrompt, phone, website,
      textToImage, mode
    } = body;

    // TEXT TO IMAGE
    if (textToImage) {
      if (mode === "ai") {
        // Option B -Full AI generates complete post image
        const fullPrompt = await enhancePrompt(
          `Complete social media marketing post for: ${prompt}. Include bold headline text, feature points, and contact section visually designed in the image. Professional Indian marketing ad style.`
        );
        const imageUrl = await generateBgImage(fullPrompt, aspectRatio);
        return NextResponse.json({ imageUrl, content: null });
      } else {
        // Option A -Background image + content overlay
        const [imageUrl, contentRes] = await Promise.all([
          generateBgImage(prompt, aspectRatio),
          openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
              role: "user",
              content: `Create social media post content for: ${prompt}
Return ONLY JSON:
{
  "headline": "Bold headline max 8 words",
  "subheadline": "One line subheadline",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  "caption": "2-3 line caption with emoji and CTA",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"]
}`
            }],
            max_tokens: 400,
          })
        ]);

        let content = {};
        try {
          const raw = contentRes.choices[0].message.content.trim().replace(/```json|```/g, "").trim();
          content = JSON.parse(raw);
        } catch(e) {}

        return NextResponse.json({ imageUrl, content });
      }
    }

    // AI POSTER GENERATION
    if (posterPrompt) {
      const [posterHTML, bgImage] = await Promise.all([
        generatePosterHTML(posterPrompt, phone || "+91 9311821726", website || "www.Thinksuite.in"),
        generateBgImage(posterPrompt)
      ]);
      
      const captionRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: `Create Instagram/LinkedIn caption and hashtags for: ${posterPrompt}
Return ONLY JSON:
{
  "caption": "2-3 lines caption with emoji and CTA",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"]
}`
        }],
        max_tokens: 300,
      });
      
      let captionData = {};
      try {
        const raw = captionRes.choices[0].message.content.trim().replace(/```json|```/g, "").trim();
        captionData = JSON.parse(raw);
      } catch(e) {}

      return NextResponse.json({ posterHTML, bgImage, caption: captionData.caption || "", hashtags: captionData.hashtags || [] });
    }

    // PROMPT ONLY
    if (promptOnly) {
      try {
        const res = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ 
            role: "user", 
            content: `Generate a short 1-2 line DALL-E image prompt for ${category || "business"} industry marketing. Professional, cinematic, photorealistic. No text in image. Return ONLY the prompt, nothing else, max 100 words.` 
          }],
          max_tokens: 150,
        });
        const prompt = res.choices[0].message.content.trim();
        return NextResponse.json({ prompt });
      } catch(e) {
        return NextResponse.json({ prompt: `Professional ${category} industry marketing visual, cinematic lighting, photorealistic` });
      }
    }

    // IMAGE ONLY
    if (imageOnly) {
      const imageUrl = await generateBgImage(prompt, aspectRatio || "1:1");
      return NextResponse.json({ imageUrl });
    }

    // SINGLE POST
    if (single) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Expert AI marketing specialist for Indian businesses. Return valid JSON only." },
          { role: "user", content: `Create social media post for ${category} industry.
Topic: ${topic}
Tone: ${tone}
Return ONLY:
{
  "headline": "Short powerful headline max 8 words",
  "subheadline": "One line subheadline",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  "caption": "2-3 line caption with emoji and CTA",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"],
  "imagePrompt": "Professional marketing visual for ${category} about ${topic}. Indian context."
}` }
        ],
        max_tokens: 600,
        temperature: 0.9,
      });

      const raw = completion.choices[0].message.content.trim().replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);
      const imageUrl = await generateBgImage(parsed.imagePrompt);
      return NextResponse.json({ content: { ...parsed, imageUrl } });
    }

    // BULK
    const results = [];
    for (let i = 0; i < (topics || []).length; i++) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Expert AI marketing specialist. Return valid JSON only." },
            { role: "user", content: `Social media post for ${category}. Topic: ${topics[i]}. Tone: ${tone}.
Return: {"headline":"","subheadline":"","features":["","","",""],"caption":"","hashtags":[],"imagePrompt":""}` }
          ],
          max_tokens: 500,
        });
        const raw = completion.choices[0].message.content.trim().replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(raw);
        const imageUrl = await generateBgImage(parsed.imagePrompt);
        results.push({ topic: topics[i], ...parsed, imageUrl });
      } catch (err) {
        results.push({ topic: topics[i], error: err.message });
      }
      if (i < topics.length - 1) await new Promise(r => setTimeout(r, 1000));
    }
    return NextResponse.json({ results });

  } catch (error) {
    console.error("Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}