# 🔔 Push Notification Implementation - Complete Guide

## 📋 Overview
This document explains the complete push notification system that solves the critical issue: **"passenger app still saying not drivers available please wait"**

**Problem Solved:** Previously, when passengers requested rides, drivers had NO automatic notification. They had to manually check the "Available Rides" screen which only refreshes every 5 seconds. This meant passengers could wait indefinitely while drivers were unaware of new ride requests.

**Solution:** Real-time push notifications instantly alert nearby online drivers when a passenger books a ride. Their phones buzz, they tap the notification, and can immediately accept the ride.

---

## 🏗️ Architecture

### Components Added:
1. **Frontend (Driver App)**
   - `notificationService.js` - Handles registration and notification events
   - `App.js` modifications - Initializes notifications on login
   
2. **Backend**
   - `pushNotifications.js` - Utility to send notifications via Expo Push API
   - `rides.js` modifications - Sends notifications when ride requested
   - `drivers.js` modifications - Saves push tokens to database
   
3. **Database**
   - `003_add_push_notifications.sql` - Migration adds push token columns

---

## 📱 Driver App Implementation

### File: `RunRunDriver/src/services/notificationService.js`

**Purpose:** Singleton service managing all push notification operations

**Key Functions:**

```javascript
registerForPushNotifications()
```
- Checks if device supports push notifications
- Requests user permission (Android auto-grants, iOS requires approval)
- Gets Expo push token (format: `ExponentPushToken[xxxxx]`)
- Configures Android notification channel with vibration

```javascript
sendTokenToBackend(token)
```
- Sends push token to backend API: `POST /api/drivers/push-token`
- Includes platform info (android/ios)
- Stores token in database for future notifications

```javascript
setupNotificationListeners(onNotificationTap)
```
- Foreground handler: Shows alert when app is open
- Background handler: Navigates to appropriate screen when notification tapped
- Cleanup method to remove listeners

**Android Configuration:**
```javascript
channelId: 'default'
name: 'Default notifications'
importance: Notifications.AndroidImportance.MAX
vibrationPattern: [0, 250, 250, 250] // Buzz pattern
```

---

### File: `RunRunDriver/App.js` Modifications

**Changes:**
1. Added import: `notificationService`
2. Added `navigationRef` to `NavigationContainer` for programmatic navigation
3. Created `setupPushNotifications()` function
4. Added `useEffect` hook that triggers when driver logs in AND is activated

**Logic Flow:**
```
Driver logs in → isLoggedIn = true
Driver status = activated → isActivated = true
↓
useEffect triggers
↓
setupPushNotifications() called
↓
1. Register for push notifications (get token)
2. Send token to backend (save to database)
3. Setup listeners (handle notification taps)
```

**Code Snippet:**
```javascript
useEffect(() => {
  if (isLoggedIn && isActivated) {
    setupPushNotifications();
  }
  return () => {
    notificationService.removeNotificationListeners();
  };
}, [isLoggedIn, isActivated]);
```

---

## 🔧 Backend Implementation

### File: `backend/utils/pushNotifications.js`

**Purpose:** Utility module for sending push notifications via Expo Push API

**Key Functions:**

```javascript
sendPushNotification(pushToken, title, body, data)
```
- Sends to single device
- Validates token format (must start with `ExponentPushToken[`)
- Uses Expo Push API: `https://exp.host/--/api/v2/push/send`

```javascript
sendBatchPushNotifications(messages)
```
- Sends to multiple devices in one API call
- Filters invalid tokens
- More efficient than individual sends

```javascript
notifyDriversAboutNewRide(ride, nearbyDrivers)
```
- Specialized function for new ride notifications
- Format: "🚗 New Ride Request! | 5,000 XOF • 2.3 km away"
- Includes data payload: `{ type: 'new_ride', rideId, fare, distance, pickup, dropoff }`

