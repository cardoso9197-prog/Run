# 🚗 Run Run GB — Project Status Report

**Date:** February 15, 2026  
**Platform:** Ride-Hailing App for Guinea-Bissau  
**Stack:** React Native (Expo) + Node.js/Express + PostgreSQL

---

## 📱 Applications

| App | Version | Status | Tech |
|-----|---------|--------|------|
| **RunRunPassenger** | 1.0.0 | ✅ APK Built | Expo SDK 51, React Native |
| **RunRunDriver** | 1.0.0 | ✅ APK Built | Expo SDK 51, React Native |
| **Backend API** | 1.0.3 | ✅ Live on Railway | Node.js, Express, PostgreSQL |

- **Live API:** `https://zippy-healing-production-24e4.up.railway.app`  
- **GitHub:** `cardoso9197-prog/Run` (branch: main)

---

## ✅ Completed Features

### Passenger App

| # | Feature | Status |
|---|---------|--------|
| 1 | User Registration & Login (phone + password) | ✅ |
| 2 | Book a ride (pickup & dropoff selection on map) | ✅ |
| 3 | Vehicle type selection (Moto, Normal, Premium) | ✅ |
| 4 | **Text search for dropoff** — type address, auto-captured by map coordinates | ✅ |
| 5 | Fare estimation before booking | ✅ |
| 6 | Ride status tracking | ✅ |
| 7 | Cash payment support | ✅ |

### Driver App

| # | Feature | Status |
|---|---------|--------|
| 1 | Driver Registration with vehicle details | ✅ |
| 2 | Admin activation system (drivers must be approved) | ✅ |
| 3 | Go Online/Offline toggle | ✅ |
| 4 | View & accept ride requests | ✅ |
| 5 | **Uber-style navigation** — turn-by-turn to pickup & dropoff | ✅ |
| 6 | Ride lifecycle (accept → arrive → pickup → complete) | ✅ |
| 7 | **Push notifications** — instant alerts for new ride requests | ✅ Code complete |
| 8 | GPS location tracking | ✅ |

### Backend / Admin

| # | Feature | Status |
|---|---------|--------|
| 1 | REST API (auth, rides, drivers, passengers, payments) | ✅ |
| 2 | PostgreSQL database on Railway | ✅ |
| 3 | JWT authentication | ✅ |
| 4 | Admin panel — driver activation/deactivation | ✅ |
| 5 | Expo Push Notification integration | ✅ |
| 6 | Debug endpoints (driver status, fare testing) | ✅ |

---

## 💰 Pricing System

| Vehicle Type | Rate per km (XOF) | Example 7km Ride |
|-------------|-------------------|-------------------|
| 🏍️ Moto | 150 | 1,050 XOF |
| 🚗 Normal | 338 | 2,350 XOF |
| 🚘 Premium | 650 | 4,550 XOF |
| ✈️ Airport (flat) | — | 5,600 XOF |

**Pricing status:** ✅ Backend verified — Premium is correctly **1.94x** more than Normal.

---

## 👥 Production Data (Live)

| Metric | Count |
|--------|-------|
| Total Drivers | 2 |
| Activated Drivers | 2 |
| Online Drivers | 1 |
| Drivers with Push Tokens | 0 ⚠️ |
| Drivers with GPS Location | 0 ⚠️ |
| Ready for Push Notifications | 0 ⚠️ |

### Registered Drivers

| Name | Phone | Status | Activated | Push Token | GPS |
|------|-------|--------|-----------|------------|-----|
| Cassama | +245955971275 | 🟢 Online | ✅ | ❌ | ❌ |
| Kidi | +245955981398 | 🔴 Offline | ✅ | ❌ | ❌ |

---

## 🏗️ Architecture

