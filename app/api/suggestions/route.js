import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];

async function getAdminApp() {
  const m = await import("@/lib/firebase-admin");
  const app = m.default();
  if (!app) throw new Error("Firebase Admin not configured");
  return app;
}

async function checkAdmin(email, adminApp) {
  if (OWNER_EMAILS.includes(email?.toLowerCase())) return true;
  const snap = await adminApp.firestore().doc("config/admins").get();
  const emails = snap.exists ? (snap.data().emails || []) : [];
  return emails.includes(email?.toLowerCase());
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken, action } = body;
    if (!idToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminApp = await getAdminApp();
    const decoded = await adminApp.auth().verifyIdToken(idToken);
    const db = adminApp.firestore();

    if (action === "list") {
      const isAdmin = await checkAdmin(decoded.email, adminApp);
      if (!isAdmin) return NextResponse.json({ error: "Admin only" }, { status: 403 });
      const snap = await db.collection("suggestions").orderBy("createdAt", "desc").limit(200).get();
      const suggestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ suggestions });
    }

    const { type, title, description, relatedTool } = body;
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    await db.collection("suggestions").add({
      userId: decoded.uid,
      userEmail: decoded.email,
      type: type || "feature",
      title: title.trim(),
      description: description.trim(),
      relatedTool: type === "feature" ? (relatedTool || null) : null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
