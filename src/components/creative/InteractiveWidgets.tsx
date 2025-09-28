import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Grid, 
  Layout, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Save, 
  Copy, 
  Share, 
  Eye, 
  EyeOff, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  Globe, 
  Star, 
  Heart, 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  Database, 
  Server, 
  Cloud, 
  Wifi, 
  Bluetooth, 
  Battery, 
  Power, 
  Thermometer, 
  Gauge, 
  Timer, 
  History, 
  Bookmark, 
  Tag, 
  Flag, 
  Pin, 
  Home, 
  Building, 
  Car, 
  Plane, 
  Ship, 
  Train, 
  Bike, 
  Truck, 
  Bus, 
  Tent, 
  Umbrella, 
  Trees, 
  Flower, 
  Leaf, 
  Sprout, 
  Bug, 
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Mouse, 
  Turtle, 
  Butterfly, 
  Ant, 
  Spider, 
  Ladybug, 
  Dragonfly, 
  Firefly, 
  Cricket, 
  Grasshopper, 
  Mantis, 
  Beetle, 
  Worm, 
  Snail, 
  Octopus, 
  Squid, 
  Jellyfish, 
  Starfish, 
  Crab, 
  Lobster, 
  Ship as Shrimp, 
  Penguin, 
  Owl, 
  Eagle, 
  Hawk, 
  Falcon, 
  Carrot as Parrot, 
  Crown as Crow,
  Mic,
  Volume2,
  VolumeX,
  Headphones,
  Monitor,
  Smartphone,
  Laptop,
  Watch,
  Glasses,
  Eye as EyeIcon,
  Hand,
  Foot,
  Microscope,
  FlaskConical,
  Beaker,
  TestTube,
  Calculator,
  Code,
  Terminal,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Search,
  Filter,
  List,
  Layers,
  Navigation,
  Compass,
  Sparkles,
  Hexagon,
  Circle,
  Square,
  Triangle,
  Diamond,
  Microphone,
  Video,
  Camera,
  Image,
  File,
  Folder,
  FolderOpen,
  Printer,
  CloudOff,
  WifiOff,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplet,
  TrendingUp,
  BarChart3,
  Activity,
  Target,
  Lightbulb,
  MessageSquare,
  Target as TargetIcon,
  Scan,
  QrCode,
  Focus,
  Maximize,
  Minimize,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Palette,
  Contrast,
  Brightness,
  Filter as FilterIcon,
  Blur,
  Sharpen,
  Layers as LayersIcon,
  Grid3X3,
  Square as SquareIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Diamond as DiamondIcon,
  Hexagon as HexagonIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Zap,
  Sparkles as SparklesIcon,
  Crown,
  Gem,
  Award,
  Trophy,
  Medal,
  Badge,
  Certificate,
  Diploma,
  Scroll,
  Book,
  BookOpen,
  Library,
  Archive,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileZip,
  FileArchive,
  FileCheck,
  FileX,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  FileDownload,
  FileUpload,
  FileShare,
  FileCopy,
  FileMove,
  FileDelete,
  FileRestore,
  FileArchive as FileArchiveIcon,
  FileUnarchive,
  FileCompress,
  FileExtract,
  FileMerge,
  FileSplit,
  FileConvert,
  FileOptimize,
  FileValidate,
  FileRepair,
  FileBackup,
  FileSync,
  FileVersion,
  FileHistory,
  FileCompare,
  FileDiff,
  FileMerge as FileMergeIcon,
  FileSplit as FileSplitIcon,
  FileConvert as FileConvertIcon,
  FileOptimize as FileOptimizeIcon,
  FileValidate as FileValidateIcon,
  FileRepair as FileRepairIcon,
  FileBackup as FileBackupIcon,
  FileSync as FileSyncIcon,
  FileVersion as FileVersionIcon,
  FileHistory as FileHistoryIcon,
  FileCompare as FileCompareIcon,
  FileDiff as FileDiffIcon,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Play,
  Pause,
  RotateCcw as RotateCcwIcon,
  RotateCw as RotateCwIconAlt,
  ZoomIn,
  ZoomOut,
  Move,
  Crop as CropIcon,
  Palette as PaletteIcon,
  Contrast as ContrastIcon,
  Brightness as BrightnessIcon,
  Filter as FilterIconAlt,
  Blur as BlurIcon,
  Sharpen as SharpenIcon,
  Layers as LayersIconAlt,
  Grid3X3 as Grid3X3Icon,
  Square as SquareIconAlt,
  Circle as CircleIconAlt,
  Triangle as TriangleIconAlt,
  Diamond as DiamondIconAlt,
  Hexagon as HexagonIconAlt,
  Star as StarIconAlt,
  Heart as HeartIconAlt,
  Zap as ZapIcon,
  Crown as CrownIcon,
  Gem as GemIcon,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  Badge as BadgeIcon,
  Certificate as CertificateIcon,
  Diploma as DiplomaIcon,
  Scroll as ScrollIcon,
  Book as BookIcon,
  BookOpen as BookOpenIcon,
  Library as LibraryIcon,
  Archive as ArchiveIcon,
  Folder as FolderIconAlt,
  FolderOpen as FolderOpenIconAlt,
  FileText as FileTextIcon,
  FileImage as FileImageIcon,
  FileVideo as FileVideoIcon,
  FileAudio as FileAudioIcon,
  FileCode as FileCodeIcon,
  FileSpreadsheet as FileSpreadsheetIcon,
  FilePdf as FilePdfIcon,
  FileWord as FileWordIcon,
  FileExcel as FileExcelIcon,
  FilePowerpoint as FilePowerpointIcon,
  FileZip as FileZipIcon,
  FileArchive as FileArchiveIconAlt,
  FileCheck as FileCheckIcon,
  FileX as FileXIcon,
  FilePlus as FilePlusIcon,
  FileMinus as FileMinusIcon,
  FileEdit as FileEditIcon,
  FileSearch as FileSearchIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  FileShare as FileShareIcon,
  FileCopy as FileCopyIcon,
  FileMove as FileMoveIcon,
  FileDelete as FileDeleteIcon,
  FileRestore as FileRestoreIcon,
  FileArchive as FileArchiveIconAlt2,
  FileUnarchive as FileUnarchiveIcon,
  FileCompress as FileCompressIcon,
  FileExtract as FileExtractIcon,
  FileMerge as FileMergeIconAlt,
  FileSplit as FileSplitIconAlt,
  FileConvert as FileConvertIconAlt,
  FileOptimize as FileOptimizeIconAlt,
  FileValidate as FileValidateIconAlt,
  FileRepair as FileRepairIconAlt,
  FileBackup as FileBackupIconAlt,
  FileSync as FileSyncIconAlt,
  FileVersion as FileVersionIconAlt,
  FileHistory as FileHistoryIconAlt,
  FileCompare as FileCompareIconAlt,
  FileDiff as FileDiffIconAlt
} from 'lucide-react';