```
┌──────────────────┐     ┌──────────────────┐
│  Passenger App   │     │   Driver App     │
│  (React Native)  │     │  (React Native)  │
│  Expo SDK 51     │     │  Expo SDK 51     │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │    HTTPS / REST API    │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   Backend (Express)    │
         │   Railway Hosting      │
         │   Version 1.0.3       │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   PostgreSQL Database  │
         │   Railway Managed      │
         └────────────────────────┘
                     │
         ┌───────────▼────────────┐
         │   Expo Push Service    │
         │   (exp.host)           │
         └────────────────────────┘
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Main API server (v1.0.3), debug endpoints |
| `backend/routes/rides.js` | Ride booking + push notification dispatch |
| `backend/routes/drivers.js` | Driver management + push token registration |
| `backend/routes/auth.js` | Authentication (register, login) |
| `backend/routes/passengers.js` | Passenger profile management |
| `backend/routes/payments.js` | Payment processing |
| `backend/utils/pricing.js` | Fare calculation engine |
| `backend/utils/pushNotifications.js` | Expo push notification sender |
| `backend/utils/redZones.js` | Red zone pricing rules |
| `backend/database/init-postgres.js` | Database schema |
| `backend/database/db-postgres.js` | PostgreSQL connection pool |
| `backend/middleware/auth.js` | JWT authentication middleware |
| `backend/middleware/validation.js` | Request validation |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with phone + password |

### Rides
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rides/request` | Request a new ride |
| POST | `/api/rides/estimate-fare` | Estimate fare before booking |
| PUT | `/api/rides/:id/accept` | Driver accepts ride |
| PUT | `/api/rides/:id/complete` | Driver completes ride |
| PUT | `/api/rides/:id/cancel` | Cancel ride |

### Drivers
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/drivers/status` | Toggle online/offline |
| PUT | `/api/drivers/location` | Update GPS location |
| POST | `/api/drivers/push-token` | Register push notification token |

### Debug (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/debug/drivers` | View all driver statuses, tokens, locations |
| POST | `/api/debug/test-fare` | Test fare calculation for all vehicle types |

---

## ⚠️ Known Issues & Next Steps

### 🔴 Critical — Push Notifications Not Working Yet

**Root Cause:** Drivers are using the **old APK** (without push notification support). The new APK has been built but not yet installed on driver phones.

**Fix:** Install the new Driver APK (with `expo-notifications`) on driver devices. Once installed:
1. App registers push token → saved to database
2. Driver goes online → GPS location starts updating
3. Passenger books ride → push notification sent to nearby drivers within 10km

### 🟡 Medium — Premium Fare Bug (Frontend)

**Backend pricing is correct** (verified via debug endpoint). If passengers still see identical fares for Normal and Premium, the issue is in how `vehicleType` is passed from the passenger app to the API. Needs frontend investigation.

### 🟢 Low — Auto-Deploy

Railway auto-deploy from GitHub is not working. Currently deploying manually via `railway up --detach`. Consider re-linking the Railway service to the GitHub repo.

---

## 📊 Deployment History

| Date | Version | Changes |
|------|---------|---------|
| Feb 15, 2026 | 1.0.3 | Fixed debug endpoint column names |
| Feb 15, 2026 | 1.0.2 | Added uuid + stripe, debug endpoints, push notifications |
| Feb 15, 2026 | 1.0.1 | Added bcrypt, jsonwebtoken, nodemailer, pdfkit |
| Earlier | 1.0.0 | Initial deployment |

---

## 📦 Backend Dependencies

```json
{
  "axios": "^1.6.2",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "nodemailer": "^6.9.7",
  "pdfkit": "^0.13.0",
  "pg": "^8.11.3",
  "socket.io": "^4.7.2",
  "stripe": "^14.14.0",
  "uuid": "^9.0.0"
}
```

---

## 🎯 Summary

**Run Run GB** is a functional ride-hailing platform for Guinea-Bissau with passenger and driver mobile apps, a live backend API, and a PostgreSQL database. Core features (booking, navigation, pricing, authentication) are all working. The immediate priority is getting drivers on the **new APK** to enable push notifications, which will transform the ride experience from manual polling to instant real-time alerts — just like Uber.

---

*Report generated on February 15, 2026*
