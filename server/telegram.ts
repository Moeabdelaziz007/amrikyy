import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage.js';
import { getSmartMenuService } from './smart-menu.js';
import { getEnhancedChatPersona } from './enhanced-persona.js';

export class TelegramService {
  private bot: TelegramBot;
  private isConnected: boolean = false;
  private smartMenuService = getSmartMenuService();

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Handle incoming messages
    this.bot.on('message', async (msg) => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Handle callback queries (inline keyboard buttons)
    this.bot.on('callback_query', async (callbackQuery) => {
      try {
        await this.handleCallbackQuery(callbackQuery);
      } catch (error) {
        console.error('Error handling callback query:', error);
      }
    });

    // Handle polling errors
    this.bot.on('polling_error', (error) => {
      console.error('Telegram polling error:', error);
    });

    // Handle connection status
    this.bot.on('webhook_error', (error) => {
      console.error('Telegram webhook error:', error);
    });

    this.isConnected = true;
    console.log('🤖 Telegram bot connected and listening for messages');
  }

  private async handleMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from?.username || msg.from?.first_name || 'Unknown';

    console.log(`📨 Received message from ${username}: ${text}`);

    // Track command usage for smart suggestions
    if (text?.startsWith('/')) {
      this.smartMenuService.trackCommandUsage(chatId, text.split(' ')[0]);
    }

    // Save message to database
    await storage.createChatMessage({
      userId: 'telegram-user',
      message: `[Telegram] ${username}: ${text}`,
      response: 'Message received by AuraOS'
    });