**Notification Format:**
```javascript
{
  to: 'ExponentPushToken[xxxxx]',
  sound: 'default',
  title: '🚗 New Ride Request!',
  body: '5,000 XOF • 2.3 km away',
  data: {
    type: 'new_ride',
    rideId: 123,
    fare: 5000,
    distance: 2.3,
    pickupAddress: 'Airport',
    dropoffAddress: 'City Center'
  },
  priority: 'high',
  channelId: 'default'
}
```

---

### File: `backend/routes/rides.js` Modifications

**Location:** Inside `POST /api/rides/request` endpoint, after ride creation

**Logic Flow:**
```
1. Passenger books ride → Ride created with status = 'requested'
2. Query database for eligible drivers:
   - status = 'online'
   - is_activated = true
   - push_token IS NOT NULL
   - current_latitude/longitude IS NOT NULL
3. Calculate distance from each driver to pickup location
4. Filter drivers within 10km radius (configurable MAX_DISTANCE_KM)
5. Send push notifications to all eligible drivers
6. Log results (success or failure)
7. Continue ride request (don't fail if notifications fail)
```

**SQL Query:**
```sql
SELECT 
  d.id,
  d.user_id,
  d.push_token,
  d.push_platform,
  d.current_latitude,
  d.current_longitude
FROM drivers d
WHERE d.status = 'online' 
  AND d.is_activated = true
  AND d.push_token IS NOT NULL
  AND d.current_latitude IS NOT NULL
  AND d.current_longitude IS NOT NULL
```

**Distance Filtering:**
```javascript
const MAX_DISTANCE_KM = 10; // Only notify drivers within 10km
const eligibleDrivers = driversWithDistance.filter(
  driver => driver.distanceToPickup <= MAX_DISTANCE_KM
);
```

**Error Handling:**
- Wrapped in try-catch block
- Logs errors but doesn't fail ride request
- Ensures ride booking succeeds even if push notifications fail

---

### File: `backend/routes/drivers.js` Modifications

**New Endpoint:** `POST /api/drivers/push-token`

**Purpose:** Save driver's push token to database

**Authentication:** Requires `requireDriver` middleware (must be logged in)

**Request Body:**
```javascript
{
  "pushToken": "ExponentPushToken[xxxxx]",
  "platform": "android" // or "ios"
}
```

**SQL Update:**
```sql
UPDATE drivers 
SET push_token = $1, 
    push_platform = $2, 
    push_token_updated_at = NOW()
WHERE user_id = $3
```

**Response:**
```javascript
{
  "success": true,
  "message": "Push token updated successfully"
}
```

---

## 🗄️ Database Changes

### File: `backend/database/migrations/003_add_push_notifications.sql`

**Columns Added to `drivers` table:**

| Column | Type | Description |
|--------|------|-------------|
| `push_token` | TEXT | Expo push token (nullable) |
| `push_platform` | VARCHAR(20) | Platform: 'android' or 'ios' |
| `push_token_updated_at` | TIMESTAMP | Last token update time |

**Indexes Created:**
```sql
CREATE INDEX idx_drivers_push_token ON drivers(push_token);
CREATE INDEX idx_drivers_status_push ON drivers(status, push_token);
```

**Why Indexes?**
- `idx_drivers_push_token`: Fast lookup when checking if token exists
- `idx_drivers_status_push`: Optimizes query for online drivers with tokens

