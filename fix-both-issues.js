/**
 * Fix Both Issues - Run migrations on Railway
 * 1. Add balance columns (total_earnings, available_balance, pending_withdrawals)
 * 2. Verify status column exists
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixBothIssues() {
  console.log('\n🚀 Fixing both issues on Railway database...\n');
  
  try {
    // Issue 1: Add balance columns
    console.log('📝 Adding balance columns to drivers table...');
    
    await pool.query(`
      DO $$ 
      BEGIN
          -- Add total_earnings if not exists
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'drivers' AND column_name = 'total_earnings'
          ) THEN
              ALTER TABLE drivers ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0;
              RAISE NOTICE '✅ total_earnings column added';
          ELSE
              RAISE NOTICE '⚠️ total_earnings already exists';
          END IF;
          
          -- Add available_balance if not exists
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'drivers' AND column_name = 'available_balance'
          ) THEN
              ALTER TABLE drivers ADD COLUMN available_balance DECIMAL(10,2) DEFAULT 0;
              RAISE NOTICE '✅ available_balance column added';
          ELSE
              RAISE NOTICE '⚠️ available_balance already exists';
          END IF;
          
          -- Add pending_withdrawals if not exists
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'drivers' AND column_name = 'pending_withdrawals'
          ) THEN
              ALTER TABLE drivers ADD COLUMN pending_withdrawals DECIMAL(10,2) DEFAULT 0;
              RAISE NOTICE '✅ pending_withdrawals column added';
          ELSE
              RAISE NOTICE '⚠️ pending_withdrawals already exists';
          END IF;
      END $$;
    `);
    
    console.log('✅ Balance columns added!\n');
    
    // Initialize NULL values
    console.log('🔄 Initializing NULL values to 0...');
    const updateResult = await pool.query(`
      UPDATE drivers 
      SET 
          total_earnings = COALESCE(total_earnings, 0),
          available_balance = COALESCE(available_balance, 0),
          pending_withdrawals = COALESCE(pending_withdrawals, 0)
      WHERE total_earnings IS NULL 
         OR available_balance IS NULL 
         OR pending_withdrawals IS NULL
    `);
    console.log(`✅ Updated ${updateResult.rowCount} driver(s)\n`);
    
    // Issue 2: Verify status column
    console.log('📝 Checking status column...');
    
    const statusCheck = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'drivers' AND column_name = 'status'
    `);
    
    if (statusCheck.rows.length === 0) {
      console.log('⚠️ Status column missing, adding now...');
      await pool.query(`
        DO $$ 
        BEGIN
            ALTER TABLE drivers ADD COLUMN status VARCHAR(20) DEFAULT 'offline';
            ALTER TABLE drivers ADD CONSTRAINT drivers_status_check 
                CHECK (status IN ('online', 'offline', 'busy'));
            CREATE INDEX idx_drivers_status ON drivers(status);
            RAISE NOTICE '✅ Status column added';
        END $$;
      `);
      console.log('✅ Status column added!\n');
    } else {
      console.log('✅ Status column exists!\n');
      console.table(statusCheck.rows);
    }
    
    // Verify all columns
    console.log('🔍 Verifying all driver columns...');
    const verifyResult = await pool.query(`
      SELECT 
        d.id,
        u.phone as phone,
        d.status,
        d.is_verified,
        d.total_earnings,
        d.available_balance,
        d.pending_withdrawals,
        CASE 
            WHEN d.total_earnings IS NOT NULL 
             AND d.available_balance IS NOT NULL 
             AND d.pending_withdrawals IS NOT NULL 
             AND d.status IS NOT NULL THEN '✅ OK'
            ELSE '❌ MISSING DATA'
        END as column_status
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      LIMIT 5
    `);
    
    console.log('\n📊 Driver Data:');
    console.table(verifyResult.rows);
    
    // Test balance query
    console.log('\n🧪 Testing balance query for driver ID 4...');
    const balanceTest = await pool.query(`
      SELECT 
        id, 
        total_earnings, 
        available_balance,
        pending_withdrawals
      FROM drivers 
      WHERE id = 4
    `);
    
    if (balanceTest.rows.length > 0) {
      console.log('✅ Balance query successful:');
      console.table(balanceTest.rows);
    } else {
      console.log('⚠️ Driver ID 4 not found');
    }
    
    console.log('\n🎉 Both issues fixed!\n');
    console.log('✅ Balance columns: total_earnings, available_balance, pending_withdrawals');
    console.log('✅ Status column: status (online/offline)');
    console.log('\nNow test in the driver app!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixBothIssues();
