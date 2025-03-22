const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new project (protected route)
router.post('/', authMiddleware, projectController.createProject);

// Get all projects (public route)
router.get('/', projectController.getProjects);

module.exports = router;