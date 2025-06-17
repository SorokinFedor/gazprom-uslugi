const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', authController.registration);

router.post('/login', authController.login);

router.post('/activate', authController.activate);

router.get('/check', authMiddleware, authController.check);

module.exports = router;