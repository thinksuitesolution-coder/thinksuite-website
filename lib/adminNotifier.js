/**
 * Unified admin notification system.
 * Logs to Firestore `admin_notifications` + sends FCM push to all admin devices.
 *
 * Types: "api_alert" | "new_subscription" | "new_user"
 */

import getAdmin, { getAdminDb } from "./firebaseAdmin";

/* ── Send FCM to all registered admin devices ─────────────────────────────── */
async function pushToAdmins(title, body, data = {}) {
  try {
    const db = getAdminDb();
    const snap = await db.collection("admin_fcm_tokens").get();
    if (snap.empty) return;

    const tokens = snap.docs.map((d) => d.data().token).filter(Boolean);
    if (!tokens.length) return;

    const messaging = getAdmin().messaging();
    const stale = [];

    for (const token of tokens) {
      try {
        await messaging.send({
          token,
          notification: { title, body },
          data: Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, String(v)])
          ),
          android: { priority: "high", notification: { sound: "default" } },
          apns: { payload: { aps: { sound: "default", badge: 1 } } },
        });
      } catch (e) {
        if (
          e.code === "messaging/invalid-registration-token" ||
          e.code === "messaging/registration-token-not-registered"
        ) {
          stale.push(token);
        }
      }
    }

    // Clean stale tokens
    if (stale.length) {
      const db2 = getAdminDb();
      const batch = db2.batch();
      for (const t of stale) {
        const s = await db2.collection("admin_fcm_tokens").where("token", "==", t).get();
        s.docs.forEach((d) => batch.delete(d.ref));
      }
      await batch.commit();
    }
  } catch (e) {
    console.error("[adminNotifier] FCM push failed:", e.message);
  }
}

/* ── Save notification to Firestore ──────────────────────────────────────── */
async function saveNotification(type, title, body, data = {}) {
  try {
    const db = getAdminDb();
    const doc = await db.collection("admin_notifications").add({
      type,
      title,
      body,
      data,
      status: "new",
      createdAt: new Date(),
    });
    return doc.id;
  } catch (e) {
    console.error("[adminNotifier] Firestore save failed:", e.message);
    return null;
  }
}

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * API credit / quota exhaustion alert
 */
export async function notifyApiAlert({ provider, error, userId, userEmail, tool, route }) {
  const title = `⚠️ ${(provider || "API").toUpperCase()} Credits Khatam`;
  const body = `${tool || "Tool"} fail hua ${(error?.message || "quota exceeded").substring(0, 80)}`;
  const data = {
    type: "api_alert",
    provider: provider || "",
    tool: tool || "",
    route: route || "",
    userId: userId || "anonymous",
    userEmail: userEmail || "",
    errorCode: String(error?.status || error?.code || "unknown"),
    errorMessage: (error?.message || "").substring(0, 300),
  };

  // Save to api_alerts (for web admin panel)
  try {
    await getAdminDb().collection("api_alerts").add({
      ...data,
      status: "new",
      createdAt: new Date(),
    });
  } catch {}

  // Save to admin_notifications (for mobile app real-time)
  await saveNotification("api_alert", title, body, data);

  // Push notification
  pushToAdmins(title, body, { ...data, notifType: "api_alert" }).catch(() => {});
}

/**
 * New subscription / payment notification
 */
export async function notifyNewSubscription({ userId, userEmail, toolSlug, plan, amount }) {
  const planMap = {
    tool_monthly: "Monthly",
    tool_sixmonth: "6-Month",
    tool_annual: "Annual",
    trial: "Trial",
  };
  const planLabel = planMap[plan] || plan || "Plan";
  const amountStr = amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "";

  const title = `💰 Naya Subscription! ${toolSlug}`;
  const body = `${userEmail || userId} ne ${toolSlug} ka ${planLabel} plan liya${amountStr ? ` ${amountStr}` : ""}`;

  const data = {
    type: "new_subscription",
    userId: userId || "",
    userEmail: userEmail || "",
    toolSlug: toolSlug || "",
    plan: planLabel,
    amount: String(amount || 0),
  };

  await saveNotification("new_subscription", title, body, data);
  pushToAdmins(title, body, { ...data, notifType: "new_subscription" }).catch(() => {});
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notifId) {
  try {
    await getAdminDb().collection("admin_notifications").doc(notifId).update({
      status: "read",
      readAt: new Date(),
    });
  } catch (e) {
    console.error("[adminNotifier] markRead failed:", e.message);
  }
}
