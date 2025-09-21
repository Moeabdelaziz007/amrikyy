require('dotenv').config();

console.log('🧪 Testing AuraOS AI System Setup...');
console.log('='.repeat(50));

// Check environment variables
const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'TELEGRAM_BOT_TOKEN', 
    'TELEGRAM_ADMIN_CHAT_ID',
    'GOOGLE_AI_API_KEY'
];

let allEnvVarsSet = true;

console.log('📝 Checking environment variables:');
requiredEnvVars.forEach(envVar => {
    if (process.env[envVar] && process.env[envVar] !== `your_${envVar.toLowerCase()}_here`) {
        console.log(`✅ ${envVar}: Set`);
    } else {
        console.log(`❌ ${envVar}: Not set`);
        allEnvVarsSet = false;
    }
});

console.log('='.repeat(50));

if (allEnvVarsSet) {
    console.log('🎉 All environment variables are configured!');
    console.log('📝 Next steps:');
    console.log('   1. Set up Firebase project');
    console.log('   2. Download service-account-key.json');
    console.log('   3. Run: node test-firebase.cjs');
} else {
    console.log('⚠️  Some environment variables are missing');
    console.log('📝 Please update .env file with your credentials');
    console.log('📚 See AURAOS_SETUP_GUIDE.md for instructions');
}

console.log('='.repeat(50));
console.log('🎯 Available Tests:');
console.log('   1. node test-firebase.cjs      - Test Firebase connection');
console.log('   2. node test-telegram.cjs      - Test Telegram bot');
console.log('   3. node test-gemini.cjs        - Test Gemini AI');
console.log('   4. node test-self-debugging.cjs - Test self-debugging');
console.log('   5. node test-complete-system.cjs - Test everything');
console.log('='.repeat(50));