    // Handle different types of messages with smart menu integration
    if (text?.startsWith('/start')) {
      await this.sendSmartWelcomeMessage(chatId, username);
    } else if (text?.startsWith('/help')) {
      await this.sendSmartHelpMessage(chatId);
    } else if (text?.startsWith('/menu')) {
      await this.sendSmartMenu(chatId, username);
    } else if (text?.startsWith('/status')) {
      await this.sendStatusMessage(chatId);
    } else if (text?.startsWith('/posts')) {
      await this.sendRecentPosts(chatId);
    } else if (text?.startsWith('/agents')) {
      await this.sendAgentTemplates(chatId);
    } else {
      await this.sendDefaultResponse(chatId, text);
    }
  }

  private async handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data;

    if (!chatId) return;

    // Answer the callback query to remove loading state
    await this.bot.answerCallbackQuery(callbackQuery.id);

    // Handle smart menu callbacks
    if (data.endsWith('_menu')) {
      await this.handleSmartMenuCallback(chatId, data);
      return;
    }

    // Handle legacy callbacks
    switch (data) {
      case 'get_posts':
        await this.sendRecentPosts(chatId);
        break;
      case 'get_agents':
        await this.sendAgentTemplates(chatId);
        break;
      case 'get_status':
        await this.sendStatusMessage(chatId);
        break;
      case 'create_post':
        await this.bot.sendMessage(chatId, '📝 To create a post, send your content with the format:\n\n`/create Your post content here`');
        break;
      case 'main_menu':
        await this.sendSmartMenu(chatId, 'User');
        break;
      default:
        await this.handleSmartMenuCallback(chatId, data);
    }
  }

  // Handle smart menu callbacks
  private async handleSmartMenuCallback(chatId: number, callbackData: string) {
    const username = 'User'; // In a real app, you'd get this from user context
    
    switch (callbackData) {
      case 'posts_menu':
        const postsMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'posts');
        await this.bot.sendMessage(chatId, postsMenu.text, postsMenu.keyboard);
        break;
      case 'agents_menu':
        const agentsMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'agents');
        await this.bot.sendMessage(chatId, agentsMenu.text, agentsMenu.keyboard);
        break;
      case 'analytics_menu':
        const analyticsMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'analytics');
        await this.bot.sendMessage(chatId, analyticsMenu.text, analyticsMenu.keyboard);
        break;
      case 'settings_menu':
        const settingsMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'settings');
        await this.bot.sendMessage(chatId, settingsMenu.text, settingsMenu.keyboard);
        break;
      case 'quick_actions_menu':
        const quickActionsMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'quick_actions');
        await this.bot.sendMessage(chatId, quickActionsMenu.text, quickActionsMenu.keyboard);
        break;
      case 'help_menu':
        await this.sendSmartHelpMessage(chatId);
        break;
      case 'create_post':
        await this.bot.sendMessage(chatId, '📝 To create a post, send your content with the format:\n\n`/create Your post content here`');
        break;
      case 'schedule_post':
        await this.bot.sendMessage(chatId, '📅 To schedule a post, use:\n\n`/schedule YYYY-MM-DD HH:MM Your post content here`');
        break;
      case 'view_all_posts':
        await this.sendRecentPosts(chatId);
        break;
      case 'ai_generator':
        await this.bot.sendMessage(chatId, '🤖 AI Content Generator\n\nSend me a topic or idea, and I\'ll help you create engaging content!');
        break;
      case 'post_analytics':
        await this.sendStatusMessage(chatId);
        break;
      case 'create_agent':
        await this.bot.sendMessage(chatId, '🆕 Create AI Agent\n\nUse `/agents` to see available templates, or describe what you need!');
        break;
      case 'browse_templates':
        await this.sendAgentTemplates(chatId);
        break;
      case 'active_agents':
        await this.bot.sendMessage(chatId, '⚡ Active Agents\n\nChecking your active AI agents...');
        break;
      case 'agent_performance':
        await this.bot.sendMessage(chatId, '📊 Agent Performance\n\nAnalyzing your AI agents\' performance...');
        break;
      case 'performance_overview':
        await this.sendStatusMessage(chatId);
        break;
      case 'engagement_insights':
        await this.bot.sendMessage(chatId, '🎯 Engagement Insights\n\nAnalyzing your content engagement...');
        break;
      case 'quick_post':
        await this.bot.sendMessage(chatId, '📝 Quick Post\n\nSend your content and I\'ll help you optimize it!');
        break;
      case 'quick_agent':
        await this.bot.sendMessage(chatId, '🤖 Quick Agent\n\nTell me what you need automated!');
        break;
      case 'quick_stats':
        await this.sendStatusMessage(chatId);
        break;
      case 'run_automation':
        await this.bot.sendMessage(chatId, '🔄 Run Automation\n\nStarting your automation workflows...');
        break;
      case 'ai_chat':
        await this.bot.sendMessage(chatId, '💬 AI Chat\n\nI\'m here to help! What would you like to know?');
        break;
      default:
        await this.bot.sendMessage(chatId, '❓ Unknown command. Use /menu to see available options.');
    }
  }

  // Smart welcome message using the smart menu system
  private async sendSmartWelcomeMessage(chatId: number, username: string) {
    const menu = await this.smartMenuService.generateSmartMenu(chatId, username, 'main');
    await this.bot.sendMessage(chatId, menu.text, menu.keyboard);
  }

  // Smart help message
  private async sendSmartHelpMessage(chatId: number) {
    const helpText = `🆘 AuraOS Smart Assistant Help

🎯 **Smart Commands:**
/start - Welcome message with smart menu
/menu - Access main smart menu
/help - Show this help message

📱 **Core Commands:**
/status - Get platform status and statistics
/posts - View recent posts
/agents - List available AI agent templates
/create <content> - Create a new post
/schedule <time> <content> - Schedule a post

🤖 **Smart Features:**
• Context-aware menus
• Personalized suggestions
• Quick actions for power users
• Intelligent command tracking
• Adaptive interface

💡 **Pro Tips:**
• Use /menu to access smart navigation
• The bot learns your preferences over time
• Quick actions appear after 10+ interactions
• All menus adapt to your usage patterns

🎯 Try /menu to see your personalized smart menu!`;

    await this.bot.sendMessage(chatId, helpText);
  }

  // Send smart menu
  private async sendSmartMenu(chatId: number, username: string) {
    const menu = await this.smartMenuService.generateSmartMenu(chatId, username, 'main');
    await this.bot.sendMessage(chatId, menu.text, menu.keyboard);
  }

  // Legacy welcome message (kept for compatibility)
  private async sendWelcomeMessage(chatId: number, username: string) {
    const welcomeText = `🎉 Welcome to AuraOS, ${username}!

I'm your AI-powered social media automation assistant. I can help you:

🤖 Manage AI agents and workflows
📊 View analytics and statistics  
📝 Create and schedule posts
🔄 Monitor automation status
💬 Chat with AI assistant

Use /help to see all available commands or click the buttons below:`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 Dashboard Status', callback_data: 'get_status' },
            { text: '📝 Recent Posts', callback_data: 'get_posts' }
          ],
          [
            { text: '🤖 AI Agents', callback_data: 'get_agents' },
            { text: '📝 Create Post', callback_data: 'create_post' }
          ],
          [
            { text: '❓ Help', callback_data: 'help' }
          ]
        ]
      }
    };

    await this.bot.sendMessage(chatId, welcomeText, keyboard);
  }

  private async sendHelpMessage(chatId: number) {
    const helpText = `🆘 AuraOS Telegram Bot Commands:

/start - Welcome message and main menu
/help - Show this help message
/status - Get platform status and statistics
/posts - View recent posts
/agents - List available AI agent templates
/create <content> - Create a new post
/schedule <time> <content> - Schedule a post

📱 You can also use the inline buttons for quick actions!

💡 Pro tip: Send any message and I'll help you with AI-powered content suggestions.`;

    await this.bot.sendMessage(chatId, helpText);
  }

  private async sendStatusMessage(chatId: number) {
    try {
      const stats = await storage.getUserStats('user-1');
      const posts = await storage.getPostsWithAuthor(5);
      const agents = await storage.getUserAgents('user-1');

      const statusText = `📊 AuraOS Platform Status:

📝 Total Posts: ${stats.totalPosts}
🤖 Active Agents: ${stats.activeAgents}
📈 Engagement Rate: ${stats.engagementRate}%
🔄 Automations Run: ${stats.automationsRun}

📱 Recent Activity:
${posts.slice(0, 3).map(post => 
  `• ${post.content.substring(0, 50)}... (${post.likes} likes)`
).join('\n')}

🤖 Active Agents: ${agents.filter(a => a.isActive).length}`;

      await this.bot.sendMessage(chatId, statusText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving status. Please try again later.');
    }
  }

  private async sendRecentPosts(chatId: number) {
    try {
      const posts = await storage.getPostsWithAuthor(5);
      
      if (posts.length === 0) {
        await this.bot.sendMessage(chatId, '📝 No posts found. Create your first post!');
        return;
      }

      let postsText = '📝 Recent Posts:\n\n';
      posts.forEach((post, index) => {
        postsText += `${index + 1}. ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}\n`;
        postsText += `   👍 ${post.likes} | 🔄 ${post.shares} | 💬 ${post.comments}\n\n`;
      });

      await this.bot.sendMessage(chatId, postsText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving posts. Please try again later.');
    }
  }

  private async sendAgentTemplates(chatId: number) {
    try {
      const templates = await storage.getAgentTemplates();
      
      let agentsText = '🤖 Available AI Agent Templates:\n\n';
      templates.forEach((template, index) => {
        agentsText += `${index + 1}. ${template.name}\n`;
        agentsText += `   📝 ${template.description}\n`;
        agentsText += `   🏷️ Category: ${template.category}\n`;
        agentsText += `   📊 Used ${template.usageCount} times\n\n`;
      });

      await this.bot.sendMessage(chatId, agentsText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving agent templates. Please try again later.');
    }
  }

  private async sendDefaultResponse(chatId: number, text?: string) {
    if (!text) return;

    // Check if it's a create post command
    if (text.startsWith('/create ')) {
      const content = text.substring(8);
      await this.createPostFromTelegram(chatId, content);
      return;
    }

    // Check if it's a schedule post command
    if (text.startsWith('/schedule ')) {
      const parts = text.substring(10).split(' ', 2);
      if (parts.length >= 2) {
        await this.schedulePostFromTelegram(chatId, parts[0], parts[1]);
        return;
      }
    }

    // Enhanced AI response with persona
    try {
      const username = 'User'; // In a real app, get from message context
      const intelligentResponse = await this.enhancedPersona.generateIntelligentResponse(text, chatId, username);
      
      // Send main response
      await this.bot.sendMessage(chatId, intelligentResponse.response);
      
      // Send suggestions if available
      if (intelligentResponse.suggestions.length > 0) {
        const suggestionsText = `💡 **Quick Actions:**\n${intelligentResponse.suggestions.map(s => `• ${s}`).join('\n')}`;
        await this.bot.sendMessage(chatId, suggestionsText);
      }
      
      // Add smart menu option for easy navigation
      const menuKeyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🎯 Smart Menu', callback_data: 'main_menu' },
              { text: '💬 Continue Chat', callback_data: 'continue_chat' }
            ]
          ]
        }
      };
      
      await this.bot.sendMessage(chatId, '🎯 Need more help? Use the smart menu for quick navigation!', menuKeyboard);
      
    } catch (error) {
      console.error('Enhanced persona error:', error);
      // Fallback to basic AI response
      const aiResponse = await this.generateAIResponse(text);
      await this.bot.sendMessage(chatId, `🤖 AI Response:\n\n${aiResponse}`);
    }
  }

  private async createPostFromTelegram(chatId: number, content: string) {
    try {
      const post = await storage.createPost({
        authorId: 'user-1',
        content: content,
        isAiGenerated: false
      });

      await this.bot.sendMessage(chatId, `✅ Post created successfully!\n\n📝 Content: ${content}\n🆔 Post ID: ${post.id}`);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error creating post. Please try again.');
    }
  }

  private async schedulePostFromTelegram(chatId: number, time: string, content: string) {
    // This would integrate with a scheduling system
    await this.bot.sendMessage(chatId, `⏰ Post scheduled for ${time}:\n\n📝 Content: ${content}\n\nNote: Scheduling feature coming soon!`);
  }

  private async generateAIResponse(text: string): Promise<string> {
    try {
      // This would integrate with your AI service
      return `I understand you said: "${text}". This is a placeholder response. The AI integration will provide more intelligent responses based on your message.`;
    } catch (error) {
      return 'Sorry, I encountered an error processing your message. Please try again.';
    }
  }

  // Public methods for external use
  async sendMessage(chatId: number, text: string, options?: TelegramBot.SendMessageOptions) {
    return await this.bot.sendMessage(chatId, text, options);
  }

  async sendPhoto(chatId: number, photo: string, options?: TelegramBot.SendPhotoOptions) {
    return await this.bot.sendPhoto(chatId, photo, options);
  }

  async getBotInfo() {
    return await this.bot.getMe();
  }

  async stopPolling() {
    await this.bot.stopPolling();
    this.isConnected = false;
    console.log('🤖 Telegram bot polling stopped');
  }

  isBotConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
let telegramService: TelegramService | null = null;

export function initializeTelegramBot(token: string): TelegramService {
  if (!telegramService) {
    telegramService = new TelegramService(token);
  }
  return telegramService;
}

export function getTelegramService(): TelegramService | null {
  return telegramService;
}
