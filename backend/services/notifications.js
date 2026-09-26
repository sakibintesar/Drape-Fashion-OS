/**
 * Notifications Service
 * Handles Email (SendGrid/Resend), SMS (Twilio), and WhatsApp notifications
 * Provides no-op fallback when providers are not configured
 */

// Email providers
let sendgridClient = null;
let resendClient = null;

// SMS/WhatsApp providers
let twilioClient = null;

/**
 * Initialize notification providers from environment
 */
function initProviders() {
  // SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      sendgridClient = require('@sendgrid/mail');
      sendgridClient.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SendGrid initialized');
    } catch (e) {
      console.warn('⚠️ SendGrid init failed:', e.message);
    }
  }

  // Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = require('resend');
      resendClient = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Resend initialized');
    } catch (e) {
      console.warn('⚠️ Resend init failed:', e.message);
    }
  }

  // Twilio (SMS + WhatsApp)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      twilioClient = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      console.log('✅ Twilio initialized');
    } catch (e) {
      console.warn('⚠️ Twilio init failed:', e.message);
    }
  }

  if (!sendgridClient && !resendClient && !twilioClient) {
    console.log('ℹ️ No notification providers configured — using no-op fallback');
  }
}

/**
 * Send email via SendGrid or Resend
 * @param {Object} params - Email parameters
 * @returns {Promise<Object>} Result with success status and provider used
 */