**Migration Command:**
```bash
psql $DATABASE_URL -f backend/database/migrations/003_add_push_notifications.sql
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DRIVER OPENS APP                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Driver logs in (username + password)                    │
│  2. Backend verifies credentials                            │
│  3. Frontend checks: is_activated = true?                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  setupPushNotifications() triggered                         │
│  ├─ registerForPushNotifications()                          │
│  │   ├─ Request permission                                  │
│  │   ├─ Get Expo push token                                 │
│  │   └─ Configure Android channel                           │
│  ├─ sendTokenToBackend(token)                               │
│  │   └─ POST /api/drivers/push-token                        │
│  └─ setupNotificationListeners()                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend saves to database:                                 │
│  push_token = "ExponentPushToken[xxxxx]"                    │
│  push_platform = "android"                                  │
│  push_token_updated_at = NOW()                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
              ⏱️ DRIVER WAITS (can use app normally)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PASSENGER BOOKS RIDE                            │
│  ├─ Opens MapLocationPickerScreen                           │
│  ├─ Searches for dropoff location                           │
│  ├─ Selects location (coordinates captured)                 │
│  ├─ Goes to BookRideScreen                                  │
│  └─ Taps "Request Ride"                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: POST /api/rides/request                           │
│  ├─ Validate pickup/dropoff coordinates                     │
│  ├─ Calculate distance and fare                             │
│  ├─ Create ride record (status = 'requested')               │
│  └─ TRIGGER PUSH NOTIFICATIONS                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Find nearby drivers:                                       │
│  SELECT * FROM drivers                                      │
│  WHERE status = 'online'                                    │
│    AND is_activated = true                                  │
│    AND push_token IS NOT NULL                               │
│    AND current_latitude/longitude IS NOT NULL               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Filter by distance:                                        │
│  ├─ Calculate distance from each driver to pickup           │
│  ├─ Keep only drivers within 10km radius                    │
│  └─ Result: eligibleDrivers[] array                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Send push notifications via Expo API                       │
│  POST https://exp.host/--/api/v2/push/send                  │
│  [                                                           │
│    {                                                         │
│      to: "ExponentPushToken[driver1]",                      │
│      title: "🚗 New Ride Request!",                         │
│      body: "5,000 XOF • 2.3 km away",                       │
│      data: { type: 'new_ride', rideId: 123, ... }           │
│    },                                                        │
│    { ... driver2 ... },                                     │
│    { ... driver3 ... }                                      │
│  ]                                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            📱 DRIVER'S PHONE BUZZES 📳                       │
│  Notification appears:                                      │
│  ┌──────────────────────────────────────┐                  │
│  │ 🚗 New Ride Request!                 │                  │
│  │ 5,000 XOF • 2.3 km away              │                  │
│  │ Tap to view details                  │                  │
│  └──────────────────────────────────────┘                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Driver taps notification                                   │
│  ├─ App opens (if closed)                                   │
│  ├─ navigates to "AvailableRides" screen                    │
│  └─ Shows ride details with Accept/Ignore buttons           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Driver taps "Accept Ride"                                  │
│  ├─ POST /api/drivers/rides/:id/accept                      │
│  ├─ Ride status updated: 'requested' → 'accepted'           │
│  ├─ Driver assigned to ride                                 │
│  └─ Navigate to ActiveRideScreen                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Passenger sees: "Driver is on the way!"                    │
│  Driver sees: Full-screen map with pickup location          │
│  ✅ RIDE MATCHED SUCCESSFULLY!                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Dependencies

### Driver App (package.json):
```json
{
  "expo-notifications": "~0.27.6",
  "expo-device": "~5.9.3",
  "expo-constants": "~15.4.5"
}
```

### Backend (package.json):
```json
{
  "axios": "^1.6.0" // For Expo Push API calls
}
```

---

## 🧪 Testing Guide

### 1. Test Push Token Registration

**Driver App:**
1. Open RunRunDriver app
2. Login with test driver account
3. Check app logs for: "✅ Push token registered: ExponentPushToken[xxxxx]"

**Backend:**
```sql
SELECT id, first_name, push_token, push_platform, push_token_updated_at 
FROM drivers 
WHERE push_token IS NOT NULL;
```

Expected: Driver's push token should be saved

---

### 2. Test Notification Sending

**Method 1: Create Real Ride (End-to-End)**

**Passenger App:**
1. Open RunRunPassenger app
2. Login with test passenger
3. Search for dropoff location
4. Request ride
5. Wait for "Searching for drivers..." screen

**Driver App:**
1. Should receive notification within 2-3 seconds
2. Phone should vibrate
3. Notification should show: "🚗 New Ride Request! | XXXX XOF • X.X km away"
4. Tap notification
5. Should navigate to "Available Rides" screen
6. Should see ride with Accept/Ignore buttons

---

**Method 2: Manual Test via cURL**

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[YOUR_TOKEN_HERE]",
    "title": "🚗 Test Notification",
    "body": "Testing push notifications",
    "data": { "test": true },
    "sound": "default",
    "priority": "high"
  }'
```

