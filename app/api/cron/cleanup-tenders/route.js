import { getAdminDb } from "@/lib/firebaseAdmin";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const BATCH_SIZE = 400;

async function deleteExpiredFromCollection(db, collectionName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const snap = await db
    .collection(collectionName)
    .where("deadline_timestamp", "<", today)
    .limit(500)
    .get();

  if (snap.empty) return 0;

  let deleted = 0;
  for (let i = 0; i < snap.docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    snap.docs.slice(i, i + BATCH_SIZE).forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    deleted += Math.min(BATCH_SIZE, snap.docs.length - i);
  }
  return deleted;
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();

  const [deletedIndia, deletedIntl] = await Promise.all([
    deleteExpiredFromCollection(db, "tenders_india"),
    deleteExpiredFromCollection(db, "tenders_international"),
  ]);

  console.log(`[cleanup-tenders] Deleted ${deletedIndia} india, ${deletedIntl} intl expired tenders`);

  return Response.json({
    success:              true,
    deleted_india:        deletedIndia,
    deleted_international: deletedIntl,
    timestamp:            new Date().toISOString(),
  });
}
