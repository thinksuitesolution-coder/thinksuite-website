import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";
import getAdmin from "@/lib/firebaseAdmin";

const client = getAIClient();

const ENRICH_PROMPT = (lead) => `You are a B2B sales intelligence AI. Analyze this business lead and return enrichment data.

LEAD DATA:
Business: ${lead.businessName || lead.name || "Unknown"}
Type/Niche: ${lead.industry || lead.niche || "Unknown"}
Location: ${[lead.city, lead.state, lead.country].filter(Boolean).join(", ") || "Unknown"}
Website: ${lead.website || "None"}
Tech Stack: ${lead.techStack?.join(", ") || "Unknown"}
Rating: ${lead.rating || "Unknown"} (${lead.reviewCount || 0} reviews)
Has Email: ${lead.email ? "Yes " + lead.email : "No"}
Has Phone: ${lead.phone ? "Yes" : "No"}
Has WhatsApp: ${lead.whatsapp ? "Yes" : "No"}
Email Verified: ${lead.emailValid ? "Yes" : "No/Unknown"}
Website Active: ${lead.websiteActive ? "Yes" : "No/Unknown"}
Social Links: ${JSON.stringify(lead.socialLinks || {})}
Source: ${lead.source || "Unknown"}

Respond ONLY with valid JSON (no markdown, no explanation, no code fences):
{
  "leadScore": <number 1-10>,
  "industry": "<specific industry category>",
  "companySize": "<1-10 | 11-50 | 51-200 | 200+>",
  "summary": "<2 sentence opportunity summary in English>",
  "summaryHindi": "<same summary in simple, plain English>",
  "painPoints": ["<pain point 1>", "<pain point 2>", "<pain point 3>"],
  "bestChannel": "<email | whatsapp | linkedin | call>",
  "bestTime": "<morning | afternoon | evening>",
  "outreachEmail": "<personalized cold email Subject: ... Body: 3 lines max>",
  "outreachWhatsapp": "<personalized WhatsApp message, under 90 words, casual tone>",
  "outreachLinkedin": "<professional LinkedIn connection request note, under 60 words>",
  "tags": ["<tag1>", "<tag2>", "<tag3>"],
  "opportunityType": "<digital marketing | website redesign | social media | SEO | ads | CRM | automation | other>",
  "urgency": "<low | medium | high>",
  "notes": "<one actionable note for the sales rep>"
}`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { lead, leadId, idToken } = body;

    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });
    if (!lead) return NextResponse.json({ error: "lead data required" }, { status: 400 });

    const adminApp = await getAdmin();
    const decoded = await adminApp.auth().verifyIdToken(idToken);
    const userId = decoded.uid;
    const db = adminApp.firestore();

    let docRef = null;
    if (leadId) {
      docRef = db.collection("leads").doc(leadId);
      const snap = await docRef.get();
      if (!snap.exists || snap.data().userId !== userId) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: ENRICH_PROMPT(lead) }],
    });

    const raw = message.content[0]?.text?.trim() || "";

    // Strip markdown fences if any
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

    let enrichment;
    try {
      enrichment = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Claude returned invalid JSON", raw }, { status: 500 });
    }

    // Persist to Firestore if leadId provided
    if (docRef) {
      try {
        await docRef.update({
          aiLeadScore: enrichment.leadScore,
          industry: enrichment.industry,
          companySize: enrichment.companySize,
          aiSummary: enrichment.summary,
          aiSummaryHindi: enrichment.summaryHindi,
          aiPainPoints: enrichment.painPoints,
          aiBestChannel: enrichment.bestChannel,
          aiBestTime: enrichment.bestTime,
          aiOutreachEmail: enrichment.outreachEmail,
          aiOutreachWhatsapp: enrichment.outreachWhatsapp,
          aiOutreachLinkedin: enrichment.outreachLinkedin,
          tags: enrichment.tags,
          opportunityType: enrichment.opportunityType,
          urgency: enrichment.urgency,
          aiNotes: enrichment.notes,
          status: "enriched",
          enrichedAt: new Date().toISOString(),
        });
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ enrichment });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
