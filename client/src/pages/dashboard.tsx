import React from 'react';
import { AmrikyyOSSidebar } from '@/components/layout/amrikyyos-sidebar';
import { AmrikyyOSCard, AmrikyyOSCardHeader, AmrikyyOSCardContent } from '@/components/ui/amrikyyos-card';
import { AmrikyyOSButton } from '@/components/ui/amrikyyos-button';
import { PopupQuickAccess } from '@/components/ui/popup-navigation';
import {
  Zap,
  Brain,
  Rocket,
  Shield,
  BarChart3,
  Users,
  Settings,
  Play,
  Star
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent relative">
      <AmrikyyOSSidebar variant="ai" className="relative z-20" />
      <div className="flex-1 flex flex-col overflow-hidden amrikyyos-ai-main relative z-20">
        {/* Header */}
        <header className="amrikyyos-ai-nav px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                🚀 AmrikyyOS Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                نظام تشغيلي كوانتمي مدعوم بالذكاء الاصطناعي
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <AmrikyyOSButton variant="ai" size="sm" glow className="hidden sm:flex">
                <Play className="w-4 h-4" />
                <span className="hidden lg:inline">تشغيل النظام</span>
                <span className="lg:hidden">تشغيل</span>
              </AmrikyyOSButton>
              <AmrikyyOSButton variant="ai" size="sm" glow className="sm:hidden">
                <Play className="w-3 h-3" />
              </AmrikyyOSButton>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                مرحباً بك في AmrikyyOS
                </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                النظام التشغيلي الكوانتمي الأول من نوعه - يجمع بين الذكاء الاصطناعي والإبداع البشري
                </p>
              </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <AmrikyyOSCard variant="ai" glow>
                <AmrikyyOSCardContent className="text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    الأداء الكوانتمي
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">99.9%</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    كفاءة النظام
                  </p>
                </AmrikyyOSCardContent>
              </AmrikyyOSCard>

              <AmrikyyOSCard variant="ai" glow>
                <AmrikyyOSCardContent className="text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    الذكاء الاصطناعي
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-blue-500">24/7</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    نشط ومتاح
                  </p>
                </AmrikyyOSCardContent>
              </AmrikyyOSCard>

              <AmrikyyOSCard variant="ai" glow>
                <AmrikyyOSCardContent className="text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    المستخدمون النشطون
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-purple-500">1,247</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    متصلون الآن
                  </p>
                </AmrikyyOSCardContent>
              </AmrikyyOSCard>

              <AmrikyyOSCard variant="ai" glow>
                <AmrikyyOSCardContent className="text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    الأمان
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-orange-500">100%</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    محمي ومؤمن
                  </p>
                </AmrikyyOSCardContent>
              </AmrikyyOSCard>
            </div>

            {/* Main Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              <AmrikyyOSCard variant="ai">
                <AmrikyyOSCardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      البدء السريع
                    </h3>
              </div>
                </AmrikyyOSCardHeader>
                <AmrikyyOSCardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                    ابدأ رحلتك مع AmrikyyOS من خلال استكشاف الأدوات والميزات المتقدمة
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <AmrikyyOSButton variant="ai" fullWidth size="sm">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">استكشاف الذكاء الاصطناعي</span>
                    </AmrikyyOSButton>
                    <AmrikyyOSButton variant="secondary" fullWidth size="sm">
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">عرض التحليلات</span>
                    </AmrikyyOSButton>
                    <AmrikyyOSButton variant="secondary" fullWidth size="sm">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">إعدادات النظام</span>
                    </AmrikyyOSButton>
                  </div>
                </AmrikyyOSCardContent>
              </AmrikyyOSCard>

              <AmrikyyOSCard variant="ai">
                <AmrikyyOSCardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      الميزات المتقدمة
                    </h3>
                  </div>
                </AmrikyyOSCardHeader>
                <AmrikyyOSCardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">أتمتة ذكية</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">أتمتة المهام المعقدة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">تعلم آلي</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">يتكيف مع احتياجاتك</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">أمان متقدم</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">حماية شاملة</p>
                      </div>
                    </div>
              </div>
                </AmrikyyOSCardContent>
              </AmrikyyOSCard>
            </div>

            {/* System Status */}
            <AmrikyyOSCard variant="glass">
              <AmrikyyOSCardHeader className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  حالة النظام
                </h3>
              </AmrikyyOSCardHeader>
              <AmrikyyOSCardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">الخوادم</h4>
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">جميعها تعمل بشكل طبيعي</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">قاعدة البيانات</h4>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">متصل ومستقر</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">الذكاء الاصطناعي</h4>
                    <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">نشط ومستجيب</p>
                  </div>
                </div>
              </AmrikyyOSCardContent>
            </AmrikyyOSCard>
          </div>
        </main>
      </div>
      
      {/* Popup Quick Access for Development */}
      <PopupQuickAccess />
    </div>
  );
}
