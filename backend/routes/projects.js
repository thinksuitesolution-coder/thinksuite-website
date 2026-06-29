const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'projects');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function slugify(str) {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let where = '';
    const params = [];
    if (status) { where = 'WHERE status = ?'; params.push(status); }
    const [rows] = await db.execute(
      `SELECT id, title, slug, client, category, excerpt, cover_image, tags, url, year, status, featured, sort_order, created_at FROM projects ${where} ORDER BY sort_order ASC, created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, client, category, excerpt, description, cover_image, tags, url, year, status, featured, sort_order } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    let slug = slugify(title);
    const [exist] = await db.execute('SELECT id FROM projects WHERE slug = ?', [slug]);
    if (exist.length) slug = `${slug}-${Date.now()}`;
    const [result] = await db.execute(
      'INSERT INTO projects (title, slug, client, category, excerpt, description, cover_image, tags, url, year, status, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [title, slug, client||null, category||null, excerpt||null, description||null, cover_image||null, tags||null, url||null, year||null, status||'published', featured?1:0, sort_order||0]
    );
    res.status(201).json({ success: true, id: result.insertId, slug });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, client, category, excerpt, description, cover_image, tags, url, year, status, featured, sort_order } = req.body;
    const [cur] = await db.execute('SELECT id FROM projects WHERE id = ?', [req.params.id]);
    if (!cur.length) return res.status(404).json({ success: false, message: 'Not found' });
    await db.execute(
      'UPDATE projects SET title=?,client=?,category=?,excerpt=?,description=?,cover_image=?,tags=?,url=?,year=?,status=?,featured=?,sort_order=? WHERE id=?',
      [title, client||null, category||null, excerpt||null, description||null, cover_image||null, tags||null, url||null, year||null, status||'published', featured?1:0, sort_order||0, req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  res.json({ success: true, url: `/uploads/projects/${req.file.filename}` });
});

module.exports = router;
