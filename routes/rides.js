const express = require('express');
const { pool, query } = require('../database/db');
const { requirePassenger, requireDriver } = require('../middleware/auth');
const { calculateFare, calculateDistance } = require('../utils/pricing');

const router = express.Router();

router.post('/estimate-fare', async (req, res) => {
  try {
    const { pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude, vehicleType = 'RunRun' } = req.body;
    if (!pickupLatitude || !pickupLongitude || !dropoffLatitude || !dropoffLongitude) {
      return res.status(400).json({ error: 'Missing required coordinates' });
    }
    const distance = calculateDistance(pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude);
    const estimatedDuration = Math.ceil((distance / 30) * 60);
    const fareDetails = await calculateFare(distance, estimatedDuration, vehicleType);
    res.json({ success: true, estimate: { distance, duration: estimatedDuration, ...fareDetails } });
  } catch (error) {
    console.error('Fare estimation error:', error);
    res.status(500).json({ error: 'Failed to estimate fare', message: error.message });
  }
});

router.post('/request', requirePassenger, async (req, res) => {
  try {
    const { pickupLatitude, pickupLongitude, pickupAddress, dropoffLatitude, dropoffLongitude, dropoffAddress, vehicleType = 'RunRun' } = req.body;
    if (!pickupLatitude || !pickupLongitude || !pickupAddress || !dropoffLatitude || !dropoffLongitude || !dropoffAddress) {
      return res.status(400).json({ error: 'Missing required ride information' });
    }
    const passengerResult = await query('SELECT id FROM passengers WHERE user_id = $1', [req.user.id]);
    if (passengerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Passenger profile not found' });
    }
    const passengerId = passengerResult.rows[0].id;
    const distance = calculateDistance(pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude);
    const estimatedDuration = Math.ceil((distance / 30) * 60);
    const fareDetails = await calculateFare(distance, estimatedDuration, vehicleType);
    const rideResult = await query(`INSERT INTO rides (passenger_id, pickup_latitude, pickup_longitude, pickup_address, dropoff_latitude, dropoff_longitude, dropoff_address, vehicle_type, estimated_distance_km, estimated_duration_minutes, estimated_fare, surge_multiplier, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, [passengerId, pickupLatitude, pickupLongitude, pickupAddress, dropoffLatitude, dropoffLongitude, dropoffAddress, vehicleType, distance, estimatedDuration, fareDetails.totalFare, fareDetails.surgeMultiplier, 'requested']);
    const ride = rideResult.rows[0];
    res.status(201).json({ success: true, message: 'Ride requested successfully', ride: { id: ride.id, pickupAddress: ride.pickup_address, dropoffAddress: ride.dropoff_address, vehicleType: ride.vehicle_type, estimatedFare: ride.estimated_fare, estimatedDistance: ride.estimated_distance_km, estimatedDuration: ride.estimated_duration_minutes, status: ride.status, requestedAt: ride.requested_at } });
  } catch (error) {
    console.error('Ride request error:', error);
    res.status(500).json({ error: 'Failed to request ride', message: error.message });
  }
});

router.get('/active', requirePassenger, async (req, res) => {
  try {
    const passengerResult = await query('SELECT id FROM passengers WHERE user_id = $1', [req.user.id]);
    if (passengerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Passenger profile not found' });
    }
    const passengerId = passengerResult.rows[0].id;
    const rideResult = await query(`SELECT r.*, d.name as driver_name, d.profile_photo_url as driver_photo, d.average_rating as driver_rating, v.make, v.model, v.year, v.color, v.license_plate, u.phone_number as driver_phone FROM rides r LEFT JOIN drivers d ON r.driver_id = d.id LEFT JOIN vehicles v ON d.vehicle_id = v.id LEFT JOIN users u ON d.user_id = u.id WHERE r.passenger_id = $1 AND r.status NOT IN ($2, $3) ORDER BY r.requested_at DESC LIMIT 1`, [passengerId, 'completed', 'cancelled']);
    if (rideResult.rows.length === 0) {
      return res.json({ success: true, ride: null });
    }
    const ride = rideResult.rows[0];
    res.json({ success: true, ride: { id: ride.id, status: ride.status, pickupAddress: ride.pickup_address, dropoffAddress: ride.dropoff_address, estimatedFare: parseFloat(ride.estimated_fare), driver: ride.driver_id ? { id: ride.driver_id, name: ride.driver_name, photo: ride.driver_photo, rating: parseFloat(ride.driver_rating), phone: ride.driver_phone } : null } });
  } catch (error) {
    console.error('Get active ride error:', error);
    res.status(500).json({ error: 'Failed to get active ride', message: error.message });
  }
});

router.get('/driver/available', requireDriver, async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Driver location required' });
    }
    const driverResult = await query('SELECT id, vehicle_id FROM drivers WHERE user_id = $1', [req.user.id]);
    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }
    const driver = driverResult.rows[0];
    const vehicleResult = await query('SELECT vehicle_type FROM vehicles WHERE id = $1', [driver.vehicle_id]);
    if (vehicleResult.rows.length === 0) {
      return res.status(400).json({ error: 'Vehicle not found' });
    }
    const vehicleType = vehicleResult.rows[0].vehicle_type;
    const ridesResult = await query(`SELECT r.*, p.name as passenger_name, p.average_rating as passenger_rating, (6371 * acos(cos(radians($1)) * cos(radians(r.pickup_latitude)) * cos(radians(r.pickup_longitude) - radians($2)) + sin(radians($1)) * sin(radians(r.pickup_latitude)))) AS distance_km FROM rides r JOIN passengers p ON r.passenger_id = p.id WHERE r.status = 'requested' AND r.vehicle_type = $3 HAVING distance_km <= $4 ORDER BY distance_km ASC LIMIT 10`, [latitude, longitude, vehicleType, radius]);
    res.json({ success: true, rides: ridesResult.rows.map(ride => ({ id: ride.id, pickupAddress: ride.pickup_address, dropoffAddress: ride.dropoff_address, estimatedFare: parseFloat(ride.estimated_fare), distanceToPickup: parseFloat(ride.distance_km), requestedAt: ride.requested_at, passenger: { name: ride.passenger_name, rating: parseFloat(ride.passenger_rating) } })) });
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({ error: 'Failed to get available rides', message: error.message });
  }
});

router.put('/:id/accept', requireDriver, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const driverResult = await client.query('SELECT id, status FROM drivers WHERE user_id = $1', [req.user.id]);
    if (driverResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Driver profile not found' });
    }
    const driver = driverResult.rows[0];
    if (driver.status !== 'online') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Driver must be online to accept rides' });
    }
    const rideResult = await client.query('SELECT * FROM rides WHERE id = $1 AND status = $2 FOR UPDATE', [id, 'requested']);
    if (rideResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Ride no longer available' });
    }
    await client.query(`UPDATE rides SET driver_id = $1, status = $2, accepted_at = NOW() WHERE id = $3`, [driver.id, 'accepted', id]);
    await client.query('UPDATE drivers SET status = $1 WHERE id = $2', ['busy', driver.id]);
    await client.query('COMMIT');
    const ride = rideResult.rows[0];
    res.json({ success: true, message: 'Ride accepted successfully', ride: { id: ride.id, pickupAddress: ride.pickup_address, dropoffAddress: ride.dropoff_address, estimatedFare: parseFloat(ride.estimated_fare), status: 'accepted' } });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Accept ride error:', error);
    res.status(500).json({ error: 'Failed to accept ride', message: error.message });
  } finally {
    client.release();
  }
});

router.put('/:id/status', requireDriver, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['arrived', 'started', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status', validStatuses });
    }
    const driverResult = await query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }
    const driverId = driverResult.rows[0].id;
    const rideResult = await query('SELECT * FROM rides WHERE id = $1 AND driver_id = $2', [id, driverId]);
    if (rideResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    let updateQuery = 'UPDATE rides SET status = $1';
    const params = [status];
    if (status === 'arrived') {
      updateQuery += ', arrived_at = NOW()';
    } else if (status === 'started') {
      updateQuery += ', started_at = NOW()';
    } else if (status === 'completed') {
      updateQuery += ', completed_at = NOW(), final_fare = estimated_fare';
    }
    updateQuery += ' WHERE id = $2';
    params.push(id);
    await query(updateQuery, params);
    if (status === 'completed') {
      await query('UPDATE drivers SET status = $1 WHERE id = $2', ['online', driverId]);
    }
    res.json({ success: true, message: `Ride status updated to ${status}`, status });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ error: 'Failed to update ride status', message: error.message });
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
    const rideResult = await query('SELECT * FROM rides WHERE id = $1', [rideId]);
    if (rideResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    const ride = rideResult.rows[0];
    const isPassenger = req.user.role === 'passenger';
    const isDriver = req.user.role === 'driver';
    let authorized = false;
    if (isPassenger) {
      const passengerResult = await query('SELECT id FROM passengers WHERE user_id = $1', [req.user.id]);
      authorized = passengerResult.rows.length > 0 && passengerResult.rows[0].id === ride.passenger_id;
    } else if (isDriver) {
      const driverResult = await query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
      authorized = driverResult.rows.length > 0 && driverResult.rows[0].id === ride.driver_id;
    }
    if (!authorized) {
      return res.status(403).json({ error: 'Not authorized to cancel this ride' });
    }
    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel this ride' });
    }
    await query('UPDATE rides SET status = $1, updated_at = NOW() WHERE id = $2', ['cancelled', rideId]);
    res.json({ success: true, message: 'Ride cancelled successfully', ride: { id: rideId, status: 'cancelled' } });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({ error: 'Failed to cancel ride', message: error.message });
  }
});

/**
 * GET /api/rides/history
 * Get passenger ride history
 */
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const passengerResult = await query('SELECT id FROM passengers WHERE user_id = $1', [req.user.id]);
    if (passengerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Passenger profile not found' });
    }
    const passengerId = passengerResult.rows[0].id;
    const ridesResult = await query('SELECT r.*, d.name as driver_name FROM rides r LEFT JOIN drivers d ON r.driver_id = d.id LEFT JOIN users u ON d.user_id = u.id WHERE r.passenger_id = $1 ORDER BY r.created_at DESC LIMIT $2 OFFSET $3', [passengerId, limit, offset]);
    res.json({ success: true, rides: ridesResult.rows });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({ error: 'Failed to get ride history', message: error.message });
  }
});

module.exports = router;

