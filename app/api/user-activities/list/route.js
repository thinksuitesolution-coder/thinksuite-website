import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifyToken } from "@/lib/saveOutput";

export async function POST(req) {
  try {
    const { idToken, limit = 100 } = await req.json();

    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const uid = await verifyToken(idToken);
    const db  = getAdminDb();

    const snap = await db.collection("userActivities")
      .where("uid",     "==", uid)
      .where("deleted", "==", false)
      .orderBy("createdAt", "desc")
      .limit(Math.min(limit, 200))
      .get();

    const activities = snap.docs.map(doc => doc.data());

    return NextResponse.json({ ok: true, activities });
  } catch (e) {
    console.error("[user-activities/list]", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
