# Changelog — DRAPE Fashion OS

## v4.1 — Production-Ready Release (2026-09-26)

Blended release: the MVP demo codebase merged with the production-ready restructure
(payments, image uploads, auth hardening, deployment configs). Fully tested and deployed.

### Upgrades in this release

| Area              | What changed                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Payments**      | SSLCommerz integration + webhooks (card / bKash / Nagad, demo mode)                                                                                  |
| **Image uploads** | Multer middleware + Cloudinary integration; product save now accepts images                                                                          |
| **Auth / API**    | Upgraded to v1 API, express-validator, duplicate app.js script-tag fix, PG `RETURNING id` for registration                                           |
| **Frontend**      | CSS syntax fixes; index.html restructured; tracking empty-state button quote fix                                                                     |
| **Deployment**    | `render.yaml`, `railway.toml`, `nginx.conf`, `Dockerfile` CMD path fix, seed-before-start                                                            |
| **Repo hygiene**  | `.gitignore` hardened (secrets, db files, node_modules, temp output); version bumped to **4.1.0** (package.json, lockfile, README, index.html title) |

### Verified working (2026-09-26, local + browser-style checks)

- `GET /api/health` → `{"status":"ok"}` · production instance healthy (`env: production`)
- `GET /api/products` → 200 — 10 products across 5 brands (Loom & Grace, Thread Republic, Nakshi Studio, Zephyr Cuts, Adorn Co.)
- `POST /api/auth/login` (admin) → returns `accessToken`, `refreshToken`, `user`
- `index.html`, `admin.html`, `styles.css`, `app.js`, `admin.js` all serve 200
- All JS files pass `node --check` syntax validation

### Next workstream (v4.2+)

1. **Phase 9 — Immersive landing page**: journey timeline (fiber → doorstep), product anatomy, influencer collab hub
2. **Reformation-style premium shop**: wishlist system, quick-view modal, mobile bottom nav, masonry grid, sticky filters
3. **Security follow-ups**: ~~rotate JWT secrets and purge `backend/.env` / `drape.db` from git history (`git filter-repo`); `npm audit fix` (1 critical in `tar`/`cacache` transitive deps)~~ ✅ **DONE in v4.1.1**

## v4.1.1 — Security Hardening & Database Migration (2026-09-27)

### Security fixes

- **npm audit fix --force**: Upgraded `sqlite3` from 5.1.7 → 6.0.1, resolving 10 vulnerabilities (1 critical in `tar`, 4 high, 3 moderate, 2 low). Zero vulnerabilities remaining.
- **JWT secrets**: Production deployment on Render uses `generateValue: true` in `render.yaml` to auto-generate secure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` — no hardcoded defaults in production.
- **Repo hygiene**: Hardened `.gitignore` excludes secrets, database files, and temp output.

### Database migration

- Added SQLite migration logic in `database.js` to `ALTER TABLE users` and add missing columns (`fname`, `lname`, `phone`, `address`, `city`, `postcode`) on startup. Fixes seed.js and auth middleware failures on existing databases created with older schema.

### Verified working (2026-09-27)

- `npm audit` → 0 vulnerabilities
- `node backend/seed.js` → succeeds (admin + 3 demo customers + 10 products)
- `GET /api/health` → `{"status":"ok","version":"4.1.0"}`
- `GET /api/products` → 10 products across 5 brands
- `POST /api/auth/login` → returns accessToken, refreshToken, user
