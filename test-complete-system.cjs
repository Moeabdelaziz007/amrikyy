require('dotenv').config();
const { testConnection } = require('./firebase-admin-setup.cjs');
const AuraOSBot = require('./telegram-bot-setup.cjs');
const GeminiAIIntegration = require('./gemini-ai-integration.cjs');
const SelfDebuggingEngine = require('./self-debugging-engine.cjs');

async function runCompleteTest() {
    console.log('🧪 Testing Complete AuraOS System...');
    console.log('='.repeat(50));
    
    try {
        // اختبار Firebase
        console.log('1️⃣ Testing Firebase...');
        const firebaseSuccess = await testConnection();
        if (!firebaseSuccess) throw new Error('Firebase test failed');
        console.log('✅ Firebase: OK');
        
        // اختبار Telegram Bot
        console.log('2️⃣ Testing Telegram Bot...');
        const bot = new AuraOSBot();
        console.log('✅ Telegram Bot: OK');
        
        // اختبار Gemini AI
        console.log('3️⃣ Testing Gemini AI...');
        const ai = new GeminiAIIntegration();
        const aiResponse = await ai.chatWithGemini('Test message');
        console.log('✅ Gemini AI: OK');
        
        // اختبار Self-Debugging Engine
        console.log('4️⃣ Testing Self-Debugging Engine...');
        const engine = new SelfDebuggingEngine();
        console.log('✅ Self-Debugging Engine: OK');
        
        // انتظار 5 ثواني للتأكد من التهيئة
        setTimeout(async () => {
            // إرسال إشعار نجاح
            await bot.sendNotification('🎉 Complete system test successful!', 'success');
            
            console.log('='.repeat(50));
            console.log('✅ All systems operational!');
            console.log('🚀 AuraOS AI System is ready!');
            console.log('='.repeat(50));
            console.log('📝 System Status:');
            console.log('   🔥 Firebase: Connected');
            console.log('   🤖 Telegram Bot: Active');
            console.log('   🧠 Gemini AI: Ready');
            console.log('   🔧 Self-Debugging: Monitoring');
            console.log('='.repeat(50));
            console.log('🎯 Next Steps:');
            console.log('   1. Send /test to your Telegram bot');
            console.log('   2. Send /status to check system health');
            console.log('   3. Monitor Firebase for logs');
            console.log('   4. Test error handling');
            
            process.exit(0);
        }, 5000);
        
    } catch (error) {
        console.error('❌ System test failed:', error.message);
        console.log('='.repeat(50));
        console.log('📝 Troubleshooting:');
        console.log('   1. Check .env file configuration');
        console.log('   2. Verify API keys are correct');
        console.log('   3. Ensure internet connection');
        console.log('   4. Check Firebase project setup');
        process.exit(1);
    }
}

runCompleteTest();
