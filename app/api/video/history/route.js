import { getAdminDb } from "@/lib/firebaseAdmin";

/* ── GET /api/video/history?uid=xxx ─────────────────────────────────────── */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return Response.json({ error: "uid is required" }, { status: 400 });
  }

  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb
      .collection("ai_videos")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const videos = [];
    snapshot.forEach(doc => {
      const d = doc.data();
      videos.push({
        id:            doc.id,
        type:          d.type,
        status:        d.status,
        videoUrl:      d.videoUrl   || null,
        thumbnailUrl:  d.thumbnailUrl || null,
        script:        d.script?.substring(0, 120) || "",
        language:      d.language,
        duration:      d.duration   || null,
        creditsUsed:   d.creditsUsed || 0,
        createdAt:     d.createdAt?.toDate?.()?.toISOString() || null,
      });
    });

    return Response.json({ videos });

  } catch (err) {
    console.error("[video/history]", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
