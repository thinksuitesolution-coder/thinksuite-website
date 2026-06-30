const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const TMP_DIR = process.env.TMP_DIR || "/tmp/video studio";

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

/* â”€â”€ Output dimensions per orientation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const DIMS = {
  landscape: { w: 1280, h: 720  },
  square:    { w: 720,  h: 720  },
  vertical:  { w: 720,  h: 1280 },
};

/* â”€â”€ Download file to disk (streamed) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function downloadFile(url, destPath) {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error(`Invalid download URL: ${url}`);
  }
  const res = await fetch(url, {
    headers: { "User Agent": "Mozilla/5.0 (compatible; Thinksuite/1.0)" },
    redirect: "follow",
    timeout: 30_000,
  });
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(destPath);
    const onError = (err) => { fileStream.destroy(); reject(err); };
    res.body.pipe(fileStream);
    res.body.on("error", onError);
    fileStream.on("finish", resolve);
    fileStream.on("error", onError);
  });
  return destPath;
}

/* â”€â”€ Run ffmpeg with kill timeout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function runWithTimeout(cmd, timeoutMs, label) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, val) => { if (!settled) { settled = true; clearTimeout(timer); fn(val); } };
    const timer = setTimeout(() => {
      try { cmd.kill("SIGKILL"); } catch {}
      finish(reject, new Error(`${label} timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);
    cmd.on("end", () => finish(resolve)).on("error", (err) => finish(reject, err)).run();
  });
}

/* â”€â”€ Trim a clip to exact duration (with optional speed) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function trimClip(inputPath, outputPath, duration, dims, speed = 1) {
  const { w, h } = dims;
  const speedNum = parseFloat(speed) || 1;
  // Capture more raw footage so after speedup we still have `duration` seconds
  const rawDuration = Math.min(duration * speedNum, 120);
  const vf = speedNum > 1
    ? `scale=${w}:${h}:flags=bilinear,setpts=${(1 / speedNum).toFixed(4)}*PTS`
    : `scale=${w}:${h}:flags=bilinear`;
  const cmd = ffmpeg(inputPath)
    .setStartTime(0)
    .setDuration(rawDuration)
    .outputOptions([
      " c:v libx264", " preset ultrafast", " crf 26",
      ` vf ${vf}`,
      " an", " threads 2", " movflags +faststart",
    ])
    .output(outputPath);
  return runWithTimeout(cmd, 90_000, "trimClip").then(() => outputPath);
}

/* â”€â”€ Color placeholder clip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function createPlaceholderClip(outputPath, duration, text = "Scene", dims) {
  const { w, h } = dims;
  const safeText = text.replace(/'/g, "").substring(0, 30);
  const cmd = ffmpeg()
    .input(`color=c=0x0f2640:s=${w}x${h}:r=30`)
    .inputFormat("lavfi")
    .complexFilter([
      `[0:v]drawtext=text='${safeText}':fontsize=36:fontcolor=white:x=(w text_w)/2:y=(h text_h)/2:box=1:boxcolor=black@0.5[v]`,
    ])
    .outputOptions([" c:v libx264", " t", String(duration), " preset ultrafast", " crf 28", " threads 2"])
    .output(outputPath);
  return runWithTimeout(cmd, 60_000, "createPlaceholderClip").then(() => outputPath);
}

/* â”€â”€ Concatenate clips (video only   audio added later by mixAudio) â”€â”€â”€â”€â”€â”€â”€â”€ */
function concatClips(clipPaths, outputPath) {
  return new Promise((resolve, reject) => {
    const listPath = path.join(TMP_DIR, `concat_${uuidv4()}.txt`);
    const listContent = clipPaths.map(p => `file '${p.replace(/\\/g, "/")}'`).join("\n");
    fs.writeFileSync(listPath, listContent);
    const cmd = ffmpeg()
      .input(listPath)
      .inputOptions([" f concat", " safe 0"])
      .outputOptions([" c:v copy", " an"])
      .output(outputPath);
    return runWithTimeout(cmd, 120_000, "concatClips")
      .then(() => { try { fs.unlinkSync(listPath); } catch {} resolve(outputPath); })
      .catch((err) => { try { fs.unlinkSync(listPath); } catch {} reject(err); });
  });
}

