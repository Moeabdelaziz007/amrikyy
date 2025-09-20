import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage.js';
import { getSmartMenuService } from './smart-menu.js';
import { autopilotAgent } from './autopilot-agent.js';

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
      tenantId: 'default',
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
      await this.sendAutopilotStatus(chatId);
    } else if (text?.startsWith('/posts')) {
      await this.sendRecentPosts(chatId);
    } else if (text?.startsWith('/agents')) {
      await this.sendAgentTemplates(chatId);
    } else if (text?.startsWith('/autopilot')) {
      await this.handleAutopilotCommand(chatId, text);
    } else if (text?.startsWith('/task')) {
      await this.handleTaskCommand(chatId, text);
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
      // Travel service callbacks
      case 'travel_menu':
        const travelMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'travel');
        await this.bot.sendMessage(chatId, travelMenu.text, travelMenu.keyboard);
        break;
      case 'flight_booking':
        await this.bot.sendMessage(chatId, '✈️ Flight Booking\n\nI can help you find the best flight deals! Tell me your destination and travel dates.');
        break;
      case 'hotel_booking':
        await this.bot.sendMessage(chatId, '🏨 Hotel Booking\n\nI\'ll find the perfect hotel for you! What city are you visiting?');
        break;
      case 'car_rental':
        await this.bot.sendMessage(chatId, '🚗 Car Rental\n\nI can help you find the best car rental deals! Where do you need a car?');
        break;
      case 'travel_packages':
        await this.bot.sendMessage(chatId, '📦 Travel Packages\n\nI\'ll create a complete travel package for you! What\'s your dream destination?');
        break;
      case 'travel_activities':
        await this.bot.sendMessage(chatId, '🎯 Travel Activities\n\nI can recommend amazing activities! What type of experiences are you looking for?');
        break;
      case 'travel_agents':
        await this.bot.sendMessage(chatId, '🤖 Travel Agents\n\nHere are your AI travel agents:\n• Flight Booking Agent\n• Hotel Booking Agent\n• Car Rental Agent\n• Travel Package Agent\n• Activity Booking Agent');
        break;
      // Food service callbacks
      case 'food_menu':
        const foodMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'food');
        await this.bot.sendMessage(chatId, foodMenu.text, foodMenu.keyboard);
        break;
      case 'restaurant_discovery':
        await this.bot.sendMessage(chatId, '🍴 Restaurant Discovery\n\nI\'ll find the perfect restaurant for you! What cuisine do you prefer?');
        break;
      case 'food_delivery':
        await this.bot.sendMessage(chatId, '🚚 Food Delivery\n\nI can help you order food! What are you craving today?');
        break;
      case 'grocery_shopping':
        await this.bot.sendMessage(chatId, '🛒 Grocery Shopping\n\nI\'ll help you with your grocery shopping! What do you need to buy?');
        break;
      case 'meal_planning':
        await this.bot.sendMessage(chatId, '📋 Meal Planning\n\nI can create a meal plan for you! What are your dietary preferences?');
        break;
      case 'catering_services':
        await this.bot.sendMessage(chatId, '🎉 Catering Services\n\nI can help coordinate catering for your event! What type of event are you planning?');
        break;
      case 'food_agents':
        await this.bot.sendMessage(chatId, '🤖 Food Agents\n\nHere are your AI food agents:\n• Restaurant Discovery Agent\n• Food Delivery Agent\n• Grocery Shopping Agent\n• Meal Planning Agent\n• Catering Service Agent');
        break;
      // Shopping service callbacks
      case 'shopping_menu':
        const shoppingMenu = await this.smartMenuService.generateSmartMenu(chatId, username, 'shopping');
        await this.bot.sendMessage(chatId, shoppingMenu.text, shoppingMenu.keyboard);
        break;
      case 'price_comparison':
        await this.bot.sendMessage(chatId, '🔍 Price Comparison\n\nI can compare prices across multiple platforms! What are you looking to buy?');
        break;
      case 'deal_detection':
        await this.bot.sendMessage(chatId, '💰 Deal Detection\n\nI\'ll monitor deals for you! What products are you interested in?');
        break;
      case 'auto_purchase':
        await this.bot.sendMessage(chatId, '🤖 Auto-Purchase\n\nI can automatically purchase items when criteria are met! What should I watch for?');
        break;
      case 'wishlist_manager':
        await this.bot.sendMessage(chatId, '📋 Wishlist Manager\n\nI\'ll help you manage your wishlist! What would you like to add?');
        break;
      case 'budget_tracker':
        await this.bot.sendMessage(chatId, '📊 Budget Tracker\n\nI can help you track your shopping budget! What\'s your monthly budget?');
        break;
      case 'shopping_agents':
        await this.bot.sendMessage(chatId, '🤖 Shopping Agents\n\nHere are your AI shopping agents:\n• Travel Shopping Agent\n• Food Shopping Agent\n• Universal Shopping Agent');
        break;
      case 'autopilot_menu':
        await this.sendAutopilotMenu(chatId);
        break;
      case 'autopilot_status':
        await autopilotAgent.handleTelegramCommand(chatId, '/autopilot_status', []);
        break;
      case 'autopilot_tasks':
        await autopilotAgent.handleTelegramCommand(chatId, '/autopilot_tasks', []);
        break;
      case 'autopilot_subscribe':
        await autopilotAgent.handleTelegramCommand(chatId, '/autopilot_subscribe', []);
        break;
      case 'autopilot_unsubscribe':
        await autopilotAgent.handleTelegramCommand(chatId, '/autopilot_unsubscribe', []);
        break;
      case 'autopilot_force_improvement':
        await autopilotAgent.handleTelegramCommand(chatId, '/autopilot_force_improvement', []);
        break;
      case 'autopilot_force_knowledge':
        await autopilotAgent.handleTelegramCommand(chatId, '/autopilot_force_knowledge', []);
        break;
      case 'autopilot_assign_menu':
        await this.bot.sendMessage(chatId, 
          '📋 **Assign Task to Autopilot**\n\n' +
          'Use the command:\n' +
          '`/autopilot_assign <priority> <title> [description]`\n\n' +
          '**Priorities:** low, medium, high, urgent\n\n' +
          '**Examples:**\n' +
          '• `/autopilot_assign high "Optimize system performance"`\n' +
          '• `/autopilot_assign medium "Analyze user behavior patterns"`\n' +
          '• `/autopilot_assign urgent "Fix critical error in automation"`', 
          { parse_mode: 'Markdown' });
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

