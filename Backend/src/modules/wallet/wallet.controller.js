const Wallet = require('./wallet.model');
const Withdrawal = require('./withdrawal.model');
const { sendToUser } = require('../../config/socket');
const { getDbConnected } = require('../../config/database');
const mockDb = require('../../config/mockDb');
const mongoose = require('mongoose');

/**
 * Fetch wallet balance and complete transaction ledger.
 */
const getWalletDetails = async (req, res, next) => {
  try {
    // Check database connection mode fallback
    if (!getDbConnected() || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      let wallet = mockDb.findOne('wallets', w => w.userId === req.user.id);
      if (!wallet) {
        wallet = mockDb.create('wallets', { userId: req.user.id, balance: 270, transactions: [
          {
            amount: 270,
            type: 'credit',
            description: 'Earnings for Order #567890',
            timestamp: new Date().toISOString()
          }
        ] });
      }

      // Read withdrawals from mockDb
      const withdrawals = mockDb.find('withdrawals', w => w.userId === req.user.id);

      return res.status(200).json({
        success: true,
        balance: wallet.balance,
        transactions: wallet.transactions,
        withdrawals: withdrawals || []
      });
    }

    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      // Lazy initialize wallet if missing
      wallet = await Wallet.create({ userId: req.user.id, balance: 0, transactions: [] });
    }

    const withdrawals = await Withdrawal.find({ userId: req.user.id }).sort({ requestDate: -1 });

    res.status(200).json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions,
      withdrawals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a withdrawal request.
 */
const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const withdrawalAmount = parseFloat(amount);

    if (isNaN(withdrawalAmount) || withdrawalAmount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is ₹100' });
    }

    if (!getDbConnected() || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      const wallet = mockDb.findOne('wallets', w => w.userId === req.user.id);
      if (!wallet || wallet.balance < withdrawalAmount) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }

      const newBalance = wallet.balance - withdrawalAmount;
      const transactions = [...(wallet.transactions || []), {
        amount: withdrawalAmount,
        type: 'debit',
        description: 'Withdrawal Request Submitted',
        timestamp: new Date().toISOString()
      }];
      mockDb.updateById('wallets', wallet._id, { balance: newBalance, transactions });

      const withdrawal = mockDb.create('withdrawals', {
        userId: req.user.id,
        amount: withdrawalAmount,
        status: 'pending',
        requestDate: new Date().toISOString()
      });

      return res.status(201).json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        withdrawal,
        balance: newBalance
      });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.balance < withdrawalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // Process debit from wallet balance
    wallet.balance -= withdrawalAmount;
    wallet.transactions.push({
      amount: withdrawalAmount,
      type: 'debit',
      description: `Withdrawal Request Submitted`,
      timestamp: new Date()
    });
    await wallet.save();

    // Create withdrawal log
    const withdrawal = await Withdrawal.create({
      userId: req.user.id,
      amount: withdrawalAmount,
      status: 'pending'
    });

    // Notify socket client of balance change
    sendToUser(req.user.id, 'wallet_updated', { balance: wallet.balance });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal,
      balance: wallet.balance
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWalletDetails,
  requestWithdrawal
};
