-- Fix Missing Vehicles Table
-- Run this directly in Railway PostgreSQL console

-- Step 1: Create vehicle_type ENUM if it doesn't exist
DO $$ BEGIN
    CREATE TYPE vehicle_type AS ENUM ('RunRun', 'Moto', 'Comfort', 'XL');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'vehicle_type ENUM already exists, skipping...';
END $$;

-- Step 2: Create vehicles table if it doesn't exist
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

-- Step 3: Create index
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON vehicles(license_plate);

-- Step 4: Add vehicle_id column to drivers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'vehicle_id'
    ) THEN
        ALTER TABLE drivers 
        ADD COLUMN vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL;
        
        CREATE INDEX idx_drivers_vehicle_id ON drivers(vehicle_id);
        
        RAISE NOTICE 'vehicle_id column added to drivers table';
    ELSE
        RAISE NOTICE 'vehicle_id column already exists in drivers table';
    END IF;
END $$;

-- Verify the fix
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
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
    'vehicle_type enum', 
    CASE WHEN EXISTS (
        SELECT FROM pg_type WHERE typname = 'vehicle_type'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END;
