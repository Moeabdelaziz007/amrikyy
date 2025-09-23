#!/usr/bin/env node
/**
 * AuraOS AI System Starter - تشغيل النظام الذكي الكامل
 * نظام يجمع بين Teleauto.ai و Telepilot.co
 */

import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { createAIIntegrationService } from './server/ai-integration-service.js';
import { createMonitoringReportsService } from './server/monitoring-reports.js';

dotenv.config();

class AISystemStarter {
  constructor() {
    this.bot = null;
    this.aiIntegration = null;
    this.monitoringService = null;
    this.isRunning = false;
  }

  async start() {
    try {
      console.log('🚀 Starting AuraOS AI System...');
      console.log('=' .repeat(50));

      // التحقق من المتغيرات المطلوبة
      await this.validateEnvironment();

      // إنشاء البوت
      await this.createBot();

      // إنشاء خدمة التكامل الذكي
      await this.createAIIntegration();

      // بدء المراقبة
      await this.startMonitoring();

      // بدء النظام
      await this.startSystem();

      // عرض الإحصائيات
      await this.showSystemStats();

      console.log('\n✅ AuraOS AI System started successfully!');
      console.log('🤖 Bot is ready for smart interactions');
      console.log('📰 Teleauto.ai is publishing content automatically');
      console.log('🧠 Telepilot.co is processing smart conversations');
      console.log('📊 Monitoring system is active');

      // إبقاء النظام يعمل
      this.keepAlive();

    } catch (error) {
      console.error('❌ Error starting AI System:', error);
      process.exit(1);
    }
  }