---

### 3. Test Different Scenarios

**Scenario A: Driver Too Far Away**
- Driver location: 15km from pickup
- Expected: Driver should NOT receive notification (MAX_DISTANCE_KM = 10)

**Scenario B: Driver Offline**
- Driver status: 'offline'
- Expected: Driver should NOT receive notification

**Scenario C: Driver Not Activated**
- Driver is_activated: false
- Expected: Driver should NOT receive notification

**Scenario D: Multiple Nearby Drivers**
- 3 drivers within 10km, all online and activated
- Expected: All 3 should receive notification simultaneously

---

## 🐛 Troubleshooting

### Issue: Driver Not Receiving Notifications

**Checklist:**

1. ✅ Is driver logged in?
   ```sql
   SELECT status FROM drivers WHERE user_id = X;
   ```

2. ✅ Is driver activated?
   ```sql
   SELECT is_activated FROM drivers WHERE user_id = X;
   ```

3. ✅ Does driver have push token?
   ```sql
   SELECT push_token FROM drivers WHERE user_id = X;
   ```

4. ✅ Is driver status 'online'?
   - Driver must tap "Go Online" button in app

5. ✅ Does driver have location permissions?
   - Check device settings → RunRunDriver → Location → Allow

6. ✅ Is driver's current location saved?
   ```sql
   SELECT current_latitude, current_longitude FROM drivers WHERE user_id = X;
   ```

7. ✅ Is driver within 10km radius?
   - Calculate distance from driver location to pickup location

8. ✅ Check backend logs for errors:
   ```bash
   railway logs
   ```
   Look for: "❌ Failed to send push notifications"

---

### Issue: Notification Shows But No Vibration

**Fix:**
1. Check device settings → Notifications → RunRunDriver
2. Enable "Vibrate" option
3. Ensure "Do Not Disturb" is off
4. Check battery saver settings (might disable vibration)

---

### Issue: Invalid Push Token Error

**Symptom:**
Backend logs show: "Invalid push token: null" or "Invalid push token: undefined"

**Fix:**
1. Driver app: Delete app data and reinstall
2. Login again (this re-registers push token)
3. Verify token saved:
   ```sql
   SELECT push_token FROM drivers WHERE user_id = X;
   ```

---

### Issue: Expo Push API Returns Error

**Common Errors:**

**"DeviceNotRegistered"**
- Token expired or invalid
- Solution: Re-register push token (logout and login)

**"MessageRateExceeded"**
- Sending too many notifications too fast
- Solution: Implement rate limiting (max 1 notification per driver per minute)

**"InvalidCredentials"**
- Expo push credentials not configured
- Solution: Run `eas credentials` in driver app directory

---

## 📊 Performance Metrics

### Expected Timings:
- Token registration: 1-2 seconds
- Token save to database: < 100ms
- Ride creation: 200-500ms
- Find nearby drivers query: 50-100ms
- Send push notification: 500ms - 2 seconds
- Driver receives notification: 1-3 seconds total

### Optimization Tips:
- Use database indexes (already created in migration)
- Batch notifications (already implemented)
- Filter drivers by distance before sending (already implemented)
- Set reasonable MAX_DISTANCE_KM (currently 10km)

---

## 🔒 Security Considerations

