require('dotenv').config();
const { Pool } = require('pg');

console.log('🔗 Connecting to Railway PostgreSQL Pro (Fixed Configuration)...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  query_timeout: 10000,
  statement_timeout: 10000,
  ssl: { rejectUnauthorized: false },
  application_name: 'runrun_backend_restored'
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err.message);
});

pool.on('connect', () => {
  console.log('✅ New connection established');
});

pool.query('SELECT NOW() as t, version() as v')
  .then(r => {
    console.log('✅ Railway connected!');
    console.log('📅 Time:', r.rows[0].t);
  })
  .catch(err => {
    console.error('❌ Failed:', err.message);
  });

process.on('SIGTERM', async () => { await pool.end(); });
process.on('SIGINT', async () => { await pool.end(); process.exit(0); });

module.exports = pool;
