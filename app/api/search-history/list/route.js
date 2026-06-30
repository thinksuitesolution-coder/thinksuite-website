import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifyToken } from "@/lib/saveOutput";

export async function POST(req) {
  try {
    const { idToken, toolSlug, limit = 60 } = await req.json();

    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const uid = await verifyToken(idToken);
    const db  = getAdminDb();
    const now = Date.now();

    const snap = await db.collection("searchHistory")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(Math.min(limit, 100))
      .get();

    let searches = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(s => s.expiresAt > now);

    if (toolSlug) searches = searches.filter(s => s.toolSlug === toolSlug);

    return NextResponse.json({ ok: true, searches });
  } catch (e) {
    console.error("[search-history/list]", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
