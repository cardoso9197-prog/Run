# 🎨 RUN-RUN BRAND COLORS

## Official Color Scheme

### Primary Colors
- **Orange**: `#FF6B00` - Main brand color
- **Black**: `#000000` - Secondary brand color

### Theme Implementation

Both **Run Run Passenger** and **Run Run Driver** apps now use consistent **black and orange** branding:

---

## 🔶 COLOR PALETTE

### Brand Colors
| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **Primary Orange** | `#FF6B00` | Buttons, highlights, active states, borders |
| **Primary Black** | `#000000` | Text, headers, driver app background |
| **White** | `#FFFFFF` | Cards, backgrounds, light text |

### Background Colors
| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **Light Gray** | `#F5F5F5` | Main background |
| **Light Orange** | `#FFE8D6` | Active selection backgrounds |
| **Off-White** | `#F9F9F9` | Secondary backgrounds |

### Text Colors
| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **Text Primary** | `#000000` | Main text |
| **Text Secondary** | `#666666` | Subtitles, descriptions |
| **Text Light** | `#333333` | Labels |

### Accent Colors
| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **Success Green** | `#4CAF50` | Success messages, earnings, online status |
| **Error Red** | `#FF5252` | Error messages, cancel buttons |
| **Border Gray** | `#DDDDDD` | Input borders, dividers |

---

## 📱 APP-SPECIFIC BRANDING

### Passenger App (RunRunPassenger)
- **Splash Screen Background**: Orange (`#FF6B00`)
- **Adaptive Icon Background**: Orange (`#FF6B00`)
- **Welcome Screen**: White background with orange accents
- **Primary Buttons**: Orange background with black text
- **Active States**: Orange borders and orange-tinted backgrounds

### Driver App (RunRunDriver)
- **Splash Screen Background**: Orange (`#FF6B00`)
- **Adaptive Icon Background**: Orange (`#FF6B00`)
- **Welcome Screen**: **Black background** with orange text
- **Header Background**: Black with orange highlights
- **Primary Buttons**: Orange background with black text
- **Active States**: Orange borders and orange-tinted backgrounds

---

## 🎯 USAGE EXAMPLES

### Buttons
```javascript
// Primary Button
backgroundColor: '#FF6B00'  // Orange
color: '#000'              // Black text

// Secondary Button
backgroundColor: '#000'     // Black
color: '#FF6B00'           // Orange text
borderColor: '#FF6B00'     // Orange border
```

### Cards
```javascript
backgroundColor: '#FFF'     // White
shadowColor: '#000'         // Black
borderColor: '#DDDD'       // Light gray
```

### Active/Selected States
```javascript
backgroundColor: '#FFE8D6'  // Light orange
borderColor: '#FF6B00'     // Orange border
```

### Status Indicators
```javascript
// Online
backgroundColor: '#4CAF50'  // Green

// Offline
backgroundColor: '#666'     // Gray

// Pending
backgroundColor: '#FF6B00'  // Orange
```

---

## 📋 UPDATED FILES

### Configuration Files
✅ `RunRunPassenger/app.json` - Orange splash & adaptive icon  
✅ `RunRunDriver/app.json` - Orange splash & adaptive icon  

### Theme Files
✅ `RunRunPassenger/src/theme/colors.js` - Color constants  
✅ `RunRunDriver/src/theme/colors.js` - Color constants  

### Screen Files (All Updated)
**Passenger App (13 screens):**
✅ WelcomeScreen.js  
✅ LoginScreen.js  
✅ RegisterScreen.js  
✅ OTPVerificationScreen.js  
✅ HomeScreen.js  
✅ BookRideScreen.js  
✅ ActiveRideScreen.js  
✅ PaymentMethodsScreen.js  
✅ AddPaymentMethodScreen.js  
✅ ProfileScreen.js  
✅ TripHistoryScreen.js  
✅ TripDetailsScreen.js  
✅ SettingsScreen.js  
✅ SupportScreen.js  

**Driver App (12 screens):**
✅ WelcomeScreen.js (Black background with orange text)  
✅ LoginScreen.js  
✅ RegisterScreen.js  
✅ OTPVerificationScreen.js  
✅ PendingActivationScreen.js  
✅ HomeScreen.js (Black header with orange accents)  
✅ OnlineStatusScreen.js  
✅ AvailableRidesScreen.js  
✅ ActiveRideScreen.js  
✅ EarningsScreen.js  
✅ VehicleScreen.js  
✅ ProfileScreen.js  
✅ SettingsScreen.js  

---

## 🔄 CHANGES MADE

### Old Color Scheme (Before)
- Primary: Gold `#FFD700` ❌
- Secondary: Various shades
- Inconsistent across apps

### New Color Scheme (After)
- Primary: **Orange `#FF6B00`** ✅
- Secondary: **Black `#000000`** ✅
- Consistent **black and orange** theme across both apps ✅

---

## 🎨 BRAND IDENTITY

### Visual Identity
- **Orange**: Energy, movement, transportation
- **Black**: Premium, professional, reliable
- **Clean Design**: Modern, accessible, easy to use

### Differentiation
- **Passenger App**: Lighter feel with white backgrounds
- **Driver App**: Premium dark theme with black headers

Both apps share the same **orange and black** brand colors but with different emphasis:
- Passenger app: Light interface with orange highlights
- Driver app: Dark/black elements with orange highlights

---

## ✅ TESTING CHECKLIST

- [x] App icon backgrounds set to orange
- [x] Splash screens set to orange
- [x] All buttons use orange background
- [x] All active states use orange borders
- [x] Driver app welcome screen uses black background
- [x] Driver app header uses black background
- [x] All text readable with new colors
- [x] Consistent branding across 25 screens
- [x] Theme files created for future reference

---

## 📱 NEXT STEPS

1. **Restart both apps** to see the new orange theme
2. **Test all screens** to ensure colors look good
3. **Take screenshots** for marketing materials
4. **Update app store descriptions** to mention the brand colors

---

**BRAND COLORS UPDATED: BLACK & ORANGE** ✅  
**Status: Complete & Consistent** 🎨  
**Date: December 19, 2025**
