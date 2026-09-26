// backend/staticAssets.js — zero-dependency compressed static asset serving.
//
// Replaces express.sendFile for the public storefront assets:
//   • gzip compression (Node core zlib) for responses ≥ 1 KB
//   • in-memory cache keyed by file, invalidated automatically on mtime/size change
//   • weak ETag + If-None-Match → 304 Not Modified (skips the transfer)
//   • Cache-Control + Vary: Accept-Encoding so caches store per-encoding variants
//
// Usage (express):
//   const { createAssetServer } = require('./staticAssets');
//   const serveAsset = createAssetServer({ basePath: path.resolve(__dirname, '..') });
//   app.get('/app.js', serveAsset('app.js'));                     // max-age=300 default
//   app.get('/', serveAsset('index.html', { maxAgeSeconds: 0 })); // always revalidate
//
// NOTE: only pass trusted, literal filenames — never user input.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const MIN_GZIP_BYTES = 1024; // below this, gzip overhead costs more than it saves
const MAX_CACHE_ENTRIES = 32; // simple FIFO eviction — plenty for our asset count

function createAssetServer({ basePath, maxAgeSeconds = 300 } = {}) {
  const cache = new Map(); // absFile → { mtimeMs, size, etag, raw, gz }

  function load(absFile) {
    const stat = fs.statSync(absFile);
    const cached = cache.get(absFile);
    if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) return cached;

    const raw = fs.readFileSync(absFile);
    const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
    // Only compress when it actually helps.
    const gz = raw.length >= MIN_GZIP_BYTES ? zlib.gzipSync(raw, { level: 6 }) : null;
    const entry = { mtimeMs: stat.mtimeMs, size: stat.size, etag, raw, gz };

    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
    cache.set(absFile, entry);
    return entry;
  }

  // Returns an express-compatible handler for one file.
  return function serveAsset(file, opts = {}) {
    const absFile = path.resolve(basePath, file);
    const age = opts.maxAgeSeconds !== undefined ? opts.maxAgeSeconds : maxAgeSeconds;

    return (req, res) => {
      // Path traversal guard: file must stay inside basePath.
      if (
        path.resolve(basePath, absFile) !== absFile ||
        !absFile.startsWith(path.resolve(basePath) + path.sep)
      ) {
        return res.status(404).end();
      }

      let entry;
      try {
        entry = load(absFile);
      } catch {
        return res.status(404).end();
      }

      res.setHeader(
        'Cache-Control',
        age > 0 ? `public, max-age=${age}` : 'public, max-age=0, must-revalidate'
      );
      res.setHeader('ETag', entry.etag);
      res.setHeader('Vary', 'Accept-Encoding');

      // Conditional request → 304, no body.
      if (req.headers['if-none-match'] === entry.etag) {
        return res.status(304).end();
      }

      const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
      const useGz = acceptsGzip && entry.gz && entry.gz.length < entry.raw.length;
      const body = useGz ? entry.gz : entry.raw;

      res.setHeader(
        'Content-Type',
        MIME_TYPES[path.extname(absFile).toLowerCase()] || 'application/octet-stream'
      );
      if (useGz) res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    };
  };
}

module.exports = { createAssetServer };
