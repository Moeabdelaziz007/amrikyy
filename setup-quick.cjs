#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AuraOS AI System - Quick Setup');
console.log('='.repeat(60));

// Check if .env exists
if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file from template...');
    if (fs.existsSync('env-config.txt')) {
        fs.copyFileSync('env-config.txt', '.env');
        console.log('✅ .env file created!');
        console.log('📝 Please edit .env with your actual credentials');
    } else {
        console.log('❌ env-config.txt not found');
        process.exit(1);
    }
} else {
    console.log('✅ .env file exists');
}

// Check if service-account-key.json exists
if (!fs.existsSync('service-account-key.json')) {
    console.log('⚠️  service-account-key.json not found');
    console.log('📝 Please download from Firebase Console:');
    console.log('   1. Go to Firebase Console');
    console.log('   2. Project Settings → Service Accounts');
    console.log('   3. Generate new private key');
    console.log('   4. Save as service-account-key.json');
}

console.log('='.repeat(60));
console.log('🎯 Setup Checklist:');
console.log('='.repeat(60));
console.log('1️⃣ Firebase Setup:');
console.log('   ✅ Create Firebase project');
console.log('   ✅ Enable Firestore');
console.log('   ✅ Download service-account-key.json');
console.log('   ✅ Update FIREBASE_PROJECT_ID in .env');
console.log('   ✅ Update FIREBASE_CLIENT_EMAIL in .env');
console.log('   ✅ Update FIREBASE_PRIVATE_KEY in .env');
console.log('');
console.log('2️⃣ Telegram Bot Setup:');
console.log('   ✅ Create bot with @BotFather');
console.log('   ✅ Get bot token');
console.log('   ✅ Get your chat ID');
console.log('   ✅ Update TELEGRAM_BOT_TOKEN in .env');
console.log('   ✅ Update TELEGRAM_ADMIN_CHAT_ID in .env');
console.log('');
console.log('3️⃣ Google AI Setup:');
console.log('   ✅ Get API key from Google AI Studio');
console.log('   ✅ Update GOOGLE_AI_API_KEY in .env');
console.log('');
console.log('='.repeat(60));
console.log('🧪 Available Tests:');
console.log('='.repeat(60));
console.log('   node test-setup.cjs        - Check environment setup');
console.log('   node test-firebase.cjs     - Test Firebase connection');
console.log('   node test-telegram.cjs     - Test Telegram bot');
console.log('   node test-gemini.cjs       - Test Gemini AI');
console.log('   node test-complete-system.cjs - Test everything');
console.log('');
console.log('🚀 Run System:');
console.log('   node run.cjs               - Start AuraOS AI System');
console.log('='.repeat(60));
console.log('📚 Documentation:');
console.log('   AURAOS_SETUP_GUIDE.md      - Complete setup guide');
console.log('   IMPLEMENTATION_COMPLETE.md - Implementation details');
console.log('='.repeat(60));
