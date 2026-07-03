# DRAPE Fashion OS v4 — Phase 3 (PostgreSQL + Customer Auth + Server-Side Validation) ✅

A full-stack e-commerce and admin dashboard for a curated Bangladesh fashion brand. **Frontend remains zero-build** (vanilla HTML/CSS/JS), while **backend runs on Node.js + Express + SQLite/PostgreSQL** with JWT authentication, bcrypt password hashing, rate limiting, server-side cart validation, and atomic stock transactions.

> **Phase 3 core features complete.** Customer registration/login, server-side cart validation, atomic inventory decrements, PostgreSQL support, and parallel subagent skills.

---

## Quick Start

### 1. Start the Backend

```bash
cd backend
node seed.js    # One-time: create admin + customers + products
node server.js  # Start API server on port 3000
```

**Default credentials:**
- Admin: `admin` / `drape2026`
- Demo customers: `nusrat@email.com` / `password123`, `rafiq@email.com` / `password123`, `sabrina@email.com` / `password123`

### 2. Open the Frontend

- `index.html` in any modern browser → **Customer storefront** (shop, checkout, social, track, account)
- `admin.html` in any modern browser → **Admin portal** (JWT-gated, inventory, orders, analytics, CRM)

No build step needed for the frontend.

---

## Architecture

```
┌─────────────────┐      ┌──────────────────┐
│  index.html     │      │   admin.html     │
│  app.js         │◄────►│   admin.js       │
│  (Customer)     │      │   (Admin)        │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         │     API calls          │
         │   (fetch / Bearer)     │
         └──────────┬─────────────┘
                    │
         ┌──────────▼──────────┐
         │  Node.js + Express  │
         │  JWT + bcrypt       │
         │  SQLite / PostgreSQL│
         │  Port 3000          │
         └─────────────────────┘
```

### Files

| File / Folder | Role |
|---------------|------|
| `index.html` + `app.js` | **Customer bundle** — shop, checkout, social, WhatsApp, order tracking, account |
| `admin.html` + `admin.js` | **Admin bundle** — JWT-gated dashboard, orders, inventory, analytics, CRM |
| `styles.css` | Shared stylesheet for both bundles |
| `backend/server.js` | Express server, CORS, rate limiting, route mounting |
| `backend/database.js` | **SQLite + PostgreSQL abstraction** + schema init + transactions |
| `backend/seed.js` | Seeds admin, demo customers, 10 products |
| `backend/routes/auth.js` | Login, refresh, logout, **customer registration** |
| `backend/routes/products.js` | Product CRUD (public read, admin-only write) |
| `backend/routes/orders.js` | Create (public, **validated**), track (public), manage (admin), **cancel** |
| `backend/routes/customers.js` | **Customer profile + order history** (customer-only) |
| `backend/routes/analytics.js` | Dashboard stats, revenue, order breakdowns (admin) |
| `backend/middleware/auth.js` | JWT verify, admin/customer role checks, token generation |
| `backend/middleware/rateLimiter.js` | Login rate limit (5/15min), API limit (100/15min) |
| `backend/middleware/logger.js` | IP + user-agent logging on every login attempt |

---

## Security Model (Phase 3)

### What Phase 3 delivers

| Layer | Implementation | What it stops |
|-------|---------------|---------------|
| **Password hashing** | bcrypt (12 rounds) | Rainbow tables, hash leaks |
| **Session tokens** | JWT access (15 min) + refresh (7 days) | Session hijacking, long-lived tokens |
| **Token storage** | Access token in memory; refresh token in `sessionStorage` | XSS token theft (no localStorage) |
| **Rate limiting** | express-rate-limit: 5 login attempts / 15 min / IP | Brute-force attacks |
| **IP logging** | Every login attempt logged to SQLite/PostgreSQL with IP + UA | Audit trail, abuse detection |
| **CORS** | Configurable origin (default `*` in dev) | Cross-origin request abuse |
| **Admin separation** | Admin endpoints require `Bearer` JWT + `admin` role | Unauthorized API access |
| **Server-side validation** | `POST /api/orders/validate` checks prices + stock against DB | Price tampering, overselling |
| **Atomic transactions** | `POST /api/orders` uses `database.transaction()` — stock decrement + order creation in one atomic unit | Race conditions, inventory corruption |
| **Customer auth** | `POST /api/auth/register` + customer-only endpoints | Guest order spoofing, unauthorized order history access |
| **Input validation** | Required fields checked on all write endpoints | Malformed data injection |

### What Phase 3 does NOT yet do

