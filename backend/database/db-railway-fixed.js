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

/**
 * Execute a SQL query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('✅ Query executed', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Get a client from the pool (for transactions)
 * @returns {Promise} PostgreSQL client
 */
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('⚠️ A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};

/**
 * Execute a transaction
 * @param {Function} callback - Function to execute within transaction
 * @returns {Promise} Transaction result
 */
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  getClient,
  transaction
};
