const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Add this new route
router.get('/me/participations', authMiddleware, userController.getUserParticipations);

module.exports = router;