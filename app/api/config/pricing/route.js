import { NextResponse } from "next/server";

const PRICING_DOC = "config/pricing";
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

function buildDefaults() {
  const tools = {};
  for (const slug of TOOL_SLUGS) tools[slug] = defaultTool(slug);
  return { tools, refundDays: 7, leadGenPlans: defaultLeadGenPlans() };
}

export async function GET() {
  try {
    const adminModule = await import("@/lib/firebaseAdmin");
    const adminApp = adminModule.default();
    if (!adminApp) return NextResponse.json(buildDefaults());
    const snap   = await adminApp.firestore().doc(PRICING_DOC).get();
    const stored = snap.exists ? snap.data() : {};
    const tools  = {};
    for (const slug of TOOL_SLUGS) {
      tools[slug] = { ...defaultTool(slug), ...(stored.tools?.[slug] || {}) };
    }
    const def = defaultLeadGenPlans();
    const leadGenPlans = {
      starter: { ...def.starter,   ...(stored.leadGenPlans?.starter   || {}) },
      unlimited: { ...def.unlimited, ...(stored.leadGenPlans?.unlimited || {}) },
    };
    return NextResponse.json(
      { tools, refundDays: stored.refundDays ?? 7, leadGenPlans },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
    );
  } catch {
    return NextResponse.json(buildDefaults());
  }
}
