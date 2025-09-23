// Telepilot.co Integration - نظام الذكاء الاصطناعي المتقدم
// تكامل Telepilot.co مع NLP لفهم أوامر المستخدم الطبيعية

import TelegramBot from 'node-telegram-bot-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from './storage.js';
import { createMonitoringReportsService } from './monitoring-reports.js';

export interface UserIntent {
  action: string;
  confidence: number;
  entities: Record<string, any>;
  context: Record<string, any>;
  parameters: Record<string, any>;
}

export interface SmartResponse {
  text: string;
  actions: string[];
  suggestions: string[];
  context: Record<string, any>;
  confidence: number;
}

export interface TaskAutomation {
  id: string;
  title: string;
  description: string;
  type: 'create' | 'update' | 'delete' | 'schedule' | 'remind';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  parameters: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  result?: any;
}

export interface ConversationContext {
  userId: number;
  chatId: number;
  sessionId: string;
  history: Array<{
    timestamp: Date;
    userMessage: string;
    botResponse: string;
    intent: UserIntent;
  }>;
  currentTask?: string;
  preferences: Record<string, any>;
  lastActivity: Date;
}

export class TelepilotIntegration {
  private bot: TelegramBot;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private monitoringService: any;
  private userContexts: Map<number, ConversationContext> = new Map();
  private taskAutomations: Map<string, TaskAutomation> = new Map();
  private isActive: boolean = false;

  constructor(bot: TelegramBot) {
    this.bot = bot;
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.monitoringService = createMonitoringReportsService();
    console.log('🧠 Telepilot.co Integration initialized');
  }

  /**
   * بدء نظام Telepilot
   */
  public async start(): Promise<void> {
    if (this.isActive) {
      console.log('⚠️ Telepilot integration is already active');
      return;
    }

    this.isActive = true;
    console.log('🚀 Starting Telepilot.co integration...');

    // بدء معالج المحادثات الذكية
    await this.startSmartConversationProcessor();

    // بدء معالج المهام التلقائية
    await this.startTaskAutomationProcessor();

    this.monitoringService.logEvent({
      type: 'system_event',
      level: 'info',
      source: 'telepilot',
      message: 'Telepilot.co integration started successfully'
    });

    console.log('✅ Telepilot.co integration started successfully');
  }

  /**
   * معالجة رسالة المستخدم بذكاء
   */
  public async processUserMessage(
    userId: number,
    chatId: number,
    message: string
  ): Promise<SmartResponse> {
    try {
      console.log(`🧠 Processing smart message from user ${userId}: ${message}`);

      // الحصول على سياق المحادثة
      const context = this.getOrCreateUserContext(userId, chatId);

      // تحليل القصد باستخدام NLP
      const intent = await this.analyzeUserIntent(message, context);

      // إنشاء رد ذكي
      const response = await this.generateSmartResponse(intent, context);

      // تنفيذ الإجراءات التلقائية
      const actions = await this.executeAutomatedActions(intent, context);

      // تحديث سياق المحادثة
      this.updateConversationContext(context, message, response.text, intent);

      // تسجيل الحدث
      this.monitoringService.logEvent({
        type: 'user_action',
        level: 'info',
        source: 'telepilot',
        message: `Smart message processed: ${intent.action}`,
        data: { userId, chatId, intent, confidence: intent.confidence }
      });

      return {
        ...response,
        actions
      };

    } catch (error) {
      console.error('❌ Error processing smart message:', error);
      
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'telepilot',
        message: 'Error processing smart message',
        data: { userId, chatId, error: error.message }
      });

