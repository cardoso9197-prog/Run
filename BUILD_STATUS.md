# 🏗️ RUN-RUN APK/IPA BUILD STATUS - January 29, 2026

## Build Summary

**Expo Account:** edipro (https://expo.dev/accounts/edipro)  
**Build Date:** January 29, 2026  
**Build Profile:** preview-device (internal distribution)

---

## 📱 BUILDS IN PROGRESS

### Passenger App (runrun-passenger)
- ⏳ **Android APK** - Building on EAS Cloud
  - Platform: Android
  - Output: `.apk` file
  - Profile: preview-device
  - Status: In Queue/Building
  
- ⏳ **iOS IPA** - Building on EAS Cloud
  - Platform: iOS
  - Output: `.ipa` file
  - Profile: preview-device
  - Status: In Queue/Building

### Driver App (runrun-driver)
- ⏳ **Android APK** - Building on EAS Cloud
  - Platform: Android
  - Output: `.apk` file
  - Profile: preview-device
  - Status: In Queue/Building
  
- ⏳ **iOS IPA** - Building on EAS Cloud
  - Platform: iOS
  - Output: `.ipa` file
  - Profile: preview-device
  - Status: In Queue/Building

---

## ⏱️ ESTIMATED COMPLETION TIME

| Build | Estimated Time | Status |
|-------|----------------|--------|
| Passenger Android | 15-25 minutes | ⏳ Building |
| Passenger iOS | 20-30 minutes | ⏳ Building |
| Driver Android | 15-25 minutes | ⏳ Building |
| Driver iOS | 20-30 minutes | ⏳ Building |

**Total Estimated Time:** 20-30 minutes (builds run in parallel)

---

## 📊 CHECK BUILD STATUS

### Via Web Dashboard
Visit: https://expo.dev/accounts/edipro/projects

You'll see:
- `runrun-passenger` project builds
- `runrun-driver` project builds

### Via Terminal
```powershell
# Check specific build status
npx eas-cli build:list --limit 10

# Or check by app
cd RunRunPassenger
npx eas-cli build:list --limit 5

cd ../RunRunDriver
npx eas-cli build:list --limit 5
```

---

## 📥 DOWNLOAD BUILDS

### Once Builds Complete:

#### Option 1: Web Dashboard
1. Go to: https://expo.dev/accounts/edipro/projects
2. Click on each project (runrun-passenger, runrun-driver)
3. Go to "Builds" tab
4. Find your completed builds
5. Click "Download" button for each APK/IPA

#### Option 2: Terminal
```powershell
# List recent builds with download URLs
npx eas-cli build:list --limit 10 --json
```

#### Option 3: Direct Download Links
After builds complete, you'll receive URLs like:
```
https://expo.dev/artifacts/eas/[build-id].apk
https://expo.dev/artifacts/eas/[build-id].ipa
```

---

## 📂 SAVE BUILDS TO

Create this folder structure:
```
C:\Users\Colondo Full service\Desktop\Run-Run GW\builds\
├── passenger\
│   ├── android\
│   │   └── runrun-passenger-v1.0.0.apk
│   └── ios\
│       └── runrun-passenger-v1.0.0.ipa
└── driver\
    ├── android\
    │   └── runrun-driver-v1.0.0.apk
    └── ios\
        └── runrun-driver-v1.0.0.ipa
```

---

## 🔗 UPLOAD & DISTRIBUTE

### For Android APKs:
1. **Firebase Hosting** (Recommended)
   ```powershell
   firebase deploy --only hosting
   ```

2. **Google Drive** (Easy)
   - Upload APKs to Google Drive
   - Get shareable public links
   - Generate QR codes

3. **AWS S3** (Professional)
   - Upload to S3 bucket
   - Make files public
   - Use CloudFront CDN

### For iOS IPAs:
1. **TestFlight** (Recommended for iOS)
   - Requires Apple Developer Account ($99/year)
   - Upload via EAS Submit
   - Users install via TestFlight app

2. **Direct Distribution** (Enterprise)
   - Requires Apple Developer Enterprise Account
   - Users must trust certificate on device

---

## 🧪 TESTING BUILDS

### Android APK Testing:
1. **Transfer to Android device:**
   ```
   - Via USB: Copy APK to phone
   - Via Email: Send APK as attachment
   - Via QR Code: Scan to download
   ```

2. **Install on device:**
   ```
   - Enable "Install from Unknown Sources"
   - Tap APK file
   - Tap "Install"
   ```

3. **Test thoroughly:**
   - Registration/Login
   - Book ride
   - Payment methods
   - Business account
   - Invoice generation
   - Map functionality

### iOS IPA Testing:
1. **Install via TestFlight:**
   ```
   - Users install TestFlight from App Store
   - Send them TestFlight invite link
   - They download app via TestFlight
   ```

2. **Or direct install (if enterprise):**
   ```
   - Upload IPA to your server
   - Create manifest.plist
   - Users install via Safari
   ```

---

## 📱 GENERATE QR CODES

### After getting download URLs:

1. **Update generate-qr-codes.js:**
```javascript
const APK_URLS = {
  passenger: 'https://your-url/runrun-passenger.apk',
  passengerIOS: 'https://testflight.apple.com/join/xxx',
  driver: 'https://your-url/runrun-driver.apk',
  driverIOS: 'https://testflight.apple.com/join/xxx',
};
```

2. **Generate QR codes:**
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW"
node generate-qr-codes.js
```

3. **Upload to website:**
   - Upload QR code images
   - Update download page at https://runrungw.com

---

## 🌐 UPDATE WEBSITE

### Download Page Structure:
```html
<div class="downloads">
  <div class="app-card">
    <h2>📱 Passenger App</h2>
    <div class="platforms">
      <a href="[ANDROID_APK_URL]">
        <img src="android-badge.png" alt="Download Android">
      </a>
      <a href="[IOS_TESTFLIGHT_URL]">
        <img src="ios-badge.png" alt="Download iOS">
      </a>
    </div>
    <img src="passenger-qr-android.png" class="qr-code">
    <img src="passenger-qr-ios.png" class="qr-code">
  </div>

  <div class="app-card">
    <h2>🚗 Driver App</h2>
    <div class="platforms">
      <a href="[ANDROID_APK_URL]">
        <img src="android-badge.png" alt="Download Android">
      </a>
      <a href="[IOS_TESTFLIGHT_URL]">
        <img src="ios-badge.png" alt="Download iOS">
      </a>
    </div>
    <img src="driver-qr-android.png" class="qr-code">
    <img src="driver-qr-ios.png" class="qr-code">
  </div>
</div>
```

---

## ✅ POST-BUILD CHECKLIST

- [ ] All 4 builds completed successfully
- [ ] Downloaded all APKs and IPAs
- [ ] Tested Passenger Android APK
- [ ] Tested Driver Android APK
- [ ] Set up TestFlight for iOS (if using)
- [ ] Uploaded APKs to hosting
- [ ] Generated QR codes with real URLs
- [ ] Updated website download page
- [ ] Tested downloads from mobile devices
- [ ] Sent test links to beta testers

---

## 🆘 TROUBLESHOOTING

### Build Failed?
```powershell
# Check error logs
npx eas-cli build:list --limit 1

# Retry with verbose logging
cd RunRunPassenger
npx eas-cli build --platform android --profile preview-device
```

### Build Stuck?
- Wait 30 minutes (cloud builds take time)
- Check: https://expo.dev/accounts/edipro/projects
- Check terminal for error messages

### Can't Download?
- Check your Expo account settings
- Verify build completed successfully
- Try incognito browser window

---

## 📞 SUPPORT

**Expo Account:** edipro  
**Dashboard:** https://expo.dev/accounts/edipro  
**Expo Docs:** https://docs.expo.dev/build/introduction/

**Project Contact:**  
**Email:** suporte@runrungb.com  
**Phone:** +245 955 981 398

---

## 🎯 NEXT STEPS

1. ⏰ **Wait 20-30 minutes** for builds to complete
2. 🔍 **Check status** at https://expo.dev/accounts/edipro/projects
3. 📥 **Download** all 4 builds (2 APKs, 2 IPAs)
4. 🧪 **Test** Android APKs on devices
5. 🍎 **Set up TestFlight** for iOS distribution
6. 🌐 **Upload & generate QR codes**
7. 📱 **Update website** with download links
8. 👥 **Share** with beta testers

---

**Build Started:** January 29, 2026  
**Expected Completion:** ~30 minutes  
**Status:** ⏳ In Progress

**Check builds at:** https://expo.dev/accounts/edipro/projects

---

**© 2026 Run-Run Guiné-Bissau | KCDIGITALS**
