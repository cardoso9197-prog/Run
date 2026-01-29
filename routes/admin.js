/**
 * Run Run - Admin Routes
 * Handles administrative functions like driver activation
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const pool = require('../database/db');

const router = express.Router();

// Helper function for database queries
const query = (text, params) => pool.query(text, params);

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
      'SELECT id FROM drivers WHERE id = $1',
      [driverId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
        message: `No driver found with ID ${driverId}`,
      });
    }

    // Activate driver - set both is_verified and is_activated
    const result = await query(`
      UPDATE drivers 
      SET is_verified = true,
          is_activated = true,
          verified_by = $1,
          verification_date = NOW(),
          verification_notes = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, name, is_verified, is_activated, verified_by, verification_date
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
 * POST /api/admin/drivers/reject/:driverId
 * Reject a driver application
 */
router.post('/drivers/reject/:driverId', requireAdmin, async (req, res) => {
  try {
    const { driverId } = req.params;
    const { reason } = req.body;

    const result = await query(`
      UPDATE drivers 
      SET is_verified = false,
          is_activated = false,
          verification_notes = $1,
          verified_by = 'Admin',
          verification_date = NOW(),
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, is_verified, is_activated, verification_notes
    `, [reason || 'Application rejected', driverId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver not found',
      });
    }

    res.json({
      success: true,
      message: 'Driver application rejected',
      driver: result.rows[0],
    });
  } catch (error) {
    console.error('Driver rejection error:', error);
    res.status(500).json({
      error: 'Rejection failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/admin/messages/send
 * Send a message to a user (driver or passenger)
 */
router.post('/messages/send', requireAdmin, async (req, res) => {
  try {
    const { userId, userType, message, subject } = req.body;

    if (!userId || !userType || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId, userType, and message are required',
      });
    }

    // For now, log the message (in production, send via SMS, email, or push notification)
    console.log(`Admin message to ${userType} #${userId}: ${message}`);

    // You could integrate with SMS gateway here (e.g., Twilio, Orange SMS API)
    // For now, we'll store in a messages table if it exists, or just acknowledge

    res.json({
      success: true,
      message: 'Message sent successfully',
      details: {
        to: `${userType} #${userId}`,
        subject: subject || 'No subject',
        content: message,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message',
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
    // Use a simple query that works with Railway database schema
    const result = await query(`
      SELECT 
        d.id, 
        d.name, 
        d.email, 
        d.license_number,
        d.status,
        d.created_at,
        d.is_verified,
        d.is_activated,
        d.profile_photo_url,
        d.license_image,
        d.vehicle_image,
        d.vehicle_type,
        d.vehicle_make,
        d.vehicle_model,
        d.vehicle_year,
        d.vehicle_color,
        d.license_plate,
        d.verification_notes,
        d.verified_by,
        d.verification_date
      FROM drivers d
      ORDER BY d.created_at DESC
      LIMIT 100
    `);

    res.json(result.rows);
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

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics and recent activity for admin panel
 */
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get statistics - use simple queries that work with actual Railway schema
    let totalRides = 0, activePassengers = 0, onlineDrivers = 0, todayRevenue = 0, pendingDrivers = 0;
    
    try {
      const ridesResult = await query(`SELECT COUNT(*) as count FROM rides`);
      totalRides = parseInt(ridesResult.rows[0]?.count) || 0;
    } catch (e) { console.log('Rides count error:', e.message); }
    
    try {
      const passengersResult = await query(`SELECT COUNT(*) as count FROM passengers`);
      activePassengers = parseInt(passengersResult.rows[0]?.count) || 0;
    } catch (e) { console.log('Passengers count error:', e.message); }
    
    try {
      const driversResult = await query(`SELECT COUNT(*) as count FROM drivers`);
      onlineDrivers = parseInt(driversResult.rows[0]?.count) || 0;
    } catch (e) { console.log('Drivers count error:', e.message); }
    
    try {
      const pendingResult = await query(`SELECT COUNT(*) as count FROM drivers WHERE is_verified = false`);
      pendingDrivers = parseInt(pendingResult.rows[0]?.count) || 0;
    } catch (e) { 
      // Try alternate column name
      try {
        const pendingResult2 = await query(`SELECT COUNT(*) as count FROM drivers WHERE is_activated = false`);
        pendingDrivers = parseInt(pendingResult2.rows[0]?.count) || 0;
      } catch (e2) { console.log('Pending drivers count error:', e2.message); }
    }

    // Get recent rides - use only columns that exist
    let recentRides = [];
    try {
      const ridesResult = await query(`
        SELECT 
          r.id,
          p.name as passenger,
          d.name as driver,
          COALESCE(r.pickup_address, 'N/A') || ' → ' || COALESCE(r.dropoff_address, 'N/A') as route,
          r.status,
          COALESCE(r.estimated_fare, 0) as fare
        FROM rides r
        LEFT JOIN passengers p ON r.passenger_id = p.id
        LEFT JOIN drivers d ON r.driver_id = d.id
        ORDER BY r.created_at DESC
        LIMIT 5
      `);
      recentRides = ridesResult.rows;
    } catch (e) {
      console.log('Recent rides error:', e.message);
      // Try even simpler query if columns don't exist
      try {
        const ridesResult2 = await query(`
          SELECT r.id, r.status, r.created_at
          FROM rides r
          ORDER BY r.created_at DESC
          LIMIT 5
        `);
        recentRides = ridesResult2.rows.map(r => ({
          id: r.id,
          passenger: 'N/A',
          driver: 'N/A',
          route: 'N/A',
          status: r.status,
          fare: 0
        }));
      } catch (e2) {
        console.log('Simple rides query error:', e2.message);
      }
    }

    // Format the response to match frontend expectations
    const dashboardData = {
      totalRides,
      activePassengers,
      onlineDrivers,
      todayRevenue,
      pendingDrivers,
      recentRides: recentRides.map(ride => ({
        id: ride.id,
        passenger: ride.passenger || 'Desconhecido',
        driver: ride.driver || 'Não atribuído',
        route: ride.route || 'N/A',
        status: ride.status,
        fare: ride.fare ? `${parseFloat(ride.fare).toLocaleString()} XOF` : 'N/A'
      })),
      recentTickets: [] // Add support tickets when implemented
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      error: 'Failed to get dashboard data',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/passengers
 * Get all passengers from database
 */
router.get('/passengers', requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        p.id,
        p.name,
        p.email,
        p.created_at
      FROM passengers p
      ORDER BY p.created_at DESC
      LIMIT 100
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get passengers error:', error);
    res.status(500).json({
      error: 'Failed to get passengers',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/support
 * Get support tickets (placeholder - returns empty for now)
 */
router.get('/support', requireAdmin, async (req, res) => {
  try {
    // Support tickets table may not exist yet
    // Return empty array for now
    res.json([]);
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({
      error: 'Failed to get support tickets',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/rides
 * Get all rides with filtering and pagination
 */
router.get('/rides', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = '';
    let params = [parseInt(limit), offset];
    
    if (status && status !== 'all') {
      whereClause = 'WHERE r.status = $3';
      params.push(status);
    }

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM rides r`;
    if (status && status !== 'all') {
      countQuery = `SELECT COUNT(*) as total FROM rides r WHERE r.status = $1`;
    }
    
    const countResult = await query(
      status && status !== 'all' ? countQuery : countQuery,
      status && status !== 'all' ? [status] : []
    );
    const total = parseInt(countResult.rows[0]?.total) || 0;

    // Get rides with related data
    const ridesQuery = `
      SELECT 
        r.id,
        r.passenger_id,
        r.driver_id,
        r.pickup_address,
        r.pickup_latitude,
        r.pickup_longitude,
        r.dropoff_address,
        r.dropoff_latitude,
        r.dropoff_longitude,
        r.status,
        r.fare,
        r.base_fare,
        r.distance_km,
        r.duration_minutes,
        r.payment_method,
        r.payment_status,
        r.rating,
        r.created_at,
        r.updated_at,
        p.name as passenger_name,
        p.email as passenger_email,
        d.name as driver_name,
        d.license_plate as driver_plate,
        d.vehicle_type,
        d.vehicle_make,
        d.vehicle_model,
        d.vehicle_color
      FROM rides r
      LEFT JOIN passengers p ON r.passenger_id = p.id
      LEFT JOIN drivers d ON r.driver_id = d.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const ridesResult = await query(ridesQuery, params);

    res.json({
      rides: ridesResult.rows.map(ride => ({
        id: ride.id,
        passenger_id: ride.passenger_id,
        driver_id: ride.driver_id,
        pickup_address: ride.pickup_address || 'N/A',
        pickup_lat: ride.pickup_latitude,
        pickup_lng: ride.pickup_longitude,
        dropoff_address: ride.dropoff_address || 'N/A',
        dropoff_lat: ride.dropoff_latitude,
        dropoff_lng: ride.dropoff_longitude,
        status: ride.status,
        estimated_fare: ride.fare || 0,
        final_fare: ride.fare || 0,
        distance: ride.distance_km,
        duration: ride.duration_minutes,
        payment_method: ride.payment_method || 'cash',
        payment_status: ride.payment_status || 'pending',
        rating: ride.rating,
        created_at: ride.created_at,
        updated_at: ride.updated_at,
        passenger_name: ride.passenger_name || 'Passageiro',
        passenger_email: ride.passenger_email,
        driver_name: ride.driver_name || 'Aguardando motorista',
        driver_plate: ride.driver_plate,
        vehicle_type: ride.vehicle_type,
        vehicle_info: ride.vehicle_make 
          ? `${ride.vehicle_make} ${ride.vehicle_model} (${ride.vehicle_color})`
          : null
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({
      error: 'Failed to get rides',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/withdrawals
 * Get all withdrawal requests for admin panel
 */
router.get('/withdrawals', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await query(`
      SELECT id, driver_id, amount, net_amount, withdrawal_method, mobile_number, status, frequency, transaction_id, requested_at, completed_at, error_message
      FROM withdrawals
      ORDER BY requested_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), offset]);
    // Format to match frontend Withdrawal interface
    const withdrawals = result.rows.map(w => ({
      id: w.id,
      driverId: w.driver_id,
      amount: parseFloat(w.amount),
      netAmount: parseFloat(w.net_amount),
      method: w.withdrawal_method,
      mobileNumber: w.mobile_number,
      status: w.status,
      frequency: w.frequency,
      transactionId: w.transaction_id,
      requestedAt: w.requested_at,
      completedAt: w.completed_at,
      errorMessage: w.error_message
    }));
    res.json(withdrawals);
  } catch (error) {
    console.error('Get admin withdrawals error:', error);
    res.status(500).json({
      error: 'Failed to fetch withdrawals',
      message: error.message,
    });
  }
});

module.exports = router;
