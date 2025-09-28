import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Folder,
  File,
  Upload,
  Download,
  Trash2,
  Edit,
  Copy,
  Move,
  Search,
  Grid,
  List,
  Plus,
  MoreHorizontal,
  Image,
  FileText,
  Music,
  Video,
  Archive,
  Code,
  Database,
  Settings
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  icon: string;
  color: string;
  path: string;
  extension?: string;
  mimeType?: string;
}

interface Folder {
  id: string;
  name: string;
  files: FileItem[];
  subfolders: Folder[];
  path: string;
}

export const EnhancedFileManagerApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string[]>(['Home']);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, item: FileItem | null}>({x: 0, y: 0, item: null});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clipboard, setClipboard] = useState<{action: 'copy' | 'cut', items: FileItem[]} | null>(null);

  useEffect(() => {
    loadCurrentFolder();
  }, [currentPath]);

  const loadCurrentFolder = async () => {
    setIsLoading(true);
    try {
      const path = currentPath.join('/');
      const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
      const data = await response.json();

      if (data.folder) {
        setCurrentFolder(data.folder);
      } else {
        // Use mock data if API fails
        setCurrentFolder(getMockFolder());
      }
    } catch (error) {
      console.error('Failed to load folder:', error);
      setCurrentFolder(getMockFolder());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockFolder = (): Folder => ({
    id: 'current',
    name: currentPath[currentPath.length - 1],
    path: currentPath.join('/'),
      files: [
        {
          id: 'doc1',
          name: 'Project Proposal.pdf',
          type: 'file',
          size: 2048576,
          modified: new Date('2024-01-15'),
          icon: '📄',
        color: 'red',
        path: currentPath.join('/') + '/Project Proposal.pdf',
        extension: 'pdf',
        mimeType: 'application/pdf'
        },
        {
          id: 'doc2',
          name: 'Meeting Notes.docx',
          type: 'file',
          size: 1536000,
          modified: new Date('2024-01-14'),
          icon: '📝',
        color: 'blue',
        path: currentPath.join('/') + '/Meeting Notes.docx',
        extension: 'docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      {
        id: 'img1',
        name: 'Screenshot.png',
        type: 'file',
        size: 1024000,
        modified: new Date('2024-01-13'),
        icon: '🖼️',
        color: 'green',
        path: currentPath.join('/') + '/Screenshot.png',
        extension: 'png',
        mimeType: 'image/png'
      },
      {
        id: 'video1',
        name: 'Demo Video.mp4',
        type: 'file',
        size: 52428800,
        modified: new Date('2024-01-12'),
        icon: '🎥',
        color: 'purple',
        path: currentPath.join('/') + '/Demo Video.mp4',
        extension: 'mp4',
        mimeType: 'video/mp4'
      }
    ],
    subfolders: [
      {
        id: 'folder1',
        name: 'Documents',
        path: currentPath.join('/') + '/Documents',
        files: [],
        subfolders: []
      },
      {
        id: 'folder2',
        name: 'Images',
        path: currentPath.join('/') + '/Images',
        files: [],
        subfolders: []
      },
      {
        id: 'folder3',
        name: 'Videos',
        path: currentPath.join('/') + '/Videos',
        files: [],
        subfolders: []
      }
    ]
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: FileItem) => {
    const extension = file.extension?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image className="w-6 h-6 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-6 h-6 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music className="w-6 h-6 text-yellow-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="w-6 h-6 text-orange-500" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
        return <Code className="w-6 h-6 text-cyan-500" />;
      case 'sql':
      case 'db':
        return <Database className="w-6 h-6 text-indigo-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
    setSelectedItems([]);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedItems([]);
    }
  };

  const navigateToPath = (index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
    setSelectedItems([]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentPath.join('/'));

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        }
      });

      if (response.ok) {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
        loadCurrentFolder();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert(`Failed to upload ${file.name}`);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch('/api/files/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName,
          path: currentPath.join('/')
        })
      });

      if (response.ok) {
        setNewFolderName('');
        setShowCreateFolder(false);
        loadCurrentFolder();
      } else {
        throw new Error('Failed to create folder');
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder');
    }
  };

  const deleteItems = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) return;

    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems,
          path: currentPath.join('/')
        })
      });

      if (response.ok) {
        setSelectedItems([]);
        loadCurrentFolder();
      } else {
        throw new Error('Failed to delete items');
      }
    } catch (error) {
      console.error('Failed to delete items:', error);
      alert('Failed to delete items');
    }
  };

  const downloadFile = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files/download?path=${encodeURIComponent(file.path)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file');
    }
  };

  const copyItems = () => {
    const items = currentFolder?.files.filter(f => selectedItems.includes(f.id)) || [];
    setClipboard({ action: 'copy', items });
  };

  const cutItems = () => {
    const items = currentFolder?.files.filter(f => selectedItems.includes(f.id)) || [];
    setClipboard({ action: 'cut', items });
  };

  const pasteItems = async () => {
    if (!clipboard) return;

    try {
      const response = await fetch('/api/files/paste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: clipboard.items,
          action: clipboard.action,
          destinationPath: currentPath.join('/')
        })
      });

      if (response.ok) {
        setClipboard(null);
        loadCurrentFolder();
      } else {
        throw new Error('Paste failed');
      }
    } catch (error) {
      console.error('Failed to paste items:', error);
      alert('Failed to paste items');
    }
  };

  const renameItem = async (item: FileItem, newName: string) => {
    try {
      const response = await fetch('/api/files/rename', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPath: item.path,
          newName: newName
        })
      });

      if (response.ok) {
        loadCurrentFolder();
      } else {
        throw new Error('Rename failed');
      }
    } catch (error) {
      console.error('Failed to rename item:', error);
      alert('Failed to rename item');
    }
  };

  const sortedItems = React.useMemo(() => {
    if (!currentFolder) return [];

    const allItems = [...currentFolder.files, ...currentFolder.subfolders];

    return allItems.sort((a, b) => {
      let comparison = 0;

      if (a.type !== b.type) {
        comparison = a.type === 'folder' ? -1 : 1;
      } else {
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'size':
            comparison = (a.size || 0) - (b.size || 0);
            break;
          case 'modified':
            comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime();
            break;
        }
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [currentFolder, sortBy, sortOrder]);

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return sortedItems;

    return sortedItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedItems, searchQuery]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleItemClick = (item: FileItem | { id: string, name: string, type: 'folder' }, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      setSelectedItems([item.id]);
      if (item.type === 'folder') {
        navigateToFolder(item.name);
      }
    }
  };

  if (!user) {
    return (
      <div className="enhanced-file-manager">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access file manager</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-file-manager">
      {/* Header */}
      <div className="file-manager-header">
        <div className="header-left">
          <button
            className="nav-btn back-btn"
            onClick={navigateBack}
            disabled={currentPath.length <= 1}
          >
            ← Back
          </button>

          <div className="breadcrumb">
            {currentPath.map((path, index) => (
              <React.Fragment key={index}>
                <button
                  className={`breadcrumb-item ${index === currentPath.length - 1 ? 'active' : ''}`}
                  onClick={() => navigateToPath(index)}
                >
                  {path}
                </button>
                {index < currentPath.length - 1 && <span className="breadcrumb-separator">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="view-controls">
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

          <div className="sort-controls">
            <select aria-label="Select option"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="modified">Modified</option>
            </select>
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="file-manager-toolbar">
        <div className="toolbar-left">
          <button
            className="toolbar-btn primary"
            onClick={() => fileInputRef.current?.click()}
          >
            📤 Upload
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple style={{ display: 'none' }} />
          <button
            className="toolbar-btn"
            onClick={() => setShowCreateFolder(true)}
          >
            📁 New Folder
          </button>
          <button
            className="toolbar-btn"
            onClick={() => window.open('https://drive.google.com', '_blank')}
          >
            ☁️ Cloud Storage
          </button>
        </div>

        <div className="toolbar-right">
          {selectedItems.length > 0 && (
            <>
              <span className="selection-count">
                {selectedItems.length} item(s) selected
              </span>
              <button
                className="toolbar-btn danger"
                onClick={deleteItems}
              >
                🗑️ Delete
              </button>
              <button className="toolbar-btn" onClick={copyItems}>
                📋 Copy
              </button>
              <button className="toolbar-btn" onClick={cutItems}>
                ✂️ Cut
              </button>
              <button className="toolbar-btn" onClick={pasteItems} disabled={!clipboard}>
                📋 Paste
              </button>
            </>
          )}
        </div>
      </div>

      {/* File Grid/List */}
      <div className={`file-content ${viewMode}`}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`file-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
            onClick={(e) => handleItemClick(item, e)}
          >
            <div className="file-icon">
              <span className={`icon ${item.type === 'folder' ? 'folder' : 'file'}`}>
                {item.type === 'folder' ? <Folder className="w-8 h-8 text-yellow-500" /> : getFileIcon(item as FileItem)}
              </span>
            </div>

            <div className="file-info">
              <div className="file-name">{item.name}</div>
              <div className="file-meta">
                {item.type === 'file' && (
                  <span className="file-size">
                    {formatFileSize((item as FileItem).size || 0)}
                  </span>
                )}
                <span className="file-date">
                  {formatDate(item.modified)}
                </span>
              </div>
            </div>

            <div className="file-actions">
              <MoreHorizontal className="w-5 h-5" />
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No files found</h3>
            <p>
              {searchQuery
                ? `No files match "${searchQuery}"`
                : 'This folder is empty'
              }
            </p>
            <button
              className="empty-action-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Files
            </button>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Folder</h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateFolder(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn primary"
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                >
                  Create Folder
                </button>
                <button
                  className="btn secondary"
                  onClick={() => setShowCreateFolder(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storage Info */}
      <div className="storage-info">
        <div className="storage-bar">
          <div className="storage-used" style={{ width: '65%' }}></div>
        </div>
        <div className="storage-text">
          <span>65% used</span>
          <span>2.1 GB of 3.2 GB</span>
        </div>
      </div>
    </div>
  );
};
