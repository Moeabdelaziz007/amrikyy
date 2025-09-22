require('dotenv').config();
const AuraOSBot = require('./telegram-bot-setup.cjs');

async function runTest() {
  console.log('🧪 Testing Telegram Bot Setup...');

  try {
    const bot = new AuraOSBot();

    // انتظار 5 ثواني للتأكد من الاتصال
    setTimeout(async () => {
      await bot.sendNotification('🧪 Telegram Bot test successful!', 'success');

      console.log('✅ Telegram Bot setup completed successfully!');
      console.log('📝 Next steps:');
      console.log('1. Send /test to your bot in Telegram');
      console.log('2. Send /get_chat_id to get your Chat ID');
      console.log('3. Update TELEGRAM_ADMIN_CHAT_ID in .env');
      console.log('4. Run: node test-gemini.js');

      process.exit(0);
    }, 5000);
  } catch (error) {
    console.error('❌ Telegram Bot setup failed:', error.message);
    console.log('📝 Please check:');
    console.log('1. TELEGRAM_BOT_TOKEN is correct');
    console.log('2. Bot is created with @BotFather');
    console.log('3. Bot is started with /start');
    process.exit(1);
  }
}

runTest();
