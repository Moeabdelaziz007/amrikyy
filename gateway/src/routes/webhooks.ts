// Webhook Routes - مسارات الـ Webhooks للتكامل الخارجي
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

// Webhook signature verification middleware
const verifyWebhookSignature = (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-webhook-signature'] as string;
    const webhookSecret = process.env.WEBHOOK_SECRET || 'default-webhook-secret';
    
    if (!signature) {
      return res.status(401).json({
        error: 'Missing signature',
        message: 'Webhook signature is required',
      });
    }

    // Simple signature verification (in production, use proper HMAC verification)
    const expectedSignature = `sha256=${Buffer.from(webhookSecret).toString('base64')}`;
    
    if (signature !== expectedSignature) {
      logger.warn('Invalid webhook signature', {
        provided: signature,
        expected: expectedSignature,
        ip: req.ip,
      });
      
      return res.status(401).json({
        error: 'Invalid signature',
        message: 'Webhook signature verification failed',
      });
    }

    next();
  } catch (error) {
    logger.error('Webhook signature verification error', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Signature verification failed',
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

// Telegram webhook endpoint
router.post('/telegram', verifyWebhookSignature, async (req: Request, res: Response) => {
  try {
    const telegramUpdate = req.body;
    
    const message = {
      id: uuidv4(),
      type: 'telegram_update',
      source: 'telegram',
      target: 'gateway',
      payload: telegramUpdate,
      timestamp: new Date().toISOString(),
      priority: 'normal',
    };

    // Publish to telegram topic
    await messageBroker.publish('telegram.updates', message);

    logger.info('Telegram webhook received', {
      messageId: message.id,
      updateId: telegramUpdate.update_id,
      ip: req.ip,
    });

    res.json({
      success: true,
      messageId: message.id,
      timestamp: message.timestamp,
    });

  } catch (error) {
    logger.error('Telegram webhook error', { error, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process Telegram webhook',
    });
  }
});

// Autopilot webhook endpoint
router.post('/autopilot', verifyWebhookSignature, async (req: Request, res: Response) => {
  try {
    const autopilotData = req.body;
    
    const message = {
      id: uuidv4(),
      type: 'autopilot_event',
      source: 'autopilot',
      target: 'gateway',
      payload: autopilotData,
      timestamp: new Date().toISOString(),
      priority: autopilotData.priority || 'normal',
    };

    // Publish to autopilot topic
    await messageBroker.publish('autopilot.events', message);

    logger.info('Autopilot webhook received', {
      messageId: message.id,
      eventType: autopilotData.type,
      ip: req.ip,
    });

    res.json({
      success: true,
      messageId: message.id,
      timestamp: message.timestamp,
    });

  } catch (error) {
    logger.error('Autopilot webhook error', { error, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process Autopilot webhook',
    });
  }
});

// Application webhook endpoint
router.post('/application', verifyWebhookSignature, async (req: Request, res: Response) => {
  try {
    const applicationData = req.body;
    
    const message = {
      id: uuidv4(),
      type: 'application_event',
      source: 'application',
      target: 'gateway',
      payload: applicationData,
      timestamp: new Date().toISOString(),
      priority: applicationData.priority || 'normal',
    };

    // Publish to application topic
    await messageBroker.publish('application.events', message);

    logger.info('Application webhook received', {
      messageId: message.id,
      eventType: applicationData.type,
      ip: req.ip,
    });

    res.json({
      success: true,
      messageId: message.id,
      timestamp: message.timestamp,
    });

  } catch (error) {
    logger.error('Application webhook error', { error, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process Application webhook',
    });
  }
});

// Generic webhook endpoint
router.post('/generic/:service', verifyWebhookSignature, async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const webhookData = req.body;
    
    const message = {
      id: uuidv4(),
      type: `${service}_webhook`,
      source: service,
      target: 'gateway',
      payload: webhookData,
      timestamp: new Date().toISOString(),
      priority: webhookData.priority || 'normal',
    };

    // Publish to service-specific topic
    await messageBroker.publish(`${service}.webhooks`, message);

    logger.info('Generic webhook received', {
      messageId: message.id,
      service,
      eventType: webhookData.type,
      ip: req.ip,
    });

    res.json({
      success: true,
      messageId: message.id,
      service,
      timestamp: message.timestamp,
    });

  } catch (error) {
    logger.error('Generic webhook error', { error, service: req.params.service, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process webhook',
    });
  }
});

// Webhook registration endpoint (for external services to register webhooks)
router.post('/register', [
  body('service').notEmpty().withMessage('Service name is required'),
  body('url').isURL().withMessage('Valid URL is required'),
  body('events').isArray().withMessage('Events must be an array'),
  body('secret').optional().isString().withMessage('Secret must be a string'),
], async (req: Request, res: Response) => {
  try {
    const { service, url, events, secret } = req.body;
    
    // In a real implementation, you'd store webhook registrations in a database
    const webhookRegistration = {
      id: uuidv4(),
      service,
      url,
      events,
      secret: secret || process.env.WEBHOOK_SECRET,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    logger.info('Webhook registered', {
      registrationId: webhookRegistration.id,
      service,
      url,
      events,
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      registration: webhookRegistration,
      message: 'Webhook registered successfully',
    });

  } catch (error) {
    logger.error('Webhook registration error', { error, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to register webhook',
    });
  }
});

// Webhook status endpoint
router.get('/status/:service', async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    
    // In a real implementation, you'd check webhook status from database
    const webhookStatus = {
      service,
      isActive: true,
      lastDelivery: new Date().toISOString(),
      deliveryCount: Math.floor(Math.random() * 1000), // Placeholder
      failureCount: Math.floor(Math.random() * 10), // Placeholder
    };

    res.json({
      success: true,
      status: webhookStatus,
    });

  } catch (error) {
    logger.error('Webhook status error', { error, service: req.params.service });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get webhook status',
    });
  }
});

// Webhook test endpoint
router.post('/test/:service', verifyWebhookSignature, async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const testData = req.body;
    
    const testMessage = {
      id: uuidv4(),
      type: 'webhook_test',
      source: 'gateway',
      target: service,
      payload: {
        ...testData,
        test: true,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
      priority: 'normal',
    };

    // Publish test message
    await messageBroker.publish(`${service}.test`, testMessage);

    logger.info('Webhook test sent', {
      messageId: testMessage.id,
      service,
      ip: req.ip,
    });

    res.json({
      success: true,
      messageId: testMessage.id,
      service,
      message: 'Test webhook sent successfully',
    });

  } catch (error) {
    logger.error('Webhook test error', { error, service: req.params.service, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send test webhook',
    });
  }
});

// Webhook delivery retry endpoint
router.post('/retry/:messageId', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    
    // In a real implementation, you'd retry failed webhook deliveries
    logger.info('Webhook retry requested', {
      messageId,
      ip: req.ip,
    });

    res.json({
      success: true,
      messageId,
      message: 'Webhook retry initiated',
    });

  } catch (error) {
    logger.error('Webhook retry error', { error, messageId: req.params.messageId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retry webhook',
    });
  }
});

// Webhook logs endpoint
router.get('/logs/:service', async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // In a real implementation, you'd fetch webhook logs from database
    const logs = []; // Placeholder for webhook logs

    res.json({
      success: true,
      service,
      logs,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: logs.length,
      },
    });

  } catch (error) {
    logger.error('Webhook logs error', { error, service: req.params.service });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get webhook logs',
    });
  }
});

export { router as webhookRoutes };
