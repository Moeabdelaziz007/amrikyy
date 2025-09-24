import express from 'express';
import { messageBroker } from '../services/messageBroker.js';
import { authenticateJWT, authenticateAPIKey } from '../services/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Publish message endpoint
router.post('/publish', authenticateAPIKey, async (req, res) => {
  try {
    const { source, type, payload, correlation_id } = req.body;

    if (!source || !type || !payload) {
      return res.status(400).json({ 
        error: 'Missing required fields: source, type, payload' 
      });
    }

    const eventId = await messageBroker.publishEvent({
      source,
      type,
      payload,
      correlation_id
    });

    logger.info(`Message published by ${source}:`, { type, eventId });

    res.json({
      success: true,
      eventId,
      message: 'Event published successfully'
    });
  } catch (error) {
    logger.error('Failed to publish message:', error);
    res.status(500).json({ error: 'Failed to publish message' });
  }
});

// Get event history
router.get('/history', authenticateJWT, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const events = await messageBroker.getEventHistory(limit);

    res.json({
      success: true,
      events,
      count: events.length
    });
  } catch (error) {
    logger.error('Failed to get event history:', error);
    res.status(500).json({ error: 'Failed to get event history' });
  }
});

export default router;