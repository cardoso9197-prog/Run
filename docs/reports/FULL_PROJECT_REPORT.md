# Run Run - Full Project Report
## Guinea-Bissau's First Ride-Hailing Platform

**Report Date:** January 2, 2026  
**Version:** 1.0  
**Status:** ✅ PRODUCTION READY

---

## Executive Summary

Run Run is a comprehensive ride-hailing platform specifically designed for Guinea-Bissau, making it the **first ride-hailing service** in the country. The platform consists of mobile applications for both passengers and drivers (iOS and Android), a web application, an admin dashboard, and a robust backend API.

All components have been successfully developed, tested, and deployed to production environments.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [Mobile Applications](#3-mobile-applications)
4. [Web Application](#4-web-application)
5. [Backend System](#5-backend-system)
6. [Database Schema](#6-database-schema)
7. [Features & Functionality](#7-features--functionality)
8. [Payment Integration](#8-payment-integration)
9. [Security Implementation](#9-security-implementation)
10. [Deployment Status](#10-deployment-status)
11. [Testing Summary](#11-testing-summary)
12. [Maintenance & Support](#12-maintenance--support)

---

## 1. Project Overview

### 1.1 Project Information

| Attribute | Value |
|-----------|-------|
| **Project Name** | Run Run |
| **Tagline** | "Primeiro em Guiné-Bissau!" |
| **Industry** | Transportation / Ride-Hailing |
| **Target Market** | Guinea-Bissau |
| **Primary Language** | Portuguese |
| **Launch Date** | January 2026 |

### 1.2 Project Goals

1. **Primary Goal:** Launch Guinea-Bissau's first ride-hailing platform
2. **User Acquisition:** Onboard 1,000+ passengers and 200+ drivers in Year 1
3. **Market Coverage:** Cover all major areas in Bissau initially
4. **Service Quality:** Maintain 4.5+ star average rating

### 1.3 Brand Identity

- **Primary Color:** Orange (#FF6B00)
- **Secondary Color:** Black (#000000)
- **Logo:** Run Run circular logo with motion effect
- **Slogan:** "Run Run - Primeiro em Guiné-Bissau!"

---

## 2. Technical Architecture

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Passenger App  │   Driver App    │         Web App             │
│  (iOS/Android)  │  (iOS/Android)  │     (Next.js 14)            │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                       │
         └─────────────────┼───────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   API Layer │
                    │  (Node.js)  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐
        │ PostgreSQL│ │ Socket  │ │  Redis    │
        │ Database  │ │   .IO   │ │  Cache    │
        └───────────┘ └─────────┘ └───────────┘
```

### 2.2 Technology Stack

#### Mobile Applications
| Component | Technology |
|-----------|------------|
| Framework | React Native (Expo SDK 51) |
| Language | TypeScript |
| State Management | React Context API |
| Navigation | Expo Router |
| Maps | React Native Maps |
| Location | Expo Location |
| Build System | EAS Build |

#### Web Application
| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Date Handling | date-fns |

#### Backend
| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| Real-time | Socket.IO |
| Authentication | JWT |
| Hosting | Railway |

### 2.3 Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Backend Hosting | Railway | API & Database |
| Mobile Builds | Expo EAS | iOS & Android builds |
| Web Hosting | TBD (Vercel/Netlify) | Web application |
| Domain | runrungb.com | Primary domain |

---

## 3. Mobile Applications

### 3.1 Passenger App (Run Run)

#### Build Status
| Platform | Status | Build Type |
|----------|--------|------------|
| iOS | ✅ Built & Tested | Preview/Production |
| Android | ✅ Built & Tested | APK/AAB |

#### Features
- User registration & authentication
- Phone number verification
- Real-time ride booking
- Multiple vehicle types (Moto, Normal, Premium)
- Live driver tracking on map
- Fare estimation before booking
- Multiple payment methods
- Ride history
- Driver rating system
- In-app support chat
- Push notifications

#### Screens
1. Splash Screen
2. Onboarding (3 slides)
3. Login / Register
4. Phone Verification
5. Home (Map + Destination Input)
6. Ride Options (Vehicle Selection)
7. Driver Search
8. Ride in Progress
9. Ride Completed (Rating)
10. Ride History
11. Profile Settings
12. Payment Methods
13. Support / Help

### 3.2 Driver App (Run Run Motorista)

#### Build Status
| Platform | Status | Build Type |
|----------|--------|------------|
| iOS | ✅ Built & Tested | Preview/Production |
| Android | ✅ Built & Tested | APK/AAB |

#### Features
- Driver registration & verification
- Document upload system
- Online/Offline toggle
- Real-time ride requests
- Navigation to pickup & destination
- Earnings dashboard
- Daily/Weekly/Monthly reports
- Passenger rating system
- In-app support
- Push notifications

#### Screens
1. Splash Screen
2. Onboarding
3. Login / Register
4. Document Upload
5. Verification Pending
6. Home (Online/Offline)
7. Incoming Ride Request
8. Navigate to Pickup
9. Ride in Progress
10. Ride Completed
11. Earnings Dashboard
12. Ride History
13. Profile & Documents
14. Support / Help

---

## 4. Web Application

### 4.1 Public Website (runrungb.com)

#### Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero, features, FAQ |
| `/motorista` | Driver Registration | Full driver signup with document upload |
| `/contato` | Contact | Contact form and information |
| `/sobre` | About | Company information |
| `/privacidade` | Privacy Policy | Data privacy policy |
| `/termos` | Terms of Service | Terms and conditions |

#### Features
- Responsive design (Mobile-first)
- Dark theme (Black + Orange)
- Interactive FAQ section
- 24/7 Support chat widget
- App download links
- Driver registration form with:
  - Personal information
  - Vehicle information
  - Document uploads (10+ documents)
  - Profile photo
  - 4 vehicle photos

### 4.2 Admin Dashboard (`/admin`)

#### Features
| Section | Functionality |
|---------|---------------|
| Dashboard Overview | Stats, charts, quick actions |
| User Management | View/edit passengers |
| Driver Management | View/activate/deactivate drivers |
| Ride Management | Monitor all rides |
| Support Tickets | Handle customer issues |
| Settings | System configuration |
| Alerts | System notifications |

#### Metrics Displayed
- Total Users
- Total Drivers
- Total Rides
- Revenue
- Active Rides
- Pending Driver Approvals
- Support Tickets

---

## 5. Backend System

### 5.1 API Endpoints

#### Authentication
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/verify       - Phone verification
POST /api/auth/refresh      - Token refresh
```

#### Passengers
```
GET  /api/passengers/profile     - Get profile
PUT  /api/passengers/profile     - Update profile
GET  /api/passengers/rides       - Ride history
POST /api/passengers/rides       - Request ride
```

#### Drivers
```
GET  /api/drivers/profile        - Get profile
PUT  /api/drivers/profile        - Update profile
POST /api/drivers/documents      - Upload documents
PUT  /api/drivers/status         - Toggle online/offline
GET  /api/drivers/earnings       - Get earnings
GET  /api/drivers/rides          - Ride history
```

#### Rides
```
POST /api/rides/estimate         - Get fare estimate
POST /api/rides/request          - Request ride
PUT  /api/rides/:id/accept       - Driver accepts
PUT  /api/rides/:id/start        - Start ride
PUT  /api/rides/:id/complete     - Complete ride
PUT  /api/rides/:id/cancel       - Cancel ride
PUT  /api/rides/:id/rate         - Rate ride
```

#### Admin
```
GET  /api/admin/dashboard        - Dashboard stats
GET  /api/admin/users            - List users
GET  /api/admin/drivers          - List drivers
PUT  /api/admin/drivers/:id/activate - Activate driver
GET  /api/admin/rides            - List rides
GET  /api/admin/support          - Support tickets
```

### 5.2 Real-time Events (Socket.IO)

```
driver:location        - Driver location updates
ride:requested         - New ride request
ride:accepted          - Driver accepted ride
ride:arrived           - Driver arrived at pickup
ride:started           - Ride started
ride:completed         - Ride completed
ride:cancelled         - Ride cancelled
```

---

## 6. Database Schema

### 6.1 Core Tables

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100),
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'passenger',
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Drivers
```sql
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  license_number VARCHAR(50),
  license_expiry DATE,
  vehicle_type VARCHAR(20),
  vehicle_brand VARCHAR(50),
  vehicle_model VARCHAR(50),
  vehicle_year INTEGER,
  vehicle_plate VARCHAR(20),
  vehicle_color VARCHAR(30),
  is_active BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Rides
```sql
CREATE TABLE rides (
  id SERIAL PRIMARY KEY,
  passenger_id INTEGER REFERENCES users(id),
  driver_id INTEGER REFERENCES drivers(id),
  pickup_address VARCHAR(255),
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  destination_address VARCHAR(255),
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  vehicle_type VARCHAR(20),
  estimated_fare DECIMAL(10, 2),
  final_fare DECIMAL(10, 2),
  distance_km DECIMAL(10, 2),
  duration_min INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(20),
  payment_status VARCHAR(20) DEFAULT 'pending',
  passenger_rating INTEGER,
  driver_rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

#### Driver Documents
```sql
CREATE TABLE driver_documents (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER REFERENCES drivers(id),
  document_type VARCHAR(50),
  document_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);
```

---

## 7. Features & Functionality

### 7.1 Passenger Features

| Feature | Status | Description |
|---------|--------|-------------|
| Registration | ✅ | Phone-based registration |
| Ride Booking | ✅ | Book rides with destination |
| Vehicle Selection | ✅ | Moto, Normal, Premium options |
| Fare Estimation | ✅ | Price shown before booking |
| Live Tracking | ✅ | Real-time driver location |
| Payment Options | ✅ | Card, Orange Money, MTN MoMo |
| Ride History | ✅ | View past rides |
| Rating System | ✅ | Rate drivers 1-5 stars |
| Support Chat | ✅ | In-app support |

### 7.2 Driver Features

| Feature | Status | Description |
|---------|--------|-------------|
| Registration | ✅ | Full registration with documents |
| Document Upload | ✅ | Upload all required documents |
| Verification | ✅ | Admin approval system |
| Online Toggle | ✅ | Go online/offline |
| Ride Requests | ✅ | Accept/reject rides |
| Navigation | ✅ | Navigate to pickup/destination |
| Earnings | ✅ | View earnings dashboard |
| Rating System | ✅ | Rate passengers |

### 7.3 Admin Features

| Feature | Status | Description |
|---------|--------|-------------|
| Dashboard | ✅ | Overview statistics |
| User Management | ✅ | Manage passengers |
| Driver Management | ✅ | Approve/manage drivers |
| Ride Monitoring | ✅ | Monitor all rides |
| Support Tickets | ✅ | Handle support requests |
| Settings | ✅ | System configuration |

---

## 8. Payment Integration

### 8.1 Supported Payment Methods

| Method | Status | Description |
|--------|--------|-------------|
| Card | ✅ Active | Credit/Debit card payment |
| Orange Money | ✅ Active | Mobile money payment |
| MTN MoMo | ✅ Active | Mobile money payment |

### 8.2 Pricing Structure

#### Base Fares
| Vehicle Type | Base Fare (XOF) | Per KM (XOF) |
|--------------|-----------------|--------------|
| Moto | 300 | 200 |
| Normal (Car) | 500 | 300 |
| Premium | 800 | 450 |

#### Minimum Fare
- Moto: 500 XOF
- Normal: 1,000 XOF
- Premium: 1,500 XOF

---

## 9. Security Implementation

### 9.1 Authentication
- JWT-based authentication
- Token refresh mechanism
- Phone number verification
- Password hashing (bcrypt)

### 9.2 Data Protection
- HTTPS encryption
- Input validation & sanitization
- SQL injection prevention
- XSS protection

### 9.3 Privacy
- GDPR-compliant data handling
- User data encryption
- Privacy policy compliance
- Data deletion on request

---

## 10. Deployment Status

### 10.1 Current Status

| Component | Environment | Status | URL |
|-----------|-------------|--------|-----|
| Backend API | Railway | ✅ Live | Production URL |
| Database | Railway PostgreSQL | ✅ Live | Connected |
| Web App | Netlify | ✅ Live | https://runrunwebapp.netlify.app |
| Admin Dashboard | Netlify | ✅ Live | https://runrunwebapp.netlify.app/admin |
| Passenger App (iOS) | EAS Build | ✅ Built | App Store Ready |
| Passenger App (Android) | EAS Build | ✅ Built | Play Store Ready |
| Driver App (iOS) | EAS Build | ✅ Built | App Store Ready |
| Driver App (Android) | EAS Build | ✅ Built | Play Store Ready |

### 10.2 Pending Deployments

| Task | Priority | Status |
|------|----------|--------|
| iOS Apps to App Store | High | Ready to Submit |
| Android Apps to Play Store | High | Ready to Submit |
| Custom Domain Setup | Medium | Pending |

---

## 11. Testing Summary

### 11.1 Testing Completed

| Test Type | Status | Coverage |
|-----------|--------|----------|
| Unit Tests | ✅ | Core functions |
| Integration Tests | ✅ | API endpoints |
| Mobile App Testing | ✅ | All screens |
| Backend API Testing | ✅ | All endpoints |
| Database Testing | ✅ | CRUD operations |
| Real-time Testing | ✅ | Socket.IO events |

### 11.2 Test Results

- **Passenger App:** All features working ✅
- **Driver App:** All features working ✅
- **Web App:** All pages functional ✅
- **Backend API:** All endpoints responding ✅
- **Database:** All queries executing ✅

---

## 12. Maintenance & Support

### 12.1 Contact Information

| Contact | Value |
|---------|-------|
| Email | admin@runrungb.com |
| Phone 1 | +245 955 971 275 |
| Phone 2 | +245 955 981 398 |
| WhatsApp | +245 955 971 275 |

### 12.2 Support Hours
- **Customer Support:** 24/7
- **Technical Support:** 24/7
- **Admin Dashboard:** Always accessible

### 12.3 Monitoring
- Server uptime monitoring
- Error logging & alerts
- Performance metrics
- User activity tracking

---

## Appendix

### A. File Structure

```
Run-Run GW/
├── RunRunPassenger/          # Passenger mobile app
│   ├── app/                  # Expo Router screens
│   ├── components/           # Reusable components
│   ├── services/             # API services
│   └── assets/               # Images & fonts
│
├── RunRunDriver/             # Driver mobile app
│   ├── app/                  # Expo Router screens
│   ├── components/           # Reusable components
│   ├── services/             # API services
│   └── assets/               # Images & fonts
│
├── runrun-web/               # Web application
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   └── components/       # React components
│   └── public/               # Static assets
│
├── backend/                  # Backend API
│   ├── routes/               # API routes
│   ├── middleware/           # Auth middleware
│   ├── database/             # DB configuration
│   └── utils/                # Utilities
│
└── docs/                     # Documentation
    ├── guides/               # User guides
    └── reports/              # Project reports
```

### B. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2026 | Initial release |

---

**Document prepared by:** Run Run Development Team  
**Last updated:** January 2, 2026

---

© 2026 Run Run. All rights reserved.
