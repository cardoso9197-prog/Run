# 📱 CONVERT .AAB TO APK FOR TESTING

## 🎯 GOAL
Convert the Android App Bundle (.aab) to APK format for direct installation on Android devices.

---

## 📦 CURRENT BUILD
- **Download Link**: https://expo.dev/artifacts/eas/3EQohdBiY5jTSbjSfC5NBq.aab
- **File Type**: Android App Bundle (.aab)
- **Date**: February 5, 2026

---

## 🛠️ METHOD 1: Using Bundletool (Official Google Tool)

### **Step 1: Install Bundletool**
```powershell
# Download bundletool from GitHub
# https://github.com/google/bundletool/releases

# Or if you have Java installed, download the .jar file
```

### **Step 2: Download Your App Bundle**
```powershell
# Download from the link above
# Save as: RunRunPassenger.aab
```

### **Step 3: Generate APKs**
```powershell
# Using bundletool (requires Java)
java -jar bundletool.jar build-apks --bundle=RunRunPassenger.aab --output=RunRunPassenger.apks --mode=universal

# Extract the universal APK
# The .apks file is actually a ZIP file containing the APK
```

### **Step 4: Extract APK**
```powershell
# Rename .apks to .zip and extract
Rename-Item RunRunPassenger.apks RunRunPassenger.zip
Expand-Archive RunRunPassenger.zip -DestinationPath extracted
# Universal APK will be in: extracted/universal.apk
```

---

## 🛠️ METHOD 2: Using Online Converter (Easiest)

### **Option A: APK-Builder.com**
1. Go to: https://www.apk-builder.com/aab-to-apk
2. Upload your .aab file
3. Click "Convert to APK"
4. Download the generated APK

### **Option B: AppToolkit.net**
1. Go to: https://apptoolkit.net/aab-to-apk
2. Upload the .aab file
3. Convert and download APK

---

## 🛠️ METHOD 3: Using EAS Build with APK Profile

### **Update eas.json to Build APK Directly**
```json
{
  "build": {
    "production-apk": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### **Run Build Command**
```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
eas build --platform android --profile production-apk
```

---

## 🚀 QUICK START: Let's Build APK Directly

Since you need an APK for testing, let's modify the `eas.json` and build an APK directly!

### **Current eas.json Issue:**
The production profile builds `.aab` (App Bundle) which is for Play Store.

### **Solution:**
We'll use the existing `preview` profile which already builds APK!

---

## ✅ RECOMMENDED APPROACH

Use the **preview profile** which already builds APK:

```powershell
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
eas build --platform android --profile preview
```

This will:
- ✅ Build an APK (not .aab)
- ✅ Make it ready for direct installation
- ✅ Same code as production (with new pricing)
- ✅ Perfect for testing before Play Store release

---

## 📱 INSTALLATION GUIDE

### **After Getting APK:**

1. **Enable Unknown Sources** on Android device:
   - Settings → Security → Unknown Sources → Enable

2. **Transfer APK** to device:
   - AirDrop, email, or USB transfer

3. **Install APK**:
   - Tap the APK file
   - Follow installation prompts
   - App will be installed as "Run-Run Passenger"

4. **Test Features**:
   - ✅ No red zone warnings
   - ✅ Airport detection modal
   - ✅ Per-km rate display (150, 338, 550)
   - ✅ Airport flat rate (5600 XOF)

---

## 🎯 NEXT STEPS

1. **Choose Method**:
   - Quick: Build with preview profile (recommended)
   - Alternative: Download .aab and convert online
   - Advanced: Use bundletool locally

2. **Test APK**:
   - Install on device
   - Test all booking flows
   - Verify pricing calculations

3. **Distribute**:
   - Share APK with team/users
   - Collect feedback
   - Monitor performance

---

## 🔧 TROUBLESHOOTING

### **Java Not Installed (for bundletool)**
```powershell
# Check Java
java -version

# If not installed, download from:
# https://www.java.com/download/
```

### **Bundletool Permission Errors**
```powershell
# Make sure you have write permissions
# Run PowerShell as Administrator if needed
```

### **APK Installation Fails**
- Enable "Install from Unknown Sources"
- Check Android version compatibility
- Ensure device has enough storage

---

## ✅ RECOMMENDED ACTION NOW

Let me build an APK directly using the preview profile!
