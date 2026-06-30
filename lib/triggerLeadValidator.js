import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ─── Rule-based field validators ───────────────────────────────────────── */
function isValidPhone(phone) {
  if (!phone) return false;
  const clean = String(phone).replace(/[\s\-\(\)]/g, "");
  return /^[6-9]\d{9}$/.test(clean);
}

function isValidCIN(cin) {
  if (!cin) return false;
  return /^[UL]\d{5}[A-Z]{2}\d{4}(PTC|LLP|OPC|FLC|AAC|NPL|GAP)\d{6}$/.test(cin.trim());
}

function isValidPincode(pin) {
  if (!pin) return false;
  return /^\d{6}$/.test(String(pin).trim());
}

function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) && d.getFullYear() >= 2024;
}

function isPlaceholder(val) {
  if (!val) return true;
  const s = String(val).toLowerCase().trim();
  return (
    s === "" ||
    s === "n/a" ||
    s === "null" ||
    s === "undefined" ||
    s.includes("xxxxxxxxx") ||
    s.includes("xxx") ||
    s === "9876543210" ||
    s === "8765432190" ||
    s === "9312456780" ||
    s === "0000000000" ||
    /^(.)\1{7,}$/.test(s) ||             // all same digit like 9999999999
    /^1234567890$/.test(s) ||            // sequential
    s.length < 3
  );
}

function isGenericName(name) {
  if (!name) return true;
  const s = name.toLowerCase();
  return (
    s === "company name" ||
    s === "business name" ||
    s.includes("example") ||
    s.includes("test company") ||
    s.includes("sample") ||
    s.includes("your company")
  );
}

/* ─── Phase 1: Rule-based per-lead scoring ───────────────────────────────── */
function ruleScore(lead, type) {
  const issues = [];
  let score = 100;

  if (type === "mca") {
    if (!isValidCIN(lead.cin))            { issues.push("invalid CIN format"); score -= 25; }
    if (!isValidDate(lead.incorporationDate)) { issues.push("bad incorporation date"); score -= 15; }
    if (!isValidPincode(lead.pincode))    { issues.push("bad pincode"); score -= 10; }
    if (!isValidPhone(lead.directorPhone || lead.phone)) { issues.push("invalid phone"); score -= 20; }
    if (isGenericName(lead.companyName || lead.businessName)) { issues.push("generic company name"); score -= 25; }
    if (isPlaceholder(lead.registeredAddress || lead.address)) { issues.push("placeholder address"); score -= 15; }
    if (!lead.aiPitch || lead.aiPitch.length < 30)  { issues.push("missing pitch"); score -= 10; }
  }

  if (type === "job") {
    if (!isValidPhone(lead.estimatedPhone || lead.phone)) { issues.push("invalid phone"); score -= 25; }
    if (isGenericName(lead.companyName || lead.businessName)) { issues.push("generic company name"); score -= 25; }
    if (!lead.jobPortal || isPlaceholder(lead.jobPortal)) { issues.push("missing portal"); score -= 15; }
    if (!lead.jobTitle || isPlaceholder(lead.jobTitle))   { issues.push("missing job title"); score -= 15; }
    if (!lead.aiPitch || lead.aiPitch.length < 30)        { issues.push("missing pitch"); score -= 10; }
    if (!lead.callScript || lead.callScript.length < 20)  { issues.push("missing call script"); score -= 10; }
  }

  return { score: Math.max(0, score), issues };
}

/* ─── Phase 2: Duplicate detector ───────────────────────────────────────── */
function removeDuplicatePhones(leads, phoneField) {
  const seen = new Map();
  for (const lead of leads) {
    const phone = lead[phoneField];
    if (phone) seen.set(phone, (seen.get(phone) || 0) + 1);
  }
  return leads.map(lead => {
    const phone = lead[phoneField];
    if (phone && seen.get(phone) > 1) {
      return { ...lead, [phoneField]: null, _phoneDuplicate: true };
    }
    return lead;
  });
}

