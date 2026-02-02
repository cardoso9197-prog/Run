/**
 * Test Payment Methods Table
 * Check if payment_methods table exists and test adding payment methods
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testPaymentMethods() {
  try {
    console.log('\n🔍 Testing Payment Methods Table...\n');

    // 1. Check if table exists
    console.log('1. Checking if payment_methods table exists...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'payment_methods'
      );
    `);
    console.log('   ✅ Table exists:', tableCheck.rows[0].exists);

    if (!tableCheck.rows[0].exists) {
      console.log('   ❌ payment_methods table does NOT exist!');
      console.log('   🔧 Creating payment_methods table...');
      
      // Create payment_method ENUM if not exists
      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE payment_method AS ENUM ('card', 'orange_money', 'mtn_momo');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      
      // Create table
      await pool.query(`
        CREATE TABLE payment_methods (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type payment_method NOT NULL,
          -- For card payments
          card_token TEXT,
          card_last_four VARCHAR(4),
          card_brand VARCHAR(20),
          cardholder_name VARCHAR(100),
          expiry_month INTEGER,
          expiry_year INTEGER,
          -- For mobile money
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
      
      // Create indexes
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
        CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(user_id, is_active);
        CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default);
      `);
      
      console.log('   ✅ payment_methods table created successfully!');
    }

    // 2. Check table structure
    console.log('\n2. Checking table structure...');
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

    // 3. Check ENUM values
    console.log('\n3. Checking payment_method ENUM values...');
    const enumCheck = await pool.query(`
      SELECT e.enumlabel as value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'payment_method'
      ORDER BY e.enumsortorder;
    `);
    console.log('   Valid payment types:', enumCheck.rows.map(r => r.value));

    // 4. Find a test user (passenger)
    console.log('\n4. Finding test passenger...');
    const testUser = await pool.query(`
      SELECT u.id, u.phone_number, p.name
      FROM users u
      JOIN passengers p ON u.id = p.user_id
      WHERE u.user_type = 'passenger'
      LIMIT 1;
    `);

    if (testUser.rows.length === 0) {
      console.log('   ⚠️  No passenger users found to test with');
      await pool.end();
      return;
    }

    const userId = testUser.rows[0].id;
    console.log(`   ✅ Test user: ${testUser.rows[0].name} (ID: ${userId}, Phone: ${testUser.rows[0].phone_number})`);

    // 5. Test adding Orange Money
    console.log('\n5. Testing Orange Money addition...');
    try {
      const orangeResult = await pool.query(`
        INSERT INTO payment_methods (
          user_id, type, mobile_number, account_name, is_default
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, type, mobile_number, is_default;
      `, [userId, 'orange_money', '+245955123456', 'Test Orange Account', false]);
      
      console.log('   ✅ Orange Money added successfully:');
      console.log('      ID:', orangeResult.rows[0].id);
      console.log('      Type:', orangeResult.rows[0].type);
      console.log('      Mobile:', orangeResult.rows[0].mobile_number);
    } catch (error) {
      console.log('   ❌ Orange Money failed:', error.message);
    }

    // 6. Test adding MTN Mobile Money
    console.log('\n6. Testing MTN Mobile Money addition...');
    try {
      const mtnResult = await pool.query(`
        INSERT INTO payment_methods (
          user_id, type, mobile_number, account_name, is_default
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, type, mobile_number, is_default;
      `, [userId, 'mtn_momo', '+245966789012', 'Test MTN Account', false]);
      
      console.log('   ✅ MTN Mobile Money added successfully:');
      console.log('      ID:', mtnResult.rows[0].id);
      console.log('      Type:', mtnResult.rows[0].type);
      console.log('      Mobile:', mtnResult.rows[0].mobile_number);
    } catch (error) {
      console.log('   ❌ MTN Mobile Money failed:', error.message);
    }

    // 7. Test adding Card
    console.log('\n7. Testing Card addition...');
    try {
      const cardResult = await pool.query(`
        INSERT INTO payment_methods (
          user_id, type, card_token, card_last_four, card_brand,
          cardholder_name, expiry_month, expiry_year, is_default
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, type, card_last_four, card_brand, is_default;
      `, [userId, 'card', 'test_token_123', '4242', 'visa', 'Test User', 12, 2026, false]);
      
      console.log('   ✅ Card added successfully:');
      console.log('      ID:', cardResult.rows[0].id);
      console.log('      Type:', cardResult.rows[0].type);
      console.log('      Last 4:', cardResult.rows[0].card_last_four);
      console.log('      Brand:', cardResult.rows[0].card_brand);
    } catch (error) {
      console.log('   ❌ Card failed:', error.message);
    }

    // 8. Show all payment methods for test user
    console.log('\n8. All payment methods for test user:');
    const allMethods = await pool.query(`
      SELECT id, type, card_last_four, card_brand, mobile_number, is_default, created_at
      FROM payment_methods
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC;
    `, [userId]);
    
    allMethods.rows.forEach(pm => {
      console.log(`   - ID ${pm.id}: ${pm.type.toUpperCase()}`);
      if (pm.type === 'card') {
        console.log(`     Card: ${pm.card_brand} ****${pm.card_last_four}`);
      } else {
        console.log(`     Mobile: ${pm.mobile_number}`);
      }
      console.log(`     Default: ${pm.is_default}, Created: ${pm.created_at}`);
    });

    console.log('\n✅ All tests completed!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testPaymentMethods();
