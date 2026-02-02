/**
 * Run Migration 006: Add Passenger Profile Columns
 * Adds name, email, and profile_photo_url columns to passengers table
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔗 Connecting to Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read migration file
    const migrationPath = path.join(__dirname, 'database', 'migrations', '006_add_passenger_profile_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Running migration 006_add_passenger_profile_columns.sql...\n');
    
    // Execute migration
    const result = await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!\n');
    
    // Check current passengers table structure
    console.log('📋 Checking passengers table structure...');
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'passengers'
      ORDER BY ordinal_position;
    `);
    
    console.log('\nPassengers table columns:');
    console.table(columnsResult.rows);

    // Check sample data
    console.log('\n📊 Sample passenger data:');
    const sampleResult = await client.query(`
      SELECT id, user_id, name, email, profile_photo_url, created_at
      FROM passengers
      LIMIT 3;
    `);
    console.table(sampleResult.rows);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run migration
runMigration()
  .then(() => {
    console.log('\n✅ All done! Passengers can now update their profiles.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  });
