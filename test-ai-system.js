#!/usr/bin/env node
/**
 * AuraOS AI System Test - اختبار النظام الذكي الكامل
 * اختبار شامل لجميع ميزات Teleauto.ai و Telepilot.co
 */

import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { createAIIntegrationService } from './server/ai-integration-service.js';
import { performance } from 'perf_hooks';

dotenv.config();

class AISystemTester {
  constructor() {
    this.bot = null;
    this.aiIntegration = null;
    this.testResults = {
      teleauto: { success: false, tests: [] },
      telepilot: { success: false, tests: [] },
      integration: { success: false, tests: [] },
      performance: { success: false, tests: [] },
      overall: { success: false, score: 0 }
    };
  }

  async runTests() {
    try {
      console.log('🧪 Starting AI System Tests...');
      console.log('=' .repeat(50));

      await this.setupTestEnvironment();
      await this.testTeleautoIntegration();
      await this.testTelepilotIntegration();
      await this.testAIIntegration();
      await this.testPerformance();
      await this.generateTestReport();

    } catch (error) {
      console.error('❌ Test failed:', error);
      this.testResults.overall.success = false;
    }
  }

  async setupTestEnvironment() {
    console.log('🔧 Setting up test environment...');

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }

    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    
    const config = {
      teleauto: { enabled: true },
      telepilot: { enabled: true },
      monitoring: { enabled: true }
    };

    this.aiIntegration = createAIIntegrationService(this.bot, config);
    
