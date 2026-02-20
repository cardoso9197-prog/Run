// Delete driver by user_id
// Usage: DATABASE_URL=... node delete-driver.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function deleteDriver(userId) {
  try {
    // First check what we're deleting
    const check = await pool.query(
      'SELECT u.id, u.name, u.phone, d.id as driver_id FROM users u LEFT JOIN drivers d ON d.user_id = u.id WHERE u.id = $1',
      [userId]
    );
    
    if (check.rows.length === 0) {
      console.log(`No user found with id ${userId}`);
      return;
    }
    
    console.log('Deleting:', check.rows[0]);
    
    // Delete from drivers first (or CASCADE will handle it)
    await pool.query('DELETE FROM drivers WHERE user_id = $1', [userId]);
    console.log('✅ Deleted from drivers table');
    
    // Delete from users
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    console.log('✅ Deleted from users table');
    
    // Verify
    const verify = await pool.query('SELECT * FROM drivers');
    console.log(`Remaining drivers: ${verify.rows.length}`);
    
    console.log('\n🎉 Driver deleted successfully! You can now register a new driver.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

deleteDriver(9);
