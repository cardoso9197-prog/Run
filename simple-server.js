// Simple test without Socket.IO
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Request received!');
  res.json({
    message: 'Run Run API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  console.log('Health check');
  res.json({ status: 'healthy' });
});

const PORT = 3001;
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Simple server listening on http://127.0.0.1:${PORT}`);
  console.log('Press Ctrl+C to stop');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep process alive
process.stdin.resume();
