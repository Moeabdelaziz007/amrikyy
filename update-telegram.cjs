#!/usr/bin/env node

const fs = require('fs');

console.log('🤖 Updating .env with Telegram Bot...');
console.log('='.repeat(50));

try {
    // Read current .env
    let envContent = '';
    if (fs.existsSync('.env')) {
        envContent = fs.readFileSync('.env', 'utf8');
    }

    // Update Telegram Bot Token
    envContent = envContent.replace(
        'TELEGRAM_BOT_TOKEN=your_bot_token_here',
        'TELEGRAM_BOT_TOKEN=Amrikyycoin'
    );

    // Update Telegram Chat ID (we'll need to get this)
    envContent = envContent.replace(
        'TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here',
        'TELEGRAM_ADMIN_CHAT_ID=YOUR_CHAT_ID_NEEDED'
    );

    // Write updated .env
    fs.writeFileSync('.env', envContent);

    console.log('✅ .env updated with Telegram Bot!');
    console.log('='.repeat(50));
    console.log('📊 Updated values:');
    console.log('   🤖 Telegram Bot: Amrikyycoin');
    console.log('   🔗 Bot Link: https://t.me/Amrikyybot/Amrikyycoin');
    console.log('   🌐 Web App: https://amrikyycoin.io/');
    console.log('='.repeat(50));
    console.log('📝 Still needed:');
    console.log('   💬 Telegram Chat ID (from @RawDataBot)');
    console.log('   🔥 Firebase Private Key (from service-account-key.json)');
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
