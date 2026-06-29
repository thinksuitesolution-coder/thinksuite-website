const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authenticate, async (req, res) => {
  try {
    const [[a]] = await db.execute("SELECT COUNT(*) as c FROM subscriptions WHERE status='active'");
    const [[e]] = await db.execute("SELECT COUNT(*) as c FROM subscriptions WHERE status='active' AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)");
    const [[s]] = await db.execute('SELECT COUNT(*) as c FROM ai_subscribers');
    const [[m]] = await db.execute("SELECT COALESCE(SUM(amount),0) as total FROM subscriptions WHERE status='active'");
    res.json({ success: true, data: { active: a.c, expiring: e.c, subscribers: s.c, active_value: m.total } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/subscriber/find', authenticate, async (req, res) => {
  try {
    const { email } = req.query;
    const [rows] = await db.execute('SELECT * FROM ai_subscribers WHERE email = ?', [email]);
    res.json({ success: true, data: rows[0] || null });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, tool } = req.query;
    const where = [];
    const params = [];
    if (status) { where.push('s.status = ?'); params.push(status); }
    if (tool) { where.push('s.tool = ?'); params.push(tool); }
    const wStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const [rows] = await db.execute(
      `SELECT s.*, a.name, a.email, a.phone, a.company,
       DATEDIFF(s.end_date, CURDATE()) as days_left
       FROM subscriptions s
       JOIN ai_subscribers a ON a.id = s.subscriber_id
       ${wStr}
       ORDER BY s.created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT s.*, a.name, a.email, a.phone, a.company, a.notes as sub_notes
       FROM subscriptions s JOIN ai_subscribers a ON a.id = s.subscriber_id WHERE s.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, email, phone, company, sub_notes, tool, plan, start_date, end_date, amount, currency, status, payment_status, auto_renew, notes } = req.body;
    if (!name || !email || !tool || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Name, email, tool, dates required' });
    }
    let [sub] = await db.execute('SELECT id FROM ai_subscribers WHERE email = ?', [email]);
    let subscriberId;
    if (sub.length) {
      subscriberId = sub[0].id;
      await db.execute('UPDATE ai_subscribers SET name=?,phone=?,company=?,notes=? WHERE id=?', [name, phone||null, company||null, sub_notes||null, subscriberId]);
    } else {
      const [ins] = await db.execute('INSERT INTO ai_subscribers (name, email, phone, company, notes) VALUES (?,?,?,?,?)', [name, email, phone||null, company||null, sub_notes||null]);
      subscriberId = ins.insertId;
    }
    const [result] = await db.execute(
      'INSERT INTO subscriptions (subscriber_id, tool, plan, start_date, end_date, amount, currency, status, payment_status, auto_renew, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [subscriberId, tool, plan||'monthly', start_date, end_date, amount||0, currency||'INR', status||'active', payment_status||'pending', auto_renew?1:0, notes||null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, email, phone, company, sub_notes, tool, plan, start_date, end_date, amount, currency, status, payment_status, auto_renew, notes } = req.body;
    const [cur] = await db.execute('SELECT subscriber_id FROM subscriptions WHERE id = ?', [req.params.id]);
    if (!cur.length) return res.status(404).json({ success: false, message: 'Not found' });
    await db.execute('UPDATE ai_subscribers SET name=?,phone=?,company=?,notes=? WHERE id=?', [name, phone||null, company||null, sub_notes||null, cur[0].subscriber_id]);
    await db.execute(
      'UPDATE subscriptions SET tool=?,plan=?,start_date=?,end_date=?,amount=?,currency=?,status=?,payment_status=?,auto_renew=?,notes=? WHERE id=?',
      [tool, plan||'monthly', start_date, end_date, amount||0, currency||'INR', status||'active', payment_status||'pending', auto_renew?1:0, notes||null, req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM subscriptions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/payment', authenticate, async (req, res) => {
  try {
    const { amount, paid_at, method, transaction_id, notes } = req.body;
    if (!amount || !paid_at) return res.status(400).json({ success: false, message: 'Amount and date required' });
    await db.execute(
      'INSERT INTO subscription_payments (subscription_id, amount, paid_at, method, transaction_id, notes) VALUES (?,?,?,?,?,?)',
      [req.params.id, amount, paid_at, method||'UPI', transaction_id||null, notes||null]
    );
    await db.execute("UPDATE subscriptions SET payment_status='paid' WHERE id=?", [req.params.id]);
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id/payments', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM subscription_payments WHERE subscription_id = ? ORDER BY paid_at DESC', [req.params.id]);
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
