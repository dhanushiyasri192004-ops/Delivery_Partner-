const Order = require('../orders/order.model');
const DeliveryPartner = require('./delivery.model');
const Wallet = require('../wallet/wallet.model');
const Notification = require('../notifications/notification.model');
const { uploadToCloudinary } = require('../../config/cloudinary');
const { getDbConnected } = require('../../config/database');
const mockDb = require('../../config/mockDb');
const { sendToUser } = require('../../config/socket');

/**
 * Fetch dashboard details for the delivery partner.
 */
const getDashboardData = async (req, res, next) => {
  try {
    // Check database connection mode fallback
    if (!getDbConnected()) {
      const partner = mockDb.findOne('deliveryPartners', p => p.userId === req.user.id);
      if (!partner) {
        return res.status(200).json({
          success: true,
          partnerStatus: 'online',
          metrics: {
            todayEarnings: 0,
            todayOrdersCount: 0,
            completedCount: 0,
            cancellationCount: 0
          },
          activeOrder: null,
          assignedOrder: null,
          notifications: []
        });
      }

      const completedOrders = mockDb.find('orders', o => o.deliveryPartnerId === partner._id && o.status === 'delivered');
      const activeOrder = mockDb.findOne('orders', o => o.deliveryPartnerId === partner._id && ['accepted', 'reached_vendor', 'picked_up', 'reached_customer'].includes(o.status));
      const assignedOrder = mockDb.findOne('orders', o => o.deliveryPartnerId === partner._id && o.status === 'pending');

      const todayEarnings = completedOrders.reduce((sum, order) => {
        return sum + (order.earnings?.tripPay || 0) + (order.earnings?.tips || 0) + (order.earnings?.incentives || 0);
      }, 0);

      const wallet = mockDb.findOne('wallets', w => w.userId === req.user.id);

      return res.status(200).json({
        success: true,
        partnerStatus: partner.status || 'online',
        metrics: {
          todayEarnings,
          todayOrdersCount: completedOrders.length,
          completedCount: completedOrders.length,
          cancellationCount: 0
        },
        activeOrder,
        assignedOrder,
        walletBalance: wallet ? wallet.balance : 0,
        notifications: []
      });
    }

    const partner = await DeliveryPartner.findOne({ userId: req.user.id });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Delivery partner profile not found' });
    }

    // Get today's range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Completed orders today
    const completedOrders = await Order.find({
      deliveryPartnerId: partner._id,
      status: 'delivered',
      deliveryTime: { $gte: startOfToday }
    });

    // Active order (if any)
    const activeOrder = await Order.findOne({
      deliveryPartnerId: partner._id,
      status: { $in: ['accepted', 'reached_vendor', 'picked_up', 'reached_customer'] }
    });

    // Assigned order (pending acceptance)
    const assignedOrder = await Order.findOne({
      deliveryPartnerId: partner._id,
      status: 'pending'
    });

    // Calculate today's earnings
    const todayEarnings = completedOrders.reduce((sum, order) => {
      return sum + (order.earnings.tripPay || 0) + (order.earnings.tips || 0) + (order.earnings.incentives || 0);
    }, 0);

    // Wallet balance
    const wallet = await Wallet.findOne({ userId: req.user.id });

    // Recent notifications
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      partnerStatus: partner.status,
      metrics: {
        todayEarnings,
        todayOrdersCount: completedOrders.length,
        completedCount: completedOrders.length,
        cancellationCount: 0 // Mocked/calculated as needed
      },
      activeOrder,
      assignedOrder,
      walletBalance: wallet ? wallet.balance : 0,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update online/offline availability status.
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // online, offline, break, lunch
    const now = new Date();
    
    // 1. Mock DB Mode handler
    if (!getDbConnected()) {
      const partner = mockDb.findOne('deliveryPartners', p => p.userId === req.user.id);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Delivery partner profile not found' });
      }

      const prevStatus = partner.status || 'offline';
      let updates = { status };

      if (status === 'online') {
        updates.isAvailableForOrders = true;
        if (prevStatus === 'offline') {
          updates.shiftStartTime = now.toISOString();
        } else if (prevStatus === 'break') {
          updates.breakEndTime = now.toISOString();
        } else if (prevStatus === 'lunch') {
          updates.lunchEndTime = now.toISOString();
        }
      } else if (status === 'break') {
        updates.isAvailableForOrders = false;
        updates.breakStartTime = now.toISOString();
      } else if (status === 'lunch') {
        updates.isAvailableForOrders = false;
        updates.lunchStartTime = now.toISOString();
      } else if (status === 'offline') {
        updates.isAvailableForOrders = false;
        updates.shiftEndTime = now.toISOString();
      }

      const updated = mockDb.updateById('deliveryPartners', partner._id, updates);
      return res.status(200).json({
        success: true,
        message: `Status updated to ${status}`,
        status: updated.status
      });
    }

    // 2. Real Mongoose MongoDB Mode handler
    const partner = await DeliveryPartner.findOne({ userId: req.user.id });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Delivery partner profile not found' });
    }

    const prevStatus = partner.status || 'offline';

    if (status === 'online') {
      partner.isAvailableForOrders = true;
      if (prevStatus === 'offline') {
        partner.shiftStartTime = now;
      } else if (prevStatus === 'break') {
        partner.breakEndTime = now;
      } else if (prevStatus === 'lunch') {
        partner.lunchEndTime = now;
      }
    } else if (status === 'break') {
      partner.isAvailableForOrders = false;
      partner.breakStartTime = now;
    } else if (status === 'lunch') {
      partner.isAvailableForOrders = false;
      partner.lunchStartTime = now;
    } else if (status === 'offline') {
      partner.isAvailableForOrders = false;
      partner.shiftEndTime = now;
    }

    partner.status = status;
    await partner.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      status: partner.status
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept a newly assigned order.
 */
const acceptOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!getDbConnected()) {
      const partner = mockDb.findOne('deliveryPartners', p => p.userId === req.user.id);
      const order = mockDb.findById('orders', orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      const updated = mockDb.updateById('orders', orderId, { status: 'accepted', deliveryPartnerId: partner?._id });
      if (partner) mockDb.updateById('deliveryPartners', partner._id, { status: 'busy' });
      return res.status(200).json({ success: true, message: 'Order accepted', order: updated });
    }

    const partner = await DeliveryPartner.findOne({ userId: req.user.id });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.deliveryPartnerId = partner._id;
    order.status = 'accepted';
    await order.save();
    partner.status = 'busy';
    await partner.save();

    res.status(200).json({ success: true, message: 'Order accepted successfully', order });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark location as reached vendor.
 */
const reachedVendor = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!getDbConnected()) {
      const order = mockDb.findById('orders', orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      const updated = mockDb.updateById('orders', orderId, { status: 'reached_vendor' });
      return res.status(200).json({ success: true, message: 'Arrived at vendor outlet', order: updated });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = 'reached_vendor';
    await order.save();
    res.status(200).json({ success: true, message: 'Arrived at vendor outlet', order });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify pickup OTP and upload verification photo.
 */
const verifyPickup = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { otp, latitude, longitude } = req.body;

    if (!getDbConnected()) {
      const order = mockDb.findById('orders', orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      // In mock mode: accept any 4+ digit OTP (demo)
      if (!otp || otp.length < 4) {
        return res.status(400).json({ success: false, message: 'Invalid pickup OTP code' });
      }
      const updated = mockDb.updateById('orders', orderId, {
        status: 'picked_up',
        pickupPhoto: '',
        pickupTime: new Date().toISOString(),
        pickupCoordinates: { latitude: parseFloat(latitude || 12.9716), longitude: parseFloat(longitude || 77.5946) }
      });
      return res.status(200).json({ success: true, message: 'Pickup verification completed', order: updated });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.pickupOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid pickup OTP code' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path, 'pickups');
    }

    order.status = 'picked_up';
    order.pickupPhoto = photoUrl;
    order.pickupTime = new Date();
    order.pickupCoordinates = {
      latitude: parseFloat(latitude || 0),
      longitude: parseFloat(longitude || 0)
    };
    await order.save();
    res.status(200).json({ success: true, message: 'Pickup verification completed successfully', order });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark location as reached customer.
 */
const reachedCustomer = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!getDbConnected()) {
      const order = mockDb.findById('orders', orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      const updated = mockDb.updateById('orders', orderId, { status: 'reached_customer' });
      return res.status(200).json({ success: true, message: 'Reached customer location', order: updated });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = 'reached_customer';
    await order.save();
    res.status(200).json({ success: true, message: 'Reached customer location', order });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify delivery OTP, upload photo, release payment to wallet.
 */
const verifyDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { otp, latitude, longitude } = req.body;

    if (!getDbConnected()) {
      const order = mockDb.findById('orders', orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      // In mock mode: accept any 4+ digit OTP (demo)
      if (!otp || otp.length < 4) {
        return res.status(400).json({ success: false, message: 'Invalid delivery OTP code' });
      }
      const partner = mockDb.findOne('deliveryPartners', p => p.userId === req.user.id);
      const totalEarnings = (order.earnings?.tripPay || 120) + (order.earnings?.tips || 30) + (order.earnings?.incentives || 20);
      const updated = mockDb.updateById('orders', orderId, {
        status: 'delivered',
        deliveryPhoto: '',
        deliveryTime: new Date().toISOString(),
        deliveryCoordinates: { latitude: parseFloat(latitude || 12.9616), longitude: parseFloat(longitude || 77.6046) }
      });
      if (partner) {
        mockDb.updateById('deliveryPartners', partner._id, { status: 'online' });
        // Update wallet in mock
        const wallet = mockDb.findOne('wallets', w => w.userId === req.user.id);
        if (wallet) {
          const newBalance = (wallet.balance || 0) + totalEarnings;
          const transactions = [...(wallet.transactions || []), {
            amount: totalEarnings,
            type: 'credit',
            description: `Earnings for Order #${orderId.substring(orderId.length - 6)}`,
            timestamp: new Date().toISOString()
          }];
          mockDb.updateById('wallets', wallet._id, { balance: newBalance, transactions });
        }
      }
      return res.status(200).json({ success: true, message: 'Order delivered and earnings updated', order: updated });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.deliveryOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid delivery OTP code' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path, 'deliveries');
    }

    order.status = 'delivered';
    order.deliveryPhoto = photoUrl;
    order.deliveryTime = new Date();
    order.deliveryCoordinates = {
      latitude: parseFloat(latitude || 0),
      longitude: parseFloat(longitude || 0)
    };
    await order.save();

    const partner = await DeliveryPartner.findById(order.deliveryPartnerId);
    if (partner) {
      partner.status = 'online';
      await partner.save();
    }

    const totalEarnings = (order.earnings.tripPay || 0) + (order.earnings.tips || 0) + (order.earnings.incentives || 0);
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (wallet) {
      wallet.balance += totalEarnings;
      wallet.transactions.push({
        amount: totalEarnings,
        type: 'credit',
        description: `Earnings for Order #${order._id.toString().substring(18)}`,
        timestamp: new Date()
      });
      await wallet.save();
      sendToUser(req.user.id, 'wallet_updated', { balance: wallet.balance });
    }

    await Notification.create({
      userId: req.user.id,
      title: 'Earnings Deposited',
      message: `Completed Order #${order._id.toString().substring(18)}. ₹${totalEarnings} added to your wallet.`
    });

    res.status(200).json({ success: true, message: 'Order delivered and earnings updated successfully', order });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch partner's completed orders history.
 */
const getOrderHistory = async (req, res, next) => {
  try {
    if (!getDbConnected()) {
      const partner = mockDb.findOne('deliveryPartners', p => p.userId === req.user.id);
      if (!partner) return res.status(200).json({ success: true, orders: [] });
      const orders = mockDb.find('orders', o => o.deliveryPartnerId === partner._id);
      return res.status(200).json({ success: true, orders });
    }

    const partner = await DeliveryPartner.findOne({ userId: req.user.id });
    const orders = await Order.find({
      deliveryPartnerId: partner._id
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  updateStatus,
  acceptOrder,
  reachedVendor,
  verifyPickup,
  reachedCustomer,
  verifyDelivery,
  getOrderHistory
};
