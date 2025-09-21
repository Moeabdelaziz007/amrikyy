require('dotenv').config();
const GeminiAIIntegration = require('./gemini-ai-integration.cjs');

async function runTest() {
    console.log('🧪 Testing Gemini AI Integration...');
    
    try {
        const ai = new GeminiAIIntegration();
        
        // اختبار المحادثة
        console.log('📝 Testing chat...');
        const response = await ai.chatWithGemini('Hello, how are you?');
        console.log('✅ Chat response:', response.substring(0, 100) + '...');
        
        // اختبار المحادثة العربية
        console.log('🇸🇦 Testing Arabic chat...');
        const arabicResponse = await ai.chatInArabic('مرحبا، كيف حالك؟');
        console.log('✅ Arabic response:', arabicResponse.substring(0, 100) + '...');
        
        // اختبار تحليل الخطأ
        console.log('🔍 Testing error analysis...');
        const errorData = {
            type: 'TypeError',
            message: 'Cannot read property of undefined',
            stack: 'Error: Cannot read property of undefined\n    at Object.function (file.js:10:5)',
            timestamp: new Date().toISOString()
        };
        
        const analysis = await ai.analyzeError(errorData);
        console.log('✅ Error analysis:', analysis.substring(0, 100) + '...');
        
        console.log('🎉 Gemini AI integration completed successfully!');
        console.log('📝 Next steps:');
        console.log('1. Run: node test-self-debugging.js');
        console.log('2. Run: node test-complete-system.js');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Gemini AI integration failed:', error.message);
        console.log('📝 Please check:');
        console.log('1. GOOGLE_AI_API_KEY is correct');
        console.log('2. API key has proper permissions');
        console.log('3. Internet connection is working');
        process.exit(1);
    }
}

runTest();
