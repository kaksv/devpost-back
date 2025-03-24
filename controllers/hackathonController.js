const Hackathon = require('../models/Hackathon');

// Create a new hackathon only for admins
exports.createHackathon = async (req, res) => {
  const { title, description, startDate, endDate, rules, prizes, imageUrl } = req.body;

  try {
    //Check if the user is an admin
    // Check if the user is an admin
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create hackathons' });
    }

    const hackathon = new Hackathon({
      title,
      description,
      startDate,
      endDate,
      rules,
      prizes,
      imageUrl, // Include imageUrl in the new hackathon
      createdBy: req.userId, // Set the creator to the logged-in user
    });

    await hackathon.save();
    res.status(201).json({ message: 'Hackathon created successfully', hackathon });
  } catch (err) {
    res.status(500).json({ message: 'Error creating hackathon', error: err.message });
  }
};

// Get all hackathons (public route)
exports.getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().populate('createdBy', 'name email');
    res.status(200).json(hackathons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hackathons', error: err.message });
  }
};

// Get a single hackathon by ID (public route)
exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate('createdBy', 'name email');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.status(200).json(hackathon);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hackathon', error: err.message });
  }
};