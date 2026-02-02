/**
 * Migration: Add Driver Activation Fields
 * Date: December 16, 2025
 * Purpose: Add is_activated column and verification tracking for driver accounts
 */

const { query } = require('./database/db');

async function addDriverActivationFields() {
  console.log('🔄 Starting driver activation migration...');

  try {
    // Check if column already exists
    const checkColumn = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'drivers' 
      AND column_name = 'is_activated'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✅ Column is_activated already exists, skipping...');
      return;
    }

    // Add activation columns to drivers table
    await query(`
      ALTER TABLE drivers 
      ADD COLUMN is_activated BOOLEAN DEFAULT FALSE,
      ADD COLUMN verified_by VARCHAR(255),
      ADD COLUMN verification_date TIMESTAMP,
      ADD COLUMN verification_notes TEXT
    `);

    console.log('✅ Added activation columns to drivers table');

    // Optional: Activate existing drivers (if any)
    const activateExisting = await query(`
      UPDATE drivers 
      SET is_activated = TRUE, 
          verification_date = NOW(),
          verification_notes = 'Existing driver - auto-activated during migration'
      WHERE created_at < NOW()
    `);

    console.log(`✅ Auto-activated ${activateExisting.rowCount} existing drivers`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  addDriverActivationFields()
    .then(() => {
      console.log('✅ Driver activation migration complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration error:', error);
      process.exit(1);
    });
}

module.exports = { addDriverActivationFields };
