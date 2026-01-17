# Map-Based Location Picker for Guinea-Bissau

## Why This Solution?

Guinea-Bissau doesn't have formal street addresses like "123 Main Street". Most locations are identified by landmarks, neighborhoods, or GPS coordinates. Therefore, a **map-based location picker** is essential.

## How It Works

### User Experience:
1. User opens "Book Ride" screen
2. Taps "📌 Tap to select pickup on map"
3. Map opens showing Guinea-Bissau (centered on Bissau)
4. User can:
   - See their current location (blue dot)
   - Pan/zoom the map
   - Tap anywhere to select location
5. Selected location shows a pin marker
6. User taps "✓ Confirm Location"
7. Returns to Book Ride with location set
8. Repeat for dropoff location

### Features:
- ✅ **Map view** - Interactive map of Guinea-Bissau
- ✅ **Current location** - Shows user's GPS position
- ✅ **Tap to select** - Pick any location by tapping
- ✅ **Visual markers** - Green pin for pickup, Orange for dropoff
- ✅ **Reverse geocoding** - Converts coordinates to readable address
- ✅ **Fallback** - If geocoding fails, shows coordinates
- ✅ **No blocking** - Loads map separately, doesn't block Book Ride screen

## Technical Implementation

### Packages Used:
- `react-native-maps` - Map component (Expo compatible)
- `expo-location` - GPS and reverse geocoding

### Key Files Created:
1. **MapLocationPickerScreen.js** - Separate screen for map selection
2. **BookRideScreen.js** - Updated to use location buttons instead of text inputs
3. **App.js** - Added MapLocationPicker navigation

### Data Flow:
```
BookRide Screen
  ↓ (User taps pickup button)
MapLocationPicker Screen (locationType: 'pickup')
  ↓ (User selects location)
  ↓ (Reverse geocode to get address)
BookRide Screen (receives pickup data: {name, latitude, longitude})
```

### Backend Changes Needed:
Update `POST /api/rides` to accept:
```javascript
{
  pickup_address: "Bairro de Bissau Velho",  // or coordinates if no address
  pickup_latitude: 11.8636,
  pickup_longitude: -15.5982,
  dropoff_address: "Aeroporto Internacional",
  dropoff_latitude: 11.8947,
  dropoff_longitude: -15.6539,
  vehicle_type: "Normal",
  payment_method_id: 1,
  fare_estimate: 2500
}
```

## Google Maps API Key

### Important:
The app currently has a placeholder API key. For production, you need a real Google Maps API key:

1. Go to: https://console.cloud.google.com/
2. Create new project: "Run Run App"
3. Enable APIs:
   - Maps SDK for Android
   - Geocoding API (for reverse geocoding)
4. Create credentials → API Key
5. Restrict the key:
   - Android apps
   - Add package name: `com.runrun.passenger`
   - Add SHA-1 fingerprint from EAS Build
6. Update `app.json`:
   ```json
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "YOUR_REAL_API_KEY_HERE"
       }
     }
   }
   ```

### Without API Key:
- Map will show but with "For development purposes only" watermark
- Still functional for testing
- Should add real key before production launch

## Advantages Over Text Input

### For Guinea-Bissau:
1. **No formal addresses** - People don't have street addresses
2. **Visual selection** - Users can see landmarks, neighborhoods
3. **Precise coordinates** - Exact GPS location for driver navigation
4. **No typing errors** - Can't misspell non-existent addresses
5. **Works everywhere** - Even remote areas without named streets

### User Benefits:
- Faster booking (tap instead of type)
- More accurate locations
- Can see distance on map
- Recognizable landmarks visible

## Testing Instructions

### Test Flow:
1. **Login** as passenger: +245955921474 / 123456
2. **Go to Book Ride**
3. **Tap** "📌 Tap to select pickup on map"
4. **Wait** for map to load (shows Bissau)
5. **Grant** location permission when asked
6. **See** blue dot (your location) and map
7. **Tap** anywhere on map to select pickup
8. **See** green marker appear
9. **Tap** "✓ Confirm Location"
10. **Back** to Book Ride, pickup shown
11. **Repeat** for dropoff (orange marker)
12. **Select** vehicle type and payment
13. **Book** ride

### Expected Results:
- ✅ Map loads smoothly
- ✅ Can pan and zoom
- ✅ Markers appear on tap
- ✅ Location name shows in Book Ride
- ✅ Can book ride with selected locations
- ✅ Backend receives coordinates

### Common Issues:
- **Map blank**: API key issue (still works for testing)
- **No blue dot**: Location permission denied (can still tap to select)
- **Slow load**: First time loads map tiles (improves after)
- **Wrong location**: Reverse geocoding failed (shows coordinates, still works)

## Future Enhancements

### Phase 2 Features:
1. **Saved locations** - Home, Work, Favorite places
2. **Recent locations** - Quick select from history
3. **Search** - Type landmark name to find on map
4. **Route preview** - Show path from pickup to dropoff
5. **Distance calculation** - Better fare estimation
6. **Traffic info** - Show current traffic conditions

### Backend Improvements:
1. **Store coordinates** in `rides` table
2. **Distance calculation** using Haversine formula
3. **Dynamic pricing** based on actual distance
4. **Driver navigation** using stored coordinates
5. **Location history** for passengers

## Deployment Notes

### This Build Includes:
- Map-based location picker
- expo-location for GPS
- react-native-maps for map display
- Updated BookRideScreen UI
- Location permissions in manifest

### Breaking Changes:
- Book Ride now requires map interaction
- Backend must accept latitude/longitude fields
- Payment methods still work as before

### Migration from Text Input:
- Old apps with text input still work (backend compatible)
- New apps use map picker
- Can support both simultaneously if needed

## Files Modified

### Frontend:
- `src/screens/MapLocationPickerScreen.js` - **NEW** - Map picker screen
- `src/screens/BookRideScreen.js` - Updated for location buttons
- `App.js` - Added MapLocationPicker route
- `app.json` - Added Google Maps config
- `package.json` - Added expo-location, react-native-maps

### Backend (Needs Update):
- `backend/routes/rides.js` - Add latitude/longitude fields
- `backend/database/schema.sql` - Add coordinate columns to rides table

## SQL Migration for Backend

```sql
-- Add coordinate columns to rides table
ALTER TABLE rides 
ADD COLUMN IF NOT EXISTS pickup_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS pickup_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS dropoff_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS dropoff_longitude DECIMAL(11, 8);

-- Add indexes for coordinate searches
CREATE INDEX IF NOT EXISTS idx_rides_pickup_coords 
ON rides(pickup_latitude, pickup_longitude);

CREATE INDEX IF NOT EXISTS idx_rides_dropoff_coords 
ON rides(dropoff_latitude, dropoff_longitude);
```

## Summary

✅ **Solves the Guinea-Bissau address problem**  
✅ **Better user experience** - Visual, tap-based  
✅ **More accurate** - Exact GPS coordinates  
✅ **Doesn't block** - Map is separate screen  
✅ **Fallback support** - Works even if geocoding fails  
✅ **Production ready** - Just needs Google Maps API key  

This is the proper solution for countries without formal address systems!
