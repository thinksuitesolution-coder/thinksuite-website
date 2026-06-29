const express = require('express');
const slugify = require('slugify');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  }
});

async function saveOptimizedImage(buffer, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.webp';
  const filepath = path.join(destDir, filename);
  await sharp(buffer).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(filepath);
  return filename;
}

// GET /api/projects — public
router.get('/', async (req, res) => {
  try {
    const { featured, limit = 20, offset = 0 } = req.query;
    let query = 'SELECT id, title, slug, client, industry, problem, system_built, outcome, results, image, tags, tech_stack, duration, featured, created_at FROM projects WHERE status = "published"';
    const params = [];

    if (featured === 'true') { query += ' AND featured = 1'; }
    query += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/projects/all — admin
router.get('/all', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, title, slug, client, industry, status, featured, sort_order, created_at FROM projects ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/projects/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects WHERE slug = ? AND status = "published"', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/projects — admin
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  const { title, client, industry, problem, system_built, outcome, results, tags, tech_stack, duration, status, featured } = req.body;

  if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });

  let slug = slugify(title, { lower: true, strict: true });

  try {
    const [existing] = await db.execute('SELECT id FROM projects WHERE slug = ?', [slug]);
    if (existing.length > 0) slug = slug + '-' + Date.now();

    let image = null;
    if (req.file) {
      const fn = await saveOptimizedImage(req.file.buffer, path.join(__dirname, '../../uploads/projects'));
      image = `/uploads/projects/${fn}`;
    }

    const [result] = await db.execute(
      'INSERT INTO projects (title, slug, client, industry, problem, system_built, outcome, results, image, tags, tech_stack, duration, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, client || null, industry || null, problem || null, system_built || null, outcome || null, results || null, image, tags || null, tech_stack || null, duration || null, status || 'draft', featured === 'true' ? 1 : 0]
    );

    res.status(201).json({ success: true, message: 'Project created.', id: result.insertId, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/projects/:id — admin
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  const { title, client, industry, problem, system_built, outcome, results, tags, tech_stack, duration, status, featured, sort_order } = req.body;

  try {
    const [existing] = await db.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Project not found.' });

    const proj = existing[0];
    let image = proj.image;
    if (req.file) {
      const fn = await saveOptimizedImage(req.file.buffer, path.join(__dirname, '../../uploads/projects'));
      image = `/uploads/projects/${fn}`;
      if (proj.image) { const old = path.join(__dirname, '../..', proj.image); if (fs.existsSync(old)) fs.unlinkSync(old); }
    }
    const newSlug = title ? slugify(title, { lower: true, strict: true }) : proj.slug;

    await db.execute(
      'UPDATE projects SET title=?, slug=?, client=?, industry=?, problem=?, system_built=?, outcome=?, results=?, image=?, tags=?, tech_stack=?, duration=?, status=?, featured=?, sort_order=?, updated_at=NOW() WHERE id=?',
      [title || proj.title, newSlug, client || proj.client, industry || proj.industry, problem || proj.problem, system_built || proj.system_built, outcome || proj.outcome, results || proj.results, image, tags || proj.tags, tech_stack || proj.tech_stack, duration || proj.duration, status || proj.status, featured === 'true' ? 1 : 0, parseInt(sort_order) || proj.sort_order, req.params.id]
    );

    res.json({ success: true, message: 'Project updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/projects/:id — admin
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT image FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Project not found.' });

    if (existing[0].image) {
      const imgPath = path.join(__dirname, '../..', existing[0].image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await db.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
