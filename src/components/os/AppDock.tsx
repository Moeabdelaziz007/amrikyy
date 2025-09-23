import { useState } from 'react';
import {
  FileText,
  Plane,
  Calculator,
  Cloud,
  Settings,
  Sparkles,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppDockProps {
  onAppClick: (appId: string) => void;
  openApps: string[];
  activeApp: string | null;
}

const dockApps = [
  {
    id: 'ai-notes',
    name: 'AI Notes',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'ai-travel',
    name: 'AI Travel',
    icon: Plane,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ai-chatbot',
    name: 'AI Assistant',
    icon: Bot,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'ai-calculator',
    name: 'AI Calculator',
    icon: Calculator,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'ai-weather',
    name: 'AI Weather',
    icon: Cloud,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    color: 'from-slate-500 to-gray-600',
  },
];

export const AppDock = ({ onAppClick, openApps, activeApp }: AppDockProps) => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-ultra rounded-2xl p-3 border border-white/20 shadow-premium">
        <div className="flex items-center space-x-2">
          {dockApps.map(app => {
            const Icon = app.icon;
            const isOpen = openApps.includes(app.id);
            const isActive = activeApp === app.id;
            const isHovered = hoveredApp === app.id;

            return (
              <div
                key={app.id}
                className="relative group"
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
              >
                {/* App tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap animate-slide-up">
                    {app.name}
                  </div>
                )}

                {/* App icon */}
                <button
                  onClick={() => onAppClick(app.id)}
                  className={cn(
                    'relative w-14 h-14 rounded-xl transition-premium',
                    'flex items-center justify-center',
                    'hover:scale-110 hover:-translate-y-2 hover-glow',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50',
                    isActive && 'scale-105 -translate-y-1 glow-pulse',
                    isHovered && 'scale-110 -translate-y-2'
                  )}
                >
                  {/* App background with gradient */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-xl bg-gradient-to-br opacity-90',
                      app.color,
                      isActive && 'opacity-100 glow-primary',
                      isHovered && 'opacity-100'
                    )}
                  />

                  {/* AI sparkle effect for active apps */}
                  {isActive && (
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-glow-pulse" />
                  )}

                  {/* App icon */}
                  <Icon className="relative z-10 w-6 h-6 text-white drop-shadow-lg" />

                  {/* Open app indicator */}
                  {isOpen && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full animate-glow-pulse" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
