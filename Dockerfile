# ── Stage 1: Dependency installation ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── Stage 2: Production image ──
FROM node:20-alpine AS runner
WORKDIR /app

# Security: run as non-root user
RUN addgroup --system --gid 1001 drape && \
    adduser --system --uid 1001 --ingroup drape drape

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY backend/ ./backend/
COPY index.html admin.html app.js admin.js styles.css ./

# Create data directory for SQLite persistence
RUN mkdir -p /app/data && chown -R drape:drape /app

USER drape

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Seed DB on first run, then start server
CMD ["sh", "-c", "node backend/seed.js && node backend/server.js"]
