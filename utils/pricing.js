/**
 * Run Run - Pricing Utilities
 * Calculate fares, distances, and durations
 * Developer: Edivaldo Cardoso
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(2));
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate fare for a ride
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} durationMinutes - Duration in minutes
 * @param {string} vehicleType - Type of vehicle (RunRun, Moto, Comfort, XL)
 * @param {number} surgeMultiplier - Surge pricing multiplier (default 1.0)
 * @returns {object} Fare breakdown with components and total
 */
async function calculateFare(distanceKm, durationMinutes, vehicleType, surgeMultiplier = 1.0) {
  // Base pricing from environment variables or defaults
  const baseFare = parseFloat(process.env.BASE_FARE) || 500;
  const perKmRate = parseFloat(process.env.PER_KM_RATE) || 200;
  const perMinuteRate = parseFloat(process.env.PER_MINUTE_RATE) || 50;
  const minimumFare = parseFloat(process.env.MINIMUM_FARE) || 1000;
  const bookingFee = parseFloat(process.env.BOOKING_FEE) || 200;

  // Vehicle type multipliers
  const multipliers = {
    RunRun: parseFloat(process.env.RUNRUN_MULTIPLIER) || 1.0,
    Moto: parseFloat(process.env.MOTO_MULTIPLIER) || 0.7,
    Comfort: parseFloat(process.env.COMFORT_MULTIPLIER) || 1.3,
    XL: parseFloat(process.env.XL_MULTIPLIER) || 1.5,
  };

  const vehicleMultiplier = multipliers[vehicleType] || 1.0;

  // Calculate fare components
  const distanceFare = distanceKm * perKmRate * vehicleMultiplier;
  const durationFare = durationMinutes * perMinuteRate * vehicleMultiplier;
  const adjustedBaseFare = (baseFare + bookingFee) * vehicleMultiplier;

  // Calculate subtotal
  let subtotal = adjustedBaseFare + distanceFare + durationFare;

  // Apply surge pricing
  const surgeFare = surgeMultiplier > 1.0 ? (subtotal * (surgeMultiplier - 1.0)) : 0;
  let totalFare = subtotal + surgeFare;

  // Ensure minimum fare
  totalFare = Math.max(totalFare, minimumFare);

  // Round to nearest 50 XOF
  totalFare = Math.round(totalFare / 50) * 50;

  return {
    baseFare: Math.round(adjustedBaseFare),
    distanceFare: Math.round(distanceFare),
    durationFare: Math.round(durationFare),
    surgeFare: Math.round(surgeFare),
    totalFare: Math.round(totalFare),
    surgeMultiplier,
  };
}

/**
 * Calculate estimated duration based on distance
 * Assumes average speed of 30 km/h in city traffic
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Estimated duration in minutes
 */
function calculateEstimatedDuration(distanceKm) {
  const averageSpeedKmH = 30; // Average city speed
  const durationHours = distanceKm / averageSpeedKmH;
  const durationMinutes = Math.ceil(durationHours * 60);
  return durationMinutes;
}

/**
 * Calculate driver earnings from fare
 * @param {number} fare - Total fare amount
 * @returns {object} Breakdown of earnings and commission
 */
function calculateEarnings(fare) {
  const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION) || 20;
  const platformCommission = (fare * commissionRate) / 100;
  const driverEarnings = fare - platformCommission;

  return {
    totalFare: fare,
    platformCommission: parseFloat(platformCommission.toFixed(2)),
    driverEarnings: parseFloat(driverEarnings.toFixed(2)),
    commissionRate,
  };
}

/**
 * Calculate surge multiplier based on demand
 * This is a simplified version - in production, this would use real-time data
 * @param {number} availableDrivers - Number of available drivers in area
 * @param {number} pendingRides - Number of pending ride requests
 * @returns {number} Surge multiplier (1.0 to 3.0)
 */
function calculateSurgeMultiplier(availableDrivers, pendingRides) {
  if (availableDrivers === 0) return 2.0;
  
  const demandRatio = pendingRides / availableDrivers;
  
  if (demandRatio > 3) return 2.5;
  if (demandRatio > 2) return 2.0;
  if (demandRatio > 1.5) return 1.5;
  if (demandRatio > 1) return 1.3;
  
  return 1.0;
}

/**
 * Format fare for display
 * @param {number} fare - Fare amount
 * @returns {string} Formatted fare (e.g., "2,500 Fr")
 */
function formatFare(fare) {
  return `${fare.toLocaleString('fr-FR')} Fr`;
}

module.exports = {
  calculateDistance,
  calculateFare,
  calculateEstimatedDuration,
  calculateEarnings,
  calculateSurgeMultiplier,
  formatFare,
};
