# Airport Flat Rate Debugging Guide

## Issue Report
User reports that the **5600 XOF airport flat rate is not being applied** when booking rides from/to Osvaldo Vieira Airport.

## Current Implementation

### Frontend (BookRideScreen.js)
1. **Local Airport Detection**: Uses Haversine formula to detect if pickup/dropoff is within 1km of airport
2. **Modal Display**: Shows modal asking user to choose "Inside Terminal" or "Outside/Parking"
3. **State Management**: 
   - `isAirportInside` state variable (boolean)
   - `airportChoiceMade` ref to prevent modal from showing repeatedly
4. **API Calls**: Sends `isAirportInside` to both:
   - `POST /api/rides/estimate-fare` (for fare preview)
   - `POST /api/rides/request` (for ride creation)

### Backend (pricing.js)
1. **Airport Detection**: Checks if pickup or dropoff is within 1km of airport coordinates (11.8948°N, -15.6537°W)
2. **Flat Rate Logic**:
   ```javascript
   if (isAirportTrip) {
     totalFare = 5600;  // Flat rate
     isAirportFlatRate = true;
   } else {
     totalFare = distance * perKmRate;  // Normal pricing
   }
   ```
3. **Conditions for Flat Rate**:
   - `airportDetected` = true (pickup or dropoff within 1km radius)
   - `isAirportInside` = true (user selected "Inside Terminal")
   - `isAirportTrip = airportDetected && isAirportInside`

## Debug Logging Added

### Backend Logs (pricing.js)
- `🛫 AIRPORT FARE DEBUG`: Shows coordinates, distances to airport, and isAirportInside value
- `✅ AIRPORT DETECTED` or `❌ NOT NEAR AIRPORT`: Confirms detection logic
- `💰 FARE CALCULATION`: Shows all input parameters
- `✈️ APPLYING AIRPORT FLAT RATE` or `🚗 APPLYING NORMAL PRICING`: Shows which pricing path was taken
- `📤 RETURNING FARE`: Shows final fare breakdown returned to API

### Backend Logs (routes/rides.js)
- `📥 ESTIMATE-FARE REQUEST`: Shows all parameters received from frontend including isAirportInside

### Frontend Logs (BookRideScreen.js)
- `📍 Distance to airport`: Shows calculated distance from pickup/dropoff to airport
- `✈️ LOCAL Airport Check`: Shows pickup/dropoff proximity results
- `🔔 Showing airport modal`: Confirms when modal appears
- `✈️ User selected: Inside Terminal` or `🅿️ User selected: Outside/Parking`: User's choice
- `🔍 Calculating fare with`: Shows all parameters before API call
- `✅ Fare estimate received`: Shows response from backend

## Testing Steps

1. **Install Latest APKs**:
   - Passenger: [https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/1b8d93eb-fd60-494b-a47c-98836e4e1ffc](https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/1b8d93eb-fd60-494b-a47c-98836e4e1ffc)
   - Driver: [https://expo.dev/accounts/edipro/projects/runrun-driver/builds/61d412c7-4c03-420b-86c8-cc7ef3e4570c](https://expo.dev/accounts/edipro/projects/runrun-driver/builds/61d412c7-4c03-420b-86c8-cc7ef3e4570c)

2. **Test Airport Trip**:
   - Open RunRun Passenger app
   - Set pickup location NEAR airport (within 1km of 11.8948°N, -15.6537°W)
   - Set dropoff location in city center
   - Airport modal should appear
   - Select "Inside Terminal (5600 XOF flat rate)"
   - Check if fare shows 5600 XOF

3. **Check Backend Logs** (Railway Dashboard):
   ```
   Go to: https://railway.app
   → Select project → Deployments → View Logs
   Look for: 🛫, ✅, 💰, ✈️, 📤 emoji logs
   ```

4. **Check Frontend Logs** (React Native Debugger or Expo Go):
   - If using Expo Go: Shake device → Open Dev Menu → Remote JS Debugging
   - Look for: 📍, ✈️, 🔔, 🔍, ✅ emoji logs in browser console

## Expected Behavior

When user selects "Inside Terminal":
1. Frontend: `isAirportInside = true`
2. Backend receives: `isAirportInside: true`
3. Backend detects: `airportDetected = true` (within 1km)
4. Backend calculates: `isAirportTrip = true`
5. Backend applies: `totalFare = 5600`
6. Backend returns: `{ totalFare: 5600, isAirportFlatRate: true }`
7. Frontend displays: "5600 XOF"

## Possible Issues to Check

1. **Modal Not Showing**: 
   - Check if pickup/dropoff coordinates are correct
   - Verify distance calculation in frontend
   - Check `airportChoiceMade.current` ref

2. **isAirportInside Not Sent**:
   - Check API request payload in Network tab
   - Verify rideAPI.estimateFare includes isAirportInside

3. **Backend Not Receiving Parameter**:
   - Check Railway logs for `📥 ESTIMATE-FARE REQUEST`
   - Verify `body_isAirportInside` value and type

4. **Backend Not Detecting Airport**:
   - Check `🛫 AIRPORT FARE DEBUG` logs
   - Verify pickupToAirport or dropoffToAirport <= 1.0 km

5. **Backend Not Applying Flat Rate**:
   - Check `💰 FARE CALCULATION` logs
   - Verify `isAirportTrip = true`
   - Look for `✈️ APPLYING AIRPORT FLAT RATE` log

6. **Frontend Not Displaying Correctly**:
   - Check `✅ Fare estimate received` log
   - Verify `estimate.totalFare` value
   - Check if `setEstimatedFare` was called

## Quick Fixes

### If Modal Doesn't Show:
```javascript
// In BookRideScreen.js, temporarily force modal:
setShowAirportModal(true);
```

### If Backend Doesn't Receive isAirportInside:
```javascript
// Check API call in BookRideScreen.js line ~199:
await rideAPI.estimateFare({
  // ... other params
  isAirportInside: isAirportInside,  // Make sure this line exists
});
```

### If Backend Doesn't Apply Flat Rate:
```javascript
// In pricing.js, check the condition:
if (isAirportTrip) {  // Should be true when both conditions met
  totalFare = 5600;
}
```

## Contact
If issue persists after checking all logs, provide:
1. Screenshot of airport modal
2. Screenshot of fare display
3. Railway backend logs (with 🛫 emoji logs)
4. Frontend console logs (with ✈️ emoji logs)
5. Exact pickup/dropoff coordinates used

## Latest Deployment
- Commit: `65fedc9` - "Add comprehensive debug logging for airport flat rate issue"
- Backend: Auto-deploying to Railway
- APKs: Built and ready for testing
