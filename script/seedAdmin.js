const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/admin'); // Adjust path as necessary

dotenv.config(); // Ensure this is at the very top

// Debugging output
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('ADMIN_LOGIN_ID:', process.env.ADMIN_LOGIN_ID);
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);

const { MONGO_URI, ADMIN_LOGIN_ID, ADMIN_PASSWORD } = process.env;

if (!MONGO_URI || !ADMIN_LOGIN_ID || !ADMIN_PASSWORD) {
    throw new Error('Missing environment variables');
}

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ loginId: ADMIN_LOGIN_ID });
        if (existingAdmin) {
            console.log('Admin already exists');
            await mongoose.disconnect();
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Create a new admin user
        const admin = new Admin({
            loginId: ADMIN_LOGIN_ID,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin user created');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

seedAdmin();
