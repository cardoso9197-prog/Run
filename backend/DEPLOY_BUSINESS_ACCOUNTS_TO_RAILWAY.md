# 🚀 DEPLOY BUSINESS ACCOUNTS TO RAILWAY - STEP BY STEP

**Date:** January 29, 2026  
**Feature:** Business Accounts with Electronic Invoice System  
**Migration:** 007_create_business_accounts.sql  
**Status:** ⚠️ CODE PUSHED TO GITHUB - DATABASE MIGRATION PENDING

---

## ✅ WHAT'S BEEN DONE

1. ✅ Backend code committed to GitHub
2. ✅ Migration file created: `007_create_business_accounts.sql`
3. ✅ Business routes created: `routes/business.js`
4. ✅ Dependencies added: `pdfkit`, `nodemailer`
5. ✅ Server updated with business routes

**GitHub Commit:** `9e31c8b` - "feat: Add business accounts and invoice system"  
**Repository:** https://github.com/cardoso9197-prog/Run.git

---

## 🎯 WHAT NEEDS TO BE DONE

### Step 1: Deploy Code to Railway ✅ (Auto-Deploy)

Railway should automatically deploy from GitHub. Check deployment:

1. Go to: **Railway Dashboard** → Your Project
2. Check **Deployments** tab
3. Verify latest commit `9e31c8b` is deployed
4. Wait for build to complete (~2-5 minutes)

**If auto-deploy is disabled:**
```bash
# Manually trigger deploy
railway up
```

---

### Step 2: Run Database Migration 🔴 (REQUIRED)

The migration creates 3 new tables:
- `business_accounts` - Store company information
- `invoices` - Store invoice records
- `invoice_items` - Store invoice line items

#### Option A: Via Railway CLI (Recommended)

```powershell
# Install Railway CLI if not installed
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Connect to PostgreSQL and run migration
railway run psql $DATABASE_URL -f database/migrations/007_create_business_accounts.sql
```

#### Option B: Via Railway Dashboard (Easy)

1. **Open Railway Dashboard:** https://railway.app/dashboard
2. **Select your project:** Run-Run Backend
3. **Click on PostgreSQL service**
4. **Click "Connect" tab**
5. **Copy "Postgres Connection URL"**
6. **Open terminal and run:**

```powershell
# Replace with your actual DATABASE_URL from Railway
$env:DATABASE_URL = "postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"

# Navigate to backend folder
cd "C:\Users\Colondo Full service\Desktop\Run-Run GW\backend"

# Run migration using Node.js
node -e "const { Client } = require('pg'); const fs = require('fs'); const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); client.connect().then(() => { const sql = fs.readFileSync('./database/migrations/007_create_business_accounts.sql', 'utf8'); return client.query(sql); }).then(() => { console.log('✅ Migration 007 completed successfully!'); return client.end(); }).catch(err => { console.error('❌ Migration failed:', err); process.exit(1); });"
```

#### Option C: Via pgAdmin or DBeaver (Visual)

1. **Connect to Railway PostgreSQL:**
   - Get credentials from Railway Dashboard
   - Host: `containers-us-west-xxx.railway.app`
   - Port: `5432`
   - Database: `railway`
   - User: `postgres`
   - Password: (from Railway)

2. **Open SQL Editor**

3. **Copy and paste contents of:**
   ```
   backend/database/migrations/007_create_business_accounts.sql
   ```

4. **Execute the SQL**

5. **Verify tables created:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name IN ('business_accounts', 'invoices', 'invoice_items');
   ```

---

### Step 3: Configure Email Settings 📧 (REQUIRED for Invoice Emails)

Add these environment variables in Railway:

1. **Go to Railway Dashboard** → Your Project
2. **Click on Backend Service**
3. **Click "Variables" tab**
4. **Add the following:**

#### For Gmail (Free):

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=Run-Run Guiné-Bissau <your-email@gmail.com>
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Create "Run-Run Backend" password
3. Copy 16-character password
4. Use as `EMAIL_PASS`

#### For SendGrid (Professional):

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=Run-Run Guiné-Bissau <noreply@runrungw.com>
```

#### For Custom SMTP:

```
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM=Run-Run Guiné-Bissau <noreply@runrungw.com>
```

5. **Click "Add" for each variable**
6. **Railway will auto-redeploy** (~2 minutes)

---

### Step 4: Verify Deployment ✅

#### Check Tables Exist:

```sql
-- Connect to Railway PostgreSQL and run:
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_name IN ('business_accounts', 'invoices', 'invoice_items')
ORDER BY table_name;
```

**Expected Output:**
```
table_name          | column_count
--------------------+-------------
business_accounts   | 12
invoices            | 22
invoice_items       | 9
```

#### Test API Endpoints:

