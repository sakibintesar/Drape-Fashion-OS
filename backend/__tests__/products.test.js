const request = require('supertest');
const { cleanAndSeed, buildApp, makeAccessToken, createTestUser } = require('./app');
const { get } = require('../database');

let app;
let adminToken;

beforeAll(async () => {
  await cleanAndSeed();
  app = buildApp();
  const admin = await get('SELECT id FROM users WHERE username = ?', ['admin']);
  adminToken = makeAccessToken(admin.id);
});

describe('GET /api/products', () => {
  it('returns all products (seeded)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThanOrEqual(10);
    expect(res.body.total).toBeGreaterThanOrEqual(10);
  });

  it('returns parsed JSON fields (colors, sizes, subs)', async () => {
    const res = await request(app).get('/api/products');
    const product = res.body.products[0];
    expect(Array.isArray(product.colors)).toBe(true);
    expect(Array.isArray(product.sizes)).toBe(true);
    expect(Array.isArray(product.subs)).toBe(true);
  });

  it('supports pagination', async () => {
    const res = await request(app).get('/api/products?page=1&limit=3');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBe(3);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(3);
  });

  it('clamps invalid pagination params', async () => {
    const res = await request(app).get('/api/products?page=-1&limit=999');
    expect(res.status).toBe(200);
    expect(res.body.pagination.limit).toBe(100);
  });
});

describe('GET /api/products/:id', () => {
  it('returns a single product', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Muslin Wrap Dress');
    expect(res.body.price).toBe(3200);
    expect(Array.isArray(res.body.colors)).toBe(true);
  });

  it('returns 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('POST /api/products (admin)', () => {
  const newProduct = {
    name: 'Test Kurti',
    category: 'Tops',
    vendor: 'NAKSHI STUDIO',
    price: 1500,
    stock: 20,
    emoji: '👚',
    colors: [{ name: 'Red', hex: '#FF0000' }],
    sizes: ['S', 'M', 'L'],
    description: 'A test kurti for unit testing',
    badge: 'Test',
    material: 'Cotton',
    care: 'Machine wash',
    origin: 'Dhaka',
    subs: [{ name: 'Short', price: 1500 }]
  };

  it('creates a product as admin', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProduct);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Kurti');
    expect(res.body.price).toBe(1500);
    expect(res.body.stock).toBe(20);
  });

  it('rejects creation without auth', async () => {
    const res = await request(app)
      .post('/api/products')
      .send(newProduct);

    expect(res.status).toBe(401);
  });

  it('rejects creation by customer', async () => {
    const customer = await createTestUser('customer');
    const token = makeAccessToken(customer.id);

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);

    expect(res.status).toBe(403);
  });

  it('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('required');
  });

  it('rejects negative price', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...newProduct, price: -100 });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('non-negative');
  });

  it('rejects non-array colors', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...newProduct, colors: 'not-an-array' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('array');
  });

  it('rejects negative stock', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...newProduct, stock: -5 });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('non-negative');
  });
});

describe('PUT /api/products/:id (admin)', () => {
  it('updates a product as admin', async () => {
    const res = await request(app)
      .put('/api/products/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Muslin Wrap Dress Updated', price: 3500 });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Muslin Wrap Dress Updated');
    expect(res.body.price).toBe(3500);
  });

  it('returns 404 for non-existent product', async () => {
    const res = await request(app)
      .put('/api/products/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ghost' });

    expect(res.status).toBe(404);
  });

  it('rejects update by customer', async () => {
    const customer = await createTestUser('customer');
    const token = makeAccessToken(customer.id);

    const res = await request(app)
      .put('/api/products/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Hacked' });

    expect(res.status).toBe(403);
  });
});

describe('GET /api/products/search', () => {
  it('returns products matching a search term', async () => {
    const res = await request(app).get('/api/products/search?q=muslin');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThanOrEqual(1);
    expect(res.body.query).toBe('muslin');
  });

  it('returns empty array for no matches', async () => {
    const res = await request(app).get('/api/products/search?q=xyznonexistent');
    expect(res.status).toBe(200);
    expect(res.body.products).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it('returns empty array for empty query', async () => {
    const res = await request(app).get('/api/products/search?q=');
    expect(res.status).toBe(200);
    expect(res.body.products).toEqual([]);
  });

  it('searches across category and vendor fields', async () => {
    const res = await request(app).get('/api/products/search?q=NAKSHI');
    expect(res.status).toBe(200);
    // NAKSHI STUDIO is the vendor for some products
    expect(res.body.products.length).toBeGreaterThanOrEqual(1);
  });

  it('supports limit parameter', async () => {
    const res = await request(app).get('/api/products/search?q=a&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeLessThanOrEqual(2);
  });

  it('parses JSON fields in search results', async () => {
    const res = await request(app).get('/api/products/search?q=muslin');
    if (res.body.products.length > 0) {
      const product = res.body.products[0];
      expect(Array.isArray(product.colors)).toBe(true);
      expect(Array.isArray(product.sizes)).toBe(true);
    }
  });
});

describe('DELETE /api/products/:id (admin)', () => {
  it('deletes a product as admin', async () => {
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'To Delete', category: 'Test', vendor: 'Test', price: 100 });

    const id = createRes.body.id;

    const res = await request(app)
      .delete(`/api/products/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted');

    const getRes = await request(app).get(`/api/products/${id}`);
    expect(getRes.status).toBe(404);
  });

  it('returns 404 for non-existent product', async () => {
    const res = await request(app)
      .delete('/api/products/9999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
