-- Migration: Create Rides System Tables
-- Date: December 15, 2025
-- Description: Tables for ride booking, tracking, and rating system

-- Table: rides
-- Purpose: Store all ride requests and their lifecycle
CREATE TABLE IF NOT EXISTS rides (
  id SERIAL PRIMARY KEY,
  passenger_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Pickup location
  pickup_latitude DECIMAL(10, 8) NOT NULL,
  pickup_longitude DECIMAL(11, 8) NOT NULL,
  pickup_address TEXT NOT NULL,
  
  -- Dropoff location
  dropoff_latitude DECIMAL(10, 8) NOT NULL,
  dropoff_longitude DECIMAL(11, 8) NOT NULL,
  dropoff_address TEXT NOT NULL,
  
  -- Fare and distance
  estimated_fare DECIMAL(10, 2) NOT NULL,
  final_fare DECIMAL(10, 2),
  distance_km DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER,
  
  -- Ride status
  -- Status flow: requested -> accepted -> arrived -> picked_up -> in_progress -> completed
  -- Can be cancelled at any point before completion
  status VARCHAR(50) NOT NULL DEFAULT 'requested',
  
  -- Timestamps for ride lifecycle
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMP,
  arrived_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Cancellation info
  cancelled_by VARCHAR(50), -- 'passenger' or 'driver'
  cancellation_reason TEXT,
  
  -- Payment info
  payment_method VARCHAR(50) DEFAULT 'cash', -- cash, card, mobile_money
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, refunded
  
  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: driver_locations
-- Purpose: Track real-time driver locations for matching and tracking
CREATE TABLE IF NOT EXISTS driver_locations (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Current location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Direction and speed
  heading DECIMAL(5, 2), -- Degrees (0-360)
  speed_kmh DECIMAL(5, 2), -- Speed in km/h
  
  -- Availability status
  is_online BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true, -- false when on active ride
  
  -- Current ride (if any)
  current_ride_id INTEGER REFERENCES rides(id) ON DELETE SET NULL,
  
  -- Timestamps
  last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: ride_ratings
-- Purpose: Store ratings and feedback for completed rides
CREATE TABLE IF NOT EXISTS ride_ratings (
  id SERIAL PRIMARY KEY,
  ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE UNIQUE,
  
  -- Ratings (1-5 stars)
  passenger_rating INTEGER CHECK (passenger_rating BETWEEN 1 AND 5),
  driver_rating INTEGER CHECK (driver_rating BETWEEN 1 AND 5),
  
  -- Comments
  passenger_comment TEXT,
  driver_comment TEXT,
  
  -- Issues/complaints
  passenger_issues TEXT[], -- Array of issue tags
  driver_issues TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: fare_config
-- Purpose: Store dynamic fare calculation parameters
CREATE TABLE IF NOT EXISTS fare_config (
  id SERIAL PRIMARY KEY,
  
  -- Base fare
  base_fare DECIMAL(10, 2) NOT NULL DEFAULT 50.00, -- Base fare in local currency (CFA Franc)
  
  -- Per kilometer rate
  per_km_rate DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
  
  -- Per minute rate (for waiting time)
  per_minute_rate DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
  
  -- Surge pricing
  surge_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.00, -- 1.0 = normal, 1.5 = 50% surge
  surge_active BOOLEAN NOT NULL DEFAULT false,
  
  -- Minimum fare
  minimum_fare DECIMAL(10, 2) NOT NULL DEFAULT 200.00,
  
  -- Maximum fare (safety limit)
  maximum_fare DECIMAL(10, 2) NOT NULL DEFAULT 50000.00,
  
  -- Service fee (platform commission)
  service_fee_percentage DECIMAL(5, 2) NOT NULL DEFAULT 20.00, -- 20%
  
  -- Active/inactive
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default fare configuration
INSERT INTO fare_config (base_fare, per_km_rate, per_minute_rate, minimum_fare, service_fee_percentage)
VALUES (50.00, 100.00, 10.00, 200.00, 20.00)
ON CONFLICT DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rides_passenger ON rides(passenger_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_requested_at ON rides(requested_at);
CREATE INDEX IF NOT EXISTS idx_driver_locations_online ON driver_locations(is_online, is_available);
CREATE INDEX IF NOT EXISTS idx_driver_locations_location ON driver_locations(latitude, longitude);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fare_config_updated_at BEFORE UPDATE ON fare_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE rides IS 'Stores all ride requests and their complete lifecycle from request to completion';
COMMENT ON TABLE driver_locations IS 'Real-time location tracking for online drivers';
COMMENT ON TABLE ride_ratings IS 'Post-ride ratings and feedback from both passengers and drivers';
COMMENT ON TABLE fare_config IS 'Dynamic fare calculation parameters and pricing configuration';
