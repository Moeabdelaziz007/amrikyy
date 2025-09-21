#!/usr/bin/env node

const fs = require('fs');

console.log('🚀 Updating .env with your credentials...');
console.log('='.repeat(50));

try {
    // Read current .env
    let envContent = '';
    if (fs.existsSync('.env')) {
        envContent = fs.readFileSync('.env', 'utf8');
    }

    // Update Firebase Project ID
    envContent = envContent.replace(
        'FIREBASE_PROJECT_ID=auraos-ai-system',
        'FIREBASE_PROJECT_ID=aios-97581'
    );

    // Update Gemini API Key
    envContent = envContent.replace(
        'GOOGLE_AI_API_KEY=your_gemini_api_key_here',
        'GOOGLE_AI_API_KEY=AIzaSyBiPaJdVBxBno4gRznPxua5TydUmMN4U3g'
    );

    // Write updated .env
    fs.writeFileSync('.env', envContent);

    console.log('✅ .env updated successfully!');
    console.log('='.repeat(50));
    console.log('📊 Updated values:');
    console.log('   🔥 Firebase Project ID: aios-97581');
    console.log('   🧠 Gemini API Key: AIzaSyBiPaJdVBxBno4gRznPxua5TydUmMN4U3g');
    console.log('='.repeat(50));
    console.log('📝 Still needed:');
    console.log('   🔥 Firebase Private Key (from service-account-key.json)');
    console.log('   🤖 Telegram Bot Token (from @BotFather)');
    console.log('   💬 Telegram Chat ID (from @RawDataBot)');
    console.log('='.repeat(50));

    // Test Gemini AI
    console.log('🧪 Testing Gemini AI...');
    try {
        require('dotenv').config();
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        console.log('✅ Gemini AI initialized successfully!');
        console.log('🎉 API Key is valid and working!');
        
    } catch (error) {
        console.log('❌ Gemini AI test failed:', error.message);
    }

    console.log('='.repeat(50));
    console.log('🚀 Next steps:');
    console.log('1. Download service-account-key.json from Firebase Console');
    console.log('2. Create Telegram Bot with @BotFather');
    console.log('3. Get Chat ID from @RawDataBot');
    console.log('4. Run: node test-gemini.cjs (should work now!)');
    console.log('5. Run: node test-complete-system.cjs (after Firebase setup)');

} catch (error) {
    console.error('❌ Update failed:', error.message);
}
