// ecommerce-backend/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ name: normalizedName, email: normalizedEmail, password });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid registration details' });
    }

    console.error('Register route error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
      res.json({ _id: user._id, name: user.name, email: user.email, token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;