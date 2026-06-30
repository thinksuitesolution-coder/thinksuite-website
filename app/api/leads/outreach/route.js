/**
 * Email Outreach Sequence Generator
 * POST /api/leads/outreach
 *
 * Generates a multi-step email outreach sequence for a lead.
 * Uses Gemini to personalize based on lead data (industry, tech stack,
 * intent signals, GST status, fresh incorporation, etc.)
 *
 * Body: {
 *   lead: { businessName, industry, city, state, email, techStack[], intentSignals[], enterpriseType, incorporationDate }
 *   senderName: string
 *   senderCompany: string
 *   senderProduct: string   — what you're selling
 *   goal: "meeting" | "demo" | "trial" | "reply"
 *   tone: "professional" | "casual" | "friendly"
 *   steps?: number          — 1-5, default 3
 * }
 *
 * Returns: { sequence: [{ step, subject, body, sendDay, purpose }] }
 */

import { NextResponse } from "next/server";
import { getAIClient }  from "@/lib/aiClient";

export const maxDuration = 60;

async function getAuthUser(req) {
  const auth  = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  try {
    const { getAuth } = await import("firebase-admin/auth");
    return await getAuth().verifyIdToken(token);
  } catch { return null; }
}

const SEND_SCHEDULE = {
  1: { day: 0,  purpose: "Initial outreach" },
  2: { day: 3,  purpose: "Follow-up — value add" },
  3: { day: 7,  purpose: "Social proof + urgency" },
  4: { day: 14, purpose: "Last attempt + easy out" },
  5: { day: 21, purpose: "Break-up / reactivation" },
};

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    lead,
    senderName,
    senderCompany,
    senderProduct,
    goal    = "meeting",
    tone    = "professional",
    steps   = 3,
  } = await req.json();

  if (!lead?.businessName || !senderProduct) {
    return NextResponse.json({ error: "lead.businessName and senderProduct required" }, { status: 400 });
  }

  const numSteps = Math.min(5, Math.max(1, steps));

  // Build lead context for personalization
  const leadContext = buildLeadContext(lead);

  const prompt = buildPrompt({
    lead,
    leadContext,
    senderName,
    senderCompany,
    senderProduct,
    goal,
    tone,
    numSteps,
  });

  try {
    const ai       = getAIClient();
    const response = await ai.chat.completions.create({
      model:       "gemini-2.5-flash",
      max_tokens:  5000,
      temperature: 0.7,
      messages: [
        {
          role:    "system",
          content: "You are an expert B2B outreach specialist for Indian SMEs. You write multi-channel outreach (email, WhatsApp, LinkedIn) that feels personal. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw  = response.choices[0]?.message?.content || "";
    const parsed = parseResponse(raw, numSteps, lead);

    return NextResponse.json({
      sequence:  parsed.sequence,
      whatsapp:  parsed.whatsapp,
      linkedin:  parsed.linkedin,
      leadContext,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function buildLeadContext(lead) {
  const ctx = [];

  if (lead.enterpriseType) ctx.push(`${lead.enterpriseType} enterprise`);
  if (lead.majorActivity)  ctx.push(`${lead.majorActivity} sector`);
  if (lead.industry)       ctx.push(`${lead.industry} industry`);
  if (lead.city || lead.state) ctx.push(`based in ${[lead.city, lead.state].filter(Boolean).join(", ")}`);
  if (lead.incorporationDate) {
    const yearStr = String(lead.incorporationDate).match(/\d{4}/)?.[0];
    if (yearStr) {
      const age = new Date().getFullYear() - parseInt(yearStr);
      if (age <= 1) ctx.push("newly incorporated (under 1 year old)");
      else if (age <= 3) ctx.push(`${age}-year-old company`);
    }
  }
  if (lead.techStack?.length > 0) ctx.push(`uses ${lead.techStack.slice(0, 3).join(", ")}`);
  if (lead.intentSignals?.length > 0) {
    const signals = lead.intentSignals.slice(0, 2);
    if (signals.includes("hiring_marketing")) ctx.push("actively hiring marketing staff");
    if (signals.includes("hiring_tech"))      ctx.push("hiring tech talent");
    if (signals.includes("funded"))           ctx.push("recently funded");
    if (signals.includes("expanding"))        ctx.push("expanding to new locations");
    if (signals.includes("ecommerce_launch")) ctx.push("launching ecommerce");
    if (signals.includes("new_incorporation")) ctx.push("brand new business");
  }
  if (lead.udyamNo) ctx.push("MSME registered business");
  if (lead.cin)     ctx.push("registered with MCA");

  return ctx;
}

function buildPrompt({ lead, leadContext, senderName, senderCompany, senderProduct, goal, tone, numSteps }) {
  const scheduleStr = Array.from({ length: numSteps }, (_, i) => {
    const s = SEND_SCHEDULE[i + 1];
    return `Step ${i + 1}: Day ${s.day} — ${s.purpose}`;
  }).join("\n");

  return `Generate a ${numSteps}-step cold email outreach sequence.

PROSPECT:
- Company: ${lead.businessName}
- Context: ${leadContext.join(", ") || "Indian SME"}
- Location: ${[lead.city, lead.state].filter(Boolean).join(", ") || "India"}
- Industry: ${lead.industry || "Business"}

SENDER:
- Name: ${senderName || "Sales Team"}
- Company: ${senderCompany || ""}
- Product/Service: ${senderProduct}

GOAL: ${goal === "meeting" ? "Book a 15-minute call" : goal === "demo" ? "Schedule a product demo" : goal === "trial" ? "Get them to start a free trial" : "Get a reply"}
TONE: ${tone}
LANGUAGE: English (use simple, clear language — Indian business owners prefer direct communication)

SCHEDULE:
${scheduleStr}

RULES:
1. Each email must reference something specific about the prospect (their industry, location, company stage, or context clues above)
2. Subject lines must be under 50 characters — curiosity or benefit driven
3. Body must be under 150 words — no fluff
4. Never mention "I noticed on LinkedIn" or generic openers
5. Step 4+ should acknowledge previous emails weren't seen
6. Include ONE clear CTA per email
7. For Indian businesses: reference local context when possible (GST, MCA compliance, Indian payment gateways, etc.) only if naturally relevant

Return ONLY valid JSON in this exact format:
{
  "sequence": [
    {
      "step": 1,
      "subject": "...",
      "body": "...",
      "sendDay": 0,
      "purpose": "..."
    }
  ],
  "whatsapp": {
    "initial": "First WhatsApp message — casual, 70-90 words, no marketing jargon, feel like a real person",
    "followup": "Follow-up if no reply after 3 days — 35-50 words, gentle reminder"
  },
  "linkedin": {
    "connection": "LinkedIn connection request note — MUST be under 200 characters, personal, no pitch",
    "dm": "First LinkedIn DM after connecting — 80-100 words, value-first, soft CTA"
  }
}`;
}

function parseResponse(raw, numSteps, lead) {
  const fallbackSeq = Array.from({ length: numSteps }, (_, i) => ({
    step:    i + 1,
    subject: i === 0 ? `Quick question for ${lead.businessName}` : "Following up",
    body:    "Unable to generate email. Please try again.",
    sendDay: SEND_SCHEDULE[i + 1]?.day ?? i * 3,
    purpose: SEND_SCHEDULE[i + 1]?.purpose ?? "",
  }));

  try {
    const clean  = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(clean);

    const sequence = parsed.sequence && Array.isArray(parsed.sequence)
      ? parsed.sequence.map((s, i) => ({
          step:    s.step    || i + 1,
          subject: s.subject || `Following up — ${lead.businessName}`,
          body:    s.body    || "",
          sendDay: s.sendDay ?? SEND_SCHEDULE[i + 1]?.day ?? i * 3,
          purpose: s.purpose || SEND_SCHEDULE[i + 1]?.purpose || "",
        }))
      : fallbackSeq;

    return {
      sequence,
      whatsapp: parsed.whatsapp || null,
      linkedin: parsed.linkedin || null,
    };
  } catch {
    return { sequence: fallbackSeq, whatsapp: null, linkedin: null };
  }
}
