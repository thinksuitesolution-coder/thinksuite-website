import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

/* Vapi sends POST with JSON body. We verify via secret query param. */
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    if (secret !== (process.env.AI_CALLING_WEBHOOK_SECRET || "ts_webhook_2026")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    /* ── Vapi wraps events in body.message ── */
    const msg  = body.message || body;
    const type = msg.type || body.type;

    // Only process end-of-call reports
    if (type !== "end-of-call-report") {
      return NextResponse.json({ ok: true });
    }

    const call     = msg.call || {};
    const callId   = call.id || msg.id;
    if (!callId) return NextResponse.json({ ok: true });

    const durationSeconds = msg.durationSeconds || call.endedAt
      ? Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000)
      : 0;

    const transcript   = msg.messages || msg.transcript || null;
    const summary      = msg.analysis?.summary || msg.summary || "";
    const successEval  = msg.analysis?.successEvaluation;
    const recordingUrl = msg.recordingUrl || call.recordingUrl || null;

    const outcome = deriveOutcome(summary, transcript, successEval);
    const score   = deriveScore(outcome, successEval);

    const db = getAdminDb();

    // Fast path: look up campaign via index
    const idxSnap = await db.collection("aiCallingCallIndex").doc(callId).get();

    if (idxSnap.exists) {
      const { campaignId, phone } = idxSnap.data();
      await updateCampaignCall(db, campaignId, phone, {
        duration: durationSeconds, transcript, summary, recordingUrl, outcome, score,
      });
    } else {
      // Fallback: scan recent campaigns
      await scanAndUpdate(db, callId, {
        duration: durationSeconds, transcript, summary, recordingUrl, outcome, score,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/ai-calling]", err);
    return NextResponse.json({ ok: true }); // always 200 to Vapi
  }
}

async function updateCampaignCall(db, campaignId, phone, data) {
  const ref  = db.collection("aiCallingCampaigns").doc(campaignId);
  const snap = await ref.get();
  if (!snap.exists) return;

  const campaign = snap.data();
  const updatedLeads = campaign.leads.map(l =>
    l.phone !== phone ? l : {
      ...l,
      callStatus:   "completed",
      outcome:      data.outcome,
      score:        data.score,
      duration:     data.duration,
      transcript:   data.transcript,
      summary:      data.summary,
      recordingUrl: data.recordingUrl,
      completedAt:  new Date(),
    }
  );

  const completed = updatedLeads.filter(l => l.callStatus === "completed" || l.callStatus === "failed").length;
  const success   = updatedLeads.filter(l => l.outcome === "INTERESTED" || l.outcome === "CALLBACK_LATER").length;
  const allDone   = completed >= (campaign.totalLeads || updatedLeads.length);

  await ref.update({
    leads:          updatedLeads,
    completedCalls: completed,
    successCalls:   success,
    ...(allDone ? { status: "completed", completedAt: new Date() } : {}),
  });
}

async function scanAndUpdate(db, callId, data) {
  const snap = await db.collection("aiCallingCampaigns")
    .where("status", "in", ["running", "ready"])
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();

  for (const doc of snap.docs) {
    const lead = doc.data().leads?.find(l => l.callId === callId);
    if (lead) {
      await updateCampaignCall(db, doc.id, lead.phone, data);
      return;
    }
  }
}

/* ── Outcome extraction from Vapi analysis ─────────────────────────────── */
function deriveOutcome(summary = "", transcript, successEval) {
  const text = (summary + " " + JSON.stringify(transcript || "")).toLowerCase();

  // Vapi's successEvaluation is "1" (100%) for success
  if (successEval && Number(successEval) >= 70) return "INTERESTED";

  if (text.includes("interested") || text.includes("want to know more") || text.includes("intrested")) return "INTERESTED";
  if (text.includes("callback") || text.includes("call back") || text.includes("call later")) return "CALLBACK_LATER";
  if (text.includes("not interested") || text.includes("no thank") || text.includes("don't need") || text.includes("not needed")) return "NOT_INTERESTED";
  if (text.includes("voicemail") || text.includes("mailbox") || text.includes("leave a message")) return "VOICEMAIL";
  if (text.includes("no answer") || text.includes("did not pick") || text.includes("not picked up")) return "NO_ANSWER";
  if (summary.length > 10) return "COMPLETED";
  return "NO_ANSWER";
}

function deriveScore(outcome, successEval) {
  if (successEval) {
    const pct = Number(successEval);
    if (!isNaN(pct)) return Math.round(pct / 10);
  }
  return { INTERESTED: 9, CALLBACK_LATER: 7, COMPLETED: 5, NOT_INTERESTED: 2, VOICEMAIL: 1, NO_ANSWER: 0 }[outcome] ?? 3;
}
