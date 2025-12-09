/**
 * Run Run - PostgreSQL Database Connection Module
 * PostgreSQL database connection for Railway deployment
 * Office: Run Run Team
 * Email: suporte@runrungb.com
 */

const { Pool } = require('pg');
require('dotenv').config();

// Check if we're using Railway's DATABASE_URL or individual config
const databaseUrl = process.env.DATABASE_URL;

let pool;

if (databaseUrl) {
  // Railway provides DATABASE_URL automatically when PostgreSQL is added
  console.log('🔗 Connecting to PostgreSQL using DATABASE_URL');
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });
} else {
  // Fallback to individual environment variables
  console.log('🔗 Connecting to PostgreSQL using individual config');
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'runrun',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });
}

// Test the connection
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ PostgreSQL database connection established');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.error('💡 Make sure PostgreSQL is running and DATABASE_URL is set');
  });

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL pool error:', err);
});

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

module.exports = {
  pool,
  query,
  getClient
};
