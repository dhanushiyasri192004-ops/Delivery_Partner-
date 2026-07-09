const Booking = require('../bookings/booking.model');
const Technician = require('./technician.model');
const Wallet = require('../wallet/wallet.model');
const Notification = require('../notifications/notification.model');
const { uploadToCloudinary } = require('../../config/cloudinary');
const { getDbConnected } = require('../../config/database');
const mockDb = require('../../config/mockDb');
const { sendToUser } = require('../../config/socket');

/**
 * Fetch dashboard details for the technician.
 */
const getDashboardData = async (req, res, next) => {
  try {
    // Check database connection mode fallback
    if (!getDbConnected()) {
      const technician = mockDb.findOne('technicians', t => t.userId === req.user.id);
      if (!technician) {
        return res.status(200).json({
          success: true,
          technicianStatus: 'online',
          metrics: {
            completedCount: 0,
            todayEarnings: 0
          },
          activeService: null,
          assignedService: null,
          walletBalance: 0,
          notifications: []
        });
      }

      const completedServices = mockDb.find('bookings', b => b.technicianId === technician._id && b.status === 'service_completed');
      const activeService = mockDb.findOne('bookings', b => b.technicianId === technician._id && ['accepted', 'transit', 'arrived', 'service_started'].includes(b.status));
      const assignedService = mockDb.findOne('bookings', b => b.technicianId === technician._id && b.status === 'pending');

      const todayEarnings = completedServices.reduce((sum, b) => sum + (b.earnings || 0), 0);
      const wallet = mockDb.findOne('wallets', w => w.userId === req.user.id);

      return res.status(200).json({
        success: true,
        technicianStatus: technician.status || 'online',
        metrics: {
          completedCount: completedServices.length,
          todayEarnings
        },
        activeService,
        assignedService,
        walletBalance: wallet ? wallet.balance : 0,
        notifications: []
      });
    }

    const technician = await Technician.findOne({ userId: req.user.id });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    // Get today's range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Completed jobs today
    const completedServices = await Booking.find({
      technicianId: technician._id,
      status: 'service_completed',
      createdAt: { $gte: startOfToday } // Or completion time
    });

    // Active booking (if any)
    const activeService = await Booking.findOne({
      technicianId: technician._id,
      status: { $in: ['accepted', 'transit', 'arrived', 'service_started'] }
    });

    // Assigned booking (pending acceptance)
    const assignedService = await Booking.findOne({
      technicianId: technician._id,
      status: 'pending'
    });

    // Total earnings
    const wallet = await Wallet.findOne({ userId: req.user.id });

    // Recent notifications
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      technicianStatus: technician.status,
      metrics: {
        completedCount: completedServices.length,
        todayEarnings: completedServices.reduce((sum, b) => sum + (b.earnings || 0), 0)
      },
      activeService,
      assignedService,
      walletBalance: wallet ? wallet.balance : 0,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update availability status.
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const technician = await Technician.findOneAndUpdate(
      { userId: req.user.id },
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      status: technician.status
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept assigned booking.
 */
const acceptService = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const technician = await Technician.findOne({ userId: req.user.id });

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.technicianId = technician._id;
    booking.status = 'accepted';
    await booking.save();

    technician.status = 'busy';
    await technician.save();

    res.status(200).json({
      success: true,
      message: 'Service accepted successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start transit.
 */
const startTransit = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'transit';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Transit tracking active',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Arrive at Customer location.
 */
const arriveCustomer = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'arrived';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Arrived at site',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload before service photo and start.
 */
const uploadBeforePhoto = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path, 'services_before');
    }

    booking.status = 'service_started';
    booking.beforeServicePhoto = photoUrl;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Before service proof uploaded. Service started.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload after service photo.
 */
const uploadAfterPhoto = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path, 'services_after');
    }

    booking.afterServicePhoto = photoUrl;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'After service proof uploaded',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete Service with OTP, Signature upload and payout release.
 */
const completeService = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { otp } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid customer OTP code' });
    }

    let signatureUrl = '';
    if (req.file) {
      signatureUrl = await uploadToCloudinary(req.file.path, 'signatures');
    }

    booking.status = 'service_completed';
    booking.signatureUrl = signatureUrl;
    await booking.save();

    // Reset technician status to online
    const technician = await Technician.findById(booking.technicianId);
    if (technician) {
      technician.status = 'online';
      await technician.save();
    }

    // Release payout
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (wallet) {
      wallet.balance += booking.earnings;
      wallet.transactions.push({
        amount: booking.earnings,
        type: 'credit',
        description: `Earnings for Service Booking #${booking._id.toString().substring(18)}`,
        timestamp: new Date()
      });
      await wallet.save();

      // Trigger socket event for updated wallet balance
      sendToUser(req.user.id, 'wallet_updated', { balance: wallet.balance });
    }

    // Add completion notification
    await Notification.create({
      userId: req.user.id,
      title: 'Job Completed',
      message: `Completed Service Booking #${booking._id.toString().substring(18)}. ₹${booking.earnings} added to your wallet.`
    });

    res.status(200).json({
      success: true,
      message: 'Service completed successfully, payment released to wallet.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch technician completed service history.
 */
const getServiceHistory = async (req, res, next) => {
  try {
    const technician = await Technician.findOne({ userId: req.user.id });
    const bookings = await Booking.find({
      technicianId: technician._id,
      status: 'service_completed'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  updateStatus,
  acceptService,
  startTransit,
  arriveCustomer,
  uploadBeforePhoto,
  uploadAfterPhoto,
  completeService,
  getServiceHistory
};
