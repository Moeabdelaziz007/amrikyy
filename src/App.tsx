import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserSettingsProvider } from './contexts/UserSettingsContext';
import LoginScreen from './components/auth/LoginScreen';
import { 
  FileManagerApp, 
  WeatherApp, 
  SettingsApp, 
  CalendarApp, 
  NotesApp 
} from './components/apps/AdvancedApps';
import { EnhancedSettingsApp } from './components/apps/EnhancedSettingsApp';
import { EnhancedFileManagerApp } from './components/apps/EnhancedFileManagerApp';
import { EnhancedWeatherApp } from './components/apps/EnhancedWeatherApp';
import { EnhancedCalendarApp } from './components/apps/EnhancedCalendarApp';
import { EnhancedNotesApp } from './components/apps/EnhancedNotesApp';
import { AITravelAgencyApp } from './components/apps/AITravelAgencyApp';
import { 
  TelegramBotApp, 
  AutomationDashboardApp, 
  MCPToolsApp 
} from './components/apps/SystemIntegrationApps';
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
import { AdvancedThemeSelector } from './components/ui/AdvancedThemeSelector';
import { SmartAutomationSystem } from './components/ai/SmartAutomationSystem';
import './styles/index.css';
import './styles/advanced-theme-system.css';
import './styles/smart-automation-system.css';
import './styles/enhanced-settings.css';
import './styles/enhanced-file-manager.css';
import './styles/enhanced-weather.css';
import './styles/enhanced-calendar.css';
import './styles/enhanced-notes.css';
import './styles/ai-travel-agency.css';
import './styles/modern-desktop.css';
import './styles/enhanced-wallpaper.css';
import './styles/ultimate-desktop.css';
import './styles/advanced-desktop.css';
import './styles/login.css';
import './styles/enhanced-ui.css';
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
import './styles/firestore-test.css';

// Desktop Component
const DesktopApp: React.FC = () => {
  const [activeApp, setActiveApp] = React.useState(null);
  const [systemStats, setSystemStats] = React.useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89
  });
  const { user, logout } = useAuth();

  // Apps configuration organized by categories
  const apps = [
    // Core Productivity Apps (Top Row)
    { id: 'dashboard', name: 'Dashboard', icon: '📊', color: 'blue', component: AnalyticsDashboardApp, category: 'productivity' },
    { id: 'tasks', name: 'Tasks', icon: '📋', color: 'purple', component: TaskManagementApp, category: 'productivity' },
    { id: 'calendar', name: 'Calendar', icon: '📅', color: 'red', component: EnhancedCalendarApp, category: 'productivity' },
    { id: 'notes', name: 'Notes', icon: '📝', color: 'yellow', component: EnhancedNotesApp, category: 'productivity' },
    
    // Travel & Lifestyle Apps (Second Row)
    { id: 'travel', name: 'AI Travel', icon: '✈️', color: 'cyan', component: AITravelAgencyApp, category: 'lifestyle' },
    
    // File & System Management (Second Row)
    { id: 'file-manager', name: 'Files', icon: '📁', color: 'orange', component: EnhancedFileManagerApp, category: 'system' },
    { id: 'settings', name: 'Settings', icon: '⚙️', color: 'gray', component: EnhancedSettingsApp, category: 'system' },
    { id: 'ui', name: 'UI/UX', icon: '🎨', color: 'purple', component: EnhancedUIApp, category: 'system' },
    { id: 'weather', name: 'Weather', icon: '🌤️', color: 'cyan', component: EnhancedWeatherApp, category: 'system' },
    
    // AI & Automation (Third Row)
    { id: 'ai-agents', name: 'AI Agents', icon: '🤖', color: 'green', component: AIAgentsApp, category: 'ai' },
    { id: 'ai', name: 'AI Features', icon: '🧠', color: 'cyan', component: AIFeaturesApp, category: 'ai' },
    { id: 'automation', name: 'Automation', icon: '⚡', color: 'purple', component: AutomationDashboardApp, category: 'ai' },
    { id: 'autopilot', name: 'Autopilot', icon: '🛸', color: 'purple', component: AutopilotApp, category: 'ai' },
    
    // Collaboration & Templates (Fourth Row)
    { id: 'collaboration', name: 'Collaborate', icon: '🤝', color: 'blue', component: CollaborationApp, category: 'collaboration' },
    { id: 'templates', name: 'Templates', icon: '🤖', color: 'green', component: TaskTemplatesApp, category: 'collaboration' },
    { id: 'telegram', name: 'Telegram', icon: '💬', color: 'blue', component: TelegramBotApp, category: 'collaboration' },
    { id: 'mcp-tools', name: 'MCP Tools', icon: '🔧', color: 'green', component: MCPToolsApp, category: 'collaboration' },
    
    // Development & Testing (Fifth Row)
    { id: 'test-lab', name: 'Test Lab', icon: '🧪', color: 'red', component: TestLabApp, category: 'development' },
    { id: 'firestore-test', name: 'Firestore Test', icon: '🔥', color: 'red', component: FirestoreTestApp, category: 'development' },
    { id: 'ultimate', name: 'Ultimate', icon: '🌟', color: 'gold', component: UltimateApp, category: 'premium' },
    
    // Advanced Features (Sixth Row)
    { id: 'advanced-themes', name: 'Advanced Themes', icon: '🎨', color: 'purple', component: AdvancedThemeSelector, category: 'advanced' },
    { id: 'smart-automation', name: 'Smart Automation', icon: '🤖', color: 'cyan', component: SmartAutomationSystem, category: 'advanced' }
  ];

  // Update system stats
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(15, Math.min(35, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(30, Math.min(95, prev.network + (Math.random() - 0.5) * 15))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const openApp = (appId) => {
    setActiveApp(appId);
  };

  const closeApp = () => {
    setActiveApp(null);
  };

  return (
    <div className="amrikyy-desktop">
      {/* Dynamic Background */}
      <div className="desktop-background">
        <div className="background-gradient"></div>
        <div className="background-particles"></div>
        <div className="background-grid"></div>
      </div>

      {/* Desktop Content */}
      <div className="desktop-content">
        {/* System Status Bar */}
        <div className="system-status-bar">
          <div className="status-left">
            <div className="system-logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">Amrikyy AIOS</span>
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
              <button className="action-btn" title="Settings">⚙️</button>
              <button className="action-btn" title="Notifications">🔔</button>
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
              <div className="widget-title">CPU Usage</div>
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
                    <div className="app-icon-content">{app.icon}</div>
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
                    <div className="app-icon-content">{app.icon}</div>
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
                    <div className="app-icon-content">{app.icon}</div>
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
                    <div className="app-icon-content">{app.icon}</div>
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
                    <div className="app-icon-content">{app.icon}</div>
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
                    <div className="app-icon-content">{app.icon}</div>
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
              <span className="start-icon">🚀</span>
              <span className="start-text">Start</span>
            </button>
          </div>
          <div className="taskbar-center">
            <div className="running-apps">
              {apps.filter(app => activeApp === app.id).map(app => (
                <div key={app.id} className="running-app active">
                  <span className={`app-icon-small app-icon ${app.color}`}>{app.icon}</span>
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
    <AuthProvider>
      <UserSettingsProvider>
        <App />
      </UserSettingsProvider>
    </AuthProvider>
  );
}

export default AppWithAuth;