# 📱 Mobile Apps - About Section Added & Build Guide

**Date:** January 8, 2026  
**Developer:** Edivaldo Cardoso  
**Email:** suporte@runrungb.com  
**Phone:** +245 955 971 275

---

## ✅ CHANGES COMPLETED

### About App Section Added

Both **RunRunPassenger** and **RunRunDriver** mobile apps now have an "About App" section in the Settings screen with the following information:

```
App Version: 1.0
Developer: Edivaldo Cardoso
Title: Founder & Lead Developer
Company: Run-Run Guiné-Bissau
Email: suporte@runrungb.com
```

---

## 📁 FILES MODIFIED

### Passenger App
**File:** `RunRunPassenger/src/screens/SettingsScreen.js`
- ✅ Added "About App" section after Notifications
- ✅ Displays app version, developer info, and contact email
- ✅ Professional card layout with dividers
- ✅ Email shown in orange (brand color) for visibility

### Driver App
**File:** `RunRunDriver/src/screens/SettingsScreen.js`
- ✅ Added "About App" section after Notifications
- ✅ Displays app version, developer info, and contact email
- ✅ Professional card layout with dividers
- ✅ Email shown in orange (brand color) for visibility

---

## 🎨 About Section Design

The About section displays information in a clean, organized format:

```
┌──────────────────────────────────────┐
│  About App                           │
│  ┌────────────────────────────────┐  │
│  │ App Version:            1.0    │  │
│  │ ────────────────────────────── │  │
│  │ Developer:    Edivaldo Cardoso │  │
│  │ ────────────────────────────── │  │
│  │ Title:  Founder & Lead Dev...  │  │
│  │ ────────────────────────────── │  │
│  │ Company:  Run-Run Guiné-Bi...  │  │
│  │ ────────────────────────────── │  │
│  │ Email:   suporte@runrungb.com  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Features:**
- Clean card-based design
- Consistent with existing Settings UI
- Orange accent color for email (#FF6B00)
- Responsive layout that adapts to screen sizes
- Works on both Android and iOS

---

## 🏗️ BUILD INSTRUCTIONS

### Prerequisites

1. **Install EAS CLI globally:**
   ```powershell
   npm install -g eas-cli
   ```

2. **Login to Expo account:**
   ```powershell
   eas login
   ```
   - Use your Expo account credentials
   - If you don't have an account, create one at https://expo.dev

3. **Configure EAS Project:**
   ```powershell
   # For Passenger App
   cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
   eas init

   # For Driver App
   cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"
   eas init
   ```

---

## 📦 BUILD OPTIONS

### Option 1: Development Build (Recommended for Testing)

**Purpose:** Quick builds for internal testing on physical devices

**Passenger App:**
```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Android APK
eas build --platform android --profile preview

# iOS Simulator
eas build --platform ios --profile preview
```

**Driver App:**
```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"

# Android APK
eas build --platform android --profile preview

# iOS Simulator
eas build --platform ios --profile preview
```

**Results:**
- ✅ Android: Gets an `.apk` file that can be installed on any Android device
- ✅ iOS: Gets a simulator build for testing on Mac

---

### Option 2: Production Build (For App Stores)

**Purpose:** Official builds for Google Play Store and Apple App Store

**Passenger App:**
```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Android App Bundle (for Play Store)
eas build --platform android --profile production

# iOS App (for App Store)
eas build --platform ios --profile production
```

**Driver App:**
```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"

# Android App Bundle (for Play Store)
eas build --platform android --profile production

# iOS App (for App Store)
eas build --platform ios --profile production
```

**Results:**
- ✅ Android: Gets an `.aab` file for Google Play Store submission
- ✅ iOS: Gets an `.ipa` file for App Store Connect submission

---

### Option 3: Build Both Platforms Simultaneously

**Passenger App:**
```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
eas build --platform all --profile preview
```

**Driver App:**
```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"
eas build --platform all --profile preview
```

---

## 🚀 QUICK START - BUILD NOW

### Step 1: Build Android APKs for Testing (Fastest)

**Run these commands to build both apps for Android:**

```powershell
# Passenger App
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
eas build --platform android --profile preview

