// AI NLP Service for Natural Language Processing
// خدمة الذكاء الاصطناعي لفهم الأوامر الطبيعية

import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from './storage.js';

export interface NLPResult {
  intent: string;
  entities: Record<string, any>;
  confidence: number;
  response: string;
  action?: string;
  parameters?: Record<string, any>;
}

export interface UserContext {
  userId: number;
  chatId: number;
  username?: string;
  currentTask?: string;
  lastInteraction?: Date;
  preferences?: Record<string, any>;
}

export interface TaskContext {
  taskId?: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedTo?: string;
  dueDate?: Date;
}

export class AINLPService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private userContexts: Map<number, UserContext> = new Map();
  private taskContexts: Map<string, TaskContext> = new Map();
  private conversationHistory: Map<number, any[]> = new Map();

  constructor() {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is required');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('🧠 AI NLP Service initialized');
  }

  /**
   * معالجة النص الطبيعي وفهم القصد
   */
  async processNaturalLanguage(text: string, userContext: UserContext): Promise<NLPResult> {
    try {
      // تحديث سياق المستخدم
      this.updateUserContext(userContext);

      // تحليل النص باستخدام LLM
      const analysis = await this.analyzeTextWithLLM(text, userContext);

      // استخراج الكيانات
      const entities = await this.extractEntities(text);

      // تحديد الإجراء
      const action = await this.determineAction(analysis, entities, userContext);

      // إنشاء رد مخصص
      const response = await this.generateCustomResponse(analysis, entities, userContext);

      // حفظ تاريخ المحادثة
      this.saveConversationHistory(userContext.chatId, text, analysis);

      return {
        intent: analysis.intent,
        entities,
        confidence: analysis.confidence,
        response,
        action,
        parameters: analysis.parameters
      };

    } catch (error) {
      console.error('Error in NLP processing:', error);
      return {
        intent: 'unknown',
        entities: {},
        confidence: 0,
        response: 'عذراً، لم أفهم طلبك. يرجى المحاولة مرة أخرى.',
        action: 'fallback'
      };
    }
  }

  /**
   * تحليل النص باستخدام LLM
   */
  private async analyzeTextWithLLM(text: string, userContext: UserContext): Promise<any> {
    const prompt = `
أنت مساعد ذكي لنظام إدارة المهام AuraOS. مهمتك هي فهم طلبات المستخدمين باللغة العربية والإنجليزية.

المستخدم: ${userContext.username || 'مجهول'}
النص: "${text}"

حلل النص وحدد:
1. القصد (intent): ما يريد المستخدم فعله
2. الثقة (confidence): من 0 إلى 1
3. المعاملات (parameters): أي معلومات إضافية

الأهداف المحتملة:
- create_task: إنشاء مهمة جديدة
- view_tasks: عرض المهام
- update_task: تحديث مهمة
- delete_task: حذف مهمة
- autopilot_status: حالة Autopilot
- autopilot_assign: تعيين مهمة لـ Autopilot
- get_help: طلب المساعدة
- system_status: حالة النظام
- greeting: تحية
- goodbye: وداع

أجب بصيغة JSON:
{
  "intent": "القصد",
  "confidence": 0.95,
  "parameters": {
    "task_title": "عنوان المهمة",
    "priority": "الأولوية",
    "description": "الوصف"
  }
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // تحليل JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // fallback parsing
      return {
        intent: this.extractIntentFromText(text),
        confidence: 0.8,
        parameters: {}
      };
    } catch (error) {
      console.error('LLM analysis error:', error);
      return {
        intent: 'unknown',
        confidence: 0.5,
        parameters: {}
      };
    }
  }

  /**
   * استخراج الكيانات من النص
   */
  private async extractEntities(text: string): Promise<Record<string, any>> {
    const entities: Record<string, any> = {};

    // استخراج الأولوية
    const priorityPatterns = {
      'critical': /حرج|حرجة|مهم|مهمة|عاجل|عاجلة|فوري|فورية/i,
      'high': /عالي|عالية|مهم|مهمة/i,
      'medium': /متوسط|متوسطة|عادي|عادية/i,
      'low': /منخفض|منخفضة|بسيط|بسيطة/i
    };

    for (const [priority, pattern] of Object.entries(priorityPatterns)) {
      if (pattern.test(text)) {
        entities.priority = priority;
        break;
      }
    }

    // استخراج التواريخ
    const datePatterns = [
      /اليوم|هذا اليوم/i,
      /غداً|غدا|بكرا/i,
      /الأسبوع|هذا الأسبوع/i,
      /الشهر|هذا الشهر/i,
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})-(\d{1,2})-(\d{4})/
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        entities.dueDate = this.parseDate(match[0]);
        break;
      }
    }

    // استخراج الأرقام
    const numberMatch = text.match(/\d+/);
    if (numberMatch) {
      entities.number = parseInt(numberMatch[0]);
    }

    // استخراج الأسماء
    const namePatterns = [
      /اسمه\s+(\w+)/i,
      /يسمى\s+(\w+)/i,
      /اسم\s+(\w+)/i
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        entities.name = match[1];
        break;
      }
    }

    return entities;
  }

  /**
   * تحديد الإجراء المطلوب
   */
  private async determineAction(analysis: any, entities: Record<string, any>, userContext: UserContext): Promise<string> {
    const intent = analysis.intent;
    const parameters = analysis.parameters || {};

    // تحديد الإجراء بناءً على القصد
    switch (intent) {
      case 'create_task':
        return 'create_task';
      case 'view_tasks':
        return 'view_tasks';
      case 'update_task':
        return 'update_task';
      case 'delete_task':
        return 'delete_task';
      case 'autopilot_status':
        return 'autopilot_status';
      case 'autopilot_assign':
        return 'autopilot_assign';
      case 'system_status':
        return 'system_status';
      case 'greeting':
        return 'greeting';
      case 'goodbye':
        return 'goodbye';
      default:
        return 'fallback';
    }
  }

  /**
   * إنشاء رد مخصص
   */
  private async generateCustomResponse(analysis: any, entities: Record<string, any>, userContext: UserContext): Promise<string> {
    const intent = analysis.intent;
    const confidence = analysis.confidence;
    const parameters = analysis.parameters || {};

    // إنشاء رد مخصص بناءً على القصد والسياق
    switch (intent) {
      case 'create_task':
        return await this.generateTaskCreationResponse(parameters, entities, userContext);
      case 'view_tasks':
        return await this.generateTaskViewResponse(userContext);
      case 'autopilot_status':
        return await this.generateAutopilotStatusResponse(userContext);
      case 'greeting':
        return await this.generateGreetingResponse(userContext);
      case 'goodbye':
        return await this.generateGoodbyeResponse(userContext);
      default:
        return await this.generateFallbackResponse(text, userContext);
    }
  }

  /**
   * إنشاء رد لإنشاء المهام
   */
  private async generateTaskCreationResponse(parameters: any, entities: Record<string, any>, userContext: UserContext): Promise<string> {
    const taskTitle = parameters.task_title || entities.name || 'مهمة جديدة';
    const priority = parameters.priority || entities.priority || 'medium';
    const description = parameters.description || '';

    const priorityEmoji = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🟠',
      'critical': '🔴'
    }[priority];

    const priorityText = {
      'low': 'منخفضة',
      'medium': 'متوسطة',
      'high': 'عالية',
      'critical': 'حرجة'
    }[priority];

    return `
✅ فهمت طلبك!

📋 المهمة: ${taskTitle}
🎯 الأولوية: ${priorityEmoji} ${priorityText}
📝 الوصف: ${description || 'لم يتم تحديد وصف'}

هل تريد إنشاء هذه المهمة؟
    `;
  }

  /**
   * إنشاء رد لعرض المهام
   */
  private async generateTaskViewResponse(userContext: UserContext): Promise<string> {
    // جلب المهام من قاعدة البيانات
    const tasks = await this.getUserTasks(userContext.userId);
    
    if (tasks.length === 0) {
      return '📋 لا توجد مهام حالياً.\n\nاستخدم "إنشاء مهمة" لإضافة مهمة جديدة.';
    }

    let response = '📋 مهامك الحالية:\n\n';
    
    tasks.forEach((task, index) => {
      const priorityEmoji = {
        'low': '🟢',
        'medium': '🟡',
        'high': '🟠',
        'critical': '🔴'
      }[task.priority];

      const statusEmoji = {
        'pending': '⏳',
        'in_progress': '🔄',
        'completed': '✅',
        'failed': '❌'
      }[task.status];

      response += `${index + 1}. ${priorityEmoji} ${statusEmoji} ${task.title}\n`;
      response += `   📝 ${task.description}\n`;
      response += `   📅 ${task.createdAt.toLocaleDateString('ar-SA')}\n\n`;
    });

    return response;
  }

  /**
   * إنشاء رد لحالة Autopilot
   */
  private async generateAutopilotStatusResponse(userContext: UserContext): Promise<string> {
    const stats = await this.getSystemStats();
    
    return `
🤖 حالة Autopilot

🟢 النظام: يعمل بنشاط
🔄 المهام النشطة: ${stats.activeTasks}
👥 المستخدمون النشطون: ${stats.activeUsers}
⏰ وقت التشغيل: ${Math.floor(stats.uptime)} ثانية
💾 الذاكرة: ${Math.round(stats.memory / 1024 / 1024)} MB

🚀 الميزات النشطة:
• NLP متقدم
• تفاعل ذكي
• مراقبة مستمرة
• تحسين تلقائي
    `;
  }

  /**
   * إنشاء رد للتحية
   */
  private async generateGreetingResponse(userContext: UserContext): Promise<string> {
    const greetings = [
      `مرحباً ${userContext.username || 'عزيزي'}! 👋`,
      `أهلاً وسهلاً ${userContext.username || 'بك'}! 🌟`,
      `مرحباً ${userContext.username || 'صديقي'}! 🎉`,
      `أهلاً ${userContext.username || 'بك'} في AuraOS! 🚀`
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return `
${randomGreeting}

أنا مساعدك الذكي في نظام AuraOS! 🤖

يمكنني مساعدتك في:
• إنشاء وإدارة المهام
• مراقبة حالة Autopilot
• توفير معلومات النظام
• التفاعل الذكي معك

ما الذي تريد فعله اليوم؟
    `;
  }

  /**
   * إنشاء رد للوداع
   */
  private async generateGoodbyeResponse(userContext: UserContext): Promise<string> {
    const goodbyes = [
      `وداعاً ${userContext.username || 'عزيزي'}! 👋`,
      `إلى اللقاء ${userContext.username || 'بك'}! 🌟`,
      `مع السلامة ${userContext.username || 'صديقي'}! 🎉`,
      `وداعاً ${userContext.username || 'بك'}! 🚀`
    ];

    const randomGoodbye = goodbyes[Math.floor(Math.random() * goodbyes.length)];
    
    return `
${randomGoodbye}

شكراً لاستخدام AuraOS! 
أتمنى أن أكون قد ساعدتك اليوم. 😊

أراك قريباً! 👋
    `;
  }

  /**
   * إنشاء رد افتراضي
   */
  private async generateFallbackResponse(text: string, userContext: UserContext): Promise<string> {
    return `
🤔 لم أفهم طلبك: "${text}"

يمكنني مساعدتك في:
• إنشاء المهام: "أنشئ مهمة جديدة"
• عرض المهام: "أظهر مهامي"
• حالة النظام: "ما حالة Autopilot؟"
• المساعدة: "ساعدني"

أو استخدم /menu للوصول إلى القائمة الرئيسية.
    `;
  }

  /**
   * تحديث سياق المستخدم
   */
  private updateUserContext(userContext: UserContext): void {
    userContext.lastInteraction = new Date();
    this.userContexts.set(userContext.userId, userContext);
  }

  /**
   * حفظ تاريخ المحادثة
   */
  private saveConversationHistory(chatId: number, text: string, analysis: any): void {
    if (!this.conversationHistory.has(chatId)) {
      this.conversationHistory.set(chatId, []);
    }

    const history = this.conversationHistory.get(chatId)!;
    history.push({
      timestamp: new Date(),
      text,
      analysis,
      intent: analysis.intent,
      confidence: analysis.confidence
    });

    // الاحتفاظ بآخر 10 محادثات فقط
    if (history.length > 10) {
      history.shift();
    }
  }

  /**
   * استخراج القصد من النص
   */
  private extractIntentFromText(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('أنشئ') || lowerText.includes('إنشاء') || lowerText.includes('مهمة')) {
      return 'create_task';
    }
    if (lowerText.includes('أظهر') || lowerText.includes('عرض') || lowerText.includes('مهام')) {
      return 'view_tasks';
    }
    if (lowerText.includes('حالة') || lowerText.includes('status') || lowerText.includes('autopilot')) {
      return 'autopilot_status';
    }
    if (lowerText.includes('مرحبا') || lowerText.includes('أهلا') || lowerText.includes('hello')) {
      return 'greeting';
    }
    if (lowerText.includes('وداعا') || lowerText.includes('مع السلامة') || lowerText.includes('goodbye')) {
      return 'goodbye';
    }

    return 'unknown';
  }

  /**
   * تحليل التاريخ
   */
  private parseDate(dateString: string): Date {
    const now = new Date();
    
    if (dateString.includes('اليوم')) {
      return now;
    }
    if (dateString.includes('غداً') || dateString.includes('غدا')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }
    if (dateString.includes('الأسبوع')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }
    if (dateString.includes('الشهر')) {
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    }

    // محاولة تحليل التاريخ
    const dateMatch = dateString.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    return now;
  }

  /**
   * جلب مهام المستخدم
   */
  private async getUserTasks(userId: number): Promise<any[]> {
    try {
      // محاكاة جلب المهام من قاعدة البيانات
      return [
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
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return [];
    }
  }

  /**
   * جلب إحصائيات النظام
   */
  private async getSystemStats(): Promise<any> {
    return {
      activeTasks: 5,
      activeUsers: 3,
      uptime: process.uptime(),
      memory: process.memoryUsage().heapUsed
    };
  }

  /**
   * الحصول على سياق المستخدم
   */
  public getUserContext(userId: number): UserContext | undefined {
    return this.userContexts.get(userId);
  }

  /**
   * الحصول على تاريخ المحادثة
   */
  public getConversationHistory(chatId: number): any[] {
    return this.conversationHistory.get(chatId) || [];
  }

  /**
   * مسح تاريخ المحادثة
   */
  public clearConversationHistory(chatId: number): void {
    this.conversationHistory.delete(chatId);
  }
}

// تصدير الدالة لإنشاء الخدمة
export function createAINLPService(): AINLPService {
  return new AINLPService();
}
