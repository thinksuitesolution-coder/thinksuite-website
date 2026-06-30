import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];
const CONFIG_DOC = "config/admins";

async function getAdminApp() {
  const adminModule = await import("@/lib/firebase-admin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  return adminApp;
}

async function verifyOwner(idToken) {
  const adminApp = await getAdminApp();
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  if (!OWNER_EMAILS.includes(decoded.email?.toLowerCase())) throw new Error("Unauthorized");
  return { adminApp, email: decoded.email.toLowerCase() };
}

async function verifyAdmin(idToken) {
  const adminApp = await getAdminApp();
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (OWNER_EMAILS.includes(email)) return { adminApp, email };
  const snap = await adminApp.firestore().doc(CONFIG_DOC).get();
  const emails = snap.exists ? (snap.data().emails || []) : [];
  if (!emails.includes(email)) throw new Error("Unauthorized");
  return { adminApp, email };
}

export async function POST(req) {
  try {
    const { idToken, action, email } = await req.json();
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    /* ── Check if caller is admin (any admin, not just owner) ── */
    if (action === "check") {
      try {
        await verifyAdmin(idToken);
        return NextResponse.json({ isAdmin: true });
      } catch {
        return NextResponse.json({ isAdmin: false });
      }
    }

    const { adminApp } = await verifyOwner(idToken);
    const db = adminApp.firestore();
    const docRef = db.doc(CONFIG_DOC);

    /* ── Get admins list ── */
    if (!action || action === "list") {
      const snap = await docRef.get();
      const firestoreEmails = snap.exists ? (snap.data().emails || []) : [];
      return NextResponse.json({ emails: [...new Set([...OWNER_EMAILS, ...firestoreEmails])] });
    }

    /* ── Add admin ── */
    if (action === "add") {
      if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
      const normalized = email.toLowerCase().trim();
      const snap = await docRef.get();
      const existing = snap.exists ? (snap.data().emails || []) : [];
      if (!existing.includes(normalized)) {
        await docRef.set({ emails: [...existing, normalized] }, { merge: true });
      }
      return NextResponse.json({ success: true });
    }

    /* ── Remove admin ── */
    if (action === "remove") {
      if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
      const normalized = email.toLowerCase().trim();
      if (OWNER_EMAILS.includes(normalized)) {
        return NextResponse.json({ error: "Core owner email cannot be removed" }, { status: 400 });
      }
      const snap = await docRef.get();
      const existing = snap.exists ? (snap.data().emails || []) : [];
      await docRef.set({ emails: existing.filter(e => e !== normalized) }, { merge: true });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[admin/admins]", err.message);
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}
