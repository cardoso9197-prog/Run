/**
 * Run Run - Authentication Routes
 * Handles user login, registration, and OTP verification
 * Developer: Edivaldo Cardoso
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query, transaction } = require('../database/db');
const { validatePhoneNumber } = require('../middleware/validation');

const router = express.Router();

// In-memory OTP storage (use Redis in production!)
const otpStore = new Map();

/**
 * Generate random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SMS (placeholder - integrate with SMS service)
 */
const sendOTP = async (phoneNumber, otp) => {
  console.log(`📱 Sending OTP ${otp} to ${phoneNumber}`);
  // TODO: Integrate with SMS gateway (Twilio, Africa's Talking, etc.)
  // For development, we just log it
  return true;
};

/**
 * POST /api/auth/send-otp
 * Request OTP for phone number
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        error: 'Invalid phone number',
        message: 'Phone number must be in format +245XXXXXXXXX',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with 5-minute expiration
    otpStore.set(phoneNumber, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send OTP via SMS
    await sendOTP(phoneNumber, otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, include OTP in response
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      error: 'Failed to send OTP',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and login/register user
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp, name, vehicleType, licensePlate } = req.body;
    let userType = req.body.userType; // Use let so we can reassign it later

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Phone number and OTP are required',
      });
    }

    // Check if OTP exists and is valid
    const storedOTP = otpStore.get(phoneNumber);
    if (!storedOTP) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'OTP not found or expired',
      });
    }

    if (storedOTP.expiresAt < Date.now()) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        error: 'OTP expired',
        message: 'Please request a new OTP',
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'The OTP you entered is incorrect',
      });
    }

    // OTP is valid, remove it
    otpStore.delete(phoneNumber);

    // Check if user exists
    let userResult = await query(
      'SELECT id, user_type FROM users WHERE phone = $1',
      [phoneNumber]
    );

    let userId;
    let isNewUser = false;

    if (userResult.rows.length === 0) {
      // New user - create account
      if (!userType || !['passenger', 'driver'].includes(userType)) {
        return res.status(400).json({
          error: 'Invalid user type',
          message: 'User type must be either "passenger" or "driver"',
        });
      }

      if (!name || name.trim().length < 2) {
        return res.status(400).json({
          error: 'Invalid name',
          message: 'Name is required and must be at least 2 characters',
        });
      }

      // Create user in transaction
      const result = await transaction(async (client) => {
        // Create base user
        const userRes = await client.query(
          'INSERT INTO users (name, email, phone, password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name.trim(), '', phoneNumber, '', userType]
        );
        const newUserId = userRes.rows[0].id;

        // Create passenger or driver profile
        if (userType === 'passenger') {
          await client.query(
            'INSERT INTO passengers (user_id) VALUES ($1)',
            [newUserId]
          );
        } else if (userType === 'driver') {
          await client.query(
            'INSERT INTO drivers (user_id, vehicle_type, license_plate, license_number) VALUES ($1, $2, $3, $4)',
            [
              newUserId,
              vehicleType || 'Car',
              licensePlate || 'TEMP_' + Date.now(),
              'TEMP_' + Date.now()
            ]
          );
        }

        return newUserId;
      });

      userId = result;
      isNewUser = true;
    } else {
      userId = userResult.rows[0].id;
      userType = userResult.rows[0].user_type;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, phoneNumber, userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Get user profile
    let profile = null;
    if (userType === 'passenger') {
      const profileResult = await query(
        'SELECT * FROM passengers WHERE user_id = $1',
        [userId]
      );
      profile = profileResult.rows[0];
    } else if (userType === 'driver') {
      const profileResult = await query(`
        SELECT d.*, v.make, v.model, v.year, v.color, v.license_plate, v.vehicle_type
        FROM drivers d
        LEFT JOIN vehicles v ON d.vehicle_id = v.id
        WHERE d.user_id = $1
      `, [userId]);
      profile = profileResult.rows[0];
    }

    res.json({
      success: true,
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      isNewUser,
      token,
      user: {
        id: userId,
        phoneNumber,
        userType,
        profile,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Alternative login method (for testing)
 */
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        error: 'Missing phone number',
        message: 'Phone number is required',
      });
    }

    // Get user
    const userResult = await query(
      'SELECT id, user_type FROM users WHERE phone = $1',
      [phoneNumber]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No account found with this phone number',
      });
    }

    const user = userResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phoneNumber, userType: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Get user profile
    let profile = null;
    if (user.user_type === 'passenger') {
      const profileResult = await query(
        'SELECT * FROM passengers WHERE user_id = $1',
        [user.id]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'driver') {
      const profileResult = await query(`
        SELECT d.*, v.make, v.model, v.year, v.color, v.license_plate, v.vehicle_type
        FROM drivers d
        LEFT JOIN vehicles v ON d.vehicle_id = v.id
        WHERE d.user_id = $1
      `, [user.id]);
      profile = profileResult.rows[0];
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phoneNumber,
        userType: user.user_type,
        profile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const userResult = await query(
      'SELECT id, phone, user_type FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Get profile
    let profile = null;
    if (user.user_type === 'passenger') {
      const profileResult = await query(
        'SELECT * FROM passengers WHERE user_id = $1',
        [user.id]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'driver') {
      const profileResult = await query(`
        SELECT d.*, v.make, v.model, v.year, v.color, v.license_plate, v.vehicle_type
        FROM drivers d
        LEFT JOIN vehicles v ON d.vehicle_id = v.id
        WHERE d.user_id = $1
      `, [user.id]);
      profile = profileResult.rows[0];
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        phoneNumber: user.phone,
        userType: user.user_type,
        profile,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
    });
  }
});

module.exports = router;
