import { NextResponse } from "next/server";
import dns from "dns/promises";

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","tempmail.com","guerrillamail.com","throwaway.email",
  "maildrop.cc","sharklasers.com","guerrillamailblock.com","grr.la",
  "guerrillamail.info","spam4.me","trashmail.com","yopmail.com",
  "fakeinbox.com","mailnull.com","spamgourmet.com","tempinbox.com",
  "dispostable.com","mailexpire.com","spambox.us","throwam.com",
]);

const ROLE_PREFIXES = [
  "info","contact","hello","admin","support","sales","enquiry","enquiries",
  "help","noreply","no-reply","abuse","webmaster","postmaster","marketing",
  "office","team","careers","jobs","privacy","security","legal","billing",
];

const COMMON_PERSONAL_DOMAINS = new Set([
  "gmail.com","yahoo.com","outlook.com","hotmail.com","icloud.com",
  "protonmail.com","rediffmail.com","yahoo.in","live.com",
]);

async function verifyEmail(email) {
  // 1. Syntax check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, score: 0, reason: "invalid_syntax", type: null };
  }

  const [prefix, domain] = email.toLowerCase().split("@");

  // 2. Disposable check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, score: 0, reason: "disposable", type: "disposable" };
  }

  // 3. MX record check
  let hasMX = false;
  try {
    const mx = await dns.resolveMx(domain);
    hasMX = Array.isArray(mx) && mx.length > 0;
  } catch {
    return { valid: false, score: 0, reason: "domain_not_found", type: null };
  }

  if (!hasMX) {
    return { valid: false, score: 0, reason: "no_mx_record", type: null };
  }

  // 4. Determine type and score
  const isPersonalDomain = COMMON_PERSONAL_DOMAINS.has(domain);
  const isRoleBased = ROLE_PREFIXES.some(r => prefix === r || prefix.startsWith(r + ".") || prefix.startsWith(r + "_"));

  let type, score;
  if (isPersonalDomain) {
    type = "personal";
    score = 85;
  } else if (isRoleBased) {
    type = "role";
    score = 62;
  } else {
    type = "business";
    score = 90;
  }

  return { valid: true, score, reason: "verified", type, domain, hasMX };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { emails, email } = body;

    // Single email
    if (email) {
      const result = await verifyEmail(email.trim());
      return NextResponse.json({ result });
    }

    // Bulk emails (max 50)
    if (Array.isArray(emails)) {
      const batch = emails.slice(0, 50);
      const results = await Promise.allSettled(
        batch.map(e => verifyEmail(e.trim()))
      );
      return NextResponse.json({
        results: results.map((r, i) => ({
          email: batch[i],
          ...(r.status === "fulfilled" ? r.value : { valid: false, score: 0, reason: "error" }),
        })),
      });
    }

    return NextResponse.json({ error: "Provide email or emails[]" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
