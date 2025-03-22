const express = require('express');
const hackathonController = require('../controllers/hackathonController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new hackathon (protected route)
router.post('/', authMiddleware, hackathonController.createHackathon);

// Get all hackathons (public route)
router.get('/', hackathonController.getHackathons);

module.exports = router;