// Authentication Routes - مسارات المصادقة
import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/auth.js';
import { Logger } from '../utils/logger.js';

const router = Router();
const logger = new Logger();

// Initialize auth service
const authService = new AuthService(
  process.env.JWT_SECRET || 'default-secret',
  process.env.JWT_EXPIRES_IN || '24h'
);

// Validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Login endpoint
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const result = await authService.authenticate(username, password);
    
    if (!result) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect',
      });
    }

    logger.info('User logged in', {
      userId: result.user.id,
      username: result.user.username,
      ip: req.ip,
    });

    res.json({
      success: true,
      token: result.token,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        permissions: result.user.permissions,
      },
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

  } catch (error) {
    logger.error('Login error', { error, username: req.body.username });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Login failed',
    });
  }
});

// Register endpoint
router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin', 'service']).withMessage('Invalid role'),
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await authService.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Username is already taken',
      });
    }

    const user = await authService.createUser({
      username,
      email,
      password,
      role: role || 'user',
    });

    logger.info('User registered', {
      userId: user.id,
      username: user.username,
      email: user.email,
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      message: 'User created successfully',
    });

  } catch (error) {
    logger.error('Registration error', { error, username: req.body.username });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Registration failed',
    });
  }
});

// Token refresh endpoint
router.post('/refresh', [
  body('token').notEmpty().withMessage('Token is required'),
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const newToken = await authService.refreshToken(token);

    res.json({
      success: true,
      token: newToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

  } catch (error) {
    logger.error('Token refresh error', { error });
    res.status(401).json({
      error: 'Invalid token',
      message: 'Token refresh failed',
    });
  }
});

// Generate API key endpoint
router.post('/api-key', [
  body('name').notEmpty().withMessage('API key name is required'),
], validateRequest, async (req: Request, res: Response) => {
  try {
    // In a real implementation, you'd get the user from the JWT token
    const userId = 'service-001'; // Placeholder
    const { name } = req.body;

    const { apiKey, expiresAt } = await authService.generateApiKey(userId, name);

    logger.info('API key generated', {
      userId,
      name,
      expiresAt,
      ip: req.ip,
    });

    res.json({
      success: true,
      apiKey,
      expiresAt,
      message: 'API key generated successfully',
    });

  } catch (error) {
    logger.error('API key generation error', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'API key generation failed',
    });
  }
});

// Validate API key endpoint
router.post('/validate-api-key', [
  body('apiKey').notEmpty().withMessage('API key is required'),
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;

    const user = await authService.validateApiKey(apiKey);
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'API key is not valid',
      });
    }

    res.json({
      success: true,
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
      },
    });

  } catch (error) {
    logger.error('API key validation error', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'API key validation failed',
    });
  }
});

// Get user info endpoint
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Bearer token is required',
      });
    }

    const token = authHeader.substring(7);
    const decoded = await authService.verifyToken(token);
    const user = await authService.getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist',
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });

  } catch (error) {
    logger.error('Get user info error', { error });
    res.status(401).json({
      error: 'Invalid token',
      message: 'Token verification failed',
    });
  }
});

// Logout endpoint (client-side token invalidation)
router.post('/logout', async (req: Request, res: Response) => {
  try {
    // In a real implementation, you'd add the token to a blacklist
    logger.info('User logged out', { ip: req.ip });
    
    res.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    logger.error('Logout error', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Logout failed',
    });
  }
});

// Get all users (admin only)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = authService.getAllUsers();
    
    const userStats = authService.getUserStats();

    res.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      })),
      stats: userStats,
    });

  } catch (error) {
    logger.error('Get users error', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve users',
    });
  }
});

// Update user endpoint
router.put('/users/:userId', [
  body('username').optional().notEmpty().withMessage('Username cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['user', 'admin', 'service']).withMessage('Invalid role'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const updatedUser = await authService.updateUser(userId, updates);
    
    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist',
      });
    }

    logger.info('User updated', {
      userId,
      updates,
      ip: req.ip,
    });

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin,
      },
      message: 'User updated successfully',
    });

  } catch (error) {
    logger.error('Update user error', { error, userId: req.params.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'User update failed',
    });
  }
});

// Delete user endpoint
router.delete('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const deleted = await authService.deleteUser(userId);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist',
      });
    }

    logger.info('User deleted', {
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error) {
    logger.error('Delete user error', { error, userId: req.params.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'User deletion failed',
    });
  }
});

export { router as authRoutes };
