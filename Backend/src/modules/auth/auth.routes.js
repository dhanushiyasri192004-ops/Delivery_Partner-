const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('./auth.controller');
const { registerRules, loginRules } = require('./auth.validation');
const validate = require('../../middleware/validator');
const upload = require('../../middleware/upload');
const { protect } = require('../../middleware/auth');

// Register endpoint accepts multipart forms for RC book upload
router.post('/register', upload.single('rcBook'), registerRules, validate, register);

// Login endpoint
router.post('/login', loginRules, validate, login);

// Get current profile
router.get('/me', protect, getMe);

module.exports = router;
