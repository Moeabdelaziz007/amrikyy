// Enhanced Telegram Webhook Service with Advanced UI
import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import { storage } from './storage.js';
import { getSmartMenuService } from './smart-menu.js';
import { autopilotAgent } from './autopilot-agent.js';
import { getEnhancedChatPersona } from './enhanced-persona.js';

export interface WebhookConfig {
  token: string;
  webhookUrl: string;
  port: number;
  secretToken?: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
}

export class WebhookTelegramService {
  private bot: TelegramBot;
  private app: express.Application;
  private config: WebhookConfig;
  private isConnected: boolean = false;
  private smartMenuService = getSmartMenuService();
  private tasks: Map<string, TaskData> = new Map();
  private userSessions: Map<number, any> = new Map();

  constructor(config: WebhookConfig) {
    this.config = config;
    this.bot = new TelegramBot(config.token, { polling: false });
    this.app = express();
    this.setupWebhook();
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeTasks();
  }

  private setupWebhook() {
    // إعداد Webhook
    this.bot.setWebHook(this.config.webhookUrl, {
      secret_token: this.config.secretToken,
      drop_pending_updates: true
    });

    console.log(`🔗 Webhook configured: ${this.config.webhookUrl}`);
  }

  private setupMiddleware() {
    // Middleware لمعالجة JSON
    this.app.use(express.json());
    
    // Middleware للأمان
    this.app.use((req, res, next) => {
      if (this.config.secretToken && req.headers['x-telegram-bot-api-secret-token'] !== this.config.secretToken) {
        return res.status(401).send('Unauthorized');
      }
      next();
    });

    // Middleware للتسجيل
    this.app.use((req, res, next) => {
      console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
      next();
    });
  }

