# DRAPE Fashion OS v4 — Production Deployment Guide

> Full-stack e-commerce platform for Bangladesh artisan fashion.  
> Node.js + Express backend · SQLite (dev) / PostgreSQL (prod) · Vanilla JS frontend

---

## Architecture

```
drape-production/
├── backend/
│   ├── server.js            # Entry point — serves API + static frontend
│   ├── database.js          # SQLite/PostgreSQL dual-mode data layer
│   ├── seed.js              # Seeds admin user + 10 demo products
│   ├── middleware/
│   │   ├── auth.js          # JWT access + refresh token logic
│   │   ├── rateLimiter.js   # Per-route rate limiting (login: 5/15m, API: 100/15m)
│   │   └── logger.js        # Request logging + login attempt audit trail
│   └── routes/
│       ├── auth.js          # POST /login /register /refresh /logout · GET /me
│       ├── products.js      # GET/POST/PUT/DELETE /products (admin write-protected)
│       ├── orders.js        # POST /orders · GET /orders/track/:id · admin CRUD
│       ├── customers.js     # GET /customers/me /orders · admin list
│       └── analytics.js     # GET /analytics — dashboard KPIs + daily revenue
├── frontend/
│   ├── index.html           # Customer storefront (SPA)
│   ├── admin.html           # Admin portal shell
│   ├── admin.js             # Admin portal logic — connects to API
│   ├── app.js               # Customer JS — auth, cart, checkout, tracking
│   └── styles.css           # Full design system
├── Dockerfile               # Multi-stage Alpine image
├── docker-compose.yml       # Full stack: app + PostgreSQL + Redis
├── docker-entrypoint.sh     # Container entrypoint (auto-seed support)
├── .dockerignore            # Docker build context exclusions
├── railway.toml             # Railway deployment config
├── render.yaml              # Render deployment config
├── fly.toml                 # Fly.io deployment config
├── nginx.conf               # Nginx reverse proxy + SSL config (VPS)
├── DEPLOY_RAILWAY.sh        # Step-by-step Railway CLI guide
└── .env.example             # Environment variable reference
```

---

## Quick Start (Local)

### 1. Install dependencies
```bash
cd drape-production
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — at minimum, change the JWT secrets
```

### 3. Seed the database
```bash
npm run seed
# Creates: admin user (admin / drape2026) + 10 products
```

### 4. Start the server
```bash
npm start
# Server:     http://localhost:3000
# Storefront: http://localhost:3000/
# Admin:      http://localhost:3000/admin.html
# Health:     http://localhost:3000/api/health
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Set to `production` on live server |
| `PORT` | No | `3000` | Server listen port |
| `DB_PATH` | No | `./backend/drape.db` | SQLite file path |
| `DATABASE_URL` | No | — | PostgreSQL connection string — overrides SQLite |
| `REDIS_HOST` | No | — | Redis host — enables cache when set |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_PASSWORD` | No | — | Redis password (if required) |
| `JWT_ACCESS_SECRET` | **Yes** | — | 64-char random hex — **must be changed** |
| `JWT_REFRESH_SECRET` | **Yes** | — | 64-char random hex — **must be changed** |
| `CORS_ORIGIN` | No | `*` | Comma-separated allowed origins in production |
| `SEED_ON_START` | No | `false` | Run seed.js on container start (Docker/Compose) |
| `ANTHROPIC_API_KEY` | No | — | For AI caption generation |

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login (admin or customer) |
| POST | `/api/auth/register` | Public | Register new customer |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Public | Invalidate refresh token |
| GET | `/api/auth/me` | Bearer | Get authenticated user |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders/validate` | Public | Validate cart (price + stock check) |
| POST | `/api/orders` | Public | Place order (atomic stock decrement) |
| GET | `/api/orders/track/:orderId` | Public | Track order by ID |
| GET | `/api/orders` | Admin | List all orders |
| PUT | `/api/orders/:orderId/status` | Admin | Update order status |
| DELETE | `/api/orders/:orderId` | Admin | Cancel order |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics` | Admin | Revenue KPIs, top products, daily trend |

### Customers
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/customers/me` | Customer | Own profile |
| PUT | `/api/customers/me` | Customer | Update profile |
| GET | `/api/customers/orders` | Customer | Own order history |
| GET | `/api/customers` | Admin | List all customers |

---

## Deployment

### Option A — Docker Compose (Recommended for Local + Self-Hosted)

The fastest way to run the full stack (app + PostgreSQL + Redis) locally:

```bash
# 1. Clone and configure
git clone https://github.com/yourrepo/drape-production.git
cd drape-production
cp .env.example .env
# Edit .env — at minimum set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET

# 2. Start everything
docker compose up -d

