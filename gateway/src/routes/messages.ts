// Message Routes - مسارات إدارة الرسائل
import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../utils/logger.js';
import { MessageBroker } from '../services/messageBroker.js';
import { AuthService } from '../services/auth.js';

const router = Router();
const logger = new Logger();

// Initialize services
const messageBroker = new MessageBroker({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'a2a_events',
  queuePrefix: process.env.RABBITMQ_QUEUE_PREFIX || 'a2a',
});

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

// Publish message endpoint
router.post('/publish', [
  body('topic').notEmpty().withMessage('Topic is required'),
  body('type').notEmpty().withMessage('Message type is required'),
  body('target').notEmpty().withMessage('Target is required'),
  body('payload').notEmpty().withMessage('Payload is required'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'critical']).withMessage('Invalid priority'),
], authenticateToken, validateRequest, async (req: Request, res: Response) => {
  try {
    const { topic, type, target, payload, priority, correlationId } = req.body;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'publish');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Publish permission required',
      });
    }

    const message = {
      id: uuidv4(),
      type,
      source: 'api-gateway',
      target,
      payload,
      timestamp: new Date().toISOString(),
      correlationId,
      priority: priority || 'normal',
    };

    await messageBroker.publish(topic, message);

    logger.info('Message published', {
      messageId: message.id,
      topic,
      type,
      target,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      messageId: message.id,
      topic,
      timestamp: message.timestamp,
      message: 'Message published successfully',
    });

  } catch (error) {
    logger.error('Message publish error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to publish message',
    });
  }
});

// Subscribe to topic endpoint
router.post('/subscribe', [
  body('topic').notEmpty().withMessage('Topic is required'),
  body('handler').optional().isURL().withMessage('Handler must be a valid URL'),
], authenticateToken, validateRequest, async (req: Request, res: Response) => {
  try {
    const { topic, handler } = req.body;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'subscribe');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Subscribe permission required',
      });
    }

    // Create subscription handler
    const subscriptionHandler = async (message: any) => {
      try {
        logger.info('Message received via subscription', {
          topic,
          messageId: message.id,
          type: message.type,
          userId,
        });

        // If webhook handler is provided, send message to webhook
        if (handler) {
          await fetch(handler, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-A2A-Source': 'gateway',
              'X-A2A-Topic': topic,
            },
            body: JSON.stringify(message),
          });
        }

        // Emit event for WebSocket clients
        // This would be handled by the main gateway instance
        logger.debug('Message processed by subscription', {
          topic,
          messageId: message.id,
        });

      } catch (error) {
        logger.error('Subscription handler error', {
          error,
          topic,
          messageId: message.id,
        });
      }
    };

    await messageBroker.subscribe(topic, subscriptionHandler);

    logger.info('Topic subscription created', {
      topic,
      userId,
      handler,
      ip: req.ip,
    });

    res.json({
      success: true,
      topic,
      handler,
      message: 'Successfully subscribed to topic',
    });

  } catch (error) {
    logger.error('Topic subscription error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to subscribe to topic',
    });
  }
});

// Unsubscribe from topic endpoint
router.delete('/subscribe/:topic', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'subscribe');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Subscribe permission required',
      });
    }

    await messageBroker.unsubscribe(topic);

    logger.info('Topic subscription removed', {
      topic,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      topic,
      message: 'Successfully unsubscribed from topic',
    });

  } catch (error) {
    logger.error('Topic unsubscription error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to unsubscribe from topic',
    });
  }
});

// Get queue information endpoint
router.get('/queues/:queueName', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { queueName } = req.params;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Read permission required',
      });
    }

    const queueInfo = await messageBroker.getQueueInfo(queueName);

    res.json({
      success: true,
      queueName,
      info: queueInfo,
    });

  } catch (error) {
    logger.error('Get queue info error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get queue information',
    });
  }
});

// Purge queue endpoint
router.delete('/queues/:queueName', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { queueName } = req.params;
    const userId = req.user.userId;

    // Check permissions (admin only)
    const hasPermission = await authService.hasPermission(userId, 'admin');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Admin permission required',
      });
    }

    await messageBroker.purgeQueue(queueName);

    logger.info('Queue purged', {
      queueName,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      queueName,
      message: 'Queue purged successfully',
    });

  } catch (error) {
    logger.error('Queue purge error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to purge queue',
    });
  }
});

// Create queue endpoint
router.post('/queues', [
  body('name').notEmpty().withMessage('Queue name is required'),
  body('options').optional().isObject().withMessage('Options must be an object'),
], authenticateToken, validateRequest, async (req: Request, res: Response) => {
  try {
    const { name, options } = req.body;
    const userId = req.user.userId;

    // Check permissions
    const hasPermission = await authService.hasPermission(userId, 'write');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Write permission required',
      });
    }

    await messageBroker.createQueue(name, options);

    logger.info('Queue created', {
      queueName: name,
      options,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      queueName: name,
      options,
      message: 'Queue created successfully',
    });

  } catch (error) {
    logger.error('Queue creation error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create queue',
    });
  }
});

// Delete queue endpoint
router.delete('/queues/:queueName', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { queueName } = req.params;
    const userId = req.user.userId;

    // Check permissions (admin only)
    const hasPermission = await authService.hasPermission(userId, 'admin');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Admin permission required',
      });
    }

    await messageBroker.deleteQueue(queueName);

    logger.info('Queue deleted', {
      queueName,
      userId,
      ip: req.ip,
    });

    res.json({
      success: true,
      queueName,
      message: 'Queue deleted successfully',
    });

  } catch (error) {
    logger.error('Queue deletion error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete queue',
    });
  }
});

// Get message broker status endpoint
router.get('/status', authenticateToken, async (req: Request, res: Response) => {
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

    const isConnected = messageBroker.isConnectedToBroker();
    const pingResult = await messageBroker.ping();

    res.json({
      success: true,
      status: {
        connected: isConnected,
        healthy: pingResult,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error('Get broker status error', { error, userId: req.user?.userId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get broker status',
    });
  }
});

export { router as messageRoutes };
