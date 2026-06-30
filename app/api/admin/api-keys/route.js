import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];
const CONFIG_DOC = "config/admins";

// Defines all manageable API keys and which platform they belong to
const API_KEY_DEFS = [
  { key: "ANTHROPIC_API_KEY",        label: "Anthropic (Claude AI)",    target: "both",    category: "AI Models" },
  { key: "OPENAI_API_KEY",           label: "OpenAI",                   target: "both",    category: "AI Models" },
  { key: "GEMINI_API_KEY",           label: "Google Gemini",            target: "vercel",  category: "AI Models" },
  { key: "REPLICATE_API_TOKEN",      label: "Replicate AI",             target: "both",    category: "AI Models" },
  { key: "ELEVENLABS_API_KEY",       label: "ElevenLabs (Voice)",       target: "both",    category: "Media" },
  { key: "PEXELS_API_KEY",           label: "Pexels (Stock Video)",     target: "both",    category: "Media" },
  { key: "PIXABAY_API_KEY",          label: "Pixabay",                  target: "railway", category: "Media" },
  { key: "GOOGLE_TTS_KEY",           label: "Google TTS",               target: "vercel",  category: "Media" },
  { key: "RAZORPAY_KEY_ID",          label: "Razorpay Key ID",          target: "vercel",  category: "Payments" },
  { key: "RAZORPAY_KEY_SECRET",      label: "Razorpay Secret",          target: "vercel",  category: "Payments" },
  { key: "FIRECRAWL_API_KEY",        label: "Firecrawl (Scraping)",     target: "vercel",  category: "Data" },
  { key: "SERPER_API_KEY",           label: "Serper (Search)",          target: "vercel",  category: "Data" },
  { key: "SCRAPER_API_KEY",          label: "Scraper API",              target: "vercel",  category: "Data" },
  { key: "GOOGLE_MAPS_API_KEY",      label: "Google Maps",              target: "vercel",  category: "Data" },
  { key: "GOOGLE_SEARCH_API_KEY",    label: "Google Search API",        target: "vercel",  category: "Data" },
  { key: "TWO_CAPTCHA_KEY",          label: "2Captcha",                 target: "vercel",  category: "Data" },
  { key: "WHATSAPP_API_TOKEN",       label: "WhatsApp API Token",       target: "vercel",  category: "Messaging" },
  { key: "META_APP_SECRET",          label: "Meta App Secret",          target: "vercel",  category: "Messaging" },
  { key: "UPSTASH_REDIS_REST_TOKEN", label: "Upstash Redis Token",      target: "vercel",  category: "Infrastructure" },
  { key: "UPSTASH_REDIS_REST_URL",   label: "Upstash Redis URL",        target: "vercel",  category: "Infrastructure" },
  { key: "BACKEND_SECRET",           label: "Backend Secret",           target: "both",    category: "Infrastructure" },
];

async function verifyAdmin(idToken) {
  const adminModule = await import("@/lib/firebase-admin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (!OWNER_EMAILS.includes(email)) {
    const snap = await adminApp.firestore().doc(CONFIG_DOC).get();
    const emails = snap.exists ? (snap.data().emails || []) : [];
    if (!emails.includes(email)) throw new Error("Unauthorized");
  }
  return email;
}

function vercelHeaders() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function vercelUrl(path) {
  const teamId = process.env.VERCEL_TEAM_ID;
  const base = `https://api.vercel.com${path}`;
  return teamId ? `${base}${path.includes("?") ? "&" : "?"}teamId=${teamId}` : base;
}

async function vercelListEnvs() {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!process.env.VERCEL_API_TOKEN || !projectId) return null;
  const res = await fetch(vercelUrl(`/v9/projects/${projectId}/env`), {
    headers: vercelHeaders(),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.envs || [];
}

async function vercelUpsertEnv(key, value) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!process.env.VERCEL_API_TOKEN || !projectId) {
    throw new Error("VERCEL_API_TOKEN or VERCEL_PROJECT_ID not configured");
  }

  const envs = await vercelListEnvs();
  const existing = envs?.find(e => e.key === key);

  if (existing) {
    const res = await fetch(vercelUrl(`/v9/projects/${projectId}/env/${existing.id}`), {
      method: "PATCH",
      headers: vercelHeaders(),
      body: JSON.stringify({ value, target: existing.target || ["production"] }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `Vercel update HTTP ${res.status}`);
    }
  } else {
    const res = await fetch(vercelUrl(`/v10/projects/${projectId}/env`), {
      method: "POST",
      headers: vercelHeaders(),
      body: JSON.stringify([{ key, value, target: ["production", "preview"], type: "encrypted" }]),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `Vercel create HTTP ${res.status}`);
    }
  }
}

