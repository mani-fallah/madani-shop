const adminController = require('../controllers/admin');
const db = require('../util/database');

const express = require('express');
const router = express.Router();

//post
router.post('/see-users',adminController.postEditUser)
router.post('/add-provider', adminController.postAddProvider)
//get
router.get('/add-provider',adminController.getAddProviders)
router.get('/see-users/:userId',adminController.getUserDetail)
router.get('/',adminController.getAdminIndex);
router.get('/see-users',adminController.getAllUsers);
module.exports = router;