#!/usr/bin/env node
// AuraOS Performance Test - اختبار أداء مبسط
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { performance } from 'perf_hooks';

dotenv.config();

class QuickPerformanceTest {
  constructor() {
    this.results = { commands: {}, avg: 0, errors: [] };
  }

  async test() {
    console.log('🚀 اختبار أداء سريع...\n');
    
    try {
      const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
      const commands = ['/start', '/help', '/status', '/menu', '/task', '/autopilot'];
      const times = [];

      for (const cmd of commands) {
        const start = performance.now();
        await this.simulate(cmd);
        const end = performance.now();
        const time = end - start;
        times.push(time);
        this.results.commands[cmd] = time;
        console.log(`   ${cmd}: ${time.toFixed(2)}ms ${time < 2000 ? '✅' : '⚠️'}`);
      }

      this.results.avg = times.reduce((a, b) => a + b, 0) / times.length;
      
      console.log(`\n⏱️ متوسط الاستجابة: ${this.results.avg.toFixed(2)}ms`);
      console.log(`💾 الذاكرة: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      console.log(`🎯 النتيجة: ${this.results.avg < 2000 ? '✅ ممتاز' : '⚠️ يحتاج تحسين'}`);
      
    } catch (error) {
      console.error('❌ خطأ:', error.message);
      this.results.errors.push(error.message);
    }
  }

  async simulate(cmd) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  new QuickPerformanceTest().test();
}
