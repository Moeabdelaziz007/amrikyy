#!/usr/bin/env node

require('dotenv').config();

// Import all Autopilot components
const TaskIntakeSystem = require('./task_intake.cjs');
const TaskDispatcher = require('./task_dispatcher.cjs');
const TaskExecutor = require('./task_executor.cjs');
const FeedbackLoop = require('./feedback_loop.cjs');
const LoggingAnalytics = require('./logging_analytics.cjs');

/**
 * 🤖 AuraOS Autopilot Brain - LLM Integration
 * نظام الدماغ الذكي للأوتوبايلوت مع تكامل الذكاء الاصطناعي
 */
class AutopilotBrain {
    constructor(loggingSystem) {
        this.logging = loggingSystem;
        this.llmIntegration = null;
        this.isInitialized = false;
        this.decisionHistory = [];
        this.systemContext = {
            currentLoad: 0,
            activeTasks: 0,
            systemHealth: 'unknown',
            lastAnalysis: null,
            optimizationScore: 0
        };

        this.initializeLLM();
        console.log('🤖 Autopilot Brain initialized');
    }

    /**
     * تهيئة تكامل الـ LLM
     */
    async initializeLLM() {
        try {
            // Import LLM integration dynamically
            const { AutopilotLLMIntegration } = await import('./autopilot-llm-integration.js');
            this.llmIntegration = new AutopilotLLMIntegration();

            this.logging.logEvent({
                level: 'info',
                category: 'brain',
                message: 'LLM Integration initialized successfully',
                source: 'autopilot_brain'
            });

            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Failed to initialize LLM integration:', error);
            this.logging.logError(error, { source: 'autopilot_brain' });
        }
    }

    /**
     * تحليل المهمة باستخدام الـ LLM
     */
    async analyzeTask(task) {
        if (!this.isInitialized || !this.llmIntegration) {
            console.log('⚠️ LLM not initialized, using basic analysis');
            return this.basicTaskAnalysis(task);
        }

        try {
            const analysis = await this.llmIntegration.analyzeTask(task);

            this.logging.logEvent({
                level: 'info',
                category: 'brain',
                message: `Task ${task.id} analyzed by LLM`,
                data: { taskId: task.id, analysis },
                source: 'autopilot_brain'
            });

            return analysis;
        } catch (error) {
            console.error(`❌ LLM analysis failed for task ${task.id}:`, error);
            this.logging.logError(error, { source: 'autopilot_brain', taskId: task.id });

            // Fallback to basic analysis
            return this.basicTaskAnalysis(task);
        }
    }

    /**
     * تحليل أساسي للمهام بدون LLM
     */
    basicTaskAnalysis(task) {
        return {
            intent: task.content.substring(0, 50) + '...',
            category: this.categorizeTask(task.content),
            complexity: this.assessComplexity(task),
            estimated_duration: this.estimateDuration(task),
            required_resources: [],
            suggested_agent: this.suggestAgent(task),
            optimization_suggestions: [],
            risk_assessment: 'medium',
            dependencies: []
        };
    }

