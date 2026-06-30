import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("video");

    if (!videoFile) {
      return Response.json({ error: "Video file required" }, { status: 400 });
    }

    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = videoFile.type || "video/mp4";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Real-ESRGAN video upscaling -4× super resolution
    const output = await replicate.run(
      "lucataco/real-esrgan-video",
      {
        input: {
          video: dataUrl,
          scale: 4,
        },
      }
    );

    const videoUrl = Array.isArray(output) ? output[0] : output;
    if (!videoUrl) return Response.json({ error: "No output from upscale model" }, { status: 500 });

    return Response.json({ videoUrl });

  } catch (err) {
    console.error("Video upscale error:", err.message);
    return Response.json({ error: err.message || "Video upscale failed" }, { status: 500 });
  }
}
