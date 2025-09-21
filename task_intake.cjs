#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * 🧩 Autopilot Task Intake System
 * استقبال المهام تلقائيًا من Telegram Bot وWeb App
 * تحويل الرسائل إلى Task Objects قابلة للتوزيع
 */
class TaskIntakeSystem {
    constructor() {
        this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        
        this.taskQueue = [];
        this.activeTasks = new Map();
        this.taskHistory = [];
        this.taskIdCounter = 1;
        
        this.setupMessageHandlers();
        this.setupCommandHandlers();
        this.startTaskProcessor();
        
        console.log('🧩 Task Intake System initialized');
    }

    /**
     * إعداد معالجات الرسائل العامة
     */
    setupMessageHandlers() {
        // معالجة جميع الرسائل النصية كـ tasks محتملة
        this.bot.on('message', async (msg) => {
            if (msg.text && !msg.text.startsWith('/')) {
                await this.processIncomingMessage(msg);
            }
        });

        // معالجة الرسائل الصوتية
        this.bot.on('voice', async (msg) => {
            await this.processVoiceMessage(msg);
        });

        // معالجة الملفات
        this.bot.on('document', async (msg) => {
            await this.processDocumentMessage(msg);
        });

        // معالجة الصور
        this.bot.on('photo', async (msg) => {
            await this.processPhotoMessage(msg);
        });
    }

    /**
     * إعداد معالجات الأوامر الخاصة
     */
    setupCommandHandlers() {
        // أمر إنشاء مهمة محددة
        this.bot.onText(/\/task/, async (msg) => {
            await this.processTaskCommand(msg);
        });

        // أمر حالة النظام
        this.bot.onText(/\/status/, async (msg) => {
            await this.sendSystemStatus(msg);
        });

        // أمر عرض قائمة المهام
        this.bot.onText(/\/queue/, async (msg) => {
            await this.sendTaskQueue(msg);
        });

        // أمر المساعدة
        this.bot.onText(/\/help/, async (msg) => {
            await this.sendHelpMessage(msg);
        });

        // أمر إحصائيات النظام
        this.bot.onText(/\/stats/, async (msg) => {
            await this.sendSystemStats(msg);
        });

        // أمر إيقاف النظام
        this.bot.onText(/\/stop/, async (msg) => {
            await this.stopSystem(msg);
        });
    }

    /**
     * معالجة الرسائل النصية الواردة
     */
    async processIncomingMessage(msg) {
        try {
            const taskId = this.generateTaskId();
            const task = {
                id: taskId,
                type: 'text_message',
                content: msg.text,
                language: this.detectLanguage(msg.text),
                user: {
                    id: msg.from.id,
                    username: msg.from.username || 'unknown',
                    firstName: msg.from.first_name || 'User',
                    lastName: msg.from.last_name || ''
                },
                chatId: msg.chat.id,
                timestamp: new Date().toISOString(),
                status: 'pending',
                priority: this.determinePriority(msg.text),
                source: 'telegram',
                metadata: {
                    messageId: msg.message_id,
                    chatType: msg.chat.type
                }
            };

            // تحليل المهمة باستخدام Gemini AI
            const analysis = await this.analyzeTaskWithAI(task);
            task.analysis = analysis;
            task.assignedAgent = this.determineBestAgent(analysis);

            // إضافة المهمة إلى قائمة الانتظار
            this.taskQueue.push(task);
            this.activeTasks.set(taskId, task);

            // إرسال تأكيد الاستلام
            await this.sendTaskConfirmation(msg.chat.id, task);

            console.log(`📥 Task ${taskId} received and queued`);

        } catch (error) {
            console.error('❌ Message processing failed:', error);
            await this.bot.sendMessage(msg.chat.id, 
                `❌ **خطأ في معالجة الرسالة**\n\nالخطأ: ${error.message}`
            );
        }
    }

