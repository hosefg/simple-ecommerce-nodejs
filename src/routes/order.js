
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController')

router.post('/create-order', orderController.createOrderFromCart);
router.get('/history', orderController.getAllUserOrder)
router.get('/:orderNumber', orderController.getOrderByOrderNumber);

module.exports = router;