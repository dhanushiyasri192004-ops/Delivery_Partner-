const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'reached_vendor', 'picked_up', 'reached_customer', 'delivered', 'cancelled'],
    default: 'pending'
  },
  pickupOtp: {
    type: String,
    required: true
  },
  deliveryOtp: {
    type: String,
    required: true
  },
  pickupPhoto: {
    type: String // Cloudinary URL
  },
  deliveryPhoto: {
    type: String // Cloudinary URL
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  pickupCoordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  deliveryCoordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  earnings: {
    tripPay: { type: Number, default: 0 },
    tips: { type: Number, default: 0 },
    incentives: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
