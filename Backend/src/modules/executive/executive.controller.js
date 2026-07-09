const ExecutiveTrip = require('./trip.model');
const Executive = require('./executive.model');
const Notification = require('../notifications/notification.model');
const { uploadToCloudinary } = require('../../config/cloudinary');
const { getDbConnected } = require('../../config/database');
const mockDb = require('../../config/mockDb');

/**
 * Fetch dashboard details for the executive.
 */
const getDashboardData = async (req, res, next) => {
  try {
    // Check database connection mode fallback
    if (!getDbConnected()) {
      const executive = mockDb.findOne('executives', e => e.userId === req.user.id);
      if (!executive) {
        return res.status(200).json({
          success: true,
          executiveStatus: 'online',
          metrics: {
            completedCount: 0,
            assignedCount: 0
          },
          activeTrip: null,
          assignedTrip: null
        });
      }

      const completedCount = mockDb.find('trips', t => t.executiveId === executive._id && t.status === 'completed').length;
      const activeTrip = mockDb.findOne('trips', t => t.executiveId === executive._id && ['accepted', 'transit'].includes(t.status));
      const assignedTrip = mockDb.findOne('trips', t => t.executiveId === executive._id && t.status === 'pending');

      return res.status(200).json({
        success: true,
        executiveStatus: executive.status || 'online',
        metrics: {
          completedCount,
          assignedCount: assignedTrip ? 1 : 0
        },
        activeTrip,
        assignedTrip
      });
    }

    const executive = await Executive.findOne({ userId: req.user.id });
    if (!executive) {
      return res.status(404).json({ success: false, message: 'Executive profile not found' });
    }

    // Active trip (accepted or transit)
    const activeTrip = await ExecutiveTrip.findOne({
      executiveId: executive._id,
      status: { $in: ['accepted', 'transit'] }
    });

    // Assigned trip (pending acceptance)
    const assignedTrip = await ExecutiveTrip.findOne({
      executiveId: executive._id,
      status: 'pending'
    });

    // Completed count
    const completedCount = await ExecutiveTrip.countDocuments({
      executiveId: executive._id,
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      executiveStatus: executive.status,
      metrics: {
        completedCount,
        assignedCount: assignedTrip ? 1 : 0
      },
      activeTrip,
      assignedTrip
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
    const executive = await Executive.findOneAndUpdate(
      { userId: req.user.id },
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      status: executive.status
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept assigned trip.
 */
const acceptTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const executive = await Executive.findOne({ userId: req.user.id });

    const trip = await ExecutiveTrip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    trip.executiveId = executive._id;
    trip.status = 'accepted';
    await trip.save();

    executive.status = 'busy';
    await executive.save();

    res.status(200).json({
      success: true,
      message: 'Trip accepted successfully',
      trip
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start travel transit.
 */
const startTravel = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await ExecutiveTrip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    trip.status = 'transit';
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Travel tracker activated',
      trip
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Close Trip with completion photo validation.
 */
const closeTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await ExecutiveTrip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path, 'executive_trips');
    }

    trip.status = 'completed';
    trip.completionPhoto = photoUrl;
    trip.completedAt = new Date();
    await trip.save();

    // Reset status to online
    const executive = await Executive.findById(trip.executiveId);
    if (executive) {
      executive.status = 'online';
      await executive.save();
    }

    // Add trip notification
    await Notification.create({
      userId: req.user.id,
      title: 'Trip Closed',
      message: `Trip #${trip._id.toString().substring(18)} was closed successfully.`
    });

    res.status(200).json({
      success: true,
      message: 'Trip closed and completion photo saved.',
      trip
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch executive completed trip history.
 */
const getTripHistory = async (req, res, next) => {
  try {
    const executive = await Executive.findOne({ userId: req.user.id });
    const trips = await ExecutiveTrip.find({
      executiveId: executive._id,
      status: 'completed'
    }).sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      trips
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  updateStatus,
  acceptTrip,
  startTravel,
  closeTrip,
  getTripHistory
};
