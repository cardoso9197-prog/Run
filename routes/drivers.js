/**
 * Run Run - Driver Routes
 * Handles driver profile, status, and earnings
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const { query } = require('../database/db');
const { requireDriver } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/drivers/profile
 * Get driver profile
 */
router.get('/profile', requireDriver, async (req, res) => {
  try {
    const result = await query(`
      SELECT d.*,
             v.make, v.model, v.year, v.color, v.license_plate, v.vehicle_type,
             u.phone
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      WHERE d.user_id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    res.json({
      success: true,
      driver: result.rows[0],
    });
  } catch (error) {
    console.error('Get driver profile error:', error);
    res.status(500).json({
      error: 'Failed to get driver profile',
      message: error.message,
    });
  }
});

/**
 * PUT /api/drivers/profile
 * Update driver profile
 */
router.put('/profile', requireDriver, async (req, res) => {
  try {
    const { name, email, profilePhotoUrl } = req.body;

    // Update user name if provided
    if (name) {
      await query(`
        UPDATE users
        SET name = $1
        WHERE id = $2
      `, [name, req.user.id]);
    }

    // Update driver email and photo
    const result = await query(`
      UPDATE drivers
      SET email = COALESCE($1, email),
          profile_photo_url = COALESCE($2, profile_photo_url)
      WHERE user_id = $3
      RETURNING *
    `, [email, profilePhotoUrl, req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      driver: result.rows[0],
    });
  } catch (error) {
    console.error('Update driver profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message,
    });
  }
});

/**
 * PUT /api/drivers/status
 * Update driver online/offline status
 */
router.put('/status', requireDriver, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['online', 'offline'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be either "online" or "offline"',
      });
    }

    await query(
      'UPDATE drivers SET status = $1 WHERE user_id = $2',
      [status, req.user.id]
    );

    res.json({
      success: true,
      message: `Driver is now ${status}`,
      status,
    });
  } catch (error) {
    console.error('Update driver status error:', error);
    res.status(500).json({
      error: 'Failed to update status',
      message: error.message,
    });
  }
});

/**
 * POST /api/drivers/location
 * Update driver location
 */
router.post('/location', requireDriver, async (req, res) => {
  try {
    const { latitude, longitude, heading, speed, accuracy } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing coordinates',
        message: 'Latitude and longitude are required',
      });
    }

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

    await query(`
      INSERT INTO driver_locations (driver_id, latitude, longitude, heading, speed, accuracy)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [driverId, latitude, longitude, heading, speed, accuracy]);

    res.json({
      success: true,
      message: 'Location updated',
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      error: 'Failed to update location',
      message: error.message,
    });
  }
});

/**
 * GET /api/drivers/earnings
 * Get driver earnings summary
 */
router.get('/earnings', requireDriver, async (req, res) => {
  try {
    const { period = 'all' } = req.query; // all, today, week, month

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

    let dateFilter = '';
    if (period === 'today') {
      dateFilter = "AND DATE(r.completed_at) = CURRENT_DATE";
    } else if (period === 'week') {
      dateFilter = "AND r.completed_at >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === 'month') {
      dateFilter = "AND r.completed_at >= CURRENT_DATE - INTERVAL '30 days'";
    }

    const result = await query(`
      SELECT 
        COUNT(r.id) as total_rides,
        COALESCE(SUM(p.driver_earnings), 0) as total_earnings,
        COALESCE(SUM(p.platform_commission), 0) as total_commission,
        COALESCE(SUM(p.amount), 0) as total_fares,
        COALESCE(AVG(r.estimated_distance_km), 0) as avg_distance,
        COALESCE(AVG(rt.passenger_rating), 0) as avg_rating
      FROM rides r
      LEFT JOIN payments p ON r.id = p.ride_id
      LEFT JOIN ratings rt ON r.id = rt.ride_id
      WHERE r.driver_id = $1
        AND r.status = 'completed'
        ${dateFilter}
    `, [driverId]);

    res.json({
      success: true,
      period,
      earnings: result.rows[0],
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      error: 'Failed to get earnings',
      message: error.message,
    });
  }
});

/**
 * GET /api/drivers/earnings/details
 * Get detailed earnings breakdown
 */
