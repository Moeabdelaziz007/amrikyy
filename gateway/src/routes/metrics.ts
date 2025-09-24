// Metrics Routes - مسارات المقاييس والمراقبة
import { Router, Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger.js';
import { MetricsCollector } from '../services/metrics.js';
import { AuthService } from '../services/auth.js';

const router = Router();
const logger = new Logger();

// Initialize services
const metricsCollector = new MetricsCollector();
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

// Admin permission middleware
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const hasPermission = await authService.hasPermission(userId, 'admin');
    
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Admin permission required',
      });
    }
    
    next();
  } catch (error) {
    logger.error('Admin permission check failed', { error });
    res.status(403).json({
      error: 'Permission check failed',
      message: 'Failed to verify admin permissions',
    });
  }
};

// Get all metrics endpoint
router.get('/', authenticateToken, async (req: Request, res: Response) => {
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

    const requestStats = metricsCollector.getRequestStats();
    const systemMetrics = metricsCollector.getCurrentSystemMetrics();
    const healthMetrics = metricsCollector.getHealthMetrics();
    const allCounters = metricsCollector.getAllCounters();
    const allGauges = metricsCollector.getAllGauges();

    res.json({
      success: true,
      metrics: {
        requests: requestStats,
        system: systemMetrics,
        health: healthMetrics,
        counters: Object.fromEntries(allCounters),
        gauges: Object.fromEntries(allGauges),
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get metrics error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve metrics',
    });
  }
});

// Get request metrics endpoint
router.get('/requests', authenticateToken, async (req: Request, res: Response) => {
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

    const requestStats = metricsCollector.getRequestStats();
    const requestMetrics = metricsCollector.getRequestMetrics();

    res.json({
      success: true,
      stats: requestStats,
      metrics: requestMetrics.slice(-100), // Last 100 requests
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get request metrics error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve request metrics',
    });
  }
});

// Get system metrics endpoint
router.get('/system', authenticateToken, async (req: Request, res: Response) => {
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

    const systemMetrics = metricsCollector.getSystemMetrics();
    const currentMetrics = metricsCollector.getCurrentSystemMetrics();

    res.json({
      success: true,
      current: currentMetrics,
      history: systemMetrics.slice(-50), // Last 50 measurements
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get system metrics error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve system metrics',
    });
  }
});

// Get health metrics endpoint
router.get('/health', authenticateToken, async (req: Request, res: Response) => {
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

    const healthMetrics = metricsCollector.getHealthMetrics();

    res.json({
      success: true,
      health: healthMetrics,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get health metrics error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve health metrics',
    });
  }
});

// Get custom metrics endpoint
router.get('/custom/:name', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const customMetrics = metricsCollector.getCustomMetrics(name);

    res.json({
      success: true,
      name,
      metrics: customMetrics,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get custom metrics error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve custom metrics',
    });
  }
});

// Get counter metrics endpoint
router.get('/counters', authenticateToken, async (req: Request, res: Response) => {
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

    const counters = metricsCollector.getAllCounters();

    res.json({
      success: true,
      counters: Object.fromEntries(counters),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get counters error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve counters',
    });
  }
});

// Get gauge metrics endpoint
router.get('/gauges', authenticateToken, async (req: Request, res: Response) => {
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

    const gauges = metricsCollector.getAllGauges();

    res.json({
      success: true,
      gauges: Object.fromEntries(gauges),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get gauges error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve gauges',
    });
  }
});

// Get histogram metrics endpoint
router.get('/histograms/:name', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const histogram = metricsCollector.getHistogram(name);

    res.json({
      success: true,
      name,
      histogram,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Get histogram error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve histogram',
    });
  }
});

// Export metrics in Prometheus format
router.get('/prometheus', authenticateToken, async (req: Request, res: Response) => {
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

    const prometheusMetrics = metricsCollector.exportPrometheusMetrics();

    res.setHeader('Content-Type', 'text/plain');
    res.send(prometheusMetrics);

  } catch (error) {
    logger.error('Export Prometheus metrics error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to export Prometheus metrics',
    });
  }
});

// Record custom metric endpoint
router.post('/custom', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, value, labels } = req.body;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'write');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Write permission required',
      });
    }

    if (!name || typeof value !== 'number') {
      return res.status(400).json({
        error: 'Invalid parameters',
        message: 'Name and numeric value are required',
      });
    }

    metricsCollector.recordCustomMetric(name, value, labels);

    logger.info('Custom metric recorded', {
      name,
      value,
      labels,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      name,
      value,
      labels,
      message: 'Custom metric recorded successfully',
    });

  } catch (error) {
    logger.error('Record custom metric error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to record custom metric',
    });
  }
});

// Increment counter endpoint
router.post('/counters/:name/increment', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { labels } = req.body;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'write');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Write permission required',
      });
    }

    metricsCollector.incrementCounter(name, labels);
    const currentValue = metricsCollector.getCounter(name, labels);

    logger.info('Counter incremented', {
      name,
      labels,
      currentValue,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      name,
      labels,
      value: currentValue,
      message: 'Counter incremented successfully',
    });

  } catch (error) {
    logger.error('Increment counter error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to increment counter',
    });
  }
});

// Set gauge endpoint
router.post('/gauges/:name', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { value, labels } = req.body;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'write');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Write permission required',
      });
    }

    if (typeof value !== 'number') {
      return res.status(400).json({
        error: 'Invalid value',
        message: 'Value must be a number',
      });
    }

    metricsCollector.setGauge(name, value, labels);

    logger.info('Gauge set', {
      name,
      value,
      labels,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      name,
      value,
      labels,
      message: 'Gauge set successfully',
    });

  } catch (error) {
    logger.error('Set gauge error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to set gauge',
    });
  }
});

// Clear all metrics endpoint (admin only)
router.delete('/clear', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    metricsCollector.clearMetrics();

    logger.info('All metrics cleared', {
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      message: 'All metrics cleared successfully',
    });

  } catch (error) {
    logger.error('Clear metrics error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to clear metrics',
    });
  }
});

export { router as metricsRoutes };
