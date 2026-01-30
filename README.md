# Run Run Passenger App 🚗

The official Run Run passenger application for Guinea-Bissau.

## Features

✅ **13 Complete Screens**
- Welcome & Language Selection (PT/EN/FR)
- Login & Registration with OTP
- Home Dashboard
- Book Ride (Text-based)
- Active Ride Tracking
- Payment Methods Management
- Profile Management
- Trip History
- Settings
- Support

✅ **Payment Methods**
- Visa & Mastercard
- Orange Money (+245)
- MTN Mobile Money (+245)

✅ **Vehicle Types**
- 🏍️ Moto (500 XOF base)
- 🚗 Normal Car (1,000 XOF base)
- 🚙 Premium Car (3,000 XOF base)

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
cd RunRunPassenger
npm install
```

2. Start the development server:
```powershell
npm start
```

3. Test on your device:
   - Install **Expo Go** from Play Store/App Store
   - Scan the QR code shown in terminal
   - App will load on your device

## Backend Configuration

The app connects to:
```
https://zippy-healing-production-24e4.up.railway.app/api
```

To change the backend URL, edit:
```
RunRunPassenger/src/services/api.js
```

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
RunRunPassenger/assets/icon.png
```

## Project Structure

```
RunRunPassenger/
├── App.js                 # Main navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── src/
│   ├── screens/         # 13 screens
│   ├── services/        # API client
│   └── i18n/           # Translations (PT/EN/FR)
└── assets/             # Images & icons
```

## Key Screens

1. **WelcomeScreen** - Language selection
2. **LoginScreen** - Phone + password
3. **RegisterScreen** - New account creation
4. **HomeScreen** - Main dashboard
5. **BookRideScreen** - Request rides
6. **ActiveRideScreen** - Track current ride
7. **PaymentMethodsScreen** - Manage payments
8. **ProfileScreen** - User information
9. **TripHistoryScreen** - Past rides
10. **SettingsScreen** - App preferences
11. **SupportScreen** - Contact information

## Testing

1. Register with phone: `+245 955 971 275`
2. Create password
3. Login
4. Book a test ride
5. Add payment method

## Support

- **Office:** Avenida Principal, Bissau Center
- **Phone:** +245 955 971 275 / +245 955 981 398
- **Email:** support@runrun-gw.com
- **Hours:** Mon-Fri 8AM-6PM, Sat 9AM-2PM

## Version

**v1.0.0** - December 19, 2025
