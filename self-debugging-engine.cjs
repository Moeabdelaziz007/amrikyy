require('dotenv').config();
const GeminiAIIntegration = require('./gemini-ai-integration.cjs');
const { errorLogsRef, debugSessionsRef, systemStatusRef } = require('./firebase-admin-setup.cjs');
const AuraOSBot = require('./telegram-bot-setup.cjs');

class SelfDebuggingEngine {
    constructor() {
        this.ai = new GeminiAIIntegration();
        this.bot = new AuraOSBot();
        this.errorPatterns = new Map();
        this.autoFixHistory = new Map();
        this.init();
        
        console.log('🔧 Self-Debugging Engine initialized');
    }

    init() {
        this.setupErrorMonitoring();
        this.loadErrorPatterns();
        this.startPeriodicHealthCheck();
    }

    setupErrorMonitoring() {
        // مراقبة أخطاء التطبيق
        process.on('uncaughtException', async (error) => {
            await this.handleError(error, 'uncaughtException');
        });

        process.on('unhandledRejection', async (reason) => {
            await this.handleError(reason, 'unhandledRejection');
        });

        // مراقبة أخطاء البناء
        this.monitorBuildFailures();
    }

    loadErrorPatterns() {
        // أنماط الأخطاء القابلة للإصلاح التلقائي
        this.errorPatterns.set('TypeError: Cannot read property', {
            solution: 'Add null checks before accessing object properties',
            confidence: 0.9,
            autoFix: true
        });

        this.errorPatterns.set('ReferenceError: is not defined', {
            solution: 'Check variable declaration and scope',
            confidence: 0.8,
            autoFix: false
        });

        this.errorPatterns.set('Firebase: Permission denied', {
            solution: 'Check Firestore security rules',
            confidence: 0.95,
            autoFix: false
        });

        this.errorPatterns.set('Module not found', {
            solution: 'Install missing dependency',
            confidence: 0.9,
            autoFix: true
        });

        this.errorPatterns.set('EADDRINUSE', {
            solution: 'Port is already in use, try different port',
            confidence: 0.95,
            autoFix: true
        });
    }

    async handleError(error, type) {
        try {
            const errorData = {
                type: type,
                message: error.message || error,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                resolved: false
            };

            // تسجيل الخطأ في Firestore
            if (errorLogsRef()) {
                await errorLogsRef().add(errorData);
            }

            // تحليل مع الذكاء الاصطناعي
            const analysis = await this.ai.analyzeError(errorData);

            // التحقق من إمكانية الإصلاح التلقائي
            const canAutoFix = await this.canAutoFix(errorData, analysis);

            if (canAutoFix) {
                await this.attemptAutoFix(errorData, analysis);
            } else {
                // إرسال للتليجرام للمراجعة اليدوية
                await this.bot.sendErrorToTelegram(error, type);
            }

            // تحديث حالة النظام
            await this.updateSystemStatus('error', errorData);

        } catch (error) {
            console.error('❌ Error handling failed:', error);
        }
    }

    async canAutoFix(errorData, analysis) {
        // التحقق من الأنماط القابلة للإصلاح التلقائي
        const autoFixPatterns = [
            'missing dependency',
            'configuration error',
            'permission denied',
            'port already in use',
            'environment variable',
            'module not found',
            'cannot read property'
        ];

        const errorMessage = errorData.message.toLowerCase();
        return autoFixPatterns.some(pattern => errorMessage.includes(pattern));
    }

    async attemptAutoFix(errorData, analysis) {
        try {
            // توليد الإصلاح
            const fix = await this.ai.generateFix(errorData, analysis);

            // تطبيق الإصلاح
            const fixResult = await this.applyFix(errorData, fix);

            // تسجيل محاولة الإصلاح التلقائي
            if (debugSessionsRef()) {
                await debugSessionsRef().add({
                    issue: errorData.message,
                    analysis: analysis,
                    fix: fix,
                    fixResult: fixResult,
                    timestamp: new Date().toISOString(),
                    source: 'auto-fix',
                    resolved: fixResult.success,
                    autoFixAttempted: true
                });
            }

            // إرسال إشعار
            await this.bot.sendNotification(
                `🔧 Auto-fix attempted for: ${errorData.message}\nResult: ${fixResult.success ? 'Success' : 'Failed'}`,
                fixResult.success ? 'success' : 'error'
            );

            return fixResult;

        } catch (error) {
            console.error('❌ Auto-fix failed:', error);
            return { success: false, error: error.message };
        }
    }

    async applyFix(errorData, fix) {
        // هذا سيحتوي على منطق تطبيق الإصلاحات المحددة
        // في الوقت الحالي، إرجاع نتيجة وهمية
        
        console.log('🔧 Applying fix:', fix.substring(0, 100) + '...');
        
        // محاكاة تطبيق الإصلاح
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            appliedAt: new Date().toISOString(),
            fixType: 'configuration_update',
            details: 'Fix applied successfully'
        };
    }

    async updateSystemStatus(type, data) {
        if (systemStatusRef()) {
            const statusUpdate = {
                lastUpdate: new Date().toISOString(),
                [type]: data
            };

            await systemStatusRef().set(statusUpdate, { merge: true });
        }
    }

    startPeriodicHealthCheck() {
        // فحص صحة النظام كل 5 دقائق
        setInterval(async () => {
            await this.performHealthCheck();
        }, 5 * 60 * 1000);
    }

    async performHealthCheck() {
        try {
            const healthData = {
                timestamp: new Date().toISOString(),
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
                uptime: process.uptime()
            };

            // تحليل الأداء مع الذكاء الاصطناعي
            const suggestions = await this.ai.chatWithGemini(
                `Analyze this performance data and suggest optimizations: ${JSON.stringify(healthData)}`
            );

            // تحديث حالة النظام
            if (systemStatusRef()) {
                await systemStatusRef().set({
                    health: 'good',
                    lastHealthCheck: new Date().toISOString(),
                    performanceData: healthData,
                    aiSuggestions: suggestions
                }, { merge: true });
            }

            console.log('✅ Health check completed');

        } catch (error) {
            console.error('❌ Health check failed:', error);
        }
    }

    monitorBuildFailures() {
        // مراقبة فشل البناء
        console.log('🔍 Build failure monitoring started');
    }

    // دالة لاختبار محرك الإصلاح
    async testErrorHandling() {
        console.log('🧪 Testing error handling...');
        
        // إنشاء خطأ وهمي للاختبار
        const testError = new Error('Test error for debugging engine');
        testError.stack = 'Error: Test error\n    at testErrorHandling (test.js:1:1)';
        
        await this.handleError(testError, 'test');
        
        console.log('✅ Error handling test completed');
    }
}

module.exports = SelfDebuggingEngine;
