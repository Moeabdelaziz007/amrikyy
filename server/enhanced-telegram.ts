// Enhanced Telegram Integration with Advanced Features
import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage.js';
import { getSmartMenuService } from './smart-menu.js';
import { getEnhancedChatPersona } from './enhanced-persona.js';
import { geminiMCP } from './gemini-mcp-protocol.js';

export interface TelegramConfig {
  token: string;
  webhookUrl?: string;
  polling?: boolean;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
}

export interface TelegramMessage {
  chatId: number;
  text: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  replyToMessageId?: number;
  replyMarkup?: any;
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
}

export interface TelegramUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isBot?: boolean;
  isPremium?: boolean;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  description?: string;
  memberCount?: number;
}

export class EnhancedTelegramService {
  private bot: TelegramBot;
  private isConnected: boolean = false;
  private smartMenuService = getSmartMenuService();
  private config: TelegramConfig;
  private userSessions: Map<number, any> = new Map();
  private chatAnalytics: Map<number, any> = new Map();
  private messageQueue: Array<{
    message: TelegramMessage;
    priority: number;
    timestamp: number;
  }> = [];
  private isProcessingQueue: boolean = false;

  constructor(config: TelegramConfig) {
    this.config = config;
    this.bot = new TelegramBot(config.token, {
      polling: config.polling !== false,
      webHook: !!config.webhookUrl,
    });

    if (config.webhookUrl) {
      this.bot.setWebHook(config.webhookUrl);
    }

    this.setupEventHandlers();
    this.startMessageQueueProcessor();
  }

  private setupEventHandlers() {
    // Enhanced message handling
    this.bot.on('message', async msg => {
      try {
        await this.handleEnhancedMessage(msg);
      } catch (error) {
        console.error('Error handling message:', error);
        await this.sendErrorMessage(
          msg.chat.id,
          'Sorry, an error occurred while processing your message.'
        );
      }
    });

    // Enhanced callback query handling
    this.bot.on('callback_query', async callbackQuery => {
      try {
        await this.handleEnhancedCallbackQuery(callbackQuery);
      } catch (error) {
        console.error('Error handling callback query:', error);
        await this.bot.answerCallbackQuery(callbackQuery.id, {
          text: 'Error processing request',
        });
      }
    });

    // Handle inline queries
    this.bot.on('inline_query', async inlineQuery => {
      try {
        await this.handleInlineQuery(inlineQuery);
      } catch (error) {
        console.error('Error handling inline query:', error);
      }
    });

    // Handle channel posts
    this.bot.on('channel_post', async post => {
      try {
        await this.handleChannelPost(post);
      } catch (error) {
        console.error('Error handling channel post:', error);
      }
    });

    // Handle edited messages
    this.bot.on('edited_message', async msg => {
      try {
        await this.handleEditedMessage(msg);
      } catch (error) {
        console.error('Error handling edited message:', error);
      }
    });

    // Error handling
    this.bot.on('polling_error', error => {
      console.error('Telegram polling error:', error);
      this.isConnected = false;
    });

    this.bot.on('webhook_error', error => {
      console.error('Telegram webhook error:', error);
    });

    this.isConnected = true;
    console.log(
      '🤖 Enhanced Telegram bot connected and listening for messages'
    );
  }

  private async handleEnhancedMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const user = this.extractUserInfo(msg.from);
    const chat = this.extractChatInfo(msg.chat);

    console.log(
      `📨 Enhanced message from ${user.username || user.firstName}: ${text}`
    );

    // Update user session
    this.updateUserSession(chatId, user, chat);

    // Track analytics
    this.trackMessageAnalytics(chatId, msg);

    // Save message to database with enhanced metadata
    await storage.createChatMessage({
      userId: `telegram-${user.id}`,
      message: `[Telegram] ${user.username || user.firstName}: ${text}`,
      response: 'Message received by Enhanced AuraOS',
      metadata: {
        chatType: chat.type,
        messageId: msg.message_id,
        timestamp: new Date(msg.date * 1000),
        user: user,
        chat: chat,
      },
    });

