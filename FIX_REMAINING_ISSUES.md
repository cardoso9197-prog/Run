# Fix Remaining Issues - December 20, 2025

## 🔴 ISSUE 1: Withdrawal Balance - "column total_earnings does not exist"

### Problem:
The withdrawal balance endpoint fails because the balance columns don't exist in the Railway database.

### Root Cause:
Migration 005 was created locally but never executed on the Railway PostgreSQL database.

### Solution:
Run this SQL in DBeaver connected to Railway PostgreSQL:

```sql
-- Add balance columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'total_earnings') THEN
        ALTER TABLE drivers ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'available_balance') THEN
        ALTER TABLE drivers ADD COLUMN available_balance DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'pending_withdrawals') THEN
        ALTER TABLE drivers ADD COLUMN pending_withdrawals DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- Initialize NULL values
UPDATE drivers 
SET total_earnings = COALESCE(total_earnings, 0),
    available_balance = COALESCE(available_balance, 0),
    pending_withdrawals = COALESCE(pending_withdrawals, 0);

-- Verify
SELECT id, total_earnings, available_balance, pending_withdrawals FROM drivers;
```

### Expected Result:
All drivers should have these three columns with default value 0.00.

---

## 🔴 ISSUE 2: Driver Status Update - Still failing

### Problem:
Driver app cannot update status from offline to online.

### Possible Causes:
1. **Status column doesn't exist** - Need to verify
2. **API call format wrong** - Already fixed in code
3. **Backend not deployed** - Already deployed
4. **App has old code** - NEW APK built with fixes

### Solution Step 1: Verify Status Column Exists

Run this SQL in DBeaver:

```sql
-- Check if status column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'drivers' AND column_name = 'status';

-- If it doesn't exist, add it:
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'status') THEN
        ALTER TABLE drivers ADD COLUMN status VARCHAR(20) DEFAULT 'offline';
        ALTER TABLE drivers ADD CONSTRAINT drivers_status_check CHECK (status IN ('online', 'offline', 'busy'));
        CREATE INDEX idx_drivers_status ON drivers(status);
    END IF;
END $$;

-- Verify
SELECT id, status, is_verified FROM drivers;
```

### Solution Step 2: Test Status API

After running the SQL, test the status endpoint:

```powershell
# Login as driver
$loginBody = '{"phone":"+245955971275","password":"123456","userType":"driver"}'
$response = Invoke-WebRequest -Uri 'https://zippy-healing-production-24e4.up.railway.app/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json' -UseBasicParsing
$loginData = $response.Content | ConvertFrom-Json
$token = $loginData.token

# Update status to online
$statusBody = '{"status":"online"}'
$statusResp = Invoke-WebRequest -Uri 'https://zippy-healing-production-24e4.up.railway.app/api/drivers/status' -Method Put -Body $statusBody -Headers @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' } -UseBasicParsing
$statusResp.Content
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "status": "online"
}
```

---

## ✅ VERIFICATION CHECKLIST

### After Running Both SQLs:

1. **Verify Balance Columns:**
   ```sql
   SELECT 
     column_name, 
     data_type, 
     column_default 
   FROM information_schema.columns 
   WHERE table_name = 'drivers' 
     AND column_name IN ('total_earnings', 'available_balance', 'pending_withdrawals');
   ```
   **Expected:** 3 rows returned

2. **Verify Status Column:**
   ```sql
   SELECT 
     column_name, 
     data_type, 
     column_default 
   FROM information_schema.columns 
   WHERE table_name = 'drivers' 
     AND column_name = 'status';
   ```
   **Expected:** 1 row returned

3. **Check Driver Data:**
   ```sql
   SELECT 
     id, 
     status, 
     total_earnings, 
     available_balance, 
     pending_withdrawals 
   FROM drivers 
   WHERE id = 4;
   ```
   **Expected:** All columns have values (not NULL)

---

## 🧪 TESTING AFTER FIXES

### Test 1: Withdrawal Balance
```bash
# In driver app:
1. Login with +245955971275 / 123456
2. Go to Earnings screen
3. Tap "Withdraw Earnings"
4. Should see: Balance 0 XOF ✅
5. Should see: Withdrawal form ✅
6. NO ERROR! ✅
```

### Test 2: Driver Status
```bash
# In driver app:
1. Login with +245955971275 / 123456
2. On Home screen, tap "Go Online"
3. Should see: "You are now online" ✅
4. Button changes to "Go Offline" ✅
5. Tap "Go Offline"
6. Should see: "You are now offline" ✅
```

---

## 📱 DRIVER APK STATUS

**Latest Build:** 3d7e1bdf-bb19-405f-9e80-32e67fb9ff8e

**Includes:**
- ✅ Status update fix (HomeScreen.js)
- ✅ Enhanced withdrawal logging (WithdrawScreen.js)
- ✅ All latest code changes

**Download:**
https://expo.dev/accounts/edipro/projects/runrun-driver/builds/3d7e1bdf-bb19-405f-9e80-32e67fb9ff8e

---

## 🚀 DEPLOYMENT STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Code | ✅ Deployed | Withdrawal routes + status endpoint |
| Database Columns | ⏳ Pending | Need to run SQL in DBeaver |
| Driver APK | ✅ Built | Has all code fixes |
| Testing | ⏳ Pending | After database fixed |

---

## 📋 IMMEDIATE ACTIONS

1. **NOW:** Run balance columns SQL in DBeaver
2. **NOW:** Run status column SQL in DBeaver
3. **VERIFY:** Check both columns exist
4. **TEST:** Test balance API via PowerShell
5. **TEST:** Test status API via PowerShell
6. **INSTALL:** Install new Driver APK on phone
7. **TEST:** Test both features in app

---

**Status:** Ready to fix - Just need to execute the SQL queries! 🔧
