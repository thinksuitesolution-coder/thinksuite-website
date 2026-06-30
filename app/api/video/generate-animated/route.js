import { getAdminDb, firebaseAdmin as admin } from "@/lib/firebaseAdmin";
import { getUserCredits, deductCredits, logError } from "@/lib/firestore-helpers";
import { buildErrorResponse, ERROR_CODES } from "@/lib/retry-utils";
import { checkRateLimit, buildRateLimitResponse } from "@/lib/rate-limiter";

const ANIMATED_CREDITS = 20;

const VALID_TYPES    = new Set(["text_to_video", "image_to_video"]);
const VALID_STYLES   = new Set(["realistic", "cinematic", "anime", "3d", "abstract", "cartoon"]);
const VALID_DURATION = [2, 3, 4, 5, 8, 10, 15];

/* ── POST /api/video/generate-animated ──────────────────────────────────── */
export async function POST(request) {
  let jobId = null;
  let uid   = null;

  try {
    const body = await request.json();
    uid = body.uid;
    const {
      type     = "text_to_video",
      prompt   = "",
      imageUrl = null,
      duration = 5,
      style    = "realistic",
    } = body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!uid) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "Missing: uid");
      return Response.json(errBody, { status });
    }

    if (!VALID_TYPES.has(type)) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, `Invalid type: ${type}`);
      return Response.json(errBody, { status });
    }

    if (type === "text_to_video" && !prompt?.trim()) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "prompt required for text_to_video");
      return Response.json(errBody, { status });
    }

    if (type === "image_to_video" && !imageUrl) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "imageUrl required for image_to_video");
      return Response.json(errBody, { status });
    }

    if (prompt && prompt.trim().length > 1000) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "Prompt too long (max 1000 chars)");
      return Response.json(errBody, { status });
    }

    if (style && !VALID_STYLES.has(style)) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, `Invalid style: ${style}`);
      return Response.json(errBody, { status });
    }

    // ── Rate limit: 2 animated videos per hour ────────────────────────────
    const rl = await checkRateLimit(uid, "generate-animated", 2, 3600);
    if (!rl.allowed) return buildRateLimitResponse(rl.resetIn);

    // ── Credit check ──────────────────────────────────────────────────────
    const credits = await getUserCredits(uid);
    if (credits < ANIMATED_CREDITS) {
      const { status, body: errBody } = buildErrorResponse(
        ERROR_CODES.INSUFFICIENT_CREDITS,
        `User has ${credits} credits, needs ${ANIMATED_CREDITS}`
      );
      return Response.json(errBody, { status });
    }

    // ── Backend availability check ────────────────────────────────────────
    const backendUrl = (process.env.BACKEND_API_URL || "").trim().replace(/\/$/, "");
    if (!backendUrl) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.SERVICE_UNAVAILABLE, "BACKEND_API_URL not configured");
      return Response.json(errBody, { status });
    }

    // ── Create Firestore job ──────────────────────────────────────────────
    const adminDb = getAdminDb();
    const jobRef  = await adminDb.collection("ai_videos").add({
      userId:        uid,
      type:          type,
      status:        "processing",
      progress:      5,
      statusMessage: "Starting animated video generation...",
      prompt:        prompt?.trim().substring(0, 1000) || null,
      imageUrl:      imageUrl || null,
      duration,
      style,
      videoUrl:      null,
      creditsUsed:   ANIMATED_CREDITS,
      createdAt:     admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
    });
    jobId = jobRef.id;

    // ── Call Railway /animated/process (responds immediately) ─────────────
    const backendRes = await fetch(`${backendUrl}/animated/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-backend-secret": process.env.BACKEND_SECRET || "",
      },
      body: JSON.stringify({ jobId, uid, type, prompt: prompt?.trim(), imageUrl, duration, style }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      await adminDb.collection("ai_videos").doc(jobId).update({
        status: "failed", statusMessage: `Backend error: ${errText}`,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.RAILWAY_SERVICE_DOWN, errText);
      return Response.json(errBody, { status });
    }

    // ── Deduct credits after successful queue ─────────────────────────────
    await deductCredits(uid, ANIMATED_CREDITS, "animated_video_generation", jobId);

    return Response.json({ success: true, jobId, status: "processing", type, duration, style });

  } catch (err) {
    console.error("[video/generate-animated]", err.message);

    if (uid) await logError(uid, jobId, "error", err.message, { route: "generate-animated" });

    if (jobId) {
      try {
        const adminDb = getAdminDb();
        await adminDb.collection("ai_videos").doc(jobId).update({
          status: "failed", error: err.message,
          statusMessage: "Failed before processing started",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch {}
    }

    const code = err._code || ERROR_CODES.INVALID_REQUEST;
    const { status, body: errBody } = buildErrorResponse(code, err.message);
    return Response.json(errBody, { status });
  }
}
