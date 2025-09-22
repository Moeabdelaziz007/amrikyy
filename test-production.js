// AuraOS Production Tests - اختبارات الإنتاج الشاملة
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 بدء اختبارات الإنتاج لـ AuraOS...\n');

// نتائج الاختبارات
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

// دالة تسجيل النتائج
function logTest(testName, passed, message = '') {
  testResults.tests.push({ testName, passed, message });
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}: ${message}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: ${message}`);
  }
}

// اختبار 1: فحص ملفات الإنتاج
function testProductionFiles() {
  console.log('\n📁 اختبار ملفات الإنتاج...');

  const requiredFiles = [
    'package.json',
    'Dockerfile.production',
    'production.env',
    'security-headers.js',
    'sw.js',
    'firebase.json',
    'manifest.json',
  ];

  requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    logTest(`ملف ${file}`, exists, exists ? 'موجود' : 'مفقود');
  });
}

// اختبار 2: فحص التبعيات
function testDependencies() {
  console.log('\n📦 اختبار التبعيات...');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // فحص التبعيات الأساسية
    const requiredDeps = [
      'react',
      'react-dom',
      'typescript',
      'vite',
      'firebase',
      'tailwindcss',
      'express',
    ];

    requiredDeps.forEach(dep => {
      const exists =
        packageJson.dependencies[dep] || packageJson.devDependencies[dep];
      logTest(
        `تبعية ${dep}`,
        !!exists,
        exists ? `الإصدار: ${exists}` : 'مفقودة'
      );
    });

    // فحص scripts
    const requiredScripts = ['build', 'start', 'dev'];
    requiredScripts.forEach(script => {
      const exists = packageJson.scripts[script];
      logTest(`سكريبت ${script}`, !!exists, exists ? 'موجود' : 'مفقود');
    });
  } catch (error) {
    logTest('قراءة package.json', false, error.message);
  }
}

// اختبار 3: فحص إعدادات الأمان
function testSecurityConfig() {
  console.log('\n🔒 اختبار إعدادات الأمان...');

  try {
    const securityFile = fs.readFileSync('security-headers.js', 'utf8');

    const securityChecks = [
      'contentSecurityPolicy',
      'hsts',
      'frameguard',
      'noSniff',
      'referrerPolicy',
    ];

    securityChecks.forEach(check => {
      const exists = securityFile.includes(check);
      logTest(`إعداد أمان ${check}`, exists, exists ? 'موجود' : 'مفقود');
    });
  } catch (error) {
    logTest('ملف الأمان', false, error.message);
  }
}

// اختبار 4: فحص Service Worker
function testServiceWorker() {
  console.log('\n⚙️ اختبار Service Worker...');

  try {
    const swFile = fs.readFileSync('sw.js', 'utf8');

    const swChecks = [
      'CACHE_NAME',
      'STATIC_ASSETS',
      'install',
      'activate',
      'fetch',
    ];

    swChecks.forEach(check => {
      const exists = swFile.includes(check);
      logTest(`ميزة SW ${check}`, exists, exists ? 'موجود' : 'مفقود');
    });
  } catch (error) {
    logTest('Service Worker', false, error.message);
  }
}

// اختبار 5: فحص Docker
function testDockerConfig() {
  console.log('\n🐳 اختبار إعدادات Docker...');

  try {
    const dockerFile = fs.readFileSync('Dockerfile.production', 'utf8');

    const dockerChecks = [
      'FROM node:18-alpine',
      'WORKDIR /app',
      'EXPOSE 3001',
      'HEALTHCHECK',
      'USER auraos',
    ];

    dockerChecks.forEach(check => {
      const exists = dockerFile.includes(check);
      logTest(
        `إعداد Docker ${check.split(' ')[0]}`,
        exists,
        exists ? 'موجود' : 'مفقود'
      );
    });
  } catch (error) {
    logTest('Dockerfile', false, error.message);
  }
}

// اختبار 6: فحص Firebase
function testFirebaseConfig() {
  console.log('\n🔥 اختبار إعدادات Firebase...');

  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));

    const firebaseChecks = ['hosting', 'public', 'rewrites', 'headers'];

    firebaseChecks.forEach(check => {
      const exists = firebaseConfig[check];
      logTest(`إعداد Firebase ${check}`, !!exists, exists ? 'موجود' : 'مفقود');
    });
  } catch (error) {
    logTest('إعدادات Firebase', false, error.message);
  }
}

// اختبار 7: فحص PWA
function testPWAConfig() {
  console.log('\n📱 اختبار إعدادات PWA...');

  try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

    const pwaChecks = [
      'name',
      'short_name',
      'start_url',
      'display',
      'icons',
      'theme_color',
    ];

    pwaChecks.forEach(check => {
      const exists = manifest[check];
      logTest(`إعداد PWA ${check}`, !!exists, exists ? 'موجود' : 'مفقود');
    });
  } catch (error) {
    logTest('إعدادات PWA', false, error.message);
  }
}

// اختبار 8: فحص Tailwind
function testTailwindConfig() {
  console.log('\n🎨 اختبار إعدادات Tailwind...');

  try {
    const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');

    const tailwindChecks = [
      'neon',
      'cyberpunk',
      'glassmorphism',
      'darkMode',
      'content',
    ];

    tailwindChecks.forEach(check => {
      const exists = tailwindConfig.includes(check);
      logTest(`إعداد Tailwind ${check}`, exists, exists ? 'موجود' : 'مفقود');
    });
  } catch (error) {
    logTest('إعدادات Tailwind', false, error.message);
  }
}

// تشغيل جميع الاختبارات
async function runAllTests() {
  testProductionFiles();
  testDependencies();
  testSecurityConfig();
  testServiceWorker();
  testDockerConfig();
  testFirebaseConfig();
  testPWAConfig();
  testTailwindConfig();

  // عرض النتائج النهائية
  console.log('\n📊 نتائج الاختبارات النهائية:');
  console.log(`✅ نجح: ${testResults.passed}`);
  console.log(`❌ فشل: ${testResults.failed}`);
  console.log(
    `📈 معدل النجاح: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`
  );

  // حفظ النتائج
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 تم حفظ التقرير في: ${reportPath}`);

  // إرجاع النتيجة
  if (testResults.failed === 0) {
    console.log('\n🎉 جميع الاختبارات نجحت! المشروع جاهز للإنتاج.');
    process.exit(0);
  } else {
    console.log('\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء قبل النشر.');
    process.exit(1);
  }
}

// تشغيل الاختبارات
runAllTests().catch(error => {
  console.error('❌ خطأ في تشغيل الاختبارات:', error);
  process.exit(1);
});
