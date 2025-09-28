  const apps = appsConfig.map(app => ({
    ...app,
    name: t(`app.${app.id}`),
    icon: app.icon || '🚀' // Fallback icon
  }));
  SettingsApp,
  CalendarApp,
  NotesApp
} from './components/apps/AdvancedApps';
import ProductivitySuite from './apps/ProductivitySuite';
import AIFinanceManager from './apps/AIFinanceManager';
import HealthTracker from './apps/HealthTracker';
import { EnhancedSettingsApp } from './components/apps/EnhancedSettingsApp';
import { EnhancedFileManagerApp } from './components/apps/EnhancedFileManagerApp';
import { EnhancedWeatherApp } from './components/apps/EnhancedWeatherApp';
import { EnhancedCalendarApp } from './components/apps/EnhancedCalendarApp';
import { EnhancedNotesApp } from './components/apps/EnhancedNotesApp';
import { AITravelAgencyApp } from './components/apps/AITravelAgencyApp';
import { GamingEntertainmentSuite } from './components/apps/GamingEntertainmentSuite';
import {
  TelegramBotApp,
  AutomationDashboardApp,
  MCPToolsApp
} from './components/apps/SystemIntegrationApps';
import { EnhancedMCPToolsApp } from './components/apps/EnhancedMCPToolsApp';
import { TaskManagementApp } from './components/apps/TaskManagementApp';
import { AnalyticsDashboardApp } from './components/apps/AnalyticsDashboardApp';
import { CollaborationApp } from './components/apps/CollaborationApp';
import { TaskTemplatesApp } from './components/apps/TaskTemplatesApp';
import { EnhancedUIApp } from './components/apps/EnhancedUIApp';
import { AIFeaturesApp } from './components/apps/AIFeaturesApp';
import { AIAgentsApp } from './components/apps/AIAgentsApp';
import { AutopilotApp } from './components/apps/AutopilotApp';
import { TestLabApp } from './components/apps/TestLabApp';
import { UltimateApp } from './components/apps/UltimateApp';
import { FirestoreTestApp } from './components/apps/FirestoreTestApp';
import { SoundEffectsManager } from './components/ui/SoundEffectsManager';
import { SmartAutomationSystem } from './components/ai/SmartAutomationSystem';
import { ThemeProvider, AdvancedThemeSelector } from './themes/AdvancedThemeSystem';
import { AIPoweredThemeSelector } from './themes/AIPoweredTheme';
import AIPoweredDesktop from './components/ai/AIPoweredDesktop';
import IntelligentAutomationEngine from './components/ai/IntelligentAutomationEngine';
import { Rocket, DollarSign, Heart } from 'lucide-react';
import { MobileOptimizationProvider } from './components/mobile/PWAInstallManager';
import { MobileAppLauncher, MobileWindowManager } from './components/mobile/TouchGestureManager';
import { IntegrationManager } from './components/integration/IntegrationManager';
import { EnhancedIntegrationManager } from './components/apps/EnhancedIntegrationManager';
import { RealtimeSyncManager } from './components/integration/RealtimeSyncManager';
import { EnhancedRealtimeSyncManager } from './components/apps/EnhancedRealtimeSyncManager';
import { CloudStorageManager } from './components/integration/CloudStorageManager';
import { EnhancedCloudStorageManager } from './components/apps/EnhancedCloudStorageManager';
import { AIAssistant } from './components/ai/AIAssistant';
import { EnhancedAIAssistant } from './components/apps/EnhancedAIAssistant';
import { IntelligentTaskManager } from './components/ai/IntelligentTaskManager';
import { VoiceCommandSystem } from './components/ai/VoiceCommandSystem';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { EnhancedAnalyticsDashboard } from './components/apps/EnhancedAnalyticsDashboard';
import { PerformanceMonitor } from './components/analytics/PerformanceMonitor';
import { UsageStatistics } from './components/analytics/UsageStatistics';
import { ProductivityInsights } from './components/analytics/ProductivityInsights';
import { SystemHealthMonitor } from './components/analytics/SystemHealthMonitor';
import { SecurityDashboard } from './components/security/SecurityDashboard';
import { EnhancedSecurityDashboard } from './components/apps/EnhancedSecurityDashboard';
import { DataEncryption } from './components/security/DataEncryption';
import { UserPermissions } from './components/security/UserPermissions';
import { LanguageSelector } from './components/i18n/LanguageSelector';
import { LocalizationManager } from './components/i18n/LocalizationManager';
import { AdvancedAnimationSystem } from './components/ui/AdvancedAnimationSystem';
import { SystemOptimizer } from './components/system/SystemOptimizer';
import { ARVRIntegration } from './components/future/ARVRIntegration';
import { BlockchainFeatures } from './components/future/BlockchainFeatures';
import { IoTConnectivity } from './components/future/IoTConnectivity';
import { QuantumComputing } from './components/future/QuantumComputing';
import { NeuralInterfaces } from './components/future/NeuralInterfaces';
import { SmartWorkflowAutomation } from './components/automation/SmartWorkflowAutomation';
import { AITaskScheduling } from './components/automation/AITaskScheduling';
import { IntelligentResourceAllocation } from './components/automation/IntelligentResourceAllocation';
import { PredictiveMaintenance } from './components/automation/PredictiveMaintenance';
import { ContextSensitiveActions } from './components/automation/ContextSensitiveActions';
import { NaturalLanguageProcessing } from './components/ai/NaturalLanguageProcessing';
import { ComputerVision } from './components/ai/ComputerVision';
import { PredictiveAnalytics } from './components/ai/PredictiveAnalytics';
import { IntelligentRecommendations } from './components/ai/IntelligentRecommendations';
import { AdvancedAIModels } from './components/ai/AdvancedAIModels';
import { AdvancedThemeSystem } from './components/creative/AdvancedThemeSystem';
import { CustomWallpaperEngine } from './components/creative/CustomWallpaperEngine';
import { InteractiveWidgets } from './components/creative/InteractiveWidgets';
import { PersonalizationFeatures } from './components/creative/PersonalizationFeatures';
import { CreativeTools } from './components/creative/CreativeTools';
import './styles/index.css';
import './styles/advanced-theme-system.css';
import './styles/smart-automation-system.css';
import './styles/enhanced-settings.css';
import './styles/enhanced-file-manager.css';
import './styles/enhanced-weather.css';
import './styles/enhanced-calendar.css';
import './styles/enhanced-notes.css';
              <div className="widget-title">{t('cpu_usage')}</div>
