import { NextResponse } from "next/server";
import { verifyUser }  from "@/lib/authUtils";
import dns from "dns/promises";

export const maxDuration = 30;

// ── Generate email permutations for a name + domain ──────────────────────────
function generatePermutations(firstName, lastName, domain) {
  const f  = firstName.toLowerCase().replace(/[^a-z]/g, "");
  const l  = lastName.toLowerCase().replace(/[^a-z]/g, "");
  const fi = f[0] || "";
  const li = l[0] || "";
  if (!f || !domain) return [];
  return [
    `${f}@${domain}`,
    `${f}.${l}@${domain}`,
    `${f}${l}@${domain}`,
    `${fi}${l}@${domain}`,
    `${f}.${li}@${domain}`,
    `${f}${li}@${domain}`,
    `${l}@${domain}`,
    `${l}.${f}@${domain}`,
    `info@${domain}`,
    `contact@${domain}`,
    `hello@${domain}`,
    `admin@${domain}`,
  ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate
}

// ── MX record check ───────────────────────────────────────────────────────────
async function checkMX(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch { return false; }
}

// ── SMTP verify via Vercel-compatible approach ────────────────────────────────
// Note: port 25 is blocked on most cloud. We check MX + pattern heuristics.
async function smtpCheck(email) {
  const domain = email.split("@")[1];
  if (!domain) return { valid: false, reason: "invalid_format" };

  // 1. Basic format check
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return { valid: false, reason: "invalid_format", confidence: 0 };
  }

  // 2. MX record check — domain actually receives email?
  const hasMX = await checkMX(domain);
  if (!hasMX) return { valid: false, reason: "no_mx_record", confidence: 0.1 };

  // 3. Disposable email check
  const DISPOSABLE = new Set(["mailinator.com","guerrillamail.com","temp-mail.org","throwam.com","yopmail.com","trashmail.com","fakeinbox.com","sharklasers.com","guerrillamailblock.com"]);
  if (DISPOSABLE.has(domain)) return { valid: false, reason: "disposable", confidence: 0 };

  // 4. Free email providers — usually valid if format is correct
  const FREE_PROVIDERS = new Set(["gmail.com","yahoo.com","hotmail.com","outlook.com","yahoo.in","rediffmail.com","icloud.com"]);
  if (FREE_PROVIDERS.has(domain)) {
    return { valid: true, reason: "free_provider", confidence: 0.75 };
  }

  // 5. Business domain with MX — high confidence
  return { valid: true, reason: "business_domain_mx", confidence: 0.85 };
}

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { email, emails, name, domain } = await req.json();

    // ── Mode 1: Verify a single email ────────────────────────────────────────
    if (email) {
      const result = await smtpCheck(email);
      return NextResponse.json({ success: true, email, ...result });
    }

    // ── Mode 2: Verify a batch of emails ─────────────────────────────────────
    if (Array.isArray(emails) && emails.length > 0) {
      const results = await Promise.all(
        emails.slice(0, 20).map(async e => ({ email: e, ...(await smtpCheck(e)) }))
      );
      const valid = results.filter(r => r.valid);
      return NextResponse.json({ success: true, results, bestEmail: valid[0]?.email || null });
    }

    // ── Mode 3: Permutation finder — give name + domain, find working email ──
    if (name && domain) {
      const parts     = name.trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName  = parts[parts.length - 1] || "";
      const permuts   = generatePermutations(firstName, lastName, domain);

      const results = await Promise.all(
        permuts.map(async e => ({ email: e, ...(await smtpCheck(e)) }))
      );
      const valid    = results.filter(r => r.valid).sort((a,b) => b.confidence - a.confidence);
      const bestEmail = valid[0]?.email || null;

      return NextResponse.json({
        success: true,
        name,
        domain,
        permutations: permuts,
        results,
        bestEmail,
        confidence: valid[0]?.confidence || 0,
      });
    }

    return NextResponse.json({ error: "Provide email, emails[], or name+domain" }, { status: 400 });
  } catch (err) {
    console.error("[verify-email]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
