# Run Run Driver App 🚗

The official Run Run driver application for Guinea-Bissau.

## Features

✅ **12 Complete Screens**
- Welcome & Language Selection (PT/EN/FR)
- Login & Registration with Driver Details
- **Pending Activation Screen** (Mandatory Gate)
- Home Dashboard with Online/Offline Toggle
- Available Rides List
- Active Ride Management
- Earnings Dashboard (Today/Week/Month)
- Vehicle Management
- Profile Settings

✅ **Driver Activation System**
- Mandatory office visit before going online
- Document verification required
- Contact information displayed
- Real-time activation status check

✅ **Vehicle Types**
- 🏍️ Moto
- 🚗 Normal Car
- 🚙 Premium Car

✅ **Multi-Language Support**
- 🇵🇹 Portuguese (Default)
- 🇬🇧 English
- 🇫🇷 French

## Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Install dependencies:
```powershell
cd RunRunDriver
npm install
```

2. Start the development server:
```powershell
npm start
```

3. Test on your device:
   - Install **Expo Go** from Play Store/App Store
   - Scan the QR code
   - App will load on your device

## Backend Configuration

The app connects to:
```
https://zippy-healing-production-24e4.up.railway.app/api
```

To change the backend URL, edit:
```
RunRunDriver/src/services/api.js
```

## Driver Activation Process

### 1. Register
- Download app
- Fill registration form
- Submit vehicle details
- Account created (NOT ACTIVATED)

### 2. Pending Activation Screen
- Shows required documents:
  - Driver's license
  - Vehicle registration
  - Insurance certificate
  - National ID/Passport
  - Vehicle inspection certificate
- Office information displayed
- Call office directly from app

### 3. Visit Office
- **Address:** Avenida Principal, Bissau Center
- **Phone:** +245 955 971 275 / +245 955 981 398
- **Hours:** Mon-Fri 8AM-6PM, Sat 9AM-2PM

### 4. Admin Activates
- Office staff verifies documents
- Admin activates in database
- Driver can check status in app

### 5. Go Online
- Driver refreshes app
- Account activated
- Can toggle online/offline
- Start accepting rides

## Building APK

1. Install EAS CLI:
```powershell
npm install -g eas-cli
```

2. Login to Expo:
```powershell
eas login
```

3. Build APK:
```powershell
eas build --platform android --profile preview
```

Build time: ~40 minutes

## App Icon

The app uses the Run-Run logo from:
```
../Run-Run logo.png
```

Copy this file to:
```
RunRunDriver/assets/icon.png
```

## Project Structure

```
RunRunDriver/
├── App.js                 # Main navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── src/
│   ├── screens/         # 12 screens
│   │   ├── PendingActivationScreen.js (KEY!)
│   │   ├── HomeScreen.js
│   │   ├── AvailableRidesScreen.js
│   │   └── ...
│   ├── services/        # API client
│   └── i18n/           # Translations (PT/EN/FR)
└── assets/             # Images & icons
```

## Key Screens

1. **WelcomeScreen** - Language selection
2. **LoginScreen** - Phone + password
3. **RegisterScreen** - Driver registration + vehicle
4. **PendingActivationScreen** ⚠️ - Activation gate (MANDATORY)
5. **HomeScreen** - Dashboard with online/offline toggle
6. **AvailableRidesScreen** - Accept ride requests
7. **ActiveRideScreen** - Current trip management
8. **EarningsScreen** - Financial dashboard
9. **VehicleScreen** - Vehicle information
10. **ProfileScreen** - Driver profile
11. **SettingsScreen** - App preferences

## Testing

1. Register as driver with:
   - Name: Test Driver
   - Phone: +245 955 971 275
   - Vehicle: Normal Car
   - Plate: GB-1234
   - License: DL123456

2. Login - will show **Pending Activation Screen**

3. Admin must activate via backend:
```sql
UPDATE drivers SET is_activated = true WHERE phone = '+245955971275';
```

4. Tap "Check Status" in app

5. Account activated - now can go online!

## Important Notes

⚠️ **Drivers CANNOT go online until activated**  
✅ Activation requires office visit  
✅ System ensures safety & quality control  
✅ All documents must be verified  

## Support

- **Office:** Avenida Principal, Bissau Center
- **Phone:** +245 955 971 275 / +245 955 981 398
- **Email:** drivers@runrun-gw.com
- **Hours:** Mon-Fri 8AM-6PM, Sat 9AM-2PM

## Version

**v1.0.0** - December 19, 2025

## Revenue Model

- Commission: 20% per ride
- Average daily earnings: 40,000-80,000 XOF
- Work your own hours
- Flexible schedule

---

**Developed by Colondo Full Service**  
**For Run Run Guinea-Bissau** 🇬🇼
