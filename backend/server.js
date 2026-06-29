require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const projectRoutes = require('./routes/projects');
const leadRoutes = require('./routes/leads');
const subscriptionRoutes = require('./routes/subscriptions');
const careerRoutes = require('./routes/careers');

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: 'Too many requests.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many login attempts.' } });

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

// CORS
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));

// Serve frontend from parent directory
app.use(express.static(path.join(__dirname, '..')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/careers', careerRoutes);

// Contact form — also writes to leads table
const db = require('./config/db');
app.post('/api/contact', async (req, res) => {
  const { name, email, company, service, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }
  try {
    await db.execute(
      'INSERT INTO leads (name, email, company, service, message, source) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, company || null, service || null, message, 'contact_form']
    );
    res.json({ success: true, message: "Message received. We'll be in touch within 24 hours." });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Dashboard stats — admin
const { authenticate } = require('./middleware/auth');
app.get('/api/dashboard/stats', authenticate, async (req, res) => {
  try {
    const [[{ blogs }]]            = await db.execute('SELECT COUNT(*) as blogs FROM blogs');
    const [[{ published_blogs }]]  = await db.execute('SELECT COUNT(*) as published_blogs FROM blogs WHERE status = "published"');
    const [[{ projects }]]         = await db.execute('SELECT COUNT(*) as projects FROM projects');
    const [[{ messages }]]         = await db.execute('SELECT COUNT(*) as messages FROM leads');
    const [[{ unread }]]           = await db.execute('SELECT COUNT(*) as unread FROM leads WHERE is_read = 0');
    const [[{ leads }]]            = await db.execute('SELECT COUNT(*) as leads FROM leads WHERE status = "new"');
    const [[{ active_subs }]]      = await db.execute("SELECT COUNT(*) as active_subs FROM subscriptions WHERE status = 'active'");
    const [[{ expiring_subs }]]    = await db.execute("SELECT COUNT(*) as expiring_subs FROM subscriptions WHERE status = 'active' AND DATEDIFF(end_date, CURDATE()) BETWEEN 0 AND 30");
    const [[{ open_jobs }]]        = await db.execute("SELECT COUNT(*) as open_jobs FROM job_openings WHERE status = 'open'");
    const [[{ new_applications }]] = await db.execute("SELECT COUNT(*) as new_applications FROM job_applications WHERE status = 'new' AND is_read = 0");
    res.json({ success: true, data: { blogs, published_blogs, projects, messages, unread, leads, active_subs, expiring_subs, open_jobs, new_applications } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Slug-based HTML routing — /blog/:slug and /project/:slug
app.get('/blog/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'blog-post.html'));
});

app.get('/project/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'project-detail.html'));
});

// Catch-all — serve index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Maximum 5MB allowed.' });
  }
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 ThinkSuite Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin/login.html`);
  console.log(`🌐 Frontend: http://localhost:${PORT}\n`);
});

module.exports = app;
