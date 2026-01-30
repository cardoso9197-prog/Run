-- ============================================
-- FIX: Make email column nullable in users table
-- ============================================
-- Problem: email has NOT NULL constraint but drivers may not have email
-- Solution: Remove NOT NULL constraint and handle duplicates
-- ============================================

-- Step 1: Remove UNIQUE constraint temporarily (we'll recreate it as partial)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Step 2: Make email column nullable
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Step 3: Update existing empty emails to NULL
UPDATE users 
SET email = NULL 
WHERE email = '' OR TRIM(email) = '';

UPDATE passengers 
SET email = NULL 
WHERE email = '' OR TRIM(email) = '';

UPDATE drivers 
SET email = NULL 
WHERE email = '' OR TRIM(email) = '';

-- Step 4: Create partial UNIQUE constraint (only for non-NULL emails)
-- This allows multiple NULL values but ensures actual emails are unique
CREATE UNIQUE INDEX users_email_unique_idx ON users (email) WHERE email IS NOT NULL;

-- Step 5: Verify the fix
DO $$
DECLARE
    users_null_email INTEGER;
    users_with_email INTEGER;
    constraint_exists BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO users_null_email FROM users WHERE email IS NULL;
    SELECT COUNT(*) INTO users_with_email FROM users WHERE email IS NOT NULL;
    
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'users_email_unique_idx'
    ) INTO constraint_exists;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ EMAIL CONSTRAINT FIX COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Users with NULL email: %', users_null_email;
    RAISE NOTICE 'Users with email: %', users_with_email;
    RAISE NOTICE 'Partial unique index created: %', constraint_exists;
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- ✅ DONE! Now driver registration will work
-- ============================================
