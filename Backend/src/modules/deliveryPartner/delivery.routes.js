const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  updateStatus,
  acceptOrder,
  reachedVendor,
  verifyPickup,
  reachedCustomer,
  verifyDelivery,
  getOrderHistory
} = require('./delivery.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/role');
const upload = require('../../middleware/upload');

// Lock all routes to delivery partners only
router.use(protect, authorize('delivery_partner'));

router.get('/dashboard', getDashboardData);
router.patch('/status', updateStatus);
router.patch('/orders/:orderId/accept', acceptOrder);
router.patch('/orders/:orderId/reached-vendor', reachedVendor);
router.post('/orders/:orderId/verify-pickup', upload.single('photo'), verifyPickup);
router.patch('/orders/:orderId/reached-customer', reachedCustomer);
router.post('/orders/:orderId/verify-delivery', upload.single('photo'), verifyDelivery);
router.get('/history', getOrderHistory);

module.exports = router;
