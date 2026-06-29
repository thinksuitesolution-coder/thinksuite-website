const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// PUBLIC: GET /api/careers — open jobs for website
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, title, department, location, type, description, requirements, salary_range, created_at FROM job_openings WHERE status = 'open' ORDER BY sort_order ASC, created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: GET /api/careers/all
router.get('/all', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT j.*, (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as application_count FROM job_openings j ORDER BY sort_order ASC, created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/careers/:id — single job
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM job_openings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/careers — create job
router.post('/', authenticate, async (req, res) => {
  const { title, department, location, type, description, requirements, salary_range, status } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title required.' });
  try {
    const [result] = await db.execute(
      'INSERT INTO job_openings (title, department, location, type, description, requirements, salary_range, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, department || null, location || 'Remote', type || 'Full-time', description || null, requirements || null, salary_range || null, status || 'open']
    );
    res.status(201).json({ success: true, message: 'Job created.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/careers/:id
router.put('/:id', authenticate, async (req, res) => {
  const { title, department, location, type, description, requirements, salary_range, status } = req.body;
  try {
    const [existing] = await db.execute('SELECT id FROM job_openings WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Job not found.' });
    await db.execute(
      'UPDATE job_openings SET title=?, department=?, location=?, type=?, description=?, requirements=?, salary_range=?, status=?, updated_at=NOW() WHERE id=?',
      [title, department || null, location || 'Remote', type || 'Full-time', description || null, requirements || null, salary_range || null, status || 'open', req.params.id]
    );
    res.json({ success: true, message: 'Job updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/careers/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM job_openings WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Job deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUBLIC: POST /api/careers/:id/apply
router.post('/:id/apply', async (req, res) => {
  const { name, email, phone, portfolio_url, cover_letter, job_title } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required.' });
  try {
    let resolvedTitle = job_title || null;
    const jobId = req.params.id !== '0' ? parseInt(req.params.id) : null;
    if (jobId) {
      const [job] = await db.execute('SELECT title FROM job_openings WHERE id = ?', [jobId]);
      if (job.length > 0) resolvedTitle = job[0].title;
    }
    await db.execute(
      'INSERT INTO job_applications (job_id, job_title, name, email, phone, portfolio_url, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [jobId, resolvedTitle, name, email, phone || null, portfolio_url || null, cover_letter || null]
    );
    res.json({ success: true, message: "Application received! We'll review and get back to you soon." });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: GET /api/careers/applications/all
router.get('/applications/all', authenticate, async (req, res) => {
  try {
    const { status, job_id } = req.query;
    let query = 'SELECT a.*, j.title as job_listing_title FROM job_applications a LEFT JOIN job_openings j ON a.job_id = j.id WHERE 1=1';
    const params = [];
    if (status) { query += ' AND a.status = ?'; params.push(status); }
    if (job_id) { query += ' AND a.job_id = ?'; params.push(parseInt(job_id)); }
    query += ' ORDER BY a.created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: PUT /api/careers/applications/:id/status
router.put('/applications/:id/status', authenticate, async (req, res) => {
  const { status, notes } = req.body;
  try {
    await db.execute(
      'UPDATE job_applications SET status=?, notes=?, is_read=1, updated_at=NOW() WHERE id=?',
      [status, notes || null, req.params.id]
    );
    res.json({ success: true, message: 'Application updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: PUT /api/careers/applications/:id/read
router.put('/applications/:id/read', authenticate, async (req, res) => {
  try {
    await db.execute('UPDATE job_applications SET is_read=1 WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: DELETE /api/careers/applications/:id
router.delete('/applications/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM job_applications WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;