  private setupRoutes() {
    // Route لاستقبال Webhook
    this.app.post('/webhook', async (req, res) => {
      try {
        await this.handleWebhookUpdate(req.body);
        res.status(200).send('OK');
      } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Route لصحة النظام
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        webhook: this.config.webhookUrl,
        connected: this.isConnected
      });
    });

    // Route لإحصائيات البوت
    this.app.get('/stats', (req, res) => {
      res.json({
        totalTasks: this.tasks.size,
        activeUsers: this.userSessions.size,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    });
  }

  private async handleWebhookUpdate(update: any) {
    if (update.message) {
      await this.handleMessage(update.message);
    } else if (update.callback_query) {
      await this.handleCallbackQuery(update.callback_query);
    }
  }

  private async handleMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from?.username || msg.from?.first_name || 'Unknown';

    console.log(`📨 Message from ${username}: ${text}`);

    // حفظ الرسالة في قاعدة البيانات
    await storage.createChatMessage({
      userId: 'telegram-user',
      tenantId: 'default',
      message: `[Telegram] ${username}: ${text}`,
      response: 'Message received by AuraOS Webhook',
    });

    // معالجة الأوامر
    if (text?.startsWith('/start')) {
      await this.sendWelcomeMessage(chatId, username);
    } else if (text?.startsWith('/menu')) {
      await this.sendMainMenu(chatId);
    } else if (text?.startsWith('/task')) {
      await this.handleTaskCommand(chatId, text);
    } else if (text?.startsWith('/autopilot')) {
      await this.handleAutopilotCommand(chatId, text);
    } else if (text?.startsWith('/help')) {
      await this.sendHelpMessage(chatId);
    } else if (text?.startsWith('/status')) {
      await this.sendStatusMessage(chatId);
    } else {
      await this.sendDefaultResponse(chatId, text);
    }
  }

  private async handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data;

    if (!chatId || !data) return;

    // إجابة على callback query
    await this.bot.answerCallbackQuery(callbackQuery.id);

    console.log(`🔘 Callback from ${chatId}: ${data}`);

    // معالجة الأزرار
    switch (data) {
      case 'main_menu':
        await this.sendMainMenu(chatId);
        break;
      case 'create_task':
        await this.sendCreateTaskMenu(chatId);
        break;
      case 'view_tasks':
        await this.sendTasksList(chatId);
        break;
      case 'autopilot_menu':
        await this.sendAutopilotMenu(chatId);
        break;
      case 'autopilot_status':
        await this.sendAutopilotStatus(chatId);
        break;
      case 'autopilot_tasks':
        await this.sendAutopilotTasks(chatId);
        break;
      case 'autopilot_assign':
        await this.sendAutopilotAssign(chatId);
        break;
      case 'task_priority_low':
        await this.handleTaskPriority(chatId, 'low');
        break;
      case 'task_priority_medium':
        await this.handleTaskPriority(chatId, 'medium');
        break;
      case 'task_priority_high':
        await this.handleTaskPriority(chatId, 'high');
        break;
      case 'task_priority_critical':
        await this.handleTaskPriority(chatId, 'critical');
        break;
      default:
        await this.bot.sendMessage(chatId, `تم الضغط على: ${data}`);
    }
  }

  private async sendWelcomeMessage(chatId: number, username: string) {
    const welcomeText = `
🎉 مرحباً ${username}!

أهلاً بك في نظام أتمتة AuraOS المحسن!

🚀 الميزات الجديدة:
• واجهة تفاعلية محسنة
• إدارة المهام المتقدمة
• تكامل Autopilot ذكي
• استجابة فورية عبر Webhook

استخدم القائمة أدناه للتنقل:
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '📋 القائمة الرئيسية', callback_data: 'main_menu' },
          { text: '❓ المساعدة', callback_data: 'help' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, welcomeText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendMainMenu(chatId: number) {
    const menuText = `
🎛️ القائمة الرئيسية - AuraOS

اختر من الخيارات أدناه:
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '➕ إنشاء مهمة', callback_data: 'create_task' },
          { text: '📋 عرض المهام', callback_data: 'view_tasks' }
        ],
        [
          { text: '🤖 Autopilot', callback_data: 'autopilot_menu' },
          { text: '📊 الإحصائيات', callback_data: 'stats' }
        ],
        [
          { text: '⚙️ الإعدادات', callback_data: 'settings' },
          { text: '❓ المساعدة', callback_data: 'help' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, menuText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendCreateTaskMenu(chatId: number) {
    const taskText = `
➕ إنشاء مهمة جديدة

اختر أولوية المهمة:
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🟢 منخفضة', callback_data: 'task_priority_low' },
          { text: '🟡 متوسطة', callback_data: 'task_priority_medium' }
        ],
        [
          { text: '🟠 عالية', callback_data: 'task_priority_high' },
          { text: '🔴 حرجة', callback_data: 'task_priority_critical' }
        ],
        [
          { text: '🔙 العودة', callback_data: 'main_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, taskText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendTasksList(chatId: number) {
    const tasks = Array.from(this.tasks.values());
    
    if (tasks.length === 0) {
      await this.bot.sendMessage(chatId, '📋 لا توجد مهام حالياً.\n\nاستخدم "إنشاء مهمة" لإضافة مهمة جديدة.');
      return;
    }

    let tasksText = '📋 قائمة المهام:\n\n';
    
    tasks.forEach((task, index) => {
      const priorityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴'
      }[task.priority];

      const statusEmoji = {
        pending: '⏳',
        in_progress: '🔄',
        completed: '✅',
        failed: '❌'
      }[task.status];

      tasksText += `${index + 1}. ${priorityEmoji} ${statusEmoji} ${task.title}\n`;
      tasksText += `   📝 ${task.description}\n`;
      tasksText += `   📅 ${task.createdAt.toLocaleDateString('ar-SA')}\n\n`;
    });

    const keyboard = {
      inline_keyboard: [
        [
          { text: '➕ إضافة مهمة', callback_data: 'create_task' },
          { text: '🔄 تحديث', callback_data: 'view_tasks' }
        ],
        [
          { text: '🔙 العودة', callback_data: 'main_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, tasksText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendAutopilotMenu(chatId: number) {
    const autopilotText = `
🤖 قائمة Autopilot

اختر الإجراء المطلوب:
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '📊 حالة النظام', callback_data: 'autopilot_status' },
          { text: '📋 مهام Autopilot', callback_data: 'autopilot_tasks' }
        ],
        [
          { text: '🎯 تعيين مهمة', callback_data: 'autopilot_assign' },
          { text: '🧠 المعرفة', callback_data: 'autopilot_knowledge' }
        ],
        [
          { text: '🔙 العودة', callback_data: 'main_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, autopilotText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendAutopilotStatus(chatId: number) {
    const statusText = `
📊 حالة Autopilot

🟢 النظام: يعمل بنشاط
🔄 المهام النشطة: ${this.tasks.size}
👥 المستخدمون النشطون: ${this.userSessions.size}
⏰ وقت التشغيل: ${Math.floor(process.uptime())} ثانية
💾 الذاكرة: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB

🚀 الميزات النشطة:
• Webhook فوري
• واجهة تفاعلية
• إدارة المهام
• تكامل ذكي
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔄 تحديث', callback_data: 'autopilot_status' },
          { text: '🔙 العودة', callback_data: 'autopilot_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, statusText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendAutopilotTasks(chatId: number) {
    const tasks = Array.from(this.tasks.values()).filter(task => task.status === 'pending');
    
    if (tasks.length === 0) {
      await this.bot.sendMessage(chatId, '🤖 لا توجد مهام Autopilot معلقة حالياً.');
      return;
    }

    let tasksText = '🤖 مهام Autopilot المعلقة:\n\n';
    
    tasks.forEach((task, index) => {
      const priorityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴'
      }[task.priority];

      tasksText += `${index + 1}. ${priorityEmoji} ${task.title}\n`;
      tasksText += `   📝 ${task.description}\n\n`;
    });

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🎯 تعيين مهمة', callback_data: 'autopilot_assign' },
          { text: '🔄 تحديث', callback_data: 'autopilot_tasks' }
        ],
        [
          { text: '🔙 العودة', callback_data: 'autopilot_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, tasksText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendAutopilotAssign(chatId: number) {
    const assignText = `
🎯 تعيين مهمة لـ Autopilot

لتعيين مهمة جديدة، أرسل رسالة بالشكل التالي:

📝 عنوان المهمة
📋 وصف المهمة
🎯 الأولوية: منخفضة/متوسطة/عالية/حرجة

مثال:
إرسال تقرير يومي
إرسال تقرير يومي للمبيعات
عالية
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '📋 عرض المهام', callback_data: 'view_tasks' },
          { text: '🔙 العودة', callback_data: 'autopilot_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, assignText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async handleTaskPriority(chatId: number, priority: 'low' | 'medium' | 'high' | 'critical') {
    const priorityText = {
      low: '🟢 منخفضة',
      medium: '🟡 متوسطة',
      high: '🟠 عالية',
      critical: '🔴 حرجة'
    }[priority];

    const taskId = `task_${Date.now()}`;
    const newTask: TaskData = {
      id: taskId,
      title: `مهمة جديدة - ${priorityText}`,
      description: `مهمة تم إنشاؤها بأولوية ${priorityText}`,
      priority,
      status: 'pending',
      createdAt: new Date()
    };

    this.tasks.set(taskId, newTask);

    const confirmText = `
✅ تم إنشاء المهمة بنجاح!

📋 العنوان: ${newTask.title}
📝 الوصف: ${newTask.description}
🎯 الأولوية: ${priorityText}
📅 التاريخ: ${newDate().toLocaleDateString('ar-SA')}
🆔 المعرف: ${taskId}
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '📋 عرض جميع المهام', callback_data: 'view_tasks' },
          { text: '➕ إضافة مهمة أخرى', callback_data: 'create_task' }
        ],
        [
          { text: '🔙 القائمة الرئيسية', callback_data: 'main_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, confirmText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendHelpMessage(chatId: number) {
    const helpText = `
❓ مساعدة AuraOS

🔹 الأوامر المتاحة:
/start - بدء المحادثة
/menu - القائمة الرئيسية
/task - إدارة المهام
/autopilot - إدارة Autopilot
/help - عرض هذه المساعدة
/status - حالة النظام

🔹 الميزات الجديدة:
• واجهة تفاعلية مع أزرار
• استجابة فورية عبر Webhook
• إدارة المهام المتقدمة
• تكامل Autopilot ذكي

🔹 كيفية الاستخدام:
1. استخدم الأزرار للتنقل
2. اضغط على الأزرار للتفاعل
3. اتبع التعليمات في كل قائمة
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔙 القائمة الرئيسية', callback_data: 'main_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, helpText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendStatusMessage(chatId: number) {
    const statusText = `
📊 حالة النظام

🤖 البوت: يعمل بنشاط
🔗 Webhook: مفعل
📋 المهام: ${this.tasks.size}
👥 المستخدمون: ${this.userSessions.size}
⏰ وقت التشغيل: ${Math.floor(process.uptime())} ثانية
💾 الذاكرة: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔄 تحديث', callback_data: 'status' },
          { text: '🔙 القائمة الرئيسية', callback_data: 'main_menu' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, statusText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async sendDefaultResponse(chatId: number, text: string) {
    const responseText = `
🤔 لم أفهم طلبك: "${text}"

استخدم /menu للوصول إلى القائمة الرئيسية أو /help للمساعدة.
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '📋 القائمة الرئيسية', callback_data: 'main_menu' },
          { text: '❓ المساعدة', callback_data: 'help' }
        ]
      ]
    };

    await this.bot.sendMessage(chatId, responseText, {
      reply_markup: keyboard,
      parse_mode: 'HTML'
    });
  }

  private async handleTaskCommand(chatId: number, text: string) {
    const args = text.split(' ').slice(1);
    
    if (args.length === 0) {
      await this.sendCreateTaskMenu(chatId);
      return;
    }

    // معالجة أوامر المهام
    switch (args[0]) {
      case 'list':
        await this.sendTasksList(chatId);
        break;
      case 'create':
        await this.sendCreateTaskMenu(chatId);
        break;
      default:
        await this.sendCreateTaskMenu(chatId);
    }
  }

  private async handleAutopilotCommand(chatId: number, text: string) {
    const args = text.split(' ').slice(1);
    
    if (args.length === 0) {
      await this.sendAutopilotMenu(chatId);
      return;
    }

    // معالجة أوامر Autopilot
    switch (args[0]) {
      case 'status':
        await this.sendAutopilotStatus(chatId);
        break;
      case 'tasks':
        await this.sendAutopilotTasks(chatId);
        break;
      case 'assign':
        await this.sendAutopilotAssign(chatId);
        break;
      default:
        await this.sendAutopilotMenu(chatId);
    }
  }

  private initializeTasks() {
    // إضافة بعض المهام التجريبية
    const sampleTasks: TaskData[] = [
      {
        id: 'task_1',
        title: 'مراجعة النظام',
        description: 'مراجعة شاملة لأداء النظام',
        priority: 'high',
        status: 'pending',
        createdAt: new Date()
      },
      {
        id: 'task_2',
        title: 'تحديث الوثائق',
        description: 'تحديث وثائق المشروع',
        priority: 'medium',
        status: 'in_progress',
        createdAt: new Date()
      }
    ];

    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
  }

  public async start() {
    return new Promise<void>((resolve, reject) => {
      this.app.listen(this.config.port, () => {
        this.isConnected = true;
        console.log(`🚀 Webhook Telegram Service started on port ${this.config.port}`);
        console.log(`🔗 Webhook URL: ${this.config.webhookUrl}`);
        resolve();
      }).on('error', reject);
    });
  }

  public async stop() {
    this.isConnected = false;
    await this.bot.deleteWebHook();
    console.log('🛑 Webhook Telegram Service stopped');
  }

  public isServiceConnected(): boolean {
    return this.isConnected;
  }

  public getStats() {
    return {
      totalTasks: this.tasks.size,
      activeUsers: this.userSessions.size,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      connected: this.isConnected
    };
  }
}

// تصدير الدالة لإنشاء الخدمة
export function createWebhookTelegramService(config: WebhookConfig): WebhookTelegramService {
  return new WebhookTelegramService(config);
}
