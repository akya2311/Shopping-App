const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel');

// @desc Get all users (Only for Admin users)
// @route GET /api/auth/users
// @access Private (Admin only)
const getUser = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// @desc Register new user
// @route POST /api/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Password validation (at least one uppercase letter, one lowercase letter, one number, and one special character)
  const passwordRegex = /^.{8,}$/; // At least 8 characters
if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message: 'Password must be at least 8 characters long.',
  });
}

  // Check if user already exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'user', // Default role if not provided
  });

  // Respond with user data
  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id, user.role),
  });
});

// @desc Authenticate user & get token
// @route POST /api/auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare password with hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Respond with user data and token
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id, user.role),
  });
});

module.exports = { registerUser, loginUser, getUser };