import './styles/gaming-entertainment.css';
import './styles/modern-desktop.css';
import './styles/enhanced-wallpaper.css';
import './styles/ultimate-desktop.css';
import './styles/advanced-desktop.css';
import './styles/login.css';
              <div className="widget-title">{t('memory')}</div>
import './styles/advanced-ui-enhancements.css';
import './styles/advanced-theme-selector.css';
import './styles/sound-effects-manager.css';
import './styles/mobile-optimization.css';
import './styles/integration-connectivity.css';
import './styles/ai-powered-features.css';
              <div className="widget-title">{t('disk_space')}</div>
import './styles/security-privacy.css';
import './styles/i18n-localization.css';
import './styles/advanced-ui-ux.css';
import './styles/system-optimization.css';
import './styles/future-technologies.css';
import './styles/advanced-automation.css';
              <div className="widget-title">{t('network')}</div>
import './styles/creative-design-enhancements.css';
import './styles/system-integration.css';
import './styles/task-management.css';
import './styles/analytics-dashboard.css';
import './styles/collaboration.css';
import './styles/task-templates.css';
import './styles/enhanced-ui.css';
import './styles/ai-features.css';
import './styles/ai-agents.css';
import './styles/autopilot.css';
import './styles/test-lab.css';
import './styles/ultimate.css';
                <h3 className="category-title">{t('category.productivity')}</h3>
                <p className="category-description">{t('category.productivity.description')}</p>
import Icon from './components/icons/Icon';
import { I18nProvider, useI18n } from './i18n/i18n';
import LanguageToggle from './components/ui/LanguageToggle';
import { appsConfig } from './apps-config';

