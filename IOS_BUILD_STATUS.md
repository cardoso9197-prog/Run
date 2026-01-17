# 📱 iOS Build Status - January 2, 2026

## 🍎 iOS Builds Submitted

Both iOS builds have been submitted to EAS Build service. They will build the same apps as your Android versions, but for iOS devices and simulators.

### 📍 Build Links

**Passenger App (iOS):**
- Build URL: https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/bf9980c8-0f0a-4681-a16b-52f3cfcd50b6
- Bundle ID: `com.runrun.passenger`
- Profile: `preview` (iOS Simulator)

**Driver App (iOS):**
- Build URL: https://expo.dev/accounts/edipro/projects/runrun-driver/builds/e4bfa392-85c4-400a-91aa-39e05dbc44c2
- Bundle ID: `com.runrun.driver`
- Profile: `preview` (iOS Simulator)

---

## ⏱️ Build Time

iOS builds typically take **15-25 minutes** to complete on EAS Build.

---

## 📲 How to Install iOS Apps

### Option 1: iOS Simulator (macOS only)
1. Download the `.app` file from the build link
2. Open Xcode Simulator
3. Drag and drop the `.app` file onto the simulator

### Option 2: Physical Device (Requires Apple Developer Account - $99/year)
To install on a physical iPhone/iPad, you need:
1. Apple Developer Account ($99/year)
2. Register device UDID
3. Build with `preview-device` profile:
   ```bash
   eas build --platform ios --profile preview-device
   ```

### Option 3: TestFlight (For Public Testing)
For wider testing through TestFlight:
1. Need Apple Developer Program membership
2. Build with `production` profile
3. Submit to App Store Connect
4. Distribute via TestFlight

---

## 📋 Build Profiles Available

| Profile | Platform | Output | Distribution |
|---------|----------|--------|--------------|
| `preview` | iOS | .app (Simulator) | Internal |
| `preview-device` | iOS | .ipa | Internal (registered devices) |
| `production` | iOS | .ipa | App Store / TestFlight |

---

## 🔧 Commands Reference

### Build for iOS Simulator:
```bash
# Passenger
cd RunRunPassenger
eas build --platform ios --profile preview

# Driver
cd RunRunDriver
eas build --platform ios --profile preview
```

### Build for Physical Device:
```bash
# Passenger
cd RunRunPassenger
eas build --platform ios --profile preview-device

# Driver
cd RunRunDriver
eas build --platform ios --profile preview-device
```

### Build for App Store:
```bash
# Passenger
cd RunRunPassenger
eas build --platform ios --profile production

# Driver
cd RunRunDriver
eas build --platform ios --profile production
```

---

## ✅ What's Included in iOS Builds

Both iOS apps include:
- ✅ Same features as Android versions
- ✅ Google Maps integration
- ✅ Location permissions configured
- ✅ Background location (Driver app)
- ✅ Push notification capability
- ✅ Same API backend connection

---

## 📱 App Store Submission Requirements

To submit to the Apple App Store, you'll need:

1. **Apple Developer Account** ($99/year)
   - https://developer.apple.com/programs/

2. **App Store Connect Setup**
   - Create app listing
   - Upload screenshots
   - Write description
   - Set pricing (Free)

3. **Required Assets**
   - App icon (1024x1024)
   - Screenshots (various sizes)
   - Privacy policy URL
   - Support URL

4. **App Review**
   - Apple reviews all apps
   - Takes 1-3 days typically
   - May require explanations for location permissions

---

## 🔗 Your Expo Dashboard

View all your builds at:
https://expo.dev/accounts/edipro/projects

- **Passenger App:** https://expo.dev/accounts/edipro/projects/runrun-passenger/builds
- **Driver App:** https://expo.dev/accounts/edipro/projects/runrun-driver/builds
