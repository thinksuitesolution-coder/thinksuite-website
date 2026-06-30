import { getAdminDb, getAdminStorage, firebaseAdmin as admin } from "@/lib/firebaseAdmin";
import { getUserCredits, deductCredits, logError } from "@/lib/firestore-helpers";
import { retryWithBackoff, buildErrorResponse, ERROR_CODES } from "@/lib/retry-utils";
import { checkRateLimit, buildRateLimitResponse } from "@/lib/rate-limiter";

const VALID_VOICE_KEYS = new Set([
  "rachel","bella","elli","domi","josh","adam","sam","arnold","clyde","fin","dave",
  "el-hindi-m","el-hinglish-m","el-hinglish-f",
]);
const VALID_LANGUAGES = new Set(["english","hindi","hinglish"]);

const AVATAR_CREDITS = 10;

/* ── ElevenLabs voice ID map ─────────────────────────────────────────────── */
const EL_VOICE_IDS = {
  "rachel":        "21m00Tcm4TlvDq8ikWAM",
  "bella":         "EXAVITQu4vr4xnSDxMaL",
  "elli":          "MF3mGyEYCl7XYWbV9V6O",
  "domi":          "AZnzlk1XvdvUeBnXmlld",
  "josh":          "TxGEqnHWrfWFTfGW9XjX",
  "adam":          "pNInz6obpgDQGcFmaJgB",
  "sam":           "yoZ06aMxZJJ28mfd3POQ",
  "arnold":        "VR6AewLTigWG4xSOukaG",
  "clyde":         "2EiwWnXFnvU5JabPnv8n",
  "fin":           "D38z5RcWu1voky8WS1ja",
  "dave":          "CYw3kZ02Hs0563khs1Fj",
  "el-hindi-m":    "pqHfZKP75CvOlQylNhV4",
  "el-hinglish-m": "VR6AewLTigWG4xSOukaG",
  "el-hinglish-f": "MF3mGyEYCl7XYWbV9V6O",
};

async function generateElevenLabsTTS(script, voiceKey) {
  const apiKey  = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

  const voiceId = EL_VOICE_IDS[voiceKey] || EL_VOICE_IDS["rachel"];

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${err}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function uploadAudioToFirebase(buffer, uid) {
  const storage     = getAdminStorage();
  const bucket      = storage.bucket();
  const storagePath = `avatar-audio/${uid}/${Date.now()}.mp3`;
  const file        = bucket.file(storagePath);

  await file.save(buffer, { contentType: "audio/mpeg", resumable: false });
  await file.makePublic();

  const [meta] = await file.getMetadata();
  return `https://storage.googleapis.com/${bucket.name}/${meta.name}`;
}

/* ── POST /api/video/generate-avatar ────────────────────────────────────── */
export async function POST(request) {
  let jobId = null;
  let uid   = null;

  try {
    const body = await request.json();
    ({ uid } = body);
    const { photoUrl, script, voiceKey = "rachel", language = "english" } = body;

    // ── Input validation ──────────────────────────────────────────────────
    if (!photoUrl || !script?.trim() || !uid) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "Missing: photoUrl, script, or uid");
      return Response.json(errBody, { status });
    }

    if (!photoUrl.startsWith("https://")) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "photoUrl must be a valid https URL");
      return Response.json(errBody, { status });
    }

    if (voiceKey && !VALID_VOICE_KEYS.has(voiceKey)) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, `Invalid voiceKey: ${voiceKey}`);
      return Response.json(errBody, { status });
    }

    if (language && !VALID_LANGUAGES.has(language)) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, `Invalid language: ${language}`);
      return Response.json(errBody, { status });
    }

    const wordCount = script.trim().split(/\s+/).length;
    if (wordCount > 500) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "Script exceeds 500 words");
      return Response.json(errBody, { status });
    }

    // ── Rate limit: 3 avatar videos per hour per user ─────────────────────
    const rl = await checkRateLimit(uid, "generate-avatar", 3, 3600);
    if (!rl.allowed) return buildRateLimitResponse(rl.resetIn);

    // ── Credit check ──────────────────────────────────────────────────────
    const credits = await getUserCredits(uid);
    if (credits < AVATAR_CREDITS) {
      const { status, body: errBody } = buildErrorResponse(
        ERROR_CODES.INSUFFICIENT_CREDITS,
        `User has ${credits} credits, needs ${AVATAR_CREDITS}`
      );
      return Response.json(errBody, { status });
    }

    // ── Backend availability check ────────────────────────────────────────
    const backendUrl = (process.env.BACKEND_API_URL || "").trim().replace(/\/$/, "");
    if (!backendUrl) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.SERVICE_UNAVAILABLE, "BACKEND_API_URL not configured");
      return Response.json(errBody, { status });
    }

    // ── Step 1: Generate TTS with retry ───────────────────────────────────
    const audioBuffer = await retryWithBackoff(
      () => generateElevenLabsTTS(script.trim(), voiceKey),
      3,
      1500
    ).catch(err => {
      throw Object.assign(err, { _code: ERROR_CODES.ELEVENLABS_ERROR });
    });

    // ── Step 2: Upload audio to Firebase Storage ──────────────────────────
    const audioUrl = await retryWithBackoff(
      () => uploadAudioToFirebase(audioBuffer, uid),
      3,
      2000
    ).catch(err => {
      throw Object.assign(err, { _code: ERROR_CODES.FIREBASE_UPLOAD_FAILED });
    });

    // ── Step 3: Create Firestore job ──────────────────────────────────────
    const adminDb = getAdminDb();
    const jobRef  = await adminDb.collection("ai_videos").add({
      userId:        uid,
      type:          "avatar",
      status:        "processing",
      progress:      5,
      statusMessage: "Audio generated, queuing lip-sync...",
      script:        script.trim().substring(0, 2000),
      photoUrl,
      audioUrl,
      videoUrl:      null,
      language,
      voiceKey,
      creditsUsed:   AVATAR_CREDITS,
      createdAt:     admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
    });
    jobId = jobRef.id;

    // ── Step 4: Call Railway /avatar/process ──────────────────────────────
    const backendRes = await fetch(`${backendUrl}/avatar/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-backend-secret": process.env.BACKEND_SECRET || "",
      },
      body: JSON.stringify({ jobId, photoUrl, audioUrl, uid }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      await adminDb.collection("ai_videos").doc(jobId).update({
        status:        "failed",
        statusMessage: `Backend error: ${errText}`,
        updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
      });
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.RAILWAY_SERVICE_DOWN, errText);
      return Response.json(errBody, { status });
    }

    // ── Step 5: Deduct credits (only after job is successfully queued) ────
    await deductCredits(uid, AVATAR_CREDITS, "avatar_video_generation", jobId);

    return Response.json({ success: true, jobId, status: "processing" });

  } catch (err) {
    console.error("[video/generate-avatar]", err.message);

    // Log to Firestore error_logs
    if (uid) {
      await logError(uid, jobId, "error", err.message, { route: "generate-avatar" });
    }

    // If job was created but something failed after, mark it failed
    if (jobId) {
      try {
        const adminDb = getAdminDb();
        await adminDb.collection("ai_videos").doc(jobId).update({
          status:        "failed",
          error:         err.message,
          statusMessage: "Failed before processing started",
          updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch {}
    }

    const code = err._code || ERROR_CODES.INVALID_REQUEST;
    const { status, body: errBody } = buildErrorResponse(code, err.message);
    return Response.json(errBody, { status });
  }
}
