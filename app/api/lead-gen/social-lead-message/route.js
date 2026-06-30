import { getAIClient } from "@/lib/aiClient";
import { NextResponse } from "next/server";

const client = getAIClient();

export async function POST(request) {
  try {
    const { lead, leadType, userServices, searchCategory, extraContext } = await request.json();
    if (!lead || !leadType) {
      return NextResponse.json({ error: "lead and leadType required" }, { status: 400 });
    }

    const services = userServices?.trim() || "our services";
    const category = searchCategory || "Business";
    const extra = extraContext?.trim() || "";

    let contextBlock = "";
    if (leadType === "linkedin") {
      contextBlock = `
LinkedIn Profile:
- Name: ${lead.name || lead.linkedinId || "N/A"}
- Job Title: ${lead.title || "N/A"}
- Company: ${lead.company || "N/A"}
- Location: ${lead.location || "N/A"}
- LinkedIn ID: ${lead.linkedinId || "N/A"}
- Industry/Niche: ${category}`;
    } else if (leadType === "instagram") {
      contextBlock = `
Instagram Account:
- Name: ${lead.name || lead.handle || "N/A"}
- Handle: @${lead.handle || "N/A"}
- Category: ${lead.category || category}
- Location: ${lead.location || "N/A"}
- Followers: ${lead.followers || "N/A"}
- Bio: ${lead.bioSnippet || "N/A"}`;
    }

    const prompt = `You are a sales expert. Generate two personalized cold outreach messages for this ${leadType === "linkedin" ? "LinkedIn professional" : "Instagram account"}:
${contextBlock}

The sender offers: ${services}
${extra ? `\nAdditional instructions: ${extra}\n` : ""}
IMPORTANT: Write as if reaching out directly to this person. ${leadType === "linkedin" ? "Mention their job title and company. Be professional and business-focused." : "Mention their Instagram handle and content niche. Be friendly and creator-friendly."}${extra ? " Follow the additional instructions carefully." : ""}

Return ONLY a valid JSON object (no markdown, no line breaks inside string values):
{
  "english": "A professional cold outreach message in English, 80-100 words. ${leadType === "linkedin" ? "Address them by name, mention their title/company." : "Address them by name or handle, mention their niche/content."} Explain why ${services} specifically helps them. Be warm, personalized, and end with a clear CTA. Write as a single paragraph.",
  "casual": "A friendly, casual cold outreach message in English only (no Hindi or mixed language), 80-100 words. ${leadType === "linkedin" ? "Address them by name and mention their company." : "Address them by handle and mention their niche."} Explain how ${services} can specifically help them. Keep it warm and conversational, and end with a clear CTA. Write as a single paragraph."
}`;

    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = res.content.find(b => b.type === "text")?.text?.trim() || "{}";
    const stripped = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    const jsonStr = start !== -1 && end !== -1 ? stripped.slice(start, end + 1) : stripped;
    // Replace literal newlines inside string values (AI sometimes breaks lines)
    const sanitized = jsonStr.replace(/\r?\n/g, " ");
    const { english, casual } = JSON.parse(sanitized);

    return NextResponse.json({ english, hinglish: casual });
  } catch (err) {
    console.error("[social-lead-message]", err);
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 });
  }
}