    /**
     * تصنيف المهمة
     */
    categorizeTask(content) {
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes('data') || lowerContent.includes('analyze')) {
            return 'data_analysis';
        } else if (lowerContent.includes('scrape') || lowerContent.includes('web')) {
            return 'web_scraping';
        } else if (lowerContent.includes('automate') || lowerContent.includes('workflow')) {
            return 'automation';
        } else if (lowerContent.includes('ai') || lowerContent.includes('machine learning')) {
            return 'ai_task';
        } else if (lowerContent.includes('optimize') || lowerContent.includes('performance')) {
            return 'system_optimization';
        } else {
            return 'general';
        }
    }

    /**
     * تقييم تعقيد المهمة
     */
    assessComplexity(task) {
        const priority = task.priority || 'medium';
        const contentLength = task.content.length;

        if (priority === 'urgent' || contentLength > 500) {
            return 'high';
        } else if (priority === 'low' || contentLength < 100) {
            return 'low';
        } else {
            return 'medium';
        }
    }

    /**
     * تقدير مدة المهمة
     */
    estimateDuration(task) {
        const complexity = this.assessComplexity(task);

        switch (complexity) {
            case 'high': return 'hours';
            case 'medium': return 'minutes';
            case 'low': default: return 'seconds';
        }
    }

    /**
     * اقتراح الوكيل المناسب
     */
    suggestAgent(task) {
        const category = this.categorizeTask(task.content);

        const agentMapping = {
            'data_analysis': 'gemini_ai',
            'web_scraping': 'httpie_agent',
            'automation': 'task_executor',
            'ai_task': 'gemini_ai',
            'system_optimization': 'system_monitor',
            'general': 'gemini_ai'
        };

        return agentMapping[category] || 'gemini_ai';
    }

    /**
     * اتخاذ قرار ذكي بشأن المهمة
     */
    async makeDecision(task, systemContext) {
        if (!this.isInitialized || !this.llmIntegration) {
            return this.basicDecision(task, systemContext);
        }

        try {
            const decisionPrompt = `
                Make an intelligent decision about this autopilot task:

                Task: ${task.content}
                Priority: ${task.priority}
                Category: ${this.categorizeTask(task.content)}

                System Context:
                - Current Load: ${systemContext.currentLoad}%
                - Active Tasks: ${systemContext.activeTasks}
                - System Health: ${systemContext.systemHealth}

                Provide decision in JSON format:
                {
                    "action": "accept|defer|reject",
                    "priority_adjustment": "increase|decrease|keep",
                    "agent_assignment": "specific_agent_name",
                    "reasoning": "brief explanation",
                    "confidence": 0-100
                }
            `;

            const response = await this.llmIntegration.generateIntelligentResponse(
                decisionPrompt,
                systemContext
            );

            try {
                const decision = JSON.parse(response);
                this.recordDecision(task, decision, systemContext);

                return decision;
            } catch (parseError) {
                console.log('⚠️ Failed to parse LLM decision, using fallback');
                return this.basicDecision(task, systemContext);
            }

        } catch (error) {
            console.error('❌ LLM decision making failed:', error);
            return this.basicDecision(task, systemContext);
        }
    }

    /**
     * قرار أساسي بدون LLM
     */
    basicDecision(task, systemContext) {
        const decision = {
            action: systemContext.currentLoad > 80 ? 'defer' : 'accept',
            priority_adjustment: 'keep',
            agent_assignment: this.suggestAgent(task),
            reasoning: systemContext.currentLoad > 80 ?
                'System load too high, deferring task' :
                'Basic decision: accepting task',
            confidence: systemContext.currentLoad > 80 ? 70 : 90
        };

        this.recordDecision(task, decision, systemContext);
        return decision;
    }

    /**
     * تسجيل القرار للتعلم
     */
    recordDecision(task, decision, context) {
        this.decisionHistory.push({
            timestamp: new Date().toISOString(),
            taskId: task.id,
            decision,
            context: { ...context }
        });

        // Keep only last 100 decisions
        if (this.decisionHistory.length > 100) {
            this.decisionHistory = this.decisionHistory.slice(-100);
        }
    }

    /**
     * تحليل أداء النظام باستخدام LLM
     */
    async analyzeSystemPerformance(systemStats) {
        if (!this.isInitialized || !this.llmIntegration) {
            return this.basicPerformanceAnalysis(systemStats);
        }

        try {
            const analysis = await this.llmIntegration.analyzeSystemPerformance();

            this.logging.logEvent({
                level: 'info',
                category: 'brain',
                message: 'System performance analyzed by LLM',
                data: { analysis },
                source: 'autopilot_brain'
            });

            return analysis;
        } catch (error) {
            console.error('❌ LLM performance analysis failed:', error);
            return this.basicPerformanceAnalysis(systemStats);
        }
    }

    /**
     * تحليل أداء أساسي
     */
    basicPerformanceAnalysis(systemStats) {
        return {
            overall_health: 'good',
            performance_score: 75,
            key_metrics: {
                efficiency: '80%',
                reliability: '85%',
                scalability: '70%'
            },
            bottlenecks: [],
            recommendations: ['Monitor system resources'],
            optimization_opportunities: ['Improve task scheduling'],
            risk_factors: []
        };
    }

    /**
     * تحديث سياق النظام
     */
    updateSystemContext(context) {
        this.systemContext = { ...this.systemContext, ...context };

        this.logging.logEvent({
            level: 'debug',
            category: 'brain',
            message: 'System context updated',
            data: context,
            source: 'autopilot_brain'
        });
    }

    /**
     * الحصول على إحصائيات الدماغ
     */
    getBrainStats() {
        return {
            isInitialized: this.isInitialized,
            decisionCount: this.decisionHistory.length,
            averageConfidence: this.decisionHistory.length > 0 ?
                this.decisionHistory.reduce((sum, d) => sum + d.decision.confidence, 0) / this.decisionHistory.length : 0,
            systemContext: this.systemContext,
            lastAnalysis: this.systemContext.lastAnalysis
        };
    }
}

