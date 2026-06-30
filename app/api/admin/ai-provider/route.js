import { NextResponse }           from "next/server";
import { getAdminDb }             from "@/lib/firebaseAdmin";
import { invalidateProviderCache } from "@/lib/aiClient";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];

/* ── GET: return current provider ─────────────────────────────────────────── */
export async function GET() {
  try {
    const db  = getAdminDb();
    const doc = await db.collection("config").doc("aiProvider").get();
    const provider = doc.exists ? (doc.data()?.provider || "gemini") : "gemini";
    const updatedAt = doc.exists ? (doc.data()?.updatedAt || null) : null;
    const updatedBy = doc.exists ? (doc.data()?.updatedBy || null) : null;
    return NextResponse.json({ success: true, provider, updatedAt, updatedBy });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* ── POST: update provider ────────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const { provider, userEmail } = await req.json();

    if (!OWNER_EMAILS.includes(userEmail)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    if (!["gemini", "claude"].includes(provider)) {
      return NextResponse.json({ success: false, error: "Invalid provider" }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection("config").doc("aiProvider").set({
      provider,
      updatedAt: new Date().toISOString(),
      updatedBy: userEmail,
    });

    // Clear in-memory cache so next request picks up new value immediately
    invalidateProviderCache();

    return NextResponse.json({ success: true, provider });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
