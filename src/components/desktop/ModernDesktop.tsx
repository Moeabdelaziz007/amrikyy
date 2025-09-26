/**
 * 🖥️ Modern Desktop Component for AuraOS
 * Enhanced desktop interface with cutting-edge 2024/2025 design trends
 * Features: Glassmorphism, 3D effects, motion design, immersive elements
 */

import {
  Home,
  Settings,
  BarChart3,
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
  Sparkles,
  Cpu,
  Database,
  Shield,
  Rocket,
  Brain,
  TrendingUp,
  Star,
  Activity,
} from 'lucide-react';
import TelegramControlPanel from './TelegramControlPanel';
import AutopilotDashboard from './AutopilotDashboard';
import WallpaperSelector from './WallpaperSelector';
import MainAutomationDashboard from './MainAutomationDashboard';
import AdvancedAutomationDashboard from './AdvancedAutomationDashboard';
import SmartDesktop from './SmartDesktop';
import TestDashboard from './TestDashboard';
import UltimateDesktop from './UltimateDesktop';

interface DesktopApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  isInstalled: boolean;
  isRunning: boolean;
  windowId?: string;
  gradient?: string;
  glowColor?: string;
  animationType?: 'float' | 'pulse' | 'rotate' | 'glow' | 'bounce';
  premium?: boolean;
  featured?: boolean;
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
          id: 'ultimate-desktop',
          name: 'Ultimate Desktop',
          icon: <Sparkles className="w-8 h-8" />,
          description: 'AI-Powered themes beyond iOS & Windows',
      category: 'system',
      isInstalled: true,
      isRunning: false,
          gradient: 'from-purple-500 via-pink-500 to-red-500',
          glowColor: 'purple-500',
          animationType: 'pulse',
          featured: true,
          premium: true,
        },
        {
          id: 'test-dashboard',
          name: 'Test Dashboard',
          icon: <Star className="w-8 h-8" />,
          description: 'Comprehensive MCP server testing suite',
          category: 'development',
          isInstalled: true,
          isRunning: false,
          gradient: 'from-green-500 to-emerald-500',
          glowColor: 'green-500',
          animationType: 'glow',
          premium: true,
    },
    {
      id: 'gallery',
      name: 'Quantum Gallery',
      icon: <Sparkles className="w-8 h-8" />,
      description: 'Immersive Media Experience',
      category: 'media',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      glowColor: 'blue-500',
      animationType: 'float',
      premium: true,
    },
    {
      id: 'ai-agents',
      name: 'AI Nexus',
      icon: <Cpu className="w-8 h-8" />,
      description: 'Advanced AI Orchestration',
      category: 'ai',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      glowColor: 'green-500',
      animationType: 'glow',
      featured: true,
    },
    {
      id: 'automation',
      name: 'AutoFlow',
      icon: <Rocket className="w-8 h-8" />,
      description: 'Hyper-Speed Automation',
      category: 'productivity',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      glowColor: 'orange-500',
      animationType: 'bounce',
      premium: true,
    },
    {
      id: 'analytics',
      name: 'DataVision',
      icon: <TrendingUp className="w-8 h-8" />,
      description: 'Real-Time Intelligence',
      category: 'analytics',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      glowColor: 'indigo-500',
      animationType: 'rotate',
    },
    {
      id: 'security',
      name: 'CyberShield',
      icon: <Shield className="w-8 h-8" />,
      description: 'Advanced Security Suite',
      category: 'security',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glowColor: 'emerald-500',
      animationType: 'pulse',
      featured: true,
    },
    {
      id: 'database',
      name: 'DataCore',
      icon: <Database className="w-8 h-8" />,
      description: 'Quantum Database Engine',
      category: 'data',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      glowColor: 'violet-500',
      animationType: 'glow',
    },
    {
      id: 'terminal',
      name: 'Quantum Terminal',
      icon: <Terminal className="w-8 h-8" />,
      description: 'Advanced Command Interface',
      category: 'development',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-gray-700 via-gray-600 to-gray-500',
      glowColor: 'gray-500',
      animationType: 'float',
    },
    {
      id: 'cloud',
      name: 'CloudSync',
      icon: <Cloud className="w-8 h-8" />,
      description: 'Universal Cloud Integration',
      category: 'cloud',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-sky-500 via-blue-500 to-indigo-500',
      glowColor: 'sky-500',
      animationType: 'float',
    },
    {
      id: 'settings',
      name: 'Control Panel',
      icon: <Settings className="w-8 h-8" />,
      description: 'System Configuration Hub',
      category: 'system',
      isInstalled: true,
      isRunning: false,
      gradient: 'from-slate-500 via-gray-500 to-zinc-500',
      glowColor: 'slate-500',
      animationType: 'rotate',
    },
  ]);

  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wifiConnected] = useState(true);
  const [currentWallpaper, setCurrentWallpaper] = useState('aurora');
  const [isWallpaperSelectorOpen, setIsWallpaperSelectorOpen] = useState(false);
  const [isMainDashboardOpen, setIsMainDashboardOpen] = useState(false);
  const [isAdvancedDashboardOpen, setIsAdvancedDashboardOpen] = useState(false);
  const [isSmartDesktopOpen, setIsSmartDesktopOpen] = useState(false);
  const [isTestDashboardOpen, setIsTestDashboardOpen] = useState(false);
  const [isUltimateDesktopOpen, setIsUltimateDesktopOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isAutopilotOpen, setIsAutopilotOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);

  // Update time every second
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Update app running status
      setApps(prevApps =>
        prevApps.map(a =>
          a.id === appId ? { ...a, isRunning: true } : a
        )
      );

      // Handle different app launches
      switch (appId) {
        case 'ultimate-desktop':
          setIsUltimateDesktopOpen(true);
          break;
        case 'smart-desktop':
          setIsSmartDesktopOpen(true);
          break;
        case 'test-dashboard':
          setIsTestDashboardOpen(true);
          break;
        case 'advanced-automation':
          setIsAdvancedDashboardOpen(true);
          break;
        case 'dashboard':
          setIsMainDashboardOpen(true);
          break;
        case 'telegram':
          setIsTelegramOpen(true);
          break;
        case 'autopilot':
          setIsAutopilotOpen(true);
          break;
        case 'theme-customizer':
          setIsThemeCustomizerOpen(true);
          break;
        default:
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
          break;
      }
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
    <div className="desktop-container wallpaper-container">
      {/* Enhanced Background with Advanced Wallpaper System */}
      <div className={`desktop-background relative overflow-hidden ${
        currentWallpaper === 'aurora' ? 'wallpaper-aurora' :
        currentWallpaper === 'cyberpunk' ? 'wallpaper-cyberpunk' :
        currentWallpaper === 'galaxy' ? 'wallpaper-galaxy' :
        currentWallpaper === 'ocean' ? 'wallpaper-ocean' :
        currentWallpaper === 'sunset' ? 'wallpaper-sunset' :
        currentWallpaper === 'matrix' ? 'wallpaper-matrix' :
        'wallpaper-aurora'
      }`}>
        {/* Dynamic Wallpaper Background */}
        <div className="absolute inset-0 wallpaper-aurora"></div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/30 to-purple-100/30 dark:via-blue-800/20 dark:to-purple-800/20 animate-pulse" />

        {/* 3D Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float effect-3d"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed effect-3d"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-float animation-delay-400 effect-3d"></div>

        {/* Particle System */}
        <div className="particle-container absolute inset-0 pointer-events-none">
          <div className="particle top-1/4 left-1/4 animation-delay-200"></div>
          <div className="particle top-1/2 right-1/4 animation-delay-400"></div>
          <div className="particle bottom-1/4 left-1/2 animation-delay-600"></div>
          <div className="particle top-3/4 right-1/3 animation-delay-800"></div>
          <div className="particle bottom-1/2 left-1/3 animation-delay-200"></div>
        </div>

        {/* Enhanced Grid Pattern with 3D Effect */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0h1v40H0z' fill='%23000000'/%3E%3Cpath d='M0 0v1h40V0z' fill='%23000000'/%3E%3C/g%3E%3C/svg%3E")`,
            transform: 'perspective(1000px) rotateX(60deg)',
          }}
        ></div>

        {/* Holographic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-shift"></div>
      </div>

      {/* Enhanced Status Bar with Glassmorphism */}
      <div className="status-bar glass-premium border-b border-white/20 dark:border-white/10">
        <div className="status-left">
          <div className="flex items-center gap-3">
            {/* Enhanced Logo with 3D Effect */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg hover-lift effect-3d">
              <span className="text-white text-lg font-bold drop-shadow-lg">A</span>
            </div>
            <div>
              <span className="font-bold text-lg gradient-text">
                Amrikyy AIOS
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 animate-neon-pulse">
                Advanced AI System
              </p>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="flex items-center gap-2 ml-6">
            <button
              onClick={() => launchApp('dashboard')}
              className="p-3 rounded-xl glass-premium hover-lift hover-glow transition-all duration-300 group"
              title="Neural Hub"
            >
              <Brain className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
            </button>
            <button
              onClick={() => launchApp('ai-agents')}
              className="p-3 rounded-xl glass-premium hover-lift hover-glow transition-all duration-300 group"
              title="AI Nexus"
            >
              <Cpu className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400" />
            </button>
            <button
              onClick={() => launchApp('automation')}
              className="p-3 rounded-xl glass-premium hover-lift hover-glow transition-all duration-300 group"
              title="AutoFlow"
            >
              <Rocket className="w-5 h-5 text-orange-500 group-hover:text-orange-400" />
            </button>
            <button
              onClick={() => launchApp('analytics')}
              className="p-3 rounded-xl glass-premium hover-lift hover-glow transition-all duration-300 group"
              title="DataVision"
            >
              <TrendingUp className="w-5 h-5 text-purple-500 group-hover:text-purple-400" />
            </button>
          </div>
        </div>

        <div className="status-right">
          <div className="flex items-center gap-4">
            {/* Enhanced System Status */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-premium border border-green-500/20 hover-lift">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">System Online</span>
            </div>

            {/* Enhanced System Icons */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg glass-premium hover-lift">
                  <Wifi className="w-4 h-4 text-blue-500" />
                </div>
              <div className="p-2 rounded-lg glass-premium hover-lift">
                <Battery className="w-4 h-4 text-green-500" />
              </div>
              <div className="p-2 rounded-lg glass-premium hover-lift">
                <Volume2 className="w-4 h-4 text-purple-500" />
              </div>
            </div>

            {/* Enhanced Time Display */}
            <div className="px-4 py-2 rounded-xl glass-premium hover-lift">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleDateString()}
        </div>
      </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsWallpaperSelectorOpen(true)}
              className="p-2 rounded-xl glass-premium hover-lift hover-glow transition-all duration-300"
              title="Change Wallpaper"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl glass-premium hover-lift hover-glow transition-all duration-300"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Automation Dashboard */}
      {isMainDashboardOpen && (
        <>
          <div className="dashboard-overlay active" onClick={() => setIsMainDashboardOpen(false)}></div>
          <MainAutomationDashboard />
        </>
      )}

      {/* Advanced Automation Dashboard */}
      {isAdvancedDashboardOpen && (
        <>
          <div className="dashboard-overlay active" onClick={() => setIsAdvancedDashboardOpen(false)}></div>
          <AdvancedAutomationDashboard onClose={() => setIsAdvancedDashboardOpen(false)} />
        </>
      )}

      {/* Smart Desktop */}
      {isSmartDesktopOpen && (
        <>
          <div className="dashboard-overlay active" onClick={() => setIsSmartDesktopOpen(false)}></div>
          <SmartDesktop onClose={() => setIsSmartDesktopOpen(false)} />
        </>
      )}

      {/* Ultimate Desktop */}
      {isUltimateDesktopOpen && (
        <>
          <div className="dashboard-overlay active" onClick={() => setIsUltimateDesktopOpen(false)}></div>
          <UltimateDesktop onClose={() => setIsUltimateDesktopOpen(false)} />
        </>
      )}

      {/* Test Dashboard */}
      {isTestDashboardOpen && (
        <>
          <div className="dashboard-overlay active" onClick={() => setIsTestDashboardOpen(false)}></div>
          <TestDashboard onClose={() => setIsTestDashboardOpen(false)} />
        </>
      )}

      {/* Bubble Layout Desktop */}
      <div className="desktop-bubble-layout">
        {/* Center Dashboard Button */}
        <div className="bubble-center">
          <button
            onClick={() => setIsMainDashboardOpen(true)}
            className="dashboard-center-button glass-premium hover-lift transition-all duration-500"
            title="Open Automation Dashboard"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium text-white text-center">Automation Hub</span>
          </button>
        </div>

        {/* Bubble Apps Around Dashboard */}
        <div className="bubble-apps">
          {apps.map((app, index) => (
            <div key={app.id} className="bubble-app">
              <button
            className={`desktop-icon group ${selectedApp === app.id ? 'selected' : ''} relative`}
            onClick={() => selectApp(app.id)}
            onDoubleClick={() => launchApp(app.id)}
            title={app.description}
          >
            <div className="desktop-icon-image relative">
                  {/* Glassmorphism Background */}
                  <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 shadow-2xl"></div>

                  {/* Dynamic Gradient Background */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${app.gradient || 'from-gray-500 to-slate-600'} opacity-80`}
                  ></div>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${app.gradient || 'from-gray-500 to-slate-600'} opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-110`}
                    style={{
                      filter: `drop-shadow(0 0 20px ${app.glowColor ? `var(--${app.glowColor})` : 'rgba(0,0,0,0.3)'})`
                    }}
                  ></div>

                  {/* Premium Badge */}
                  {app.premium && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {app.featured && (
                    <div className="absolute -top-2 -left-2 z-20">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Enhanced Icon Container with Advanced 3D Effect */}
                  <div
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                      app.animationType === 'float' ? 'app-animate-float-advanced' :
                      app.animationType === 'pulse' ? 'app-animate-pulse-advanced' :
                      app.animationType === 'rotate' ? 'app-animate-rotate-advanced' :
                      app.animationType === 'glow' ? 'app-animate-glow-advanced' :
                      app.animationType === 'bounce' ? 'app-animate-bounce-advanced' : ''
                    }`}
                    style={{
                      background: `linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))`,
                      boxShadow: `
                        inset 0 2px 0 rgba(255,255,255,0.4),
                        inset 0 -2px 0 rgba(0,0,0,0.15),
                        0 15px 40px rgba(0,0,0,0.3),
                        0 0 0 1px rgba(255,255,255,0.15),
                        0 0 30px ${app.glowColor ? `var(--${app.glowColor})` : 'rgba(0,0,0,0.2)'}
                      `
                    }}
                  >
                    <div className="transform group-hover:scale-125 transition-transform duration-300 text-white drop-shadow-lg neon-text">
                  {app.icon}
                </div>
              </div>

                  {/* Running Indicator with Enhanced Animation */}
              {app.isRunning && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg">
                      <div className="absolute inset-1 bg-white rounded-full opacity-90 animate-ping"></div>
                      <div className="absolute inset-2 bg-green-400 rounded-full"></div>
                </div>
              )}

                  {/* Hover Effect Ring with Neon Glow */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/50 dark:group-hover:border-white/30 transition-all duration-300"
                    style={{
                      boxShadow: `0 0 20px ${app.glowColor ? `var(--${app.glowColor})` : 'rgba(255,255,255,0.3)'}`
                    }}
                  ></div>

                  {/* Enhanced Particle Effects for Premium Apps */}
                  {app.premium && (
                    <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none particle-effect">
                      <div className="absolute top-2 left-2 w-1 h-1 bg-white/80 rounded-full animate-ping"></div>
                      <div className="absolute top-4 right-3 w-1 h-1 bg-white/60 rounded-full animate-ping animation-delay-200"></div>
                      <div className="absolute bottom-3 left-4 w-1 h-1 bg-white/70 rounded-full animate-ping animation-delay-400"></div>
                      <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white/50 rounded-full animate-ping animation-delay-600"></div>
                      <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping animation-delay-800"></div>
                      
                      {/* Holographic Shimmer Effect */}
                      <div className="absolute inset-0 holographic-effect opacity-20"></div>
                    </div>
                  )}
            </div>

                {/* Enhanced Icon Label */}
                <span className="desktop-icon-label mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-lg">
              {app.name}
            </span>

                {/* Selection Indicator with Glow */}
            {selectedApp === app.id && (
              <div className="absolute -inset-2 rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-blue-500/10 animate-pulse"></div>
            )}
          </button>
            </div>
        ))}
        </div>
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

      {/* Wallpaper Selector */}
      <WallpaperSelector
        currentWallpaper={currentWallpaper}
        onWallpaperChange={setCurrentWallpaper}
        isOpen={isWallpaperSelectorOpen}
        onClose={() => setIsWallpaperSelectorOpen(false)}
      />
    </div>
  );
};

export default ModernDesktop;
