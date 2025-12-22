-- ============================================
-- COMPLETE FIX - Run this SINGLE file
-- ============================================
-- Date: December 22, 2024
-- Purpose: Add all missing columns and fix user names
-- Instructions: Run this ONE file in DBeaver (Alt+X)
-- ============================================

-- PART 1: Add name column to PASSENGERS if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'name'
    ) THEN
        ALTER TABLE passengers ADD COLUMN name VARCHAR(100);
        RAISE NOTICE '✅ Step 1a: Added name column to passengers table';
        
        UPDATE passengers 
        SET name = 'Passenger ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE passengers.user_id = u.id AND passengers.name IS NULL;
        RAISE NOTICE '✅ Step 1b: Set default names for existing passengers';
        
        ALTER TABLE passengers ALTER COLUMN name SET NOT NULL;
        RAISE NOTICE '✅ Step 1c: Made passengers.name column NOT NULL';
    ELSE
        RAISE NOTICE 'ℹ️  Step 1: Passengers.name column already exists';
    END IF;
END $$;

-- PART 2: Add email column to PASSENGERS if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'email'
    ) THEN
        ALTER TABLE passengers ADD COLUMN email VARCHAR(100);
        RAISE NOTICE '✅ Step 2: Added email column to passengers table';
    ELSE
        RAISE NOTICE 'ℹ️  Step 2: Passengers.email column already exists';
    END IF;
END $$;

-- PART 3: Add profile_photo_url to PASSENGERS if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE passengers ADD COLUMN profile_photo_url TEXT;
        RAISE NOTICE '✅ Step 3: Added profile_photo_url column to passengers table';
    ELSE
        RAISE NOTICE 'ℹ️  Step 3: Passengers.profile_photo_url column already exists';
    END IF;
END $$;

-- PART 4: Add name column to DRIVERS if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'name'
    ) THEN
        ALTER TABLE drivers ADD COLUMN name VARCHAR(100);
        RAISE NOTICE '✅ Step 4a: Added name column to drivers table';
        
        UPDATE drivers 
        SET name = 'Driver ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE drivers.user_id = u.id AND drivers.name IS NULL;
        RAISE NOTICE '✅ Step 4b: Set default names for existing drivers';
        
        ALTER TABLE drivers ALTER COLUMN name SET NOT NULL;
        RAISE NOTICE '✅ Step 4c: Made drivers.name column NOT NULL';
    ELSE
        RAISE NOTICE 'ℹ️  Step 4: Drivers.name column already exists';
    END IF;
END $$;

-- PART 5: Add email column to DRIVERS if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'email'
    ) THEN
        ALTER TABLE drivers ADD COLUMN email VARCHAR(100);
        RAISE NOTICE '✅ Step 5: Added email column to drivers table';
    ELSE
        RAISE NOTICE 'ℹ️  Step 5: Drivers.email column already exists';
    END IF;
END $$;

-- PART 6: Add profile_photo_url to DRIVERS if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE drivers ADD COLUMN profile_photo_url TEXT;
        RAISE NOTICE '✅ Step 6: Added profile_photo_url column to drivers table';
    ELSE
        RAISE NOTICE 'ℹ️  Step 6: Drivers.profile_photo_url column already exists';
    END IF;
END $$;

-- PART 7: Update passenger names from users table
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE passengers 
    SET name = u.name,
        updated_at = NOW()
    FROM users u
    WHERE passengers.user_id = u.id 
    AND u.name IS NOT NULL
    AND u.name != ''
    AND (passengers.name LIKE 'Passenger %' OR passengers.name IS NULL);
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE '✅ Step 7: Updated % passenger names from users table', updated_count;
END $$;

-- PART 8: Update driver names from users table
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE drivers 
    SET name = u.name,
        updated_at = NOW()
    FROM users u
    WHERE drivers.user_id = u.id 
    AND u.name IS NOT NULL
    AND u.name != ''
    AND (drivers.name LIKE 'Driver %' OR drivers.name IS NULL);
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE '✅ Step 8: Updated % driver names from users table', updated_count;
END $$;

-- PART 9: Show final results
DO $$
DECLARE
    passenger_count INTEGER;
    driver_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO passenger_count FROM passengers WHERE name IS NOT NULL;
    SELECT COUNT(*) INTO driver_count FROM drivers WHERE name IS NOT NULL;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ MIGRATION COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total passengers with names: %', passenger_count;
    RAISE NOTICE 'Total drivers with names: %', driver_count;
    RAISE NOTICE '========================================';
END $$;

-- Show sample data (only if columns exist)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'Sample passenger data will be shown in next query...';
    END IF;
END $$;

-- Sample passengers (safe query)
SELECT 
    'Sample Passengers' as info,
    p.id, 
    p.name, 
    p.email,
    u.phone
FROM passengers p
JOIN users u ON p.user_id = u.id
LIMIT 3;

-- Sample drivers (safe query)
SELECT 
    'Sample Drivers' as info,
    d.id, 
    d.name, 
    d.email,
    u.phone
FROM drivers d
JOIN users u ON d.user_id = u.id
LIMIT 3;

-- ============================================
-- ✅ DONE! All columns added and names updated
-- Now deploy backend and test the apps!
-- ============================================
