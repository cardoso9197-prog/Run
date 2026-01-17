# 🧪 Complete Testing Checklist - Run-Run GW
## December 22, 2024

---

## 📦 Build Information

### Driver App Build
- **Build Link:** https://expo.dev/accounts/edipro/projects/runrun-driver/builds/3f675f08-d6a5-4ae3-87ee-42110ddd1e56
- **Features:** GPS tracking, location broadcasting (15s intervals)
- **Status:** Building...

### Passenger App Build  
- **Build Link:** Check Expo dashboard for latest build
- **Features:** Map view, driver tracking, ETA, name display fix
- **Status:** Building...

---

## ✅ PHASE 1: Installation & Basic Setup (10 minutes)

### Step 1.1: Install APKs
- [ ] Download Driver APK from Expo
- [ ] Download Passenger APK from Expo
- [ ] Install Driver APK on Device 1
- [ ] Install Passenger APK on Device 2
- [ ] Enable "Install from Unknown Sources" if needed

### Step 1.2: Grant Permissions
**Driver App:**
- [ ] Location permission (Allow all the time)
- [ ] Background location permission
- [ ] Notification permission

**Passenger App:**
- [ ] Location permission (Allow while using)
- [ ] Notification permission

---

## ✅ PHASE 2: Name Display & Storage Tests (15 minutes)

### Test 2.1: Existing User Login (Driver)
**Device:** Driver phone
**Steps:**
1. [ ] Open Driver app
2. [ ] Login with existing driver account
3. [ ] Check Home screen
4. [ ] **EXPECTED:** "Welcome, [Actual Name]! 👋" (not "Welcome, Driver!")
5. [ ] Screenshot if working ✓

**Result:** _______________

### Test 2.2: Existing User Login (Passenger)
**Device:** Passenger phone
**Steps:**
1. [ ] Open Passenger app
2. [ ] Login with existing passenger account
3. [ ] Check Home screen
4. [ ] **EXPECTED:** "Welcome, [Actual Name]! 👋" (not "Welcome, User!")
5. [ ] Screenshot if working ✓

**Result:** _______________

### Test 2.3: Profile Update (Passenger)
**Device:** Passenger phone
**Steps:**
1. [ ] Go to Profile screen
2. [ ] Change name to "Test Update"
3. [ ] Add/update email
4. [ ] Click Save button
5. [ ] **EXPECTED:** "Profile updated successfully!" (NO ERROR)
6. [ ] **EXPECTED:** No "column 'name' does not exist" error
7. [ ] Close and reopen app
8. [ ] Check profile shows "Test Update"

**Result:** _______________

### Test 2.4: Profile Update (Driver)
**Device:** Driver phone
**Steps:**
1. [ ] Go to Profile screen
2. [ ] Change name to "Test Driver Update"
3. [ ] Add/update email
4. [ ] Click Save button
5. [ ] **EXPECTED:** Profile updates without error
6. [ ] Verify changes persist

**Result:** _______________

### Test 2.5: New User Registration (Passenger)
**Device:** New phone OR logout and use new number
**Steps:**
1. [ ] Register new passenger account
2. [ ] Enter name: "New Test User"
3. [ ] Enter phone number
4. [ ] Complete OTP verification
5. [ ] **EXPECTED:** Immediately see "Welcome, New Test User! 👋"
6. [ ] Go to Profile screen
7. [ ] **EXPECTED:** Name shows "New Test User" (not "Passenger 1234")

**Result:** _______________

---

## ✅ PHASE 3: Driver GPS Tracking (20 minutes)

### Test 3.1: Driver Location Broadcasting
**Device:** Driver phone
**Prerequisites:** Have a ride to accept (or use test mode)

**Steps:**
1. [ ] Driver goes online
2. [ ] Passenger requests a ride
3. [ ] Driver accepts ride
4. [ ] Watch for location permission prompt
5. [ ] Grant "Allow all the time" permission
6. [ ] **EXPECTED:** Console shows "Location updated: lat: X.XX lng: Y.YY"
7. [ ] **EXPECTED:** Updates appear every 15 seconds
8. [ ] Move driver phone to different location
9. [ ] **EXPECTED:** New coordinates logged

