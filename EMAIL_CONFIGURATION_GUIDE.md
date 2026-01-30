# 📧 CONFIGURE EMAIL FOR INVOICE DELIVERY - STEP BY STEP

**Time Required:** ≈5 minutes  
**Purpose:** Enable automatic invoice email delivery after ride completion

---

## 🎯 WHAT YOU'RE CONFIGURING

When a business account user completes a ride, the system will:
1. ✅ Generate an invoice automatically
2. ✅ Create a PDF document
3. ✅ Send the invoice via email to the invoice_email address
4. ✅ Store the invoice in the database

**Email configuration is required for step 3!**

---

## 📋 QUICK OVERVIEW

You need to add **6 environment variables** to Railway:

| Variable | Value | Description |
|----------|-------|-------------|
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP server address |
| `EMAIL_PORT` | `587` | SMTP port (TLS) |
| `EMAIL_SECURE` | `false` | Use STARTTLS (not SSL) |
| `EMAIL_USER` | `your-email@gmail.com` | Your Gmail address |
| `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` | Gmail app password (16 chars) |
| `EMAIL_FROM` | `Run-Run Guiné-Bissau <your-email@gmail.com>` | Sender name & email |

---

## 🚀 METHOD 1: GMAIL (RECOMMENDED - FREE)

### Step 1: Get Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
   
2. **You may need to:**
   - Enable 2-Factor Authentication first (if not already enabled)
   - Sign in to your Google Account

3. **Create App Password:**
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (Custom name)"
   - Enter name: `Run-Run Backend`
   - Click **"Generate"**

4. **Copy the 16-character password:**
   ```
   Example: abcd efgh ijkl mnop
   ```
   ⚠️ **IMPORTANT:** Save this password! You won't see it again.

---

### Step 2: Add Variables to Railway

1. **Go to Railway Dashboard:**
   ```
   https://railway.app/dashboard
   ```

2. **Select your project:**
   - Find your "Run-Run Backend" or similar project
   - Click on it

3. **Click on Backend Service:**
   - You should see your backend service/deployment
   - Click on it

4. **Click "Variables" tab:**
   - You'll see a list of existing environment variables
   - Click **"New Variable"** button

5. **Add each variable one by one:**

   **Variable 1:**
   ```
   Name: EMAIL_HOST
   Value: smtp.gmail.com
   ```
   Click "Add"

   **Variable 2:**
   ```
   Name: EMAIL_PORT
   Value: 587
   ```
   Click "Add"

   **Variable 3:**
   ```
   Name: EMAIL_SECURE
   Value: false
   ```
   Click "Add"

   **Variable 4:**
   ```
   Name: EMAIL_USER
   Value: your-email@gmail.com
   ```
   ⚠️ Replace with YOUR actual Gmail address
   Click "Add"

   **Variable 5:**
   ```
   Name: EMAIL_PASS
   Value: abcd efgh ijkl mnop
   ```
   ⚠️ Replace with the 16-character password from Step 1
   Click "Add"

   **Variable 6:**
   ```
   Name: EMAIL_FROM
   Value: Run-Run Guiné-Bissau <your-email@gmail.com>
   ```
   ⚠️ Replace your-email@gmail.com with YOUR email
   Click "Add"

6. **Railway will auto-redeploy:**
   - You'll see a new deployment start
   - Wait ~2-3 minutes for it to complete
   - Check the "Deployments" tab to see status

---

## ✅ VERIFY EMAIL CONFIGURATION

### Check 1: Environment Variables Set

In Railway Dashboard → Variables tab, you should see:
```
✅ EMAIL_HOST = smtp.gmail.com
✅ EMAIL_PORT = 587
✅ EMAIL_SECURE = false
✅ EMAIL_USER = your-email@gmail.com
✅ EMAIL_PASS = •••• •••• •••• •••• (hidden)
✅ EMAIL_FROM = Run-Run Guiné-Bissau <your-email@gmail.com>
```

### Check 2: Deployment Completed

In Railway Dashboard → Deployments tab:
```
✅ Latest deployment shows "Success"
✅ No errors in build logs
```

### Check 3: Test Email Sending

**Via Railway Logs:**
1. Railway Dashboard → Your Service
2. Click "View Logs" or "Logs" tab
3. You should see something like:
   ```
   ✅ Email configured: smtp.gmail.com:587
   ✅ Server started successfully
   ```

---

## 🧪 TEST INVOICE EMAIL

### Complete Test Flow:

1. **Open Run-Run Passenger App**

2. **Create Business Account:**
   - Menu → Business Account
   - Fill in details:
     ```
     Company Name: Test Company Ltd
     Tax ID: 123456789
     Address: Bissau, Guinea-Bissau
     Phone: +245 955 123 456
     Company Email: company@test.com
     Business Type: Transport
     Invoice Email: YOUR_EMAIL@gmail.com  ← Use YOUR email to receive test
     ```
   - Click **Save**

3. **Book and Complete a Ride:**
   - Book a ride
   - Wait for driver acceptance (or use test driver)
   - Complete the ride
   - Pay

4. **Check Your Email:**
   - You should receive an email within 1-2 minutes
   - Subject: "Run-Run Invoice #XXXXX"
   - Contains PDF attachment
   - Professional invoice layout

5. **Check Invoices in App:**
   - Menu → Invoices
   - Your invoice should appear
   - Status should show "Sent" with email icon
   - Can download PDF
   - Can share

---

## 🔄 ALTERNATIVE: SENDGRID (PROFESSIONAL)

If you prefer a dedicated email service:

