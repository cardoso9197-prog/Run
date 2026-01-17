# 🚀 RUN-RUN QUICK COMMANDS

**Copy-paste these commands to get started quickly!**

---

## 📱 PASSENGER APP

### Install & Run
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
npm install
npm start
```

### Add Icon
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW"
Copy-Item "Run-Run logo.png" "RunRunPassenger\assets\icon.png"
Copy-Item "Run-Run logo.png" "RunRunPassenger\assets\splash.png"
Copy-Item "Run-Run logo.png" "RunRunPassenger\assets\adaptive-icon.png"
```

### Build APK
```powershell
cd RunRunPassenger
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## 🚗 DRIVER APP

### Install & Run
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"
npm install
npm start
```

### Add Icon
```powershell
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW"
Copy-Item "Run-Run logo.png" "RunRunDriver\assets\icon.png"
Copy-Item "Run-Run logo.png" "RunRunDriver\assets\splash.png"
Copy-Item "Run-Run logo.png" "RunRunDriver\assets\adaptive-icon.png"
```

### Build APK
```powershell
cd RunRunDriver
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## 🔧 TROUBLESHOOTING

### Clear Cache
```powershell
npm cache clean --force
expo start -c
```

### Reinstall Dependencies
```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Check Backend Status
```powershell
curl https://zippy-healing-production-24e4.up.railway.app/api
```

---

## 🗃️ DATABASE COMMANDS

### Activate Driver (via Railway Console or psql)
```sql
-- Check driver status
SELECT id, name, phone, is_activated 
FROM drivers 
WHERE phone = '+245955981398';

-- Activate driver
UPDATE drivers 
SET is_activated = true,
    verified_by = 'Admin',
    verification_date = NOW(),
    verification_notes = 'All documents verified'
WHERE phone = '+245955981398';

-- Verify activation
SELECT * FROM drivers WHERE phone = '+245955981398';
```

### View All Drivers
```sql
SELECT id, name, phone, vehicle_type, vehicle_plate, is_activated
FROM drivers
ORDER BY created_at DESC;
```

### View All Rides
```sql
SELECT r.id, r.status, 
       p.name as passenger, 
       d.name as driver,
       r.pickup_address, 
       r.dropoff_address,
       r.fare_estimate
FROM rides r
LEFT JOIN users p ON r.passenger_id = p.id
LEFT JOIN drivers d ON r.driver_id = d.id
ORDER BY r.created_at DESC
LIMIT 10;
```

---

## 📊 USEFUL QUERIES

### Check Platform Statistics
```sql
-- Total users
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Total rides by status
SELECT status, COUNT(*) FROM rides GROUP BY status;

-- Total drivers (activated vs pending)
SELECT is_activated, COUNT(*) FROM drivers GROUP BY is_activated;

-- Total earnings
SELECT SUM(final_fare) as total_earnings FROM rides WHERE status = 'completed';
```

---

## 🧪 TEST DATA

### Test Passenger Account
```
Name: Test Passenger
Phone: +245955971275
Password: test123
Email: passenger@test.com
```

### Test Driver Account
```
Name: Test Driver
Phone: +245955981398
Password: driver123
Vehicle: Normal Car
Plate: GB-1234
License: DL123456
```

### Test Credit Card
```
Number: 4111111111111111
Type: Visa
CVV: 123
Expiry: 12/25
```

### Test Mobile Money
```
Orange Money: +245955971275
MTN Money: +245955981398
```

---

## 🌐 API ENDPOINTS

### Base URL
```
https://zippy-healing-production-24e4.up.railway.app/api
```

### Test Endpoints (via curl or Postman)

```powershell
# Check API health
curl https://zippy-healing-production-24e4.up.railway.app/api

# Register passenger
curl -X POST https://zippy-healing-production-24e4.up.railway.app/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"phone\":\"+245955971275\",\"password\":\"test123\",\"role\":\"passenger\"}'

# Login
curl -X POST https://zippy-healing-production-24e4.up.railway.app/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"phone\":\"+245955971275\",\"password\":\"test123\"}'
```

---

## 📦 PROJECT STRUCTURE

```
Run-Run GW/
├── backend/              # ✅ Deployed on Railway
├── RunRunPassenger/      # 🟡 Passenger App (13 screens)
├── RunRunDriver/         # 🟢 Driver App (12 screens)
├── Run-Run logo.png      # 🎨 App icon
├── PROJECT_README.md     # 📚 Full documentation
├── SETUP_GUIDE.md        # 🚀 Setup instructions
└── QUICK_COMMANDS.md     # ⚡ This file
```

---

## ⚡ ONE-LINER COMMANDS

### Start Both Apps (Run in 2 separate terminals)
```powershell
# Terminal 1 (Passenger)
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger" ; npm start

# Terminal 2 (Driver)
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver" ; npm start
```

### Build Both APKs
```powershell
# Passenger APK
cd RunRunPassenger ; eas build --platform android --profile preview

# Driver APK (after passenger completes)
cd ..\RunRunDriver ; eas build --platform android --profile preview
```

---

## 🎯 DEPLOYMENT CHECKLIST

- [ ] Backend deployed on Railway ✅
- [ ] Passenger app tested with Expo Go
- [ ] Driver app tested with Expo Go
- [ ] App icons added to both apps
- [ ] Driver activation system tested
- [ ] Payment methods tested
- [ ] Multi-language tested (PT/EN/FR)
- [ ] Passenger APK built
- [ ] Driver APK built
- [ ] APKs installed on test devices
- [ ] End-to-end ride flow tested
- [ ] Ready for launch! 🚀

---

**Last Updated:** December 19, 2025  
**Status:** Production Ready ✅