**Console Output to Check:**
```
✅ Location tracking started
✅ Location updated: lat: 11.xxxx lng: -15.xxxx
✅ Location sent to server successfully
```

**Result:** _______________

### Test 3.2: Background Tracking
**Device:** Driver phone
**Steps:**
1. [ ] During active ride, press Home button
2. [ ] Wait 30 seconds
3. [ ] Return to app
4. [ ] **EXPECTED:** Location still updating in background
5. [ ] Check backend logs for POST /drivers/location
6. [ ] **EXPECTED:** Requests coming every 15 seconds

**Result:** _______________

### Test 3.3: Tracking Auto-Stop
**Device:** Driver phone
**Steps:**
1. [ ] Complete the ride
2. [ ] Click "Complete Ride" button
3. [ ] **EXPECTED:** Console shows "Location tracking stopped"
4. [ ] Wait 30 seconds
5. [ ] **EXPECTED:** No more location updates
6. [ ] Check backend logs
7. [ ] **EXPECTED:** No more POST /drivers/location requests

**Result:** _______________

---

## ✅ PHASE 4: Passenger Map & ETA (25 minutes)

### Test 4.1: Map Display on Ride Accept
**Device:** Passenger phone
**Steps:**
1. [ ] Request a ride
2. [ ] Wait for driver to accept
3. [ ] **EXPECTED:** Map view appears automatically
4. [ ] **EXPECTED:** See green pin (pickup location)
5. [ ] **EXPECTED:** See red pin (dropoff location)
6. [ ] **EXPECTED:** See blue 🚗 marker (driver location)
7. [ ] Screenshot the map ✓

**Visual Checklist:**
- [ ] Map centered on relevant area
- [ ] All 3 markers visible
- [ ] Map smooth and responsive

**Result:** _______________

### Test 4.2: Driver Location Updates
**Device:** Both phones
**Steps:**
1. [ ] Passenger watching map
2. [ ] Driver moves to different location (walk/drive)
3. [ ] Wait 15-20 seconds
4. [ ] **EXPECTED:** Blue 🚗 marker moves on passenger map
5. [ ] **EXPECTED:** Movement is smooth (not jumpy)
6. [ ] Move driver again
7. [ ] **EXPECTED:** Marker updates again

**Result:** _______________

### Test 4.3: ETA Calculation & Countdown
**Device:** Passenger phone
**Steps:**
1. [ ] During active ride, check top of screen
2. [ ] **EXPECTED:** See "Driver arriving in: X min"
3. [ ] Note the ETA: _____ minutes
4. [ ] Wait 1 minute
5. [ ] **EXPECTED:** ETA decreases (X-1 min)
6. [ ] Driver moves closer to pickup
7. [ ] **EXPECTED:** ETA adjusts accordingly

**ETA Test Cases:**
- [ ] ETA shows reasonable time (based on distance)
- [ ] ETA counts down as time passes
- [ ] ETA adjusts when driver moves closer
- [ ] ETA never shows 0 or negative

**Result:** _______________

### Test 4.4: Route Polylines
**Device:** Passenger phone
**Steps:**
1. [ ] During ride, observe map
2. [ ] **EXPECTED:** Blue dashed line from driver to pickup
3. [ ] **EXPECTED:** Line updates as driver moves
4. [ ] Driver arrives at pickup
5. [ ] Driver starts trip
6. [ ] **EXPECTED:** Green solid line from pickup to dropoff appears
7. [ ] Screenshot the route ✓

**Result:** _______________

### Test 4.5: Map Auto-Centering
**Device:** Passenger phone
**Steps:**
1. [ ] During active ride, manually drag map away
2. [ ] Wait 10-15 seconds
3. [ ] **EXPECTED:** Map automatically re-centers on driver
4. [ ] Zoom in/out manually
5. [ ] **EXPECTED:** Zoom level adjusts to show all markers

**Result:** _______________

---

## ✅ PHASE 5: End-to-End Full Ride Test (30 minutes)

### Test 5.1: Complete Ride Flow
**Devices:** Both phones
**Prerequisites:** Real locations (not simulator)

