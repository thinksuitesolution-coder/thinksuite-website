import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];
const CONFIG_DOC = "config/admins";

async function verifyAdmin(idToken) {
  const adminModule = await import("@/lib/firebaseAdmin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (!OWNER_EMAILS.includes(email)) {
    const snap = await adminApp.firestore().doc(CONFIG_DOC).get();
    const emails = snap.exists ? (snap.data().emails || []) : [];
    if (!emails.includes(email)) throw new Error("Unauthorized");
  }
  return adminApp;
}

/* ── GET all users with their subscriptions ── */
export async function POST(req) {
  try {
    const { idToken, action, uid, page = 1, search = "" } = await req.json();
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const adminApp = await verifyAdmin(idToken);
    const db = adminApp.firestore();

    /* ── Delete user ── */
    if (action === "delete") {
      if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });
      // Delete from Auth
      await adminApp.auth().deleteUser(uid);
      // Delete Firestore user doc + subcollections
      const subsSnap = await db.collection("users").doc(uid).collection("subscriptions").get();
      const batch = db.batch();
      subsSnap.forEach((doc) => batch.delete(doc.ref));
      batch.delete(db.collection("users").doc(uid));
      await batch.commit();
      return NextResponse.json({ success: true });
    }

    /* ── List all users ── */
    let allAuthUsers = [];
    let pageToken;
    do {
      const result = await adminApp.auth().listUsers(1000, pageToken);
      allAuthUsers = allAuthUsers.concat(result.users);
      pageToken = result.pageToken;
    } while (pageToken);

    // Filter by search
    const filtered = search
      ? allAuthUsers.filter(
          (u) =>
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.displayName?.toLowerCase().includes(search.toLowerCase())
        )
      : allAuthUsers;

    // Sort by signup date desc
    filtered.sort((a, b) => new Date(b.metadata.creationTime) - new Date(a.metadata.creationTime));

    const PAGE_SIZE = 20;
    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Fetch subscriptions for paginated users
    const users = await Promise.all(
      paginated.map(async (u) => {
        let subs = {};
        try {
          const subsSnap = await db.collection("users").doc(u.uid).collection("subscriptions").get();
          const now = Date.now();
          subsSnap.forEach((doc) => {
            const data = doc.data();
            let status = data.status;
            if (status === "trial" && data.trialEnd && now > data.trialEnd) status = "expired";
            subs[doc.id] = { status, amount: data.amount || 0, activatedAt: data.activatedAt };
          });
        } catch {}
        return {
          uid: u.uid,
          email: u.email || "-",
          displayName: u.displayName || "",
          createdAt: u.metadata.creationTime,
          lastLogin: u.metadata.lastSignInTime,
          provider: u.providerData?.[0]?.providerId || "unknown",
          disabled: u.disabled,
          subs,
        };
      })
    );

    return NextResponse.json({ users, total, page, pageSize: PAGE_SIZE });
  } catch (err) {
    console.error("[admin/users]", err.message);
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}
