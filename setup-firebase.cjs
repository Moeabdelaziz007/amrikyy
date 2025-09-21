#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔥 Firebase Studio Setup');
console.log('='.repeat(40));

async function setupFirebase() {
    try {
        // Check if service-account-key.json exists
        if (!fs.existsSync('service-account-key.json')) {
            console.log('❌ service-account-key.json not found');
            console.log('📝 Please download it from Firebase Console:');
            console.log('   1. Go to Firebase Console');
            console.log('   2. Project Settings → Service Accounts');
            console.log('   3. Generate new private key');
            console.log('   4. Save as service-account-key.json');
            rl.close();
            return;
        }

        // Read service account key
        const serviceAccount = JSON.parse(fs.readFileSync('service-account-key.json', 'utf8'));
        
        console.log('✅ service-account-key.json found');
        console.log(`📊 Project ID: ${serviceAccount.project_id}`);
        console.log(`📧 Client Email: ${serviceAccount.client_email}`);

        // Check if it's dummy data
        if (serviceAccount.project_id === 'auraos-ai-system' && 
            serviceAccount.private_key.includes('DUMMY')) {
            console.log('⚠️  Dummy service account detected');
            console.log('📝 Please replace with real Firebase credentials');
            rl.close();
            return;
        }

        // Read current .env
        let envContent = '';
        if (fs.existsSync('.env')) {
            envContent = fs.readFileSync('.env', 'utf8');
        }

        // Update .env with Firebase credentials
        envContent = envContent.replace(
            'FIREBASE_PROJECT_ID=auraos-ai-system',
            `FIREBASE_PROJECT_ID=${serviceAccount.project_id}`
        );

        envContent = envContent.replace(
            'FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"',
            `FIREBASE_PRIVATE_KEY="${serviceAccount.private_key}"`
        );

        envContent = envContent.replace(
            'FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@auraos-ai-system.iam.gserviceaccount.com',
            `FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`
        );

        // Write updated .env
        fs.writeFileSync('.env', envContent);

        console.log('✅ Firebase credentials updated in .env');
        console.log('='.repeat(40));

        // Test Firebase connection
        console.log('🧪 Testing Firebase connection...');
        
        try {
            require('dotenv').config();
            const { testConnection } = require('./firebase-admin-setup.cjs');
            
            const success = await testConnection();
            
            if (success) {
                console.log('✅ Firebase connection successful!');
                console.log('📊 Firestore database connected');
                console.log('🔐 Authentication configured');
            } else {
                console.log('❌ Firebase connection failed');
                console.log('📝 Please check your credentials');
            }
            
        } catch (error) {
            console.log('❌ Firebase test failed:', error.message);
        }

        console.log('='.repeat(40));
        console.log('🚀 Next steps:');
        console.log('1. Set up Telegram Bot (node setup-telegram.cjs)');
        console.log('2. Set up Google AI API key');
        console.log('3. Test complete system (node test-complete-system.cjs)');
        console.log('4. Run system (node run.cjs)');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

setupFirebase();
