/**
 * Auth route tests — covers /api/auth/login, /register, /refresh, /logout, /me
 */

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// ── Mock all database-dependent modules BEFORE requiring the route ──
// The mock factory replaces the entire module with jest.fn() instances
// that routes destructure as: const { get, run } = require('../database')
jest.mock('../backend/database', () => ({
  get: jest.fn(),
  run: jest.fn(),
  all: jest.fn(),
}));
jest.mock('../backend/logger', () => ({ info: jest.fn(), error: jest.fn(), debug: jest.fn(), warn: jest.fn() }));
jest.mock('../backend/middleware/rateLimiter', () => ({
  loginLimiter: (req, res, next) => next(),
}));
jest.mock('../backend/middleware/logger', () => ({
  logLoginAttempt: jest.fn(),
  requestLogger: (req, res, next) => next(),
}));

// Now require the mocked module — these are the SAME jest.fn() objects the routes use
const database = require('../backend/database');
const { get: mockGet, run: mockRun, all: mockAll } = database;

const authRouter = require('../backend/routes/auth');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// ── Helpers ──

function makeToken(userId) {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  return app;
}

// ── Tests ──

describe('POST /api/auth/login', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  test('returns 400 when username is missing', async () => {
    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ password: 'pass123' });

    expect(res.status).toBe(400);
  });

  test('returns 400 when password is missing', async () => {
    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ username: 'admin' });

    expect(res.status).toBe(400);
  });

  test('returns 401 for invalid credentials (user not found)', async () => {
    mockGet.mockResolvedValue(null);

    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ username: 'nobody', password: 'wrong' });

    expect(res.status).toBe(401);
  });

  test('returns 401 for invalid password', async () => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('CorrectPassword1!', 12);

    mockGet.mockResolvedValue({
      id: 1, username: 'admin', email: 'a@a.com', password_hash: hash, role: 'admin',
      fname: '', lname: '', phone: '', city: '',
    });

    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
  });

  test('returns tokens and user on successful login', async () => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('Test123!', 12);

    mockGet
      .mockResolvedValueOnce({
        id: 1, username: 'admin', email: 'admin@drape.com', password_hash: hash,
        role: 'admin', fname: 'Admin', lname: 'User', phone: '+8801700000000', city: 'Dhaka',
      })
      .mockResolvedValueOnce({ id: 1 });

    mockRun.mockResolvedValue({ id: 1, changes: 1 });

    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Test123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user).toHaveProperty('id', 1);
    expect(res.body.user).toHaveProperty('role', 'admin');
  });
});

describe('POST /api/auth/register', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  test('returns 400 when email is missing', async () => {
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({ password: 'Test123!' });

    expect(res.status).toBe(400);
  });

  test('returns 400 when password is missing', async () => {
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(400);
  });

  test('returns 400 when password is too short', async () => {
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'Ab1!' });

    expect(res.status).toBe(400);
  });

  test('returns 400 when password has no uppercase letter', async () => {
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'testpass1!' });

    expect(res.status).toBe(400);
  });

  test('returns 400 when password has no digit', async () => {
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'TestPass!' });

    expect(res.status).toBe(400);
  });

  test('returns 400 when password has no special character', async () => {
    const res = await request(createApp())
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'TestPass1' });

    expect(res.status).toBe(400);
  });

  test('returns 409 when email already exists', async () => {
    mockGet.mockResolvedValue({ id: 99 });

    const res = await request(createApp())
      .post('/api/auth/register')
      .send({ email: 'taken@test.com', password: 'TestPass1!' });

    expect(res.status).toBe(409);
  });

  test('returns 201 with tokens on successful registration', async () => {
    mockGet.mockResolvedValue(null);
    mockRun.mockResolvedValue({ id: 42, changes: 1 });

    const res = await request(createApp())
      .post('/api/auth/register')
      .send({
        email: 'newuser@test.com',
        password: 'StrongPass1!',
        fname: 'Rina',
        lname: 'Akter',
        phone: '+8801800000000',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user).toHaveProperty('email', 'newuser@test.com');
    expect(res.body.user).toHaveProperty('role', 'customer');
  });
});

describe('POST /api/auth/refresh', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  test('returns 400 when refreshToken is missing', async () => {
    const res = await request(createApp())
      .post('/api/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
  });

  test('returns 403 for invalid refresh token format', async () => {
    const res = await request(createApp())
      .post('/api/auth/refresh')
      .send({ refreshToken: 'not-a-valid-jwt' });

    expect(res.status).toBe(403);
  });

  test('returns 403 when token is not stored in DB', async () => {
    const token = jwt.sign(
      { userId: 1, type: 'refresh', jti: 'test-uuid' },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    mockGet.mockResolvedValue(null);

    const res = await request(createApp())
      .post('/api/auth/refresh')
      .send({ refreshToken: token });

    expect(res.status).toBe(403);
  });

  test('issues new tokens on valid refresh (token rotation)', async () => {
    const userId = 5;
    const oldToken = jwt.sign(
      { userId, type: 'refresh', jti: 'old-uuid' },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    mockGet
      .mockResolvedValueOnce({ token: oldToken, user_id: userId, expires_at: expires })
      .mockResolvedValueOnce({ id: userId, username: 'user5', email: 'u5@t.com', role: 'customer' });
    mockRun.mockResolvedValue({ id: 1, changes: 1 });

    const res = await request(createApp())
      .post('/api/auth/refresh')
      .send({ refreshToken: oldToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.refreshToken).not.toBe(oldToken);
  });
});

describe('POST /api/auth/logout', () => {
  afterEach(() => {
    mockRun.mockReset();
  });

  test('returns success even without a refresh token', async () => {
    const res = await request(createApp())
      .post('/api/auth/logout')
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });

  test('deletes the refresh token from DB', async () => {
    mockRun.mockResolvedValue({ changes: 1 });

    const res = await request(createApp())
      .post('/api/auth/logout')
      .send({ refreshToken: 'some-token' });

    expect(res.status).toBe(200);
    expect(mockRun).toHaveBeenCalled();
  });
});

describe('GET /api/auth/me', () => {
  afterEach(() => {
    mockGet.mockReset();
  });

  test('returns 401 without an access token', async () => {
    const res = await request(createApp()).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  test('returns 403 with an expired token', async () => {
    const expiredToken = jwt.sign({ userId: 1 }, ACCESS_SECRET, { expiresIn: '0s' });

    const res = await request(createApp())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(403);
  });

  test('returns user profile for a valid token', async () => {
    const token = makeToken(1);
    mockGet.mockResolvedValue({
      id: 1, username: 'admin', email: 'admin@drape.com', role: 'admin',
      fname: 'Admin', lname: 'User', phone: '+8801700000000',
      address: '', city: 'Dhaka', postcode: '1200',
    });

    const res = await request(createApp())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id', 1);
    expect(res.body.user).toHaveProperty('username', 'admin');
  });
});
