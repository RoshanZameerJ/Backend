const Order = require('../models/order');
const Product = require('../models/product');

// Place an order
exports.placeOrder = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;
    if (!productId || !quantity) return res.status(400).json({ msg: 'Product ID and quantity are required' });

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.quantity < quantity) return res.status(400).json({ msg: 'Insufficient stock' });

        const newOrder = new Order({ productId, quantity, userId });
        await newOrder.save();

        product.quantity -= quantity;
        await product.save();

        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Place an order
/*exports.placeOrder = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.quantity < quantity) {
            return res.status(400).json({ msg: 'Insufficient stock' });
        }

        const newOrder = new Order({
            userId,
            productId,
            quantity
        });

        await newOrder.save();
        product.quantity -= quantity;
        if (product.quantity === 0) {
            product.status = 'OUT OF STOCK';
        } else {
            product.status = 'HURRY UP TO PURCHASE';
        }
        await product.save();

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};*/


// View orders placed by a user
exports.viewUserOrders = async (req, res) => {
    const userId = req.userId; // From authentication middleware
    try {
        const orders = await Order.find({ userId }).populate('productId', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

/* // View all orders
exports.viewAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('productId', 'name price').populate('userId', 'loginId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}; */
exports.viewAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ msg: 'Error retrieving orders', error });
    }
};