**Driver Side:**
1. [ ] Driver opens app and goes online
2. [ ] Name displays correctly on home screen
3. [ ] Wait for ride request

**Passenger Side:**
4. [ ] Open app, see correct name on home
5. [ ] Enter pickup location
6. [ ] Enter dropoff location
7. [ ] Request ride
8. [ ] **EXPECTED:** "Searching for driver..." message

**Driver Accepts:**
9. [ ] Driver receives notification
10. [ ] Driver sees passenger details
11. [ ] Driver clicks "Accept"
12. [ ] **EXPECTED:** Location tracking starts automatically
13. [ ] **EXPECTED:** Console logs location updates

**Passenger Tracking:**
14. [ ] Map appears on passenger screen
15. [ ] Blue 🚗 marker shows driver location
16. [ ] ETA displays at top
17. [ ] Driver route line visible
18. [ ] Watch driver marker move in real-time
19. [ ] ETA counts down

**Driver Arrives:**
20. [ ] Driver arrives at pickup location
21. [ ] Driver clicks "Start Trip"
22. [ ] **EXPECTED:** Trip route line appears on passenger map

**During Trip:**
23. [ ] Driver follows route to dropoff
24. [ ] Location updates continue
25. [ ] Passenger sees driver moving on map

**Trip Complete:**
26. [ ] Driver arrives at dropoff
27. [ ] Driver clicks "Complete Trip"
28. [ ] **EXPECTED:** Location tracking stops
29. [ ] Payment screen appears
30. [ ] Both apps update to "Completed" status

**Final Verification:**
31. [ ] Check driver profile - name correct
32. [ ] Check passenger profile - name correct
33. [ ] Check ride history - ride recorded
34. [ ] Check backend logs - no errors

**Result:** _______________

---

## ✅ PHASE 6: Edge Cases & Error Handling (20 minutes)

### Test 6.1: Network Loss During Ride
**Steps:**
1. [ ] Start active ride with tracking
2. [ ] Turn off mobile data/WiFi on passenger phone
3. [ ] Wait 30 seconds
4. [ ] Turn network back on
5. [ ] **EXPECTED:** Map reconnects and updates
6. [ ] **EXPECTED:** No app crash

**Result:** _______________

### Test 6.2: GPS Signal Loss (Driver)
**Steps:**
1. [ ] During active ride, cover GPS antenna
2. [ ] Or go into building/underground
3. [ ] **EXPECTED:** Last known location maintained
4. [ ] Return to GPS signal
5. [ ] **EXPECTED:** Location updates resume

**Result:** _______________

### Test 6.3: App Backgrounded During Ride
**Steps:**
1. [ ] Active ride in progress
2. [ ] Driver minimizes app for 2 minutes
3. [ ] **EXPECTED:** Background tracking continues
4. [ ] Passenger minimizes app
5. [ ] Return to app
6. [ ] **EXPECTED:** Map updates with latest position

**Result:** _______________

### Test 6.4: Location Permission Denied
**Steps:**
1. [ ] Driver accepts ride
2. [ ] Deny location permission
3. [ ] **EXPECTED:** Error message shown
4. [ ] **EXPECTED:** Prompt to enable location
5. [ ] Grant permission
6. [ ] **EXPECTED:** Tracking starts working

**Result:** _______________

### Test 6.5: Battery Optimization Interference
**Steps:**
1. [ ] Check battery settings
2. [ ] Ensure apps NOT in battery optimization
3. [ ] If optimized, test if background tracking stops
4. [ ] Document any battery optimization issues

**Result:** _______________

---

## ✅ PHASE 7: Performance & Battery Tests (30 minutes)

### Test 7.1: Battery Usage (Driver)
**Device:** Driver phone
**Steps:**
1. [ ] Note battery level: ____%
2. [ ] Accept ride and track for 30 minutes
3. [ ] Note battery level after: ____%
4. [ ] Calculate drain: ____% (should be <10%)
5. [ ] Check Settings → Battery → App usage
6. [ ] Document battery consumption

**Result:** _______________
**Battery Drain:** _____%

