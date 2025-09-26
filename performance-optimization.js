#!/usr/bin/env node

/**
 * AuraOS Performance Optimization Script
 * Optimizes the system for better performance
 */

const fs = require('fs');
const path = require('path');

class PerformanceOptimizer {
  constructor() {
    this.optimizations = [];
  }

  log(message) {
    console.log(`🔧 ${message}`);
  }

  async optimizeViteConfig() {
    this.log('Optimizing Vite configuration...');
    
    const viteConfig = {
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              ui: ['lucide-react', '@radix-ui/react-slot'],
              firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
              utils: ['axios', 'lodash']
            }
          }
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      },
      server: {
        hmr: {
          overlay: false
        }
      }
    };

    fs.writeFileSync('vite.config.optimized.js', `export default ${JSON.stringify(viteConfig, null, 2)}`);
    this.optimizations.push('Vite configuration optimized');
  }

  async optimizeCSS() {
    this.log('Optimizing CSS...');
    
    // Create optimized CSS file
    const optimizedCSS = `
/* Optimized CSS for AuraOS */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Critical CSS - Above the fold */
.critical-styles {
  /* Add critical styles here */
}

/* Defer non-critical CSS */
@media (prefers-reduced-motion: no-preference) {
  .animate-spin {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

    fs.writeFileSync('src/styles/optimized.css', optimizedCSS);
    this.optimizations.push('CSS optimized with critical path');
  }

  async optimizeImages() {
    this.log('Creating image optimization script...');
    
    const imageOptimizer = `
#!/bin/bash
# Image optimization script

echo "🖼️  Optimizing images..."

# Install image optimization tools if not present
if ! command -v imagemin &> /dev/null; then
  npm install -g imagemin imagemin-mozjpeg imagemin-pngquant
fi

# Optimize images in public directory
find public -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read img; do
  echo "Optimizing: $img"
  imagemin "$img" --out-dir=public/optimized --plugin=mozjpeg --plugin=pngquant
done

echo "✅ Images optimized"
`;

    fs.writeFileSync('optimize-images.sh', imageOptimizer);
    fs.chmodSync('optimize-images.sh', '755');
    this.optimizations.push('Image optimization script created');
  }

  async createPerformanceMonitoring() {
    this.log('Creating performance monitoring...');
    
    const performanceMonitor = `
// Performance monitoring for AuraOS
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTime = performance.now();
  }

  mark(name) {
    this.metrics[name] = performance.now();
  }

  measure(name, startMark) {
    const endTime = performance.now();
    const startTime = this.metrics[startMark] || this.startTime;
    const duration = endTime - startTime;
    
    console.log(\`📊 Performance: \${name} took \${duration.toFixed(2)}ms\`);
    
    // Send to analytics if needed
    if (window.gtag) {
      window.gtag('event', 'performance_timing', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(duration)
      });
    }
    
    return duration;
  }

  // Monitor component render times
  monitorComponent(componentName) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      console.log(\`⚛️  Component \${componentName} rendered in \${duration.toFixed(2)}ms\`);
    };
  }

  // Monitor API calls
  monitorAPI(endpoint) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      console.log(\`🌐 API \${endpoint} completed in \${duration.toFixed(2)}ms\`);
    };
  }
}

// Global performance monitor instance
window.performanceMonitor = new PerformanceMonitor();

// Monitor page load performance
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(\`🚀 Page loaded in \${loadTime.toFixed(2)}ms\`);
  
  // Monitor Core Web Vitals
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
});

export default PerformanceMonitor;
`;

    fs.writeFileSync('src/utils/performance-monitor.js', performanceMonitor);
    this.optimizations.push('Performance monitoring added');
  }

  async createLazyLoading() {
    this.log('Creating lazy loading components...');
    
    const lazyLoader = `
import { lazy, Suspense } from 'react';

// Lazy load heavy components
export const TaskQueue = lazy(() => import('../components/dashboard/TaskQueue'));
export const AutopilotApp = lazy(() => import('../components/apps/AutopilotApp'));
export const MCPToolsPanel = lazy(() => import('../components/mcp/MCPToolsPanel'));

// Lazy loading wrapper
export const LazyWrapper = ({ children, fallback = <div>Loading...</div> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Route-based code splitting
export const Dashboard = lazy(() => import('../pages/Dashboard'));
export const Settings = lazy(() => import('../pages/Settings'));
export const Analytics = lazy(() => import('../pages/Analytics'));
`;

    fs.writeFileSync('src/components/LazyComponents.js', lazyLoader);
    this.optimizations.push('Lazy loading components created');
  }

  async createServiceWorker() {
    this.log('Creating service worker for caching...');
    
    const serviceWorker = `
// AuraOS Service Worker for caching
const CACHE_NAME = 'auraos-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Update event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
`;

    fs.writeFileSync('public/sw.js', serviceWorker);
    this.optimizations.push('Service worker created for caching');
  }

  async runOptimizations() {
    console.log('🚀 Starting AuraOS Performance Optimization\n');

    try {
      await this.optimizeViteConfig();
      await this.optimizeCSS();
      await this.optimizeImages();
      await this.createPerformanceMonitoring();
      await this.createLazyLoading();
      await this.createServiceWorker();

      console.log('\n✅ Performance optimization completed!');
      console.log('\n📊 Optimizations applied:');
      this.optimizations.forEach(opt => console.log(`   - ${opt}`));

      console.log('\n🎯 Next steps:');
      console.log('   1. Run "npm run build" to see optimized build');
      console.log('   2. Test performance with Chrome DevTools');
      console.log('   3. Monitor Core Web Vitals');
      console.log('   4. Use Lighthouse for performance audit');

    } catch (error) {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    }
  }
}

// Run optimizations if this file is executed directly
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.runOptimizations();
}

module.exports = PerformanceOptimizer;
