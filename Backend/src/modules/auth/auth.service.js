const jwt = require('jsonwebtoken');
const User = require('./user.model');
const config = require('../../config/env');
const { sendEmail } = require('../../config/mail');

/**
 * Sign JWT token for standard payload.
 * @param {Object} user - User document
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

/**
 * Register a general user profile.
 * @param {Object} userData 
 */
const registerUser = async (userData) => {
  const user = await User.create(userData);
  
  // Try sending a welcome email asynchronously
  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Delivery Partner Portal!',
      text: `Hello ${user.name},\n\nWelcome to the Delivery Partner Management System! Your account has been registered successfully as a ${user.role}.\n\nPlease wait for the administrator to review and verify your account documents.\n\nBest Regards,\nOperations Team`
    });
  } catch (error) {
    console.error('Welcome email failed to dispatch, continuing registration:', error.message);
  }

  return user;
};

module.exports = {
  generateToken,
  registerUser
};