      return {
        text: 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        actions: [],
        suggestions: ['/help', '/menu'],
        context: {},
        confidence: 0
      };
    }
  }

  /**
   * تحليل قصد المستخدم باستخدام NLP
   */
  private async analyzeUserIntent(
    message: string,
    context: ConversationContext
  ): Promise<UserIntent> {
    try {
      const prompt = `
أنت مساعد ذكي متقدم لنظام إدارة المهام AuraOS. مهمتك هي فهم طلبات المستخدمين باللغة العربية والإنجليزية وتحويلها إلى إجراءات تلقائية.

المستخدم: ${context.userId}
الرسالة: "${message}"

سياق المحادثة:
${context.history.slice(-3).map(h => `المستخدم: ${h.userMessage}\nالبوت: ${h.botResponse}`).join('\n')}

حلل الرسالة وحدد:
1. الإجراء المطلوب (action)
2. مستوى الثقة (confidence) من 0 إلى 1
3. الكيانات (entities) المستخرجة
4. المعاملات (parameters) المطلوبة
5. السياق (context) الإضافي

الإجراءات المدعومة:
- create_task: إنشاء مهمة جديدة
- view_tasks: عرض المهام
- update_task: تحديث مهمة
- delete_task: حذف مهمة
- schedule_reminder: جدولة تذكير
- get_status: الحصول على حالة النظام
- get_help: طلب المساعدة
- chat: محادثة عامة
- automation: تنفيذ إجراء تلقائي

أجب بصيغة JSON:
{
  "action": "الإجراء",
  "confidence": 0.95,
  "entities": {
    "task_title": "عنوان المهمة",
    "priority": "الأولوية",
    "due_date": "تاريخ الاستحقاق",
    "category": "التصنيف"
  },
  "context": {
    "urgency": "عاجل/عادي",
    "complexity": "بسيط/معقد"
  },
  "parameters": {
    "specific_requirements": "متطلبات محددة"
  }
}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // تحليل JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          action: parsed.action || 'chat',
          confidence: parsed.confidence || 0.5,
          entities: parsed.entities || {},
          context: parsed.context || {},
          parameters: parsed.parameters || {}
        };
      }

      // fallback parsing
      return this.fallbackIntentAnalysis(message);

    } catch (error) {
      console.error('Error in NLP analysis:', error);
      return this.fallbackIntentAnalysis(message);
    }
  }

  /**
   * تحليل القصد الافتراضي
   */
  private fallbackIntentAnalysis(message: string): UserIntent {
    const lowerMessage = message.toLowerCase();

    // تحليل بسيط للقصد
    if (lowerMessage.includes('أنشئ') || lowerMessage.includes('إنشاء') || lowerMessage.includes('مهمة')) {
      return {
        action: 'create_task',
        confidence: 0.8,
        entities: { task_title: this.extractTaskTitle(message) },
        context: {},
        parameters: {}
      };
    }

    if (lowerMessage.includes('أظهر') || lowerMessage.includes('عرض') || lowerMessage.includes('مهام')) {
      return {
        action: 'view_tasks',
        confidence: 0.9,
        entities: {},
        context: {},
        parameters: {}
      };
    }

    if (lowerMessage.includes('حالة') || lowerMessage.includes('status')) {
      return {
        action: 'get_status',
        confidence: 0.9,
        entities: {},
        context: {},
        parameters: {}
      };
    }

    return {
      action: 'chat',
      confidence: 0.6,
      entities: {},
      context: {},
      parameters: {}
    };
  }

  /**
   * استخراج عنوان المهمة
   */
  private extractTaskTitle(message: string): string {
    // استخراج عنوان المهمة من الرسالة
    const patterns = [
      /أنشئ مهمة (.*)/i,
      /إنشاء مهمة (.*)/i,
      /مهمة (.*)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return 'مهمة جديدة';
  }

  /**
   * إنشاء رد ذكي
   */
  private async generateSmartResponse(
    intent: UserIntent,
    context: ConversationContext
  ): Promise<SmartResponse> {
    try {
      const prompt = `
أنت مساعد ذكي متقدم لنظام AuraOS. مهمتك هي إنشاء ردود ذكية ومفيدة للمستخدمين.

القصد المحدد: ${intent.action}
مستوى الثقة: ${intent.confidence}
الكيانات: ${JSON.stringify(intent.entities)}
المعاملات: ${JSON.stringify(intent.parameters)}

سياق المحادثة:
${context.history.slice(-2).map(h => `المستخدم: ${h.userMessage}\nالبوت: ${h.botResponse}`).join('\n')}

أنشئ رد ذكي يتضمن:
1. نص الرد المناسب
2. الإجراءات المقترحة
3. اقتراحات إضافية
4. معلومات مفيدة

أجب بصيغة JSON:
{
  "text": "نص الرد الذكي",
  "actions": ["إجراء1", "إجراء2"],
  "suggestions": ["اقتراح1", "اقتراح2"],
  "context": {
    "helpful_info": "معلومات مفيدة"
  },
  "confidence": 0.95
}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          text: parsed.text || 'تم فهم طلبك بنجاح!',
          actions: parsed.actions || [],
          suggestions: parsed.suggestions || [],
          context: parsed.context || {},
          confidence: parsed.confidence || intent.confidence
        };
      }

      return this.generateFallbackResponse(intent);

    } catch (error) {
      console.error('Error generating smart response:', error);
      return this.generateFallbackResponse(intent);
    }
  }

  /**
   * إنشاء رد افتراضي
   */
  private generateFallbackResponse(intent: UserIntent): SmartResponse {
    const responses = {
      'create_task': {
        text: '✅ فهمت! سأقوم بإنشاء المهمة لك. هل تريد إضافة تفاصيل إضافية؟',
        actions: ['create_task'],
        suggestions: ['إضافة وصف', 'تحديد الأولوية', 'تحديد تاريخ الاستحقاق']
      },
      'view_tasks': {
        text: '📋 سأعرض لك المهام الحالية. هل تريد تصفية معينة؟',
        actions: ['view_tasks'],
        suggestions: ['المهام العاجلة', 'المهام المكتملة', 'المهام المعلقة']
      },
      'get_status': {
        text: '📊 سأعرض لك حالة النظام الحالية.',
        actions: ['get_status'],
        suggestions: ['تفاصيل الأداء', 'إحصائيات المهام', 'حالة الخدمات']
      },
      'chat': {
        text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        actions: [],
        suggestions: ['إنشاء مهمة', 'عرض المهام', 'حالة النظام', 'المساعدة']
      }
    };

    const response = responses[intent.action as keyof typeof responses] || responses['chat'];
    
    return {
      ...response,
      context: {},
      confidence: intent.confidence
    };
  }

  /**
   * تنفيذ الإجراءات التلقائية
   */
  private async executeAutomatedActions(
    intent: UserIntent,
    context: ConversationContext
  ): Promise<string[]> {
    const actions: string[] = [];

    try {
      switch (intent.action) {
        case 'create_task':
          const taskId = await this.createAutomatedTask(intent, context);
          if (taskId) {
            actions.push(`task_created:${taskId}`);
          }
          break;

        case 'schedule_reminder':
          const reminderId = await this.scheduleAutomatedReminder(intent, context);
          if (reminderId) {
            actions.push(`reminder_scheduled:${reminderId}`);
          }
          break;

        case 'automation':
          const automationId = await this.executeCustomAutomation(intent, context);
          if (automationId) {
            actions.push(`automation_executed:${automationId}`);
          }
          break;
      }

    } catch (error) {
      console.error('Error executing automated actions:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'telepilot',
        message: 'Error executing automated actions',
        data: { intent, error: error.message }
      });
    }

    return actions;
  }

  /**
   * إنشاء مهمة تلقائية
   */
  private async createAutomatedTask(
    intent: UserIntent,
    context: ConversationContext
  ): Promise<string | null> {
    try {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task: TaskAutomation = {
        id: taskId,
        title: intent.entities.task_title || 'مهمة جديدة',
        description: intent.parameters.specific_requirements || 'مهمة تم إنشاؤها تلقائياً',
        type: 'create',
        priority: intent.entities.priority || 'medium',
        status: 'pending',
        parameters: intent.entities,
        createdAt: new Date()
      };

      this.taskAutomations.set(taskId, task);

      // حفظ في قاعدة البيانات
      await storage.createChatMessage({
        userId: `telegram-${context.userId}`,
        tenantId: 'default',
        message: `[Telepilot] Task created: ${task.title}`,
        response: `Task ID: ${taskId}`
      });

      console.log(`✅ Automated task created: ${taskId}`);
      return taskId;

    } catch (error) {
      console.error('Error creating automated task:', error);
      return null;
    }
  }

  /**
   * جدولة تذكير تلقائي
   */
  private async scheduleAutomatedReminder(
    intent: UserIntent,
    context: ConversationContext
  ): Promise<string | null> {
    try {
      const reminderId = `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // إنشاء تذكير تلقائي
      const reminder = {
        id: reminderId,
        message: intent.entities.reminder_message || 'تذكير تلقائي',
        scheduledAt: intent.entities.due_date || new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: context.userId,
        chatId: context.chatId
      };

      // حفظ التذكير (في التطبيق الحقيقي، ستستخدم قاعدة بيانات)
      console.log(`⏰ Automated reminder scheduled: ${reminderId}`);
      return reminderId;

    } catch (error) {
      console.error('Error scheduling automated reminder:', error);
      return null;
    }
  }

  /**
   * تنفيذ إجراء تلقائي مخصص
   */
  private async executeCustomAutomation(
    intent: UserIntent,
    context: ConversationContext
  ): Promise<string | null> {
    try {
      const automationId = `automation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // تنفيذ إجراء تلقائي حسب المعاملات
      const automation = {
        id: automationId,
        type: intent.parameters.automation_type || 'custom',
        parameters: intent.parameters,
        executedAt: new Date(),
        userId: context.userId
      };

      console.log(`🤖 Custom automation executed: ${automationId}`);
      return automationId;

    } catch (error) {
      console.error('Error executing custom automation:', error);
      return null;
    }
  }

  /**
   * بدء معالج المحادثات الذكية
   */
  private async startSmartConversationProcessor(): Promise<void> {
    console.log('💬 Starting smart conversation processor...');

    // معالجة المحادثات كل دقيقة
    setInterval(async () => {
      await this.processConversationContexts();
    }, 60 * 1000);
  }

  /**
   * معالجة سياقات المحادثات
   */
  private async processConversationContexts(): Promise<void> {
    const now = new Date();
    const inactiveThreshold = 30 * 60 * 1000; // 30 دقيقة

    for (const [userId, context] of this.userContexts) {
      if (now.getTime() - context.lastActivity.getTime() > inactiveThreshold) {
        // تنظيف المحادثات غير النشطة
        this.userContexts.delete(userId);
        console.log(`🧹 Cleaned inactive context for user ${userId}`);
      }
    }
  }

  /**
   * بدء معالج المهام التلقائية
   */
  private async startTaskAutomationProcessor(): Promise<void> {
    console.log('⚙️ Starting task automation processor...');

    // معالجة المهام كل 5 دقائق
    setInterval(async () => {
      await this.processTaskAutomations();
    }, 5 * 60 * 1000);
  }

  /**
   * معالجة المهام التلقائية
   */
  private async processTaskAutomations(): Promise<void> {
    const pendingTasks = Array.from(this.taskAutomations.values())
      .filter(task => task.status === 'pending');

    for (const task of pendingTasks) {
      try {
        await this.executeTaskAutomation(task);
      } catch (error) {
        console.error(`Error processing task ${task.id}:`, error);
        task.status = 'failed';
      }
    }
  }

  /**
   * تنفيذ مهمة تلقائية
   */
  private async executeTaskAutomation(task: TaskAutomation): Promise<void> {
    console.log(`⚙️ Executing task automation: ${task.id}`);

    task.status = 'processing';

    // محاكاة تنفيذ المهمة
    await new Promise(resolve => setTimeout(resolve, 1000));

    task.status = 'completed';
    task.completedAt = new Date();
    task.result = { success: true, message: 'Task completed successfully' };

    this.monitoringService.logEvent({
      type: 'system_event',
      level: 'info',
      source: 'telepilot',
      message: `Task automation completed: ${task.title}`,
      data: { taskId: task.id, type: task.type }
    });
  }

  /**
   * الحصول على أو إنشاء سياق المستخدم
   */
  private getOrCreateUserContext(userId: number, chatId: number): ConversationContext {
    if (!this.userContexts.has(userId)) {
      const context: ConversationContext = {
        userId,
        chatId,
        sessionId: `session_${userId}_${Date.now()}`,
        history: [],
        preferences: {},
        lastActivity: new Date()
      };
      this.userContexts.set(userId, context);
    }

    const context = this.userContexts.get(userId)!;
    context.lastActivity = new Date();
    return context;
  }

  /**
   * تحديث سياق المحادثة
   */
  private updateConversationContext(
    context: ConversationContext,
    userMessage: string,
    botResponse: string,
    intent: UserIntent
  ): void {
    context.history.push({
      timestamp: new Date(),
      userMessage,
      botResponse,
      intent
    });

    // الاحتفاظ بآخر 10 محادثات فقط
    if (context.history.length > 10) {
      context.history.shift();
    }
  }

  /**
   * الحصول على إحصائيات النظام
   */
  public getStats(): any {
    return {
      isActive: this.isActive,
      activeUsers: this.userContexts.size,
      taskAutomations: {
        total: this.taskAutomations.size,
        pending: Array.from(this.taskAutomations.values()).filter(t => t.status === 'pending').length,
        completed: Array.from(this.taskAutomations.values()).filter(t => t.status === 'completed').length,
        failed: Array.from(this.taskAutomations.values()).filter(t => t.status === 'failed').length
      },
      conversations: {
        total: Array.from(this.userContexts.values()).reduce((sum, ctx) => sum + ctx.history.length, 0),
        averageLength: Array.from(this.userContexts.values()).reduce((sum, ctx) => sum + ctx.history.length, 0) / this.userContexts.size || 0
      }
    };
  }

  /**
   * إيقاف النظام
   */
  public async stop(): Promise<void> {
    if (!this.isActive) return;

    console.log('⏹️ Stopping Telepilot.co integration...');

    this.isActive = false;

    this.monitoringService.logEvent({
      type: 'system_event',
      level: 'info',
      source: 'telepilot',
      message: 'Telepilot.co integration stopped'
    });

    console.log('✅ Telepilot.co integration stopped');
  }
}

// تصدير الدالة لإنشاء الخدمة
export function createTelepilotIntegration(bot: TelegramBot): TelepilotIntegration {
  return new TelepilotIntegration(bot);
}
