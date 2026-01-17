# 🍎 TESTFLIGHT BUILDS - COMPLETE SETUP GUIDE

**Date:** January 8, 2026  
**Purpose:** Deploy iOS apps to TestFlight for beta testing on real iPhones  
**Developer:** Edivaldo Cardoso  
**Email:** suporte@runrungb.com

---

## 🎯 WHAT IS TESTFLIGHT?

**TestFlight** is Apple's official platform for distributing iOS apps to beta testers before App Store release.

### Benefits:
✅ Test on **real iPhones and iPads** (not just simulator)  
✅ Up to **10,000 external testers** (public)  
✅ Up to **100 internal testers** (team members)  
✅ Easy distribution via **invite links or email**  
✅ Automatic updates when you upload new builds  
✅ **Free** (included with Apple Developer Program)  
✅ Collect feedback and crash reports  
✅ Test before App Store submission  

---

## 📋 REQUIREMENTS CHECKLIST

### ✅ What You Need:

#### 1. Apple Developer Account
- **Cost:** $99 USD per year
- **Sign up:** https://developer.apple.com/programs/enroll/
- **What it includes:**
  - TestFlight access
  - App Store distribution
  - Push notifications
  - In-app purchases
  - Developer tools

#### 2. App Store Connect Account
- **Automatic:** Created when you join Apple Developer Program
- **Access:** https://appstoreconnect.apple.com/
- **Purpose:** Manage apps, TestFlight, sales, analytics

#### 3. Bundle Identifiers
Your apps need unique bundle IDs:
- **Passenger:** `com.runrun.passenger` (or similar)
- **Driver:** `com.runrun.driver` (or similar)

#### 4. App Information
- App name
- Primary category (Transportation)
- App description
- Privacy policy URL (can use your website)
- Support URL (your website contact page)

---

## 🚀 STEP-BY-STEP SETUP PROCESS

### Step 1: Join Apple Developer Program

**If you haven't already:**

1. **Visit:** https://developer.apple.com/programs/enroll/
2. **Sign in** with your Apple ID (or create one)
3. **Choose:** Individual or Organization
   - **Individual:** Faster approval (24 hours), your personal name
   - **Organization:** Requires D-U-N-S number, company name
4. **Pay:** $99 USD annual fee
5. **Wait:** Email confirmation (usually within 24 hours)

**If you already have an account:**
- ✅ Skip to Step 2

---

### Step 2: Create App Store Connect Apps

**For each app (Passenger & Driver):**

1. **Visit:** https://appstoreconnect.apple.com/
2. **Click:** "My Apps" → "+" → "New App"
3. **Fill in:**
   - **Platform:** iOS
   - **Name:** Run Run Passenger (or Driver)
   - **Primary Language:** Portuguese
   - **Bundle ID:** Select from dropdown (if not there, create in Step 3)
   - **SKU:** runrun-passenger-001 (unique identifier)
   - **User Access:** Full Access

4. **Click:** "Create"

5. **Fill in App Information:**
   - **Category:** Transportation
   - **Subcategory:** Ride Sharing
   - **Privacy Policy URL:** https://runrunwebapp.netlify.app/privacidade
   - **Support URL:** https://runrunwebapp.netlify.app/contato

---

### Step 3: Register Bundle Identifiers (If Needed)

**If bundle IDs don't exist:**

1. **Visit:** https://developer.apple.com/account/resources/identifiers/list
2. **Click:** "+" to add new identifier
3. **Select:** "App IDs" → Continue
4. **Select:** "App" → Continue
5. **Fill in:**
   - **Description:** Run Run Passenger App
   - **Bundle ID:** Explicit
   - **Bundle ID:** `com.runrun.passenger`
6. **Capabilities:** (select if needed)
   - Push Notifications
   - Maps
   - Background Modes
7. **Click:** Continue → Register
8. **Repeat for Driver app** with `com.runrun.driver`

---

### Step 4: Build iOS Apps for TestFlight

**I've configured the build profiles. Here's what to do:**

