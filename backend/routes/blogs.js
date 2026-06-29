const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'blogs');
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
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (status) { where = 'WHERE status = ?'; params.push(status); }
    const [rows] = await db.execute(
      `SELECT id, title, slug, excerpt, cover_image, author, category, tags, status, views, published_at, created_at FROM blogs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM blogs ${where}`, params);
    res.json({ success: true, data: rows, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, author, category, tags, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    let slug = slugify(title);
    const [exist] = await db.execute('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (exist.length) slug = `${slug}-${Date.now()}`;
    const published_at = status === 'published' ? new Date() : null;
    const [result] = await db.execute(
      'INSERT INTO blogs (title, slug, excerpt, content, cover_image, author, category, tags, status, published_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [title, slug, excerpt||null, content||null, cover_image||null, author||'ThinkSuite Team', category||null, tags||null, status||'draft', published_at]
    );
    res.status(201).json({ success: true, id: result.insertId, slug });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, author, category, tags, status } = req.body;
    const [cur] = await db.execute('SELECT id, status FROM blogs WHERE id = ?', [req.params.id]);
    if (!cur.length) return res.status(404).json({ success: false, message: 'Not found' });
    const published_at = status === 'published' && cur[0].status !== 'published' ? new Date() : undefined;
    const setParts = ['title=?','excerpt=?','content=?','cover_image=?','author=?','category=?','tags=?','status=?'];
    const vals = [title, excerpt||null, content||null, cover_image||null, author||'ThinkSuite Team', category||null, tags||null, status||'draft'];
    if (published_at !== undefined) { setParts.push('published_at=?'); vals.push(published_at); }
    vals.push(req.params.id);
    await db.execute(`UPDATE blogs SET ${setParts.join(',')} WHERE id=?`, vals);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  res.json({ success: true, url: `/uploads/blogs/${req.file.filename}` });
});

module.exports = router;
