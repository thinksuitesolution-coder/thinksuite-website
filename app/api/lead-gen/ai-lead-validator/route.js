import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";

export const maxDuration = 60;

const client = getAIClient();

/* ─── Structural validators ──────────────────────────────────────────────────*/
const DUMMY_EMAILS = new Set([
  "test@test.com","info@example.com","admin@example.com","user@user.com",
  "sample@sample.com","dummy@dummy.com","placeholder@placeholder.com",
  "noreply@noreply.com","no-reply@no-reply.com","hello@example.com",
  "contact@example.com","email@email.com","mail@mail.com",
]);

function isValidEmail(email = "") {
  if (!email || email === "N/A") return false;
  if (DUMMY_EMAILS.has(email.toLowerCase())) return false;
  return /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/.test(email);
}

function isValidPhone(phone = "") {
  if (!phone || phone === "N/A") return false;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  // Reject obviously fake patterns
  if (/^0{7,}$/.test(digits) || /^1{7,}$/.test(digits) || /^1234567/.test(digits)) return false;
  return true;
}

function isValidUrl(url = "") {
  if (!url || url === "N/A") return false;
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) && u.hostname.includes(".");
  } catch { return false; }
}

function structuralCheck(lead) {
  const issues = [];

  const name = lead.name || lead.handle || lead.linkedinId || lead.business_name || "";
  if (!name.trim()) issues.push("No name or identifier");

  const email   = lead.email   || lead.contact_email || "";
  const phone   = lead.phone   || lead.contact_phone || "";
  const website = lead.website || lead.profileUrl    || lead.url || "";

  const hasEmail   = isValidEmail(email);
  const hasPhone   = isValidPhone(phone);
  const hasUrl     = isValidUrl(website);

  if (!hasEmail && !hasPhone && !hasUrl) issues.push("No valid contact (email, phone, or URL)");

  if (email   && !isValidEmail(email))   issues.push(`Invalid email: ${email}`);
  if (phone   && !isValidPhone(phone))   issues.push(`Invalid phone: ${phone}`);
  if (website && !isValidUrl(website) && !website.startsWith("http")) issues.push("Malformed URL");

  return { valid: issues.length === 0, issues, hasEmail, hasPhone, hasUrl };
}

/* ─── Deduplication ──────────────────────────────────────────────────────────*/
function deduplicateLeads(leads) {
  const seen = { emails: new Set(), phones: new Set(), urls: new Set() };
  const deduped    = [];
  const duplicates = [];

  for (const lead of leads) {
    const email  = (lead.email   || lead.contact_email || "").toLowerCase().trim();
    const phone  = (lead.phone   || lead.contact_phone || "").replace(/\D/g, "");
    const url    = (lead.website || lead.profileUrl    || lead.url || "").toLowerCase().replace(/\/$/, "").trim();

    const isDupe =
      (email.length > 3 && seen.emails.has(email)) ||
      (phone.length >= 7 && seen.phones.has(phone)) ||
      (url.length   > 5 && seen.urls.has(url));

    if (isDupe) {
      duplicates.push({ ...lead, rejection_stage: "deduplication", rejection_reason: "Duplicate entry (same email/phone/URL)" });
    } else {
      if (email.length > 3) seen.emails.add(email);
      if (phone.length >= 7) seen.phones.add(phone);
      if (url.length   > 5) seen.urls.add(url);
      deduped.push(lead);
    }
  }

  return { deduped, duplicates };
}

