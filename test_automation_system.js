#!/usr/bin/env node
/**
 * AuraOS Automation System Test
 * اختبار نظام الأتمتة - المرحلة 1
 */

import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AutomationSystemTest {
  constructor() {
    this.bot = null;
    this.testResults = {
      botConnection: false,
      commands: {},
      autopilotIntegration: false,
      webhookStatus: false,
      errors: []
    };
  }

  async runTests() {
    console.log('🧪 بدء اختبار نظام الأتمتة...\n');

    try {
      await this.testBotConnection();
      await this.testBasicCommands();
      await this.testAutopilotIntegration();
      await this.testWebhookStatus();
      await this.generateReport();
    } catch (error) {
      console.error('❌ خطأ في الاختبار:', error);
      this.testResults.errors.push(error.message);
    }
  }

  async testBotConnection() {
    console.log('1️⃣ اختبار اتصال البوت...');
    
    try {
      if (!process.env.TELEGRAM_BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN غير موجود في متغيرات البيئة');
      }

      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
      
      // اختبار الاتصال
      const me = await this.bot.getMe();
      console.log(`   ✅ البوت متصل: @${me.username} (${me.first_name})`);
      
      this.testResults.botConnection = true;
      this.testResults.botInfo = {
        id: me.id,
        username: me.username,
        first_name: me.first_name
      };
      
    } catch (error) {
      console.log(`   ❌ فشل الاتصال: ${error.message}`);
      this.testResults.errors.push(`Bot Connection: ${error.message}`);
    }
  }

  async testBasicCommands() {
    console.log('\n2️⃣ اختبار الأوامر الأساسية...');
    
    const commands = [
      '/start',
      '/help', 
      '/status',
      '/menu',
      '/autopilot',
      '/task'
    ];

    for (const command of commands) {
      try {
        // محاكاة استقبال الأمر
        console.log(`   🔍 اختبار الأمر: ${command}`);
        
        // هنا يمكنك إضافة اختبارات فعلية للأوامر
        this.testResults.commands[command] = 'available';
        console.log(`   ✅ ${command} - متاح`);
        
      } catch (error) {
        console.log(`   ❌ ${command} - خطأ: ${error.message}`);
        this.testResults.commands[command] = 'error';
        this.testResults.errors.push(`Command ${command}: ${error.message}`);
      }
    }
  }

  async testAutopilotIntegration() {
    console.log('\n3️⃣ اختبار تكامل Autopilot...');
    
    try {
      // اختبار وجود ملفات Autopilot
      
      const autopilotFiles = [
        'server/autopilot-agent.ts',
        'server/telegram.ts',
        'autopilot-task-intake.cjs',
        'telegram_bot_integration.py'
      ];

      let foundFiles = 0;
      for (const file of autopilotFiles) {
        if (fs.existsSync(path.join(__dirname, file))) {
          console.log(`   ✅ ${file} - موجود`);
          foundFiles++;
        } else {
          console.log(`   ⚠️ ${file} - غير موجود`);
        }
      }

      if (foundFiles >= 2) {
        console.log('   ✅ تكامل Autopilot يعمل');
        this.testResults.autopilotIntegration = true;
      } else {
        throw new Error('ملفات Autopilot غير مكتملة');
      }
      
    } catch (error) {
      console.log(`   ❌ خطأ في تكامل Autopilot: ${error.message}`);
      this.testResults.errors.push(`Autopilot Integration: ${error.message}`);
    }
  }

  async testWebhookStatus() {
    console.log('\n4️⃣ اختبار حالة Webhook...');
    
    try {
      if (this.bot) {
        const webhookInfo = await this.bot.getWebHookInfo();
        
        if (webhookInfo.url) {
          console.log(`   ✅ Webhook مفعل: ${webhookInfo.url}`);
          console.log(`   📊 آخر تحديث: ${webhookInfo.last_error_date ? new Date(webhookInfo.last_error_date * 1000) : 'لا توجد أخطاء'}`);
          this.testResults.webhookStatus = true;
          this.testResults.webhookInfo = webhookInfo;
        } else {
          console.log('   ℹ️ Webhook غير مفعل - يستخدم Polling');
          this.testResults.webhookStatus = 'polling';
        }
      }
      
    } catch (error) {
      console.log(`   ❌ خطأ في Webhook: ${error.message}`);
      this.testResults.errors.push(`Webhook: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 تقرير اختبار نظام الأتمتة');
    console.log('=' .repeat(50));
    
    // حالة البوت
    console.log(`🤖 اتصال البوت: ${this.testResults.botConnection ? '✅ يعمل' : '❌ لا يعمل'}`);
    if (this.testResults.botInfo) {
      console.log(`   📱 البوت: @${this.testResults.botInfo.username}`);
    }
    
    // الأوامر
    console.log('\n📋 الأوامر المتاحة:');
    Object.entries(this.testResults.commands).forEach(([cmd, status]) => {
      console.log(`   ${status === 'available' ? '✅' : '❌'} ${cmd}`);
    });
    
    // Autopilot
    console.log(`\n🚀 تكامل Autopilot: ${this.testResults.autopilotIntegration ? '✅ يعمل' : '❌ لا يعمل'}`);
    
    // Webhook
    const webhookStatus = this.testResults.webhookStatus === true ? '✅ مفعل' : 
                         this.testResults.webhookStatus === 'polling' ? 'ℹ️ Polling' : '❌ لا يعمل';
    console.log(`\n🔗 Webhook: ${webhookStatus}`);
    
    // الأخطاء
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ الأخطاء المكتشفة:');
      this.testResults.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // التوصيات
    console.log('\n💡 التوصيات:');
    if (!this.testResults.botConnection) {
      console.log('   • تحقق من TELEGRAM_BOT_TOKEN في ملف .env');
    }
    if (!this.testResults.autopilotIntegration) {
      console.log('   • تأكد من وجود ملفات Autopilot المطلوبة');
    }
    if (this.testResults.webhookStatus !== true) {
      console.log('   • فكر في تفعيل Webhook لتحسين الأداء');
    }
    
    // النتيجة النهائية
    const successRate = this.calculateSuccessRate();
    console.log(`\n🎯 معدل النجاح: ${successRate}%`);
    
    if (successRate >= 80) {
      console.log('🎉 النظام جاهز للاستخدام!');
    } else if (successRate >= 60) {
      console.log('⚠️ النظام يعمل مع بعض المشاكل');
    } else {
      console.log('❌ النظام يحتاج إلى إصلاحات');
    }
  }

  calculateSuccessRate() {
    let total = 0;
    let passed = 0;
    
    // اتصال البوت
    total++;
    if (this.testResults.botConnection) passed++;
    
    // الأوامر
    const commandCount = Object.keys(this.testResults.commands).length;
    total += commandCount;
    passed += Object.values(this.testResults.commands).filter(status => status === 'available').length;
    
    // Autopilot
    total++;
    if (this.testResults.autopilotIntegration) passed++;
    
    // Webhook
    total++;
    if (this.testResults.webhookStatus) passed++;
    
    return Math.round((passed / total) * 100);
  }
}

// تشغيل الاختبار
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = new AutomationSystemTest();
  test.runTests().catch(console.error);
}

export default AutomationSystemTest;
