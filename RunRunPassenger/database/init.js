/**
 * Run Run - Database Initialization Script
 * Sets up the PostgreSQL database and creates all tables
 * Developer: Edivaldo Cardoso
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');

  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📖 Reading schema.sql...');

    // Execute the schema
    await pool.query(schemaSql);

    console.log('✅ Database schema created successfully!');
    console.log('\n📊 Tables created:');
    console.log('  - users');
    console.log('  - passengers');
    console.log('  - vehicles');
    console.log('  - drivers');
    console.log('  - driver_locations');
    console.log('  - rides');
    console.log('  - ride_locations');
    console.log('  - payments');
    console.log('  - ratings');
    console.log('\n📈 Views created:');
    console.log('  - driver_earnings_summary');
    console.log('  - platform_statistics');
    console.log('\n🎉 Database initialization completed!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
