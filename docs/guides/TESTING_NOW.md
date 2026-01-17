# 🧪 RUN-RUN APP TESTING GUIDE
**Date:** December 17, 2025  
**Status:** Apps Ready for Testing

---

## 📱 QUICK START TESTING

### Option 1: Test with Expo Go (FASTEST - Recommended)

#### **Step 1: Install Expo Go on Your Phone**
- **Android:** [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [App Store](https://apps.apple.com/app/expo-go/id982107779)

#### **Step 2: Start Passenger App**
```powershell
cd passenger-app
npx expo start
```

**You'll see:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or Camera (iOS)
```

#### **Step 3: Scan QR Code**
- **Android:** Open Expo Go app → Scan QR code
- **iOS:** Open Camera app → Point at QR code → Tap notification

#### **Step 4: Test Passenger Features**
✅ Create account / Login
✅ View map with your location
✅ Drop pickup pin
✅ Drop dropoff pin
✅ Select vehicle type (Moto/Normal/Premium)
✅ See fare estimate (e.g., "2,000 XOF")
✅ Request ride
✅ Test ride tracking

#### **Step 5: Start Driver App (New Terminal)**
```powershell
cd driver-app
npx expo start --port 8082
```

**Then scan the QR code** with Expo Go on another phone (or same phone)

#### **Step 6: Test Driver Features**
✅ Driver login
✅ Toggle availability (Online/Offline)
✅ See ride requests
✅ Accept/Reject rides
✅ Navigate to pickup
✅ Start ride
✅ Complete ride
✅ View earnings

---

## 🎯 TESTING CHECKLIST

### Passenger App Tests:

#### 1. **Registration & Login** ✅
- [ ] Create new account
- [ ] Login with existing account
- [ ] Profile loads correctly
- [ ] Logout works

#### 2. **Map & Location** ✅
- [ ] Map loads and shows current location
- [ ] Can pan and zoom map
- [ ] GPS coordinates display correctly
- [ ] Quick presets work (Airport, Hotel, Center)

#### 3. **Ride Booking** ✅
- [ ] Drop pickup pin (green)
- [ ] Drop dropoff pin (red)
- [ ] Distance calculated correctly
- [ ] All vehicle types show (Moto, Normal, Premium)
- [ ] Fare estimate appears (NEW PRICING):
  - Moto: ~1,000 XOF (5km)
  - Normal: ~1,750 XOF (5km)
  - Premium: ~5,250 XOF (5km)
- [ ] "Request Ride" button works
- [ ] Success message appears

#### 4. **Active Ride Screen** ✅
- [ ] Driver info displays
- [ ] Driver location updates in real-time
- [ ] Distance to driver shown
- [ ] Status updates (Accepted → Arriving → In Progress)
- [ ] "Call Driver" button works
- [ ] "Message Driver" button works

#### 5. **Rating & Review** ✅
- [ ] Rating screen appears after ride
- [ ] Can select 1-5 stars
- [ ] Can write review (500 chars max)
- [ ] Can add tip (500-5000 XOF)
- [ ] Submit rating works

#### 6. **Payment** ✅
- [ ] Payment methods display
- [ ] Visa/Mastercard option
- [ ] Orange Money option
- [ ] MTN Mobile Money option
- [ ] Payment confirmation

### Driver App Tests:

#### 1. **Driver Login** ✅
- [ ] Login with credentials
- [ ] Profile loads
- [ ] Vehicle info displays
- [ ] Current earnings show

#### 2. **Availability Toggle** ✅
- [ ] Can go Online
- [ ] Can go Offline
- [ ] Status updates correctly
- [ ] Color indicators work (Green/Gray)

#### 3. **Ride Requests** ✅
- [ ] New ride notification appears
- [ ] Passenger info displays
- [ ] Pickup/dropoff locations shown
- [ ] Fare amount displays correctly
- [ ] Distance shown
- [ ] Can Accept ride
- [ ] Can Reject ride

#### 4. **Navigation** ✅
- [ ] Route to pickup displays
- [ ] Distance updates in real-time
- [ ] "Navigate" button works
- [ ] Opens Google Maps/Waze

#### 5. **Ride Execution** ✅
- [ ] "Start Ride" button works
- [ ] Live fare meter updates
- [ ] Duration counter works
- [ ] "Complete Ride" button works
- [ ] Final fare calculation correct

#### 6. **Earnings** ✅
- [ ] Ride earnings display (80% of fare)
- [ ] Daily total updates
- [ ] Commission calculated correctly (20%)
- [ ] Trip history shows

---

## 🔧 TESTING SCENARIOS

### Scenario 1: Short Trip (Moto)
**Route:** City Center to Market (3 km)  
**Expected Fare:** 500 + (3 × 100) = **800 XOF**  
**Driver Earnings:** 640 XOF (80%)  
**Commission:** 160 XOF (20%)

### Scenario 2: Medium Trip (Normal Car)
**Route:** Hotel to Airport (7 km)  
**Expected Fare:** 1,000 + (7 × 150) = **2,050 XOF**  
**Driver Earnings:** 1,640 XOF (80%)  
**Commission:** 410 XOF (20%)

### Scenario 3: Long Trip (Premium Car)
**Route:** Bissau to Bafatá (15 km)  
**Expected Fare:** 3,000 + (15 × 450) = **9,750 XOF**  
**Driver Earnings:** 7,800 XOF (80%)  
**Commission:** 1,950 XOF (20%)

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Metro bundler failed to start"
**Fix:**
```powershell
# Clear Metro cache
npx expo start -c
```

### Issue: "Network error - Can't connect to server"
**Fix:**
1. Check backend is running: `http://localhost:3000`
2. Update API endpoint in app:
   - Edit `passenger-app/src/config.js`
   - Change to your IP: `http://192.168.x.x:3000`

### Issue: "Map not loading"
**Fix:**
1. Check internet connection
2. Enable location permissions
3. Restart app

### Issue: "QR code not scanning"
**Fix:**
1. Increase brightness on laptop screen
2. Ensure good lighting
3. Try typing URL manually in Expo Go

### Issue: "GPS coordinates not accurate"
**Fix:**
1. Enable High Accuracy mode in phone settings
2. Go outside for better GPS signal
3. Wait 30 seconds for GPS lock

---

## 📊 BACKEND VERIFICATION

### Check Backend is Running:
```powershell
# In a new terminal
cd backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 3000
✅ Database connected
✅ Ready to accept requests
```

### Test API Endpoints:

**1. Health Check:**
```bash
curl http://localhost:3000/api/health
```
**Expected:** `{"status":"ok"}`

**2. Get Drivers:**
```bash
curl http://localhost:3000/api/drivers
```
**Expected:** JSON list of drivers

**3. Get Vehicles:**
```bash
curl http://localhost:3000/api/vehicles
```
**Expected:** JSON list of vehicle types

---

## 💡 TESTING TIPS

### For Best Results:

1. **Use 2 Phones:**
   - Phone 1: Passenger App
   - Phone 2: Driver App
   - This allows full end-to-end testing

2. **Same WiFi Network:**
   - Connect both phones and laptop to same WiFi
   - Ensures apps can reach backend

3. **Test in Order:**
   - First test Passenger App alone
   - Then test Driver App alone
   - Finally test both together

4. **Check Console Logs:**
   - Watch Metro bundler terminal for errors
   - Use React Native Debugger if needed

5. **Test All Vehicle Types:**
   - Book ride with Moto
   - Book ride with Normal Car
   - Book ride with Premium Car
   - Verify pricing is correct for each

---

## 🎬 DEMO SCRIPT

### For showing to investors/stakeholders:

**1. Introduction (30 seconds)**
- "This is Run-Run, Guinea-Bissau's first ride-hailing platform"
- Show both apps side-by-side

**2. Passenger Experience (2 minutes)**
- Open app → Map appears with location
- Drop pickup pin → Drop dropoff pin
- Select Normal Car
- Show fare: "1,750 XOF" ✅
- Request ride

**3. Driver Experience (2 minutes)**
- Driver receives notification
- Shows passenger info and fare
- Driver accepts ride
- Navigate to pickup
- Start ride
- Complete ride

**4. Key Features (1 minute)**
- Real-time tracking
- Multiple vehicle types
- Digital payments
- Driver ratings
- Live fare meter

**5. Business Model (30 seconds)**
- 20% commission per ride
- Average fare: 2,000 XOF
- Average commission: 400 XOF
- Projected Year 1: $426,000 revenue

---

## 📞 NEED HELP?

**Technical Issues:**
- Check: `backend/FINAL_TESTING_GUIDE.md`
- Check: `QUICK_START_NOW.md`

**Database Issues:**
- Check: `DRIVER_ACTIVATION_QUERIES.md`

**Business Questions:**
- Check: `INVESTOR_REPORT.md`
- Check: `PROJECT_REPORT.md`

**Office Contact:**
📱 +245 955 971 275 / +245 955 981 398

---

## ✅ TESTING COMPLETE WHEN:

- [ ] Both apps load without errors
- [ ] Can create accounts and login
- [ ] Map displays correctly
- [ ] Can book ride successfully
- [ ] Driver can accept ride
- [ ] Real-time tracking works
- [ ] Fare calculations correct
- [ ] Can complete ride
- [ ] Rating system works
- [ ] All 3 vehicle types tested

---

## 🚀 AFTER TESTING

### Next Steps:

1. **If Tests Pass:**
   - Build production APKs
   - Deploy to Google Play Store
   - Start driver recruitment
   - Launch marketing campaign

2. **If Issues Found:**
   - Document bugs
   - Fix critical issues
   - Re-test
   - Deploy fixes

3. **Production Deployment:**
   - See: `BUILDS_QUICK_REF.md`
   - Build command: `eas build --platform android`
   - Submit to stores

---

**Good luck with testing! 🎉**

The platform is ready - now it's time to see it in action!
