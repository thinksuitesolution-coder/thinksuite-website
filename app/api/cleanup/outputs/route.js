import { NextResponse } from "next/server";
import { getAdminDb, getAdminStorage } from "@/lib/firebaseAdmin";

export const maxDuration = 60;

export async function GET(req) {
  // Vercel Cron sends: Authorization: Bearer {CRON_SECRET}
  const authHeader = req.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  // Also support x-cron-secret and ?secret= for manual testing
  const altSecret = req.headers.get("x-cron-secret")
    || new URL(req.url).searchParams.get("secret");

  if (process.env.CRON_SECRET) {
    const valid = bearerToken === process.env.CRON_SECRET || altSecret === process.env.CRON_SECRET;
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db      = getAdminDb();
  const storage = getAdminStorage();
  const now     = Date.now();

  // ── Phase 1: Hard-delete records past the 30-day server retention ──────────
  const toDelete = await db.collection("userOutputs")
    .where("serverDeleteAt", "<=", now)
    .where("serverDeleted",   "==", false)
    .limit(300)
    .get();

  let deleted = 0;
  const delBatch = db.batch();

  for (const doc of toDelete.docs) {
    const d = doc.data();
    if (d.storageRef) {
      try { await storage.bucket().file(d.storageRef).delete(); } catch {}
    }
    delBatch.delete(doc.ref);
    deleted++;
  }
  if (deleted > 0) await delBatch.commit();

  // ── Phase 2: Mark 7-day user-expired items as userDeleted (hide from dash) ─
  const userExpired = await db.collection("userOutputs")
    .where("userExpiresAt", "<=", now)
    .where("userDeleted",    "==", false)
    .limit(300)
    .get();

  let marked = 0;
  const markBatch = db.batch();
  for (const doc of userExpired.docs) {
    markBatch.update(doc.ref, { userDeleted: true });
    marked++;
  }
  if (marked > 0) await markBatch.commit();

  return NextResponse.json({
    ok: true,
    deleted,
    marked,
    timestamp: new Date(now).toISOString(),
  });
}