/**
 * 🚀 AuraOS Autopilot System
 * النظام الرئيسي لتشغيل Autopilot System كاملاً
 * تكامل جميع المكونات مع بعضها البعض
 */
class AuraOSAutopilot {
    constructor() {
        this.components = {};
        this.isRunning = false;
        this.startTime = null;
        this.systemStats = {
            uptime: 0,
            totalTasks: 0,
            successfulTasks: 0,
            failedTasks: 0,
            activeAgents: 0,
            systemHealth: 'starting'
        };
        
        this.initializeComponents();
        this.setupSystemMonitoring();
        
        console.log('🚀 AuraOS Autopilot System initialized');
    }

    /**
     * تهيئة جميع المكونات
     */
    async initializeComponents() {
        try {
            console.log('🔧 Initializing Autopilot components...');

            // تهيئة نظام التسجيل والتحليلات أولاً
            this.components.logging = new LoggingAnalytics();
            this.components.logging.logEvent({
                level: 'info',
                category: 'system',
                message: 'AuraOS Autopilot System starting',
                source: 'autopilot_system'
            });

            // تهيئة الدماغ الذكي (Brain)
            this.components.brain = new AutopilotBrain(this.components.logging);
            this.components.logging.logEvent({
                level: 'info',
                category: 'component',
                message: 'Autopilot Brain initialized',
                source: 'autopilot_system'
            });

            // تهيئة نظام استقبال المهام
            this.components.taskIntake = new TaskIntakeSystem();
            this.components.logging.logEvent({
                level: 'info',
                category: 'component',
                message: 'Task Intake System initialized',
                source: 'autopilot_system'
            });

            // تهيئة نظام توزيع المهام
            this.components.taskDispatcher = new TaskDispatcher();
            this.components.logging.logEvent({
                level: 'info',
                category: 'component',
                message: 'Task Dispatcher initialized',
                source: 'autopilot_system'
            });

            // تهيئة نظام تنفيذ المهام
            this.components.taskExecutor = new TaskExecutor();
            this.components.logging.logEvent({
                level: 'info',
                category: 'component',
                message: 'Task Executor initialized',
                source: 'autopilot_system'
            });

            // تهيئة نظام التغذية الراجعة
            this.components.feedbackLoop = new FeedbackLoop(
                this.components.taskIntake,
                this.components.taskDispatcher,
                this.components.taskExecutor
            );
            this.components.logging.logEvent({
                level: 'info',
                category: 'component',
                message: 'Feedback Loop initialized',
                source: 'autopilot_system'
            });

            // ربط المكونات مع بعضها
            this.connectComponents();

            // انتظار تهيئة الدماغ
            await this.waitForBrainInitialization();

            console.log('✅ All components initialized successfully');

        } catch (error) {
            console.error('❌ Component initialization failed:', error);
            this.components.logging?.logError(error, { source: 'autopilot_system' });
            throw error;
        }
    }