- No HTTPS / HSTS enforcement (must be served behind TLS in production)
- No httpOnly cookies (tokens are in memory/sessionStorage — still vulnerable to XSS in theory)
- No CSRF tokens (mitigated by CORS + non-cookie auth)
- No RBAC beyond `admin` / `customer` roles
- No audit log of *admin actions* (only login attempts are logged)
- No DOMPurify / CSP for XSS prevention (innerHTML still used in some places)
- No automated testing suite
- No database migration framework (schema changes require manual initDatabase updates)

### Threat model

| Threat | Risk | Mitigation in Phase 3 | Real fix |
|--------|------|----------------------|----------|
| Source-code inspection | Medium | Admin.js no longer contains password hash; bcrypt on server | Backend-only rendering (SSR) |
| Brute-force login | Low | 5 attempts / 15 min / IP + bcrypt 12 rounds | Add CAPTCHA, increase rounds to 14+ |
| JWT theft | Medium | Short-lived access tokens, refresh token rotation | httpOnly cookies + CSRF tokens |
| Price tampering | **Low** | **Server-side validation on `/api/orders/validate`** — prices recalculated from DB | Always validate on server (done) |
| Stock overselling | **Low** | **Atomic transactions** — stock decremented inside order creation transaction | Same (done) |
| Data exfiltration | Low | SQLite/PostgreSQL on server, no PII in localStorage | Encrypted DB at rest, field-level encryption |
| XSS | Medium | No DOMPurify, innerHTML still used in some places | CSP + DOMPurify + sanitize all user input |

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | — | `{ username, password }` → `{ accessToken, refreshToken, user }` (works for both admin and customer) |
| `POST` | `/api/auth/register` | — | `{ email, password, fname, lname, phone }` → creates customer account + logs in |
| `POST` | `/api/auth/refresh` | — | `{ refreshToken }` → `{ accessToken }` |
| `POST` | `/api/auth/logout` | — | `{ refreshToken }` → invalidates token |
| `GET` | `/api/auth/me` | Bearer | Returns current user object |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | — | List all products (public) |
| `GET` | `/api/products/:id` | — | Single product (public) |
| `POST` | `/api/products` | Bearer + admin | Create product |
| `PUT` | `/api/products/:id` | Bearer + admin | Update product |
| `DELETE` | `/api/products/:id` | Bearer + admin | Delete product |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/orders` | Bearer + admin | List all orders |
| `POST` | `/api/orders` | — | Create order (customer checkout) — **atomic transaction with stock validation** |
| `POST` | `/api/orders/validate` | — | Validate cart items against DB prices + stock |
| `GET` | `/api/orders/track/:orderId` | — | Track order by ID (public) |
| `PUT` | `/api/orders/:orderId/status` | Bearer + admin | Update order status |
| `DELETE` | `/api/orders/:orderId` | Bearer + admin | Cancel order (sets status to cancelled) |

### Customers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/customers/me` | Bearer + customer | Get customer profile |
| `PUT` | `/api/customers/me` | Bearer + customer | Update customer profile |
| `GET` | `/api/customers/orders` | Bearer + customer | Get order history for logged-in customer |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/analytics` | Bearer + admin | Dashboard stats, revenue, sales by day, category breakdown |

---

## Database Schema

### `users` — Admin + Customer accounts

| Column | Type | Notes |
|--------|------|-------|
| `id` | PK | Auto-increment / SERIAL |
| `username` | TEXT | Unique (email for customers) |
| `email` | TEXT | Unique |
| `password_hash` | TEXT | bcrypt (12 rounds) |
| `role` | TEXT | `admin` or `customer` |
| `fname`, `lname` | TEXT | Profile fields |
| `phone`, `address`, `city`, `postcode` | TEXT | Optional |
| `created_at` | TIMESTAMP | Auto |

### `products` — Product catalog

| Column | Type | Notes |
|--------|------|-------|
| `id` | PK | Auto-increment / SERIAL |
| `name`, `category`, `vendor` | TEXT | Required |
| `price`, `orig_price`, `stock`, `sold` | INTEGER | |
| `emoji`, `description`, `badge`, `material`, `care`, `origin` | TEXT | |
| `colors_json`, `sizes_json`, `subs_json` | TEXT | JSON arrays stored as strings |
| `created_at`, `updated_at` | TIMESTAMP | Auto |

### `orders` — Order history

| Column | Type | Notes |
|--------|------|-------|
| `id` | PK | Auto-increment / SERIAL |
| `order_id` | TEXT | Unique, formatted `DRAPE-XXXX` |
| `customer_id` | INTEGER | FK to `users.id` (nullable for guest orders) |
| `customer_fname`, `customer_lname`, `email`, `phone` | TEXT | |
| `address`, `city`, `postcode` | TEXT | |
| `items_json` | TEXT | JSON array of order items |
| `subtotal`, `shipping`, `total` | INTEGER | Server-validated |
| `status` | TEXT | `pending` → `confirmed` → `shipped` → `delivered` / `cancelled` |
| `payment_method` | TEXT | `card`, `bkash`, `nagad`, `cod` |
| `created_at`, `updated_at` | TIMESTAMP | Auto |

### `refresh_tokens` — Active refresh tokens

| Column | Type | Notes |
|--------|------|-------|
| `id` | PK | |
| `token` | TEXT | Unique, JWT refresh token |
| `user_id` | INTEGER | FK to `users.id` |
| `ip_address`, `user_agent` | TEXT | |
| `expires_at` | TIMESTAMP | 7 days from creation |
| `created_at` | TIMESTAMP | Auto |

### `login_attempts` — Audit log

| Column | Type | Notes |
|--------|------|-------|
| `id` | PK | |
| `ip_address` | TEXT | |
| `username_attempted` | TEXT | |
| `success` | BOOLEAN | |
| `user_agent` | TEXT | |
| `created_at` | TIMESTAMP | Auto |

---

## Data Persistence

### Server-side (SQLite/PostgreSQL)

| Table | Content |
|-------|---------|
| `users` | Admin + customer accounts (bcrypt hashed) |
| `products` | Product catalog |
| `orders` | Order history with customer linkage |
| `refresh_tokens` | Active refresh tokens with expiry + IP |
| `login_attempts` | Every login attempt with IP, username, success flag |

### Client-side (localStorage)

| Key | Content | Notes |
|-----|---------|-------|
| `drape_cart` | Active shopping cart | Still local for UX speed |
| `drape_scheduled` | Social media scheduled posts | UI-only mock data |
| `drape_theme` | Dark/light mode preference | UI preference |
| `drape_customer_refresh` | Customer refresh token | `sessionStorage` (tab-scoped) |
| `drape_refresh_token` | Admin refresh token | `sessionStorage` (tab-scoped) |

> **Products and orders no longer live in localStorage.** They are fetched from the API on every page load. This eliminates price tampering and data corruption risks from the client side.

---

## Features

### Customer (`index.html`)
- Hero with animated fabric visual
- Product grid fetched live from `/api/products`
- Quick-view modal with color/size/quantity selection
- Cart drawer with real-time total + shipping calc
- Multi-step checkout (card / bKash / Nagad / COD)
- **SSLCommerz-style payment gateway modal with server-side validation**
- Order confirmation + **live API-backed order tracking**
- **Customer account registration + login**
- **Account page with order history** (linked to authenticated customer)
- Brand directory with 5 partner studios
- Social media hub (IG, FB, TikTok, LinkedIn mock feeds)
- WhatsApp Business mock interface with chat templates
- Dark mode toggle (persisted)
- Mobile-responsive navigation drawer

### Admin (`admin.html`)
- **JWT login overlay** (bcrypt backend, no frontend hash)
- Dashboard with KPI cards + **API-backed analytics**
- Order management with **live status updates** via API
- Inventory CRUD with **API-backed** create/edit/delete/duplicate
- Vendor portal with 5 brand profiles
- Customer CRM (segment analysis, RFM scoring)
- Social media scheduler (draft, schedule, publish posts)
- WhatsApp Business conversations (mock customer support)
- Analytics charts (daily trends, category performance, top products, customer growth)
- Dark mode support
- **Auto-refresh token on page reload** (stays logged in within session)

---

## Parallel Subagent Skills

Three reusable skills are installed for parallel team work:

| Skill | Path | Purpose |
|-------|------|---------|
| `drape-project-context` | `~/.kimi/daimon/skills/drape-project-context/SKILL.md` | Shared project context — architecture, file structure, conventions, API base URL, auth flow, database abstraction. **Read this first** before any DRAPE task. |
| `drape-frontend-agent` | `~/.kimi/daimon/skills/drape-frontend-agent/SKILL.md` | Frontend subagent guide — zero-build constraints, page system, API patterns, component conventions, customer auth UI, testing. |
| `drape-backend-agent` | `~/.kimi/daimon/skills/drape-backend-agent/SKILL.md` | Backend subagent guide — database abstraction, route patterns, auth middleware, transaction handling, schema changes, server-side validation. |

### Using parallel subagents

```
# Parent agent delegates to 3 subagents simultaneously:
- Frontend agent: "Add a new 'Wishlist' page to index.html + app.js"
- Backend agent: "Create /api/wishlist routes with CRUD endpoints"
- Another backend agent: "Add wishlist table to database.js schema"

