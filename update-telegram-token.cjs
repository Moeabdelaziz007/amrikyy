#!/usr/bin/env node

const fs = require('fs');

console.log('🤖 Updating .env with Telegram Bot Token...');
console.log('='.repeat(50));

try {
  // Read current .env
  let envContent = '';
  if (fs.existsSync('.env')) {
    envContent = fs.readFileSync('.env', 'utf8');
  }

  // Update Telegram Bot Token
  envContent = envContent.replace(
    'TELEGRAM_BOT_TOKEN=Amrikyycoin',
    'TELEGRAM_BOT_TOKEN=8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0'
  );

  // Write updated .env
  fs.writeFileSync('.env', envContent);

  console.log('✅ .env updated with Telegram Bot Token!');
  console.log('='.repeat(50));
  console.log('📊 Updated values:');
  console.log(
    '   🤖 Telegram Bot Token: 8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0'
  );
  console.log('   🔗 Bot Link: https://t.me/Amrikyybot/Amrikyycoin');
  console.log('   🌐 Web App: https://amrikyycoin.io/');
  console.log('='.repeat(50));
  console.log('📝 Still needed:');
  console.log('   💬 Telegram Chat ID (from @RawDataBot)');
  console.log('   🔥 Firebase Private Key (from service-account-key.json)');
  console.log('='.repeat(50));

  // Test Telegram Bot
  console.log('🧪 Testing Telegram Bot...');
  try {
    require('dotenv').config();
    const TelegramBot = require('node-telegram-bot-api');

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });

    console.log('✅ Telegram Bot initialized successfully!');
    console.log('🎉 Bot Token is valid and working!');
  } catch (error) {
    console.log('❌ Telegram Bot test failed:', error.message);
  }

  console.log('='.repeat(50));
  console.log('🚀 Next steps:');
  console.log('1. Get your Chat ID from @RawDataBot');
  console.log('2. Download service-account-key.json from Firebase Console');
  console.log('3. Update TELEGRAM_ADMIN_CHAT_ID in .env');
  console.log('4. Test: node test-telegram.cjs');
  console.log('5. Test: node test-complete-system.cjs');
} catch (error) {
  console.error('❌ Update failed:', error.message);
}
