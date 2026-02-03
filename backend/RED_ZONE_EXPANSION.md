# Red Zone Detection - Nationwide Coverage

**Date:** February 3, 2026  
**Developer:** Edivaldo Cardoso  
**Feature:** Automatic Bad Road Detection Across All Guinea-Bissau

---

## 🎯 Update Summary

**BEFORE:** Red zone detection only worked in 8 locations in Bissau downtown  
**NOW:** Red zone detection covers **38+ locations** across **ALL 8 REGIONS** of Guinea-Bissau

---

## 📍 Geographic Coverage

### 1. **BISSAU REGION** (Capital) - 10 Zones
- Bissaquel (2km radius)
- Bairro de Antula (1.5km)
- Bairro de Pluba (1.5km)
- Bairro Militär (1km)
- Quelele (1.5km)
- Bairro Ajuda (1.2km)
- Safim (1.8km)
- Bairro de Penha (1km)
- Bairro Belém (1.3km)
- Bairro Cupilom (1km)

### 2. **CACHEU REGION** (Northern) - 4 Zones
- Cacheu City (3km)
- Canchungo (2.5km)
- São Domingos (2km)
- Bigene (2km)

### 3. **BIOMBO REGION** (Suburban) - 3 Zones
- Quinhamel (2.5km)
- Prabis (2km)
- Safim Biombo (2km)

### 4. **OÏO REGION** (Central-Eastern) - 4 Zones
- Farim (3km)
- Mansôa (2.5km)
- Bissorã (2km)
- Nhacra (1.5km)

### 5. **BAFATÁ REGION** (Eastern Interior) - 4 Zones
- Bafatá City (3.5km)
- Contuboel (2.5km)
- Gamamundo (2km)
- Bambadinca (2km)

### 6. **GABÚ REGION** (Eastern Border) - 3 Zones
- Gabú City (4km)
- Pirada (2.5km)
- Sonaco (2km)

### 7. **QUINARA REGION** (South-Central) - 3 Zones
- Fulacunda (3km)
- Buba (2.5km)
- Empada (2km)

### 8. **TOMBALI REGION** (Southern Coastal) - 3 Zones
- Catió (3km)
- Quebo (2.5km)
- Bedanda (2km)

### 9. **BOLAMA/BIJAGÓS REGION** (Islands) - 2 Zones
- Bolama Island (2km)
- Bubaque Island (2.5km)

### 10. **RURAL HIGHWAYS** - 3 Major Routes
- Rural Bissau-Bafatá Road (5km radius)
- Rural Gabú-Bafatá Road (5km radius)
- Southern Coastal Route (5km radius)

---

## 💰 How It Works

### Automatic Detection
When a passenger books a ride, the system automatically:

1. **Checks Pickup Location** - Is it in a red zone?
2. **Checks Dropoff Location** - Is it in a red zone?
3. **Applies 30% Surcharge** - If either location is in a red zone

### Road Conditions Detected
- **Unpaved Roads** - Dirt/gravel roads without asphalt
- **Poor Roads** - Badly maintained asphalt with damage
- **Damaged Roads** - Roads with potholes and severe deterioration

### Passenger Experience
- **Visual Alert** - Red banner shows "⚠️ Bad Road Conditions Detected"
- **Clear Explanation** - Shows which area has bad roads
- **Fare Breakdown** - Separates red zone surcharge in fare display
- **Confirmation Required** - Passenger must confirm booking before proceeding

### Driver Compensation
- Drivers receive **30% extra** for rides in red zones
- Compensates for:
  - Vehicle wear and tear
  - Slower driving speeds
  - Increased fuel consumption
  - Challenging driving conditions

---

## 🚀 Technical Implementation

### Backend Changes
**File:** `backend/utils/redZones.js`
- Expanded `RED_ZONES` array from 8 to 38+ locations
- Covers all administrative regions of Guinea-Bissau
- Each zone has precise GPS coordinates and radius

### Detection Algorithm
```javascript
// Haversine formula calculates distance from location to zone center
// If distance <= zone.radius, location is in red zone
// Returns 30% surcharge multiplier (1.3x)
```

### API Response
```json
{
  "estimatedFare": 6500,
  "baseFare": 1000,
  "distanceFare": 4000,
  "isRedZone": true,
  "redZoneLocations": ["Bafatá City"],
  "redZoneSurcharge": 1500,
  "estimatedDistance": 20
}
```

---

## 📱 Mobile App Integration

### Passenger App
- **File:** `RunRunPassenger/src/screens/BookRideScreen.js`
- Already configured to display red zone alerts
- Shows surcharge breakdown automatically
- Requires confirmation for red zone bookings

### Driver App
- Automatically receives higher fare
- No changes needed - backend handles calculation

---

## ✅ Testing Checklist

Test these locations to verify red zone detection:

**Bissau Region:**
- Pickup: 11.8823, -15.6145 (Bissaquel) ✓
- Dropoff: 11.8534, -15.6012 (Bairro Ajuda) ✓

**Eastern Region:**
- Pickup: 12.2833, -14.2167 (Gabú City) ✓
- Dropoff: 12.1686, -14.6583 (Bafatá City) ✓

**Southern Region:**
- Pickup: 11.2833, -15.2500 (Catió) ✓
- Dropoff: 11.5897, -14.9919 (Buba) ✓

**Islands:**
- Pickup: 11.5767, -15.4758 (Bolama Island) ✓
- Dropoff: 11.2833, -15.8333 (Bubaque Island) ✓

---

## 🔧 Next Steps

### To Deploy This Update:

1. **Deploy Backend to Railway**
   ```bash
   cd backend
   git push railway main
   ```

2. **Rebuild Mobile Apps** (Optional - no code changes needed)
   ```bash
   cd RunRunPassenger
   eas build --platform all --profile preview-device
   ```

3. **Test in Production**
   - Book rides in different regions
   - Verify 30% surcharge applies
   - Confirm passenger sees red zone alerts

---

## 📊 Expected Impact

### Coverage Improvement
- **Before:** 8 zones (only Bissau)
- **After:** 38+ zones (entire country)
- **Increase:** 475% more coverage

### Revenue Impact
- Drivers earn fair compensation for difficult roads
- Passengers understand why fare is higher
- Platform maintains transparency

### User Experience
- No more surprise charges
- Clear communication about road conditions
- Drivers motivated to serve rural areas

---

## 🎓 For Future Updates

### Adding More Red Zones
Edit `backend/utils/redZones.js` and add new entries:

```javascript
{
  name: 'New Area Name',
  latitude: 12.1234,      // GPS coordinates
  longitude: -15.5678,    // GPS coordinates
  radius: 2.0,            // Coverage radius in km
  surgeMultiplier: 1.3,   // 30% surcharge
  roadCondition: 'unpaved', // unpaved/poor/damaged
}
```

### Adjusting Surcharge Percentage
To change from 30% to another value:
- Edit `surgeMultiplier` (1.3 = 30%, 1.5 = 50%, etc.)
- Update passenger app alert text if needed

---

## ✨ Summary

**Feature:** Nationwide red zone detection  
**Status:** ✅ Complete and committed  
**Repository:** https://github.com/cardoso9197-prog/Run  
**Commit:** b5bb09a  

The mobile app will now automatically detect bad road conditions anywhere in Guinea-Bissau and apply the 30% surcharge fairly and transparently! 🚗💨
