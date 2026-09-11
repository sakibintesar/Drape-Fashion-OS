const request = require('supertest');
const { cleanAndSeed, buildApp } = require('./app');

let app;

beforeAll(async () => {
  await cleanAndSeed();
  app = buildApp();
});

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBe('4.0.0');
  });

  it('returns test environment', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.env).toBe('test');
  });
});

describe('Unknown API routes', () => {
  it('returns 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
