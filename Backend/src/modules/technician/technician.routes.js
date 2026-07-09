const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  updateStatus,
  acceptService,
  startTransit,
  arriveCustomer,
  uploadBeforePhoto,
  uploadAfterPhoto,
  completeService,
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
router.post('/services/:bookingId/after-photo', upload.single('photo'), uploadAfterPhoto);
router.post('/services/:bookingId/complete', upload.single('signature'), completeService);
router.get('/history', getServiceHistory);

module.exports = router;
