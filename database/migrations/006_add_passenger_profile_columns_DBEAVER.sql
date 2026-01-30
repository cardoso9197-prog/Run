-- ============================================
-- PASSENGER PROFILE FIX - DBeaver Version
-- ============================================
-- Date: December 22, 2024
-- Instructions: 
-- 1. Select ALL lines (Ctrl+A)
-- 2. Right-click → Execute → Execute SQL Script (Alt+X)
-- OR click "Execute SQL Script" button (not "Execute SQL Statement")
-- ============================================

-- Add name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'name'
    ) THEN
        ALTER TABLE passengers ADD COLUMN name VARCHAR(100);
        RAISE NOTICE 'Added name column to passengers table';
        
        UPDATE passengers 
        SET name = 'Passenger ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE passengers.user_id = u.id AND passengers.name IS NULL;
        RAISE NOTICE 'Set default names for existing passengers';
        
        ALTER TABLE passengers ALTER COLUMN name SET NOT NULL;
        RAISE NOTICE 'Made name column NOT NULL';
    ELSE
        RAISE NOTICE 'Name column already exists in passengers table';
    END IF;
END $$;

-- Add email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'email'
    ) THEN
        ALTER TABLE passengers ADD COLUMN email VARCHAR(100);
        RAISE NOTICE 'Added email column to passengers table';
    ELSE
        RAISE NOTICE 'Email column already exists in passengers table';
    END IF;
END $$;

-- Add profile_photo_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE passengers ADD COLUMN profile_photo_url TEXT;
        RAISE NOTICE 'Added profile_photo_url column to passengers table';
    ELSE
        RAISE NOTICE 'Profile_photo_url column already exists in passengers table';
    END IF;
END $$;
