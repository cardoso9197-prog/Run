-- Fix ALL Missing Tables (Safe - Won't Delete Existing Data)
-- Run this in Railway PostgreSQL console

-- Create ENUMs if they don't exist
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('card', 'orange_money', 'mtn_momo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'arrived', 'started', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ====================================
-- 1. Payment Methods Table
-- ====================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type payment_method NOT NULL,
    -- For card payments
    card_token TEXT,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    cardholder_name VARCHAR(100),
    expiry_month INTEGER,
    expiry_year INTEGER,
    -- For mobile money
    mobile_number VARCHAR(20),
    account_name VARCHAR(100),
    -- Management
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(user_id, is_active);

-- ====================================
-- 2. Rides Table
-- ====================================
CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    
    -- Pickup
    pickup_latitude DECIMAL(10,8) NOT NULL,
    pickup_longitude DECIMAL(11,8) NOT NULL,
    pickup_address TEXT NOT NULL,
    
    -- Dropoff
    dropoff_latitude DECIMAL(10,8) NOT NULL,
    dropoff_longitude DECIMAL(11,8) NOT NULL,
    dropoff_address TEXT NOT NULL,
    
    -- Additional stops
    additional_stops JSONB,
    
    -- Details
    vehicle_type vehicle_type NOT NULL,
    status ride_status DEFAULT 'requested',
    
    -- Distance
    estimated_distance_km DECIMAL(6,2),
    estimated_duration_minutes INTEGER,
    actual_distance_km DECIMAL(6,2),
    actual_duration_minutes INTEGER,
    
    -- Pricing
    estimated_fare DECIMAL(10,2),
    final_fare DECIMAL(10,2),
    surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    arrived_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- Cancellation
    cancelled_by VARCHAR(20),
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rides_passenger_id ON rides(passenger_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);

-- ====================================
-- 3. Ride Locations Table
-- ====================================
CREATE TABLE IF NOT EXISTS ride_locations (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ride_locations_ride_id ON ride_locations(ride_id);

-- ====================================
-- 4. Payments Table
-- ====================================
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER UNIQUE NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    
    -- Commission
    platform_commission DECIMAL(10,2),
    driver_earnings DECIMAL(10,2),
    
    -- External payment
    transaction_id VARCHAR(100) UNIQUE,
    external_payment_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_ride_id ON payments(ride_id);
CREATE INDEX IF NOT EXISTS idx_payments_passenger_id ON payments(passenger_id);

-- ====================================
-- 5. Ratings Table
-- ====================================
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER UNIQUE NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    
    -- Passenger rating of driver
    passenger_rating INTEGER CHECK (passenger_rating >= 1 AND passenger_rating <= 5),
    passenger_comment TEXT,
    passenger_rated_at TIMESTAMP,
    
    -- Driver rating of passenger
    driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
    driver_comment TEXT,
    driver_rated_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ratings_ride_id ON ratings(ride_id);

-- ====================================
-- 6. Driver Locations Table
-- ====================================
CREATE TABLE IF NOT EXISTS driver_locations (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    heading DECIMAL(5,2),
    speed DECIMAL(5,2),
    accuracy DECIMAL(5,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_timestamp ON driver_locations(timestamp);

-- ====================================
-- Verify All Tables
-- ====================================
SELECT 
    'users' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 'passengers', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'passengers') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'drivers', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'drivers') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'vehicles', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vehicles') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'payment_methods', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_methods') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'rides', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rides') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'ride_locations', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ride_locations') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'payments', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'ratings', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ratings') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'driver_locations', CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'driver_locations') THEN '✅ EXISTS' ELSE '❌ MISSING' END
ORDER BY table_name;
