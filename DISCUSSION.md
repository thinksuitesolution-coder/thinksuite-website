# ThinkSuite (Original) — Discussion Notes

## Project Overview
- **Type**: Traditional HTML/CSS/JS frontend + Node.js Express backend
- **Purpose**: Business services marketing website with admin dashboard
- **Stack**: Express.js, MySQL, JWT, Multer, Sharp, Helmet, bcryptjs
- **Version**: Original version (ThinkSuiteNext is the modern rewrite)

## Files Structure
```
ThinkSuiteNew/
├── (HTML pages — 80+ files)
│   ├── index.html
│   ├── about.html
│   ├── blog.html
│   ├── projects.html
│   ├── services.html
│   ├── digital-marketing.html
│   ├── software-development.html
│   ├── ai-automation.html
│   ├── (40+ more service pages)
│   └── admin/
│       ├── dashboard.html
│       ├── login.html
│       ├── blogs.html
│       ├── projects.html
│       ├── leads.html
│       ├── blog-editor.html
│       └── project-editor.html
├── assets/
│   ├── css/main.css
│   ├── js/main.js
│   └── img/
├── backend/
│   ├── server.js              ← Express entry point
│   ├── config/db.js           ← MySQL connection pooling
│   ├── middleware/auth.js     ← JWT authentication
│   ├── routes/
│   │   ├── auth.js
│   │   ├── blogs.js
│   │   ├── projects.js
│   │   └── leads.js
│   └── database/schema.sql
└── DEPLOYMENT.md
```

## API Endpoints
- `POST /api/auth/login` — Admin login
- `GET/POST /api/blogs` — Blog management
- `GET/POST /api/projects` — Project management
- `POST /api/contact` — Contact form → leads table
- `GET /api/leads` — Lead listing (auth required)
- `GET /api/dashboard/stats` — Dashboard stats

## Default Admin Credentials (from schema.sql)
- Email: `admin@thinksuite.in`
- Password: `Admin@123`

## Security Features
- bcryptjs password hashing
- JWT authentication
- Rate limiting (200 req/15min, 20 req/15min auth)
- CORS, Helmet headers
- express-validator input validation
- File upload limit: 5MB
- Sharp image optimization to WebP

---

## Session Log

### 2026-06-13
**Task: Codebase Overview**

**What was discussed:**
- ThinkSuite ka pura structure explore kiya
- Original HTML+Node.js version hai
- ThinkSuiteNext is kaa modern Next.js rewrite hai
- Deployment options: PM2 + Nginx, cPanel, Railway/Render

**Current Status:**
- Development: Complete (original version)
- ThinkSuiteNext: Modern rewrite in progress

---

---

### 2026-06-29
**Task: Careers Page + Footer Update**

**What was done:**
- `careers.html` create ki — full page with 6 sections:
  - Hero (tagline, CTA buttons)
  - Why Join Us (4 cards)
  - Perks & Benefits (6 items — remote, flexible hours, learning budget, bonus, founder access, fast growth)
  - Open Positions (6 job cards: AI/ML Engineer, Frontend Dev, Digital Marketing Manager, UI/UX Designer, BDE, Social Media Intern)
  - Hiring Process (4 steps: Apply → Screening → Task/Interview → Offer)
  - General Application CTA (email: careers@thinksuite.in)
- "Careers" link footer ke Quick Links section mein add ki — 38 pages updated via bulk replace

**Files Changed:**
- `careers.html` — new file created
- All 38 HTML pages with "Quick Links" footer section — Careers link added

---

## Next Steps / Pending Tasks
- [ ] MySQL database setup karna (production ke liye)
- [ ] Backend environment variables configure karna (.env)
- [ ] careers@thinksuite.in email address verify/setup karna (job apply links use karte hain)
- [ ] Career page ke liye banner image add karna (assets/img/website-banner/careers.svg)
- [ ] ThinkSuiteNext ke saath sync rakhna
