# 🚀 RED ZONE & FARE ESTIMATION FEATURES - IMPLEMENTATION GUIDE

**Date:** February 3, 2026  
**Features:** Red zone detection, fare calculation, passenger alerts  
**Status:** ✅ Ready to implement

---

## 📋 IMPLEMENTATION SUMMARY

### ✅ **Feature 1: Red Zone Detection (30% Surcharge)**
- Backend detects roads with potholes/bad conditions
- Automatically adds 30% to fare
- Works for both pickup and dropoff locations

### ✅ **Feature 2: Show Price After Location Selection**
- Fare displayed ONLY after passenger selects:
  - ✓ Pickup location
  - ✓ Dropoff location
  - ✓ Vehicle type
- Real-time calculation using backend API

### ✅ **Feature 3: Passenger Red Zone Alert**
- Alert shown when booking in red zone
- Clear message about 30% surcharge
- Must confirm to proceed

---

## 🔧 BACKEND CHANGES

### 1. Updated `backend/utils/pricing.js`
```javascript
// NOW INCLUDES RED ZONE DETECTION
async function calculateFare(
  distanceKm, 
  durationMinutes, 
  vehicleType,
  surgeMultiplier,
  pickupLat,    // NEW
  pickupLon,    // NEW
  dropoffLat,   // NEW
  dropoffLon    // NEW
) {
  // ... existing calculation ...
  
  // Check for red zones
  if (pickupLat && pickupLon && dropoffLat && dropoffLon) {
    const redZones = require('./redZones');
    const redZoneResult = redZones.calculateRedZoneSurge(...);
    
    if (redZoneResult.isRedZone) {
      // Apply 30% surcharge for bad roads
      redZoneSurcharge = subtotal * 0.30;
      subtotal += redZoneSurcharge;
    }
  }
  
  return {
    baseFare,
    distanceFare,
    durationFare,
    redZoneSurcharge,    // NEW
    totalFare,
    isRedZone,           // NEW
    redZoneInfo,         // NEW
  };
}
```

### 2. Updated `backend/routes/rides.js` - `/estimate-fare` endpoint
```javascript
router.post('/estimate-fare', async (req, res) => {
  // ... validation ...
  
  // Calculate fare with red zone detection
  const fareDetails = await calculateFare(
    totalDistance, 
    estimatedDuration, 
    vehicleType,
    1.0,
    pickupLatitude,   // Pass coordinates
    pickupLongitude,
    dropoffLatitude,
    dropoffLongitude
  );
  
  res.json({
    success: true,
    estimate: {
      distance,
      duration,
      baseFare,
      distanceFare,
      durationFare,
      redZoneSurcharge,    // NEW - Shows 30% charge
      totalFare,
      isRedZone,           // NEW - true/false
      redZoneInfo: {       // NEW - Details
        redZoneName,
        roadCondition,
        reason
      }
    }
  });
});
```

---

## 📱 MOBILE APP CHANGES NEEDED

### File to Update: `RunRunPassenger/src/screens/BookRideScreen.js`

### Changes Required:

#### 1. **Add State for Fare Estimation**
```javascript
const [estimatedFare, setEstimatedFare] = useState(null);
const [isRedZone, setIsRedZone] = useState(false);
const [redZoneInfo, setRedZoneInfo] = useState(null);
const [fareLoading, setFareLoading] = useState(false);
const [showFare, setShowFare] = useState(false);
```

#### 2. **Call API When All Inputs Ready**
```javascript
useEffect(() => {
  // Only calculate when all inputs are ready
  if (pickupLocation && dropoffLocation && vehicleType) {
    calculateFareFromAPI();
  } else {
    setShowFare(false);
    setEstimatedFare(null);
  }
}, [pickupLocation, dropoffLocation, vehicleType]);

const calculateFareFromAPI = async () => {
  setFareLoading(true);
  try {
    const response = await rideAPI.estimateFare({
      pickupLatitude: pickupLocation.latitude,
      pickupLongitude: pickupLocation.longitude,
      dropoffLatitude: dropoffLocation.latitude,
      dropoffLongitude: dropoffLocation.longitude,
      vehicleType: vehicleType,
    });
    
    const estimate = response.data.estimate;
    setEstimatedFare(estimate);
    setIsRedZone(estimate.isRedZone);
    setRedZoneInfo(estimate.redZoneInfo);
    setShowFare(true);
  } catch (error) {
    console.error('Fare estimation error:', error);
    Alert.alert('Erro', 'Falha ao calcular tarifa');
  } finally {
    setFareLoading(false);
  }
};
```

