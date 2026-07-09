const mongoose = require('mongoose');

const TechnicianSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true
  },
  panNumber: {
    type: String,
    required: true
  },
  technicianType: {
    type: String,
    required: true,
    enum: [
      'AC Technician',
      'Electronics Technician',
      'Electrician',
      'Plumber',
      'Carpenter',
      'Refrigerator Technician',
      'Washing Machine Technician',
      'Mobile Technician',
      'Laptop Technician'
    ]
  },
  bankDetails: {
    bankName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    accountNumber: { type: String, required: true },
    branch: { type: String, required: true }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'busy'],
    default: 'offline'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
});

TechnicianSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Technician', TechnicianSchema);
