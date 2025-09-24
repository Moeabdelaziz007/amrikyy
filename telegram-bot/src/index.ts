import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { logger } from './src/utils/logger.js';
import { redisClient } from './src/services/redis.js';
import { messageBroker } from './src/services/messageBroker.js';
import { telegramHandler } from './src/handlers/telegramHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: true });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
async function initializeServices() {
  try {
    // Connect to Redis
    await redisClient.connect();
    logger.info('Telegram Bot: Connected to Redis');

    // Initialize message broker
    await messageBroker.initialize();
    logger.info('Telegram Bot: Message broker initialized');

    // Start listening for events
    await messageBroker.subscribeToEvents('telegram-bot', telegramHandler.handleEvent);
    logger.info('Telegram Bot: Started listening for events');

    // Setup Telegram bot handlers
    setupTelegramHandlers();

    logger.info('Telegram Bot: All services initialized successfully');
  } catch (error) {
    logger.error('Telegram Bot: Failed to initialize services:', error);
    process.exit(1);
  }
}

function setupTelegramHandlers() {
  // Handle incoming messages
  bot.on('message', async (msg) => {
    try {
      logger.info('Telegram Bot: Received message', { 
        chatId: msg.chat.id, 
        userId: msg.from?.id, 
        text: msg.text 
      });

      // Publish message event to broker
      await messageBroker.publishEvent({
        source: 'telegram-bot',
        type: 'message-received',
        payload: {
          chatId: msg.chat.id,
          userId: msg.from?.id,
          username: msg.from?.username,
          firstName: msg.from?.first_name,
          lastName: msg.from?.last_name,
          text: msg.text,
          messageId: msg.message_id,
          timestamp: new Date(msg.date * 1000).toISOString()
        },
        correlation_id: msg.message_id?.toString()
      });

    } catch (error) {
      logger.error('Telegram Bot: Error handling message:', error);
    }
  });

  // Handle callback queries (inline keyboard buttons)
  bot.on('callback_query', async (callbackQuery) => {
    try {
      logger.info('Telegram Bot: Received callback query', { 
        chatId: callbackQuery.message?.chat.id, 
        userId: callbackQuery.from.id, 
        data: callbackQuery.data 
      });

      // Publish callback event to broker
      await messageBroker.publishEvent({
        source: 'telegram-bot',
        type: 'callback-received',
        payload: {
          chatId: callbackQuery.message?.chat.id,
          userId: callbackQuery.from.id,
          username: callbackQuery.from.username,
          firstName: callbackQuery.from.first_name,
          lastName: callbackQuery.from.last_name,
          callbackData: callbackQuery.data,
          messageId: callbackQuery.message?.message_id,
          timestamp: new Date().toISOString()
        },
        correlation_id: callbackQuery.id
      });

    } catch (error) {
      logger.error('Telegram Bot: Error handling callback query:', error);
    }
  });

  // Handle errors
  bot.on('error', (error) => {
    logger.error('Telegram Bot Error:', error);
  });

  bot.on('polling_error', (error) => {
    logger.error('Telegram Bot Polling Error:', error);
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'telegram-bot',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    botInfo: {
      username: bot.options.username,
      isPolling: bot.isPolling()
    }
  });
});

// Webhook endpoint for external integrations
app.post('/webhook', async (req, res) => {
  try {
    const { chatId, message, messageType = 'text' } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'Missing chatId or message' });
    }

    let sentMessage;
    switch (messageType) {
      case 'text':
        sentMessage = await bot.sendMessage(chatId, message);
        break;
      case 'photo':
        sentMessage = await bot.sendPhoto(chatId, message);
        break;
      case 'document':
        sentMessage = await bot.sendDocument(chatId, message);
        break;
      default:
        sentMessage = await bot.sendMessage(chatId, message);
    }

    logger.info('Telegram Bot: Message sent via webhook', { 
      chatId, 
      messageId: sentMessage.message_id 
    });

    res.json({
      success: true,
      messageId: sentMessage.message_id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Telegram Bot: Webhook error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Telegram Bot Service Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Telegram Bot: SIGTERM received, shutting down gracefully');
  bot.stopPolling();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Telegram Bot: SIGINT received, shutting down gracefully');
  bot.stopPolling();
  await redisClient.quit();
  process.exit(0);
});

// Start server
async function startServer() {
  await initializeServices();
  
  app.listen(PORT, () => {
    logger.info(`Telegram Bot Service running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set'}`);
  });
}

startServer().catch((error) => {
  logger.error('Failed to start Telegram Bot Service:', error);
  process.exit(1);
});

export default app;
