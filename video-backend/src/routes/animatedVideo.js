const express = require("express");
const fetch   = require("node-fetch");
const fs      = require("fs");
const path    = require("path");

const router  = express.Router();
const TMP_DIR = process.env.TMP_DIR || "/tmp";

/* ── Replicate model endpoints ────────────────────────────────────────────────
 *  Both T2V and I2V use Luma Dream Machine (best open quality, no version hash)
 *  Endpoint: /v1/models/luma/dream-machine/predictions
 * ──────────────────────────────────────────────────────────────────────────── */
const LUMA_ENDPOINT = "https://api.replicate.com/v1/models/luma/dream-machine/predictions";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
async function updateJob(jobId, data) {
  const admin = global.firebaseAdmin;
  const db    = admin.firestore();
  await db.collection("ai_videos").doc(jobId).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return destPath;
}

async function uploadToStorage(buffer, storagePath, contentType = "video/mp4") {
  const admin  = global.firebaseAdmin;
  const bucket = admin.storage().bucket();
  const file   = bucket.file(storagePath);
  await file.save(buffer, { contentType, resumable: false });
  await file.makePublic();
  const [meta] = await file.getMetadata();
  return `https://storage.googleapis.com/${bucket.name}/${meta.name}`;
}

/* ── Replicate polling (max 10 min for video gen) ───────────────────────── */
async function pollReplicate(predId, token, maxMs = 10 * 60 * 1000, intervalMs = 6000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    await new Promise(r => setTimeout(r, intervalMs));
    const res  = await fetch(`https://api.replicate.com/v1/predictions/${predId}`, {
      headers: { "Authorization": `Token ${token}` },
    });
    const data = await res.json();
    logger.info(`[animatedVideo] Replicate poll predId=${predId} status=${data.status}`);
    if (data.status === "succeeded") return data;
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(`Replicate ${data.status}: ${data.error || "unknown error"}`);
    }
  }
  throw new Error("Replicate timed out after 10 minutes");
}