    /**
     * معالجة الرسائل الصوتية
     */
    async processVoiceMessage(msg) {
        try {
            const taskId = this.generateTaskId();
            const task = {
                id: taskId,
                type: 'voice_message',
                content: 'Voice message received',
                user: {
                    id: msg.from.id,
                    username: msg.from.username || 'unknown',
                    firstName: msg.from.first_name || 'User'
                },
                chatId: msg.chat.id,
                timestamp: new Date().toISOString(),
                status: 'pending',
                priority: 'medium',
                source: 'telegram',
                metadata: {
                    messageId: msg.message_id,
                    voiceFileId: msg.voice.file_id,
                    duration: msg.voice.duration
                }
            };

            // تحليل المهمة الصوتية
            const analysis = await this.analyzeVoiceTask(task);
            task.analysis = analysis;
            task.assignedAgent = 'voice_processing_agent';

            this.taskQueue.push(task);
            this.activeTasks.set(taskId, task);

            await this.sendTaskConfirmation(msg.chat.id, task);

        } catch (error) {
            console.error('❌ Voice processing failed:', error);
        }
    }

    /**
     * معالجة الملفات المرفقة
     */
    async processDocumentMessage(msg) {
        try {
            const taskId = this.generateTaskId();
            const task = {
                id: taskId,
                type: 'document',
                content: `Document: ${msg.document.file_name}`,
                user: {
                    id: msg.from.id,
                    username: msg.from.username || 'unknown',
                    firstName: msg.from.first_name || 'User'
                },
                chatId: msg.chat.id,
                timestamp: new Date().toISOString(),
                status: 'pending',
                priority: 'medium',
                source: 'telegram',
                metadata: {
                    messageId: msg.message_id,
                    fileName: msg.document.file_name,
                    fileSize: msg.document.file_size,
                    mimeType: msg.document.mime_type
                }
            };

            const analysis = await this.analyzeDocumentTask(task);
            task.analysis = analysis;
            task.assignedAgent = 'file_processing_agent';

            this.taskQueue.push(task);
            this.activeTasks.set(taskId, task);

            await this.sendTaskConfirmation(msg.chat.id, task);

        } catch (error) {
            console.error('❌ Document processing failed:', error);
        }
    }

    /**
     * معالجة الصور
     */
    async processPhotoMessage(msg) {
        try {
            const taskId = this.generateTaskId();
            const task = {
                id: taskId,
                type: 'image',
                content: 'Image received',
                user: {
                    id: msg.from.id,
                    username: msg.from.username || 'unknown',
                    firstName: msg.from.first_name || 'User'
                },
                chatId: msg.chat.id,
                timestamp: new Date().toISOString(),
                status: 'pending',
                priority: 'medium',
                source: 'telegram',
                metadata: {
                    messageId: msg.message_id,
                    photoSizes: msg.photo.map(p => ({ width: p.width, height: p.height }))
                }
            };

            const analysis = await this.analyzeImageTask(task);
            task.analysis = analysis;
            task.assignedAgent = 'image_processing_agent';

            this.taskQueue.push(task);
            this.activeTasks.set(taskId, task);

            await this.sendTaskConfirmation(msg.chat.id, task);

        } catch (error) {
            console.error('❌ Image processing failed:', error);
        }
    }

