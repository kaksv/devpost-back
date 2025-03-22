const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('Token received', token); //Debugging log
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token', decoded); // Debugging log
    req.userId = decoded.userId;
    req.role = decoded.role; //Attach the user's role to the request object.
    next();
  } catch (err) {
    console.error('Error verifying token:', err.message); //Debugging log
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;