const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/subscriptions — all with subscriber info
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, tool } = req.query;
    let query = `
      SELECT s.*,
        sub.name as subscriber_name, sub.email as subscriber_email,
        sub.phone as subscriber_phone, sub.company as subscriber_company,
        DATEDIFF(s.end_date, CURDATE()) as days_remaining
      FROM subscriptions s
      JOIN ai_subscribers sub ON s.subscriber_id = sub.id
      WHERE 1=1
    `;
    const params = [];
    if (status) { query += ' AND s.status = ?'; params.push(status); }
    if (tool)   { query += ' AND s.tool = ?';   params.push(tool); }
    query += ' ORDER BY s.end_date ASC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/subscriptions/stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const [[{ total }]]         = await db.execute('SELECT COUNT(*) as total FROM subscriptions');
    const [[{ active }]]        = await db.execute("SELECT COUNT(*) as active FROM subscriptions WHERE status = 'active'");
    const [[{ expiring_soon }]] = await db.execute("SELECT COUNT(*) as expiring_soon FROM subscriptions WHERE status = 'active' AND DATEDIFF(end_date, CURDATE()) BETWEEN 0 AND 30");
    const [[{ expired }]]       = await db.execute("SELECT COUNT(*) as expired FROM subscriptions WHERE status = 'expired'");
    const [[{ revenue }]]       = await db.execute("SELECT IFNULL(SUM(amount), 0) as revenue FROM subscriptions WHERE status = 'active'");
    const [[{ subscribers }]]   = await db.execute('SELECT COUNT(*) as subscribers FROM ai_subscribers');
    res.json({ success: true, data: { total, active, expiring_soon, expired, revenue, subscribers } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/subscriptions/subscriber/find?email=...
router.get('/subscriber/find', authenticate, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email required.' });
    const [rows] = await db.execute('SELECT * FROM ai_subscribers WHERE email = ?', [email]);
    res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/subscriptions/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*,
        sub.name as subscriber_name, sub.email as subscriber_email,
        sub.phone as subscriber_phone, sub.company as subscriber_company,
        DATEDIFF(s.end_date, CURDATE()) as days_remaining
      FROM subscriptions s
      JOIN ai_subscribers sub ON s.subscriber_id = sub.id
      WHERE s.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Subscription not found.' });

    const [payments] = await db.execute(
      'SELECT * FROM subscription_payments WHERE subscription_id = ? ORDER BY paid_at DESC',
      [req.params.id]
    );
    res.json({ success: true, data: { ...rows[0], payments } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/subscriptions — create subscriber + subscription
router.post('/', authenticate, async (req, res) => {
  const { name, email, phone, company, subscriber_notes, tool, plan, start_date, end_date, amount, payment_status, auto_renew, notes } = req.body;

  if (!name || !email || !tool || !start_date || !end_date) {
    return res.status(400).json({ success: false, message: 'Name, email, tool, start date and end date are required.' });
  }

  try {
    let subscriber_id;
    const [existing] = await db.execute('SELECT id FROM ai_subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      subscriber_id = existing[0].id;
      await db.execute(
        'UPDATE ai_subscribers SET name=?, phone=?, company=?, notes=?, updated_at=NOW() WHERE id=?',
        [name, phone || null, company || null, subscriber_notes || null, subscriber_id]
      );
    } else {
      const [result] = await db.execute(
        'INSERT INTO ai_subscribers (name, email, phone, company, notes) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, company || null, subscriber_notes || null]
      );
      subscriber_id = result.insertId;
    }

    const [sub] = await db.execute(
      'INSERT INTO subscriptions (subscriber_id, tool, plan, start_date, end_date, amount, payment_status, auto_renew, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [subscriber_id, tool, plan || 'monthly', start_date, end_date, parseFloat(amount) || 0, payment_status || 'pending', (auto_renew === 'true' || auto_renew === true) ? 1 : 0, notes || null]
    );

    res.status(201).json({ success: true, message: 'Subscription created.', id: sub.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/subscriptions/:id — update subscription
router.put('/:id', authenticate, async (req, res) => {
  const { tool, plan, start_date, end_date, amount, status, payment_status, auto_renew, notes } = req.body;

  try {
    const [existing] = await db.execute('SELECT id FROM subscriptions WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Subscription not found.' });

    await db.execute(
      'UPDATE subscriptions SET tool=?, plan=?, start_date=?, end_date=?, amount=?, status=?, payment_status=?, auto_renew=?, notes=?, updated_at=NOW() WHERE id=?',
      [tool, plan, start_date, end_date, parseFloat(amount) || 0, status || 'active', payment_status || 'paid', (auto_renew === 'true' || auto_renew === true) ? 1 : 0, notes || null, req.params.id]
    );

    res.json({ success: true, message: 'Subscription updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/subscriptions/:id/payment — log a payment
router.post('/:id/payment', authenticate, async (req, res) => {
  const { amount, paid_at, method, transaction_id, notes } = req.body;
  if (!amount || !paid_at) return res.status(400).json({ success: false, message: 'Amount and date required.' });

  try {
    await db.execute(
      'INSERT INTO subscription_payments (subscription_id, amount, paid_at, method, transaction_id, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.id, parseFloat(amount), paid_at, method || 'UPI', transaction_id || null, notes || null]
    );
    await db.execute("UPDATE subscriptions SET payment_status='paid', updated_at=NOW() WHERE id=?", [req.params.id]);
    res.json({ success: true, message: 'Payment recorded.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/subscriptions/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT id FROM subscriptions WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Subscription not found.' });
    await db.execute('DELETE FROM subscriptions WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Subscription deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;