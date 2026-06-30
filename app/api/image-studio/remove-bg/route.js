import Replicate from "replicate";
import { NextResponse } from "next/server";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req) {
  try {
    const formData  = await req.formData();
    const imageFile = formData.get("image");
    if (!imageFile) return NextResponse.json({ error: "Image required" }, { status: 400 });

    const bytes   = await imageFile.arrayBuffer();
    const base64  = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${imageFile.type || "image/jpeg"};base64,${base64}`;

    const output = await replicate.run("lucataco/remove-bg", {
      input: { image: dataUrl },
    });

    const raw    = Array.isArray(output) ? output[0] : output;
    const urlStr = typeof raw === "string" ? raw : raw?.toString?.() ?? "";
    if (!urlStr) return NextResponse.json({ error: "No output from model" }, { status: 500 });

    /* Convert result URL → base64 so browser can display without CORS */
    const buf        = await (await fetch(urlStr)).arrayBuffer();
    const resultB64  = Buffer.from(buf).toString("base64");

    return NextResponse.json({ imageUrl: `data:image/png;base64,${resultB64}` });
  } catch (err) {
    console.error("Remove-bg error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
