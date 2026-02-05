/**
 * Run Run Backend - Red Zone Detection and Surge Pricing
 * RED ZONES = Areas with BAD ROAD CONDITIONS in Guinea-Bissau
 * Automatically adds 30% to fare when pickup/dropoff is in a red zone
 * This compensates drivers for difficult driving conditions (unpaved roads, potholes, etc.)
 * Developer: Edivaldo Cardoso
 */

// Define red zones in Guinea-Bissau (areas with poor/unpaved road conditions)
// These areas have challenging driving conditions requiring extra compensation for drivers
// Covers entire country - all major cities, towns, and rural areas with bad roads
const RED_ZONES = [
  // ==================== BISSAU REGION ====================
  // Capital city and surrounding neighborhoods with poor infrastructure
  {
    name: 'Bissaquel',
    latitude: 11.8823,
    longitude: -15.6145,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Bairro de Antula',
    latitude: 11.8745,
    longitude: -15.6121,
    radius: 1.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Bairro de Pluba',
    latitude: 11.8523,
    longitude: -15.5712,
    radius: 1.5,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Bairro Militär',
    latitude: 11.8612,
    longitude: -15.6089,
    radius: 1.0,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Quelele',
    latitude: 11.8456,
    longitude: -15.5623,
    radius: 1.5,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Bairro Ajuda',
    latitude: 11.8534,
    longitude: -15.6012,
    radius: 1.2,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Safim',
    latitude: 11.8389,
    longitude: -15.5889,
    radius: 1.8,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Bairro de Penha',
    latitude: 11.8667,
    longitude: -15.5834,
    radius: 1.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Bairro Belém',
    latitude: 11.8790,
    longitude: -15.6023,
    radius: 1.3,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Bairro Cupilom',
    latitude: 11.8689,
    longitude: -15.5945,
    radius: 1.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Cuntum Madina',
    latitude: 11.8650,
    longitude: -15.5978,
    radius: 1.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },

  // ==================== CACHEU REGION ====================
  // Northern region - mostly rural with unpaved roads
  {
    name: 'Cacheu City',
    latitude: 12.2758,
    longitude: -16.1664,
    radius: 3.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Canchungo',
    latitude: 12.0686,
    longitude: -16.0383,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'São Domingos',
    latitude: 12.4703,
    longitude: -16.2303,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Bigene',
    latitude: 12.2167,
    longitude: -16.2333,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },

  // ==================== BIOMBO REGION ====================
  // Suburban areas around Bissau
  {
    name: 'Quinhamel',
    latitude: 11.8897,
    longitude: -15.8578,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Prabis',
    latitude: 11.8167,
    longitude: -15.7000,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Safim Biombo',
    latitude: 11.8500,
    longitude: -15.6500,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },

  // ==================== OÏO REGION ====================
  // Central-eastern region
  {
    name: 'Farim',
    latitude: 12.4897,
    longitude: -15.2197,
    radius: 3.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Mansôa',
    latitude: 12.0667,
    longitude: -15.2833,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Bissorã',
    latitude: 12.2231,
    longitude: -15.5972,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Nhacra',
    latitude: 11.9833,
    longitude: -15.5667,
    radius: 1.5,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },

  // ==================== BAFATÁ REGION ====================
  // Eastern interior region - mostly rural
  {
    name: 'Bafatá City',
    latitude: 12.1686,
    longitude: -14.6583,
    radius: 3.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Contuboel',
    latitude: 12.3500,
    longitude: -14.9167,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Gamamundo',
    latitude: 12.0667,
    longitude: -14.8000,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Bambadinca',
    latitude: 12.0333,
    longitude: -14.9667,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },

  // ==================== GABÚ REGION ====================
  // Eastern border region - remote with poor roads
  {
    name: 'Gabú City',
    latitude: 12.2833,
    longitude: -14.2167,
    radius: 4.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Pirada',
    latitude: 12.4333,
    longitude: -14.4167,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Sonaco',
    latitude: 12.1500,
    longitude: -14.4500,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },

  // ==================== QUINARA REGION ====================
  // South-central region
  {
    name: 'Fulacunda',
    latitude: 11.7833,
    longitude: -15.1833,
    radius: 3.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Buba',
    latitude: 11.5897,
    longitude: -14.9919,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Empada',
    latitude: 11.6667,
    longitude: -15.4500,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },

  // ==================== TOMBALI REGION ====================
  // Southern coastal region
  {
    name: 'Catió',
    latitude: 11.2833,
    longitude: -15.2500,
    radius: 3.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Quebo',
    latitude: 11.3333,
    longitude: -14.9333,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },
  {
    name: 'Bedanda',
    latitude: 11.4167,
    longitude: -15.1833,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },

  // ==================== BOLAMA/BIJAGÓS REGION ====================
  // Island archipelago - limited infrastructure
  {
    name: 'Bolama Island',
    latitude: 11.5767,
    longitude: -15.4758,
    radius: 2.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Bubaque Island',
    latitude: 11.2833,
    longitude: -15.8333,
    radius: 2.5,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
  },

  // ==================== ADDITIONAL HIGH-RISK AREAS ====================
  // Rural connectors and known problem areas across the country
  {
    name: 'Rural Bissau-Bafatá Road',
    latitude: 12.0000,
    longitude: -15.2000,
    radius: 5.0,
    surgeMultiplier: 1.3,
    roadCondition: 'unpaved',
  },
  {
    name: 'Rural Gabú-Bafatá Road',
    latitude: 12.2000,
    longitude: -14.5000,
    radius: 5.0,
    surgeMultiplier: 1.3,
    roadCondition: 'damaged',
  },
  {
    name: 'Southern Coastal Route',
    latitude: 11.4000,
    longitude: -15.0000,
    radius: 5.0,
    surgeMultiplier: 1.3,
    roadCondition: 'poor',
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
  let closestZone = null;
  let closestDistance = Infinity;

  for (const zone of RED_ZONES) {
    const distance = calculateDistance(
      latitude,
      longitude,
      zone.latitude,
      zone.longitude
    );

    // Check if location is within zone radius AND it's closer than previous closest
    if (distance <= zone.radius && distance < closestDistance) {
      closestZone = zone;
      closestDistance = distance;
    }
  }

  return closestZone;
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
