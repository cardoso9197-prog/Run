# 🚗 Driver App Complete Workflow Guide

## How the RunRun Driver App Works

---

## 📱 APP FLOW: From Login to Completing Rides

### **Step 1: Login & Activation** ✅

#### First Time Setup:
```
1. Open Driver App
2. Tap "Register" (if new driver)
   - Enter: Name, Email, Phone, Password
   - Enter: License Number, Vehicle Type, License Plate
3. Tap "Login" (if existing driver)
   - Enter: Phone + Password
4. Driver Status Check:
   - If NOT ACTIVATED → Shown "Pending Activation" screen
   - If ACTIVATED → Proceed to Home screen
```

**Note**: Admin must activate driver in web dashboard before they can accept rides.

---

### **Step 2: Home Screen** 🏠

When driver opens the app, they see:

```
┌─────────────────────────────────────┐
│  Welcome, John! 👋                  │
│  [OFFLINE] or [ONLINE]              │
├─────────────────────────────────────┤
│  💰 Today's Earnings                │
│  5,600 XOF                          │
├─────────────────────────────────────┤
│  Go Online/Offline [TOGGLE SWITCH] │
├─────────────────────────────────────┤
│  🚗 Available Rides                 │
│  💵 Earnings                        │
│  🔧 Vehicle                         │
│  👤 Profile                         │
│  ⚙️ Settings                        │
│  🚪 Logout                          │
└─────────────────────────────────────┘
```

**Key Actions:**
- **Toggle Switch**: Turn ON to start receiving ride requests
- **Available Rides Button**: View rides waiting for drivers

---

### **Step 3: Go Online** 🟢

```
1. Driver toggles switch to ON
2. Status changes to "ONLINE" (green badge)
3. Backend receives status update
4. Driver location tracking starts
5. Driver is now visible to passengers
```

**What Happens:**
- ✅ Driver's GPS location tracked every 15 seconds
- ✅ Location sent to backend
- ✅ Driver appears in "available drivers" pool
- ✅ Passengers can now request rides from this driver

---

### **Step 4: View Available Rides** 🔍

```
1. Driver taps "🚗 Available Rides" button on Home
2. Opens "AvailableRidesScreen"
3. Screen automatically refreshes every 5 seconds
4. Shows list of pending ride requests nearby
```

**What Drivers See:**

