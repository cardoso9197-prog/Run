/**
 * Run Run - Driver Withdrawals Routes
 * Handles driver earnings withdrawals through Orange Money and MTN Mobile Money
 * Developer: Edivaldo Cardoso
 * Date: December 20, 2025
 */

const express = require('express');
const { query } = require('../database/db');
const { requireDriver } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * GET /api/withdrawals/balance
 * Get driver's available balance
 */
router.get('/balance', requireDriver, async (req, res) => {
  try {
    const driverResult = await query(
      `SELECT 
        id, 
        total_earnings, 
        available_balance,
        pending_withdrawals
       FROM drivers 
       WHERE user_id = $1`,
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    const driver = driverResult.rows[0];

    // Get pending withdrawals count
    const pendingResult = await query(
      `SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
       FROM withdrawals
       WHERE driver_id = $1 AND status IN ('pending', 'processing')`,
      [driver.id]
    );

    res.json({
      success: true,
      balance: {
        totalEarnings: parseFloat(driver.total_earnings),
        availableBalance: parseFloat(driver.available_balance),
        pendingWithdrawals: parseFloat(driver.pending_withdrawals),
        pendingCount: parseInt(pendingResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: 'Failed to get balance',
      message: error.message,
    });
  }
});

/**
 * GET /api/withdrawals/settings
 * Get driver's withdrawal settings
 */
router.get('/settings', requireDriver, async (req, res) => {
  try {
    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    const driverId = driverResult.rows[0].id;

    const settingsResult = await query(
      'SELECT * FROM driver_withdrawal_settings WHERE driver_id = $1',
      [driverId]
    );

    if (settingsResult.rows.length === 0) {
      // Return default settings
      return res.json({
        success: true,
        settings: {
          preferredMethod: null,
          preferredMobileNumber: null,
          accountName: null,
          autoWithdrawEnabled: false,
          autoWithdrawFrequency: 'weekly',
          minimumWithdrawAmount: 5000,
        },
      });
    }

    const settings = settingsResult.rows[0];
    res.json({
      success: true,
      settings: {
        preferredMethod: settings.preferred_method,
        preferredMobileNumber: settings.preferred_mobile_number,
        accountName: settings.account_name,
        autoWithdrawEnabled: settings.auto_withdraw_enabled,
        autoWithdrawFrequency: settings.auto_withdraw_frequency,
        minimumWithdrawAmount: parseFloat(settings.minimum_withdraw_amount),
      },
    });
  } catch (error) {
    console.error('Get withdrawal settings error:', error);
    res.status(500).json({
      error: 'Failed to get settings',
      message: error.message,
    });
  }
});

/**
 * PUT /api/withdrawals/settings
 * Update driver's withdrawal settings
 */
router.put('/settings', requireDriver, async (req, res) => {
  try {
    const {
      preferredMethod,
      preferredMobileNumber,
      accountName,
      autoWithdrawEnabled,
      autoWithdrawFrequency,
      minimumWithdrawAmount,
    } = req.body;

    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    const driverId = driverResult.rows[0].id;

    // Validate mobile number format (Guinea Bissau)
    if (preferredMobileNumber && !preferredMobileNumber.match(/^\+245\d{7,9}$/)) {
      return res.status(400).json({
        error: 'Invalid phone number format. Use +245XXXXXXXXX',
      });
    }

    // Validate preferred method
    if (preferredMethod && !['orange_money', 'mtn_momo'].includes(preferredMethod)) {
      return res.status(400).json({
        error: 'Invalid withdrawal method. Use orange_money or mtn_momo',
      });
    }

    // Insert or update settings
    const result = await query(`
      INSERT INTO driver_withdrawal_settings (
        driver_id,
        preferred_method,
        preferred_mobile_number,
        account_name,
        auto_withdraw_enabled,
        auto_withdraw_frequency,
        minimum_withdraw_amount,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (driver_id)
      DO UPDATE SET
        preferred_method = $2,
        preferred_mobile_number = $3,
        account_name = $4,
        auto_withdraw_enabled = $5,
        auto_withdraw_frequency = $6,
        minimum_withdraw_amount = $7,
        updated_at = NOW()
      RETURNING *
    `, [
      driverId,
      preferredMethod,
      preferredMobileNumber,
      accountName,
      autoWithdrawEnabled || false,
      autoWithdrawFrequency || 'weekly',
      minimumWithdrawAmount || 5000,
    ]);

    res.json({
      success: true,
      message: 'Withdrawal settings updated successfully',
      settings: result.rows[0],
    });
  } catch (error) {
    console.error('Update withdrawal settings error:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: error.message,
    });
  }
});

/**
 * POST /api/withdrawals/request
 * Request a withdrawal
 */
router.post('/request', requireDriver, async (req, res) => {
  try {
    const {
      amount,
      withdrawalMethod,
      mobileNumber,
      accountName,
      frequency, // 'daily' or 'weekly'
    } = req.body;

    // Validate inputs
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
      });
    }

    if (!withdrawalMethod || !['orange_money', 'mtn_momo'].includes(withdrawalMethod)) {
      return res.status(400).json({
        error: 'Invalid withdrawal method. Use orange_money or mtn_momo',
      });
    }

    if (!mobileNumber || !mobileNumber.match(/^\+245\d{7,9}$/)) {
      return res.status(400).json({
        error: 'Invalid phone number format. Use +245XXXXXXXXX',
      });
    }

    if (!frequency || !['daily', 'weekly'].includes(frequency)) {
      return res.status(400).json({
        error: 'Invalid frequency. Use daily or weekly',
      });
    }

    // Get driver info
    const driverResult = await query(
      'SELECT id, available_balance FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    const driver = driverResult.rows[0];
    const availableBalance = parseFloat(driver.available_balance);

    // Check minimum withdrawal amount
    const minimumAmount = 5000; // 5000 XOF
    if (amount < minimumAmount) {
      return res.status(400).json({
        error: `Minimum withdrawal amount is ${minimumAmount} XOF`,
      });
    }

    // Check if driver has sufficient balance
    if (amount > availableBalance) {
      return res.status(400).json({
        error: 'Insufficient balance',
        available: availableBalance,
        requested: amount,
      });
    }

    // Calculate commission (0% for now - no double commission)
    const commission = 0; // Platform already took commission on rides
    const netAmount = amount - commission;

    // Generate transaction ID
    const transactionId = `WD_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;

    // Create withdrawal request
    const withdrawalResult = await query(`
      INSERT INTO withdrawals (
        driver_id,
        amount,
        platform_commission,
        net_amount,
        withdrawal_method,
        mobile_number,
        account_name,
        status,
        frequency,
        transaction_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      driver.id,
      amount,
      commission,
      netAmount,
      withdrawalMethod,
      mobileNumber,
      accountName,
      'pending',
      frequency,
      transactionId,
    ]);

    // Update driver's pending withdrawals
    await query(
      'UPDATE drivers SET pending_withdrawals = pending_withdrawals + $1 WHERE id = $2',
      [amount, driver.id]
    );

    // Process withdrawal immediately (in real app, this would be a background job)
    processWithdrawal(withdrawalResult.rows[0].id);

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: withdrawalResult.rows[0].id,
        amount: parseFloat(withdrawalResult.rows[0].amount),
        netAmount: parseFloat(withdrawalResult.rows[0].net_amount),
        method: withdrawalResult.rows[0].withdrawal_method,
        status: withdrawalResult.rows[0].status,
        transactionId: withdrawalResult.rows[0].transaction_id,
        requestedAt: withdrawalResult.rows[0].requested_at,
      },
    });
  } catch (error) {
    console.error('Request withdrawal error:', error);
    res.status(500).json({
      error: 'Failed to request withdrawal',
      message: error.message,
    });
  }
});

