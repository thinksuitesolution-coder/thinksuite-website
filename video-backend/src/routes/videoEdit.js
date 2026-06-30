const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');
const { applyEdit, getVideoDuration, mergeEdits, getSessionDir, OUTPUT_DIR, ensureDir } = require('../services/ffmpegEditService');
const { parseEditCommand } = require('../services/claudeEditService');

const router = express.Router();

/* â”€â”€ Multer: store uploaded video in /tmp/video edit/uploads/<sessionId>/input.mp4 â”€â”€ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sessionId  = uuidv4();
    req.sessionId    = sessionId;
    const sessionDir = getSessionDir(sessionId);
    cb(null, sessionDir);
  },
  filename: (req, file, cb) => cb(null, 'input.mp4'),
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (req, file, cb) => {
    const ok = ['video/mp4','video/quicktime','video/x-msvideo','video/webm','video/mpeg'];
    if (ok.includes(file.mimetype) || /\.(mp4|mov|avi|webm|mkv)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

/* â”€â”€ POST /api/upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video file provided' });
  const sessionId = req.sessionId;
  res.json({
    sessionId,
    currentFile: 'input.mp4',
    previewUrl:  `/api/preview/${sessionId}/input.mp4`,
    message:     'Video uploaded successfully',
  });
});

/* â”€â”€ POST /api/edit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
router.post('/edit', async (req, res) => {
  const { command, sessionId, currentFile, ffmpeg_args, description } = req.body;

  if (!sessionId || !currentFile) {
    return res.status(400).json({ error: 'sessionId and currentFile are required' });
  }

  const sessionDir  = getSessionDir(sessionId);
  const inputPath   = path.join(sessionDir, currentFile);

  if (!fs.existsSync(inputPath)) {
    return res.status(404).json({ error: 'Video file not found. Please re upload.' });
  }

  try {
    const outputFilename = `edit_${Date.now()}.mp4`;
    const outputPath     = path.join(sessionDir, outputFilename);

    /* Direct ffmpeg_args (manual controls)   skip Thinksuite */
    if (ffmpeg_args) {
      await applyEdit(inputPath, outputPath, ffmpeg_args);
      if (!fs.existsSync(outputPath)) throw new Error('Output file not created.');
      return res.json({
        success:        true,
        newFile:        outputFilename,
        previewUrl:     `/api/preview/${sessionId}/${outputFilename}`,
        description:    description || 'Manual edit applied',
        timestampStart: null,
        timestampEnd:   null,
        ffmpegArgs:     ffmpeg_args,
      });
    }

    /* AI command   ask Thinksuite */
    if (!command) return res.status(400).json({ error: 'command or ffmpeg_args is required' });

    const duration = await getVideoDuration(inputPath);
    const parsed   = await parseEditCommand(command, duration);

    if (!parsed.ffmpeg_args) {
      return res.status(422).json({
        error:   'unclear_command',
        message: parsed.description || 'Command not understood. Please rephrase.',
      });
    }

    await applyEdit(inputPath, outputPath, parsed.ffmpeg_args);
    if (!fs.existsSync(outputPath)) throw new Error('FFmpeg ran but output not created.');

    res.json({
      success:        true,
      newFile:        outputFilename,
      previewUrl:     `/api/preview/${sessionId}/${outputFilename}`,
      description:    parsed.description,
      timestampStart: parsed.timestamp_start,
      timestampEnd:   parsed.timestamp_end,
      ffmpegArgs:     parsed.ffmpeg_args,
    });
  } catch (err) {
    global.logger?.error(`Video edit error: ${err.message}`);
    if (err.message.includes('FFmpeg')) {
      return res.status(500).json({ error: 'ffmpeg_error', message: 'FFmpeg processing failed.', details: err.message.slice(0, 300) });
    }
    if (err.message.includes('Thinksuite') || err.message.includes('non JSON')) {
      return res.status(500).json({ error: 'ai_error', message: 'AI could not parse the command. Please rephrase.' });
    }
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

/* â”€â”€ POST /api/render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
router.post('/render', async (req, res) => {
  const { sessionId, currentFile } = req.body;
  if (!sessionId || !currentFile) {
    return res.status(400).json({ error: 'sessionId and currentFile are required' });
  }

  const sessionDir = getSessionDir(sessionId);
  const inputPath  = path.join(sessionDir, currentFile);

  if (!fs.existsSync(inputPath)) {
    return res.status(404).json({ error: 'Current video not found. Re upload and redo edits.' });
  }

  try {
    ensureDir(OUTPUT_DIR);
    const outputFilename = `final_${sessionId}_${Date.now()}.mp4`;
    const outputPath     = path.join(OUTPUT_DIR, outputFilename);

    await mergeEdits(inputPath, outputPath);

    res.json({
      success:     true,
      downloadUrl: `/api/output/${outputFilename}`,
      filename:    outputFilename,
    });
  } catch (err) {
    global.logger?.error(`Render error: ${err.message}`);
    res.status(500).json({ error: 'render_failed', message: err.message });
  }
});

/* â”€â”€ GET /api/preview/:session/:filename â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
router.get('/preview/:session/:filename', (req, res) => {
  const { session, filename } = req.params;

  if (filename.includes('..') || session.includes('..')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const { UPLOADS_DIR } = require('../services/ffmpegEditService');
  const filePath = path.join(UPLOADS_DIR, session, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const stat     = fs.statSync(filePath);
  const fileSize = stat.size;
  const range    = req.headers.range;

  if (range) {
    const parts     = range.replace(/bytes=/, '').split('-');
    const start     = parseInt(parts[0], 10);
    const end       = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    res.writeHead(206, {
      'Content-Range':  `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges':  'bytes',
      'Content-Length': chunkSize,
      'Content-Type':   'video/mp4',
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type':   'video/mp4',
      'Accept-Ranges':  'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

/* â”€â”€ GET /api/output/:filename â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
router.get('/output/:filename', (req, res) => {
  const { filename } = req.params;
  if (filename.includes('..')) return res.status(400).json({ error: 'Invalid path' });

  const filePath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

  res.setHeader('Content Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'video/mp4');
  fs.createReadStream(filePath).pipe(res);
});

module.exports = router;
