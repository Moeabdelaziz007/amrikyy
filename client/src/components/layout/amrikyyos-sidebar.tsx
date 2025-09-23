import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { 
  Home, 
  Users, 
  Workflow, 
  Bot, 
  Puzzle, 
  Book, 
  GraduationCap, 
  Brain, 
  Tools, 
  Plane, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Bug, 
  Star,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hasNotification?: boolean;
  category?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Social Feed', href: '/social-feed', icon: Users, hasNotification: true },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'AI Agents', href: '/ai-agents', icon: Bot },
  { name: 'MCP Tools', href: '/mcp-tools', icon: Puzzle, hasNotification: true },
  { name: 'Prompt Library', href: '/prompt-library', icon: Book, hasNotification: true },
  { name: 'Learning', href: '/learning', icon: GraduationCap, hasNotification: true },
  { name: 'Smart Learning', href: '/smart-learning', icon: Brain },
  { name: 'AI Tools', href: '/advanced-ai-tools', icon: Tools },
  { name: 'Travel Agency', href: '/ai-travel-agency', icon: Plane },
  { name: 'Telegram', href: '/telegram', icon: MessageCircle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Debug', href: '/debug', icon: Bug },
  { name: 'Workspace', href: '/workspace', icon: Star },
];

interface AmrikyyOSSidebarProps {
  variant?: 'default' | 'ai';
  className?: string;
}

/**
 * 🚀 AmrikyyOS Sidebar Component
 * 
 * Features:
 * - AmrikyyOS brand design language
 * - Glass morphism effects
 * - AI-enhanced animations
 * - Collapsible sections
 * - User profile integration
 * - Responsive design
 * - Accessibility support
 */
export function AmrikyyOSSidebar({ 
  variant = 'ai', 
  className 
}: AmrikyyOSSidebarProps) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    tools: true,
  });

  const isGuestUser = user?.isAnonymous || localStorage.getItem('isGuestUser') === 'true';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const groupedNavigation = {
    main: navigation.filter(item => !item.category),
    tools: navigation.filter(item => item.category === 'tools'),
  };

  const sidebarClasses = variant === 'ai' ? 'amrikyyos-ai-sidebar' : 'amrikyyos-sidebar';
  const scrollbarClasses = variant === 'ai' ? 'amrikyyos-ai-scrollbar' : 'amrikyyos-scrollbar';

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="amrikyyos-button-secondary bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
        >
          {isMobileOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        sidebarClasses,
        scrollbarClasses,
        'lg:translate-x-0 transition-transform duration-300',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        {/* Header */}
        <div className={variant === 'ai' ? 'amrikyyos-ai-sidebar-header' : 'amrikyyos-sidebar-header'}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center amrikyyos-pulse">
              <span className="text-white font-bold text-lg sm:text-xl">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                AmrikyyOS
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={variant === 'ai' ? 'amrikyyos-ai-sidebar-nav' : 'amrikyyos-sidebar-nav'}>
          <ul className="space-y-2">
            {/* Main Navigation */}
            {groupedNavigation.main.map(item => {
              const isActive = location === item.href;
              const IconComponent = item.icon;
              
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        variant === 'ai' ? 'amrikyyos-ai-sidebar-item' : 'amrikyyos-sidebar-item',
                        isActive && 'active'
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.name}</span>
                      {item.hasNotification && (
                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full amrikyyos-pulse"></div>
                      )}
                    </a>
                  </Link>
                </li>
              );
            })}

            {/* Tools Section */}
            {groupedNavigation.tools.length > 0 && (
              <>
                <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                <li>
                  <button
                    onClick={() => toggleSection('tools')}
                    className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {expandedSections.tools ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <Tools className="w-4 h-4" />
                    <span>Tools ({groupedNavigation.tools.length})</span>
                  </button>
                </li>
                {expandedSections.tools &&
                  groupedNavigation.tools.map(item => {
                    const isActive = location === item.href;
                    const IconComponent = item.icon;
                    
                    return (
                      <li key={item.name} className="ml-4">
                        <Link href={item.href}>
                          <a
                            className={cn(
                              variant === 'ai' ? 'amrikyyos-ai-sidebar-item' : 'amrikyyos-sidebar-item',
                              'text-sm',
                              isActive && 'active'
                            )}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{item.name}</span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
              </>
            )}
          </ul>
        </nav>

        <Separator className="bg-gray-200 dark:bg-gray-700" />

        {/* User Profile */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 dark:border-gray-700">
              <AvatarImage
                src={user?.photoURL || undefined}
                alt={user?.displayName || 'User'}
              />
              <AvatarFallback className="bg-gradient-to-r from-green-400/20 to-blue-500/20 text-green-600 dark:text-green-400 font-bold text-sm">
                {user?.displayName
                  ?.split(' ')
                  .map(n => n[0])
                  .join('') ||
                  user?.email?.[0]?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.displayName || user?.email || 'User'}
                </p>
                {isGuestUser && (
                  <span className="px-1 py-0.5 sm:px-2 sm:py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                    Guest
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 p-1 sm:p-2"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
