const express = require('express');
const router = express.Router();
const { getWalletDetails, requestWithdrawal } = require('./wallet.controller');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.get('/', getWalletDetails);
router.post('/withdraw', requestWithdrawal);

module.exports = router;
