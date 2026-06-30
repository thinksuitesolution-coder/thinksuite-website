const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const TMP_DIR = process.env.TMP_DIR || "/tmp";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
async function updateJob(jobId, data) {
  const admin = global.firebaseAdmin;
  const db = admin.firestore();
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
  const admin = global.firebaseAdmin;
  const bucket = admin.storage().bucket();
  const file = bucket.file(storagePath);
  await file.save(buffer, { contentType, resumable: false });
  await file.makePublic();
  const [meta] = await file.getMetadata();
  return `https://storage.googleapis.com/${bucket.name}/${meta.name}`;
}

/* ── Main pipeline ───────────────────────────────────────────────────────── */
async function runAvatarPipeline({ jobId, photoUrl, audioUrl, uid }) {
  const workDir = path.join(TMP_DIR, `avatar-${jobId}`);
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

  logger.info(`[avatar] Pipeline started: job=${jobId}`);

  await updateJob(jobId, {
    status: "processing",
    progress: 10,
    statusMessage: "Starting lip-sync model...",
  });

  const replicateToken = process.env.REPLICATE_API_TOKEN;
  if (!replicateToken) throw new Error("REPLICATE_API_TOKEN not configured");

  // Step 1: Create Replicate prediction (SadTalker)
  const predRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${replicateToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "3aa3dac9353cc4d6bd62a8f95957bd844003b401d866691598c96d9bb8297a79",
      input: {
        source_image:     photoUrl,
        driven_audio:     audioUrl,
        preprocess:       "full",
        still:            false,
        enhancer:         "gfpgan",
        expression_scale: 1,
        pose_style:       0,
      },
    }),
  });

  if (!predRes.ok) {
    const errText = await predRes.text();
    throw new Error(`Replicate API error ${predRes.status}: ${errText}`);
  }

  const prediction = await predRes.json();
  const predId = prediction.id;
  logger.info(`[avatar] SadTalker prediction created: ${predId}`);

  await updateJob(jobId, { progress: 20, statusMessage: "Lip-sync model queued on Replicate..." });

  // Step 2: Poll every 5 s, max 5 min
  const MAX_WAIT_MS   = 5 * 60 * 1000;
  const POLL_MS       = 5000;
  const startTime     = Date.now();
  let outputUrl       = null;

  while (Date.now() - startTime < MAX_WAIT_MS) {
    await new Promise(r => setTimeout(r, POLL_MS));

    const pollRes  = await fetch(`https://api.replicate.com/v1/predictions/${predId}`, {
      headers: { "Authorization": `Token ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    logger.info(`[avatar] Poll predId=${predId} status=${pollData.status}`);

    if (pollData.status === "succeeded") {
      outputUrl = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
      break;
    }

    if (pollData.status === "failed" || pollData.status === "canceled") {
      throw new Error(`SadTalker ${pollData.status}: ${pollData.error || "unknown error"}`);
    }

    // Ease progress 20% → 82% over the wait window
    const elapsed = Date.now() - startTime;
    const eased   = Math.min(82, 20 + Math.floor((elapsed / MAX_WAIT_MS) * 62));
    await updateJob(jobId, { progress: eased, statusMessage: "Generating lip-sync video..." });
  }

  if (!outputUrl) throw new Error("SadTalker timed out after 5 minutes");

  // Step 3: Download
  await updateJob(jobId, { progress: 85, statusMessage: "Downloading video from Replicate..." });
  const videoPath = path.join(workDir, "avatar.mp4");
  await downloadFile(outputUrl, videoPath);
  const videoBuffer = fs.readFileSync(videoPath);

  // Step 4: Upload to Firebase Storage
  await updateJob(jobId, { progress: 92, statusMessage: "Uploading video to cloud..." });
  const storagePath  = `avatar-videos/${uid}/${jobId}.mp4`;
  const finalVideoUrl = await uploadToStorage(videoBuffer, storagePath, "video/mp4");

  // Step 5: Mark complete include completedAt via serverTimestamp sentinel
  const admin = global.firebaseAdmin;
  await updateJob(jobId, {
    status:        "completed",
    progress:      100,
    statusMessage: "Avatar video ready!",
    videoUrl:      finalVideoUrl,
    completedAt:   admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`[avatar] Pipeline complete: job=${jobId} url=${finalVideoUrl}`);

  // Cleanup temp dir
  try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
}

/* ── POST /avatar/process ────────────────────────────────────────────────── */
router.post("/process", async (req, res) => {
  const { jobId, photoUrl, audioUrl, uid } = req.body;

  if (!jobId || !photoUrl || !audioUrl || !uid) {
    return res.status(400).json({ error: "Missing required: jobId, photoUrl, audioUrl, uid" });
  }

  // Respond immediately Next.js must not time out waiting for us
  res.json({ ok: true, jobId, message: "Avatar processing started" });

  runAvatarPipeline({ jobId, photoUrl, audioUrl, uid }).catch(async (err) => {
    logger.error(`[avatar] Pipeline failed: job=${jobId} err=${err.message}`, { stack: err.stack });
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

/* ── GET /avatar/health ──────────────────────────────────────────────────── */
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "avatar", ts: Date.now() });
});

module.exports = router;
