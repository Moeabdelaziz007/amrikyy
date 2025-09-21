#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AuraOS AI System - Quick Setup');
console.log('='.repeat(50));

// Check if .env exists
if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file from template...');
    if (fs.existsSync('env-template.txt')) {
        fs.copyFileSync('env-template.txt', '.env');
        console.log('✅ .env file created!');
        console.log('📝 Please edit .env with your credentials');
    } else {
        console.log('❌ env-template.txt not found');
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

console.log('='.repeat(50));
console.log('🎯 Available Tests:');
console.log('   1. node test-firebase.js      - Test Firebase connection');
console.log('   2. node test-telegram.js      - Test Telegram bot');
console.log('   3. node test-gemini.js        - Test Gemini AI');
console.log('   4. node test-self-debugging.js - Test self-debugging');
console.log('   5. node test-complete-system.js - Test everything');
console.log('='.repeat(50));
console.log('📚 Read AURAOS_SETUP_GUIDE.md for detailed instructions');
console.log('='.repeat(50));
