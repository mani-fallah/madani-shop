const shopController = require('../controllers/shop');


const express = require('express');
const router = express.Router();


router.get('/signup',shopController.getSignup);
router.get('/login',shopController.getLogin)

router.post('/signup',shopController.postSignup);
router.post('/login',shopController.postLogin);
module.exports = router;
