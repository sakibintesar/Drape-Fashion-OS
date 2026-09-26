/**
 * SSLCommerz Payment Gateway Service
 * Handles payment initiation and validation for DRAPE Fashion OS
 */

const crypto = require('crypto');

// SSLCommerz configuration from environment
const SSLCOMMERZ_STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const SSLCOMMERZ_STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;
const SSLCOMMERZ_IS_SANDBOX = process.env.SSLCOMMERZ_IS_SANDBOX !== 'false';
const SSLCOMMERZ_INIT_URL = SSLCOMMERZ_IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
  : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSLCOMMERZ_VALIDATE_URL = SSLCOMMERZ_IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

/**
 * Generate a unique session ID for payment tracking
 */
function genSessionId() {
  return 'SSN-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

/**
 * Generate a unique transaction ID from order ID
 */
function genTranId(orderId) {
  return orderId + '-' + Date.now();
}

module.exports = {
  genSessionId,
  genTranId,
  SSLCOMMERZ_STORE_ID,
  SSLCOMMERZ_STORE_PASSWORD,
  SSLCOMMERZ_IS_SANDBOX,
  SSLCOMMERZ_INIT_URL,
  SSLCOMMERZ_VALIDATE_URL
};

/**
 * Build SSLCommerz initiation payload
 * @param {Object} params - Payment parameters
 * @returns {Object} Form-encoded payload for SSLCommerz
 */
function buildInitPayload(params) {
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
    customerCountry = 'Bangladesh',
    successUrl,
    failUrl,
    cancelUrl,
    ipnUrl,
    productName = 'DRAPE Fashion Order',
    productCategory = 'Fashion',
    productProfile = 'physical-goods',
    shippingMethod = 'YES',
    tranId
  } = params;

  const payload = {
    store_id: SSLCOMMERZ_STORE_ID,
    store_passwd: SSLCOMMERZ_STORE_PASSWORD,
    total_amount: amount,
    currency: currency,
    tran_id: tranId || genTranId(orderId),
    success_url: successUrl,
    fail_url: failUrl,
    cancel_url: cancelUrl,
    ipn_url: ipnUrl,
    cus_name: customerName,
    cus_email: customerEmail,
    cus_add1: customerAddress,
    cus_city: customerCity,
    cus_postcode: customerPostcode,
    cus_country: customerCountry,
    cus_phone: customerPhone,
    shipping_method: shippingMethod,
    product_name: productName,
    product_category: productCategory,
    product_profile: productProfile,
    product_amount: amount,
    currency: currency,
    format: 'json'
  };

  return payload;
}

/**
 * Build SSLCommerz validation payload
 * @param {string} valId - Validation ID from SSLCommerz
 * @returns {Object} Form-encoded payload for validation API
 */
function buildValidatePayload(valId) {
  return {
    store_id: SSLCOMMERZ_STORE_ID,
    store_passwd: SSLCOMMERZ_STORE_PASSWORD,
    val_id: valId,
    format: 'json'
  };
}

/**
 * Initiate a payment session with SSLCommerz
 * @param {Object} params - Payment parameters (see buildInitPayload)
 * @returns {Promise<Object>} SSLCommerz response with GatewayPageURL
 */
async function initiatePayment(params) {
  if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
    throw new Error('Payment gateway not configured');
  }

  const payload = buildInitPayload(params);

  try {
    const response = await fetch(SSLCOMMERZ_INIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(payload).toString()
    });

    const data = await response.json();

    if (data.GatewayPageURL) {
      return {
        success: true,
        gatewayUrl: data.GatewayPageURL,
        sessionId: data.sessionkey || params.sessionId,
        tranId: data.tran_id || params.tranId,
        data
      };
    } else {
      console.error('SSLCommerz initiate failed:', data);
      throw new Error(data.failedreason || 'Failed to initiate payment');
    }
  } catch (err) {
    console.error('SSLCommerz initiate error:', err);
    throw err;
  }
}

/**
 * Validate a payment with SSLCommerz validation API
 * @param {string} valId - Validation ID from SSLCommerz IPN or redirect
 * @returns {Promise<Object>} Validation result
 */
async function validatePayment(valId) {
  if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
    throw new Error('Payment gateway not configured');
  }

  const payload = buildValidatePayload(valId);

  try {
    const response = await fetch(SSLCOMMERZ_VALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(payload).toString()
    });

    const data = await response.json();

    const isValid = data.status === 'VALID' || data.status === 'VALIDATED';

    return {
      success: isValid,
      status: data.status,
      valId: data.val_id,
      tranId: data.tran_id,
      amount: data.amount,
      currency: data.currency,
      cardType: data.card_type,
      cardNo: data.card_no,
      bankTranId: data.bank_tran_id,
      data
    };
  } catch (err) {
    console.error('SSLCommerz validate error:', err);
    throw err;
  }
}

/**
 * Verify SSLCommerz IPN signature using MD5 checksum
 * @param {Object} payload - IPN payload from SSLCommerz
 * @returns {boolean} True if signature is valid
 */
function verifyIPNSignature(payload) {
  if (!SSLCOMMERZ_STORE_PASSWORD) return false;

  const { val_id, tran_id, amount, currency, status } = payload;
  if (!val_id || !tran_id || !amount || !currency || !status) return false;

  // SSLCommerz checksum formula: md5(store_password + '|' + val_id + '|' + tran_id + '|' + amount + '|' + currency + '|' + status)
  const expected = crypto
    .createHash('md5')
    .update(`${SSLCOMMERZ_STORE_PASSWORD}|${val_id}|${tran_id}|${amount}|${currency}|${status}`)
    .digest('hex');

  // Check both header and payload for checksum
  const received = payload.checksum || payload.signature;
  return received && received.toLowerCase() === expected.toLowerCase();
}

module.exports = {
  ...module.exports,
  initiatePayment,
  validatePayment,
  verifyIPNSignature,
  buildInitPayload,
  buildValidatePayload
};
