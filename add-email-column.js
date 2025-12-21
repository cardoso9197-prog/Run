require('dotenv').config();
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:kYEyWinKbVmVhRMxIOqFPxhhkVnykISt@junction.proxy.rlwy.net:13699/railway';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000
});

async function addEmailColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Adding profile columns to drivers table...\n');
    
    // Add email and profile_photo_url columns
    await client.query(`
      DO $$ 
      BEGIN
          -- Add email column
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'drivers' AND column_name = 'email'
          ) THEN
              ALTER TABLE drivers ADD COLUMN email VARCHAR(255);
              RAISE NOTICE '✅ email column added';
          ELSE
              RAISE NOTICE 'ℹ️  email column already exists';
          END IF;
          
          -- Add profile_photo_url column
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'drivers' AND column_name = 'profile_photo_url'
          ) THEN
              ALTER TABLE drivers ADD COLUMN profile_photo_url TEXT;
              RAISE NOTICE '✅ profile_photo_url column added';
          ELSE
              RAISE NOTICE 'ℹ️  profile_photo_url column already exists';
          END IF;
      END $$;
    `);
    
    console.log('✅ Migration completed successfully!\n');
    
    // Verify the columns were added
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'drivers' AND column_name IN ('email', 'profile_photo_url')
      ORDER BY column_name
    `);
    
    if (result.rows.length > 0) {
      console.log('📊 Verification:');
      result.rows.forEach(row => {
        console.log(`   ${row.column_name}: ${row.data_type}`);
      });
      console.log();
    } else {
      console.log('❌ Columns not found!\n');
    }
    
    console.log('🎉 Profile update feature is now ready!\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

addEmailColumn();
