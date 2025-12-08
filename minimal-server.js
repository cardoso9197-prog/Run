// Minimal server test
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Minimal server works!',
    timestamp: new Date().toISOString()
  }));
});

const PORT = 3001;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Minimal server running on http://127.0.0.1:${PORT}`);
  console.log('Try: curl http://127.0.0.1:3001/');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep alive
setInterval(() => {
  console.log(`Server alive at ${new Date().toLocaleTimeString()}`);
}, 5000);
