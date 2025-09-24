import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { AppleButton } from '@/components/ui/apple-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Social Feed', href: '/social-feed', icon: Users, hasNotification: true },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'AI Agents', href: '/ai-agents', icon: Bot },
  { 
    name: 'MCP Tools', 
    href: '/mcp-tools', 
    icon: Puzzle, 
    hasNotification: true,
    children: [
      { name: 'Web Scraper', href: '/mcp-tools?tool=web_scraper', icon: Bot, category: 'mcp' },
      { name: 'Data Analyzer', href: '/mcp-tools?tool=data_analyzer', icon: BarChart3, category: 'mcp' },
      { name: 'Code Generator', href: '/mcp-tools?tool=code_generator', icon: Bot, category: 'mcp' },
    ]
  },
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

interface AppleSidebarProps {
  className?: string;
}

/**
 * 🍎 Apple-style Sidebar Component
 * 
 * Features:
 * - Apple-inspired design language
 * - AI-enhanced animations
 * - Collapsible sections
 * - User profile integration
 * - Responsive design
 * - Accessibility support
 */
export function AppleSidebar({ className }: AppleSidebarProps) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = location === item.href;
    const isExpanded = expandedItems.has(item.name);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <div key={item.name}>
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
            level > 0 && 'ml-4',
            isActive
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
          )}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.name)}
              className="flex items-center gap-3 w-full text-left"
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium flex-1">{item.name}</span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
            </button>
          ) : (
            <Link href={item.href} className="flex items-center gap-3 w-full">
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium flex-1">{item.name}</span>
              {item.hasNotification && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
              )}
            </Link>
          )}
          
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1">
            {item.children?.map((child) => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <AppleButton
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white/80 backdrop-blur-md border border-gray-200"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </AppleButton>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          'ai-sidebar fixed left-0 top-0 h-full z-40 transform transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="ai-sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AuraOS
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                v2.0 AI
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="ai-sidebar-nav flex-1 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => renderNavigationItem(item))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group">
            <Avatar className="w-10 h-10 border-2 border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
              <AvatarImage
                src={user?.photoURL || undefined}
                alt={user?.displayName || 'User'}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {user?.displayName
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('') ||
                  user?.email?.[0]?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.displayName || user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            
            <AppleButton
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </AppleButton>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
