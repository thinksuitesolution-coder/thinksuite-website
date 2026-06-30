import { getAdminDb } from "@/lib/firebaseAdmin";

/* ── GET /api/video/status/[jobId] ───────────────────────────────────────── */
export async function GET(request, { params }) {
  const { jobId } = params;

  if (!jobId) {
    return Response.json({ error: "jobId is required" }, { status: 400 });
  }

  try {
    const adminDb = getAdminDb();
    const doc = await adminDb.collection("ai_videos").doc(jobId).get();

    if (!doc.exists) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    const data = doc.data();

    return Response.json({
      jobId,
      status:        data.status,
      progress:      data.progress  || 0,
      statusMessage: data.statusMessage || "",
      videoUrl:      data.videoUrl  || null,
      error:         data.error     || null,
      type:          data.type,
      createdAt:     data.createdAt?.toDate?.()?.toISOString() || null,
    });

  } catch (err) {
    console.error("[video/status]", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
