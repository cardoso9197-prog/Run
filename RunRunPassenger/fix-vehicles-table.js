/**
 * Fix Missing Vehicles Table
 * Creates the vehicles table if it doesn't exist
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixVehiclesTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Checking vehicles table...');
    
    // Check if vehicles table exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'vehicles'
      );
    `);
    
    if (checkTable.rows[0].exists) {
      console.log('✅ Vehicles table already exists!');
      return;
    }
    
    console.log('⚠️  Vehicles table missing. Creating now...');
    
    // Create vehicle_type ENUM if it doesn't exist
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE vehicle_type AS ENUM ('RunRun', 'Moto', 'Comfort', 'XL');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    // Create vehicles table
    await client.query(`
      CREATE TABLE vehicles (
        id SERIAL PRIMARY KEY,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INTEGER,
        color VARCHAR(30),
        license_plate VARCHAR(20) UNIQUE NOT NULL,
        vehicle_type vehicle_type NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
    `);
    
    console.log('✅ Vehicles table created successfully!');
    
    // Check if drivers table has vehicle_id column
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'drivers' AND column_name = 'vehicle_id';
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('⚠️  Adding vehicle_id column to drivers table...');
      await client.query(`
        ALTER TABLE drivers 
        ADD COLUMN vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL;
      `);
      await client.query(`
        CREATE INDEX idx_drivers_vehicle_id ON drivers(vehicle_id);
      `);
      console.log('✅ vehicle_id column added to drivers table!');
    }
    
    console.log('\n🎉 Database schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing vehicles table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixVehiclesTable()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
