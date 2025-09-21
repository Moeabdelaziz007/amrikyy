#!/usr/bin/env node

require('dotenv').config();

// Import all Autopilot components
const TaskIntakeSystem = require('./task_intake.cjs');
const TaskDispatcher = require('./task_dispatcher.cjs');
const TaskExecutor = require('./task_executor.cjs');
const FeedbackLoop = require('./feedback_loop.cjs');
const LoggingAnalytics = require('./logging_analytics.cjs');

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
    initializeComponents() {
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
            { name: 'Task Intake', component: this.components.taskIntake },
            { name: 'Task Dispatcher', component: this.components.taskDispatcher },
            { name: 'Task Executor', component: this.components.taskExecutor },
            { name: 'Feedback Loop', component: this.components.feedbackLoop },
            { name: 'Logging & Analytics', component: this.components.logging }
        ];

        for (const { name, component } of components) {
            try {
                if (component.start) {
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
            { name: 'Task Intake', component: this.components.taskIntake },
            { name: 'Task Dispatcher', component: this.components.taskDispatcher },
            { name: 'Task Executor', component: this.components.taskExecutor },
            { name: 'Feedback Loop', component: this.components.feedbackLoop },
            { name: 'Logging & Analytics', component: this.components.logging }
        ];

        for (const { name, component } of components) {
            try {
                if (component.stop) {
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
                logging: this.components.logging?.getDashboardData() || {}
            }
        };
    }
}

// تشغيل النظام
async function main() {
    try {
        // فحص متغيرات البيئة
        const requiredEnvVars = [
            'FIREBASE_PROJECT_ID',
            'TELEGRAM_BOT_TOKEN',
            'TELEGRAM_ADMIN_CHAT_ID',
            'GOOGLE_AI_API_KEY'
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
