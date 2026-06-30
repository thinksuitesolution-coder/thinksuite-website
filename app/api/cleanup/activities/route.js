import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const maxDuration = 60;

export async function GET(req) {
  const authHeader = req.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const altSecret =
    req.headers.get("x-cron-secret") ||
    new URL(req.url).searchParams.get("secret");

  if (process.env.CRON_SECRET) {
    const valid = bearerToken === process.env.CRON_SECRET || altSecret === process.env.CRON_SECRET;
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db  = getAdminDb();
  const now = Date.now();

  const snap = await db.collection("userActivities")
    .where("expiresAt", "<=", now)
    .where("deleted",   "==", false)
    .limit(500)
    .get();

  let deleted = 0;
  const batch = db.batch();
  for (const doc of snap.docs) {
    batch.update(doc.ref, { deleted: true });
    deleted++;
  }
  if (deleted > 0) await batch.commit();

  return NextResponse.json({
    ok: true,
    deleted,
    timestamp: new Date(now).toISOString(),
  });
}
