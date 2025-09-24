import express from 'express';
import { generateToken } from '../services/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Mock user database (in production, use a real database)
const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, use hashed passwords
    role: 'admin',
    permissions: ['read', 'write', 'admin']
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    role: 'user',
    permissions: ['read']
  }
];

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions
    });

    logger.info(`User ${username} logged in successfully`);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;