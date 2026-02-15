# 🚗 Driver App Quick Reference

## **How Drivers Accept & Complete Rides**

---

## 🎯 QUICK START (5 Steps)

```
1. LOGIN → 2. TOGGLE "GO ONLINE" → 3. TAP "AVAILABLE RIDES"
→ 4. TAP "ACCEPT RIDE" → 5. FOLLOW MAP NAVIGATION
```

---

## 📱 MAIN SCREENS

### 1️⃣ **Home Screen**
- Welcome message with driver name
- Online/Offline status badge
- Today's earnings display
- **Toggle Switch** to go online/offline
- Menu buttons (Available Rides, Earnings, Profile, etc.)

### 2️⃣ **Available Rides Screen**
- List of nearby ride requests
- Auto-refreshes every 5 seconds
- Shows: Fare, Distance, Pickup, Dropoff, Passenger info
- **Accept button** on each ride card

### 3️⃣ **Active Ride Screen** (NEW!)
- Full-screen Google Maps
- Pickup marker (🟢 green) + Dropoff marker (🔴 orange)
- Route line connecting both locations
- **Navigate button** (opens Google Maps)
- **Start Trip** or **Complete Trip** button

---

## 🔄 RIDE ACCEPTANCE FLOW

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  STEP 1: Driver Goes Online                    │
│  ────────────────────────────                  │
│  • Open app → Home screen                      │
│  • Toggle switch to ON                         │
│  • Status: "ONLINE" (green)                    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  STEP 2: View Available Rides                  │
│  ────────────────────────────                  │
│  • Tap "🚗 Available Rides" button             │
│  • See list of pending requests                │
│  • Shows nearby rides with fare & distance     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  STEP 3: Accept a Ride                         │
│  ────────────────────────                      │
│  • Tap "✅ Accept Ride" on chosen ride         │
│  • API assigns ride to driver                  │
│  • Navigate to Active Ride screen              │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  STEP 4: Navigate to Pickup                    │
│  ───────────────────────                       │
│  • See full map with pickup location (green)   │
│  • Tap "🧭 Navigate to Pickup"                 │
│  • Google Maps opens with directions           │
│  • Drive to passenger location                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  STEP 5: Start Trip                            │
│  ───────────────────                           │
│  • Arrive at pickup location                   │
│  • Meet passenger                              │
│  • Tap "✅ Start Trip"                         │
│  • Dropoff marker turns orange                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  STEP 6: Navigate to Dropoff                   │
│  ────────────────────────                      │
│  • Tap "🧭 Navigate to Dropoff"                │
│  • Google Maps opens with new destination      │
│  • Drive to dropoff location                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  STEP 7: Complete Trip                         │
│  ──────────────────                            │
│  • Arrive at dropoff                           │
│  • Passenger exits                             │
│  • Tap "🏁 Complete Trip"                      │
│  • Earnings updated                            │
│  • Back to Home → Ready for next ride!         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎨 SCREEN LAYOUTS

### Available Rides Screen:
```
┌────────────────────────────────────┐
│ 🚗 Available Rides    [🔄 Refresh] │
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ 5,600 XOF       2.3 km away   │ │
│ │ 🟢 Pickup: Bairro de Belém    │ │
│ │ 🔴 Dropoff: Airport           │ │
│ │ 📏 8.5 km • ⏱️ ~15 min        │ │
│ │ 👤 Maria • ⭐ 4.8             │ │
│ │     [✅ Accept Ride]           │ │
│ └────────────────────────────────┘ │
│                                    │
│ (More rides...)                    │
└────────────────────────────────────┘
```

### Active Ride Screen (Uber-Style):
```
┌────────────────────────────────────┐
│                                    │
│      [FULL-SCREEN GOOGLE MAP]      │
│                                    │
│   🟢 Pickup (green marker)         │
│      ┊┊┊┊┊ (route line)            │
│   🔴 Dropoff (orange marker)       │
│                                    │
│  (Your location moving in real-time)│
│                                    │
├────────────────────────────────────┤
│ 🚗 Heading to Pickup  5,600 XOF   │
│ ┌────────────────────────────────┐ │
│ │ 📍 Pickup Location             │ │
│ │ Bairro de Belém, Bissau        │ │
│ └────────────────────────────────┘ │
│                                    │
│  [🧭 Navigate to Pickup]           │
│  [✅ Start Trip]                   │
└────────────────────────────────────┘
```

---

## 🗺️ NAVIGATION FEATURES

### Navigate Button:
- **What it does**: Opens device navigation app
- **Android**: Opens Google Maps
- **iOS**: Opens Apple Maps
- **Fallback**: Web Google Maps
- **Shows**: Turn-by-turn directions

