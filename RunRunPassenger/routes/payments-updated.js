/**
 * Updated Payment Routes with Real Payment Processing
 * Run-Run Guinea-Bissau
 * 
 * Developer: Edivaldo Cardoso
 * Email: suporte@runrungb.com
 * Phone: +245 955 971 275
 * Date: January 6, 2026
 * 
 * This file replaces the simulated payment processing with real gateway integrations
 */

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Import payment services
const paystackService = require('../services/paystack.service');
const orangeMoneyService = require('../services/orangemoney.service');
const mtnMoMoService = require('../services/mtnmomo.service');

// ============================================
// PAYMENT METHOD MANAGEMENT
// ============================================

/**
 * GET /api/payments/methods
 * Get all payment methods for authenticated user
 */
router.get('/methods', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const methods = await db.all(
      `SELECT * FROM payment_methods 
       WHERE user_id = ? AND is_deleted = 0 
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );
    
    res.json({ success: true, methods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment methods' });
  }
});

/**
 * POST /api/payments/methods
 * Add a new payment method
 */
router.post('/methods', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, card_last4, card_brand, phone_number, authorization_code, is_default } = req.body;
    
    // Validate required fields
    if (!type || (type === 'card' && !card_last4) || ((type === 'orange_money' || type === 'mtn_money') && !phone_number)) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // If this should be default, unset other defaults
    if (is_default) {
      await db.run(
        'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?',
        [userId]
      );
    }
    
    const result = await db.run(
      `INSERT INTO payment_methods (
        user_id, type, card_last4, card_brand, phone_number, 
        authorization_code, is_default, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [userId, type, card_last4 || null, card_brand || null, phone_number || null, authorization_code || null, is_default ? 1 : 0]
    );
    
    const method = await db.get('SELECT * FROM payment_methods WHERE id = ?', [result.lastID]);
    
    res.json({ success: true, method });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ success: false, message: 'Failed to add payment method' });
  }
});

/**
 * DELETE /api/payments/methods/:id
 * Delete a payment method
 */
router.delete('/methods/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const methodId = req.params.id;
    
    await db.run(
      'UPDATE payment_methods SET is_deleted = 1 WHERE id = ? AND user_id = ?',
      [methodId, userId]
    );
    
    res.json({ success: true, message: 'Payment method deleted' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ success: false, message: 'Failed to delete payment method' });
  }
});

/**
 * PUT /api/payments/methods/:id/default
 * Set a payment method as default
 */
router.put('/methods/:id/default', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const methodId = req.params.id;
    
    // Unset all defaults
    await db.run('UPDATE payment_methods SET is_default = 0 WHERE user_id = ?', [userId]);
    
    // Set new default
    await db.run(
      'UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?',
      [methodId, userId]
    );
    
    res.json({ success: true, message: 'Default payment method updated' });
  } catch (error) {
    console.error('Error setting default:', error);
    res.status(500).json({ success: false, message: 'Failed to set default payment method' });
  }
});

// ============================================
// PAYMENT PROCESSING - REAL IMPLEMENTATIONS
// ============================================

/**
 * POST /api/payments/process
 * Process a payment for a ride
 */
router.post('/process', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { ride_id, payment_method_id, amount } = req.body;
    
    // Validate inputs
    if (!ride_id || !payment_method_id || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Get payment method details
    const paymentMethod = await db.get(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [payment_method_id, userId]
    );
    
    if (!paymentMethod) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }
    
    // Get ride details
    const ride = await db.get('SELECT * FROM rides WHERE id = ?', [ride_id]);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Get user details for email
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    
    let paymentResult;
    let transactionReference;
    
    // Process based on payment type
    switch (paymentMethod.type) {
      case 'card':
        paymentResult = await processCardPayment(paymentMethod, amount, user, ride);
        transactionReference = paymentResult.reference;
        break;
        
      case 'orange_money':
        paymentResult = await processOrangeMoneyPayment(paymentMethod, amount, ride);
        transactionReference = paymentResult.payment_token;
        break;
        
      case 'mtn_money':
        paymentResult = await processMTNMomoPayment(paymentMethod, amount, ride);
        transactionReference = paymentResult.reference_id;
        break;
        
      default:
        return res.status(400).json({ success: false, message: 'Invalid payment method type' });
    }
    
    // Create payment record
    const payment = await db.run(
      `INSERT INTO payments (
        ride_id, user_id, amount, payment_method_id, 
        transaction_reference, status, payment_date
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [ride_id, userId, amount, payment_method_id, transactionReference, 'pending']
    );
    
    res.json({
      success: true,
      payment: {
        id: payment.lastID,
        transaction_reference: transactionReference,
        status: 'pending',
        ...paymentResult
      }
    });
    
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to process payment' 
    });
  }
});

/**
 * Process card payment via PayStack
 */
async function processCardPayment(paymentMethod, amount, user, ride) {
  try {
    // If we have saved authorization, charge it
    if (paymentMethod.authorization_code) {
      const result = await paystackService.chargeAuthorization(
        paymentMethod.authorization_code,
        user.email,
        amount
      );
      
      return {
        reference: result.reference,
        status: result.status,
        method: 'card_saved'
      };
    } else {
      // Initialize new transaction
      const result = await paystackService.initializeTransaction(
        user.email,
        amount,
        {
          rideId: ride.id,
          driverId: ride.driver_id,
          userId: user.id
        }
      );
      
      return {
        reference: result.reference,
        authorization_url: result.authorization_url,
        access_code: result.access_code,
        method: 'card_new'
      };
    }
  } catch (error) {
    console.error('Card payment error:', error);
    throw new Error('Failed to process card payment: ' + error.message);
  }
}

/**
 * Process Orange Money payment
 */
async function processOrangeMoneyPayment(paymentMethod, amount, ride) {
  try {
    const result = await orangeMoneyService.initiatePayment(
      paymentMethod.phone_number,
      amount,
      `RIDE-${ride.id}`,
      `Pagamento corrida #${ride.id}`
    );
    
    return {
      payment_token: result.payment_token,
      payment_url: result.payment_url,
      order_id: result.order_id,
      method: 'orange_money'
    };
  } catch (error) {
    console.error('Orange Money payment error:', error);
    throw new Error('Failed to process Orange Money payment: ' + error.message);
  }
}

