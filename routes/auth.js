const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();


router.get('/login', authController.getLogin);
// router.post('/login', );

module.exports = router;