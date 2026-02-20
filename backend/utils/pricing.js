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
 * Calculate fare for a ride with airport special pricing
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} durationMinutes - Duration in minutes
 * @param {string} vehicleType - Type of vehicle (Moto, Normal, Premium)
 * @param {number} surgeMultiplier - Surge pricing multiplier (default 1.0)
 * @param {number} pickupLat - Pickup latitude
 * @param {number} pickupLon - Pickup longitude
 * @param {number} dropoffLat - Dropoff latitude
 * @param {number} dropoffLon - Dropoff longitude
 * @param {boolean} isAirportInside - Whether pickup/dropoff is inside airport terminal
 * @returns {object} Fare breakdown with components and total
 */
async function calculateFare(distanceKm, durationMinutes, vehicleType, surgeMultiplier = 1.0, pickupLat = null, pickupLon = null, dropoffLat = null, dropoffLon = null, isAirportInside = false) {
  // Airport Osvaldo Vieira coordinates (approximate terminal location)
  const AIRPORT_LAT = 11.8948;
  const AIRPORT_LON = -15.6537;
  const AIRPORT_RADIUS = 1.0; // 1km radius to detect airport area
  
  // Check if either pickup or dropoff is at the airport
  let isAirportTrip = false;
  let airportDetected = false;
  
  if (pickupLat && pickupLon && dropoffLat && dropoffLon) {
    const pickupToAirport = calculateDistance(pickupLat, pickupLon, AIRPORT_LAT, AIRPORT_LON);
    const dropoffToAirport = calculateDistance(dropoffLat, dropoffLon, AIRPORT_LAT, AIRPORT_LON);
    
    console.log('🛫 AIRPORT FARE DEBUG:', {
      pickupCoords: `${pickupLat}, ${pickupLon}`,
      dropoffCoords: `${dropoffLat}, ${dropoffLon}`,
      pickupToAirport: `${pickupToAirport.toFixed(3)} km`,
      dropoffToAirport: `${dropoffToAirport.toFixed(3)} km`,
      airportRadius: `${AIRPORT_RADIUS} km`,
      isAirportInside: isAirportInside,
      typeof_isAirportInside: typeof isAirportInside
    });
    
    if (pickupToAirport <= AIRPORT_RADIUS || dropoffToAirport <= AIRPORT_RADIUS) {
      airportDetected = true;
      isAirportTrip = isAirportInside === true;
      console.log('✅ AIRPORT DETECTED:', { airportDetected, isAirportTrip, isAirportInside });
    } else {
      console.log('❌ NOT NEAR AIRPORT');
    }
  } else {
    console.log('⚠️ MISSING COORDINATES:', { pickupLat, pickupLon, dropoffLat, dropoffLon });
  }
  
  // ─── PRICING CONFIG ───────────────────────────────────────────────────────
  //  Each vehicle type has:
  //    minimumFare  – charged even for very short trips
  //    baseFare     – fixed flag-fall on every ride
  //    perKmRate    – charged per km AFTER the included base km
  //    includedKm   – km already covered by the baseFare (no extra charge)
  //
  //  Formula (normal ride):
  //    fare = baseFare + max(0, distanceKm - includedKm) * perKmRate
  //    fare = max(fare, minimumFare)
  //    fare = rounded to nearest 50 XOF
  // ──────────────────────────────────────────────────────────────────────────
  const PRICING = {
    Moto:    { minimumFare: 500,  baseFare: 350, perKmRate: 150, includedKm: 1.0 },
    Normal:  { minimumFare: 1200, baseFare: 800, perKmRate: 338, includedKm: 1.0 },
    Premium: { minimumFare: 2000, baseFare: 1300, perKmRate: 650, includedKm: 1.0 },
  };

  const config = PRICING[vehicleType] || PRICING.Normal;
  const perKmRate = config.perKmRate;

  // Airport inside terminal flat rate (to/from any zone in Bissau)
  const AIRPORT_FLAT_RATE = 5600; // 5600 XOF fixed price

  let totalFare = 0;
  let baseFare = 0;
  let distanceFare = 0;
  let isAirportFlatRate = false;

  console.log('💰 FARE CALCULATION:', {
    distanceKm,
    vehicleType,
    config,
    isAirportTrip,
    isAirportInside,
    airportDetected
  });

  // If airport trip with inside terminal selected, use flat rate
  if (isAirportTrip) {
    totalFare = AIRPORT_FLAT_RATE;
    baseFare = AIRPORT_FLAT_RATE;
    distanceFare = 0;
    isAirportFlatRate = true;
    console.log('✈️ APPLYING AIRPORT FLAT RATE:', AIRPORT_FLAT_RATE, 'XOF');
  } else {
    // Normal pricing:
    //   baseFare covers the first `includedKm`
    //   extra km charged at perKmRate
    const extraKm = Math.max(0, distanceKm - config.includedKm);
    baseFare    = config.baseFare;
    distanceFare = extraKm * perKmRate;
    totalFare   = baseFare + distanceFare;

    // Apply minimum fare
    if (totalFare < config.minimumFare) {
      totalFare = config.minimumFare;
    }

    console.log('🚗 APPLYING NORMAL PRICING:', {
      baseFare, extraKm, distanceFare, totalFare,
      minimumApplied: (baseFare + distanceFare) < config.minimumFare
    });
  }

  // No surge pricing - keep fares simple and predictable
  const surgeFare = 0;

  // Round to nearest 50 XOF
  totalFare = Math.round(totalFare / 50) * 50;

  const fareResult = {
    baseFare: Math.round(baseFare),
    distanceFare: Math.round(distanceFare),
    durationFare: 0,
    surgeFare: Math.round(surgeFare),
    totalFare: Math.round(totalFare),
    surgeMultiplier,
    isAirportTrip,
    isAirportFlatRate,
    airportDetected,
    perKmRate,
    minimumFare: (PRICING[vehicleType] || PRICING.Normal).minimumFare,
  };
  
  console.log('📤 RETURNING FARE:', fareResult);
  
  return fareResult;
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