/* â”€â”€ Mix voiceover + optional background music â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// videoPath is video only (no audio stream)   clips have  an applied
function mixAudio(videoPath, voicePath, outputPath, musicPath = null) {
  const cmd = ffmpeg(videoPath);
  cmd.input(voicePath);
  if (musicPath && fs.existsSync(musicPath)) {
    cmd.input(musicPath);
    cmd.complexFilter([
      "[2:a]volume=0.15,aloop=loop= 1:size=2e+09[music]",
      "[1:a][music]amix=inputs=2:duration=first:weights=1 0.15[audio]",
    ]);
    cmd.outputOptions([
      " map 0:v", " map [audio]", " c:v copy", " c:a aac",
      " b:a 96k", " threads 2", " shortest", " movflags +faststart",
    ]);
  } else {
    cmd.outputOptions([
      " map 0:v", " map 1:a", " c:v copy", " c:a aac",
      " b:a 96k", " threads 2", " shortest", " movflags +faststart",
    ]);
  }
  cmd.output(outputPath);
  return runWithTimeout(cmd, 120_000, "mixAudio").then(() => outputPath);
}

/* â”€â”€ Build subtitle drawtext filter string â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function buildSubtitleFilter(segments) {
  if (!segments?.length) return "";
  let t = 0;
  const draws = segments.map(seg => {
    const start = t;
    const end   = t + (seg.duration || 5);
    t = end;
    const txt = (seg.text || "")
      .replace(/['"\\[\]:]/g, " ")
      .replace(/,/g, " ")
      .substring(0, 55)
      .trim();
    if (!txt) return null;
    return `drawtext=text='${txt}':fontsize=15:fontcolor=white:x=(w text_w)/2:y=h th 45:box=1:boxcolor=black@0.65:boxborderw=8:enable='between(t\\,${start}\\,${end})'`;
  }).filter(Boolean);
  return draws.join(",");
}

/* â”€â”€ Final encode with optional watermark + subtitles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function finalEncode(inputPath, outputPath, dims, watermarkPath, subtitleFilter) {
  const { w, h } = dims;
  const cmd = ffmpeg(inputPath);
  const baseOpts = [
    " c:v libx264", " preset fast", " crf 24", " c:a aac",
    " b:a 96k", " threads 2", " movflags +faststart", " r 30",
  ];

  if (watermarkPath && fs.existsSync(watermarkPath)) {
    cmd.input(watermarkPath);
    const filters = [
      `[0:v]scale=${w}:${h}:flags=bilinear[sc]`,
      `[1:v]scale=iw*min(110/iw\\,110/ih):ih*min(110/iw\\,110/ih)[wm]`,
      subtitleFilter
        ? `[sc][wm]overlay=W w 20:H h 20[ov];[ov]${subtitleFilter},format=yuv420p[v]`
        : `[sc][wm]overlay=W w 20:H h 20,format=yuv420p[v]`,
    ];
    cmd.complexFilter(filters);
    cmd.outputOptions([...baseOpts, " map [v]", " map 0:a"]);
  } else {
    let vf = `scale=${w}:${h}:flags=bilinear`;
    if (subtitleFilter) vf += `,${subtitleFilter}`;
    vf += `,format=yuv420p`;
    cmd.outputOptions([...baseOpts, ` vf ${vf}`]);
  }

  cmd.output(outputPath);
  return runWithTimeout(cmd, 180_000, "finalEncode");
}

/* â”€â”€ Upload to Firebase Storage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function uploadToFirebase(localPath, jobId, uid) {
  const admin = global.firebaseAdmin;
  const bucket = admin.storage().bucket();
  const fileName = `video studio/${uid}/${jobId}/output.mp4`;
  await bucket.upload(localPath, {
    destination: fileName,
    metadata: { contentType: "video/mp4", cacheControl: "public, max age=3600" },
  });
  const [url] = await bucket.file(fileName).getSignedUrl({
    action: "read",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  logger.info(`Video uploaded: ${fileName}`);
  return url;
}

/* â”€â”€ Update Firestore job â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function updateJob(jobId, data) {
  const admin = global.firebaseAdmin;
  await admin.firestore().collection("video jobs").doc(jobId).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/* â”€â”€ Main pipeline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function assembleVideo({ jobId, uid, segments, clipResults, voicePath, style, orientation, speed, subtitles }) {
  const workDir = path.join(TMP_DIR, jobId);
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

  const dims = DIMS[orientation] || DIMS.landscape;
  const speedNum = parseFloat(speed) || 1;
  const finalClipPaths = [];

  try {
    await updateJob(jobId, { status: "downloading", progress: 10, statusMessage: "Downloading stock footage..." });

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const clipResult = clipResults[i];

      await updateJob(jobId, {
        progress: 10 + Math.floor((i / segments.length) * 30),
        statusMessage: `Preparing clip ${i + 1}/${segments.length}...`,
      });

      const rawPath     = path.join(workDir, `raw_${i}.mp4`);
      const trimmedPath = path.join(workDir, `clip_${i}.mp4`);

      if (clipResult?.clip?.url) {
        try {
          await downloadFile(clipResult.clip.url, rawPath);
          await trimClip(rawPath, trimmedPath, seg.duration, dims, speedNum);
          try { fs.unlinkSync(rawPath); } catch {}
          finalClipPaths.push(trimmedPath);
        } catch (err) {
          try { fs.unlinkSync(rawPath); } catch {}
          logger.warn(`Clip ${i} failed: ${err.message}   using placeholder`);
          const ph = path.join(workDir, `placeholder_${i}.mp4`);
          await createPlaceholderClip(ph, seg.duration, seg.keywords?.[0] || `Scene ${i + 1}`, dims);
          finalClipPaths.push(ph);
        }
      } else {
        const ph = path.join(workDir, `placeholder_${i}.mp4`);
        await createPlaceholderClip(ph, seg.duration, seg.keywords?.[0] || `Scene ${i + 1}`, dims);
        finalClipPaths.push(ph);
      }
    }

    await updateJob(jobId, { progress: 45, statusMessage: "Assembling video timeline..." });
    const rawVideoPath = path.join(workDir, "raw_video.mp4");
    await concatClips(finalClipPaths, rawVideoPath);

    await updateJob(jobId, { progress: 65, statusMessage: "Adding voiceover..." });
    const withAudioPath = path.join(workDir, "with_audio.mp4");
    const musicPath = path.join(__dirname, "../../assets/music", getMusicForStyle(style));
    await mixAudio(rawVideoPath, voicePath, withAudioPath, musicPath);

    await updateJob(jobId, { progress: 80, statusMessage: "Final encoding..." });
    const finalPath = path.join(workDir, "final.mp4");
    const subtitleFilter = subtitles ? buildSubtitleFilter(segments) : "";
    await finalEncode(withAudioPath, finalPath, dims, null, subtitleFilter);
    try { fs.unlinkSync(withAudioPath); } catch {}
    try { fs.unlinkSync(rawVideoPath); } catch {}

    await updateJob(jobId, { progress: 90, statusMessage: "Uploading video..." });
    const videoUrl = await uploadToFirebase(finalPath, jobId, uid);

    await updateJob(jobId, {
      status: "done", progress: 100, statusMessage: "Video ready!",
      videoUrl, completedAt: global.firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info(`Job ${jobId} done. URL: ${videoUrl}`);
    return videoUrl;

  } finally {
    setTimeout(() => {
      try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
    }, 10 * 60 * 1000);
  }
}

/* â”€â”€ Music per style â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function getMusicForStyle(style) {
  const map = { cinematic: "cinematic.mp3", corporate: "corporate.mp3", casual: "upbeat.mp3", educational: "corporate.mp3", reel: "upbeat.mp3" };
  return map[style] || "cinematic.mp3";
}

module.exports = { assembleVideo, downloadFile, uploadToFirebase, updateJob };
