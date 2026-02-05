# 🎯 Run Run Pricing System Update - February 5, 2026

## 📋 Summary of Changes

### 1. ✅ **Removed Red Zone Surcharge System**
- **Removed:** 30% surcharge for bad road conditions
- **Impact:** Simplified pricing, no more red zone detection
- **Files Updated:**
  - `backend/utils/pricing.js` - Removed red zone calculation logic
  - `backend/routes/rides.js` - Removed red zone response fields
  - `RunRunPassenger/src/screens/BookRideScreen.js` - Removed red zone UI components

### 2. 🚗 **New Per-Kilometer Pricing**

#### **Vehicle Type Rates:**
| Vehicle Type | Rate (XOF/km) | Description |
|-------------|---------------|-------------|
| 🏍️ **Moto** | **150 XOF/km** | Motorcycle taxi |
| 🚗 **Normal** | **338 XOF/km** | Standard car |
| 🚙 **Premium** | **550 XOF/km** | Luxury/comfort car |

#### **Pricing Formula:**
```
Total Fare = Distance (km) × Per Km Rate
```
- No base fare
- No duration-based charges
- Simple distance-based calculation

### 3. ✈️ **Airport Special Pricing - Osvaldo Vieira International**

#### **Flat Rate Service:**
- **Rate:** **5,600 XOF** (fixed price)
- **Coverage:** Any zone in Bissau to/from airport **inside terminal**
- **Applies to:** Departure/arrival area pickups/dropoffs

#### **Detection:**
- Automatic detection when pickup/dropoff is within 1km of airport coordinates
- Airport location: `11.8948°N, 15.6537°W`

#### **User Choice Modal:**
When airport detected, user must choose:
1. ✈️ **Inside Terminal** → 5,600 XOF flat rate (departure/arrival area)
2. 🚗 **Outside Airport** → Normal per km pricing

### 4. 📱 **Frontend Updates**

#### **Removed UI Components:**
- ❌ Red zone warning banners
- ❌ Red zone surcharge display
- ❌ Pickup red zone alerts
- ❌ Red zone confirmation modals

#### **New UI Components:**
- ✅ Airport detection modal
- ✅ Airport flat rate banner in fare display
- ✅ Per km rate display for each vehicle type
- ✅ Inside/Outside terminal selection

### 5. 🔧 **Backend API Changes**

#### **Request Parameters:**
```javascript
{
  pickupLatitude: number,
  pickupLongitude: number,
  dropoffLatitude: number,
  dropoffLongitude: number,
  vehicleType: 'Moto' | 'Normal' | 'Premium',
  isAirportInside: boolean  // NEW - indicates inside terminal
}
```

#### **Response Fields:**
```javascript
{
  baseFare: number,           // 0 for normal, 5600 for airport
  distanceFare: number,       // Distance × rate
  totalFare: number,          // Final price
  perKmRate: number,          // Rate used (150/338/550)
  isAirportTrip: boolean,     // NEW - true if airport inside selected
  isAirportFlatRate: boolean, // NEW - true if using 5600 flat rate
  airportDetected: boolean,   // NEW - true if near airport
  distance: number            // Trip distance in km
}
```

## 🎨 **User Experience Flow**

### **Normal Ride:**
1. Select pickup → Select dropoff
2. Choose vehicle type (see per km rate)
3. View fare: `Distance × Rate`
4. Confirm booking

### **Airport Ride:**
1. Select pickup/dropoff (one at airport)
2. **Modal appears:** "Airport Detected"
3. User chooses:
   - **Inside Terminal** → See "5,600 XOF flat rate"
   - **Outside Airport** → See "Distance × Rate"
4. Confirm booking

## 📊 **Pricing Examples**

### **Example 1: Normal Ride - Moto**
- Distance: 5 km
- Vehicle: Moto (150 XOF/km)
- **Fare:** 5 × 150 = **750 XOF**

### **Example 2: Normal Ride - Normal Car**
- Distance: 10 km
- Vehicle: Normal (338 XOF/km)
- **Fare:** 10 × 338 = **3,380 XOF**

### **Example 3: Airport Inside Terminal - Any Vehicle**
- From: Bissau city center
- To: Airport terminal (inside)
- **Fare:** **5,600 XOF** (fixed, regardless of distance or vehicle)

### **Example 4: Airport Outside - Normal Car**
- Distance: 8 km
- To: Airport parking (outside terminal)
- Vehicle: Normal (338 XOF/km)
- **Fare:** 8 × 338 = **2,704 XOF**

## 🚀 **Deployment Steps**

### **Backend:**
1. ✅ Updated `pricing.js` with new calculation logic
2. ✅ Updated `rides.js` API endpoint
3. ✅ Removed red zone dependencies
4. ⏳ Deploy to Railway (pending)

### **Frontend:**
1. ✅ Updated `BookRideScreen.js` with new UI
2. ✅ Added airport modal
3. ✅ Updated vehicle type display
4. ✅ Removed red zone components
5. ⏳ Build new APK (pending)

## 📝 **Testing Checklist**

- [ ] Test Moto ride: 150 XOF/km calculation
- [ ] Test Normal ride: 338 XOF/km calculation
- [ ] Test Premium ride: 550 XOF/km calculation
- [ ] Test airport detection (within 1km)
- [ ] Test airport modal appears
- [ ] Test "Inside Terminal" → 5,600 XOF
- [ ] Test "Outside Airport" → per km rate
- [ ] Verify no red zone alerts appear
- [ ] Verify fare breakdown displays correctly

## 🎯 **Benefits**

1. **Simpler Pricing:** Easy to understand - just distance × rate
2. **Fair for All:** No penalization for road conditions
3. **Airport Convenience:** Fixed rate for terminal trips
4. **Transparency:** Clear rate display per vehicle type
5. **User Choice:** Airport users choose inside/outside pricing

## 📅 **Implementation Date**
- **Date:** February 5, 2026
- **Version:** 1.1.0 (planned)
- **Status:** Code complete, pending deployment

---

**Developer:** Edivaldo Cardoso  
**Project:** Run Run Guinea-Bissau  
**Documentation:** Complete ✅
