# 🔧 FIX: Missing Vehicles Table Error

## ❌ THE PROBLEM

When drivers try to register and verify OTP, you get this error:

```
❌ Query error: relation "vehicles" does not exist
```

**What happened:**
- OTP verification succeeded ✅
- User account created ✅
- JWT token generated ✅
- **BUT** when trying to fetch driver details, the query joins with the `vehicles` table
- The `vehicles` table doesn't exist in your Railway database ❌

---

## ✅ THE SOLUTION

You need to create the `vehicles` table in your Railway PostgreSQL database.

---

## 📋 OPTION 1: Run SQL in Railway Console (EASIEST)

### Step 1: Open Railway PostgreSQL Console

1. Go to https://railway.app
2. Open your **Run-Run project**
3. Click on **PostgreSQL** service (not backend)
4. Click **Data** tab
5. Click **Query** button

### Step 2: Copy and Run the SQL

Copy the entire content from: `backend/fix-vehicles-table.sql`

Or copy this SQL:

```sql
-- Create vehicle_type ENUM if it doesn't exist
DO $$ BEGIN
    CREATE TYPE vehicle_type AS ENUM ('RunRun', 'Moto', 'Comfort', 'XL');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'vehicle_type ENUM already exists, skipping...';
END $$;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER,
    color VARCHAR(30),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON vehicles(license_plate);

-- Add vehicle_id to drivers table if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'vehicle_id'
    ) THEN
        ALTER TABLE drivers 
        ADD COLUMN vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL;
        
        CREATE INDEX idx_drivers_vehicle_id ON drivers(vehicle_id);
    END IF;
END $$;
```

### Step 3: Verify

Run this query to check:

```sql
SELECT 
    'vehicles table' as item, 
    CASE WHEN EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'vehicles'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'vehicle_id column', 
    CASE WHEN EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'vehicle_id'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END;
```

**Expected output:**
```
item              | status
------------------+-----------
vehicles table    | ✅ EXISTS
vehicle_id column | ✅ EXISTS
```

---

## 📋 OPTION 2: Use psql Command Line

If you prefer command line:

```bash
# Get your DATABASE_URL from Railway PostgreSQL service
# Then run:

psql $DATABASE_URL -f backend/fix-vehicles-table.sql
```

---

## ✅ AFTER FIXING

### Test Driver Registration Again:

1. Open **Driver app**
2. Try to register a new driver:
   - Name: Test Driver
   - Phone: +245955123456 (new number)
   - Password: 123456
   - Vehicle Type: Normal
   - License Plate: GB-1234-AB
   - etc.

3. You should get **OTP code** in alert ✅
4. Enter OTP on verification screen ✅
5. Should see **"Pending Activation"** screen ✅

**No more "vehicles table doesn't exist" error!** 🎉

---

## 🔍 WHY THIS HAPPENED

Your database schema has the `vehicles` table defined in `schema.sql`, but it seems the initial database setup didn't create all tables.

**Possible reasons:**
- Schema file was updated after initial setup
- Database was created manually without running full schema
- Migration scripts didn't include vehicles table

**This fix creates the missing table without affecting existing data.** ✅

---

## 📊 WHAT THE VEHICLES TABLE DOES

Stores vehicle information for drivers:

```sql
id              : Auto-incrementing primary key
make            : Toyota, Honda, etc.
model           : Prius, Civic, etc.
year            : 2020, 2021, etc.
color           : White, Black, etc.
license_plate   : GB-1234-AB (unique identifier)
vehicle_type    : RunRun, Moto, Comfort, XL
created_at      : Timestamp
```

**Drivers table links to it:**
```sql
drivers.vehicle_id → vehicles.id
```

This allows:
- Passengers to see driver's vehicle info
- Admin to verify vehicle details
- Tracking vehicle-specific metrics
- Vehicle type-based pricing

---

## ✅ NEXT STEPS AFTER FIX

1. **Run the SQL in Railway console** ✅
2. **Test driver registration** ✅
3. **Verify OTP flow works completely** ✅
4. **Check driver sees "Pending Activation" screen** ✅
5. **Admin can activate driver** ✅

---

## 🆘 IF YOU STILL GET ERRORS

Check Railway logs after running SQL:

```bash
# Look for these success messages:
✅ Generated OTP: 123456
✅ Registration successful
✅ Token generated successfully
✅ Driver data retrieved successfully
```

**No more errors about "vehicles" table!** 🎉

---

**Status:** 🔧 **FIX READY - Just run the SQL in Railway console!**
