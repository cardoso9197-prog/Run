# 🧪 Run Run - Complete End-to-End Testing Guide

**Test Date:** December 22, 2025  
**Version:** Production Testing v1.0  
**Duration:** 2-3 hours  
**Participants:** 2 people (1 passenger, 1 driver)

---

## 📋 PRE-TEST SETUP

### Requirements Checklist:

**Devices:**
- [ ] 2 Android phones (one for driver, one for passenger)
- [ ] Both phones with GPS enabled
- [ ] Both phones with internet connection (4G/WiFi)
- [ ] Both phones charged (80%+ battery)

**Apps Installed:**
- [ ] Driver App: https://expo.dev/accounts/edipro/projects/runrun-driver/builds/3f675f08-d6a5-4ae3-87ee-42110ddd1e56
- [ ] Passenger App: https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/4de08069-0894-4138-bbe6-70185ea5990e

**Accounts:**
- [ ] Driver registered and approved in admin panel
- [ ] Passenger registered
- [ ] Both accounts verified with OTP

**Test Environment:**
- [ ] Real streets in Bissau (not simulated)
- [ ] Driver with actual vehicle
- [ ] Starting location determined
- [ ] Destination determined (2-5km away)

**Documentation:**
- [ ] Notebook or device for notes
- [ ] Camera for screenshots
- [ ] Stopwatch or timer

---

## 🎯 TEST OBJECTIVES

### What We're Testing:

✅ **Complete User Journey** - From signup to ride completion  
✅ **GPS Tracking** - Real-time location accuracy  
✅ **ETA Calculation** - Time estimation accuracy  
✅ **Map Display** - Visual representation  
✅ **Payment Flow** - From request to payment  
✅ **Ratings System** - Post-ride feedback  
✅ **Battery Usage** - Power consumption  
✅ **Network Reliability** - Connection stability  
✅ **Error Handling** - How app handles issues  

---

## 📱 TEST PHASE 1: REGISTRATION & SETUP (15 minutes)

### 1.1 Passenger Registration

**Steps:**
1. Open Passenger App
2. Click "Sign Up" or "Register"
3. Enter phone number: +245 [test number]
4. Wait for OTP code
5. Enter OTP code
6. Complete profile:
   - Name: [Test Name]
   - Email: [Test Email]
   - Optional: Photo
7. Accept terms & conditions
8. Click "Complete Registration"

**Expected Results:**
- ✅ OTP arrives within 30 seconds
- ✅ Registration completes successfully
- ✅ Welcome screen shows with user name
- ✅ Map loads with current location

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________
- Screenshots: _________________

---

### 1.2 Driver Registration

