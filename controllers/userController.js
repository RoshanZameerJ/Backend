const User = require('../models/user');
const Admin =require('../models/admin')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { SECRET_KEY } = require('../config/config');
const { sendMessage } = require('../kafka/Producer');
// Register
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, loginId, password, confirmPassword, contactNumber } = req.body;

    // Validation
    if (!firstName) return res.status(400).json({ msg: 'First name is required' });
    if (!lastName) return res.status(400).json({ msg: 'Last name is required' });
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    if (!loginId) return res.status(400).json({ msg: 'Login ID is required' });
    if (!password) return res.status(400).json({ msg: 'Password is required' });
    if (!confirmPassword) return res.status(400).json({ msg: 'Confirm password is required' });
    if (!contactNumber) return res.status(400).json({ msg: 'Contact number is required' });

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { loginId }] });
        if (existingUser) return res.status(400).json({ msg: 'Email or Login ID already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, loginId, password: hashedPassword, contactNumber });
        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}; 
//askafka

 /*exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, loginId, password, confirmPassword, contactNumber } = req.body;

    // Validation
    if (!firstName) return res.status(400).json({ msg: 'First name is required' });
    if (!lastName) return res.status(400).json({ msg: 'Last name is required' });
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    if (!loginId) return res.status(400).json({ msg: 'Login ID is required' });
    if (!password) return res.status(400).json({ msg: 'Password is required' });
    if (!confirmPassword) return res.status(400).json({ msg: 'Confirm password is required' });
    if (!contactNumber) return res.status(400).json({ msg: 'Contact number is required' });

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        // Send registration message to Kafka
        const user = { firstName, lastName, email, loginId, password, contactNumber };
        await sendMessage('user-registration', user);

        res.status(201).json({ msg: 'User registration in process' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}; */


// Login
/* exports.loginUser = async (req, res) => {
    const { loginId, password } = req.body;

    // Validation
    if (!loginId) return res.status(400).json({ msg: 'Login ID is required' });
    if (!password) return res.status(400).json({ msg: 'Password is required' });

    try {
        const user = await User.findOne({ loginId });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}; */
//login
exports.loginUser = async (req, res) => {
    const { loginId, password } = req.body;

    // Validation
    if (!loginId) return res.status(400).json({ msg: 'Login ID is required' });
    if (!password) return res.status(400).json({ msg: 'Password is required' });

    try {
        // Check User model first
        let user = await User.findOne({ loginId });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
                return res.json({ token });
            }
        }

        // Check Admin model if not found in User model
        let admin = await Admin.findOne({ loginId });
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                const token = jwt.sign({ id: admin._id, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
                return res.json({ token });
            }
        }

        // If no user or admin matches
        res.status(400).json({ msg: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { loginId } = req.query;
    if (!loginId) return res.status(400).json({ msg: 'Login ID is required' });

    try {
        const user = await User.findOne({ loginId });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });
        const token = crypto.randomBytes(32).toString('hex');
       // const expires = Date.now() + 3600000; // 1 hour
       const expires = new Date(Date.now() + 3600000);
        console.log('Generated reset token:', { token, expires });

    
        user.resetToken = { token, expires };
        await user.save();

       
        res.json({ msg: 'Password reset token generated', token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const{ token }  =req.params;
    const { newPassword } = req.body;
    try {
        if (!token) return res.status(400).json({ msg: 'Token is required' });
        if (!newPassword) return res.status(400).json({ msg: 'New password is required' });
        
        const user = await User.findOne({
            'resetToken.token': token,
            'resetToken.expires': { $gt: new Date() }
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear the reset token
        user.password = hashedPassword;
        user.resetToken = {}; // Clear the reset token
        //console.log('Updating user with reset token:', { token, expires });
        await user.save();
        console.log('User updated successfully:', user);

        res.json({ msg: 'Password has been reset successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
