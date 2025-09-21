#!/usr/bin/env node

require('dotenv').config();
const SelfDebuggingEngine = require('./self-debugging-engine.cjs');

console.log('🚀 Starting AuraOS AI System...');
console.log('='.repeat(60));

// Check environment variables
const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'TELEGRAM_BOT_TOKEN', 
    'TELEGRAM_ADMIN_CHAT_ID',
    'GOOGLE_AI_API_KEY'
];

let missingVars = [];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar] || process.env[envVar].includes('your_') || process.env[envVar].includes('YOUR_')) {
        missingVars.push(envVar);
    }
});

if (missingVars.length > 0) {
    console.log('❌ Missing or incomplete environment variables:');
    missingVars.forEach(envVar => {
        console.log(`   - ${envVar}`);
    });
    console.log('');
    console.log('📝 Please update your .env file with actual values');
    console.log('📚 See env-config.txt for the template');
    console.log('='.repeat(60));
    process.exit(1);
}

console.log('✅ Environment variables configured');
console.log('='.repeat(60));

// Initialize the system
try {
    console.log('🔧 Initializing Self-Debugging Engine...');
    const engine = new SelfDebuggingEngine();
    
    console.log('🤖 Initializing Telegram Bot...');
    // Bot is initialized in the engine
    
    console.log('🧠 Initializing Gemini AI...');
    // AI is initialized in the engine
    
    console.log('🔥 Connecting to Firebase...');
    // Firebase is initialized in the engine
    
    console.log('='.repeat(60));
    console.log('🎉 AuraOS AI System is now running!');
    console.log('='.repeat(60));
    console.log('📱 Telegram Commands:');
    console.log('   /test - Test bot functionality');
    console.log('   /status - Check system status');
    console.log('   /help - Show all commands');
    console.log('   /build [type] - Trigger build process');
    console.log('='.repeat(60));
    console.log('🔍 Monitoring:');
    console.log('   - Error detection: Active');
    console.log('   - Auto-fix: Enabled');
    console.log('   - Health checks: Every 5 minutes');
    console.log('   - Telegram notifications: Active');
    console.log('='.repeat(60));
    console.log('🛑 Press Ctrl+C to stop the system');
    console.log('='.repeat(60));
    
    // Keep the process running
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down AuraOS AI System...');
        console.log('👋 Goodbye!');
        process.exit(0);
    });
    
    // Keep alive
    setInterval(() => {
        // Heartbeat - system is alive
    }, 30000);
    
} catch (error) {
    console.error('❌ Failed to start AuraOS AI System:', error.message);
    console.log('');
    console.log('📝 Troubleshooting:');
    console.log('   1. Check your .env file configuration');
    console.log('   2. Verify API keys are correct');
    console.log('   3. Ensure internet connection');
    console.log('   4. Check Firebase project setup');
    console.log('   5. Verify Telegram bot token');
    process.exit(1);
}
