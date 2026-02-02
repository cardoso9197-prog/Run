-- Migration: Fix driver balance columns for withdrawals
-- Date: December 20, 2025
-- Purpose: Ensure balance columns exist and are initialized

-- ====================================
-- STEP 1: Check if columns exist
-- ====================================
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'drivers' 
  AND column_name IN ('total_earnings', 'available_balance', 'pending_withdrawals')
ORDER BY column_name;

-- ====================================
-- STEP 2: Add missing columns (if needed)
-- ====================================
DO $$ 
BEGIN
    -- Add total_earnings if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'total_earnings'
    ) THEN
        ALTER TABLE drivers ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE '✅ total_earnings column added';
    END IF;
    
    -- Add available_balance if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'available_balance'
    ) THEN
        ALTER TABLE drivers ADD COLUMN available_balance DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE '✅ available_balance column added';
    END IF;
    
    -- Add pending_withdrawals if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'pending_withdrawals'
    ) THEN
        ALTER TABLE drivers ADD COLUMN pending_withdrawals DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE '✅ pending_withdrawals column added';
    END IF;
END $$;

-- ====================================
-- STEP 3: Initialize NULL values to 0
-- ====================================
UPDATE drivers 
SET 
    total_earnings = COALESCE(total_earnings, 0),
    available_balance = COALESCE(available_balance, 0),
    pending_withdrawals = COALESCE(pending_withdrawals, 0)
WHERE total_earnings IS NULL 
   OR available_balance IS NULL 
   OR pending_withdrawals IS NULL;

-- ====================================
-- STEP 4: Verify the fix
-- ====================================
-- Note: Run this query AFTER columns are added
-- Copy and paste separately if needed:
/*
SELECT 
    d.id,
    u.name,
    d.total_earnings,
    d.available_balance,
    d.pending_withdrawals,
    CASE 
        WHEN d.total_earnings IS NOT NULL 
         AND d.available_balance IS NOT NULL 
         AND d.pending_withdrawals IS NOT NULL THEN '✅ OK'
        ELSE '❌ NULL VALUES'
    END as status
FROM drivers d
JOIN users u ON d.user_id = u.id;
*/
