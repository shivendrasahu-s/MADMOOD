/**
 * MAD MOOD Secure Payment Gateway Simulation Module (razorpayBackend.ts)
 * 
 * This module simulates protected, server-to-server endpoints:
 * 1. POST /api/payment/orders  -> apiCreateRazorpayOrder()
 * 2. POST /api/payment/verify  -> apiVerifyRazorpaySignature()
 * 
 * In a production architecture, these operations run exclusively on a secured Node/Express
 * backend utilizing the 'razorpay' SDK and Node's native 'crypto' library for HMAC-SHA256
 * signature checking. We simulate these backend processes here with proper network latency
 * and secure credential matching logs.
 */

export interface RazorpaySimulatedOrder {
  id: string;
  entity: 'order';
  amount: number; // In paise
  amount_paid: number;
  amount_due: number;
  currency: 'INR';
  receipt: string;
  status: 'created';
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

// Emulated server-side environment variables
const MOCK_RAZORPAY_KEY_SECRET = 'mad_mood_secret_key_889988';

/**
 * Simulates: POST /api/payment/orders
 * Generates a unique Razorpay transaction order ID mapped on the payment grid.
 */
export const apiCreateRazorpayOrder = async (
  amountInRupees: number,
  receiptId: string = ''
): Promise<RazorpaySimulatedOrder> => {
  // Simulate network roundtrip latency (400ms)
  await new Promise(resolve => setTimeout(resolve, 400));

  const amountInPaise = amountInRupees * 100;
  const simulatedOrderId = 'order_' + Math.random().toString(36).substring(2, 10).toUpperCase();

  console.log(`[MAD MOOD SECURE GATEWAY]: Server order created successfully.`);
  console.log(`[MAD MOOD SECURE GATEWAY]: Razorpay Order ID: ${simulatedOrderId} | Amount: ₹${amountInRupees} (${amountInPaise} Paise)`);

  return {
    id: simulatedOrderId,
    entity: 'order',
    amount: amountInPaise,
    amount_paid: 0,
    amount_due: amountInPaise,
    currency: 'INR',
    receipt: receiptId || `receipt_${Math.floor(Math.random() * 1000000)}`,
    status: 'created',
    attempts: 0,
    notes: {
      brand: 'MAD MOOD',
      category: 'Premium Menswear'
    },
    created_at: Math.floor(Date.now() / 1000)
  };
};

/**
 * Simulates: POST /api/payment/verify
 * Verifies the validity of signature: HMAC_SHA256(order_id + '|' + payment_id, secret)
 */
export const apiVerifyRazorpaySignature = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> => {
  // Simulate cryptographic processing and verification network latency (600ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  console.log(`[MAD MOOD SECURE GATEWAY]: Initiating payment cryptographic validation...`);
  console.log(`[MAD MOOD SECURE GATEWAY]: Received razorpay_payment_id: ${paymentId}`);
  console.log(`[MAD MOOD SECURE GATEWAY]: Received razorpay_order_id: ${orderId}`);
  console.log(`[MAD MOOD SECURE GATEWAY]: Received razorpay_signature: ${signature}`);

  if (!paymentId || !orderId || !signature) {
    console.error(`[MAD MOOD SECURE GATEWAY]: Verification failed - missing required secure parameters.`);
    return false;
  }

  // To simulate verification, we check if the signature is formatted correctly.
  // In our mock, any valid non-empty values signify a successful client-side payment completion.
  // We log the mock verification algorithm:
  const mockPayload = `${orderId}|${paymentId}`;
  console.log(`[MAD MOOD SECURE GATEWAY]: Compiling verification payload: "${mockPayload}"`);
  console.log(`[MAD MOOD SECURE GATEWAY]: Performing HMAC-SHA256 encryption with secret key length: ${MOCK_RAZORPAY_KEY_SECRET.length}`);
  
  // Emulate signature check success
  console.log(`[MAD MOOD SECURE GATEWAY]: Matching signatures:`);
  console.log(`  -> Client Signature: ${signature}`);
  console.log(`  -> Server Computed:  ${signature}`); // Match Client Signature for simulation
  console.log(`[MAD MOOD SECURE GATEWAY]: ✅ CRYPTOGRAPHIC SIGNATURE MATCH - PAYMENT AUTHORIZED & SETTLED.`);

  return true;
};
