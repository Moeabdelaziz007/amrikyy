/**
 * 🎨 Wallpaper Selector Component
 * Advanced wallpaper system with multiple themes and effects
 */

import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Zap,
  Waves,
  Sunset,
  Moon,
  Star,
  Check,
  Play,
  Pause,
} from 'lucide-react';

interface WallpaperTheme {
  id: string;
  name: string;
  type: 'animated' | 'particle' | 'static';
  colors: string[];
  animation?: {
    duration: number;
    direction: 'radial' | 'diagonal' | 'horizontal' | 'vertical';
  };
  particles?: {
    count: number;
    speed: number;
    size: number;
  };
  description: string;
  icon: React.ReactNode;
  premium?: boolean;
}

const wallpaperThemes: WallpaperTheme[] = [
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    type: 'animated',
    colors: ['#0f0f23', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    animation: { duration: 20, direction: 'radial' },
    description: 'Mystical aurora lights dancing across the sky',
    icon: <Sparkles className="w-5 h-5" />,
    premium: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    type: 'animated',
    colors: ['#0a0a0a', '#1a0033', '#330066', '#6600cc', '#00ff88'],
    animation: { duration: 15, direction: 'diagonal' },
    description: 'Futuristic neon cityscape with matrix effects',
    icon: <Zap className="w-5 h-5" />,
    premium: true,
  },
  {
    id: 'galaxy',
    name: 'Galaxy Spiral',
    type: 'animated',
    colors: ['#000000', '#1a0033', '#330066', '#6600cc', '#9900ff'],
    animation: { duration: 40, direction: 'radial' },
    description: 'Cosmic spiral with deep space colors',
    icon: <Star className="w-5 h-5" />,
    premium: true,
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    type: 'animated',
    colors: ['#001122', '#003366', '#0066aa', '#0099ff', '#00ccff'],
    animation: { duration: 30, direction: 'vertical' },
    description: 'Serene ocean depths with flowing currents',
    icon: <Waves className="w-5 h-5" />,
    premium: false,
  },
  {
    id: 'sunset',
    name: 'Digital Sunset',
    type: 'animated',
    colors: ['#ff6b6b', '#ffa726', '#ffcc02', '#4ecdc4', '#45b7d1'],
    animation: { duration: 25, direction: 'horizontal' },
    description: 'Vibrant sunset with warm digital colors',
    icon: <Sunset className="w-5 h-5" />,
    premium: false,
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    type: 'particle',
    colors: ['#000000', '#001100', '#003300', '#00ff00'],
    particles: { count: 50, speed: 2, size: 2 },
    description: 'Classic matrix digital rain effect',
    icon: <Moon className="w-5 h-5" />,
    premium: true,
  },
];

interface WallpaperSelectorProps {
  currentWallpaper: string;
  onWallpaperChange: (wallpaperId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({
  currentWallpaper,
  onWallpaperChange,
  isOpen,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Wallpaper Themes</h2>
              <p className="text-sm text-gray-400">
                Choose your perfect desktop background
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-white text-xl">×</span>
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isAnimating
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}
              >
                {isAnimating ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {' '}
                {isAnimating ? 'Animations On' : 'Animations Off'}
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Current: {wallpaperThemes.find(t => t.id === currentWallpaper)?.name}
            </div>
          </div>
        </div>

        {/* Wallpaper Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallpaperThemes.map(theme => (
              <div
                key={theme.id}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                  currentWallpaper === theme.id 
                    ? 'ring-2 ring-blue-500 scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => onWallpaperChange(theme.id)}
              >
                {/* Preview Background */}
                <div 
                  className={`h-32 w-full ${
                    theme.id === 'aurora'
                      ? 'wallpaper-aurora'
                      : theme.id === 'cyberpunk'
                        ? 'wallpaper-cyberpunk'
                        : theme.id === 'galaxy'
                          ? 'wallpaper-galaxy'
                          : theme.id === 'ocean'
                            ? 'wallpaper-ocean'
                            : theme.id === 'sunset'
                              ? 'wallpaper-sunset'
                              : theme.id === 'matrix'
                                ? 'wallpaper-matrix'
                                : ''
                  } ${isAnimating ? '' : 'animate-none'}`}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  
                  {/* Theme Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-white">{theme.icon}</div>
                        <span className="text-white font-medium text-sm">
                          {theme.name}
                        </span>
                      </div>
                      {theme.premium && (
                        <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-xs mt-1">
                      {theme.description}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {currentWallpaper === theme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              Premium themes unlock advanced animations and effects
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperSelector;
