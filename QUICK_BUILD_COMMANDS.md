# 🚀 Quick APK Build Commands - Run-Run

## For Edivaldo - Quick Reference

### Step 1: Build Passenger App APK (15-30 min)

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"

# Login to EAS (first time only)
npx eas-cli login

# Build production APK
npx eas-cli build --platform android --profile production

# Wait for build to complete...
# Download link will be provided at the end
```

### Step 2: Build Driver App APK (15-30 min)

```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"

# Build production APK
npx eas-cli build --platform android --profile production

# Wait for build to complete...
```

### Step 3: Update QR Codes

After getting APK download URLs from EAS:

1. Open: `generate-qr-codes.js`
2. Update URLs:
```javascript
const APK_URLS = {
  passenger: 'PASTE_PASSENGER_APK_URL_HERE',
  driver: 'PASTE_DRIVER_APK_URL_HERE',
};
```
3. Run:
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW"
node generate-qr-codes.js
```
4. QR codes will be in `qr-codes/` folder

### Step 4: Upload to Website

1. Upload APK files (if hosting yourself)
2. Upload QR code images from `qr-codes/` folder
3. Update download page at https://runrungw.com/

---

## Alternative: Local Build (Faster but more complex)

```powershell
# Passenger App
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npx expo install expo-dev-client
npx expo run:android --variant release

# Driver App
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"
npx expo run:android --variant release
```

---

## After Builds Complete

Check build status:
- Visit: https://expo.dev/accounts/[your-account]/builds

Download APKs:
- Click on completed builds
- Download `.apk` files
- Save to: `C:\Users\Colondo Full service\Desktop\Run-Run GW\apks\`

---

## Need Help?

Refer to: `BUILD_APKS_GUIDE.md` for detailed instructions
