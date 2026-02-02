-- Run Run Database Schema
-- PostgreSQL Database for Guinea-Bissau Ride Sharing Platform
-- Created: December 8, 2025
-- Developer: Edivaldo Cardoso

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS ride_locations CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS rides CASCADE;
DROP TABLE IF EXISTS driver_locations CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS passengers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;

-- Create ENUM types
CREATE TYPE user_type AS ENUM ('passenger', 'driver', 'admin');
CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'arrived', 'started', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('card', 'orange_money', 'mtn_momo');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE vehicle_type AS ENUM ('RunRun', 'Moto', 'Comfort', 'XL');
CREATE TYPE driver_status AS ENUM ('offline', 'online', 'busy');

-- ====================================
-- 1. Users Table (Base for all users)
-- ====================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    user_type user_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_type ON users(user_type);

-- ====================================
-- 2. Passengers Table
-- ====================================
CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    profile_photo_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    total_rides INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_passengers_user_id ON passengers(user_id);

-- ====================================
-- 3. Payment Methods Table
-- ====================================
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type payment_method NOT NULL,
    -- For card payments (Visa/Mastercard)
    card_token TEXT,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    cardholder_name VARCHAR(100),
    expiry_month INTEGER,
    expiry_year INTEGER,
    -- For mobile money (Orange Money, MTN)
    mobile_number VARCHAR(20),
    account_name VARCHAR(100),
    -- Management
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Constraints
    CONSTRAINT valid_card_payment CHECK (
        type != 'card' OR (
            card_token IS NOT NULL AND 
            card_last_four IS NOT NULL AND 
            card_brand IS NOT NULL AND
            expiry_month IS NOT NULL AND
            expiry_year IS NOT NULL
        )
    ),
    CONSTRAINT valid_mobile_payment CHECK (
        type = 'card' OR mobile_number IS NOT NULL
    )
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_active ON payment_methods(user_id, is_active);
CREATE INDEX idx_payment_methods_default ON payment_methods(user_id, is_default);

-- ====================================
-- 4. Vehicles Table
-- ====================================
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(30) NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);

-- ====================================
-- 4. Drivers Table
-- ====================================
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    profile_photo_url TEXT,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    status driver_status DEFAULT 'offline',
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    total_rides INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_vehicle_id ON drivers(vehicle_id);

-- ====================================
-- 5. Driver Locations Table (Real-time tracking)
-- ====================================
CREATE TABLE driver_locations (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    heading DECIMAL(5,2),
    speed DECIMAL(5,2),
    accuracy DECIMAL(5,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_timestamp ON driver_locations(timestamp);
CREATE INDEX idx_driver_locations_coords ON driver_locations(latitude, longitude);

-- ====================================
-- 6. Rides Table
-- ====================================
CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    
    -- Pickup information
    pickup_latitude DECIMAL(10,8) NOT NULL,
    pickup_longitude DECIMAL(11,8) NOT NULL,
    pickup_address TEXT NOT NULL,
    
    -- Dropoff information
    dropoff_latitude DECIMAL(10,8) NOT NULL,
    dropoff_longitude DECIMAL(11,8) NOT NULL,
    dropoff_address TEXT NOT NULL,
    
    -- Additional stops (JSON array)
    additional_stops JSONB,
    
    -- Ride details
    vehicle_type vehicle_type NOT NULL,
    status ride_status DEFAULT 'requested',
    
    -- Distance and duration
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
    
    -- Cancellation info
    cancelled_by VARCHAR(20),
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rides_passenger_id ON rides(passenger_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at);

-- ====================================
-- 7. Ride Locations Table (Track ride path)
-- ====================================
CREATE TABLE ride_locations (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ride_locations_ride_id ON ride_locations(ride_id);

-- ====================================
-- 8. Payments Table
-- ====================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER UNIQUE NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    
    -- Commission breakdown
    platform_commission DECIMAL(10,2),
    driver_earnings DECIMAL(10,2),
    
    -- External payment reference
    transaction_id VARCHAR(100) UNIQUE,
    external_payment_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Error info
    error_message TEXT
);

CREATE INDEX idx_payments_ride_id ON payments(ride_id);
CREATE INDEX idx_payments_passenger_id ON payments(passenger_id);
CREATE INDEX idx_payments_driver_id ON payments(driver_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- ====================================
-- 9. Ratings Table
-- ====================================
CREATE TABLE ratings (
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

CREATE INDEX idx_ratings_ride_id ON ratings(ride_id);

-- ====================================
-- Trigger to update updated_at timestamps
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_passengers_updated_at BEFORE UPDATE ON passengers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- Insert sample admin user
-- ====================================
INSERT INTO users (phone_number, user_type) VALUES ('+245955000000', 'admin');

-- ====================================
-- Views for analytics
-- ====================================

-- Driver earnings summary
CREATE VIEW driver_earnings_summary AS
SELECT 
    d.id,
    d.name,
    d.total_rides,
    d.total_earnings,
    d.average_rating,
    COUNT(r.id) as completed_rides_count,
    COALESCE(SUM(p.driver_earnings), 0) as total_paid_earnings
FROM drivers d
LEFT JOIN rides r ON d.id = r.driver_id AND r.status = 'completed'
LEFT JOIN payments p ON r.id = p.ride_id AND p.status = 'completed'
GROUP BY d.id;

-- Platform statistics
CREATE VIEW platform_statistics AS
SELECT
    COUNT(DISTINCT r.id) as total_rides,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'completed') as completed_rides,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'cancelled') as cancelled_rides,
    COUNT(DISTINCT r.passenger_id) as total_passengers,
    COUNT(DISTINCT r.driver_id) as total_drivers,
    COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'completed'), 0) as total_revenue,
    COALESCE(SUM(p.platform_commission) FILTER (WHERE p.status = 'completed'), 0) as total_commission,
    COALESCE(SUM(p.driver_earnings) FILTER (WHERE p.status = 'completed'), 0) as total_driver_earnings
FROM rides r
LEFT JOIN payments p ON r.id = p.ride_id;

-- ====================================
-- Grant permissions (adjust as needed)
-- ====================================
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- ====================================
-- Success message
-- ====================================
SELECT 'Run Run database schema created successfully!' as message;
