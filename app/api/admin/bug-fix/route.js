import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";

const client = getAIClient();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "thinksuitesolution-coder";
const GITHUB_REPO  = process.env.GITHUB_REPO  || "thinksuite-marketing";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];

async function getAdminApp() {
  const mod = await import("@/lib/firebaseAdmin");
  const app = mod.default();
  if (!app) throw new Error("Firebase Admin not configured");
  return app;
}

async function verifyAdmin(idToken) {
  const app     = await getAdminApp();
  const decoded = await app.auth().verifyIdToken(idToken);
  const email   = decoded.email?.toLowerCase();
  if (OWNER_EMAILS.includes(email)) return app;
  const snap   = await app.firestore().doc("config/admins").get();
  const emails = snap.exists ? (snap.data().emails || []) : [];
  if (!emails.includes(email)) throw new Error("Unauthorized");
  return app;
}

/* ── GitHub helpers ─────────────────────────────────────────────────────────── */
async function ghGet(filePath) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not set in env");
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  );
  if (!res.ok) throw new Error(`GitHub: file not found ${filePath}`);
  const data    = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

async function ghCommit(filePath, content, sha, message) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not set in env");
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        sha,
        branch: "main",
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub commit failed: ${err.message || res.status}`);
  }
  return await res.json();
}

/* ── Chat: describe bug → Thinksuite identifies file + fixes it ─────────────────── */
async function handleChat({ message, chatHistory = [] }) {
  // Step 1: identify likely files
  const fileRes = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: `You are a Next.js 16 developer. Given a bug description for the Thinksuite SaaS platform, return ONLY a JSON array of the 1-2 most likely file paths to fix.
The app is in the app/ directory (Next.js App Router). Example: ["app/dashboard/tools/page.js"]
Return ONLY the raw JSON array. No explanation. No markdown.`,
    messages: [{ role: "user", content: message }],
  });

  let filePaths = [];
  try { filePaths = JSON.parse(fileRes.content[0].text.trim()); } catch {}

  // Step 2: fetch those files from GitHub
  const fileContents = [];
  for (const fp of filePaths.slice(0, 2)) {
    try {
      const { content, sha } = await ghGet(fp);
      fileContents.push({ path: fp, content, sha });
    } catch {}
  }

  // Step 3: ask Thinksuite to fix
  const codeCtx = fileContents.length
    ? fileContents.map(f => `// File: ${f.path}\n${f.content}`).join("\n\n---\n\n")
    : "(No code files fetched GitHub token may not be set)";

  const history = chatHistory.map(m => ({ role: m.role, content: m.content }));
  history.push({ role: "user", content: `Bug: ${message}\n\nCode:\n${codeCtx}` });

  const fixRes = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: `You are an expert Next.js developer for Thinksuite an Indian SaaS platform.
When given a bug + code, diagnose and fix it.

If you can produce a fix, respond ONLY with this JSON (no markdown wrapper):
{
  "type": "fix",
  "analysis": "short diagnosis",
  "filePath": "path/to/file.js",
  "fixedCode": "FULL file content after fix",
  "explanation": "what you changed and why",
  "confidence": "high|medium|low"
}

If you need more info or are just answering a question, respond with plain text (not JSON).`,
    messages: history,
  });

  const reply = fixRes.content[0].text.trim();

  try {
    const parsed = JSON.parse(reply);
    if (parsed.type === "fix" && parsed.fixedCode && parsed.filePath) {
      const fileData = fileContents.find(f => f.path === parsed.filePath);
      return {
        type: "fix",
        analysis:     parsed.analysis,
        filePath:     parsed.filePath,
        fixedCode:    parsed.fixedCode,
        explanation:  parsed.explanation,
        confidence:   parsed.confidence,
        sha:          fileData?.sha,
        originalCode: fileData?.content,
      };
    }
  } catch {}

  return { type: "message", text: reply };
}

/* ── Deploy: commit fix directly to main → Vercel auto-deploys ──────────────── */
async function handleDeploy({ filePath, fixedCode, sha, explanation }) {
  if (!filePath || !fixedCode) throw new Error("filePath and fixedCode required");

  let fileSha = sha;
  if (!fileSha) {
    const { sha: fresh } = await ghGet(filePath);
    fileSha = fresh;
  }

  const result = await ghCommit(
    filePath,
    fixedCode,
    fileSha,
    `fix: ${(explanation || "AI auto-fix").slice(0, 70)}\n\nCo-authored-by: Thinksuite BugBot <bot@Thinksuite.in>`
  );

  return { success: true, commitUrl: result.commit?.html_url || null };
}

/* ── Internal deploy used by auto-approve ───────────────────────────────────── */
async function deployFix(data) {
  if (!data.filePath || !data.fixedCode) return;
  await ghCommit(
    data.filePath,
    data.fixedCode,
    data.sha,
    `fix: ${(data.explanation || "Auto-fix from BugBot").slice(0, 70)}\n\nCo-authored-by: Thinksuite BugBot <bot@Thinksuite.in>`
  );
}

