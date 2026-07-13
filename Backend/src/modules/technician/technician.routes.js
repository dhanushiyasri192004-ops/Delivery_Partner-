const express = require('express');
const router = express.Router();
const {
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
} = require('./technician.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/role');
const upload = require('../../middleware/upload');

// Lock all routes to technicians only
router.use(protect, authorize('technician'));

router.get('/dashboard', getDashboardData);
router.patch('/status', updateStatus);
router.patch('/services/:bookingId/accept', acceptService);
router.patch('/services/:bookingId/transit', startTransit);
router.patch('/services/:bookingId/arrived', arriveCustomer);
router.post('/services/:bookingId/before-photo', upload.single('photo'), uploadBeforePhoto);
router.patch('/services/:bookingId/start', startService);
router.patch('/services/:bookingId/in-progress', startInProgress);
router.patch('/services/:bookingId/complete', completeService);
router.post('/services/:bookingId/after-photo', upload.single('photo'), uploadAfterPhoto);
router.post('/services/:bookingId/verify-otp', verifyOTP);
router.patch('/services/:bookingId/update-wallet', releasePayout);
router.patch('/services/:bookingId/close', closeJob);
router.get('/history', getServiceHistory);

module.exports = router;
