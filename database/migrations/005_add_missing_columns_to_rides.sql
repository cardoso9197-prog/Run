-- Migration: Add all missing columns to rides and payments tables and update status constraint

ALTER TABLE rides ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(50);
ALTER TABLE rides ADD COLUMN IF NOT EXISTS estimated_fare NUMERIC;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS estimated_distance_km NUMERIC;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS estimated_duration_minutes NUMERIC;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS additional_stops INTEGER;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS commission NUMERIC DEFAULT 0.20;

ALTER TABLE payments ADD COLUMN IF NOT EXISTS driver_earnings NUMERIC;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS platform_commission NUMERIC;

DO $$
BEGIN
  BEGIN
    ALTER TABLE rides DROP CONSTRAINT rides_status_check;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
  BEGIN
    ALTER TABLE rides ADD CONSTRAINT rides_status_check CHECK (
      status IN ('requested', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled')
    );
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
END$$;