### Test 7.2: Battery Usage (Passenger)
**Device:** Passenger phone
**Steps:**
1. [ ] Note battery level: ____%
2. [ ] Active ride with map for 30 minutes
3. [ ] Note battery level after: ____%
4. [ ] Calculate drain: ____% (should be <8%)

**Result:** _______________
**Battery Drain:** _____%

### Test 7.3: App Performance
**Both Apps:**
- [ ] No lag when opening screens
- [ ] Map scrolling is smooth (>30 FPS)
- [ ] No freezing or stuttering
- [ ] Quick response to button taps
- [ ] No memory warnings

**Result:** _______________

### Test 7.4: Multiple Consecutive Rides
**Steps:**
1. [ ] Complete 3 rides back-to-back
2. [ ] Check for memory leaks
3. [ ] Verify tracking starts/stops correctly each time
4. [ ] No cumulative slowdown

**Result:** _______________

---

## ✅ PHASE 8: Real-World Bissau Testing (60 minutes)

### Test 8.1: Bissau Traffic Conditions
**Location:** Real Bissau streets
**Steps:**
1. [ ] Test in heavy traffic area
2. [ ] Test in residential area
3. [ ] Test on main roads
4. [ ] Verify ETA adjusts for Bissau traffic (20 km/h assumption)

**Result:** _______________

### Test 8.2: GPS Accuracy in Bissau
**Steps:**
1. [ ] Test in different neighborhoods
2. [ ] Note GPS accuracy in each area
3. [ ] Check for GPS drift
4. [ ] Verify map shows correct streets

**Locations Tested:**
- [ ] Downtown: _______________
- [ ] Residential: _______________
- [ ] Near water: _______________

**Result:** _______________

### Test 8.3: Network Conditions
**Steps:**
1. [ ] Test with 4G connection
2. [ ] Test with 3G connection
3. [ ] Test with weak signal
4. [ ] Verify graceful degradation

**Result:** _______________

---

## 📊 Final Summary

### ✅ Passing Tests: _____ / _____
### ❌ Failing Tests: _____ / _____
### ⚠️  Issues Found: _____

---

## 🐛 Issues Log

### Issue 1:
**Description:** 
**Severity:** [ ] Critical  [ ] High  [ ] Medium  [ ] Low
**Steps to Reproduce:**
**Expected:**
**Actual:**

### Issue 2:
**Description:** 
**Severity:** [ ] Critical  [ ] High  [ ] Medium  [ ] Low
**Steps to Reproduce:**
**Expected:**
**Actual:**

---

## ✅ Sign-Off

**Tested By:** _______________
**Date:** December 22, 2024
**Duration:** _____ minutes
**Overall Status:** [ ] Pass  [ ] Pass with Issues  [ ] Fail

**Notes:**


**Ready for Production:** [ ] YES  [ ] NO (explain): 


---

## 📱 APK Download Links

Once builds complete, add links here:

**Driver APK:** 
- Build: https://expo.dev/accounts/edipro/projects/runrun-driver/builds/3f675f08-d6a5-4ae3-87ee-42110ddd1e56
- Direct Download: _______________

**Passenger APK:**
- Build: _______________
- Direct Download: _______________

---

## 🎯 Success Criteria

**Must Pass (Critical):**
- [x] Backend deployed successfully
- [x] Database migration completed
- [ ] Profile update works without errors
- [ ] Names display correctly
- [ ] Driver location tracking works
- [ ] Passenger map displays correctly
- [ ] ETA calculates reasonably
- [ ] Complete ride end-to-end successful

**Should Pass (High Priority):**
- [ ] Battery drain acceptable (<10% per 30 min)
- [ ] No app crashes
- [ ] Smooth performance
- [ ] Background tracking works

**Nice to Have (Medium Priority):**
- [ ] Auto-centering works well
- [ ] Visual polish (markers, lines)
- [ ] Error messages helpful

---

**Next Steps After Testing:**
1. Document all issues found
2. Prioritize fixes (Critical → High → Medium)
3. Fix critical issues
4. Retest failed tests
5. If all pass → Release to users! 🚀
6. If issues remain → Create fix plan