    /**
     * معالجة أوامر المهام المحددة
     */
    async processTaskCommand(msg) {
        try {
            const args = msg.text.split(' ').slice(1);
            const taskType = args[0] || 'general';
            const taskContent = args.slice(1).join(' ') || 'No content provided';

            const taskId = this.generateTaskId();
            const task = {
                id: taskId,
                type: taskType,
                content: taskContent,
                language: this.detectLanguage(taskContent),
                user: {
                    id: msg.from.id,
                    username: msg.from.username || 'unknown',
                    firstName: msg.from.first_name || 'User'
                },
                chatId: msg.chat.id,
                timestamp: new Date().toISOString(),
                status: 'pending',
                priority: 'high',
                source: 'telegram_command',
                metadata: {
                    command: '/task',
                    taskType: taskType
                }
            };

            const analysis = await this.analyzeTaskWithAI(task);
            task.analysis = analysis;
            task.assignedAgent = this.determineBestAgent(analysis);

            this.taskQueue.push(task);
            this.activeTasks.set(taskId, task);

            await this.bot.sendMessage(msg.chat.id,
                `🎯 **تم إنشاء المهمة**\n\n` +
                `**المعرف**: \`${taskId}\`\n` +
                `**النوع**: ${taskType}\n` +
                `**الوكيل**: ${task.assignedAgent}\n` +
                `**الأولوية**: ${task.priority}\n\n` +
                `🚀 جاري التوزيع...`,
                { parse_mode: 'Markdown' }
            );

        } catch (error) {
            console.error('❌ Task command processing failed:', error);
        }
    }

    /**
     * تحليل المهمة باستخدام Gemini AI
     */
    async analyzeTaskWithAI(task) {
        try {
            const prompt = `
            قم بتحليل هذه المهمة وقدم معلومات منظمة:

            المهمة: "${task.content}"
            النوع: ${task.type}
            اللغة: ${task.language}
            المستخدم: ${task.user.firstName}

            قدم التحليل بصيغة JSON:
            {
                "intent": "ما يريد المستخدم تحقيقه",
                "category": "data_analysis|web_scraping|automation|ai_task|general|voice|image|document",
                "complexity": "low|medium|high",
                "required_agents": ["agent1", "agent2"],
                "estimated_duration": "seconds|minutes|hours",
                "resources_needed": ["resource1", "resource2"],
                "language": "ar|en",
                "confidence": 0.95
            }
            `;

            const result = await this.model.generateContent(prompt);
            const analysis = result.response.text();
            
            try {
                return JSON.parse(analysis);
            } catch (e) {
                return {
                    intent: "مهمة عامة",
                    category: "general",
                    complexity: "medium",
                    required_agents: ["gemini_ai"],
                    estimated_duration: "minutes",
                    resources_needed: [],
                    language: task.language,
                    confidence: 0.7
                };
            }
        } catch (error) {
            console.error('❌ AI analysis failed:', error);
            return {
                intent: "مهمة عامة",
                category: "general",
                complexity: "medium",
                required_agents: ["gemini_ai"],
                estimated_duration: "minutes",
                resources_needed: [],
                language: task.language,
                confidence: 0.5
            };
        }
    }

    /**
     * تحليل المهام الصوتية
     */
    async analyzeVoiceTask(task) {
        return {
            intent: "معالجة رسالة صوتية",
            category: "voice",
            complexity: "medium",
            required_agents: ["voice_processing_agent"],
            estimated_duration: "minutes",
            resources_needed: ["speech_to_text", "audio_processing"],
            language: "ar",
            confidence: 0.8
        };
    }

    /**
     * تحليل المهام الوثائقية
     */
    async analyzeDocumentTask(task) {
        return {
            intent: "معالجة وثيقة",
            category: "document",
            complexity: "medium",
            required_agents: ["file_processing_agent"],
            estimated_duration: "minutes",
            resources_needed: ["file_parser", "text_extraction"],
            language: "ar",
            confidence: 0.8
        };
    }

    /**
     * تحليل المهام المصورة
     */
    async analyzeImageTask(task) {
        return {
            intent: "معالجة صورة",
            category: "image",
            complexity: "medium",
            required_agents: ["image_processing_agent"],
            estimated_duration: "minutes",
            resources_needed: ["image_analysis", "ocr"],
            language: "ar",
            confidence: 0.8
        };
    }

