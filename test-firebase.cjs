require('dotenv').config();
const { testConnection } = require('./firebase-admin-setup.cjs');

async function runTest() {
    console.log('🧪 Testing Firebase Admin Setup...');
    
    const success = await testConnection();
    
    if (success) {
        console.log('🎉 Firebase Admin setup completed successfully!');
        console.log('📝 Next steps:');
        console.log('1. Update .env file with your Firebase credentials');
        console.log('2. Run: node test-telegram.js');
        process.exit(0);
    } else {
        console.log('💥 Firebase Admin setup failed!');
        console.log('📝 Please check:');
        console.log('1. Firebase project exists');
        console.log('2. Service account key is correct');
        console.log('3. Environment variables are set');
        process.exit(1);
    }
}

runTest();
