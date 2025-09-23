import express from 'express';
import { chatbotService } from '../services/enhanced-chatbot-service';
import { ErrorHandler } from '../lib/error-handling';
import { AdvancedLogger } from '../lib/advanced-logger';
import { rateLimiter } from '../middleware/rate-limiter';
import { validateRequest } from '../middleware/validation';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const logger = new AdvancedLogger('chatbot-api');

// Validation schemas
const chatMessageSchema = {
  body: {
    type: 'object',
    required: ['message'],
    properties: {
      message: { type: 'string', minLength: 1, maxLength: 1000 },
      userId: { type: 'string', minLength: 1 },
      attachments: { 
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            name: { type: 'string' },
            size: { type: 'number' },
            data: { type: 'string' }
          }
        }
      },
      mode: { type: 'string', enum: ['text', 'voice', 'image'] }
    }
  }
};

const chatHistorySchema = {
  query: {
    type: 'object',
    properties: {
      userId: { type: 'string', minLength: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 }
    },
    required: ['userId']
  }
};

// POST /api/chat - Send message to chatbot
router.post('/chat', 
  rateLimiter({ windowMs: 60000, max: 30 }), // 30 requests per minute
  validateRequest(chatMessageSchema),
  async (req, res) => {
    try {
      const { message, userId, attachments = [], mode = 'text' } = req.body;
      
      logger.info('Processing chat message', { 
        userId, 
        mode, 
        hasAttachments: attachments.length > 0,
        messageLength: message.length 
      });

      // Process message with enhanced chatbot service
      const result = await chatbotService.processMessage(
        message,
        userId,
        attachments,
        mode
      );

      // Log successful response
      logger.info('Chat message processed successfully', {
        userId,
        responseLength: result.response.length,
        suggestionsCount: result.suggestions.length
      });

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error processing chat message', error);
      
      ErrorHandler.getInstance().handleError(error, {
        logToConsole: true,
        reportToService: true,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to process message',
        message: 'Please try again later',
        timestamp: new Date().toISOString()
      });
    }
  }
);

// GET /api/chat/history - Get chat history
router.get('/chat/history',
  rateLimiter({ windowMs: 60000, max: 10 }), // 10 requests per minute
  validateRequest(chatHistorySchema),
  async (req, res) => {
    try {
      const { userId, limit = 20 } = req.query;
      
      logger.info('Fetching chat history', { userId, limit });

      const history = await chatbotService.getChatHistory(userId as string, Number(limit));

      res.json({
        success: true,
        data: history,
        count: history.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching chat history', error);
      
      ErrorHandler.getInstance().handleError(error, {
        logToConsole: true,
        reportToService: true,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to fetch chat history',
        message: 'Please try again later',
        timestamp: new Date().toISOString()
      });
    }
  }
);

// DELETE /api/chat/history - Clear chat history
router.delete('/chat/history',
  rateLimiter({ windowMs: 60000, max: 5 }), // 5 requests per minute
  validateRequest(chatHistorySchema),
  async (req, res) => {
    try {
      const { userId } = req.query;
      
      logger.info('Clearing chat history', { userId });

      await chatbotService.clearChatHistory(userId as string);

      res.json({
        success: true,
        message: 'Chat history cleared successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error clearing chat history', error);
      
      ErrorHandler.getInstance().handleError(error, {
        logToConsole: true,
        reportToService: true,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to clear chat history',
        message: 'Please try again later',
        timestamp: new Date().toISOString()
      });
    }
  }
);

// PUT /api/chat/preferences - Update user preferences
router.put('/chat/preferences',
  rateLimiter({ windowMs: 60000, max: 10 }), // 10 requests per minute
  async (req, res) => {
    try {
      const { userId, preferences } = req.body;
      
      if (!userId || !preferences) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'userId and preferences are required'
        });
      }

      logger.info('Updating user preferences', { userId, preferences });

      await chatbotService.updateUserPreferences(userId, preferences);

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error updating user preferences', error);
      
      ErrorHandler.getInstance().handleError(error, {
        logToConsole: true,
        reportToService: true,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to update preferences',
        message: 'Please try again later',
        timestamp: new Date().toISOString()
      });
    }
  }
);

// GET /api/chat/health - Get chatbot service health
router.get('/chat/health',
  rateLimiter({ windowMs: 60000, max: 20 }), // 20 requests per minute
  async (req, res) => {
    try {
      const healthStatus = await chatbotService.getHealthStatus();

      res.json({
        success: true,
        data: healthStatus
      });

    } catch (error) {
      logger.error('Error getting chatbot health status', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to get health status',
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
);

// POST /api/chat/feedback - Submit feedback for chatbot responses
router.post('/chat/feedback',
  rateLimiter({ windowMs: 60000, max: 20 }), // 20 requests per minute
  async (req, res) => {
    try {
      const { userId, messageId, feedback, rating } = req.body;
      
      if (!userId || !messageId || !feedback) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'userId, messageId, and feedback are required'
        });
      }

      logger.info('Processing chatbot feedback', { 
        userId, 
        messageId, 
        feedback, 
        rating 
      });

      // Store feedback for learning (implement as needed)
      // await feedbackService.storeFeedback(userId, messageId, feedback, rating);

      res.json({
        success: true,
        message: 'Feedback submitted successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error processing feedback', error);
      
      ErrorHandler.getInstance().handleError(error, {
        logToConsole: true,
        reportToService: true,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to submit feedback',
        message: 'Please try again later',
        timestamp: new Date().toISOString()
      });
    }
  }
);

// WebSocket endpoint for real-time chat
router.ws('/chat/ws', (ws, req) => {
  logger.info('WebSocket connection established', { 
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'chat_message') {
        const { message: text, userId, attachments = [], mode = 'text' } = message;
        
        // Process message
        const result = await chatbotService.processMessage(
          text,
          userId,
          attachments,
          mode
        );

        // Send response back to client
        ws.send(JSON.stringify({
          type: 'chat_response',
          id: Date.now().toString(),
          content: result.response,
          metadata: result.metadata,
          suggestions: result.suggestions,
          timestamp: new Date().toISOString()
        }));

        // Send typing indicator
        ws.send(JSON.stringify({
          type: 'typing',
          isTyping: false,
          timestamp: new Date().toISOString()
        }));

      } else if (message.type === 'typing') {
        // Forward typing indicator
        ws.send(JSON.stringify({
          type: 'typing',
          isTyping: message.isTyping,
          timestamp: new Date().toISOString()
        }));
      }

    } catch (error) {
      logger.error('WebSocket message processing error', error);
      
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        timestamp: new Date().toISOString()
      }));
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error', error);
  });
});

export default router;
