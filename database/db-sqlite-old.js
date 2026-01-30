/**
 * Run Run - Database Connection Module
 * SQLite database connection using better-sqlite3
 * Developer: Edivaldo Cardoso
 */

const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '..', 'runrun.db');
const db = new Database(dbPath);

console.log('✅ SQLite database connection established');
console.log('📁 Database file:', dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Wrapper to make it compatible with pg pool interface
const pool = {
  query: (text, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        // Convert PostgreSQL $1, $2 style to SQLite ? style
        let sqliteQuery = text;
        let sqliteParams = params;
        
        // Handle PostgreSQL style parameters
        const paramMatches = text.match(/\$\d+/g);
        if (paramMatches) {
          sqliteQuery = text.replace(/\$\d+/g, '?');
        }
        
        // Handle RETURNING clause (not supported in SQLite)
        if (sqliteQuery.toUpperCase().includes('RETURNING')) {
          const returningMatch = sqliteQuery.match(/RETURNING\s+(.+)$/i);
          sqliteQuery = sqliteQuery.replace(/RETURNING\s+.+$/i, '');
          
          if (sqliteQuery.trim().toUpperCase().startsWith('INSERT')) {
            const stmt = db.prepare(sqliteQuery);
            const info = stmt.run(...sqliteParams);
            
            // Return the inserted row with the ID
            const tableMatch = sqliteQuery.match(/INSERT INTO\s+(\w+)/i);
            if (tableMatch) {
              const selectStmt = db.prepare(`SELECT * FROM ${tableMatch[1]} WHERE id = ?`);
              const row = selectStmt.get(info.lastInsertRowid);
              resolve({ rows: [row], rowCount: info.changes });
            } else {
              resolve({ rows: [{ id: info.lastInsertRowid }], rowCount: info.changes });
            }
          } else if (sqliteQuery.trim().toUpperCase().startsWith('UPDATE')) {
            const stmt = db.prepare(sqliteQuery);
            const info = stmt.run(...sqliteParams);
            resolve({ rows: [], rowCount: info.changes });
          } else {
            const stmt = db.prepare(sqliteQuery);
            const result = stmt.run(...sqliteParams);
            resolve({ rows: [], rowCount: result.changes });
          }
        } else if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
          const stmt = db.prepare(sqliteQuery);
          const rows = stmt.all(...sqliteParams);
          resolve({ rows, rowCount: rows.length });
        } else if (sqliteQuery.trim().toUpperCase().startsWith('INSERT')) {
          const stmt = db.prepare(sqliteQuery);
          const info = stmt.run(...sqliteParams);
          resolve({ rows: [{ id: info.lastInsertRowid }], rowCount: info.changes });
        } else if (sqliteQuery.trim().toUpperCase().startsWith('UPDATE') || 
                   sqliteQuery.trim().toUpperCase().startsWith('DELETE')) {
          const stmt = db.prepare(sqliteQuery);
          const info = stmt.run(...sqliteParams);
          resolve({ rows: [], rowCount: info.changes });
        } else {
          // For other queries (CREATE TABLE, etc.)
          db.exec(sqliteQuery);
          resolve({ rows: [], rowCount: 0 });
        }
      } catch (error) {
        reject(error);
      }
    });
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

/**
 * Execute a SQL query
 * @param {string} text - SQL query text
 * @param {array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
const getClient = async () => {
  return {
    query: pool.query,
    release: () => {}
  };
};

/**
 * Execute multiple queries in a transaction
 * @param {function} callback - Function containing queries to execute
 * @returns {Promise} Transaction result
 */
const transaction = async (callback) => {
  try {
    await pool.query('BEGIN');
    const result = await callback({ query: pool.query });
    await pool.query('COMMIT');
    return result;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
};

module.exports = {
  query,
  getClient,
  transaction,
  pool,
};