    console.log('✅ Test environment setup complete');
  }

  async testTeleautoIntegration() {
    console.log('\n📰 Testing Teleauto.ai Integration...');

    try {
      // بدء Teleauto
      await this.aiIntegration.start();
      this.testResults.teleauto.tests.push('✅ Teleauto started successfully');

      // اختبار نشر المحتوى
      const contentId = await this.aiIntegration.publishContent(
        'اختبار محتوى تلقائي من Teleauto.ai',
        undefined,
        'high'
      );

      if (contentId) {
        this.testResults.teleauto.tests.push('✅ Content publishing works');
      } else {
        this.testResults.teleauto.tests.push('❌ Content publishing failed');
      }

      // اختبار الإحصائيات
      const stats = this.aiIntegration.getDetailedStats();
      if (stats.teleauto) {
        this.testResults.teleauto.tests.push('✅ Statistics available');
      } else {
        this.testResults.teleauto.tests.push('❌ Statistics not available');
      }

      this.testResults.teleauto.success = true;
      console.log('✅ Teleauto.ai tests completed');

    } catch (error) {
      console.error('❌ Teleauto.ai test failed:', error);
      this.testResults.teleauto.tests.push(`❌ Error: ${error.message}`);
      this.testResults.teleauto.success = false;
    }
  }

  async testTelepilotIntegration() {
    console.log('\n🧠 Testing Telepilot.co Integration...');

    try {
      // اختبار معالجة الرسائل الذكية
      const testMessages = [
        'أنشئ مهمة مراجعة التقرير بأولوية عالية',
        'أظهر مهامي الحالية',
        'ما حالة النظام؟',
        'مرحباً، كيف حالك؟'
      ];

      for (const message of testMessages) {
        const startTime = performance.now();
        
        const response = await this.aiIntegration.processSmartMessage(
          12345, // test user ID
          67890, // test chat ID
          message
        );

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        if (response && response.text) {
          this.testResults.telepilot.tests.push(`✅ Smart message processed: "${message}" (${responseTime.toFixed(2)}ms)`);
        } else {
          this.testResults.telepilot.tests.push(`❌ Failed to process: "${message}"`);
        }
      }

      // اختبار إنشاء المهام التلقائية
      const taskId = await this.aiIntegration.createAutomatedTask(
        'مهمة اختبار تلقائية',
        'هذه مهمة تم إنشاؤها تلقائياً للاختبار',
        'medium',
        { test: true }
      );

      if (taskId) {
        this.testResults.telepilot.tests.push('✅ Automated task creation works');
      } else {
        this.testResults.telepilot.tests.push('❌ Automated task creation failed');
      }

      // اختبار الإحصائيات
      const stats = this.aiIntegration.getDetailedStats();
      if (stats.telepilot) {
        this.testResults.telepilot.tests.push('✅ Statistics available');
      } else {
        this.testResults.telepilot.tests.push('❌ Statistics not available');
      }

      this.testResults.telepilot.success = true;
      console.log('✅ Telepilot.co tests completed');

    } catch (error) {
      console.error('❌ Telepilot.co test failed:', error);
      this.testResults.telepilot.tests.push(`❌ Error: ${error.message}`);
      this.testResults.telepilot.success = false;
    }
  }

  async testAIIntegration() {
    console.log('\n🤖 Testing AI Integration Service...');

    try {
      // اختبار حالة النظام
      const systemStatus = this.aiIntegration.getSystemStatus();
      
      if (systemStatus.overall) {
        this.testResults.integration.tests.push(`✅ System status: ${systemStatus.overall}`);
      } else {
        this.testResults.integration.tests.push('❌ System status not available');
      }

      // اختبار المكونات
      const components = systemStatus.components;
      if (components.teleauto === 'active') {
        this.testResults.integration.tests.push('✅ Teleauto component active');
      } else {
        this.testResults.integration.tests.push(`❌ Teleauto component: ${components.teleauto}`);
      }

      if (components.telepilot === 'active') {
        this.testResults.integration.tests.push('✅ Telepilot component active');
      } else {
        this.testResults.integration.tests.push(`❌ Telepilot component: ${components.telepilot}`);
      }

      if (components.monitoring === 'active') {
        this.testResults.integration.tests.push('✅ Monitoring component active');
      } else {
        this.testResults.integration.tests.push(`❌ Monitoring component: ${components.monitoring}`);
      }

      // اختبار الأداء
      const performance = systemStatus.performance;
      if (performance.responseTime < 2000) {
        this.testResults.integration.tests.push(`✅ Response time: ${performance.responseTime.toFixed(2)}ms`);
      } else {
        this.testResults.integration.tests.push(`⚠️ High response time: ${performance.responseTime.toFixed(2)}ms`);
      }

      if (performance.memoryUsage < 500 * 1024 * 1024) {
        this.testResults.integration.tests.push(`✅ Memory usage: ${Math.round(performance.memoryUsage / 1024 / 1024)}MB`);
      } else {
        this.testResults.integration.tests.push(`⚠️ High memory usage: ${Math.round(performance.memoryUsage / 1024 / 1024)}MB`);
      }

      this.testResults.integration.success = true;
      console.log('✅ AI Integration tests completed');

    } catch (error) {
      console.error('❌ AI Integration test failed:', error);
      this.testResults.integration.tests.push(`❌ Error: ${error.message}`);
      this.testResults.integration.success = false;
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');

    try {
      const performanceTests = [
        {
          name: 'Message Processing',
          test: async () => {
            const start = performance.now();
            await this.aiIntegration.processSmartMessage(12345, 67890, 'اختبار الأداء');
            return performance.now() - start;
          }
        },
        {
          name: 'Content Publishing',
          test: async () => {
            const start = performance.now();
            await this.aiIntegration.publishContent('اختبار الأداء', undefined, 'low');
            return performance.now() - start;
          }
        },
        {
          name: 'Task Creation',
          test: async () => {
            const start = performance.now();
            await this.aiIntegration.createAutomatedTask('اختبار الأداء', 'وصف', 'low');
            return performance.now() - start;
          }
        },
        {
          name: 'System Status',
          test: async () => {
            const start = performance.now();
            this.aiIntegration.getSystemStatus();
            return performance.now() - start;
          }
        }
      ];

      for (const perfTest of performanceTests) {
        try {
          const responseTime = await perfTest.test();
          
          if (responseTime < 1000) {
            this.testResults.performance.tests.push(`✅ ${perfTest.name}: ${responseTime.toFixed(2)}ms`);
          } else if (responseTime < 2000) {
            this.testResults.performance.tests.push(`⚠️ ${perfTest.name}: ${responseTime.toFixed(2)}ms (slow)`);
          } else {
            this.testResults.performance.tests.push(`❌ ${perfTest.name}: ${responseTime.toFixed(2)}ms (too slow)`);
          }
        } catch (error) {
          this.testResults.performance.tests.push(`❌ ${perfTest.name}: Error - ${error.message}`);
        }
      }

      this.testResults.performance.success = true;
      console.log('✅ Performance tests completed');

    } catch (error) {
      console.error('❌ Performance test failed:', error);
      this.testResults.performance.tests.push(`❌ Error: ${error.message}`);
      this.testResults.performance.success = false;
    }
  }

  async generateTestReport() {
    console.log('\n📊 Test Report');
    console.log('=' .repeat(50));

    // حساب النقاط
    let totalTests = 0;
    let passedTests = 0;

    Object.values(this.testResults).forEach(category => {
      if (category.tests) {
        totalTests += category.tests.length;
        passedTests += category.tests.filter(test => test.startsWith('✅')).length;
      }
    });

    const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    this.testResults.overall.score = score;
    this.testResults.overall.success = score >= 80;

    // عرض النتائج
    console.log(`🎯 Overall Score: ${score}/100`);
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}`);

    console.log('\n📰 Teleauto.ai Results:');
    this.testResults.teleauto.tests.forEach(test => console.log(`   ${test}`));

    console.log('\n🧠 Telepilot.co Results:');
    this.testResults.telepilot.tests.forEach(test => console.log(`   ${test}`));

    console.log('\n🤖 AI Integration Results:');
    this.testResults.integration.tests.forEach(test => console.log(`   ${test}`));

    console.log('\n⚡ Performance Results:');
    this.testResults.performance.tests.forEach(test => console.log(`   ${test}`));

    // التوصيات
    console.log('\n💡 Recommendations:');
    if (score >= 90) {
      console.log('   🎉 Excellent! System is ready for production');
    } else if (score >= 80) {
      console.log('   ✅ Good! System is functional with minor issues');
    } else if (score >= 60) {
      console.log('   ⚠️ Fair! System needs improvements');
    } else {
      console.log('   ❌ Poor! System needs major fixes');
    }

    // حفظ التقرير
    await this.saveTestReport();

    console.log('\n🎯 Test completed!');
  }

  async saveTestReport() {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const reportsDir = path.join(process.cwd(), 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const report = {
        timestamp: new Date().toISOString(),
        testResults: this.testResults,
        summary: {
          totalTests: Object.values(this.testResults).reduce((sum, cat) => sum + (cat.tests?.length || 0), 0),
          passedTests: Object.values(this.testResults).reduce((sum, cat) => sum + (cat.tests?.filter(t => t.startsWith('✅')).length || 0), 0),
          score: this.testResults.overall.score,
          success: this.testResults.overall.success
        }
      };

      const reportFile = path.join(reportsDir, `ai-system-test-${new Date().toISOString().split('T')[0]}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

      console.log(`📄 Test report saved: ${reportFile}`);

    } catch (error) {
      console.error('❌ Error saving test report:', error);
    }
  }
}

// تشغيل الاختبارات
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new AISystemTester();
  tester.runTests().catch(console.error);
}

export default AISystemTester;