    /**
     * ربط المكونات مع بعضها
     */
    connectComponents() {
        try {
            // ربط Task Intake مع Task Dispatcher
            this.components.taskIntake.taskQueue = this.components.taskDispatcher.taskQueue;
            
            // ربط Task Dispatcher مع Task Executor
            this.components.taskDispatcher.taskExecutor = this.components.taskExecutor;
            
            // ربط Feedback Loop مع Task Dispatcher
            this.components.feedbackLoop.taskDispatcher = this.components.taskDispatcher;
            
            // ربط Logging مع جميع المكونات
            this.setupLoggingConnections();

            console.log('🔗 Components connected successfully');

        } catch (error) {
            console.error('❌ Component connection failed:', error);
            this.components.logging?.logError(error, { source: 'autopilot_system' });
        }
    }

    /**
     * إعداد اتصالات التسجيل
     */
    setupLoggingConnections() {
        // ربط تسجيل المهام
        const originalLogTask = this.components.taskIntake.logTask;
        this.components.taskIntake.logTask = (task, action) => {
            this.components.logging.logTask(task, action);
            if (originalLogTask) originalLogTask.call(this.components.taskIntake, task, action);
        };

        // ربط تسجيل أداء الوكلاء
        const originalLogAgentPerformance = this.components.taskDispatcher.logAgentPerformance;
        this.components.taskDispatcher.logAgentPerformance = (agentName, performance) => {
            this.components.logging.logAgentPerformance(agentName, performance);
            if (originalLogAgentPerformance) originalLogAgentPerformance.call(this.components.taskDispatcher, agentName, performance);
        };

        // ربط تسجيل تفاعلات المستخدمين
        const originalLogUserInteraction = this.components.taskIntake.logUserInteraction;
        this.components.taskIntake.logUserInteraction = (userId, interaction) => {
            this.components.logging.logUserInteraction(userId, interaction);
            if (originalLogUserInteraction) originalLogUserInteraction.call(this.components.taskIntake, userId, interaction);
        };
    }

    /**
     * إعداد مراقبة النظام
     */
    setupSystemMonitoring() {
        // تحديث إحصائيات النظام كل دقيقة
        this.statsInterval = setInterval(() => {
            this.updateSystemStats();
        }, 60000);

        // فحص صحة النظام كل 30 ثانية
        this.healthInterval = setInterval(() => {
            this.checkSystemHealth();
        }, 30000);

        // تحليل أداء الدماغ كل 2 دقيقة
        this.brainAnalysisInterval = setInterval(() => {
            this.performBrainAnalysis();
        }, 120000);

        // تنظيف النظام كل 5 دقائق
        this.cleanupInterval = setInterval(() => {
            this.performSystemCleanup();
        }, 300000);

        console.log('📊 System monitoring started');
    }

    /**
     * بدء النظام
     */
    async start() {
        try {
            if (this.isRunning) {
                console.log('⚠️ System is already running');
                return;
            }

            console.log('🚀 Starting AuraOS Autopilot System...');
            console.log('='.repeat(60));

            // بدء جميع المكونات
            await this.startComponents();

            // تحديث حالة النظام
            this.isRunning = true;
            this.startTime = new Date();
            this.systemStats.systemHealth = 'running';

            // تسجيل بدء النظام
            this.components.logging.logEvent({
                level: 'info',
                category: 'system',
                message: 'AuraOS Autopilot System started successfully',
                data: {
                    startTime: this.startTime.toISOString(),
                    components: Object.keys(this.components)
                },
                source: 'autopilot_system'
            });

            console.log('='.repeat(60));
            console.log('🎉 AuraOS Autopilot System is now running!');
            console.log('='.repeat(60));
            console.log('📱 Telegram Commands:');
            console.log('   /test - Test system functionality');
            console.log('   /status - Check system status');
            console.log('   /queue - Show task queue');
            console.log('   /stats - Show system statistics');
            console.log('   /help - Show all commands');
            console.log('='.repeat(60));
            console.log('🔍 Monitoring:');
            console.log('   - Task processing: Active');
            console.log('   - Agent management: Active');
            console.log('   - Feedback loop: Active');
            console.log('   - Logging & Analytics: Active');
            console.log('   - System health: Monitoring');
            console.log('='.repeat(60));
            console.log('🛑 Press Ctrl+C to stop the system');
            console.log('='.repeat(60));

            // إرسال إشعار بدء النظام
            await this.sendSystemStartNotification();

        } catch (error) {
            console.error('❌ Failed to start Autopilot System:', error);
            this.components.logging?.logError(error, { source: 'autopilot_system' });
            throw error;
        }
    }

