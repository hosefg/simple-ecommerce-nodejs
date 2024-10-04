const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')
const authenticateUser = require('../middleware/authenticateUser'); 



router.post('/item', authenticateUser, cartController.addItemtoCart);

router.get('/', authenticateUser, cartController.getUserCart);
  
  module.exports = router;