// Quick Database Migration Script for Railway
// Run: node run-business-migration-railway.js

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('🚀 Run-Run Business Accounts Migration\n');

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable not set!');
  console.error('\nPlease set it first:');
  console.error('Windows PowerShell:');
  console.error('  $env:DATABASE_URL = "postgresql://user:pass@host:5432/db"');
  console.error('  node run-business-migration-railway.js');
  console.error('\nGet your DATABASE_URL from Railway Dashboard → PostgreSQL → Connect');
  process.exit(1);
}

console.log('✅ DATABASE_URL found');
console.log('📍 Host:', DATABASE_URL.split('@')[1]?.split('/')[0] || 'hidden');

// Read migration file
const migrationPath = path.join(__dirname, 'database', 'migrations', '007_create_business_accounts.sql');

if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
console.log('✅ Migration file loaded:', migrationPath);
console.log('📄 SQL lines:', migrationSQL.split('\n').length);

// Connect and run migration
const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Railway requires SSL
  }
});

console.log('\n🔌 Connecting to Railway PostgreSQL...');

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!\n');
    console.log('🔨 Running migration 007_create_business_accounts.sql...\n');
    return client.query(migrationSQL);
  })
  .then(() => {
    console.log('✅ Migration executed successfully!\n');
    console.log('🔍 Verifying tables created...');
    
    return client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_name IN ('business_accounts', 'invoices', 'invoice_items')
      ORDER BY table_name;
    `);
  })
  .then((result) => {
    if (result.rows.length === 3) {
      console.log('✅ All tables created successfully!\n');
      console.log('📊 Tables:');
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name} (${row.column_count} columns)`);
      });
      console.log('\n🎉 MIGRATION COMPLETE!\n');
      console.log('Next steps:');
      console.log('1. Configure email settings in Railway (EMAIL_HOST, EMAIL_USER, etc.)');
      console.log('2. Test business account creation via mobile app');
      console.log('3. Verify invoice generation after completing a ride');
    } else {
      console.warn('⚠️ Warning: Expected 3 tables, found:', result.rows.length);
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    return client.end();
  })
  .then(() => {
    console.log('\n✅ Database connection closed');
    console.log('✨ Migration script completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ MIGRATION FAILED!\n');
    console.error('Error details:', error.message);
    
    if (error.message.includes('already exists')) {
      console.error('\n💡 Tables may already exist. Check your database:');
      console.error('   SELECT * FROM business_accounts;');
      console.error('   SELECT * FROM invoices;');
      console.error('   SELECT * FROM invoice_items;');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication failed. Verify:');
      console.error('   - DATABASE_URL is correct');
      console.error('   - Railway PostgreSQL is running');
      console.error('   - Network connection is stable');
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Referenced table not found. Run previous migrations first:');
      console.error('   - 002_create_rides_tables.sql');
      console.error('   - 003-006 migrations');
    }
    
    client.end().then(() => {
      process.exit(1);
    });
  });