#### Option A: Build Both Apps Now (Recommended)
```powershell
# Passenger TestFlight build
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
eas build --platform ios --profile testflight --non-interactive

# Driver TestFlight build
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"
eas build --platform ios --profile testflight --non-interactive
```

#### Option B: Build One at a Time
```powershell
# Just Passenger
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger"
eas build --platform ios --profile testflight

# Just Driver (later)
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver"
eas build --platform ios --profile testflight
```

**What happens:**
1. EAS uploads your code to Expo servers
2. Expo builds the iOS app with proper signing
3. You get an `.ipa` file (iOS app package)
4. Build time: ~15-20 minutes per app

---

### Step 5: Upload to TestFlight

**After builds complete:**

#### Option A: Automatic Upload (Easiest)
```powershell
# Passenger
eas submit --platform ios --latest

# Driver
eas submit --platform ios --latest
```

EAS will automatically:
- Download the build
- Upload to App Store Connect
- Submit to TestFlight
- Handle all authentication

#### Option B: Manual Upload
1. Download `.ipa` file from Expo
2. Install **Transporter** app (Mac App Store)
3. Open Transporter
4. Drag `.ipa` file to Transporter
5. Click "Deliver"
6. Wait for upload to complete

---

### Step 6: Set Up TestFlight Testing

**In App Store Connect:**

1. **Go to:** My Apps → Your App → TestFlight
2. **Wait for Processing:** (10-30 minutes after upload)
3. **When "Ready to Test" appears:**

#### For Internal Testing (Team Members):
1. **Click:** "Internal Testing" → "App Store Connect Users"
2. **Add testers:** Click "+" → Select users
3. **Testers receive:** Email invite automatically
4. **They download:** TestFlight app from App Store
5. **They install:** Your app via TestFlight

#### For External Testing (Public Beta):
1. **Click:** "External Testing" → Create new group
2. **Group name:** "Public Beta" or "Beta Testers"
3. **Add testers:** 
   - Email addresses (up to 10,000)
   - Or generate public link
4. **Submit for Review:** (Apple reviews first build, ~24 hours)
5. **After approval:** Testers can install via link

---

## 📱 TESTFLIGHT BUILD CONFIGURATION

**I've added a new `testflight` profile to both apps:**

```json
"testflight": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  },
  "ios": {
    "autoIncrement": true
  }
}
```

**What this does:**
- ✅ `distribution: internal` - For TestFlight distribution
- ✅ `autoIncrement: true` - Automatically bumps build number
- ✅ Creates production-signed IPA file
- ✅ Ready for real iOS devices

---

## 🔐 CODE SIGNING (AUTOMATIC)

**Good news:** EAS handles all code signing automatically!

**What EAS does for you:**
1. Creates iOS Distribution Certificate
2. Creates Provisioning Profiles
3. Stores credentials securely
4. Signs your app automatically
5. Renews certificates when needed

**You don't need to:**
- ❌ Manually create certificates
- ❌ Download provisioning profiles
- ❌ Configure Xcode
- ❌ Manage signing complexity

**First-time setup:**
- EAS will ask for your Apple ID credentials
- Enter them when prompted
- EAS stores them securely
- Future builds use stored credentials

---

## 📊 BUILD PROCESS WALKTHROUGH

### What Happens When You Run Build Command:

```
1. Code Upload (1-2 min)
   ↓
2. Build Queue (0-30 min, depends on concurrency)
   ↓
3. Install Dependencies (2-3 min)
   ↓
4. iOS Build (10-12 min)
   ↓
5. Code Signing (1-2 min)
   ↓
6. Upload to EAS (1-2 min)
   ↓
7. Build Complete! ✅
   ↓
8. Download .ipa or Submit to TestFlight
```

**Total Time:** ~15-20 minutes per app

---

## 🧪 TESTING WORKFLOW

### 1. Developer Testing (You):
```
Build → Submit → Wait for Processing → Install TestFlight app → Open your app
```

### 2. Internal Team Testing:
```
Add team members → They get email → Install TestFlight → Open app
```

### 3. Public Beta Testing:
```
Submit for review → Approval (24h) → Share link → Testers install → Collect feedback
```

