-- Migration: Add name column to passengers table if it doesn't exist
-- Date: 2024-12-22
-- Description: Some passenger profiles may have been created without the name column

-- Add name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'name'
    ) THEN
        ALTER TABLE passengers ADD COLUMN name VARCHAR(100);
        
        -- Set default name from phone number for existing passengers
        UPDATE passengers 
        SET name = 'Passenger ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE passengers.user_id = u.id AND passengers.name IS NULL;
        
        -- Make it NOT NULL after setting defaults
        ALTER TABLE passengers ALTER COLUMN name SET NOT NULL;
        
        RAISE NOTICE 'Added name column to passengers table';
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
