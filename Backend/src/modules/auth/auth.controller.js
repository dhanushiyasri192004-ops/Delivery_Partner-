const User = require('./user.model');
const DeliveryPartner = require('../deliveryPartner/delivery.model');
const Technician = require('../technician/technician.model');
const Executive = require('../executive/executive.model');
const Wallet = require('../wallet/wallet.model');
const authService = require('./auth.service');
const { uploadToCloudinary } = require('../../config/cloudinary');
const bcrypt = require('bcryptjs');
const { getDbConnected } = require('../../config/database');
const mockDb = require('../../config/mockDb');

/**
 * Register a user and their corresponding role profile.
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      mobileNumber,
      role,
      
      // Delivery Partner Profile parameters
      aadhaarNumber,
      panNumber,
      vehicleName,
      vehicleNumber,
      licenseNumber,
      
      // Technician Profile parameters
      technicianType,
      
      // Bank details
      bankName,
      accountHolderName,
      ifscCode,
      accountNumber,
      branch
    } = req.body;

    // Check database connection mode fallback
    if (!getDbConnected()) {
      const userExists = mockDb.findOne('users', u => u.email === email);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = mockDb.create('users', {
        name,
        email,
        password: hashedPassword,
        mobileNumber,
        role
      });

      mockDb.create('wallets', {
        userId: user._id,
        balance: 0,
        transactions: []
      });

      let rcBookUrl = '';
      if (req.file) {
        rcBookUrl = req.file.path;
      }

      let profileData = {};
      if (role === 'delivery_partner') {
        profileData = mockDb.create('deliveryPartners', {
          userId: user._id,
          aadhaarNumber,
          panNumber,
          vehicle: {
            name: vehicleName,
            number: vehicleNumber,
            licenseNumber,
            rcBookUrl
          },
          bankDetails: {
            bankName,
            accountHolderName,
            ifscCode,
            accountNumber,
            branch
          }
        });
      } else if (role === 'technician') {
        profileData = mockDb.create('technicians', {
          userId: user._id,
          aadhaarNumber,
          panNumber,
          technicianType,
          bankDetails: {
            bankName,
            accountHolderName,
            ifscCode,
            accountNumber,
            branch
          }
        });
      } else if (role === 'executive') {
        profileData = mockDb.create('executives', {
          userId: user._id,
          employeeId: 'EXE-' + Math.floor(100000 + Math.random() * 900000),
          status: 'online',
          isApproved: true
        });
      }

      const token = authService.generateToken(user);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        profile: profileData
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create the base user
    const user = await User.create({
      name,
      email,
      password,
      mobileNumber,
      role
    });

    // Create associated wallet
    await Wallet.create({
      userId: user._id,
      balance: 0,
      transactions: []
    });

    let profileData = {};
    let rcBookUrl = '';

    // Handle uploaded file (rcBook upload)
    if (req.file) {
      rcBookUrl = await uploadToCloudinary(req.file.path, 'rc_books');
    }

    // Parse and register profiles based on roles
    if (role === 'delivery_partner') {
      const partnerProfile = await DeliveryPartner.create({
        userId: user._id,
        aadhaarNumber,
        panNumber,
        vehicle: {
          name: vehicleName,
          number: vehicleNumber,
          licenseNumber,
          rcBookUrl
        },
        bankDetails: {
          bankName,
          accountHolderName,
          ifscCode,
          accountNumber,
          branch
        }
      });
      profileData = partnerProfile;
    } else if (role === 'technician') {
      const technicianProfile = await Technician.create({
        userId: user._id,
        aadhaarNumber,
        panNumber,
        technicianType,
        bankDetails: {
          bankName,
          accountHolderName,
          ifscCode,
          accountNumber,
          branch
        }
      });
      profileData = technicianProfile;
    } else if (role === 'executive') {
      const employeeId = 'EXE-' + Math.floor(100000 + Math.random() * 900000);
      const executiveProfile = await Executive.create({
        userId: user._id,
        employeeId
      });
      profileData = executiveProfile;
    }

    // Generate JWT token
    const token = authService.generateToken(user);

    // Send Welcome Email
    try {
      await authService.registerUser(user);
    } catch (e) {
      console.log('Skipping email error', e.message);
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile: profileData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user and return JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check database connection mode fallback
    if (!getDbConnected()) {
      const user = mockDb.findOne('users', u => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      let profile = null;
      if (user.role === 'delivery_partner') {
        profile = mockDb.findOne('deliveryPartners', p => p.userId === user._id);
      } else if (user.role === 'technician') {
        profile = mockDb.findOne('technicians', p => p.userId === user._id);
      } else if (user.role === 'executive') {
        profile = mockDb.findOne('executives', p => p.userId === user._id);
      }

      const token = authService.generateToken(user);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        profile
      });
    }

    // Find user and select password explicitly
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Retrieve profile details
    let profile = null;
    if (user.role === 'delivery_partner') {
      profile = await DeliveryPartner.findOne({ userId: user._id });
    } else if (user.role === 'technician') {
      profile = await Technician.findOne({ userId: user._id });
    } else if (user.role === 'executive') {
      profile = await Executive.findOne({ userId: user._id });
    }

    const token = authService.generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get currently authenticated user details.
 */
const getMe = async (req, res, next) => {
  try {
    // Check database connection mode fallback
    if (!getDbConnected()) {
      const user = mockDb.findOne('users', u => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      let profile = null;
      if (user.role === 'delivery_partner') {
        profile = mockDb.findOne('deliveryPartners', p => p.userId === user._id);
      } else if (user.role === 'technician') {
        profile = mockDb.findOne('technicians', p => p.userId === user._id);
      } else if (user.role === 'executive') {
        profile = mockDb.findOne('executives', p => p.userId === user._id);
      }

      return res.status(200).json({
        success: true,
        user,
        profile
      });
    }

    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'delivery_partner') {
      profile = await DeliveryPartner.findOne({ userId: user._id });
    } else if (user.role === 'technician') {
      profile = await Technician.findOne({ userId: user._id });
    } else if (user.role === 'executive') {
      profile = await Executive.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
