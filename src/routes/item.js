const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); 



router.post('/', itemController.createItem);

router.get('/:id', itemController.getItemByID);

router.get('/', itemController.getAllItem);

module.exports = router;