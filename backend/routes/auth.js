const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const User = require('../models/User');

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// @route  POST /api/auth/register
// @desc   Register as student or faculty
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role, subject, rollNumber } = req.body;

    if (!name || !username || !password || !role) {
      return res.status(400).json({ message: 'name, username, password and role are required' });
    }
    if (!['student', 'faculty'].includes(role)) {
      return res.status(400).json({ message: 'role must be student or faculty' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : `${normalizedUsername}@demo.local`;
    const existingEmail = normalizedEmail ? await User.findOne({ email: normalizedEmail }) : null;
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      role,
      subject,
      rollNumber,
    });
    const token = signToken(user);

    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route  POST /api/auth/login
// @desc   Login as student or faculty
router.post('/login', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const loginIdentifier = (username || email || '').trim().toLowerCase();
    if (!loginIdentifier || !password || !role) {
      return res.status(400).json({ message: 'username/email, password and role are required' });
    }

    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.role !== role) {
      return res.status(401).json({ message: `This account is not registered as ${role}` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