# 3. Verify
curl http://localhost:3000/api/health
# Storefront: http://localhost:3000/
# Admin:      http://localhost:3000/admin.html
```

The `docker-compose.yml` starts three services:
- **app** — DRAPE backend (port 3000)
- **postgres** — PostgreSQL 16 (port 5432)
- **redis** — Redis 7 (port 6379)

Set `SEED_ON_START=true` in `.env` to auto-seed the database on first run.

To stop and remove volumes: `docker compose down -v`

### Option B — Railway (Recommended for Cloud)

1. Push this folder to a GitHub repository
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo — Railway detects `railway.toml` automatically
4. Add PostgreSQL and Redis add-ons from the Railway dashboard (Services → New → Database)
5. Add environment variables in the Railway dashboard:
   - `JWT_ACCESS_SECRET` → generate with node command above
   - `JWT_REFRESH_SECRET` → generate separately
   - `NODE_ENV` → `production`
   - `CORS_ORIGIN` → your Railway public URL (e.g. `https://drape-xxxx.railway.app`)
   - `SEED_ON_START` → `true` (for initial deploy)
6. Deploy — Railway builds the Docker image and runs the container
7. Your app is live at the generated Railway URL

### Option C — Render (Free Tier Available)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your repo — Render detects `render.yaml` automatically
4. Add a PostgreSQL database in the Render dashboard, then set `DATABASE_URL`
5. Override generated JWT secrets in the Render dashboard (Environment)
6. Deploy — Render provisions a persistent disk for SQLite at `/app/data/drape.db`

### Option D — Fly.io

1. Install the Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Authenticate: `fly auth login`
3. Launch the app: `fly launch`
4. Set secrets:
   ```bash
   fly secrets set JWT_ACCESS_SECRET=your_64_char_secret
   fly secrets set JWT_REFRESH_SECRET=your_other_64_char_secret
   fly secrets set CORS_ORIGIN=https://your-app.fly.dev
   ```
5. (Optional) Create a Fly Postgres cluster:
   ```bash
   fly postgres create --name drape-db
   fly secrets set DATABASE_URL=postgresql://drape:xxx@xxx.flycast:5432/drape_db
   ```
6. Deploy: `fly deploy`

### Option E — VPS (DigitalOcean / Hetzner / Contabo)

```bash
# On your server (Ubuntu 22.04+)

# 1. Clone and install
git clone https://github.com/yourrepo/drape-production.git /var/www/drape
cd /var/www/drape
npm install

# 2. Configure environment
cp .env.example .env
nano .env  # Set all variables, especially JWT secrets and CORS_ORIGIN

# 3. Seed and run with PM2
npm install -g pm2
npm run seed
pm2 start backend/server.js --name drape --env production
pm2 save
pm2 startup  # Follow the printed command to auto-start on reboot

# 4. Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/drape
# Edit: replace yourdomain.com with your actual domain
sudo nano /etc/nginx/sites-available/drape
sudo ln -s /etc/nginx/sites-available/drape /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. Provision SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### Option F — Standalone Docker (any host)

```bash
# Build
docker build -t drape-fashion-os .

# Run (SQLite, no external DB)
docker run -d \
  --name drape \
  -p 3000:3000 \
  -v drape-data:/app/data \
  -e NODE_ENV=production \
  -e JWT_ACCESS_SECRET=your_64_char_secret \
  -e JWT_REFRESH_SECRET=your_other_64_char_secret \
  -e CORS_ORIGIN=https://yourdomain.com \
  -e SEED_ON_START=true \
  drape-fashion-os

# With PostgreSQL
docker run -d \
  --name drape \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@host:5432/drape \
  -e JWT_ACCESS_SECRET=your_64_char_secret \
  -e JWT_REFRESH_SECRET=your_other_64_char_secret \
  -e CORS_ORIGIN=https://yourdomain.com \
  -e SEED_ON_START=true \
  drape-fashion-os
```

---

## Post-Deployment Checklist

- [ ] `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are unique, random 64-char hex strings
- [ ] `CORS_ORIGIN` is set to your exact frontend domain (not `*`)
- [ ] `NODE_ENV=production` is set
- [ ] Admin password has been changed after first login
- [ ] SSL certificate is provisioned and auto-renewing
- [ ] `/api/health` returns `200 OK`
- [ ] Database is persisted (volume mount for Docker / Render disk / external PostgreSQL)
- [ ] PM2 or equivalent process manager is configured for auto-restart (VPS only)
- [ ] Nginx rate limiting is active (`limit_req_zone` in nginx.conf)

---

## Default Credentials

| Role | Username / Email | Password |
|---|---|---|
| Admin | `admin` | `drape2026` |
| Demo Customer | `nusrat@email.com` | `password123` |
| Demo Customer | `rafiq@email.com` | `password123` |

**Change the admin password immediately after first deployment.**

---

## Switching to PostgreSQL

**Easiest: Docker Compose** — just run `docker compose up -d`. It provisions PostgreSQL automatically.

**Manual setup:**
1. Provision a PostgreSQL database (Railway, Render, Supabase, or self-hosted)
2. Set `DATABASE_URL` in your `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/drape_db
   ```
3. Run `npm run seed` — the seeder auto-detects PostgreSQL and creates all tables
4. Remove `DB_PATH` from your environment (it is ignored when `DATABASE_URL` is set)

---

## Support & Feedback

Built with Node.js, Express, SQLite/PostgreSQL, and vanilla JavaScript.  
No frameworks, no build step — clone, install, seed, run.

For questions or issues, open a GitHub issue on your repository.
