import { getAdminDb } from "@/lib/firebaseAdmin";
import getAdmin from "@/lib/firebaseAdmin";

export const LEAD_MONTHLY_LIMIT  = 999999;
export const MAX_LEADS_PER_CLICK = 60;

// Hardcoded owners are the last line of defence; primary admin list lives in config/admins
const OWNER_EMAILS = new Set(
  (process.env.OWNER_EMAILS || "thinksuitesolution@gmail.com,info@Thinksuite.in,subscriptionaakash@gmail.com,Thinksuiteofficial@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

// ── In-process cache for rarely-changing Firestore docs ──────────────────────
// TTL: 5 minutes. Safe for serverless: each cold start re-populates.
const _cache = new Map(); // key → { value, expiresAt }

function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.value;
}
function cacheSet(key, value, ttlMs = 5 * 60 * 1000) {
  _cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function currentMonth() {
  // Returns "YYYY-MM" in UTC. Quota resets at 00:00 UTC on the 1st.
  return new Date().toISOString().slice(0, 7);
}

async function isAdminUser(db, userId) {
  const cacheKey = `admin:${userId}`;
  const cached = cacheGet(cacheKey);
  if (cached !== null) return cached;

  try {
    const adminAuth  = getAdmin().auth();
    const userRecord = await adminAuth.getUser(userId);
    const email      = userRecord.email?.toLowerCase();
    if (!email) { cacheSet(cacheKey, false); return false; }

    if (OWNER_EMAILS.has(email)) { cacheSet(cacheKey, true); return true; }

    const snap    = await db.doc("config/admins").get();
    const admins  = new Set(snap.exists ? (snap.data().emails || []).map((e) => e.toLowerCase()) : []);
    const result  = admins.has(email);
    cacheSet(cacheKey, result);
    return result;
  } catch {
    return false;
  }
}

async function getLeadGenPlanConfig(db) {
  const cached = cacheGet("plan:leadGen");
  if (cached) return cached;

  try {
    const snap = await db.doc("config/pricing").get();
    const cfg  = snap.exists ? snap.data() : {};
    const firestoreStarter = cfg.leadGenPlans?.starter || {};
    const result = {
      starter: {
        monthly:           firestoreStarter.monthly           ?? 5000,
        walletEnabled:     firestoreStarter.walletEnabled     ?? true,
        walletPerLeadCost: firestoreStarter.walletPerLeadCost ?? 18,
        walletMinTopup:    firestoreStarter.walletMinTopup    ?? 500,
        // leadQuota is NEVER taken from Firestore — Firestore misconfiguration
        // (e.g. leadQuota:5) was causing users to hit a 5-lead wall.
        leadQuota: LEAD_MONTHLY_LIMIT,
      },
      unlimited: {
        enabled:    true,
        monthly:    8000,
        gstPercent: 18,
        ...(cfg.leadGenPlans?.unlimited || {}),
      },
    };
    cacheSet("plan:leadGen", result);
    return result;
  } catch {
    return {
      starter:   { monthly: 5000, leadQuota: LEAD_MONTHLY_LIMIT, walletEnabled: true, walletPerLeadCost: 18, walletMinTopup: 500 },
      unlimited: { enabled: true, monthly: 8000, gstPercent: 18 },
    };
  }
}

async function getUserLeadPlanType(db, userId) {
  try {
    const snap = await db.collection("users").doc(userId)
      .collection("subscriptions").doc("lead-generation").get();
    return snap.exists ? (snap.data().leadPlanType || "starter") : "starter";
  } catch {
    return "starter";
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the current quota status for a user without modifying any state.
 * The `userId` MUST be verified by the caller against the Firebase ID token
 * before being passed here - this function trusts the value.
 */
export async function checkLeadQuota(userId) {
  if (!userId) return { ok: false, used: 0, remaining: 0, limit: 0, error: "unauthenticated" };

  try {
    const db = getAdminDb();
    const month = currentMonth();

    const [planType, cfg, quotaSnap, admin] = await Promise.all([
      getUserLeadPlanType(db, userId),
      getLeadGenPlanConfig(db),
      db.collection("leadGenQuota").doc(userId).get(),
      isAdminUser(db, userId),
    ]);

    const used = quotaSnap.exists ? (quotaSnap.data()[month] || 0) : 0;

    if (admin || planType === "unlimited") {
      return { ok: true, used, remaining: 999_999, limit: 0, planType: "unlimited", unlimited: true };
    }

    const limit = cfg.starter.leadQuota;

    if (used < limit) {
      return { ok: true, used, remaining: limit - used, limit, planType: "starter" };
    }

    // Quota exhausted - check wallet
    if (!cfg.starter.walletEnabled) {
      return { ok: false, used, remaining: 0, limit, planType: "starter" };
    }

    const walletSnap      = await db.collection("leadWallet").doc(userId).get();
    const walletBalance   = walletSnap.exists ? (walletSnap.data().balance || 0) : 0;
    const perLeadCost     = cfg.starter.walletPerLeadCost;
    const walletMinTopup  = cfg.starter.walletMinTopup;

    if (walletBalance >= perLeadCost) {
      return {
        ok: true, used, remaining: Math.floor(walletBalance / perLeadCost), limit,
        planType: "starter", useWallet: true, walletBalance, walletPerLeadCost: perLeadCost, walletMinTopup,
      };
    }

    return {
      ok: false, used, remaining: 0, limit, planType: "starter",
      needsTopup: true, walletBalance, walletPerLeadCost: perLeadCost, walletMinTopup,
    };
  } catch (e) {
    console.error("[checkLeadQuota]", e.message);
    return { ok: false, used: 0, remaining: 0, limit: 0, error: true };
  }
}

/**
 * Atomically increments the lead quota counter and, if needed, deducts from
 * the wallet - all within a single Firestore transaction to prevent TOCTOU races.
 *
 * Returns { granted: N } - the number of leads actually approved (≤ MAX_LEADS_PER_CLICK).
 * Returns { granted: 0 } on any failure; never grants leads it cannot durably record.
 */
export async function incrementLeadQuota(userId, count) {
  if (!userId || count <= 0) return { granted: 0 };

  try {
    const db    = getAdminDb();
    const month = currentMonth();
    const cap   = MAX_LEADS_PER_CLICK;

    const [planType, cfg, isAdmin] = await Promise.all([
      getUserLeadPlanType(db, userId),
      getLeadGenPlanConfig(db),
      isAdminUser(db, userId),
    ]);

    const quotaRef  = db.collection("leadGenQuota").doc(userId);
    const walletRef = db.collection("leadWallet").doc(userId);

    // Unlimited / admin: only per-click cap applies
    if (isAdmin || planType === "unlimited") {
      const toGrant = Math.min(count, cap);
      await quotaRef.set(
        { [month]: getAdmin().firestore.FieldValue.increment(toGrant) },
        { merge: true }
      );
      return { granted: toGrant, used: toGrant, remaining: 999_999, limit: 0, unlimited: true };
    }

    // Starter: atomically enforce quota + wallet in a single transaction
    const limit = cfg.starter.leadQuota;
    let granted     = 0;
    let walletCost  = 0;
    let finalUsed   = 0;

    await db.runTransaction(async (tx) => {
      const [quotaSnap, walletSnap] = await Promise.all([
        tx.get(quotaRef),
        cfg.starter.walletEnabled ? tx.get(walletRef) : Promise.resolve(null),
      ]);

      const used          = quotaSnap.exists ? (quotaSnap.data()[month] || 0) : 0;
      const freeRemaining = Math.max(0, limit - used);
      const want          = Math.min(count, cap);
      const freeGranted   = Math.min(want, freeRemaining);
      let   walletGranted = 0;

      if (freeGranted < want && cfg.starter.walletEnabled && walletSnap) {
        const balance     = walletSnap.exists ? (walletSnap.data().balance || 0) : 0;
        const perLeadCost = cfg.starter.walletPerLeadCost;
        walletGranted     = Math.min(want - freeGranted, Math.floor(balance / perLeadCost));
        walletCost        = walletGranted * perLeadCost;

        if (walletGranted > 0) {
          // Deduct balance inside the same transaction - atomic with quota increment
          tx.set(walletRef, {
            balance:        balance - walletCost,
            totalSpent:     (walletSnap.data()?.totalSpent || 0) + walletCost,
            lastDeductedAt: Date.now(),
            updatedAt:      Date.now(),
          }, { merge: true });
        }
      }

      granted   = freeGranted + walletGranted;
      finalUsed = used + granted;

      if (granted > 0) {
        tx.set(quotaRef, { [month]: finalUsed }, { merge: true });
      }
    });

    // Log wallet transaction outside the main transaction - non-critical audit trail
    if (walletCost > 0) {
      db.collection("walletTransactions").add({
        userId,
        type:           "debit",
        amount:         walletCost,
        leadsCount:     Math.round(walletCost / cfg.starter.walletPerLeadCost),
        perLeadCost:    cfg.starter.walletPerLeadCost,
        createdAt:      Date.now(),
      }).catch((e) => console.warn("[incrementLeadQuota] wallet audit log failed:", e.message));
    }

    return {
      granted,
      used:      finalUsed,
      remaining: Math.max(0, limit - finalUsed),
      limit,
    };
  } catch (e) {
    console.error("[incrementLeadQuota]", e.message);
    // Fail CLOSED: do not grant leads we cannot record
    return { granted: 0, used: 0, remaining: 0, limit: 0 };
  }
}

export async function saveLeadHistory(userId, entry) {
  if (!userId) return;
  try {
    const db  = getAdminDb();
    const now = Date.now();
    await db.collection("leadGenHistory").doc(userId).collection("searches").add({
      ...entry,
      createdAt: now,
      // no expiresAt — records are permanent
    });
  } catch { /* non-fatal */ }
}