router.get('/earnings/details', requireDriver, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    const driverId = driverResult.rows[0]?.id;

    const result = await query(`
      SELECT 
        r.id,
        r.pickup_address,
        r.dropoff_address,
        r.estimated_distance_km as distance_km,
        r.completed_at,
        p.amount as fare,
        p.driver_earnings,
        p.platform_commission,
        p.payment_method
      FROM rides r
      JOIN payments p ON r.id = p.ride_id
      WHERE r.driver_id = $1
        AND r.status = 'completed'
      ORDER BY r.completed_at DESC
      LIMIT $2 OFFSET $3
    `, [driverId, limit, offset]);

    res.json({
      success: true,
      earnings: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get earnings details error:', error);
    res.status(500).json({
      error: 'Failed to get earnings details',
      message: error.message,
    });
  }
});

/**
 * PUT /api/drivers/vehicle
 * Update driver vehicle information
 */
router.put('/vehicle', requireDriver, async (req, res) => {
  try {
    const { vehicleType, licensePlate, make, model, year, color } = req.body;

    console.log('🚗 Vehicle update request:', { vehicleType, licensePlate, make, model, year, color });

    // Get driver ID
    const driverResult = await query(
      'SELECT id, vehicle_id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    const driver = driverResult.rows[0];

    // Check if driver has a vehicle record
    if (driver.vehicle_id) {
      // Update existing vehicle
      console.log('📝 Updating existing vehicle:', driver.vehicle_id);
      await query(`
        UPDATE vehicles
        SET vehicle_type = COALESCE($1, vehicle_type),
            license_plate = COALESCE($2, license_plate),
            make = COALESCE($3, make),
            model = COALESCE($4, model),
            year = COALESCE($5, year),
            color = COALESCE($6, color)
        WHERE id = $7
      `, [vehicleType, licensePlate, make, model, year, color, driver.vehicle_id]);
    } else {
      // Create new vehicle and link to driver
      console.log('✨ Creating new vehicle for driver');
      const vehicleResult = await query(`
        INSERT INTO vehicles (vehicle_type, license_plate, make, model, year, color)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [vehicleType || 'Car', licensePlate, make, model, year, color]);

      const vehicleId = vehicleResult.rows[0].id;

      // Link vehicle to driver
      await query(
        'UPDATE drivers SET vehicle_id = $1 WHERE id = $2',
        [vehicleId, driver.id]
      );
    }

    // Also update driver table fields for backward compatibility
    await query(`
      UPDATE drivers
      SET vehicle_type = COALESCE($1, vehicle_type),
          license_plate = COALESCE($2, license_plate),
          updated_at = NOW()
      WHERE user_id = $3
    `, [vehicleType, licensePlate, req.user.id]);

    console.log('✅ Vehicle updated successfully');

    res.json({
      success: true,
      message: 'Vehicle information updated successfully',
    });
  } catch (error) {
    console.error('❌ Update vehicle error:', error);
    res.status(500).json({
      error: 'Failed to update vehicle',
      message: error.message,
    });
  }
});

/**
 * GET /api/drivers/stats
 * Get driver statistics
 */
router.get('/stats', requireDriver, async (req, res) => {
  try {
    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    const driverId = driverResult.rows[0]?.id;

    const stats = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'completed') as completed_rides,
        COUNT(*) FILTER (WHERE status = 'cancelled' AND cancelled_by = 'driver') as cancelled_by_me,
        COUNT(*) FILTER (WHERE status = 'cancelled' AND cancelled_by = 'passenger') as cancelled_by_passenger,
        COALESCE(AVG(estimated_distance_km) FILTER (WHERE status = 'completed'), 0) as avg_distance,
        COALESCE(AVG(estimated_duration_minutes) FILTER (WHERE status = 'completed'), 0) as avg_duration,
        COUNT(*) FILTER (WHERE DATE(completed_at) = CURRENT_DATE) as rides_today,
        COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE - INTERVAL '7 days') as rides_this_week
      FROM rides
      WHERE driver_id = $1
    `, [driverId]);

    res.json({
      success: true,
      stats: stats.rows[0],
    });
  } catch (error) {
    console.error('Get driver stats error:', error);
    res.status(500).json({
      error: 'Failed to get driver stats',
      message: error.message,
    });
  }
});

module.exports = router;
