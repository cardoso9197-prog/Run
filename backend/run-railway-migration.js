const fs = require('fs');
const { Pool } = require('pg');

const sql = fs.readFileSync('./database/migrations/RAILWAY_URGENT_FIX.sql', 'utf8');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('🔄 Running Railway migration...\n');

pool.query(sql)
  .then(result => {
    console.log('\n✅ MIGRATION SUCCESSFUL!');
    console.log('==========================================');
    
    // Show notices if available
    if (result.notices) {
      result.notices.forEach(notice => console.log(notice.message));
    }
    
    console.log('==========================================\n');
    console.log('✅ All columns and tables created successfully!');
    console.log('✅ Apps should now work without errors!');
    console.log('\n📱 Next: Test profile update in passenger app');
    
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ MIGRATION FAILED!');
    console.error('Error:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  });
