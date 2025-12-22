# 🔧 Fix Passenger Profile Error - DBeaver Instructions

## ❌ Error You're Seeing
```
SQL Error [42703]: ERROR: column "name" does not exist
Position: 78
Error position: line: 90 pos: 77
```

## 🎯 The Problem
DBeaver is executing the SQL statements one by one, and the verification queries at the end are running BEFORE the migration completes.

## ✅ Solution: Use the DBeaver-Specific File

### Step 1: Open the Correct File
In VS Code, open:
```
backend/database/migrations/006_add_passenger_profile_columns_DBEAVER.sql
```

This version has ONLY the migration code (no verification queries that cause errors).

### Step 2: Copy All Content
1. Click inside the file
2. Press `Ctrl+A` (select all)
3. Press `Ctrl+C` (copy)

### Step 3: Open DBeaver
1. Make sure you're connected to your Railway PostgreSQL database
2. Open a new SQL Editor:
   - Click **SQL Editor** → **New SQL Script**
   - Or press `Ctrl+]`

### Step 4: Paste and Execute
1. Click in the SQL editor
2. Press `Ctrl+V` (paste the SQL)
3. **IMPORTANT:** Select all text (`Ctrl+A`)
4. **Execute as Script:**
   - Press `Alt+X`
   - OR Right-click → **Execute** → **Execute SQL Script**
   - OR Click the "Execute SQL Script" button (icon with multiple arrows)

⚠️ **DO NOT** use "Execute SQL Statement" (Ctrl+Enter) - this runs line by line!

### Step 5: Verify Success
After execution, you should see in the output panel:
```
NOTICE: Added name column to passengers table
NOTICE: Set default names for existing passengers
NOTICE: Made name column NOT NULL
NOTICE: Added email column to passengers table
NOTICE: Added profile_photo_url column to passengers table
```

OR if columns already exist:
```
NOTICE: Name column already exists in passengers table
NOTICE: Email column already exists in passengers table
NOTICE: Profile_photo_url column already exists in passengers table
```

### Step 6: Verify the Changes
Run this query separately to verify:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'passengers'
ORDER BY ordinal_position;
```

You should see:
- ✅ `name` column (varchar, NO)
- ✅ `email` column (varchar, YES)
- ✅ `profile_photo_url` column (text, YES)

### Step 7: Check Sample Data
Run this query to see your passengers:
```sql
SELECT id, user_id, name, email, profile_photo_url, total_rides
FROM passengers
LIMIT 5;
```

You should see passengers with default names like "Passenger 1234".

---

## 🆘 Troubleshooting

### Error: "column name does not exist" on line 90
**Cause:** You used "Execute SQL Statement" instead of "Execute SQL Script"

**Fix:** 
1. Select all text (`Ctrl+A`)
2. Press `Alt+X` (Execute SQL Script)
3. NOT `Ctrl+Enter` (that's Execute Statement)

### Error: "syntax error at or near..."
**Cause:** Part of the SQL didn't get selected

**Fix:**
1. Make sure you copied the ENTIRE file
2. Look for the closing `END $$;` on each block
3. Make sure all 3 DO blocks are included

### Error: Connection timeout
**Cause:** Railway connection might have dropped

**Fix:**
1. In DBeaver, right-click your connection
2. Click "Invalidate/Reconnect"
3. Wait for connection to establish
4. Try running the script again

### Success but columns still missing
**Cause:** Connected to wrong database

**Fix:**
1. Check connection name in DBeaver (should be Railway PostgreSQL)
2. Verify database name (should be "railway")
3. Run this to confirm:
   ```sql
   SELECT current_database();
   ```

---

## 📋 Quick Reference

**File to use:**
```
backend/database/migrations/006_add_passenger_profile_columns_DBEAVER.sql
```

**How to run:**
1. Copy entire file (`Ctrl+A`, `Ctrl+C`)
2. Open DBeaver SQL Editor
3. Paste (`Ctrl+V`)
4. Select all (`Ctrl+A`)
5. Execute Script (`Alt+X`)
6. ✅ Done!

**Expected output:**
```
NOTICE: Added name column to passengers table
NOTICE: Set default names for existing passengers
NOTICE: Made name column NOT NULL
NOTICE: Added email column to passengers table
NOTICE: Added profile_photo_url column to passengers table
```

---

## 🎯 After Running This

Test in passenger app:
1. Open Run-Run Passenger app
2. Go to Profile
3. Update name
4. Click Save
5. ✅ Should work without errors!

---

**Time:** 2 minutes  
**Risk:** None (safe migration)  
**Files:** DBeaver-specific version without verification queries
