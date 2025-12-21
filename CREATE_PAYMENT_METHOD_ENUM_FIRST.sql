-- Step 1: Create payment_method ENUM (REQUIRED FIRST!)
-- This must be run BEFORE creating the withdrawals table

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('orange_money', 'mtn_momo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify it was created
SELECT typname, typcategory 
FROM pg_type 
WHERE typname = 'payment_method';

-- Expected result:
-- typname         | typcategory
-- ----------------+------------
-- payment_method  | E
