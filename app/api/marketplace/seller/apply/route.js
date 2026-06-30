import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

/* ── POST /api/marketplace/seller/apply ── */
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.email || !body.productName) {
      return NextResponse.json({ error: "email and productName are required" }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection("seller_applications").add({
      ...body,
      status:      "pending_review",
      submittedAt: body.submittedAt || Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[seller/apply]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
