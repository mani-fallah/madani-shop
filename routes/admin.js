const adminController = require('../controllers/admin');
const db = require('../util/database');

const express = require('express');
const router = express.Router();

//get
router.get('/see-users',adminController.getAllUsers);

module.exports = router;