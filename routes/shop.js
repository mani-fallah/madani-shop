const shopController = require('../controllers/shop');


const express = require('express');
const router = express.Router();

//get
router.get('/',shopController.getIndex)
router.get('/signup',shopController.getSignup);
router.get('/login',shopController.getLogin)
router.get('/logout', shopController.getLogout);
//post
router.post('/signup',shopController.postSignup);
router.post('/login',shopController.postLogin);
module.exports = router;