```powershell
# Get your Railway backend URL (e.g., https://run-backend-production.up.railway.app)
$BACKEND_URL = "https://your-backend.railway.app"

# Test 1: Create Business Account (requires auth token)
curl -X POST "$BACKEND_URL/api/business-accounts" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" `
  -d '{
    "company_name": "Test Company Ltd",
    "tax_id": "123456789",
    "company_address": "Bissau, Guinea-Bissau",
    "company_phone": "+245 955 123 456",
    "company_email": "company@test.com",
    "business_type": "Transport",
    "invoice_email": "invoices@test.com"
  }'

# Test 2: Get Business Account
curl "$BACKEND_URL/api/business-accounts" `
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# Test 3: Health Check
curl "$BACKEND_URL/health"
```

---

## 📋 COMPLETE DEPLOYMENT CHECKLIST

### Pre-Deployment:
- [x] Code committed to GitHub
- [x] Migration file created
- [x] Dependencies added to package.json

### Deployment:
- [ ] Railway auto-deployed latest code
- [ ] Migration 007 executed on Railway PostgreSQL
- [ ] Email environment variables configured
- [ ] Railway service redeployed

### Post-Deployment:
- [ ] Tables created successfully
- [ ] API endpoints responding
- [ ] Test business account creation
- [ ] Test invoice generation
- [ ] Test invoice email delivery
- [ ] Mobile app can connect to new endpoints

---

## 🧪 TESTING THE FEATURE

### Test Flow:

1. **Create Business Account (via Mobile App):**
   - Open Run-Run Passenger App
   - Go to Menu → Business Account
   - Fill in company details
   - Save

2. **Complete a Ride:**
   - Book a ride
   - Complete trip
   - Pay

3. **Check Invoice Generation:**
   - Invoice should auto-generate
   - Check Invoices List in app
   - Verify PDF download works
   - Check email for invoice

4. **Verify Backend:**
   ```sql
   -- Check business account created
   SELECT * FROM business_accounts;
   
   -- Check invoice generated
   SELECT * FROM invoices;
   
   -- Check invoice items
   SELECT * FROM invoice_items;
   ```

---

## 🐛 TROUBLESHOOTING

### Problem: Migration Fails

**Error:** "relation already exists"
```sql
-- Drop existing tables (CAUTION: Only if testing)
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS business_accounts CASCADE;

-- Then re-run migration
```

### Problem: Email Not Sending

**Check:**
1. Environment variables set correctly
2. Email credentials valid
3. Check Railway logs: `railway logs`
4. Test SMTP connection:
   ```javascript
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransport({
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
     }
   });
   transporter.verify((error, success) => {
     if (error) console.log('SMTP Error:', error);
     else console.log('✅ SMTP Ready');
   });
   ```

### Problem: API Returns 404

**Fix:**
- Verify `routes/business.js` exists
- Check `server.js` has: `app.use('/api', businessRoutes)`
- Restart Railway service

### Problem: PDF Generation Fails

**Check:**
- `pdfkit` installed in Railway
- Check Railway build logs
- Verify `package.json` includes:
  ```json
  "dependencies": {
    "pdfkit": "^0.15.0",
    "nodemailer": "^6.9.8"
  }
  ```

---

## 📊 MONITORING

### Check Railway Logs:

```powershell
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs

# Follow logs in real-time
railway logs --follow
```

### Check Database:

```sql
-- Count business accounts
SELECT COUNT(*) FROM business_accounts;

-- Count invoices
SELECT COUNT(*) FROM invoices;

-- Recent invoices
SELECT 
  i.invoice_number,
  i.total_amount,
  i.status,
  ba.company_name,
  i.created_at
FROM invoices i
JOIN business_accounts ba ON i.business_account_id = ba.id
ORDER BY i.created_at DESC
LIMIT 10;
```

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. ✅ Test with real company data
2. ✅ Verify invoice PDF formatting
3. ✅ Test email delivery
4. ✅ Share with beta testers
5. ✅ Monitor for errors
6. ✅ Update documentation

---

## 📞 SUPPORT

**Backend Repository:** https://github.com/cardoso9197-prog/Run.git  
**Railway Dashboard:** https://railway.app/dashboard  
**Email:** suporte@runrungb.com

---

## 📝 MIGRATION FILE DETAILS

**File:** `database/migrations/007_create_business_accounts.sql`

**Creates:**
- `business_accounts` table (12 columns)
- `invoices` table (22 columns)
- `invoice_items` table (9 columns)

**Indexes:**
- `idx_business_accounts_passenger_id`
- `idx_invoices_business_account_id`
- `idx_invoices_ride_id`
- `idx_invoices_passenger_id`
- `idx_invoices_invoice_number`
- `idx_invoice_items_invoice_id`
- `idx_invoices_status`

**Triggers:**
- `update_business_accounts_updated_at`
- `update_invoices_updated_at`

---

**Last Updated:** January 29, 2026  
**Status:** ⚠️ CODE DEPLOYED - AWAITING DATABASE MIGRATION

**© 2026 Run-Run Guiné-Bissau | KCDIGITALS**
