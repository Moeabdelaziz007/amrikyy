// AuraOS Performance Tests - اختبارات الأداء
const fs = require('fs');
const path = require('path');

console.log('⚡ بدء اختبارات الأداء لـ AuraOS...\n');

// نتائج اختبارات الأداء
const performanceResults = {
  bundleSize: {},
  loadTime: {},
  optimization: {}
};

// اختبار حجم الحزمة
function testBundleSize() {
  console.log('📦 اختبار حجم الحزمة...');
  
  const distPath = path.join(__dirname, 'client', 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('⚠️ مجلد dist غير موجود. قم بتشغيل npm run build أولاً.');
    return;
  }
  
  function getDirectorySize(dirPath) {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += stat.size;
      }
    });
    
    return totalSize;
  }
  
  const totalSize = getDirectorySize(distPath);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  performanceResults.bundleSize = {
    totalSize,
    totalSizeMB,
    status: totalSize < 5 * 1024 * 1024 ? 'good' : 'needs-optimization'
  };
  
  console.log(`📊 إجمالي حجم الحزمة: ${totalSizeMB} MB`);
  
  // تحليل الملفات الكبيرة
  function analyzeLargeFiles(dirPath, basePath = '') {
    const files = fs.readdirSync(dirPath);
    const largeFiles = [];
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && stat.size > 100 * 1024) { // أكبر من 100KB
        const relativePath = path.join(basePath, file);
        largeFiles.push({
          path: relativePath,
          size: stat.size,
          sizeKB: (stat.size / 1024).toFixed(2)
        });
      } else if (stat.isDirectory()) {
        largeFiles.push(...analyzeLargeFiles(filePath, path.join(basePath, file)));
      }
    });
    
    return largeFiles.sort((a, b) => b.size - a.size);
  }
  
  const largeFiles = analyzeLargeFiles(distPath);
  
  if (largeFiles.length > 0) {
    console.log('\n📋 الملفات الكبيرة (>100KB):');
    largeFiles.slice(0, 10).forEach(file => {
      console.log(`  ${file.path}: ${file.sizeKB} KB`);
    });
  }
}

// اختبار تحسينات Vite
function testViteOptimizations() {
  console.log('\n⚙️ اختبار تحسينات Vite...');
  
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  
  if (!fs.existsSync(viteConfigPath)) {
    console.log('❌ ملف vite.config.ts غير موجود');
    return;
  }
  
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  const optimizations = [
    { name: 'Terser Minification', check: 'minify: \'terser\'' },
    { name: 'Code Splitting', check: 'manualChunks' },
    { name: 'Tree Shaking', check: 'treeshake' },
    { name: 'CSS Code Split', check: 'cssCodeSplit: true' },
    { name: 'Bundle Analyzer', check: 'rollup-plugin-visualizer' },
    { name: 'Console Removal', check: 'drop_console' },
    { name: 'Source Map (Dev Only)', check: 'sourcemap: process.env.NODE_ENV' }
  ];
  
  optimizations.forEach(opt => {
    const exists = viteConfig.includes(opt.check);
    performanceResults.optimization[opt.name] = exists;
    console.log(`${exists ? '✅' : '❌'} ${opt.name}: ${exists ? 'مفعل' : 'غير مفعل'}`);
  });
}

// اختبار تحسينات Tailwind
function testTailwindOptimizations() {
  console.log('\n🎨 اختبار تحسينات Tailwind...');
  
  const tailwindConfigPath = path.join(__dirname, 'tailwind.config.ts');
  
  if (!fs.existsSync(tailwindConfigPath)) {
    console.log('❌ ملف tailwind.config.ts غير موجود');
    return;
  }
  
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
  
  const optimizations = [
    { name: 'Purge Content', check: 'content: [' },
    { name: 'Dark Mode', check: 'darkMode' },
    { name: 'Custom Colors', check: 'neon:' },
    { name: 'Custom Animations', check: 'neon-pulse' },
    { name: 'Custom Fonts', check: 'cyberpunk:' }
  ];
  
  optimizations.forEach(opt => {
    const exists = tailwindConfig.includes(opt.check);
    performanceResults.optimization[`Tailwind ${opt.name}`] = exists;
    console.log(`${exists ? '✅' : '❌'} ${opt.name}: ${exists ? 'مفعل' : 'غير مفعل'}`);
  });
}

