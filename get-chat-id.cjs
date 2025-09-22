#!/usr/bin/env node

const fs = require('fs');

console.log('💬 Getting Telegram Chat ID...');
console.log('='.repeat(50));

try {
  // Read current .env
  let envContent = '';
  if (fs.existsSync('.env')) {
    envContent = fs.readFileSync('.env', 'utf8');
  }

  console.log('📝 To get your Chat ID:');
  console.log('='.repeat(50));
  console.log('1. Open Telegram');
  console.log('2. Search for @RawDataBot');
  console.log('3. Send /start');
  console.log('4. You will receive a message with your Chat ID');
  console.log('5. Copy the Chat ID (it looks like: 123456789)');
  console.log('='.repeat(50));
  console.log('📝 Alternative method:');
  console.log('1. Open Telegram');
  console.log('2. Search for your bot: @Amrikyybot');
  console.log('3. Send /start to your bot');
  console.log('4. Send /get_chat_id to your bot');
  console.log('5. Your bot will reply with your Chat ID');
  console.log('='.repeat(50));
  console.log('🚀 After getting Chat ID:');
  console.log('1. Update TELEGRAM_ADMIN_CHAT_ID in .env file');
  console.log('2. Run: node test-telegram.cjs');
  console.log('3. Run: node test-complete-system.cjs');
  console.log('='.repeat(50));

  // Create a simple test script
  const testScript = `
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
    '🎉 AuraOS AI System - Telegram Bot Connected!\\n\\n' +
    '✅ Bot token: Valid\\n' +
    '✅ Chat ID: Valid\\n' +
    '✅ Connection: Successful\\n\\n' +
    'Available commands:\\n' +
    '/test - Test bot\\n' +
    '/status - System status\\n' +
    '/help - Show help'
).then(() => {
    console.log('✅ Message sent successfully!');
    console.log('📱 Check your Telegram for the test message');
}).catch((error) => {
    console.log('❌ Failed to send message:', error.message);
});
`;

  fs.writeFileSync('test-telegram-chat.cjs', testScript);

  console.log('📁 Created test-telegram-chat.cjs');
  console.log('📝 Run it after updating Chat ID: node test-telegram-chat.cjs');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
}
