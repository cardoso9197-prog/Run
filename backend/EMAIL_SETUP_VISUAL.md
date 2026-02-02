# 📧 EMAIL CONFIGURATION - VISUAL GUIDE

## 🎯 What You're Setting Up

```
┌─────────────────────────────────────────────────────────┐
│              INVOICE EMAIL FLOW                         │
└─────────────────────────────────────────────────────────┘

1. User completes ride
         ↓
2. Backend generates invoice
         ↓
3. Backend creates PDF
         ↓
4. Backend sends email ← YOU'RE CONFIGURING THIS STEP!
         ↓
5. Customer receives invoice
```

---

## 📝 The 6 Variables You Need

```
┌──────────────────────────────────────────────────────────┐
│  Variable       │  Value                                  │
├──────────────────────────────────────────────────────────┤
│  EMAIL_HOST     │  smtp.gmail.com                        │
│  EMAIL_PORT     │  587                                   │
│  EMAIL_SECURE   │  false                                 │
│  EMAIL_USER     │  your-email@gmail.com   ← YOUR EMAIL  │
│  EMAIL_PASS     │  xxxx xxxx xxxx xxxx    ← APP PASSWORD│
│  EMAIL_FROM     │  Run-Run <your@gmail.com>             │
└──────────────────────────────────────────────────────────┘
```

---

## 🔑 Getting Your App Password

### Step 1: Visit Gmail App Passwords
```
🌐 https://myaccount.google.com/apppasswords
```

### Step 2: You'll See This Screen
```
┌────────────────────────────────────────┐
│  App passwords                         │
│                                        │
│  Create & manage app passwords         │
│                                        │
│  [Select app ▼]   [Select device ▼]   │
│                                        │
│  [ Generate ]                          │
└────────────────────────────────────────┘
```

### Step 3: Select Options
```
App: Mail
Device: Other (Custom name) → "Run-Run Backend"
```

### Step 4: Copy Password
```
┌────────────────────────────────────────┐
│  Your app password for Run-Run Backend │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  abcd efgh ijkl mnop             │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ⚠️ Copy this password. You won't     │
│     see it again.                      │
└────────────────────────────────────────┘
```

---

## 🚂 Adding to Railway

### Step 1: Railway Dashboard
```
https://railway.app/dashboard
    ↓
Select "Run-Run Backend" project
    ↓
Click on Backend service
    ↓
Click "Variables" tab
```

### Step 2: Add Variables
```
┌─────────────────────────────────────────────┐
│  Environment Variables                      │
├─────────────────────────────────────────────┤
│  DATABASE_URL     = postgresql://...        │
│  PORT             = 3000                    │
│  NODE_ENV         = production              │
│                                             │
│  [ + New Variable ]  ← CLICK THIS          │
└─────────────────────────────────────────────┘
```

### Step 3: Add Each Variable
```
For each variable, enter:

┌─────────────────────────────────────────┐
│  Variable Name:  EMAIL_HOST             │
│                                         │
│  Value:          smtp.gmail.com         │
│                                         │
│  [ Add ]  [ Cancel ]                    │
└─────────────────────────────────────────┘

Repeat for all 6 variables!
```

### Step 4: Result
```
✅ Variables Added:

┌─────────────────────────────────────────────┐
│  EMAIL_HOST     = smtp.gmail.com            │
│  EMAIL_PORT     = 587                       │
│  EMAIL_SECURE   = false                     │
│  EMAIL_USER     = your-email@gmail.com      │
│  EMAIL_PASS     = •••• •••• •••• ••••       │
│  EMAIL_FROM     = Run-Run <your@gmail.com>  │
└─────────────────────────────────────────────┘
```

---

## ⏱️ Wait for Deployment

```
Railway automatically redeploys:

[ Building... ] → [ Deploying... ] → [ ✅ Success ]

⏱️ Takes ~2 minutes
```

---

## 🧪 Test It!

### In Mobile App:
```
1. Menu → Business Account
         ↓
2. Fill company details
   Invoice Email: your-email@gmail.com
         ↓
3. Save
         ↓
4. Complete a ride
         ↓
5. Check email! 📧
```

### What You'll Receive:
```
┌─────────────────────────────────────────────┐
│  From: Run-Run Guiné-Bissau                 │
│  To:   your-email@gmail.com                 │
│  Subject: Run-Run Invoice #INV-20260129-001 │
│                                             │
│  📎 invoice-INV-20260129-001.pdf (52 KB)   │
│                                             │
│  Dear Test Company Ltd,                     │
│                                             │
│  Thank you for using Run-Run...             │
└─────────────────────────────────────────────┘
```

---

## ✅ QUICK CHECKLIST

```
□ Step 1: Get app password (2 min)
   ↓
□ Step 2: Open Railway (30 sec)
   ↓
□ Step 3: Add 6 variables (2 min)
   ↓
□ Step 4: Wait for deploy (2 min)
   ↓
□ Step 5: Test with ride (5 min)
   ↓
✅ DONE! Emails working!
```

---

## 🎯 COMPLETE SYSTEM STATUS

```
After Email Configuration:

┌──────────────────────────────────────────┐
│  Component         │  Status             │
├──────────────────────────────────────────┤
│  Backend Code      │  ✅ Deployed        │
│  Database Tables   │  ✅ Created         │
│  Business Accounts │  ✅ Working         │
│  Invoice PDF       │  ✅ Generating      │
│  Invoice Email     │  ⏳ → ✅ (YOU!)    │
│  Mobile Apps       │  ⏳ Building        │
└──────────────────────────────────────────┘
```

---

## 📱 AFTER EMAIL IS CONFIGURED

You can immediately test:
```
✅ Create business account
✅ Complete rides
✅ Generate invoices
✅ Download PDFs
✅ Receive emails
✅ Share invoices
```

Still waiting for:
```
⏳ APK/IPA builds (20-30 min)
⏳ Update QR codes
⏳ Distribute to users
```

---

## 🆘 TROUBLESHOOTING

### Problem: Can't generate app password
```
Solution:
1. Enable 2-Factor Authentication
2. Go to https://myaccount.google.com/security
3. Enable "2-Step Verification"
4. Then try app passwords again
```

### Problem: Variables not working
```
Solution:
1. Check Railway Deployments tab
2. Verify latest deployment succeeded
3. Check for typos in variable names
4. Redeploy if needed
```

### Problem: Email not received
```
Solution:
1. Check spam folder
2. Verify EMAIL_USER matches sender
3. Check Railway logs for errors
4. Test with different email address
```

---

## 📞 HELP & RESOURCES

**Quick Setup:** `QUICK_EMAIL_SETUP.md`
**Detailed Guide:** `EMAIL_CONFIGURATION_GUIDE.md`
**Support:** suporte@runrungb.com
**Phone:** +245 955 981 398

---

## 🎉 YOU'RE ALMOST DONE!

```
✅ Code in GitHub
✅ Database migrated
⏳ Email configuration ← YOU ARE HERE!
⏳ APK builds
⏳ Distribution

Progress: ███████░░░ 70%
```

---

**Time to Complete:** ~5 minutes
**Difficulty:** ⭐⭐ Easy
**Impact:** 🔥🔥🔥 High - Enables business features!

**© 2026 Run-Run Guiné-Bissau | KCDIGITALS**
