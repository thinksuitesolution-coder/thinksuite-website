import { withCreditGuard, detectCreditError, logApiAlert } from "@/lib/apiCreditMonitor";

async function handleGoogleVideoError(res, provider, tool, route) {
  let errText = "";
  try { errText = await res.text(); } catch {}
  let m = "Google Video API error";
  try { m = JSON.parse(errText)?.error?.message || m; } catch {}
  const syntheticErr = { status: res.status, message: m };
  if (detectCreditError(syntheticErr, "google")) {
    await logApiAlert({ provider: "google", error: syntheticErr, tool, route });
    return Response.json(
      { error: "Service abhi unavailable hai. Admin ko notify kar diya gaya hai. Baad mein try karein." },
      { status: 503 }
    );
  }
  return Response.json({ error: m }, { status: res.status });
}

export async function POST(request) {
  try {
    const { prompt, imageUrl, duration, aspectRatio, provider } = await request.json();

    // Google Flow - tries Veo 3 first, falls back to Veo 2 automatically
    if (provider === "flow") {
      const imageB64 = imageUrl?.includes(",") ? imageUrl.split(",")[1] : imageUrl;
      const body = JSON.stringify({
        instances: [{ prompt, ...(imageUrl ? { image: { bytesBase64Encoded: imageB64 } } : {}) }],
        parameters: { aspectRatio: aspectRatio || "16:9", durationSeconds: duration || 8 },
      });
      const headers = { "Content-Type": "application/json" };
      const key = process.env.GEMINI_API_KEY;

      // Try models in order: Veo 3.1 → Veo 3.1 Fast → Veo 2
      const FLOW_MODELS = [
        "veo-3.1-generate-preview",
        "veo-3.1-fast-generate-preview",
        "veo-2.0-generate-001",
      ];

      let res = null;
      for (const model of FLOW_MODELS) {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${key}`,
          { method: "POST", headers, body }
        );
        if (res.ok) break;
        const errText = await res.text();
        const errMsg = (() => { try { return JSON.parse(errText)?.error?.message || ""; } catch { return ""; } })();
        const tryNext = res.status === 404 || errMsg.toLowerCase().includes("not found") || errMsg.toLowerCase().includes("not supported");
        if (!tryNext) {
          const syntheticErr = { status: res.status, message: errMsg || "Google Flow API error" };
          if (detectCreditError(syntheticErr, "google")) {
            await logApiAlert({ provider: "google", error: syntheticErr, tool: "video", route: "/api/video" });
            return Response.json(
              { error: "Service abhi unavailable hai. Admin ko notify kar diya gaya hai. Baad mein try karein." },
              { status: 503 }
            );
          }
          return Response.json({ error: syntheticErr.message }, { status: res.status });
        }
      }

      if (!res.ok) {
        return await handleGoogleVideoError(res, "google", "video", "/api/video");
      }

      const op = await res.json();
      if (!op.name) return Response.json({ error: "Operation name missing - check GEMINI_API_KEY" }, { status: 500 });
      return Response.json({ operationName: op.name });
    }

    // Veo 2 - predictLongRunning
    if (provider === "veo2") {
      const imageB64Veo2 = imageUrl?.includes(",") ? imageUrl.split(",")[1] : imageUrl;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:predictLongRunning?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt, ...(imageUrl ? { image: { bytesBase64Encoded: imageB64Veo2 } } : {}) }],
            parameters: { aspectRatio: aspectRatio || "16:9", durationSeconds: duration || 8 },
          }),
        }
      );

      if (!res.ok) {
        return await handleGoogleVideoError(res, "google", "video", "/api/video");
      }

      const op = await res.json();
      if (!op.name) return Response.json({ error: "Operation name missing - check GEMINI_API_KEY" }, { status: 500 });
      return Response.json({ operationName: op.name });
    }

    // Replicate - Minimax
    const output = await withCreditGuard(
      async () => {
        const Replicate = (await import("replicate")).default;
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
        const input = { prompt, duration: duration || 5, aspect_ratio: aspectRatio || "16:9" };
        if (imageUrl) input.first_frame_image = imageUrl;
        return replicate.run("minimax/video-01", { input });
      },
      "replicate",
      { tool: "video", route: "/api/video" }
    );
    return Response.json({ videoUrl: output });

  } catch (err) {
    console.error("Video error:", err.message);
    return Response.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
