import { NextResponse } from "next/server";

async function getAdminApp() {
  const adminModule = await import("@/lib/firebase-admin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  return adminApp;
}

export async function GET() {
  try {
    const adminApp = await getAdminApp();
    const snap = await adminApp.firestore().doc("config/toolOrder").get();
    if (!snap.exists) return NextResponse.json({ toolOrder: null, featureOrders: {} });
    const data = snap.data();
    return NextResponse.json({ toolOrder: data.toolOrder || null, featureOrders: data.featureOrders || {} });
  } catch (e) {
    console.error("[tool-order GET]", e.message);
    return NextResponse.json({ toolOrder: null, featureOrders: {} });
  }
}
