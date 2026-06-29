const express = require('express');
const { body, validationResult } = require('express-validator');
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
  await sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(filepath);
  return filename;
}

// GET /api/blogs — public
router.get('/', async (req, res) => {
  try {
    const { status, category, limit = 10, offset = 0, search } = req.query;
    let query = 'SELECT id, title, slug, excerpt, image, category, tags, read_time, views, status, published_at, created_at FROM blogs WHERE 1=1';
    const params = [];

    if (status) { query += ' AND status = ?'; params.push(status); }
    else { query += ' AND status = "published"'; }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (search) { query += ' AND (title LIKE ? OR excerpt LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.execute(query, params);
    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM blogs WHERE status = "published"');

    res.json({ success: true, data: rows, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/blogs/all — admin
router.get('/all', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, title, slug, category, status, views, published_at, created_at FROM blogs ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/blogs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM blogs WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Post not found.' });

    await db.execute('UPDATE blogs SET views = views + 1 WHERE slug = ?', [req.params.slug]);

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/blogs — admin
router.post('/', authenticate, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, excerpt, content, category, tags, meta_title, meta_description, meta_keywords, read_time, status } = req.body;
  let slug = slugify(title, { lower: true, strict: true });

  try {
    const [existing] = await db.execute('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (existing.length > 0) slug = slug + '-' + Date.now();

    let image = null;
    if (req.file) {
      const fn = await saveOptimizedImage(req.file.buffer, path.join(__dirname, '../../uploads/blogs'));
      image = `/uploads/blogs/${fn}`;
    }
    const publishedAt = status === 'published' ? new Date() : null;

    const [result] = await db.execute(
      'INSERT INTO blogs (title, slug, excerpt, content, image, category, tags, author_id, meta_title, meta_description, meta_keywords, read_time, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt || null, content, image, category || 'Insights', tags || null, req.admin.id, meta_title || title, meta_description || excerpt || null, meta_keywords || null, parseInt(read_time) || 5, status || 'draft', publishedAt]
    );

    res.status(201).json({ success: true, message: 'Blog post created.', id: result.insertId, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/blogs/:id — admin
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  const { title, excerpt, content, category, tags, meta_title, meta_description, meta_keywords, read_time, status } = req.body;

  try {
    const [existing] = await db.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Post not found.' });

    const blog = existing[0];
    let image = blog.image;
    if (req.file) {
      const fn = await saveOptimizedImage(req.file.buffer, path.join(__dirname, '../../uploads/blogs'));
      image = `/uploads/blogs/${fn}`;
      if (blog.image) { const old = path.join(__dirname, '../..', blog.image); if (fs.existsSync(old)) fs.unlinkSync(old); }
    }
    const publishedAt = status === 'published' && !blog.published_at ? new Date() : blog.published_at;
    const newSlug = title ? slugify(title, { lower: true, strict: true }) : blog.slug;

    await db.execute(
      'UPDATE blogs SET title=?, slug=?, excerpt=?, content=?, image=?, category=?, tags=?, meta_title=?, meta_description=?, meta_keywords=?, read_time=?, status=?, published_at=?, updated_at=NOW() WHERE id=?',
      [title || blog.title, newSlug, excerpt || blog.excerpt, content || blog.content, image, category || blog.category, tags || blog.tags, meta_title || blog.meta_title, meta_description || blog.meta_description, meta_keywords || blog.meta_keywords, parseInt(read_time) || blog.read_time, status || blog.status, publishedAt, req.params.id]
    );

    res.json({ success: true, message: 'Blog post updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/blogs/:id — admin
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT image FROM blogs WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Post not found.' });

    if (existing[0].image) {
      const imgPath = path.join(__dirname, '../..', existing[0].image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await db.execute('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Blog post deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
