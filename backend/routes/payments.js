const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { run, get, all, transaction } = require('../database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { handleValidation, stripTags } = require('../middleware/validate');
const {
  initiatePayment,
  validatePayment,
  verifyIPNSignature,
  genSessionId,
  genTranId
} = require('../services/sslcommerz');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// POST /api/payments/initiate — initiate SSLCommerz payment session
// Supports both authenticated users and guest checkout
const initiateValidation = [
  body('orderId').trim().notEmpty().withMessage('Order ID required'),
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer (in paisa/cents)'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3-letter code'),
  body('customerName').trim().notEmpty().withMessage('Customer name required'),
  body('customerEmail').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('customerPhone').trim().notEmpty().withMessage('Phone required'),
  body('customerAddress').trim().notEmpty().withMessage('Address required'),
  body('customerCity').optional().trim().isLength({ max: 100 }),
  body('customerPostcode').optional().trim().isLength({ max: 20 }),
  body('customerCountry').optional().trim().isLength({ max: 50 }),
  body('idempotencyKey')
    .optional()
    .trim()
    .isLength({ min: 16, max: 64 })
    .withMessage('Invalid idempotency key')
];

router.post('/initiate', optionalAuth, initiateValidation, handleValidation, async (req, res) => {
  const {
    orderId,
    amount,
    currency = 'BDT',
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity = 'Dhaka',
    customerPostcode = '1000',
    customerCountry = 'Bangladesh'
  } = req.body;

  try {
    const { idempotencyKey } = req.body;

    // Check idempotency key
    if (idempotencyKey) {
      const existing = await get('SELECT * FROM payment_sessions WHERE idempotency_key = ?', [
        idempotencyKey
      ]);
      if (existing) {
        const initData = existing.gateway_response_json
          ? JSON.parse(existing.gateway_response_json)
          : null;
        return res.json({
          gatewayUrl: initData?.GatewayPageURL,
          sessionId: existing.session_id,
          tranId: existing.tran_id,
          duplicate: true
        });
      }
    }

    // Find order - support both authenticated and guest orders
    let order;
    if (req.user && req.user.id) {
      // Authenticated user - verify ownership
      order = await get(
        'SELECT * FROM orders WHERE order_id = ? AND customer_id = ? AND status = ?',
        [orderId, req.user.id, 'pending']
      );
    } else {
      // Guest order - find by order_id and email/phone match
      order = await get(
        'SELECT * FROM orders WHERE order_id = ? AND status = ? AND (email = ? OR phone = ?)',
        [orderId, 'pending', customerEmail, customerPhone]
      );
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found or not payable' });
    }

    // Validate amount matches order total (allow small difference for rounding)
    if (Math.abs(order.total - amount) > 10) {
      return res.status(400).json({ error: 'Amount mismatch with order total' });
    }

    const sessionId = genSessionId();
    const tranId = genTranId(orderId);
    const successUrl = `${frontendUrl}/payment/success?session_id=${sessionId}`;
    const failUrl = `${frontendUrl}/payment/fail?session_id=${sessionId}`;
    const cancelUrl = `${frontendUrl}/payment/cancel?session_id=${sessionId}`;
    const ipnUrl = `${process.env.BACKEND_URL || frontendUrl}/api/webhooks/sslcommerz/ipn`;

    // Initiate payment via SSLCommerz service
    const result = await initiatePayment({
      orderId,
      amount,
      currency,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerPostcode,
      customerCountry,
      successUrl,
      failUrl,
      cancelUrl,
      ipnUrl,
      sessionId,
      tranId
    });

    // Store payment session
    await run(
      `INSERT INTO payment_sessions 
       (session_id, order_id, amount, currency, status, tran_id, idempotency_key, gateway_response_json) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        orderId,
        amount,
        currency,
        'initiated',
        tranId,
        idempotencyKey || null,
        JSON.stringify(result.data)
      ]
    );

    res.json({
      gatewayUrl: result.gatewayUrl,
      sessionId: result.sessionId,
      tranId: result.tranId
    });
  } catch (err) {
    console.error('Payment initiate error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// POST /api/payments/verify — verify payment with SSLCommerz
const verifyValidation = [
  body('val_id').trim().notEmpty().withMessage('Validation ID (val_id) required')
];

router.post('/verify', verifyValidation, handleValidation, async (req, res) => {
  const { val_id } = req.body;

  try {
    // Validate payment via SSLCommerz service
    const result = await validatePayment(val_id);

    const session = await get('SELECT * FROM payment_sessions WHERE val_id = ?', [val_id]);
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found' });
    }

    await run(
      'UPDATE payment_sessions SET val_id = ?, status = ?, tran_id = ?, card_type = ?, card_no = ?, bank_tran_id = ?, gateway_response_json = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?',
      [
        val_id,
        result.success ? 'validated' : 'failed',
        result.tranId || session.tran_id,
        result.cardType || null,
        result.cardNo || null,
        result.bankTranId || null,
        JSON.stringify(result.data),
        session.session_id
      ]
    );

    if (result.success) {
      await run(
        'UPDATE orders SET status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
        ['processing', 'sslcommerz', session.order_id]
      );

      // Send payment success notification
      try {
        const { sendPaymentSuccess } = require('../services/notifications');
        const order = await get('SELECT * FROM orders WHERE order_id = ?', [session.order_id]);
        if (order) {
          await sendPaymentSuccess(
            order,
            { amount: result.amount },
            {
              fname: order.customer_fname,
              email: order.email,
              phone: order.phone,
              whatsappOptIn: false
            }
          );
        }
      } catch (notifyErr) {
        console.error('Notification send failed:', notifyErr);
      }
    }

    res.json({
      success: result.success,
      status: result.status,
      session: {
        sessionId: session.session_id,
        orderId: session.order_id,
        amount: session.amount,
        currency: session.currency,
        tranId: result.tranId,
        cardType: result.cardType,
        cardNo: result.cardNo,
        bankTranId: result.bankTranId
      }
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/payments/session/:sessionId — get payment session status
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await get('SELECT * FROM payment_sessions WHERE session_id = ?', [
      req.params.sessionId
    ]);
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found' });
    }
    res.json({ session });
  } catch (err) {
    console.error('Get payment session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/payments/order/:orderId — get payment sessions for an order
router.get('/order/:orderId', async (req, res) => {
  try {
    const sessions = await all(
      'SELECT * FROM payment_sessions WHERE order_id = ? ORDER BY created_at DESC',
      [req.params.orderId]
    );
    res.json({ sessions });
  } catch (err) {
    console.error('Get payment sessions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
