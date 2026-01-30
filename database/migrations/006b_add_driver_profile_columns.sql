-- ============================================
-- ADD DRIVER PROFILE COLUMNS - DBeaver Version
-- ============================================
-- Date: December 22, 2024
-- Purpose: Add missing profile columns to drivers table
-- Instructions: Execute this BEFORE running migration 007
-- ============================================

-- Add name column to drivers if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'name'
    ) THEN
        -- Add name column (allow NULL temporarily)
        ALTER TABLE drivers ADD COLUMN name VARCHAR(100);
        RAISE NOTICE '✅ Added name column to drivers table';
        
        -- Set default name from phone number for existing drivers
        UPDATE drivers 
        SET name = 'Driver ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE drivers.user_id = u.id AND drivers.name IS NULL;
        RAISE NOTICE '✅ Set default names for existing drivers';
        
        -- Make it NOT NULL after setting defaults
        ALTER TABLE drivers ALTER COLUMN name SET NOT NULL;
        RAISE NOTICE '✅ Made name column NOT NULL';
    ELSE
        RAISE NOTICE 'ℹ️  Name column already exists in drivers table';
    END IF;
END $$;

-- Add email column to drivers if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'email'
    ) THEN
        ALTER TABLE drivers ADD COLUMN email VARCHAR(100);
        RAISE NOTICE '✅ Added email column to drivers table';
    ELSE
        RAISE NOTICE 'ℹ️  Email column already exists in drivers table';
    END IF;
END $$;

-- Add profile_photo_url column to drivers if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE drivers ADD COLUMN profile_photo_url TEXT;
        RAISE NOTICE '✅ Added profile_photo_url column to drivers table';
    ELSE
        RAISE NOTICE 'ℹ️  Profile_photo_url column already exists in drivers table';
    END IF;
END $$;

-- ============================================
-- DONE! ✅
-- Now you can run migration 007
-- ============================================
