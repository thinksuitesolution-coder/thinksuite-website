-- ThinkSuite Admin Database Schema

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin','admin','editor') DEFAULT 'admin',
  avatar VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  slug VARCHAR(300) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  cover_image VARCHAR(500),
  author VARCHAR(100) DEFAULT 'ThinkSuite Team',
  category VARCHAR(100),
  tags TEXT,
  status ENUM('draft','published') DEFAULT 'draft',
  views INT DEFAULT 0,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  client VARCHAR(200),
  category VARCHAR(100),
  excerpt TEXT,
  description LONGTEXT,
  cover_image VARCHAR(500),
  tags TEXT,
  url VARCHAR(500),
  year YEAR,
  status ENUM('draft','published') DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  company VARCHAR(150),
  service VARCHAR(150),
  message TEXT,
  source VARCHAR(100) DEFAULT 'website',
  status ENUM('new','contacted','qualified','converted','lost') DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
);

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

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT NOT NULL,
  tool ENUM('ThinkVirtual','WavCart','Visibility','Thinksuite') NOT NULL,
  plan ENUM('monthly','quarterly','annual') DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('active','expired','cancelled','paused') DEFAULT 'active',
  payment_status ENUM('paid','pending','overdue') DEFAULT 'pending',
  auto_renew BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriber_id) REFERENCES ai_subscribers(id) ON DELETE CASCADE,
  INDEX idx_tool (tool),
  INDEX idx_status (status),
  INDEX idx_end_date (end_date)
);

CREATE TABLE IF NOT EXISTS subscription_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_at DATE NOT NULL,
  method ENUM('UPI','Card','Bank Transfer','Cash','Other') DEFAULT 'UPI',
  transaction_id VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_openings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  department VARCHAR(100),
  location ENUM('Remote','Hybrid','Onsite - Gurgaon') DEFAULT 'Remote',
  type ENUM('Full-time','Part-time','Internship','Contract') DEFAULT 'Full-time',
  description LONGTEXT,
  requirements TEXT,
  salary_range VARCHAR(100),
  status ENUM('open','closed') DEFAULT 'open',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  job_title VARCHAR(200),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  portfolio_url VARCHAR(500),
  cover_letter TEXT,
  status ENUM('new','screening','interview','offered','rejected') DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_openings(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_job_id (job_id)
);
