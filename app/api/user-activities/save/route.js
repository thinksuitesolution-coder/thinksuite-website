import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifyToken } from "@/lib/saveOutput";
import { randomUUID } from "crypto";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req) {
  try {
    const { idToken, toolSlug, toolLabel, action, title, details } = await req.json();

    if (!idToken)   return NextResponse.json({ error: "idToken required" },   { status: 401 });
    if (!toolSlug)  return NextResponse.json({ error: "toolSlug required" },  { status: 400 });
    if (!title)     return NextResponse.json({ error: "title required" },     { status: 400 });

    const uid = await verifyToken(idToken);
    const db  = getAdminDb();
    const now = Date.now();
    const id  = randomUUID();

    await db.collection("userActivities").doc(id).set({
      id,
      uid,
      toolSlug,
      toolLabel:  toolLabel  || toolSlug,
      action:     action     || "activity",
      title,
      details:    details    || {},
      createdAt:  now,
      expiresAt:  now + THIRTY_DAYS,
      deleted:    false,
    });

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error("[user-activities/save]", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