    /**
     * تحديد أفضل وكيل للمهمة
     */
    determineBestAgent(analysis) {
        const category = analysis.category || 'general';
        const agents = {
            'data_analysis': 'gemini_ai',
            'web_scraping': 'httpie_agent',
            'automation': 'automation_agent',
            'ai_task': 'gemini_ai',
            'voice': 'voice_processing_agent',
            'image': 'image_processing_agent',
            'document': 'file_processing_agent',
            'general': 'gemini_ai'
        };
        return agents[category] || 'gemini_ai';
    }

    /**
     * تحديد أولوية المهمة
     */
    determinePriority(content) {
        const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical', 'important', 'عاجل', 'مهم', 'فوري'];
        const lowKeywords = ['later', 'when possible', 'low priority', 'لاحقاً', 'عند الإمكان'];
        
        const lowerContent = content.toLowerCase();
        
        if (urgentKeywords.some(keyword => lowerContent.includes(keyword))) {
            return 'urgent';
        } else if (lowKeywords.some(keyword => lowerContent.includes(keyword))) {
            return 'low';
        } else {
            return 'medium';
        }
    }

    /**
     * كشف اللغة
     */
    detectLanguage(text) {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? 'ar' : 'en';
    }

    /**
     * إرسال تأكيد استلام المهمة
     */
    async sendTaskConfirmation(chatId, task) {
        const priorityEmoji = {
            'urgent': '🚨',
            'high': '🔥',
            'medium': '⚡',
            'low': '📝'
        };

        const message = `🧩 **تم استلام المهمة**\n\n` +
            `**المعرف**: \`${task.id}\`\n` +
            `**النوع**: ${task.type}\n` +
            `**الأولوية**: ${priorityEmoji[task.priority]} ${task.priority}\n` +
            `**الوكيل**: ${task.assignedAgent}\n` +
            `**الحالة**: ${task.status}\n\n` +
            `⏳ جاري المعالجة...`;

        await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }

    /**
     * إرسال حالة النظام
     */
    async sendSystemStatus(msg) {
        const activeCount = this.activeTasks.size;
        const queueCount = this.taskQueue.length;
        const historyCount = this.taskHistory.length;

        await this.bot.sendMessage(msg.chat.id,
            `📊 **حالة نظام Autopilot**\n\n` +
            `🔄 **المهام النشطة**: ${activeCount}\n` +
            `⏳ **قائمة الانتظار**: ${queueCount}\n` +
            `✅ **المكتملة**: ${historyCount}\n` +
            `🤖 **الوكلاء**: متصلون\n\n` +
            `🕐 آخر تحديث: ${new Date().toLocaleString()}`,
            { parse_mode: 'Markdown' }
        );
    }

    /**
     * إرسال قائمة المهام
     */
    async sendTaskQueue(msg) {
        if (this.taskQueue.length === 0) {
            await this.bot.sendMessage(msg.chat.id, '📋 **قائمة المهام فارغة**');
            return;
        }

        let queueText = '📋 **قائمة المهام**\n\n';
        this.taskQueue.slice(0, 10).forEach((task, index) => {
            queueText += `${index + 1}. **${task.id}** - ${task.type}\n`;
            queueText += `   الأولوية: ${task.priority}\n`;
            queueText += `   الوكيل: ${task.assignedAgent}\n\n`;
        });

        await this.bot.sendMessage(msg.chat.id, queueText, { parse_mode: 'Markdown' });
    }

    /**
     * إرسال رسالة المساعدة
     */
    async sendHelpMessage(msg) {
        const helpText = `
🤖 **أوامر نظام Autopilot**

**الأوامر الأساسية:**
• أرسل أي رسالة → معالجة تلقائية كمهمة
• \`/task [نوع] [المحتوى]\` → إنشاء مهمة محددة
• \`/status\` → عرض حالة النظام
• \`/queue\` → عرض قائمة المهام
• \`/stats\` → عرض الإحصائيات
• \`/help\` → عرض هذه المساعدة

**أنواع المهام:**
• \`data_analysis\` → مهام تحليل البيانات
• \`web_scraping\` → مهام استخراج البيانات
• \`automation\` → مهام الأتمتة
• \`ai_task\` → مهام الذكاء الاصطناعي

**أمثلة:**
• \`/task data_analysis تحليل بيانات المبيعات\`
• \`/task web_scraping استخراج بيانات موقع\`
• \`مرحبا، هل يمكنك مساعدتي في...\`

🎯 **النظام سيقوم تلقائياً بـ:**
• تحليل طلبك
• تعيين الوكيل المناسب
• معالجة المهمة
• إرسال النتائج
        `;

        await this.bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
    }

