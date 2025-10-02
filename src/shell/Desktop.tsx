import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { kernel } from '../core/kernel';
import { authService } from '../core/services/auth.service';
import { settingsService, type UserSettings } from '../core/services/settings.service';
import { windowManager, type WindowState } from './WindowManager';
import WindowFrame from './WindowManager/components/WindowFrame';
import CommandPalette from './components/CommandPalette';
import { appsConfig } from '../config/apps';
import { DesktopModeProvider, useDesktopMode } from './theme/DesktopModeContext';

const DesktopContent: React.FC = () => {
  const [user, setUser] = useState(() => authService.getUser());
  const [settings, setSettings] = useState<UserSettings>(settingsService.get());
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { mode } = useDesktopMode();

  useEffect(() => {
    kernel.registerService(authService);
    kernel.registerService(settingsService);
    kernel.start();
    const unsubAuth = authService.onChange((u) => setUser(u));
    const unsubSettings = settingsService.subscribe((s) => setSettings(s));
    const interval = setInterval(() => setWindows(windowManager.list()), 250);
    return () => {
      unsubAuth();
      unsubSettings();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ' ') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const apps = useMemo(() => appsConfig, []);

  if (!user) {
    return (
      <div className="login-gate">
        <button onClick={() => authService.loginWithGoogle()}>Continue with Google</button>
      </div>
    );
  }

  const handleFocus = (id: string) => {
    windowManager.focus(id);
    setWindows(windowManager.list());
  };

  const handleDrag = (id: string, x: number, y: number) => {
    windowManager.updatePosition(id, x, y);
    setWindows(windowManager.list());
  };

  const handleMinimize = (id: string) => {
    windowManager.minimize(id);
    setWindows(windowManager.list());
  };

  const handleMaximize = (id: string) => {
    windowManager.maximize(id);
    setWindows(windowManager.list());
  };

  const handleResize = (id: string, width: number, height: number) => {
    windowManager.setSize(id, { width, height });
    setWindows(windowManager.list());
  };

  const handleRestore = (id: string) => {
    windowManager.restore(id);
    setWindows(windowManager.list());
  };

  return (
    <div className={`aura-desktop h-full w-full desktop-${mode}-mode transition-all duration-500`}>
      {/* Desktop Grid */}
      <div className="aura-desktop__grid grid grid-cols-6 gap-6 p-8">
        {apps.map(app => (
          <button 
            key={app.id} 
            className="aura-appicon glass rounded-xl p-4 flex flex-col items-center gap-2 hover:glow-astro transition-all duration-300 group" 
            onClick={() => { windowManager.create(app.id); setWindows(windowManager.list()); }}
          >
            <span className="aura-appicon__icon text-4xl group-hover:scale-110 transition-transform duration-300">
              {app.icon ?? '🧩'}
            </span>
            <span className="aura-appicon__label text-sm font-medium text-white/90">
              {app.name ?? app.id}
            </span>
          </button>
        ))}
      </div>

      {/* Windows with AnimatePresence for exit animations */}
      <AnimatePresence>
        {windows.map(win => (
          <WindowFrame 
            key={win.id} 
            window={win} 
            onClose={(id) => { windowManager.close(id); setWindows(windowManager.list()); }}
            onFocus={handleFocus}
            onDrag={handleDrag}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onResize={handleResize}
          >
            <div className="p-4 text-white">{win.appId} is running.</div>
          </WindowFrame>
        ))}
      </AnimatePresence>

      {/* Taskbar with Minimized Windows */}
      {windowManager.getMinimizedWindows().length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-16 glass-strong border-t border-white/20 flex items-center gap-2 px-4">
          <span className="text-xs text-white/50 mr-2">Minimized:</span>
          {windowManager.getMinimizedWindows().map(win => (
            <motion.button
              key={win.id}
              onClick={() => handleRestore(win.id)}
              className="h-10 px-4 glass rounded-lg flex items-center gap-2 hover:glow-cyan transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <span className="text-2xl">{apps.find(a => a.id === win.appId)?.icon ?? '🧩'}</span>
              <span className="text-sm text-white/90">{win.appId}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      {/* Mode Indicator */}
      <div className="fixed top-4 right-4 glass rounded-lg px-3 py-2 text-xs text-white/70 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          mode === 'work' ? 'bg-[#00f6ff]' : 
          mode === 'creative' ? 'bg-[#ff00f4]' : 
          mode === 'relax' ? 'bg-[#00ff88]' : 
          'bg-white'
        }`}></div>
        <span className="capitalize">{mode} Mode</span>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-4 right-4 glass rounded-lg px-3 py-2 text-xs text-white/70">
        Press <kbd className="px-1 py-0.5 bg-white/10 rounded">Ctrl+Space</kbd> for commands
      </div>
    </div>
  );
};

const Desktop: React.FC = () => {
  return (
    <DesktopModeProvider>
      <DesktopContent />
    </DesktopModeProvider>
  );
};

export default Desktop;


