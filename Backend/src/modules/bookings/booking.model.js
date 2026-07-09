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
    enum: ['pending', 'accepted', 'transit', 'arrived', 'service_started', 'service_completed'],
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
