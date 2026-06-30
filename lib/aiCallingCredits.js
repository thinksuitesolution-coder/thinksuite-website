import { getAdminDb } from "@/lib/firebaseAdmin";
export { CREDIT_PACKS } from "@/lib/aiCallingConfig";

const COLLECTION = "aiCallingCredits";

/* ─── Read current balance ─────────────────────────────────────────────── */
export async function getCallCredits(userId) {
  if (!userId) return { credits: 0, totalPurchased: 0, totalUsed: 0 };
  const db = getAdminDb();
  const doc = await db.collection(COLLECTION).doc(userId).get();
  if (!doc.exists) return { credits: 0, totalPurchased: 0, totalUsed: 0 };
  const d = doc.data();
  return {
    credits:        d.credits        ?? 0,
    totalPurchased: d.totalPurchased ?? 0,
    totalUsed:      d.totalUsed      ?? 0,
  };
}

/* ─── Deduct n credits atomically; returns false if insufficient ───────── */
export async function deductCallCredits(userId, count = 1) {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(userId);

  let ok = false;
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? (snap.data().credits ?? 0) : 0;
    if (current < count) { ok = false; return; }
    tx.set(ref, {
      credits:  current - count,
      totalUsed: (snap.exists ? (snap.data().totalUsed ?? 0) : 0) + count,
      lastUpdated: new Date(),
    }, { merge: true });
    ok = true;
  });
  return ok;
}

/* ─── Add credits (after purchase) ────────────────────────────────────── */
export async function addCallCredits(userId, count, source = "purchase") {
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(userId);
  const snap = await ref.get();
  const current = snap.exists ? (snap.data().credits ?? 0) : 0;
  const purchased = snap.exists ? (snap.data().totalPurchased ?? 0) : 0;

  await ref.set({
    credits:        current + count,
    totalPurchased: purchased + count,
    lastPurchaseSource: source,
    lastPurchaseAt: new Date(),
    lastUpdated:    new Date(),
  }, { merge: true });
}

