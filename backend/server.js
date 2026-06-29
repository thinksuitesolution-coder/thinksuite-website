require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const projectRoutes = require('./routes/projects');
const leadRoutes = require('./routes/leads');
const subscriptionRoutes = require('./routes/subscriptions');
const careerRoutes = require('./routes/careers');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://127.0.0.1:5500', 'null'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.use(express.static(path.join(__dirname, '..')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/careers', careerRoutes);

const db = require('./config/db');

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }
    await db.execute(
      'INSERT INTO leads (name, email, phone, company, service, message) VALUES (?,?,?,?,?,?)',
      [name, email, phone||null, company||null, service||null, message]
    );
    res.json({ success: true, message: 'Message received. We will get back to you soon.' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const { authenticate } = require('./middleware/auth');

app.get('/api/dashboard/stats', authenticate, async (req, res) => {
  try {
    const [[blogs]] = await db.execute("SELECT COUNT(*) as c FROM blogs WHERE status='published'");
    const [[drafts]] = await db.execute("SELECT COUNT(*) as c FROM blogs WHERE status='draft'");
    const [[projects]] = await db.execute("SELECT COUNT(*) as c FROM projects WHERE status='published'");
    const [[leads_new]] = await db.execute("SELECT COUNT(*) as c FROM leads WHERE status='new'");
    const [[leads_total]] = await db.execute('SELECT COUNT(*) as c FROM leads');
    const [[active_subs]] = await db.execute("SELECT COUNT(*) as c FROM subscriptions WHERE status='active'");
    const [[expiring_subs]] = await db.execute("SELECT COUNT(*) as c FROM subscriptions WHERE status='active' AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)");
    const [[open_jobs]] = await db.execute("SELECT COUNT(*) as c FROM job_openings WHERE status='open'");
    const [[new_apps]] = await db.execute("SELECT COUNT(*) as c FROM job_applications WHERE status='new'");
    res.json({
      success: true,
      data: {
        blogs: blogs.c, drafts: drafts.c, projects: projects.c,
        leads_new: leads_new.c, leads_total: leads_total.c,
        active_subs: active_subs.c, expiring_subs: expiring_subs.c,
        open_jobs: open_jobs.c, new_apps: new_apps.c
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

async function ensureAdmin() {
  try {
    const [[{ c }]] = await db.execute('SELECT COUNT(*) as c FROM admins');
    if (c === 0) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ThinkAdmin@123', 10);
      await db.execute(
        'INSERT INTO admins (name, email, password, role) VALUES (?,?,?,?)',
        ['Admin', process.env.ADMIN_EMAIL || 'admin@thinksuite.in', hash, 'super_admin']
      );
      console.log('Default admin created: admin@thinksuite.in / ThinkAdmin@123');
    }
  } catch {}
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ThinkSuite Admin running on http://localhost:${PORT}`);
  console.log(`Admin Panel: http://localhost:${PORT}/admin/login.html`);
  ensureAdmin();
});
