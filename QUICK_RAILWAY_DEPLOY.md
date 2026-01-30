# ⚡ QUICK DEPLOYMENT COMMAND

**Run this ONE command to deploy business accounts to Railway:**

```powershell
# Step 1: Copy your Railway DATABASE_URL
# Get it from: https://railway.app/dashboard → PostgreSQL → Connect tab

# Step 2: Run this (replace YOUR_DATABASE_URL with actual URL):
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\backend"; $env:DATABASE_URL = "postgresql://postgres:PASSWORD@containers-us-west-xxx.railway.app:5432/railway"; node run-business-migration-railway.js
```

---

## ✅ SUCCESS INDICATORS

You'll see:
```
✅ Connected successfully!
✅ Migration executed successfully!
✅ All tables created successfully!
📊 Tables:
   - business_accounts (12 columns)
   - invoices (22 columns)  
   - invoice_items (9 columns)
🎉 MIGRATION COMPLETE!
```

---

## 🔴 IF YOU SEE ERRORS

### Error: "DATABASE_URL not set"
**Fix:** Make sure you replaced `YOUR_DATABASE_URL` with your actual Railway URL

### Error: "table already exists"  
**Fix:** Migration already done! Skip to configuring email.

### Error: "authentication failed"
**Fix:** Wrong DATABASE_URL. Copy it again from Railway Dashboard.

---

## 📧 CONFIGURE EMAIL (After migration)

**Railway Dashboard → Backend Service → Variables → Add:**

```
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = your-gmail-app-password
EMAIL_FROM = Run-Run Guiné-Bissau <your-email@gmail.com>
```

**Get Gmail Password:** https://myaccount.google.com/apppasswords

---

## 📱 THEN TEST

1. Open Run-Run Passenger App
2. Menu → Business Account
3. Fill details → Save
4. Complete a ride
5. Check Invoices List

---

**That's it! 🎉**

Full details: See `GITHUB_RAILWAY_COMPLETE_STATUS.md`
