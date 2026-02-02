/**
 * Run Run - Payment Methods Routes
 * Manage payment methods for passengers
 * Developer: Edivaldo Cardoso
 * Supports: Visa/Mastercard, Orange Money, MTN Mobile Money (Guinea Bissau)
 */

const express = require('express');
const { query } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

/**
 * GET /api/payment-methods
 * Get all payment methods for logged-in user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        id,
        type,
        card_last_four,
        card_brand,
        mobile_number,
        is_default,
        created_at
      FROM payment_methods
      WHERE user_id = $1 AND is_active = true
      ORDER BY is_default DESC, created_at DESC
    `, [userId]);

    res.json({
      success: true,
      paymentMethods: result.rows.map(pm => ({
        id: pm.id,
        type: pm.type,
        ...(pm.type === 'card' && {
          cardLastFour: pm.card_last_four,
          cardBrand: pm.card_brand,
        }),
        ...((['orange_money', 'mtn_momo'].includes(pm.type)) && {
          mobileNumber: pm.mobile_number,
        }),
        isDefault: pm.is_default,
        createdAt: pm.created_at,
      })),
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      error: 'Failed to retrieve payment methods',
      message: error.message,
    });
  }
});

/**
 * POST /api/payment-methods/card
 * Add a new card (Visa/Mastercard)
 */
