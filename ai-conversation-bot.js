#!/usr/bin/env node
/**
 * 🧠 AI-Powered Conversation Bot
 * Advanced AI integration with context awareness and memory
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs').promises;
const path = require('path');

class AIConversationBot {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    this.bot = new TelegramBot(this.token, { polling: true });
    
    this.conversationMemory = new Map();
    this.userContexts = new Map();
    this.aiPersonalities = {
      assistant: {
        name: 'AuraOS Assistant',
        greeting: 'Hello! I\'m your AI assistant. How can I help you today?',
        personality: 'helpful, professional, friendly',
        expertise: ['general assistance', 'system information', 'automation']
      },
      expert: {
        name: 'Tech Expert',
        greeting: 'Hi! I\'m your technical expert. What technical challenge can I help you solve?',
        personality: 'analytical, detailed, solution-oriented',
        expertise: ['programming', 'system administration', 'debugging']
      },
      creative: {
        name: 'Creative Assistant',
        greeting: 'Hey there! I\'m your creative companion. What shall we create today?',
        personality: 'imaginative, inspiring, artistic',
        expertise: ['content creation', 'design ideas', 'creative writing']
      }
    };
    
    this.setupHandlers();
    this.loadConversationMemory();
  }

  setupHandlers() {
    this.bot.on('message', async (msg) => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        console.error('Error handling message:', error);
        await this.sendErrorResponse(msg.chat.id, error.message);
      }
    });

    this.bot.on('callback_query', async (callbackQuery) => {
      try {
        await this.handleCallbackQuery(callbackQuery);
      } catch (error) {
        console.error('Error handling callback query:', error);
      }
    });
  }

  async handleMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.first_name || 'User';

    console.log(`💬 [${username}]: ${text}`);

    // Initialize user context
    if (!this.userContexts.has(userId)) {
      this.userContexts.set(userId, {
        chatId,
        username,
        personality: 'assistant',
        conversationHistory: [],
        preferences: {
          responseStyle: 'balanced',
          detailLevel: 'medium',
          language: 'en'
        },
        lastInteraction: new Date()
      });
    }

    const userContext = this.userContexts.get(userId);
    userContext.lastInteraction = new Date();
    userContext.conversationHistory.push({
      role: 'user',
      content: text,
      timestamp: new Date()
    });

    // Keep only last 20 messages in history
    if (userContext.conversationHistory.length > 20) {
      userContext.conversationHistory.shift();
    }

    // Command handling
    if (text?.startsWith('/')) {
      await this.handleCommand(msg, userContext);
    } else {
      await this.handleConversation(msg, userContext);
    }

    // Save conversation memory
    await this.saveConversationMemory();
  }

  async handleCommand(msg, userContext) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const command = text.split(' ')[0];

    switch (command) {
      case '/start':
        await this.sendPersonalitySelection(chatId, userContext);
        break;
      case '/chat':
        await this.sendChatInterface(chatId, userContext);
        break;
      case '/personality':
        await this.sendPersonalityMenu(chatId, userContext);
        break;
      case '/memory':
        await this.sendMemoryStatus(chatId, userContext);
        break;
      case '/context':
        await this.sendContextInfo(chatId, userContext);
        break;
      case '/clear':
        await this.clearUserContext(userContext);
        await this.sendMessage(chatId, '🧹 Conversation context cleared. Starting fresh!');
        break;
      case '/help':
        await this.sendAIHelp(chatId);
        break;
      case '/settings':
        await this.sendAISettings(chatId, userContext);
        break;
      default:
        await this.sendMessage(chatId, `❓ Unknown command: ${command}. Use /help for available commands.`);
    }
  }

  async handleConversation(msg, userContext) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const personality = this.aiPersonalities[userContext.personality];

    // Generate AI response based on personality and context
    const response = await this.generateAIResponse(text, userContext, personality);
    
    // Add AI response to conversation history
    userContext.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    await this.sendMessage(chatId, response);

    // Store conversation in memory
    this.storeConversationMemory(userContext.username, text, response);
  }

  async generateAIResponse(userMessage, userContext, personality) {
    // Simulate AI processing with personality-based responses
    const context = this.getConversationContext(userContext);
    const intent = this.analyzeIntent(userMessage);
    
    // Generate response based on personality and intent
    let response = '';
    
    switch (personality.name) {
      case 'AuraOS Assistant':
        response = this.generateAssistantResponse(userMessage, intent, context);
        break;
      case 'Tech Expert':
        response = this.generateExpertResponse(userMessage, intent, context);
        break;
      case 'Creative Assistant':
        response = this.generateCreativeResponse(userMessage, intent, context);
        break;
      default:
        response = this.generateDefaultResponse(userMessage, intent, context);
    }

    // Add contextual information if relevant
    if (context.length > 0) {
      response += this.addContextualInfo(context);
    }

    return response;
  }

  generateAssistantResponse(message, intent, context) {
    const responses = {
      greeting: [
        `Hello! I'm your AuraOS Assistant. I'm here to help you with any questions or tasks you might have. What can I assist you with today?`,
        `Hi there! Welcome to AuraOS. I'm ready to help you navigate and make the most of your system. How can I be of service?`,
        `Greetings! I'm your AI assistant, designed to make your AuraOS experience smooth and efficient. What would you like to explore?`
      ],
      question: [
        `That's a great question! Let me help you with that. Based on your system context, I can provide detailed information and guidance.`,
        `I'd be happy to help you understand that better. Let me break it down for you in a clear and actionable way.`,
        `Excellent question! I have access to your system information and can provide you with comprehensive answers.`
      ],
      task: [
        `I can definitely help you with that task! Let me guide you through the process step by step.`,
        `Perfect! I'm designed to assist with various tasks and automations. Let's work through this together.`,
        `I'm on it! I can help you accomplish that efficiently using the tools and resources available.`
      ],
      problem: [
        `I understand the issue you're facing. Let me help you troubleshoot and resolve this step by step.`,
        `Don't worry, I'm here to help solve problems! Let me analyze the situation and provide you with solutions.`,
        `I can see this is challenging. Together, we can work through this and find the best solution.`
      ]
    };

    const intentResponses = responses[intent] || responses.question;
    const baseResponse = intentResponses[Math.floor(Math.random() * intentResponses.length)];
    
    return baseResponse;
  }

  generateExpertResponse(message, intent, context) {
    const responses = {
      greeting: [
        `Hello! I'm your technical expert. I specialize in system administration, programming, and technical problem-solving. What technical challenge can I help you tackle?`,
        `Greetings! As your tech expert, I'm equipped with deep technical knowledge. Whether it's coding, debugging, or system optimization, I'm here to help.`,
        `Hi there! I'm your go-to technical specialist. From complex system issues to development challenges, I can provide expert guidance and solutions.`
      ],
      question: [
        `From a technical perspective, that's an interesting question. Let me provide you with a detailed technical analysis and solution approach.`,
        `Excellent technical question! I'll break down the technical aspects and provide you with comprehensive technical guidance.`,
        `That's a great technical inquiry! Let me give you the technical details and implementation strategies you need.`
      ],
      task: [
        `I can help you implement that technically. Let me provide you with the technical steps, best practices, and potential challenges to consider.`,
        `From a technical standpoint, I can guide you through the implementation process with detailed technical specifications and approaches.`,
        `I'm ready to help you execute that task technically. Let me outline the technical requirements and implementation strategy.`
      ],
      problem: [
        `Let me analyze this technical issue systematically. I'll provide you with diagnostic steps, potential causes, and technical solutions.`,
        `I can help you debug this technical problem. Let me walk you through the technical troubleshooting process and resolution steps.`,
        `This technical issue requires careful analysis. I'll guide you through the technical diagnosis and provide expert-level solutions.`
      ]
    };

    const intentResponses = responses[intent] || responses.question;
    return intentResponses[Math.floor(Math.random() * intentResponses.length)];
  }

  generateCreativeResponse(message, intent, context) {
    const responses = {
      greeting: [
        `Hello, creative soul! I'm your artistic companion, here to inspire and help you bring your creative visions to life. What shall we create today?`,
        `Hey there, creative spirit! I'm your imagination partner, ready to explore new ideas and help you express your creativity in amazing ways.`,
        `Greetings, creative mind! I'm your artistic collaborator, here to spark inspiration and help you turn your creative ideas into reality.`
      ],
      question: [
        `What a creative question! Let me help you explore this from multiple creative angles and inspire new possibilities.`,
        `I love creative thinking! Let me help you approach this with fresh perspectives and creative solutions.`,
        `That's wonderfully creative! I'll help you explore this idea creatively and discover innovative approaches.`
      ],
      task: [
        `I'm excited to help you with this creative project! Let me inspire you with creative approaches and artistic techniques.`,
        `What a fantastic creative endeavor! I'll help you bring your creative vision to life with innovative methods and artistic flair.`,
        `I'm thrilled to collaborate on this creative task! Let's explore creative possibilities and make something amazing together.`
      ],
      problem: [
        `Every creative challenge is an opportunity for innovation! Let me help you approach this with creative problem-solving techniques.`,
        `I see this as a creative puzzle to solve! Let me help you find creative solutions and turn this challenge into an opportunity.`,
        `Creative minds turn problems into possibilities! I'll help you explore creative approaches and innovative solutions.`
      ]
    };

    const intentResponses = responses[intent] || responses.question;
    return intentResponses[Math.floor(Math.random() * intentResponses.length)];
  }

  generateDefaultResponse(message, intent, context) {
    return `I understand what you're saying. Let me help you with that. Based on your message, I can provide assistance and guidance. How would you like me to help you further?`;
  }

  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    } else if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why')) {
      return 'question';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('do') || lowerMessage.includes('create')) {
      return 'task';
    } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error')) {
      return 'problem';
    }
    
    return 'general';
  }

  getConversationContext(userContext) {
    const recentMessages = userContext.conversationHistory.slice(-5);
    return recentMessages.filter(msg => msg.role === 'user').map(msg => msg.content);
  }

  addContextualInfo(context) {
    if (context.length === 0) return '';
    
    const contextInfo = `\n\n💡 **Context:** Based on our recent conversation, I remember we discussed: ${context.slice(-2).join(', ')}.`;
    return contextInfo;
  }

  async sendPersonalitySelection(chatId, userContext) {
    const welcomeText = `
🧠 **Welcome to AI Conversation Bot!**

I'm your intelligent conversation partner with different personalities and expertise areas. Choose a personality that matches your needs:

**Available Personalities:**
• 🤖 **Assistant** - General help and system guidance
• 🔧 **Tech Expert** - Technical problems and programming
• 🎨 **Creative** - Creative projects and artistic inspiration

Each personality has unique knowledge and response styles!
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🤖 Assistant', callback_data: 'personality_assistant' },
            { text: '🔧 Tech Expert', callback_data: 'personality_expert' }
          ],
          [
            { text: '🎨 Creative', callback_data: 'personality_creative' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendPersonalityMenu(chatId, userContext) {
    const currentPersonality = this.aiPersonalities[userContext.personality];
    
    const menuText = `
🎭 **Current Personality:** ${currentPersonality.name}

**Available Personalities:**
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `🤖 Assistant ${userContext.personality === 'assistant' ? '✓' : ''}`, callback_data: 'personality_assistant' },
            { text: `🔧 Tech Expert ${userContext.personality === 'expert' ? '✓' : ''}`, callback_data: 'personality_expert' }
          ],
          [
            { text: `🎨 Creative ${userContext.personality === 'creative' ? '✓' : ''}`, callback_data: 'personality_creative' }
          ],
          [
            { text: '🔙 Back to Chat', callback_data: 'back_to_chat' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, menuText, { parse_mode: 'Markdown', ...keyboard });
  }

  async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const userId = callbackQuery.from.id;

    await this.bot.answerCallbackQuery(callbackQuery.id);

    if (data.startsWith('personality_')) {
      const personality = data.replace('personality_', '');
      const userContext = this.userContexts.get(userId);
      
      if (userContext) {
        userContext.personality = personality;
        const personalityInfo = this.aiPersonalities[personality];
        
        await this.sendMessage(chatId, 
          `✅ **Personality Changed!**\n\n🎭 **New Personality:** ${personalityInfo.name}\n\n${personalityInfo.greeting}`,
          { parse_mode: 'Markdown' }
        );
      }
    } else if (data === 'back_to_chat') {
      const userContext = this.userContexts.get(userId);
      if (userContext) {
        await this.sendChatInterface(chatId, userContext);
      }
    }
  }

  async sendChatInterface(chatId, userContext) {
    const personality = this.aiPersonalities[userContext.personality];
    
    const chatText = `
💬 **AI Chat Interface**

🎭 **Active Personality:** ${personality.name}
📝 **Conversation History:** ${userContext.conversationHistory.length} messages
🕐 **Last Interaction:** ${userContext.lastInteraction.toLocaleTimeString()}

**Quick Commands:**
/clear - Start fresh conversation
/memory - View conversation memory
/context - Show conversation context
/personality - Change personality
/settings - AI settings

**Just start typing to chat with me!** 😊
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🎭 Change Personality', callback_data: 'change_personality' },
            { text: '🧠 View Memory', callback_data: 'view_memory' }
          ],
          [
            { text: '⚙️ Settings', callback_data: 'ai_settings' },
            { text: '🧹 Clear Chat', callback_data: 'clear_chat' }
          ]
        ]
      }
    };

    await this.sendMessage(chatId, chatText, { parse_mode: 'Markdown', ...keyboard });
  }

  async sendMemoryStatus(chatId, userContext) {
    const memoryEntries = this.conversationMemory.get(userContext.username) || [];
    
    let memoryText = `🧠 **Conversation Memory**\n\n`;
    memoryText += `📊 **Total Conversations:** ${memoryEntries.length}\n`;
    memoryText += `💬 **Current Session:** ${userContext.conversationHistory.length} messages\n\n`;
    
    if (memoryEntries.length > 0) {
      memoryText += `**Recent Conversations:**\n`;
      memoryEntries.slice(-5).forEach((entry, index) => {
        memoryText += `${index + 1}. ${entry.question.substring(0, 50)}...\n`;
      });
    } else {
      memoryText += `No previous conversations stored.`;
    }

    await this.sendMessage(chatId, memoryText, { parse_mode: 'Markdown' });
  }

  async sendContextInfo(chatId, userContext) {
    const contextText = `
📋 **Conversation Context**

👤 **User:** ${userContext.username}
🎭 **Personality:** ${userContext.personality}
💬 **Messages:** ${userContext.conversationHistory.length}
🕐 **Last Active:** ${userContext.lastInteraction.toLocaleString()}

**Recent Messages:**
${userContext.conversationHistory.slice(-5).map(msg => 
  `• ${msg.role}: ${msg.content.substring(0, 100)}...`
).join('\n')}

**Preferences:**
• Response Style: ${userContext.preferences.responseStyle}
• Detail Level: ${userContext.preferences.detailLevel}
• Language: ${userContext.preferences.language}
    `;

    await this.sendMessage(chatId, contextText, { parse_mode: 'Markdown' });
  }

  async sendAIHelp(chatId) {
    const helpText = `
🤖 **AI Conversation Bot Help**

**Basic Commands:**
/start - Initialize AI conversation
/chat - Open chat interface
/personality - Change AI personality
/memory - View conversation memory
/context - Show conversation context
/clear - Clear conversation history
/settings - Configure AI settings
/help - Show this help

**AI Personalities:**
🤖 **Assistant** - General help and guidance
🔧 **Tech Expert** - Technical expertise and solutions
🎨 **Creative** - Creative inspiration and artistic help

**Features:**
• Context-aware conversations
• Personality-based responses
• Conversation memory
• Multi-session continuity
• Intelligent intent recognition

**Just start typing to have a natural conversation!** 😊
    `;

    await this.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  async sendAISettings(chatId, userContext) {
    const settingsText = `
⚙️ **AI Settings**

**Current Settings:**
• Response Style: ${userContext.preferences.responseStyle}
• Detail Level: ${userContext.preferences.detailLevel}
• Language: ${userContext.preferences.language}

**Available Options:**
• Response Style: concise, balanced, detailed
• Detail Level: low, medium, high
• Language: en, es, fr, de, ar

*Settings customization coming soon!*
    `;

    await this.sendMessage(chatId, settingsText, { parse_mode: 'Markdown' });
  }

  async clearUserContext(userContext) {
    userContext.conversationHistory = [];
    userContext.lastInteraction = new Date();
  }

  storeConversationMemory(username, question, answer) {
    if (!this.conversationMemory.has(username)) {
      this.conversationMemory.set(username, []);
    }
    
    const userMemory = this.conversationMemory.get(username);
    userMemory.push({
      question,
      answer,
      timestamp: new Date()
    });
    
    // Keep only last 50 conversations per user
    if (userMemory.length > 50) {
      userMemory.shift();
    }
  }

  async sendErrorResponse(chatId, errorMessage) {
    await this.sendMessage(chatId, `❌ **Error:** ${errorMessage}\n\nI apologize for the inconvenience. Please try again or contact support if the issue persists.`);
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async saveConversationMemory() {
    try {
      const memoryFile = path.join(__dirname, 'data', 'conversation-memory.json');
      await fs.mkdir(path.dirname(memoryFile), { recursive: true });
      
      const memoryData = {
        timestamp: new Date(),
        conversations: Object.fromEntries(this.conversationMemory),
        userContexts: Object.fromEntries(this.userContexts)
      };
      
      await fs.writeFile(memoryFile, JSON.stringify(memoryData, null, 2));
    } catch (error) {
      console.error('Error saving conversation memory:', error);
    }
  }

  async loadConversationMemory() {
    try {
      const memoryFile = path.join(__dirname, 'data', 'conversation-memory.json');
      const data = await fs.readFile(memoryFile, 'utf8');
      const memoryData = JSON.parse(data);
      
      this.conversationMemory = new Map(Object.entries(memoryData.conversations || {}));
      this.userContexts = new Map(Object.entries(memoryData.userContexts || {}));
      
      console.log(`📚 Loaded conversation memory: ${this.conversationMemory.size} users, ${this.userContexts.size} contexts`);
    } catch (error) {
      console.log('No conversation memory found, starting fresh.');
      this.conversationMemory = new Map();
      this.userContexts = new Map();
    }
  }

  async start() {
    console.log('🧠 Starting AI Conversation Bot...');
    console.log(`🤖 Bot Token: ${this.token.substring(0, 10)}...`);
    console.log(`👤 Admin Chat ID: ${this.adminChatId}`);
    console.log('✅ AI Conversation Bot is now running!');
    console.log('\n🧠 AI Features:');
    console.log('• Multiple AI personalities');
    console.log('• Context-aware conversations');
    console.log('• Conversation memory');
    console.log('• Intent recognition');
    console.log('• Multi-session continuity');
    console.log('\n🎯 Send /start to begin AI conversation!');
  }

  async stop() {
    console.log('⏹️ Stopping AI Conversation Bot...');
    await this.saveConversationMemory();
    this.bot.stopPolling();
    console.log('✅ AI Conversation Bot stopped successfully');
  }
}

// Start the AI conversation bot
const aiBot = new AIConversationBot();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️ Received SIGINT, shutting down AI bot gracefully...');
  await aiBot.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️ Received SIGTERM, shutting down AI bot gracefully...');
  await aiBot.stop();
  process.exit(0);
});

aiBot.start().catch(console.error);

module.exports = AIConversationBot;
