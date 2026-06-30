import { getAdminDb, firebaseAdmin as admin } from "@/lib/firebaseAdmin";

/* ═══════════════════════════════════════════════════════════════════════════
   VIDEO HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Save a new video document to "ai_videos".
 * Returns the auto-generated document ID (jobId).
 */
export async function saveVideo(userId, videoData) {
  const db  = getAdminDb();
  const ref = await db.collection("ai_videos").add({
    userId,
    ...videoData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

/**
 * Fetch a user's last `limit` videos, newest first.
 * Supports pagination via `offset` (number of docs to skip).
 */
export async function getVideoHistory(userId, limit = 20, offset = 0) {
  const db = getAdminDb();
  let query = db
    .collection("ai_videos")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit + offset);

  const snapshot = await query.get();
  const all = [];
  snapshot.forEach(doc => {
    const d = doc.data();
    all.push({
      id:            doc.id,
      type:          d.type,
      status:        d.status,
      videoUrl:      d.videoUrl      || null,
      thumbnailUrl:  d.thumbnailUrl  || null,
      script:        d.script?.substring(0, 120) || "",
      language:      d.language,
      duration:      d.duration      || null,
      creditsUsed:   d.creditsUsed   || 0,
      createdAt:     d.createdAt?.toDate?.()?.toISOString() || null,
    });
  });
  return all.slice(offset);
}

/**
 * Update the status (and optionally videoUrl) of an existing video doc.
 */
export async function updateVideoStatus(videoId, status, videoUrl = null) {
  const db = getAdminDb();
  const update = {
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  if (videoUrl) update.videoUrl = videoUrl;
  await db.collection("ai_videos").doc(videoId).update(update);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CREDIT HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

const DEFAULT_CREDITS = 50; // credits given on first sign-up

/**
 * Return the current credit balance for a user.
 * Creates the credits field (DEFAULT_CREDITS) if it doesn't exist yet.
 */
export async function getUserCredits(userId) {
  const db  = getAdminDb();
  const doc = await db.collection("users").doc(userId).get();

  if (!doc.exists) return 0;

  const data = doc.data();
  if (typeof data.creditsBalance !== "number") {
    // First-time initialisation
    await db.collection("users").doc(userId).set(
      { creditsBalance: DEFAULT_CREDITS },
      { merge: true }
    );
    return DEFAULT_CREDITS;
  }
  return data.creditsBalance;
}

/**
 * Deduct `amount` credits from a user.
 * Throws if the balance would go negative.
 */
export async function deductCredits(userId, amount, reason, videoId = null) {
  const db      = getAdminDb();
  const userRef = db.collection("users").doc(userId);

  await db.runTransaction(async (tx) => {
    const doc = await tx.get(userRef);
    const balance = doc.exists ? (doc.data().creditsBalance || 0) : 0;

    if (balance < amount) {
      throw new Error(`Insufficient credits (have ${balance}, need ${amount})`);
    }

    const historyEntry = {
      amount:       -amount,
      type:         "usage",
      reason,
      relatedVideoId: videoId,
      timestamp:    admin.firestore.FieldValue.serverTimestamp(),
    };

    tx.set(
      userRef,
      {
        creditsBalance:  admin.firestore.FieldValue.increment(-amount),
        creditsHistory:  admin.firestore.FieldValue.arrayUnion(historyEntry),
        "videoStats.totalVideosCreated": admin.firestore.FieldValue.increment(1),
      },
      { merge: true }
    );
  });
}

/**
 * Add `amount` credits to a user (purchase, bonus, refund).
 */
export async function addCredits(userId, amount, reason = "bonus") {
  const db      = getAdminDb();
  const userRef = db.collection("users").doc(userId);

  const historyEntry = {
    amount,
    type:      reason === "purchase" ? "purchase" : "bonus",
    reason,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await userRef.set(
    {
      creditsBalance: admin.firestore.FieldValue.increment(amount),
      creditsHistory: admin.firestore.FieldValue.arrayUnion(historyEntry),
    },
    { merge: true }
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ERROR LOGGING
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Save an error entry to the "error_logs" collection.
 * @param {string} severity  "info" | "warning" | "error" | "critical"
 */
export async function logError(userId, videoId, severity, message, context = {}) {
  try {
    const db = getAdminDb();
    await db.collection("error_logs").add({
      userId,
      videoId:   videoId || null,
      severity,
      message,
      context,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      resolved:  false,
      resolution: null,
    });
  } catch {
    // Never throw from a logging helper
  }
}
