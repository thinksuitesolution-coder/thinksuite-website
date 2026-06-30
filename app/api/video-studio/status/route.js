import { getAdminDb } from "@/lib/firebaseAdmin";

/* ── GET /api/video-studio/status?jobId=xxx ──────────────────────────────── */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return Response.json({ error: "jobId required" }, { status: 400 });
  }

  try {
    const adminDb = getAdminDb();
    const doc = await adminDb.collection("video-jobs").doc(jobId).get();

    if (!doc.exists) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    const data = doc.data();
    return Response.json({
      jobId,
      status: data.status,
      progress: data.progress || 0,
      statusMessage: data.statusMessage || "",
      videoUrl: data.videoUrl || null,
      error: data.error || null,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    });

  } catch (err) {
    console.error("[video-studio/status]", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
