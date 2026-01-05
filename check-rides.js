const pool = require('./database/db-railway-fixed');

async function checkRides() {
  try {
    // Check if rides table exists
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'rides' 
      ORDER BY ordinal_position
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Rides table does not exist!');
      return;
    }
    
    console.log('✅ Rides table columns:');
    tableCheck.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Try to get rides
    const rides = await pool.query('SELECT * FROM rides LIMIT 5');
    console.log('\n📊 Rides count:', rides.rows.length);
    if (rides.rows.length > 0) {
      console.log('Sample ride:', rides.rows[0]);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

checkRides();
