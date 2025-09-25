import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  icon: string;
  color: string;
}

interface Folder {
  id: string;
  name: string;
  files: FileItem[];
  subfolders: Folder[];
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

  // Mock data for demonstration
  const mockFolders: Folder[] = [
    {
      id: 'home',
      name: 'Home',
      files: [
        {
          id: 'doc1',
          name: 'Project Proposal.pdf',
          type: 'file',
          size: 2048576,
          modified: new Date('2024-01-15'),
          icon: '📄',
          color: 'red'
        },
        {
          id: 'doc2',
          name: 'Meeting Notes.docx',
          type: 'file',
          size: 1536000,
          modified: new Date('2024-01-14'),
          icon: '📝',
          color: 'blue'
        },
        {
          id: 'img1',
          name: 'Screenshot.png',
          type: 'file',
          size: 5242880,
          modified: new Date('2024-01-13'),
          icon: '🖼️',
          color: 'green'
        }
      ],
      subfolders: [
        {
          id: 'documents',
          name: 'Documents',
          files: [
            {
              id: 'doc3',
              name: 'Report.pdf',
              type: 'file',
              size: 3072000,
              modified: new Date('2024-01-12'),
              icon: '📊',
              color: 'purple'
            }
          ],
          subfolders: []
        },
        {
          id: 'images',
          name: 'Images',
          files: [
            {
              id: 'img2',
              name: 'Photo.jpg',
              type: 'file',
              size: 8388608,
              modified: new Date('2024-01-11'),
              icon: '📸',
              color: 'orange'
            }
          ],
          subfolders: []
        },
        {
          id: 'projects',
          name: 'Projects',
          files: [],
          subfolders: [
            {
              id: 'project1',
              name: 'AIOS System',
              files: [
                {
                  id: 'code1',
                  name: 'main.tsx',
                  type: 'file',
                  size: 51200,
                  modified: new Date('2024-01-10'),
                  icon: '⚛️',
                  color: 'cyan'
                },
                {
                  id: 'code2',
                  name: 'styles.css',
                  type: 'file',
                  size: 25600,
                  modified: new Date('2024-01-09'),
                  icon: '🎨',
                  color: 'pink'
                }
              ],
              subfolders: []
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    // Find current folder based on path
    let folder = mockFolders[0]; // Start with Home
    for (let i = 1; i < currentPath.length; i++) {
      const pathName = currentPath[i];
      folder = folder.subfolders.find(f => f.name === pathName) || folder;
    }
    setCurrentFolder(folder);
  }, [currentPath]);

  const navigateToFolder = (folderName: string) => {
    setCurrentPath(prev => [...prev, folderName]);
    setSelectedItems([]);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
      setSelectedItems([]);
    }
  };

  const navigateToPath = (index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
    setSelectedItems([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortedItems = () => {
    if (!currentFolder) return [];
    
    const allItems = [
      ...currentFolder.subfolders.map(f => ({ ...f, type: 'folder' as const })),
      ...currentFolder.files
    ];

    return allItems.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        const aSize = a.type === 'folder' ? 0 : (a.size || 0);
        const bSize = b.type === 'folder' ? 0 : (b.size || 0);
        comparison = aSize - bSize;
      } else if (sortBy === 'modified') {
        const aDate = a.type === 'folder' ? new Date() : a.modified;
        const bDate = b.type === 'folder' ? new Date() : b.modified;
        comparison = aDate.getTime() - bDate.getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const getFilteredItems = () => {
    const items = getSortedItems();
    if (!searchQuery) return items;
    
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleItemClick = (item: FileItem | Folder, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      // Single select
      setSelectedItems([item.id]);
      
      if (item.type === 'folder') {
        navigateToFolder(item.name);
      }
    }
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      // In a real app, this would create the folder
      alert(`Created folder: ${newFolderName}`);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const deleteSelectedItems = () => {
    if (selectedItems.length > 0) {
      if (window.confirm(`Delete ${selectedItems.length} item(s)?`)) {
        // In a real app, this would delete the items
        alert(`Deleted ${selectedItems.length} item(s)`);
        setSelectedItems([]);
      }
    }
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // In a real app, this would upload the files
      alert(`Uploaded ${files.length} file(s)`);
      setShowUpload(false);
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
            <select
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
            onClick={() => setShowUpload(true)}
          >
            📤 Upload
          </button>
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
                onClick={deleteSelectedItems}
              >
                🗑️ Delete
              </button>
              <button className="toolbar-btn">
                📋 Copy
              </button>
              <button className="toolbar-btn">
                ✂️ Cut
              </button>
              <button className="toolbar-btn">
                📋 Paste
              </button>
            </>
          )}
        </div>
      </div>

      {/* File Grid/List */}
      <div className={`file-content ${viewMode}`}>
        {getFilteredItems().map(item => (
          <div
            key={item.id}
            className={`file-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
            onClick={(e) => handleItemClick(item, e)}
          >
            <div className="file-icon">
              <span className={`icon ${item.type === 'folder' ? 'folder' : 'file'}`}>
                {item.type === 'folder' ? '📁' : (item as FileItem).icon}
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
                  {formatDate(item.type === 'folder' ? new Date() : (item as FileItem).modified)}
                </span>
              </div>
            </div>

            {item.type === 'file' && (
              <div className="file-actions">
                <button className="action-btn" title="Download">
                  ⬇️
                </button>
                <button className="action-btn" title="Share">
                  🔗
                </button>
                <button className="action-btn" title="Properties">
                  ℹ️
                </button>
              </div>
            )}
          </div>
        ))}

        {getFilteredItems().length === 0 && (
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
              onClick={() => setShowUpload(true)}
            >
              Upload Files
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Upload Files</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUpload(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  onChange={uploadFile}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <div className="upload-icon">📤</div>
                  <p>Click to select files or drag and drop</p>
                  <span className="upload-hint">Supports all file types</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  onClick={createNewFolder}
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
