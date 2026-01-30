/**
 * Run Run - PostgreSQL Database Schema
 * Creates all tables for the ride sharing platform
 * Office: Run Run Team
 * Email: suporte@runrungb.com
 */

const { pool } = require('./db-postgres');

const schema = `
-- Users table (both passengers and drivers)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('passenger', 'driver')),
  profile_image TEXT,
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table (additional driver information)
CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50) NOT NULL,
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  vehicle_color VARCHAR(50),
  license_plate VARCHAR(50) UNIQUE NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  vehicle_image TEXT,
  license_image TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT false,
  current_latitude DECIMAL(10,8),
  current_longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passengers table (additional passenger information)
CREATE TABLE IF NOT EXISTS passengers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  home_address TEXT,
  work_address TEXT,
  payment_method VARCHAR(50) DEFAULT 'cash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
  id SERIAL PRIMARY KEY,
  passenger_id INTEGER NOT NULL REFERENCES users(id),
  driver_id INTEGER REFERENCES users(id),
  pickup_latitude DECIMAL(10,8) NOT NULL,
  pickup_longitude DECIMAL(11,8) NOT NULL,
  pickup_address TEXT NOT NULL,
  dropoff_latitude DECIMAL(10,8) NOT NULL,
  dropoff_longitude DECIMAL(11,8) NOT NULL,
  dropoff_address TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'picked_up', 'completed', 'cancelled')),
  fare DECIMAL(10,2),
  base_fare DECIMAL(10,2),
  surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
  red_zone_surge BOOLEAN DEFAULT false,
  road_condition VARCHAR(50),
  distance_km DECIMAL(10,2),
  duration_minutes INTEGER,
  payment_method VARCHAR(50) DEFAULT 'cash',
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  ride_id INTEGER UNIQUE NOT NULL REFERENCES rides(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  payment_gateway VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_ride_id INTEGER REFERENCES rides(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver locations table (for tracking)
CREATE TABLE IF NOT EXISTS driver_locations (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  heading DECIMAL(5,2),
  speed DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_available ON drivers(is_available);
CREATE INDEX IF NOT EXISTS idx_passengers_user_id ON passengers(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_passenger ON rides(passenger_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_payments_ride ON payments(ride_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_driver ON driver_locations(driver_id);
`;

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting PostgreSQL database initialization...\n');
    
    // Execute the schema
    await client.query(schema);
    
    console.log('✅ Database schema created successfully!');
    console.log('\n📊 Created tables:');
    console.log('   • users');
    console.log('   • drivers');
    console.log('   • passengers');
    console.log('   • rides');
    console.log('   • payments');
    console.log('   • notifications');
    console.log('   • driver_locations');
    
    console.log('\n✅ Created indexes for performance optimization');
    
    // Verify tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n✅ Verified tables in database:');
    result.rows.forEach(row => {
      console.log(`   • ${row.table_name}`);
    });
    
    console.log('\n🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