  async validateEnvironment() {
    console.log('🔍 Validating environment...');

    const requiredVars = [
      'TELEGRAM_BOT_TOKEN',
      'GOOGLE_AI_API_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    console.log('✅ Environment validated');
  }

  async createBot() {
    console.log('🤖 Creating Telegram bot...');

    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

    // إعداد معالجات الأحداث
    this.bot.on('message', async (msg) => {
      await this.handleMessage(msg);
    });

    this.bot.on('callback_query', async (query) => {
      await this.handleCallbackQuery(query);
    });

    // الحصول على معلومات البوت
    const me = await this.bot.getMe();
    console.log(`✅ Bot created: @${me.username} (${me.first_name})`);
  }

  async createAIIntegration() {
    console.log('🧠 Creating AI Integration Service...');

    const config = {
      teleauto: {
        enabled: true,
        rssFeeds: [
          'https://feeds.feedburner.com/techcrunch',
          'https://feeds.feedburner.com/businessinsider'
        ],
        publishingSchedule: '0 */6 * * *', // كل 6 ساعات
        channels: ['@your_channel'] // استبدل بقناتك
      },
      telepilot: {
        enabled: true,
        nlpModel: 'gemini-pro',
        autoActions: true,
        smartResponses: true
      },
      monitoring: {
        enabled: true,
        logLevel: 'info',
        reportInterval: 3600000 // كل ساعة
      }
    };

    this.aiIntegration = createAIIntegrationService(this.bot, config);
    console.log('✅ AI Integration Service created');
  }

  async startMonitoring() {
    console.log('📊 Starting monitoring service...');

    this.monitoringService = createMonitoringReportsService();
    console.log('✅ Monitoring service started');
  }

  async startSystem() {
    console.log('🚀 Starting AI System...');

    await this.aiIntegration.start();
    this.isRunning = true;

    console.log('✅ AI System started');
  }

  async handleMessage(msg) {
    try {
      const userId = msg.from.id;
      const chatId = msg.chat.id;
      const message = msg.text;

      if (!message) return;

      console.log(`📨 Message from ${userId}: ${message}`);

      // معالجة الرسالة بذكاء
      const response = await this.aiIntegration.processSmartMessage(userId, chatId, message);

      if (response) {
        // إرسال الرد الذكي
        await this.bot.sendMessage(chatId, response.text, {
          parse_mode: 'HTML',
          reply_markup: this.createSmartKeyboard(response.suggestions)
        });

        // تنفيذ الإجراءات التلقائية
        if (response.actions && response.actions.length > 0) {
          await this.executeActions(response.actions, userId, chatId);
        }
      }

    } catch (error) {
      console.error('❌ Error handling message:', error);
      await this.bot.sendMessage(msg.chat.id, 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.');
    }
  }

  async handleCallbackQuery(query) {
    try {
      const userId = query.from.id;
      const chatId = query.message.chat.id;
      const data = query.data;

      console.log(`🔘 Callback from ${userId}: ${data}`);

      // معالجة الاستجابة
      await this.bot.answerCallbackQuery(query.id);

      // معالجة البيانات بذكاء
      const response = await this.aiIntegration.processSmartMessage(userId, chatId, data);

      if (response) {
        await this.bot.editMessageText(response.text, {
          chat_id: chatId,
          message_id: query.message.message_id,
          parse_mode: 'HTML',
          reply_markup: this.createSmartKeyboard(response.suggestions)
        });
      }

    } catch (error) {
      console.error('❌ Error handling callback:', error);
    }
  }

  createSmartKeyboard(suggestions) {
    if (!suggestions || suggestions.length === 0) {
      return {
        inline_keyboard: [
          [
            { text: '📋 المهام', callback_data: 'view_tasks' },
            { text: '🤖 Autopilot', callback_data: 'autopilot_status' }
          ],
          [
            { text: '📊 الإحصائيات', callback_data: 'system_stats' },
            { text: '❓ المساعدة', callback_data: 'help' }
          ]
        ]
      };
    }

    const keyboard = [];
    for (let i = 0; i < suggestions.length; i += 2) {
      const row = suggestions.slice(i, i + 2).map(suggestion => ({
        text: suggestion,
        callback_data: suggestion
      }));
      keyboard.push(row);
    }

    return { inline_keyboard: keyboard };
  }

  async executeActions(actions, userId, chatId) {
    for (const action of actions) {
      try {
        if (action.startsWith('task_created:')) {
          const taskId = action.split(':')[1];
          await this.bot.sendMessage(chatId, `✅ تم إنشاء المهمة بنجاح!\n🆔 معرف المهمة: ${taskId}`);
        } else if (action.startsWith('reminder_scheduled:')) {
          const reminderId = action.split(':')[1];
          await this.bot.sendMessage(chatId, `⏰ تم جدولة التذكير!\n🆔 معرف التذكير: ${reminderId}`);
        } else if (action.startsWith('automation_executed:')) {
          const automationId = action.split(':')[1];
          await this.bot.sendMessage(chatId, `🤖 تم تنفيذ الإجراء التلقائي!\n🆔 معرف الإجراء: ${automationId}`);
        }
      } catch (error) {
        console.error(`❌ Error executing action ${action}:`, error);
      }
    }
  }

  async showSystemStats() {
    console.log('\n📊 System Statistics:');
    console.log('=' .repeat(30));

    const stats = this.aiIntegration.getDetailedStats();
    
    console.log(`🤖 Bot Status: ${stats.isActive ? '✅ Active' : '❌ Inactive'}`);
    console.log(`🧠 AI Integration: ${stats.system.overall}`);
    console.log(`📰 Teleauto.ai: ${stats.system.components.teleauto}`);
    console.log(`🤖 Telepilot.co: ${stats.system.components.telepilot}`);
    console.log(`📊 Monitoring: ${stats.system.components.monitoring}`);
    console.log(`⏱️ Response Time: ${stats.system.performance.responseTime.toFixed(2)}ms`);
    console.log(`💾 Memory Usage: ${Math.round(stats.system.performance.memoryUsage / 1024 / 1024)}MB`);
    console.log(`👥 Active Users: ${stats.system.stats.activeUsers}`);
    console.log(`📝 Content Published: ${stats.system.stats.contentPublished}`);
    console.log(`⚙️ Tasks Automated: ${stats.system.stats.tasksAutomated}`);
    console.log(`💬 Smart Interactions: ${stats.system.stats.smartInteractions}`);
  }

  keepAlive() {
    // إبقاء النظام يعمل
    process.on('SIGINT', async () => {
      console.log('\n⏹️ Shutting down AI System...');
      await this.shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n⏹️ Shutting down AI System...');
      await this.shutdown();
      process.exit(0);
    });

    // عرض الإحصائيات كل 30 دقيقة
    setInterval(async () => {
      if (this.isRunning) {
        console.log('\n📊 Periodic System Check:');
        const stats = this.aiIntegration.getSystemStatus();
        console.log(`Status: ${stats.overall} | Users: ${stats.stats.activeUsers} | Memory: ${Math.round(stats.performance.memoryUsage / 1024 / 1024)}MB`);
      }
    }, 30 * 60 * 1000);

    console.log('\n🔄 System is running... Press Ctrl+C to stop');
  }

  async shutdown() {
    try {
      if (this.aiIntegration) {
        await this.aiIntegration.stop();
      }
      console.log('✅ AI System stopped gracefully');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }
}

// تشغيل النظام
if (import.meta.url === `file://${process.argv[1]}`) {
  const starter = new AISystemStarter();
  starter.start().catch(console.error);
}

export default AISystemStarter;
