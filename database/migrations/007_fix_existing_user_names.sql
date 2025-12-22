-- ============================================
-- FIX EXISTING USER NAMES - Run after backend deployment
-- ============================================
-- Date: December 22, 2024
-- Purpose: Update existing passengers and drivers who registered
--          before the name storage fix with names from users table
-- ============================================

-- IMPORTANT: Run migration 006 and 006b FIRST to add name columns!

-- Step 1: Check how many users need fixing (only if columns exist)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'Checking passengers...';
    ELSE
        RAISE EXCEPTION 'ERROR: Run migration 006 first - passengers.name column does not exist!';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'Checking drivers...';
    ELSE
        RAISE EXCEPTION 'ERROR: Run migration 006b first - drivers.name column does not exist!';
    END IF;
END $$;

SELECT 
    'Passengers without names' as issue,
    COUNT(*) as count
FROM passengers 
WHERE name IS NULL OR TRIM(name) = '';

SELECT 
    'Drivers without names' as issue,
    COUNT(*) as count
FROM drivers 
WHERE name IS NULL OR TRIM(name) = '';

-- Step 2: Update passengers with names from users table
UPDATE passengers 
SET name = u.name,
    updated_at = NOW()
FROM users u
WHERE passengers.user_id = u.id 
AND (passengers.name IS NULL OR TRIM(passengers.name) = '')
AND u.name IS NOT NULL;

-- Step 3: Update drivers with names from users table  
UPDATE drivers 
SET name = u.name,
    updated_at = NOW()
FROM users u
WHERE drivers.user_id = u.id 
AND (drivers.name IS NULL OR TRIM(drivers.name) = '')
AND u.name IS NOT NULL;

-- Step 4: Verify results
SELECT 
    'Total passengers' as metric,
    COUNT(*) as count
FROM passengers;

SELECT 
    'Passengers with names' as metric,
    COUNT(*) as count
FROM passengers 
WHERE name IS NOT NULL AND TRIM(name) != '';

SELECT 
    'Total drivers' as metric,
    COUNT(*) as count
FROM drivers;

SELECT 
    'Drivers with names' as metric,
    COUNT(*) as count
FROM drivers 
WHERE name IS NOT NULL AND TRIM(name) != '';

-- Step 5: Show sample data
SELECT 
    p.id,
    p.name as passenger_name,
    p.email,
    u.phone
FROM passengers p
JOIN users u ON p.user_id = u.id
LIMIT 5;

SELECT 
    d.id,
    d.name as driver_name,
    d.email,
    u.phone
FROM drivers d
JOIN users u ON d.user_id = u.id
LIMIT 5;

-- ============================================
-- EXPECTED RESULTS:
-- - All passengers should have names
-- - All drivers should have names
-- - Names match what users entered during registration
-- ============================================
