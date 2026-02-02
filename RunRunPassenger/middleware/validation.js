/**
 * Run Run - Request Validation Middleware
 * Validates request data before processing
 * Developer: Edivaldo Cardoso
 */

/**
 * Validate phone number format
 */
const validatePhoneNumber = (phoneNumber) => {
  // Guinea-Bissau phone numbers: +245 XXX XXX XXX
  const regex = /^\+245[0-9]{9}$/;
  return regex.test(phoneNumber);
};

/**
 * Validate ride request data
 */
const validateRideRequest = (req, res, next) => {
  const {
    pickupLatitude,
    pickupLongitude,
    pickupAddress,
    dropoffLatitude,
    dropoffLongitude,
    dropoffAddress,
    vehicleType,
  } = req.body;

  const errors = [];

  if (!pickupLatitude || typeof pickupLatitude !== 'number') {
    errors.push('Valid pickup latitude is required');
  }
  if (!pickupLongitude || typeof pickupLongitude !== 'number') {
    errors.push('Valid pickup longitude is required');
  }
  if (!pickupAddress || typeof pickupAddress !== 'string') {
    errors.push('Pickup address is required');
  }
  if (!dropoffLatitude || typeof dropoffLatitude !== 'number') {
    errors.push('Valid dropoff latitude is required');
  }
  if (!dropoffLongitude || typeof dropoffLongitude !== 'number') {
    errors.push('Valid dropoff longitude is required');
  }
  if (!dropoffAddress || typeof dropoffAddress !== 'string') {
    errors.push('Dropoff address is required');
  }
  if (!vehicleType || !['RunRun', 'Moto', 'Comfort', 'XL'].includes(vehicleType)) {
    errors.push('Valid vehicle type is required (RunRun, Moto, Comfort, XL)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validate payment data
 */
const validatePayment = (req, res, next) => {
  const { rideId, paymentMethod } = req.body;

  const errors = [];

  if (!rideId || typeof rideId !== 'number') {
    errors.push('Valid ride ID is required');
  }
  if (!paymentMethod || !['card', 'orange_money', 'mtn_momo'].includes(paymentMethod)) {
    errors.push('Valid payment method is required (card, orange_money, mtn_momo)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validate rating data
 */
const validateRating = (req, res, next) => {
  const { rideId, rating, comment } = req.body;

  const errors = [];

  if (!rideId || typeof rideId !== 'number') {
    errors.push('Valid ride ID is required');
  }
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    errors.push('Rating must be a number between 1 and 5');
  }
  if (comment && typeof comment !== 'string') {
    errors.push('Comment must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validate driver registration data
 */
const validateDriverRegistration = (req, res, next) => {
  const {
    phoneNumber,
    name,
    email,
    licenseNumber,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleColor,
    licensePlate,
    vehicleType,
  } = req.body;

  const errors = [];

  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    errors.push('Valid phone number is required (+245XXXXXXXXX)');
  }
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Valid name is required (min 2 characters)');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email address is required');
  }
  if (!licenseNumber || typeof licenseNumber !== 'string') {
    errors.push('License number is required');
  }
  if (!vehicleMake || typeof vehicleMake !== 'string') {
    errors.push('Vehicle make is required');
  }
  if (!vehicleModel || typeof vehicleModel !== 'string') {
    errors.push('Vehicle model is required');
  }
  if (!vehicleYear || typeof vehicleYear !== 'number' || vehicleYear < 1990 || vehicleYear > new Date().getFullYear() + 1) {
    errors.push('Valid vehicle year is required');
  }
  if (!vehicleColor || typeof vehicleColor !== 'string') {
    errors.push('Vehicle color is required');
  }
  if (!licensePlate || typeof licensePlate !== 'string') {
    errors.push('License plate is required');
  }
  if (!vehicleType || !['RunRun', 'Moto', 'Comfort', 'XL'].includes(vehicleType)) {
    errors.push('Valid vehicle type is required (RunRun, Moto, Comfort, XL)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validatePhoneNumber,
  validateRideRequest,
  validatePayment,
  validateRating,
  validateDriverRegistration,
};
