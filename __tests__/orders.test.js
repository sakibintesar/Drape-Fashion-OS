/**
 * Order route tests — covers validation, creation, tracking, admin list, status update, cancellation.
 */

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// ── Mock all database-dependent modules BEFORE requiring the route ──
jest.mock('../backend/database', () => ({
  get: jest.fn(),
  run: jest.fn(),
  all: jest.fn(),
  transaction: jest.fn(),
}));
jest.mock('../backend/logger', () => ({ info: jest.fn(), error: jest.fn(), debug: jest.fn(), warn: jest.fn() }));
jest.mock('../backend/middleware/rateLimiter', () => ({
  apiLimiter: (req, res, next) => next(),
}));
jest.mock('../backend/middleware/logger', () => ({
  requestLogger: (req, res, next) => next(),
}));

const database = require('../backend/database');
const { get: mockGet, run: mockRun, all: mockAll, transaction: mockTransaction } = database;

const ordersRouter = require('../backend/routes/orders');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

// ── Helpers ──

function makeToken(userId) {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/orders', ordersRouter);
  return app;
}

function mockCustomerUser() {
  return {
    id: 2, username: 'customer', email: 'cust@test.com', role: 'customer',
    fname: 'Rina', lname: 'Akter', phone: '+8801700000000',
    address: '123 Road', city: 'Dhaka', postcode: '1200',
  };
}

function mockAdminUser() {
  return {
    id: 1, username: 'admin', email: 'a@a.com', role: 'admin',
    fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
  };
}

// ── Tests ──

describe('POST /api/orders/validate (guest checkout enabled)', () => {
  afterEach(() => {
    mockGet.mockReset();
  });

  const customerToken = makeToken(2);

  test('allows guest (no auth token) — validates without user context', async () => {
    // optionalAuth skips user lookup; product lookup returns null → item not found
    mockGet.mockResolvedValue(null);

    const res = await request(createApp())
      .post('/api/orders/validate')
      .send({ items: [{ id: 1, price: 100, qty: 1 }] });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
  });

  test('returns 400 when items array is missing', async () => {
    mockGet.mockResolvedValue(mockCustomerUser());

    const res = await request(createApp())
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  test('returns 400 when items is empty', async () => {
    mockGet.mockResolvedValue(mockCustomerUser());

    const res = await request(createApp())
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [] });

    expect(res.status).toBe(400);
  });

  test('validates items and reports issues (product not found, price mismatch)', async () => {
    mockGet
      .mockResolvedValueOnce(mockCustomerUser()) // authenticateToken user lookup
      .mockResolvedValueOnce(null)  // product not found
      .mockResolvedValueOnce({ id: 2, name: 'Scarf', price: 500, stock: 10 }); // price mismatch

    const res = await request(createApp())
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [
          { id: 999, price: 200, qty: 1 },
          { id: 2, price: 300, qty: 1 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.issues.length).toBeGreaterThan(0);
  });

  test('validates successfully when all items match', async () => {
    mockGet
      .mockResolvedValueOnce(mockCustomerUser())
      .mockResolvedValue({ id: 1, name: 'Saree', price: 2500, stock: 10 });

    const res = await request(createApp())
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ id: 1, price: 2500, qty: 2 }] });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.validated).toHaveLength(1);
  });
});

describe('POST /api/orders (create, guest checkout enabled)', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  const customerToken = makeToken(2);

  test('allows guest (no auth token) — returns 400 for missing fields', async () => {
    // optionalAuth skips user lookup; route validates required fields
    const res = await request(createApp())
      .post('/api/orders')
      .send({ fname: 'Rina' });

    expect(res.status).toBe(400);
  });

  test('returns 400 when required fields are missing', async () => {
    mockGet.mockResolvedValue(mockCustomerUser());

    const res = await request(createApp())
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ fname: 'Rina' });

    expect(res.status).toBe(400);
  });

  test('creates order with free shipping when subtotal > 3000', async () => {
    mockTransaction.mockImplementation(async (ops) => {
      return ops({
        get: (...args) => mockGet(...args),
        run: (...args) => mockRun(...args),
        all: (...args) => mockAll(...args),
      });
    });

    mockGet
      .mockResolvedValueOnce(mockCustomerUser()) // auth
      .mockResolvedValueOnce({ id: 1, name: 'Premium Saree', price: 3500, stock: 10 });
    mockRun.mockResolvedValueOnce({ changes: 1 });  // stock decrement
    mockRun.mockResolvedValueOnce({ id: 1, changes: 1 }); // order insert

    const res = await request(createApp())
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Rina', lname: 'Akter', email: 'rina@test.com',
        phone: '+8801700000000', address: '123 Road', city: 'Dhaka', postcode: '1200',
        items: [{ id: 1, qty: 2 }],
        payment: 'cod',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.shipping).toBe(0);
    expect(res.body.orderId).toMatch(/^DRP-\d{4}-\d{6}$/);
  });

  test('charges 80 shipping for orders under 3000', async () => {
    mockTransaction.mockImplementation(async (ops) => {
      return ops({
        get: (...args) => mockGet(...args),
        run: (...args) => mockRun(...args),
        all: (...args) => mockAll(...args),
      });
    });

    mockGet
      .mockResolvedValueOnce(mockCustomerUser())
      .mockResolvedValueOnce({ id: 2, name: 'Cotton Scarf', price: 800, stock: 5 });
    mockRun.mockResolvedValueOnce({ changes: 1 });
    mockRun.mockResolvedValueOnce({ id: 1, changes: 1 });

    const res = await request(createApp())
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Rina', email: 'rina@test.com', phone: '+8801700000000',
        address: '123 Road', items: [{ id: 2, qty: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.shipping).toBe(80);
  });

  test('returns 409 when product has insufficient stock', async () => {
    mockTransaction.mockImplementation(async (ops) => {
      return ops({
        get: (...args) => mockGet(...args),
        run: (...args) => mockRun(...args),
        all: (...args) => mockAll(...args),
      });
    });

    mockGet
      .mockResolvedValueOnce(mockCustomerUser())
      .mockResolvedValueOnce({ id: 3, name: 'Silk Dupatta', price: 500, stock: 2 });

    const res = await request(createApp())
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Test', email: 't@t.com', phone: '+8801700000000',
        address: '123 Road', items: [{ id: 3, qty: 5 }],
      });

    expect(res.status).toBe(409);
  });
});

