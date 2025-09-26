import React, { useState, useEffect, useCallback } from 'react';

// Cloud storage types
interface CloudFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  path: string;
  provider: 'google-drive' | 'dropbox' | 'onedrive' | 'aws-s3';
  isShared: boolean;
  permissions: 'read' | 'write' | 'admin';
}

interface CloudProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  totalSpace: number;
  usedSpace: number;
  fileCount: number;
  lastSync?: Date;
}

interface SyncJob {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  filesTotal: number;
  filesProcessed: number;
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string;
}

// Mock cloud providers
const mockProviders: CloudProvider[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '📁',
    color: '#4285f4',
    isConnected: true,
    totalSpace: 15000000000, // 15GB
    usedSpace: 8500000000, // 8.5GB
    fileCount: 1250,
    lastSync: new Date()
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    color: '#0061ff',
    isConnected: true,
    totalSpace: 2000000000, // 2GB
    usedSpace: 1200000000, // 1.2GB
    fileCount: 450,
    lastSync: new Date(Date.now() - 300000) // 5 minutes ago
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    color: '#0078d4',
    isConnected: false,
    totalSpace: 5000000000, // 5GB
    usedSpace: 0,
    fileCount: 0
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    icon: '🪣',
    color: '#ff9900',
    isConnected: true,
    totalSpace: 100000000000, // 100GB
    usedSpace: 25000000000, // 25GB
    fileCount: 3200,
    lastSync: new Date(Date.now() - 600000) // 10 minutes ago
  }
];

// Mock files
const mockFiles: CloudFile[] = [
  {
    id: 'file-1',
    name: 'Project Proposal.pdf',
    type: 'file',
    size: 2048000,
    modified: new Date(Date.now() - 86400000), // 1 day ago
    path: '/Documents/Work/',
    provider: 'google-drive',
    isShared: true,
    permissions: 'write'
  },
  {
    id: 'file-2',
    name: 'Meeting Notes.docx',
    type: 'file',
    size: 512000,
    modified: new Date(Date.now() - 172800000), // 2 days ago
    path: '/Documents/Meetings/',
    provider: 'google-drive',
    isShared: false,
    permissions: 'read'
  },
  {
    id: 'file-3',
    name: 'Design Assets',
    type: 'folder',
    modified: new Date(Date.now() - 259200000), // 3 days ago
    path: '/Projects/Website/',
    provider: 'dropbox',
    isShared: true,
    permissions: 'admin'
  },
  {
    id: 'file-4',
    name: 'Database Backup.sql',
    type: 'file',
    size: 52428800, // 50MB
    modified: new Date(Date.now() - 432000000), // 5 days ago
    path: '/Backups/',
    provider: 'aws-s3',
    isShared: false,
    permissions: 'write'
  }
];

