const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword,resetPassword } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

module.exports = router;
