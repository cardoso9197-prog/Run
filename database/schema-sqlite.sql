-- Run Run Database Schema - SQLite Version
-- SQLite Database for Guinea-Bissau Ride Sharing Platform
-- Created: December 8, 2025
-- Developer: Edivaldo Cardoso

-- Drop existing tables if they exist
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS ride_locations;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS driver_locations;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;

-- ====================================
-- 1. Users Table (Base for all users)
-- ====================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK(user_type IN ('passenger', 'driver', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_type ON users(user_type);

-- ====================================
-- 2. Passengers Table
-- ====================================
CREATE TABLE passengers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    profile_photo_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    total_rides INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_passengers_user ON passengers(user_id);

-- ====================================
-- 3. Vehicles Table
-- ====================================
CREATE TABLE vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(30) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL CHECK(vehicle_type IN ('RunRun', 'Moto', 'Comfort', 'XL')),
    seats INTEGER NOT NULL DEFAULT 4,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_license ON vehicles(license_plate);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);

-- ====================================
-- 4. Drivers Table
-- ====================================
CREATE TABLE drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    profile_photo_url TEXT,
    license_number VARCHAR(50) NOT NULL,
    license_expiry DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'offline' CHECK(status IN ('offline', 'online', 'busy')),
    current_latitude DECIMAL(10,8),
    current_longitude DECIMAL(11,8),
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    total_rides INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drivers_user ON drivers(user_id);
CREATE INDEX idx_drivers_vehicle ON drivers(vehicle_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_location ON drivers(current_latitude, current_longitude);

-- ====================================
-- 5. Driver Locations (Real-time tracking)
-- ====================================
CREATE TABLE driver_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    heading DECIMAL(5,2),
    speed DECIMAL(5,2),
    accuracy DECIMAL(6,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_driver_locations_driver ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_timestamp ON driver_locations(timestamp);

-- ====================================
-- 6. Rides Table
-- ====================================
CREATE TABLE rides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    vehicle_type VARCHAR(20) NOT NULL CHECK(vehicle_type IN ('RunRun', 'Moto', 'Comfort', 'XL')),
    status VARCHAR(20) DEFAULT 'requested' CHECK(status IN ('requested', 'accepted', 'arrived', 'started', 'completed', 'cancelled')),
    pickup_latitude DECIMAL(10,8) NOT NULL,
    pickup_longitude DECIMAL(11,8) NOT NULL,
    pickup_address TEXT NOT NULL,
    dropoff_latitude DECIMAL(10,8) NOT NULL,
    dropoff_longitude DECIMAL(11,8) NOT NULL,
    dropoff_address TEXT NOT NULL,
    estimated_distance DECIMAL(8,2),
    estimated_duration INTEGER,
    estimated_fare DECIMAL(10,2) NOT NULL,
    actual_distance DECIMAL(8,2),
    actual_duration INTEGER,
    final_fare DECIMAL(10,2),
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20) CHECK(cancelled_by IN ('passenger', 'driver', 'system')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    arrived_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_rides_passenger ON rides(passenger_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_requested_at ON rides(requested_at);

-- ====================================
-- 7. Ride Locations (Route tracking)
-- ====================================
CREATE TABLE ride_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ride_locations_ride ON ride_locations(ride_id);
CREATE INDEX idx_ride_locations_timestamp ON ride_locations(timestamp);

-- ====================================
-- 8. Payments Table
-- ====================================
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ride_id INTEGER UNIQUE NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK(payment_method IN ('card', 'orange_money', 'mtn_momo')),
    status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(100) UNIQUE,
    driver_earnings DECIMAL(10,2),
    platform_fee DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    payment_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_payments_ride ON payments(ride_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ====================================
-- 9. Ratings Table
-- ====================================
CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ride_id, from_user_id, to_user_id)
);

CREATE INDEX idx_ratings_ride ON ratings(ride_id);
CREATE INDEX idx_ratings_to_user ON ratings(to_user_id);

-- ====================================
-- Views for Analytics
-- ====================================

-- Driver Earnings Summary View
CREATE VIEW driver_earnings_summary AS
SELECT 
    d.id as driver_id,
    d.name as driver_name,
    COUNT(r.id) as total_rides,
    SUM(CASE WHEN p.status = 'completed' THEN p.driver_earnings ELSE 0 END) as total_earnings,
    AVG(CASE WHEN r.status = 'completed' THEN rat.rating ELSE NULL END) as average_rating,
    d.status as current_status
FROM drivers d
LEFT JOIN rides r ON d.id = r.driver_id
LEFT JOIN payments p ON r.id = p.ride_id
LEFT JOIN ratings rat ON r.id = rat.ride_id AND rat.to_user_id = d.user_id
GROUP BY d.id, d.name, d.status;

-- Platform Statistics View
CREATE VIEW platform_statistics AS
SELECT 
    COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'passenger') as total_passengers,
    COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'driver') as total_drivers,
    COUNT(DISTINCT r.id) as total_rides,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'completed') as completed_rides,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'cancelled') as cancelled_rides,
    SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as total_revenue,
    SUM(CASE WHEN p.status = 'completed' THEN p.platform_fee ELSE 0 END) as total_platform_fees
FROM users u
LEFT JOIN rides r ON (u.user_type = 'passenger' AND u.id IN (SELECT user_id FROM passengers WHERE id = r.passenger_id))
    OR (u.user_type = 'driver' AND u.id IN (SELECT user_id FROM drivers WHERE id = r.driver_id))
LEFT JOIN payments p ON r.id = p.ride_id;

-- Insert some test data for development
-- Test users
INSERT INTO users (phone_number, user_type) VALUES 
    ('+245955123456', 'driver'),
    ('+245955123457', 'passenger'),
    ('+245955123458', 'passenger');

-- Test passenger
INSERT INTO passengers (user_id, name, email) VALUES 
    (2, 'Test Passenger', 'passenger@runrun.gw'),
    (3, 'Another Passenger', 'passenger2@runrun.gw');

-- Test vehicle
INSERT INTO vehicles (make, model, year, license_plate, color, vehicle_type, seats) VALUES 
    ('Toyota', 'Corolla', 2020, 'GB-1234-AB', 'White', 'RunRun', 4);

-- Test driver
INSERT INTO drivers (user_id, vehicle_id, name, email, license_number, license_expiry, status, is_verified) VALUES 
    (1, 1, 'Test Driver', 'driver@runrun.gw', 'DL123456', '2026-12-31', 'online', 1);
