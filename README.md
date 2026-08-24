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
├── railway.toml             # Railway one-click deploy
├── render.yaml              # Render one-click deploy
├── nginx.conf               # Nginx reverse proxy + SSL config (VPS)
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
| `JWT_ACCESS_SECRET` | **Yes** | fallback string | 64-char random hex — **must be changed** |
| `JWT_REFRESH_SECRET` | **Yes** | fallback string | 64-char random hex — **must be changed** |
| `CORS_ORIGIN` | No | `*` | Comma-separated allowed origins in production |

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

### Option A — Railway (Recommended, Free Tier Available)

1. Push this folder to a GitHub repository
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo — Railway detects `railway.toml` automatically
4. Add environment variables in the Railway dashboard:
   - `JWT_ACCESS_SECRET` → generate with node command above
   - `JWT_REFRESH_SECRET` → generate separately
   - `NODE_ENV` → `production`
   - `CORS_ORIGIN` → your Railway public URL (e.g. `https://drape-xxxx.railway.app`)
5. Deploy — Railway builds the Docker image and runs the container
6. Your app is live at the generated Railway URL

### Option B — Render (Free Tier Available)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your repo — Render detects `render.yaml` automatically
4. Override generated JWT secrets in the Render dashboard (Environment → Secret Files)
5. Deploy — Render provisions a persistent disk for SQLite at `/app/data/drape.db`

### Option C — VPS (DigitalOcean / Hetzner / Contabo)

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

### Option D — Docker (any host)

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

## Security Hardening Changelog (this build)

Fixes applied on top of the original harness — see git diff for full detail:

1. **Removed client-side admin login bypass** — `admin.js` had a fallback that granted a fake session if `password === 'drape2026'` when the API call failed. Removed; login now fails closed on any network error.
2. **Added `POST /api/auth/change-password`** — the route referenced in `.env.example` as "Phase 5" but never built. Also added a "Change Password" button in the admin portal UI.
3. **Production boot check for JWT secrets** — the server now refuses to start (`process.exit(1)`) in `NODE_ENV=production` if `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` are unset, default, or under 32 characters.
4. **Moved the AI-caption call server-side** (`POST /api/ai/caption`) — the frontend previously called `api.anthropic.com` directly. Now proxied through the backend; a real key (if configured via `ANTHROPIC_API_KEY`) never reaches the browser. Falls back to mock captions if no key is set. Has its own rate limiter (15/15min) since it's reachable from the public Social Hub page.
5. **Added input validation + sanitization** (`express-validator`) on `/api/auth/register`, `/api/auth/login`, `/api/orders`, and `/api/products` — rejects malformed input and strips `<`/`>` from free-text fields before storage.
6. **Dedicated order-placement rate limiter** — `POST /api/orders` now has its own 10-requests/15min limit, separate from the general 100/15min API limiter, to stop order/stock-spam abuse.
7. **Admin panel moved off the guessable `/admin.html` path** — now served only at `ADMIN_PATH` (env var, defaults to `/portal-3ee0946b`). Requests to the literal `/admin.html` return 404. The public storefront's banner link to the admin panel was also removed.

**Still open / platform-inherent, not fixed by this build:**
- No CDN/WAF-level DDoS protection — this is a limitation of the Render/Railway free tier itself, not something app code can fully solve. Consider Cloudflare's free tier in front of your domain if this matters to you.

---

| Role | Username / Email | Password |
|---|---|---|
| Admin | `admin` | `drape2026` |
| Demo Customer | `nusrat@email.com` | `password123` |
| Demo Customer | `rafiq@email.com` | `password123` |

**Change the admin password immediately after first deployment.**

---

## Switching to PostgreSQL

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
