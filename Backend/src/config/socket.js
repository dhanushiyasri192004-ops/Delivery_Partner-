const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./env');

let io = null;
const userSockets = new Map(); // Map: userId -> Set of socketIds

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.allowedOrigin,
      methods: ['GET', 'POST']
    }
  });

  // JWT Authentication middleware for Sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(); // Allow connection but treat as unauthenticated (or reject: new Error('Auth error'))
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error('Socket JWT Authentication error:', err.message);
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Register authenticated user socket
    if (socket.user && socket.user.id) {
      const userId = socket.user.id.toString();
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);
      
      // Join a private room for user-specific events
      socket.join(userId);
      console.log(`User ${userId} joined their private socket room.`);
    }

    // Join tracking room for order or service booking tracking
    socket.on('join_trip', ({ tripId }) => {
      socket.join(`trip_${tripId}`);
      console.log(`Socket ${socket.id} joined tracking room: trip_${tripId}`);
    });

    // Update real-time location telemetry
    socket.on('update_location', ({ tripId, latitude, longitude, role, heading, speed }) => {
      const locationData = {
        tripId,
        latitude,
        longitude,
        heading: heading || 0,
        speed: speed || 0,
        role,
        timestamp: new Date()
      };
      
      // Broadcast to anyone listening to this trip (customer, vendor, admin)
      io.to(`trip_${tripId}`).emit('location_updated', locationData);
      
      // We could trigger a database service call to log this location asynchronously
      console.log(`Live Location: Trip ${tripId} [${latitude}, ${longitude}]`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
      if (socket.user && socket.user.id) {
        const userId = socket.user.id.toString();
        const socketIds = userSockets.get(userId);
        if (socketIds) {
          socketIds.delete(socket.id);
          if (socketIds.size === 0) {
            userSockets.delete(userId);
          }
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

/**
 * Send socket event to all sockets of a specific user.
 * @param {string} userId 
 * @param {string} event 
 * @param {any} data 
 */
const sendToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(userId.toString()).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendToUser
};