/**
 * GET /api/withdrawals/history
 * Get withdrawal history
 */
router.get('/history', requireDriver, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    const driverId = driverResult.rows[0].id;

    const result = await query(`
      SELECT *
      FROM withdrawals
      WHERE driver_id = $1
      ORDER BY requested_at DESC
      LIMIT $2 OFFSET $3
    `, [driverId, limit, offset]);

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM withdrawals WHERE driver_id = $1',
      [driverId]
    );

    res.json({
      success: true,
      withdrawals: result.rows.map(w => ({
        id: w.id,
        amount: parseFloat(w.amount),
        netAmount: parseFloat(w.net_amount),
        method: w.withdrawal_method,
        mobileNumber: w.mobile_number,
        status: w.status,
        frequency: w.frequency,
        transactionId: w.transaction_id,
        requestedAt: w.requested_at,
        completedAt: w.completed_at,
        errorMessage: w.error_message,
      })),
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get withdrawal history error:', error);
    res.status(500).json({
      error: 'Failed to get withdrawal history',
      message: error.message,
    });
  }
});

/**
 * Process withdrawal (Background job simulation)
 * In production, this would be a separate queue/worker
 */
async function processWithdrawal(withdrawalId) {
  try {
    // Update status to processing
    await query(
      'UPDATE withdrawals SET status = $1, processing_at = NOW() WHERE id = $2',
      ['processing', withdrawalId]
    );

    // Get withdrawal details
    const withdrawalResult = await query(
      'SELECT * FROM withdrawals WHERE id = $1',
      [withdrawalId]
    );

    const withdrawal = withdrawalResult.rows[0];

    // Simulate API call to Orange Money or MTN Mobile Money
    // In production, integrate with real payment gateway APIs
    const externalPaymentId = `${withdrawal.withdrawal_method.toUpperCase()}_${uuidv4()}`;

    // Simulate processing time (remove in production)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mark as completed (90% success rate simulation)
    const success = Math.random() > 0.1;

    if (success) {
      await query(`
        UPDATE withdrawals 
        SET status = $1, 
            external_payment_id = $2,
            completed_at = NOW()
        WHERE id = $3
      `, ['completed', externalPaymentId, withdrawalId]);

      // Update driver balances
      await query(`
        UPDATE drivers 
        SET available_balance = available_balance - $1,
            pending_withdrawals = pending_withdrawals - $1
        WHERE id = $2
      `, [withdrawal.amount, withdrawal.driver_id]);

      console.log(`✅ Withdrawal ${withdrawalId} completed successfully`);
    } else {
      await query(`
        UPDATE withdrawals 
        SET status = $1, 
            failed_at = NOW(),
            error_message = $2,
            retry_count = retry_count + 1
        WHERE id = $3
      `, ['failed', 'Payment gateway timeout', withdrawalId]);

      // Release pending amount
      await query(`
        UPDATE drivers 
        SET pending_withdrawals = pending_withdrawals - $1
        WHERE id = $2
      `, [withdrawal.amount, withdrawal.driver_id]);

      console.log(`❌ Withdrawal ${withdrawalId} failed`);
    }
  } catch (error) {
    console.error('Process withdrawal error:', error);
    
    // Mark as failed
    await query(`
      UPDATE withdrawals 
      SET status = $1, 
          failed_at = NOW(),
          error_message = $2
      WHERE id = $3
    `, ['failed', error.message, withdrawalId]);
  }
}

module.exports = router;