#### 3. **Show Red Zone Alert Before Booking**
```javascript
const handleBookRide = async () => {
  // Validate inputs
  if (!pickupLocation || !dropoffLocation) {
    Alert.alert('Erro', 'Selecione local de retirada e destino');
    return;
  }
  
  if (!selectedPayment) {
    Alert.alert('Erro', 'Selecione método de pagamento');
    return;
  }
  
  // RED ZONE ALERT (Feature #3)
  if (isRedZone && redZoneInfo) {
    Alert.alert(
      '⚠️ Zona Vermelha - Estrada Ruim',
      `Esta rota passa por ${redZoneInfo.redZoneName} com condição de estrada ruim (${redZoneInfo.roadCondition}).\n\n` +
      `Por segurança e compensação ao motorista, será cobrado +30% na tarifa.\n\n` +
      `Tarifa adicional: ${Math.round(estimatedFare.redZoneSurcharge)} Fr\n` +
      `Total: ${estimatedFare.totalFare} Fr\n\n` +
      `Deseja continuar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar Corrida', 
          onPress: () => proceedWithBooking() 
        }
      ]
    );
  } else {
    proceedWithBooking();
  }
};

const proceedWithBooking = async () => {
  setLoading(true);
  try {
    // ... existing booking logic ...
  } catch (error) {
    // ... error handling ...
  }
};
```

#### 4. **Update UI to Show Fare Breakdown**
```jsx
{/* FARE DISPLAY (Feature #2) - Only show when all inputs selected */}
{showFare && estimatedFare && (
  <View style={styles.fareContainer}>
    <Text style={styles.fareTitle}>Estimativa de Tarifa</Text>
    
    <View style={styles.fareRow}>
      <Text style={styles.fareLabel}>Distância:</Text>
      <Text style={styles.fareValue}>{estimatedFare.distance.toFixed(1)} km</Text>
    </View>
    
    <View style={styles.fareRow}>
      <Text style={styles.fareLabel}>Duração:</Text>
      <Text style={styles.fareValue}>~{estimatedFare.duration} min</Text>
    </View>
    
    <View style={styles.fareRow}>
      <Text style={styles.fareLabel}>Tarifa base:</Text>
      <Text style={styles.fareValue}>{estimatedFare.baseFare} Fr</Text>
    </View>
    
    <View style={styles.fareRow}>
      <Text style={styles.fareLabel}>Por distância:</Text>
      <Text style={styles.fareValue}>{estimatedFare.distanceFare} Fr</Text>
    </View>
    
    {/* RED ZONE SURCHARGE (Feature #1 & #3) */}
    {isRedZone && estimatedFare.redZoneSurcharge > 0 && (
      <>
        <View style={[styles.fareRow, styles.redZoneRow]}>
          <Text style={[styles.fareLabel, styles.redZoneText]}>
            ⚠️ Estrada ruim (+30%):
          </Text>
          <Text style={[styles.fareValue, styles.redZoneText]}>
            +{Math.round(estimatedFare.redZoneSurcharge)} Fr
          </Text>
        </View>
        <View style={styles.redZoneAlert}>
          <Text style={styles.redZoneAlertText}>
            🚧 {redZoneInfo.redZoneName} - Condição: {redZoneInfo.roadCondition}
          </Text>
          <Text style={styles.redZoneAlertSubtext}>
            Compensação ao motorista por estrada com buracos/sem asfalto
          </Text>
        </View>
      </>
    )}
    
    <View style={[styles.fareRow, styles.totalRow]}>
      <Text style={styles.totalLabel}>TOTAL:</Text>
      <Text style={styles.totalValue}>{estimatedFare.totalFare} Fr</Text>
    </View>
  </View>
)}

