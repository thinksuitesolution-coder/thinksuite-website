import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const maxDuration = 300;

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];

async function getAdminApp() {
  const adminModule = await import("@/lib/firebase-admin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  return adminApp;
}

async function verifyAdmin(idToken) {
  const adminApp = await getAdminApp();
  const decoded  = await adminApp.auth().verifyIdToken(idToken);
  const email    = decoded.email?.toLowerCase();
  if (OWNER_EMAILS.includes(email)) return email;
  const snap   = await adminApp.firestore().doc("config/admins").get();
  const emails = snap.exists ? (snap.data().emails || []) : [];
  if (!emails.includes(email)) throw new Error("Unauthorized");
  return email;
}

/* ── GET: DB stats (no auth needed  admin page calls this) ──────────── */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idToken = searchParams.get("idToken");

  try {
    if (idToken) await verifyAdmin(idToken);

    const db = getAdminDb();

    /* Count India tenders by status */
    const indiaSnap = await db.collection("tenders_india").get();
    const intlSnap  = await db.collection("tenders_international").get();

    const indiaByStatus  = {};
    const indiaByPortal  = {};
    let   indiaExpired   = 0;

    for (const doc of indiaSnap.docs) {
      const d = doc.data();
      indiaByStatus[d.status || "unknown"] = (indiaByStatus[d.status || "unknown"] || 0) + 1;
      indiaByPortal[d.source_portal || "unknown"] = (indiaByPortal[d.source_portal || "unknown"] || 0) + 1;
      if (d.status === "expired") indiaExpired++;
    }

    const intlByStatus = {};
    const intlByPortal = {};
    let   intlExpired  = 0;

    for (const doc of intlSnap.docs) {
      const d = doc.data();
      intlByStatus[d.status || "unknown"] = (intlByStatus[d.status || "unknown"] || 0) + 1;
      intlByPortal[d.source_portal || "unknown"] = (intlByPortal[d.source_portal || "unknown"] || 0) + 1;
      if (d.status === "expired") intlExpired++;
    }

    /* Last scraped_at across all tenders */
    const allDocs = [...indiaSnap.docs, ...intlSnap.docs];
    const lastScraped = allDocs.reduce((latest, doc) => {
      const ts = doc.data().scraped_at?.toDate?.();
      return ts && (!latest || ts > latest) ? ts : latest;
    }, null);

    return NextResponse.json({
      success: true,
      india: {
        total:    indiaSnap.size,
        expired:  indiaExpired,
        active:   indiaSnap.size - indiaExpired,
        byStatus: indiaByStatus,
        byPortal: indiaByPortal,
      },
      international: {
        total:    intlSnap.size,
        expired:  intlExpired,
        active:   intlSnap.size - intlExpired,
        byStatus: intlByStatus,
        byPortal: intlByPortal,
      },
      lastScraped: lastScraped?.toISOString() || null,
    });
  } catch (err) {
    console.error("[tender-management GET]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── POST: trigger fetch or clean expired ────────────────────────────── */
export async function POST(request) {
  try {
    const { idToken, action, portal, type } = await request.json();
    if (!idToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await verifyAdmin(idToken);

    /* ── action: clean_expired ─────────────────────────────────────────── */
    if (action === "clean_expired") {
      const db    = getAdminDb();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let deleted = 0;
      for (const col of ["tenders_india", "tenders_international"]) {
        const snap = await db.collection(col)
          .where("deadline_timestamp", "<", today)
          .limit(400)
          .get();

        const batch = db.batch();
        snap.docs.forEach(d => { batch.delete(d.ref); deleted++; });
        if (snap.size > 0) await batch.commit();
      }

      return NextResponse.json({ success: true, deleted, message: `${deleted} expired tenders deleted` });
    }

    /* ── action: fetch_tenders ─────────────────────────────────────────── */
    if (action === "fetch_tenders") {
      // Build the scrape URL params
      const params = new URLSearchParams();
      if (portal) params.set("portal", portal);
      if (type)   params.set("type",   type);

      const baseUrl  = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
      const scrapeUrl = `${baseUrl}/api/cron/scrape-tenders?${params.toString()}`;

      /* Trigger in background  don't await since it can take minutes */
      const headers = { "x-cron-secret": process.env.CRON_SECRET || "" };
      fetch(scrapeUrl, { headers }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: `Fetch started for ${portal || type || "all"} portals. Results appear in 1-5 minutes.`,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[tender-management POST]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
