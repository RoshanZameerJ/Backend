const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const User = require('../models/user'); 

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'] 
});

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
};

const sendMessage = async (topic, message) => {
    await producer.send({
        topic,
        messages: [
            { value: JSON.stringify(message) },
        ],
    });
};

module.exports = { connectProducer, sendMessage };
