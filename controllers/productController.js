const Product = require('../models/product');
const Order = require('../models/order');



// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Search products by name
exports.searchProducts = async (req, res) => {
    const { productname } = req.params;
    try {
        const products = await Product.find({ name: new RegExp(productname, 'i') });
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    const { name, description, price, features, status, quantity } = req.body;
    if (!name) return res.status(400).json({ msg: 'Product name is required' });
    if (price == null) return res.status(400).json({ msg: 'Product price is required' });
    if (quantity == null) return res.status(400).json({ msg: 'Product quantity is required' });

    try {
        const newProduct = new Product({ name, description, price, features, status, quantity });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Validate the updates
        if (updates.name !== undefined) {
            if (typeof updates.name !== 'string' || !updates.name.trim()) {
                return res.status(400).json({ msg: 'Product name must be a non-empty string' });
            }
            product.name = updates.name.trim();
        }

        if (updates.price !== undefined) {
            if (isNaN(updates.price)) {
                return res.status(400).json({ msg: 'Product price must be a number' });
            }
            product.price = parseFloat(updates.price);
        }

        if (updates.quantity !== undefined) {
            if (isNaN(updates.quantity)) {
                return res.status(400).json({ msg: 'Product quantity must be a number' });
            }
            product.quantity = parseInt(updates.quantity, 10);
        }

        if (updates.description !== undefined) {
            if (typeof updates.description !== 'string') {
                return res.status(400).json({ msg: 'Product description must be a string' });
            }
            product.description = updates.description.trim();
        }

        if (updates.features !== undefined) {
            if (!Array.isArray(updates.features) || !updates.features.every(feature => typeof feature === 'string')) {
                return res.status(400).json({ msg: 'Product features must be an array of strings' });
            }
            product.features = updates.features.map(feature => feature.trim());
        }

        // Save the updated product
        await product.save();
        res.json(product);
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


// Delete a product

/* exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await sendDeleteMessage(id);
        res.json({ msg: 'Delete request sent to Kafka' });
    } catch (err) {
        console.error('Error in deleteProduct:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
 */

 exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json({ msg: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}; 

// View orders for a product
exports.viewOrdersForProduct = async (req, res) => {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ msg: 'Product ID is required' });

    try {
        const ordersCount = await Order.countDocuments({ productId });
        res.json({ productId, ordersCount });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
