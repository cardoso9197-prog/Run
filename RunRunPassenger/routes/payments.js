/**
 * Run Run - Payment Routes
 * Handles payment processing for all payment methods
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const { query, transaction } = require('../database/db');
const { validatePayment } = require('../middleware/validation');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * POST /api/payments/process
 * Process payment for a ride
 */
router.post('/process', validatePayment, async (req, res) => {
  try {
    const { rideId, paymentMethod, cardToken, phoneNumber } = req.body;

    // Get ride details
    const rideResult = await query(
      'SELECT * FROM rides WHERE id = $1',
      [rideId]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Ride not found',
      });
    }

    const ride = rideResult.rows[0];

    if (ride.status !== 'completed') {
      return res.status(400).json({
        error: 'Cannot process payment',
        message: 'Ride must be completed before processing payment',
      });
    }

    // Check if payment already exists
    const existingPayment = await query(
      'SELECT * FROM payments WHERE ride_id = $1',
      [rideId]
    );

    if (existingPayment.rows.length > 0 && existingPayment.rows[0].status === 'completed') {
      return res.json({
        success: true,
        message: 'Payment already processed',
        payment: existingPayment.rows[0],
      });
    }

    const amount = ride.final_fare;
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION) || 20;
    const platformCommission = (amount * commissionRate) / 100;
    const driverEarnings = amount - platformCommission;

    let paymentResult;

    // Process payment based on method - Digital only (no cash)
    switch (paymentMethod) {
      case 'card':
        if (!cardToken) {
          return res.status(400).json({
            error: 'Card token required',
            message: 'Please provide a valid card token',
          });
        }
        paymentResult = await processCardPayment(ride, amount, platformCommission, driverEarnings, cardToken);
        break;
      case 'orange_money':
        if (!phoneNumber) {
          return res.status(400).json({
            error: 'Phone number required',
            message: 'Please provide your Orange Money phone number',
          });
        }
        paymentResult = await processOrangeMoneyPayment(ride, amount, platformCommission, driverEarnings, phoneNumber);
        break;
      case 'mtn_momo':
        if (!phoneNumber) {
          return res.status(400).json({
            error: 'Phone number required',
            message: 'Please provide your MTN Mobile Money phone number',
          });
        }
        paymentResult = await processMTNMomoPayment(ride, amount, platformCommission, driverEarnings, phoneNumber);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid payment method',
        });
    }

    res.json({
      success: paymentResult.success,
      message: paymentResult.message,
      payment: paymentResult.payment,
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      error: 'Payment failed',
      message: error.message,
    });
  }
});

/**
 * Process card payment (Stripe/PayStack)
 */
async function processCardPayment(ride, amount, platformCommission, driverEarnings, cardToken) {
  // TODO: Integrate with Stripe or PayStack
  // This is a placeholder implementation

  const transactionId = `CARD_${uuidv4()}`;
  const externalPaymentId = `stripe_${uuidv4()}`; // Would come from Stripe API

  try {
    // Stripe integration would go here:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const charge = await stripe.charges.create({
    //   amount: Math.round(amount * 100), // Convert to cents
    //   currency: 'xof', // West African CFA franc
    //   source: cardToken,
    //   description: `Run Run Ride #${ride.id}`,
    // });

    const result = await query(`
      INSERT INTO payments (
        ride_id, passenger_id, driver_id, amount, payment_method, status,
        platform_commission, driver_earnings, transaction_id, external_payment_id, completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (ride_id)
      DO UPDATE SET status = $6, external_payment_id = $10, completed_at = NOW()
      RETURNING *
    `, [
      ride.id, ride.passenger_id, ride.driver_id, amount, 'card', 'completed',
      platformCommission, driverEarnings, transactionId, externalPaymentId
    ]);

    // Update driver total earnings
    await query(
      'UPDATE drivers SET total_earnings = total_earnings + $1 WHERE id = $2',
      [driverEarnings, ride.driver_id]
    );

    return {
      success: true,
      message: 'Card payment processed successfully',
      payment: result.rows[0],
    };
  } catch (error) {
    // Record failed payment
    await query(`
      INSERT INTO payments (
        ride_id, passenger_id, driver_id, amount, payment_method, status,
        platform_commission, driver_earnings, transaction_id, failed_at, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)
      ON CONFLICT (ride_id)
      DO UPDATE SET status = $6, failed_at = NOW(), error_message = $10
      RETURNING *
    `, [
      ride.id, ride.passenger_id, ride.driver_id, amount, 'card', 'failed',
      platformCommission, driverEarnings, transactionId, error.message
    ]);

    throw error;
  }
}

/**
 * Process Orange Money payment
 */
