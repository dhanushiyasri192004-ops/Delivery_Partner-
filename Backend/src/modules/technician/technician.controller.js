const Booking = require('../bookings/booking.model');
const Technician = require('./technician.model');
const Wallet = require('../wallet/wallet.model');
const Notification = require('../notifications/notification.model');
const { uploadToCloudinary } = require('../../config/cloudinary');
const { getDbConnected } = require('../../config/database');
const mockDb = require('../../config/mockDb');
const { sendToUser } = require('../../config/socket');

// Helper to check if date is today
const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

// Helper to check if date is within last 7 days
const isThisWeek = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  const diffTime = Math.abs(today - d);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

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
            assignedCount: 0,
            activeCount: 0,
            completedCount: 0,
            cancelledCount: 0,
            todayEarnings: 0,
            weeklyEarnings: 0,
            walletBalance: 0,
            customerRating: 4.8
          },
          activeService: null,
          assignedService: null,
          walletBalance: 0,
          notifications: []
        });
      }

      const allBookings = mockDb.find('bookings', b => b.technicianId === technician._id);
      const completedServices = allBookings.filter(b => ['closed', 'wallet_updated', 'service_completed'].includes(b.status));
      const activeService = mockDb.findOne('bookings', b => b.technicianId === technician._id && ['accepted', 'transit', 'arrived', 'before_photo_uploaded', 'service_started', 'in_progress', 'completed', 'after_photo_uploaded', 'otp_verified'].includes(b.status));
      const assignedService = mockDb.findOne('bookings', b => b.technicianId === technician._id && b.status === 'pending');

      const assignedCount = allBookings.filter(b => b.status === 'pending').length;
      const activeCount = allBookings.filter(b => ['accepted', 'transit', 'arrived', 'before_photo_uploaded', 'service_started', 'in_progress', 'completed', 'after_photo_uploaded', 'otp_verified'].includes(b.status)).length;
      const completedCount = completedServices.length;
      const cancelledCount = allBookings.filter(b => b.status === 'cancelled').length;

      const todayEarnings = completedServices
        .filter(b => isToday(b.completionTime || b.updatedAt))
        .reduce((sum, b) => sum + (b.earnings || 0), 0);

      const weeklyEarnings = completedServices
        .filter(b => isThisWeek(b.completionTime || b.updatedAt))
        .reduce((sum, b) => sum + (b.earnings || 0), 0);

      const wallet = mockDb.findOne('wallets', w => w.userId === req.user.id);
      const walletBalance = wallet ? wallet.balance : 0;

      return res.status(200).json({
        success: true,
        technicianStatus: technician.status || 'online',
        metrics: {
          assignedCount,
          activeCount,
          completedCount,
          cancelledCount,
          todayEarnings,
          weeklyEarnings,
          walletBalance,
          customerRating: 4.8
        },
        activeService,
        assignedService,
        walletBalance,
        notifications: []
      });
    }

    // Mongoose path
    const technician = await Technician.findOne({ userId: req.user.id });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    const allBookings = await Booking.find({ technicianId: technician._id });
    const completedServices = allBookings.filter(b => ['closed', 'wallet_updated', 'service_completed'].includes(b.status));
    
    const activeService = await Booking.findOne({
      technicianId: technician._id,
      status: { $in: ['accepted', 'transit', 'arrived', 'before_photo_uploaded', 'service_started', 'in_progress', 'completed', 'after_photo_uploaded', 'otp_verified'] }
    });

    const assignedService = await Booking.findOne({
      technicianId: technician._id,
      status: 'pending'
    });

    const assignedCount = allBookings.filter(b => b.status === 'pending').length;
    const activeCount = allBookings.filter(b => ['accepted', 'transit', 'arrived', 'before_photo_uploaded', 'service_started', 'in_progress', 'completed', 'after_photo_uploaded', 'otp_verified'].includes(b.status)).length;
    const completedCount = completedServices.length;
    const cancelledCount = allBookings.filter(b => b.status === 'cancelled').length;

    const todayEarnings = completedServices
      .filter(b => isToday(b.completionTime || b.updatedAt))
      .reduce((sum, b) => sum + (b.earnings || 0), 0);

    const weeklyEarnings = completedServices
      .filter(b => isThisWeek(b.completionTime || b.updatedAt))
      .reduce((sum, b) => sum + (b.earnings || 0), 0);

    const wallet = await Wallet.findOne({ userId: req.user.id });
    const walletBalance = wallet ? wallet.balance : 0;

    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      technicianStatus: technician.status,
      metrics: {
        assignedCount,
        activeCount,
        completedCount,
        cancelledCount,
        todayEarnings,
        weeklyEarnings,
        walletBalance,
        customerRating: 4.8
      },
      activeService,
      assignedService,
      walletBalance,
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
    
    if (!getDbConnected()) {
      const technician = mockDb.findOne('technicians', t => t.userId === req.user.id);
      if (!technician) {
        return res.status(404).json({ success: false, message: 'Technician not found' });
      }
      technician.status = status;
      mockDb.save('technicians', technician);
      return res.status(200).json({
        success: true,
        message: `Status updated to ${status}`,
        status: technician.status
      });
    }

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

    if (!getDbConnected()) {
      const technician = mockDb.findOne('technicians', t => t.userId === req.user.id);
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.technicianId = technician._id;
      booking.status = 'accepted';
      mockDb.save('bookings', booking);

      technician.status = 'busy';
      mockDb.save('technicians', technician);

      return res.status(200).json({
        success: true,
        message: 'Service accepted successfully',
        booking
      });
    }

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

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'transit';
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'Transit tracking active',
        booking
      });
    }

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
 * Arrive at Customer location (Save Arrival Time and GPS Location).
 */