export const CloudStorageManager: React.FC = () => {
  const [providers, setProviders] = useState<CloudProvider[]>(mockProviders);
  const [files, setFiles] = useState<CloudFile[]>(mockFiles);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);

  // Connect to cloud provider
  const connectProvider = useCallback(async (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { 
            ...p, 
            isConnected: true, 
            lastSync: new Date(),
            fileCount: Math.floor(Math.random() * 1000) + 100
          }
        : p
    ));
  }, [providers]);

  // Disconnect from cloud provider
  const disconnectProvider = useCallback((providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { 
            ...p, 
            isConnected: false, 
            usedSpace: 0,
            fileCount: 0,
            lastSync: undefined
          }
        : p
    ));
    
    // Remove files from disconnected provider
    setFiles(prev => prev.filter(f => f.provider !== providerId));
  }, []);

  // Upload file
  const uploadFile = useCallback(async (file: File, provider: string) => {
    setIsUploading(true);
    
    // Create sync job
    const syncJob: SyncJob = {
      id: `upload-${Date.now()}`,
      name: `Upload ${file.name}`,
      source: 'local',
      destination: provider,
      status: 'running',
      progress: 0,
      filesTotal: 1,
      filesProcessed: 0,
      startTime: new Date()
    };
    
    setSyncJobs(prev => [syncJob, ...prev]);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setSyncJobs(prev => prev.map(job => {
        if (job.id === syncJob.id) {
          const newProgress = Math.min(job.progress + Math.random() * 20, 100);
          const isComplete = newProgress >= 100;
          
          return {
            ...job,
            progress: newProgress,
            filesProcessed: isComplete ? 1 : 0,
            status: isComplete ? 'completed' : 'running',
            endTime: isComplete ? new Date() : undefined
          };
        }
        return job;
      }));
    }, 500);
    
    // Complete upload after 3 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsUploading(false);
      
      // Add file to list
      const newFile: CloudFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        type: 'file',
        size: file.size,
        modified: new Date(),
        path: '/Uploads/',
        provider: provider as any,
        isShared: false,
        permissions: 'write'
      };
      
      setFiles(prev => [newFile, ...prev]);
    }, 3000);
  }, []);

  // Sync all providers
  const syncAllProviders = useCallback(async () => {
    const connectedProviders = providers.filter(p => p.isConnected);
    
    for (const provider of connectedProviders) {
      setProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { ...p, lastSync: new Date() }
          : p
      ));
    }
  }, [providers]);

  // Get filtered files
  const getFilteredFiles = () => {
    if (selectedProvider === 'all') {
      return files;
    }
    return files.filter(file => file.provider === selectedProvider);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format storage size
  const formatStorageSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1) + ' GB';
  };

  const filteredFiles = getFilteredFiles();

  return (
    <div className="cloud-storage-manager">
      <div className="storage-header">
        <h2>☁️ Cloud Storage Integration</h2>
        <p>Manage files across multiple cloud storage providers</p>
        
        <div className="storage-stats">
          <div className="stat-card">
            <div className="stat-number">{providers.filter(p => p.isConnected).length}</div>
            <div className="stat-label">Connected</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{files.length}</div>
            <div className="stat-label">Total Files</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {formatStorageSize(providers.reduce((sum, p) => sum + p.usedSpace, 0))}
            </div>
            <div className="stat-label">Used Space</div>
          </div>
        </div>
      </div>

      {/* Cloud Providers */}
      <div className="providers-section">
        <h3>🔗 Cloud Providers</h3>
        <div className="providers-grid">
          {providers.map(provider => (
            <div key={provider.id} className={`provider-card ${provider.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="provider-header">
                <div className={`provider-icon ${provider.id}`}>
                  {provider.icon}
                </div>
                <div className="provider-info">
                  <h4>{provider.name}</h4>
                  <div className="provider-status">
                    <div className={`status-dot ${provider.isConnected ? 'connected' : 'disconnected'}`} />
                    <span>{provider.isConnected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                </div>
              </div>
              
              {provider.isConnected && (
                <div className="provider-stats">
                  <div className="storage-bar">
                    <div 
                      className={`storage-used ${provider.id}`}
                      data-usage={((provider.usedSpace / provider.totalSpace) * 100).toFixed(1)}
                    />
                  </div>
                  <div className="storage-info">
                    <span>{formatStorageSize(provider.usedSpace)} / {formatStorageSize(provider.totalSpace)}</span>
                    <span>{provider.fileCount} files</span>
                  </div>
                  <div className="last-sync">
                    Last sync: {provider.lastSync ? provider.lastSync.toLocaleTimeString() : 'Never'}
                  </div>
                </div>
              )}
              
              <div className="provider-actions">
                {!provider.isConnected ? (
                  <button 
                    className="connect-btn"
                    onClick={() => connectProvider(provider.id)}
                  >
                    🔗 Connect
                  </button>
                ) : (
                  <button 
                    className="disconnect-btn"
                    onClick={() => disconnectProvider(provider.id)}
                  >
                    ❌ Disconnect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="providers-actions">
          <button 
            className="sync-all-btn"
            onClick={syncAllProviders}
            disabled={providers.filter(p => p.isConnected).length === 0}
          >
            🔄 Sync All Providers
          </button>
        </div>
      </div>

      {/* File Management */}
      <div className="files-section">
        <div className="files-header">
          <h3>📁 Files</h3>
          <div className="files-controls">
            <select 
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="provider-filter"
              title="Filter by cloud provider"
            >
              <option value="all">All Providers</option>
              {providers.filter(p => p.isConnected).map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            
            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
        
        <div className={`files-container ${viewMode}`}>
          {filteredFiles.length === 0 ? (
            <div className="no-files">
              <p>No files found. Connect to a cloud provider to see your files.</p>
            </div>
          ) : (
            filteredFiles.map(file => (
              <div key={file.id} className="file-item">
                <div className="file-icon">
                  {file.type === 'folder' ? '📁' : '📄'}
                </div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-details">
                    <span className="file-path">{file.path}</span>
                    {file.size && <span className="file-size">{formatFileSize(file.size)}</span>}
                    <span className="file-modified">{file.modified.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="file-actions">
                  {file.isShared && <span className="shared-indicator">🔗</span>}
                  <span className={`permission-indicator ${file.permissions}`}>
                    {file.permissions === 'admin' && '👑'}
                    {file.permissions === 'write' && '✏️'}
                    {file.permissions === 'read' && '👁️'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sync Jobs */}
      {syncJobs.length > 0 && (
        <div className="sync-jobs-section">
          <h3>🔄 Sync Jobs</h3>
          <div className="sync-jobs-list">
            {syncJobs.map(job => (
              <div key={job.id} className={`sync-job ${job.status}`}>
                <div className="job-header">
                  <div className="job-name">{job.name}</div>
                  <div className={`job-status ${job.status}`}>
                    {job.status === 'pending' && '⏳'}
                    {job.status === 'running' && '🔄'}
                    {job.status === 'completed' && '✅'}
                    {job.status === 'failed' && '❌'}
                  </div>
                </div>
                
                {job.status === 'running' && (
                  <div className="job-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        data-progress={job.progress}
                      />
                    </div>
                    <span className="progress-text">{job.progress.toFixed(0)}%</span>
                  </div>
                )}
                
                <div className="job-details">
                  <span>{job.filesProcessed} / {job.filesTotal} files</span>
                  {job.startTime && (
                    <span>Started: {job.startTime.toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudStorageManager;