/**
 * Process MTN Mobile Money payment
 */
async function processMTNMomoPayment(paymentMethod, amount, ride) {
  try {
    const result = await mtnMoMoService.requestToPay(
      paymentMethod.phone_number,
      amount,
      `Pagamento corrida #${ride.id}`,
      `RIDE-${ride.id}`
    );
    
    return {
      reference_id: result.reference_id,
      external_id: result.external_id,
      status: result.status,
      method: 'mtn_money'
    };
  } catch (error) {
    console.error('MTN MoMo payment error:', error);
    throw new Error('Failed to process MTN MoMo payment: ' + error.message);
  }
}

// ============================================
// PAYMENT VERIFICATION & WEBHOOKS
// ============================================

/**
 * POST /api/payments/paystack/webhook
 * Handle PayStack webhook notifications
 */
router.post('/paystack/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    
    // Verify webhook signature
    if (!paystackService.verifyWebhookSignature(req.body, signature)) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    
    const event = req.body;
    
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      // Update payment status
      await db.run(
        `UPDATE payments SET status = 'completed', completed_at = datetime('now') 
         WHERE transaction_reference = ?`,
        [reference]
      );
      
      // Get payment and update ride
      const payment = await db.get(
        'SELECT * FROM payments WHERE transaction_reference = ?',
        [reference]
      );
      
      if (payment) {
        await db.run(
          `UPDATE rides SET payment_status = 'paid' WHERE id = ?`,
          [payment.ride_id]
        );
      }
      
      console.log(`✅ PayStack payment completed: ${reference}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('PayStack webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

/**
 * POST /api/payments/orangemoney/callback
 * Handle Orange Money callback notifications
 */
router.post('/orangemoney/callback', async (req, res) => {
  try {
    const notificationResult = await orangeMoneyService.processNotification(req.body);
    
    if (notificationResult.success) {
      await db.run(
        `UPDATE payments SET status = 'completed', completed_at = datetime('now') 
         WHERE transaction_reference = ?`,
        [notificationResult.pay_token]
      );
      
      const payment = await db.get(
        'SELECT * FROM payments WHERE transaction_reference = ?',
        [notificationResult.pay_token]
      );
      
      if (payment) {
        await db.run(
          `UPDATE rides SET payment_status = 'paid' WHERE id = ?`,
          [payment.ride_id]
        );
      }
      
      console.log(`✅ Orange Money payment completed: ${notificationResult.order_id}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Orange Money callback error:', error);
    res.status(500).json({ success: false });
  }
});

/**
 * POST /api/payments/mtnmomo/callback
 * Handle MTN MoMo callback notifications
 */
router.post('/mtnmomo/callback', async (req, res) => {
  try {
    const { referenceId, status } = req.body;
    
    if (status === 'SUCCESSFUL') {
      await db.run(
        `UPDATE payments SET status = 'completed', completed_at = datetime('now') 
         WHERE transaction_reference = ?`,
        [referenceId]
      );
      
      const payment = await db.get(
        'SELECT * FROM payments WHERE transaction_reference = ?',
        [referenceId]
      );
      
      if (payment) {
        await db.run(
          `UPDATE rides SET payment_status = 'paid' WHERE id = ?`,
          [payment.ride_id]
        );
      }
      
      console.log(`✅ MTN MoMo payment completed: ${referenceId}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('MTN MoMo callback error:', error);
    res.status(500).json({ success: false });
  }
});

/**
 * GET /api/payments/:id/status
 * Check payment status manually
 */
router.get('/:id/status', authenticateToken, async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await db.get('SELECT * FROM payments WHERE id = ?', [paymentId]);
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    // If already completed, return status
    if (payment.status === 'completed') {
      return res.json({ success: true, status: 'completed', payment });
    }
    
    // Check with payment gateway
    const paymentMethod = await db.get(
      'SELECT * FROM payment_methods WHERE id = ?',
      [payment.payment_method_id]
    );
    
    let statusResult;
    
    switch (paymentMethod.type) {
      case 'card':
        statusResult = await paystackService.verifyTransaction(payment.transaction_reference);
        break;
      case 'orange_money':
        statusResult = await orangeMoneyService.checkPaymentStatus(payment.transaction_reference);
        break;
      case 'mtn_money':
        statusResult = await mtnMoMoService.checkPaymentStatus(payment.transaction_reference);
        break;
    }
    
    // Update if completed
    if (statusResult.success) {
      await db.run(
        `UPDATE payments SET status = 'completed', completed_at = datetime('now') WHERE id = ?`,
        [paymentId]
      );
      
      await db.run(
        `UPDATE rides SET payment_status = 'paid' WHERE id = ?`,
        [payment.ride_id]
      );
    }
    
    res.json({ success: true, status: statusResult.status, payment: statusResult });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ success: false, message: 'Failed to check payment status' });
  }
});

module.exports = router;
