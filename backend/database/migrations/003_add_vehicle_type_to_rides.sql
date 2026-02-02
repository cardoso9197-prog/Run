-- Migration: Add vehicle_type column to rides table
ALTER TABLE rides
ADD COLUMN vehicle_type VARCHAR(50);
