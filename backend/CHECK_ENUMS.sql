-- ====================================
-- STEP 1: Check what ENUM types exist
-- Run this FIRST to see what's already there
-- ====================================

SELECT typname, typcategory 
FROM pg_type 
WHERE typcategory = 'E'
ORDER BY typname;

-- Expected types we need:
-- - payment_method
-- - withdrawal_status  
-- - withdrawal_frequency
