import { detectCreditError, logApiAlert } from "@/lib/apiCreditMonitor";

export async function POST(request) {
  try {
    const { text, voice, speed } = await request.json();
    if (!text) return Response.json({ error: "Text required" }, { status: 400 });

    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice || "alloy",
        speed: speed || 1.0,
      }),
    });

    if (!res.ok) {
      let errBody = {};
      try { errBody = await res.json(); } catch {}
      const syntheticErr = { status: res.status, message: errBody.error?.message || "OpenAI TTS error" };
      if (detectCreditError(syntheticErr, "openai")) {
        await logApiAlert({ provider: "openai", error: syntheticErr, tool: "voice", route: "/api/voice/openai" });
        return Response.json(
          { error: "Service is currently unavailable. Admin has been notified. Please try again later." },
          { status: 503 }
        );
      }
      return Response.json({ error: syntheticErr.message }, { status: 500 });
    }

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return Response.json({ audioData: base64, mimeType: "audio/mpeg" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
