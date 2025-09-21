#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🤖 Telegram Bot Token Setup');
console.log('='.repeat(40));

async function updateTelegramToken() {
    try {
        // Read current .env file
        let envContent = '';
        if (fs.existsSync('.env')) {
            envContent = fs.readFileSync('.env', 'utf8');
        } else {
            console.log('❌ .env file not found');
            return;
        }

        // Get Telegram Bot Token
        const token = await new Promise((resolve) => {
            rl.question('📝 Enter your Telegram Bot Token (from @BotFather): ', resolve);
        });

        // Get Chat ID
        const chatId = await new Promise((resolve) => {
            rl.question('📝 Enter your Chat ID (from @RawDataBot): ', resolve);
        });

        // Validate token format
        if (!token.includes(':') || token.length < 20) {
            console.log('❌ Invalid token format. Token should be like: 1234567890:ABCdef...');
            rl.close();
            return;
        }

        // Update .env content
        envContent = envContent.replace(
            'TELEGRAM_BOT_TOKEN=your_bot_token_here',
            `TELEGRAM_BOT_TOKEN=${token}`
        );
        
        envContent = envContent.replace(
            'TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here',
            `TELEGRAM_ADMIN_CHAT_ID=${chatId}`
        );

        // Write updated .env
        fs.writeFileSync('.env', envContent);

        console.log('✅ Telegram configuration updated!');
        console.log('='.repeat(40));
        console.log('🧪 Testing Telegram bot...');

        // Test the configuration
        try {
            require('dotenv').config();
            const TelegramBot = require('node-telegram-bot-api');
            
            const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
            
            // Test sending a message
            await bot.sendMessage(process.env.TELEGRAM_ADMIN_CHAT_ID, 
                '🎉 AuraOS AI System - Telegram Bot Connected!\n\n' +
                '✅ Bot token: Valid\n' +
                '✅ Chat ID: Valid\n' +
                '✅ Connection: Successful\n\n' +
                'Available commands:\n' +
                '/test - Test bot\n' +
                '/status - System status\n' +
                '/help - Show help'
            );
            
            console.log('✅ Telegram bot test successful!');
            console.log('📱 Check your Telegram for the test message');
            
        } catch (error) {
            console.log('❌ Telegram bot test failed:', error.message);
            console.log('📝 Please check your token and chat ID');
        }

        console.log('='.repeat(40));
        console.log('🚀 Next steps:');
        console.log('1. node test-telegram.cjs - Test Telegram integration');
        console.log('2. node test-complete-system.cjs - Test full system');
        console.log('3. node run.cjs - Start AuraOS AI System');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

updateTelegramToken();
