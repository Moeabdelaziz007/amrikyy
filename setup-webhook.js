#!/usr/bin/env node
/**
 * AuraOS Webhook Setup Tool
 * أداة إعداد Webhook للبوت
 */

import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WebhookSetup {
  constructor() {
    this.bot = null;
    this.config = {
      token: process.env.TELEGRAM_BOT_TOKEN,
      webhookUrl: process.env.WEBHOOK_URL,
      secretToken: process.env.WEBHOOK_SECRET_TOKEN,
      port: parseInt(process.env.PORT) || 3000
    };
  }

  async setup() {
    try {
      console.log('🔧 إعداد Webhook للبوت...\n');

      // التحقق من المتغيرات
      await this.validateConfig();

      // إنشاء البوت
      this.bot = new TelegramBot(this.config.token, { polling: false });

      // اختبار الاتصال
      await this.testConnection();

      // إعداد Webhook
      await this.setupWebhook();

      // اختبار Webhook
      await this.testWebhook();

      // إنشاء ملفات الإعداد
      await this.createConfigFiles();

      console.log('\n✅ تم إعداد Webhook بنجاح!');
      console.log('\n📋 الخطوات التالية:');
      console.log('1. تأكد من أن الخادم يدعم HTTPS');
      console.log('2. شغل البوت: node start-webhook-bot.js');
      console.log('3. اختبر البوت بإرسال /start');

    } catch (error) {
      console.error('❌ خطأ في إعداد Webhook:', error.message);
      process.exit(1);
    }
  }

  async validateConfig() {
    console.log('1️⃣ التحقق من الإعدادات...');

    if (!this.config.token) {
      throw new Error('TELEGRAM_BOT_TOKEN مطلوب في ملف .env');
    }

    if (!this.config.webhookUrl) {
      console.log('⚠️ WEBHOOK_URL غير محدد، سيتم استخدام URL تجريبي');
      this.config.webhookUrl = 'https://yourdomain.com/webhook';
    }

    if (!this.config.secretToken) {
      console.log('⚠️ WEBHOOK_SECRET_TOKEN غير محدد، سيتم إنشاء واحد تلقائياً');
      this.config.secretToken = this.generateSecretToken();
    }

    console.log('   ✅ الإعدادات صحيحة');
  }

  async testConnection() {
    console.log('\n2️⃣ اختبار اتصال البوت...');

    try {
      const me = await this.bot.getMe();
      console.log(`   ✅ البوت متصل: @${me.username} (${me.first_name})`);
      console.log(`   🆔 Bot ID: ${me.id}`);
    } catch (error) {
      throw new Error(`فشل الاتصال بالبوت: ${error.message}`);
    }
  }

  async setupWebhook() {
    console.log('\n3️⃣ إعداد Webhook...');

    try {
      // حذف Webhook السابق إذا كان موجوداً
      await this.bot.deleteWebHook();

      // إعداد Webhook جديد
      const result = await this.bot.setWebHook(this.config.webhookUrl, {
        secret_token: this.config.secretToken,
        drop_pending_updates: true
      });

      if (result) {
        console.log(`   ✅ Webhook مُعد: ${this.config.webhookUrl}`);
        console.log(`   🔐 Secret Token: ${this.config.secretToken.substring(0, 10)}...`);
      } else {
        throw new Error('فشل في إعداد Webhook');
      }
    } catch (error) {
      throw new Error(`خطأ في إعداد Webhook: ${error.message}`);
    }
  }

  async testWebhook() {
    console.log('\n4️⃣ اختبار Webhook...');

    try {
      const webhookInfo = await this.bot.getWebHookInfo();
      
      if (webhookInfo.url) {
        console.log(`   ✅ Webhook نشط: ${webhookInfo.url}`);
        console.log(`   📊 آخر تحديث: ${webhookInfo.last_error_date ? new Date(webhookInfo.last_error_date * 1000) : 'لا توجد أخطاء'}`);
        
        if (webhookInfo.pending_update_count > 0) {
          console.log(`   ⚠️ ${webhookInfo.pending_update_count} تحديثات معلقة`);
        }
      } else {
        throw new Error('Webhook غير نشط');
      }
    } catch (error) {
      throw new Error(`خطأ في اختبار Webhook: ${error.message}`);
    }
  }

  async createConfigFiles() {
    console.log('\n5️⃣ إنشاء ملفات الإعداد...');

    // تحديث ملف .env
    await this.updateEnvFile();

    // إنشاء ملف إعداد Webhook
    await this.createWebhookConfig();

    // إنشاء ملف تشغيل
    await this.createStartScript();

    console.log('   ✅ تم إنشاء ملفات الإعداد');
  }

  async updateEnvFile() {
    const envPath = path.join(__dirname, '.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // إضافة أو تحديث متغيرات Webhook
    const webhookVars = [
      `WEBHOOK_URL=${this.config.webhookUrl}`,
      `WEBHOOK_SECRET_TOKEN=${this.config.secretToken}`,
      `PORT=${this.config.port}`
    ];

    webhookVars.forEach(varLine => {
      const [key] = varLine.split('=');
      if (envContent.includes(key)) {
        envContent = envContent.replace(new RegExp(`${key}=.*`), varLine);
      } else {
        envContent += `\n${varLine}`;
      }
    });

    fs.writeFileSync(envPath, envContent);
    console.log('   📝 تم تحديث ملف .env');
  }

  async createWebhookConfig() {
    const configPath = path.join(__dirname, 'webhook-config.json');
    const config = {
      webhook: {
        url: this.config.webhookUrl,
        secretToken: this.config.secretToken,
        port: this.config.port
      },
      bot: {
        token: this.config.token.substring(0, 10) + '...',
        username: 'configured'
      },
      features: {
        inlineKeyboards: true,
        taskManagement: true,
        autopilotIntegration: true,
        realTimeUpdates: true
      },
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('   📝 تم إنشاء webhook-config.json');
  }

  async createStartScript() {
    const scriptPath = path.join(__dirname, 'start-webhook.sh');
    const script = `#!/bin/bash
# AuraOS Webhook Bot Starter
# تشغيل البوت مع Webhook

echo "🚀 بدء تشغيل AuraOS Webhook Bot..."

# التحقق من وجود ملف .env
if [ ! -f .env ]; then
    echo "❌ ملف .env غير موجود"
    exit 1
fi

# تشغيل البوت
node start-webhook-bot.js

echo "✅ تم تشغيل البوت"
`;

    fs.writeFileSync(scriptPath, script);
    
    // جعل الملف قابل للتنفيذ
    try {
      fs.chmodSync(scriptPath, '755');
    } catch (error) {
      console.log('   ⚠️ لا يمكن جعل الملف قابل للتنفيذ (Windows)');
    }

    console.log('   📝 تم إنشاء start-webhook.sh');
  }

  generateSecretToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async cleanup() {
    console.log('\n🧹 تنظيف Webhook...');
    
    if (this.bot) {
      try {
        await this.bot.deleteWebHook();
        console.log('   ✅ تم حذف Webhook');
      } catch (error) {
        console.log(`   ⚠️ خطأ في حذف Webhook: ${error.message}`);
      }
    }
  }
}

// تشغيل الإعداد
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new WebhookSetup();
  
  // معالجة إيقاف البرنامج
  process.on('SIGINT', async () => {
    console.log('\n⏹️ إيقاف الإعداد...');
    await setup.cleanup();
    process.exit(0);
  });

  setup.setup().catch(console.error);
}

export default WebhookSetup;
