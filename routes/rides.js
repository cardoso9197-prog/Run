/**
 * Run Run - Ride Routes
 * Handles ride booking, tracking, and management
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const { pool, query } = require('../database/db');
const { requirePassenger, requireDriver } = require('../middleware/auth');
const { calculateFare, calculateDistance } = require('../utils/pricing');

const router = express.Router();

/**
 * POST /api/rides/estimate-fare
 * Calculate fare estimate for a ride
 * Public endpoint (no auth required for estimation)
 */
router.post('/estimate-fare', async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      vehicleType,
      additionalStops = []
    } = req.body;

    // Validate required fields
    if (!pickupLatitude || !pickupLongitude || !dropoffLatitude || !dropoffLongitude) {
      return res.status(400).json({
        error: 'Missing required coordinates',
      });
    }

    // Calculate distance
    const distance = calculateDistance(
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude
    );

    // Add additional stops distance if any
    let totalDistance = distance;
    if (additionalStops.length > 0) {
      let lastLat = pickupLatitude;
      let lastLon = pickupLongitude;
      
      for (const stop of additionalStops) {
        totalDistance += calculateDistance(lastLat, lastLon, stop.latitude, stop.longitude);
        lastLat = stop.latitude;
        lastLon = stop.longitude;
      }
      
      totalDistance += calculateDistance(lastLat, lastLon, dropoffLatitude, dropoffLongitude);
    }

    // Estimate duration (assume 30 km/h average speed in city)
    const estimatedDuration = Math.ceil((totalDistance / 30) * 60); // minutes

    // Calculate fare
    const fareDetails = await calculateFare(totalDistance, estimatedDuration, vehicleType);

    res.json({
      success: true,
      estimate: {
        distance: totalDistance,
        duration: estimatedDuration,
        baseFare: fareDetails.baseFare,
        distanceFare: fareDetails.distanceFare,
        durationFare: fareDetails.durationFare,
        surgeFare: fareDetails.surgeFare,
        totalFare: fareDetails.totalFare,
        surgeMultiplier: fareDetails.surgeMultiplier,
      },
    });
  } catch (error) {
    console.error('Fare estimation error:', error);
    res.status(500).json({
      error: 'Failed to estimate fare',
      message: error.message,
    });
  }
});

/**
 * POST /api/rides/request
 * Request a new ride (Passenger only)
 */
