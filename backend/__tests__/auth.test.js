const request = require('supertest');
const { cleanAndSeed, buildApp, createTestUser } = require('./app');

let app;

beforeAll(async () => {
  await cleanAndSeed();
  app = buildApp();
});

describe('POST /api/auth/register', () => {
  it('registers a new customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@test.com',
        password: 'SecurePass1!',
        fname: 'New',
        lname: 'User',
        phone: '+880 171 0000000'
      });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.email).toBe('newuser@test.com');
    expect(res.body.user.role).toBe('customer');
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'newuser@test.com', password: 'SecurePass1!' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('rejects missing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'SecurePass1!' });

    expect(res.status).toBe(400);
  });

  it('rejects short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'short@test.com', password: 'abc' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('8 characters');
  });

  it('rejects password without uppercase', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nouni@test.com', password: 'nouppercase1!' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('uppercase');
  });

  it('rejects password without number', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nonum@test.com', password: 'NoNumberHere!' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('number');
  });

  it('rejects password without special character', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nospec@test.com', password: 'NoSpecial1' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('special character');
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'drape2026' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.username).toBe('admin');
    expect(res.body.user.role).toBe('admin');
  });

  it('logs in with email instead of username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin@drape.fashion', password: 'drape2026' });

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('admin');
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_INVALID');
  });

  it('rejects non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nobody', password: 'whatever1!' });

    expect(res.status).toBe(401);
  });

  it('rejects missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/refresh', () => {
  let refreshToken;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'drape2026' });
    refreshToken = loginRes.body.refreshToken;
  });

  it('refreshes tokens with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    // New refresh token should be different (rotation)
    expect(res.body.refreshToken).not.toBe(refreshToken);
  });

  it('rejects missing refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
  });

  it('rejects invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid.token.here' });

    expect(res.status).toBe(403);
  });
});

describe('GET /api/auth/me', () => {
  let accessToken;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'drape2026' });
    accessToken = loginRes.body.accessToken;
  });

  it('returns user info with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('admin');
    expect(res.body.user.role).toBe('admin');
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects request with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(403);
  });
});

describe('POST /api/auth/logout', () => {
  it('logs out successfully', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'some-token' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });
});
