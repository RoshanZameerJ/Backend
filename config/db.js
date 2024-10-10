const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}

const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // 60 seconds
    connectTimeoutMS: 60000, // 60 seconds
    socketTimeoutMS: 60000
};

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, options);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

module.exports = connectDB;
