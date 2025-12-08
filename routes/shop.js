const shopController = require('../controllers/shop');


const express = require('express');
const router = express.Router();

//get
router.get('/',shopController.getIndex)
router.get('/signup',shopController.getSignup);
router.get('/login',shopController.getLogin)
router.get('/logout', shopController.getLogout);
router.get('/laundry',shopController.getLaundry);
router.get('/laundry/:id',shopController.getLaundryDetails);
router.get('/orders',shopController.getOrders);
//post
router.post('/signup',shopController.postSignup);
router.post('/login',shopController.postLogin);
router.post('/laundry/:id',shopController.postAddLaundryOrder);
router.post('/orders/:id/cancel',shopController.postCancleOrder);
module.exports = router;
