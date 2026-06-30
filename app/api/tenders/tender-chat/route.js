import { getAIClient } from "@/lib/aiClient";
export const maxDuration = 30;

const client = getAIClient();

export async function POST(request) {
  try {
    const { question, tender } = await request.json();

    if (!question?.trim() || !tender?.title) {
      return Response.json({ error: "Missing question or tender data" }, { status: 400 });
    }

    const ctx = [
      `Title: ${tender.title}`,
      `Organization: ${tender.organization || "N/A"}`,
      `Sector: ${tender.sector || "N/A"}`,
      `Value: ${tender.value || "N/A"}`,
      `EMD: ${tender.emd || "N/A"}`,
      `Last Date: ${tender.last_date || "N/A"}`,
      `Days Left: ${tender.days_remaining >= 0 ? `${tender.days_remaining} days` : "Unknown"}`,
      `Scope: ${tender.scope || "N/A"}`,
      `Source Portal: ${tender.source_portal || "N/A"}`,
      `Direct Link: ${tender.direct_link || "N/A"}`,
      `Who Can Apply: ${tender.who_can_apply || "N/A"}`,
      `Who Cannot Apply: ${tender.who_cannot_apply || "N/A"}`,
      `Required Documents: ${tender.required_documents || "N/A"}`,
      `Bid Tips: ${tender.bid_tips || "N/A"}`,
    ].join("\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: `You are a helpful government tender consultant for Indian businesses. A user is asking about a specific tender. Answer concisely and practically in 2-4 sentences. Use simple, clear English only - do not use Hindi or Hinglish.

Tender Information:
${ctx}`,
      messages: [{ role: "user", content: question.trim() }],
    });

    const answer = response.content.find(b => b.type === "text")?.text
      || "No answer found. Please try again.";

    return Response.json({ answer });
  } catch (err) {
    console.error("[tender-chat]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