/* ── Text-to-Video pipeline (Luma Dream Machine) ────────────────────────── */
async function runTextToVideoPipeline({ jobId, uid, prompt, duration, style }) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not configured");

  logger.info(`[animatedVideo] T2V pipeline start: job=${jobId}`);
  await updateJob(jobId, { progress: 10, statusMessage: "Sending to Luma Dream Machine..." });

  const styleKeywords = {
    cinematic:  ", cinematic, film grain, professional lighting, 4K",
    anime:      ", anime style, vibrant colors, hand-drawn look",
    realistic:  ", photorealistic, high detail, natural lighting",
    "3d":       ", 3D render, digital art, perfect lighting",
    abstract:   ", abstract art, surreal, colorful",
    cartoon:    ", cartoon style, clean lines, bright colors",
  };
  const enrichedPrompt = `${prompt}${styleKeywords[style] || ""}`;

  const predRes = await fetch(LUMA_ENDPOINT, {
    method: "POST",
    headers: { "Authorization": `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        prompt:       enrichedPrompt,
        loop:         false,
        aspect_ratio: "16:9",
      },
    }),
  });

  if (!predRes.ok) {
    const err = await predRes.text();
    throw new Error(`Luma Dream Machine T2V error ${predRes.status}: ${err}`);
  }

  const pred = await predRes.json();
  await updateJob(jobId, { progress: 20, statusMessage: "Luma Dream Machine is generating your video..." });

  const result    = await pollReplicate(pred.id, token);
  const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;
  if (!outputUrl) throw new Error("No output URL from Luma Dream Machine");

  await updateJob(jobId, { progress: 82, statusMessage: "Downloading generated video..." });

  const workDir   = path.join(TMP_DIR, `anim-${jobId}`);
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
  const videoPath = path.join(workDir, "output.mp4");

  await downloadFile(outputUrl, videoPath);
  const videoBuffer = fs.readFileSync(videoPath);

  await updateJob(jobId, { progress: 90, statusMessage: "Uploading video to cloud..." });

  const storagePath   = `animated-videos/${uid}/${jobId}.mp4`;
  const finalVideoUrl = await uploadToStorage(videoBuffer, storagePath);

  const admin = global.firebaseAdmin;
  await updateJob(jobId, {
    status:        "completed",
    progress:      100,
    statusMessage: "Animated video ready!",
    videoUrl:      finalVideoUrl,
    completedAt:   admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`[animatedVideo] T2V complete: job=${jobId} url=${finalVideoUrl}`);
  try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
}

/* ── Image-to-Video pipeline (Luma Dream Machine) ───────────────────────── */
async function runImageToVideoPipeline({ jobId, uid, imageUrl, prompt, duration }) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not configured");

  logger.info(`[animatedVideo] I2V pipeline start: job=${jobId}`);
  await updateJob(jobId, { progress: 10, statusMessage: "Loading image for Luma animation..." });

  const predRes = await fetch(LUMA_ENDPOINT, {
    method: "POST",
    headers: { "Authorization": `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        prompt:           prompt || "smooth natural animation, flowing motion, cinematic quality",
        start_image_url:  imageUrl,
        loop:             false,
        aspect_ratio:     "16:9",
      },
    }),
  });

  if (!predRes.ok) {
    const err = await predRes.text();
    throw new Error(`Luma Dream Machine I2V error ${predRes.status}: ${err}`);
  }

  const pred = await predRes.json();
  await updateJob(jobId, { progress: 20, statusMessage: "Luma is animating your image..." });

  const result    = await pollReplicate(pred.id, token);
  const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;
  if (!outputUrl) throw new Error("No output URL from Luma Dream Machine");

  await updateJob(jobId, { progress: 82, statusMessage: "Downloading animated video..." });

  const workDir   = path.join(TMP_DIR, `anim-${jobId}`);
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
  const videoPath = path.join(workDir, "output.mp4");

  await downloadFile(outputUrl, videoPath);
  const videoBuffer = fs.readFileSync(videoPath);

  await updateJob(jobId, { progress: 90, statusMessage: "Uploading to cloud..." });

  const storagePath   = `animated-videos/${uid}/${jobId}.mp4`;
  const finalVideoUrl = await uploadToStorage(videoBuffer, storagePath);

  const admin = global.firebaseAdmin;
  await updateJob(jobId, {
    status:        "completed",
    progress:      100,
    statusMessage: "Animated video ready!",
    videoUrl:      finalVideoUrl,
    completedAt:   admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`[animatedVideo] I2V complete: job=${jobId} url=${finalVideoUrl}`);
  try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
}

/* ── POST /animated/process ─────────────────────────────────────────────── */
router.post("/process", async (req, res) => {
  const { jobId, uid, type, prompt, imageUrl, duration = 5, style = "realistic" } = req.body;

  if (!jobId || !uid || !type) {
    return res.status(400).json({ error: "Missing required: jobId, uid, type" });
  }

  if (type === "text_to_video" && !prompt) {
    return res.status(400).json({ error: "prompt required for text_to_video" });
  }
  if (type === "image_to_video" && !imageUrl) {
    return res.status(400).json({ error: "imageUrl required for image_to_video" });
  }

  // Respond immediately so Next.js doesn't time out
  res.json({ ok: true, jobId, message: "Animated video processing started" });

  const runPipeline = type === "text_to_video"
    ? () => runTextToVideoPipeline({ jobId, uid, prompt, duration, style })
    : () => runImageToVideoPipeline({ jobId, uid, imageUrl, prompt, duration });

  runPipeline().catch(async (err) => {
    logger.error(`[animatedVideo] Pipeline failed: job=${jobId} err=${err.message}`);
    try {
      await updateJob(jobId, {
        status:        "failed",
        error:         err.message,
        statusMessage: `Failed: ${err.message}`,
        progress:      0,
      });
    } catch {}
  });
});

/* ── GET /animated/health ───────────────────────────────────────────────── */
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "animated-video", ts: Date.now() });
});

module.exports = router;
