/**
 * Run Run Backend - Red Zone Detection and Surge Pricing
 * RED ZONES = Areas with BAD ROAD CONDITIONS in Guinea-Bissau
 * Automatically adds 30% to fare when pickup/dropoff is in a red zone
 * This compensates drivers for difficult driving conditions (unpaved roads, potholes, etc.)
 * Developer: Edivaldo Cardoso
 */

// Define red zones in Guinea-Bissau (areas with poor/unpaved road conditions)
// These areas have challenging driving conditions requiring extra compensation for drivers
const RED_ZONES = [
  {
    name: 'Bissaquel',
    latitude: 11.8823,
    longitude: -15.6145,
    radius: 2.0, // 2km radius - known for unpaved roads
    surgeMultiplier: 1.3, // 30% increase
    roadCondition: 'unpaved',
  },
  {
    name: 'Bairro de Antula',
    latitude: 11.8745,
    longitude: -15.6121,
    radius: 1.5, // 1.5km radius - poor road conditions
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Bairro de Pluba',
    latitude: 11.8523,
    longitude: -15.5712,
    radius: 1.5, // 1.5km radius - damaged roads
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Bairro Militär',
    latitude: 11.8612,
    longitude: -15.6089,
    radius: 1.0, // 1km radius - poor infrastructure
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Quelele',
    latitude: 11.8456,
    longitude: -15.5623,
    radius: 1.5, // 1.5km radius - unpaved roads
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Bairro Ajuda',
    latitude: 11.8534,
    longitude: -15.6012,
    radius: 1.2, // 1.2km radius - poor road maintenance
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Safim',
    latitude: 11.8389,
    longitude: -15.5889,
    radius: 1.8, // 1.8km radius - damaged infrastructure
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Bairro de Penha',
    latitude: 11.8667,
    longitude: -15.5834,
    radius: 1.0, // 1km radius - unpaved sections
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
 * Check if a location is in a red zone
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {object|null} Red zone object or null
 */
function isInRedZone(latitude, longitude) {
  for (const zone of RED_ZONES) {
    const distance = calculateDistance(
      latitude,
      longitude,
      zone.latitude,
      zone.longitude
    );

    if (distance <= zone.radius) {
      return zone;
    }
  }
  return null;
}

/**
 * Calculate surge multiplier based on pickup and dropoff locations
 * Returns 1.3 if either location is in a red zone (bad road conditions), otherwise 1.0
 * @param {number} pickupLat - Pickup latitude
 * @param {number} pickupLon - Pickup longitude
 * @param {number} dropoffLat - Dropoff latitude
 * @param {number} dropoffLon - Dropoff longitude
 * @returns {object} Surge multiplier details
 */
function calculateRedZoneSurge(pickupLat, pickupLon, dropoffLat, dropoffLon) {
  // Check if pickup location is in red zone
  const pickupRedZone = isInRedZone(pickupLat, pickupLon);
  if (pickupRedZone) {
    return {
      multiplier: pickupRedZone.surgeMultiplier,
      reason: `Pickup in area with poor road conditions: ${pickupRedZone.name}`,
      redZoneName: pickupRedZone.name,
      roadCondition: pickupRedZone.roadCondition,
      isRedZone: true,
    };
  }

  // Check if dropoff location is in red zone
  const dropoffRedZone = isInRedZone(dropoffLat, dropoffLon);
  if (dropoffRedZone) {
    return {
      multiplier: dropoffRedZone.surgeMultiplier,
      reason: `Dropoff in area with poor road conditions: ${dropoffRedZone.name}`,
      redZoneName: dropoffRedZone.name,
      roadCondition: dropoffRedZone.roadCondition,
      isRedZone: true,
    };
  }

  return {
    multiplier: 1.0,
    reason: 'Standard pricing - good road conditions',
    isRedZone: false,
  };
}

/**
 * Apply surge pricing to a base fare
 * @param {number} baseFare - Base fare amount
 * @param {number} pickupLat - Pickup latitude
 * @param {number} pickupLon - Pickup longitude
 * @param {number} dropoffLat - Dropoff latitude
 * @param {number} dropoffLon - Dropoff longitude
 * @returns {object} Pricing breakdown with surge
 */
function applySurgePricing(baseFare, pickupLat, pickupLon, dropoffLat, dropoffLon) {
  const surge = calculateRedZoneSurge(pickupLat, pickupLon, dropoffLat, dropoffLon);
  const surgeFare = Math.round(baseFare * surge.multiplier);
  const surgeAmount = surgeFare - baseFare;

  return {
    originalFare: baseFare,
    surgeFare,
    surgeAmount,
    multiplier: surge.multiplier,
    reason: surge.reason,
    redZoneName: surge.redZoneName,
    roadCondition: surge.roadCondition,
    isRedZone: surge.isRedZone,
  };
}

/**
 * Get all red zones
 * @returns {array} Array of red zone objects
 */
function getAllRedZones() {
  return RED_ZONES;
}

module.exports = {
  isInRedZone,
  calculateRedZoneSurge,
  applySurgePricing,
  getAllRedZones,
  RED_ZONES,
};
