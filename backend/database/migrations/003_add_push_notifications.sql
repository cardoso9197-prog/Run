-- Add push notification token columns to drivers table
-- Run this migration on your PostgreSQL database

ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS push_token TEXT,
ADD COLUMN IF NOT EXISTS push_platform VARCHAR(20),
ADD COLUMN IF NOT EXISTS push_token_updated_at TIMESTAMP;

-- Create index for faster lookup of online drivers with push tokens
CREATE INDEX IF NOT EXISTS idx_drivers_push_token ON drivers(push_token) WHERE push_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_drivers_status_push ON drivers(status, push_token) WHERE status = 'online';

-- Display message
SELECT 'Push notification columns added to drivers table successfully' AS message;
