const express = require('express');
const hackathonController = require('../controllers/hackathonController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new hackathon (protected route)
router.post('/', authMiddleware, hackathonController.createHackathon);

// Get all hackathons (public route)
router.get('/', hackathonController.getHackathons);

// Get a single hackathon by ID (public route)
router.get('/:id', hackathonController.getHackathonById);

// Participate in a hackathon (protected route)
router.post('/:id/participate', authMiddleware, hackathonController.participate);

// Check participation status (protected route)
router.get('/:id/check-participation', authMiddleware, hackathonController.checkParticipation);

module.exports = router;