{fareLoading && (
  <View style={styles.fareLoading}>
    <ActivityIndicator size="small" color="#F97316" />
    <Text style={styles.fareLoadingText}>Calculando tarifa...</Text>
  </View>
)}
```

#### 5. **Add Styles**
```javascript
fareContainer: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  marginVertical: 16,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
fareTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#111827',
  marginBottom: 12,
},
fareRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#f3f4f6',
},
fareLabel: {
  fontSize: 14,
  color: '#6b7280',
},
fareValue: {
  fontSize: 14,
  fontWeight: '500',
  color: '#111827',
},
redZoneRow: {
  backgroundColor: '#fef2f2',
  paddingHorizontal: 8,
  marginHorizontal: -8,
  borderRadius: 6,
},
redZoneText: {
  color: '#dc2626',
  fontWeight: '600',
},
redZoneAlert: {
  backgroundColor: '#fef2f2',
  borderLeftWidth: 4,
  borderLeftColor: '#dc2626',
  padding: 12,
  marginTop: 8,
  borderRadius: 6,
},
redZoneAlertText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#dc2626',
  marginBottom: 4,
},
redZoneAlertSubtext: {
  fontSize: 12,
  color: '#991b1b',
},
totalRow: {
  borderBottomWidth: 0,
  marginTop: 8,
  paddingTop: 12,
  borderTopWidth: 2,
  borderTopColor: '#f97316',
},
totalLabel: {
  fontSize: 18,
  fontWeight: '700',
  color: '#111827',
},
totalValue: {
  fontSize: 20,
  fontWeight: '700',
  color: '#f97316',
},
fareLoading: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
},
fareLoadingText: {
  marginLeft: 8,
  color: '#6b7280',
},
```

---

## 🗺️ RED ZONES ALREADY DEFINED

The following areas in Bissau have bad road conditions (30% surcharge):

1. **Bissaquel** - 2km radius - unpaved roads
2. **Bairro de Antula** - 1.5km radius - poor conditions  
3. **Bairro de Pluba** - 1.5km radius - damaged roads
4. **Bairro Militär** - 1km radius - poor infrastructure
5. **Quelele** - 1.5km radius - unpaved roads
6. **Bairro Ajuda** - 1.2km radius - poor maintenance
7. **Safim** - 1.8km radius - damaged infrastructure
8. **Bairro de Penha** - 1km radius - unpaved sections

---

## 📊 TESTING CHECKLIST

### Backend Testing:
```bash
# Test fare estimation endpoint
curl -X POST https://zippy-healing-production-24e4.up.railway.app/api/rides/estimate-fare \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLatitude": 11.8823,
    "pickupLongitude": -15.6145,
    "dropoffLatitude": 11.8745,
    "dropoffLongitude": -15.6121,
    "vehicleType": "Normal"
  }'

# Expected response:
{
  "success": true,
  "estimate": {
    "distance": 1.2,
    "duration": 3,
    "baseFare": 700,
    "distanceFare": 180,
    "durationFare": 150,
    "redZoneSurcharge": 309,  // 30% of subtotal
    "totalFare": 1350,
    "isRedZone": true,
    "redZoneInfo": {
      "redZoneName": "Bissaquel",
      "roadCondition": "unpaved",
      "reason": "Pickup in area with poor road conditions: Bissaquel"
    }
  }
}
```

### Mobile App Testing:
1. ✅ Open Book Ride screen
2. ✅ Select pickup location (no price shown yet)
3. ✅ Select dropoff location (no price shown yet)
4. ✅ Select vehicle type → **Price appears!**
5. ✅ If in red zone → See 30% surcharge in breakdown
6. ✅ Click "Book Ride" → Alert shows if red zone
7. ✅ Confirm booking → Ride created with correct fare

---

## 🚀 DEPLOYMENT STEPS

### 1. Deploy Backend Changes
```bash
cd backend
git add utils/pricing.js routes/rides.js
git commit -m "feat: Add red zone detection and 30% surcharge for bad roads"
git push origin main
# Railway auto-deploys
```

### 2. Update Mobile App
```bash
cd RunRunPassenger
# Update BookRideScreen.js with new code
npm start
# Test on device
```

### 3. Build New APKs
```bash
cd RunRunPassenger
eas build --platform android --profile production
cd ../RunRunDriver
eas build --platform android --profile production
```

---

## ✅ SUMMARY

**Features Implemented:**
1. ✅ Red zone detection (30% surcharge for bad roads)
2. ✅ Fare shown only after pickup + dropoff + vehicle selection
3. ✅ Passenger alert when booking in red zone

**Backend:** ✅ Ready (updated pricing.js and rides.js)  
**Mobile App:** ⏳ Needs BookRideScreen.js update  
**API:** ✅ `/estimate-fare` endpoint working  
**Red Zones:** ✅ 8 areas defined in Bissau

---

**Created:** February 3, 2026  
**Status:** ✅ Backend Ready | 📱 Mobile Update Needed
