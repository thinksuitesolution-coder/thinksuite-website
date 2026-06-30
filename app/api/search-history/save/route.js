import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifyToken } from "@/lib/saveOutput";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
const MAX_RESULTS  = 50;

export async function POST(req) {
  try {
    const { idToken, toolSlug, toolLabel, query, details, results } = await req.json();

    if (!idToken)  return NextResponse.json({ error: "idToken required" },  { status: 401 });
    if (!toolSlug) return NextResponse.json({ error: "toolSlug required" }, { status: 400 });
    if (!query)    return NextResponse.json({ error: "query required" },    { status: 400 });

    const uid = await verifyToken(idToken);
    const db  = getAdminDb();
    const now = Date.now();

    // Store up to MAX_RESULTS to stay within Firestore 1MB document limit
    const savedResults = Array.isArray(results) ? results.slice(0, MAX_RESULTS) : [];

    await db.collection("searchHistory").add({
      uid,
      toolSlug,
      toolLabel: toolLabel || toolSlug,
      query,
      details:   details || {},
      results:   savedResults,
      createdAt: now,
      expiresAt: now + THIRTY_DAYS,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[search-history/save]", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
