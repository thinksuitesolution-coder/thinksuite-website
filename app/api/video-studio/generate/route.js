import { getAdminDb, firebaseAdmin as admin } from "@/lib/firebaseAdmin";

/* ── POST /api/video-studio/generate ────────────────────────────────────── */
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, segments, script, voiceKey, voiceProvider, style, duration, orientation, language, speed, subtitles } = body;

    if (!uid || !segments?.length || !script) {
      return Response.json({ error: "Missing required: uid, segments, script" }, { status: 400 });
    }

    const adminDb = getAdminDb();

    // Create job document in Firestore
    const jobRef = await adminDb.collection("video-jobs").add({
      uid,
      status: "queued",
      progress: 0,
      statusMessage: "Job queued, starting soon...",
      script: script.substring(0, 2000),
      segments,
      voiceKey: voiceKey || "english-female",
      voiceProvider: voiceProvider || "elevenlabs",
      style: style || "cinematic",
      duration: Number(duration) || 60,
      orientation: orientation || "landscape",
      language: language || "english",
      speed: speed || "1",
      subtitles: !!subtitles,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const jobId = jobRef.id;

    // Verify backend is configured
    let backendUrl = (process.env.BACKEND_API_URL || "").trim();
    if (backendUrl && !/^https?:\/\//i.test(backendUrl)) {
      backendUrl = `https://${backendUrl}`;
    }
    if (!backendUrl) {
      await adminDb.collection("video-jobs").doc(jobId).update({
        status: "error",
        error: "BACKEND_API_URL not configured. Please deploy the Railway backend and set the env var.",
        statusMessage: "Backend not configured",
      });
      return Response.json({
        error: "Video backend not configured. Set BACKEND_API_URL in Vercel env vars.",
        jobId,
      }, { status: 503 });
    }

    // Call Railway backend - fire and forget (Railway processes async)
    const backendRes = await fetch(`${backendUrl}/video/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-backend-secret": process.env.BACKEND_SECRET || "",
      },
      body: JSON.stringify({ jobId, uid, segments, script, voiceKey, voiceProvider: voiceProvider || "elevenlabs", style, orientation: orientation || "landscape", speed: speed || "1", subtitles: !!subtitles }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      await adminDb.collection("video-jobs").doc(jobId).update({
        status: "error",
        error: `Backend error: ${errText}`,
        statusMessage: "Failed to start video processing",
      });
      return Response.json({ error: `Backend error: ${errText}` }, { status: 502 });
    }

    return Response.json({ jobId, status: "queued" });

  } catch (err) {
    console.error("[video-studio/generate]", err.message);
    return Response.json({ error: err.message || "Failed to start generation" }, { status: 500 });
  }
}
