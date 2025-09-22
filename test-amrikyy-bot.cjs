#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

console.log('🤖 Testing Amrikyy Telegram Bot...');
console.log('='.repeat(50));

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('❌ TELEGRAM_BOT_TOKEN not found');
    process.exit(1);
}

if (!process.env.TELEGRAM_ADMIN_CHAT_ID) {
    console.log('❌ TELEGRAM_ADMIN_CHAT_ID not set');
    process.exit(1);
}

console.log('✅ Bot Token: Found');
console.log('✅ Chat ID: Found');
console.log('='.repeat(50));

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

const testMessage = `🎉 **AuraOS AI System - Amrikyy Bot Connected!**

✅ **Bot Status**: Active
✅ **Token**: Valid  
✅ **Chat ID**: Valid
✅ **Connection**: Successful

🤖 **Available Commands:**
/start - Start interaction
/help - Show help menu
/menu - Smart menu
/status - System status
/posts - Recent posts
/agents - Agent templates
/ai - AI commands
/translate - Translation
/analyze - Analysis
/generate - Content generation
/schedule - Task scheduling
/broadcast - Broadcast messages

🚀 **AuraOS Features:**
• Advanced AI Integration
• Smart Automation
• Real-time Updates
• Dashboard Integration
• MCP Tools Support

_Last updated: ${new Date().toLocaleString()}_`;

bot.sendMessage(process.env.TELEGRAM_ADMIN_CHAT_ID, testMessage, { parse_mode: 'Markdown' })
.then(() => {
    console.log('✅ Test message sent successfully!');
    console.log('📱 Check your Telegram for the test message');
    console.log('='.repeat(50));
    console.log('🎯 Next steps:');
    console.log('1. Check your Telegram app');
    console.log('2. Send /start to your bot');
    console.log('3. Test other commands like /help, /status');
    console.log('4. Integrate with AuraOS dashboard');
    console.log('='.repeat(50));
})
.catch((error) => {
    console.log('❌ Failed to send message:', error.message);
    console.log('🔍 Error details:', error);
});