🚀 **Autopilot Commands:**
/autopilot_status - Show autopilot status
/autopilot_subscribe - Subscribe to updates
/autopilot_tasks - View pending tasks
/autopilot_assign - Assign new task
/autopilot - Open autopilot menu

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

    // Basic AI response
    const aiResponse = await this.generateAIResponse(text);
    await this.bot.sendMessage(chatId, `🤖 AI Response:\n\n${aiResponse}`);
    
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
  }

  private async createPostFromTelegram(chatId: number, content: string) {
    try {
      const post = await storage.createPost({
        authorId: 'user-1',
        tenantId: 'default',
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

  /**
   * Handle autopilot commands
   */
  private async handleAutopilotCommand(chatId: number, text: string): Promise<void> {
    const command = text.split(' ')[0];
    const args = text.split(' ').slice(1);

    // Import autopilot agent dynamically to avoid circular dependency
    const { autopilotAgent } = await import('./autopilot-agent.js');
    
    switch (command) {
      case '/autopilot':
        await this.sendAutopilotMenu(chatId);
        break;
      case '/autopilot_status':
        await autopilotAgent.handleTelegramCommand(chatId, command, args);
        break;
      case '/autopilot_force_improvement':
        await autopilotAgent.handleTelegramCommand(chatId, command, args);
        break;
      case '/autopilot_tasks':
        await autopilotAgent.handleTelegramCommand(chatId, command, args);
        break;
      case '/autopilot_assign':
        await autopilotAgent.handleTelegramCommand(chatId, command, args);
        break;
      case '/autopilot_subscribe':
        await autopilotAgent.handleTelegramCommand(chatId, command, args);
        break;
      case '/autopilot_unsubscribe':
        await autopilotAgent.handleTelegramCommand(chatId, command, args);
        break;
      case '/autopilot_force_knowledge':
        await autopilotAgent.handleTelegramCommand(chatId, command, args);
        break;
      case '/autopilot_insights':
        await this.sendAutopilotInsights(chatId);
        break;
      default:
        await this.sendAutopilotHelp(chatId);
    }
  }

  /**
   * Handle task commands
   */
  private async handleTaskCommand(chatId: number, text: string): Promise<void> {
    const command = text.split(' ')[0];
    const args = text.split(' ').slice(1);

    switch (command) {
      case '/task':
        await this.sendTaskHelp(chatId);
        break;
      case '/task_assign':
        if (args.length >= 2) {
          const priority = args[0] as 'low' | 'medium' | 'high' | 'critical';
          const title = args[1];
          const description = args.slice(2).join(' ') || title;
          await this.assignTask(chatId, title, description, priority);
        } else {
          await this.bot.sendMessage(chatId, '❌ Usage: /task_assign <priority> <title> [description]\n\nPriority: low, medium, high, critical');
        }
        break;
      case '/task_list':
        await this.sendTaskList(chatId);
        break;
      case '/task_status':
        if (args.length >= 1) {
          await this.sendTaskStatus(chatId, args[0]);
        } else {
          await this.bot.sendMessage(chatId, '❌ Usage: /task_status <task_id>');
        }
        break;
      case '/task_cancel':
        if (args.length >= 1) {
          await this.cancelTask(chatId, args[0]);
        } else {
          await this.bot.sendMessage(chatId, '❌ Usage: /task_cancel <task_id>');
        }
        break;
      default:
        await this.sendTaskHelp(chatId);
    }
  }

  /**
   * Send autopilot help
   */
  private async sendAutopilotHelp(chatId: number): Promise<void> {
    const helpText = `🤖 **Autopilot Commands**

🎯 **Core Commands:**
/autopilot - Show this help
/autopilot_status - Get autopilot status
/autopilot_force_update - Force status update to Telegram
/autopilot_tasks - List all tasks
/autopilot_memory - Show memory summary
/autopilot_insights - Get autopilot insights

📋 **Task Commands:**
/task - Task management help
/task_assign <priority> <title> [description] - Assign new task
/task_list - List all tasks
/task_status <task_id> - Get task status
/task_cancel <task_id> - Cancel task

🎯 **Task Priorities:**
• low - Background tasks
• medium - Normal tasks  
• high - Important tasks
• critical - Urgent tasks

💡 **Examples:**
/task_assign high "Optimize system performance"
/task_assign critical "Fix automation error"
/autopilot_status`;

    await this.bot.sendMessage(chatId, helpText);
  }

  /**
   * Send autopilot status
   */
  private async sendAutopilotStatus(chatId: number): Promise<void> {
    try {
      const status = autopilotAgent.getStatus();
      const growthMetrics = autopilotAgent.getGrowthMetrics();
      const insights = autopilotAgent.getInsights();

      const statusText = `🤖 **Autopilot Status**

📊 **System Status:**
• Status: ${status.alwaysActive ? '🟢 Always Active' : '🔴 Inactive'}
• Uptime: ${Math.floor(status.uptime / 3600)}h ${Math.floor((status.uptime % 3600) / 60)}m
• Memory Size: ${status.memorySize} items
• Background Tasks: ${status.backgroundTasks.length}

📈 **Growth Metrics:**
• Knowledge Base: ${growthMetrics.knowledgeBaseSize} items
• Experience Points: ${growthMetrics.experiencePoints}
• Learning Cycles: ${growthMetrics.learningCycles}
• Efficiency: ${(growthMetrics.efficiency * 100).toFixed(1)}%
• Adaptability: ${(growthMetrics.adaptability * 100).toFixed(1)}%
• Growth Rate: ${growthMetrics.growthRate.toFixed(2)}/hour

🧠 **Insights:**
• Growth Trend: ${insights.growthTrend}
• Efficiency: ${insights.efficiency}
• Knowledge Base: ${insights.knowledgeBase}

${insights.recommendations.length > 0 ? `💡 **Recommendations:**\n${insights.recommendations.map(r => `• ${r}`).join('\n')}` : ''}

_Last updated: ${new Date().toLocaleTimeString()}_`;

      await this.bot.sendMessage(chatId, statusText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving autopilot status. Please try again later.');
    }
  }

  /**
   * Force autopilot update
   */
  private async forceAutopilotUpdate(chatId: number): Promise<void> {
    try {
      await autopilotAgent.forceTelegramUpdate();
      await this.bot.sendMessage(chatId, '✅ Autopilot update sent to Telegram!');
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error forcing autopilot update.');
    }
  }

  /**
   * Send autopilot tasks
   */
  private async sendAutopilotTasks(chatId: number): Promise<void> {
    try {
      const tasks = autopilotAgent.getAllTasks();
      
      if (tasks.length === 0) {
        await this.bot.sendMessage(chatId, '📋 No tasks found.');
        return;
      }

      let tasksText = '📋 **Autopilot Tasks**\n\n';
      
      tasks.forEach((task, index) => {
        const statusEmoji = {
          'pending': '⏳',
          'in_progress': '🔄',
          'completed': '✅',
          'failed': '❌',
          'cancelled': '🚫'
        }[task.status] || '❓';
        
        tasksText += `${index + 1}. ${statusEmoji} **${task.title}**\n`;
        tasksText += `   📝 ${task.description}\n`;
        tasksText += `   🎯 Priority: ${task.priority}\n`;
        tasksText += `   📅 Assigned: ${task.assignedAt.toLocaleDateString()}\n`;
        tasksText += `   🆔 ID: \`${task.id}\`\n\n`;
      });

      await this.bot.sendMessage(chatId, tasksText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving tasks.');
    }
  }

  /**
   * Send autopilot memory summary
   */
  private async sendAutopilotMemory(chatId: number): Promise<void> {
    try {
      const memorySummary = autopilotAgent.getMemorySummary();
      
      const memoryText = `🧠 **Autopilot Memory Summary**

📊 **Statistics:**
• Total Memories: ${memorySummary.totalMemories}
• Average Importance: ${memorySummary.averageImportance?.toFixed(3) || 'N/A'}
• Average Confidence: ${memorySummary.averageConfidence?.toFixed(3) || 'N/A'}

📚 **By Type:**
${Object.entries(memorySummary.byType).map(([type, count]) => `• ${type}: ${count}`).join('\n')}

_Last updated: ${new Date().toLocaleTimeString()}_`;

      await this.bot.sendMessage(chatId, memoryText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving memory summary.');
    }
  }

  /**
   * Send autopilot insights
   */
  private async sendAutopilotInsights(chatId: number): Promise<void> {
    try {
      const insights = autopilotAgent.getInsights();
      
      const insightsText = `🧠 **Autopilot Insights**

📈 **Current State:**
• Growth Trend: ${insights.growthTrend}
• Efficiency: ${insights.efficiency}
• Adaptability: ${insights.adaptability}
• Knowledge Base: ${insights.knowledgeBase}

${insights.recommendations.length > 0 ? `💡 **Recommendations:**\n${insights.recommendations.map(r => `• ${r}`).join('\n')}` : '🎯 No specific recommendations at this time.'}

_Generated at: ${new Date().toLocaleTimeString()}_`;

      await this.bot.sendMessage(chatId, insightsText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving insights.');
    }
  }

  /**
   * Send task help
   */
  private async sendTaskHelp(chatId: number): Promise<void> {
    const helpText = `📋 **Task Management Commands**

🎯 **Commands:**
/task - Show this help
/task_assign <priority> <title> [description] - Assign new task
/task_list - List all tasks
/task_status <task_id> - Get task status
/task_cancel <task_id> - Cancel task

🎯 **Priorities:**
• low - Background tasks
• medium - Normal tasks
• high - Important tasks  
• critical - Urgent tasks

💡 **Examples:**
/task_assign high "Optimize system performance"
/task_assign critical "Fix automation error"
/task_assign medium "Generate weekly report" "Create comprehensive system report"`;

    await this.bot.sendMessage(chatId, helpText);
  }

  /**
   * Assign a task to autopilot
   */
  private async assignTask(
    chatId: number, 
    title: string, 
    description: string, 
    priority: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<void> {
    try {
      const task = await autopilotAgent.assignTask(title, description, priority, 'telegram-user');
      
      const message = `✅ **Task Assigned Successfully**

📋 **Task:** ${task.title}
📝 **Description:** ${task.description}
🎯 **Priority:** ${task.priority}
🆔 **Task ID:** \`${task.id}\`
📅 **Assigned:** ${task.assignedAt.toLocaleTimeString()}

_Task added to autopilot queue!_`;

      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error assigning task to autopilot.');
    }
  }

  /**
   * Send task list
   */
  private async sendTaskList(chatId: number): Promise<void> {
    try {
      const tasks = autopilotAgent.getAllTasks();
      
      if (tasks.length === 0) {
        await this.bot.sendMessage(chatId, '📋 No tasks found.');
        return;
      }

      let tasksText = '📋 **All Tasks**\n\n';
      
      tasks.forEach((task, index) => {
        const statusEmoji = {
          'pending': '⏳',
          'in_progress': '🔄',
          'completed': '✅',
          'failed': '❌',
          'cancelled': '🚫'
        }[task.status] || '❓';
        
        tasksText += `${index + 1}. ${statusEmoji} **${task.title}**\n`;
        tasksText += `   📝 ${task.description}\n`;
        tasksText += `   🎯 Priority: ${task.priority}\n`;
        tasksText += `   📅 Assigned: ${task.assignedAt.toLocaleDateString()}\n`;
        tasksText += `   🆔 ID: \`${task.id}\`\n\n`;
      });

      await this.bot.sendMessage(chatId, tasksText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving task list.');
    }
  }

  /**
   * Send task status
   */
  private async sendTaskStatus(chatId: number, taskId: string): Promise<void> {
    try {
      const task = autopilotAgent.getTaskStatus(taskId);
      
      if (!task) {
        await this.bot.sendMessage(chatId, '❌ Task not found.');
        return;
      }

      const statusEmoji = {
        'pending': '⏳',
        'in_progress': '🔄',
        'completed': '✅',
        'failed': '❌',
        'cancelled': '🚫'
      }[task.status] || '❓';

      const statusText = `📋 **Task Status**

${statusEmoji} **${task.title}**
📝 **Description:** ${task.description}
🎯 **Priority:** ${task.priority}
📊 **Status:** ${task.status}
👤 **Assigned by:** ${task.assignedBy}
📅 **Assigned:** ${task.assignedAt.toLocaleString()}

${task.startedAt ? `🔄 **Started:** ${task.startedAt.toLocaleString()}\n` : ''}
${task.completedAt ? `✅ **Completed:** ${task.completedAt.toLocaleString()}\n` : ''}
${task.actualDuration ? `⏱️ **Duration:** ${task.actualDuration.toFixed(1)} minutes\n` : ''}
${task.result ? `📊 **Result:** ${task.result}\n` : ''}
${task.error ? `⚠️ **Error:** ${task.error}\n` : ''}

🆔 **Task ID:** \`${task.id}\``;

      await this.bot.sendMessage(chatId, statusText);
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error retrieving task status.');
    }
  }

  /**
   * Cancel a task
   */
  private async cancelTask(chatId: number, taskId: string): Promise<void> {
    try {
      const success = await autopilotAgent.cancelTask(taskId);
      
      if (success) {
        await this.bot.sendMessage(chatId, `✅ Task \`${taskId}\` cancelled successfully.`);
      } else {
        await this.bot.sendMessage(chatId, `❌ Cannot cancel task \`${taskId}\`. Task may already be completed or not found.`);
      }
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error cancelling task.');
    }
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