async function sendEmail({ to, subject, html, text, from }) {
  const senderEmail = from || process.env.DEFAULT_FROM_EMAIL || 'noreply@drapefashion.com';
  const senderName = process.env.DEFAULT_FROM_NAME || 'DRAPE Fashion';

  // Try SendGrid first
  if (sendgridClient) {
    try {
      await sendgridClient.send({
        to,
        from: { email: senderEmail, name: senderName },
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '')
      });
      return { success: true, provider: 'sendgrid' };
    } catch (err) {
      console.error('SendGrid send failed:', err.message);
    }
  }

  // Fallback to Resend
  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: `${senderName} <${senderEmail}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '')
      });
      return { success: true, provider: 'resend' };
    } catch (err) {
      console.error('Resend send failed:', err.message);
    }
  }

  // No-op fallback
  console.log(`📧 [NO-OP EMAIL] To: ${to}, Subject: ${subject}`);
  return { success: true, provider: 'noop', message: 'Email logged (no provider configured)' };
}

module.exports = {
  sendEmail,
  initProviders
};

/**
 * Send SMS via Twilio
 * @param {Object} params - SMS parameters
 * @returns {Promise<Object>} Result with success status
 */
async function sendSMS({ to, body }) {
  if (!twilioClient) {
    console.log(`📱 [NO-OP SMS] To: ${to}, Body: ${body}`);
    return { success: true, provider: 'noop', message: 'SMS logged (no provider configured)' };
  }

  try {
    const message = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    return { success: true, provider: 'twilio', sid: message.sid };
  } catch (err) {
    console.error('Twilio SMS send failed:', err.message);
    throw err;
  }
}

/**
 * Send WhatsApp message via Twilio
 * @param {Object} params - WhatsApp parameters
 * @returns {Promise<Object>} Result with success status
 */
async function sendWhatsApp({ to, body, templateSid, templateParams }) {
  if (!twilioClient) {
    console.log(`💬 [NO-OP WhatsApp] To: ${to}, Body: ${body}`);
    return { success: true, provider: 'noop', message: 'WhatsApp logged (no provider configured)' };
  }

  try {
    const options = {
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
      body
    };

    if (templateSid) {
      options.contentSid = templateSid;
      if (templateParams) options.contentVariables = JSON.stringify(templateParams);
    }

    const message = await twilioClient.messages.create(options);
    return { success: true, provider: 'twilio', sid: message.sid };
  } catch (err) {
    console.error('Twilio WhatsApp send failed:', err.message);
    throw err;
  }
}

module.exports = {
  ...module.exports,
  sendSMS,
  sendWhatsApp
};

/**
 * Send order confirmation notifications
 * @param {Object} order - Order object
 * @param {Object} customer - Customer info (email, phone, name)
 * @returns {Promise<Object>} Results for all channels
 */
async function sendOrderConfirmation(order, customer) {
  const orderId = order.order_id || order.id;
  const total = order.total || order.subtotal;
  const items = order.items || [];

  const subject = `Order Confirmation - ${orderId}`;
  const html = generateOrderEmailHtml(orderId, customer.fname, items, total);
  const text = `Thank you for your order ${orderId}! Total: ${total} BDT`;

  const results = {
    email: null,
    sms: null,
    whatsapp: null
  };

  // Send email
  if (customer.email) {
    results.email = await sendEmail({
      to: customer.email,
      subject,
      html,
      text
    });
  }

  // Send SMS
  if (customer.phone) {
    results.sms = await sendSMS({
      to: customer.phone,
      body: `Your DRAPE order ${orderId} is confirmed. Total: ${total} BDT. Track at drapefashion.com/orders/${orderId}`
    });
  }

  // Send WhatsApp (if opted in)
  if (customer.phone && customer.whatsappOptIn) {
    results.whatsapp = await sendWhatsApp({
      to: customer.phone,
      body: `Your DRAPE order ${orderId} is confirmed! 🛍️ Total: ${total} BDT`
    });
  }

  return results;
}

/**
 * Send payment success notifications
 * @param {Object} order - Order object
 * @param {Object} payment - Payment session info
 * @param {Object} customer - Customer info
 * @returns {Promise<Object>} Results
 */
async function sendPaymentSuccess(order, payment, customer) {
  const orderId = order.order_id || order.id;
  const amount = payment.amount || order.total;

  const subject = `Payment Successful - Order ${orderId}`;
  const html = `
    <h2>Payment Successful! ✅</h2>
    <p>Hi ${customer.fname},</p>
    <p>Your payment of <strong>${amount} BDT</strong> for order <strong>${orderId}</strong> has been confirmed.</p>
    <p>Your order is now being processed.</p>
    <p>Thank you for shopping with DRAPE Fashion!</p>
  `;

  const results = { email: null, sms: null, whatsapp: null };

  if (customer.email) {
    results.email = await sendEmail({ to: customer.email, subject, html });
  }
  if (customer.phone) {
    results.sms = await sendSMS({
      to: customer.phone,
      body: `Payment of ${amount} BDT received for order ${orderId}. Your order is being processed.`
    });
  }
  if (customer.phone && customer.whatsappOptIn) {
    results.whatsapp = await sendWhatsApp({
      to: customer.phone,
      body: `Payment confirmed! ✅ ${amount} BDT for order ${orderId}.`
    });
  }

  return results;
}

module.exports = {
  ...module.exports,
  sendOrderConfirmation,
  sendPaymentSuccess
};

/**
 * Send payment failure notifications
 * @param {Object} order - Order object
 * @param {Object} customer - Customer info
 * @returns {Promise<Object>} Results
 */
async function sendPaymentFailed(order, customer) {
  const orderId = order.order_id || order.id;

  const subject = `Payment Failed - Order ${orderId}`;
  const html = `
    <h2>Payment Failed ❌</h2>
    <p>Hi ${customer.fname},</p>
    <p>Unfortunately, your payment for order <strong>${orderId}</strong> could not be processed.</p>
    <p>Please try again or contact support if the issue persists.</p>
  `;

  const results = { email: null, sms: null };

  if (customer.email) {
    results.email = await sendEmail({ to: customer.email, subject, html });
  }
  if (customer.phone) {
    results.sms = await sendSMS({
      to: customer.phone,
      body: `Payment failed for order ${orderId}. Please retry at drapefashion.com/orders/${orderId}`
    });
  }

  return results;
}

/**
 * Generate order confirmation email HTML
 */
function generateOrderEmailHtml(orderId, customerName, items, total) {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price} BDT</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a2e; color: #e94560; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">DRAPE Fashion</h1>
      </div>
      <div style="background: #fafafa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
        <h2 style="color: #1a1a2e; margin-top: 0;">Order Confirmed! 🎉</h2>
        <p>Hi ${customerName || 'there'},</p>
        <p>Thank you for your order <strong>${orderId}</strong>. We're preparing it for shipment.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #1a1a2e; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="text-align: right; font-size: 18px; font-weight: bold; color: #e94560;">
          Total: ${total} BDT
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Questions? Reply to this email or visit <a href="https://drapefashion.com" style="color: #e94560;">drapefashion.com</a></p>
      </div>
    </body>
    </html>
  `;
}

// Initialize providers on module load
initProviders();

module.exports = {
  ...module.exports,
  sendPaymentFailed,
  generateOrderEmailHtml
};
