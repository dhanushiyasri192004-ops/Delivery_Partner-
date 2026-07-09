const mongoose = require('mongoose');

const ExecutiveTripSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  executiveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Executive',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'transit', 'completed'],
    default: 'pending'
  },
  completionPhoto: {
    type: String // Cloudinary URL
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExecutiveTrip', ExecutiveTripSchema);
