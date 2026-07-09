const mongoose = require('mongoose');
const config = require('./env');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.log('Running in mock JSON-file database mode. Server will remain online.');
    isConnected = false;
  }
};

const getDbConnected = () => isConnected;

module.exports = { connectDB, getDbConnected };
