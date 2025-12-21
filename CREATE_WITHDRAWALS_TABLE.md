# 🎯 CREATE WITHDRAWALS TABLE - FINAL FIX

## ❌ Current Issue
```
failed to load balance: relation "withdrawals" does not exist
```

The withdrawal balance API is failing because the `withdrawals` table hasn't been created in your Railway PostgreSQL database yet.

---

## ✅ Solution: Run Migration 003 in DBeaver

### Step 1: Open the SQL File
Open this file in VS Code:
```
backend/database/migrations/003_create_withdrawals_table.sql
```

### Step 2: Copy ALL the SQL
Select all the SQL content (Ctrl+A) and copy it (Ctrl+C)

### Step 3: Execute in DBeaver
1. Open DBeaver
2. Connect to your Railway PostgreSQL database
3. Open a new SQL Editor (Ctrl+])
4. Paste the SQL (Ctrl+V)
5. Execute the script (Ctrl+Enter or click Execute)

### Step 4: Verify Tables Were Created
Run this query in DBeaver to confirm:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('withdrawals', 'driver_withdrawal_settings')
ORDER BY table_name;
```

Expected result:
```
table_name
--------------------------
driver_withdrawal_settings
withdrawals
```

---

## 🧪 Test Withdrawal Balance API (PowerShell)

After creating the tables, test the API:

```powershell
# Login first
$loginBody = '{"phone":"+245955971275","password":"123456","userType":"driver"}'
$response = Invoke-WebRequest -Uri 'https://zippy-healing-production-24e4.up.railway.app/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json' -UseBasicParsing
$loginData = $response.Content | ConvertFrom-Json
$token = $loginData.token

# Test withdrawal balance
$balanceResp = Invoke-WebRequest -Uri 'https://zippy-healing-production-24e4.up.railway.app/api/withdrawals/balance' -Method Get -Headers @{ 'Authorization' = "Bearer $token" } -UseBasicParsing
Write-Host "✅ SUCCESS!" -ForegroundColor Green
$balanceResp.Content
```

Expected successful response:
```json
{
  "success": true,
  "balance": {
    "totalEarnings": 0,
    "availableBalance": 0,
    "pendingWithdrawals": 0,
    "pendingCount": 0
  }
}
```

---

## 📱 Test in Driver App

After the API test passes:

1. **Download Latest APK**:
   ```
   https://expo.dev/accounts/edipro/projects/runrun-driver/builds/3d7e1bdf-bb19-405f-9e80-32e67fb9ff8e
   ```

2. **Install on Android phone**

3. **Login**:
   - Phone: +245955971275
   - Password: 123456

4. **Test Features**:
   - ✅ Go Online/Offline button (already working!)
   - ✅ Earnings → Withdraw Earnings (should work after this fix!)

---

## 📊 What This Migration Creates

1. **`withdrawals` table**: Stores all withdrawal requests
   - Tracks amount, status, payment method
   - Links to drivers table
   - Records transaction IDs

2. **`driver_withdrawal_settings` table**: Stores driver preferences
   - Preferred withdrawal method (Orange Money / MTN)
   - Mobile number for payments
   - Auto-withdrawal settings

3. **ENUM types**:
   - `withdrawal_status`: pending, processing, completed, failed, cancelled
   - `withdrawal_frequency`: daily, weekly

---

## ✅ Summary

**Status Update Feature**: ✅ WORKING (fixed in previous migration)
**Withdrawal Balance Feature**: ⏳ PENDING (needs this migration)

After running migration 003:
- Both features will be fully functional
- Driver app will work completely
- Ready for production testing 🚀
