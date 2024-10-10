const express = require('express');
const router = express.Router();
const { getProducts, searchProducts, addProduct, updateProduct, deleteProduct, viewOrdersForProduct } = require('../controllers/productController');
const { authenticateAdmin } = require('../middlewares/authMiddleware');

// User routes
router.get('/all', getProducts);
router.get('/products/search/:productname', searchProducts);

// Admin routes (no authentication for simplicity)
router.post('/:productname/add',authenticateAdmin, addProduct);
router.put('/:productname/update/:id',authenticateAdmin, updateProduct);
router.delete('/:productname/delete/:id',authenticateAdmin, deleteProduct);
router.get('/orders/:productId', viewOrdersForProduct);

module.exports = router;
