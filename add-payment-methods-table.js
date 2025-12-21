/**
 * Add Payment Methods Table Migration
 * Creates payment_methods table if it doesn't exist
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:LhAcvyFWksMTzxIpwIqQKmLPaUxXWqyf@autorack.proxy.rlwy.net:48439/railway',
  ssl: { rejectUnauthorized: false }
});

async function addPaymentMethodsTable() {
  try {
    console.log('\n🔧 Adding Payment Methods Table...\n');

    // 1. Create payment_method ENUM
    console.log('1. Creating payment_method ENUM...');
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE payment_method AS ENUM ('card', 'orange_money', 'mtn_momo');
      EXCEPTION
        WHEN duplicate_object THEN 
          RAISE NOTICE 'payment_method ENUM already exists';
      END $$;
    `);
    console.log('   ✅ payment_method ENUM ready');

    // 2. Create payment_methods table
    console.log('\n2. Creating payment_methods table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type payment_method NOT NULL,
        -- For card payments (Visa/Mastercard)
        card_token TEXT,
        card_last_four VARCHAR(4),
        card_brand VARCHAR(20),
        cardholder_name VARCHAR(100),
        expiry_month INTEGER,
        expiry_year INTEGER,
        -- For mobile money (Orange Money, MTN)
        mobile_number VARCHAR(20),
        account_name VARCHAR(100),
        -- Management
        is_default BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        -- Constraints
        CONSTRAINT valid_card_payment CHECK (
          type != 'card' OR (
            card_token IS NOT NULL AND 
            card_last_four IS NOT NULL AND 
            card_brand IS NOT NULL AND
            expiry_month IS NOT NULL AND
            expiry_year IS NOT NULL
          )
        ),
        CONSTRAINT valid_mobile_payment CHECK (
          type = 'card' OR mobile_number IS NOT NULL
        )
      );
    `);
    console.log('   ✅ payment_methods table created');

    // 3. Create indexes
    console.log('\n3. Creating indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
      CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(user_id, is_active);
      CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default);
    `);
    console.log('   ✅ Indexes created');

    // 4. Verify table structure
    console.log('\n4. Verifying table structure...');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'payment_methods'
      ORDER BY ordinal_position;
    `);
    
    console.log('   Columns:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // 5. Check ENUM values
    console.log('\n5. Checking ENUM values...');
    const enumValues = await pool.query(`
      SELECT e.enumlabel as value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'payment_method'
      ORDER BY e.enumsortorder;
    `);
    console.log('   Valid payment types:', enumValues.rows.map(r => r.value).join(', '));

    console.log('\n✅ Payment Methods table is ready!\n');
    console.log('📱 Users can now add:');
    console.log('   - Visa/Mastercard cards');
    console.log('   - Orange Money accounts');
    console.log('   - MTN Mobile Money accounts\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

addPaymentMethodsTable();
