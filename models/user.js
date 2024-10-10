const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    loginId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    resetToken: {
        token: { type: String },
        expires: { type: Date }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
