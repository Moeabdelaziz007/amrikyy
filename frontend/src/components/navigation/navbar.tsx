'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Share2, Home, Sparkles, BarChart3, Sun, Moon, Globe, Menu, X, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/enhanced-button'
import { useTheme } from '@/components/ui/theme-provider'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme, language, setLanguage } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    {
      href: '/',
      label: 'Chat Assistant',
      icon: MessageSquare,
      description: 'مساعد الذكاء الاصطناعي'
    },
    {
      href: '/linkedin-generator',
      label: 'LinkedIn Generator',
      icon: Share2,
      description: 'مولد المنشورات الفيروسية'
    },
    {
      href: '/quantum-id-generator',
      label: 'Quantum ID',
      icon: Sparkles,
      description: 'مولد الهوية الرقمية الكمية'
    },
    {
      href: '/analytics-dashboard',
      label: 'Analytics',
      icon: BarChart3,
      description: 'لوحة التحليلات الذكية'
    },
    {
      href: '/ai-tools',
      label: 'AI Tools',
      icon: Sparkles,
      description: 'عرض أدوات الذكاء الاصطناعي'
    },
    {
      href: '/case-studies',
      label: 'Case Studies',
      icon: Lightbulb,
      description: 'دراسات الحالة والمشاريع'
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'لوحة التحكم'
    }
  ]

  const translations = {
    ar: {
      'Chat Assistant': 'مساعد الذكاء الاصطناعي',
      'LinkedIn Generator': 'مولد LinkedIn',
      'Quantum ID': 'الهوية الكمية',
      'Analytics': 'التحليلات',
      'AI Tools': 'أدوات الذكاء الاصطناعي',
      'Case Studies': 'دراسات الحالة',
      'Dashboard': 'لوحة التحكم',
      'Toggle theme': 'تبديل النمط',
      'Toggle language': 'تبديل اللغة',
      'Navigation menu': 'قائمة التنقل',
      'Close menu': 'إغلاق القائمة',
      'Open menu': 'فتح القائمة'
    },
    en: {
      'Chat Assistant': 'Chat Assistant',
      'LinkedIn Generator': 'LinkedIn Generator',
      'Quantum ID': 'Quantum ID',
      'Analytics': 'Analytics',
      'AI Tools': 'AI Tools',
      'Case Studies': 'Case Studies',
      'Dashboard': 'Dashboard',
      'Toggle theme': 'Toggle theme',
      'Toggle language': 'Toggle language',
      'Navigation menu': 'Navigation menu',
      'Close menu': 'Close menu',
      'Open menu': 'Open menu'
    }
  }

  const t = (key: string) => translations[language][key as keyof typeof translations.ar] || key

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 rtl:space-x-reverse group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
            aria-label="Amrikyy AI Homepage"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              Amrikyy AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'gradient' : 'ghost'}
                    size="sm"
                    className={cn(
                      'flex items-center gap-2 transition-all duration-300 hover:scale-105',
                      isActive 
                        ? 'shadow-lg' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    aria-label={`${t(item.label)} - ${item.description}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{t(item.label)}</span>
                  </Button>
                </Link>
              )
            })}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 hover:scale-105 transition-transform duration-300"
              aria-label={t('Toggle theme')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="hover:scale-105 transition-transform duration-300"
              aria-label={t('Toggle language')}
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="ml-1 text-xs font-semibold">{language.toUpperCase()}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2 rtl:space-x-reverse">
            {/* Mobile Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={t('Toggle theme')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('Close menu') : t('Open menu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-in slide-in-from-top-2 duration-300"
            role="navigation"
            aria-label={t('Navigation menu')}
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'gradient' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 h-12',
                        isActive && 'shadow-lg'
                      )}
                      aria-label={`${t(item.label)} - ${item.description}`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{t(item.label)}</span>
                        <span className="text-xs opacity-70">{item.description}</span>
                      </div>
                    </Button>
                  </Link>
                )
              })}
            </div>
            
            {/* Mobile Language Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="w-full justify-center gap-2"
                aria-label={t('Toggle language')}
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
