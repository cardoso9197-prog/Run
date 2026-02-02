const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:kYEyWinKbVmVhRMxIOqFPxhhkVnykISt@junction.proxy.rlwy.net:13699/railway',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log(' Running migration: 002_create_rides_tables.sql');
    const sql = fs.readFileSync(path.join(__dirname, 'database', 'migrations', '002_create_rides_tables.sql'), 'utf8');
    
    await pool.query(sql);
    
    console.log(' Migration completed successfully!');
    console.log(' Created tables: rides, driver_locations, ride_ratings, fare_config');
    console.log(' Created indexes for performance');
    console.log(' Inserted default fare configuration');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error(' Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
