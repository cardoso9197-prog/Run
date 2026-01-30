require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    console.log('Checking user-passenger relationships...');
    const result = await pool.query(`
      SELECT u.id as user_id, u.user_type, p.id as passenger_id
      FROM users u
      LEFT JOIN passengers p ON u.id = p.user_id
      ORDER BY u.id
    `);
    console.table(result.rows);

    // Check for users without passengers
    const missing = result.rows.filter(r => r.user_type === 'passenger' && !r.passenger_id);
    if (missing.length > 0) {
      console.log('\nUsers who are passengers but missing passenger records:');
      console.table(missing);
    } else {
      console.log('\nAll passenger users have passenger records ✅');
    }

    await pool.end();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
