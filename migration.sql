-- Driver Activation System Migration
-- Run this in Railway's PostgreSQL Query tab

-- Step 1: Check if columns already exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'drivers' 
AND column_name IN ('is_activated', 'verified_by', 'verification_date', 'verification_notes');

-- Step 2: Add activation columns to drivers table
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS is_activated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Step 3: Auto-activate existing drivers (they're already working)
UPDATE drivers 
SET is_activated = TRUE 
WHERE created_at < NOW() AND is_activated IS NULL OR is_activated = FALSE;

-- Step 4: Verify the changes
SELECT 
    id, 
    phone_number, 
    is_activated, 
    verified_by, 
    verification_date,
    created_at
FROM drivers 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 5: Check activation statistics
SELECT 
    COUNT(*) as total_drivers,
    SUM(CASE WHEN is_activated = TRUE THEN 1 ELSE 0 END) as activated_drivers,
    SUM(CASE WHEN is_activated = FALSE OR is_activated IS NULL THEN 1 ELSE 0 END) as pending_drivers
FROM drivers;
