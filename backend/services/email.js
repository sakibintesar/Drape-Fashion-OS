/**
 * DRAPE Fashion OS — Email Service (Gmail SMTP via Nodemailer)
 *
 * Sends transactional emails via Gmail SMTP.
 * Falls back to console logging when credentials are not configured.
 *
 * Setup:
 *   1. Enable 2FA on your Gmail account
 *   2. Go to https://myaccount.google.com/apppasswords
 *   3. Generate an app password for "Mail"
 *   4. Set SMTP_USER (your Gmail) and SMTP_PASS (the app password) in .env
 */

const nodemailer = require('nodemailer');
const logger = require('../logger');

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.SMTP_FROM || SMTP_USER || 'noreply@drapefashion.com';
const SITE_URL = process.env.CORS_ORIGIN || 'https://drape-fashion-os.onrender.com';

let transporter = null;

if (SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  logger.info('[email] Gmail SMTP initialized', { user: SMTP_USER });
} else {
  logger.info('[email] No SMTP_USER/SMTP_PASS — emails will be logged only');
}

/**
 * Send an email. Logs to console if SMTP is not configured.
 */
async function sendEmail({ to, subject, html, text }) {
  if (!to) return;

  if (transporter) {
    try {
      await transporter.sendMail({ from: `"DRAPE" <${FROM_EMAIL}>`, to, subject, html, text });
      logger.info('[email] Sent', { to, subject });
    } catch (err) {
      logger.error('[email] SMTP error', { message: err.message, to, subject });
    }
  } else {
    logger.info('[email] (dev mode — not sent)', { to, subject, html: html.substring(0, 200) });
  }
}

/**
 * Send order confirmation email
 * @param {Object} order - { orderId, items, total, subtotal, shipping, email, customer_fname, payment_method }
 */
async function sendOrderConfirmation(order) {
  const { orderId, items, total, subtotal, shipping, email, customer_fname, payment_method } = order;
  if (!email) return;

  const payLabels = { cod: 'Cash on Delivery', bkash: 'bKash', nagad: 'Nagad', card: 'Card' };
  const payLabel = payLabels[payment_method] || payment_method || 'COD';

  const itemList = (items || []).map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.emoji || ''} ${i.name || 'Item'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.qty || 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-family:monospace">৳${((i.price || 0) * (i.qty || 1)).toLocaleString()}</td>
    </tr>`
  ).join('');

  const html = `
    <div style="font-family:'DM Sans',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#1a1a1a">
      <div style="text-align:center;margin-bottom:24px">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:4px;margin:0">DR<span style="color:#b87333">A</span>PE</h1>
      </div>
      <div style="background:#faf8f5;border-radius:8px;padding:24px;margin-bottom:24px">
        <h2 style="margin:0 0 8px;font-size:18px;font-weight:500">Order Confirmed! 🎉</h2>
        <p style="margin:0;color:#666;font-size:14px">Hi ${customer_fname || 'there'}, your order has been placed successfully.</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px">
        <thead><tr style="border-bottom:2px solid #1a1a1a">
          <th style="padding:8px 12px;text-align:left">Item</th>
          <th style="padding:8px 12px;text-align:center">Qty</th>
          <th style="padding:8px 12px;text-align:right">Price</th>
        </tr></thead>
        <tbody>${itemList}</tbody>
      </table>
      <div style="font-size:14px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;padding:4px 0"><span>Subtotal</span><span style="font-family:monospace">৳${(subtotal || 0).toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;padding:4px 0"><span>Shipping</span><span style="font-family:monospace">${shipping === 0 ? 'Free' : '৳' + (shipping || 0)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid #1a1a1a;font-weight:600;font-size:16px"><span>Total</span><span style="font-family:monospace">৳${(total || 0).toLocaleString()}</span></div>
      </div>
      <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-bottom:24px;font-size:13px">
        <div><strong>Order ID:</strong> ${orderId}</div>
        <div><strong>Payment:</strong> ${payLabel}</div>
        <div style="margin-top:8px"><a href="${SITE_URL}/#track" style="color:#b87333;text-decoration:none">Track your order →</a></div>
      </div>
      <p style="font-size:12px;color:#999;text-align:center">Thank you for shopping with DRAPE.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Order Confirmed — ${orderId} | DRAPE`,
    html,
    text: `Hi ${customer_fname || ''}, your order ${orderId} is confirmed. Total: ৳${(total || 0).toLocaleString()}. Track at: ${SITE_URL}/#track`
  });
}

/**
 * Send welcome email after customer registration
 * @param {Object} user - { email, fname }
 */
async function sendWelcomeEmail(user) {
  if (!user?.email) return;

  const html = `
    <div style="font-family:'DM Sans',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#1a1a1a">
      <div style="text-align:center;margin-bottom:24px">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:4px;margin:0">DR<span style="color:#b87333">A</span>PE</h1>
      </div>
      <div style="background:#faf8f5;border-radius:8px;padding:24px;margin-bottom:24px">
        <h2 style="margin:0 0 8px;font-size:18px;font-weight:500">Welcome to DRAPE! ✨</h2>
        <p style="margin:0;color:#666;font-size:14px">Hi ${user.fname || 'there'}, thanks for joining our community of artisan fashion lovers.</p>
      </div>
      <div style="font-size:14px;line-height:1.6;margin-bottom:24px">
        <p>Here's what you can do with your account:</p>
        <ul style="padding-left:20px">
          <li>Track your orders in real time</li>
          <li>Save your favorite pieces</li>
          <li>Get exclusive access to new arrivals</li>
        </ul>
      </div>
      <div style="text-align:center;margin:24px 0">
        <a href="${SITE_URL}/#shop" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 32px;text-decoration:none;border-radius:4px;font-size:13px;letter-spacing:1px;text-transform:uppercase">Start Shopping →</a>
      </div>
      <p style="font-size:12px;color:#999;text-align:center">DRAPE — Where heritage meets modern fashion.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Welcome to DRAPE! ✨',
    html,
    text: `Hi ${user.fname || ''}, welcome to DRAPE! Start shopping at: ${SITE_URL}/#shop`
  });
}

module.exports = { sendOrderConfirmation, sendWelcomeEmail };
