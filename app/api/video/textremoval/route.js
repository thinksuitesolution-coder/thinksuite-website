import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("video");
    const userPrompt = formData.get("prompt") || "";

    if (!videoFile) {
      return Response.json({ error: "Video file required" }, { status: 400 });
    }

    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = videoFile.type || "video/mp4";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // ProPainter -video inpainting for text/watermark removal
    // Automatically detects and removes text, subtitles, watermarks
    const output = await replicate.run(
      "zsxkib/propainter",
      {
        input: {
          video: dataUrl,
          // mask_dilation: controls how much area around detected text gets inpainted
          mask_dilation: 4,
          // inpaint mode: object-removal removes detected foreground objects (text/watermarks)
          mode: "video-inpainting",
          ...(userPrompt ? { prompt: userPrompt } : {}),
        },
      }
    );

    const videoUrl = Array.isArray(output) ? output[0] : output;
    if (!videoUrl) return Response.json({ error: "No output from text removal model" }, { status: 500 });

    return Response.json({ videoUrl });

  } catch (err) {
    console.error("Text removal error:", err.message);
    return Response.json({ error: err.message || "Text removal failed" }, { status: 500 });
  }
}
