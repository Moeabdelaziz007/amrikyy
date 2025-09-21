require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { systemStatusRef, errorLogsRef } = require('./firebase-admin-setup.cjs');

class AuraOSBot {
    constructor() {
        if (!process.env.TELEGRAM_BOT_TOKEN) {
            throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
        }

        this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
            polling: true 
        });
        
        this.adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
        
        this.setupCommands();
        this.setupErrorHandling();
        
        console.log('🤖 AuraOS Bot initialized');
    }

    setupCommands() {
        // أمر الحصول على Chat ID
        this.bot.onText(/\/get_chat_id/, async (msg) => {
            const chatId = msg.chat.id;
            await this.bot.sendMessage(chatId, 
                `Your Chat ID: \`${chatId}\`\n\nAdd this to your .env file as TELEGRAM_ADMIN_CHAT_ID`, 
                { parse_mode: 'Markdown' }
            );
        });

        // أمر حالة النظام
        this.bot.onText(/\/status/, async (msg) => {
            const chatId = msg.chat.id;
            try {
                const status = await systemStatusRef().get();
                const statusData = status.data();
                
                const message = `
🖥️ **AuraOS System Status**

🔧 **Overall Health**: ${statusData?.status || 'Unknown'}
🔄 **Last Update**: ${statusData?.timestamp || 'Never'}
❌ **Recent Errors**: ${statusData?.recentErrors || 0}

💾 **Memory Usage**: ${statusData?.memoryUsage || 'N/A'}
⚡ **CPU Usage**: ${statusData?.cpuUsage || 'N/A'}
🌐 **Network Status**: ${statusData?.networkStatus || 'Unknown'}
                `;
                
                await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            } catch (error) {
                await this.bot.sendMessage(chatId, `❌ Error getting status: ${error.message}`);
            }
        });

        // أمر اختبار البوت
        this.bot.onText(/\/test/, async (msg) => {
            const chatId = msg.chat.id;
            await this.bot.sendMessage(chatId, 
                `✅ AuraOS Bot is working!\n\nChat ID: \`${chatId}\`\nBot Status: Active\nTime: ${new Date().toLocaleString()}`, 
                { parse_mode: 'Markdown' }
            );
        });

        // أمر المساعدة
        this.bot.onText(/\/help/, async (msg) => {
            const chatId = msg.chat.id;
            const helpMessage = `
🤖 **AuraOS Bot Commands**

/status - عرض حالة النظام
/test - اختبار البوت
/get_chat_id - الحصول على Chat ID
/help - عرض هذه المساعدة

🔧 **Admin Commands**
/build [type] - تشغيل بناء
/debug [issue] - تحليل مشكلة
/ai [message] - محادثة مع الذكاء الاصطناعي
            `;
            
            await this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
        });

        // أمر البناء
        this.bot.onText(/\/build (.+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const buildType = match[1];
            
            try {
                await this.bot.sendMessage(chatId, `🚀 Triggering ${buildType} build...`);
                
                // محاكاة البناء
                const result = await this.simulateBuild(buildType);
                
                await this.bot.sendMessage(chatId, 
                    `✅ Build completed!\nBuild ID: ${result.buildId}\nStatus: ${result.status}\nDuration: ${result.duration}ms`
                );
            } catch (error) {
                await this.bot.sendMessage(chatId, `❌ Build failed: ${error.message}`);
            }
        });
    }

    setupErrorHandling() {
        // مراقبة الأخطاء
        process.on('uncaughtException', async (error) => {
            await this.sendErrorToTelegram(error, 'uncaughtException');
        });

        process.on('unhandledRejection', async (reason) => {
            await this.sendErrorToTelegram(reason, 'unhandledRejection');
        });
    }

    async sendErrorToTelegram(error, type = 'error') {
        const errorMessage = `
🚨 **AuraOS Error Alert**

**Type**: ${type}
**Time**: ${new Date().toISOString()}
**Error**: ${error.message || error}
**Stack**: \`\`\`${error.stack || 'No stack trace'}\`\`\`

**Action Required**: Manual intervention needed
        `;

        try {
            // إرسال إلى Chat الإداري
            if (this.adminChatId) {
                await this.bot.sendMessage(this.adminChatId, errorMessage, { 
                    parse_mode: 'Markdown' 
                });
            }

            // تسجيل في Firestore
            if (errorLogsRef()) {
                await errorLogsRef().add({
                    type: type,
                    message: error.message || error,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                    resolved: false
                });
            }

            console.log('✅ Error sent to Telegram');
        } catch (error) {
            console.error('❌ Failed to send error to Telegram:', error);
        }
    }

    async sendNotification(message, type = 'info') {
        const emoji = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌',
            'build': '🚀',
            'debug': '🔍',
            'ai': '🤖'
        };
        
        try {
            if (this.adminChatId) {
                await this.bot.sendMessage(this.adminChatId, 
                    `${emoji[type]} ${message}`, 
                    { parse_mode: 'Markdown' }
                );
            }
        } catch (error) {
            console.error('❌ Failed to send notification:', error);
        }
    }

    async simulateBuild(buildType) {
        // محاكاة عملية البناء
        const startTime = Date.now();
        
        // محاكاة وقت البناء
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const duration = Date.now() - startTime;
        
        return {
            buildId: `build-${Date.now()}`,
            type: buildType,
            status: 'success',
            duration: duration,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = AuraOSBot;
