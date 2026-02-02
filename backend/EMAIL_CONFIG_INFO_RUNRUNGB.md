# 📧 RAILWAY EMAIL CONFIGURATION FOR info@runrungb.com

**Your Email:** info@runrungb.com  
**Purpose:** Automatic invoice delivery  
**Configuration Time:** 5 minutes

---

## ⚡ QUICK SETUP - COPY THESE VALUES

Add these 6 variables to Railway Dashboard:

### Railway Dashboard → Backend Service → Variables → New Variable

```
Variable 1:
EMAIL_HOST = smtp.gmail.com

Variable 2:
EMAIL_PORT = 587

Variable 3:
EMAIL_SECURE = false

Variable 4:
EMAIL_USER = info@runrungb.com

Variable 5:
EMAIL_PASS = [YOUR_APP_PASSWORD_HERE]

Variable 6:
EMAIL_FROM = Run-Run Guiné-Bissau <info@runrungb.com>
```

---

## 🔑 STEP 1: GET APP PASSWORD FOR info@runrungb.com

### Option A: If info@runrungb.com is a Gmail Account

1. **Login to Gmail:**
   - Go to: https://mail.google.com
   - Login with: info@runrungb.com

2. **Enable 2-Factor Authentication** (if not already enabled):
   - Visit: https://myaccount.google.com/security
   - Find "2-Step Verification"
   - Click "Get Started" and follow steps
   - **Important:** This is REQUIRED for app passwords!

3. **Create App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - You may need to re-enter password
   - **Select app:** Mail
   - **Select device:** Other (Custom name)
   - **Enter name:** "Run-Run Backend"
   - Click **Generate**

4. **Copy the 16-Character Password:**
   ```
   Example: abcd efgh ijkl mnop
   ```
   ⚠️ **SAVE THIS PASSWORD!** You won't see it again.

---

### Option B: If info@runrungb.com is Custom Domain Email

You'll need SMTP settings from your email provider. Check these resources:

#### For cPanel/WHM Hosting:
```
EMAIL_HOST = mail.runrungb.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = info@runrungb.com
EMAIL_PASS = [your_email_password]
EMAIL_FROM = Run-Run Guiné-Bissau <info@runrungb.com>
```

#### For Office 365:
```
EMAIL_HOST = smtp.office365.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = info@runrungb.com
EMAIL_PASS = [your_email_password]
EMAIL_FROM = Run-Run Guiné-Bissau <info@runrungb.com>
```

#### For Outlook.com:
```
EMAIL_HOST = smtp-mail.outlook.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = info@runrungb.com
EMAIL_PASS = [your_email_password]
EMAIL_FROM = Run-Run Guiné-Bissau <info@runrungb.com>
```

#### For Zoho Mail:
```
EMAIL_HOST = smtp.zoho.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = info@runrungb.com
EMAIL_PASS = [your_email_password]
EMAIL_FROM = Run-Run Guiné-Bissau <info@runrungb.com>
```

**Contact your hosting provider if unsure!**

---

## 🚂 STEP 2: ADD TO RAILWAY

1. **Open Railway Dashboard:**
   ```
   https://railway.app/dashboard
   ```

2. **Navigate to your Backend:**
   - Click on "Run-Run Backend" project
   - Click on Backend service
   - Click **"Variables"** tab

3. **Add Each Variable:**
   - Click **"New Variable"** button
   - Enter name and value
   - Click **"Add"**
   - Repeat for all 6 variables

4. **Final Variables List Should Look Like:**
   ```
   ✅ EMAIL_HOST     = smtp.gmail.com (or your SMTP server)
   ✅ EMAIL_PORT     = 587
   ✅ EMAIL_SECURE   = false
   ✅ EMAIL_USER     = info@runrungb.com
   ✅ EMAIL_PASS     = •••• •••• •••• ••••
   ✅ EMAIL_FROM     = Run-Run Guiné-Bissau <info@runrungb.com>
   ```

5. **Wait for Auto-Redeploy:**
   - Railway will automatically redeploy (~2 minutes)
   - Check "Deployments" tab
   - Wait for "Success" ✅

---

## 📧 WHAT CUSTOMERS WILL SEE

### Email Details:
```
From:    Run-Run Guiné-Bissau <info@runrungb.com>
To:      customer@company.com
Subject: Run-Run Invoice #INV-20260129-001
Reply-To: info@runrungb.com

Attachment: invoice-INV-20260129-001.pdf
```

### Email Body:
```
Dear [Company Name],

Thank you for using Run-Run for your transportation needs.

Please find attached your invoice #INV-20260129-001 for the 
ride completed on January 29, 2026.

Trip Details:
- From: [Pickup Address]
- To: [Dropoff Address]
- Distance: 5.2 km
- Amount: 2,000 XOF

If you have any questions, please contact us at info@runrungb.com

Best regards,
Run-Run Guiné-Bissau Team

---
© 2026 Run-Run Guiné-Bissau | KCDIGITALS
Phone: +245 955 981 398
Email: info@runrungb.com
Website: https://runrungw.com
```

---

## ✅ VERIFICATION CHECKLIST

After adding variables:

### Check 1: Variables Visible
- [ ] All 6 variables added to Railway
- [ ] EMAIL_USER = info@runrungb.com
- [ ] EMAIL_FROM contains info@runrungb.com
- [ ] EMAIL_PASS is hidden (•••• •••• •••• ••••)

### Check 2: Deployment Success
- [ ] Railway "Deployments" tab shows "Success"
- [ ] No errors in build logs
- [ ] Service is running

### Check 3: Test Email
- [ ] Create business account in mobile app
- [ ] Complete a test ride
- [ ] Check if email arrives at invoice_email address
- [ ] Verify sender shows "Run-Run Guiné-Bissau <info@runrungb.com>"

