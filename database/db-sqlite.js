const Database = require('better-sqlite3');
const path = require('path');

// Create SQLite database file
const dbPath = path.join(__dirname, 'runrun.db');
const db = new Database(dbPath);

console.log('✅ SQLite database created at:', dbPath);

// Create pool-like interface for compatibility
const pool = {
  query: async (text, params) => {
    try {
      const stmt = db.prepare(text);
      
      // Handle different query types
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(params || []);
        return { rows };
      } else if (text.trim().toUpperCase().startsWith('INSERT')) {
        const info = stmt.run(params || []);
        return { rows: [{ id: info.lastInsertRowid }] };
      } else {
        const info = stmt.run(params || []);
        return { rows: [], rowCount: info.changes };
      }
    } catch (error) {
      throw error;
    }
  },
  
  connect: async () => {
    return {
      query: pool.query,
      release: () => {}
    };
  },
  
  end: () => {
    db.close();
  }
};

module.exports = pool;
