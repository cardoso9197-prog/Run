-- Migration to add missing columns for rides and payments tables

-- Add vehicle_type and estimated_fare to rides table
ALTER TABLE rides 
ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS estimated_fare NUMERIC(10,2);

-- Add driver_earnings, platform_commission, and amount to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS driver_earnings NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS platform_commission NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2);
