import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Rocket, Zap, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AuraOSLanding() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleLaunch = async () => {
    setIsLaunching(true);

    // Simulate OS launch process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Here you would typically navigate to the main OS interface
    console.log('AuraOS launching...');
    setIsLaunching(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* 🔹 Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mb-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
            <motion.p
              className="text-purple-400 text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              تهيئة النظام الكوانتمي...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="flex flex-col items-center justify-center flex-grow text-center px-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Hero Section */}
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              AuraOS
            </motion.h1>

            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="text-purple-400 font-semibold">
                نظام تشغيلي كوانتمي
              </span>
              <Zap className="w-6 h-6 text-cyan-400" />
            </motion.div>

            <motion.p
              className="text-xl max-w-3xl mb-8 text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              النظام التشغيلي الكوانتمي الأول من نوعه — يجمع بين{' '}
              <span className="text-purple-400 font-semibold flex items-center justify-center gap-1">
                <Brain className="w-5 h-5" />
                الذكاء الاصطناعي
              </span>
              و{' '}
              <span className="text-cyan-400 font-semibold">
                الإبداع البشري
              </span>
              لبناء تجربة تشغيل مستقبلية تتجاوز حدود التقنية الحالية.
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="text-purple-400 text-2xl mb-2">🧠</div>
                <h3 className="text-lg font-semibold mb-2">
                  ذكاء اصطناعي متقدم
                </h3>
                <p className="text-gray-400 text-sm">
                  تعلم وتكيف مستمر مع احتياجاتك
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
                <div className="text-cyan-400 text-2xl mb-2">⚡</div>
                <h3 className="text-lg font-semibold mb-2">أداء كوانتمي</h3>
                <p className="text-gray-400 text-sm">
                  سرعة فائقة في جميع العمليات
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="text-purple-400 text-2xl mb-2">🎨</div>
                <h3 className="text-lg font-semibold mb-2">إبداع لا محدود</h3>
                <p className="text-gray-400 text-sm">أدوات إبداعية متطورة</p>
              </div>
            </motion.div>

            {/* Launch Button */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <Button
                onClick={handleLaunch}
                disabled={isLaunching}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-12 py-6 rounded-2xl shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLaunching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    جاري التشغيل...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    🚀 تشغيل النظام
                  </>
                )}
              </Button>
            </motion.div>

            {/* Status Indicator */}
            <motion.div
              className="mt-8 flex items-center gap-2 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">النظام جاهز للتشغيل</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Background Effects */}
      <motion.div
        className="absolute bottom-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-[-200px] left-[-200px] w-[400px] h-[400px] rounded-full bg-cyan-600/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.1, 0.3],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 🔹 Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
