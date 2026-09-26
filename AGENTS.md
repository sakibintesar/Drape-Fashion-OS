# AGENTS.md — DRAPE Fashion OS (project identity & boundaries)

> Read this first. It exists so a model switch / session interruption can never mix
> this project up with the unrelated `ai-website-clone` project on this machine.

## ⚠️ This repository is ONLY the DRAPE Fashion OS project

|                 |                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Project**     | DRAPE Fashion OS v4 — full-stack e-commerce for Bangladesh artisan fashion                                   |
| **Root**        | `C:\drape x git desktop\Drape-Fashion-OS`                                                                    |
| **Git remote**  | https://github.com/sakibintesar/Drape-Fashion-OS.git                                                         |
| **Stack**       | Node.js + Express · SQLite (dev) / PostgreSQL (prod) · **vanilla JS** frontend (no framework, no build step) |
| **Entry point** | `backend/server.js` — serves BOTH the API and the static frontend on one port                                |
| **API base**    | `/api/v1` (same-origin) — see `app.js` and `admin.js`                                                        |

## ⚠️ Three copies of this repo exist on this machine — use only this one

| Path                                                               | Branch   | Status                                                            |
| ------------------------------------------------------------------ | -------- | ----------------------------------------------------------------- |
| `C:\drape x git desktop\Drape-Fashion-OS`                          | `master` | ✅ **THIS ONE — the only tree to edit**                           |
| `C:\Users\sakib\Drape-Fashion-OS`                                  | `master` | ⚠️ stale clone (HEAD 2026-07-04) — read-only history, do not edit |
| `C:\Users\sakib\Downloads\files\drape-production\drape-production` | `main`   | ⛔ a **different, unrelated rewrite** — not this codebase         |

The GitHub remote carries **two unrelated branches**:

- `master` — this tree, flat layout (`app.js`/`admin.js` at the root), the GitHub default.
- `main` — a `frontend/` + `backend/` rewrite. It shares **no common ancestor** with
  `master`, so never diff the two and never copy files between them.

Unless the user explicitly names another path, all DRAPE work happens in
`C:\drape x git desktop\Drape-Fashion-OS`.

## 🚫 Do NOT cross-reference the other project

There is a **separate, unrelated** project on this machine:

|                   |                                                               |
| ----------------- | ------------------------------------------------------------- |
| **Other project** | `ai-website-clone` (aka "StyleHub" — a Next.js store builder) |
| **Location**      | `C:\Users\sakib\.cline\data\workspaces\chat\ai-website-clone` |
| **Stack**         | Next.js 16 / React 19 / TypeScript / Tailwind / Supabase      |

Rules:

1. **Never** read, search, import, copy from, or write to the `ai-website-clone` workspace.
2. The two projects have **nothing in common**. Any `src/**`, `*.tsx`, `next.config.*`,
   `components.json`, `supabase/`, `docs/research/**` path belongs to the OTHER
   project — it is **not** part of DRAPE.
3. If a tool's workspace root points at `ai-website-clone`, that is the **wrong
   project**: operate on DRAPE **only** via absolute paths under this repo.

## 📁 Layout

```
backend/            Express API (server.js, database.js, seed.js, middleware/, routes/)
index.html          Customer storefront (SPA)
admin.html          Admin portal shell
app.js              Customer JS — auth, cart, checkout, payments, tracking
admin.js            Admin portal logic
styles.css          Design system
```

> The frontend lives at the **repo root** (there is no `frontend/` folder, despite
> what older notes say).

## 🧹 Session scratch

One-off AI/agent scripts, logs and test harnesses live in **`_session-scratch/`**
(git-ignored). Keep the repo root clean — put throwaway scripts there, never at the root.

## ✅ Build / run / test

```bash
npm install
npm run seed                          # admin user + demo products
npm start                             # http://localhost:3000  (API + frontend)
node _session-scratch/test_e2e.js     # e2e (server must be running)
```
