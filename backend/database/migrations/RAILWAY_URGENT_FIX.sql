-- ============================================
-- RUN THIS ON RAILWAY DATABASE - URGENT
-- ============================================
-- Date: December 22, 2024
-- Purpose: Add ALL missing columns and tables
-- Instructions: Copy and paste this into Railway Query tab
-- ============================================

-- PART 1: Add name column to PASSENGERS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'name'
    ) THEN
        ALTER TABLE passengers ADD COLUMN name VARCHAR(100);
        RAISE NOTICE '✅ Added name column to passengers';
        
        UPDATE passengers 
        SET name = u.name
        FROM users u
        WHERE passengers.user_id = u.id;
        
        UPDATE passengers 
        SET name = 'Passenger ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE passengers.user_id = u.id AND (passengers.name IS NULL OR passengers.name = '');
        
        ALTER TABLE passengers ALTER COLUMN name SET NOT NULL;
        RAISE NOTICE '✅ Made passengers.name NOT NULL';
    END IF;
END $$;

-- PART 2: Add email to PASSENGERS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'email'
    ) THEN
        ALTER TABLE passengers ADD COLUMN email VARCHAR(100);
        RAISE NOTICE '✅ Added email to passengers';
    END IF;
END $$;

-- PART 3: Add profile_photo_url to PASSENGERS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'passengers' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE passengers ADD COLUMN profile_photo_url TEXT;
        RAISE NOTICE '✅ Added profile_photo_url to passengers';
    END IF;
END $$;

-- PART 4: Add name column to DRIVERS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'name'
    ) THEN
        ALTER TABLE drivers ADD COLUMN name VARCHAR(100);
        RAISE NOTICE '✅ Added name column to drivers';
        
        UPDATE drivers 
        SET name = u.name
        FROM users u
        WHERE drivers.user_id = u.id;
        
        UPDATE drivers 
        SET name = 'Driver ' || SUBSTRING(u.phone FROM 1 FOR 4)
        FROM users u
        WHERE drivers.user_id = u.id AND (drivers.name IS NULL OR drivers.name = '');
        
        ALTER TABLE drivers ALTER COLUMN name SET NOT NULL;
        RAISE NOTICE '✅ Made drivers.name NOT NULL';
    END IF;
END $$;

-- PART 5: Add email to DRIVERS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'email'
    ) THEN
        ALTER TABLE drivers ADD COLUMN email VARCHAR(100);
        RAISE NOTICE '✅ Added email to drivers';
    END IF;
END $$;

-- PART 6: Add profile_photo_url to DRIVERS
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE drivers ADD COLUMN profile_photo_url TEXT;
        RAISE NOTICE '✅ Added profile_photo_url to drivers';
    END IF;
END $$;

-- PART 7: Create ratings table if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'ratings'
    ) THEN
        CREATE TABLE ratings (
            id SERIAL PRIMARY KEY,
            ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
            passenger_id INTEGER REFERENCES passengers(id) ON DELETE SET NULL,
            driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
            passenger_rating INTEGER CHECK (passenger_rating BETWEEN 1 AND 5),
            driver_rating INTEGER CHECK (driver_rating BETWEEN 1 AND 5),
            passenger_comment TEXT,
            driver_comment TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX idx_ratings_ride ON ratings(ride_id);
        CREATE INDEX idx_ratings_passenger ON ratings(passenger_id);
        CREATE INDEX idx_ratings_driver ON ratings(driver_id);
        
        RAISE NOTICE '✅ Created ratings table';
    END IF;
END $$;

-- PART 8: Show final status
DO $$
DECLARE
    passenger_count INTEGER;
    driver_count INTEGER;
    ratings_exists BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO passenger_count FROM passengers WHERE name IS NOT NULL;
    SELECT COUNT(*) INTO driver_count FROM drivers WHERE name IS NOT NULL;
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'ratings'
    ) INTO ratings_exists;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ RAILWAY MIGRATION COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Passengers with names: %', passenger_count;
    RAISE NOTICE 'Drivers with names: %', driver_count;
    RAISE NOTICE 'Ratings table exists: %', ratings_exists;
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- ✅ DONE! Now test the apps again
-- ============================================