### Map Features:
- ✅ Real-time driver location
- ✅ Pickup marker (green)
- ✅ Dropoff marker (orange/gray)
- ✅ Route line (dashed)
- ✅ Zoom controls
- ✅ My location button

---

## 📊 RIDE INFORMATION

### What Driver Sees Before Accepting:
- 💰 **Fare Estimate**: e.g., "5,600 XOF"
- 📍 **Distance to Pickup**: e.g., "2.3 km away"
- 🟢 **Pickup Address**: e.g., "Bairro de Belém"
- 🔴 **Dropoff Address**: e.g., "Bissau Airport"
- 📏 **Trip Distance**: e.g., "8.5 km"
- ⏱️ **Estimated Duration**: e.g., "~15 min"
- 👤 **Passenger Name**: e.g., "Maria Silva"
- ⭐ **Passenger Rating**: e.g., "4.8"

### What Driver Sees After Accepting:
- 🗺️ **Full Map View**: Both locations visible
- 📍 **Current Destination**: Pickup or Dropoff
- 💰 **Fare**: Total ride amount
- 🧭 **Navigate Button**: One-tap directions
- ✅ **Action Button**: Start/Complete trip

---

## ⚡ QUICK ACTIONS

| Action | Where | What Happens |
|--------|-------|--------------|
| **Go Online** | Home screen toggle | Start receiving ride requests |
| **Go Offline** | Home screen toggle | Stop receiving ride requests |
| **View Rides** | Home → Available Rides | See nearby ride requests |
| **Accept Ride** | Available Rides screen | Assign ride to you |
| **Navigate** | Active Ride → Navigate button | Open Google Maps |
| **Start Trip** | Active Ride → Start button | Begin journey to dropoff |
| **Complete Trip** | Active Ride → Complete button | Finish ride, get paid |

---

## 🔔 NOTIFICATIONS

### When Ride Accepted:
✅ Alert: "Ride accepted!"
✅ Navigate to Active Ride screen
✅ See map with locations

### When Trip Started:
✅ Alert: "Trip started!"
✅ Dropoff marker changes color
✅ Navigate button updates destination

### When Trip Completed:
✅ Alert: "Trip completed!"
✅ Return to Home screen
✅ Earnings updated

---

## 🎯 STATUS BADGES

- **🟢 ONLINE**: Driver can receive ride requests
- **⚫ OFFLINE**: Driver not receiving requests
- **🚗 HEADING TO PICKUP**: Ride accepted, going to passenger
- **🏁 EN ROUTE TO DROPOFF**: Trip started, going to destination

---

## 📍 LOCATION TRACKING

### When Online:
- Updates every **15 seconds**
- Sent to backend automatically
- Used for passenger-driver matching

### During Active Ride:
- Updates every **5 seconds**
- More accurate tracking
- Better for distance calculations

---

## ⚠️ REQUIREMENTS

### To Accept Rides:
1. ✅ Driver account **activated** by admin
2. ✅ Toggle switch to **"Online"**
3. ✅ **Location permissions** granted
4. ✅ **Internet connection** active

### For Navigation:
1. ✅ **Google Maps** installed (Android)
2. ✅ **GPS** enabled
3. ✅ **Location permissions** granted

---

## 💡 PRO TIPS

1. **Stay Online Longer**: More opportunities to earn
2. **Accept Quickly**: First driver to accept gets the ride
3. **Check Distance**: Closer pickups = less wait time
4. **Use Navigation**: One-tap is faster than manual entry
5. **Complete Promptly**: Finish trips quickly for more rides

---

## 🚦 TRAFFIC LIGHT SYSTEM

```
🟢 GREEN = Good to go!
  - Online status
  - Ride accepted
  - Navigation active

🟡 YELLOW = Take action
  - Review ride details
  - Check distance
  - Prepare to navigate

🔴 RED = Stop/Complete
  - Arrive at location
  - Complete trip
  - Get paid
```

---

## 📞 COMMON QUESTIONS

**Q: How do I get ride requests?**
A: Toggle "Go Online" on Home screen

**Q: How do I see available rides?**
A: Tap "🚗 Available Rides" button on Home

**Q: How do I accept a ride?**
A: Tap "✅ Accept Ride" on any ride card

**Q: How do I navigate to passenger?**
A: Tap "🧭 Navigate to Pickup" button

**Q: How do I start the trip?**
A: Arrive at pickup → Tap "✅ Start Trip"

**Q: How do I complete the ride?**
A: Arrive at dropoff → Tap "🏁 Complete Trip"

---

**Everything a driver needs to know!** 🚗💨

For detailed technical information, see: `DRIVER_APP_WORKFLOW_GUIDE.md`