Each subagent reads the relevant skill first, then works independently.
```

---

## Launch Roadmap

### Phase 1 — MVP (v4) ✅ COMPLETE
- Zero-build frontend, works offline from a USB stick
- Frontend-only auth + tamper detection
- All customer + admin flows mocked
- Validated UX before writing backend code

### Phase 2 — Backend Auth (v4-phase2) ✅ COMPLETE
- Node.js + Express + SQLite backend
- JWT access + refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting (5 login / 15 min / IP)
- IP logging on every login attempt
- API endpoints for products, orders, analytics
- Frontend migrated to fetch from API
- Admin portal uses real server-side authentication

### Phase 3 — PostgreSQL + Customer Auth + Validation ✅ **MOSTLY COMPLETE**
- **SQLite / PostgreSQL dual database support** (switch via `DATABASE_URL`)
- **Customer registration + login** (`POST /api/auth/register`)
- **Server-side cart validation** (`POST /api/orders/validate`)
- **Atomic stock transactions** in `POST /api/orders`
- **Customer account page** with order history
- **Customer profile endpoints** (`/api/customers/me`, `/api/customers/orders`)
- **Order cancellation** endpoint for admin
- **Parallel subagent skills** created for team scaling
- **Remaining for Phase 3 completion:** Full PostgreSQL migration testing, automated test suite, migration framework

### Phase 4 — Real Payments (v7) — 2-4 weeks
- SSLCommerz sandbox → live integration
- bKash / Nagad API integration
- Webhook handling for payment confirmations
- Invoice generation + email receipts (SendGrid / AWS SES)

### Phase 5 — Production Hardening (v8) — 1-2 weeks
- HTTPS + HSTS + CSP headers
- httpOnly cookies + CSRF tokens
- DOMPurify for all user-generated content
- Role-based access control (super-admin, manager, viewer)
- Audit logging for all admin actions (not just logins)
- Data backup / export (CSV, JSON)
- SEO + Open Graph meta tags
- Google Analytics / Facebook Pixel

### Phase 6 — Scale (v9+) — Ongoing
- CDN for static assets (Cloudflare / AWS S3)
- Image optimization (WebP, responsive srcset)
- PWA with offline cart + service worker
- Push notifications for order updates
- A/B testing framework
- Multi-currency support

---

## Development Notes

### Why zero-build frontend + Node backend?
- **Frontend speed:** Edit any HTML/JS/CSS, refresh browser, see changes instantly — no webpack
- **Backend clarity:** Standard Express patterns, easy to debug, easy to swap to Python/Go later
- **MVP focus:** Spend time on UX and business logic, not build config
- **Bangladesh context:** Frontend works on low-bandwidth; backend can run on a $5 VPS or Raspberry Pi

### Running locally

```bash
# 1. Backend
cd backend
node seed.js    # only once
node server.js  # http://localhost:3000

