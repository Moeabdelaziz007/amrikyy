// Enhanced Telegram API Routes
import { Router } from 'express';
import { enhancedTelegramService } from './enhanced-telegram.js';
import { geminiMCP } from './gemini-mcp-protocol.js';

const router = Router();

// Enhanced status endpoint
router.get('/status', async (req, res) => {
  try {
    const analytics = enhancedTelegramService.getAnalytics();
    const botInfo = {
      connected: analytics.isConnected,
      totalUsers: analytics.totalUsers,
      totalChats: analytics.totalChats,
      queueLength: analytics.queueLength,
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: botInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Enhanced send message endpoint
router.post('/send-message', async (req, res) => {
  try {
    const { chatId, text, parseMode, options } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({
        success: false,
        error: 'chatId and text are required',
      });
    }

    await enhancedTelegramService.sendMessageToUser(chatId, text, {
      parseMode,
      ...options,
    });

    res.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Enhanced broadcast endpoint
router.post('/broadcast', async (req, res) => {
  try {
    const { message, excludeChatIds } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'message is required',
      });
    }

    await enhancedTelegramService.broadcastMessage(message, excludeChatIds);

    res.json({
      success: true,
      message: 'Broadcast sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// AI-powered message endpoint
router.post('/ai-message', async (req, res) => {
  try {
    const { chatId, question, context } = req.body;

    if (!chatId || !question) {
      return res.status(400).json({
        success: false,
        error: 'chatId and question are required',
      });
    }

    const result = await geminiMCP.executeTool('gemini_question_answering', {
      question,
      context: context || 'Telegram user query',
      detail: 'detailed',
      includeSources: false,
      useCache: true,
    });

    if (result.success) {
      const answer =
        typeof result.result === 'string' ? result.result : result.result.text;
      await enhancedTelegramService.sendMessageToUser(
        chatId,
        `🤖 AI Response:\n\n${answer}`,
        {
          parseMode: 'Markdown',
        }
      );

      res.json({
        success: true,
        message: 'AI response sent successfully',
        answer: answer.substring(0, 100) + '...',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI response',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Translation endpoint
router.post('/translate', async (req, res) => {
  try {
    const { chatId, text, from, to } = req.body;

    if (!chatId || !text || !to) {
      return res.status(400).json({
        success: false,
        error: 'chatId, text, and to are required',
      });
    }

    const result = await geminiMCP.executeTool('gemini_translation', {
      text,
      from: from || 'auto',
      to,
      useCache: true,
    });

    if (result.success) {
      const translation =
        typeof result.result === 'string' ? result.result : result.result.text;
      await enhancedTelegramService.sendMessageToUser(
        chatId,
        `🌍 Translation to ${to}:\n\n${translation}`
      );

      res.json({
        success: true,
        message: 'Translation sent successfully',
        translation: translation.substring(0, 100) + '...',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to translate text',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Sentiment analysis endpoint
router.post('/analyze-sentiment', async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({
        success: false,
        error: 'chatId and text are required',
      });
    }

    const result = await geminiMCP.executeTool('gemini_sentiment_analysis', {
      text,
      detail: 'detailed',
      useCache: true,
    });

    if (result.success) {
      const analysis =
        typeof result.result === 'string'
          ? result.result
          : JSON.stringify(result.result);
      await enhancedTelegramService.sendMessageToUser(
        chatId,
        `📊 Sentiment Analysis:\n\n${analysis}`,
        {
          parseMode: 'Markdown',
        }
      );

      res.json({
        success: true,
        message: 'Sentiment analysis sent successfully',
        analysis: analysis.substring(0, 100) + '...',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to analyze sentiment',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Content generation endpoint
router.post('/generate-content', async (req, res) => {
  try {
    const { chatId, prompt, type, length, tone } = req.body;

    if (!chatId || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'chatId and prompt are required',
      });
    }

    const result = await geminiMCP.executeTool('gemini_content_generation', {
      prompt,
      type: type || 'article',
      length: length || 'medium',
      tone: tone || 'professional',
      useCache: true,
    });

    if (result.success) {
      const content =
        typeof result.result === 'string' ? result.result : result.result.text;
      await enhancedTelegramService.sendMessageToUser(
        chatId,
        `✍️ Generated Content:\n\n${content}`,
        {
          parseMode: 'Markdown',
        }
      );

      res.json({
        success: true,
        message: 'Content generated successfully',
        content: content.substring(0, 100) + '...',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate content',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Analytics endpoint
router.get('/analytics/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const chatIdNum = parseInt(chatId);

    if (isNaN(chatIdNum)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid chatId',
      });
    }

    const analytics = enhancedTelegramService.getChatAnalytics(chatIdNum);
    const session = enhancedTelegramService.getUserSession(chatIdNum);

    res.json({
      success: true,
      data: {
        analytics,
        session,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Send photo endpoint
router.post('/send-photo', async (req, res) => {
  try {
    const { chatId, photo, caption } = req.body;

    if (!chatId || !photo) {
      return res.status(400).json({
        success: false,
        error: 'chatId and photo are required',
      });
    }

    // This would need to be implemented with the actual bot instance
    // For now, we'll send a text message
    await enhancedTelegramService.sendMessageToUser(
      chatId,
      `📸 Photo received${caption ? `: ${caption}` : ''}`
    );

    res.json({
      success: true,
      message: 'Photo message sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Schedule message endpoint
router.post('/schedule', async (req, res) => {
  try {
    const { chatId, message, scheduledTime } = req.body;

    if (!chatId || !message || !scheduledTime) {
      return res.status(400).json({
        success: false,
        error: 'chatId, message, and scheduledTime are required',
      });
    }

    const scheduleTime = new Date(scheduledTime);
    if (isNaN(scheduleTime.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scheduledTime format',
      });
    }

    // Simple scheduling implementation
    const delay = scheduleTime.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(async () => {
        await enhancedTelegramService.sendMessageToUser(
          chatId,
          `⏰ Scheduled Message:\n\n${message}`
        );
      }, delay);
    }

    res.json({
      success: true,
      message: 'Message scheduled successfully',
      scheduledFor: scheduleTime.toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Webhook endpoint for Telegram
router.post('/webhook', async (req, res) => {
  try {
    // Telegram webhook handling
    const update = req.body;

    if (update.message) {
      // Message will be handled by the bot's event handlers
      console.log('Webhook message received:', update.message.text);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get bot commands endpoint
router.get('/commands', async (req, res) => {
  try {
    const commands = [
      {
        command: 'start',
        description: 'Start the bot and get welcome message',
      },
      { command: 'help', description: 'Get help and available commands' },
      { command: 'menu', description: 'Show interactive menu' },
      { command: 'status', description: 'Get system status' },
      { command: 'ai', description: 'Ask AI anything' },
      {
        command: 'translate',
        description: 'Translate text to another language',
      },
      { command: 'analyze', description: 'Analyze text sentiment' },
      { command: 'generate', description: 'Generate content with AI' },
      { command: 'schedule', description: 'Schedule a message' },
      { command: 'broadcast', description: 'Broadcast message (admin only)' },
    ];

    res.json({
      success: true,
      data: commands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