---

## 🧪 TEST INVOICE EMAIL

### Complete Test Flow:

1. **Open Run-Run Passenger App**

2. **Create Test Business Account:**
   ```
   Company Name: Test Company Ltd
   Tax ID: 123456789
   Address: Bissau, Guinea-Bissau
   Phone: +245 955 123 456
   Company Email: company@test.com
   Business Type: Transport Services
   Invoice Email: YOUR_PERSONAL_EMAIL@gmail.com  ← Use your email to test
   ```
   - Click **Save**
   - Should see success message

3. **Book and Complete a Ride:**
   - Select pickup location
   - Select dropoff location
   - Choose vehicle type
   - Confirm booking
   - Wait for driver acceptance
   - Complete the ride
   - Process payment

4. **Check Email Inbox:**
   - Open YOUR_PERSONAL_EMAIL@gmail.com
   - Look for email from "Run-Run Guiné-Bissau <info@runrungb.com>"
   - Subject: "Run-Run Invoice #INV-YYYYMMDD-XXX"
   - Should arrive within 1-2 minutes
   - Download PDF attachment
   - Verify invoice details

5. **Check In App:**
   - Menu → Invoices
   - Your invoice should appear
   - Status: "Sent" with email icon ✉️
   - Can download PDF
   - Can share invoice

---

## 🔍 VERIFY EMAIL SENDING IN RAILWAY LOGS

### View Real-Time Logs:

1. **Railway Dashboard** → Your Service → **"Logs"** tab

2. **Look for these messages:**
   ```
   ✅ Email configured: smtp.gmail.com:587
   ✅ Email user: info@runrungb.com
   ✅ Server started successfully
   
   [After ride completion:]
   ℹ️ Invoice created: INV-20260129-001
   ℹ️ Generating PDF...
   ✅ PDF generated successfully
   ℹ️ Sending email to: customer@company.com
   ✅ Email sent successfully to: customer@company.com
   ```

3. **If you see errors:**
   ```
   ❌ SMTP Authentication failed
   ❌ Connection timeout
   ❌ Invalid credentials
   ```
   → Check your EMAIL_PASS is correct
   → Verify 2FA is enabled (for Gmail)
   → Try regenerating app password

---

## 🐛 TROUBLESHOOTING

### Problem: "Authentication failed" in logs

**For Gmail (info@runrungb.com):**
1. Verify 2-Factor Authentication is enabled
2. Regenerate app password: https://myaccount.google.com/apppasswords
3. Update EMAIL_PASS in Railway with new password
4. Wait for redeploy

**For Custom Domain:**
1. Verify SMTP settings with your hosting provider
2. Check if SMTP is enabled for your account
3. Try using SSL port 465 instead:
   - Change EMAIL_PORT to 465
   - Change EMAIL_SECURE to true

### Problem: Emails not arriving

**Check:**
- [ ] Spam/Junk folder
- [ ] Email address is correct in business account
- [ ] Railway logs show "Email sent successfully"
- [ ] Test with different email provider (Gmail, Outlook, etc.)

**Fix:**
1. Send test email to multiple providers
2. Check sender reputation (use https://mxtoolbox.com)
3. Consider using SendGrid for better deliverability

### Problem: PDF attachment missing

**Check Railway Logs:**
```
✅ PDF generated successfully
✅ Email sent with attachment
```

**If PDF generation fails:**
- Check pdfkit is installed in package.json
- Verify Railway has enough memory
- Check logs for specific PDF errors

---

## 📊 MONITOR EMAIL DELIVERY

### Database Queries:

```sql
-- Check recent invoices with email status
SELECT 
  invoice_number,
  status,
  sent_to_email,
  email_sent_at,
  created_at
FROM invoices
ORDER BY created_at DESC
LIMIT 10;

-- Email delivery success rate
SELECT 
  COUNT(*) as total_invoices,
  SUM(CASE WHEN sent_to_email = true THEN 1 ELSE 0 END) as emails_sent,
  ROUND(100.0 * SUM(CASE WHEN sent_to_email = true THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM invoices
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
```

---

## ✨ AFTER SUCCESSFUL CONFIGURATION

Your system will automatically:

✅ **Send invoices from:** info@runrungb.com  
✅ **Professional sender name:** Run-Run Guiné-Bissau  
✅ **Reply-to address:** info@runrungb.com  
✅ **PDF attachments:** Included automatically  
✅ **Track delivery:** Database records email status  
✅ **Customer support:** Customers can reply to info@runrungb.com

---

## 🎯 RECOMMENDED: SET UP EMAIL FORWARDING

To monitor invoice emails being sent:

1. **In your email provider:**
   - Create filter/rule for "Run-Run Invoice"
   - Forward copy to admin@runrungb.com or your personal email
   - Keep track of all invoices sent

2. **Benefits:**
   - Monitor invoice delivery
   - Customer service tracking
   - Audit trail for accounting

---

## 📞 SUPPORT

**Email Issues:**
- Contact: suporte@runrungb.com
- Phone: +245 955 981 398

**Email Provider Support:**
- Gmail: https://support.google.com/mail
- Check with your hosting provider for custom domain

---

## 🎉 READY TO GO!

Once configured with **info@runrungb.com**, your Run-Run system will:

✅ Send professional invoices automatically  
✅ Use your company email address  
✅ Build trust with business customers  
✅ Enable B2B transportation services  
✅ Provide proper documentation for accounting  

---

**Configuration Email:** info@runrungb.com  
**Setup Time:** ~5 minutes  
**Status:** Ready to configure  

**© 2026 Run-Run Guiné-Bissau | KCDIGITALS**
