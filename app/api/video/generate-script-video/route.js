import { getAIClient } from "@/lib/aiClient";
import { getAdminDb, getAdminStorage, firebaseAdmin as admin } from "@/lib/firebaseAdmin";
import { getUserCredits, deductCredits, logError } from "@/lib/firestore-helpers";
import { retryWithBackoff, buildErrorResponse, ERROR_CODES } from "@/lib/retry-utils";
import { checkRateLimit, buildRateLimitResponse } from "@/lib/rate-limiter";

const VALID_VOICE_KEYS = new Set([
  "rachel","bella","elli","josh","adam","el-hindi-m","el-hinglish-m","el-hinglish-f",
]);
const VALID_LANGUAGES = new Set(["english","hindi","hinglish"]);

const SCRIPT_VIDEO_CREDITS = 15;
const anthropic = getAIClient();

/* ── ElevenLabs voice IDs ────────────────────────────────────────────────── */
const EL_VOICE_IDS = {
  "rachel":        "21m00Tcm4TlvDq8ikWAM",
  "bella":         "EXAVITQu4vr4xnSDxMaL",
  "elli":          "MF3mGyEYCl7XYWbV9V6O",
  "josh":          "TxGEqnHWrfWFTfGW9XjX",
  "adam":          "pNInz6obpgDQGcFmaJgB",
  "el-hindi-m":    "pqHfZKP75CvOlQylNhV4",
  "el-hinglish-m": "VR6AewLTigWG4xSOukaG",
  "el-hinglish-f": "MF3mGyEYCl7XYWbV9V6O",
};

/* ── Claude scene breakdown ──────────────────────────────────────────────── */
async function generateScenes(prompt, language) {
  const langHint = "English";

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: `You are a video script writer. Break the given topic into exactly 5 scenes for a short explainer video. Return ONLY a valid JSON array, no markdown, no explanation. Format: [{ "scene_number": 1, "narration_text": "...", "visual_description": "3 keywords for stock video search", "duration_seconds": 8 }]. Keep each narration under 30 words. Make it engaging and professional. Write narrations in ${langHint}.`,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = msg.content[0].text.trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw Object.assign(new Error("Claude returned invalid JSON"), { _code: ERROR_CODES.INVALID_JSON_FROM_CLAUDE });

  const scenes = JSON.parse(match[0]);
  return scenes.map((s, i) => ({
    scene_number:      i + 1,
    narration_text:    s.narration_text || "",
    visual_description:s.visual_description || "business professional",
    duration_seconds:  Number(s.duration_seconds) || 8,
  }));
}

/* ── ElevenLabs TTS (returns base64 audio url via Firebase Storage) ──────── */
async function generateSceneAudio(text, voiceKey, uid, sceneIdx) {
  const apiKey  = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

  const voiceId = EL_VOICE_IDS[voiceKey] || EL_VOICE_IDS["rachel"];
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs scene ${sceneIdx} error ${res.status}: ${err}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const storage = getAdminStorage();
  const bucket  = storage.bucket();
  const path    = `script-video-audio/${uid}/${Date.now()}_scene${sceneIdx}.mp3`;
  const file    = bucket.file(path);

  await file.save(buffer, { contentType: "audio/mpeg", resumable: false });
  await file.makePublic();
  const [meta] = await file.getMetadata();
  return `https://storage.googleapis.com/${bucket.name}/${meta.name}`;
}

/* ── Pexels video search ─────────────────────────────────────────────────── */
async function searchPexelsVideo(query) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
    { headers: { "Authorization": apiKey } }
  );

  if (!res.ok) return null;
  const data = await res.json();

  const video = data.videos?.[0];
  if (!video) return null;

  // Prefer HD files
  const hdFile = video.video_files?.find(f => f.quality === "hd") || video.video_files?.[0];
  return hdFile?.link || null;
}

