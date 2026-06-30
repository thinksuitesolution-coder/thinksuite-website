import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

export async function POST(request) {
  try {
    const { lead, userServices, extraContext } = await request.json();
    if (!lead) return NextResponse.json({ error: "lead required" }, { status: 400 });

    const services = userServices?.trim() || "our export-import services";
    const extra = extraContext?.trim() || "";

    const contextBlock = `
Company: ${lead.company_name || "N/A"}
Contact Person: ${lead.contact_person || "N/A"}
Product Traded: ${lead.product || "N/A"}
HS Code: ${lead.hs_code || "N/A"}
Trade Type: ${lead.type || "N/A"}
City/State: ${[lead.city, lead.state].filter(v => v && v !== "N/A").join(", ") || "India"}
Top Port: ${lead.top_port || "N/A"}
Shipment Volume: ${lead.shipment_volume || "N/A"}
Past History: ${lead.past_history || "N/A"}`;

    const prompt = `You are a B2B trade sales expert specializing in export-import outreach. Generate personalized cold outreach messages for this Indian trade company:
${contextBlock}

The sender offers: ${services}
${extra ? `\nAdditional context/instructions: ${extra}\n` : ""}

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "english": "Professional B2B cold email body in English, 90-110 words. Address the contact person or company by name. Mention their specific product (${lead.product || "product"}) and trade type (${lead.type || "export/import"}). Show how the sender's services directly benefit their trade operations. Reference their shipment volume or port if available. End with a specific CTA  call, WhatsApp, or meeting.",
  "hinglish": "A friendly, conversational B2B trade outreach message in English, 90-110 words. Address the contact or company by name and mention their product. Explain how the sender's services benefit their ${lead.type || "export/import"} operations. Reference shipment volume or port data if available. End with a clear CTA.",
  "email_subject": "Compelling email subject line, max 55 characters, mentioning product or trade benefit",
  "whatsapp": "WhatsApp message for trade outreach, 50-60 words, conversational, direct. Start with a hook mentioning their product. End with asking for a 5-min call or meeting."
}`;

    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = res.content.find(b => b.type === "text")?.text?.trim() || "{}";
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const parsed = JSON.parse(json);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[export-import-message]", err);
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 });
  }
}
