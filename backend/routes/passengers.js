/**
 * Run Run - Passenger Routes
 * Handles passenger profile and preferences
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const { query } = require('../database/db');
const { requirePassenger } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/passengers/profile
 * Get passenger profile
 */
router.get('/profile', requirePassenger, async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, u.phone
      FROM passengers p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Passenger not found',
      });
    }

    res.json({
      success: true,
      passenger: result.rows[0],
    });
  } catch (error) {
    console.error('Get passenger profile error:', error);
    res.status(500).json({
      error: 'Failed to get passenger profile',
      message: error.message,
    });
  }
});

/**
 * PUT /api/passengers/profile
 * Update passenger profile
 */
router.put('/profile', requirePassenger, async (req, res) => {
  try {
    const { name, email, profilePhotoUrl } = req.body;

    const result = await query(`
      UPDATE passengers
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          profile_photo_url = COALESCE($3, profile_photo_url),
          updated_at = NOW()
      WHERE user_id = $4
      RETURNING *
    `, [name, email, profilePhotoUrl, req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      passenger: result.rows[0],
    });
  } catch (error) {
    console.error('Update passenger profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message,
    });
  }
});

/**
 * GET /api/passengers/stats
 * Get passenger statistics
 */
router.get('/stats', requirePassenger, async (req, res) => {
  try {
    const passengerResult = await query(
      'SELECT id FROM passengers WHERE user_id = $1',
      [req.user.id]
    );

    const passengerId = passengerResult.rows[0]?.id;

    const stats = await query(`
      SELECT 
        COUNT(*) as total_rides,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_rides,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_rides,
        COALESCE(SUM(final_fare) FILTER (WHERE status = 'completed'), 0) as total_spent,
        COALESCE(AVG(actual_distance_km) FILTER (WHERE status = 'completed'), 0) as avg_distance,
        COUNT(*) FILTER (WHERE DATE(completed_at) = CURRENT_DATE) as rides_today,
        COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE - INTERVAL '30 days') as rides_this_month
      FROM rides
      WHERE passenger_id = $1
    `, [passengerId]);

    res.json({
      success: true,
      stats: stats.rows[0],
    });
  } catch (error) {
    console.error('Get passenger stats error:', error);
    res.status(500).json({
      error: 'Failed to get passenger stats',
      message: error.message,
    });
  }
});

module.exports = router;
