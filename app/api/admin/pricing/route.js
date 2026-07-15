import { NextResponse } from "next/server";

const OWNER_EMAILS = ["thinksuitesolution@gmail.com", "info@Thinksuite.in", "subscriptionaakash@gmail.com"];
const CONFIG_DOC   = "config/admins";
const PRICING_DOC  = "config/pricing";

function defaultLeadGenPlans() {
  return {
    starter: {
      monthly:           5000,
      leadQuota:         300,
      walletEnabled:     true,
      walletPerLeadCost: 16,
      walletMinTopup:    100,
    },
    unlimited: {
      enabled:    true,
      monthly:    8000,
      gstPercent: 18,
    },
  };
}

const TOOL_SLUGS = [
  "seo", "lead-generation", "content", "imagestudio", "voice",
  "video", "studio", "seo-analytics", "vision-ai", "prompt-maker",
];

function defaultTool(slug) {
  return {
    monthly:          slug === "lead-generation" ? 5000 : 999,
    sixMonthEnabled:  false,
    sixMonthDiscount: 0,
    annualEnabled:    false,
    annualDiscount:   0,
    trialEnabled:     slug !== "lead-generation",
    trialDays:        7,
    trialPrice:       20,
  };
}

const DEFAULT_PRICING = {
  refundDays: 7,
  tools: Object.fromEntries(TOOL_SLUGS.map(s => [s, defaultTool(s)])),
};

async function verifyAdmin(idToken) {
  const adminModule = await import("@/lib/firebaseAdmin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  if (!OWNER_EMAILS.includes(email)) {
    const snap = await adminApp.firestore().doc(CONFIG_DOC).get();
    const emails = snap.exists ? (snap.data().emails || []) : [];
    if (!emails.includes(email)) throw new Error("Unauthorized");
  }
  return adminApp;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idToken = searchParams.get("idToken");
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });
    const adminApp = await verifyAdmin(idToken);
    const snap = await adminApp.firestore().doc(PRICING_DOC).get();
    const stored = snap.exists ? snap.data() : {};

    const tools = {};
    for (const slug of TOOL_SLUGS) {
      tools[slug] = { ...defaultTool(slug), ...(stored.tools?.[slug] || {}) };
    }

    const def = defaultLeadGenPlans();
    const leadGenPlans = {
      starter:   { ...def.starter,   ...(stored.leadGenPlans?.starter   || {}) },
      unlimited: { ...def.unlimited, ...(stored.leadGenPlans?.unlimited || {}) },
    };
    return NextResponse.json({
      pricing: { refundDays: stored.refundDays ?? DEFAULT_PRICING.refundDays, tools, leadGenPlans },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken, pricing } = body;
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 401 });
    const adminApp = await verifyAdmin(idToken);

    const tools = {};
    for (const slug of TOOL_SLUGS) {
      const src = pricing?.tools?.[slug] || {};
      const def = defaultTool(slug);
      tools[slug] = {
        monthly:          Number(src.monthly)          || def.monthly,
        sixMonthEnabled:  src.sixMonthEnabled === true,
        sixMonthDiscount: Math.min(80, Math.max(0, Number(src.sixMonthDiscount) || 0)),
        annualEnabled:    src.annualEnabled === true,
        annualDiscount:   Math.min(80, Math.max(0, Number(src.annualDiscount)   || 0)),
        trialEnabled:     src.trialEnabled !== false,
        trialDays:        Math.min(30, Math.max(1, Number(src.trialDays) || def.trialDays)),
        trialPrice:       Math.max(0, Number(src.trialPrice) ?? def.trialPrice),
      };
    }

    const def = defaultLeadGenPlans();
    const inS = pricing?.leadGenPlans?.starter   || {};
    const inU = pricing?.leadGenPlans?.unlimited || {};
    const leadGenPlans = {
      starter: {
        monthly:           Math.max(0, Number(inS.monthly)           || def.starter.monthly),
        leadQuota:         Math.max(1, Number(inS.leadQuota)         || def.starter.leadQuota),
        walletEnabled:     inS.walletEnabled !== false,
        walletPerLeadCost: Math.max(1, Number(inS.walletPerLeadCost) || def.starter.walletPerLeadCost),
        walletMinTopup:    Math.max(1, Number(inS.walletMinTopup)    || def.starter.walletMinTopup),
      },
      unlimited: {
        enabled:    inU.enabled !== false,
        monthly:    Math.max(0, Number(inU.monthly)    || def.unlimited.monthly),
        gstPercent: Math.min(50, Math.max(0, Number(inU.gstPercent) || def.unlimited.gstPercent)),
      },
    };

    const update = {
      refundDays: Math.min(30, Math.max(0, Number(pricing?.refundDays) || 7)),
      tools,
      leadGenPlans,
      updatedAt: new Date().toISOString(),
    };

    await adminApp.firestore().doc(PRICING_DOC).set(update, { merge: true });
    return NextResponse.json({ success: true, pricing: update });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 403 : 500 });
  }
}