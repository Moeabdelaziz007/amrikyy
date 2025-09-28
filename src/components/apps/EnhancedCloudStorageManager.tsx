import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Cloud, 
  Upload, 
  Download, 
  Trash2, 
  Folder, 
  File, 
  Search, 
  RefreshCw, 
  Plus, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  GoogleDrive,
  Dropbox,
  OneDrive,
  HardDrive,
  Eye,
  Edit,
  Copy,
  Move,
  Share,
  Lock,
  Globe,
  BarChart3,
  Activity
} from 'lucide-react';

interface CloudProvider {
  id: string;
  name: string;
  type: 'google-drive' | 'dropbox' | 'onedrive' | 'aws-s3' | 'local';
  status: 'connected' | 'disconnected' | 'error';
  totalSpace: number;
  usedSpace: number;
  lastSync: Date;
  files: CloudFile[];
}

interface CloudFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  provider: string;
  path: string;
  lastModified: Date;
  permissions: string[];
  isShared: boolean;
}

export const EnhancedCloudStorageManager: React.FC = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCloudData();
    
    const interval = setInterval(() => {
      loadCloudData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadCloudData = async () => {
    try {
      await loadProviders();
    } catch (error) {
      console.error('Failed to load cloud data:', error);
      setProviders(getMockProviders());
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      const response = await fetch('/api/cloud/providers');
      const data = await response.json();
      
      if (data.providers) {
        setProviders(data.providers.map((provider: any) => ({
          ...provider,
          lastSync: new Date(provider.lastSync),
          files: provider.files.map((file: any) => ({
            ...file,
            lastModified: new Date(file.lastModified)
          }))
        })));
      } else {
        setProviders(getMockProviders());
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
      setProviders(getMockProviders());
    }
  };

  const connectProvider = async (providerType: string) => {
    try {
      const response = await fetch('/api/cloud/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: providerType })
      });

      if (response.ok) {
        loadProviders();
        alert(`${providerType} connected successfully!`);
      } else {
        throw new Error('Failed to connect provider');
      }
    } catch (error) {
      console.error('Failed to connect provider:', error);
      alert(`Failed to connect ${providerType}. Please try again.`);
    }
  };

  const uploadFile = async (file: File, provider: string, path: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('provider', provider);
      formData.append('path', path);

      const response = await fetch('/api/cloud/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        loadProviders();
        alert('File uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, provider: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/cloud/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });

      if (response.ok) {
        loadProviders();
        alert('File deleted successfully!');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'google-drive':
        return <GoogleDrive className="w-6 h-6 text-blue-500" />;
      case 'dropbox':
        return <Dropbox className="w-6 h-6 text-blue-600" />;
      case 'onedrive':
        return <OneDrive className="w-6 h-6 text-blue-400" />;
      case 'aws-s3':
        return <Cloud className="w-6 h-6 text-orange-500" />;
      case 'local':
        return <HardDrive className="w-6 h-6 text-gray-500" />;
      default:
        return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMockProviders = (): CloudProvider[] => [
    {
      id: '1',
      name: 'Google Drive',
      type: 'google-drive',
      status: 'connected',
      totalSpace: 15000000000, // 15GB
      usedSpace: 8500000000,   // 8.5GB
      lastSync: new Date(Date.now() - 1000 * 60 * 5),
      files: [
        {
          id: '1',
          name: 'Documents',
          type: 'folder',
          size: 0,
          provider: 'google-drive',
          path: '/Documents',
          lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2),
          permissions: ['read', 'write'],
          isShared: false
        },
        {
          id: '2',
          name: 'project-report.pdf',
          type: 'file',
          size: 2457600, // 2.4MB
          provider: 'google-drive',
          path: '/project-report.pdf',
          lastModified: new Date(Date.now() - 1000 * 60 * 30),
          permissions: ['read', 'write'],
          isShared: true
        }
      ]
    },
    {
      id: '2',
      name: 'Dropbox',
      type: 'dropbox',
      status: 'connected',
      totalSpace: 2000000000,  // 2GB
      usedSpace: 1200000000,   // 1.2GB
      lastSync: new Date(Date.now() - 1000 * 60 * 10),
      files: [
        {
          id: '3',
          name: 'Photos',
          type: 'folder',
          size: 0,
          provider: 'dropbox',
          path: '/Photos',
          lastModified: new Date(Date.now() - 1000 * 60 * 60),
          permissions: ['read', 'write'],
          isShared: false
        }
      ]
    }
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = searchQuery === '' || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-full bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading cloud storage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Cloud className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Cloud Storage Manager</h1>
              <p className="text-gray-400">Manage files across multiple cloud providers</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => connectProvider('google-drive')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Provider
            </Button>
            <Button
              onClick={loadCloudData}
              variant="outline"
              className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-white/10 bg-black/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Cloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{providers.length}</p>
                <p className="text-gray-400 text-sm">Connected Providers</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {providers.filter(p => p.status === 'connected').length}
                </p>
                <p className="text-gray-400 text-sm">Active</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {formatFileSize(providers.reduce((sum, p) => sum + p.usedSpace, 0))}
                </p>
                <p className="text-gray-400 text-sm">Total Used</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {providers.reduce((sum, p) => sum + p.files.length, 0)}
                </p>
                <p className="text-gray-400 text-sm">Total Files</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cloud providers and files..."
              className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map(provider => (
                <Card key={provider.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getProviderIcon(provider.type)}
                        <div>
                          <CardTitle className="text-white text-lg">{provider.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(provider.status)}
                            <span className="text-gray-400 text-sm">{provider.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Storage Usage */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Storage Used</span>
                        <span className="text-white">
                          {formatFileSize(provider.usedSpace)} / {formatFileSize(provider.totalSpace)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${(provider.usedSpace / provider.totalSpace) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Files */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Recent Files:</p>
                      <div className="space-y-2">
                        {provider.files.slice(0, 3).map(file => (
                          <div key={file.id} className="flex items-center space-x-2 p-2 bg-black/20 rounded">
                            {file.type === 'folder' ? (
                              <Folder className="w-4 h-4 text-blue-400" />
                            ) : (
                              <File className="w-4 h-4 text-gray-400" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{file.name}</p>
                              <p className="text-gray-400 text-xs">
                                {file.type === 'file' ? formatFileSize(file.size) : 'Folder'} • {file.lastModified.toLocaleDateString()}
                              </p>
                            </div>
                            {file.isShared && <Share className="w-4 h-4 text-green-400" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedProvider(provider.id)}
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Browse
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      Last sync: {provider.lastSync.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
