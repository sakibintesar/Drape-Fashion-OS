# DRAPE Phase 7 — Security Hardening Handoff

**Created:** 2026-09-09 (automode session)
**Status:** 41/49 issues fixed (all "no input needed" fixes complete). 7 require user input.

---

## Quick Start
```powershell
cd C:\Users\sakib\Downloads\files\drape-production\drape-production
npm run seed    # if DB is fresh
npm start       # runs on port 3001 (3000 may conflict with Open WebUI)
```

## Architecture
- **Backend:** Express.js + SQLite (better-sqlite3) at `backend/server.js`
- **Frontend:** Vanilla HTML/JS/CSS at `frontend/` (index.html, admin.html, app.js, admin.js, styles.css)
- **Auth:** JWT access + refresh tokens with rotation. Admin + customer roles.
- **Routes:** `backend/routes/` — auth.js, products.js, orders.js, analytics.js, customers.js, ai.js
- **Middleware:** `backend/middleware/` — auth.js (JWT helpers), logger.js, rateLimiter.js
- **Database:** SQLite at `backend/drape.db`. Schema in `backend/database.js`
- **NO GIT COMMITS** — user explicitly said "dont push commit any git"

---

## Remaining Fixes (Do These — No User Input Needed)

### 1. #38 — Add `nodemon` dev script (2 min) ✅ DONE
**File:** `package.json`
**What:** Add nodemon as devDependency and a `dev` script using it.
```json
"scripts": {
  "start": "node backend/server.js",
  "dev": "npx nodemon backend/server.js",
  ...
}
```
Run: `npm install --save-dev nodemon`

### 2. #45 — Fix unclosed CSS media query (5 min) ✅ DONE (was already balanced)

### 3. #40 — Standardize async patterns (10 min) ✅ DONE (all already had try/catch)

### 4. #42 — Add loading states in frontend (15 min) ✅ DONE
Added loading state to renderAccountPage(). Products and order tracking already had them.

### 5. #43 — Conditionally render demo banner (5 min) ✅ DONE (dismiss + localStorage already existed)

### 6. #39 — Add structured logging with winston (15 min) ✅ DONE
Created `backend/logger.js` with winston (Console + File transports, 5MB rotation).
All 6 route files + server.js shutdown handler updated to use logger.

### 7. #28 — Add error boundaries/codes (15 min) ✅ DONE
Created `backend/lib/errors.js` with AppError class, ERROR_CODES constants, sendError() helper.
All routes updated to use `sendError(res, statusCode, message, ERROR_CODES.XXX)`.
Global error handler and 404 handler updated. New format: `{ error: { code, message } }`.

### 8. #30 — Standardize API response format (20 min) ✅ DONE (merged with #28)
Error responses now use `{ error: { code, message } }` across all routes.
Success shapes kept backward-compatible with frontend.

### 9. #25 — Enforce stronger password requirements (5 min) ✅ DONE (already implemented)

### 10. #41 — Remove client-side price tamper check (5 min) ✅ DONE
Removed JS functions (already gone), orphaned HTML div and CSS styles cleaned up.

### 11. #27 — Split app.js into modules (20 min) ✅ DONE
Split into `frontend/js/` directory: state.js, utils.js, auth.js, cart.js, checkout.js, social.js, whatsapp.js, tracking.js, app.js.
Using separate `<script>` tags (no bundler). All functions exposed on window for inline onclick handlers. Original backed up as `app.js.bak`.

---

## Issues Requiring User Input (Skip These)

| # | Issue | Question Needed |
|---|-------|----------------|
| 16 | Test suite | Which framework? (Jest, Mocha, Vitest?) |
| 20 | Redis rate limiter | Is Redis available on deployment? |
| 22 | Order auth | Guest checkout or require login? |
| 33 | SQLite vs PostgreSQL | Production DB choice? |
| 34 | Backup strategy | Where to store backups? |
| 35 | Docker seed behavior | Auto-seed on first run? |
| 46-48 | Nginx/Railway config | What domains? |

---

## Already Fixed (20 issues)
1. ✅ Hardcoded JWT secrets
2. ✅ Client-side admin password fallback
3. ✅ CORS wildcard with credentials
4. ✅ Checkout field mismatch
5. ✅ No CSP header
6. ✅ No database indexes
7. ✅ No pagination on list endpoints
8. ✅ Public order tracking exposes PII
9. ✅ Order ID enumeration
10. ✅ Refresh token not rotated
11. ✅ No graceful shutdown
12. ✅ Refresh token rotation ineffective (jti)
13. ✅ Broken HTML structure
14. ✅ Simulated payments collect real card data
15. ✅ `.env.example` hardcoded secrets
17. ✅ Admin default credentials in UI
21. ✅ No input validation on product create
23. ✅ AI API key exposure in frontend
15b. ✅ XSS via unsanitized innerHTML
29. ✅ No env validation at startup

---

## Verification
After each fix, run:
```powershell
cd C:\Users\sakib\Downloads\files\drape-production\drape-production
node -c backend/server.js
node -c backend/routes/auth.js
node -c backend/routes/products.js
node -c backend/routes/orders.js
node -c frontend/app.js
node -c frontend/admin.js
```
All should pass with no syntax errors. Start the server with `node backend/server.js` to verify it boots.

## Notes
- Server runs on PORT 3001 (or whatever PORT env is set to)
- The `.env` file already has JWT secrets generated
- `FIX_LIST.md` was previously tracked but may not exist — update or create as needed
- All frontend files are vanilla JS (no React/Vue/bundler)
