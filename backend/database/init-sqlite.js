/**
 * Run Run - Database Initialization Script (SQLite)
 * Creates all tables and initial data
 * Developer: Edivaldo Cardoso
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'runrun.db');
const schemaPath = path.join(__dirname, 'schema-sqlite.sql');

console.log('🚀 Starting SQLite database initialization...');
console.log('📁 Database file:', dbPath);

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database');
}

try {
  // Create new database
  const db = new Database(dbPath);
  console.log('✅ Database file created');
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Read schema file
  console.log('📖 Reading schema file...');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Execute schema
  console.log('🔨 Creating tables...');
  
  // Split by statements (handling CREATE VIEW separately)
  const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
  
  let tablesCreated = 0;
  let viewsCreated = 0;
  let dataInserted = 0;
  
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;
    
    try {
      // Handle FILTER clause for SQLite (not supported, need to convert)
      let sqliteStatement = trimmed;
      
      // Convert FILTER to CASE WHEN for SQLite
      if (sqliteStatement.includes('FILTER')) {
        // This is a complex conversion, for now we'll skip views with FILTER
        if (sqliteStatement.toUpperCase().includes('CREATE VIEW') && 
            sqliteStatement.includes('platform_statistics')) {
          // Simplified platform statistics view for SQLite
          sqliteStatement = `
CREATE VIEW platform_statistics AS
SELECT 
    (SELECT COUNT(DISTINCT id) FROM users WHERE user_type = 'passenger') as total_passengers,
    (SELECT COUNT(DISTINCT id) FROM users WHERE user_type = 'driver') as total_drivers,
    (SELECT COUNT(DISTINCT id) FROM rides) as total_rides,
    (SELECT COUNT(DISTINCT id) FROM rides WHERE status = 'completed') as completed_rides,
    (SELECT COUNT(DISTINCT id) FROM rides WHERE status = 'cancelled') as cancelled_rides,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed') as total_revenue,
    (SELECT COALESCE(SUM(platform_fee), 0) FROM payments WHERE status = 'completed') as total_platform_fees
          `;
        }
      }
      
      db.exec(sqliteStatement + ';');
      
      if (trimmed.toUpperCase().startsWith('CREATE TABLE')) {
        tablesCreated++;
      } else if (trimmed.toUpperCase().startsWith('CREATE VIEW')) {
        viewsCreated++;
      } else if (trimmed.toUpperCase().startsWith('INSERT')) {
        dataInserted++;
      }
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error(`❌ Error executing statement: ${trimmed.substring(0, 100)}...`);
        console.error(`   Error: ${error.message}`);
      }
    }
  }
  
  console.log(`✅ Created ${tablesCreated} tables`);
  console.log(`✅ Created ${viewsCreated} views`);
  console.log(`✅ Inserted ${dataInserted} test records`);
  
  // Verify tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  console.log('\n📋 Database tables:');
  tables.forEach(table => console.log(`   - ${table.name}`));
  
  db.close();
  
  console.log('\n🎉 Database initialization complete!');
  console.log('\n📊 Next step: Start the backend server');
  console.log('   Run: npm run dev\n');
  
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  console.error(error);
  process.exit(1);
}