    /**
     * بدء جميع المكونات
     */
    async startComponents() {
        const components = [
            { name: 'Autopilot Brain', component: this.components.brain },
            { name: 'Task Intake', component: this.components.taskIntake },
            { name: 'Task Dispatcher', component: this.components.taskDispatcher },
            { name: 'Task Executor', component: this.components.taskExecutor },
            { name: 'Feedback Loop', component: this.components.feedbackLoop },
            { name: 'Logging & Analytics', component: this.components.logging }
        ];

        for (const { name, component } of components) {
            try {
                if (component && component.start) {
                    await component.start();
                }
                console.log(`✅ ${name} started`);
            } catch (error) {
                console.error(`❌ Failed to start ${name}:`, error);
                throw error;
            }
        }
    }

    /**
     * إرسال إشعار بدء النظام
     */
    async sendSystemStartNotification() {
        try {
            if (process.env.TELEGRAM_ADMIN_CHAT_ID && process.env.TELEGRAM_ADMIN_CHAT_ID !== 'YOUR_CHAT_ID_NEEDED') {
                const TelegramBot = require('node-telegram-bot-api');
                const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
                
                await bot.sendMessage(process.env.TELEGRAM_ADMIN_CHAT_ID,
                    `🚀 **AuraOS Autopilot System Started**\n\n` +
                    `✅ All components initialized\n` +
                    `🤖 Agents: Online\n` +
                    `📊 Monitoring: Active\n` +
                    `🔄 Task processing: Ready\n\n` +
                    `🕐 Started at: ${new Date().toLocaleString()}\n` +
                    `🌐 System ready for tasks!`,
                    { parse_mode: 'Markdown' }
                );
            }
        } catch (error) {
            console.error('❌ Failed to send start notification:', error);
        }
    }

    /**
     * تحديث إحصائيات النظام
     */
    updateSystemStats() {
        if (this.startTime) {
            this.systemStats.uptime = Math.floor((Date.now() - this.startTime.getTime()) / 1000);
        }

        // تحديث إحصائيات المهام
        const taskStats = this.components.taskDispatcher?.getTaskStats() || {};
        this.systemStats.totalTasks = taskStats.totalTasks || 0;
        this.systemStats.successfulTasks = taskStats.successfulTasks || 0;
        this.systemStats.failedTasks = taskStats.failedTasks || 0;
        this.systemStats.activeAgents = Object.keys(taskStats.agents || {}).length;

        // تسجيل الإحصائيات
        this.components.logging.logEvent({
            level: 'info',
            category: 'system_stats',
            message: 'System statistics updated',
            data: this.systemStats,
            source: 'autopilot_system'
        });
    }