### 1. Token Storage
- ✅ Push tokens stored in database (not in code)
- ✅ Tokens encrypted in transit (HTTPS)
- ✅ Only authenticated drivers can update tokens

### 2. Authorization
- ✅ `requireDriver` middleware on token endpoint
- ✅ Drivers can only update their own token (user_id from JWT)

### 3. Rate Limiting
- ⚠️ TODO: Implement rate limiting on ride requests
- Prevents spam ride requests → spam notifications

### 4. Token Expiration
- ⚠️ TODO: Implement token refresh mechanism
- Expo tokens can expire or become invalid

---

## 🚀 Deployment Checklist

### Before Deploying:

- [x] 1. Install dependencies
  ```bash
  cd RunRunDriver
  npm install expo-notifications expo-device expo-constants
  
  cd ../backend
  npm install axios
  ```

- [x] 2. Run database migration
  ```bash
  psql $DATABASE_URL -f backend/database/migrations/003_add_push_notifications.sql
  ```

- [ ] 3. Configure Expo push credentials
  ```bash
  cd RunRunDriver
  eas credentials
  ```

- [ ] 4. Rebuild driver APK
  ```bash
  npx eas build --platform android --profile preview --non-interactive
  ```

- [ ] 5. Test on physical device (emulator doesn't support push)

- [ ] 6. Monitor Railway logs for errors
  ```bash
  railway logs --tail
  ```

---

## 📈 Monitoring & Analytics

### Log Messages to Watch:

**Success:**
```
✅ Push token registered: ExponentPushToken[xxxxx]
📍 Found 3 eligible drivers within 10km
✅ Push notifications sent to 3 drivers
```

**Warnings:**
```
⚠️ No drivers found within 10km radius
⚠️ No online drivers with push tokens available
```

**Errors:**
```
❌ Failed to send push notifications: [error details]
❌ Error sending push notification: DeviceNotRegistered
```

### Recommended Metrics to Track:
1. Number of notifications sent per day
2. Average notification delivery time
3. Percentage of notifications delivered successfully
4. Number of rides accepted via notification tap
5. Average time from notification to driver acceptance

---

## 🎯 Next Steps & Improvements

### Phase 2 Enhancements:

1. **Silent Notifications**
   - Send silent update notifications every 30 seconds
   - Update available rides list without disturbing driver

2. **Notification Preferences**
   - Let drivers set notification radius (5km, 10km, 20km)
   - Sound preferences (mute, vibrate only, full alert)

3. **Smart Routing**
   - Consider driver's current direction
   - Only notify drivers heading towards pickup

4. **Priority System**
   - High-value rides (longer distance) get sent to more drivers
   - Regular rides only to nearest 3 drivers

5. **Analytics Dashboard**
   - Show driver: "You've received 45 ride notifications today"
   - Acceptance rate, average response time

---

## 📚 Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push API](https://docs.expo.dev/push-notifications/overview/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

---

## ✅ Implementation Status

| Component | Status | File |
|-----------|--------|------|
| Driver notification service | ✅ Complete | `notificationService.js` |
| Driver app initialization | ✅ Complete | `App.js` |
| Backend push utility | ✅ Complete | `pushNotifications.js` |
| Ride request modifications | ✅ Complete | `rides.js` |
| Push token endpoint | ✅ Complete | `drivers.js` |
| Database migration | ✅ Complete | `003_add_push_notifications.sql` |
| Dependencies installed | ✅ Complete | package.json files |
| Documentation | ✅ Complete | This file |

**SYSTEM IS READY FOR TESTING! 🎉**

---

## 🤝 Support

If you encounter issues:
1. Check this troubleshooting section
2. Review Railway logs: `railway logs`
3. Test with manual cURL command
4. Verify database has push tokens saved
5. Ensure driver is online, activated, and within range

**Remember:** Push notifications only work on physical devices, not emulators!

---

*Last Updated: February 15, 2025*
*Developer: Edivaldo Cardoso*
