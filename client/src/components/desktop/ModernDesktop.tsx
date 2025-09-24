/**
 * 🖥️ Modern Desktop Component for AuraOS
 * Enhanced desktop interface with modern design patterns
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  Settings,
  Image,
  Music,
  Video,
  Folder,
  Globe,
  Mail,
  Calendar,
  BarChart3,
  Zap,
  Bot,
  Terminal,
  Cloud,
  Wifi,
  Battery,
  Volume2,
  Sun,
  Moon,
  Menu,
  Maximize2,
} from 'lucide-react';
import TelegramControlPanel from './TelegramControlPanel';
import AutopilotDashboard from './AutopilotDashboard';

interface DesktopApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  isInstalled: boolean;
  isRunning: boolean;
  windowId?: string;
}

interface DesktopWindow {
  id: string;
  appId: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

const ModernDesktop: React.FC = () => {
  const [apps, setApps] = useState<DesktopApp[]>([
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Home className="w-6 h-6" />,
      description: 'Main dashboard and overview',
      category: 'system',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: <Image className="w-6 h-6" />,
      description: 'Image and media gallery',
      category: 'media',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'ai-agents',
      name: 'AI Agents',
      icon: <Bot className="w-6 h-6" />,
      description: 'AI-powered automation agents',
      category: 'ai',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'automation',
      name: 'Automation',
      icon: <Zap className="w-6 h-6" />,
      description: 'Workflow automation tools',
      category: 'productivity',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Data analytics and insights',
      category: 'analytics',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-6 h-6" />,
      description: 'System settings and preferences',
      category: 'system',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: <Terminal className="w-6 h-6" />,
      description: 'Command line interface',
      category: 'development',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'files',
      name: 'Files',
      icon: <Folder className="w-6 h-6" />,
      description: 'File manager',
      category: 'system',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'music',
      name: 'Music',
      icon: <Music className="w-6 h-6" />,
      description: 'Music player and library',
      category: 'media',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'video',
      name: 'Video',
      icon: <Video className="w-6 h-6" />,
      description: 'Video player and library',
      category: 'media',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Calendar and scheduling',
      category: 'productivity',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'mail',
      name: 'Mail',
      icon: <Mail className="w-6 h-6" />,
      description: 'Email client',
      category: 'communication',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'browser',
      name: 'Browser',
      icon: <Globe className="w-6 h-6" />,
      description: 'Web browser',
      category: 'internet',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'cloud',
      name: 'Cloud',
      icon: <Cloud className="w-6 h-6" />,
      description: 'Cloud storage and sync',
      category: 'storage',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'telegram-control',
      name: 'Telegram Control',
      icon: <Bot className="w-6 h-6" />,
      description: 'Telegram bot management and communication',
      category: 'communication',
      isInstalled: true,
      isRunning: false,
    },
    {
      id: 'autopilot-dashboard',
      name: 'Autopilot',
      icon: <Zap className="w-6 h-6" />,
      description: 'Automated task management and system optimization',
      category: 'automation',
      isInstalled: true,
      isRunning: false,
    },
  ]);

  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wifiConnected] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle theme toggle
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      // Save theme configuration
      const themeConfig = {
        id: newMode ? 'modern-dark' : 'modern-light',
        name: newMode ? 'Modern Dark' : 'Modern Light',
        type: newMode ? 'dark' : 'light',
        colors: {
          primary: newMode ? '#60a5fa' : '#3b82f6',
          secondary: newMode ? '#34d399' : '#10b981',
          accent: newMode ? '#a78bfa' : '#8b5cf6',
          background: newMode ? '#0a0a0a' : '#ffffff',
          surface: newMode ? '#111111' : '#f8fafc',
          text: newMode ? '#ffffff' : '#0f172a',
          border: newMode ? '#262626' : '#e2e8f0',
        },
        fonts: {
          primary: 'Inter',
          secondary: 'Poppins',
          mono: 'JetBrains Mono',
        },
        effects: {
          blur: true,
          animations: true,
          shadows: true,
          glass: true,
        },
        wallpaper: {
          type: 'gradient',
          value: newMode
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      };
      localStorage.setItem('auraos-theme', JSON.stringify(themeConfig));
      return newMode;
    });
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('auraos-theme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setIsDarkMode(theme.type === 'dark');
        document.documentElement.classList.toggle(
          'dark',
          theme.type === 'dark'
        );
      } catch (error) {
        console.warn('Failed to load saved theme:', error);
        // Fallback to system preference
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        setIsDarkMode(prefersDark);
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    } else {
      // No saved theme, use system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Handle app launch
  const launchApp = useCallback(
    (appId: string) => {
      const app = apps.find(a => a.id === appId);
      if (!app) return;

      // Check if app is already running
      const existingWindow = windows.find(
        w => w.appId === appId && !w.isMinimized
      );
      if (existingWindow) {
        // Restore window
        setWindows(prev =>
          prev.map(w =>
            w.id === existingWindow.id
              ? {
                  ...w,
                  isMinimized: false,
                  zIndex: Math.max(...prev.map(w => w.zIndex)) + 1,
                }
              : w
          )
        );
        return;
      }

      // Create new window
      const newWindow: DesktopWindow = {
        id: `window-${Date.now()}`,
        appId,
        title: app.name,
        isMinimized: false,
        isMaximized: false,
        position: {
          x: 100 + windows.length * 30,
          y: 100 + windows.length * 30,
        },
        size: { width: 800, height: 600 },
        zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1,
      };

      setWindows(prev => [...prev, newWindow]);
      setApps(prev =>
        prev.map(a => (a.id === appId ? { ...a, isRunning: true } : a))
      );
    },
    [apps, windows]
  );

  // Handle window close
  const closeWindow = useCallback((windowId: string) => {
    setWindows(prev => {
      const window = prev.find(w => w.id === windowId);
      if (!window) return prev;

      const newWindows = prev.filter(w => w.id !== windowId);
      setApps(prevApps =>
        prevApps.map(a =>
          a.id === window.appId
            ? { ...a, isRunning: newWindows.some(w => w.appId === a.id) }
            : a
        )
      );

      return newWindows;
    });
  }, []);

  // Handle window minimize
  const minimizeWindow = useCallback((windowId: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
  }, []);

  // Handle window maximize
  const maximizeWindow = useCallback((windowId: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  }, []);

  // Handle window focus
  const focusWindow = useCallback((windowId: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, zIndex: Math.max(...prev.map(w => w.zIndex)) + 1 }
          : w
      )
    );
  }, []);

  // Handle app selection
  const selectApp = useCallback((appId: string | null) => {
    setSelectedApp(appId);
  }, []);

  // Get running apps for taskbar
  const runningApps = apps.filter(app => app.isRunning);

  return (
    <div className="desktop-container">
      {/* Enhanced Background */}
      <div className="desktop-background">
        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/30 to-purple-100/30 dark:via-blue-800/20 dark:to-purple-800/20 animate-pulse" />

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0h1v40H0z' fill='%23000000'/%3E%3Cpath d='M0 0v1h40V0z' fill='%23000000'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Enhanced Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AuraOS
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                AI-Powered OS
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 ml-6">
            <button
              onClick={() => launchApp('dashboard')}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-200 group"
              title="Dashboard"
            >
              <Home className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
            </button>
            <button
              onClick={() => launchApp('ai-agents')}
              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-200 group"
              title="AI Agents"
            >
              <Bot className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600" />
            </button>
            <button
              onClick={() => launchApp('automation')}
              className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-all duration-200 group"
              title="Automation"
            >
              <Zap className="w-4 h-4 text-orange-500 group-hover:text-orange-600" />
            </button>
          </div>
        </div>

        <div className="status-right">
          <div className="flex items-center gap-4">
            {/* System Status */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Online
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 transition-all duration-200 group"
              title={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-yellow-500 group-hover:text-yellow-600" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600" />
              )}
            </button>

            {/* System Icons */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-500/5">
              {wifiConnected && (
                <div className="flex items-center gap-1">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    WiFi
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Battery className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  85%
                </span>
              </div>
              <Volume2 className="w-4 h-4 text-gray-500" />
            </div>

            {/* Time */}
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                {currentTime.toLocaleDateString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="absolute top-20 left-8 z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome to AuraOS
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-Powered Operating System
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Your intelligent desktop experience with advanced AI agents,
            automation tools, and modern design.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => launchApp('dashboard')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              Open Dashboard
            </button>
            <button
              onClick={() => launchApp('ai-agents')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              AI Agents
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Desktop Icons */}
      <div className="desktop-icons">
        {apps.map(app => (
          <button
            key={app.id}
            className={`desktop-icon group ${selectedApp === app.id ? 'selected' : ''} relative`}
            onClick={() => selectApp(app.id)}
            onDoubleClick={() => launchApp(app.id)}
            title={app.description}
          >
            <div className="desktop-icon-image relative">
              {/* Icon Background Glow */}
              <div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  app.category === 'ai'
                    ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20'
                    : app.category === 'media'
                      ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20'
                      : app.category === 'system'
                        ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
                        : app.category === 'productivity'
                          ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
                          : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20'
                } blur-sm`}
              />

              {/* Icon Container */}
              <div
                className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                  app.category === 'ai'
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/25'
                    : app.category === 'media'
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                      : app.category === 'system'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : app.category === 'productivity'
                          ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25'
                          : 'bg-gradient-to-br from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25'
                }`}
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {app.icon}
                </div>
              </div>

              {/* Running Indicator */}
              {app.isRunning && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse shadow-lg">
                  <div className="absolute inset-1 bg-white rounded-full opacity-80"></div>
                </div>
              )}

              {/* Hover Effect Ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/30 dark:group-hover:border-gray-600/30 transition-all duration-300"></div>
            </div>

            {/* Icon Label */}
            <span className="desktop-icon-label group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {app.name}
            </span>

            {/* Selection Indicator */}
            {selectedApp === app.id && (
              <div className="absolute -inset-2 rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-blue-500/10 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Desktop Windows */}
      {windows.map(window => (
        <div
          key={window.id}
          className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            window.isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            left: window.isMaximized ? 0 : window.position.x,
            top: window.isMaximized ? 40 : window.position.y,
            width: window.isMaximized ? '100vw' : window.size.width,
            height: window.isMaximized
              ? 'calc(100vh - 100px)'
              : window.size.height,
            zIndex: window.zIndex,
          }}
          onMouseDown={() => focusWindow(window.id)}
        >
          {/* Window Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => closeWindow(window.id)}
                  className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Close"
                />
                <button
                  onClick={() => minimizeWindow(window.id)}
                  className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
                  title="Minimize"
                />
                <button
                  onClick={() => maximizeWindow(window.id)}
                  className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                  title="Maximize"
                />
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {window.title}
              </span>
            </div>

            <button
              onClick={() => maximizeWindow(window.id)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Maximize"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Window Content */}
          <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-800/50">
            {window.appId === 'dashboard' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl text-white">
                    <h4 className="font-semibold mb-2">System Status</h4>
                    <p className="text-sm opacity-90">
                      All systems operational
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-4 rounded-xl text-white">
                    <h4 className="font-semibold mb-2">AI Agents</h4>
                    <p className="text-sm opacity-90">3 active agents</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-xl text-white">
                    <h4 className="font-semibold mb-2">Automation</h4>
                    <p className="text-sm opacity-90">5 workflows running</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>AI Agent "Content Creator" completed task</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>New workflow "Email Automation" created</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>System optimization completed</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : window.appId === 'ai-agents' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Bot className="w-6 h-6 text-blue-500" />
                      <h4 className="font-semibold">Content Creator Pro</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Specialized in creating high-quality content
                    </p>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      Activate Agent
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="w-6 h-6 text-emerald-500" />
                      <h4 className="font-semibold">Data Analyst Pro</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Expert in analyzing complex datasets
                    </p>
                    <button className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                      Activate Agent
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {apps.find(a => a.id === window.appId)?.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{window.title}</h3>
                  {window.appId === 'telegram-control' ? (
                    <div className="w-full h-full p-4">
                      <TelegramControlPanel onExecute={(data) => console.log('Telegram action:', data)} />
                    </div>
                  ) : window.appId === 'autopilot-dashboard' ? (
                    <div className="w-full h-full p-4">
                      <AutopilotDashboard onExecute={(data) => console.log('Autopilot action:', data)} />
                    </div>
                  ) : (
                    <p className="text-sm">
                      Application content will be loaded here
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Enhanced Taskbar */}
      <div className="taskbar">
        {/* Running Apps */}
        <div className="flex items-center gap-2">
          {runningApps.map(app => {
            const window = windows.find(w => w.appId === app.id);
            return (
              <button
                key={app.id}
                className={`taskbar-app group relative ${window?.isMinimized ? 'opacity-60' : ''}`}
                onClick={() => {
                  if (window?.isMinimized) {
                    minimizeWindow(window.id);
                  } else if (window) {
                    focusWindow(window.id);
                  } else {
                    launchApp(app.id);
                  }
                }}
                title={app.name}
              >
                <div
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    app.category === 'ai'
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600'
                      : app.category === 'media'
                        ? 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-600'
                        : app.category === 'system'
                          ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600'
                          : app.category === 'productivity'
                            ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600'
                            : 'bg-gray-500/10 hover:bg-gray-500/20 text-gray-600'
                  }`}
                >
                  {app.icon}
                </div>

                {/* Active Indicator */}
                {!window?.isMinimized && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {app.name}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* System Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Start Button */}
          <button
            onClick={() => launchApp('dashboard')}
            className="taskbar-app bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            title="Quick Start - Open Dashboard"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              /* Show search */
            }}
            className="taskbar-app bg-gradient-to-r from-emerald-500 to-cyan-600 text-white hover:from-emerald-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            title="Search"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* System Menu */}
          <button
            onClick={() => {
              /* Show system menu */
            }}
            className="taskbar-app bg-gradient-to-r from-gray-500 to-slate-600 text-white hover:from-gray-600 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            title="System Menu"
          >
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernDesktop;
