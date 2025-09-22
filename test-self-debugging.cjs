require('dotenv').config();
const SelfDebuggingEngine = require('./self-debugging-engine.cjs');

async function runTest() {
  console.log('🧪 Testing Self-Debugging Engine...');

  try {
    const engine = new SelfDebuggingEngine();

    // انتظار 10 ثواني للتأكد من التهيئة
    setTimeout(async () => {
      // اختبار معالجة الأخطاء
      await engine.testErrorHandling();

      console.log('✅ Self-Debugging Engine setup completed successfully!');
      console.log('📝 Next steps:');
      console.log('1. Run: node test-complete-system.js');
      console.log('2. Monitor Telegram for notifications');
      console.log('3. Check Firebase for logs');

      process.exit(0);
    }, 10000);
  } catch (error) {
    console.error('❌ Self-Debugging Engine setup failed:', error.message);
    console.log('📝 Please check:');
    console.log('1. All dependencies are installed');
    console.log('2. Environment variables are set');
    console.log('3. Firebase connection is working');
    process.exit(1);
  }
}

runTest();