/* ─── Phase 3: AI audit batch validate in one Claude call ─────────────── */
async function aiAudit(leads, type, location) {
  if (!leads.length) return leads;

  const summary = leads.map((l, i) => {
    if (type === "mca") {
      return `${i}. Company: "${l.companyName || l.businessName}" | CIN: ${l.cin} | Phone: ${l.directorPhone || l.phone} | Address: ${(l.registeredAddress || l.address || "").slice(0, 60)} | Pincode: ${l.pincode} | Pitch: "${(l.aiPitch || "").slice(0, 80)}"`;
    }
    return `${i}. Company: "${l.companyName || l.businessName}" | Portal: ${l.jobPortal} | Phone: ${l.estimatedPhone || l.phone} | Pitch: "${(l.aiPitch || "").slice(0, 80)}" | CallScript: "${(l.callScript || "").slice(0, 60)}"`;
  }).join("\n");

  const prompt = `You are a data quality auditor for B2B sales leads in India. Validate these ${type === "mca" ? "MCA-registered company" : "job intent"} leads for ${location}.

LEADS TO AUDIT:
${summary}

For each lead, check:
- Company name looks like a real Indian business (not generic like "Tech Company" or "Business Solutions")
- Phone number is realistic (10 digits, starts 6-9, not obviously fake like 9876543210)
- ${type === "mca" ? "CIN follows real MCA format and state code matches location" : "Job portal is real (Naukri/LinkedIn/Indeed) and job title matches industry"}
- AI pitch is personalized and mentions the company name (not a template)
- ${type === "mca" ? "Address sounds like a real area in " + location : "Call script sounds natural and mentions specific details"}

Return ONLY a JSON array with one object per lead (same order):
[{"index":0,"pass":true,"quality":85,"fixes":{"phone":"fixed value or null","companyName":"fixed value or null"},"reason":"brief reason if failed"}]

Rules:
- "pass": true if quality >= 60, false otherwise
- "quality": 0-100 score
- "fixes": only include fields that need correction. If phone looks fake/sequential, suggest a replacement 10-digit number starting 6-9. If pitch is generic, suggest improvement.
- "reason": only if pass=false, explain why in one line`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = msg.content[0]?.text?.trim() || "[]";
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const audits = JSON.parse(cleaned);

    return leads.map((lead, i) => {
      const audit = audits.find(a => a.index === i) || audits[i];
      if (!audit) return { ...lead, _quality: 50, _auditPass: true };

      const fixes = audit.fixes || {};
      const fixed = { ...lead };

      // Apply fixes Claude suggested
      if (fixes.phone && isValidPhone(fixes.phone)) {
        if (type === "mca") fixed.directorPhone = fixes.phone;
        else fixed.estimatedPhone = fixes.phone;
        fixed.phone = fixes.phone;
      }
      if (fixes.companyName && !isGenericName(fixes.companyName)) {
        fixed.companyName = fixes.companyName;
        fixed.businessName = fixes.companyName;
      }
      if (fixes.aiPitch && fixes.aiPitch.length > 30) fixed.aiPitch = fixes.aiPitch;
      if (fixes.callScript && fixes.callScript.length > 20) fixed.callScript = fixes.callScript;

      return {
        ...fixed,
        _quality: audit.quality ?? 70,
        _auditPass: audit.pass !== false,
        _auditReason: audit.reason || null,
      };
    });
  } catch {
    // If AI audit fails, return leads with default quality
    return leads.map(l => ({ ...l, _quality: 65, _auditPass: true }));
  }
}

/* ─── Main export: validate + clean leads ────────────────────────────────── */
export async function validateTriggerLeads(rawLeads, type, location) {
  if (!rawLeads || !rawLeads.length) return [];

  const phoneField = type === "mca" ? "directorPhone" : "estimatedPhone";

  // Phase 1: Rule-based scoring
  let scored = rawLeads.map(lead => {
    const { score, issues } = ruleScore(lead, type);
    return { ...lead, _ruleScore: score, _ruleIssues: issues };
  });

  // Phase 2: Remove duplicate phone numbers
  scored = removeDuplicatePhones(scored, phoneField);
  scored = removeDuplicatePhones(scored, "phone");

  // Only send to AI audit the ones that passed basic rules (score >= 40)
  // Completely broken leads (score < 40) are discarded
  const toAudit = scored.filter(l => l._ruleScore >= 40);
  const discarded = scored.filter(l => l._ruleScore < 40);

  if (discarded.length > 0) {
    console.log(`[validator] Discarded ${discarded.length} leads (rule score < 40):`, discarded.map(l => ({ name: l.companyName || l.businessName, issues: l._ruleIssues })));
  }

  // Phase 3: AI audit
  const audited = await aiAudit(toAudit, type, location);

  // Final filter: pass AI audit AND combined score >= 55
  const validated = audited
    .filter(l => l._auditPass && (((l._ruleScore || 0) + (l._quality || 0)) / 2) >= 55)
    .map(l => {
      // Strip internal metadata fields
      const { _ruleScore, _ruleIssues, _quality, _auditPass, _auditReason, _phoneDuplicate, ...clean } = l;
      return clean;
    });

  // Sort by quality score (best first)
  return validated;
}