/* ── List: load fixes + auto-approve expired ones ───────────────────────────── */
async function handleList(app) {
  const db  = app.firestore();
  const now = Date.now();

  // Auto-approve fixes whose 20-min window has passed
  const expired = await db.collection("bug_fixes")
    .where("status", "==", "pending")
    .where("autoApproveAt", "<=", now)
    .get();

  await Promise.all(expired.docs.map(async doc => {
    try {
      await deployFix(doc.data());
      await doc.ref.update({ status: "deployed", deployedAt: now });
    } catch (e) {
      await doc.ref.update({ status: "auto-approve-failed", error: e.message });
    }
  }));

  const snap = await db.collection("bug_fixes")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ── Action: approve / reject ───────────────────────────────────────────────── */
async function handleAction(app, { fixId, action }) {
  const db     = app.firestore();
  const ref    = db.collection("bug_fixes").doc(fixId);
  const snap   = await ref.get();
  if (!snap.exists) throw new Error("Fix not found");

  const data = snap.data();
  const now  = Date.now();

  if (action === "approve") {
    try {
      await deployFix(data);
      await ref.update({ status: "deployed", deployedAt: now });
      return { success: true, status: "deployed" };
    } catch (e) {
      await ref.update({ status: "deploy-failed", error: e.message });
      throw e;
    }
  }

  if (action === "reject") {
    await ref.update({ status: "rejected", rejectedAt: now });
    return { success: true, status: "rejected" };
  }

  throw new Error("Invalid action");
}

const AUTO_APPROVE_MS = 20 * 60 * 1000; // 20 minutes

/* ── Report error (PUBLIC called from user's browser) ─────────────────────── */
async function handleReportError({ errorMessage, componentStack, url, toolSlug, userAgent }) {
  const app = await getAdminApp();
  const db  = app.firestore();
  const now = Date.now();

  // Dedup: same error on same URL within last 10 min → return existing fixId
  const recent = await db.collection("bug_fixes")
    .where("errorMessage", "==", (errorMessage || "").slice(0, 200))
    .where("createdAt", ">=", now - 10 * 60 * 1000)
    .limit(1)
    .get();

  if (!recent.empty) {
    const existing = recent.docs[0];
    return { fixId: existing.id, status: existing.data().status, duplicate: true };
  }

  // Guess which file to fix based on component stack + url
  let filePath = null;
  let fileContent = null;
  let fileSha = null;

  try {
    const guessRes = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      system: `Return ONLY a JSON array of 1-2 most likely Next.js file paths to fix given this error. Example: ["app/dashboard/tools/page.js"]. No explanation.`,
      messages: [{ role: "user", content: `Error: ${errorMessage}\nURL: ${url}\nStack: ${(componentStack || "").slice(0, 500)}\nTool: ${toolSlug || ""}` }],
    });
    const paths = JSON.parse(guessRes.content[0].text.trim());
    for (const fp of paths.slice(0, 2)) {
      try { const r = await ghGet(fp); fileContent = r.content; fileSha = r.sha; filePath = fp; break; } catch {}
    }
  } catch {}

  // Ask Thinksuite to fix it
  let fixedCode = null, explanation = null, confidence = null;
  if (fileContent) {
    try {
      const fixRes = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: `You are a Next.js developer. Fix this production bug. Respond ONLY with JSON (no markdown):
{"type":"fix","filePath":"path","fixedCode":"FULL file","explanation":"what you fixed","confidence":"high|medium|low"}`,
        messages: [{ role: "user", content: `Error: ${errorMessage}\nURL: ${url}\n\nFile (${filePath}):\n${fileContent}` }],
      });
      const p = JSON.parse(fixRes.content[0].text.trim());
      if (p.fixedCode) { fixedCode = p.fixedCode; explanation = p.explanation; confidence = p.confidence; filePath = p.filePath || filePath; }
    } catch {}
  }

  const ref = await db.collection("bug_fixes").add({
    type:          "user-reported",
    title:         (errorMessage || "Unknown error").slice(0, 100),
    errorMessage:  (errorMessage || "").slice(0, 500),
    componentStack:(componentStack || "").slice(0, 1000),
    url:           url || null,
    toolSlug:      toolSlug || null,
    filePath,
    originalCode:  fileContent,
    fixedCode,
    explanation,
    confidence,
    sha:           fileSha,
    status:        fixedCode ? "pending" : "no-fix",
    createdAt:     now,
    autoApproveAt: now + AUTO_APPROVE_MS,
  });

  return { fixId: ref.id, status: fixedCode ? "pending" : "no-fix", autoApproveAt: now + AUTO_APPROVE_MS };
}

/* ── Check status (PUBLIC polled by user's browser) ───────────────────────── */
async function handleCheckStatus({ fixId }) {
  if (!fixId) throw new Error("fixId required");
  const app  = await getAdminApp();
  const db   = app.firestore();
  const ref  = db.collection("bug_fixes").doc(fixId);
  const snap = await ref.get();
  if (!snap.exists) return { status: "not-found" };

  const data = snap.data();
  const now  = Date.now();

  // Auto-deploy if window has passed and fix is ready
  if (data.status === "pending" && data.autoApproveAt <= now) {
    try {
      await deployFix(data);
      await ref.update({ status: "deployed", deployedAt: now });
      return { status: "deployed", deployedAt: now };
    } catch (e) {
      await ref.update({ status: "auto-approve-failed", error: e.message });
      return { status: "auto-approve-failed" };
    }
  }

  return {
    status:        data.status,
    autoApproveAt: data.autoApproveAt || null,
    explanation:   data.explanation || null,
    hasfix:        !!data.fixedCode,
  };
}

/* ── Main handler ───────────────────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const body   = await req.json();
    const { idToken, action } = body;

    // Public actions no auth required
    if (action === "report-error")  return NextResponse.json(await handleReportError(body));
    if (action === "check-status")  return NextResponse.json(await handleCheckStatus(body));

    // Admin-only actions
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });

    const app = await verifyAdmin(idToken);

    if (action === "chat")        return NextResponse.json(await handleChat(body));
    if (action === "deploy")      return NextResponse.json(await handleDeploy(body));
    if (action === "list")        return NextResponse.json({ fixes: await handleList(app) });
    if (action === "fix-action")  return NextResponse.json(await handleAction(app, body));

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[admin/bug-fix]", err.message);
    const status = err.message === "Unauthorized" ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
