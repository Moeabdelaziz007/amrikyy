#!/usr/bin/env node
/**
 * AuraOS Webhook Telegram Bot Starter
 * تشغيل البوت مع Webhook محسن
 */

import dotenv from 'dotenv';
import { createWebhookTelegramService } from './server/webhook-telegram.js';

dotenv.config();

class WebhookBotStarter {
  constructor() {
    this.config = {
      token: process.env.TELEGRAM_BOT_TOKEN,
      webhookUrl: process.env.WEBHOOK_URL || 'https://yourdomain.com/webhook',
      port: parseInt(process.env.PORT) || 3000,
      secretToken: process.env.WEBHOOK_SECRET_TOKEN,
      parseMode: 'HTML'
    };
    
    this.service = null;
  }

  async start() {
    try {
      console.log('🚀 بدء تشغيل AuraOS Webhook Bot...\n');

      // التحقق من المتغيرات المطلوبة
      if (!this.config.token) {
        throw new Error('TELEGRAM_BOT_TOKEN مطلوب في ملف .env');
      }

      if (!this.config.webhookUrl || this.config.webhookUrl === 'https://yourdomain.com/webhook') {
        console.log('⚠️ تحذير: WEBHOOK_URL غير محدد، سيتم استخدام URL تجريبي');
        this.config.webhookUrl = `https://yourdomain.com/webhook`;
      }

      // إنشاء الخدمة
      this.service = createWebhookTelegramService(this.config);

      // بدء الخدمة
      await this.service.start();

      console.log('\n✅ البوت يعمل بنجاح!');
      console.log(`🔗 Webhook URL: ${this.config.webhookUrl}`);
      console.log(`🌐 Port: ${this.config.port}`);
      console.log(`🤖 Bot Token: ${this.config.token.substring(0, 10)}...`);
      
      if (this.config.secretToken) {
        console.log(`🔐 Secret Token: ${this.config.secretToken.substring(0, 10)}...`);
      }

      console.log('\n📱 الميزات المتاحة:');
      console.log('• واجهة تفاعلية مع أزرار');
      console.log('• إدارة المهام المتقدمة');
      console.log('• تكامل Autopilot ذكي');
      console.log('• استجابة فورية عبر Webhook');
      console.log('• إحصائيات مفصلة');

      console.log('\n🎯 الأوامر المتاحة:');
      console.log('/start - بدء المحادثة');
      console.log('/menu - القائمة الرئيسية');
      console.log('/task - إدارة المهام');
      console.log('/autopilot - إدارة Autopilot');
      console.log('/help - المساعدة');
      console.log('/status - حالة النظام');

      console.log('\n⏹️ اضغط Ctrl+C لإيقاف البوت');

      // معالجة إيقاف البوت
      process.on('SIGINT', async () => {
        console.log('\n⏹️ إيقاف البوت...');
        await this.stop();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        console.log('\n⏹️ إيقاف البوت...');
        await this.stop();
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ خطأ في تشغيل البوت:', error.message);
      process.exit(1);
    }
  }

  async stop() {
    if (this.service) {
      await this.service.stop();
      console.log('✅ تم إيقاف البوت بنجاح');
    }
  }

  getStats() {
    if (this.service) {
      return this.service.getStats();
    }
    return null;
  }
}

// تشغيل البوت
if (import.meta.url === `file://${process.argv[1]}`) {
  const starter = new WebhookBotStarter();
  starter.start().catch(console.error);
}

export default WebhookBotStarter;