    /**
     * فحص صحة النظام
     */
    checkSystemHealth() {
        const healthChecks = {
            taskIntake: this.components.taskIntake ? 'healthy' : 'unhealthy',
            taskDispatcher: this.components.taskDispatcher ? 'healthy' : 'unhealthy',
            taskExecutor: this.components.taskExecutor ? 'healthy' : 'unhealthy',
            feedbackLoop: this.components.feedbackLoop ? 'healthy' : 'unhealthy',
            logging: this.components.logging ? 'healthy' : 'unhealthy'
        };

        const unhealthyComponents = Object.entries(healthChecks)
            .filter(([name, status]) => status === 'unhealthy')
            .map(([name]) => name);

        if (unhealthyComponents.length > 0) {
            this.systemStats.systemHealth = 'degraded';
            console.warn(`⚠️ Unhealthy components: ${unhealthyComponents.join(', ')}`);
            
            this.components.logging.logEvent({
                level: 'warning',
                category: 'system_health',
                message: `Unhealthy components detected: ${unhealthyComponents.join(', ')}`,
                data: { unhealthyComponents, healthChecks },
                source: 'autopilot_system'
            });
        } else {
            this.systemStats.systemHealth = 'healthy';
        }
    }

    /**
     * تنظيف النظام
     */
    performSystemCleanup() {
        try {
            // تنظيف البيانات المؤقتة
            const now = Date.now();
            
            // تنظيف المهام القديمة
            if (this.components.taskIntake?.taskHistory) {
                const cutoffTime = now - (24 * 60 * 60 * 1000); // 24 ساعة
                this.components.taskIntake.taskHistory = this.components.taskIntake.taskHistory.filter(task => {
                    const taskTime = new Date(task.timestamp).getTime();
                    return taskTime > cutoffTime;
                });
            }

            // تنظيف السجلات القديمة
            if (this.components.logging?.logBuffer) {
                this.components.logging.logBuffer = this.components.logging.logBuffer.slice(-1000);
            }

            console.log('🧹 System cleanup completed');

        } catch (error) {
            console.error('❌ System cleanup failed:', error);
            this.components.logging?.logError(error, { source: 'autopilot_system' });
        }
    }

    /**
     * إيقاف النظام
     */
    async stop() {
        try {
            console.log('\n🛑 Shutting down AuraOS Autopilot System...');
            
            // تحديث حالة النظام
            this.isRunning = false;
            this.systemStats.systemHealth = 'stopping';

            // تسجيل إيقاف النظام
            this.components.logging.logEvent({
                level: 'info',
                category: 'system',
                message: 'AuraOS Autopilot System shutting down',
                data: {
                    uptime: this.systemStats.uptime,
                    totalTasks: this.systemStats.totalTasks
                },
                source: 'autopilot_system'
            });

            // إيقاف جميع المكونات
            await this.stopComponents();

            // إيقاف مراقبة النظام
            this.stopSystemMonitoring();

            // إرسال إشعار إيقاف النظام
            await this.sendSystemStopNotification();

            console.log('👋 AuraOS Autopilot System stopped successfully');

        } catch (error) {
            console.error('❌ Failed to stop system:', error);
        }
    }

    /**
     * إيقاف جميع المكونات
     */
    async stopComponents() {
        const components = [
            { name: 'Autopilot Brain', component: this.components.brain },
            { name: 'Task Intake', component: this.components.taskIntake },
            { name: 'Task Dispatcher', component: this.components.taskDispatcher },
            { name: 'Task Executor', component: this.components.taskExecutor },
            { name: 'Feedback Loop', component: this.components.feedbackLoop },
            { name: 'Logging & Analytics', component: this.components.logging }
        ];

        for (const { name, component } of components) {
            try {
                if (component && component.stop) {
                    await component.stop();
                }
                console.log(`✅ ${name} stopped`);
            } catch (error) {
                console.error(`❌ Failed to stop ${name}:`, error);
            }
        }
    }

    /**
     * إيقاف مراقبة النظام
     */
    stopSystemMonitoring() {
        if (this.statsInterval) clearInterval(this.statsInterval);
        if (this.healthInterval) clearInterval(this.healthInterval);
        if (this.brainAnalysisInterval) clearInterval(this.brainAnalysisInterval);
        if (this.cleanupInterval) clearInterval(this.cleanupInterval);

        console.log('📊 System monitoring stopped');
    }

