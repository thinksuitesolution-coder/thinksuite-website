-- ============================================
-- THINKSUITE DATABASE SCHEMA
-- ============================================

CREATE DATABASE IF NOT EXISTS thinksuite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thinksuite_db;

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'editor') DEFAULT 'editor',
  avatar VARCHAR(500),
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- BLOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100) DEFAULT 'Insights',
  tags VARCHAR(1000),
  author_id INT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords VARCHAR(500),
  read_time INT DEFAULT 5,
  views INT DEFAULT 0,
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_published_at (published_at)
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  client VARCHAR(150),
  industry VARCHAR(150),
  problem TEXT,
  system_built TEXT,
  outcome TEXT,
  results JSON,
  image VARCHAR(500),
  gallery JSON,
  tags VARCHAR(1000),
  tech_stack VARCHAR(500),
  duration VARCHAR(100),
  status ENUM('draft', 'published') DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_featured (featured)
);

-- ============================================
-- MESSAGES TABLE (Contact Form - legacy)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  company VARCHAR(150),
  service VARCHAR(150),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LEADS TABLE (All form submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  company VARCHAR(150),
  service VARCHAR(150),
  message TEXT,
  source ENUM('contact_form', 'start_system_form', 'other') DEFAULT 'contact_form',
  status ENUM('new', 'contacted', 'qualified', 'closed') DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- AI SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(30),
  company VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT NOT NULL,
  tool ENUM('ThinkVirtual', 'WavCart', 'Visibility', 'MyThinkAI') NOT NULL,
  plan ENUM('monthly', 'quarterly', 'annual') DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('active', 'expired', 'cancelled', 'paused') DEFAULT 'active',
  payment_status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
  auto_renew BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriber_id) REFERENCES ai_subscribers(id) ON DELETE CASCADE,
  INDEX idx_subscriber (subscriber_id),
  INDEX idx_status (status),
  INDEX idx_tool (tool),
  INDEX idx_end_date (end_date)
);

-- ============================================
-- SUBSCRIPTION PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_at DATE NOT NULL,
  method ENUM('UPI', 'Card', 'Bank Transfer', 'Cash', 'Other') DEFAULT 'UPI',
  transaction_id VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  INDEX idx_subscription (subscription_id)
);

-- ============================================
-- JOB OPENINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_openings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  department VARCHAR(100),
  location ENUM('Remote', 'Hybrid', 'Onsite - Gurgaon') DEFAULT 'Remote',
  type ENUM('Full-time', 'Part-time', 'Internship', 'Contract') DEFAULT 'Full-time',
  description LONGTEXT,
  requirements TEXT,
  salary_range VARCHAR(100),
  status ENUM('open', 'closed') DEFAULT 'open',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  job_title VARCHAR(200),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  portfolio_url VARCHAR(500),
  cover_letter TEXT,
  status ENUM('new', 'screening', 'interview', 'offered', 'rejected') DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_openings(id) ON DELETE SET NULL,
  INDEX idx_job (job_id),
  INDEX idx_status (status),
  INDEX idx_is_read (is_read)
);

-- ============================================
-- SEED DATA
-- ============================================

-- Default admin (password: Admin@123)
INSERT INTO admins (name, email, password, role) VALUES
('ThinkSuite Admin', 'admin@thinksuite.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj2FGBNk6g8K', 'super_admin')
ON DUPLICATE KEY UPDATE name = name;

-- Sample Blog Posts
INSERT INTO blogs (title, slug, excerpt, content, category, tags, meta_title, meta_description, read_time, status, published_at) VALUES
(
  'Why Your Business Needs a System, Not Just a Website',
  'why-business-needs-system-not-website',
  'Most businesses invest in a website and call it digital transformation. Here''s why that thinking is costing you revenue.',
  '<h2>The Website Trap</h2><p>Every year, thousands of businesses spend significant budgets on websites that look impressive but generate zero systemic value. A website is a brochure. A system is a machine.</p><h2>What a Business System Actually Does</h2><p>A properly built business system does five things simultaneously: attracts qualified leads, nurtures them automatically, converts them through structured workflows, delivers your service efficiently, and retains customers through continuous engagement loops.</p><h2>The ThinkSuite Approach</h2><p>We start every engagement with a Systems Audit — mapping every touchpoint in your customer journey and identifying where value leaks. Then we architect solutions that eliminate those leaks permanently.</p><p>The result? Businesses that operate with less manual overhead, higher conversion rates, and compounding growth.</p><h2>Where to Start</h2><p>Start by asking: what in my business runs without me? If the answer is "very little," you need systems, not more tools.</p>',
  'Systems Thinking',
  'business systems, automation, digital infrastructure',
  'Why Your Business Needs a System, Not Just a Website | ThinkSuite',
  'Learn why businesses that invest in systems outperform those that only build websites. ThinkSuite explains the difference.',
  6,
  'published',
  NOW()
),
(
  'The 4 Pillars of Business Automation That Actually Work',
  'four-pillars-business-automation',
  'Automation only works when it''s built on the right foundation. Here are the four pillars every business system must have.',
  '<h2>Automation Is Not a Tool — It''s an Architecture</h2><p>Most businesses treat automation as a collection of tools. Connect this app to that app, automate this task. The result is a fragile, disconnected mess that breaks the moment someone changes a process.</p><h2>Pillar 1: Data Architecture</h2><p>Every automation starts with clean, structured data. If your customer data lives across five spreadsheets and three CRMs, no automation tool will save you. Fix the foundation first.</p><h2>Pillar 2: Process Mapping</h2><p>You cannot automate a process you haven''t defined. Before touching any software, map every step of your core workflows — lead to customer, inquiry to delivery, sale to retention.</p><h2>Pillar 3: Integration Layer</h2><p>Your tools need to speak to each other through a centralized integration layer, not point-to-point connections. When one tool changes, the system adapts — not breaks.</p><h2>Pillar 4: Intelligence Layer</h2><p>The final pillar is where AI enters. Not AI for AI''s sake, but AI that makes decisions within your system — scoring leads, personalizing communication, predicting churn.</p><p>Build these four pillars correctly, and automation becomes a competitive moat, not just a productivity tool.</p>',
  'Automation',
  'automation, workflows, business systems, AI',
  'The 4 Pillars of Business Automation That Actually Work | ThinkSuite',
  'Discover the four foundational pillars of business automation that create lasting competitive advantage.',
  8,
  'published',
  NOW()
),
(
  'AI Integration: What It Really Means for Your Business in 2025',
  'ai-integration-business-2025',
  'AI is not a magic button. Here''s what real AI integration looks like inside a business system.',
  '<h2>Beyond the Hype</h2><p>Every business wants AI. Most don''t know what they''re asking for. AI integration is not installing ChatGPT and calling it done. It''s embedding intelligence into your existing business processes in ways that create measurable output.</p><h2>What We Actually Build</h2><p>When ThinkSuite integrates AI into a client''s system, we''re typically solving one of five problems: lead qualification at scale, personalized customer communication, operational decision support, predictive analytics, or automated content generation within brand guidelines.</p><h2>The Infrastructure Requirement</h2><p>AI only works when it has access to quality data, clear decision logic, and feedback loops. Most businesses don''t have this. So we build it first — then we add AI on top of a solid foundation.</p><h2>Measuring AI ROI</h2><p>We don''t consider an AI integration successful until we can measure its impact. That might be: leads qualified per hour, response time reduction, conversion rate improvement, or hours saved per week. No measurement, no implementation.</p>',
  'AI Systems',
  'AI, artificial intelligence, business automation, machine learning',
  'AI Integration: What It Really Means for Your Business in 2025 | ThinkSuite',
  'Understand what real AI integration looks like inside a business system and how to measure its ROI.',
  7,
  'published',
  NOW()
);

