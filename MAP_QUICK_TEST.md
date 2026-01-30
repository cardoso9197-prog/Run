# 🧪 Quick Map Test Commands

## Test if the app is running correctly

### 1. Start the app with clear cache
```powershell
cd RunRunPassenger
npx expo start -c
```

### 2. Check Metro bundler console
Look for these messages when you navigate to MapLocationPicker:
```
✅ MapLocationPicker mounted for: pickup
✅ Requesting location permissions...
✅ Location permission status: granted
✅ Getting current position...
✅ Current location: { latitude: X, longitude: Y }
✅ Map loading complete
✅ Map is ready
```

### 3. Common Error Messages

#### Error: "Google Maps API key not found"
**Solution:** Your API key is not configured properly
```powershell
# Check app.json has the key in android.config.googleMaps.apiKey
```

#### Error: "Location permission denied"
**Solution:** Grant location permission in your device settings
- Go to Settings > Apps > Expo Go > Permissions > Location > Allow

#### Error: "Map failed to load"
**Solution:** Check internet connection or API key restrictions

---

## Quick Fixes

### Fix 1: Restart with clean cache
```powershell
cd RunRunPassenger
npx expo start -c
```

### Fix 2: Reinstall dependencies
```powershell
cd RunRunPassenger
rm -rf node_modules
npm install
npx expo start
```

### Fix 3: Use development build instead of Expo Go
```powershell
cd RunRunPassenger
npx expo install expo-dev-client
npx expo run:android
```

---

## Test on Device

1. **Open Expo Go** on your phone
2. **Scan QR code** from Metro bundler
3. **Navigate to:** Home → Book Ride → Tap pickup location button
4. **Expected:** Map screen appears with your current location
5. **Check Metro console** for any error messages

---

## If Map Still Doesn't Show

### Most Common Cause: Expo Go Limitation on Android

Google Maps doesn't always work in Expo Go on Android. You MUST use a development build.

**Solution:**
```powershell
# Build development version
cd RunRunPassenger
eas build --profile development --platform android

# Or run directly
npx expo run:android
```

This will create a standalone development app with native modules properly linked.

---

## Debug Mode

If you want to see exactly what's happening, check these logs:

### In Metro Bundler Console:
- MapLocationPicker mounted
- Location permission requests
- Map ready callbacks
- Any errors

### In Device Logcat (Android):
```powershell
adb logcat | findstr "ExpoLocation|GoogleMaps|MapView"
```

### In Device Console (iOS):
Open Xcode and check the device console logs.

---

## Still Having Issues?

Contact: suporte@runrungb.com
Include:
1. Device model and OS version
2. Whether using Expo Go or development build
3. Metro bundler console output
4. Screenshot of what you see instead of the map
