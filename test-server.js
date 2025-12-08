// Test server startup with error handling
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

const PORT = 3000;

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`✅ Test server listening on port ${PORT}`);
  console.log('   Keeping server alive...');
});

// Keep process alive
setInterval(() => {
  console.log(`   Server still running... (${new Date().toISOString()})`);
}, 5000);
