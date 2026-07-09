const mongoose = require('mongoose');

const ExecutiveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  isApproved: {
    type: Boolean,
    default: true // Executives are auto-approved for simplicity
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
      type: [Number],
      default: [0, 0]
    }
  }
});

ExecutiveSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Executive', ExecutiveSchema);
