# 🚗 Run Run Backend Server

**Complete Node.js backend for Guinea-Bissau ride-sharing platform**  
**Developer:** Edivaldo Cardoso  
**Email:** suporte@runrungb.com

---

## 📋 Overview

This is the backend server for the Run Run ride-sharing platform. It provides:

- **RESTful API** for passenger and driver apps
- **Real-time WebSocket** communication for live ride tracking
- **PostgreSQL database** for data persistence
- **Payment processing** for Cash, Cards, Orange Money, and MTN Mobile Money
- **Driver-passenger matching** algorithm
- **Fare calculation** engine
- **Authentication** using JWT

---

## 🛠️ Technology Stack

- **Node.js** (v16+)
- **Express.js** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Axios** - HTTP client for payment APIs

---

## 📁 Project Structure

```
backend/
├── server.js                 # Main server file with WebSocket
├── package.json              # Dependencies
├── .env.example             # Environment variables template
├── database/
│   ├── schema.sql           # PostgreSQL database schema
│   ├── db.js                # Database connection pool
│   └── init.js              # Database initialization script
├── routes/
│   ├── auth.js              # Authentication (OTP, login)
│   ├── rides.js             # Ride management
│   ├── drivers.js           # Driver operations
│   ├── passengers.js        # Passenger operations
│   └── payments.js          # Payment processing
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Request validation
└── utils/
    └── pricing.js           # Fare calculation
```

---

## 🚀 Quick Start

### **1. Prerequisites**

Install the following on your system:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 12 or higher ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for version control)

### **2. Installation**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment template
copy .env.example .env

# Edit .env file with your configuration
notepad .env
```

### **3. Database Setup**

```bash
# Create PostgreSQL database
createdb runrun

# Initialize database schema
npm run db:init
```

If you get an error, you can manually run the schema:

```bash
psql -d runrun -f database/schema.sql
```

### **4. Configure Environment Variables**

Edit the `.env` file and update these required values:

```env
# Database (update with your PostgreSQL password)
DB_PASSWORD=your_postgres_password

# JWT Secret (generate a random string)
JWT_SECRET=change_this_to_a_random_secure_string

# Google Maps API (for distance calculation)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### **5. Start the Server**

```bash
# Development mode (auto-restart on file changes)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

---

## 📡 API Endpoints

### **Authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Request OTP for phone number |
| POST | `/api/auth/verify-otp` | Verify OTP and login/register |
| POST | `/api/auth/login` | Direct login (for testing) |
| GET | `/api/auth/me` | Get current user profile |

### **Rides (Requires Authentication)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rides/request` | Request a new ride (passenger) |
| GET | `/api/rides/:id` | Get ride details |
| GET | `/api/rides/history/all` | Get ride history |
| GET | `/api/rides/active/current` | Get active ride |
| POST | `/api/rides/:id/rate` | Rate a completed ride |

### **Drivers (Requires Driver Role)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drivers/profile` | Get driver profile |
| PUT | `/api/drivers/profile` | Update driver profile |
| PUT | `/api/drivers/status` | Update online/offline status |
| POST | `/api/drivers/location` | Update driver location |
| GET | `/api/drivers/earnings` | Get earnings summary |
| GET | `/api/drivers/earnings/details` | Get detailed earnings |
| GET | `/api/drivers/stats` | Get driver statistics |

### **Passengers (Requires Passenger Role)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/passengers/profile` | Get passenger profile |
| PUT | `/api/passengers/profile` | Update passenger profile |
| GET | `/api/passengers/stats` | Get passenger statistics |

### **Payments (Requires Authentication)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/process` | Process payment for a ride |
| GET | `/api/payments/:rideId` | Get payment details |

---

## 🔌 WebSocket Events

### **From Driver App:**

- `driver:online` - Driver goes online
- `driver:offline` - Driver goes offline
- `driver:location` - Driver location update (every 5 seconds)
- `ride:accept` - Driver accepts ride request
- `ride:arrived` - Driver arrived at pickup
- `ride:start` - Ride started
- `ride:complete` - Ride completed
- `ride:cancel` - Ride cancelled

### **From Passenger App:**

- `passenger:connect` - Passenger connects
- `ride:request` - Request a new ride
- `ride:cancel` - Cancel ride request

### **To Driver App:**

