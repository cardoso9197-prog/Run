-- Migration: Add status column to drivers table
-- Date: December 20, 2025
-- Purpose: Allow drivers to go online/offline in the app

-- ====================================
-- STEP 1: Check what columns exist
-- ====================================
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'drivers' 
ORDER BY ordinal_position;

-- ====================================
-- STEP 2: Add Status Column (if not exists)
-- ====================================
DO $$ 
BEGIN
    -- Check if status column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'status'
    ) THEN
        -- Add status column with default 'offline'
        ALTER TABLE drivers ADD COLUMN status VARCHAR(20) DEFAULT 'offline';
        
        -- Add check constraint
        ALTER TABLE drivers ADD CONSTRAINT drivers_status_check 
            CHECK (status IN ('online', 'offline', 'busy'));
        
        -- Create index for faster queries
        CREATE INDEX idx_drivers_status ON drivers(status);
        
        RAISE NOTICE '✅ Status column added successfully';
    ELSE
        RAISE NOTICE '⚠️ Status column already exists';
    END IF;
END $$;

-- ====================================
-- STEP 3: Verification Query
-- ====================================
SELECT 
    column_name, 
    data_type, 
    column_default,
    CASE 
        WHEN column_default IS NOT NULL THEN '✅ Column exists with default'
        ELSE '✅ Column exists'
    END as column_status
FROM information_schema.columns 
WHERE table_name = 'drivers' AND column_name = 'status';

-- ====================================
-- STEP 4: Check Current Drivers
-- ====================================
-- Note: Run this query AFTER the column is added
-- Copy and paste this separately if needed:
/*
SELECT 
    d.id, 
    u.name, 
    d.status, 
    d.is_verified,
    d.is_available,
    CASE 
        WHEN d.is_available = true AND d.status = 'online' THEN '🟢 ONLINE & AVAILABLE'
        WHEN d.is_available = true AND d.status = 'offline' THEN '🟡 OFFLINE & AVAILABLE'
        WHEN d.is_available = false THEN '🔴 NOT AVAILABLE'
        ELSE '⚪ UNKNOWN'
    END as driver_state
FROM drivers d
JOIN users u ON d.user_id = u.id;
*/
