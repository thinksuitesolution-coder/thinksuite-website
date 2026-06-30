import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages array required" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: "You are a helpful AI assistant specialising in web design, frontend development, and UI/UX analysis. Answer the user's questions clearly and concisely.",
      messages: messages.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })),
    });

    const reply = response.content[0]?.text?.trim() || "Sorry, I could not generate a response.";
    return Response.json({ success: true, reply });
  } catch (err) {
    console.error("Thinksuite API error:", err);
    return Response.json({ error: err.message || "AI request failed." }, { status: 500 });
  }
}
