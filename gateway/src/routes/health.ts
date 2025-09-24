// Health Routes - مسارات فحص صحة النظام
import { Router, Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger.js';
import { HealthChecker } from '../services/health.js';
import { AuthService } from '../services/auth.js';

const router = Router();
const logger = new Logger();

// Initialize services
const healthChecker = new HealthChecker();
const authService = new AuthService(
  process.env.JWT_SECRET || 'default-secret',
  process.env.JWT_EXPIRES_IN || '24h'
);

// Authentication middleware
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
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
    
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed', { error });
    res.status(401).json({
      error: 'Invalid token',
      message: 'Token verification failed',
    });
  }
};

// Basic health check endpoint (no authentication required)
router.get('/', async (req: Request, res: Response) => {
  try {
    const healthStatus = healthChecker.getHealthStatus();
    
    const statusCode = healthStatus.overall === 'healthy' ? 200 : 
                     healthStatus.overall === 'degraded' ? 200 : 503;

    res.status(statusCode).json({
      status: healthStatus.overall,
      timestamp: healthStatus.timestamp,
      uptime: process.uptime(),
      version: '1.0.0',
      checks: healthStatus.checks.map(check => ({
        name: check.name,
        status: check.status,
        responseTime: check.responseTime,
        message: check.message,
      })),
    });

  } catch (error) {
    logger.error('Health check error', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// Detailed health check endpoint
router.get('/detailed', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const healthStatus = healthChecker.getHealthStatus();
    const healthMetrics = healthChecker.getHealthMetrics();
    const healthHistory = healthChecker.getHealthHistory();

    res.json({
      success: true,
      status: healthStatus.overall,
      timestamp: healthStatus.timestamp,
      uptime: process.uptime(),
      version: '1.0.0',
      checks: healthStatus.checks,
      metrics: healthMetrics,
      history: healthHistory.slice(-20), // Last 20 health checks
    });

  } catch (error) {
    logger.error('Detailed health check error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve detailed health information',
    });
  }
});

// Run all health checks endpoint
router.post('/run', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const checks = await healthChecker.runAllChecks();

    res.json({
      success: true,
      checks,
      timestamp: new Date().toISOString(),
      message: 'Health checks completed',
    });

  } catch (error) {
    logger.error('Run health checks error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to run health checks',
    });
  }
});

// Run single health check endpoint
router.post('/run/:checkId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { checkId } = req.params;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const check = await healthChecker.runSingleCheck(checkId);
    
    if (!check) {
      return res.status(404).json({
        error: 'Health check not found',
        message: `Health check '${checkId}' does not exist`,
      });
    }

    res.json({
      success: true,
      check,
      timestamp: new Date().toISOString(),
      message: 'Health check completed',
    });

  } catch (error) {
    logger.error('Run single health check error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to run health check',
    });
  }
});

// Get health check status endpoint
router.get('/status/:checkId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { checkId } = req.params;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const checkStatus = healthChecker.getCheckStatus(checkId);
    
    if (!checkStatus) {
      return res.status(404).json({
        error: 'Health check not found',
        message: `Health check '${checkId}' does not exist`,
      });
    }

    res.json({
      success: true,
      check: checkStatus,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get health check status error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get health check status',
    });
  }
});

// Get registered health checks endpoint
router.get('/checks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const registeredChecks = healthChecker.getRegisteredChecks();

    res.json({
      success: true,
      checks: registeredChecks,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get registered checks error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get registered health checks',
    });
  }
});

// Add health check endpoint
router.post('/checks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id, name, timeout, checkFunction } = req.body;
    const userId = req.user.userId;

    // Check permissions (admin only)
    const hasPermission = await authService.hasPermission(userId, 'admin');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Admin permission required',
      });
    }

    if (!id || !name || !timeout) {
      return res.status(400).json({
        error: 'Invalid parameters',
        message: 'ID, name, and timeout are required',
      });
    }

    // In a real implementation, you'd validate the checkFunction
    const service = {
      name,
      timeout: parseInt(timeout),
      checkFunction: async () => {
        // Placeholder check function
        return true;
      },
    };

    healthChecker.addCheck(id, service);

    logger.info('Health check added', {
      id,
      name,
      timeout,
      userId,
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      check: { id, name, timeout },
      message: 'Health check added successfully',
    });

  } catch (error) {
    logger.error('Add health check error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to add health check',
    });
  }
});

// Remove health check endpoint
router.delete('/checks/:checkId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { checkId } = req.params;
    const userId = req.user.userId;

    // Check permissions (admin only)
    const hasPermission = await authService.hasPermission(userId, 'admin');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Admin permission required',
      });
    }

    healthChecker.removeCheck(checkId);

    logger.info('Health check removed', {
      checkId,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      checkId,
      message: 'Health check removed successfully',
    });

  } catch (error) {
    logger.error('Remove health check error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to remove health check',
    });
  }
});

// Configure health check endpoint
router.put('/checks/:checkId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { checkId } = req.params;
    const config = req.body;
    const userId = req.user.userId;

    // Check permissions (admin only)
    const hasPermission = await authService.hasPermission(userId, 'admin');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Admin permission required',
      });
    }

    healthChecker.configureCheck(checkId, config);

    logger.info('Health check configured', {
      checkId,
      config,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      checkId,
      config,
      message: 'Health check configured successfully',
    });

  } catch (error) {
    logger.error('Configure health check error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to configure health check',
    });
  }
});

// Clear health history endpoint
router.delete('/history', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    // Check permissions (admin only)
    const hasPermission = await authService.hasPermission(userId, 'admin');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Admin permission required',
      });
    }

    healthChecker.clearHistory();

    logger.info('Health history cleared', {
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      message: 'Health history cleared successfully',
    });

  } catch (error) {
    logger.error('Clear health history error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to clear health history',
    });
  }
});

// Liveness probe endpoint (for Kubernetes)
router.get('/live', async (req: Request, res: Response) => {
  try {
    // Simple liveness check - just verify the process is running
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    logger.error('Liveness probe error', { error });
    res.status(503).json({
      status: 'not alive',
      timestamp: new Date().toISOString(),
    });
  }
});

// Readiness probe endpoint (for Kubernetes)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const healthStatus = healthChecker.getHealthStatus();
    
    // Consider the service ready if it's healthy or degraded (but not unhealthy)
    const isReady = healthStatus.overall === 'healthy' || healthStatus.overall === 'degraded';
    
    const statusCode = isReady ? 200 : 503;
    
    res.status(statusCode).json({
      status: isReady ? 'ready' : 'not ready',
      overall: healthStatus.overall,
      timestamp: new Date().toISOString(),
      checks: healthStatus.checks.length,
    });
  } catch (error) {
    logger.error('Readiness probe error', { error });
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as healthRoutes };
