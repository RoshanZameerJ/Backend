const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    features: { type: [String] },
    status: { type: String, default: 'Available' },
    quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
