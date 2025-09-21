
#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

console.log('🤖 Testing Telegram Bot with Chat ID...');

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('❌ TELEGRAM_BOT_TOKEN not found');
    process.exit(1);
}

if (!process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID === 'YOUR_CHAT_ID_NEEDED') {
    console.log('❌ TELEGRAM_ADMIN_CHAT_ID not set');
    console.log('📝 Please update TELEGRAM_ADMIN_CHAT_ID in .env file');
    process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

bot.sendMessage(process.env.TELEGRAM_ADMIN_CHAT_ID, 
    '🎉 AuraOS AI System - Telegram Bot Connected!\n\n' +
    '✅ Bot token: Valid\n' +
    '✅ Chat ID: Valid\n' +
    '✅ Connection: Successful\n\n' +
    'Available commands:\n' +
    '/test - Test bot\n' +
    '/status - System status\n' +
    '/help - Show help'
).then(() => {
    console.log('✅ Message sent successfully!');
    console.log('📱 Check your Telegram for the test message');
}).catch((error) => {
    console.log('❌ Failed to send message:', error.message);
});
