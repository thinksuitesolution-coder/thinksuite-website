const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join('/tmp', 'video edit', 'uploads');
const OUTPUT_DIR  = path.join('/tmp', 'video edit', 'output');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', d => { stderr += d.toString(); });
    proc.on('close', code => {
      if (code === 0) resolve(stderr);
      else reject(new Error(`FFmpeg exited ${code}:\n${stderr.slice( 600)}`));
    });
    proc.on('error', err => reject(new Error(`FFmpeg spawn error: ${err.message}`)));
  });
}

async function applyEdit(inputPath, outputPath, ffmpegArgs) {
  ensureDir(path.dirname(outputPath));
  await runFFmpeg([' y', ' i', inputPath, ...ffmpegArgs, outputPath]);
}

async function getVideoDuration(videoPath) {
  return new Promise(resolve => {
    const proc = spawn('ffprobe', [' v', 'quiet', ' print_format', 'json', ' show_format', videoPath]);
    let stdout = '';
    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.on('close', () => {
      try { resolve(parseFloat(JSON.parse(stdout).format?.duration || 0)); }
      catch { resolve(0); }
    });
    proc.on('error', () => resolve(0));
  });
}

async function mergeEdits(inputPath, outputPath) {
  ensureDir(path.dirname(outputPath));
  await runFFmpeg([
    ' y', ' i', inputPath,
    ' c:v', 'libx264', ' preset', 'medium', ' crf', '23',
    ' c:a', 'aac', ' b:a', '128k',
    ' movflags', '+faststart',
    outputPath,
  ]);
}

function getSessionDir(sessionId) {
  const d = path.join(UPLOADS_DIR, sessionId);
  ensureDir(d);
  return d;
}

module.exports = { applyEdit, getVideoDuration, mergeEdits, getSessionDir, UPLOADS_DIR, OUTPUT_DIR, ensureDir };
