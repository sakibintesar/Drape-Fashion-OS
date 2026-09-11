# ── DRAPE Fashion OS — Railway Deployment ──
# Run these commands on YOUR machine, inside the drape-production folder.
# Total time: ~8 minutes.

# ────────────────────────────────────────────
# STEP 1 — Install the Railway CLI
# ────────────────────────────────────────────

# Windows (PowerShell — run as Administrator):
winget install Railway.RailwayCLI

# macOS:
brew install railway

# Linux / WSL:
bash <(curl -fsSL railway.com/install.sh)


# ────────────────────────────────────────────
# STEP 2 — Log in to Railway
# ────────────────────────────────────────────

railway login
# Opens a browser tab. Sign up (free) or log in.
# Close the tab once you see "Logged in."


# ────────────────────────────────────────────
# STEP 3 — Navigate into your project folder
# ────────────────────────────────────────────

cd "C:\Users\sakib\OneDrive\Desktop\DRAPE_FashionOS_v4_production_ready"
# (or wherever you extracted drape-production.zip)


# ────────────────────────────────────────────
# STEP 4 — Create project and deploy
# ────────────────────────────────────────────

railway up --new
# Railway will:
#   1. Detect your Dockerfile
#   2. Build the Docker image
#   3. Deploy the container
#   4. Print a dashboard link
# This takes 2–3 minutes. Keep the terminal open.


# ────────────────────────────────────────────
# STEP 5 — Generate a public URL
# ────────────────────────────────────────────

railway domain
# Prints something like: https://drape-production-xxxx.up.railway.app
# Copy this URL — you need it for Step 6.


# ────────────────────────────────────────────
# STEP 6 — Set environment variables
# ────────────────────────────────────────────

# Generate two secure JWT secrets (run each separately, copy the output):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Set variables (replace values in quotes with your actual secrets and URL):
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_ACCESS_SECRET="PASTE_FIRST_SECRET_HERE"
railway variables set JWT_REFRESH_SECRET="PASTE_SECOND_SECRET_HERE"
railway variables set CORS_ORIGIN="https://YOUR-APP.up.railway.app"

# Railway automatically redeploys after each variable set.
# Wait ~60 seconds for the final redeploy to complete.


# ────────────────────────────────────────────
# STEP 7 — Verify deployment
# ────────────────────────────────────────────

# Health check — should return: {"status":"ok","env":"production",...}
curl https://YOUR-APP.up.railway.app/api/health

# Open storefront in browser:
railway open
# Or navigate manually to: https://YOUR-APP.up.railway.app/

# Admin portal: https://YOUR-APP.up.railway.app/admin.html
# Default credentials: admin / drape2026
# CHANGE THIS PASSWORD after first login.


# ────────────────────────────────────────────
# TROUBLESHOOTING
# ────────────────────────────────────────────

# View live logs:
railway logs

# Redeploy manually:
railway up

# Open Railway dashboard:
railway open

# Common issues:
#
#   Build fails with "npm ci" error
#   → Make sure package-lock.json is present. Run: npm install && railway up
#
#   App crashes on startup (exit code 1)
#   → Run: railway logs
#   → Most likely cause: JWT secrets not set. Check Step 6.
#
#   "Cannot find module './database'"
#   → You must be inside the drape-production folder when running railway up.
#      Run: cd drape-production && railway up
#
#   CORS errors in browser
#   → CORS_ORIGIN must exactly match your Railway URL (no trailing slash).
#      Run: railway variables set CORS_ORIGIN="https://your-app.up.railway.app"