```
┌─────────────────────────────────────┐
│  🚗 Available Rides      [🔄 Refresh]│
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ 5,600 XOF      2.3 km away   │  │
│  │ 🟢 Pickup: Bairro de Belém   │  │
│  │ 🔴 Dropoff: Bissau Airport   │  │
│  │ 📏 8.5 km • ⏱️ ~15 min       │  │
│  │ 👤 Maria Silva • ⭐ 4.8      │  │
│  │                              │  │
│  │      [✅ Accept Ride]         │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 3,200 XOF      1.5 km away   │  │
│  │ 🟢 Pickup: Market Area       │  │
│  │ 🔴 Dropoff: Hospital         │  │
│  │ 📏 4.2 km • ⏱️ ~8 min        │  │
│  │ 👤 John Doe • ⭐ 4.5         │  │
│  │                              │  │
│  │      [✅ Accept Ride]         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Information Shown:**
- 💰 Fare estimate
- 📍 Distance to pickup location
- 🟢 Pickup address
- 🔴 Dropoff address
- 📏 Trip distance & estimated duration
- 👤 Passenger name & rating
- ✅ Accept button

---

### **Step 5: Accept a Ride** ✅

```
1. Driver taps "✅ Accept Ride" on a ride card
2. API call sent to backend: POST /drivers/rides/:id/accept
3. Ride status changes from "pending" → "accepted"
4. Success alert: "Ride accepted!"
5. Driver automatically navigated to "ActiveRideScreen"
```

**What Happens:**
- ✅ Ride assigned to driver
- ✅ Passenger notified (ride accepted)
- ✅ Other drivers can't see this ride anymore
- ✅ Driver sees full ride details with map

---

### **Step 6: Active Ride Screen** 🗺️ **[NEW UBER-STYLE INTERFACE]**

Driver now sees a **full-screen map** with:

```
┌─────────────────────────────────────┐
│                                     │
│         [FULL-SCREEN MAP]           │
│                                     │
│    🟢 Green Pin = Pickup Location   │
│       ┊┊┊┊┊ (dashed route line)     │
│    🔴 Gray Pin = Dropoff Location   │
│                                     │
│         (Shows current location)    │
│                                     │
├─────────────────────────────────────┤
│ 🚗 Heading to Pickup    5,600 XOF  │
│ ┌─────────────────────────────────┐ │
│ │ 📍 Pickup Location              │ │
│ │ Bairro de Belém, Bissau         │ │
│ └─────────────────────────────────┘ │
│                                     │
│   [🧭 Navigate to Pickup]          │
│                                     │
│   [✅ Start Trip]                   │
└─────────────────────────────────────┘
```

**Features:**
- 🗺️ **Full-screen map** with Google Maps
- 📍 **Two markers**: Pickup (green) + Dropoff (gray)
- 📏 **Route line**: Dashed line connecting both locations
- 💰 **Fare display**: Total ride fare
- 📍 **Current destination**: Shows pickup address
- 🧭 **Navigate button**: Opens Google Maps with directions
- ✅ **Action button**: Start Trip (when at pickup)

---

### **Step 7: Navigate to Pickup** 🧭

```
1. Driver taps "🧭 Navigate to Pickup" button
2. App detects device platform (Android/iOS)
3. Opens Google Maps (Android) or Apple Maps (iOS)
4. Shows turn-by-turn directions to pickup location
5. Driver follows navigation to passenger
```

**What Opens:**
- **Android**: `geo:0,0?q=LAT,LON&navigate=yes`
- **iOS**: `maps:?daddr=LAT,LON&dirflg=d`
- **Fallback**: Web Google Maps if apps not installed

---

### **Step 8: Arrive at Pickup & Start Trip** 🚀

```
1. Driver arrives at pickup location
2. Driver meets passenger
3. Driver taps "✅ Start Trip" button
4. API call: POST /drivers/rides/:id/start
5. Ride status changes: "accepted" → "started"
6. Map updates:
   - Dropoff marker turns ORANGE 🟠
   - Status changes to "🏁 En Route to Dropoff"
   - Navigate button now points to dropoff
```

**Screen Updates:**

```
┌─────────────────────────────────────┐
│         [FULL-SCREEN MAP]           │
│                                     │
│    🟢 Green Pin = Pickup (passed)   │
│       ┊┊┊┊┊ (dashed route line)     │
│    🟠 Orange Pin = Dropoff (active) │
│                                     │
├─────────────────────────────────────┤
│ 🏁 En Route to Dropoff  5,600 XOF  │
│ ┌─────────────────────────────────┐ │
│ │ 🎯 Dropoff Location             │ │
│ │ Osvaldo Vieira Airport          │ │
│ └─────────────────────────────────┘ │
│                                     │
│   [🧭 Navigate to Dropoff]         │
│                                     │
│   [🏁 Complete Trip]                │
└─────────────────────────────────────┘
```

---

### **Step 9: Navigate to Dropoff** 🎯

```
1. Driver taps "🧭 Navigate to Dropoff" button
2. Google Maps/Apple Maps opens
3. Shows directions to dropoff location
4. Driver follows navigation
5. Driver arrives at destination
```

---

### **Step 10: Complete Trip** 🏁

```
1. Driver arrives at dropoff location
2. Passenger exits vehicle
3. Driver taps "🏁 Complete Trip" button
4. API call: POST /drivers/rides/:id/complete
5. Ride status changes: "started" → "completed"
6. Payment processed (if applicable)
7. Success alert: "Trip completed!"
8. Driver returned to Home screen
9. Earnings updated
```

**What Happens:**
- ✅ Ride marked as completed
- ✅ Fare added to driver's earnings
- ✅ Trip history updated
- ✅ Driver back online (available for new rides)
- ✅ Driver can accept new rides immediately

---

## 🔄 COMPLETE WORKFLOW SUMMARY

```
1. LOGIN → 2. HOME SCREEN → 3. GO ONLINE (toggle switch)
                    ↓
4. TAP "AVAILABLE RIDES" → 5. SEE LIST OF RIDES
                    ↓
6. TAP "ACCEPT RIDE" → 7. ACTIVE RIDE SCREEN (map view)
                    ↓
