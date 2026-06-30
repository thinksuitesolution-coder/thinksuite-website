import { NextResponse } from "next/server";
import { getCallCredits } from "@/lib/aiCallingCredits";
import { CREDIT_PACKS } from "@/lib/aiCallingCredits";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const balance = await getCallCredits(userId);
    return NextResponse.json({ ...balance, packs: CREDIT_PACKS });
  } catch (err) {
    console.error("[credits]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
