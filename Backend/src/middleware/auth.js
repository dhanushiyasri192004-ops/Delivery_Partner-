const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../modules/auth/auth.service'); // We'll export checkUser from auth.service or define model query directly here

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Inject decoded user data into the request object
    req.user = decoded; // { id: '...', role: '...' }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid token.'
    });
  }
};

module.exports = { protect };
