# ThinkSuite — Deployment Guide

## Local Development

### Prerequisites
- Node.js >= 18
- MySQL 8.x (or MariaDB 10.6+)
- npm

### 1. Database Setup

```sql
-- In MySQL client or Workbench:
SOURCE /path/to/ThinkSuiteNew/database/schema.sql;
```

This creates the `thinksuite_db` database, all tables, and seeds:
- Default admin: `admin@thinksuite.in` / `Admin@123`
- 3 sample blog posts
- 3 sample projects

### 2. Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=thinksuite_db
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

### 3. Install Dependencies & Run

```bash
cd backend
npm install        # installs all deps including sharp
npm run dev        # nodemon hot-reload
# or
npm start          # production
```

Server starts at **http://localhost:3000**

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Frontend homepage |
| `http://localhost:3000/admin/login.html` | Admin panel |
| `http://localhost:3000/blog/:slug` | Dynamic blog post |
| `http://localhost:3000/project/:slug` | Dynamic project detail |
| `http://localhost:3000/api/blogs` | Blogs API |
| `http://localhost:3000/api/projects` | Projects API |
| `http://localhost:3000/api/leads` | Leads API (auth required) |

---

## Production Hosting (VPS / Ubuntu)

### Option A — PM2 on a VPS

**1. Server setup**
```bash
sudo apt update && sudo apt install -y nodejs npm mysql-server nginx
sudo npm i -g pm2
```

**2. Upload files**
```bash
# From local machine:
scp -r ThinkSuiteNew/ user@your-server:/var/www/thinksuite
```

**3. Database**
```bash
mysql -u root -p < /var/www/thinksuite/database/schema.sql
```

**4. Configure & start**
```bash
cd /var/www/thinksuite/backend
cp .env.example .env
# Edit .env with production values
npm install --omit=dev
pm2 start server.js --name thinksuite
pm2 save
pm2 startup
```

**5. Nginx reverse proxy**

```nginx
# /etc/nginx/sites-available/thinksuite
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/thinksuite /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**6. SSL (Let's Encrypt)**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### Option B — cPanel / Shared Hosting (Node.js app)

1. Upload all files via File Manager or FTP
2. In cPanel → **Setup Node.js App**:
   - Node version: 18+
   - App root: `public_html/ThinkSuiteNew/backend`
   - App startup file: `server.js`
3. Set environment variables in the Node.js app panel (same as `.env`)
4. Create MySQL DB + user via cPanel → **MySQL Databases**, then import `schema.sql`
5. Click **Run NPM Install** in the app panel
6. Start the app

---

### Option C — Railway / Render (PaaS)

**Railway:**
1. Push repo to GitHub
2. Create new Railway project → Deploy from GitHub
3. Add MySQL plugin → copy credentials to env vars
4. Set root directory to `/backend`, start command `node server.js`
5. Set `FRONTEND_URL` to your Railway domain

**Render:**
1. New Web Service → connect GitHub repo
2. Root directory: `backend`, Build command: `npm install`, Start: `node server.js`
3. Add environment variables
4. Add a Render MySQL (or PlanetScale) database, import schema

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `DB_HOST` | Yes | MySQL host |
| `DB_PORT` | No | MySQL port (default: 3306) |
| `DB_USER` | Yes | MySQL username |
| `DB_PASSWORD` | Yes | MySQL password |
| `DB_NAME` | Yes | Database name |
| `JWT_SECRET` | Yes | Secret for JWT signing — use 32+ random chars |
| `JWT_EXPIRES_IN` | No | Token expiry (default: 7d) |
| `FRONTEND_URL` | Yes | Your domain (for CORS) |
| `MAX_FILE_SIZE` | No | Upload limit in bytes (default: 5242880 = 5MB) |

---

## Post-Deploy Checklist

- [ ] Change default admin password via Admin Panel → Profile
- [ ] Set `JWT_SECRET` to a strong random value (never the default)
- [ ] Point `FRONTEND_URL` to your live domain
- [ ] Verify `/uploads` directory is writable
- [ ] Test contact form → check Leads panel
- [ ] Test blog post URL: `/blog/why-business-needs-system-not-website`
- [ ] Test project URL: `/project/lead-intelligence-b2b-saas`
- [ ] Confirm images upload as optimized WebP via sharp

---

## Useful PM2 Commands

```bash
pm2 status           # check app status
pm2 logs thinksuite  # stream logs
pm2 restart thinksuite
pm2 stop thinksuite
```
