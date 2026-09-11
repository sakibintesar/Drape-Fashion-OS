/**
 * Product route tests — covers /api/products CRUD, public vs admin access
 */

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// ── Mock all database-dependent modules BEFORE requiring the route ──
jest.mock('../backend/database', () => ({
  get: jest.fn(),
  run: jest.fn(),
  all: jest.fn(),
}));
jest.mock('../backend/logger', () => ({ info: jest.fn(), error: jest.fn(), debug: jest.fn(), warn: jest.fn() }));
jest.mock('../backend/middleware/rateLimiter', () => ({
  apiLimiter: (req, res, next) => next(),
}));
jest.mock('../backend/middleware/logger', () => ({
  requestLogger: (req, res, next) => next(),
}));

const database = require('../backend/database');
const { get: mockGet, run: mockRun, all: mockAll } = database;

const productsRouter = require('../backend/routes/products');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

// ── Helpers ──

function makeToken(userId) {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/products', productsRouter);
  return app;
}

function sampleProduct(overrides = {}) {
  return {
    id: 1,
    name: 'Silk Saree',
    category: 'Saree',
    vendor: 'Rina Craft',
    price: 2500,
    orig_price: 3000,
    stock: 10,
    emoji: '👗',
    colors_json: JSON.stringify(['Red', 'Blue']),
    sizes_json: JSON.stringify(['M', 'L']),
    description: 'Handwoven silk',
    badge: 'New',
    sold: 5,
    material: 'Silk',
    care: 'Dry clean',
    origin: 'Dhaka',
    subs_json: JSON.stringify(['silk-saree']),
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    ...overrides,
  };
}

// ── Tests ──

describe('GET /api/products (public)', () => {
  afterEach(() => {
    mockAll.mockReset();
    mockGet.mockReset();
  });

  test('returns all products without pagination params', async () => {
    const products = [sampleProduct({ id: 1 }), sampleProduct({ id: 2, name: 'Cotton Scarf' })];
    mockAll.mockResolvedValue(products);

    const res = await request(createApp()).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(2);
    expect(res.body.total).toBe(2);
    expect(Array.isArray(res.body.products[0].colors)).toBe(true);
    expect(Array.isArray(res.body.products[0].sizes)).toBe(true);
  });

  test('returns paginated results with ?page=1&limit=1', async () => {
    mockGet.mockResolvedValueOnce({ total: 2 });
    mockAll.mockResolvedValueOnce([sampleProduct({ id: 1 })]);

    const res = await request(createApp()).get('/api/products?page=1&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.pagination).toEqual(
      expect.objectContaining({ page: 1, limit: 1 })
    );
  });
});

describe('GET /api/products/:id (public)', () => {
  afterEach(() => {
    mockGet.mockReset();
  });

  test('returns a single product', async () => {
    mockGet.mockResolvedValue(sampleProduct());

    const res = await request(createApp()).get('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Silk Saree');
    expect(res.body.price).toBe(2500);
    expect(Array.isArray(res.body.colors)).toBe(true);
  });

  test('returns 404 for nonexistent product', async () => {
    mockGet.mockResolvedValue(null);

    const res = await request(createApp()).get('/api/products/999');

    expect(res.status).toBe(404);
  });
});

describe('POST /api/products (admin)', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  const adminToken = makeToken(1);

  test('returns 401 without auth token', async () => {
    const res = await request(createApp())
      .post('/api/products')
      .send({ name: 'Test', category: 'Top', vendor: 'V', price: 100 });

    expect(res.status).toBe(401);
  });

  test('returns 403 for non-admin user', async () => {
    mockGet.mockResolvedValueOnce({
      id: 2, username: 'cust', email: 'c@c.com', role: 'customer',
      fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
    });

    const customerToken = makeToken(2);
    const res = await request(createApp())
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Test', category: 'Top', vendor: 'V', price: 100 });

    expect(res.status).toBe(403);
  });

  test('returns 400 when required fields are missing', async () => {
    mockGet.mockResolvedValueOnce({
      id: 1, username: 'admin', email: 'a@a.com', role: 'admin',
      fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
    });

    const res = await request(createApp())
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete' });

    expect(res.status).toBe(400);
  });

  test('creates product and returns 201', async () => {
    const product = sampleProduct({ id: 10, name: 'New Saree' });
    mockGet
      .mockResolvedValueOnce({
        id: 1, username: 'admin', email: 'a@a.com', role: 'admin',
        fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
      })
      .mockResolvedValueOnce(product);
    mockRun.mockResolvedValue({ id: 10, changes: 1 });

    const res = await request(createApp())
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Saree',
        category: 'Saree',
        vendor: 'Rina',
        price: 2500,
        colors: ['Red', 'Blue'],
        sizes: ['M', 'L'],
        stock: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('New Saree');
  });
});

describe('PUT /api/products/:id (admin)', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  const adminToken = makeToken(1);

  function mockAdminUser() {
    return {
      id: 1, username: 'admin', email: 'a@a.com', role: 'admin',
      fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
    };
  }

  test('returns 404 when product does not exist', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce(null);

    const res = await request(createApp())
      .put('/api/products/999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated', category: 'Top', vendor: 'V', price: 100 });

    expect(res.status).toBe(404);
  });

  test('updates product and returns 200', async () => {
    const updatedProduct = sampleProduct({ id: 5, name: 'Updated Saree' });
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce({ id: 5 })
      .mockResolvedValueOnce(updatedProduct);
    mockRun.mockResolvedValue({ changes: 1 });

    const res = await request(createApp())
      .put('/api/products/5')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Saree',
        category: 'Saree',
        vendor: 'Rina',
        price: 2800,
        stock: 15,
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Saree');
  });
});

describe('DELETE /api/products/:id (admin)', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockRun.mockReset();
  });

  const adminToken = makeToken(1);

  function mockAdminUser() {
    return {
      id: 1, username: 'admin', email: 'a@a.com', role: 'admin',
      fname: '', lname: '', phone: '', address: '', city: '', postcode: '',
    };
  }

  test('returns 404 when product does not exist', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce(null);

    const res = await request(createApp())
      .delete('/api/products/999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  test('deletes product and returns 200', async () => {
    mockGet
      .mockResolvedValueOnce(mockAdminUser())
      .mockResolvedValueOnce({ id: 3 });
    mockRun.mockResolvedValue({ changes: 1 });

    const res = await request(createApp())
      .delete('/api/products/3')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted');
  });
});
