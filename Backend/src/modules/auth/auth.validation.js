const { body } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).+$/)
    .withMessage('Password must contain at least one uppercase letter, one number, and one special character'),
  body('mobileNumber')
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^\d{10}$/)
    .withMessage('Mobile number must be exactly 10 digits'),
  body('role')
    .isIn(['delivery_partner', 'technician', 'executive'])
    .withMessage('Role must be delivery_partner, technician, or executive'),
  
  // Conditionally validate delivery partner & technician properties
  body('aadhaarNumber')
    .if(body('role').isIn(['delivery_partner', 'technician']))
    .notEmpty()
    .withMessage('Aadhaar number is required')
    .matches(/^\d{12}$/)
    .withMessage('Aadhaar number must be exactly 12 digits'),
  body('panNumber')
    .if(body('role').isIn(['delivery_partner', 'technician']))
    .notEmpty()
    .withMessage('PAN number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)
    .withMessage('Enter a valid 10-character PAN card number'),
  
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
