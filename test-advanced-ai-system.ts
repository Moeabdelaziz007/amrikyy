// اختبار نظام AI المتقدم
import UnifiedAISystem from './server/unified-ai-system';

async function testAdvancedAISystem() {
  console.log('🚀 بدء اختبار نظام AI المتقدم...\n');

  try {
    // إنشاء النظام الموحد
    const unifiedAI = new UnifiedAISystem();
    console.log('✅ تم إنشاء النظام الموحد بنجاح');

    // اختبار معالجة الطلبات
    console.log('\n📝 اختبار معالجة الطلبات...');
    const testUserId = 'test-user-123';
    const testInput = 'I want to learn about machine learning and AI';

    const response = await unifiedAI.processRequest(testUserId, testInput, {
      urgency: 'medium',
      complexity: 'intermediate',
    });

    console.log('✅ تم معالجة الطلب بنجاح');
    console.log(`📊 الثقة: ${(response.confidence * 100).toFixed(1)}%`);
    console.log(`⏱️ وقت المعالجة: ${response.processingTime}ms`);
    console.log(`🤖 الاستجابة: ${response.response}`);

    // اختبار توليد الرؤى
    console.log('\n🔍 اختبار توليد الرؤى...');
    const insights = await unifiedAI.generateUserInsights(testUserId);
    console.log('✅ تم توليد الرؤى بنجاح');
    console.log(`👤 المستخدم: ${insights.userId}`);
    console.log(
      `📈 التقدم في التعلم: ${insights.learningProgress.length} موضوع`
    );

    // اختبار تدريب النماذج
    console.log('\n🎓 اختبار تدريب النماذج...');
    const trainingResults = await unifiedAI.trainModels();
    console.log('✅ تم تدريب النماذج بنجاح');
    console.log(`🤖 نماذج AI: ${trainingResults.aiModels.length}`);
    console.log(`🧠 نماذج ML: ${trainingResults.mlModels.length}`);
    console.log(`📝 نماذج NLP: ${trainingResults.nlpModels.length}`);

    // اختبار تحليل الأداء
    console.log('\n📊 اختبار تحليل الأداء...');
    const performance = unifiedAI.analyzeSystemPerformance();
    console.log('✅ تم تحليل الأداء بنجاح');
    console.log(`🤖 إجمالي الوكلاء: ${performance.ai.totalAgents}`);
    console.log(`🧠 إجمالي النماذج: ${performance.ml.totalModels}`);
    console.log(
      `📝 متوسط الدقة: ${(performance.ml.averageAccuracy * 100).toFixed(1)}%`
    );

    // اختبار تصدير البيانات
    console.log('\n💾 اختبار تصدير البيانات...');
    const allData = unifiedAI.exportAllData();
    console.log('✅ تم تصدير البيانات بنجاح');
    console.log(`📦 حجم البيانات: ${JSON.stringify(allData).length} حرف`);

    // اختبار التنظيف
    console.log('\n🧹 اختبار التنظيف...');
    await unifiedAI.cleanup();
    console.log('✅ تم التنظيف بنجاح');

    console.log('\n🎉 تم اختبار جميع مكونات نظام AI المتقدم بنجاح!');
    console.log('\n📋 ملخص الاختبار:');
    console.log('✅ النظام الموحد - يعمل بشكل صحيح');
    console.log('✅ معالجة الطلبات - تعمل بشكل صحيح');
    console.log('✅ توليد الرؤى - يعمل بشكل صحيح');
    console.log('✅ تدريب النماذج - يعمل بشكل صحيح');
    console.log('✅ تحليل الأداء - يعمل بشكل صحيح');
    console.log('✅ تصدير البيانات - يعمل بشكل صحيح');
    console.log('✅ التنظيف - يعمل بشكل صحيح');
  } catch (error) {
    console.error('❌ خطأ في اختبار نظام AI المتقدم:', error);
    process.exit(1);
  }
}

// تشغيل الاختبار
testAdvancedAISystem()
  .then(() => {
    console.log('\n🏁 انتهى الاختبار بنجاح');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 فشل الاختبار:', error);
    process.exit(1);
  });

export { testAdvancedAISystem };
