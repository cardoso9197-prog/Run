require(''dotenv'').config();
const { Pool } = require(''pg'');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  query_timeout: 30000,
  max: 20,
  idleTimeoutMillis: 30000
});

async function test() {
  console.log(''🔍 Testing Railway Pro database...'');
  console.log(''Connection string:'', process.env.DATABASE_URL?.replace(/:[^:@]+@/, '':****@''));
  
  const start = Date.now();
  
  try {
    console.log(''Attempting query...'');
    const result = await pool.query(''SELECT NOW() as current_time, version() as pg_version'');
    const duration = Date.now() - start;
    console.log(''✅ Query succeeded in'', duration, ''ms'');
    console.log(''Time:'', result.rows[0].current_time);
    console.log(''PostgreSQL:'', result.rows[0].pg_version);
    
    // Test a real table
    const users = await pool.query(''SELECT COUNT(*) as count FROM users'');
    console.log(''✅ Users table accessible:'', users.rows[0].count, ''users'');
    
  } catch (err) {
    const duration = Date.now() - start;
    console.log(''❌ Query failed after'', duration, ''ms'');
    console.log(''Error:'', err.message);
    console.log(''Code:'', err.code);
  }
  
  await pool.end();
  process.exit(0);
}

test();