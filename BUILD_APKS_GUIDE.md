# 📦 Build APKs for Run-Run Mobile Apps

## Prerequisites
- EAS CLI installed globally
- Expo account configured
- Both apps configured for EAS Build

## Step 1: Install Dependencies

### Passenger App
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Install new dependencies for invoice system
npm install pdfkit nodemailer expo-file-system expo-sharing

# Update existing dependencies
npm install
```

### Driver App
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"

# Update dependencies
npm install
```

## Step 2: Update Backend Dependencies

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\backend"

# Install PDF generation and email dependencies
npm install pdfkit nodemailer

# Update all dependencies
npm install
```

## Step 3: Configure EAS Build

### For Passenger App
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Create eas.json if not exists
npx eas-cli build:configure

# Login to EAS
npx eas-cli login
```

### For Driver App
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"

# Configure EAS
npx eas-cli build:configure

# Use same account
```

## Step 4: Build Android APKs

### Build Passenger App APK
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Build production APK
npx eas-cli build --platform android --profile production

# Or build preview APK (faster, for testing)
npx eas-cli build --platform android --profile preview
```

### Build Driver App APK
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"

# Build production APK
npx eas-cli build --platform android --profile production

# Or build preview APK
npx eas-cli build --platform android --profile preview
```

## Step 5: Download APKs

After builds complete (15-30 minutes each):

1. **Visit EAS Dashboard:**
   - Go to: https://expo.dev/accounts/[your-account]/projects/runrun-passenger/builds
   - Go to: https://expo.dev/accounts/[your-account]/projects/runrun-driver/builds

2. **Download APKs:**
   - Click on completed builds
   - Download APK files
   - Save to: `C:\Users\Colondo Full service\Desktop\Run-Run GW\apks\`

## Step 6: Alternative - Local Build (Faster)

If you want to build locally without EAS:

### Passenger App
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Install expo-dev-client
npx expo install expo-dev-client

# Build locally
npx expo run:android --variant release

# APK will be in: android/app/build/outputs/apk/release/
```

### Driver App
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"

# Build locally
npx expo run:android --variant release

# APK will be in: android/app/build/outputs/apk/release/
```

## Step 7: Generate QR Codes

After getting APK download URLs, generate QR codes:

### Using Online Tool
1. Go to: https://www.qr-code-generator.com/
2. Select "URL" type
3. Enter APK download URL
4. Customize design (add Run-Run logo)
5. Download QR code image

### Or use Node.js script:
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW"

# Install qrcode package
npm install qrcode

# Create QR codes
node generate-qr-codes.js
```

## Build Status Checklist

- [ ] Passenger app dependencies installed
- [ ] Driver app dependencies installed
- [ ] Backend dependencies installed
- [ ] EAS CLI configured
- [ ] Passenger APK built successfully
- [ ] Driver APK built successfully
- [ ] APKs downloaded to local machine
- [ ] APKs uploaded to hosting (Firebase/AWS/etc)
- [ ] Download URLs obtained
- [ ] QR codes generated
- [ ] Web dashboard updated with new links

## Expected Build Times

- **EAS Cloud Build:** 15-30 minutes per app
- **Local Build:** 5-10 minutes per app (first build longer)

## Troubleshooting

### Build Failed
```powershell
# Clear cache and retry
npx expo start -c
npx eas-cli build --platform android --profile production --clear-cache
```

### Local Build Issues
```powershell
# Clear gradle cache
cd android
./gradlew clean
cd ..

# Rebuild
npx expo run:android --variant release
```

## Next Steps

After APKs are built:
1. Upload APKs to Firebase Hosting or AWS S3
2. Get public download URLs
3. Generate QR codes for each URL
4. Update web dashboard with new links and QR codes
5. Test downloads on real devices

---

**Note:** Building with EAS is recommended for production as it handles signing and optimization automatically.

**Estimated Total Time:** 1-2 hours (including both apps)
