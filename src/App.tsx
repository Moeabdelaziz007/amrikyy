import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserSettingsProvider } from './contexts/UserSettingsContext';
import LoginScreen from './components/auth/LoginScreen';
import './styles/ai-enhanced.css';
import {
  EnhancedSettingsApp,
  EnhancedFileManagerApp,
  EnhancedWeatherApp,
  EnhancedCalendarApp,
  EnhancedNotesApp,
  AITravelAgencyApp,
  GamingEntertainmentSuite,
  TelegramBotApp,
  AutomationDashboardApp,
  EnhancedMCPToolsApp,
  TaskManagementApp,
  AnalyticsDashboardApp,
  CollaborationApp,
  TaskTemplatesApp,
  EnhancedUIApp,
  AIFeaturesApp,
  AIAgentsApp,
  AutopilotApp,
  TestLabApp,
  UltimateApp,
  FirestoreTestApp
} from './components';
import ProductivitySuite from './apps/ProductivitySuite';
import AIFinanceManager from './apps/AIFinanceManager';
import HealthTracker from './apps/HealthTracker';
import { SoundEffectsManager } from './components/ui/SoundEffectsManager';
import { SmartAutomationSystem } from './components/ai/SmartAutomationSystem';
import { ThemeProvider, AdvancedThemeSelector } from './themes/AdvancedThemeSystem';
import { MobileOptimizationProvider } from './components/mobile/PWAInstallManager';
import { MobileAppLauncher } from './components/mobile/TouchGestureManager';
import ChatWindow from './components/ChatWindow';
import Icon from './components/icons/Icon';
import { I18nProvider, useI18n } from './i18n/i18n';
import LanguageToggle from './components/ui/LanguageToggle';
import { appsConfig } from './apps-config';
import './styles/index.css';
import './styles/modern-desktop.css';
import './styles/enhanced-wallpaper.css';

const DesktopApp: React.FC = () => {
  const [activeApp, setActiveApp] = React.useState<string | null>(null);
  const [systemStats, setSystemStats] = React.useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89
  });
  const [isMobile, setIsMobile] = React.useState(false);
  const { user, logout } = useAuth();
  const { t, dir } = useI18n();
  const desktopRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!desktopRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      desktopRef.current.style.setProperty('--mouse-x', `${x}`);
      desktopRef.current.style.setProperty('--mouse-y', `${y}`);
    };
    const desktopEl = desktopRef.current;
    if (desktopEl) {
      desktopEl.addEventListener('mousemove', handleMouseMove);
      desktopEl.addEventListener('mouseenter', () => desktopEl.classList.add('mouse-active'));
      desktopEl.addEventListener('mouseleave', () => desktopEl.classList.remove('mouse-active'));
    }
    return () => {
      if (desktopEl) {
        desktopEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const apps = appsConfig.map(app => ({
    ...app,
    name: t(`app.${app.id}`),
  }));

  const openApp = (appId: string) => setActiveApp(appId);
  const closeApp = () => setActiveApp(null);

  const renderApp = () => {
    const app = apps.find(a => a.id === activeApp);
    if (!app) return null;
    const AppComponent = app.component;
    return <AppComponent />;
  };

  return (
    <MobileOptimizationProvider>
      <div className="amrikyy-desktop" style={{ direction: dir }}>
        <div className="desktop-background" ref={desktopRef}>
          <div className="background-grid"></div>
        </div>
        <div className="desktop-content">
          {isMobile ? (
            <MobileAppLauncher apps={apps} onAppSelect={openApp} />
          ) : (
            <>
              <div className="system-status-bar">
                {/* Status Bar Content */}
              </div>
              <div className="organized-desktop-apps">
                {Object.values(
                  apps.reduce((acc, app) => {
                    acc[app.category] = [...(acc[app.category] || []), app];
                    return acc;
                  }, {} as Record<string, typeof apps>)
                ).map((categoryApps) => (
                  <div key={categoryApps[0].category} className="app-category">
                    <div className="category-header">
                      <h3 className="category-title">{t(`category.${categoryApps[0].category}`)}</h3>
                      <p className="category-description">{t(`category.${categoryApps[0].category}.description`)}</p>
                    </div>
                    <div className="category-apps">
                      {categoryApps.map(app => (
                        <div key={app.id} className="app-icon" onClick={() => openApp(app.id)}>
                          <div className="app-icon-image">
                            <Icon name={app.id} fallback={app.icon} size={36} />
                          </div>
                          <span className="app-icon-label">{app.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="taskbar">
                {/* Taskbar Content */}
              </div>
            </>
          )}
        </div>
        {activeApp && (
          <div className="app-window">
            <div className="window-header">
              <div className="window-title">{apps.find(a => a.id === activeApp)?.name}</div>
              <button onClick={closeApp} className="control-btn close"></button>
            </div>
            <div className="window-content">{renderApp()}</div>
          </div>
        )}
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
          <ChatWindow />
        </div>
      </div>
    </MobileOptimizationProvider>
  );
};

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <LoginScreen />;
  return <DesktopApp />;
}

function AppWithAuth() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <UserSettingsProvider>
            <App />
          </UserSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default AppWithAuth;

