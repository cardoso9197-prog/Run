-- ============================================
-- VERIFY RAILWAY MIGRATION SUCCESS
-- ============================================
-- Run this to confirm columns were added

-- 1. Check passengers table structure
SELECT 
    'PASSENGERS TABLE' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'passengers' 
ORDER BY ordinal_position;

-- 2. Check drivers table structure
SELECT 
    'DRIVERS TABLE' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'drivers' 
ORDER BY ordinal_position;

-- 3. Check if ratings table exists
SELECT 
    'RATINGS TABLE' as status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ratings')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as result;

-- 4. Count data
SELECT 
    'DATA SUMMARY' as status,
    (SELECT COUNT(*) FROM passengers WHERE name IS NOT NULL) as passengers_with_names,
    (SELECT COUNT(*) FROM drivers WHERE name IS NOT NULL) as drivers_with_names,
    (SELECT COUNT(*) FROM passengers) as total_passengers,
    (SELECT COUNT(*) FROM drivers) as total_drivers;
