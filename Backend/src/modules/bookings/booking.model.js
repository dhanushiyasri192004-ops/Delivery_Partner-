const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending', 
      'accepted', 
      'transit', 
      'arrived', 
      'before_photo_uploaded', 
      'service_started', 
      'in_progress', 
      'completed', 
      'after_photo_uploaded', 
      'otp_verified', 
      'wallet_updated', 
      'closed', 
      'cancelled'
    ],
    default: 'pending'
  },
  beforeServicePhoto: {
    type: String // Cloudinary URL
  },
  afterServicePhoto: {
    type: String // Cloudinary URL
  },
  otp: {
    type: String,
    required: true
  },
  signatureUrl: {
    type: String // Cloudinary URL
  },
  earnings: {
    type: Number,
    default: 0
  },
  arrivalTime: {
    type: Date
  },
  completionTime: {
    type: Date
  },
  arrivalLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  completionLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
