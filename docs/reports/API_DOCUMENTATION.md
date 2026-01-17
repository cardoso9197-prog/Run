# 🚗 RunRun Ride Booking API Documentation

**Base URL:** `https://zippy-healing-production-24e4.up.railway.app/api`

**Status:** ✅ Deployed to Railway
**Database:** ✅ PostgreSQL tables already exist
**Real-time:** ✅ Socket.IO events already implemented

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Passenger Endpoints](#passenger-endpoints)
3. [Driver Endpoints](#driver-endpoints)
4. [WebSocket Events](#websocket-events)
5. [Data Models](#data-models)

---

## 🔐 Authentication

All endpoints (except `/estimate-fare`) require JWT authentication.

**Headers Required:**
```http
Authorization: Bearer <JWT_TOKEN>
```

Get JWT token from `/api/auth/login` or `/api/auth/verify-otp`

---

## 👥 Passenger Endpoints

### 1. Estimate Fare (Public)

Calculate fare before booking a ride.

**Endpoint:** `POST /api/rides/estimate-fare`  
**Auth:** ❌ Not required

**Request Body:**
```json
{
  "pickupLatitude": 11.8636,
  "pickupLongitude": -15.5982,
  "dropoffLatitude": 11.8500,
  "dropoffLongitude": -15.5800,
  "vehicleType": "RunRun",
  "additionalStops": []
}
```

**Response:**
```json
{
  "success": true,
  "estimate": {
    "distance": 2.5,
    "duration": 5,
    "baseFare": 700,
    "distanceFare": 500,
    "durationFare": 250,
    "surgeFare": 0,
    "totalFare": 1500,
    "surgeMultiplier": 1.0
  }
}
```

---

### 2. Request Ride

Book a new ride.

**Endpoint:** `POST /api/rides/request`  
**Auth:** ✅ Required (Passenger)

**Request Body:**
```json
{
  "pickupLatitude": 11.8636,
  "pickupLongitude": -15.5982,
  "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
  "dropoffLatitude": 11.8500,
  "dropoffLongitude": -15.5800,
  "dropoffAddress": "Airport Road, Bissau",
  "vehicleType": "RunRun",
  "additionalStops": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ride requested successfully",
  "ride": {
    "id": 123,
    "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
    "dropoffAddress": "Airport Road, Bissau",
    "vehicleType": "RunRun",
    "estimatedFare": 1500,
    "estimatedDistance": 2.5,
    "estimatedDuration": 5,
    "status": "requested",
    "requestedAt": "2025-12-15T20:30:00Z"
  }
}
```

---

### 3. Get Active Ride

Get passenger's current active ride (if any).

**Endpoint:** `GET /api/rides/active`  
**Auth:** ✅ Required (Passenger)

**Response (with active ride):**
```json
{
  "success": true,
  "ride": {
    "id": 123,
    "status": "accepted",
    "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
    "dropoffAddress": "Airport Road, Bissau",
    "pickupLocation": {
      "latitude": 11.8636,
      "longitude": -15.5982
    },
    "dropoffLocation": {
      "latitude": 11.8500,
      "longitude": -15.5800
    },
    "vehicleType": "RunRun",
    "estimatedFare": 1500,
    "finalFare": null,
    "estimatedDistance": 2.5,
    "estimatedDuration": 5,
    "requestedAt": "2025-12-15T20:30:00Z",
    "acceptedAt": "2025-12-15T20:31:00Z",
    "arrivedAt": null,
    "startedAt": null,
    "completedAt": null,
    "driver": {
      "id": 45,
      "name": "João Silva",
      "photo": "https://...",
      "rating": 4.8,
      "phone": "+245955123456",
      "currentLocation": {
        "latitude": 11.8620,
        "longitude": -15.5970,
        "heading": 90,
        "speed": 35
      }
    },
    "vehicle": {
      "make": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "color": "White",
      "licensePlate": "GB-1234"
    }
  }
}
```

**Response (no active ride):**
```json
{
  "success": true,
  "ride": null
}
```

---

### 4. Cancel Ride

Cancel an active ride.

**Endpoint:** `PUT /api/rides/:id/cancel`  
**Auth:** ✅ Required (Passenger)

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ride cancelled successfully"
}
```

**Note:** Can only cancel rides with status: `requested`, `accepted`, or `arrived`

---

### 5. Get Ride History

Get passenger's past rides.

**Endpoint:** `GET /api/rides/history?page=1&limit=20&status=completed`  
**Auth:** ✅ Required (Passenger)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (default: completed & cancelled)

**Response:**
```json
{
  "success": true,
  "rides": [
    {
      "id": 120,
      "status": "completed",
      "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
      "dropoffAddress": "Airport Road, Bissau",
      "vehicleType": "RunRun",
      "estimatedFare": 1500,
      "finalFare": 1550,
      "distance": 2.7,
      "duration": 6,
      "requestedAt": "2025-12-14T15:20:00Z",
      "completedAt": "2025-12-14T15:26:00Z",
      "cancelledAt": null,
      "driver": {
        "name": "João Silva",
        "photo": "https://..."
      },
      "vehicle": {
        "make": "Toyota",
        "model": "Corolla",
        "color": "White",
        "licensePlate": "GB-1234"
      },
      "rating": 5,
      "comment": "Great driver!"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### 6. Rate Ride

Rate a completed ride.

**Endpoint:** `POST /api/rides/:id/rate`  
**Auth:** ✅ Required (Passenger)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service, very professional!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted successfully"
}
```

**Note:** Rating must be between 1-5. Can only rate completed rides.

---

## 🚕 Driver Endpoints

### 1. Get Available Rides

Get nearby ride requests waiting for drivers.

**Endpoint:** `GET /api/rides/driver/available?latitude=11.8636&longitude=-15.5982&radius=5`  
**Auth:** ✅ Required (Driver)

**Query Parameters:**
- `latitude` (required): Driver's current latitude
- `longitude` (required): Driver's current longitude
- `radius` (optional): Search radius in km (default: 5)

**Response:**
```json
{
  "success": true,
  "rides": [
    {
      "id": 123,
      "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
      "dropoffAddress": "Airport Road, Bissau",
      "pickupLocation": {
        "latitude": 11.8636,
        "longitude": -15.5982
      },
      "dropoffLocation": {
        "latitude": 11.8500,
        "longitude": -15.5800
      },
      "estimatedFare": 1500,
      "estimatedDistance": 2.5,
      "estimatedDuration": 5,
      "distanceToPickup": 0.8,
      "requestedAt": "2025-12-15T20:30:00Z",
      "passenger": {
        "name": "Maria Santos",
        "photo": "https://...",
        "rating": 4.9
      }
    }
  ]
}
```

---

### 2. Accept Ride

Accept a ride request.

**Endpoint:** `PUT /api/rides/:id/accept`  
**Auth:** ✅ Required (Driver)

**Response:**
```json
{
  "success": true,
  "message": "Ride accepted successfully",
  "ride": {
    "id": 123,
    "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
    "dropoffAddress": "Airport Road, Bissau",
    "pickupLocation": {
      "latitude": 11.8636,
      "longitude": -15.5982
    },
    "dropoffLocation": {
      "latitude": 11.8500,
      "longitude": -15.5800
    },
    "estimatedFare": 1500,
    "status": "accepted"
  }
}
```

**Note:** Driver must be "online". Driver status automatically changes to "busy".

---

### 3. Update Ride Status

Update the status of an active ride.

**Endpoint:** `PUT /api/rides/:id/status`  
**Auth:** ✅ Required (Driver)

**Request Body (Arrived at pickup):**
```json
{
  "status": "arrived"
}
```

**Request Body (Started trip):**
```json
{
  "status": "started"
}
```

**Request Body (Completed trip):**
```json
{
  "status": "completed",
  "actualDistance": 2.7,
  "actualDuration": 6
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ride status updated to completed",
  "status": "completed"
}
```

**Valid Status Transitions:**
- `accepted` → `arrived`
- `arrived` → `started`
- `started` → `completed`

**Note:** When completed, driver status changes back to "online" and payment record is created automatically.

---

### 4. Get Active Ride

Get driver's current active ride.

**Endpoint:** `GET /api/rides/driver/active`  
**Auth:** ✅ Required (Driver)

**Response:**
```json
{
  "success": true,
  "ride": {
    "id": 123,
    "status": "started",
    "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
    "dropoffAddress": "Airport Road, Bissau",
    "pickupLocation": {
      "latitude": 11.8636,
      "longitude": -15.5982
    },
    "dropoffLocation": {
      "latitude": 11.8500,
      "longitude": -15.5800
    },
    "estimatedFare": 1500,
    "finalFare": null,
    "estimatedDistance": 2.5,
    "estimatedDuration": 5,
    "acceptedAt": "2025-12-15T20:31:00Z",
    "arrivedAt": "2025-12-15T20:35:00Z",
    "startedAt": "2025-12-15T20:37:00Z",
    "passenger": {
      "name": "Maria Santos",
      "photo": "https://...",
      "rating": 4.9,
      "phone": "+245955987654"
    }
  }
}
```

---

### 5. Get Ride History

Get driver's completed rides.

**Endpoint:** `GET /api/rides/driver/history?page=1&limit=20`  
**Auth:** ✅ Required (Driver)

**Response:**
```json
{
  "success": true,
  "rides": [
    {
      "id": 120,
      "pickupAddress": "Praça dos Heróis Nacionais, Bissau",
      "dropoffAddress": "Airport Road, Bissau",
      "distance": 2.7,
      "duration": 6,
      "fare": 1550,
      "earnings": 1240,
      "completedAt": "2025-12-14T15:26:00Z",
      "passenger": {
        "name": "Maria Santos"
      },
      "rating": 5,
      "comment": "Professional driver"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

### 6. Get Earnings

Get driver's earnings summary.

**Endpoint:** `GET /api/rides/driver/earnings?period=today`  
**Auth:** ✅ Required (Driver)

**Query Parameters:**
- `period` (optional): `today`, `week`, `month` (default: today)

**Response:**
```json
{
  "success": true,
  "earnings": {
    "period": "today",
    "periodEarnings": 12500,
    "totalEarnings": 450000,
    "totalRides": 8,
    "totalDistance": 45.5,
    "averageRating": 4.8
  }
}
```

---

## 🔄 WebSocket Events

**Connection URL:** `wss://zippy-healing-production-24e4.up.railway.app`

### Passenger Events

#### Connect as Passenger
```javascript
socket.emit('passenger:connect', { passengerId: 123 });
```

#### Request Ride (Broadcast to drivers)
```javascript
socket.emit('ride:request', { rideId: 123 });
```

#### Listen for ride accepted
```javascript
socket.on('ride:accepted', (data) => {
  // data.rideId, data.driver, data.vehicle
});
```

#### Listen for driver location updates
```javascript
socket.on('ride:driver_location', (data) => {
  // data.latitude, data.longitude, data.heading, data.speed
});
```

#### Listen for driver arrived
```javascript
socket.on('ride:driver_arrived', (data) => {
  // data.rideId
});
```

#### Listen for ride started
```javascript
socket.on('ride:started', (data) => {
  // data.rideId
});
```

#### Listen for ride completed
```javascript
socket.on('ride:completed', (data) => {
  // data.rideId, data.fare, data.distance, data.duration
});
```

#### Cancel ride
```javascript
socket.emit('ride:cancel', { 
  rideId: 123, 
  cancelledBy: 'passenger', 
  reason: 'Changed my mind' 
});
```

---

### Driver Events

#### Connect as Driver
```javascript
socket.emit('driver:connect', { driverId: 45 });
```

#### Update online status
```javascript
socket.emit('driver:status', { 
  driverId: 45, 
  status: 'online',  // or 'offline'
  latitude: 11.8636,
  longitude: -15.5982
});
```

#### Update location (real-time)
```javascript
socket.emit('driver:location', { 
  driverId: 45,
  latitude: 11.8636,
  longitude: -15.5982,
  heading: 90,
  speed: 35,
  accuracy: 10
});
```

#### Listen for new ride requests
```javascript
socket.on('ride:new_request', (data) => {
  // data.rideId, data.pickupAddress, data.dropoffAddress
  // data.distance, data.estimatedFare, data.passengerRating
  // data.timeout (seconds to accept)
});
```

#### Accept ride
```javascript
socket.emit('ride:accept', { rideId: 123, driverId: 45 });
```

#### Update ride status
```javascript
socket.emit('ride:arrived', { rideId: 123 });
socket.emit('ride:start', { rideId: 123 });
socket.emit('ride:complete', { 
  rideId: 123, 
  actualDistance: 2.7, 
  actualDuration: 6 
});
```

#### Listen for ride cancellation
```javascript
socket.on('ride:cancelled', (data) => {
  // data.rideId, data.cancelledBy, data.reason
});
```

---

## 📊 Data Models

### Ride Statuses
- `requested` - Passenger requested a ride
- `accepted` - Driver accepted the ride
- `arrived` - Driver arrived at pickup location
- `started` - Passenger picked up, trip started
- `completed` - Trip completed successfully
- `cancelled` - Ride cancelled (by passenger or driver)

### Vehicle Types
- `RunRun` - Standard car (multiplier: 1.0)
- `Moto` - Motorcycle (multiplier: 0.7, cheaper)
- `Comfort` - Comfortable car (multiplier: 1.3)
- `XL` - Large vehicle (multiplier: 1.5)

### Pricing Formula
```
Total Fare = (Base Fare + Distance Fare + Duration Fare) × Vehicle Multiplier × Surge Multiplier
```

**Default Values:**
- Base Fare: 500 XOF
- Per KM Rate: 200 XOF
- Per Minute Rate: 50 XOF
- Booking Fee: 200 XOF
- Minimum Fare: 1000 XOF

**Platform Commission:** 20% (Driver keeps 80%)

---

## ✅ Testing Checklist

### Passenger Flow
1. ✅ Estimate fare for a ride
2. ✅ Request a ride
3. ✅ Get active ride status
4. ✅ Receive driver acceptance notification (WebSocket)
5. ✅ Track driver location in real-time (WebSocket)
6. ✅ Cancel ride (if needed)
7. ✅ Complete ride
8. ✅ Rate driver
9. ✅ View ride history

### Driver Flow
1. ✅ Go online with location
2. ✅ See nearby available rides
3. ✅ Accept ride request
4. ✅ Update status to "arrived"
5. ✅ Update location in real-time
6. ✅ Update status to "started"
7. ✅ Update status to "completed"
8. ✅ View earnings
9. ✅ View ride history

---

## 🛠️ Next Steps

1. **Test all endpoints** using Postman or Thunder Client
2. **Build mobile UI** for both passenger and driver apps
3. **Integrate maps** using react-native-maps
4. **Integrate Socket.IO** for real-time updates
5. **Add payment integration** (Orange Money, MTN Momo)
6. **Deploy and test** end-to-end flow

**Estimated Time to MVP:** 2-3 days of focused development

---

**Questions?** Contact: suporte@runrungb.com
