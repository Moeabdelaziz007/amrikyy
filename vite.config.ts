import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [
    react({
      // تحسين React
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
      // تحسين التطوير
      fastRefresh: true,
      // تحسين الإنتاج
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // تحسين الأداء المتقدم
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    // تقسيم الكود المحسن
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // فصل مكتبات React
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // فصل مكتبات UI
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          // فصل مكتبات Firebase
          if (id.includes('firebase')) {
            return 'firebase-vendor';
          }
          // فصل مكتبات AI
          if (id.includes('openai') || id.includes('@google/genai')) {
            return 'ai-vendor';
          }
          // فصل مكتبات أخرى
          if (id.includes('axios') || id.includes('date-fns') || id.includes('clsx')) {
            return 'utils-vendor';
          }
          // فصل مكتبات التطوير
          if (id.includes('node_modules') && !id.includes('react') && !id.includes('firebase')) {
            return 'vendor';
          }
        },
        // تحسين أسماء الملفات
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
        // تحسين التحميل
        experimentalMinChunkSize: 20000,
      },
      // تحسين الأداء
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // تحسين الحجم
    chunkSizeWarningLimit: 500,
    // تحسين التحميل
    target: 'esnext',
    cssCodeSplit: true,
    // تحسين CSS
    cssMinify: true,
    // تحسين المصادر
    sourcemap: process.env.NODE_ENV === 'development',
    // تحسين الأداء
    reportCompressedSize: false,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // تحسين الأداء في التطوير
    hmr: {
      overlay: false,
    },
  },
  // تحسين الأداء العام المتقدم
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'openai',
      'axios',
      'date-fns',
      'clsx',
      'lucide-react',
    ],
    exclude: [
      '@replit/vite-plugin-cartographer', 
      '@replit/vite-plugin-dev-banner',
      'rollup-plugin-visualizer'
    ],
    // تحسين التحميل
    force: true,
  },
  // تحسين التحميل المتقدم
  esbuild: {
    target: 'esnext',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // تحسين الأداء
    treeShaking: true,
    // تحسين التطوير
    jsx: 'automatic',
    // تحسين الإنتاج
    drop: ['console', 'debugger'],
  },
  // تحسين الأداء الإضافي
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
  },
});
