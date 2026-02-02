-- ============================================
-- FIX: Empty email constraint violation
-- ============================================
-- Problem: Empty string emails violate UNIQUE constraint
-- Solution: Convert empty strings to NULL
-- ============================================

-- Step 1: Update existing empty emails to NULL in users table
UPDATE users 
SET email = NULL 
WHERE email = '' OR email IS NULL OR TRIM(email) = '';

-- Step 2: Update existing empty emails to NULL in passengers table
UPDATE passengers 
SET email = NULL 
WHERE email = '' OR email IS NULL OR TRIM(email) = '';

-- Step 3: Update existing empty emails to NULL in drivers table
UPDATE drivers 
SET email = NULL 
WHERE email = '' OR email IS NULL OR TRIM(email) = '';

-- Step 4: Verify the fix
SELECT 
    'Users with NULL email' as description,
    COUNT(*) as count
FROM users 
WHERE email IS NULL;

SELECT 
    'Users with email' as description,
    COUNT(*) as count
FROM users 
WHERE email IS NOT NULL AND email != '';

-- ============================================
-- ✅ DONE! Now driver registration will work
-- ============================================
