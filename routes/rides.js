/**
 * Run Run - Ride Routes
 * Handles ride requests, updates, and history
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const { query, transaction } = require('../database/db');
const { validateRideRequest, validateRating } = require('../middleware/validation');
const { requirePassenger, requireDriver } = require('../middleware/auth');
const { calculateFare, calculateDistance } = require('../utils/pricing');

const router = express.Router();

/**
 * POST /api/rides/request
 * Request a new ride (passenger only)
 */
router.post('/request', requirePassenger, validateRideRequest, async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      pickupAddress,
      dropoffLatitude,
      dropoffLongitude,
      dropoffAddress,
      additionalStops,
      vehicleType,
      paymentMethod,
    } = req.body;

    // Get passenger ID
    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    if (passengerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger not found',
      });
    }

    const passengerId = passengerResult.rows[0].id;

    // Calculate distance and fare
    const distance = calculateDistance(
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude
    );

    const estimatedDuration = Math.ceil(distance / 0.5); // Assume 30 km/h average speed
    const fare = calculateFare(distance, estimatedDuration, vehicleType);

    // Create ride
    const rideResult = await query(`
      INSERT INTO rides (
        passenger_id,
        pickup_latitude,
        pickup_longitude,
        pickup_address,
        dropoff_latitude,
        dropoff_longitude,
        dropoff_address,
        additional_stops,
        vehicle_type,
        estimated_distance_km,
        estimated_duration_minutes,
        estimated_fare,
        final_fare,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      passengerId,
      pickupLatitude,
      pickupLongitude,
      pickupAddress,
      dropoffLatitude,
      dropoffLongitude,
      dropoffAddress,
      additionalStops ? JSON.stringify(additionalStops) : null,
      vehicleType,
      distance,
      estimatedDuration,
      fare,
      fare,
      'requested',
    ]);

    const ride = rideResult.rows[0];

    res.json({
      success: true,
      message: 'Ride requested successfully',
      ride: {
        id: ride.id,
        pickupAddress,
        dropoffAddress,
        vehicleType,
        estimatedDistance: distance,
        estimatedDuration,
        estimatedFare: fare,
        status: 'requested',
      },
    });
  } catch (error) {
    console.error('Request ride error:', error);
    res.status(500).json({
      error: 'Failed to request ride',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/:id
 * Get ride details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT r.*,
             p.name as passenger_name,
             p.profile_photo_url as passenger_photo,
             p.average_rating as passenger_rating,
             d.name as driver_name,
             d.profile_photo_url as driver_photo,
             d.average_rating as driver_rating,
             v.make, v.model, v.color, v.license_plate,
             pay.payment_method, pay.status as payment_status
      FROM rides r
      JOIN passengers p ON r.passenger_id = p.id
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN payments pay ON r.id = pay.ride_id
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Ride not found',
      });
    }

    res.json({
      success: true,
      ride: result.rows[0],
    });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({
      error: 'Failed to get ride',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/history
 * Get ride history for current user
 */
router.get('/history/all', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    let rides;
    if (req.user.user_type === 'passenger') {
      const passengerResult = await query(
        'SELECT id FROM passengers WHERE user_id = $1',
        [req.user.id]
      );
      const passengerId = passengerResult.rows[0]?.id;

      rides = await query(`
        SELECT r.*,
               d.name as driver_name,
               d.average_rating as driver_rating,
               v.make, v.model,
               pay.payment_method, pay.status as payment_status
        FROM rides r
        LEFT JOIN drivers d ON r.driver_id = d.id
        LEFT JOIN vehicles v ON d.vehicle_id = v.id
        LEFT JOIN payments pay ON r.id = pay.ride_id
        WHERE r.passenger_id = $1
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `, [passengerId, limit, offset]);
    } else if (req.user.user_type === 'driver') {
      const driverResult = await query(
        'SELECT id FROM drivers WHERE user_id = $1',
        [req.user.id]
      );
      const driverId = driverResult.rows[0]?.id;

      rides = await query(`
        SELECT r.*,
               p.name as passenger_name,
               p.average_rating as passenger_rating,
               pay.payment_method, pay.status as payment_status,
               pay.driver_earnings
        FROM rides r
        JOIN passengers p ON r.passenger_id = p.id
        LEFT JOIN payments pay ON r.id = pay.ride_id
        WHERE r.driver_id = $1
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `, [driverId, limit, offset]);
    }

    res.json({
      success: true,
      rides: rides.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: rides.rows.length,
      },
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({
      error: 'Failed to get ride history',
      message: error.message,
    });
  }
});

/**
 * POST /api/rides/:id/rate
 * Rate a completed ride
 */
router.post('/:id/rate', validateRating, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Get ride
    const rideResult = await query(
      'SELECT passenger_id, driver_id, status FROM rides WHERE id = $1',
      [id]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Ride not found',
      });
    }

    const ride = rideResult.rows[0];

    if (ride.status !== 'completed') {
      return res.status(400).json({
        error: 'Cannot rate ride',
        message: 'Ride must be completed before rating',
      });
    }

    // Determine if passenger or driver is rating
    const isPassenger = req.user.user_type === 'passenger';

    // Insert or update rating
    if (isPassenger) {
      await query(`
        INSERT INTO ratings (ride_id, passenger_rating, passenger_comment, passenger_rated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (ride_id)
        DO UPDATE SET passenger_rating = $2, passenger_comment = $3, passenger_rated_at = NOW()
      `, [id, rating, comment]);

      // Update driver average rating
      if (ride.driver_id) {
        await query(`
          UPDATE drivers d
          SET average_rating = (
            SELECT AVG(passenger_rating)
            FROM ratings r
            JOIN rides rd ON r.ride_id = rd.id
            WHERE rd.driver_id = d.id AND r.passenger_rating IS NOT NULL
          )
          WHERE d.id = $1
        `, [ride.driver_id]);
      }
    } else {
      await query(`
        INSERT INTO ratings (ride_id, driver_rating, driver_comment, driver_rated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (ride_id)
        DO UPDATE SET driver_rating = $2, driver_comment = $3, driver_rated_at = NOW()
      `, [id, rating, comment]);

      // Update passenger average rating
      await query(`
        UPDATE passengers p
        SET average_rating = (
          SELECT AVG(driver_rating)
          FROM ratings r
          JOIN rides rd ON r.ride_id = rd.id
          WHERE rd.passenger_id = p.id AND r.driver_rating IS NOT NULL
        )
        WHERE p.id = $1
      `, [ride.passenger_id]);
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully',
    });
  } catch (error) {
    console.error('Rate ride error:', error);
    res.status(500).json({
      error: 'Failed to rate ride',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/active
 * Get active ride for current user
 */
router.get('/active/current', async (req, res) => {
  try {
    let ride;
    if (req.user.user_type === 'passenger') {
      const passengerResult = await query(
        'SELECT id FROM passengers WHERE user_id = $1',
        [req.user.id]
      );
      const passengerId = passengerResult.rows[0]?.id;

      ride = await query(`
        SELECT r.*,
               d.name as driver_name,
               d.profile_photo_url as driver_photo,
               d.average_rating as driver_rating,
               v.make, v.model, v.color, v.license_plate
        FROM rides r
        LEFT JOIN drivers d ON r.driver_id = d.id
        LEFT JOIN vehicles v ON d.vehicle_id = v.id
        WHERE r.passenger_id = $1
          AND r.status IN ('requested', 'accepted', 'arrived', 'started')
        ORDER BY r.created_at DESC
        LIMIT 1
      `, [passengerId]);
    } else if (req.user.user_type === 'driver') {
      const driverResult = await query(
        'SELECT id FROM drivers WHERE user_id = $1',
        [req.user.id]
      );
      const driverId = driverResult.rows[0]?.id;

      ride = await query(`
        SELECT r.*,
               p.name as passenger_name,
               p.profile_photo_url as passenger_photo,
               p.average_rating as passenger_rating
        FROM rides r
        JOIN passengers p ON r.passenger_id = p.id
        WHERE r.driver_id = $1
          AND r.status IN ('accepted', 'arrived', 'started')
        ORDER BY r.created_at DESC
        LIMIT 1
      `, [driverId]);
    }

    res.json({
      success: true,
      ride: ride.rows.length > 0 ? ride.rows[0] : null,
    });
  } catch (error) {
    console.error('Get active ride error:', error);
    res.status(500).json({
      error: 'Failed to get active ride',
      message: error.message,
    });
  }
});

module.exports = router;
