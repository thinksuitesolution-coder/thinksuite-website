import { NextResponse } from "next/server";
import { saveOutput, verifyToken } from "@/lib/saveOutput";

export const maxDuration = 60;

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken, toolSlug, type, title, data, mimeType, metadata } = body;

    if (!idToken)              return NextResponse.json({ error: "idToken required" },              { status: 401 });
    if (!toolSlug || !type)    return NextResponse.json({ error: "toolSlug and type required" },    { status: 400 });
    if (data === undefined || data === null) {
      return NextResponse.json({ error: "data required" }, { status: 400 });
    }

    const uid = await verifyToken(idToken);

    const result = await saveOutput({ uid, toolSlug, type, title, data, mimeType, metadata });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[user-outputs/save]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
