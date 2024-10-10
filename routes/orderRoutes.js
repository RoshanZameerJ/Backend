const express = require('express');
const router = express.Router();
const { placeOrder, viewAllOrders, viewUserOrders } = require('../controllers/orderController'); 
const authenticateUser = require('../middlewares/authMiddlewareuser');
const { authenticateAdmin } = require('../middlewares/authMiddleware');

router.post('/place', authenticateUser, placeOrder); 

router.get('/all-orders', authenticateAdmin, viewAllOrders); 

router.get('/my-orders', authenticateUser, viewUserOrders);

module.exports = router;