**Steps:**
1. Open Driver App
2. Click "Sign Up" or "Register"
3. Enter phone number: +245 [test number]
4. Wait for OTP code
5. Enter OTP code
6. Complete profile:
   - Name: [Driver Name]
   - Email: [Driver Email]
   - Vehicle Type: [Moto/Normal/Premium]
   - License Plate: [Plate Number]
   - License Number: [License #]
7. Upload documents (if required)
8. Submit for approval

**Then in Admin Panel:**
9. Login to admin panel
10. Navigate to drivers list
11. Find test driver
12. Click "Approve"

**Expected Results:**
- ✅ Driver registration submits successfully
- ✅ Admin can see driver in pending list
- ✅ Approval updates driver status
- ✅ Driver app shows "Approved" status

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________
- Screenshots: _________________

---

## 🚗 TEST PHASE 2: RIDE REQUEST (10 minutes)

### 2.1 Driver Goes Online

**Steps:**
1. Driver opens app
2. Checks profile is approved
3. Clicks "Go Online" button
4. Verifies status shows "Online"
5. Waits for ride request

**Expected Results:**
- ✅ Status changes to "Online"
- ✅ Map shows driver's current location
- ✅ Green indicator shows driver is active

**Timings:**
- Time to go online: ____ seconds

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

### 2.2 Passenger Requests Ride

**Steps:**
1. Passenger opens app
2. Views map with current location (blue dot)
3. Enters destination in search box
4. Selects destination from suggestions
5. Reviews route on map
6. Selects vehicle type (Moto/Normal/Premium)
7. Views price estimate
8. Clicks "Request Ride"
9. Waits for driver to accept

**Expected Results:**
- ✅ Current location detected accurately
- ✅ Destination search works
- ✅ Price estimate displays correctly
- ✅ "Searching for driver..." message shows
- ✅ Ride request sent to nearby drivers

**Timings:**
- Time to enter destination: ____ seconds
- Price estimate shown: ____ CFA
- Distance: ____ km

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________
- Screenshot of price: __________

---

### 2.3 Driver Receives & Accepts Request

**Steps:**
1. Driver hears notification sound
2. Ride request card appears on screen
3. Driver views:
   - Passenger name
   - Pickup location
   - Distance to pickup
   - Estimated fare
4. Driver clicks "Accept"
5. App confirms acceptance

**Expected Results:**
- ✅ Notification arrives within 5 seconds
- ✅ All ride details visible
- ✅ Accept button works
- ✅ Confirmation message appears
- ✅ Passenger notified immediately

**Timings:**
- Time from request to notification: ____ seconds
- Driver acceptance time: ____ seconds

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

## 📍 TEST PHASE 3: NAVIGATION & GPS TRACKING (20-30 minutes)

### 3.1 Passenger Tracks Driver Approaching

**Passenger Side Steps:**
1. Screen shows "Driver accepted!"
2. Map displays:
   - Passenger location (green marker)
   - Driver location (blue car marker 🚗)
   - Route from driver to passenger (dashed line)
3. ETA displays (e.g., "5 min")
4. Watch driver marker move in real-time
5. Observe ETA countdown
6. Wait for driver to arrive

**Test Every 30 Seconds:**
| Time | Driver Moved? | ETA Updated? | Map Centered? | Notes |
|------|--------------|--------------|---------------|-------|
| 0:00 | N/A          | 5 min        | Yes           |       |
| 0:30 | Yes/No       | __ min       | Yes/No        |       |
| 1:00 | Yes/No       | __ min       | Yes/No        |       |
| 1:30 | Yes/No       | __ min       | Yes/No        |       |
| 2:00 | Yes/No       | __ min       | Yes/No        |       |

**Expected Results:**
- ✅ Driver marker updates every 15 seconds
- ✅ ETA recalculates dynamically
- ✅ Map auto-centers on driver
- ✅ Dashed line shows driver route
- ✅ No lag or freezing

**Test Results:**
- [ ] PASS / [ ] FAIL
- GPS update frequency: ____ seconds
- ETA accuracy: ____ % (compare estimate vs actual)
- Notes: _______________________
- Screenshots at 1min, 3min, 5min: _______

---

### 3.2 Driver Navigation to Pickup

**Driver Side Steps:**
1. Screen shows "Navigate to passenger"
2. Map displays:
   - Driver location (blue dot)
   - Passenger location (green marker)
   - Route to passenger
3. Follow directions on map
4. Drive towards passenger location
5. Observe GPS accuracy
6. Mark "Arrived at Pickup" when reached

**Test During Drive:**
- GPS location accuracy: _____ (precise/good/poor)
- Map rotation: _____ (yes/no)
- Route suggestions: _____ (helpful/confusing)
- Battery drain in 5 min: _____ %

**Expected Results:**
- ✅ Driver's own location updates smoothly
- ✅ Route is clear and accurate
- ✅ "Arrived" button becomes enabled near pickup
- ✅ App sends location to server every 15 seconds

**Test Results:**
- [ ] PASS / [ ] FAIL
- Actual time to reach passenger: ____ minutes
- GPS accuracy: ____ meters
- Notes: _______________________

---

### 3.3 Pickup Confirmation

**Steps:**
1. Driver arrives at passenger location
2. Driver taps "Arrived at Pickup"
3. Passenger receives notification
4. Driver verifies passenger identity
5. Passenger gets in vehicle
6. Driver taps "Start Trip"
7. Passenger app shows "Trip Started"

**Expected Results:**
- ✅ "Arrived" notification sent to passenger
- ✅ "Start Trip" button works
- ✅ Both apps update to "Trip in Progress"
- ✅ Trip route displays (green solid line)
- ✅ Timer starts counting

**Timings:**
- Actual time from request to pickup: ____ minutes
- Expected time: ____ minutes
- Accuracy: ____ %

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

### 3.4 Trip in Progress - En Route

**During Trip (Every 2 minutes):**

| Time | Passenger Map OK? | Driver GPS OK? | Route Accurate? | Battery % Driver | Battery % Pass |
|------|-------------------|----------------|-----------------|------------------|----------------|
| 0:00 | Yes/No            | Yes/No         | Yes/No          | __%             | __%           |
| 2:00 | Yes/No            | Yes/No         | Yes/No          | __%             | __%           |
| 4:00 | Yes/No            | Yes/No         | Yes/No          | __%             | __%           |
| 6:00 | Yes/No            | Yes/No         | Yes/No          | __%             | __%           |

**Passenger Side:**
- Map shows:
  - Current location (moving blue dot)
  - Destination (red marker)
  - Route (green solid line)
  - ETA to destination

**Driver Side:**
- Map shows:
  - Current location (moving blue dot)
  - Destination (red marker)
  - Navigation directions
  - Trip timer

**Expected Results:**
- ✅ Both apps track trip in real-time
- ✅ Route displays correctly
- ✅ ETA updates as trip progresses
- ✅ No crashes or freezes
- ✅ Battery drains reasonably (<10% in 30min)

**Test Results:**
- [ ] PASS / [ ] FAIL
- Total trip distance: ____ km
- Total trip time: ____ minutes
- Battery drain driver: ____ %
- Battery drain passenger: ____ %
- GPS disconnections: ____ times
- Notes: _______________________

---

### 3.5 Arrival & Dropoff

**Steps:**
1. Driver arrives at destination
2. Driver taps "Complete Trip"
3. App calculates final fare
4. Passenger app shows trip completed
5. Fare displays on both apps

**Expected Results:**
- ✅ "Complete Trip" button works
- ✅ Fare calculates correctly
- ✅ Trip summary displays
- ✅ Distance and time accurate

**Fare Verification:**
- Base fare: ____ CFA
- Distance charge: ____ CFA (____ km × ____ CFA/km)
- Time charge: ____ CFA (____ min × ____ CFA/min)
- **Total fare: ____ CFA**
- Expected fare: ____ CFA
- Match? [ ] Yes [ ] No
- If no, difference: ____ CFA

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________
- Screenshot of fare: ___________

---

## 💳 TEST PHASE 4: PAYMENT & RATINGS (10 minutes)

### 4.1 Payment Processing

**Steps:**
1. Passenger sees payment screen
2. Selects payment method:
   - [ ] Cash
   - [ ] Credit/Debit Card
   - [ ] Orange Money
   - [ ] MTN Mobile Money
3. Completes payment
4. Receives confirmation

**For Card Payment:**
- Card number: [Test card]
- Expiry: __/__
- CVV: ___
- Payment processes: [ ] Yes [ ] No
- Time to process: ____ seconds

**Expected Results:**
- ✅ Payment options display
- ✅ Selected method processes successfully
- ✅ Confirmation message appears
- ✅ Receipt generates
- ✅ Driver notified of payment

**Test Results:**
- [ ] PASS / [ ] FAIL
- Payment method used: _________
- Processing time: ____ seconds
- Notes: _______________________

---

### 4.2 Passenger Rates Driver

**Steps:**
1. Passenger taps "Rate Driver"
2. Selects star rating (1-5 stars)
3. Optionally adds comment
4. Taps "Submit Rating"
5. Confirmation appears

**Test:**
- Rating selected: ____ stars
- Comment: "____________________"
- Submit successful: [ ] Yes [ ] No

**Expected Results:**
- ✅ Rating interface appears
- ✅ All stars are tappable
- ✅ Comment box works
- ✅ Submit button functions
- ✅ Confirmation message displays

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

### 4.3 Driver Rates Passenger

**Steps:**
1. Driver taps "Rate Passenger"
2. Selects star rating (1-5 stars)
3. Optionally adds comment
4. Taps "Submit Rating"
5. Confirmation appears

**Test:**
- Rating selected: ____ stars
- Comment: "____________________"
- Submit successful: [ ] Yes [ ] No

**Expected Results:**
- ✅ Rating interface appears
- ✅ All stars are tappable
- ✅ Comment box works
- ✅ Submit button functions
- ✅ Confirmation message displays

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

## 💰 TEST PHASE 5: EARNINGS & HISTORY (10 minutes)

### 5.1 Driver Earnings Verification

**Steps:**
1. Driver opens "Earnings" screen
2. Verifies completed trip appears
3. Checks earnings calculation:
   - Total fare: ____ CFA
   - Platform commission (20%): ____ CFA
   - Driver earnings (80%): ____ CFA
4. Verifies transaction history

**Verification:**
- Total fare: ____ CFA
- Expected driver share (80%): ____ CFA
- Displayed driver earnings: ____ CFA
- Match? [ ] Yes [ ] No

**Expected Results:**
- ✅ Trip appears in history
- ✅ Earnings calculated correctly (80% of fare)
- ✅ All details accurate (date, time, passenger name)
- ✅ Total earnings updates

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________
- Screenshot of earnings: _______

---

### 5.2 Passenger Trip History

**Steps:**
1. Passenger opens "Trip History" screen
2. Verifies completed trip appears
3. Checks all details:
   - Driver name
   - Date & time
   - Pickup location
   - Dropoff location
   - Distance
   - Duration
   - Fare paid
   - Rating given
4. Taps trip to view full details

**Expected Results:**
- ✅ Trip appears in history
- ✅ All details accurate
- ✅ Can view full trip details
- ✅ Receipt accessible

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________
- Screenshot of history: ________

---

## 🔧 TEST PHASE 6: PROFILE & SETTINGS (10 minutes)

### 6.1 Passenger Profile Update

**Steps:**
1. Open profile screen
2. Update name: "[New Name]"
3. Update email: "[new@email.com]"
4. Upload/change profile photo (optional)
5. Save changes
6. Verify changes saved

**Expected Results:**
- ✅ Name update works ✅ VERIFIED EARLIER
- ✅ Email update works
- ✅ Photo upload works (if applicable)
- ✅ Changes persist after app restart

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

### 6.2 Driver Profile Update

**Steps:**
1. Open driver profile screen
2. Update name: "[New Name]"
3. Update email: "[new@email.com]"
4. Update vehicle info (if editable)
5. Save changes
6. Verify changes saved

**Expected Results:**
- ✅ Name update works ✅ VERIFIED EARLIER
- ✅ Email update works
- ✅ Vehicle info update works (if editable)
- ✅ Changes persist after app restart

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

## 🚨 TEST PHASE 7: ERROR HANDLING & EDGE CASES (20 minutes)

### 7.1 Network Interruption Test

**Steps:**
1. Start a ride request
2. Turn off WiFi/Data during request
3. Wait 30 seconds
4. Turn WiFi/Data back on
5. Observe app behavior

**Expected Results:**
- ✅ App shows "No connection" message
- ✅ App doesn't crash
- ✅ App reconnects automatically
- ✅ Ride request resumes or prompts retry

**Test Results:**
- [ ] PASS / [ ] FAIL
- App behavior: ________________
- Notes: _______________________

---

### 7.2 GPS Loss Test

**Steps:**
1. During active trip, go to area with poor GPS (if possible)
2. Observe app behavior
3. Return to area with good GPS
4. Verify recovery

**Expected Results:**
- ✅ App continues to function
- ✅ Shows last known location
- ✅ Reconnects GPS when available
- ✅ Trip data not lost

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

### 7.3 App Backgrounding Test

**Steps:**
1. During active trip, press home button (minimize app)
2. Wait 2 minutes
3. Open app again
4. Verify trip still active

**Expected Results:**
- ✅ Trip continues in background
- ✅ GPS tracking continues
- ✅ App resumes to correct screen
- ✅ No data lost

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

### 7.4 Driver Cancellation Test

**Steps:**
1. Request a ride (passenger)
2. Driver accepts
3. Driver cancels ride
4. Observe passenger app behavior

**Expected Results:**
- ✅ Passenger notified of cancellation
- ✅ Ride request resets
- ✅ Can request new ride
- ✅ No charge applied

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

### 7.5 Passenger Cancellation Test

**Steps:**
1. Request a ride (passenger)
2. Passenger cancels before driver accepts
3. Observe app behavior

**Expected Results:**
- ✅ Cancellation successful
- ✅ Driver notified (if already notified of request)
- ✅ Can request new ride immediately
- ✅ No charge applied

**Test Results:**
- [ ] PASS / [ ] FAIL
- Notes: _______________________

---

## 📊 FINAL ASSESSMENT

### Overall Test Summary

**Total Tests:** 25  
**Passed:** ____ / 25  
**Failed:** ____ / 25  
**Pass Rate:** ____ %

**Critical Issues (Must Fix Before Launch):**
1. _________________________________
2. _________________________________
3. _________________________________

**Minor Issues (Can Fix After Launch):**
1. _________________________________
2. _________________________________
3. _________________________________

**Performance Metrics:**

| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| GPS Update Frequency | ≤15s | ___s | Y/N |
| ETA Accuracy | ±20% | ___% | Y/N |
| Battery Drain (30min) | ≤10% | ___% | Y/N |
| App Crash Rate | 0 | ___ | Y/N |
| Payment Success | 100% | ___% | Y/N |
| Notification Delay | ≤5s | ___s | Y/N |

**User Experience Rating (1-5 stars):**

| Aspect | Rating | Notes |
|--------|--------|-------|
| Passenger App UI | ___/5 | ________________ |
| Driver App UI | ___/5 | ________________ |
| Ease of Use | ___/5 | ________________ |
| GPS Accuracy | ___/5 | ________________ |
| Speed/Performance | ___/5 | ________________ |
| Overall Experience | ___/5 | ________________ |

---

## ✅ PRODUCTION READINESS CHECKLIST

Based on test results, verify:

### Technical:
- [ ] All critical features work correctly
- [ ] GPS tracking accurate and timely
- [ ] Payment processing functional
- [ ] No critical bugs discovered
- [ ] Battery usage acceptable
- [ ] Network handling robust
- [ ] Error messages clear and helpful

### Business:
- [ ] Fare calculation accurate
- [ ] Earnings split correct (80/20)
- [ ] Ratings system functional
- [ ] Trip history accurate
- [ ] Receipt generation works

### User Experience:
- [ ] Apps intuitive and easy to use
- [ ] Navigation clear
- [ ] Notifications timely
- [ ] Profile updates work
- [ ] No confusing flows

---

## 📝 FINAL RECOMMENDATIONS

### Ready to Launch?

**YES - If:**
- ✅ Pass rate ≥ 90% (23+/25 tests)
- ✅ Zero critical bugs
- ✅ GPS tracking accurate
- ✅ Payment processing works
- ✅ User experience smooth

**NO - If:**
- ❌ Pass rate < 90%
- ❌ Any critical bugs
- ❌ GPS unreliable
- ❌ Payment issues
- ❌ Frequent crashes

**Next Steps:**

**If Ready:**
1. [ ] Begin beta driver recruitment
2. [ ] Prepare marketing materials
3. [ ] Set launch date
4. [ ] Monitor first week closely

**If Not Ready:**
1. [ ] Fix critical issues
2. [ ] Retest failed components
3. [ ] Schedule follow-up test
4. [ ] Delay launch until 90%+ pass

---

## 📸 DOCUMENTATION

**Attach:**
- [ ] Screenshots from each test phase
- [ ] Video of complete ride (optional)
- [ ] Battery usage screenshots
- [ ] Error screenshots (if any)
- [ ] GPS tracking map screenshot
- [ ] Earnings/history screenshots

**Test Conducted By:**
- Name: _______________________
- Date: _______________________
- Time: _______________________
- Location: ____________________

**Participants:**
- Driver: ______________________
- Passenger: ___________________

**Equipment:**
- Driver phone: ________________
- Passenger phone: _____________
- Android versions: ____________

---

## 🎯 SUCCESS CRITERIA MET?

**FINAL VERDICT:**

[ ] ✅ **PRODUCTION READY** - Launch approved!  
[ ] ⚠️ **NEEDS MINOR FIXES** - Fix and retest specific features  
[ ] ❌ **NOT READY** - Major issues, full retest needed

**Sign-off:**
- Tester: ______________________  
- Date: ________________________  
- Time: ________________________

---

**Congratulations on completing comprehensive testing!** 🎉

**Your platform is now ready for real-world use!** 🚀

---

*Testing Guide v1.0 - December 22, 2025*  
*Run Run - Guinea-Bissau's First Ride-Hailing Platform*
