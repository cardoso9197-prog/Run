-- ============================================
-- PASSENGER PROFILE FIX - Run in Railway Query Tab
-- ============================================
-- Date: December 22, 2024
-- Purpose: Add missing profile columns to passengers table
-- Instructions: Copy and paste this entire script into Railway PostgreSQL Query tab
-- ============================================

-- Step 1: Check current columns (for reference)
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'passengers'
ORDER BY ordinal_position;

-- Step 2: Add name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'name'
    ) THEN
        -- Add name column (allow NULL temporarily)
        ALTER TABLE passengers ADD COLUMN name VARCHAR(100);
        RAISE NOTICE '✅ Added name column to passengers table';
        
        -- Set default name from phone number for existing passengers
        UPDATE passengers 
        SET name = 'Passenger ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE passengers.user_id = u.id AND passengers.name IS NULL;
        RAISE NOTICE '✅ Set default names for existing passengers';
        
        -- Make it NOT NULL after setting defaults
        ALTER TABLE passengers ALTER COLUMN name SET NOT NULL;
        RAISE NOTICE '✅ Made name column NOT NULL';
    ELSE
        RAISE NOTICE 'ℹ️  Name column already exists in passengers table';
    END IF;
END $$;

-- Step 3: Add email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'email'
    ) THEN
        ALTER TABLE passengers ADD COLUMN email VARCHAR(100);
        RAISE NOTICE '✅ Added email column to passengers table';
    ELSE
        RAISE NOTICE 'ℹ️  Email column already exists in passengers table';
    END IF;
END $$;

-- Step 4: Add profile_photo_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE passengers ADD COLUMN profile_photo_url TEXT;
        RAISE NOTICE '✅ Added profile_photo_url column to passengers table';
    ELSE
        RAISE NOTICE 'ℹ️  Profile_photo_url column already exists in passengers table';
    END IF;
END $$;

-- Step 5: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    CASE 
        WHEN column_name IN ('name', 'email', 'profile_photo_url') THEN '✅ NEW'
        ELSE ''
    END as status
FROM information_schema.columns
WHERE table_name = 'passengers'
ORDER BY ordinal_position;

-- Step 6: Show sample passenger data
SELECT 
    id, 
    user_id, 
    name, 
    email, 
    profile_photo_url,
    average_rating,
    total_rides,
    created_at
FROM passengers
LIMIT 5;

-- ============================================
-- DONE! ✅
-- Passengers can now update their profiles
-- ============================================