/* ── Replicate SDXL image fallback ──────────────────────────────────────── */
async function generateSDXLImage(prompt) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;

  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { "Authorization": `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: `${prompt}, professional photography, high quality, 16:9 aspect ratio`,
        width: 1280,
        height: 720,
        num_outputs: 1,
      },
    }),
  });

  if (!res.ok) return null;
  const pred = await res.json();

  // Poll for completion (max 60s)
  for (let i = 0; i < 12; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { "Authorization": `Token ${token}` },
    });
    const data = await poll.json();
    if (data.status === "succeeded") {
      const out = Array.isArray(data.output) ? data.output[0] : data.output;
      return out || null;
    }
    if (data.status === "failed") return null;
  }
  return null;
}

/* ── POST /api/video/generate-script-video ───────────────────────────────── */
export async function POST(request) {
  let jobId = null;
  let uid   = null;

  try {
    const body = await request.json();
    uid = body.uid;
    const { prompt, language = "english", voiceKey = "rachel" } = body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!prompt?.trim() || !uid) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "Missing: prompt or uid");
      return Response.json(errBody, { status });
    }

    if (prompt.trim().length > 4000) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.INVALID_REQUEST, "Prompt exceeds 4000 characters");
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

    // ── Rate limit: 5 script videos per hour per user ─────────────────────
    const rl = await checkRateLimit(uid, "generate-script-video", 5, 3600);
    if (!rl.allowed) return buildRateLimitResponse(rl.resetIn);

    // ── Credit check ──────────────────────────────────────────────────────
    const credits = await getUserCredits(uid);
    if (credits < SCRIPT_VIDEO_CREDITS) {
      const { status, body: errBody } = buildErrorResponse(
        ERROR_CODES.INSUFFICIENT_CREDITS,
        `User has ${credits} credits, needs ${SCRIPT_VIDEO_CREDITS}`
      );
      return Response.json(errBody, { status });
    }

    const backendUrl = (process.env.BACKEND_API_URL || "").trim().replace(/\/$/, "");
    if (!backendUrl) {
      const { status, body: errBody } = buildErrorResponse(ERROR_CODES.SERVICE_UNAVAILABLE, "BACKEND_API_URL not configured");
      return Response.json(errBody, { status });
    }

    // ── Step 1: Claude → 5 scenes ─────────────────────────────────────────
    const scenes = await retryWithBackoff(
      () => generateScenes(prompt.trim(), language),
      2, 2000
    );

    // ── Create Firestore job ──────────────────────────────────────────────
    const adminDb = getAdminDb();
    const jobRef  = await adminDb.collection("ai_videos").add({
      userId:        uid,
      type:          "script_video",
      status:        "processing",
      progress:      5,
      statusMessage: "Scenes generated, building audio + visuals...",
      script:        prompt.trim().substring(0, 2000),
      scenes:        scenes,
      videoUrl:      null,
      language,
      voiceKey,
      creditsUsed:   SCRIPT_VIDEO_CREDITS,
      createdAt:     admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
    });
    jobId = jobRef.id;

    // ── Step 2: All scenes in parallel audio + footage simultaneously ──────
    await adminDb.collection("ai_videos").doc(jobId).update({
      progress: 12, statusMessage: "Generating all scene audio + footage in parallel...",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const enrichedScenes = await Promise.all(scenes.map(async (scene, i) => {
      const audioUrl = await retryWithBackoff(
        () => generateSceneAudio(scene.narration_text, voiceKey, uid, i + 1),
        3, 1500
      );

      let videoUrl = await searchPexelsVideo(scene.visual_description).catch(() => null);
      let imageUrl = null;
      if (!videoUrl) {
        imageUrl = await generateSDXLImage(scene.visual_description).catch(() => null);
      }

      return {
        sceneNumber:        scene.scene_number,
        narration_text:     scene.narration_text,
        visual_description: scene.visual_description,
        duration:           scene.duration_seconds,
        audioUrl,
        videoUrl:           videoUrl || null,
        imageUrl:           imageUrl || null,
        caption:            scene.narration_text,
      };
    }));

    // ── Step 3: Send to Railway backend for FFmpeg assembly ────────────────
    await adminDb.collection("ai_videos").doc(jobId).update({
      progress: 62, statusMessage: "Sending to video assembly...",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const backendRes = await fetch(`${backendUrl}/video/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-backend-secret": process.env.BACKEND_SECRET || "",
      },
      body: JSON.stringify({
        jobId, uid,
        segments: enrichedScenes.map((s, idx) => ({
          index:       idx,
          text:        s.narration_text,
          duration:    s.duration,
          keywords:    s.visual_description.split(" ").slice(0, 3),
          description: s.visual_description,
          mood:        "professional",
          cameraAngle: "wide shot",
          // Pass pre-fetched URLs so Railway doesn't need to re-fetch
          prebuilt: {
            audioUrl: s.audioUrl,
            videoUrl: s.videoUrl,
            imageUrl: s.imageUrl,
            caption:  s.caption,
          },
        })),
        script:        prompt.trim(),
        voiceKey,
        voiceProvider: "elevenlabs",
        style:         "cinematic",
        orientation:   "landscape",
        speed:         "1",
        subtitles:     true,
      }),
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

    // ── Step 4: Deduct credits (after successfully queued) ────────────────
    await deductCredits(uid, SCRIPT_VIDEO_CREDITS, "script_video_generation", jobId);

    return Response.json({
      success: true,
      jobId,
      status: "processing",
      scenes: enrichedScenes.map(s => ({
        sceneNumber:        s.sceneNumber,
        narration_text:     s.narration_text,
        visual_description: s.visual_description,
        duration:           s.duration,
        hasVideo:           !!s.videoUrl,
        hasImage:           !!s.imageUrl,
      })),
    });

  } catch (err) {
    console.error("[video/generate-script-video]", err.message);

    if (uid) await logError(uid, jobId, "error", err.message, { route: "generate-script-video" });

    if (jobId) {
      try {
        const adminDb = getAdminDb();
        await adminDb.collection("ai_videos").doc(jobId).update({
          status: "failed", error: err.message,
          statusMessage: "Failed during setup",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch {}
    }

    const code = err._code || ERROR_CODES.INVALID_REQUEST;
    const { status, body: errBody } = buildErrorResponse(code, err.message);
    return Response.json(errBody, { status });
  }
}
