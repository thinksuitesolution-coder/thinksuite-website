import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getCallCredits } from "@/lib/aiCallingCredits";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const {
      userId, name, goal, language = "english",
      businessContext = "", leads = [],
    } = await req.json();

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    if (!goal?.trim()) return NextResponse.json({ error: "Campaign goal required" }, { status: 400 });

    const phonedLeads = leads.filter(l => l.phone);
    if (phonedLeads.length === 0) return NextResponse.json({ error: "No leads with phone numbers" }, { status: 400 });

    // Check credits
    const { credits } = await getCallCredits(userId);
    if (credits < phonedLeads.length) {
      return NextResponse.json({
        error: `Insufficient credits. Need ${phonedLeads.length}, have ${credits}.`,
        creditsNeeded:    phonedLeads.length,
        creditsAvailable: credits,
        code: "INSUFFICIENT_CREDITS",
      }, { status: 402 });
    }

    // Build campaign no external agent creation needed with Vapi (inline per call)
    const campaignData = {
      userId,
      name:            name?.trim() || `AI Call Campaign ${new Date().toLocaleDateString("en-IN")}`,
      goal:            goal.trim(),
      language,
      businessContext: businessContext.trim(),
      agentId:         "vapi_inline",
      status:          "ready",
      totalLeads:      phonedLeads.length,
      completedCalls:  0,
      successCalls:    0,
      createdAt:       new Date(),
      leads: phonedLeads.map(l => ({
        phone:       l.phone,
        name:        l.business_name || l.name || "",
        address:     l.address || "",
        category:    l.category || "",
        callId:      null,
        callStatus:  "pending",
        outcome:     null,
        score:       null,
        transcript:  null,
        summary:     null,
        duration:    null,
        calledAt:    null,
      })),
    };

    const db  = getAdminDb();
    const ref = await db.collection("aiCallingCampaigns").add(campaignData);

    return NextResponse.json({ campaignId: ref.id, totalLeads: phonedLeads.length });
  } catch (err) {
    console.error("[create-campaign]", err);
    return NextResponse.json({ error: err.message || "Failed to create campaign" }, { status: 500 });
  }
}
