-- Add email column to drivers table
DO $$ 
BEGIN
    -- Add email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'email'
    ) THEN
        ALTER TABLE drivers ADD COLUMN email VARCHAR(255);
        RAISE NOTICE '✅ email column added';
    ELSE
        RAISE NOTICE 'ℹ️  email column already exists';
    END IF;
END $$;

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'drivers' AND column_name = 'email';
