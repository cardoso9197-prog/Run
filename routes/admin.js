/**
 * Run Run - Admin Routes
 * Handles administrative functions like driver activation
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const { query } = require('../database/db');

const router = express.Router();

/**
 * Simple admin authentication middleware
 * In production, replace with proper admin authentication
 */
const requireAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  
  // In production, use a secure admin key from environment variables
  if (adminKey === process.env.ADMIN_KEY || adminKey === 'runrun-admin-2025') {
    next();
  } else {
    res.status(403).json({
      error: 'Unauthorized',
      message: 'Admin access required',
    });
  }
};

/**
 * POST /api/admin/drivers/activate/:driverId
 * Activate a driver account
 */
router.post('/drivers/activate/:driverId', requireAdmin, async (req, res) => {
  try {
    const { driverId } = req.params;
    const { verifiedBy, notes } = req.body;

    // Check if driver exists
    const driverCheck = await query(
      'SELECT id, user_id FROM drivers WHERE id = $1',
      [driverId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
        message: `No driver found with ID ${driverId}`,
      });
    }

    // Activate driver
    const result = await query(`
      UPDATE drivers 
      SET is_activated = true,
          verified_by = $1,
          verification_date = NOW(),
          verification_notes = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, user_id, is_activated, verified_by, verification_date
    `, [verifiedBy || 'Admin', notes || 'Account activated', driverId]);

    const activatedDriver = result.rows[0];

    res.json({
      success: true,
      message: 'Driver account activated successfully',
      driver: activatedDriver,
    });
  } catch (error) {
    console.error('Driver activation error:', error);
    res.status(500).json({
      error: 'Activation failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/admin/drivers/deactivate/:driverId
 * Deactivate a driver account
 */
router.post('/drivers/deactivate/:driverId', requireAdmin, async (req, res) => {
  try {
    const { driverId } = req.params;
    const { reason } = req.body;

    const result = await query(`
      UPDATE drivers 
      SET is_activated = false,
          verification_notes = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, is_activated
    `, [reason || 'Account deactivated', driverId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    res.json({
      success: true,
      message: 'Driver account deactivated',
      driver: result.rows[0],
    });
  } catch (error) {
    console.error('Driver deactivation error:', error);
    res.status(500).json({
      error: 'Deactivation failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/drivers/pending
 * Get list of drivers pending activation
 */
router.get('/drivers/pending', requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT d.id, d.user_id, d.vehicle_type, d.license_plate, d.created_at,
             u.name, u.phone
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE d.is_activated = false
      ORDER BY d.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      drivers: result.rows,
    });
  } catch (error) {
    console.error('Get pending drivers error:', error);
    res.status(500).json({
      error: 'Failed to get pending drivers',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/drivers
 * Get all drivers with activation status
 */
router.get('/drivers', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query; // 'active', 'inactive', or 'all'

    let whereClause = '';
    if (status === 'active') {
      whereClause = 'WHERE d.is_activated = true';
    } else if (status === 'inactive') {
      whereClause = 'WHERE d.is_activated = false';
    }

    const result = await query(`
      SELECT d.id, d.user_id, d.vehicle_type, d.license_plate, 
             d.is_activated, d.verified_by, d.verification_date,
             d.rating, d.total_rides, d.created_at,
             u.name, u.phone
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      ${whereClause}
      ORDER BY d.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      drivers: result.rows,
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      error: 'Failed to get drivers',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // Get various statistics
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM drivers WHERE is_activated = true) as active_drivers,
        (SELECT COUNT(*) FROM drivers WHERE is_activated = false) as pending_drivers,
        (SELECT COUNT(*) FROM drivers) as total_drivers,
        (SELECT COUNT(*) FROM passengers) as total_passengers,
        (SELECT COUNT(*) FROM rides WHERE status = 'completed') as completed_rides,
        (SELECT COUNT(*) FROM rides WHERE status IN ('pending', 'accepted', 'picked_up')) as active_rides
    `);

    res.json({
      success: true,
      stats: stats.rows[0],
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message,
    });
  }
});

module.exports = router;