const arriveCustomer = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { latitude, longitude } = req.body;

    const lat = latitude || 12.9716;
    const lng = longitude || 77.5946;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'arrived';
      booking.arrivalTime = new Date().toISOString();
      booking.arrivalLocation = { latitude: lat, longitude: lng };
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'Arrived at site and arrival time logged',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'arrived';
    booking.arrivalTime = new Date();
    booking.arrivalLocation = { latitude: lat, longitude: lng };
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Arrived at site and arrival time logged',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload before service photo.
 */
const uploadBeforePhoto = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      let photoUrl = '/uploads/dummy_before.jpg';
      if (req.file) {
        photoUrl = req.file.path;
      }
      booking.status = 'before_photo_uploaded';
      booking.beforeServicePhoto = photoUrl;
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'Before service photo uploaded',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path, 'services_before');
    }

    booking.status = 'before_photo_uploaded';
    booking.beforeServicePhoto = photoUrl;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Before service photo uploaded',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start service work.
 */
const startService = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'service_started';
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'Service started',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'service_started';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Service started',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start In Progress phase.
 */
const startInProgress = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'in_progress';
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'Service in progress',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'in_progress';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Service in progress',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete Service (Save Completion Time and GPS Location).
 */
const completeService = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { latitude, longitude } = req.body;

    const lat = latitude || 12.9716;
    const lng = longitude || 77.5946;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'completed';
      booking.completionTime = new Date().toISOString();
      booking.completionLocation = { latitude: lat, longitude: lng };
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'Service completed, verification pending',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'completed';
    booking.completionTime = new Date();
    booking.completionLocation = { latitude: lat, longitude: lng };
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Service completed, verification pending',
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

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      let photoUrl = '/uploads/dummy_after.jpg';
      if (req.file) {
        photoUrl = req.file.path;
      }
      booking.status = 'after_photo_uploaded';
      booking.afterServicePhoto = photoUrl;
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'After service photo uploaded',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path, 'services_after');
    }

    booking.status = 'after_photo_uploaded';
    booking.afterServicePhoto = photoUrl;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'After service photo uploaded',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Customer OTP.
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { otp } = req.body;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      if (booking.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid customer OTP code' });
      }
      booking.status = 'otp_verified';
      mockDb.save('bookings', booking);
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid customer OTP code' });
    }

    booking.status = 'otp_verified';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Wallet with booking earnings.
 */
const releasePayout = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      
      booking.status = 'wallet_updated';
      mockDb.save('bookings', booking);

      const wallet = mockDb.findOne('wallets', w => w.userId === req.user.id);
      if (wallet) {
        wallet.balance += (booking.earnings || 0);
        wallet.transactions.push({
          amount: booking.earnings,
          type: 'credit',
          description: `Earnings for Service Booking #${booking._id.toString().substring(18)}`,
          timestamp: new Date().toISOString()
        });
        mockDb.save('wallets', wallet);
        sendToUser(req.user.id, 'wallet_updated', { balance: wallet.balance });
      }

      return res.status(200).json({
        success: true,
        message: 'Wallet updated and payout released',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'wallet_updated';
    await booking.save();

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
      sendToUser(req.user.id, 'wallet_updated', { balance: wallet.balance });
    }

    res.status(200).json({
      success: true,
      message: 'Wallet updated and payout released',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Close Job and set technician Available.
 */
const closeJob = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!getDbConnected()) {
      const booking = mockDb.findById('bookings', bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'closed';
      mockDb.save('bookings', booking);

      const technician = mockDb.findOne('technicians', t => t.userId === req.user.id);
      if (technician) {
        technician.status = 'online';
        mockDb.save('technicians', technician);
      }

      return res.status(200).json({
        success: true,
        message: 'Job closed successfully. Technician is now available.',
        booking
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'closed';
    await booking.save();

    const technician = await Technician.findOne({ userId: req.user.id });
    if (technician) {
      technician.status = 'online';
      await technician.save();
    }

    res.status(200).json({
      success: true,
      message: 'Job closed successfully. Technician is now available.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch technician completed/closed service history.
 */
const getServiceHistory = async (req, res, next) => {
  try {
    if (!getDbConnected()) {
      const technician = mockDb.findOne('technicians', t => t.userId === req.user.id);
      if (!technician) {
        return res.status(200).json({ success: true, bookings: [] });
      }
      const bookings = mockDb.find('bookings', b => b.technicianId === technician._id && ['service_completed', 'completed', 'after_photo_uploaded', 'otp_verified', 'wallet_updated', 'closed'].includes(b.status));
      return res.status(200).json({
        success: true,
        bookings
      });
    }

    const technician = await Technician.findOne({ userId: req.user.id });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }
    const bookings = await Booking.find({
      technicianId: technician._id,
      status: { $in: ['service_completed', 'completed', 'after_photo_uploaded', 'otp_verified', 'wallet_updated', 'closed'] }
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
  startService,
  startInProgress,
  completeService,
  uploadAfterPhoto,
  verifyOTP,
  releasePayout,
  closeJob,
  getServiceHistory
};
