const Project = require('../models/Project');

// Create a new project (only for users)
exports.createProject = async (req, res) => {
  const { title, description, hackathon, team, demoUrl, imageUrl } = req.body;

  try {
    // Check if the useer is a regular user
    if (req.role !== 'user') {
        return res.status(403).json({ message: 'Only Participants can create projects' });
      }

    const project = new Project({
      title,
      description,
      hackathon,
      team, // Array of user IDs
      demoUrl,
      imageUrl,
      createdBy: req.userId, // Set the creator to the logged-in user
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('hackathon', 'title')
      .populate('team', 'name email')
      .populate('createdBy', 'name email');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};