import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Lock, 
  Key, 
  Shield, 
  Database, 
  FileText, 
  Upload, 
  Download,
  CheckCircle,
  AlertTriangle,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Search
} from 'lucide-react';

interface EncryptionKey {
  id: string;
  name: string;
  type: 'AES-256' | 'RSA-2048' | 'RSA-4096' | 'ECDSA';
  created: Date;
  lastUsed: Date;
  status: 'active' | 'expired' | 'revoked';
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
}

interface EncryptedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  encrypted: boolean;
  keyId: string;
  uploaded: Date;
  lastAccessed: Date;
  permissions: 'read' | 'write' | 'admin';
}

interface EncryptionSettings {
  defaultAlgorithm: 'AES-256' | 'RSA-2048' | 'RSA-4096' | 'ECDSA';
  keyRotation: number; // days
  autoEncrypt: boolean;
  encryptBackups: boolean;
  encryptTransit: boolean;
  encryptAtRest: boolean;
  zeroKnowledge: boolean;
}

interface SecurityAudit {
  id: string;
  type: 'encryption' | 'key_rotation' | 'access' | 'breach';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
}

export const DataEncryption: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'files' | 'settings' | 'audit'>('overview');
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState(false);

  // Mock data - in production, this would come from Firebase
  const [encryptionKeys] = useState<EncryptionKey[]>([
    {
      id: '1',
      name: 'Primary AES Key',
      type: 'AES-256',
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      strength: 'very-strong'
    },
    {
      id: '2',
      name: 'RSA Public Key',
      type: 'RSA-4096',
      created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'active',
      strength: 'very-strong'
    },
    {
      id: '3',
      name: 'Legacy Key',
      type: 'RSA-2048',
      created: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'expired',
      strength: 'strong'
    }
  ]);

  const [encryptedFiles] = useState<EncryptedFile[]>([
    {
      id: '1',
      name: 'sensitive-document.pdf',
      size: 2048576,
      type: 'PDF',
      encrypted: true,
      keyId: '1',
      uploaded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastAccessed: new Date(Date.now() - 4 * 60 * 60 * 1000),
      permissions: 'read'
    },
    {
      id: '2',
      name: 'financial-data.xlsx',
      size: 1024000,
      type: 'Excel',
      encrypted: true,
      keyId: '2',
      uploaded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastAccessed: new Date(Date.now() - 12 * 60 * 60 * 1000),
      permissions: 'write'
    },
    {
      id: '3',
      name: 'personal-notes.txt',
      size: 512000,
      type: 'Text',
      encrypted: false,
      keyId: '',
      uploaded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastAccessed: new Date(Date.now() - 1 * 60 * 60 * 1000),
      permissions: 'admin'
    }
  ]);

  const [encryptionSettings, setEncryptionSettings] = useState<EncryptionSettings>({
    defaultAlgorithm: 'AES-256',
    keyRotation: 90,
    autoEncrypt: true,
    encryptBackups: true,
    encryptTransit: true,
    encryptAtRest: true,
    zeroKnowledge: false
  });

  const [securityAudits] = useState<SecurityAudit[]>([
    {
      id: '1',
      type: 'key_rotation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: 'medium',
      description: 'Key rotation completed successfully',
      resolved: true
    },
    {
      id: '2',
      type: 'encryption',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      severity: 'low',
      description: 'New file encrypted with AES-256',
      resolved: true
    },
    {
      id: '3',
      type: 'access',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      severity: 'high',
      description: 'Unauthorized access attempt detected',
      resolved: false
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getKeyStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-strong': return 'text-green-500';
      case 'strong': return 'text-blue-500';
      case 'medium': return 'text-yellow-500';
      case 'weak': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getKeyStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'very-strong': return <Shield className="w-4 h-4 text-green-500" />;
      case 'strong': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'weak': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'expired': return 'text-yellow-500';
      case 'revoked': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEncryptionCoverage = () => {
    const totalFiles = encryptedFiles.length;
    const encryptedCount = encryptedFiles.filter(f => f.encrypted).length;
    return Math.round((encryptedCount / totalFiles) * 100);
  };

  const handleSettingChange = (key: keyof EncryptionSettings, value: any) => {
    setEncryptionSettings(prev => ({ ...prev, [key]: value }));
  };

  const generateNewKey = () => {
    // In production, this would generate a new encryption key
    console.log('Generating new encryption key...');
  };

  const rotateKeys = () => {
    // In production, this would rotate all encryption keys
    console.log('Rotating encryption keys...');
  };

  const encryptFile = (fileId: string) => {
    // In production, this would encrypt the specified file
    console.log('Encrypting file:', fileId);
  };

  const decryptFile = (fileId: string) => {
    // In production, this would decrypt the specified file
    console.log('Decrypting file:', fileId);
  };

  if (loading) {
    return (
      <div className="data-encryption">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading encryption settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-encryption">
      <div className="encryption-header">
        <div className="header-content">
          <div className="header-title">
            <Lock className="header-icon" />
            <h1>Data Encryption</h1>
          </div>
          <div className="header-controls">
            <button 
              className="action-button"
              onClick={() => setShowKeys(!showKeys)}
            >
              {showKeys ? <EyeOff className="button-icon" /> : <Eye className="button-icon" />}
              {showKeys ? 'Hide Keys' : 'Show Keys'}
            </button>
          </div>
        </div>
      </div>

      <div className="encryption-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Database className="tab-icon" />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'keys' ? 'active' : ''}`}
          onClick={() => setActiveTab('keys')}
        >
          <Key className="tab-icon" />
          Keys
        </button>
        <button 
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          <FileText className="tab-icon" />
          Files
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
        <button 
          className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <Shield className="tab-icon" />
          Audit
        </button>
      </div>

      <div className="encryption-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="encryption-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <Lock className="metric-icon" />
                  <span className="metric-label">Encryption Coverage</span>
                </div>
                <div className="metric-value">{getEncryptionCoverage()}%</div>
                <div className="metric-progress">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getEncryptionCoverage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Key className="metric-icon" />
                  <span className="metric-label">Active Keys</span>
                </div>
                <div className="metric-value">
                  {encryptionKeys.filter(k => k.status === 'active').length}
                </div>
                <div className="metric-status">
                  {encryptionKeys.length} total
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <FileText className="metric-icon" />
                  <span className="metric-label">Encrypted Files</span>
                </div>
                <div className="metric-value">
                  {encryptedFiles.filter(f => f.encrypted).length}
                </div>
                <div className="metric-status">
                  {encryptedFiles.length} total
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Shield className="metric-icon" />
                  <span className="metric-label">Security Score</span>
                </div>
                <div className="metric-value">95%</div>
                <div className="metric-status">Excellent</div>
              </div>
            </div>

            <div className="encryption-status">
              <h3>Encryption Status</h3>
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-icon">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="status-info">
                    <h4>Data at Rest</h4>
                    <p>All stored data is encrypted</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="status-info">
                    <h4>Data in Transit</h4>
                    <p>All data transmission is encrypted</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="status-info">
                    <h4>Backup Encryption</h4>
                    <p>All backups are encrypted</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="status-info">
                    <h4>Zero Knowledge</h4>
                    <p>Not enabled - consider enabling for maximum security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="keys-tab">
            <div className="keys-header">
              <h3>Encryption Keys</h3>
              <div className="keys-actions">
                <button className="action-button" onClick={generateNewKey}>
                  <Plus className="button-icon" />
                  Generate Key
                </button>
                <button className="action-button" onClick={rotateKeys}>
                  <RefreshCw className="button-icon" />
                  Rotate Keys
                </button>
              </div>
            </div>

            <div className="keys-list">
              {encryptionKeys.map((key) => (
                <div key={key.id} className={`key-item ${key.status}`}>
                  <div className="key-icon">
                    <Key className="w-5 h-5" />
                  </div>
                  <div className="key-info">
                    <div className="key-header">
                      <h4 className="key-name">{key.name}</h4>
                      <div className="key-badges">
                        <span className={`strength-badge ${key.strength}`}>
                          {getKeyStrengthIcon(key.strength)}
                          {key.strength}
                        </span>
                        <span className={`status-badge ${key.status}`}>
                          {key.status}
                        </span>
                      </div>
                    </div>
                    <div className="key-details">
                      <span>Type: {key.type}</span>
                      <span>Created: {key.created.toLocaleDateString()}</span>
                      <span>Last Used: {key.lastUsed.toLocaleDateString()}</span>
                    </div>
                    {showKeys && (
                      <div className="key-value">
                        <code>••••••••••••••••••••••••••••••••</code>
                        <button className="copy-button" title="Copy encryption key" aria-label="Copy encryption key to clipboard">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="key-actions">
                    {key.status === 'active' && (
                      <button className="revoke-button">
                        <Trash2 className="w-4 h-4" />
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="files-tab">
            <div className="files-header">
              <h3>Encrypted Files</h3>
              <div className="files-search">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search files..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="files-list">
              {encryptedFiles.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-icon">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="file-info">
                    <div className="file-header">
                      <h4 className="file-name">{file.name}</h4>
                      <div className="file-badges">
                        {file.encrypted && (
                          <span className="encrypted-badge">
                            <Lock className="w-3 h-3" />
                            Encrypted
                          </span>
                        )}
                        <span className={`permission-badge ${file.permissions}`}>
                          {file.permissions}
                        </span>
                      </div>
                    </div>
                    <div className="file-details">
                      <span>Size: {formatFileSize(file.size)}</span>
                      <span>Type: {file.type}</span>
                      <span>Uploaded: {file.uploaded.toLocaleDateString()}</span>
                      <span>Last Accessed: {file.lastAccessed.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    {file.encrypted ? (
                      <button 
                        className="decrypt-button"
                        onClick={() => decryptFile(file.id)}
                      >
                        <Lock className="w-4 h-4" />
                        Decrypt
                      </button>
                    ) : (
                      <button 
                        className="encrypt-button"
                        onClick={() => encryptFile(file.id)}
                      >
                        <Lock className="w-4 h-4" />
                        Encrypt
                      </button>
                    )}
                    <button className="download-button" title="Download key" aria-label="Download encryption key">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="encryption-settings">
              <h3>Encryption Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Algorithm</h4>
                    <p>Primary encryption algorithm for new data</p>
                  </div>
                  <select 
                    value={encryptionSettings.defaultAlgorithm}
                    onChange={(e) => handleSettingChange('defaultAlgorithm', e.target.value)}
                    className="algorithm-select"
                    title="Select encryption algorithm"
                    aria-label="Select default encryption algorithm"
                  >
                    <option value="AES-256">AES-256</option>
                    <option value="RSA-2048">RSA-2048</option>
                    <option value="RSA-4096">RSA-4096</option>
                    <option value="ECDSA">ECDSA</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Key Rotation</h4>
                    <p>Days between automatic key rotation</p>
                  </div>
                  <select 
                    value={encryptionSettings.keyRotation}
                    onChange={(e) => handleSettingChange('keyRotation', Number(e.target.value))}
                    className="rotation-select"
                    title="Select key rotation period"
                    aria-label="Select key rotation period"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Encrypt</h4>
                    <p>Automatically encrypt new files</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={encryptionSettings.autoEncrypt}
                      onChange={(e) => handleSettingChange('autoEncrypt', e.target.checked)}
                      aria-label="Enable automatic encryption"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Encrypt Backups</h4>
                    <p>Encrypt all backup data</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={encryptionSettings.encryptBackups}
                      onChange={(e) => handleSettingChange('encryptBackups', e.target.checked)}
                      aria-label="Encrypt backup data"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Encrypt in Transit</h4>
                    <p>Encrypt data during transmission</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={encryptionSettings.encryptTransit}
                      onChange={(e) => handleSettingChange('encryptTransit', e.target.checked)}
                      aria-label="Encrypt data in transit"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Encrypt at Rest</h4>
                    <p>Encrypt data stored on servers</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={encryptionSettings.encryptAtRest}
                      onChange={(e) => handleSettingChange('encryptAtRest', e.target.checked)}
                      aria-label="Encrypt data at rest"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Zero Knowledge</h4>
                    <p>Enable zero-knowledge encryption (maximum security)</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={encryptionSettings.zeroKnowledge}
                      onChange={(e) => handleSettingChange('zeroKnowledge', e.target.checked)}
                      aria-label="Enable zero-knowledge encryption"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="audit-tab">
            <div className="audit-list">
              <h3>Security Audit Log</h3>
              {securityAudits.map((audit) => (
                <div key={audit.id} className={`audit-item ${audit.severity}`}>
                  <div className="audit-icon">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="audit-content">
                    <div className="audit-header">
                      <span className="audit-type">{audit.type.replace('_', ' ')}</span>
                      <span className={`audit-severity ${getSeverityColor(audit.severity)}`}>
                        {audit.severity}
                      </span>
                      {audit.resolved && (
                        <span className="resolved-badge">
                          <CheckCircle className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                    </div>
                    <div className="audit-description">{audit.description}</div>
                    <div className="audit-timestamp">
                      {audit.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