-- Sample Projects
INSERT INTO projects (title, slug, client, industry, problem, system_built, outcome, results, tags, tech_stack, duration, status, featured) VALUES
(
  'Lead Intelligence System for B2B SaaS',
  'lead-intelligence-b2b-saas',
  'Confidential — B2B SaaS',
  'Software',
  'The client was manually qualifying 200+ inbound leads per week, losing 60% due to slow response time and inconsistent follow-up. Their sales team spent 70% of time on admin, not selling.',
  'We built a complete lead intelligence system: automated qualification scoring, multi-channel nurture sequences, CRM workflow automation, and a real-time sales dashboard. AI layer predicts deal probability based on behavioral signals.',
  'Lead response time dropped from 4 hours to 3 minutes. Qualified lead conversion increased by 340%. Sales team now spends 80% of time on high-probability deals.',
  '{"metrics": [{"label": "Response Time", "before": "4 hours", "after": "3 minutes"}, {"label": "Conversion Rate", "before": "8%", "after": "34%"}, {"label": "Revenue Growth", "value": "3.2x in 6 months"}]}',
  'Lead Generation, CRM, Automation, AI',
  'Node.js, MySQL, OpenAI API, HubSpot, Zapier',
  '8 weeks',
  'published',
  TRUE
),
(
  'E-Commerce Growth Infrastructure',
  'ecommerce-growth-infrastructure',
  'Confidential — D2C Brand',
  'E-Commerce',
  'A D2C brand with strong product-market fit was stuck at ₹30L/month revenue. No automation, no retention system, manual order management, zero customer lifecycle management.',
  'Built a complete D2C growth system: abandoned cart recovery, post-purchase flows, LTV maximization sequences, inventory alerts, influencer tracking, and analytics dashboard. Integrated WhatsApp automation for order updates and support.',
  'Revenue grew to ₹1.2Cr/month in 4 months. Cart recovery rate: 31%. Customer LTV increased 2.8x. Support load reduced by 65% through WhatsApp automation.',
  '{"metrics": [{"label": "Monthly Revenue", "before": "₹30L", "after": "₹1.2Cr"}, {"label": "Cart Recovery", "value": "31%"}, {"label": "LTV Growth", "value": "2.8x"}]}',
  'E-Commerce, Automation, WhatsApp, Analytics',
  'Shopify, Node.js, MySQL, WhatsApp Business API',
  '6 weeks',
  'published',
  TRUE
),
(
  'AI-Powered Recruitment System',
  'ai-powered-recruitment-system',
  'Confidential — HR Tech',
  'Human Resources',
  'A growing company was spending 80 hours/week on recruitment: sourcing, screening, scheduling, and follow-up. Quality-of-hire was inconsistent and time-to-hire was 45 days.',
  'Engineered an AI recruitment pipeline: automated JD generation, multi-platform sourcing, AI-powered resume screening, automated scheduling, structured interview frameworks, and offer management workflow.',
  'Time-to-hire reduced from 45 to 12 days. Screening capacity increased 10x. HR team time on recruitment reduced by 70%. Quality-of-hire score improved 40%.',
  '{"metrics": [{"label": "Time to Hire", "before": "45 days", "after": "12 days"}, {"label": "Screening Capacity", "value": "10x increase"}, {"label": "HR Time Saved", "value": "70%"}]}',
  'AI, Recruitment, Automation, HR Tech',
  'Python, OpenAI API, Node.js, MySQL, Calendly API',
  '10 weeks',
  'published',
  TRUE
);
