#!/usr/bin/env node

/**
 * اختبار شامل لـ GitHub MCP Server Integration
 * يختبر جميع الميزات الجديدة للتكامل مع GitHub
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

// قائمة الاختبارات
const tests = [
  {
    name: 'GitHub Repository Info',
    command: ['npm', 'run', 'cli:github:info'],
    description: 'اختبار عرض معلومات المستودع',
  },
  {
    name: 'GitHub Issues List',
    command: ['npm', 'run', 'cli:github:issues'],
    description: 'اختبار عرض قائمة المشاكل',
  },
  {
    name: 'GitHub Pull Requests',
    command: ['npm', 'run', 'cli:github:prs'],
    description: 'اختبار عرض طلبات السحب',
  },
  {
    name: 'GitHub Code Analysis',
    command: [
      'npm',
      'run',
      'cli:github:analyze',
      '--',
      'cli.ts',
      '--type',
      'quality',
    ],
    description: 'اختبار تحليل جودة الكود',
  },
  {
    name: 'GitHub Security Analysis',
    command: [
      'npm',
      'run',
      'cli:github:analyze',
      '--',
      'package.json',
      '--type',
      'security',
    ],
    description: 'اختبار تحليل الأمان',
  },
  {
    name: 'GitHub Performance Analysis',
    command: [
      'npm',
      'run',
      'cli:github:analyze',
      '--',
      'server/',
      '--type',
      'performance',
    ],
    description: 'اختبار تحليل الأداء',
  },
];

// دالة تشغيل الاختبار
async function runTest(test) {
  return new Promise(resolve => {
    console.log(chalk.blue(`\n🧪 Running: ${test.name}`));
    console.log(chalk.gray(`📝 ${test.description}`));
    console.log(chalk.gray(`⚡ Command: ${test.command.join(' ')}`));

    const startTime = Date.now();
    const child = spawn(test.command[0], test.command.slice(1), {
      stdio: 'pipe',
      shell: true,
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', data => {
      output += data.toString();
    });

    child.stderr.on('data', data => {
      errorOutput += data.toString();
    });

    child.on('close', code => {
      const duration = Date.now() - startTime;

      if (code === 0) {
        console.log(chalk.green(`✅ ${test.name} - PASSED`));
        console.log(chalk.gray(`⏱️  Duration: ${duration}ms`));

        // عرض جزء من الناتج
        if (output.length > 0) {
          const lines = output.split('\n').slice(0, 5);
          console.log(chalk.gray('📄 Output preview:'));
          lines.forEach(line => {
            if (line.trim()) {
              console.log(chalk.gray(`   ${line}`));
            }
          });
          if (output.split('\n').length > 5) {
            console.log(chalk.gray('   ...'));
          }
        }
      } else {
        console.log(chalk.red(`❌ ${test.name} - FAILED`));
        console.log(chalk.gray(`⏱️  Duration: ${duration}ms`));
        console.log(chalk.gray(`🔢 Exit code: ${code}`));

        if (errorOutput.length > 0) {
          console.log(chalk.red('📄 Error output:'));
          const errorLines = errorOutput.split('\n').slice(0, 3);
          errorLines.forEach(line => {
            if (line.trim()) {
              console.log(chalk.red(`   ${line}`));
            }
          });
        }
      }

      resolve({
        name: test.name,
        passed: code === 0,
        duration,
        output: output.substring(0, 500),
        error: errorOutput.substring(0, 500),
      });
    });

    // timeout بعد 30 ثانية
    setTimeout(() => {
      child.kill();
      resolve({
        name: test.name,
        passed: false,
        duration: 30000,
        output: '',
        error: 'Test timed out after 30 seconds',
      });
    }, 30000);
  });
}

// دالة تشغيل جميع الاختبارات
async function runAllTests() {
  console.log(chalk.blue.bold('\n🚀 GitHub MCP Server Integration Tests\n'));
  console.log(
    chalk.gray('Testing GitHub integration with AuraOS Autopilot...\n')
  );

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }

    // انتظار قصير بين الاختبارات
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // عرض النتائج النهائية
  console.log(chalk.blue.bold('\n📊 Test Results Summary\n'));
  console.log(chalk.green(`✅ Passed: ${passed}`));
  console.log(chalk.red(`❌ Failed: ${failed}`));
  console.log(chalk.blue(`📈 Total: ${results.length}`));

  const totalDuration = results.reduce(
    (sum, result) => sum + result.duration,
    0
  );
  console.log(chalk.gray(`⏱️  Total Duration: ${totalDuration}ms`));

  // عرض تفاصيل الاختبارات الفاشلة
  const failedTests = results.filter(result => !result.passed);
  if (failedTests.length > 0) {
    console.log(chalk.red.bold('\n❌ Failed Tests Details:\n'));
    failedTests.forEach(test => {
      console.log(chalk.red(`• ${test.name}`));
      if (test.error) {
        console.log(chalk.gray(`  Error: ${test.error}`));
      }
    });
  }

  // اقتراحات للتحسين
  console.log(chalk.yellow.bold('\n💡 Suggestions:\n'));
  console.log(
    '1. Make sure GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO are set in .env'
  );
  console.log('2. Verify GitHub token has necessary permissions');
  console.log('3. Check if the repository exists and is accessible');
  console.log('4. Ensure all dependencies are installed: npm install');
  console.log('5. Test individual commands manually for debugging');

  // إنهاء البرنامج
  process.exit(failed > 0 ? 1 : 0);
}

// تشغيل الاختبارات
runAllTests().catch(error => {
  console.error(chalk.red('❌ Test runner error:'), error.message);
  process.exit(1);
});
