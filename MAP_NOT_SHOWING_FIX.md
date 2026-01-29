# 🗺️ MAP NOT SHOWING - TROUBLESHOOTING GUIDE

## Issue
Map doesn't appear when selecting pickup or dropoff location in the passenger app.

---

## Common Causes & Solutions

### 1. **Google Maps API Key Issues**

#### Check if API Key is Valid
Your current API key: `AIzaSyDSXNYRIguNd4_6fT__XTbop_XShakpgsM`

**Steps to verify:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Check if the API key exists and is enabled
4. Verify these APIs are enabled:
   - ✅ Maps SDK for Android
   - ✅ Maps SDK for iOS
   - ✅ Places API (for geocoding)
   - ✅ Geocoding API

#### Enable Required APIs
```bash
# If APIs are not enabled, enable them:
# 1. Go to https://console.cloud.google.com/apis/library
# 2. Search and enable:
#    - Maps SDK for Android
#    - Maps SDK for iOS
#    - Geocoding API
```

#### Check API Key Restrictions
- If your API key has restrictions, make sure your app's package name is allowed:
  - Android: `com.runrun.passenger`
  - iOS: `com.runrun.passenger`

---

### 2. **Expo Go Limitations**

⚠️ **IMPORTANT**: Google Maps may NOT work properly in Expo Go app on Android.

**Solution: Build a Development Build**

```powershell
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo
eas login

# Build development client for Android
eas build --profile development --platform android

# Or for iOS
eas build --profile development --platform ios
```

**Alternative: Use Expo Dev Client**
```powershell
cd RunRunPassenger
npx expo install expo-dev-client
npx expo run:android
# or
npx expo run:ios
```

---

### 3. **Location Permissions Not Granted**

The app needs location permissions to show the map and user's current location.

**Check permissions in the app:**
- When you open MapLocationPicker, it should ask for location permission
- Grant "Allow while using the app" or "Allow always"

**Android Debug:**
```powershell
# Check if permissions are granted
adb shell dumpsys package com.runrun.passenger | findstr permission
```

---

### 4. **Metro Bundler Cache Issues**

Sometimes cached files cause the map not to render.

**Clear cache and restart:**
```powershell
cd RunRunPassenger

# Clear Expo cache
npx expo start -c

# Or clear npm cache
npm cache clean --force
rm -rf node_modules
npm install
npx expo start
```

---

### 5. **React Native Maps Not Properly Linked**

For development builds, ensure react-native-maps is properly configured.

**Reinstall and rebuild:**
```powershell
cd RunRunPassenger

# Reinstall react-native-maps
npm uninstall react-native-maps
npm install react-native-maps@1.14.0

# Clear cache
npx expo start -c
```

---

## Quick Diagnostic Steps

### Step 1: Check Console for Errors
When you navigate to MapLocationPicker, check the Metro bundler console for errors like:
- `Google Maps API key not found`
- `Location permission denied`
- `MapView component not found`

### Step 2: Test on Real Device
```powershell
# Start Expo
cd RunRunPassenger
npx expo start

# Scan QR code with:
# - Android: Expo Go app
# - iOS: Camera app
```

### Step 3: Verify Map Component Loads
Add console logs to MapLocationPickerScreen.js to debug:

```javascript
useEffect(() => {
  console.log('MapLocationPicker mounted');
  console.log('Loading state:', loading);
  getCurrentLocation();
}, []);
```

---

## Recommended Solution (Most Reliable)

### Use Expo Dev Client Instead of Expo Go

1. **Install Expo Dev Client:**
```powershell
cd RunRunPassenger
npx expo install expo-dev-client
```

2. **Add to package.json** (if not already there):
```json
{
  "dependencies": {
    "expo-dev-client": "~4.0.29"
  }
}
```

3. **Build and Run:**
```powershell
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

This creates a development build with native modules properly linked.

---

## Alternative: Use Web Maps for Testing

If you need to test quickly without native builds, you can temporarily use a web-based map.

**Install react-native-web-maps:**
```powershell
npm install react-native-web-maps
```

But this is NOT recommended for production.

---

## Test Checklist

- [ ] Google Maps API key is valid
- [ ] Required APIs are enabled in Google Cloud Console
- [ ] Location permissions are granted in the app
- [ ] Using Expo Dev Client or development build (not Expo Go on Android)
- [ ] Metro bundler shows no errors
- [ ] App is running on a real device (not simulator if testing GPS)
- [ ] Internet connection is active

---

## Expected Behavior After Fix

1. Open passenger app
2. Navigate to Book Ride screen
3. Tap "📌 Tap to select pickup on map"
4. **Map should appear** showing:
   - Current location (blue dot)
   - Interactive map tiles
   - Instruction box at top
   - Confirm/Cancel buttons at bottom
5. Tap on map to select location
6. Green marker appears
7. Tap "✓ Confirm Location"
8. Returns to Book Ride with selected address

---

## Still Not Working?

### Check These Files

1. **app.json** - Verify API key is present:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "AIzaSyDSXNYRIguNd4_6fT__XTbop_XShakpgsM"
    }
  }
}
```

2. **MapLocationPickerScreen.js** - Ensure MapView is imported:
```javascript
import MapView, { Marker } from 'react-native-maps';
```

3. **package.json** - Verify react-native-maps version:
```json
"react-native-maps": "1.14.0"
```

---

## Contact Support

If issue persists after trying all solutions:
- **Email:** suporte@runrungb.com
- **Phone:** +245 955 981 398

Include:
- Device model and OS version
- Screenshot of error (if any)
- Metro bundler console output
- Whether using Expo Go or Dev Client

---

**Last Updated:** 29 January 2026
