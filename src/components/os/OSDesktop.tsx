import React, { useState } from 'react';
import { Clock, Wifi, Battery, Volume2, Grid3X3, Palette } from 'lucide-react';
import { AppDock } from './AppDock';
import { WindowManager } from './WindowManager';
import { WallpaperManager } from './WallpaperManager';
import { SmartAppLauncher } from './SmartAppLauncher';
import { AppStore } from './AppStore';
import {
  PremiumWallpaperManager,
  ThemeSelector,
} from './PremiumWallpaperManager';
import { useWallpaper } from '../../contexts/WallpaperContext';

export const OSDesktop = () => {
  const [time, setTime] = useState(new Date());
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  const [isAppStoreOpen, setIsAppStoreOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const { currentWallpaper, setCurrentWallpaper } = useWallpaper();

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appId: string) => {
    if (!openApps.includes(appId)) {
      setOpenApps(prev => [...prev, appId]);
    }
    setActiveApp(appId);
  };

  const closeApp = (appId: string) => {
    setOpenApps(prev => prev.filter(id => id !== appId));
    if (activeApp === appId) {
      setActiveApp(openApps.find(id => id !== appId) || null);
    }
  };

  const minimizeApp = (appId: string) => {
    if (activeApp === appId) {
      setActiveApp(null);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Premium Dynamic Wallpaper */}
      <PremiumWallpaperManager
        currentTheme={currentWallpaper}
        onThemeChange={setCurrentWallpaper}
      />

      {/* Top Menu Bar */}
      <div className="relative z-50 h-8 w-full glass-premium border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium bg-gradient-primary bg-clip-text text-transparent">
            AuraOS AI System
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAppLauncherOpen(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm">Apps</span>
            </button>
            <button
              onClick={() => setIsAppStoreOpen(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all duration-200"
            >
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">$</span>
              </div>
              <span className="text-sm">Store</span>
            </button>
            <button
              onClick={() => setIsThemeSelectorOpen(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-200"
            >
              <Palette className="w-4 h-4" />
              <span className="text-sm">Themes</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-foreground/80">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              {time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Content Area */}
      <div className="relative flex-1 h-[calc(100vh-8rem)]">
        <WindowManager
          openApps={openApps}
          activeApp={activeApp}
          onClose={closeApp}
          onMinimize={minimizeApp}
          onFocus={setActiveApp}
        />
      </div>

      {/* App Dock */}
      <AppDock onAppClick={openApp} openApps={openApps} activeApp={activeApp} />

      {/* Smart App Launcher */}
      <SmartAppLauncher
        isOpen={isAppLauncherOpen}
        onClose={() => setIsAppLauncherOpen(false)}
        onAppClick={appId => {
          openApp(appId);
          setIsAppLauncherOpen(false);
        }}
      />

      {/* App Store */}
      <AppStore
        isOpen={isAppStoreOpen}
        onClose={() => setIsAppStoreOpen(false)}
        onInstall={appId => {
          console.log(`Installing app: ${appId}`);
          // Here you would implement the actual installation logic
          setIsAppStoreOpen(false);
        }}
      />

      {/* Theme Selector */}
      <ThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        currentTheme={currentWallpaper}
        onThemeChange={setCurrentWallpaper}
      />
    </div>
  );
};