interface Widget {
  id: string;
  name: string;
  description: string;
  type: 'clock' | 'weather' | 'calendar' | 'notes' | 'calculator' | 'music' | 'news' | 'stocks' | 'tasks' | 'custom';
  category: 'productivity' | 'entertainment' | 'information' | 'utility' | 'custom';
  size: 'small' | 'medium' | 'large' | 'custom';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  settings: WidgetSettings;
  data: any;
  isActive: boolean;
  isCustom: boolean;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  tags: string[];
  rating: number;
  downloads: number;
}

interface WidgetSettings {
  theme: 'light' | 'dark' | 'auto';
  opacity: number;
  transparency: boolean;
  animations: boolean;
  sounds: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  position: 'fixed' | 'draggable' | 'resizable';
  permissions: string[];
  customizations: Record<string, any>;
}

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  preview: string;
  template: Partial<Widget>;
  isDefault: boolean;
  isCustom: boolean;
}

interface WidgetLayout {
  id: string;
  name: string;
  description: string;
  widgets: string[];
  grid: GridSettings;
  isDefault: boolean;
  isCustom: boolean;
}

interface GridSettings {
  columns: number;
  rows: number;
  gap: number;
  snapToGrid: boolean;
  allowOverlap: boolean;
}

export const InteractiveWidgets: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'widgets' | 'templates' | 'layouts' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data
  const [widgets] = useState<Widget[]>([
    {
      id: '1',
      name: 'Digital Clock',
      description: 'Elegant digital clock with date and time',
      type: 'clock',
      category: 'utility',
      size: 'small',
      position: { x: 100, y: 100 },
      dimensions: { width: 200, height: 100 },
      settings: {
        theme: 'dark',
        opacity: 0.9,
        transparency: true,
        animations: true,
        sounds: false,
        autoRefresh: true,
        refreshInterval: 1000,
        position: 'draggable',
        permissions: ['time', 'date'],
        customizations: {
          format: '24h',
          showSeconds: true,
          showDate: true,
          font: 'monospace'
        }
      },
      data: {
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      },
      isActive: true,
      isCustom: false,
      author: 'Amrikyy Team',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      version: '1.0.0',
      tags: ['clock', 'time', 'date', 'utility'],
      rating: 4.8,
      downloads: 12000
    }
  ]);

  const [templates] = useState<WidgetTemplate[]>([
    {
      id: '1',
      name: 'Weather Widget',
      description: 'Current weather with forecast',
      type: 'weather',
      category: 'information',
      preview: '/api/placeholder/200/150',
      template: {
        type: 'weather',
        category: 'information',
        size: 'medium',
        settings: {
          theme: 'auto',
          opacity: 0.9,
          transparency: true,
          animations: true,
          sounds: false,
          autoRefresh: true,
          refreshInterval: 300000,
          position: 'draggable',
          permissions: ['location', 'weather'],
          customizations: {
            units: 'metric',
            showForecast: true,
            showHumidity: true,
            showWind: true
          }
        }
      },
      isDefault: true,
      isCustom: false
    }
  ]);

  const [layouts] = useState<WidgetLayout[]>([
    {
      id: '1',
      name: 'Productivity Layout',
      description: 'Layout optimized for productivity',
      widgets: ['clock', 'weather', 'calendar', 'tasks'],
      grid: {
        columns: 4,
        rows: 3,
        gap: 20,
        snapToGrid: true,
        allowOverlap: false
      },
      isDefault: true,
      isCustom: false
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clock': return <Clock className="w-4 h-4" />;
      case 'weather': return <Sun className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'notes': return <FileText className="w-4 h-4" />;
      case 'calculator': return <Calculator className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'news': return <Globe className="w-4 h-4" />;
      case 'stocks': return <TrendingUp className="w-4 h-4" />;
      case 'tasks': return <CheckCircle className="w-4 h-4" />;
      case 'custom': return <Code className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <Target className="w-4 h-4" />;
      case 'entertainment': return <Play className="w-4 h-4" />;
      case 'information': return <Info className="w-4 h-4" />;
      case 'utility': return <Settings className="w-4 h-4" />;
      case 'custom': return <Code className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity': return 'text-green-500';
      case 'entertainment': return 'text-purple-500';
      case 'information': return 'text-blue-500';
      case 'utility': return 'text-orange-500';
      case 'custom': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'small': return <Minimize className="w-4 h-4" />;
      case 'medium': return <Square className="w-4 h-4" />;
      case 'large': return <Maximize className="w-4 h-4" />;
      case 'custom': return <Edit className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  const addWidget = (template: WidgetTemplate) => {
    console.log('Adding widget:', template.name);
  };

  const editWidget = (widget: Widget) => {
    setSelectedWidget(widget);
    setIsEditing(true);
  };

  const deleteWidget = (widgetId: string) => {
    console.log('Deleting widget:', widgetId);
  };

  const createWidget = () => {
    console.log('Creating new widget...');
  };

  const createLayout = () => {
    console.log('Creating new layout...');
  };

  if (loading) {
    return (
      <div className="interactive-widgets">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading interactive widgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interactive-widgets">
      <div className="widgets-header">
        <div className="header-content">
          <div className="header-title">
            <Grid className="header-icon" />
            <h1>Interactive Widgets</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={createWidget}>
              <Plus className="button-icon" />
              Create Widget
            </button>
            <button className="action-button" onClick={createLayout}>
              <Layout className="button-icon" />
              Create Layout
            </button>
            <button className="action-button">
              <Settings className="button-icon" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="widgets-tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Grid className="tab-icon" />
          Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'widgets' ? 'active' : ''}`}
          onClick={() => setActiveTab('widgets')}
        >
          <Grid className="tab-icon" />
          Widgets
        </button>
        <button 
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Layout className="tab-icon" />
          Templates
        </button>
        <button 
          className={`tab ${activeTab === 'layouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('layouts')}
        >
          <Grid3X3 className="tab-icon" />
          Layouts
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="widgets-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="widgets-dashboard">
              <div className="dashboard-header">
                <h3>Widget Dashboard</h3>
                <div className="dashboard-controls">
                  <button className="action-button">
                    <Edit className="w-4 h-4" />
                    Edit Mode
                  </button>
                  <button className="action-button">
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </button>
                  <button className="action-button">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
              <div className="dashboard-grid">
                {widgets.filter(w => w.isActive).map((widget) => (
                  <div 
                    key={widget.id} 
                    className="widget-container"
                    style={{
                      left: widget.position.x,
                      top: widget.position.y,
                      width: widget.dimensions.width,
                      height: widget.dimensions.height
                    }}
                  >
                    <div className="widget-header">
                      <div className="widget-title">
                        {getTypeIcon(widget.type)}
                        <span>{widget.name}</span>
                      </div>
                      <div className="widget-controls">
                        <button className="control-button" title="Widget settings" aria-label="Open widget settings">
                          <Settings className="w-3 h-3" />
                        </button>
                        <button className="control-button" title="Remove widget" aria-label="Remove widget">
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="widget-content">
                      {widget.type === 'clock' && (
                        <div className="clock-widget">
                          <div className="time">{widget.data.time}</div>
                          <div className="date">{widget.data.date}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className="widgets-tab">
            <div className="widgets-list">
              <h3>Available Widgets ({widgets.length})</h3>
              <div className="widgets-grid">
                {widgets.map((widget) => (
                  <div key={widget.id} className="widget-card">
                    <div className="widget-preview">
                      <div className="preview-content">
                        {getTypeIcon(widget.type)}
                        <span className="preview-title">{widget.name}</span>
                      </div>
                    </div>
                    <div className="widget-info">
                      <div className="widget-header">
                        <h4 className="widget-name">{widget.name}</h4>
                        <div className="widget-badges">
                          <span className={`category-badge ${getCategoryColor(widget.category)}`}>
                            {getCategoryIcon(widget.category)}
                            {widget.category}
                          </span>
                          <span className="size-badge">
                            {getSizeIcon(widget.size)}
                            {widget.size}
                          </span>
                          {widget.isActive && <span className="active-badge">Active</span>}
                          {widget.isCustom && <span className="custom-badge">Custom</span>}
                        </div>
                      </div>
                      <p className="widget-description">{widget.description}</p>
                      <div className="widget-stats">
                        <div className="stat">
                          <Download className="w-4 h-4" />
                          <span>{widget.downloads.toLocaleString()}</span>
                        </div>
                        <div className="stat">
                          <Star className="w-4 h-4" />
                          <span>{widget.rating}</span>
                        </div>
                        <div className="stat">
                          <User className="w-4 h-4" />
                          <span>{widget.author}</span>
                        </div>
                      </div>
                      <div className="widget-details">
                        <div className="detail">
                          <span className="detail-label">Size:</span>
                          <span className="detail-value">{widget.dimensions.width}×{widget.dimensions.height}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Position:</span>
                          <span className="detail-value">({widget.position.x}, {widget.position.y})</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Updated:</span>
                          <span className="detail-value">{widget.updatedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="widget-tags">
                        {widget.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="widget-actions">
                      <button 
                        className="action-button primary"
                        onClick={() => editWidget(widget)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="action-button">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button className="action-button">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      {widget.isCustom && (
                        <button 
                          className="action-button danger"
                          onClick={() => deleteWidget(widget.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-tab">
            <div className="templates-list">
              <h3>Widget Templates ({templates.length})</h3>
              <div className="templates-grid">
                {templates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-preview">
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="preview-image"
                      />
                      <div className="preview-overlay">
                        <div className="preview-icon">
                          {getTypeIcon(template.type)}
                        </div>
                      </div>
                    </div>
                    <div className="template-info">
                      <div className="template-header">
                        <h4 className="template-name">{template.name}</h4>
                        <div className="template-badges">
                          <span className={`category-badge ${getCategoryColor(template.category)}`}>
                            {getCategoryIcon(template.category)}
                            {template.category}
                          </span>
                          {template.isDefault && <span className="default-badge">Default</span>}
                          {template.isCustom && <span className="custom-badge">Custom</span>}
                        </div>
                      </div>
                      <p className="template-description">{template.description}</p>
                    </div>
                    <div className="template-actions">
                      <button 
                        className="action-button primary"
                        onClick={() => addWidget(template)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Widget
                      </button>
                      <button className="action-button">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layouts' && (
          <div className="layouts-tab">
            <div className="layouts-list">
              <h3>Widget Layouts ({layouts.length})</h3>
              <div className="layouts-grid">
                {layouts.map((layout) => (
                  <div key={layout.id} className="layout-card">
                    <div className="layout-preview">
                      <div className="preview-grid" style={{
                        gridTemplateColumns: `repeat(${layout.grid.columns}, 1fr)`,
                        gap: `${layout.grid.gap}px`
                      }}>
                        {Array.from({ length: layout.grid.columns * layout.grid.rows }, (_, i) => (
                          <div key={i} className="grid-cell">
                            {layout.widgets[i] && (
                              <div className="cell-widget">
                                {getTypeIcon(layout.widgets[i])}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="layout-info">
                      <div className="layout-header">
                        <h4 className="layout-name">{layout.name}</h4>
                        <div className="layout-badges">
                          {layout.isDefault && <span className="default-badge">Default</span>}
                          {layout.isCustom && <span className="custom-badge">Custom</span>}
                        </div>
                      </div>
                      <p className="layout-description">{layout.description}</p>
                      <div className="layout-details">
                        <div className="detail">
                          <span className="detail-label">Grid:</span>
                          <span className="detail-value">{layout.grid.columns}×{layout.grid.rows}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Widgets:</span>
                          <span className="detail-value">{layout.widgets.length}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Gap:</span>
                          <span className="detail-value">{layout.grid.gap}px</span>
                        </div>
                      </div>
                    </div>
                    <div className="layout-actions">
                      <button className="action-button primary">
                        <CheckCircle className="w-4 h-4" />
                        Apply Layout
                      </button>
                      <button className="action-button">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="action-button">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="widgets-settings">
              <h3>Widget Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto-Refresh</h4>
                    <p>Automatically refresh widget data</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable auto-refresh" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Widget Animations</h4>
                    <p>Enable animations for widget interactions</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable widget animations" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Grid Snap</h4>
                    <p>Snap widgets to grid when moving</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable grid snap" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Widget Transparency</h4>
                    <p>Allow transparent widget backgrounds</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable widget transparency" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Grid Size</h4>
                    <p>Set the default grid size for new layouts</p>
                  </div>
                  <select className="setting-input" title="Select default grid size">
                    <option value="4x3">4×3 (12 cells)</option>
                    <option value="6x4" selected>6×4 (24 cells)</option>
                    <option value="8x6">8×6 (48 cells)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Widget Permissions</h4>
                    <p>Manage widget access permissions</p>
                  </div>
                  <button className="action-button">
                    <Shield className="w-4 h-4" />
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
