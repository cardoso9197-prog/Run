-- ============================================
-- FIX: Make email nullable - SIMPLE VERSION
-- ============================================
-- Run this in DBeaver on Railway database
-- ============================================

-- Step 1: Make email nullable (ignore if already nullable)
DO $$ 
BEGIN
    ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
    RAISE NOTICE '✅ Email column is now nullable';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️ Email may already be nullable';
END $$;

-- Step 2: Clean up existing empty emails
UPDATE users 
SET email = NULL 
WHERE email = '' OR TRIM(email) = '';

UPDATE passengers 
SET email = NULL 
WHERE email = '' OR TRIM(email) = '';

UPDATE drivers 
SET email = NULL 
WHERE email = '' OR TRIM(email) = '';

-- Step 3: Create partial UNIQUE index (only applies to non-NULL values)
DROP INDEX IF EXISTS users_email_unique_idx;
CREATE UNIQUE INDEX users_email_unique_idx ON users (email) WHERE email IS NOT NULL;

-- Step 4: Verify results
DO $$
DECLARE
    users_null INTEGER;
    users_with_email INTEGER;
    index_exists BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO users_null FROM users WHERE email IS NULL;
    SELECT COUNT(*) INTO users_with_email FROM users WHERE email IS NOT NULL;
    
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'users_email_unique_idx'
    ) INTO index_exists;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ EMAIL FIX COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Users with NULL email: %', users_null;
    RAISE NOTICE 'Users with email: %', users_with_email;
    RAISE NOTICE 'Unique index created: %', index_exists;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Driver registration will now work!';
    RAISE NOTICE '========================================';
END $$;
