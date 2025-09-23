// =============================================================================
// 🔐 Authentication Routes
// =============================================================================
// 
// Handles all authentication-related routes
// Login, logout, registration, password reset, etc.
//
// =============================================================================

import type { Express, Request, Response } from 'express';
import { getLogger } from '../lib/advanced-logger.js';
import { validateInput } from '../lib/input-validation.js';
import { authenticateUser, registerUser, resetPassword } from '../services/auth-service.js';

const logger = getLogger();

export function setupAuthRoutes(app: Express): void {
  logger.info('Setting up authentication routes...');

  // =============================================================================
  // 🔐 Login Route
  // =============================================================================
  
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      const validation = validateInput({ email, password }, {
        email: { required: true, type: 'email' },
        password: { required: true, minLength: 6 }
      });
      
      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const result = await authenticateUser(email, password);
      
      if (result.success) {
        logger.info('User login successful', { userId: result.user.id, email });
        res.json({ 
          success: true, 
          user: result.user, 
          token: result.token 
        });
      } else {
        logger.warn('User login failed', { email, reason: result.error });
        res.status(401).json({ error: result.error });
      }
      
    } catch (error) {
      logger.error('Login error', { error, body: req.body });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================================================
  // 📝 Registration Route
  // =============================================================================
  
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, username, fullName } = req.body;
      
      // Validate input
      const validation = validateInput({ email, password, username, fullName }, {
        email: { required: true, type: 'email' },
        password: { required: true, minLength: 8 },
        username: { required: true, minLength: 3 },
        fullName: { required: true, minLength: 2 }
      });
      
      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const result = await registerUser({ email, password, username, fullName });
      
      if (result.success) {
        logger.info('User registration successful', { userId: result.user.id, email });
        res.status(201).json({ 
          success: true, 
          user: result.user, 
          token: result.token 
        });
      } else {
        logger.warn('User registration failed', { email, reason: result.error });
        res.status(400).json({ error: result.error });
      }
      
    } catch (error) {
      logger.error('Registration error', { error, body: req.body });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================================================
  // 🔄 Password Reset Route
  // =============================================================================
  
  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      // Validate input
      const validation = validateInput({ email }, {
        email: { required: true, type: 'email' }
      });
      
      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const result = await resetPassword(email);
      
      if (result.success) {
        logger.info('Password reset initiated', { email });
        res.json({ success: true, message: 'Password reset email sent' });
      } else {
        logger.warn('Password reset failed', { email, reason: result.error });
        res.status(400).json({ error: result.error });
      }
      
    } catch (error) {
      logger.error('Password reset error', { error, body: req.body });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================================================
  // 🚪 Logout Route
  // =============================================================================
  
  app.post('/api/auth/logout', async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Invalidate token (implementation depends on your token strategy)
      logger.info('User logout', { token: token.substring(0, 10) + '...' });
      
      res.json({ success: true, message: 'Logged out successfully' });
      
    } catch (error) {
      logger.error('Logout error', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // =============================================================================
  // 👤 Profile Routes
  // =============================================================================
  
  app.get('/api/auth/profile', async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Verify token and get user profile
      // Implementation depends on your authentication strategy
      
      res.json({ 
        success: true, 
        user: {
          id: 'user123',
          email: 'user@example.com',
          username: 'user123',
          fullName: 'User Name'
        }
      });
      
    } catch (error) {
      logger.error('Profile fetch error', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/auth/profile', async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const { fullName, username } = req.body;
      
      // Validate input
      const validation = validateInput({ fullName, username }, {
        fullName: { minLength: 2 },
        username: { minLength: 3 }
      });
      
      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      // Update user profile
      logger.info('Profile update', { fullName, username });
      
      res.json({ 
        success: true, 
        message: 'Profile updated successfully' 
      });
      
    } catch (error) {
      logger.error('Profile update error', { error, body: req.body });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  logger.info('Authentication routes setup completed');
}
