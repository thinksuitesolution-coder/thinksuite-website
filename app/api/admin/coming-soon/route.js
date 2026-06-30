import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];

async function getAdminApp() {
  const adminModule = await import("@/lib/firebase-admin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  return adminApp;
}

async function verifyAdmin(idToken) {
  const adminApp = await getAdminApp();
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (OWNER_EMAILS.includes(email)) return { adminApp, email };
  const snap = await adminApp.firestore().doc("config/admins").get();
  const emails = snap.exists ? (snap.data().emails || []) : [];
  if (!emails.includes(email)) throw new Error("Unauthorized");
  return { adminApp, email };
}

export async function POST(req) {
  try {
    const { idToken, slugs } = await req.json();
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });
    const { adminApp } = await verifyAdmin(idToken);
    await adminApp.firestore().doc("config/comingSoon").set({ slugs: Array.isArray(slugs) ? slugs : [] });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/coming-soon]", err.message);
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}