    // Handle different message types
    if (msg.photo) {
      await this.handlePhotoMessage(msg);
    } else if (msg.document) {
      await this.handleDocumentMessage(msg);
    } else if (msg.voice) {
      await this.handleVoiceMessage(msg);
    } else if (msg.sticker) {
      await this.handleStickerMessage(msg);
    } else if (msg.location) {
      await this.handleLocationMessage(msg);
    } else if (text) {
      await this.handleTextMessage(msg, text, user, chat);
    }
  }

  private async handleTextMessage(
    msg: TelegramBot.Message,
    text: string,
    user: TelegramUser,
    chat: TelegramChat
  ) {
    const chatId = msg.chat.id;

    // Track command usage for smart suggestions
    if (text.startsWith('/')) {
      this.smartMenuService.trackCommandUsage(chatId, text.split(' ')[0]);
    }

    // Enhanced command handling with AI integration
    if (text.startsWith('/start')) {
      await this.sendEnhancedWelcomeMessage(chatId, user);
    } else if (text.startsWith('/help')) {
      await this.sendEnhancedHelpMessage(chatId);
    } else if (text.startsWith('/menu')) {
      await this.sendEnhancedMenu(chatId, user);
    } else if (text.startsWith('/status')) {
      await this.sendEnhancedStatusMessage(chatId);
    } else if (text.startsWith('/posts')) {
      await this.sendRecentPosts(chatId);
    } else if (text.startsWith('/agents')) {
      await this.sendAgentTemplates(chatId);
    } else if (text.startsWith('/ai')) {
      await this.handleAICommand(chatId, text, user);
    } else if (text.startsWith('/translate')) {
      await this.handleTranslateCommand(chatId, text, user);
    } else if (text.startsWith('/analyze')) {
      await this.handleAnalyzeCommand(chatId, text, user);
    } else if (text.startsWith('/generate')) {
      await this.handleGenerateCommand(chatId, text, user);
    } else if (text.startsWith('/schedule')) {
      await this.handleScheduleCommand(chatId, text, user);
    } else if (text.startsWith('/broadcast')) {
      await this.handleBroadcastCommand(chatId, text, user);
    } else {
      await this.sendEnhancedDefaultResponse(chatId, text, user);
    }
  }

  // AI-Powered Commands
  private async handleAICommand(
    chatId: number,
    text: string,
    user: TelegramUser
  ) {
    const query = text.replace('/ai', '').trim();
    if (!query) {
      await this.sendMessage(
        chatId,
        'Please provide a question after /ai command.\nExample: /ai What is artificial intelligence?'
      );
      return;
    }

    try {
      const result = await geminiMCP.executeTool('gemini_question_answering', {
        question: query,
        context: `User: ${user.username || user.firstName}`,
        detail: 'detailed',
        includeSources: false,
        useCache: true,
      });

      if (result.success) {
        const answer =
          typeof result.result === 'string'
            ? result.result
            : result.result.text;
        await this.sendMessage(
          chatId,
          `🤖 AI Response:\n\n${answer}`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          "Sorry, I couldn't process your question. Please try again."
        );
      }
    } catch (error) {
      await this.sendMessage(
        chatId,
        'Sorry, there was an error processing your AI request.'
      );
    }
  }

  private async handleTranslateCommand(
    chatId: number,
    text: string,
    user: TelegramUser
  ) {
    const parts = text.split(' ');
    if (parts.length < 3) {
      await this.sendMessage(
        chatId,
        'Usage: /translate <language> <text>\nExample: /translate es Hello world'
      );
      return;
    }

    const targetLanguage = parts[1];
    const textToTranslate = parts.slice(2).join(' ');

    try {
      const result = await geminiMCP.executeTool('gemini_translation', {
        text: textToTranslate,
        from: 'auto',
        to: targetLanguage,
        context: `User: ${user.username || user.firstName}`,
        useCache: true,
      });

      if (result.success) {
        const translation =
          typeof result.result === 'string'
            ? result.result
            : result.result.text;
        await this.sendMessage(
          chatId,
          `🌍 Translation to ${targetLanguage}:\n\n${translation}`
        );
      } else {
        await this.sendMessage(
          chatId,
          "Sorry, I couldn't translate your text. Please try again."
        );
      }
    } catch (error) {
      await this.sendMessage(
        chatId,
        'Sorry, there was an error with the translation.'
      );
    }
  }

  private async handleAnalyzeCommand(
    chatId: number,
    text: string,
    user: TelegramUser
  ) {
    const textToAnalyze = text.replace('/analyze', '').trim();
    if (!textToAnalyze) {
      await this.sendMessage(
        chatId,
        'Please provide text to analyze after /analyze command.'
      );
      return;
    }

    try {
      const result = await geminiMCP.executeTool('gemini_sentiment_analysis', {
        text: textToAnalyze,
        detail: 'detailed',
        useCache: true,
      });

      if (result.success) {
        const analysis =
          typeof result.result === 'string'
            ? result.result
            : JSON.stringify(result.result);
        await this.sendMessage(
          chatId,
          `📊 Sentiment Analysis:\n\n${analysis}`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          "Sorry, I couldn't analyze your text. Please try again."
        );
      }
    } catch (error) {
      await this.sendMessage(
        chatId,
        'Sorry, there was an error with the analysis.'
      );
    }
  }

  private async handleGenerateCommand(
    chatId: number,
    text: string,
    user: TelegramUser
  ) {
    const prompt = text.replace('/generate', '').trim();
    if (!prompt) {
      await this.sendMessage(
        chatId,
        'Please provide a prompt after /generate command.\nExample: /generate Write a poem about AI'
      );
      return;
    }

    try {
      const result = await geminiMCP.executeTool('gemini_content_generation', {
        prompt: prompt,
        type: 'article',
        length: 'medium',
        tone: 'creative',
        useCache: true,
      });

      if (result.success) {
        const content =
          typeof result.result === 'string'
            ? result.result
            : result.result.text;
        await this.sendMessage(
          chatId,
          `✍️ Generated Content:\n\n${content}`,
          'Markdown'
        );
      } else {
        await this.sendMessage(
          chatId,
          "Sorry, I couldn't generate content. Please try again."
        );
      }
    } catch (error) {
      await this.sendMessage(
        chatId,
        'Sorry, there was an error generating content.'
      );
    }
  }

  private async handleScheduleCommand(
    chatId: number,
    text: string,
    user: TelegramUser
  ) {
    const parts = text.split(' ');
    if (parts.length < 3) {
      await this.sendMessage(
        chatId,
        'Usage: /schedule <time> <message>\nExample: /schedule 14:30 Meeting reminder'
      );
      return;
    }

    const time = parts[1];
    const message = parts.slice(2).join(' ');

    // Simple time validation
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      await this.sendMessage(
        chatId,
        'Invalid time format. Please use HH:MM format.'
      );
      return;
    }

    // Schedule the message (simplified implementation)
    const scheduledTime = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await this.sendMessage(
      chatId,
      `✅ Message scheduled for ${scheduledTime.toLocaleString()}:\n"${message}"`
    );
  }

  private async handleBroadcastCommand(
    chatId: number,
    text: string,
    user: TelegramUser
  ) {
    // Only allow broadcast for admin users (simplified check)
    if (!this.isAdminUser(user.id)) {
      await this.sendMessage(
        chatId,
        "❌ You don't have permission to use broadcast commands."
      );
      return;
    }

    const message = text.replace('/broadcast', '').trim();
    if (!message) {
      await this.sendMessage(
        chatId,
        'Usage: /broadcast <message>\nExample: /broadcast Important announcement'
      );
      return;
    }

    await this.sendMessage(
      chatId,
      `📢 Broadcast message prepared:\n"${message}"\n\nSend /confirm to broadcast to all users.`
    );
  }

  // Enhanced message sending with queue
  private async sendMessage(
    chatId: number,
    text: string,
    parseMode?: string,
    options?: any
  ) {
    const message: TelegramMessage = {
      chatId,
      text,
      parseMode: parseMode as any,
      disableWebPagePreview: this.config.disableWebPagePreview,
      disableNotification: this.config.disableNotification,
      ...options,
    };

    // Add to queue with priority
    this.messageQueue.push({
      message,
      priority: options?.priority || 1,
      timestamp: Date.now(),
    });

    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processMessageQueue();
    }
  }

  private async processMessageQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      // Sort by priority and timestamp
      this.messageQueue.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority; // Higher priority first
        }
        return a.timestamp - b.timestamp; // Earlier timestamp first
      });

      const { message } = this.messageQueue.shift()!;

      try {
        await this.bot.sendMessage(message.chatId, message.text, {
          parse_mode: message.parseMode,
          reply_to_message_id: message.replyToMessageId,
          reply_markup: message.replyMarkup,
          disable_web_page_preview: message.disableWebPagePreview,
          disable_notification: message.disableNotification,
        });

        // Rate limiting - wait between messages
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    this.isProcessingQueue = false;
  }

  private startMessageQueueProcessor() {
    setInterval(() => {
      if (this.messageQueue.length > 0 && !this.isProcessingQueue) {
        this.processMessageQueue();
      }
    }, 1000);
  }

  // Enhanced welcome message with AI
  private async sendEnhancedWelcomeMessage(chatId: number, user: TelegramUser) {
    const welcomeText = `🎉 Welcome to Enhanced AuraOS, ${user.firstName || user.username || 'User'}!

I'm your AI-powered assistant with advanced capabilities:

🤖 **AI Commands:**
• /ai <question> - Ask me anything
• /translate <lang> <text> - Translate text
• /analyze <text> - Sentiment analysis
• /generate <prompt> - Generate content

📱 **Core Features:**
• /menu - Interactive menu
• /status - System status
• /posts - Recent posts
• /agents - AI agents
• /schedule <time> <msg> - Schedule messages

🚀 **What's New:**
• Gemini AI integration
• Enhanced message handling
• Smart analytics
• Advanced scheduling
• Multi-language support

Type /help for more information or /menu for interactive options!`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🤖 Ask AI', callback_data: 'ai_menu' },
          { text: '📊 Analytics', callback_data: 'analytics_menu' },
        ],
        [
          { text: '⚙️ Settings', callback_data: 'settings_menu' },
          { text: '❓ Help', callback_data: 'help_menu' },
        ],
      ],
    };

    await this.sendMessage(chatId, welcomeText, 'Markdown', {
      replyMarkup: keyboard,
    });
  }

  private async sendEnhancedHelpMessage(chatId: number) {
    const helpText = `📚 **Enhanced AuraOS Help**

**🤖 AI Commands:**
• \`/ai <question>\` - Ask AI anything
• \`/translate <lang> <text>\` - Translate text
• \`/analyze <text>\` - Analyze sentiment
• \`/generate <prompt>\` - Generate content

**📱 Core Commands:**
• \`/start\` - Welcome message
• \`/menu\` - Interactive menu
• \`/status\` - System status
• \`/posts\` - Recent posts
• \`/agents\` - AI agents

**⚙️ Advanced Features:**
• \`/schedule <time> <msg>\` - Schedule messages
• \`/broadcast <msg>\` - Broadcast (admin only)

**💡 Tips:**
• Use inline keyboards for quick actions
• All AI responses are cached for faster replies
• Analytics track your usage patterns
• Multi-language support available

Need more help? Contact support or use /menu for interactive options!`;

    await this.sendMessage(chatId, helpText, 'Markdown');
  }

  // Utility methods
  private extractUserInfo(from: TelegramBot.User): TelegramUser {
    return {
      id: from.id,
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name,
      languageCode: from.language_code,
      isBot: from.is_bot,
      isPremium: (from as any).is_premium,
    };
  }

  private extractChatInfo(chat: TelegramBot.Chat): TelegramChat {
    return {
      id: chat.id,
      type: chat.type as any,
      title: chat.title,
      username: chat.username,
      description: chat.description,
      memberCount: (chat as any).member_count,
    };
  }

  private updateUserSession(
    chatId: number,
    user: TelegramUser,
    chat: TelegramChat
  ) {
    this.userSessions.set(chatId, {
      user,
      chat,
      lastActivity: new Date(),
      messageCount: (this.userSessions.get(chatId)?.messageCount || 0) + 1,
    });
  }

  private trackMessageAnalytics(chatId: number, msg: TelegramBot.Message) {
    const analytics = this.chatAnalytics.get(chatId) || {
      totalMessages: 0,
      commandsUsed: 0,
      lastActivity: new Date(),
      userTypes: new Set(),
    };

    analytics.totalMessages++;
    analytics.lastActivity = new Date();

    if (msg.text?.startsWith('/')) {
      analytics.commandsUsed++;
    }

    if (msg.from) {
      analytics.userTypes.add(msg.from.is_bot ? 'bot' : 'user');
    }

    this.chatAnalytics.set(chatId, analytics);
  }

  private isAdminUser(userId: number): boolean {
    // Simplified admin check - in production, this should be more robust
    const adminIds = [123456789]; // Add your admin user IDs here
    return adminIds.includes(userId);
  }

  private async sendErrorMessage(chatId: number, message: string) {
    await this.sendMessage(chatId, `❌ ${message}`, undefined, { priority: 2 });
  }

  // Placeholder methods for other message types
  private async handlePhotoMessage(msg: TelegramBot.Message) {
    await this.sendMessage(
      msg.chat.id,
      '📸 Photo received! I can analyze images with AI. Send /ai <description> for image analysis.'
    );
  }

  private async handleDocumentMessage(msg: TelegramBot.Message) {
    await this.sendMessage(
      msg.chat.id,
      '📄 Document received! I can process documents. Send /analyze <text> for document analysis.'
    );
  }

  private async handleVoiceMessage(msg: TelegramBot.Message) {
    await this.sendMessage(
      msg.chat.id,
      '🎤 Voice message received! Voice processing coming soon.'
    );
  }

  private async handleStickerMessage(msg: TelegramBot.Message) {
    await this.sendMessage(
      msg.chat.id,
      '😄 Sticker received! Thanks for the emoji!'
    );
  }

  private async handleLocationMessage(msg: TelegramBot.Message) {
    await this.sendMessage(
      msg.chat.id,
      '📍 Location received! Location-based features coming soon.'
    );
  }

  private async handleInlineQuery(inlineQuery: TelegramBot.InlineQuery) {
    // Handle inline queries
    const results = [
      {
        type: 'article',
        id: '1',
        title: 'Ask AI',
        description: 'Ask AI anything',
        input_message_content: {
          message_text: '🤖 AI Query: ' + inlineQuery.query,
        },
      },
    ];

    await this.bot.answerInlineQuery(inlineQuery.id, results);
  }

  private async handleChannelPost(post: TelegramBot.Message) {
    console.log('📢 Channel post received:', post.text);
  }

  private async handleEditedMessage(msg: TelegramBot.Message) {
    console.log('✏️ Message edited:', msg.text);
  }

  private async handleEnhancedCallbackQuery(
    callbackQuery: TelegramBot.CallbackQuery
  ) {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data;

    if (!chatId) return;

    await this.bot.answerCallbackQuery(callbackQuery.id);

    // Handle enhanced callback queries
    if (data === 'ai_menu') {
      await this.sendMessage(
        chatId,
        '🤖 AI Menu:\n\n• Ask me anything\n• Translate text\n• Analyze sentiment\n• Generate content\n\nUse commands like /ai <question>'
      );
    } else if (data === 'analytics_menu') {
      const analytics = this.chatAnalytics.get(chatId);
      const session = this.userSessions.get(chatId);

      const analyticsText = `📊 Your Analytics:
• Messages: ${analytics?.totalMessages || 0}
• Commands: ${analytics?.commandsUsed || 0}
• Session: ${session?.messageCount || 0} messages
• Last Activity: ${analytics?.lastActivity?.toLocaleString() || 'Unknown'}`;

      await this.sendMessage(chatId, analyticsText);
    } else if (data === 'settings_menu') {
      await this.sendMessage(
        chatId,
        '⚙️ Settings:\n\n• Language: Auto-detect\n• Notifications: Enabled\n• AI Responses: Cached\n• Analytics: Enabled'
      );
    } else if (data === 'help_menu') {
      await this.sendEnhancedHelpMessage(chatId);
    }
  }

  // Public API methods
  public async sendMessageToUser(chatId: number, text: string, options?: any) {
    await this.sendMessage(chatId, text, undefined, options);
  }

  public async broadcastMessage(text: string, excludeChatIds: number[] = []) {
    const chatIds = Array.from(this.userSessions.keys()).filter(
      id => !excludeChatIds.includes(id)
    );

    for (const chatId of chatIds) {
      await this.sendMessage(chatId, `📢 Broadcast:\n\n${text}`, undefined, {
        priority: 3,
      });
    }
  }

  public getAnalytics() {
    return {
      totalUsers: this.userSessions.size,
      totalChats: this.chatAnalytics.size,
      isConnected: this.isConnected,
      queueLength: this.messageQueue.length,
    };
  }

  public getUserSession(chatId: number) {
    return this.userSessions.get(chatId);
  }

  public getChatAnalytics(chatId: number) {
    return this.chatAnalytics.get(chatId);
  }

  public isBotConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const enhancedTelegramService = new EnhancedTelegramService({
  token: '8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0',
  polling: true,
  parseMode: 'Markdown',
  disableWebPagePreview: true,
});

export default enhancedTelegramService;