// Desktop Component
const DesktopApp: React.FC = () => {
  const [activeApp, setActiveApp] = React.useState(null);
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

  // Mouse tracking for interactive wallpaper effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!desktopRef.current) return;
      const { clientX, clientY, currentTarget } = e;
      const { innerWidth, innerHeight } = window;
                <h3 className="category-title">{t('category.system')}</h3>
                <p className="category-description">{t('category.system.description')}</p>

      desktopRef.current?.style.setProperty('--mouse-x', `${x}`);
      desktopRef.current?.style.setProperty('--mouse-y', `${y}`);
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
        desktopEl.removeEventListener('mouseenter', () => desktopEl.classList.add('mouse-active'));
        desktopEl.removeEventListener('mouseleave', () => desktopEl.classList.remove('mouse-active'));
      }
    };
  }, []);

  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                <h3 className="category-title">{t('category.ai')}</h3>
                <p className="category-description">{t('category.ai.description')}</p>

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Apps configuration organized by categories with creative icons

        // Creative & Design Enhancements (Sixteenth Row)
        { id: 'advanced-theme-system', name: 'Advanced Themes', icon: '🎨', color: 'purple', component: AdvancedThemeSystem, category: 'creative' },
        { id: 'custom-wallpaper-engine', name: 'Wallpaper Engine', icon: '🖼️', color: 'blue', component: CustomWallpaperEngine, category: 'creative' },
        { id: 'interactive-widgets', name: 'Interactive Widgets', icon: '🧩', color: 'green', component: InteractiveWidgets, category: 'creative' },
        { id: 'personalization-features', name: 'Personalization', icon: '👤', color: 'orange', component: PersonalizationFeatures, category: 'creative' },
        { id: 'creative-tools', name: 'Creative Tools', icon: '🛠️', color: 'pink', component: CreativeTools, category: 'creative' }
  ];

  // Update system stats
  React.useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(15, Math.min(35, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(30, Math.min(95, prev.network + (Math.random() - 0.5) * 15))
                <h3 className="category-title">{t('category.collaboration')}</h3>
                <p className="category-description">{t('category.collaboration.description')}</p>

    return () => clearInterval(interval);
  }, []);

  const openApp = (appId) => {
    setActiveApp(appId);
  };

  const closeApp = () => {
    setActiveApp(null);
  };

  return (
    <MobileOptimizationProvider>
      <div className="amrikyy-desktop" style={{ direction: dir }}>
        {/* Dynamic Background */}
        <div className="desktop-background" ref={desktopRef}>
          <div className="background-gradient"></div>
          <div className="background-particles"></div>
          <div className="background-grid"></div>
        </div>

        {/* Desktop Content */}
        <div className="desktop-content">
          {/* Mobile App Launcher */}
                <h3 className="category-title">{t('category.development')}</h3>
                <p className="category-description">{t('category.development.description')}</p>
              apps={apps}
              onAppSelect={openApp}
            />
          ) : (
            <>
              {/* System Status Bar */}
              <div className="system-status-bar">
                <div className="status-left">
                  <div className="system-logo">
                    <Icon name="rocket" fallback="🚀" size={28} className="logo-icon-svg" />
                    <span className="logo-text">{t('desktop_title')}</span>
                  </div>
                  <div className="system-time">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <div className="status-center">
                  <div className="system-indicators">
                    <div className="indicator online">●</div>
                    <span>System Online</span>
                  </div>
                </div>
                <div className="status-right">
                  <div className="quick-actions">
                    <AdvancedThemeSelector />
                <h3 className="category-title">{t('category.advanced')}</h3>
                <p className="category-description">{t('category.advanced.description')}</p>
                    <LanguageToggle />
                    <div className="user-profile">
                      <img
                        src={user?.photoURL || '/default-avatar.png'}
                        alt={user?.displayName || 'User'}
                        className="user-avatar"
                      />
                      <div className="user-menu">
                        <div className="user-info">
                          <div className="user-name">{user?.displayName || 'User'}</div>
                          <div className="user-email">{user?.email}</div>
                        </div>
                        <button className="logout-btn" onClick={logout}>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

        {/* System Widgets */}
        <div className="system-widgets">
          <div className={`system-widget widget-blue`}>
            <div className="widget-icon">🖥️</div>
            <div className="widget-content">
              <span className="start-text">{t('start')}</span>
              <div className="widget-value">{Math.round(systemStats.cpu)}%</div>
            </div>
          </div>
          <div className={`system-widget widget-green`}>
            <div className="widget-icon">💾</div>
            <div className="widget-content">
              <div className="widget-title">Memory</div>
              <div className="widget-value">{Math.round(systemStats.memory)}%</div>
            </div>
          </div>
          <div className={`system-widget widget-purple`}>
            <div className="widget-icon">💿</div>
            <div className="widget-content">
              <div className="widget-title">Disk Space</div>
              <div className="widget-value">{Math.round(systemStats.disk)}%</div>
            </div>
          </div>
          <div className={`system-widget widget-cyan`}>
            <div className="widget-icon">🌐</div>
            <div className="widget-content">
              <div className="widget-title">Network</div>
              <div className="widget-value">{Math.round(systemStats.network)}%</div>
            </div>
          </div>
        </div>

        {/* Organized Desktop Apps */}
        <div className="organized-desktop-apps">
          {/* Productivity Apps */}
          <div className="app-category">
            <div className="category-header">
              <div className="category-icon">⚡</div>
              <div>
                <h3 className="category-title">Productivity</h3>
                <p className="category-description">Core productivity tools</p>
              </div>
            </div>
            <div className="category-apps">
              {apps.filter(app => app.category === 'productivity').map(app => (
                <div
                  key={app.id}
                  className={`app-icon ${activeApp === app.id ? 'active' : ''}`}
                  onClick={() => openApp(app.id)}
                >
                  <div className={`app-icon-image app-icon ${app.color}`}>
                    <div className="app-icon-content">
                      <Icon name={app.id} fallback={app.icon} size={36} />
                    </div>
                  </div>
                   <span className="app-icon-label">{app.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* System Management */}
          <div className="app-category">
            <div className="category-header">
              <div className="category-icon">⚙️</div>
              <div>
                <h3 className="category-title">System</h3>
                <p className="category-description">System management & utilities</p>
              </div>
            </div>
            <div className="category-apps">
              {apps.filter(app => app.category === 'system').map(app => (
                <div
                  key={app.id}
                  className={`app-icon ${activeApp === app.id ? 'active' : ''}`}
                  onClick={() => openApp(app.id)}
                >
                  <div className={`app-icon-image app-icon ${app.color}`}>
                    <div className="app-icon-content">
                      <Icon name={app.id} fallback={app.icon} size={36} />
                    </div>
                  </div>
                   <span className="app-icon-label">{app.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* AI & Automation */}
          <div className="app-category">
            <div className="category-header">
              <div className="category-icon">🤖</div>
              <div>
                <h3 className="category-title">AI & Automation</h3>
                <p className="category-description">Intelligent automation tools</p>
              </div>
            </div>
            <div className="category-apps">
              {apps.filter(app => app.category === 'ai').map(app => (
                <div
                  key={app.id}
                  className={`app-icon ${activeApp === app.id ? 'active' : ''}`}
                  onClick={() => openApp(app.id)}
                >
                  <div className={`app-icon-image app-icon ${app.color}`}>
                    <div className="app-icon-content">
                      <Icon name={app.id} fallback={app.icon} size={36} />
                    </div>
                  </div>
                   <span className="app-icon-label">{app.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Collaboration */}
          <div className="app-category">
            <div className="category-header">
              <div className="category-icon">🤝</div>
              <div>
                <h3 className="category-title">Collaboration</h3>
                <p className="category-description">Team collaboration & communication</p>
              </div>
            </div>
            <div className="category-apps">
              {apps.filter(app => app.category === 'collaboration').map(app => (
                <div
                  key={app.id}
                  className={`app-icon ${activeApp === app.id ? 'active' : ''}`}
                  onClick={() => openApp(app.id)}
                >
                  <div className={`app-icon-image app-icon ${app.color}`}>
                    <div className="app-icon-content">
                      <Icon name={app.id} fallback={app.icon} size={36} />
                    </div>
                  </div>
                   <span className="app-icon-label">{app.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Development & Premium */}
          <div className="app-category">
            <div className="category-header">
              <div className="category-icon">🚀</div>
              <div>
                <h3 className="category-title">Development & Premium</h3>
                <p className="category-description">Advanced tools & premium features</p>
              </div>
            </div>
            <div className="category-apps">
              {apps.filter(app => app.category === 'development' || app.category === 'premium').map(app => (
                <div
                  key={app.id}
                  className={`app-icon ${activeApp === app.id ? 'active' : ''}`}
                  onClick={() => openApp(app.id)}
                >
                  <div className={`app-icon-image app-icon ${app.color}`}>
                    <div className="app-icon-content">
                      <Icon name={app.id} fallback={app.icon} size={36} />
                    </div>
                  </div>
                   <span className="app-icon-label">{app.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Advanced Features */}
          <div className="app-category">
            <div className="category-header">
              <div className="category-icon">✨</div>
              <div>
                <h3 className="category-title">Advanced Features</h3>
                <p className="category-description">AI-powered themes & smart automation</p>
              </div>
            </div>
            <div className="category-apps">
              {apps.filter(app => app.category === 'advanced').map(app => (
                <div
                  key={app.id}
                  className={`app-icon ${activeApp === app.id ? 'active' : ''}`}
                  onClick={() => openApp(app.id)}
                >
                  <div className={`app-icon-image app-icon ${app.color}`}>
                    <div className="app-icon-content">
                      <Icon name={app.id} fallback={app.icon} size={36} />
                    </div>
                  </div>
                   <span className="app-icon-label">{app.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Taskbar */}
        <div className="taskbar">
          <div className="taskbar-left">
            <button className="start-button">
              <Icon name="rocket" fallback="🚀" size={18} className="start-icon-svg" />
              <span className="start-text">{t('start') /* localized Start */}</span>
            </button>
          </div>
          <div className="taskbar-center">
            <div className="running-apps">
              {apps.filter(app => activeApp === app.id).map(app => (
                <div key={app.id} className="running-app active">
                  <Icon name={app.id} fallback={app.icon} size={18} className={`app-icon-small-svg ${app.color}`} />
                  <span className="app-name">{app.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="taskbar-right">
            <div className="system-tray">
              <div className="tray-item">🔊</div>
              <div className="tray-item">🔋</div>
              <div className="tray-item">📶</div>
              <div className="tray-item">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
            </>
          )}
        </div>

        {/* App Windows */}
      {activeApp && (
        <div className="app-window">
          <div className="window-header">
            <div className="window-controls">
              <button className="control-btn close" onClick={closeApp}>×</button>
              <button className="control-btn minimize" onClick={() => setActiveApp(null)}>−</button>
              <button className="control-btn maximize">□</button>
            </div>
            <div className="window-title">{apps.find(app => app.id === activeApp)?.name}</div>
          </div>
          <div className="window-content">
            <div className="app-content">
              {(() => {
                const app = apps.find(app => app.id === activeApp);
                if (app?.component) {
                  const AppComponent = app.component;
                  return <AppComponent />;
                } else {
                  return (
                    <>
                      <h2>Welcome to {app?.name}</h2>
                      <p>This is the {app?.name} application.</p>
                      <div className="app-features">
                        <div className="feature-card">
                          <h3>Feature 1</h3>
                          <p>Advanced functionality</p>
                        </div>
                        <div className="feature-card">
                          <h3>Feature 2</h3>
                          <p>Smart automation</p>
                        </div>
                        <div className="feature-card">
                          <h3>Feature 3</h3>
                          <p>AI-powered insights</p>
                        </div>
                      </div>
                    </>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
      </div>
    </MobileOptimizationProvider>
  );
};

// Main App Component
function App() {
  const { user, loading } = useAuth();

  if (loading) {
  return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">🚀</div>
          <div className="loading-text">Amrikyy AIOS System</div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <DesktopApp />;
}

// App with Auth Provider
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

