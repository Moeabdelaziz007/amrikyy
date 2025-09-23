#!/usr/bin/env node
/**
 * AuraOS Event Logger - نظام تسجيل الأحداث
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EventLogger {
  constructor() {
    this.logsDir = path.join(__dirname, 'logs');
    this.reportsDir = path.join(__dirname, 'reports');
    this.setupNotesFile = path.join(__dirname, 'setup_notes.md');
    
    this.ensureDirectories();
    console.log('📝 Event Logger initialized');
  }

  ensureDirectories() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  logEvent(type, level, message, data = {}) {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type, // 'user_action', 'system_event', 'error', 'performance', 'autopilot'
      level, // 'info', 'warning', 'error', 'critical'
      message,
      data
    };

    // حفظ في ملف يومي
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logsDir, `events-${today}.json`);
    
    let events = [];
    if (fs.existsSync(logFile)) {
      try {
        const content = fs.readFileSync(logFile, 'utf8');
        events = JSON.parse(content);
      } catch (error) {
        console.error('Error reading log file:', error);
      }
    }

    events.push(event);
    fs.writeFileSync(logFile, JSON.stringify(events, null, 2));

    // تحديث setup_notes.md
    this.updateSetupNotes(event);

    console.log(`📝 Event logged: ${type} - ${message}`);
    return event;
  }

  updateSetupNotes(event) {
    try {
      let content = '';
      if (fs.existsSync(this.setupNotesFile)) {
        content = fs.readFileSync(this.setupNotesFile, 'utf8');
      }

      const eventEntry = `
## حدث جديد - ${new Date().toLocaleString('ar-SA')}

**النوع**: ${event.type}
**المستوى**: ${event.level}
**الرسالة**: ${event.message}
**التوقيت**: ${event.timestamp}
${event.data && Object.keys(event.data).length > 0 ? `**البيانات**: ${JSON.stringify(event.data, null, 2)}` : ''}

---
`;

      // إضافة الحدث في بداية الملف بعد العنوان الرئيسي
      const lines = content.split('\n');
      const titleIndex = lines.findIndex(line => line.startsWith('# '));
      
      if (titleIndex !== -1) {
        lines.splice(titleIndex + 1, 0, eventEntry);
      } else {
        lines.unshift(eventEntry);
      }

      const updatedContent = lines.join('\n');
      fs.writeFileSync(this.setupNotesFile, updatedContent);

    } catch (error) {
      console.error('Error updating setup_notes.md:', error);
    }
  }

  generateDailyReport() {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logsDir, `events-${today}.json`);
    
    if (!fs.existsSync(logFile)) {
      console.log('لا توجد أحداث لليوم');
      return null;
    }

    try {
      const events = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      
      const report = {
        date: today,
        totalEvents: events.length,
        eventsByType: this.groupBy(events, 'type'),
        eventsByLevel: this.groupBy(events, 'level'),
        timeline: events.map(e => ({
          time: e.timestamp,
          type: e.type,
          level: e.level,
          message: e.message
        })),
        generatedAt: new Date().toISOString()
      };

      const reportFile = path.join(this.reportsDir, `daily-report-${today}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

      console.log(`📊 تقرير يومي تم إنشاؤه: ${reportFile}`);
      return report;

    } catch (error) {
      console.error('Error generating daily report:', error);
      return null;
    }
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }

  getEventsSummary() {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logsDir, `events-${today}.json`);
    
    if (!fs.existsSync(logFile)) {
      return { total: 0, byType: {}, byLevel: {} };
    }

    try {
      const events = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      return {
        total: events.length,
        byType: this.groupBy(events, 'type'),
        byLevel: this.groupBy(events, 'level')
      };
    } catch (error) {
      console.error('Error getting events summary:', error);
      return { total: 0, byType: {}, byLevel: {} };
    }
  }
}

// تصدير وتشغيل تجريبي
const logger = new EventLogger();

// تسجيل أحداث تجريبية
logger.logEvent('system_event', 'info', 'تم تشغيل نظام تسجيل الأحداث', { version: '1.0.0' });
logger.logEvent('performance', 'info', 'اختبار الأداء مكتمل', { averageResponseTime: '60.95ms', memory: '12MB' });
logger.logEvent('user_action', 'info', 'مستخدم جديد بدأ استخدام البوت', { userId: 'demo_user' });

// إنشاء تقرير يومي
const report = logger.generateDailyReport();
if (report) {
  console.log('\n📊 ملخص الأحداث اليوم:');
  console.log(`📝 إجمالي الأحداث: ${report.totalEvents}`);
  console.log('📊 حسب النوع:', report.eventsByType);
  console.log('📊 حسب المستوى:', report.eventsByLevel);
}

export default EventLogger;
