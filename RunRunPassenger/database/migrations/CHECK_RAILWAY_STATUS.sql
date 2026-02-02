-- ============================================
-- CHECK RAILWAY DATABASE STATUS
-- ============================================
-- Run this in DBeaver connected to Railway to verify migration status

-- Check if name column exists in passengers
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'passengers' 
ORDER BY ordinal_position;

-- Check if name column exists in drivers
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'drivers' 
ORDER BY ordinal_position;

-- Check if ratings table exists
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'ratings'
) AS ratings_table_exists;

-- Count passengers with names
SELECT COUNT(*) as passengers_with_names FROM passengers WHERE name IS NOT NULL;

-- Count drivers with names
SELECT COUNT(*) as drivers_with_names FROM drivers WHERE name IS NOT NULL;
