# 🚨 URGENT FIX: Run Migrations in Correct Order

## ❌ Error You're Seeing
```
SQL Error [42703]: ERROR: column d.name does not exist
```

## ✅ Solution: Run Migrations in Order

You need to add the missing columns BEFORE trying to update them.

### Step 1: Add Passenger Profile Columns (Migration 006)
**File:** `backend/database/migrations/006_add_passenger_profile_columns_DBEAVER.sql`

1. Open DBeaver
2. Copy the ENTIRE file
3. Paste in SQL Editor
4. Select all (`Ctrl+A`)
5. Execute Script (`Alt+X`)

**Expected output:**
```
✅ Added name column to passengers table
✅ Set default names for existing passengers
✅ Made name column NOT NULL
✅ Added email column to passengers table
✅ Added profile_photo_url column to passengers table
```

### Step 2: Add Driver Profile Columns (Migration 006b)
**File:** `backend/database/migrations/006b_add_driver_profile_columns.sql`

1. Still in DBeaver
2. Copy the ENTIRE file
3. Paste in SQL Editor
4. Select all (`Ctrl+A`)
5. Execute Script (`Alt+X`)

**Expected output:**
```
✅ Added name column to drivers table
✅ Set default names for existing drivers
✅ Made name column NOT NULL
✅ Added email column to drivers table
✅ Added profile_photo_url column to drivers table
```

### Step 3: Update Existing User Names (Migration 007)
**File:** `backend/database/migrations/007_fix_existing_user_names.sql`

1. Still in DBeaver
2. Copy the ENTIRE file
3. Paste in SQL Editor
4. Select all (`Ctrl+A`)
5. Execute Script (`Alt+X`)

**Expected output:**
```
✅ Checking passengers...
✅ Checking drivers...
Passengers without names: 0
Drivers without names: 0
UPDATE X (number of passengers updated)
UPDATE X (number of drivers updated)
```

## ✅ Verify Everything Works

Run this query to verify:
```sql
-- Check passengers
SELECT id, name, email FROM passengers LIMIT 5;

-- Check drivers
SELECT id, name, email FROM drivers LIMIT 5;
```

All should have names now!

---

## Quick Summary

**Run these files IN ORDER:**
1. `006_add_passenger_profile_columns_DBEAVER.sql` ✅
2. `006b_add_driver_profile_columns.sql` ✅
3. `007_fix_existing_user_names.sql` ✅

**Total time:** 5 minutes

**After this:**
- ✅ Passenger profiles can be updated
- ✅ Driver profiles can be updated
- ✅ Welcome screens show real names
- ✅ All database columns exist
