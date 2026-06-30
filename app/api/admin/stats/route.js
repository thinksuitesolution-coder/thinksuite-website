import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];
const CONFIG_DOC = "config/admins";

async function verifyAdmin(idToken) {
  const adminModule = await import("@/lib/firebase-admin");
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

export async function POST(req) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const adminApp = await verifyAdmin(idToken);
    const db = adminApp.firestore();

    /* ── 1. List all auth users ── */
    let allUsers = [];
    let pageToken;
    do {
      const result = await adminApp.auth().listUsers(1000, pageToken);
      allUsers = allUsers.concat(result.users);
      pageToken = result.pageToken;
    } while (pageToken);

    const totalUsers = allUsers.length;
    const now = Date.now();

    /* ── 2. Count signups per day (last 30 days) ── */
    const signupsByDay = {};
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    allUsers.forEach((u) => {
      const ts = new Date(u.metadata.creationTime).getTime();
      if (ts >= thirtyDaysAgo) {
        const day = new Date(ts).toISOString().slice(0, 10);
        signupsByDay[day] = (signupsByDay[day] || 0) + 1;
      }
    });

    /* ── 3. Aggregate subscription stats from Firestore ── */
    const usersSnap = await db.collection("users").listDocuments();

    let totalTrials = 0;
    let totalActive = 0;
    let totalExpired = 0;
    let totalRevenue = 0;
    const toolStats = {};

    await Promise.all(
      usersSnap.map(async (userRef) => {
        const subsSnap = await userRef.collection("subscriptions").get();
        subsSnap.forEach((doc) => {
          const data = doc.data();
          const slug = doc.id;
          const status = data.status;
          const amount = data.amount || 0;

          if (!toolStats[slug]) toolStats[slug] = { trial: 0, active: 0, expired: 0, revenue: 0 };

          if (status === "trial") {
            if (data.trialEnd && now > data.trialEnd) {
              totalExpired++;
              toolStats[slug].expired++;
            } else {
              totalTrials++;
              toolStats[slug].trial++;
              totalRevenue += amount;
              toolStats[slug].revenue += amount;
            }
          } else if (status === "active") {
            totalActive++;
            toolStats[slug].active++;
            totalRevenue += amount;
            toolStats[slug].revenue += amount;
          } else if (status === "expired") {
            totalExpired++;
            toolStats[slug].expired++;
          }
        });
      })
    );

    /* ── 4. Recent signups (last 10) ── */
    const recentUsers = allUsers
      .sort((a, b) => new Date(b.metadata.creationTime) - new Date(a.metadata.creationTime))
      .slice(0, 10)
      .map((u) => ({
        uid: u.uid,
        email: u.email || "-",
        displayName: u.displayName || "",
        createdAt: u.metadata.creationTime,
        provider: u.providerData?.[0]?.providerId || "unknown",
      }));

    return NextResponse.json({
      totalUsers,
      totalTrials,
      totalActive,
      totalExpired,
      totalRevenue,
      toolStats,
      signupsByDay,
      recentUsers,
    });
  } catch (err) {
    console.error("[admin/stats]", err.message);
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}
