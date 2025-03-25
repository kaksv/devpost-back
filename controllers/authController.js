const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role, redirectTo } = req.body; //Add the redirectTo parameter

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Default role to 'user' if not provided
    const userRole = role === 'admin' ? 'admin' : 'user';

    user = new User({ name, email, password, role: userRole });
    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      token,
      redirectTo: redirectTo || (userRole === 'admin' ? '/hackathons' : '/projects') // Default fallback
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
       userId: user._id, 
       role: user.role,
       name: user.name // Include name in the token payload.
      };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
       token,
       role: user.role  // Explicitly send role in response
      });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};