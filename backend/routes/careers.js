const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const admin = req.headers.authorization;
    const whereAdmin = admin ? '' : "WHERE status='open'";
    const [rows] = await db.execute(
      `SELECT j.*, (SELECT COUNT(*) FROM job_applications a WHERE a.job_id = j.id) as applications
       FROM job_openings j ${whereAdmin} ORDER BY sort_order ASC, created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, department, location, type, description, requirements, salary_range, status, sort_order } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    const [result] = await db.execute(
      'INSERT INTO job_openings (title, department, location, type, description, requirements, salary_range, status, sort_order) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, department||null, location||'Remote', type||'Full-time', description||null, requirements||null, salary_range||null, status||'open', sort_order||0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, department, location, type, description, requirements, salary_range, status, sort_order } = req.body;
    await db.execute(
      'UPDATE job_openings SET title=?,department=?,location=?,type=?,description=?,requirements=?,salary_range=?,status=?,sort_order=? WHERE id=?',
      [title, department||null, location||'Remote', type||'Full-time', description||null, requirements||null, salary_range||null, status||'open', sort_order||0, req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM job_openings WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/apply', async (req, res) => {
  try {
    const { name, email, phone, portfolio_url, cover_letter } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });
    const [job] = await db.execute('SELECT title FROM job_openings WHERE id = ? AND status = ?', [req.params.id, 'open']);
    const jobTitle = job.length ? job[0].title : null;
    await db.execute(
      'INSERT INTO job_applications (job_id, job_title, name, email, phone, portfolio_url, cover_letter) VALUES (?,?,?,?,?,?,?)',
      [req.params.id, jobTitle, name, email, phone||null, portfolio_url||null, cover_letter||null]
    );
    res.status(201).json({ success: true, message: 'Application received' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/applications/all', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    let where = '';
    const params = [];
    if (status) { where = 'WHERE status = ?'; params.push(status); }
    const [rows] = await db.execute(
      `SELECT * FROM job_applications ${where} ORDER BY created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/applications/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE job_applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/applications/:id/read', authenticate, async (req, res) => {
  try {
    await db.execute('UPDATE job_applications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/applications/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM job_applications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
