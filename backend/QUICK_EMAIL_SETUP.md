# ⚡ QUICK EMAIL SETUP - 5 MINUTES

## 🎯 GOAL
Enable automatic invoice email delivery

---

## 📋 STEP-BY-STEP CHECKLIST

### ☐ **STEP 1: Get Gmail App Password** (2 minutes)

1. Visit: https://myaccount.google.com/apppasswords
2. Enable 2FA if needed
3. Create app: "Run-Run Backend"
4. Copy 16-character password: `xxxx xxxx xxxx xxxx`
5. Save it somewhere safe!

---

### ☐ **STEP 2: Open Railway Dashboard** (30 seconds)

1. Go to: https://railway.app/dashboard
2. Find your "Run-Run Backend" project
3. Click on Backend service
4. Click **"Variables"** tab

---

### ☐ **STEP 3: Add 6 Variables** (2 minutes)

Click "New Variable" for each:

```
1. EMAIL_HOST     = smtp.gmail.com
2. EMAIL_PORT     = 587
3. EMAIL_SECURE   = false
4. EMAIL_USER     = your-email@gmail.com        ← YOUR EMAIL
5. EMAIL_PASS     = xxxx xxxx xxxx xxxx         ← APP PASSWORD
6. EMAIL_FROM     = Run-Run <your-email@gmail.com>
```

**⚠️ Important:**
- Use YOUR Gmail address for #4 and #6
- Use the 16-char password from Step 1 for #5
- Don't add quotes around values

---

### ☐ **STEP 4: Wait for Redeploy** (2 minutes)

Railway will automatically redeploy your backend:
1. Click "Deployments" tab
2. Wait for "Building..." → "Success" ✅
3. Takes ~2 minutes

---

### ☐ **STEP 5: Test It!** (5 minutes)

1. Open Run-Run Passenger App
2. Menu → **Business Account**
3. Fill details, use YOUR email for "Invoice Email"
4. Save
5. Book & complete a ride
6. Check your email inbox! 📧

---

## ✅ SUCCESS CHECKLIST

After setup, verify:
- [ ] All 6 variables visible in Railway
- [ ] Deployment shows "Success"
- [ ] Created test business account
- [ ] Completed test ride
- [ ] Received invoice email
- [ ] PDF attachment downloads
- [ ] Invoice appears in app

---

## 🔴 COMMON ISSUES

**"Invalid login" error:**
- ✅ Use app password, NOT your regular Gmail password
- ✅ Regenerate at: https://myaccount.google.com/apppasswords

**No email received:**
- ✅ Check spam folder
- ✅ Verify all 6 variables correct
- ✅ Check Railway logs for errors

**Variables not working:**
- ✅ Wait for redeploy to finish
- ✅ Check "Deployments" tab shows success
- ✅ Restart Railway service if needed

---

## 📞 NEED HELP?

Full guide: `EMAIL_CONFIGURATION_GUIDE.md`
Support: suporte@runrungb.com
Phone: +245 955 981 398

---

## 🎉 THAT'S IT!

**Total time:** ~5 minutes
**Result:** Automatic invoice emails! 📧✨

**© 2026 Run-Run Guiné-Bissau**
