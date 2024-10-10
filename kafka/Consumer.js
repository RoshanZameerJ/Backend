const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); 

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'] 
});

const consumer = kafka.consumer({ groupId: 'user-group' });

const connectConsumer = async () => {
    try {
        await consumer.connect();
        console.log('Consumer connected');
        await consumer.subscribe({ topic: 'user-registration', fromBeginning: true });
        console.log(`Subscribed to topic: user-registration`);

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                await handleMessage(message);
            },
        });
    } catch (err) {
        console.error('Error connecting consumer:', err);
    }
};

const handleMessage = async (message) => {
    try {
        const userData = JSON.parse(message.value.toString());
        console.log('Received user data:', userData);

        const existingUser = await User.findOne({ 
            $or: [{ email: userData.email }, { loginId: userData.loginId }] 
        });

        if (existingUser) {
            console.error('Email or Login ID already in use:', userData.email, userData.loginId);
            return;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
            ...userData,
            password: hashedPassword,
        });

        await newUser.save();
        console.log('User registered successfully:', newUser);
    } catch (err) {
        console.error('Error processing message:', err);
    }
};

module.exports = { connectConsumer };