# Driver App
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"
eas build --platform android --profile preview
```

**Build Time:** 10-15 minutes per app  
**Result:** Two `.apk` files ready to install on Android devices

---

### Step 2: Download & Install APKs

After build completes:

1. **Download Links:**
   - EAS will provide download links in the terminal
   - Links are also available at: https://expo.dev/accounts/[your-account]/projects

2. **Install on Android Device:**
   - Download the APK files to your phone
   - Enable "Install from Unknown Sources" in Settings
   - Tap the APK file to install
   - Open the app and check Settings → About App

---

## 📱 TESTING THE ABOUT SECTION

After installing the apps:

### Passenger App Test:
1. Open **Run Run Passenger** app
2. Navigate to **Profile** or **Settings** tab
3. Scroll down to **About App** section
4. Verify all information displays correctly:
   - ✅ App Version: 1.0
   - ✅ Developer: Edivaldo Cardoso
   - ✅ Title: Founder & Lead Developer
   - ✅ Company: Run-Run Guiné-Bissau
   - ✅ Email: suporte@runrungb.com (in orange)

### Driver App Test:
1. Open **Run Run Driver** app
2. Navigate to **Settings** tab
3. Scroll down to **About App** section
4. Verify all information displays correctly (same as above)

---

## 🍎 iOS BUILD REQUIREMENTS

### For iOS Builds, You Need:

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com
   - Needed for both simulator and device builds

2. **App Store Connect Access**
   - Create app listings
   - Manage certificates and provisioning profiles

3. **Mac Computer** (for local builds)
   - Or use EAS Build cloud service (no Mac needed!)

### EAS Build Advantages for iOS:
- ✅ No need for a Mac computer
- ✅ EAS handles all certificates and provisioning
- ✅ Cloud-based builds run on Expo's servers
- ✅ Just need Apple Developer account credentials

---

## 📊 BUILD STATUS MONITORING

### Check Build Progress:

1. **In Terminal:**
   - Build progress shows in real-time
   - Estimated time displayed

2. **On Expo Dashboard:**
   - Visit: https://expo.dev
   - Go to your project
   - Click "Builds" tab
   - See all builds (queued, in progress, completed)

3. **Build Logs:**
   - Click on any build to see detailed logs
   - Useful for debugging build errors

---

## 🔧 TROUBLESHOOTING

### Common Issues:

#### 1. "Not logged in to Expo"
```powershell
eas login
```
Enter your Expo account credentials

#### 2. "Project not initialized"
```powershell
cd [app-directory]
eas init
```
Follow prompts to link project

#### 3. "Missing credentials"
For Android:
- EAS will generate a keystore automatically
- Just confirm when prompted

For iOS:
- Provide Apple Developer account email
- EAS will handle certificates

#### 4. "Build failed"
- Check build logs on Expo dashboard
- Common fixes:
  - Update `package.json` dependencies
  - Clear node_modules: `rm -rf node_modules && npm install`
  - Check `app.json` configuration

---

## 📦 BUILD ARTIFACTS

### After Successful Build:

**Android (.apk):**
- File size: ~50-80 MB
- Can install directly on any Android device
- No Google Play Store required for testing

**Android (.aab):**
- File size: ~40-60 MB (smaller than APK)
- Required for Google Play Store submission
- Cannot install directly on devices

**iOS (.ipa for device):**
- File size: ~60-90 MB
- Needs Apple Developer certificate
- Can install on registered test devices

**iOS (simulator build):**
- File size: ~100-150 MB
- Only works on iOS Simulator (Mac required)
- Good for development testing

---

## 🏪 APP STORE SUBMISSION (Future Step)

### Google Play Store:

1. **Create Developer Account** ($25 one-time fee)
   - https://play.google.com/console

2. **Create App Listing:**
   - App name, description, screenshots
   - Privacy policy URL
   - Contact information

3. **Upload AAB File:**
   - Build with `eas build --platform android --profile production`
   - Upload the `.aab` file
   - Fill out content ratings, pricing

4. **Submit for Review:**
   - Takes 1-7 days typically

### Apple App Store:

1. **Create App Store Connect Listing:**
   - https://appstoreconnect.apple.com
   - App name, description, screenshots
   - Privacy policy, support URL

2. **Upload IPA File:**
   - Build with `eas build --platform ios --profile production`
   - Or use `eas submit` to automatically upload

3. **Submit for Review:**
   - Takes 1-3 days typically
   - Apple review is more strict than Google

---

## 📝 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| **1.0** | January 8, 2026 | Initial release with About App section |

---

## 🎯 NEXT STEPS

### Immediate:
1. ✅ About section added to both apps
2. ⏳ Run EAS build for Android APKs
3. ⏳ Test on physical Android devices
4. ⏳ Verify About section displays correctly

### This Week:
- Build iOS versions (if Apple Developer account available)
- Test on iOS devices/simulator
- Gather feedback from team
- Prepare app store assets (screenshots, descriptions)

### Next 2 Weeks:
- Create Google Play Store developer account
- Create App Store Connect account (if not done)
- Prepare marketing materials
- Submit to app stores

---

## 📧 SUPPORT

If you encounter issues during the build process:

**Expo EAS Documentation:**
- https://docs.expo.dev/build/introduction/
- https://docs.expo.dev/build-reference/eas-json/

**Expo Forums:**
- https://forums.expo.dev/

**Run-Run Support:**
- Email: suporte@runrungb.com
- Developer: Edivaldo Cardoso

---

**Document Created:** January 8, 2026  
**Status:** About Section Added ✅ | Ready to Build 🚀  
**Developer:** Edivaldo Cardoso | suporte@runrungb.com | +245 955 971 275
