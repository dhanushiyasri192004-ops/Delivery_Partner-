const { body } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('mobileNumber').notEmpty().withMessage('Mobile number is required'),
  body('role')
    .isIn(['delivery_partner', 'technician', 'executive'])
    .withMessage('Role must be delivery_partner, technician, or executive'),
  
  // Conditionally validate delivery partner properties
  body('aadhaarNumber').if(body('role').equals('delivery_partner')).notEmpty().withMessage('Aadhaar number is required'),
  body('panNumber').if(body('role').equals('delivery_partner')).notEmpty().withMessage('PAN number is required'),
  
  // Conditionally validate vehicle details
  body('vehicleName').if(body('role').equals('delivery_partner')).notEmpty().withMessage('Vehicle Name is required'),
  body('vehicleNumber').if(body('role').equals('delivery_partner')).notEmpty().withMessage('Vehicle Number is required'),
  body('licenseNumber').if(body('role').equals('delivery_partner')).notEmpty().withMessage('Driving License Number is required'),

  // Conditionally validate technician categories
  body('technicianType').if(body('role').equals('technician')).notEmpty().withMessage('Technician type classification is required')
];

const loginRules = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
  registerRules,
  loginRules
};
