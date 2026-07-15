import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, toolSlug } = await req.json();

    if (!userId || !toolSlug) {
      return NextResponse.json({ status: "none", error: "Missing userId or toolSlug" }, { status: 400 });
    }

    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const doc = await getAdminDb().collection("users").doc(userId).collection("subscriptions").doc(toolSlug).get();

    if (!doc.exists) {
      return NextResponse.json({ status: "none" });
    }

    const data = doc.data();
    const now = Date.now();

    if (data.status === "trial" && data.trialEnd && now > data.trialEnd) {
      await doc.ref.update({ status: "expired" });
      return NextResponse.json({ status: "expired" });
    }

    return NextResponse.json({ status: data.status, trialEnd: data.trialEnd ?? null });
  } catch (err) {
    console.error("[subscription-status] Error:", err.message);
    return NextResponse.json({ status: "none", error: err.message }, { status: 500 });
  }
}