8. TAP "NAVIGATE TO PICKUP" → Google Maps opens
                    ↓
9. ARRIVE → TAP "START TRIP"
                    ↓
10. TAP "NAVIGATE TO DROPOFF" → Google Maps opens
                    ↓
11. ARRIVE → TAP "COMPLETE TRIP"
                    ↓
12. BACK TO HOME → READY FOR NEXT RIDE ✅
```

---

## 📊 TECHNICAL DETAILS

### Backend API Endpoints Used:

```javascript
// 1. Get driver profile
GET /drivers/profile

// 2. Update online/offline status
POST /drivers/status
Body: { status: "online" | "offline" }

// 3. Get available rides near driver
GET /drivers/available-rides
Query: ?lat=11.8636&lng=-15.5982

// 4. Accept a ride
POST /drivers/rides/:rideId/accept

// 5. Get ride details
GET /rides/:rideId

// 6. Start trip
POST /drivers/rides/:rideId/start

// 7. Complete trip
POST /drivers/rides/:rideId/complete

// 8. Update driver location (automatic every 15s)
POST /drivers/location
Body: { latitude, longitude, heading, speed, accuracy }
```

---

### Location Tracking:

**When Online:**
- ✅ GPS location captured every 15 seconds
- ✅ Sent to backend via `/drivers/location`
- ✅ Stored in database with timestamp
- ✅ Used for passenger-driver matching

**When in Active Ride:**
- ✅ Location updated every 5 seconds
- ✅ More frequent for better tracking
- ✅ Helps calculate accurate distances

---

## 🎯 KEY FEATURES

### Old vs New Driver Experience:

| Feature | Old (Before) | New (After) |
|---------|-------------|-------------|
| **Ride View** | Text list only | Map + Text |
| **Navigation** | Copy address manually | One-tap to Google Maps |
| **Route Preview** | None | Visual line on map |
| **Destination** | Static text | Dynamic (changes pickup→dropoff) |
| **Location** | Manual entry | Automatic GPS |

---

## ⚠️ IMPORTANT NOTES

### Driver Must:
1. ✅ Be **activated** by admin first
2. ✅ Toggle **"Go Online"** to receive rides
3. ✅ Have **location permissions** enabled
4. ✅ Have **Google Maps** installed (for navigation)
5. ✅ Have **internet connection** for map tiles

### Ride Acceptance:
- **First driver to accept** gets the ride
- Once accepted, other drivers can't see it
- Driver can't reject after accepting (currently)

### Location Tracking:
- **Online status**: Updates every 15 seconds
- **Active ride**: Updates every 5 seconds
- **Offline status**: No tracking

---

## 🐛 TROUBLESHOOTING

### "No Available Rides" Showing:
1. Check if driver is **online** (green badge)
2. Check if driver is **activated** by admin
3. Wait for passengers to request rides
4. Check internet connection

### Navigation Not Opening:
1. Install **Google Maps** from Play Store
2. Grant **location permissions** to app
3. Check if GPS is enabled
4. Try fallback web maps

### Map Not Showing:
1. Check **internet connection**
2. Verify **Google Maps API key** is active
3. Grant **location permissions**
4. Restart app

---

## 📱 SCREEN NAVIGATION

```
WelcomeScreen
    ↓
LoginScreen
    ↓
[If not activated] → PendingActivationScreen
    ↓
[If activated] → HomeScreen
    ↓
AvailableRidesScreen
    ↓
ActiveRideScreen (with map)
    ↓
(Complete ride) → HomeScreen
```

---

## 💡 TIPS FOR DRIVERS

1. **Stay Online**: More time online = more ride opportunities
2. **Accept Quickly**: First to accept gets the ride
3. **Use Navigation**: Tap navigate button for turn-by-turn
4. **Check Distance**: Closer pickups = faster earnings
5. **Maintain Rating**: Good service = better passenger ratings

---

## 🚀 NEW FEATURES (Just Added!)

### Uber-Style Navigation:
✅ Full-screen map view
✅ Visual route preview
✅ One-tap navigation to Google Maps
✅ Dynamic destination switching
✅ Real-time location tracking
✅ Professional UI design

---

**This is how drivers accept and complete rides in your RunRun platform!** 🚗💨

Any questions about specific screens or features? Let me know!