router.post('/card', authenticateToken, async (req, res) => {
  try {
    const { cardNumber, cardholderName, expiryMonth, expiryYear, cvv } = req.body;
    const userId = req.user.id;

    // Validate card number
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      return res.status(400).json({
        error: 'Invalid card number',
      });
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const cardLastFour = cleanCardNumber.slice(-4);

    // Detect card brand
    let cardBrand = 'unknown';
    if (cleanCardNumber.startsWith('4')) {
      cardBrand = 'visa';
    } else if (cleanCardNumber.match(/^5[1-5]/)) {
      cardBrand = 'mastercard';
    }

    if (!['visa', 'mastercard'].includes(cardBrand)) {
      return res.status(400).json({
        error: 'Only Visa and Mastercard are supported',
      });
    }

    // Validate expiry
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return res.status(400).json({
        error: 'Card has expired',
      });
    }

    // Encrypt card token (in production, use payment gateway tokenization)
    const cardToken = crypto.createHash('sha256')
      .update(cleanCardNumber + cvv + Date.now())
      .digest('hex');

    // Check if this is the first payment method
    const existingMethods = await query(
      'SELECT COUNT(*) as count FROM payment_methods WHERE user_id = $1 AND is_active = true',
      [userId]
    );
    const isFirst = parseInt(existingMethods.rows[0].count) === 0;

    // Insert payment method
    const result = await query(`
      INSERT INTO payment_methods (
        user_id,
        type,
        card_token,
        card_last_four,
        card_brand,
        cardholder_name,
        expiry_month,
        expiry_year,
        is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, type, card_last_four, card_brand, is_default, created_at
    `, [userId, 'card', cardToken, cardLastFour, cardBrand, cardholderName, expiryMonth, expiryYear, isFirst]);

    res.json({
      success: true,
      message: 'Card added successfully',
      paymentMethod: {
        id: result.rows[0].id,
        type: result.rows[0].type,
        cardLastFour: result.rows[0].card_last_four,
        cardBrand: result.rows[0].card_brand,
        isDefault: result.rows[0].is_default,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Add card error:', error);
    res.status(500).json({
      error: 'Failed to add card',
      message: error.message,
    });
  }
});

/**
 * POST /api/payment-methods/mobile
 * Add Orange Money or MTN Mobile Money
 */
router.post('/mobile', authenticateToken, async (req, res) => {
  try {
    const { type, mobileNumber, accountName } = req.body;
    const userId = req.user.id;

    // Validate type
    if (!['orange_money', 'mtn_momo'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid mobile money type. Use orange_money or mtn_momo',
      });
    }

    // Validate Guinea Bissau phone number format
    if (!mobileNumber || !mobileNumber.match(/^\+245\d{7,9}$/)) {
      return res.status(400).json({
        error: 'Invalid phone number format. Use +245XXXXXXXXX',
      });
    }

    // Check if mobile number already exists
    const existingMobile = await query(
      'SELECT id FROM payment_methods WHERE user_id = $1 AND mobile_number = $2 AND is_active = true',
      [userId, mobileNumber]
    );

    if (existingMobile.rows.length > 0) {
      return res.status(400).json({
        error: 'This mobile number is already added',
      });
    }

    // Check if this is the first payment method
    const existingMethods = await query(
      'SELECT COUNT(*) as count FROM payment_methods WHERE user_id = $1 AND is_active = true',
      [userId]
    );
    const isFirst = parseInt(existingMethods.rows[0].count) === 0;

    // Insert payment method
    const result = await query(`
      INSERT INTO payment_methods (
        user_id,
        type,
        mobile_number,
        account_name,
        is_default
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, type, mobile_number, is_default, created_at
    `, [userId, type, mobileNumber, accountName || null, isFirst]);

    res.json({
      success: true,
      message: `${type === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'} added successfully`,
      paymentMethod: {
        id: result.rows[0].id,
        type: result.rows[0].type,
        mobileNumber: result.rows[0].mobile_number,
        isDefault: result.rows[0].is_default,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Add mobile money error:', error);
    res.status(500).json({
      error: 'Failed to add mobile money account',
      message: error.message,
    });
  }
});

/**
 * PUT /api/payment-methods/:id/default
 * Set a payment method as default
 */
router.put('/:id/default', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const methodResult = await query(
      'SELECT id FROM payment_methods WHERE id = $1 AND user_id = $2 AND is_active = true',
      [id, userId]
    );

    if (methodResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Payment method not found',
      });
    }

    // Begin transaction
    await query('BEGIN');

    // Remove default from all other methods
    await query(
      'UPDATE payment_methods SET is_default = false WHERE user_id = $1',
      [userId]
    );

    // Set this method as default
    await query(
      'UPDATE payment_methods SET is_default = true WHERE id = $1',
      [id]
    );

    await query('COMMIT');

    res.json({
      success: true,
      message: 'Default payment method updated',
    });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Set default payment method error:', error);
    res.status(500).json({
      error: 'Failed to set default payment method',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/payment-methods/:id
 * Remove a payment method
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const methodResult = await query(
      'SELECT is_default FROM payment_methods WHERE id = $1 AND user_id = $2 AND is_active = true',
      [id, userId]
    );

    if (methodResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Payment method not found',
      });
    }

    const wasDefault = methodResult.rows[0].is_default;

    // Soft delete
    await query(
      'UPDATE payment_methods SET is_active = false, updated_at = NOW() WHERE id = $1',
      [id]
    );

    // If this was default, set another as default
    if (wasDefault) {
      const nextMethod = await query(
        'SELECT id FROM payment_methods WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      if (nextMethod.rows.length > 0) {
        await query(
          'UPDATE payment_methods SET is_default = true WHERE id = $1',
          [nextMethod.rows[0].id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Payment method removed',
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      error: 'Failed to remove payment method',
      message: error.message,
    });
  }
});

/**
 * GET /api/payment-methods/default
 * Get default payment method
 */
router.get('/default', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        id,
        type,
        card_last_four,
        card_brand,
        mobile_number,
        is_default
      FROM payment_methods
      WHERE user_id = $1 AND is_default = true AND is_active = true
      LIMIT 1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        paymentMethod: null,
      });
    }

    const pm = result.rows[0];
    res.json({
      success: true,
      paymentMethod: {
        id: pm.id,
        type: pm.type,
        ...(pm.type === 'card' && {
          cardLastFour: pm.card_last_four,
          cardBrand: pm.card_brand,
        }),
        ...((['orange_money', 'mtn_momo'].includes(pm.type)) && {
          mobileNumber: pm.mobile_number,
        }),
        isDefault: pm.is_default,
      },
    });
  } catch (error) {
    console.error('Get default payment method error:', error);
    res.status(500).json({
      error: 'Failed to retrieve default payment method',
      message: error.message,
    });
  }
});

module.exports = router;
