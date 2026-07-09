const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');
const { initSocket } = require('./config/socket');
const config = require('./config/env');

const server = http.createServer(app);

// Connect to database
connectDB().then(() => {
  // Initialize WebSockets
  initSocket(server);

  server.listen(config.port, () => {
    console.log(`Server running in mode on port ${config.port}`);
  });
}).catch(err => {
  console.error('Database connection failed', err);
  process.exit(1);
});
