const { Client } = require('pg');

async function createDatabase() {
  // Connect to default postgres database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname='runrun_db'"
    );

    if (checkDb.rows.length > 0) {
      console.log('ℹ️  Database "runrun_db" already exists');
    } else {
      console.log('📦 Creating database "runrun_db"...');
      await client.query('CREATE DATABASE runrun_db');
      console.log('✅ Database created successfully!');
    }

    await client.end();
    console.log('\n🎉 Database setup complete!');
    console.log('\nNext step: Run "node database/init.js" to create tables');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDatabase();
