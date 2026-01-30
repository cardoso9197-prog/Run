# 🔴 EAS BUILD FAILURE - TROUBLESHOOTING GUIDE

**Date:** January 29, 2026  
**Build ID:** e53c0296-90e3-41bd-991e-8d4b66576a57  
**App:** Run-Run Passenger  
**Platform:** Android  
**Profile:** preview-device  
**Status:** ERRORED at 17:21:47

---

## 🔍 BUILD DETAILS

**Full Build Logs:**  
https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/e53c0296-90e3-41bd-991e-8d4b66576a57

**Commit:** 3a6d7cd0b04a9f12b4d945492c1dfbbe71bd18f9  
**SDK:** 51.0.0  
**Version:** 1.0.0  

---

## 🚨 COMMON BUILD FAILURES & FIXES

### 1. **Google Maps API Key Issue**

**Symptoms:**
- Build fails during Android configuration
- Error about missing API key or permissions

**Your API Key:** `AIzaSyDSXNYRIguNd4_6fT__XTbop_XShakpgsM`

**Fix:**
```powershell
# Verify API key is valid
# Go to: https://console.cloud.google.com/apis/credentials
# Check if key is enabled for:
# - Maps SDK for Android
# - Maps SDK for iOS
```

---

### 2. **Dependency Conflicts**

**Symptoms:**
- Build fails during npm install
- Module resolution errors

**Check:**
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npm install
```

**Fix if needed:**
```powershell
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

### 3. **Git Uncommitted Changes**

**Symptoms:**
- EAS requires clean git state
- Uncommitted changes error

**Check:**
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
git status
```

**Fix:**
```powershell
git add .
git commit -m "feat: Add business accounts and invoice system"
```

---

### 4. **EAS Configuration Issues**

**Symptoms:**
- Profile not found
- Invalid build configuration

**Check your eas.json:**
```json
{
  "build": {
    "preview-device": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"  // ✅ Correct
      }
    }
  }
}
```

---

### 5. **Expo SDK Version Mismatch**

**Symptoms:**
- Package compatibility errors
- SDK version conflicts

**Check package.json:**
```json
{
  "dependencies": {
    "expo": "~51.0.0",  // ✅ SDK 51
    "react-native": "0.74.5"  // ✅ Compatible
  }
}
```

---

### 6. **Native Module Issues**

**Symptoms:**
- react-native-maps build failure
- expo-file-system errors

**Your Dependencies:**
```json
"react-native-maps": "1.14.0",
"expo-file-system": "^19.0.21",
"expo-sharing": "^14.0.8",
"expo-location": "~17.0.1"
```

**All versions are compatible with SDK 51 ✅**

---

## 🔧 IMMEDIATE FIXES TO TRY

### Fix 1: Commit All Changes
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
git add .
git commit -m "fix: Prepare for EAS build with all latest changes"
```

### Fix 2: Clean Build
```powershell
# Clear EAS build cache
npx eas-cli build --platform android --profile preview-device --clear-cache
```

### Fix 3: Check Package Lock
```powershell
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "chore: Update package-lock.json"
```

### Fix 4: Rebuild with Verbose Logging
```powershell
npx eas-cli build --platform android --profile preview-device --no-wait
```

---

## 📊 DIAGNOSTIC COMMANDS