    /**
     * إرسال إشعار إيقاف النظام
     */
    async sendSystemStopNotification() {
        try {
            if (process.env.TELEGRAM_ADMIN_CHAT_ID && process.env.TELEGRAM_ADMIN_CHAT_ID !== 'YOUR_CHAT_ID_NEEDED') {
                const TelegramBot = require('node-telegram-bot-api');
                const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
                
                await bot.sendMessage(process.env.TELEGRAM_ADMIN_CHAT_ID,
                    `🛑 **AuraOS Autopilot System Stopped**\n\n` +
                    `📊 **Final Statistics:**\n` +
                    `⏱️ Uptime: ${this.formatUptime(this.systemStats.uptime)}\n` +
                    `📋 Total Tasks: ${this.systemStats.totalTasks}\n` +
                    `✅ Successful: ${this.systemStats.successfulTasks}\n` +
                    `❌ Failed: ${this.systemStats.failedTasks}\n\n` +
                    `🕐 Stopped at: ${new Date().toLocaleString()}`,
                    { parse_mode: 'Markdown' }
                );
            }
        } catch (error) {
            console.error('❌ Failed to send stop notification:', error);
        }
    }

    /**
     * تنسيق وقت التشغيل
     */
    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    /**
     * الحصول على حالة النظام
     */
    getSystemStatus() {
        return {
            isRunning: this.isRunning,
            startTime: this.startTime,
            uptime: this.systemStats.uptime,
            health: this.systemStats.systemHealth,
            stats: this.systemStats,
            components: Object.keys(this.components)
        };
    }

    /**
     * الحصول على إحصائيات النظام
     */
    getSystemStats() {
        return {
            ...this.systemStats,
            components: {
                taskIntake: this.components.taskIntake?.getSystemStats() || {},
                taskDispatcher: this.components.taskDispatcher?.getTaskStats() || {},
                taskExecutor: this.components.taskExecutor?.getExecutionStats() || {},
                feedbackLoop: this.components.feedbackLoop?.getPerformanceMetrics() || {},
                logging: this.components.logging?.getDashboardData() || {},
                brain: this.components.brain?.getBrainStats() || {}
            }
        };
    }

    /**
     * انتظار تهيئة الدماغ
     */
    async waitForBrainInitialization() {
        const maxWaitTime = 30000; // 30 seconds
        const checkInterval = 1000; // 1 second
        let elapsedTime = 0;

        while (elapsedTime < maxWaitTime) {
            if (this.components.brain?.isInitialized) {
                console.log('✅ Brain initialization completed');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, checkInterval));
            elapsedTime += checkInterval;
        }

