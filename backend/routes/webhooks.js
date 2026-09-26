const express = require('express');
const router = express.Router();
const { run, get, all, transaction } = require('../database');
const { verifyIPNSignature, validatePayment } = require('../services/sslcommerz');
const { sendPaymentSuccess, sendPaymentFailed } = require('../services/notifications');

// SSLCommerz IPN (Instant Payment Notification) handler
// This endpoint receives asynchronous payment notifications from SSLCommerz
router.post('/sslcommerz/ipn', async (req, res) => {
  const startTime = Date.now();
  const payload = req.body;
  const headers = req.headers;

  // Log the incoming webhook
  let logId = null;
  try {
    const result = await run(
      `INSERT INTO webhook_logs (source, event_type, payload_json, headers_json, verified, processing_result)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['sslcommerz', 'ipn', JSON.stringify(payload), JSON.stringify(headers), false, 'pending']
    );
    logId = result.id;
  } catch (logErr) {
    console.error('Failed to log webhook:', logErr);
  }

  try {
    // Verify HMAC signature using SSLCommerz service
    if (!verifyIPNSignature(payload)) {
      await run(`UPDATE webhook_logs SET verified = ?, processing_result = ? WHERE id = ?`, [
        false,
        'Invalid signature',
        logId
      ]);
      console.warn('IPN signature verification failed');
      return res.status(401).send('Invalid signature');
    }

    // Extract key fields from SSLCommerz IPN
    const { val_id, tran_id, amount, currency, status, card_type, card_no, bank_tran_id } = payload;

    // Verify required fields
    if (!val_id || !tran_id) {
      await run(`UPDATE webhook_logs SET verified = ?, processing_result = ? WHERE id = ?`, [
        false,
        'Missing val_id or tran_id',
        logId
      ]);
      return res.status(400).send('Missing required fields');
    }

    // Verify with SSLCommerz validation API using service
    const result = await validatePayment(val_id);

    // Find the payment session
    const session = await get(
      'SELECT * FROM payment_sessions WHERE session_id = ? OR tran_id = ?',
      [val_id, tran_id]
    );

    if (!session) {
      await run(`UPDATE webhook_logs SET verified = ?, processing_result = ? WHERE id = ?`, [
        false,
        'Payment session not found',
        logId
      ]);
      console.warn('IPN received for unknown session:', { val_id, tran_id });
      return res.status(404).send('Session not found');
    }

    // Update webhook log with verification result
    const isValid = result.success;
    await run(`UPDATE webhook_logs SET verified = ?, processing_result = ? WHERE id = ?`, [
      isValid,
      isValid ? 'verified_and_processed' : 'validation_failed',
      logId
    ]);

    // Update payment session with IPN data
    await run(
      `UPDATE payment_sessions SET
         val_id = ?,
         status = ?,
         tran_id = ?,
         card_type = ?,
         card_no = ?,
         bank_tran_id = ?,
         gateway_response_json = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE session_id = ?`,
      [
        val_id,
        isValid ? 'validated' : 'failed',
        tran_id,
        card_type || result.cardType || null,
        card_no || result.cardNo || null,
        bank_tran_id || result.bankTranId || null,
        JSON.stringify({ ipn: payload, validation: result.data }),
        session.session_id
      ]
    );

    // If payment is valid, update order status and send notifications
    if (isValid) {
      await run(
        `UPDATE orders SET status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?`,
        ['processing', 'sslcommerz', session.order_id]
      );
      console.log('Order ' + session.order_id + ' marked as processing via IPN');

      // Send payment success notification
      try {
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
        console.error('Payment success notification failed:', notifyErr);
      }
    } else {
      console.warn('IPN validation failed for session ' + session.session_id + ':', result.data);

      // Send payment failure notification
      try {
        const order = await get('SELECT * FROM orders WHERE order_id = ?', [session.order_id]);
        if (order) {
          await sendPaymentFailed(order, {
            fname: order.customer_fname,
            email: order.email,
            phone: order.phone
          });
        }
      } catch (notifyErr) {
        console.error('Payment failure notification failed:', notifyErr);
      }
    }

    // Always respond with 200 to acknowledge receipt (SSLCommerz expects this)
    res.status(200).send('OK');
  } catch (err) {
    console.error('IPN processing error:', err);
    if (logId) {
      await run(`UPDATE webhook_logs SET verified = ?, processing_result = ? WHERE id = ?`, [
        false,
        'Error: ' + err.message,
        logId
      ]);
    }
    // Still return 200 to prevent SSLCommerz from retrying indefinitely
    res.status(200).send('OK');
  }
});

// GET /api/webhooks/sslcommerz/ipn — for testing/verification
router.get('/sslcommerz/ipn', (req, res) => {
  res.json({
    message: 'SSLCommerz IPN endpoint is active',
    method: 'POST only',
    expectedFields: ['val_id', 'tran_id', 'amount', 'currency', 'status']
  });
});

// GET /api/webhooks/logs — admin: view webhook logs
router.get('/logs', async (req, res) => {
  try {
    const { limit = 50, offset = 0, source, verified } = req.query;
    let sql = 'SELECT * FROM webhook_logs WHERE 1=1';
    const params = [];

    if (source) {
      sql += ' AND source = ?';
      params.push(source);
    }
    if (verified !== undefined) {
      sql += ' AND verified = ?';
      params.push(verified === 'true');
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const logs = await all(sql, params);
    res.json({ logs });
  } catch (err) {
    console.error('Get webhook logs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
