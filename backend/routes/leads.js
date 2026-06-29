const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    let where = '';
    const params = [];
    if (status) { where = 'WHERE status = ?'; params.push(status); }
    const [rows] = await db.execute(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await db.execute('UPDATE leads SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    await db.execute('UPDATE leads SET status = ?, notes = COALESCE(?, notes) WHERE id = ?', [status, notes||null, req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
