require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    console.log('Fixing rides table foreign key constraints...');

    // Drop the incorrect constraint
    console.log('Dropping incorrect passenger_id foreign key...');
    await pool.query('ALTER TABLE rides DROP CONSTRAINT rides_passenger_id_fkey');

    // Add the correct constraint
    console.log('Adding correct passenger_id foreign key to passengers table...');
    await pool.query('ALTER TABLE rides ADD CONSTRAINT rides_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE');

    // Check if driver_id constraint is correct (should reference drivers.id, not users.id)
    console.log('Checking driver_id constraint...');
    const driverConstraint = await pool.query(`
      SELECT ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_name = 'rides_driver_id_fkey' AND tc.table_name = 'rides'
    `);

    if (driverConstraint.rows.length > 0) {
      const foreignTable = driverConstraint.rows[0].foreign_table_name;
      console.log(`Driver constraint currently references: ${foreignTable}`);

      if (foreignTable === 'users') {
        console.log('Fixing driver_id constraint to reference drivers table...');
        await pool.query('ALTER TABLE rides DROP CONSTRAINT rides_driver_id_fkey');
        await pool.query('ALTER TABLE rides ADD CONSTRAINT rides_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL');
      }
    }

    console.log('✅ Foreign key constraints fixed successfully!');

    await pool.end();
  } catch (err) {
    console.error('❌ Error fixing constraints:', err);
    process.exit(1);
  }
})();
