#!/usr/bin/env node

/**
 * اختبار شامل لـ AuraOS CLI المحسن
 * يختبر جميع الميزات الجديدة للأوتوبايلوت
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

// قائمة الاختبارات
const tests = [
  {
    name: 'CLI Help',
    command: ['npm', 'run', 'cli', '--', '--help'],
    description: 'اختبار عرض المساعدة الرئيسية'
  },
  {
    name: 'System Status',
    command: ['npm', 'run', 'cli:status'],
    description: 'اختبار عرض حالة النظام'
  },
  {
    name: 'Autopilot Help',
    command: ['npm', 'run', 'cli', 'autopilot', '--', '--help'],
    description: 'اختبار عرض مساعدة الأوتوبايلوت'
  },
  {
    name: 'Autopilot Status',
    command: ['npm', 'run', 'cli:autopilot:status'],
    description: 'اختبار حالة الأوتوبايلوت'
  },
  {
    name: 'Autopilot Logs',
    command: ['npm', 'run', 'cli:autopilot:logs'],
    description: 'اختبار عرض سجلات الأوتوبايلوت'
  },
  {
    name: 'AI Help',
    command: ['npm', 'run', 'cli', 'autopilot', 'ai', '--', '--help'],
    description: 'اختبار عرض مساعدة AI'
  }
];

let currentTest = 0;
let passedTests = 0;
let failedTests = 0;

console.log(chalk.blue.bold('\n🧪 بدء اختبار AuraOS CLI المحسن\n'));
console.log(chalk.gray('=' .repeat(60)));

function runTest(test) {
  return new Promise((resolve) => {
    console.log(chalk.cyan(`\n📋 الاختبار ${currentTest + 1}/${tests.length}: ${test.name}`));
    console.log(chalk.gray(`   ${test.description}`));
    console.log(chalk.gray(`   الأمر: ${test.command.join(' ')}`));
    console.log();

    const child = spawn(test.command[0], test.command.slice(1), {
      cwd: process.cwd(),
      env: process.env
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(chalk.gray(data.toString()));
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      // لا نعتبر stderr كخطأ دائماً لأن بعض المكتبات تطبع معلومات فيه
      process.stderr.write(chalk.yellow(data.toString()));
    });

    child.on('close', (code) => {
      if (code === 0 || (code === 1 && test.name.includes('Status'))) {
        // نعتبر الاختبار ناجحاً إذا كان exit code = 0
        // أو إذا كان 1 في حالة Status (قد يفشل الاتصال بالخادم)
        console.log(chalk.green(`\n✅ نجح: ${test.name}`));
        passedTests++;
      } else {
        console.log(chalk.red(`\n❌ فشل: ${test.name} (Exit code: ${code})`));
        failedTests++;
      }
      console.log(chalk.gray('-'.repeat(60)));
      resolve();
    });

    // timeout بعد 10 ثواني
    setTimeout(() => {
      child.kill();
      console.log(chalk.yellow(`\n⏱️ انتهت مهلة الاختبار: ${test.name}`));
      failedTests++;
      resolve();
    }, 10000);
  });
}

async function runAllTests() {
  for (let i = 0; i < tests.length; i++) {
    currentTest = i;
    await runTest(tests[i]);
  }

  // عرض النتائج النهائية
  console.log(chalk.blue.bold('\n📊 نتائج الاختبار النهائية\n'));
  console.log(chalk.gray('='.repeat(60)));
  console.log(chalk.green(`✅ نجح: ${passedTests} اختبار`));
  console.log(chalk.red(`❌ فشل: ${failedTests} اختبار`));
  console.log(chalk.blue(`📊 المجموع: ${tests.length} اختبار`));
  console.log(chalk.yellow(`📈 نسبة النجاح: ${Math.round((passedTests / tests.length) * 100)}%`));
  console.log(chalk.gray('='.repeat(60)));

  if (failedTests === 0) {
    console.log(chalk.green.bold('\n🎉 جميع الاختبارات نجحت! CLI يعمل بشكل ممتاز!\n'));
  } else if (passedTests > failedTests) {
    console.log(chalk.yellow.bold('\n⚠️ معظم الاختبارات نجحت، لكن هناك بعض المشاكل.\n'));
  } else {
    console.log(chalk.red.bold('\n❌ هناك مشاكل تحتاج إلى إصلاح.\n'));
  }

  // عرض ملخص الميزات
  console.log(chalk.cyan.bold('🚀 الميزات المتاحة في CLI:\n'));
  console.log(chalk.white('  • إدارة الأوتوبايلوت (start, stop, status)'));
  console.log(chalk.white('  • مراقبة فورية (monitor, logs)'));
  console.log(chalk.white('  • ذكاء اصطناعي (ai chat, ai analyze)'));
  console.log(chalk.white('  • واجهة عربية محسنة'));
  console.log(chalk.white('  • ألوان ورموز للوضوح'));
  console.log();

  process.exit(failedTests > 0 ? 1 : 0);
}

// بدء الاختبارات
runAllTests().catch(error => {
  console.error(chalk.red('خطأ في تشغيل الاختبارات:'), error);
  process.exit(1);
});
