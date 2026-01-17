# 🚗 Driver Account Activation System

## Overview
The Run Run driver app now includes a mandatory account activation system that requires all new drivers to visit the Run Run office for verification before they can start accepting rides and earning money.

---

## 🎯 Purpose

### Why This Feature is Critical:
1. **Safety & Security** - Verify driver identity and background
2. **Vehicle Standards** - Ensure all vehicles meet safety requirements
3. **Documentation** - Collect necessary legal documents
4. **Quality Control** - Maintain high service standards
5. **Training** - Provide proper app and service training
6. **Fraud Prevention** - Prevent fake accounts and unauthorized drivers

---

## 🔐 How It Works

### Step 1: Driver Registration
1. Driver downloads the app
2. Fills in registration form:
   - Full Name
   - Phone Number
   - Vehicle Type (Moto/Normal/Premium)
   - License Plate Number
3. Receives OTP for verification
4. Enters OTP to complete registration
5. **Account created but NOT activated** ✋

### Step 2: Pending Activation Screen
After registration, driver immediately sees:
- ⏸️ "Account Pending Activation" message
- 📋 Checklist of documents to bring
- 🏢 Office location and working hours
- 📞 Contact information (Call, WhatsApp, Directions)
- ❌ **Cannot access Home screen or accept rides**

### Step 3: Office Visit (REQUIRED)
Driver must visit office with:
- ✅ Valid driver's license
- ✅ Vehicle registration documents
- ✅ Vehicle insurance certificate
- ✅ Vehicle inspection certificate
- ✅ National ID or passport
- ✅ Registered phone number

### Step 4: Verification Process (At Office)
Run Run staff will:
1. Verify driver's identity (ID/Passport)
2. Check driver's license validity
3. Review vehicle documents
4. Inspect vehicle physically
5. Take photos of driver and vehicle
6. Provide driver kit and uniform
7. Give app training session
8. **ACTIVATE account in system** ✅

### Step 5: Account Activated
After activation:
- ✅ Driver can login successfully
- ✅ Access to Home screen
- ✅ Can toggle availability (Online/Offline)
- ✅ Can see and accept ride requests
- ✅ Can start earning money!

---

## 📱 User Experience Flow

### For Non-Activated Driver:

```
Registration → Pending Activation Screen
      ↓
Login → Pending Activation Screen (blocked)
      ↓
Visit Office → Staff Activates Account
      ↓
Login → Home Screen ✅ (can work!)
```

### For Activated Driver:

```
Login → Home Screen ✅
  ↓
Toggle Online → Accept Rides → Earn Money 💰
```

---

## 🏢 Run Run Office Information

### Address:
**Avenida Principal, Bissau Center**  
**Guinea-Bissau 🇬🇼**

**GPS Coordinates:** 11.8636, -15.5984

### Working Hours:
- **Monday - Friday:** 8:00 AM - 6:00 PM
- **Saturday:** 9:00 AM - 2:00 PM
- **Sunday:** Closed

### Contact:
- **Phone:** +245 955 971 275 / +245 955 981 398
- **WhatsApp:** +44 742 487 137

---

## 📋 Documents Required

### Driver Documents:
1. **Valid Driver's License**
   - Must be current and not expired
   - Appropriate class for vehicle type
   - Guinea-Bissau or international license

2. **National ID or Passport**
   - Valid government-issued ID
   - Clear photo and readable
   - Original document required

### Vehicle Documents:
3. **Vehicle Registration**
   - Proof of vehicle ownership
   - Current registration certificate
   - Matches license plate number

4. **Insurance Certificate**
   - Valid vehicle insurance
   - Must cover commercial use
   - Not expired

5. **Inspection Certificate**
   - Recent vehicle safety inspection
   - Issued by authorized inspector
   - Shows vehicle is roadworthy

---

## 🔧 Technical Implementation

### Database Changes Needed:

Add `is_activated` column to drivers table:

```sql
ALTER TABLE drivers 
ADD COLUMN is_activated BOOLEAN DEFAULT FALSE;
```

### Backend API Changes:

Update driver authentication response to include activation status:

```javascript
// Login/Register Response
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "phone": "+245955794066",
    "is_activated": false  // NEW FIELD
  },
  "token": "jwt_token_here"
}
```

### Activation Endpoint (For Office Staff):

```javascript
POST /api/drivers/activate/:driverId
Authorization: Bearer <admin_token>

Body: {
  "is_activated": true,
  "verified_by": "staff_name",
  "verification_date": "2025-12-16T10:00:00Z"
}
```

---

## 🎨 Pending Activation Screen Features

### Visual Elements:
- ⏰ Large orange clock icon (pending status)
- 📝 Welcome message with driver name
- 📋 Document checklist with green checkmarks
- 🏢 Office information card
- 📍 Map directions button
- 📞 Call office button
- 💬 WhatsApp button
- 🚪 Logout option

### Actions Available:
1. **Get Directions** - Opens Google Maps with office location
2. **Call Office** - Direct phone call to office
3. **WhatsApp** - Send WhatsApp message to office
4. **Logout** - Return to login screen

### Actions NOT Available:
- ❌ Cannot access Home screen
- ❌ Cannot toggle availability
- ❌ Cannot see ride requests
- ❌ Cannot accept rides
- ❌ Cannot earn money

---

## 💼 Benefits for Run Run Business

### 1. Legal Compliance
- All drivers properly documented
- Insurance requirements met
- Regulatory compliance ensured

