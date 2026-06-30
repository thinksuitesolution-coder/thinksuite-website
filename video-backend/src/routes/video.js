const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { fetchClipsForSegments } = require("../services/clipFetcher");
const { generateVoiceover } = require("../services/voiceoverGenerator");
const { assembleVideo, downloadFile, updateJob } = require("../services/videoAssembler");

const router = express.Router();
const TMP_DIR = process.env.TMP_DIR || "/tmp/video studio";

/* ── POST /video/process ─────────────────────────────────────────────────── */
// Called by Next.js backend   starts full pipeline async, returns immediately
router.post("/process", async (req, res) => {
  const { jobId, uid, segments, script, voiceKey, voiceProvider, style, orientation, speed, subtitles } = req.body;

  if (!jobId || !uid || !segments || !script) {
    return res.status(400).json({ error: "Missing required fields: jobId, uid, segments, script" });
  }

  // Respond immediately so Next.js doesn't time out
  res.json({ ok: true, jobId, message: "Processing started" });

  // Run pipeline in background
  runPipeline({ jobId, uid, segments, script, voiceKey, voiceProvider, style, orientation, speed, subtitles }).catch(async (err) => {
    logger.error(`Pipeline failed for job ${jobId}: ${err.message}`, { stack: err.stack });
    try {
      await updateJob(jobId, {
        status: "error",
        error: err.message,
        statusMessage: `Failed: ${err.message}`,
      });
    } catch {}
  });
});

/* ── Pipeline: runs in background ───────────────────────────────────────── */
async function runPipeline({ jobId, uid, segments, script, voiceKey, voiceProvider, style, orientation, speed, subtitles }) {
  const workDir = path.join(TMP_DIR, jobId);
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

  logger.info(`Pipeline started: job=${jobId}, segments=${segments.length}, voice=${voiceKey}`);

  // Step 1: Fetch stock clips for all segments
  await updateJob(jobId, { status: "fetching_clips", progress: 5, statusMessage: "Searching for stock footage..." });
  const clipResults = await fetchClipsForSegments(segments, orientation || "landscape");
  logger.info(`Clips fetched: ${clipResults.filter(r => r.clip).length}/${segments.length} found`);

  // Step 2: Generate voiceover
  await updateJob(jobId, { status: "voiceover", progress: 35, statusMessage: "Generating voiceover..." });
  const voicePath = path.join(workDir, "voiceover.mp3");
  await generateVoiceover(script, voiceKey || "english female", voicePath, voiceProvider || "elevenlabs");

  // Step 3: Assemble video
  await assembleVideo({ jobId, uid, segments, clipResults, voicePath, style, orientation, speed, subtitles });
}

/* ── GET /video/health ───────────────────────────────────────────────────── */
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "video backend", ts: Date.now() });
});

/* ── GET /video/clips/search ─────────────────────────────────────────────── */
// Preview clips for a keyword   used by the frontend segment preview step
router.get("/clips/search", async (req, res) => {
  const { q, duration = 6 } = req.query;
  if (!q) return res.status(400).json({ error: "q is required" });

  try {
    const { searchPexels } = require("../services/clipFetcher");
    const results = await searchPexels(q + " India", "landscape", 6);
    res.json({ clips: results.slice(0, 4) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
