const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./modules/auth/auth.routes');
const deliveryRoutes = require('./modules/deliveryPartner/delivery.routes');
const technicianRoutes = require('./modules/technician/technician.routes');
const executiveRoutes = require('./modules/executive/executive.routes');
const walletRoutes = require('./modules/wallet/wallet.routes');

const app = express();

// Middleware
app.use(cors({
  origin: config.allowedOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload assets path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Hooking
app.use('/api/auth', authRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/executive', executiveRoutes);
app.use('/api/wallet', walletRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy!' });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
