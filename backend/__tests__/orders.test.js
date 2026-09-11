const request = require('supertest');
const { cleanAndSeed, buildApp, makeAccessToken, createTestUser } = require('./app');
const { get, run } = require('../database');

let app;
let adminToken;
let customerToken;
let customerId;

beforeAll(async () => {
  await cleanAndSeed();
  app = buildApp();

  // Admin token
  const admin = await get('SELECT id FROM users WHERE username = ?', ['admin']);
  adminToken = makeAccessToken(admin.id);

  // Customer token
  const customer = await createTestUser('customer', {
    email: 'order-test@test.com',
    password: 'TestPass1!'
  });
  customerToken = makeAccessToken(customer.id);
  customerId = customer.id;
});

describe('POST /api/orders/validate', () => {
  it('validates cart items against database', async () => {
    const res = await request(app)
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ id: 1, qty: 1, price: 3200 }] });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.validated.length).toBe(1);
  });

  it('rejects empty items array', async () => {
    const res = await request(app)
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [] });

    expect(res.status).toBe(400);
  });

  it('flags non-existent product', async () => {
    const res = await request(app)
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ id: 9999, qty: 1, price: 100 }] });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.issues.length).toBe(1);
    expect(res.body.issues[0].reason).toContain('not found');
  });

  it('flags price mismatch', async () => {
    const res = await request(app)
      .post('/api/orders/validate')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ id: 1, qty: 1, price: 100 }] }); // wrong price

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.issues[0].reason).toContain('Price mismatch');
  });

  it('allows guest (unauthenticated) validation', async () => {
    const res = await request(app)
      .post('/api/orders/validate')
      .send({ items: [{ id: 1, qty: 1, price: 3200 }] });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.validated.length).toBe(1);
  });
});

describe('POST /api/orders', () => {
  it('creates an order successfully', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Test',
        lname: 'Customer',
        email: 'order-test@test.com',
        phone: '+880 171 0000000',
        address: '123 Test Street',
        city: 'Dhaka',
        postcode: '1200',
        items: [{ id: 3, qty: 2 }], // Silk Slip Top @ 1800 × 2 = 3600
        payment: 'cod',
        customerId: customerId
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.orderId).toMatch(/^DRP-\d{4}-\d{6}$/);
    expect(res.body.subtotal).toBe(3600);
    expect(res.body.shipping).toBe(0); // > 3000 → free shipping
    expect(res.body.total).toBe(3600);
  });

  it('applies shipping for orders under 3000', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Test',
        lname: 'Customer',
        email: 'order-test@test.com',
        phone: '+880 171 0000000',
        address: '123 Test Street',
        city: 'Dhaka',
        postcode: '1200',
        items: [{ id: 6, qty: 1 }], // Leather Mini Bag @ 1400
        payment: 'cod',
        customerId: customerId
      });

    expect(res.status).toBe(201);
    expect(res.body.subtotal).toBe(1400);
    expect(res.body.shipping).toBe(80);
    expect(res.body.total).toBe(1480);
  });

  it('rejects order with missing fields', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ fname: 'Test' });

    expect(res.status).toBe(400);
  });

  it('rejects order with non-existent product', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Test',
        lname: 'Customer',
        email: 'test@test.com',
        phone: '+880 171 0000000',
        address: '123 Test St',
        items: [{ id: 9999, qty: 1 }]
      });

    expect(res.status).toBe(409); // Conflict — product not found
  });

  it('allows guest (unauthenticated) order creation', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        fname: 'Guest',
        lname: 'User',
        email: 'guest@test.com',
        phone: '+880 171 0000000',
        address: '123 Guest St',
        city: 'Dhaka',
        postcode: '1200',
        items: [{ id: 5, qty: 1 }], // Broderie Kurta @ 2100
        payment: 'cod'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.orderId).toMatch(/^DRP-\d{4}-\d{6}$/);
    expect(res.body.subtotal).toBe(2100);

    // Verify customer_id is null for guest order
    const order = await get('SELECT customer_id FROM orders WHERE order_id = ?', [res.body.orderId]);
    expect(order.customer_id).toBeNull();
  });

  it('links order to user when authenticated', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Auth',
        lname: 'User',
        email: 'auth@test.com',
        phone: '+880 171 0000000',
        address: '456 Auth Ave',
        city: 'Chittagong',
        postcode: '4000',
        items: [{ id: 8, qty: 1 }], // Cotton Panjabi @ 1600
        payment: 'cod'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    // Verify customer_id matches the logged-in user
    const order = await get('SELECT customer_id FROM orders WHERE order_id = ?', [res.body.orderId]);
    expect(order.customer_id).toBe(customerId);
  });
});

describe('GET /api/orders/track/:orderId', () => {
  let orderId;

  beforeAll(async () => {
    // Create an order to track
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Track',
        lname: 'Me',
        email: 'track@test.com',
        phone: '+880 171 1111111',
        address: '456 Track Ave',
        city: 'Chittagong',
        postcode: '4000',
        items: [{ id: 4, qty: 1 }],
        payment: 'cod'
      });
    orderId = res.body.orderId;
  });

  it('tracks an order by ID', async () => {
    const res = await request(app).get(`/api/orders/track/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.orderId).toBe(orderId);
    expect(res.body.status).toBe('pending');
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].name).toBe('Wide-Leg Trousers');
  });

  it('returns limited data (no PII)', async () => {
    const res = await request(app).get(`/api/orders/track/${orderId}`);
    expect(res.body.email).toBeUndefined();
    expect(res.body.phone).toBeUndefined();
    expect(res.body.address).toBeUndefined();
    expect(res.body.customer_fname).toBeUndefined();
  });

  it('returns 404 for unknown order', async () => {
    const res = await request(app).get('/api/orders/track/DRP-2026-000000');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/orders (admin)', () => {
  it('lists orders as admin', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.orders.length).toBeGreaterThanOrEqual(1);
    expect(res.body.pagination).toBeDefined();
  });

  it('rejects listing orders as customer', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/orders/:orderId/status (admin)', () => {
  let orderId;

  beforeAll(async () => {
    // Get an existing order
    const order = await get('SELECT order_id FROM orders LIMIT 1');
    orderId = order.order_id;
  });

  it('updates order status as admin', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'processing' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('processing');
  });

  it('rejects invalid status', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'invalid_status' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('must be one of');
  });

  it('returns 404 for non-existent order', async () => {
    const res = await request(app)
      .put('/api/orders/DRP-2026-999999/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'shipped' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/orders/:orderId (admin)', () => {
  it('cancels an order as admin', async () => {
    // Create an order to cancel
    const createRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        fname: 'Cancel',
        lname: 'Me',
        email: 'cancel@test.com',
        phone: '+880 171 2222222',
        address: '789 Cancel Blvd',
        city: 'Sylhet',
        postcode: '3100',
        items: [{ id: 8, qty: 1 }],
        payment: 'cod'
      });

    const orderId = createRes.body.orderId;

    const res = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify status is cancelled
    const trackRes = await request(app).get(`/api/orders/track/${orderId}`);
    expect(trackRes.body.status).toBe('cancelled');
  });
});