### 4. Update & Iterate:
```
Fix bugs → Build new version → Auto-increment → Upload → Testers auto-update
```

---

## 🆕 VERSION MANAGEMENT

**App Version:** `1.0.0` (in app.json)
**Build Number:** Auto-incremented by EAS

### Example Build Numbers:
- First TestFlight build: `1.0.0 (1)`
- Second TestFlight build: `1.0.0 (2)`
- Third TestFlight build: `1.0.0 (3)`

### When to Bump Version:
- **1.0.0 → 1.0.1:** Bug fixes
- **1.0.0 → 1.1.0:** New features
- **1.0.0 → 2.0.0:** Major changes

**Build number auto-increments** with each build (thanks to `autoIncrement: true`)

---

## 📧 TESTER INVITATION EMAILS

### Internal Testers (Instant):
Testers receive email like:
```
Subject: You're invited to test Run Run Passenger

Edivaldo Cardoso has invited you to test Run Run Passenger.

To get started:
1. Install TestFlight from the App Store
2. Open this email on your iOS device
3. Tap "View in TestFlight"
4. Accept the invite and install the app

TestFlight Code: XXXXX-XXXX
```

### External Testers (After Review):
You share link like:
```
https://testflight.apple.com/join/XXXXXXXX
```

Testers:
1. Open link on iPhone
2. Install TestFlight app
3. Accept invitation
4. Download your app

---

## 🔍 MONITORING & ANALYTICS

**In App Store Connect → TestFlight:**

### You Can See:
- ✅ Number of testers
- ✅ Install rate
- ✅ Session duration
- ✅ Crash reports
- ✅ Feedback from testers
- ✅ Device types used
- ✅ iOS versions

### Crash Reports:
- Automatic crash collection
- Stack traces
- Device info
- iOS version
- Helps fix bugs quickly

---

## 💡 TESTFLIGHT BEST PRACTICES

### 1. Start Small
- Test with 5-10 internal testers first
- Fix obvious bugs
- Then expand to external testers

### 2. Clear Instructions
- Send testing guide to testers
- Explain what features to test
- How to report bugs

### 3. Regular Updates
- Upload new builds weekly
- Fix reported bugs quickly
- Keep testers engaged

### 4. Collect Feedback
- Ask specific questions
- Use TestFlight feedback feature
- Or use external form (Google Forms)

### 5. Set Expectations
- Tell testers it's beta software
- Bugs are expected
- Thank them for testing

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: "Build Processing Forever"
**Solution:** 
- Wait up to 30 minutes
- Check App Store Connect status: https://developer.apple.com/system-status/
- If >1 hour, contact Apple Developer Support

### Issue 2: "Missing Compliance"
**Solution:**
- App Store Connect → Your App → TestFlight → Build
- Click "Provide Export Compliance Information"
- Answer questions about encryption
- Submit

### Issue 3: "TestFlight Not Showing App"
**Solution:**
- Check processing status in App Store Connect
- Ensure you're using same Apple ID
- Try logging out/in of TestFlight app
- Reinstall TestFlight app

### Issue 4: "Build Rejected"
**Solution:**
- Read rejection email carefully
- Common: Missing privacy policy, broken links
- Fix issues and resubmit

---

## 📱 TESTFLIGHT APP

**Testers need the TestFlight app:**

**Download:** https://apps.apple.com/app/testflight/id899247664
**Size:** ~30 MB
**Requirements:** iOS 13.0 or later
**Free:** Yes

**Features:**
- Install beta apps
- Automatic updates
- Send feedback
- View app information
- Manage multiple beta apps

---

## 🎯 NEXT STEPS - STARTING BUILDS NOW

### Option 1: I Start Builds For You Now
I can start both TestFlight builds right now with this command:

```powershell
# Passenger
eas build --platform ios --profile testflight --non-interactive

# Driver  
eas build --platform ios --profile testflight --non-interactive
```

**Timeline:**
- Builds upload: 1-2 minutes
- Builds complete: ~40 minutes (both apps)
- Submit to TestFlight: ~5 minutes
- Processing in App Store Connect: ~30 minutes
- **Total: ~75 minutes until testers can install**

