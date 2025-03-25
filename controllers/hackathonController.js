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

// Participate in a hackathon
exports.participate = async (req, res) => {
  try {
    // Verify hackathon exists
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    
    // Check if user is already participating
    const existingParticipant = hackathon.participants.find(
      p => p.user.toString() === req.userId.toString()
    );

    if (existingParticipant) {
      return res.status(200).json({  // Change from 400 to 200 since we'll handle this as success
        success: true,
        alreadyParticipating: true,
        hackathonId: hackathon._id
      });
    }

    // Add user to participants
    hackathon.participants.push({ user: req.userId });
    await hackathon.save();

    res.status(200).json({ 
      success: true,
      hackathonId: hackathon._id,
      message: 'Successfully joined hackathon'
    });

    // hackathon.participants.push(req.userId);
    // await hackathon.save();

    // res.status(200).json({ 
    //   message: 'Successfully joined hackathon',
    //   redirectTo: `/submit-project/${req.params.id}` // Frontend will handle redirection
    // });
  } catch (err) {
    console.error('Participation error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error participating in hackathon',
      error: err.message
    });
  }
};

// Check participation status
exports.checkParticipation = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
    .select('participants title')
    .lean();
    if (!hackathon) {
      return res.status(404).json({
        isParticipating: false,
         message: 'Hackathon not found'
         });
    }

    const isParticipating = hackathon.participants.some(
      p => p.user.toString() === req.userId.toString()
    );

    res.status(200).json({ isParticipating });
  } catch (err) {
    res.status(500).json({
      isParticipating: false,
      message: 'Error checking participation'
    });
  }
  //   const isParticipating = hackathon.participants.includes(req.userId);
  //   res.status(200).json({ isParticipating });
  // } catch (err) {
  //   res.status(500).json({ message: 'Error checking participation', error: err.message });
  // }
};