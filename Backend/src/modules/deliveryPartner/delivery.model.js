const mongoose = require('mongoose');

const DeliveryPartnerSchema = new mongoose.Schema({
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
  vehicle: {
    name: { type: String, required: true },
    number: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    rcBookUrl: { type: String } // File upload url
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

// Create Geolocation Index
DeliveryPartnerSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