async function processOrangeMoneyPayment(ride, amount, platformCommission, driverEarnings, phoneNumber) {
  // TODO: Integrate with Orange Money API
  // This is a placeholder implementation

  const transactionId = `ORANGE_${uuidv4()}`;
  const externalPaymentId = `orange_${uuidv4()}`; // Would come from Orange API

  try {
    // Orange Money API integration would go here:
    // const axios = require('axios');
    // const response = await axios.post(
    //   `${process.env.ORANGE_MONEY_API_URL}/webpayment`,
    //   {
    //     merchant_key: process.env.ORANGE_MONEY_MERCHANT_ID,
    //     amount: amount,
    //     currency: 'XOF',
    //     order_id: transactionId,
    //     return_url: 'https://runrungb.com/payment/success',
    //     cancel_url: 'https://runrungb.com/payment/cancel',
    //   },
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.ORANGE_MONEY_API_KEY}`,
    //     },
    //   }
    // );

    const result = await query(`
      INSERT INTO payments (
        ride_id, passenger_id, driver_id, amount, payment_method, status,
        platform_commission, driver_earnings, transaction_id, external_payment_id, completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (ride_id)
      DO UPDATE SET status = $6, external_payment_id = $10, completed_at = NOW()
      RETURNING *
    `, [
      ride.id, ride.passenger_id, ride.driver_id, amount, 'orange_money', 'completed',
      platformCommission, driverEarnings, transactionId, externalPaymentId
    ]);

    // Update driver total earnings
    await query(
      'UPDATE drivers SET total_earnings = total_earnings + $1 WHERE id = $2',
      [driverEarnings, ride.driver_id]
    );

    return {
      success: true,
      message: 'Orange Money payment processed successfully',
      payment: result.rows[0],
    };
  } catch (error) {
    await query(`
      INSERT INTO payments (
        ride_id, passenger_id, driver_id, amount, payment_method, status,
        platform_commission, driver_earnings, transaction_id, failed_at, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)
      ON CONFLICT (ride_id)
      DO UPDATE SET status = $6, failed_at = NOW(), error_message = $10
      RETURNING *
    `, [
      ride.id, ride.passenger_id, ride.driver_id, amount, 'orange_money', 'failed',
      platformCommission, driverEarnings, transactionId, error.message
    ]);

    throw error;
  }
}

/**
 * Process MTN Mobile Money payment
 */
async function processMTNMomoPayment(ride, amount, platformCommission, driverEarnings, phoneNumber) {
  // TODO: Integrate with MTN Mobile Money API
  // This is a placeholder implementation

  const transactionId = `MTN_${uuidv4()}`;
  const externalPaymentId = `mtn_${uuidv4()}`; // Would come from MTN API

  try {
    // MTN MoMo API integration would go here:
    // const axios = require('axios');
    // const response = await axios.post(
    //   `${process.env.MTN_MOMO_API_URL}/collection/v1_0/requesttopay`,
    //   {
    //     amount: amount.toString(),
    //     currency: 'XOF',
    //     externalId: transactionId,
    //     payer: {
    //       partyIdType: 'MSISDN',
    //       partyId: phoneNumber,
    //     },
    //     payerMessage: `Run Run Ride #${ride.id}`,
    //     payeeNote: 'Ride payment',
    //   },
    //   {
    //     headers: {
    //       'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY,
    //       'X-Target-Environment': 'sandbox',
    //     },
    //   }
    // );

    const result = await query(`
      INSERT INTO payments (
        ride_id, passenger_id, driver_id, amount, payment_method, status,
        platform_commission, driver_earnings, transaction_id, external_payment_id, completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (ride_id)
      DO UPDATE SET status = $6, external_payment_id = $10, completed_at = NOW()
      RETURNING *
    `, [
      ride.id, ride.passenger_id, ride.driver_id, amount, 'mtn_momo', 'completed',
      platformCommission, driverEarnings, transactionId, externalPaymentId
    ]);

    // Update driver total earnings
    await query(
      'UPDATE drivers SET total_earnings = total_earnings + $1 WHERE id = $2',
      [driverEarnings, ride.driver_id]
    );

    return {
      success: true,
      message: 'MTN Mobile Money payment processed successfully',
      payment: result.rows[0],
    };
  } catch (error) {
    await query(`
      INSERT INTO payments (
        ride_id, passenger_id, driver_id, amount, payment_method, status,
        platform_commission, driver_earnings, transaction_id, failed_at, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)
      ON CONFLICT (ride_id)
      DO UPDATE SET status = $6, failed_at = NOW(), error_message = $10
      RETURNING *
    `, [
      ride.id, ride.passenger_id, ride.driver_id, amount, 'mtn_momo', 'failed',
      platformCommission, driverEarnings, transactionId, error.message
    ]);

    throw error;
  }
}

/**
 * GET /api/payments/:rideId
 * Get payment details for a ride
 */
router.get('/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;

    const result = await query(
      'SELECT * FROM payments WHERE ride_id = $1',
      [rideId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Payment not found',
      });
    }

    res.json({
      success: true,
      payment: result.rows[0],
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      error: 'Failed to get payment',
      message: error.message,
    });
  }
});

module.exports = router;