### Option 2: You Start Manually When Ready
Use the commands above when you:
- Have Apple Developer Account active
- Created apps in App Store Connect
- Ready to start beta testing

---

## 📋 COMPLETE CHECKLIST

### Before Building:
- [ ] Join Apple Developer Program ($99/year)
- [ ] Verify email confirmation received
- [ ] Access App Store Connect
- [ ] Create app entries for Passenger & Driver
- [ ] Register bundle IDs (if needed)
- [ ] Add app information (category, URLs, etc.)

### Building:
- [ ] Run `eas build --platform ios --profile testflight` for Passenger
- [ ] Run `eas build --platform ios --profile testflight` for Driver
- [ ] Wait ~15-20 minutes per build
- [ ] Verify builds completed successfully

### Submitting:
- [ ] Run `eas submit --platform ios --latest` for Passenger
- [ ] Run `eas submit --platform ios --latest` for Driver
- [ ] Wait for upload to complete
- [ ] Check App Store Connect for processing status

### Testing:
- [ ] Wait for "Ready to Test" status
- [ ] Add internal testers
- [ ] Install TestFlight on your iPhone
- [ ] Accept invite and install apps
- [ ] Test all features thoroughly
- [ ] Fix any bugs found

### Public Beta (Optional):
- [ ] Create external testing group
- [ ] Submit first build for review
- [ ] Wait for Apple approval (~24 hours)
- [ ] Share public link with testers
- [ ] Collect feedback
- [ ] Iterate and improve

---

## 💰 COST BREAKDOWN

| Item | Cost | Frequency |
|------|------|-----------|
| **Apple Developer Program** | $99 USD | Annual |
| **EAS Build (Free Tier)** | $0 | Unlimited builds |
| **TestFlight Distribution** | $0 | Included |
| **App Store Connect** | $0 | Included |
| **Total First Year** | **$99 USD** | - |
| **Total Recurring** | **$99 USD/year** | Annual |

**Additional Costs (Optional):**
- Priority support: $99-$499/year
- EAS Pro: $29/month (faster builds, more concurrency)
- App Store paid apps: Apple takes 30% (15% for small businesses)

---

## 🎉 SUMMARY

### What TestFlight Gives You:
✅ Real iPhone/iPad testing  
✅ Up to 10,000 beta testers  
✅ Easy distribution via links  
✅ Automatic updates  
✅ Crash reports & analytics  
✅ Feedback collection  
✅ Pre-App Store validation  

### What You Need:
1. ✅ Apple Developer Account ($99/year)
2. ✅ App Store Connect apps created
3. ✅ TestFlight build profile (✅ Done!)
4. ✅ EAS Build command
5. ✅ EAS Submit command

### Timeline:
- **Setup:** 1-2 hours (first time only)
- **Building:** ~40 minutes (both apps)
- **Processing:** ~30 minutes
- **Testing:** Start immediately after processing
- **Total:** ~2 hours from start to testing

---

## 🚀 READY TO START?

**I'm ready to start the TestFlight builds now if you:**
- ✅ Have Apple Developer Account active
- ✅ Have created apps in App Store Connect
- ✅ Want to distribute to real iPhones for testing

**Just say "start testflight builds" and I'll begin!**

Or if you need to set up your Apple Developer Account first, that's the first step.

---

**Configuration Complete:** ✅  
**TestFlight Profile Added:** ✅ Both apps  
**All Authentication Fixes:** ✅ Included  
**Ready to Build:** ✅ Yes  

**Contact:**  
Edivaldo Cardoso  
Founder & Lead Developer  
Run-Run Guiné-Bissau  
Email: suporte@runrungb.com  
Phone: +245 955 971 275

---

## 📞 APPLE DEVELOPER PROGRAM SUPPORT

**If you need help signing up:**
- **Website:** https://developer.apple.com/support/
- **Phone:** Check website for your country
- **Email:** developer@apple.com
- **Chat:** Available on developer.apple.com

**Common questions answered:**
- Organization vs Individual
- Payment methods accepted
- D-U-N-S number requirements
- Enrollment status checks
