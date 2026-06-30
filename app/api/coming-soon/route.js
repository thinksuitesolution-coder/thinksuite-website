import { NextResponse } from "next/server";

const DEFAULT_SLUGS = [
  "seo", "imagestudio", "voice", "video", "ai-video-studio",
  "animated-video", "studio", "seo-analytics",
  "prompt-maker", "vision-ai",
];

async function getAdminApp() {
  const adminModule = await import("@/lib/firebase-admin");
  const adminApp = adminModule.default();
  if (!adminApp) throw new Error("Firebase Admin not configured");
  return adminApp;
}

export async function GET() {
  try {
    const adminApp = await getAdminApp();
    const snap = await adminApp.firestore().doc("config/comingSoon").get();
    const slugs = snap.exists ? (snap.data().slugs ?? DEFAULT_SLUGS) : DEFAULT_SLUGS;
    return NextResponse.json({ slugs });
  } catch (e) {
    console.error("[coming-soon GET]", e.message);
    return NextResponse.json({ slugs: DEFAULT_SLUGS });
  }
}