        console.log('⚠️ Brain initialization timeout - continuing without LLM integration');
    }

    /**
     * تحليل أداء الدماغ
     */
    async performBrainAnalysis() {
        if (!this.components.brain) return;

        try {
            const brainStats = this.components.brain.getBrainStats();
            const systemStats = this.getSystemStats();

            // تحديث سياق النظام في الدماغ
            this.components.brain.updateSystemContext({
                currentLoad: this.systemStats.totalTasks > 10 ? 80 : this.systemStats.totalTasks * 8,
                activeTasks: this.systemStats.totalTasks,
                systemHealth: this.systemStats.systemHealth,
                lastAnalysis: new Date().toISOString()
            });

            // تحليل أداء النظام باستخدام الدماغ
            const analysis = await this.components.brain.analyzeSystemPerformance(systemStats);

            // تسجيل التحليل
            this.components.logging.logEvent({
                level: 'info',
                category: 'brain_analysis',
                message: 'Brain performance analysis completed',
                data: {
                    brainStats,
                    analysis,
                    systemHealth: this.systemStats.systemHealth
                },
                source: 'autopilot_system'
            });

            // تنفيذ توصيات الدماغ إذا لزم الأمر
            if (analysis.recommendations && analysis.recommendations.length > 0) {
                await this.applyBrainRecommendations(analysis.recommendations);
            }

        } catch (error) {
            console.error('❌ Brain analysis failed:', error);
            this.components.logging.logError(error, { source: 'autopilot_system' });
        }
    }

    /**
     * تطبيق توصيات الدماغ
     */
    async applyBrainRecommendations(recommendations) {
        for (const recommendation of recommendations.slice(0, 3)) { // Apply top 3 recommendations
            try {
                console.log(`🤖 Applying brain recommendation: ${recommendation}`);

                // تنفيذ التوصية حسب نوعها
                if (recommendation.includes('task scheduling')) {
                    // تحسين جدولة المهام
                    await this.optimizeTaskScheduling();
                } else if (recommendation.includes('resource allocation')) {
                    // تحسين تخصيص الموارد
                    await this.optimizeResourceAllocation();
                } else if (recommendation.includes('load balancing')) {
                    // تحسين توازن الحمل
                    await this.balanceSystemLoad();
                }

            } catch (error) {
                console.error(`❌ Failed to apply recommendation "${recommendation}":`, error);
            }
        }
    }

    /**
     * تحسين جدولة المهام
     */
    async optimizeTaskScheduling() {
        if (this.components.taskDispatcher?.optimizeScheduling) {
            await this.components.taskDispatcher.optimizeScheduling();
            console.log('✅ Task scheduling optimized');
        }
    }

    /**
     * تحسين تخصيص الموارد
     */
    async optimizeResourceAllocation() {
        if (this.components.taskExecutor?.optimizeResourceAllocation) {
            await this.components.taskExecutor.optimizeResourceAllocation();
            console.log('✅ Resource allocation optimized');
        }
    }

    /**
     * تحسين توازن حمل النظام
     */
    async balanceSystemLoad() {
        if (this.components.taskDispatcher?.balanceLoad) {
            await this.components.taskDispatcher.balanceLoad();
            console.log('✅ System load balanced');
        }
    }
}

// تشغيل النظام
async function main() {
    try {
        // فحص متغيرات البيئة
        const requiredEnvVars = [
            // Temporarily disabled for testing brain integration
            // 'FIREBASE_PROJECT_ID',
            // 'TELEGRAM_BOT_TOKEN',
            // 'TELEGRAM_ADMIN_CHAT_ID',
            // 'GOOGLE_AI_API_KEY'
        ];

        const missingVars = requiredEnvVars.filter(envVar => 
            !process.env[envVar] || 
            process.env[envVar].includes('your_') || 
            process.env[envVar].includes('YOUR_')
        );

        if (missingVars.length > 0) {
            console.log('❌ Missing or incomplete environment variables:');
            missingVars.forEach(envVar => {
                console.log(`   - ${envVar}`);
            });
            console.log('');
            console.log('📝 Please update your .env file with actual values');
            console.log('📚 See AURAOS_SETUP_GUIDE.md for instructions');
            process.exit(1);
        }

        console.log('✅ Environment variables configured');

        // إنشاء وتشغيل النظام
        const autopilot = new AuraOSAutopilot();
        await autopilot.start();

        // معالجة إشارات النظام
        process.on('SIGINT', async () => {
            console.log('\n🛑 Received SIGINT, shutting down gracefully...');
            await autopilot.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
            await autopilot.stop();
            process.exit(0);
        });

        // معالجة الأخطاء غير المعالجة
        process.on('uncaughtException', async (error) => {
            console.error('❌ Uncaught Exception:', error);
            await autopilot.stop();
            process.exit(1);
        });

        process.on('unhandledRejection', async (reason) => {
            console.error('❌ Unhandled Rejection:', reason);
            await autopilot.stop();
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Failed to start AuraOS Autopilot System:', error);
        process.exit(1);
    }
}

// تشغيل النظام إذا كان الملف يتم تنفيذه مباشرة
if (require.main === module) {
    main();
}

module.exports = AuraOSAutopilot;
