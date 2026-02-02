# 🔴 GRADLE BUILD FAILURE - SOLUTION

**Build ID:** 6a281c31-e57a-4f62-aff5-5c855fcad41b  
**Error:** "Gradle build failed with unknown error"  
**Phase:** Run gradlew  
**Time:** January 29, 2026

---

## 🚨 THE PROBLEM

**Error Message:**
```
Gradle build failed with unknown error. 
See logs for the "Run gradlew" phase for more information.
```

**View Full Logs:**
https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/6a281c31-e57a-4f62-aff5-5c855fcad41b#run-gradlew

---

## 🔍 MOST LIKELY CAUSES

### 1. **Google Maps API Key Restrictions**

Your API Key: `AIzaSyDSXNYRIguNd4_6fT__XTbop_XShakpgsM`

**Problem:** The API key might be:
- Not enabled for Android builds
- Missing required APIs
- Restricted to specific applications

**Fix:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key: `AIzaSyDSXNYRIguNd4_6fT__XTbop_XShakpgsM`
3. Click "Edit API Key"
4. Under "Application restrictions":
   - Select "Android apps"
   - Add package name: `com.runrun.passenger`
   - Add SHA-1 certificate fingerprint (get from EAS)
5. Under "API restrictions":
   - Ensure these are enabled:
     - ✅ Maps SDK for Android
     - ✅ Places API
     - ✅ Geocoding API
     - ✅ Directions API

---

### 2. **react-native-maps Configuration Issue**

**Problem:** react-native-maps requires specific Gradle configuration

**Current version:** `"react-native-maps": "1.14.0"`

**Fix Option 1: Use Expo's built-in maps (RECOMMENDED)**

Replace react-native-maps with expo-maps:

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npm uninstall react-native-maps
npm install expo-maps
```

Then update your code:
```javascript
// Change from:
import MapView from 'react-native-maps';

// To:
import MapView from 'expo-maps';
```

**Fix Option 2: Configure react-native-maps properly**

Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true,
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "buildToolsVersion": "34.0.0"
          }
        }
      ]
    ]
  }
}
```

Then install the plugin:
```powershell
npx expo install expo-build-properties
```

---

### 3. **Expo SDK 51 Compatibility**

**Problem:** Some packages might not be compatible with SDK 51

**Check compatibility:**
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npx expo-doctor
```

**Fix any issues:**
```powershell
npx expo install --fix
```

---

## 🛠️ IMMEDIATE FIX (TRY THIS FIRST)

### Option A: Temporary Workaround - Remove Maps Temporarily

1. **Comment out maps in screens temporarily:**

```powershell
# We'll test if maps is the issue
# Just for testing, we'll create a simple version
```

2. **Or use the last working version:**

Your last successful build (Jan 14) worked. We added:
- BusinessAccountScreen (no maps) ✅
- InvoicesListScreen (no maps) ✅

The maps might be causing Gradle issues.

---

### Option B: Fix Google Maps Configuration

**Step 1: Get SHA-1 Certificate Fingerprint**

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npx eas-cli credentials
```

- Select "Android"
- Select "Production"
- View "Keystore"
- Copy SHA-1 fingerprint

**Step 2: Add to Google Cloud Console**

1. https://console.cloud.google.com/apis/credentials
2. Edit API key
3. Add package: `com.runrun.passenger`
4. Add SHA-1 fingerprint from Step 1
5. Save

**Step 3: Rebuild**

```powershell
npx eas-cli build --platform android --profile preview-device
```

---

### Option C: Use Expo's Native Configuration

Add `expo-build-properties` plugin:

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npx expo install expo-build-properties
```

Create/update `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "buildToolsVersion": "34.0.0",
            "minSdkVersion": 23
          }
        }
      ],
      [
        "react-native-maps",
        {
          "googleMapsApiKey": "AIzaSyDSXNYRIguNd4_6fT__XTbop_XShakpgsM"
        }
      ]
    ]
  }
}
```

Commit and rebuild:
```powershell
git add .
git commit -m "fix: Add expo-build-properties for Android Gradle build"
npx eas-cli build --platform android --profile preview-device
```

---

## 🎯 RECOMMENDED SOLUTION

**BEST APPROACH: Check the actual error in build logs**

1. **Open this URL:**
   https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/6a281c31-e57a-4f62-aff5-5c855fcad41b#run-gradlew

2. **Look for these patterns:**
   - `FAILED: :app:processReleaseMainManifest`
   - `Google Maps API key error`
   - `Dependency resolution failed`
   - `Task failed with an exception`

3. **Screenshot or copy the exact error**

4. **I'll provide specific fix based on actual error**

---

## 📋 QUICK DIAGNOSTIC

### Test 1: Check Package Versions
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npx expo-doctor
```

### Test 2: Validate Configuration
```powershell
cat app.json | grep -A 5 "android"
cat eas.json | grep -A 5 "preview-device"
```

### Test 3: Check Dependencies
```powershell
npm ls react-native-maps
npm ls expo
```

---

## 🚀 ALTERNATIVE: BUILD iOS INSTEAD

While we debug Android, try iOS build:

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npx eas-cli build --platform ios --profile preview-device
```

iOS builds often work when Android fails due to Gradle issues.

---

## 💡 FASTEST FIX RIGHT NOW

**Do this:**

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Install expo-build-properties
npx expo install expo-build-properties

# Update app.json with plugin configuration
```

Then add to `app.json` plugins array:
```json
{
  "expo": {
    "plugins": [
      ["expo-build-properties", {
        "android": {
          "compileSdkVersion": 34,
          "targetSdkVersion": 34,
          "buildToolsVersion": "34.0.0"
        }
      }]
    ]
  }
}
```

Commit:
```powershell
git add .
git commit -m "fix: Add expo-build-properties for Android Gradle compatibility"
```

Rebuild:
```powershell
npx eas-cli build --platform android --profile preview-device
```

---

## 📞 NEXT STEPS

1. **View actual error in browser:**
   https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/6a281c31-e57a-4f62-aff5-5c855fcad41b#run-gradlew

2. **Copy the red error text**

3. **Share with me** and I'll give you the exact fix

4. **OR try the fastest fix above** (expo-build-properties)

---

**Most Common Fix:** Add `expo-build-properties` plugin ✅

**Created:** January 29, 2026  
**Status:** Awaiting build log details  

**© 2026 Run-Run Guiné-Bissau**
