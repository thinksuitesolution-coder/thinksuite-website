const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/leads — public (contact / start-system form)
router.post('/', async (req, res) => {
  const { name, email, phone, company, service, message, source } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }
  const allowedSources = ['contact_form', 'start_system_form', 'other'];
  const src = allowedSources.includes(source) ? source : 'contact_form';

  try {
    const [result] = await db.execute(
      'INSERT INTO leads (name, email, phone, company, service, message, source) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, company || null, service || null, message || null, src]
    );
    res.status(201).json({ success: true, message: "Thanks! We'll be in touch within 24 hours.", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/leads — admin
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (status) { query += ' AND status = ?'; params.push(status); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.execute(query, params);
    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM leads');
    const [[{ unread }]] = await db.execute('SELECT COUNT(*) as unread FROM leads WHERE is_read = 0');

    res.json({ success: true, data: rows, total, unread });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/leads/:id/read — admin (mark read)
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await db.execute('UPDATE leads SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/leads/:id/status — admin (update status)
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'contacted', 'qualified', 'closed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }
  try {
    await db.execute('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/leads/:id — admin
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT id FROM leads WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Lead not found.' });
    await db.execute('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
