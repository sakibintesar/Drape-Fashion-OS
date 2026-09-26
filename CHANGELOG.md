# Changelog — DRAPE Fashion OS

## v4.1 — Production-Ready Release (2026-09-26)

Blended release: the MVP demo codebase merged with the production-ready restructure
(payments, image uploads, auth hardening, deployment configs). Fully tested and deployed.

### Upgrades in this release

| Area | What changed |
|------|--------------|
| **Payments** | SSLCommerz integration + webhooks (card / bKash / Nagad, demo mode) |
| **Image uploads** | Multer middleware + Cloudinary integration; product save now accepts images |
| **Auth / API** | Upgraded to v1 API, express-validator, duplicate app.js script-tag fix, PG `RETURNING id` for registration |
| **Frontend** | CSS syntax fixes; index.html restructured; tracking empty-state button quote fix |
| **Deployment** | `render.yaml`, `railway.toml`, `nginx.conf`, `Dockerfile` CMD path fix, seed-before-start |
| **Repo hygiene** | `.gitignore` hardened (secrets, db files, node_modules, temp output); version bumped to **4.1.0** (package.json, lockfile, README, index.html title) |

### Verified working (2026-09-26, local + browser-style checks)

- `GET /api/health` → `{"status":"ok"}` · production instance healthy (`env: production`)
- `GET /api/products` → 200 — 10 products across 5 brands (Loom & Grace, Thread Republic, Nakshi Studio, Zephyr Cuts, Adorn Co.)
- `POST /api/auth/login` (admin) → returns `accessToken`, `refreshToken`, `user`
- `index.html`, `admin.html`, `styles.css`, `app.js`, `admin.js` all serve 200
- All JS files pass `node --check` syntax validation

### Next workstream (v4.2+)

1. **Phase 9 — Immersive landing page**: journey timeline (fiber → doorstep), product anatomy, influencer collab hub
2. **Reformation-style premium shop**: wishlist system, quick-view modal, mobile bottom nav, masonry grid, sticky filters
3. **Security follow-ups**: rotate JWT secrets and purge `backend/.env` / `drape.db` from git history (`git filter-repo`); `npm audit fix` (1 critical in `tar`/`cacache` transitive deps)
