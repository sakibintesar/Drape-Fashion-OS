#!/usr/bin/env node
/**
 * DRAPE Fashion OS — PostgreSQL S3 Backup Utility
 *
 * Runs pg_dump, compresses the output with gzip, and uploads to S3.
 * Can be run as a CLI command or scheduled with node-cron.
 *
 * Required env vars:
 *   PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE  (or DATABASE_URL)
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET
 *
 * Optional env vars:
 *   BACKUP_PREFIX  — S3 key prefix (default: "drape-db")
 *   BACKUP_CRON    — cron expression for auto-scheduling (e.g. "0 2 * * *" for 2 AM daily)
 *
 * Usage:
 *   node backend/backup.js                # one-shot backup
 *   node backend/backup.js --schedule     # start cron scheduler
 */

require('dotenv').config();
const { execFile } = require('child_process');
const { promisify } = require('util');
const { createGunzip } = require('zlib');
const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const execFileAsync = promisify(execFile);

// ── Configuration ─────────────────────────────────────────────────────────────

const S3_BUCKET = process.env.S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION;
const BACKUP_PREFIX = process.env.BACKUP_PREFIX || 'drape-db';
const BACKUP_RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS, 10) || 30;

if (!S3_BUCKET) {
  console.error('S3_BUCKET environment variable is required for backups.');
  process.exit(1);
}

// ── S3 Client ─────────────────────────────────────────────────────────────────

const s3 = new S3Client({
  region: AWS_REGION,
  // Credentials come from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars
  // (read automatically by the SDK from the environment)
});

// ── Database Connection Info ───────────────────────────────────────────────────

function getDbConfig() {
  // Support DATABASE_URL or individual vars
  const url = process.env.DATABASE_URL;
  if (url) {
    // Parse postgres://user:pass@host:port/dbname
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port || '5432',
      user: parsed.username,
      password: parsed.password,
      dbname: parsed.pathname.replace('/', ''),
    };
  }
  return {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || '5432',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    dbname: process.env.PGDATABASE || 'drape',
  };
}

// ── Backup Functions ──────────────────────────────────────────────────────────

/**
 * Run pg_dump and return the raw SQL output as a Buffer.
 */
async function runPgDump() {
  const config = getDbConfig();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `drape-backup-${timestamp}.sql.gz`;
  const tmpPath = path.join(os.tmpdir(), filename);

  const env = {
    ...process.env,
    PGPASSWORD: config.password,
  };

  const args = [
    '-h', config.host,
    '-p', config.port,
    '-U', config.user,
    '-d', config.dbname,
    '--no-owner',
    '--no-privileges',
    '--clean',
    '--if-exists',
  ];

  console.log(`Running pg_dump for database "${config.dbname}"...`);

  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const { createGzip } = require('zlib');
    const fileStream = fs.createWriteStream(tmpPath);
    const gzip = createGzip();

    const proc = spawn('pg_dump', args, { env, stdio: ['ignore', 'pipe', 'pipe'] });

    proc.stdout.pipe(gzip).pipe(fileStream);

    let stderr = '';
    proc.stderr.on('data', (chunk) => { stderr += chunk; });

    proc.on('close', (code) => {
      if (code !== 0) {
        fs.unlink(tmpPath, () => {}); // cleanup
        return reject(new Error(`pg_dump exited with code ${code}: ${stderr}`));
      }
      fileStream.on('finish', () => resolve({ tmpPath, filename }));
    });

    proc.on('error', (err) => {
      fs.unlink(tmpPath, () => {});
      reject(new Error(`Failed to start pg_dump: ${err.message}. Is PostgreSQL installed and in PATH?`));
    });
  });
}

/**
 * Upload a file to S3.
 */
async function uploadToS3(filePath, s3Key) {
  const fileStream = fs.createReadStream(filePath);
  const stats = fs.statSync(filePath);

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: fileStream,
    ContentType: 'application/gzip',
    ContentEncoding: 'gzip',
    Metadata: {
      'backup-date': new Date().toISOString(),
      'database': getDbConfig().dbname,
      'size-bytes': String(stats.size),
    },
  });

  await s3.send(command);
  return s3Key;
}

/**
 * Delete backups older than BACKUP_RETENTION_DAYS from S3.
 */
async function cleanupOldBackups() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - BACKUP_RETENTION_DAYS);

  console.log(`Cleaning up backups older than ${BACKUP_RETENTION_DAYS} days...`);

  let continuationToken = undefined;
  let deletedCount = 0;

  do {
    const listParams = {
      Bucket: S3_BUCKET,
      Prefix: `${BACKUP_PREFIX}/`,
      MaxKeys: 1000,
    };
    if (continuationToken) listParams.ContinuationToken = continuationToken;

    const listed = await s3.send(new ListObjectsV2Command(listParams));
    if (!listed.Contents) break;

    for (const obj of listed.Contents) {
      // Extract timestamp from key like "drape-db/drape-backup-2026-09-09T12-00-00-000Z.sql.gz"
      const match = obj.Key.match(/drape-backup-(.+)\.sql\.gz$/);
      if (match) {
        const dateStr = match[1].replace(/-(?=\d{3}$)/, '.'); // re-parse ISO
        const objDate = new Date(dateStr);
        if (objDate < cutoff) {
          await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: obj.Key }));
          deletedCount++;
          console.log(`  Deleted: ${obj.Key}`);
        }
      }
    }

    continuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
  } while (continuationToken);

  if (deletedCount === 0) {
    console.log('  No old backups to clean up.');
  } else {
    console.log(`  Deleted ${deletedCount} old backup(s).`);
  }
}

/**
 * Run a full backup: pg_dump -> gzip -> S3 upload -> cleanup old.
 */
async function backup() {
  const startTime = Date.now();
  console.log(`\n=== DRAPE Database Backup — ${new Date().toISOString()} ===\n`);

  try {
    // 1. pg_dump
    const { tmpPath, filename } = await runPgDump();
    const stats = fs.statSync(tmpPath);
    console.log(`pg_dump complete: ${(stats.size / 1024).toFixed(1)} KB (compressed)`);

    // 2. Upload to S3
    const s3Key = `${BACKUP_PREFIX}/${filename}`;
    await uploadToS3(tmpPath, s3Key);
    console.log(`Uploaded to s3://${S3_BUCKET}/${s3Key}`);

    // 3. Cleanup local temp file
    fs.unlinkSync(tmpPath);

    // 4. Cleanup old backups from S3
    await cleanupOldBackups();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\nBackup complete in ${elapsed}s\n`);
    return s3Key;
  } catch (err) {
    console.error('\nBackup failed:', err.message);
    throw err;
  }
}

// ── Cron Scheduler ────────────────────────────────────────────────────────────

async function startScheduler() {
  let cron;
  try {
    cron = require('node-cron');
  } catch {
    console.error(
      'node-cron is required for scheduled backups.\n' +
      'Install it: npm install node-cron'
    );
    process.exit(1);
  }

  const schedule = process.env.BACKUP_CRON || '0 2 * * *'; // default: 2 AM daily
  console.log(`Starting backup scheduler with cron: "${schedule}"`);

  cron.schedule(schedule, async () => {
    try {
      await backup();
    } catch (err) {
      console.error('Scheduled backup failed:', err.message);
    }
  });

  console.log('Scheduler running. Press Ctrl+C to stop.');
}

// ── CLI ───────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--schedule')) {
    startScheduler().catch((err) => {
      console.error(err);
      process.exit(1);
    });
  } else {
    backup()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { backup };
