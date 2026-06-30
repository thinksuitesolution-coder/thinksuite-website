import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = imageFile.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: dataUrl,
          scale: 2,
          face_enhance: false,
        },
      }
    );

    console.log("Replicate output type:", typeof output, output?.constructor?.name);
    console.log("Replicate output value:", output);

    const raw = Array.isArray(output) ? output[0] : output;

    // Replicate SDK v1.x returns FileOutput objects - extract URL properly
    let imageUrl = null;
    if (typeof raw === "string") {
      imageUrl = raw;
    } else if (raw instanceof URL) {
      imageUrl = raw.href;
    } else if (raw && typeof raw.url === "function") {
      imageUrl = raw.url().href;
    } else if (raw) {
      imageUrl = String(raw);
    }

    console.log("Final imageUrl:", imageUrl);

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error("Upscale error:", error);

    return NextResponse.json(
      { error: error?.message || "Upscale failed" },
      { status: 500 }
    );
  }
}
