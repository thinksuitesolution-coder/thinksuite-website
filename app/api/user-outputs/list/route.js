import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/saveOutput";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { idToken, toolSlug } = await req.json();
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const uid = await verifyToken(idToken);
    const db  = getAdminDb();
    const now = Date.now();

    const snap = await db.collection("userOutputs")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    let outputs = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(o => !o.userDeleted && !o.serverDeleted && o.userExpiresAt > now);

    if (toolSlug) {
      outputs = outputs.filter(o => o.toolSlug === toolSlug);
    }

    // Don't send full textContent back in list (can be large); just a preview
    outputs = outputs.map(o => ({
      ...o,
      textContent: o.textContent ? o.textContent.slice(0, 300) : undefined,
    }));

    return NextResponse.json({ outputs });
  } catch (err) {
    console.error("[user-outputs/list]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