async function vercelRedeploy() {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!process.env.VERCEL_API_TOKEN || !projectId) {
    throw new Error("Vercel not configured");
  }

  const listRes = await fetch(
    vercelUrl(`/v6/deployments?projectId=${projectId}&target=production&limit=1&state=READY`),
    { headers: vercelHeaders() }
  );
  if (!listRes.ok) throw new Error(`Cannot list Vercel deployments (HTTP ${listRes.status})`);
  const { deployments } = await listRes.json();
  const last = deployments?.[0];
  if (!last) throw new Error("No production deployments found on Vercel");

  const reRes = await fetch(vercelUrl("/v13/deployments"), {
    method: "POST",
    headers: vercelHeaders(),
    body: JSON.stringify({ deploymentId: last.uid, name: last.name, target: "production" }),
  });
  if (!reRes.ok) {
    const err = await reRes.json();
    throw new Error(err.error?.message || `Vercel redeploy HTTP ${reRes.status}`);
  }
}

function railwayHeaders() {
  return {
    Authorization: `Bearer ${process.env.RAILWAY_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function railwayUpsertEnv(key, value) {
  const { RAILWAY_API_TOKEN, RAILWAY_PROJECT_ID, RAILWAY_SERVICE_ID, RAILWAY_ENVIRONMENT_ID } = process.env;
  if (!RAILWAY_API_TOKEN || !RAILWAY_PROJECT_ID || !RAILWAY_SERVICE_ID || !RAILWAY_ENVIRONMENT_ID) {
    throw new Error("Railway not fully configured (need RAILWAY_API_TOKEN, RAILWAY_PROJECT_ID, RAILWAY_SERVICE_ID, RAILWAY_ENVIRONMENT_ID)");
  }

  const res = await fetch("https://backboard.railway.app/graphql/v2", {
    method: "POST",
    headers: railwayHeaders(),
    body: JSON.stringify({
      query: `
        mutation UpsertVars($input: VariableCollectionUpsertInput!) {
          variableCollectionUpsert(input: $input)
        }
      `,
      variables: {
        input: {
          projectId: RAILWAY_PROJECT_ID,
          serviceId: RAILWAY_SERVICE_ID,
          environmentId: RAILWAY_ENVIRONMENT_ID,
          variables: { [key]: value },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`Railway API HTTP ${res.status}`);
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors[0].message);
}

async function railwayRedeploy() {
  const { RAILWAY_API_TOKEN, RAILWAY_SERVICE_ID, RAILWAY_ENVIRONMENT_ID } = process.env;
  if (!RAILWAY_API_TOKEN || !RAILWAY_SERVICE_ID || !RAILWAY_ENVIRONMENT_ID) {
    throw new Error("Railway not configured for redeploy");
  }

  const res = await fetch("https://backboard.railway.app/graphql/v2", {
    method: "POST",
    headers: railwayHeaders(),
    body: JSON.stringify({
      query: `
        mutation Redeploy($serviceId: String!, $environmentId: String!) {
          serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
        }
      `,
      variables: {
        serviceId: RAILWAY_SERVICE_ID,
        environmentId: RAILWAY_ENVIRONMENT_ID,
      },
    }),
  });
  if (!res.ok) throw new Error(`Railway redeploy HTTP ${res.status}`);
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors[0].message);
}

async function railwayListVars() {
  const { RAILWAY_API_TOKEN, RAILWAY_PROJECT_ID, RAILWAY_SERVICE_ID, RAILWAY_ENVIRONMENT_ID } = process.env;
  if (!RAILWAY_API_TOKEN || !RAILWAY_PROJECT_ID || !RAILWAY_SERVICE_ID || !RAILWAY_ENVIRONMENT_ID) return null;
  try {
    const res = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: railwayHeaders(),
      body: JSON.stringify({
        query: `query Vars($projectId: String!, $serviceId: String!, $environmentId: String!) {
          variables(projectId: $projectId, serviceId: $serviceId, environmentId: $environmentId)
        }`,
        variables: {
          projectId: RAILWAY_PROJECT_ID,
          serviceId: RAILWAY_SERVICE_ID,
          environmentId: RAILWAY_ENVIRONMENT_ID,
        },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.variables || null;
  } catch { return null; }
}

// Skip internal/system keys we don't want to show
const SKIP_KEYS = new Set([
  "NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "NEXT_PUBLIC_FIREBASE_APP_ID",
  "VERCEL_URL", "VERCEL_ENV", "VERCEL_GIT_COMMIT_SHA", "VERCEL_GIT_COMMIT_REF",
  "VERCEL_GIT_REPO_SLUG", "VERCEL_GIT_REPO_OWNER", "NEXT_PUBLIC_VERCEL_URL",
  "NODE_ENV", "PORT",
]);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idToken = searchParams.get("idToken");
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });
    await verifyAdmin(idToken);

    const [vercelEnvs, railwayVars] = await Promise.all([
      vercelListEnvs(),
      railwayListVars(),
    ]);

    const railwayKeys = new Set(Object.keys(railwayVars || {}));
    const allKeys = new Map();

    // Add all Vercel keys
    for (const e of (vercelEnvs || [])) {
      if (SKIP_KEYS.has(e.key)) continue;
      const def = API_KEY_DEFS.find(d => d.key === e.key);
      const railwayVal = railwayVars?.[e.key];
      allKeys.set(e.key, {
        key: e.key,
        label: def?.label || e.key,
        category: def?.category || "Other",
        target: def?.target || "vercel",
        existsOnVercel: true,
        existsOnRailway: railwayKeys.has(e.key),
        // Railway value shown if available; Vercel values are always encrypted
        currentValue: railwayVal || null,
        valueSource: railwayVal ? "railway" : "vercel-encrypted",
      });
    }

    // Add Railway-only keys not on Vercel
    for (const k of railwayKeys) {
      if (SKIP_KEYS.has(k) || allKeys.has(k)) continue;
      const def = API_KEY_DEFS.find(d => d.key === k);
      allKeys.set(k, {
        key: k,
        label: def?.label || k,
        category: def?.category || "Other",
        target: def?.target || "railway",
        existsOnVercel: false,
        existsOnRailway: true,
        currentValue: railwayVars[k] || null,
        valueSource: "railway",
      });
    }

    return NextResponse.json({
      keys: Array.from(allKeys.values()).sort((a, b) => a.key.localeCompare(b.key)),
      configured: {
        vercel: !!(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID),
        railway: !!(
          process.env.RAILWAY_API_TOKEN &&
          process.env.RAILWAY_PROJECT_ID &&
          process.env.RAILWAY_SERVICE_ID &&
          process.env.RAILWAY_ENVIRONMENT_ID
        ),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken, action, key, value, deployVercel = true, deployRailway = true } = body;
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });
    await verifyAdmin(idToken);

    if (action === "update") {
      if (!key || !value?.trim()) return NextResponse.json({ error: "key and value required" }, { status: 400 });
      const def = API_KEY_DEFS.find(d => d.key === key);
      // If not in predefined list, allow update on both platforms by default

      const results = {};
      const errors = [];

      const target = def?.target || "both";
      if (target !== "railway") {
        try {
          await vercelUpsertEnv(key, value.trim());
          if (deployVercel) await vercelRedeploy();
          results.vercel = deployVercel ? "updated + redeploy started" : "updated";
        } catch (e) {
          errors.push(`Vercel: ${e.message}`);
          results.vercel = `error: ${e.message}`;
        }
      }

      if (target !== "vercel") {
        try {
          await railwayUpsertEnv(key, value.trim());
          if (deployRailway) await railwayRedeploy();
          results.railway = deployRailway ? "updated + redeploy started" : "updated";
        } catch (e) {
          errors.push(`Railway: ${e.message}`);
          results.railway = `error: ${e.message}`;
        }
      }

      const allFailed = Object.values(results).every(r => r?.startsWith("error:"));
      if (allFailed && errors.length) {
        return NextResponse.json({ error: errors.join(" | ") }, { status: 500 });
      }

      return NextResponse.json({ success: true, results, errors });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}