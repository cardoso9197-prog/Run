/**
 * Run Run - Authentication Middleware
 * JWT token verification and user authentication
 * Developer: Edivaldo Cardoso
 */

const jwt = require('jsonwebtoken');
const { query } = require('../database/db');

/**
 * Verify JWT token and attach user to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const result = await query(
      'SELECT id, phone, user_type FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found',
      });
    }

    // Attach user to request
    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Token expired',
      });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: error.message,
    });
  }
};

/**
 * Check if user is a driver
 */
const requireDriver = async (req, res, next) => {
  if (req.user.user_type !== 'driver') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'This endpoint requires driver role',
    });
  }
  next();
};

/**
 * Check if user is a passenger
 */
const requirePassenger = async (req, res, next) => {
  if (req.user.user_type !== 'passenger') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'This endpoint requires passenger role',
    });
  }
  next();
};

/**
 * Check if user is an admin
 */
const requireAdmin = async (req, res, next) => {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'This endpoint requires admin role',
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireDriver,
  requirePassenger,
  requireAdmin,
};

/**
 * Check if user has one of the required roles
 */
/**
 * Check if user has one of the required roles
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireDriver,
  requirePassenger,
  requireAdmin,
  requireRole,
};
