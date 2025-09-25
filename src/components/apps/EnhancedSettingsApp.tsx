import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';

interface SystemSettings {
  performance: {
    cpuOptimization: boolean;
    memoryOptimization: boolean;
    networkOptimization: boolean;
    autoCleanup: boolean;
    backgroundProcesses: number;
  };
  display: {
    resolution: string;
    refreshRate: number;
    brightness: number;
    contrast: number;
    colorProfile: string;
    scaling: number;
  };
  audio: {
    masterVolume: number;
    systemSounds: boolean;
    notificationSounds: boolean;
    microphoneLevel: number;
    speakerLevel: number;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReports: boolean;
    locationServices: boolean;
    cameraAccess: boolean;
    microphoneAccess: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    biometricAuth: boolean;
    sessionTimeout: number;
    autoLock: boolean;
    passwordComplexity: string;
  };
}

interface UserProfile {
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
}

interface NotificationSettings {
  desktop: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
  vibration: boolean;
  categories: {
    system: boolean;
    tasks: boolean;
    collaboration: boolean;
    security: boolean;
    updates: boolean;
  };
}

export const EnhancedSettingsApp: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings, updateSetting } = useUserSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    performance: {
      cpuOptimization: true,
      memoryOptimization: true,
      networkOptimization: true,
      autoCleanup: true,
      backgroundProcesses: 5
    },
    display: {
      resolution: '1920x1080',
      refreshRate: 60,
      brightness: 80,
      contrast: 100,
      colorProfile: 'sRGB',
      scaling: 100
    },
    audio: {
      masterVolume: 70,
      systemSounds: true,
      notificationSounds: true,
      microphoneLevel: 50,
      speakerLevel: 70
    },
    privacy: {
      dataCollection: false,
      analytics: true,
      crashReports: true,
      locationServices: false,
      cameraAccess: false,
      microphoneAccess: false
    },
    security: {
      twoFactorAuth: false,
      biometricAuth: false,
      sessionTimeout: 30,
      autoLock: true,
      passwordComplexity: 'medium'
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: user?.displayName || '',
    email: user?.email || '',
    avatar: user?.photoURL || '',
    bio: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    desktop: true,
    email: true,
    push: true,
    sound: true,
    vibration: true,
    categories: {
      system: true,
      tasks: true,
      collaboration: true,
      security: true,
      updates: false
    }
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    cloudBackup: true,
    localBackup: true,
    retentionDays: 30
  });

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'display', name: 'Display', icon: '🖥️' },
    { id: 'audio', name: 'Audio', icon: '🔊' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'backup', name: 'Backup', icon: '💾' },
    { id: 'advanced', name: 'Advanced', icon: '🔧' }
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load user settings from Firestore
    const loadSettings = async () => {
      try {
        // This would typically load from Firestore
        // For now, we'll use default values
        setLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Save to Firestore
      await updateSetting('systemSettings', systemSettings);
      await updateSetting('userProfile', userProfile);
      await updateSetting('notificationSettings', notificationSettings);
      await updateSetting('backupSettings', backupSettings);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset to default values
      setSystemSettings({
        performance: {
          cpuOptimization: true,
          memoryOptimization: true,
          networkOptimization: true,
          autoCleanup: true,
          backgroundProcesses: 5
        },
        display: {
          resolution: '1920x1080',
          refreshRate: 60,
          brightness: 80,
          contrast: 100,
          colorProfile: 'sRGB',
          scaling: 100
        },
        audio: {
          masterVolume: 70,
          systemSounds: true,
          notificationSounds: true,
          microphoneLevel: 50,
          speakerLevel: 70
        },
        privacy: {
          dataCollection: false,
          analytics: true,
          crashReports: true,
          locationServices: false,
          cameraAccess: false,
          microphoneAccess: false
        },
        security: {
          twoFactorAuth: false,
          biometricAuth: false,
          sessionTimeout: 30,
          autoLock: true,
          passwordComplexity: 'medium'
        }
      });
    }
  };

  const exportSettings = () => {
    const settingsData = {
      systemSettings,
      userProfile,
      notificationSettings,
      backupSettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amrikyy-aios-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settingsData = JSON.parse(e.target?.result as string);
        setSystemSettings(settingsData.systemSettings || systemSettings);
        setUserProfile(settingsData.userProfile || userProfile);
        setNotificationSettings(settingsData.notificationSettings || notificationSettings);
        setBackupSettings(settingsData.backupSettings || backupSettings);
        alert('Settings imported successfully!');
      } catch (error) {
        alert('Error importing settings. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="enhanced-settings-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="enhanced-settings-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access settings</p>
          <button
            className="auth-btn"
            onClick={() => window.location.reload()}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-settings-app">
      <div className="settings-header">
        <h2>⚙️ Enhanced Settings</h2>
        <div className="header-actions">
          <button 
            className="export-btn"
            onClick={exportSettings}
            title="Export Settings"
          >
            📤 Export
          </button>
          <label className="import-btn" title="Import Settings">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            className="reset-btn"
            onClick={resetSettings}
            title="Reset Settings"
          >
            🔄 Reset
          </button>
          <button 
            className={`save-btn ${saving ? 'saving' : ''}`}
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? '💾 Saving...' : '💾 Save'}
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <div className="user-profile-card">
            <img 
              src={userProfile.avatar || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-avatar"
            />
            <div className="profile-info">
              <h3>{userProfile.displayName || 'User'}</h3>
              <p>{userProfile.email}</p>
            </div>
          </div>
          
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Language & Region</h4>
                  <div className="setting-item">
                    <label>Language</label>
                    <select 
                      value={userProfile.language}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, language: e.target.value }))}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Timezone</label>
                    <select 
                      value={userProfile.timezone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, timezone: e.target.value }))}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Date & Time</h4>
                  <div className="setting-item">
                    <label>Date Format</label>
                    <select 
                      value={userProfile.dateFormat}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, dateFormat: e.target.value }))}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Time Format</label>
                    <select 
                      value={userProfile.timeFormat}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, timeFormat: e.target.value }))}
                    >
                      <option value="12h">12-hour</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>User Profile</h3>
              <div className="profile-settings">
                <div className="profile-avatar-section">
                  <img 
                    src={userProfile.avatar || '/default-avatar.png'} 
                    alt="Profile" 
                    className="large-avatar"
                  />
                  <button className="change-avatar-btn">Change Avatar</button>
                </div>
                
                <div className="profile-form">
                  <div className="form-group">
                    <label>Display Name</label>
                    <input
                      type="text"
                      value={userProfile.displayName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Enter your display name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="settings-section">
              <h3>Display Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Screen</h4>
                  <div className="setting-item">
                    <label>Resolution</label>
                    <select 
                      value={systemSettings.display.resolution}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, resolution: e.target.value }
                      }))}
                    >
                      <option value="1920x1080">1920x1080 (Full HD)</option>
                      <option value="2560x1440">2560x1440 (2K)</option>
                      <option value="3840x2160">3840x2160 (4K)</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Refresh Rate</label>
                    <select 
                      value={systemSettings.display.refreshRate}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, refreshRate: parseInt(e.target.value) }
                      }))}
                    >
                      <option value="60">60 Hz</option>
                      <option value="120">120 Hz</option>
                      <option value="144">144 Hz</option>
                      <option value="240">240 Hz</option>
                    </select>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Visual</h4>
                  <div className="setting-item">
                    <label>Brightness: {systemSettings.display.brightness}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={systemSettings.display.brightness}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, brightness: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Contrast: {systemSettings.display.contrast}%</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={systemSettings.display.contrast}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, contrast: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Scaling: {systemSettings.display.scaling}%</label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={systemSettings.display.scaling}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, scaling: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="settings-section">
              <h3>Audio Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Volume</h4>
                  <div className="setting-item">
                    <label>Master Volume: {systemSettings.audio.masterVolume}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={systemSettings.audio.masterVolume}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        audio: { ...prev.audio, masterVolume: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Speaker Level: {systemSettings.audio.speakerLevel}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={systemSettings.audio.speakerLevel}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        audio: { ...prev.audio, speakerLevel: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Microphone Level: {systemSettings.audio.microphoneLevel}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={systemSettings.audio.microphoneLevel}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        audio: { ...prev.audio, microphoneLevel: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Sounds</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.audio.systemSounds}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          audio: { ...prev.audio, systemSounds: e.target.checked }
                        }))}
                      />
                      System Sounds
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.audio.notificationSounds}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          audio: { ...prev.audio, notificationSounds: e.target.checked }
                        }))}
                      />
                      Notification Sounds
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>General</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={notificationSettings.desktop}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          desktop: e.target.checked
                        }))}
                      />
                      Desktop Notifications
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          email: e.target.checked
                        }))}
                      />
                      Email Notifications
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={notificationSettings.push}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          push: e.target.checked
                        }))}
                      />
                      Push Notifications
                    </label>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Categories</h4>
                  {Object.entries(notificationSettings.categories).map(([key, value]) => (
                    <div key={key} className="setting-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            categories: { ...prev.categories, [key]: e.target.checked }
                          }))}
                        />
                        {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h3>Privacy Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Data Collection</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.privacy.dataCollection}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, dataCollection: e.target.checked }
                        }))}
                      />
                      Allow Data Collection
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.privacy.analytics}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, analytics: e.target.checked }
                        }))}
                      />
                      Analytics & Usage Data
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.privacy.crashReports}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, crashReports: e.target.checked }
                        }))}
                      />
                      Crash Reports
                    </label>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Permissions</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.privacy.locationServices}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, locationServices: e.target.checked }
                        }))}
                      />
                      Location Services
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.privacy.cameraAccess}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, cameraAccess: e.target.checked }
                        }))}
                      />
                      Camera Access
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.privacy.microphoneAccess}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, microphoneAccess: e.target.checked }
                        }))}
                      />
                      Microphone Access
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Authentication</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.security.twoFactorAuth}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactorAuth: e.target.checked }
                        }))}
                      />
                      Two-Factor Authentication
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.security.biometricAuth}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, biometricAuth: e.target.checked }
                        }))}
                      />
                      Biometric Authentication
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.security.autoLock}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, autoLock: e.target.checked }
                        }))}
                      />
                      Auto-Lock Screen
                    </label>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Session</h4>
                  <div className="setting-item">
                    <label>Session Timeout: {systemSettings.security.sessionTimeout} minutes</label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      value={systemSettings.security.sessionTimeout}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Password Complexity</label>
                    <select 
                      value={systemSettings.security.passwordComplexity}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, passwordComplexity: e.target.value }
                      }))}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="settings-section">
              <h3>Performance Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Optimization</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.performance.cpuOptimization}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          performance: { ...prev.performance, cpuOptimization: e.target.checked }
                        }))}
                      />
                      CPU Optimization
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.performance.memoryOptimization}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          performance: { ...prev.performance, memoryOptimization: e.target.checked }
                        }))}
                      />
                      Memory Optimization
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.performance.networkOptimization}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          performance: { ...prev.performance, networkOptimization: e.target.checked }
                        }))}
                      />
                      Network Optimization
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={systemSettings.performance.autoCleanup}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          performance: { ...prev.performance, autoCleanup: e.target.checked }
                        }))}
                      />
                      Auto Cleanup
                    </label>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Background Processes</h4>
                  <div className="setting-item">
                    <label>Max Background Processes: {systemSettings.performance.backgroundProcesses}</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={systemSettings.performance.backgroundProcesses}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, backgroundProcesses: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="settings-section">
              <h3>Backup & Data Management</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Backup Settings</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={backupSettings.autoBackup}
                        onChange={(e) => setBackupSettings(prev => ({
                          ...prev,
                          autoBackup: e.target.checked
                        }))}
                      />
                      Automatic Backup
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Backup Frequency</label>
                    <select 
                      value={backupSettings.backupFrequency}
                      onChange={(e) => setBackupSettings(prev => ({
                        ...prev,
                        backupFrequency: e.target.value
                      }))}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Retention Period: {backupSettings.retentionDays} days</label>
                    <input
                      type="range"
                      min="7"
                      max="365"
                      value={backupSettings.retentionDays}
                      onChange={(e) => setBackupSettings(prev => ({
                        ...prev,
                        retentionDays: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Storage</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={backupSettings.cloudBackup}
                        onChange={(e) => setBackupSettings(prev => ({
                          ...prev,
                          cloudBackup: e.target.checked
                        }))}
                      />
                      Cloud Backup
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={backupSettings.localBackup}
                        onChange={(e) => setBackupSettings(prev => ({
                          ...prev,
                          localBackup: e.target.checked
                        }))}
                      />
                      Local Backup
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="settings-section">
              <h3>Advanced Settings</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Developer Options</h4>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" />
                      Developer Mode
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" />
                      Debug Logging
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" />
                      Performance Monitoring
                    </label>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>System</h4>
                  <div className="setting-item">
                    <button className="danger-btn">Clear Cache</button>
                  </div>
                  <div className="setting-item">
                    <button className="danger-btn">Reset All Data</button>
                  </div>
                  <div className="setting-item">
                    <button className="danger-btn" onClick={logout}>Sign Out</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
