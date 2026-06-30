import { getAdminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import getAdmin from "@/lib/firebaseAdmin";

const OWNER_EMAILS = [
  "thinksuitesolution@gmail.com",
  "info@Thinksuite.in",
  "subscriptionaakash@gmail.com",
];

async function verifyAdmin(request) {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const decoded = await getAdmin().auth().verifyIdToken(token);
    const db = getAdminDb();
    if (OWNER_EMAILS.includes(decoded.email)) return decoded;
    const snap = await db
      .collection("admin_users")
      .where("email", "==", decoded.email)
      .limit(1)
      .get();
    return snap.empty ? null : decoded;
  } catch {
    return null;
  }
}

/* ── GET /api/admin/api-alerts ───────────────────────────────────────────── */
export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("status"); // "new" | "acknowledged" | null = all

    let query = db.collection("api_alerts").orderBy("createdAt", "desc").limit(200);
    if (filter) query = query.where("status", "==", filter);

    const snap = await query.get();
    const alerts = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    const newCount = alerts.filter((a) => a.status === "new").length;

    return Response.json({ alerts, newCount });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

/* ── PATCH /api/admin/api-alerts ─ acknowledge one or all ───────────────── */
export async function PATCH(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { alertId, acknowledgeAll } = await request.json();
    const db = getAdminDb();

    if (acknowledgeAll) {
      const snap = await db
        .collection("api_alerts")
        .where("status", "==", "new")
        .get();
      const batch = db.batch();
      snap.docs.forEach((d) =>
        batch.update(d.ref, { status: "acknowledged", acknowledgedAt: new Date() })
      );
      await batch.commit();
      return Response.json({ updated: snap.size });
    }

    if (!alertId) return Response.json({ error: "alertId required" }, { status: 400 });
    await db.collection("api_alerts").doc(alertId).update({
      status: "acknowledged",
      acknowledgedAt: new Date(),
    });
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

/* ── DELETE /api/admin/api-alerts ─ clear all acknowledged ─────────────── */
export async function DELETE(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("api_alerts")
      .where("status", "==", "acknowledged")
      .get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    return Response.json({ deleted: snap.size });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

/* ── POST /api/admin/api-alerts ─ register FCM token ───────────────────── */
export async function POST(request) {
  const adminUser = await verifyAdmin(request);
  if (!adminUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { fcmToken } = await request.json();
    if (!fcmToken) return Response.json({ error: "fcmToken required" }, { status: 400 });

    const db = getAdminDb();
    // Upsert by email so we don't duplicate
    const existing = await db
      .collection("admin_fcm_tokens")
      .where("email", "==", adminUser.email)
      .get();

    if (existing.empty) {
      await db.collection("admin_fcm_tokens").add({
        token: fcmToken,
        email: adminUser.email,
        uid: adminUser.uid,
        registeredAt: new Date(),
      });
    } else {
      await existing.docs[0].ref.update({ token: fcmToken, updatedAt: new Date() });
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
