import { getAdminDb } from "@/lib/firebaseAdmin";

export async function getWallet(userId) {
  if (!userId) return { balance: 0, totalAdded: 0, totalSpent: 0 };
  try {
    const snap = await getAdminDb().collection("leadWallet").doc(userId).get();
    if (!snap.exists) return { balance: 0, totalAdded: 0, totalSpent: 0 };
    const d = snap.data();
    return {
      balance:             d.balance             || 0,
      totalAdded:          d.totalAdded          || 0,
      totalSpent:          d.totalSpent          || 0,
      lastTopupAt:         d.lastTopupAt         || null,
      lastTopupPaymentId:  d.lastTopupPaymentId  || null,
      lastDeductedAt:      d.lastDeductedAt      || null,
    };
  } catch {
    return { balance: 0, totalAdded: 0, totalSpent: 0 };
  }
}

export async function addToWallet(userId, amount, paymentId) {
  if (!userId) throw new Error("userId required");
  const amt = Number(amount);
  if (!amt || amt <= 0) throw new Error("Amount must be a positive number");

  const db  = getAdminDb();
  const ref = db.collection("leadWallet").doc(userId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const d    = snap.exists ? snap.data() : {};
    tx.set(ref, {
      balance:            (d.balance    || 0) + amt,
      totalAdded:         (d.totalAdded || 0) + amt,
      totalSpent:         d.totalSpent  || 0,
      lastTopupAt:        Date.now(),
      lastTopupPaymentId: paymentId || null,
      updatedAt:          Date.now(),
    }, { merge: true });
  });

  // Log transaction (non-fatal)
  try {
    await db.collection("walletTransactions").add({
      userId,
      type:      "credit",
      amount:    amt,
      paymentId: paymentId || null,
      createdAt: Date.now(),
    });
  } catch { /* non-critical */ }
}

export async function deductFromWallet(userId, leadsCount, perLeadCost) {
  if (!userId || leadsCount <= 0) return 0;

  const cost = Number(perLeadCost);
  if (!cost || cost <= 0) throw new Error("Invalid perLeadCost");

  const totalCost = leadsCount * cost;
  const db  = getAdminDb();
  const ref = db.collection("leadWallet").doc(userId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const d    = snap.exists ? snap.data() : {};
    const bal  = d.balance || 0;
    if (bal < totalCost) throw new Error("Insufficient wallet balance");
    tx.set(ref, {
      balance:       bal - totalCost,
      totalSpent:    (d.totalSpent || 0) + totalCost,
      lastDeductedAt: Date.now(),
      updatedAt:     Date.now(),
    }, { merge: true });
  });

  // Log transaction (non-fatal)
  try {
    await db.collection("walletTransactions").add({
      userId,
      type:       "debit",
      amount:     totalCost,
      leadsCount,
      perLeadCost: cost,
      createdAt:  Date.now(),
    });
  } catch { /* non-critical */ }

  return totalCost;
}
