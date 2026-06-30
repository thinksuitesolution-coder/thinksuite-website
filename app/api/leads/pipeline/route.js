/**
 * Pipeline CRM API
 * GET    /api/leads/pipeline         — list all pipeline leads
 * POST   /api/leads/pipeline         — add lead to pipeline
 * PATCH  /api/leads/pipeline         — update stage / notes / follow-up / step
 * DELETE /api/leads/pipeline?id=X    — remove lead from pipeline
 *
 * Firestore: pipeline/{userId}/leads/{docId}
 */

import { NextResponse } from "next/server";
import { getAdminDb }   from "@/lib/firebaseAdmin";

const VALID_STAGES = ["new", "contacted", "replied", "meeting", "won", "lost"];

async function getAuthUser(req) {
  const auth  = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  try {
    const { getAuth } = await import("firebase-admin/auth");
    return await getAuth().verifyIdToken(token);
  } catch { return null; }
}

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") || null;

  const db = getAdminDb();
  let q = db.collection("pipeline").doc(user.uid).collection("leads")
    .orderBy("updatedAt", "desc");

  if (stage && VALID_STAGES.includes(stage)) q = q.where("stage", "==", stage);

  const snap  = await q.get();
  const leads = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ leads });
}

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    leadData,
    stage        = "new",
    notes        = "",
    nextFollowUp = null,
    savedLeadId  = null,
    source       = "manual",
  } = body;

  const leadName = leadData?.businessName || leadData?.name || "";
  if (!leadName) return NextResponse.json({ error: "leadData.businessName required" }, { status: 400 });

  const db     = getAdminDb();
  const colRef = db.collection("pipeline").doc(user.uid).collection("leads");

  // Deduplicate by email
  const leadEmail = leadData.email || "";
  if (leadEmail) {
    const dup = await colRef.where("leadEmail", "==", leadEmail).limit(1).get();
    if (!dup.empty) {
      return NextResponse.json(
        { error: "Lead already in pipeline", id: dup.docs[0].id, duplicate: true },
        { status: 409 }
      );
    }
  }

  const now    = Date.now();
  const docRef = await colRef.add({
    stage,
    leadName,
    leadEmail,
    leadPhone:    leadData.phone    || "",
    leadWebsite:  leadData.website  || "",
    leadIndustry: leadData.industry || "",
    leadCity:     leadData.city || leadData.state || "",
    leadData,
    notes,
    nextFollowUp,
    savedLeadId,
    source,
    sequenceIds:         [],
    currentSequenceStep: 0,
    lastContactedAt:     null,
    userId:    user.uid,
    addedAt:   now,
    updatedAt: now,
    movedAt:   now,
  });

  return NextResponse.json({ id: docRef.id, added: true });
}

export async function PATCH(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    id, stage, notes, nextFollowUp,
    currentSequenceStep, lastContactedAt, sequenceIds,
  } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const update = { updatedAt: Date.now() };
  if (stage !== undefined) {
    if (!VALID_STAGES.includes(stage)) return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    update.stage   = stage;
    update.movedAt = Date.now();
  }
  if (notes               !== undefined) update.notes               = notes;
  if (nextFollowUp        !== undefined) update.nextFollowUp        = nextFollowUp;
  if (currentSequenceStep !== undefined) update.currentSequenceStep = currentSequenceStep;
  if (lastContactedAt     !== undefined) update.lastContactedAt     = lastContactedAt;
  if (sequenceIds         !== undefined) update.sequenceIds         = sequenceIds;

  const db = getAdminDb();
  await db.collection("pipeline").doc(user.uid).collection("leads").doc(id).update(update);
  return NextResponse.json({ updated: true });
}

export async function DELETE(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = getAdminDb();
  await db.collection("pipeline").doc(user.uid).collection("leads").doc(id).delete();
  return NextResponse.json({ deleted: true });
}
