import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Settings,
  User,
  Database,
  Wifi,
  Smartphone,
  Monitor,
  Globe,
  Bell,
  FileText,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricAuth: boolean;
  sessionTimeout: number;
  passwordComplexity: 'low' | 'medium' | 'high';
  dataEncryption: boolean;
  privacyMode: boolean;
  locationTracking: boolean;
  analyticsSharing: boolean;
  crashReporting: boolean;
  autoLogout: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'security_update' | 'suspicious_activity';
  timestamp: Date;
  location: string;
  device: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'blocked';
  description: string;
}

interface PrivacySettings {
  dataRetention: number;
  dataSharing: boolean;
  marketingEmails: boolean;
  personalizedAds: boolean;
  locationServices: boolean;
  cameraAccess: boolean;
  microphoneAccess: boolean;
  contactsAccess: boolean;
  calendarAccess: boolean;
  fileAccess: boolean;
}

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  lastActive: Date;
  location: string;
  isCurrent: boolean;
  trusted: boolean;
}

export const SecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'privacy' | 'devices' | 'activity' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);

  // Mock data - in production, this would come from Firebase
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    biometricAuth: false,
    sessionTimeout: 30,
    passwordComplexity: 'high',
    dataEncryption: true,
    privacyMode: false,
    locationTracking: true,
    analyticsSharing: true,
    crashReporting: true,
    autoLogout: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataRetention: 365,
    dataSharing: false,
    marketingEmails: false,
    personalizedAds: false,
    locationServices: true,
    cameraAccess: true,
    microphoneAccess: true,
    contactsAccess: false,
    calendarAccess: true,
    fileAccess: true
  });

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'New York, US',
      device: 'Chrome on MacBook Pro',
      ipAddress: '192.168.1.100',
      status: 'success',
      description: 'Successful login from trusted device'
    },
    {
      id: '2',
      type: 'password_change',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      location: 'New York, US',
      device: 'Chrome on MacBook Pro',
      ipAddress: '192.168.1.100',
      status: 'success',
      description: 'Password updated successfully'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      location: 'Unknown',
      device: 'Unknown Device',
      ipAddress: '203.0.113.1',
      status: 'blocked',
      description: 'Failed login attempt from unrecognized location'
    }
  ]);

  const [devices] = useState<DeviceInfo[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      os: 'macOS 14.0',
      browser: 'Chrome 120.0',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'New York, US',
      isCurrent: true,
      trusted: true
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      os: 'iOS 17.2',
      browser: 'Safari 17.2',
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
      location: 'New York, US',
      isCurrent: false,
      trusted: true
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      os: 'iPadOS 17.2',
      browser: 'Safari 17.2',
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      location: 'New York, US',
      isCurrent: false,
      trusted: false
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getSecurityScore = () => {
    let score = 0;
    if (securitySettings.twoFactorAuth) score += 20;
    if (securitySettings.biometricAuth) score += 15;
    if (securitySettings.dataEncryption) score += 20;
    if (securitySettings.passwordComplexity === 'high') score += 15;
    if (securitySettings.autoLogout) score += 10;
    if (privacySettings.dataSharing === false) score += 10;
    if (privacySettings.locationServices) score += 5;
    if (privacySettings.cameraAccess) score += 5;
    return Math.min(100, score);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="w-4 h-4 text-green-500" />;
      case 'logout': return <User className="w-4 h-4 text-blue-500" />;
      case 'password_change': return <Key className="w-4 h-4 text-yellow-500" />;
      case 'security_update': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-yellow-500';
      case 'blocked': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Monitor className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const handleSecuritySettingChange = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacySettingChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const revokeDevice = (deviceId: string) => {
    // In production, this would call an API to revoke device access
    console.log('Revoking device:', deviceId);
  };

  const downloadData = () => {
    // In production, this would generate and download user data
    console.log('Downloading user data...');
  };

  const deleteAccount = () => {
    // In production, this would initiate account deletion process
    console.log('Initiating account deletion...');
  };

  if (loading) {
    return (
      <div className="security-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading security settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="security-dashboard">
      <div className="security-header">
        <div className="header-content">
          <div className="header-title">
            <Shield className="header-icon" />
            <h1>Security & Privacy</h1>
          </div>
        </div>
      </div>

      <div className="security-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Shield className="tab-icon" />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <Eye className="tab-icon" />
          Privacy
        </button>
        <button 
          className={`tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          <Smartphone className="tab-icon" />
          Devices
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <FileText className="tab-icon" />
          Activity
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="security-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="security-score">
              <div className="score-card">
                <div className="score-header">
                  <Shield className="score-icon" />
                  <h3>Security Score</h3>
                </div>
                <div className="score-circle">
                  <div className="score-value">{getSecurityScore()}</div>
                  <div className="score-label">/100</div>
                </div>
                <div className="score-status">
                  {getSecurityScore() >= 80 ? 'Excellent' : 
                   getSecurityScore() >= 60 ? 'Good' : 
                   getSecurityScore() >= 40 ? 'Fair' : 'Poor'}
                </div>
              </div>
            </div>

            <div className="security-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <Lock className="metric-icon" />
                  <span className="metric-label">Two-Factor Auth</span>
                </div>
                <div className="metric-value">
                  {securitySettings.twoFactorAuth ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="metric-status">
                  {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Database className="metric-icon" />
                  <span className="metric-label">Data Encryption</span>
                </div>
                <div className="metric-value">
                  {securitySettings.dataEncryption ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="metric-status">
                  {securitySettings.dataEncryption ? 'Enabled' : 'Disabled'}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Key className="metric-icon" />
                  <span className="metric-label">Password Strength</span>
                </div>
                <div className="metric-value">
                  <span className={`strength-${securitySettings.passwordComplexity}`}>
                    {securitySettings.passwordComplexity.toUpperCase()}
                  </span>
                </div>
                <div className="metric-status">
                  {securitySettings.passwordComplexity === 'high' ? 'Strong' : 
                   securitySettings.passwordComplexity === 'medium' ? 'Medium' : 'Weak'}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Globe className="metric-icon" />
                  <span className="metric-label">Active Devices</span>
                </div>
                <div className="metric-value">{devices.length}</div>
                <div className="metric-status">
                  {devices.filter(d => d.trusted).length} trusted
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-button">
                  <Key className="action-icon" />
                  <span>Change Password</span>
                </button>
                <button className="action-button">
                  <Shield className="action-icon" />
                  <span>Enable 2FA</span>
                </button>
                <button className="action-button">
                  <Download className="action-icon" />
                  <span>Download Data</span>
                </button>
                <button className="action-button">
                  <Trash2 className="action-icon" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="privacy-tab">
            <div className="privacy-settings">
              <h3>Privacy Controls</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Data Sharing</h4>
                    <p>Allow sharing of anonymized data for product improvement</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.dataSharing}
                      onChange={(e) => handlePrivacySettingChange('dataSharing', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Location Services</h4>
                    <p>Allow access to your location for enhanced features</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.locationServices}
                      onChange={(e) => handlePrivacySettingChange('locationServices', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Camera Access</h4>
                    <p>Allow camera access for photo and video features</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.cameraAccess}
                      onChange={(e) => handlePrivacySettingChange('cameraAccess', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Microphone Access</h4>
                    <p>Allow microphone access for voice features</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.microphoneAccess}
                      onChange={(e) => handlePrivacySettingChange('microphoneAccess', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Contacts Access</h4>
                    <p>Allow access to contacts for collaboration features</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.contactsAccess}
                      onChange={(e) => handlePrivacySettingChange('contactsAccess', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Calendar Access</h4>
                    <p>Allow access to calendar for scheduling features</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.calendarAccess}
                      onChange={(e) => handlePrivacySettingChange('calendarAccess', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="data-controls">
              <h3>Data Controls</h3>
              <div className="controls-grid">
                <div className="control-item">
                  <div className="control-info">
                    <h4>Data Retention</h4>
                    <p>How long to keep your data</p>
                  </div>
                  <select 
                    value={privacySettings.dataRetention}
                    onChange={(e) => handlePrivacySettingChange('dataRetention', Number(e.target.value))}
                    className="data-retention-select"
                  >
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                    <option value={1095}>3 years</option>
                  </select>
                </div>

                <div className="control-item">
                  <div className="control-info">
                    <h4>Export Data</h4>
                    <p>Download a copy of your data</p>
                  </div>
                  <button className="export-button" onClick={downloadData}>
                    <Download className="button-icon" />
                    Export Data
                  </button>
                </div>

                <div className="control-item">
                  <div className="control-info">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and data</p>
                  </div>
                  <button className="delete-button" onClick={deleteAccount}>
                    <Trash2 className="button-icon" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="devices-tab">
            <div className="devices-list">
              <h3>Connected Devices</h3>
              {devices.map((device) => (
                <div key={device.id} className={`device-item ${device.isCurrent ? 'current' : ''}`}>
                  <div className="device-icon">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="device-info">
                    <div className="device-header">
                      <h4 className="device-name">{device.name}</h4>
                      {device.isCurrent && (
                        <span className="current-badge">Current</span>
                      )}
                      {device.trusted && (
                        <span className="trusted-badge">Trusted</span>
                      )}
                    </div>
                    <div className="device-details">
                      <span>{device.os} • {device.browser}</span>
                      <span>{device.location}</span>
                      <span>Last active: {device.lastActive.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="device-actions">
                    {!device.isCurrent && (
                      <button 
                        className="revoke-button"
                        onClick={() => revokeDevice(device.id)}
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-tab">
            <div className="activity-list">
              <h3>Security Activity</h3>
              {securityEvents.map((event) => (
                <div key={event.id} className="activity-item">
                  <div className="activity-icon">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-type">{event.type.replace('_', ' ')}</span>
                      <span className={`activity-status ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="activity-description">{event.description}</div>
                    <div className="activity-details">
                      <span>{event.device}</span>
                      <span>{event.location}</span>
                      <span>{event.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="security-settings">
              <h3>Security Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSecuritySettingChange('twoFactorAuth', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Biometric Authentication</h4>
                    <p>Use fingerprint or face recognition for login</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.biometricAuth}
                      onChange={(e) => handleSecuritySettingChange('biometricAuth', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Data Encryption</h4>
                    <p>Encrypt all data stored on our servers</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.dataEncryption}
                      onChange={(e) => handleSecuritySettingChange('dataEncryption', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Logout</h4>
                    <p>Automatically log out after period of inactivity</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.autoLogout}
                      onChange={(e) => handleSecuritySettingChange('autoLogout', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Session Timeout</h4>
                    <p>Minutes of inactivity before auto logout</p>
                  </div>
                  <select 
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecuritySettingChange('sessionTimeout', Number(e.target.value))}
                    className="session-timeout-select"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Password Complexity</h4>
                    <p>Required password strength level</p>
                  </div>
                  <select 
                    value={securitySettings.passwordComplexity}
                    onChange={(e) => handleSecuritySettingChange('passwordComplexity', e.target.value)}
                    className="password-complexity-select"
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
      </div>
    </div>
  );
};