    /**
     * إرسال إحصائيات النظام
     */
    async sendSystemStats(msg) {
        const stats = this.getSystemStats();
        
        await this.bot.sendMessage(msg.chat.id,
            `📈 **إحصائيات النظام**\n\n` +
            `📊 **إجمالي المهام**: ${stats.total}\n` +
            `✅ **مكتملة**: ${stats.completed}\n` +
            `❌ **فاشلة**: ${stats.failed}\n` +
            `⏳ **متوسطة الوقت**: ${stats.avgDuration}\n` +
            `🎯 **معدل النجاح**: ${stats.successRate}%\n\n` +
            `🕐 آخر تحديث: ${new Date().toLocaleString()}`,
            { parse_mode: 'Markdown' }
        );
    }

    /**
     * إيقاف النظام
     */
    async stopSystem(msg) {
        await this.bot.sendMessage(msg.chat.id,
            `🛑 **إيقاف النظام**\n\n` +
            `📊 **المهام المتبقية**: ${this.taskQueue.length}\n` +
            `🔄 **المهام النشطة**: ${this.activeTasks.size}\n\n` +
            `⏳ جاري الإيقاف...`
        );

        // إيقاف معالجة المهام
        this.stopTaskProcessor();
        
        setTimeout(() => {
            process.exit(0);
        }, 5000);
    }

    /**
     * بدء معالج المهام
     */
    startTaskProcessor() {
        this.taskProcessorInterval = setInterval(() => {
            this.processTaskQueue();
        }, 1000);
        
        console.log('🔄 Task processor started');
    }

    /**
     * إيقاف معالج المهام
     */
    stopTaskProcessor() {
        if (this.taskProcessorInterval) {
            clearInterval(this.taskProcessorInterval);
            console.log('🛑 Task processor stopped');
        }
    }

    /**
     * معالجة قائمة المهام
     */
    processTaskQueue() {
        // سيتم تنفيذ هذا في Task Dispatcher
        // هذا مجرد placeholder
    }

    /**
     * توليد معرف فريد للمهمة
     */
    generateTaskId() {
        return `TASK_${Date.now()}_${this.taskIdCounter++}`;
    }

    /**
     * الحصول على إحصائيات النظام
     */
    getSystemStats() {
        const total = this.taskHistory.length + this.activeTasks.size;
        const completed = this.taskHistory.filter(t => t.status === 'completed').length;
        const failed = this.taskHistory.filter(t => t.status === 'failed').length;
        
        const avgDuration = this.taskHistory.length > 0 ? 
            this.taskHistory.reduce((sum, task) => sum + (task.duration || 0), 0) / this.taskHistory.length : 0;
        
        const successRate = total > 0 ? (completed / total * 100).toFixed(1) : 0;

        return {
            total,
            completed,
            failed,
            avgDuration: avgDuration < 1000 ? `${Math.round(avgDuration)}ms` : `${Math.round(avgDuration / 1000)}s`,
            successRate
        };
    }

    /**
     * الحصول على المهام المعلقة
     */
    getPendingTasks() {
        return this.taskQueue;
    }

    /**
     * الحصول على المهام النشطة
     */
    getActiveTasks() {
        return Array.from(this.activeTasks.values());
    }

    /**
     * الحصول على تاريخ المهام
     */
    getTaskHistory() {
        return this.taskHistory;
    }
}

module.exports = TaskIntakeSystem;
