import { getAIClient } from "@/lib/aiClient";
import { jinaFetch } from "@/lib/scraperUtils";

export const maxDuration = 60;

const anthropic = getAIClient();

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url?.trim()) {
      return Response.json({ error: "Website URL required" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    // Crawl the website via Jina AI (free)
    let pageContent = "";
    try {
      pageContent = (await jinaFetch(normalizedUrl, 20000)).slice(0, 6000);
      if (!pageContent || pageContent.length < 100) {
        return Response.json(
          { error: "Could not crawl the website. Please check the URL or fill in the details manually." },
          { status: 422 }
        );
      }
    } catch {
      return Response.json(
        { error: "Could not connect to the crawl service. Please fill in the details manually." },
        { status: 500 }
      );
    }

    // Thinksuite extracts marketing info
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are a marketing analyst. Extract key business/product information from website content for marketing copy generation. Return ONLY valid JSON, no markdown, no explanation.`,
      messages: [
        {
          role: "user",
          content: `Website URL: ${normalizedUrl}

Website Content:
${pageContent}

Extract and return this exact JSON:
{
  "productName": "Brand or product name (short, from the website)",
  "usp": "The main value proposition or key benefit in 1-2 sentences",
  "targetAudience": "Who are their customers - describe with age/role/context if visible",
  "pain": "Core problem they solve for customers",
  "description": "Brief 1-2 sentence description of what the business does"
}

Rules:
- Only use information explicitly present on the website
- productName: the actual brand name (not a full sentence)
- usp: their main selling point or differentiator
- If any field cannot be determined, return an empty string for it
- Return ONLY the JSON object`,
        },
      ],
    });

    const raw = msg.content[0]?.text?.trim() || "{}";
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonStr =
      jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
    const extracted = JSON.parse(jsonStr);

    return Response.json({ success: true, extracted, url: normalizedUrl });
  } catch (err) {
    console.error("analyze-website error:", err);
    return Response.json(
      { error: err.message || "Website analyze karte waqt error aaya" },
      { status: 500 }
    );
  }
}