### 2. Quality Assurance
- Only qualified drivers on platform
- Vehicles meet safety standards
- Professional appearance (uniform/kit)

### 3. Customer Trust
- Passengers feel safer
- Verified driver profiles
- Quality service guaranteed

### 4. Fraud Prevention
- No fake accounts
- Real identity verification
- Prevents scammers

### 5. Training & Standards
- All drivers properly trained
- Understand platform policies
- Know how to use app correctly

### 6. Brand Reputation
- Professional driver fleet
- Consistent service quality
- Competitive advantage over competitors

---

## 📊 Activation Statistics to Track

### Key Metrics:
- Total registered drivers
- Pending activation count
- Activated drivers count
- Average activation time
- Documents verification rate
- Failed verification rate

### Dashboard for Office Staff:
```
Pending Activations: 15 drivers
Activated Today: 8 drivers
Total Active Drivers: 127 drivers
Rejection Rate: 5%
```

---

## 🚨 Error Handling

### Scenario 1: Driver Tries to Access Home Without Activation
```javascript
if (!driver.is_activated) {
  navigation.replace('PendingActivation', { driver });
  return; // Block access
}
```

### Scenario 2: Driver Logs In (Not Activated)
```javascript
if (response.user && !response.user.is_activated) {
  navigation.replace('PendingActivation', { driver: response.user });
  return; // Redirect to pending screen
}
```

### Scenario 3: Activated Driver Normal Flow
```javascript
if (response.user && response.user.is_activated) {
  navigation.replace('Home', { driver: response.user, token: response.token });
  // Allow full access ✅
}
```

---

## 🎯 Future Enhancements

### Phase 1 (Current):
- ✅ Pending activation screen
- ✅ Office information display
- ✅ Contact buttons
- ✅ Home screen blocking

### Phase 2 (Future):
- 📸 Upload documents in-app
- 📅 Schedule office appointment
- 📊 Track activation status progress
- 💳 Pay activation fee in-app
- 📧 Email confirmation after activation

### Phase 3 (Advanced):
- 🤖 AI document verification
- 🎥 Video verification call
- 🚗 Remote vehicle inspection
- ⚡ Instant activation (for qualified drivers)

---

## 🔒 Security Considerations

### Backend Validation:
1. **Never trust client-side activation status**
2. **Always verify `is_activated` flag on server**
3. **Require admin authentication for activation**
4. **Log all activation attempts**
5. **Rate limit activation endpoint**

### Ride Request Validation:
```javascript
// Before allowing driver to accept ride
if (!driver.is_activated) {
  return res.status(403).json({ 
    error: "Account not activated. Please visit office." 
  });
}
```

---

## 📝 Office Staff Checklist

When a driver visits for activation:

### Document Verification:
- [ ] Driver's license - Valid & appropriate class
- [ ] National ID - Matches driver info
- [ ] Vehicle registration - Current & matches plate
- [ ] Insurance - Valid & covers commercial use
- [ ] Inspection certificate - Recent & passes standards

### Physical Verification:
- [ ] Driver photo taken
- [ ] Vehicle photos taken (4 angles)
- [ ] License plate verified
- [ ] Vehicle condition acceptable
- [ ] Cleanliness standards met

### Onboarding:
- [ ] Driver kit provided (uniform, badge, stickers)
- [ ] App training completed
- [ ] Policies explained
- [ ] Questions answered
- [ ] Emergency contacts collected

### System Activation:
- [ ] Driver ID verified in system
- [ ] Set `is_activated = true`
- [ ] Verification notes added
- [ ] Staff name logged
- [ ] Activation timestamp recorded

### Final Steps:
- [ ] Welcome email/SMS sent
- [ ] Driver confirms app access
- [ ] Test ride request shown
- [ ] Payment setup verified
- [ ] Driver leaves satisfied ✅

---

## 🎉 Success Message

After activation, driver sees:
```
✅ Account Activated!

Congratulations! Your driver account is now active.
You can now go online and start accepting rides.

Good luck and drive safely!
```

---

## 📞 Support

If drivers have questions about activation:

**Call:** +245 123 456 789  
**WhatsApp:** +245 123 456 789  
**Email:** support@runrun-gw.com  
**Office Hours:** Mon-Fri 8AM-6PM, Sat 9AM-2PM

---

## ✅ Implementation Checklist

### Code Changes:
- [x] Created `PendingActivationScreen.js`
- [x] Updated `HomeScreen.js` - Added activation check
- [x] Updated `LoginScreen.js` - Added redirect for non-activated
- [x] Updated `RegisterScreen.js` - Redirect after registration
- [x] Updated `AppNavigator.js` - Added new route

### Backend Changes Needed:
- [ ] Add `is_activated` column to drivers table
- [ ] Update driver registration to set `is_activated = false`
- [ ] Update login API to return `is_activated` status
- [ ] Create admin endpoint for activation
- [ ] Add activation validation to ride endpoints

### Testing:
- [ ] Register new driver
- [ ] Verify pending activation screen appears
- [ ] Test call button
- [ ] Test WhatsApp button
- [ ] Test directions button
- [ ] Test logout function
- [ ] Activate driver in backend
- [ ] Login activated driver
- [ ] Verify home screen access
- [ ] Verify can accept rides

---

**This feature ensures Run Run maintains the highest standards for driver quality and passenger safety! 🚗✨**