- `ride:new_request` - New ride request (15-second timeout)
- `ride:taken` - Ride was accepted by another driver
- `ride:cancelled` - Passenger cancelled ride
- `ride:completed_confirmation` - Ride marked as complete

### **To Passenger App:**

- `ride:searching` - Searching for nearby drivers
- `ride:no_drivers` - No drivers available
- `ride:accepted` - Driver accepted ride (includes driver details)
- `ride:driver_location` - Driver location update
- `ride:driver_arrived` - Driver arrived at pickup
- `ride:started` - Ride started
- `ride:completed` - Ride completed

---

## 💳 Payment Integration

### **Cash Payments** ✅ Implemented
No external API required. Marked as completed in database.

### **Card Payments** (Stripe/PayStack)
Update `.env` with your Stripe credentials:
```env
STRIPE_SECRET_KEY=sk_live_your_key_here
```

### **Orange Money**
Register for Orange Money Merchant Account and update:
```env
ORANGE_MONEY_MERCHANT_ID=your_merchant_id
ORANGE_MONEY_API_KEY=your_api_key
```

### **MTN Mobile Money**
Register at [MTN MoMo Developer Portal](https://momodeveloper.mtn.com) and update:
```env
MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key
MTN_MOMO_API_USER=your_api_user
MTN_MOMO_API_KEY=your_api_key
```

---

## 🧪 Testing

### **1. Test Server Health**

```bash
# Open browser and visit:
http://localhost:3000/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-08T..."
}
```

### **2. Test Authentication**

```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+245955000000"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+245955000000",
    "otp": "123456",
    "userType": "passenger",
    "name": "Test User"
  }'
```

### **3. Test Ride Request**

```bash
# Use token from authentication
curl -X POST http://localhost:3000/api/rides/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "pickupLatitude": 11.8637,
    "pickupLongitude": -15.5989,
    "pickupAddress": "Bissau Center",
    "dropoffLatitude": 11.8700,
    "dropoffLongitude": -15.6100,
    "dropoffAddress": "Airport",
    "vehicleType": "RunRun"
  }'
```

---

## 🗄️ Database Schema

The database includes the following tables:

1. **users** - Base user accounts
2. **passengers** - Passenger profiles
3. **drivers** - Driver profiles
4. **vehicles** - Vehicle information
5. **driver_locations** - Real-time driver tracking
6. **rides** - Ride requests and details
7. **ride_locations** - Ride path tracking
8. **payments** - Payment transactions
9. **ratings** - Ride ratings and reviews

### **View Database Data**

```bash
# Connect to PostgreSQL
psql -d runrun

# View all users
SELECT * FROM users;

# View all rides
SELECT * FROM rides;

# View platform statistics
SELECT * FROM platform_statistics;

# Exit
\q
```

---

## 📊 Monitoring & Logs

Server logs show:
- All API requests
- Database queries
- WebSocket connections
- Payment processing
- Errors and warnings

Logs format:
```
2025-12-08T10:30:00.000Z - POST /api/rides/request
Executed query { text: 'INSERT INTO rides...', duration: 45, rows: 1 }
✅ Client connected: socket_id_123
```

---

## 🚀 Deployment

### **Deploy to Heroku**

```bash
# Install Heroku CLI
# Create Heroku app
heroku create runrun-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### **Deploy to VPS (Ubuntu)**

```bash
# SSH to your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Clone your code
git clone https://github.com/yourusername/runrun-backend.git
cd runrun-backend/backend

# Install dependencies
npm install --production

# Set up database
sudo -u postgres createdb runrun
npm run db:init

# Install PM2 for process management
sudo npm install -g pm2

# Start server
pm2 start server.js --name runrun-backend
pm2 save
pm2 startup
```

---

## 🔒 Security Checklist

- [x] JWT authentication on all protected routes
- [x] SQL injection prevention (parameterized queries)
- [x] CORS configuration
- [x] Environment variables for secrets
- [ ] HTTPS/SSL in production
- [ ] Rate limiting (TODO)
- [ ] Input sanitization (TODO)
- [ ] API request logging
- [ ] Payment data encryption (handled by payment gateways)

---

## 📞 Support

**Developer:** Edivaldo Cardoso  
**Email:** suporte@runrungb.com  
**WhatsApp:** +245 955 000 000

---

## 📄 License

Copyright © 2025 Run Run Guinea-Bissau  
All rights reserved.

---

**Made with ❤️ for Guinea-Bissau** 🇬🇼
