require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Use Railway DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:kYEyWinKbVmVhRMxIOqFPxhhkVnykISt@junction.proxy.rlwy.net:13699/railway';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting withdrawals table migration...\n');
    
    // Read the minimal SQL file
    const sqlPath = path.join(__dirname, 'MINIMAL_WITHDRAWALS_TABLE.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ File not found:', sqlPath);
      process.exit(1);
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('📄 SQL file loaded successfully\n');
    
    // Execute the migration
    console.log('⚙️  Creating withdrawals tables...');
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!\n');
    
    // Verify the tables were created
    const result = await client.query(`
      SELECT 
        'withdrawals' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'withdrawals') 
        THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
      UNION ALL
      SELECT 'driver_withdrawal_settings',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'driver_withdrawal_settings') 
        THEN '✅ EXISTS' ELSE '❌ MISSING' END
      ORDER BY table_name
    `);
    
    console.log('📊 Verification Results:');
    result.rows.forEach(row => {
      console.log(`  ${row.table_name}: ${row.status}`);
    });
    
    console.log('\n🎉 Withdrawals feature is now ready!');
    console.log('📱 You can now test in the Driver App:');
    console.log('   - Go Online/Offline ✅');
    console.log('   - View Earnings Balance ✅');
    console.log('   - Request Withdrawals ✅\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
