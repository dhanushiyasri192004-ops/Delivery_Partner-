const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  updateStatus,
  acceptTrip,
  startTravel,
  closeTrip,
  getTripHistory
} = require('./executive.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/role');
const upload = require('../../middleware/upload');

// Lock all routes to executives only
router.use(protect, authorize('executive'));

router.get('/dashboard', getDashboardData);
router.patch('/status', updateStatus);
router.patch('/trips/:tripId/accept', acceptTrip);
router.patch('/trips/:tripId/transit', startTravel);
router.post('/trips/:tripId/complete', upload.single('photo'), closeTrip);
router.get('/history', getTripHistory);

module.exports = router;
