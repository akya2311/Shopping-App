const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const config = require('../config/config');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Fetch the user based on the decoded token ID
      req.user = await User.findByPk(decoded.id);

      // If user does not exist, return an error
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token is provided in the Authorization header
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

const admin = (req, res, next) => {
  // Check if the user exists and has the role of admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