describe('GET /api/orders/track/:orderId (public)', () => {
  afterEach(() => {
    mockGet.mockReset();
  });

  test('returns 404 for nonexistent order', async () => {
    mockGet.mockResolvedValue(null);

    const res = await request(createApp()).get('/api/orders/track/DRP-2026-999999');

    expect(res.status).toBe(404);
  });

  test('returns order tracking info', async () => {
    mockGet.mockResolvedValue({
      id: 1, order_id: 'DRP-2026-123456', status: 'shipped', city: 'Dhaka',
      items_json: JSON.stringify([{ name: 'Saree', qty: 2, emoji: '👗' }]),
      total: 5080, created_at: '2026-09-10T10:00:00',
    });

    const res = await request(createApp()).get('/api/orders/track/DRP-2026-123456');

    expect(res.status).toBe(200);
    expect(res.body.orderId).toBe('DRP-2026-123456');
    expect(res.body.status).toBe('shipped');
    expect(res.body.items).toHaveLength(1);
  });
});

describe('GET /api/orders (admin list)', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockAll.mockReset();
  });

  test('returns 401 without auth token', async () => {
    const res = await request(createApp()).get('/api/orders');
    expect(res.status).toBe(401);
  });

  test('returns 403 for non-admin user', async () => {
    mockGet.mockResolvedValueOnce({
      id: 2, username: 'cust', email: 'c@c.com', role: 'customer',
      fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
    });

    const res = await request(createApp())
      .get('/api/orders')
      .set('Authorization', `Bearer ${makeToken(2)}`);

    expect(res.status).toBe(403);
  });

  test('admin can list orders', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce({ total: 1 });
    mockAll.mockResolvedValueOnce([
      { id: 1, order_id: 'DRP-2026-123456', status: 'pending', items_json: '[]', total: 5080 },
    ]);

    const res = await request(createApp())
      .get('/api/orders')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(1);
    expect(res.body.pagination).toHaveProperty('total', 1);
  });
});

describe('PUT /api/orders/:orderId/status (admin)', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  test('returns 401 without auth token', async () => {
    const res = await request(createApp())
      .put('/api/orders/DRP-2026-123456/status')
      .send({ status: 'shipped' });
    expect(res.status).toBe(401);
  });

  test('returns 403 for non-admin user', async () => {
    mockGet.mockResolvedValueOnce({
      id: 2, username: 'cust', email: 'c@c.com', role: 'customer',
      fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
    });

    const res = await request(createApp())
      .put('/api/orders/DRP-2026-123456/status')
      .set('Authorization', `Bearer ${makeToken(2)}`)
      .send({ status: 'shipped' });

    expect(res.status).toBe(403);
  });

  test('returns 400 for invalid status value', async () => {
    mockGet.mockResolvedValueOnce(mockAdminUser());

    const res = await request(createApp())
      .put('/api/orders/DRP-2026-123456/status')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ status: 'bogus' });

    expect(res.status).toBe(400);
  });

  test('returns 404 when order does not exist', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce(null);

    const res = await request(createApp())
      .put('/api/orders/DRP-2026-999999/status')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ status: 'processing' });

    expect(res.status).toBe(404);
  });

  test('updates order status successfully', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce({ id: 1 });
    mockRun.mockResolvedValue({ changes: 1 });

    const res = await request(createApp())
      .put('/api/orders/DRP-2026-123456/status')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ status: 'shipped' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('shipped');
  });
});

describe('DELETE /api/orders/:orderId (admin cancel)', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  test('returns 401 without auth token', async () => {
    const res = await request(createApp())
      .delete('/api/orders/DRP-2026-123456');
    expect(res.status).toBe(401);
  });

  test('returns 403 for non-admin user', async () => {
    mockGet.mockResolvedValueOnce({
      id: 2, username: 'cust', email: 'c@c.com', role: 'customer',
      fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
    });

    const res = await request(createApp())
      .delete('/api/orders/DRP-2026-123456')
      .set('Authorization', `Bearer ${makeToken(2)}`);

    expect(res.status).toBe(403);
  });

  test('returns 404 when order does not exist', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce(null);

    const res = await request(createApp())
      .delete('/api/orders/DRP-2026-999999')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(404);
  });

  test('cancels order and returns 200', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce({ id: 1 });
    mockRun.mockResolvedValue({ changes: 1 });

    const res = await request(createApp())
      .delete('/api/orders/DRP-2026-123456')
      .set('Authorization', `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Order cancelled');
  });
});