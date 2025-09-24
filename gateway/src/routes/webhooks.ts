import express from 'express';
import { messageBroker } from '../services/messageBroker.js';
import { authenticateAPIKey } from '../services/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Generic webhook endpoint
router.post('/incoming', authenticateAPIKey, async (req, res) => {
  try {
    const { source, type, payload, correlation_id } = req.body;

    if (!source || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: source, type' 
      });
    }

    const eventId = await messageBroker.publishEvent({
      source: `webhook:${source}`,
      type,
      payload: payload || req.body,
      correlation_id
    });

    logger.info(`Webhook received from ${source}:`, { type, eventId });

    res.json({
      success: true,
      eventId,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    logger.error('Failed to process webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Telegram webhook endpoint
router.post('/telegram', authenticateAPIKey, async (req, res) => {
  try {
    const telegramUpdate = req.body;

    const eventId = await messageBroker.publishEvent({
      source: 'telegram',
      type: 'message',
      payload: telegramUpdate,
      correlation_id: telegramUpdate.update_id?.toString()
    });

    logger.info('Telegram webhook processed:', { eventId });

    res.json({ success: true, eventId });
  } catch (error) {
    logger.error('Failed to process Telegram webhook:', error);
    res.status(500).json({ error: 'Failed to process Telegram webhook' });
  }
});

export default router;