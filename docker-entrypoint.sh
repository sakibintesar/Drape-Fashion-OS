#!/bin/sh
set -e

# ── Seed database on first run if SEED_ON_START=true ──
if [ "${SEED_ON_START}" = "true" ]; then
  echo "SEED_ON_START is enabled — running database seed..."
  node backend/seed.js || echo "Warning: Seed failed or data already exists (non-fatal)"
fi

# ── Execute the main command ──
exec "$@"
