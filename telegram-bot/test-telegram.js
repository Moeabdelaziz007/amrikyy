#!/usr/bin/env node

/**
 * Telegram Bot Test Script
 * Tests the Telegram bot service without requiring a real bot token
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Telegram Bot for testing
class MockTelegramBot {
  constructor(token) {
    this.token = token;
    this._isPolling = false;
    this.options = { username: 'test-bot' };
  }

  on(event, callback) {
    console.log(`📡 Mock Bot: Listening for '${event}' events`);
    if (event === 'message') {
      // Simulate a message event after 2 seconds
      setTimeout(() => {
        const mockMessage = {
          chat: { id: 12345 },
          from: { 
            id: 67890, 
            username: 'testuser', 
            first_name: 'Test', 
            last_name: 'User' 
          },
          text: 'Hello from test user!',
          message_id: 1,
          date: Math.floor(Date.now() / 1000)
        };
        console.log('📨 Mock Bot: Simulating message event');
        callback(mockMessage);
      }, 2000);
    }
  }

  sendMessage(chatId, text, options = {}) {
    console.log(`📤 Mock Bot: Sending message to ${chatId}: ${text}`);
    return Promise.resolve({
      message_id: Math.floor(Math.random() * 1000),
      chat: { id: chatId },
      text: text,
      date: Math.floor(Date.now() / 1000)
    });
  }

  stopPolling() {
    console.log('🛑 Mock Bot: Stopping polling');
    this._isPolling = false;
  }

  isPolling() {
    return this._isPolling;
  }
}

// Initialize Mock Telegram Bot
const bot = new MockTelegramBot(process.env.TELEGRAM_BOT_TOKEN || 'test-token');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'telegram-bot-test',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    botInfo: {
      username: bot.options.username,
      isPolling: bot.isPolling(),
      type: 'mock-bot'
    }
  });
});

// Test webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { chatId, message, messageType = 'text' } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'Missing chatId or message' });
    }

    console.log(`📨 Test Webhook: Received ${messageType} message for chat ${chatId}`);

    const sentMessage = await bot.sendMessage(chatId, message);

    res.json({
      success: true,
      messageId: sentMessage.message_id,
      timestamp: new Date().toISOString(),
      test: true
    });

  } catch (error) {
    console.error('❌ Test Webhook Error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Test message endpoint
app.post('/test-message', async (req, res) => {
  try {
    const { chatId = 12345, message = 'Test message from Amrikyy AIOS System!' } = req.body;

    console.log(`🧪 Test: Sending test message to chat ${chatId}`);

    const sentMessage = await bot.sendMessage(chatId, message);

    res.json({
      success: true,
      messageId: sentMessage.message_id,
      chatId: chatId,
      message: message,
      timestamp: new Date().toISOString(),
      test: true
    });

  } catch (error) {
    console.error('❌ Test Message Error:', error);
    res.status(500).json({ error: 'Failed to send test message' });
  }
});

// Test bot events endpoint
app.get('/test-events', (req, res) => {
  console.log('🧪 Test: Triggering bot event simulation');
  
  // Simulate bot events
  setTimeout(() => {
    console.log('📡 Test: Bot event simulation completed');
  }, 1000);

  res.json({
    success: true,
    message: 'Bot event simulation triggered',
    timestamp: new Date().toISOString(),
    test: true
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Test Service Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    test: true
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Test Service: SIGTERM received, shutting down gracefully');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Test Service: SIGINT received, shutting down gracefully');
  bot.stopPolling();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Telegram Bot Test Service Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Bot Type: Mock Bot (for testing)`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log(`  • Health Check: GET http://localhost:${PORT}/health`);
  console.log(`  • Test Webhook: POST http://localhost:${PORT}/webhook`);
  console.log(`  • Test Message: POST http://localhost:${PORT}/test-message`);
  console.log(`  • Test Events: GET http://localhost:${PORT}/test-events`);
  console.log('');
  console.log('🧪 Test Commands:');
  console.log(`  curl http://localhost:${PORT}/health`);
  console.log(`  curl -X POST http://localhost:${PORT}/test-message -H "Content-Type: application/json" -d '{"chatId": 12345, "message": "Hello from test!"}'`);
  console.log('');
  console.log('✅ Ready for testing!');
});

module.exports = app;
