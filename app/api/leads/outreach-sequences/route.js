/**
 * Outreach Sequences Store
 *
 * GET  /api/leads/outreach-sequences          — list saved sequences
 * POST /api/leads/outreach-sequences          — save a sequence
 * DELETE /api/leads/outreach-sequences?id=X   — delete a sequence
 *
 * Firestore: outreachSequences/{userId}/sequences/{seqId}
 * Fields: leadId, leadName, leadEmail, senderProduct, goal, tone,
 *         sequence[], createdAt, status ("draft"|"scheduled"|"sent")
 */

import { NextResponse }              from "next/server";
import { getAdminDb, firebaseAdmin } from "@/lib/firebaseAdmin";

async function getAuthUser(req) {
  const auth  = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  try {
    const { getAuth } = await import("firebase-admin/auth");
    return await getAuth().verifyIdToken(token);
  } catch { return null; }
}

// ── GET: list sequences ───────────────────────────────────────────────────────
export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit  = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
  const cursor = searchParams.get("cursor") || null;

  const db  = getAdminDb();
  let query = db.collection("outreachSequences")
    .doc(user.uid)
    .collection("sequences")
    .orderBy("createdAt", "desc")
    .limit(limit + 1);

  if (cursor) {
    const cursorDoc = await db.collection("outreachSequences")
      .doc(user.uid)
      .collection("sequences")
      .doc(cursor)
      .get();
    if (cursorDoc.exists) query = query.startAfter(cursorDoc);
  }

  const snap      = await query.get();
  const docs      = snap.docs.slice(0, limit);
  const hasMore   = snap.docs.length > limit;
  const nextCursor = hasMore ? docs[docs.length - 1].id : null;

  const sequences = docs.map(d => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ sequences, hasMore, nextCursor });
}

// ── POST: save sequence ───────────────────────────────────────────────────────
export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { leadId, leadName, leadEmail, senderProduct, goal, tone, sequence, leadContext } = body;

  if (!sequence || !Array.isArray(sequence) || sequence.length === 0) {
    return NextResponse.json({ error: "sequence array is required" }, { status: 400 });
  }

  const db    = getAdminDb();
  const colRef = db.collection("outreachSequences").doc(user.uid).collection("sequences");

  const docRef = await colRef.add({
    leadId:        leadId || null,
    leadName:      leadName || "",
    leadEmail:     leadEmail || "",
    senderProduct: senderProduct || "",
    goal:          goal || "meeting",
    tone:          tone || "professional",
    sequence,
    leadContext:   leadContext || [],
    status:        "draft",
    createdAt:     Date.now(),
    updatedAt:     Date.now(),
    userId:        user.uid,
  });

  return NextResponse.json({ id: docRef.id, saved: true });
}

// ── DELETE: remove sequence ───────────────────────────────────────────────────
export async function DELETE(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const db = getAdminDb();
  await db.collection("outreachSequences").doc(user.uid).collection("sequences").doc(id).delete();

  return NextResponse.json({ deleted: true });
}

// ── PATCH: update status ──────────────────────────────────────────────────────
export async function PATCH(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !["draft", "scheduled", "sent", "paused"].includes(status)) {
    return NextResponse.json({ error: "id and valid status required" }, { status: 400 });
  }

  const db = getAdminDb();
  await db.collection("outreachSequences").doc(user.uid).collection("sequences").doc(id)
    .update({ status, updatedAt: Date.now() });

  return NextResponse.json({ updated: true });
}
