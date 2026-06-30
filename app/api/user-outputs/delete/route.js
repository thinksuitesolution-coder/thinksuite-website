import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/saveOutput";
import { getAdminDb, getAdminStorage } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { idToken, outputId } = await req.json();
    if (!idToken || !outputId) {
      return NextResponse.json({ error: "idToken and outputId required" }, { status: 400 });
    }

    const uid    = await verifyToken(idToken);
    const db     = getAdminDb();
    const docRef = db.collection("userOutputs").doc(outputId);
    const doc    = await docRef.get();

    if (!doc.exists) return NextResponse.json({ error: "Output not found" }, { status: 404 });

    const data = doc.data();
    if (data.uid !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Delete Storage file immediately
    if (data.storageRef) {
      try {
        await getAdminStorage().bucket().file(data.storageRef).delete();
      } catch {}
    }

    await docRef.update({ userDeleted: true, deletedAt: Date.now() });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[user-outputs/delete]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