// اختبار Service Worker
function testServiceWorkerOptimizations() {
  console.log('\n⚙️ اختبار تحسينات Service Worker...');
  
  const swPath = path.join(__dirname, 'sw.js');
  
  if (!fs.existsSync(swPath)) {
    console.log('❌ ملف sw.js غير موجود');
    return;
  }
  
  const swContent = fs.readFileSync(swPath, 'utf8');
  
  const optimizations = [
    { name: 'Static Caching', check: 'STATIC_ASSETS' },
    { name: 'Dynamic Caching', check: 'DYNAMIC_CACHE' },
    { name: 'Cache First Strategy', check: 'cacheFirst' },
    { name: 'Network First Strategy', check: 'networkFirst' },
    { name: 'Stale While Revalidate', check: 'staleWhileRevalidate' },
    { name: 'Cache Cleanup', check: 'caches.delete' }
  ];
  
  optimizations.forEach(opt => {
    const exists = swContent.includes(opt.check);
    performanceResults.optimization[`SW ${opt.name}`] = exists;
    console.log(`${exists ? '✅' : '❌'} ${opt.name}: ${exists ? 'مفعل' : 'غير مفعل'}`);
  });
}

// تقييم الأداء العام
function evaluatePerformance() {
  console.log('\n📊 تقييم الأداء العام...');
  
  let score = 0;
  let totalChecks = 0;
  
  // تقييم حجم الحزمة
  if (performanceResults.bundleSize.totalSizeMB) {
    totalChecks++;
    if (parseFloat(performanceResults.bundleSize.totalSizeMB) < 2) {
      score += 1;
      console.log('✅ حجم الحزمة ممتاز (<2MB)');
    } else if (parseFloat(performanceResults.bundleSize.totalSizeMB) < 5) {
      score += 0.7;
      console.log('⚠️ حجم الحزمة جيد (<5MB)');
    } else {
      console.log('❌ حجم الحزمة كبير (>5MB)');
    }
  }
  
  // تقييم التحسينات
  const optimizationCount = Object.values(performanceResults.optimization).filter(Boolean).length;
  const totalOptimizations = Object.keys(performanceResults.optimization).length;
  
  if (totalOptimizations > 0) {
    totalChecks++;
    const optimizationScore = optimizationCount / totalOptimizations;
    score += optimizationScore;
    console.log(`📈 تحسينات مفعلة: ${optimizationCount}/${totalOptimizations} (${(optimizationScore * 100).toFixed(1)}%)`);
  }
  
  // النتيجة النهائية
  const finalScore = totalChecks > 0 ? (score / totalChecks) * 100 : 0;
  
  console.log(`\n🏆 نتيجة الأداء النهائية: ${finalScore.toFixed(1)}%`);
  
  if (finalScore >= 90) {
    console.log('🎉 أداء ممتاز! المشروع محسن بالكامل.');
  } else if (finalScore >= 70) {
    console.log('👍 أداء جيد، يمكن تحسينه أكثر.');
  } else if (finalScore >= 50) {
    console.log('⚠️ أداء متوسط، يحتاج تحسين.');
  } else {
    console.log('❌ أداء ضعيف، يحتاج تحسين عاجل.');
  }
  
  // توصيات التحسين
  console.log('\n💡 توصيات التحسين:');
  
  if (performanceResults.bundleSize.totalSizeMB && parseFloat(performanceResults.bundleSize.totalSizeMB) > 2) {
    console.log('  - تقليل حجم الحزمة باستخدام code splitting');
    console.log('  - تحسين الصور والملفات الثابتة');
  }
  
  if (optimizationCount < totalOptimizations * 0.8) {
    console.log('  - تفعيل المزيد من تحسينات Vite');
    console.log('  - تحسين إعدادات Tailwind');
  }
  
  console.log('  - استخدام lazy loading للمكونات');
  console.log('  - تحسين Service Worker للتحميل المؤقت');
}

// تشغيل جميع اختبارات الأداء
function runPerformanceTests() {
  testBundleSize();
  testViteOptimizations();
  testTailwindOptimizations();
  testServiceWorkerOptimizations();
  evaluatePerformance();
  
  // حفظ النتائج
  const reportPath = path.join(__dirname, 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(performanceResults, null, 2));
  console.log(`\n📄 تم حفظ تقرير الأداء في: ${reportPath}`);
}

// تشغيل الاختبارات
runPerformanceTests();
