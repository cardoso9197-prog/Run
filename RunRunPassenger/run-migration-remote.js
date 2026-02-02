// Simple Remote Migration Script
// This connects to Railway PostgreSQL and runs the migration

require('dotenv').config();
const { Pool } = require('pg');

// Railway DATABASE_URL (you'll need to get this from Railway dashboard)
const DATABASE_URL = process.env.DATABASE_URL || 'YOUR_RAILWAY_DATABASE_URL_HERE';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  console.log('\n🚀 Starting Driver Activation Migration...\n');
  
  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Connected to database successfully!\n');
    
    // Step 1: Check if columns already exist
    console.log('🔍 Checking if columns exist...');
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'drivers' 
      AND column_name IN ('is_activated', 'verified_by', 'verification_date', 'verification_notes')
    `);
    
    if (checkColumns.rows.length > 0) {
      console.log('⚠️  Some columns already exist:', checkColumns.rows.map(r => r.column_name).join(', '));
      console.log('   Will use ALTER TABLE IF NOT EXISTS to safely add missing columns.\n');
    }
    
    // Step 2: Add activation columns
    console.log('📝 Adding activation columns to drivers table...');
    await pool.query(`
      ALTER TABLE drivers 
      ADD COLUMN IF NOT EXISTS is_activated BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255),
      ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP,
      ADD COLUMN IF NOT EXISTS verification_notes TEXT
    `);
    console.log('✅ Columns added successfully!\n');
    
    // Step 3: Auto-activate existing drivers
    console.log('🔄 Auto-activating existing drivers...');
    const updateResult = await pool.query(`
      UPDATE drivers 
      SET is_activated = TRUE 
      WHERE created_at < NOW() AND (is_activated IS NULL OR is_activated = FALSE)
    `);
    console.log(`✅ Activated ${updateResult.rowCount} existing driver(s)\n`);
    
    // Step 4: Verify the changes
    console.log('🔍 Verifying changes...');
    const verifyResult = await pool.query(`
      SELECT 
        d.id, 
        u.phone, 
        d.is_activated, 
        d.verified_by, 
        d.verification_date,
        d.created_at
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC 
      LIMIT 5
    `);
    
    if (verifyResult.rows.length > 0) {
      console.log('📊 Sample of drivers table:');
      console.table(verifyResult.rows);
    } else {
      console.log('ℹ️  No drivers found in database (this is okay if you haven\'t registered any yet)');
    }
    
    // Step 5: Check statistics
    console.log('\n📈 Activation Statistics:');
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_drivers,
        SUM(CASE WHEN is_activated = TRUE THEN 1 ELSE 0 END) as activated_drivers,
        SUM(CASE WHEN is_activated = FALSE OR is_activated IS NULL THEN 1 ELSE 0 END) as pending_drivers
      FROM drivers
    `);
    
    if (statsResult.rows.length > 0) {
      const stats = statsResult.rows[0];
      console.log(`   Total Drivers: ${stats.total_drivers}`);
      console.log(`   ✅ Activated: ${stats.activated_drivers}`);
      console.log(`   ⏳ Pending: ${stats.pending_drivers}`);
    }
    
    console.log('\n🎉 Migration completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Migration Error:', error.message);
    console.error('\nFull Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused. Please check:');
      console.log('   1. DATABASE_URL is correct');
      console.log('   2. Railway database is running');
      console.log('   3. Your IP is allowed (Railway might have IP restrictions)');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
runMigration();
