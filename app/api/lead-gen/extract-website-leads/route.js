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

    // Scrape the website via Jina AI (free)
    let pageContent = "";
    try {
      pageContent = (await jinaFetch(normalizedUrl, 25000)).slice(0, 10000);
      if (!pageContent || pageContent.length < 100) {
        return Response.json(
          { error: "Could not crawl the website. Please check the URL or try a different site." },
          { status: 422 }
        );
      }
    } catch {
      return Response.json(
        { error: "Could not connect to the crawl service." },
        { status: 500 }
      );
    }

    // Thinksuite extracts all lead/contact information from the page
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: `You are a lead extraction specialist. Your job is to extract every contact/business lead from website content. Return ONLY valid JSON, no markdown, no explanation.`,
      messages: [
        {
          role: "user",
          content: `Website URL: ${normalizedUrl}

Website Content:
${pageContent}

Extract ALL leads and contacts found on this page. Return this exact JSON:
{
  "leads": [
    {
      "name": "Person name or company name",
      "email": "email@example.com or empty string",
      "phone": "phone number or empty string",
      "title": "job title / role or empty string",
      "company": "company name or empty string",
      "address": "address if found or empty string",
      "website": "their website if different from source or empty string"
    }
  ],
  "websiteName": "name of the source website/business",
  "category": "type of business/industry detected"
}

Instructions:
- Extract EVERY email address, phone number, person name, and company you find on the page
- If it is a directory or listing page, extract all businesses/contacts listed
- Look in: contact section, team/about page content, footer, headers, listings, tables
- If no leads found, return empty array
- Keep phone numbers exactly as found (with country code if present)
- Return ONLY the JSON object, nothing else`,
        },
      ],
    });

    const raw = msg.content[0]?.text?.trim() || "{}";
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonStr =
      jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
    const result = JSON.parse(jsonStr);

    return Response.json({
      success: true,
      leads: result.leads || [],
      websiteName: result.websiteName || "",
      category: result.category || "",
      url: normalizedUrl,
    });
  } catch (err) {
    console.error("extract-website-leads error:", err);
    return Response.json(
      { error: err.message || "An error occurred while extracting leads from the website." },
      { status: 500 }
    );
  }
}
