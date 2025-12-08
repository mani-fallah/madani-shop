// routes/owner.js
const express = require('express');
const router = express.Router();
const OwnerOrders = require('../models/owner-order');
const ownerController = require('../controllers/owner');
router.use(express.urlencoded({ extended: true }));

router.get('/orders', ownerController.getOwnerOrders);

router.post('/orders/:id/confirm', ownerController.postConfirmOrder);

module.exports = router;