/* ─── AI Validation (Thinksuite Haiku batch) ────────────────────────────────────*/
async function aiValidateBatch(batch, type, requirement) {
  const batchData = batch.map((lead, localIdx) => ({
    i:    localIdx,
    name: (lead.name || lead.business_name || lead.handle || "").slice(0, 50),
    email: lead.email || lead.contact_email || "",
    phone: lead.phone || lead.contact_phone || "",
    url:  (lead.website || lead.profileUrl  || lead.url || "").slice(0, 80),
    cat:  (lead.category || lead.title || lead.industry || "").slice(0, 40),
    loc:  (lead.location || lead.address || lead.city   || "").slice(0, 40),
    bio:  (lead.bio || lead.bioSnippet || lead.description || "").slice(0, 100),
  }));

  const msg = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    messages: [{
      role:    "user",
      content: `You are a lead quality auditor. Validate these ${type || "business"} leads${requirement ? ` for requirement: "${requirement}"` : ""}.

Score each 0–10:
- 8–10: Real business/person, complete contact info, highly relevant
- 5–7:  Plausibly real, partial info, somewhat relevant
- 0–4:  Fake, spam, placeholder, completely off-topic

Leads: ${JSON.stringify(batchData)}

Return ONLY JSON array of leads scoring >= 5:
[{"i":0,"s":8,"q":"verified|partial|limited"}]

Reject: fake emails like info@company.com with no other info, obviously bot/placeholder names, unverifiable contacts.`,
    }],
  });

  const text     = msg.content[0]?.text || "[]";
  const arrMatch = text.match(/\[[\s\S]*?\]/);
  if (!arrMatch) return { passed: batch, failed: [] };

  const rated    = JSON.parse(arrMatch[0]);
  const scoreMap = new Map(rated.map(r => [Number(r.i), { score: Number(r.s), quality: r.q || "limited" }]));

  const passed = [];
  const failed = [];
  for (let i = 0; i < batch.length; i++) {
    if (scoreMap.has(i)) {
      const { score, quality } = scoreMap.get(i);
      passed.push({ ...batch[i], ai_score: score, data_quality: quality, ai_validated: true });
    } else {
      failed.push({ ...batch[i], rejection_stage: "ai", rejection_reason: "Failed AI quality check low score or suspicious data" });
    }
  }
  return { passed, failed };
}

/* ─── Main handler ───────────────────────────────────────────────────────────*/
export async function POST(request) {
  try {
    const { leads, requirement = "", type = "general" } = await request.json();

    if (!leads?.length) {
      return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    }

    const toProcess = leads.slice(0, 100);

    // ── Stage 1: Structural validation ───────────────────────────────────────
    const structPassed = [];
    const structFailed = [];
    for (const lead of toProcess) {
      const { valid, issues } = structuralCheck(lead);
      if (valid) structPassed.push(lead);
      else structFailed.push({ ...lead, rejection_stage: "structural", rejection_reason: issues.join("; ") });
    }

    // ── Stage 2: Deduplication ────────────────────────────────────────────────
    const { deduped, duplicates } = deduplicateLeads(structPassed);

    // ── Stage 3: AI validation in batches of 20 ───────────────────────────────
    let aiPassed = [];
    let aiRejected = [];

    if (deduped.length > 0) {
      const BATCH = 20;
      for (let start = 0; start < deduped.length; start += BATCH) {
        const batch = deduped.slice(start, start + BATCH);
        try {
          const { passed, failed } = await aiValidateBatch(batch, type, requirement);
          aiPassed.push(...passed);
          aiRejected.push(...failed);
        } catch (err) {
          console.warn("[ai-lead-validator] AI batch failed, keeping batch:", err.message);
          aiPassed.push(...batch.map(l => ({ ...l, ai_validated: false })));
        }
      }
    } else {
      // No AI key mark leads as unvalidated but pass them through
      aiPassed = deduped.map(l => ({ ...l, ai_validated: false }));
    }

    // Sort by AI score descending
    aiPassed.sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));

    const allRejected = [...structFailed, ...duplicates, ...aiRejected];

    // Quality breakdown
    const qualityBreakdown = { verified: 0, partial: 0, limited: 0 };
    for (const l of aiPassed) {
      const q = l.data_quality || "limited";
      if (qualityBreakdown[q] !== undefined) qualityBreakdown[q]++;
    }

    return NextResponse.json({
      success:        true,
      validatedLeads: aiPassed,
      rejectedLeads:  allRejected,
      report: {
        totalInput: toProcess.length,
        passed:     aiPassed.length,
        rejected:   allRejected.length,
        passRate:   `${Math.round((aiPassed.length / toProcess.length) * 100)}%`,
        rejectionBreakdown: {
          structural: structFailed.length,
          duplicates: duplicates.length,
          aiFiltered: aiRejected.length,
        },
        qualityBreakdown,
        avgAiScore: aiPassed.length
          ? Math.round(aiPassed.reduce((s, l) => s + (l.ai_score || 0), 0) / aiPassed.length * 10) / 10
          : 0,
      },
    });

  } catch (err) {
    console.error("[ai-lead-validator]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
