import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { launchBolnaCall } from "@/lib/bolna";
import { deductCallCredits } from "@/lib/aiCallingCredits";

export const maxDuration = 60;

const CALL_GAP_MS = 4000; // 4s between calls avoids TRAI spam detection

export async function POST(req) {
  try {
    const { userId, campaignId } = await req.json();
    if (!userId || !campaignId) return NextResponse.json({ error: "userId and campaignId required" }, { status: 400 });

    const db  = getAdminDb();
    const ref = db.collection("aiCallingCampaigns").doc(campaignId);
    const snap = await ref.get();

    if (!snap.exists) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    const campaign = snap.data();
    if (campaign.userId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    if (campaign.status === "running") return NextResponse.json({ error: "Campaign already running" }, { status: 409 });

    const pendingLeads = campaign.leads.filter(l => l.callStatus === "pending");
    if (pendingLeads.length === 0) return NextResponse.json({ error: "No pending leads" }, { status: 400 });

    // Deduct credits upfront
    const deducted = await deductCallCredits(userId, pendingLeads.length);
    if (!deducted) {
      return NextResponse.json({ error: "Insufficient credits", code: "INSUFFICIENT_CREDITS" }, { status: 402 });
    }

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/ai-calling/webhook?secret=${process.env.AI_CALLING_WEBHOOK_SECRET || "ts_webhook_2026"}`;

    await ref.update({ status: "running", launchedAt: new Date() });

    // Fire-and-forget: launch calls in background
    launchCallsAsync({
      campaignRef: ref,
      campaign,
      pendingLeads,
      webhookUrl,
    });

    return NextResponse.json({
      ok:       true,
      launching: pendingLeads.length,
      message:  `${pendingLeads.length} AI calls launching now. Results will appear automatically.`,
    });
  } catch (err) {
    console.error("[launch-campaign]", err);
    return NextResponse.json({ error: err.message || "Failed to launch campaign" }, { status: 500 });
  }
}

async function launchCallsAsync({ campaignRef, campaign, pendingLeads, webhookUrl }) {
  let allLeads = [...campaign.leads];
  let completedCount = allLeads.filter(l => l.callStatus === "completed" || l.callStatus === "failed").length;

  for (let i = 0; i < pendingLeads.length; i++) {
    const lead = pendingLeads[i];
    try {
      const callRes = await launchBolnaCall({
        phoneNumber:     lead.phone,
        leadData:        { name: lead.name, category: lead.category },
        goal:            campaign.goal,
        language:        campaign.language,
        businessContext: campaign.businessContext,
        webhookUrl,
      });

      const callId = callRes.id || callRes.call_id || null;

      allLeads = allLeads.map(l =>
        l.phone === lead.phone
          ? { ...l, callId, callStatus: "calling", calledAt: new Date() }
          : l
      );

      // Index callId → campaignId for fast webhook lookup
      if (callId) {
        const db = campaignRef.firestore;
        await db.collection("aiCallingCallIndex").doc(callId).set({
          campaignId: campaignRef.id,
          phone:      lead.phone,
          createdAt:  new Date(),
        });
      }
    } catch (err) {
      console.error(`[launch] Call to ${lead.phone} failed:`, err.message);
      completedCount++;
      allLeads = allLeads.map(l =>
        l.phone === lead.phone
          ? { ...l, callStatus: "failed", outcome: "CALL_ERROR", calledAt: new Date() }
          : l
      );
    }

    await campaignRef.update({ leads: allLeads, completedCalls: completedCount });

    if (i < pendingLeads.length - 1) {
      await new Promise(r => setTimeout(r, CALL_GAP_MS));
    }
  }

  // If all failed immediately (no webhook expected), mark done
  const stillCalling = allLeads.filter(l => l.callStatus === "calling").length;
  if (stillCalling === 0) {
    const success = allLeads.filter(l => l.outcome === "INTERESTED" || l.outcome === "CALLBACK_LATER").length;
    await campaignRef.update({ status: "completed", completedAt: new Date(), successCalls: success });
  }
}