### Step 1: Create SendGrid Account

1. Go to: https://sendgrid.com/
2. Sign up for free account (100 emails/day free)
3. Verify your email
4. Create API Key:
   - Settings → API Keys → Create API Key
   - Name: `Run-Run Backend`
   - Permissions: Full Access
   - Copy API key (starts with `SG.`)

### Step 2: Add to Railway

```
EMAIL_HOST = smtp.sendgrid.net
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = apikey
EMAIL_PASS = SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM = Run-Run Guiné-Bissau <noreply@runrungw.com>
```

**Benefits:**
- Higher sending limits
- Better deliverability
- Detailed analytics
- Professional sender domain

---

## 🔄 ALTERNATIVE: CUSTOM SMTP SERVER

If you have your own email server:

```
EMAIL_HOST = mail.yourdomain.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = noreply@yourdomain.com
EMAIL_PASS = your-password
EMAIL_FROM = Run-Run Guiné-Bissau <noreply@yourdomain.com>
```

**Test your SMTP settings first!**

---

## 🐛 TROUBLESHOOTING

### Problem: "Invalid login" error

**Causes:**
- Gmail app password incorrect
- 2-Factor Authentication not enabled
- Regular password used instead of app password

**Fix:**
1. Regenerate app password: https://myaccount.google.com/apppasswords
2. Make sure you copied all 16 characters (with spaces)
3. Update `EMAIL_PASS` in Railway

---

### Problem: Emails not being sent

**Check Railway Logs:**
```powershell
# Install Railway CLI
npm i -g @railway/cli

# Login and view logs
railway login
railway logs
```

**Look for:**
- ✅ "Email configured successfully"
- ❌ "SMTP connection failed"
- ❌ "Authentication failed"

**Common fixes:**
1. Check all 6 variables are set correctly
2. Verify Gmail allows less secure apps (if needed)
3. Check email/password have no extra spaces
4. Try regenerating app password

---

### Problem: Emails go to spam

**Fix:**
1. **Use SendGrid** instead of Gmail for better deliverability
2. **Configure SPF record** for your domain
3. **Verify sender domain** in SendGrid
4. **Add unsubscribe link** (already in code)

---

### Problem: Variables not taking effect

**Fix:**
1. Railway Dashboard → Deployments
2. Check latest deployment status
3. If stuck, manually trigger redeploy:
   - Click service → "Redeploy"
4. Clear browser cache
5. Wait 2-3 minutes

---

## 📊 INVOICE EMAIL TEMPLATE

Your invoices will be sent with:

**Subject:** `Run-Run Invoice #INV-YYYYMMDD-XXXXX`

**Content:**
```
Dear [Company Name],

Thank you for using Run-Run for your transportation needs.

Please find attached your invoice #INV-YYYYMMDD-XXXXX for the ride completed on [Date].

Trip Details:
- From: [Pickup Address]
- To: [Dropoff Address]
- Distance: [X.XX] km
- Amount: [Total] XOF

If you have any questions, please contact us at suporte@runrungb.com

Best regards,
Run-Run Guiné-Bissau Team
```

**PDF Attachment:** Professional invoice with logo, company details, trip breakdown

---

## ✅ CONFIGURATION CHECKLIST

Before testing:
- [ ] Gmail app password generated
- [ ] All 6 environment variables added to Railway
- [ ] Variables saved (no typos)
- [ ] Railway redeployed successfully
- [ ] No errors in deployment logs

For testing:
- [ ] Business account created in app
- [ ] Ride completed successfully
- [ ] Invoice appeared in app
- [ ] Email received within 2 minutes
- [ ] PDF attachment opens correctly

---

## 📈 MONITORING EMAIL DELIVERY

### Check Invoice Status in Database:

```sql
-- Recent invoices with email status
SELECT 
  invoice_number,
  status,
  sent_to_email,
  email_sent_at,
  total_amount,
  created_at
FROM invoices
ORDER BY created_at DESC
LIMIT 10;

-- Email success rate
SELECT 
  COUNT(*) as total_invoices,
  SUM(CASE WHEN sent_to_email = true THEN 1 ELSE 0 END) as emails_sent,
  ROUND(100.0 * SUM(CASE WHEN sent_to_email = true THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM invoices;
```

### Railway Logs:

```bash
railway logs --follow
```

Look for:
```
✅ Invoice generated: INV-20260129-001
✅ PDF created successfully
✅ Email sent to: invoices@company.com
```

---

## 🎯 NEXT STEPS AFTER EMAIL CONFIG

1. ✅ **Test complete flow** (create account → ride → invoice email)
2. ⏳ **Wait for APK builds** to complete
3. 📥 **Download APKs** from Expo
4. 🔄 **Update QR codes** with download URLs
5. 🌐 **Upload to website**
6. 👥 **Share with beta testers**

---

## 📞 NEED HELP?

**Email Configuration Issues:**
- suporte@runrungb.com
- +245 955 981 398

**Railway Support:**
- https://railway.app/help

**Gmail Help:**
- https://support.google.com/accounts/answer/185833

---

## 🎉 SUCCESS!

Once configured, your Run-Run app will:
- ✅ Auto-generate invoices after rides
- ✅ Send professional PDF invoices via email
- ✅ Track email delivery status
- ✅ Provide invoice history in app
- ✅ Enable business customers to use your service

---

**Last Updated:** January 29, 2026  
**Configuration Time:** ≈5 minutes  
**Difficulty:** ⭐⭐ Easy

**© 2026 Run-Run Guiné-Bissau | KCDIGITALS**
