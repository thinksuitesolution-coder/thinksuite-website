import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "thinksuitesolution-coder";
const GITHUB_REPO  = process.env.GITHUB_REPO  || "thinksuite-marketing";
const WEBHOOK_SECRET = process.env.SENTRY_WEBHOOK_SECRET;

const AUTO_APPROVE_MS = 20 * 60 * 1000; // 20 minutes

async function getAdminApp() {
  const mod = await import("@/lib/firebase-admin");
  const app = mod.default();
  if (!app) throw new Error("Firebase Admin not configured");
  return app;
}

async function ghGet(filePath) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not set");
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  );
  if (!res.ok) throw new Error(`GitHub: ${filePath} not found`);
  const data    = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

export async function POST(req) {
  try {
    // Optional: verify Sentry webhook secret header
    if (WEBHOOK_SECRET) {
      const sentryHook = req.headers.get("sentry-hook-signature") ||
                         req.headers.get("x-sentry-signature") || "";
      // Basic presence check for full HMAC verification add crypto logic here
      if (!sentryHook && req.headers.get("x-sentry-secret") !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();

    // Support Sentry Issue Alert webhook format
    const event   = body?.data?.event || body?.event || {};
    const issue   = body?.data?.issue || body?.issue || {};

    const errorTitle   = issue.title   || event.title   || body.message || "Unknown error";
    const errorMessage = event.exception?.values?.[0]?.value || event.message || errorTitle;
    const culprit      = event.culprit || issue.culprit || "";
    const rawFrames    = event.exception?.values?.[0]?.stacktrace?.frames || [];

    // Find the most relevant frame (last app frame, not node_modules)
    const appFrames = rawFrames.filter(f =>
      f.filename && !f.filename.includes("node_modules") && !f.filename.startsWith("/")
    );
    const topFrame  = appFrames[appFrames.length - 1] || rawFrames[rawFrames.length - 1] || {};
    const rawFile   = topFrame.filename || culprit || "";

    // Normalize path: remove leading ./ or /
    const filePath = rawFile.replace(/^\.?\//, "");

    // Ask Thinksuite which file to fix and how
    let fileContent = null;
    let fileSha     = null;
    let resolvedPath = filePath;

    if (filePath) {
      try {
        const { content, sha } = await ghGet(filePath);
        fileContent  = content;
        fileSha      = sha;
      } catch {
        // Try with app/ prefix
        try {
          const alt = `app/${filePath}`;
          const { content, sha } = await ghGet(alt);
          fileContent  = content;
          fileSha      = sha;
          resolvedPath = alt;
        } catch {}
      }
    }

    const codeCtx = fileContent
      ? `// File: ${resolvedPath}\n${fileContent}`
      : "(Could not fetch source file from GitHub)";

    const fixRes = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: `You are an expert Next.js developer fixing production bugs for Thinksuite SaaS platform.
Given an error from Sentry and the source file, produce a fix.

Respond ONLY with this JSON (no markdown):
{
  "type": "fix",
  "analysis": "one-line diagnosis",
  "filePath": "exact file path",
  "fixedCode": "COMPLETE fixed file content",
  "explanation": "what was wrong and what you changed",
  "confidence": "high|medium|low"
}

If you cannot determine a fix, set fixedCode to null and explain in analysis.`,
      messages: [{
        role: "user",
        content: `Sentry Error: ${errorTitle}\nMessage: ${errorMessage}\nCulprit: ${culprit}\n\nSource code:\n${codeCtx}`,
      }],
    });

    let parsed = null;
    try { parsed = JSON.parse(fixRes.content[0].text.trim()); } catch {}

    const app = await getAdminApp();
    const db  = app.firestore();
    const now = Date.now();

    const docData = {
      type:           "sentry",
      title:          errorTitle,
      errorMessage,
      culprit,
      filePath:       parsed?.filePath || resolvedPath || null,
      originalCode:   fileContent,
      fixedCode:      parsed?.fixedCode || null,
      explanation:    parsed?.explanation || parsed?.analysis || null,
      confidence:     parsed?.confidence || null,
      sha:            fileSha,
      status:         parsed?.fixedCode ? "pending" : "no-fix",
      createdAt:      now,
      autoApproveAt:  now + AUTO_APPROVE_MS,
      sentryPayload:  {
        title:    errorTitle,
        culprit,
        url:      issue.permalink || body.url || null,
      },
    };

    const ref = await db.collection("bug_fixes").add(docData);

    return NextResponse.json({ received: true, fixId: ref.id, hasfix: !!parsed?.fixedCode });
  } catch (err) {
    console.error("[sentry-webhook]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
