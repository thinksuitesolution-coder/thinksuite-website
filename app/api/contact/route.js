import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];

async function verifyAdmin(idToken) {
  const adminModule = await import("@/lib/firebase-admin");
  const adminApp = adminModule.default();
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (!OWNER_EMAILS.includes(email)) {
    const snap = await adminApp.firestore().doc("config/admins").get();
    const emails = snap.exists ? (snap.data().emails || []) : [];
    if (!emails.includes(email)) throw new Error("Unauthorized");
  }
  return adminApp;
}

/* POST /api/contact
   Public: submit contact form  { name, email, phone, message }
   Admin:  list contacts        { idToken, action:"list" }
*/
export async function POST(req) {
  try {
    const body = await req.json();

    // Admin list action
    if (body.action === "list" && body.idToken) {
      const adminApp = await verifyAdmin(body.idToken);
      const snap = await adminApp.firestore()
        .collection("contacts")
        .orderBy("createdAt", "desc")
        .limit(200)
        .get();
      const contacts = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? null }));
      return NextResponse.json({ contacts });
    }

    // Admin delete action
    if (body.action === "delete" && body.idToken && body.id) {
      const adminApp = await verifyAdmin(body.idToken);
      await adminApp.firestore().collection("contacts").doc(body.id).delete();
      return NextResponse.json({ ok: true });
    }

    // Public contact form submission
    const { name, email, phone, message } = body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const adminModule = await import("@/lib/firebase-admin");
    const adminApp = adminModule.default();
    await adminApp.firestore().collection("contacts").add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      message: message.trim(),
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
