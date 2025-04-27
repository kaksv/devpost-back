const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const Project = require('../models/Project');

// Add caching to statsRoute.js
const cache = require('memory-cache');

router.get('/', async (req, res) => {
  try {
    const cachedStats = cache.get('stats');
    if (cachedStats) return res.json(cachedStats);

    const [totalHackathons, totalUsers, totalProjects] = await Promise.all([
      Hackathon.countDocuments(),
      User.countDocuments(),
      Project.countDocuments()
    ]);

    const stats = { totalHackathons, totalUsers, totalProjects };
    cache.put('stats', stats, 5 * 60 * 1000); // Cache for 5 minutes

    res.json({
      totalHackathons,
      totalUsers,
      totalProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;