# 2. Frontend (open in browser)
# file:///.../index.html  → customer
# file:///.../admin.html  → admin
```

> For full CORS support, serve the frontend files from any static server (e.g., `npx serve ..` or `python -m http.server 5500`) instead of `file://`.

### Switching to PostgreSQL

```bash
# 1. Install PostgreSQL or create a Supabase project
# 2. Set connection string in backend/.env:
#    DATABASE_URL=postgresql://user:pass@localhost:5432/drape
# 3. Re-seed:
cd backend
node seed.js
node server.js
```

The `database.js` abstraction layer automatically detects `DATABASE_URL` and switches to PostgreSQL, converting SQL placeholders and handling transactions.

### Environment variables

Copy `backend/.env.example` to `backend/.env` and customize:

```env
PORT=3000
DB_PATH=./drape.db
# DATABASE_URL=postgresql://user:pass@localhost:5432/drape

JWT_ACCESS_SECRET=your-random-secret-here
JWT_REFRESH_SECRET=your-other-random-secret-here
CORS_ORIGIN=http://localhost:5500
```

> **Never commit `.env` to git.** Add it to `.gitignore`.

### Database

SQLite is the default. The database file is `backend/drape.db`. To reset:

```bash
rm backend/drape.db
node backend/seed.js
```

For PostgreSQL, the abstraction layer handles schema creation automatically on first run.

### Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Requires `fetch`, `localStorage`, `sessionStorage`
- Backend requires Node.js 18+

### File Sizes (approximate)

| File | Size | Notes |
|------|------|-------|
| `index.html` | ~40 KB | Customer markup + auth modal + account page |
| `admin.html` | ~21 KB | Admin markup + login overlay |
| `app.js` | ~65 KB | Customer logic + API calls + auth |
| `admin.js` | ~110 KB | Admin logic + API calls + auth |
| `styles.css` | ~57 KB | Shared styles |
| `backend/` | ~45 KB | Server + routes + middleware + dual DB |
| **Total frontend** | **~290 KB** | Fits on a 3.5" floppy disk |

---

## License

Proprietary — DRAPE Fashion. For internal MVP use only. Not licensed for resale or public deployment without full production hardening (Phase 5).

---

## Contact

Built in Dhaka. For issues, open a discussion in the project workspace or contact the development team.
