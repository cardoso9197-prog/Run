// Quick Migration Script - Run this directly
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:VtNwuaGfrQycuTenVTgqircNNalvvemy@mainline.proxy.rlwy.net:21849/railway',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('\n🚀 Running Driver Activation Migration...\n');
  
  try {
    // Add columns
    console.log('📝 Adding activation columns...');
    await pool.query(`
      ALTER TABLE drivers 
      ADD COLUMN IF NOT EXISTS is_activated BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255),
      ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP,
      ADD COLUMN IF NOT EXISTS verification_notes TEXT
    `);
    console.log('✅ Columns added!\n');
    
    // Activate existing drivers
    console.log('🔄 Activating existing drivers...');
    const result = await pool.query(`UPDATE drivers SET is_activated = TRUE WHERE created_at < NOW()`);
    console.log(`✅ Activated ${result.rowCount} driver(s)\n`);
    
    // Show results
    console.log('📊 Current drivers:');
    const drivers = await pool.query(`SELECT id, phone_number, is_activated FROM drivers LIMIT 5`);
    console.table(drivers.rows);
    
    console.log('\n🎉 Migration completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
