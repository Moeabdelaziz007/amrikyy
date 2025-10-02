import React, { useEffect, useMemo, useState } from 'react';
import { kernel } from '../core/kernel';
import { authService } from '../core/services/auth.service';
import { settingsService, type UserSettings } from '../core/services/settings.service';
import { windowManager, type WindowState } from './WindowManager';
import WindowFrame from './WindowManager/components/WindowFrame';
import CommandPalette from './components/CommandPalette';
import { appsConfig } from '../config/apps';

const Desktop: React.FC = () => {
  const [user, setUser] = useState(() => authService.getUser());
  const [settings, setSettings] = useState<UserSettings>(settingsService.get());
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

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

  return (
    <div className="aura-desktop h-full w-full">
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

      {/* Windows */}
      {windows.map(win => (
        <WindowFrame key={win.id} window={win} onClose={(id) => { windowManager.close(id); setWindows(windowManager.list()); }}>
          <div className="p-4 text-white">{win.appId} is running.</div>
        </WindowFrame>
      ))}

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-4 right-4 glass rounded-lg px-3 py-2 text-xs text-white/70">
        Press <kbd className="px-1 py-0.5 bg-white/10 rounded">Ctrl+Space</kbd> for commands
      </div>
    </div>
  );
};

export default Desktop;