router.post('/request', requirePassenger, async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      pickupAddress,
      dropoffLatitude,
      dropoffLongitude,
      dropoffAddress,
      vehicleType = 'RunRun',
      additionalStops = [],
    } = req.body;

    // Validate required fields
    if (!pickupLatitude || !pickupLongitude || !pickupAddress ||
        !dropoffLatitude || !dropoffLongitude || !dropoffAddress) {
      return res.status(400).json({
        error: 'Missing required ride information',
      });
    }

    // Get passenger ID
    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    if (passengerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger profile not found',
      });
    }

    const passengerId = passengerResult.rows[0].id;

    // Check for existing active ride
    const activeRideResult = await query(
      'SELECT id FROM rides WHERE passenger_id = $1 AND status NOT IN ($2, $3, $4)',
      [passengerId, 'completed', 'cancelled', 'failed']
    );

    if (activeRideResult.rows.length > 0) {
      return res.status(400).json({
        error: 'You already have an active ride',
        rideId: activeRideResult.rows[0].id,
      });
    }

    // Calculate distance and fare
    const distance = calculateDistance(
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude
    );

    const estimatedDuration = Math.ceil((distance / 30) * 60);
    const fareDetails = await calculateFare(distance, estimatedDuration, vehicleType);

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
        vehicle_type,
        estimated_distance_km,
        estimated_duration_minutes,
        estimated_fare,
        surge_multiplier,
        additional_stops,
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
      vehicleType,
      distance,
      estimatedDuration,
      fareDetails.totalFare,
      fareDetails.surgeMultiplier,
      additionalStops.length > 0 ? JSON.stringify(additionalStops) : null,
      'requested'
    ]);

    const ride = rideResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      ride: {
        id: ride.id,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
        vehicleType: ride.vehicle_type,
        estimatedFare: ride.estimated_fare,
        estimatedDistance: ride.estimated_distance_km,
        estimatedDuration: ride.estimated_duration_minutes,
        status: ride.status,
        requestedAt: ride.requested_at,
      },
    });
  } catch (error) {
    console.error('Ride request error:', error);
    res.status(500).json({
      error: 'Failed to request ride',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/active
 * Get passenger's active ride
 */
router.get('/active', requirePassenger, async (req, res) => {
  try {
    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    if (passengerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger profile not found',
      });
    }

    const passengerId = passengerResult.rows[0].id;

    const rideResult = await query(`
      SELECT r.*,
             d.name as driver_name,
             d.profile_photo_url as driver_photo,
             d.average_rating as driver_rating,
             v.make, v.model, v.year, v.color, v.license_plate,
             u.phone_number as driver_phone
      FROM rides r
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE r.passenger_id = $1
        AND r.status NOT IN ($2, $3, $4)
      ORDER BY r.requested_at DESC
      LIMIT 1
    `, [passengerId, 'completed', 'cancelled', 'failed']);

    if (rideResult.rows.length === 0) {
      return res.json({
        success: true,
        ride: null,
      });
    }

    const ride = rideResult.rows[0];

    // Get driver's current location if assigned
    let driverLocation = null;
    if (ride.driver_id) {
      const locationResult = await query(
        'SELECT latitude, longitude, heading, speed FROM driver_locations WHERE driver_id = $1 ORDER BY timestamp DESC LIMIT 1',
        [ride.driver_id]
      );
      
      if (locationResult.rows.length > 0) {
        driverLocation = locationResult.rows[0];
      }
    }

    res.json({
      success: true,
      ride: {
        id: ride.id,
        status: ride.status,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
        pickupLocation: {
          latitude: parseFloat(ride.pickup_latitude),
          longitude: parseFloat(ride.pickup_longitude),
        },
        dropoffLocation: {
          latitude: parseFloat(ride.dropoff_latitude),
          longitude: parseFloat(ride.dropoff_longitude),
        },
        vehicleType: ride.vehicle_type,
        estimatedFare: parseFloat(ride.estimated_fare),
        finalFare: ride.final_fare ? parseFloat(ride.final_fare) : null,
        estimatedDistance: parseFloat(ride.estimated_distance_km),
        estimatedDuration: ride.estimated_duration_minutes,
        requestedAt: ride.requested_at,
        acceptedAt: ride.accepted_at,
        arrivedAt: ride.arrived_at,
        startedAt: ride.started_at,
        completedAt: ride.completed_at,
        driver: ride.driver_id ? {
          id: ride.driver_id,
          name: ride.driver_name,
          photo: ride.driver_photo,
          rating: parseFloat(ride.driver_rating),
          phone: ride.driver_phone,
          currentLocation: driverLocation,
        } : null,
        vehicle: ride.driver_id ? {
          make: ride.make,
          model: ride.model,
          year: ride.year,
          color: ride.color,
          licensePlate: ride.license_plate,
        } : null,
      },
    });
  } catch (error) {
    console.error('Get active ride error:', error);
    res.status(500).json({
      error: 'Failed to get active ride',
      message: error.message,
    });
  }
});

/**
 * PUT /api/rides/:id/cancel
 * Cancel a ride (Passenger)
 */
router.put('/:id/cancel', requirePassenger, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'No reason provided' } = req.body;

    // Verify ride belongs to passenger
    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    if (passengerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger profile not found',
      });
    }

    const passengerId = passengerResult.rows[0].id;

    const rideResult = await query(
      'SELECT * FROM rides WHERE id = $1 AND passenger_id = $2',
      [id, passengerId]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Ride not found',
      });
    }

    const ride = rideResult.rows[0];

    if (!['requested', 'accepted', 'arrived'].includes(ride.status)) {
      return res.status(400).json({
        error: 'Cannot cancel ride in current status',
        status: ride.status,
      });
    }

    // Update ride status
    await query(`
      UPDATE rides
      SET status = $1,
          cancelled_at = NOW(),
          cancelled_by = $2,
          cancellation_reason = $3
      WHERE id = $4
    `, ['cancelled', 'passenger', reason, id]);

    // If driver was assigned, update driver status
    if (ride.driver_id) {
      await query(
        'UPDATE drivers SET status = $1 WHERE id = $2',
        ['online', ride.driver_id]
      );
    }

    res.json({
      success: true,
      message: 'Ride cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({
      error: 'Failed to cancel ride',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/history
 * Get passenger's ride history
 */
router.get('/history', requirePassenger, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    if (passengerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger profile not found',
      });
    }

    const passengerId = passengerResult.rows[0].id;

    let sqlQuery = `
      SELECT r.*,
             d.name as driver_name,
             d.profile_photo_url as driver_photo,
             v.make, v.model, v.color, v.license_plate
      FROM rides r
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      WHERE r.passenger_id = $1
    `;

    const params = [passengerId];

    if (status) {
      sqlQuery += ` AND r.status = $${params.length + 1}`;
      params.push(status);
    } else {
      sqlQuery += ` AND r.status IN ('completed', 'cancelled')`;
    }

    sqlQuery += ` ORDER BY r.requested_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const ridesResult = await query(sqlQuery, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM rides WHERE passenger_id = $1';
    const countParams = [passengerId];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    } else {
      countQuery += " AND status IN ('completed', 'cancelled')";
    }

    const countResult = await query(countQuery, countParams);
    const totalRides = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      rides: ridesResult.rows.map(ride => ({
        id: ride.id,
        status: ride.status,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
        vehicleType: ride.vehicle_type,
        estimatedFare: parseFloat(ride.estimated_fare),
        finalFare: ride.final_fare ? parseFloat(ride.final_fare) : null,
        distance: ride.actual_distance_km || ride.estimated_distance_km,
        duration: ride.actual_duration_minutes || ride.estimated_duration_minutes,
        requestedAt: ride.requested_at,
        completedAt: ride.completed_at,
        cancelledAt: ride.cancelled_at,
        driver: ride.driver_id ? {
          name: ride.driver_name,
          photo: ride.driver_photo,
        } : null,
        vehicle: ride.driver_id ? {
          make: ride.make,
          model: ride.model,
          color: ride.color,
          licensePlate: ride.license_plate,
        } : null,
        rating: ride.passenger_rating,
        comment: ride.passenger_comment,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalRides,
        pages: Math.ceil(totalRides / limit),
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
 * Rate a completed ride (Passenger)
 */
router.post('/:id/rate', requirePassenger, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment = '' } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      });
    }

    // Verify ride belongs to passenger and is completed
    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    if (passengerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger profile not found',
      });
    }

    const passengerId = passengerResult.rows[0].id;

    const rideResult = await query(
      'SELECT * FROM rides WHERE id = $1 AND passenger_id = $2',
      [id, passengerId]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Ride not found',
      });
    }

    const ride = rideResult.rows[0];

    if (ride.status !== 'completed') {
      return res.status(400).json({
        error: 'Can only rate completed rides',
      });
    }

    // Check if already rated
    const existingRatingResult = await query(
      'SELECT passenger_rating FROM ratings WHERE ride_id = $1',
      [id]
    );

    if (existingRatingResult.rows.length > 0 && existingRatingResult.rows[0].passenger_rating) {
      return res.status(400).json({
        error: 'Ride already rated',
      });
    }

    // Insert or update rating
    if (existingRatingResult.rows.length === 0) {
      await query(`
        INSERT INTO ratings (ride_id, passenger_rating, passenger_comment, passenger_rated_at)
        VALUES ($1, $2, $3, NOW())
      `, [id, rating, comment]);
    } else {
      await query(`
        UPDATE ratings
        SET passenger_rating = $1,
            passenger_comment = $2,
            passenger_rated_at = NOW()
        WHERE ride_id = $3
      `, [rating, comment, id]);
    }

    // Update driver's average rating
    if (ride.driver_id) {
      await query(`
        UPDATE drivers
        SET average_rating = (
          SELECT AVG(passenger_rating)::DECIMAL(3,2)
          FROM ratings r
          JOIN rides ri ON r.ride_id = ri.id
          WHERE ri.driver_id = $1 AND r.passenger_rating IS NOT NULL
        )
        WHERE id = $1
      `, [ride.driver_id]);
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully',
    });
  } catch (error) {
    console.error('Rate ride error:', error);
    res.status(500).json({
      error: 'Failed to submit rating',
      message: error.message,
    });
  }
});

// ==========================================
// DRIVER ENDPOINTS
// ==========================================

/**
 * GET /api/rides/driver/available
 * Get available ride requests near driver
 */
router.get('/driver/available', requireDriver, async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Driver location required',
      });
    }

    const driverResult = await query(
      'SELECT id, vehicle_id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver profile not found',
      });
    }

    const driver = driverResult.rows[0];

    // Get vehicle type
    const vehicleResult = await query(
      'SELECT vehicle_type FROM vehicles WHERE id = $1',
      [driver.vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Vehicle not found',
      });
    }

    const vehicleType = vehicleResult.rows[0].vehicle_type;

    // Find nearby ride requests
    const ridesResult = await query(`
      SELECT r.*,
             p.name as passenger_name,
             p.profile_photo_url as passenger_photo,
             p.average_rating as passenger_rating,
             u.phone_number as passenger_phone,
             (6371 * acos(cos(radians($1)) * cos(radians(r.pickup_latitude)) * 
             cos(radians(r.pickup_longitude) - radians($2)) + 
             sin(radians($1)) * sin(radians(r.pickup_latitude)))) AS distance_km
      FROM rides r
      JOIN passengers p ON r.passenger_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE r.status = 'requested'
        AND r.vehicle_type = $3
        AND r.requested_at > NOW() - INTERVAL '10 minutes'
      HAVING distance_km <= $4
      ORDER BY distance_km ASC, r.requested_at ASC
      LIMIT 10
    `, [latitude, longitude, vehicleType, radius]);

    res.json({
      success: true,
      rides: ridesResult.rows.map(ride => ({
        id: ride.id,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
        pickupLocation: {
          latitude: parseFloat(ride.pickup_latitude),
          longitude: parseFloat(ride.pickup_longitude),
        },
        dropoffLocation: {
          latitude: parseFloat(ride.dropoff_latitude),
          longitude: parseFloat(ride.dropoff_longitude),
        },
        estimatedFare: parseFloat(ride.estimated_fare),
        estimatedDistance: parseFloat(ride.estimated_distance_km),
        estimatedDuration: ride.estimated_duration_minutes,
        distanceToPickup: parseFloat(ride.distance_km),
        requestedAt: ride.requested_at,
        passenger: {
          name: ride.passenger_name,
          photo: ride.passenger_photo,
          rating: parseFloat(ride.passenger_rating),
        },
      })),
    });
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({
      error: 'Failed to get available rides',
      message: error.message,
    });
  }
});

/**
 * PUT /api/rides/:id/accept
 * Accept a ride request (Driver)
 */
router.put('/:id/accept', requireDriver, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Get driver info
    const driverResult = await client.query(
      'SELECT id, status FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Driver profile not found',
      });
    }

    const driver = driverResult.rows[0];

    if (driver.status !== 'online') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Driver must be online to accept rides',
      });
    }

    // Check if ride is still available
    const rideResult = await client.query(
      'SELECT * FROM rides WHERE id = $1 AND status = $2 FOR UPDATE',
      [id, 'requested']
    );

    if (rideResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Ride no longer available',
      });
    }

    // Accept ride
    await client.query(`
      UPDATE rides
      SET driver_id = $1,
          status = $2,
          accepted_at = NOW()
      WHERE id = $3
    `, [driver.id, 'accepted', id]);

    // Update driver status
    await client.query(
      'UPDATE drivers SET status = $1 WHERE id = $2',
      ['busy', driver.id]
    );

    await client.query('COMMIT');

    const ride = rideResult.rows[0];

    res.json({
      success: true,
      message: 'Ride accepted successfully',
      ride: {
        id: ride.id,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
        pickupLocation: {
          latitude: parseFloat(ride.pickup_latitude),
          longitude: parseFloat(ride.pickup_longitude),
        },
        dropoffLocation: {
          latitude: parseFloat(ride.dropoff_latitude),
          longitude: parseFloat(ride.dropoff_longitude),
        },
        estimatedFare: parseFloat(ride.estimated_fare),
        status: 'accepted',
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Accept ride error:', error);
    res.status(500).json({
      error: 'Failed to accept ride',
      message: error.message,
    });
  } finally {
    client.release();
  }
});

/**
 * PUT /api/rides/:id/status
 * Update ride status (Driver)
 * Valid transitions: accepted -> arrived -> started -> completed
 */
router.put('/:id/status', requireDriver, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actualDistance, actualDuration } = req.body;

    const validStatuses = ['arrived', 'started', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses,
      });
    }

    // Verify ride belongs to driver
    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver profile not found',
      });
    }

    const driverId = driverResult.rows[0].id;

    const rideResult = await query(
      'SELECT * FROM rides WHERE id = $1 AND driver_id = $2',
      [id, driverId]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Ride not found',
      });
    }

    const ride = rideResult.rows[0];

    // Validate status transition
    const validTransitions = {
      accepted: ['arrived'],
      arrived: ['started'],
      started: ['completed'],
    };

    if (!validTransitions[ride.status] || !validTransitions[ride.status].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status transition',
        currentStatus: ride.status,
        requestedStatus: status,
      });
    }

    // Update ride status
    let updateQuery = 'UPDATE rides SET status = $1';
    const params = [status];
    let paramIndex = 2;

    if (status === 'arrived') {
      updateQuery += `, arrived_at = NOW()`;
    } else if (status === 'started') {
      updateQuery += `, started_at = NOW()`;
    } else if (status === 'completed') {
      updateQuery += `, completed_at = NOW()`;
      
      if (actualDistance) {
        updateQuery += `, actual_distance_km = $${paramIndex}`;
        params.push(actualDistance);
        paramIndex++;
      }
      
      if (actualDuration) {
        updateQuery += `, actual_duration_minutes = $${paramIndex}`;
        params.push(actualDuration);
        paramIndex++;
      }

      // Calculate final fare if provided actual metrics
      if (actualDistance && actualDuration) {
        const fareDetails = await calculateFare(actualDistance, actualDuration, ride.vehicle_type);
        updateQuery += `, final_fare = $${paramIndex}`;
        params.push(fareDetails.totalFare);
        paramIndex++;
      } else {
        updateQuery += `, final_fare = estimated_fare`;
      }
    }

    updateQuery += ` WHERE id = $${paramIndex}`;
    params.push(id);

    await query(updateQuery, params);

    // If completed, update driver status back to online and create payment
    if (status === 'completed') {
      await query(
        'UPDATE drivers SET status = $1, total_rides = total_rides + 1 WHERE id = $2',
        ['online', driverId]
      );

      // Calculate final fare
      const updatedRide = await query('SELECT * FROM rides WHERE id = $1', [id]);
      const finalFare = parseFloat(updatedRide.rows[0].final_fare);
      const commissionRate = 20; // 20%
      const platformCommission = finalFare * (commissionRate / 100);
      const driverEarnings = finalFare - platformCommission;

      // Create payment record
      await query(`
        INSERT INTO payments (
          ride_id,
          passenger_id,
          driver_id,
          amount,
          payment_method,
          status,
          platform_commission,
          driver_earnings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        id,
        ride.passenger_id,
        driverId,
        finalFare,
        'cash', // Default to cash for now
        'pending',
        platformCommission,
        driverEarnings
      ]);

      // Update driver total earnings
      await query(
        'UPDATE drivers SET total_earnings = total_earnings + $1 WHERE id = $2',
        [driverEarnings, driverId]
      );
    }

    res.json({
      success: true,
      message: `Ride status updated to ${status}`,
      status,
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({
      error: 'Failed to update ride status',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/driver/active
 * Get driver's active ride
 */
router.get('/driver/active', requireDriver, async (req, res) => {
  try {
    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver profile not found',
      });
    }

    const driverId = driverResult.rows[0].id;

    const rideResult = await query(`
      SELECT r.*,
             p.name as passenger_name,
             p.profile_photo_url as passenger_photo,
             p.average_rating as passenger_rating,
             u.phone_number as passenger_phone
      FROM rides r
      JOIN passengers p ON r.passenger_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE r.driver_id = $1
        AND r.status NOT IN ($2, $3, $4)
      ORDER BY r.accepted_at DESC
      LIMIT 1
    `, [driverId, 'completed', 'cancelled', 'failed']);

    if (rideResult.rows.length === 0) {
      return res.json({
        success: true,
        ride: null,
      });
    }

    const ride = rideResult.rows[0];

    res.json({
      success: true,
      ride: {
        id: ride.id,
        status: ride.status,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
        pickupLocation: {
          latitude: parseFloat(ride.pickup_latitude),
          longitude: parseFloat(ride.pickup_longitude),
        },
        dropoffLocation: {
          latitude: parseFloat(ride.dropoff_latitude),
          longitude: parseFloat(ride.dropoff_longitude),
        },
        estimatedFare: parseFloat(ride.estimated_fare),
        finalFare: ride.final_fare ? parseFloat(ride.final_fare) : null,
        estimatedDistance: parseFloat(ride.estimated_distance_km),
        estimatedDuration: ride.estimated_duration_minutes,
        acceptedAt: ride.accepted_at,
        arrivedAt: ride.arrived_at,
        startedAt: ride.started_at,
        passenger: {
          name: ride.passenger_name,
          photo: ride.passenger_photo,
          rating: parseFloat(ride.passenger_rating),
          phone: ride.passenger_phone,
        },
      },
    });
  } catch (error) {
    console.error('Get driver active ride error:', error);
    res.status(500).json({
      error: 'Failed to get active ride',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/driver/history
 * Get driver's ride history
 */
router.get('/driver/history', requireDriver, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const driverResult = await query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver profile not found',
      });
    }

    const driverId = driverResult.rows[0].id;

    const ridesResult = await query(`
      SELECT r.*,
             p.name as passenger_name,
             rat.driver_rating, rat.driver_comment,
             pay.driver_earnings
      FROM rides r
      JOIN passengers p ON r.passenger_id = p.id
      LEFT JOIN ratings rat ON r.id = rat.ride_id
      LEFT JOIN payments pay ON r.id = pay.ride_id
      WHERE r.driver_id = $1
        AND r.status = 'completed'
      ORDER BY r.completed_at DESC
      LIMIT $2 OFFSET $3
    `, [driverId, limit, offset]);

    // Get total count
    const countResult = await query(
      "SELECT COUNT(*) FROM rides WHERE driver_id = $1 AND status = 'completed'",
      [driverId]
    );
    const totalRides = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      rides: ridesResult.rows.map(ride => ({
        id: ride.id,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
        distance: ride.actual_distance_km || ride.estimated_distance_km,
        duration: ride.actual_duration_minutes || ride.estimated_duration_minutes,
        fare: parseFloat(ride.final_fare || ride.estimated_fare),
        earnings: ride.driver_earnings ? parseFloat(ride.driver_earnings) : null,
        completedAt: ride.completed_at,
        passenger: {
          name: ride.passenger_name,
        },
        rating: ride.driver_rating,
        comment: ride.driver_comment,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalRides,
        pages: Math.ceil(totalRides / limit),
      },
    });
  } catch (error) {
    console.error('Get driver ride history error:', error);
    res.status(500).json({
      error: 'Failed to get ride history',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/driver/earnings
 * Get driver's earnings summary
 */
router.get('/driver/earnings', requireDriver, async (req, res) => {
  try {
    const { period = 'today' } = req.query;

    const driverResult = await query(
      'SELECT id, total_earnings FROM drivers WHERE user_id = $1',
      [req.user.id]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Driver profile not found',
      });
    }

    const driverId = driverResult.rows[0].id;
    const totalEarnings = parseFloat(driverResult.rows[0].total_earnings);

    // Build date filter based on period
    let dateFilter = '';
    if (period === 'today') {
      dateFilter = "AND DATE(r.completed_at) = CURRENT_DATE";
    } else if (period === 'week') {
      dateFilter = "AND r.completed_at >= DATE_TRUNC('week', CURRENT_DATE)";
    } else if (period === 'month') {
      dateFilter = "AND r.completed_at >= DATE_TRUNC('month', CURRENT_DATE)";
    }

    const statsResult = await query(`
      SELECT
        COUNT(r.id) as total_rides,
        COALESCE(SUM(p.driver_earnings), 0) as period_earnings,
        COALESCE(SUM(r.actual_distance_km), 0) as total_distance,
        COALESCE(AVG(rat.driver_rating), 0) as average_rating
      FROM rides r
      LEFT JOIN payments p ON r.id = p.ride_id
      LEFT JOIN ratings rat ON r.id = rat.ride_id AND rat.driver_rating IS NOT NULL
      WHERE r.driver_id = $1
        AND r.status = 'completed'
        ${dateFilter}
    `, [driverId]);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      earnings: {
        period,
        periodEarnings: parseFloat(stats.period_earnings),
        totalEarnings,
        totalRides: parseInt(stats.total_rides),
        totalDistance: parseFloat(stats.total_distance),
        averageRating: parseFloat(stats.average_rating),
      },
    });
  } catch (error) {
    console.error('Get driver earnings error:', error);
    res.status(500).json({
      error: 'Failed to get earnings',
      message: error.message,
    });
  }
});

/**
 * PUT /api/rides/:id/cancel
 * Cancel a ride (passenger or driver)
 */
router.put('/:id/cancel', async (req, res) => {
  try {
    const rideId = req.params.id;
    const { reason } = req.body;

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

    // Check if user is authorized (passenger or driver of this ride)
    const isPassenger = req.user.role === 'passenger';
    const isDriver = req.user.role === 'driver';
    
    let authorized = false;
    if (isPassenger) {
      const passengerResult = await query(
        'SELECT id FROM passengers WHERE user_id = $1',
        [req.user.id]
      );
      authorized = passengerResult.rows.length > 0 && 
                   passengerResult.rows[0].id === ride.passenger_id;
    } else if (isDriver) {
      const driverResult = await query(
        'SELECT id FROM drivers WHERE user_id = $1',
        [req.user.id]
      );
      authorized = driverResult.rows.length > 0 && 
                   driverResult.rows[0].id === ride.driver_id;
    }

    if (!authorized) {
      return res.status(403).json({
        error: 'Not authorized to cancel this ride',
      });
    }

    // Check if ride can be cancelled
    if (ride.status === 'completed') {
      return res.status(400).json({
        error: 'Cannot cancel completed ride',
      });
    }

    if (ride.status === 'cancelled') {
      return res.status(400).json({
        error: 'Ride already cancelled',
      });
    }

    // Update ride status
    await query(
      'UPDATE rides SET status = $1, cancelled_by = $2, cancellation_reason = $3, updated_at = NOW() WHERE id = $4',
      ['cancelled', req.user.role, reason || 'No reason provided', rideId]
    );

    // Refund if payment was made
    if (ride.payment_status === 'completed') {
      await query(
        'UPDATE payments SET status = $1, updated_at = NOW() WHERE ride_id = $2',
        ['refunded', rideId]
      );
    }

    res.json({
      success: true,
      message: 'Ride cancelled successfully',
      ride: {
        id: rideId,
        status: 'cancelled',
        cancelledBy: req.user.role,
        reason: reason || 'No reason provided',
      },
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({
      error: 'Failed to cancel ride',
      message: error.message,
    });
  }
});

/**
 * GET /api/rides/history
 * Get passenger's ride history
 */
router.get('/history', requirePassenger, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    if (passengerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger profile not found',
      });
    }

    const passengerId = passengerResult.rows[0].id;

    // Build status filter
    let statusFilter = '';
    if (status) {
      statusFilter = 'AND r.status = $3';
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM rides r WHERE r.passenger_id = $1 ${statusFilter}`,
      status ? [passengerId, status] : [passengerId]
    );
    const totalRides = parseInt(countResult.rows[0].total);

    // Get rides with driver and payment info
    const ridesResult = await query(`
      SELECT
        r.*,
        d.id as driver_id,
        u.name as driver_name,
        u.phone as driver_phone,
        v.vehicle_type,
        v.license_plate,
        v.vehicle_color,
        p.amount as paid_amount,
        p.payment_method,
        p.status as payment_status,
        rat.passenger_rating,
        rat.passenger_comment
      FROM rides r
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN vehicles v ON d.id = v.driver_id
      LEFT JOIN payments p ON r.id = p.ride_id
      LEFT JOIN ratings rat ON r.id = rat.ride_id
      WHERE r.passenger_id = $1
      ${statusFilter}
      ORDER BY r.created_at DESC
      LIMIT $${status ? 4 : 2} OFFSET $${status ? 5 : 3}
    `, status ? [passengerId, limit, offset, status] : [passengerId, limit, offset]);

    res.json({
      success: true,
      rides: ridesResult.rows.map(ride => ({
        id: ride.id,
        status: ride.status,
        pickup: {
          latitude: parseFloat(ride.pickup_latitude),
          longitude: parseFloat(ride.pickup_longitude),
          address: ride.pickup_address,
        },
        dropoff: {
          latitude: parseFloat(ride.dropoff_latitude),
          longitude: parseFloat(ride.dropoff_longitude),
          address: ride.dropoff_address,
        },
        fare: parseFloat(ride.fare),
        distance: parseFloat(ride.estimated_distance_km),
        duration: ride.estimated_duration_minutes,
        vehicleType: ride.vehicle_type_requested,
        createdAt: ride.created_at,
        completedAt: ride.completed_at,
        driver: ride.driver_id ? {
          id: ride.driver_id,
          name: ride.driver_name,
          phone: ride.driver_phone,
          vehicle: {
            type: ride.vehicle_type,
            plate: ride.license_plate,
            color: ride.vehicle_color,
          },
        } : null,
        payment: {
          amount: ride.paid_amount ? parseFloat(ride.paid_amount) : null,
          method: ride.payment_method,
          status: ride.payment_status,
        },
        rating: {
          rating: ride.passenger_rating,
          comment: ride.passenger_comment,
        },
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalRides,
        pages: Math.ceil(totalRides / limit),
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

module.exports = router;