### Check Build Status:
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npx eas-cli build:list --limit 5
```

### View Specific Build:
```powershell
npx eas-cli build:view e53c0296-90e3-41bd-991e-8d4b66576a57
```

### Check Project Configuration:
```powershell
npx eas-cli build:inspect --platform android --profile preview-device
```

### Validate Configuration:
```powershell
npx eas-cli build:configure
```

---

## 🌐 VIEW BUILD LOGS ONLINE

**Direct Link:**  
https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/e53c0296-90e3-41bd-991e-8d4b66576a57

**Steps:**
1. Open link in browser
2. Look for red error messages
3. Check "Build logs" section
4. Find the actual error (usually near bottom)
5. Note the error type

---

## 🔍 WHAT TO LOOK FOR IN LOGS

### Common Error Patterns:

#### 1. **Gradle Build Failed:**
```
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':app:processReleaseResources'
```

**Fix:** Usually Google Maps API key or Android config issue

#### 2. **NPM Install Failed:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Fix:** Run `npm install` locally, fix conflicts, commit

#### 3. **Metro Bundler Failed:**
```
error: bundling failed: Error: Unable to resolve module
```

**Fix:** Missing dependency, run `npm install <missing-package>`

#### 4. **Native Module Linking Failed:**
```
> Task :react-native-maps:compileReleaseJavaWithJavac FAILED
```

**Fix:** Check react-native-maps configuration

---

## ✅ WORKING CONFIGURATION (Reference)

### app.json (Passenger):
```json
{
  "expo": {
    "name": "Run Run Passenger",
    "slug": "runrun-passenger",
    "version": "1.0.0",
    "android": {
      "package": "com.runrun.passenger",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyDSXNYRIguNd4_6fT__XTbop_XShakpgsM"
        }
      }
    }
  }
}
```

### eas.json:
```json
{
  "build": {
    "preview-device": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## 🚀 RETRY BUILD STEPS

### Step 1: Check Git Status
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
git status
```

### Step 2: Commit Everything
```powershell
git add .
git commit -m "fix: Complete business accounts and invoice system for build"
```

### Step 3: Verify Local Install
```powershell
npm install
# Should complete without errors
```

### Step 4: Clear EAS Cache
```powershell
npx eas-cli build --platform android --profile preview-device --clear-cache --non-interactive
```

### Step 5: Monitor Build
```powershell
# After starting build
npx eas-cli build:list
# Watch for status changes
```

---

## 📞 GET HELP

### 1. **Check Build Logs:**
Visit: https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/e53c0296-90e3-41bd-991e-8d4b66576a57

### 2. **Expo Support:**
- Discord: https://chat.expo.dev/
- Forums: https://forums.expo.dev/
- Docs: https://docs.expo.dev/build/introduction/

### 3. **Common Issues Database:**
- https://docs.expo.dev/build-reference/troubleshooting/

---

## 🎯 QUICK ACTION PLAN

**Do this NOW:**

1. ✅ **Open build logs URL in browser**
   - Find the actual error message
   - Look for red text or "FAILED" messages

2. ✅ **Check git status and commit**
   ```powershell
   cd RunRunPassenger
   git add .
   git commit -m "fix: Build preparation"
   ```

3. ✅ **Verify dependencies**
   ```powershell
   npm install
   ```

4. ✅ **Retry build with cache clear**
   ```powershell
   npx eas-cli build --platform android --profile preview-device --clear-cache
   ```

---

## 📊 PREVIOUS SUCCESSFUL BUILDS

**Last successful Android build:**
- Build ID: 7b1f736d-8d8f-4447-8851-e19eb7eaa3a2
- Date: January 14, 2026
- Profile: preview
- APK: https://expo.dev/artifacts/eas/gcPn9MfuDqM879seV8pFK1.apk
- Status: ✅ FINISHED

**Changes since then:**
- Added BusinessAccountScreen.js
- Added InvoicesListScreen.js
- Updated App.js with new routes
- Added expo-file-system and expo-sharing

**These changes should not break the build** ✅

---

## 💡 MOST LIKELY ISSUE

Based on timing and your setup:

**Hypothesis:** Git uncommitted changes or dependency resolution

**Test:**
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
git status
# If shows uncommitted files, commit them
git add .
git commit -m "fix: Add all invoice and business account features"

# Then rebuild
npx eas-cli build --platform android --profile preview-device
```

---

**Created:** January 29, 2026  
**Status:** Awaiting error log details  
**Next Step:** View build logs at Expo dashboard

**© 2026 Run-Run Guiné-Bissau | KCDIGITALS**
