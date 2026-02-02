# ⚡ RAILWAY EMAIL SETUP - info@runrungb.com

**Copy these 6 values to Railway Dashboard:**

---

## 📋 RAILWAY ENVIRONMENT VARIABLES

**Railway Dashboard → Backend Service → Variables → Add these:**

```
EMAIL_HOST     = smtp.gmail.com
EMAIL_PORT     = 587
EMAIL_SECURE   = false
EMAIL_USER     = info@runrungb.com
EMAIL_PASS     = [GET FROM STEP 1 BELOW]
EMAIL_FROM     = Run-Run Guiné-Bissau <info@runrungb.com>
```

---

## 🔑 STEP 1: GET APP PASSWORD

### If info@runrungb.com is Gmail:

1. **Login:** https://mail.google.com (use info@runrungb.com)
2. **Enable 2FA:** https://myaccount.google.com/security
3. **Get App Password:** https://myaccount.google.com/apppasswords
   - App: Mail
   - Device: Other → "Run-Run Backend"
   - Click Generate
4. **Copy password:** `xxxx xxxx xxxx xxxx` (16 characters)
5. **Use as EMAIL_PASS** in Railway

### If info@runrungb.com is Custom Email:

Contact your email hosting provider for:
- SMTP server address
- SMTP port
- Login credentials

Or try these common settings:
```
cPanel:      mail.runrungb.com : 587
Office 365:  smtp.office365.com : 587
Zoho:        smtp.zoho.com : 587
```

---

## 🚂 STEP 2: ADD TO RAILWAY

1. **Go to:** https://railway.app/dashboard
2. **Open:** Run-Run Backend project
3. **Click:** Variables tab
4. **Click:** "New Variable" (repeat 6 times)
5. **Add each variable** from the list above
6. **Wait:** 2 minutes for auto-redeploy

---

## ✅ EXPECTED RESULT

**Customers will receive emails like:**

```
From: Run-Run Guiné-Bissau <info@runrungb.com>
To: customer@company.com
Subject: Run-Run Invoice #INV-20260129-001

📎 invoice-INV-20260129-001.pdf

Dear [Company Name],

Thank you for using Run-Run...

Best regards,
Run-Run Guiné-Bissau Team
info@runrungb.com
+245 955 981 398
```

---

## 🧪 TEST IT

1. Create business account in app
2. Complete a ride
3. Check your email inbox!

---

**Full Guide:** `EMAIL_CONFIG_INFO_RUNRUNGB.md`

**© 2026 Run-Run Guiné-Bissau**
