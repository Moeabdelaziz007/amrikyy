import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Palette, 
  Brush, 
  Image, 
  Video, 
  Music, 
  Code, 
  FileText, 
  Camera, 
  Mic, 
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
  Terminal,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Search,
  Filter,
  List,
  Grid,
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
  Video as VideoIcon,
  Camera as CameraIcon,
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
  FileDiff as FileDiffIconAlt,
  Plus,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';

interface CreativeTool {
  id: string;
  name: string;
  description: string;
  type: 'color' | 'gradient' | 'animation' | 'icon' | 'layout' | 'image' | 'video' | 'audio' | 'code' | 'text' | 'custom';
  category: 'design' | 'media' | 'development' | 'utility' | 'custom';
  icon: string;
  features: string[];
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

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  type: 'monochromatic' | 'complementary' | 'triadic' | 'analogous' | 'custom';
  isPublic: boolean;
  author: string;
  createdAt: Date;
}

interface Gradient {
  id: string;
  name: string;
  colors: string[];
  direction: number;
  type: 'linear' | 'radial' | 'conic';
  isPublic: boolean;
  author: string;
  createdAt: Date;
}

interface Animation {
  id: string;
  name: string;
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'custom';
  duration: number;
  easing: string;
  keyframes: any[];
  isPublic: boolean;
  author: string;
  createdAt: Date;
}

export const CreativeTools: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tools' | 'palettes' | 'gradients' | 'animations' | 'icons' | 'layouts'>('tools');
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<CreativeTool | null>(null);

  // Mock data
  const [tools] = useState<CreativeTool[]>([
    {
      id: '1',
      name: 'Color Palette Generator',
      description: 'Generate beautiful color palettes with AI',
      type: 'color',
      category: 'design',
      icon: '🎨',
      features: ['AI Generation', 'Color Harmony', 'Export Options', 'Preview'],
      isActive: true,
      isCustom: false,
      author: 'Amrikyy Team',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      version: '1.0.0',
      tags: ['color', 'palette', 'design', 'ai'],
      rating: 4.9,
      downloads: 15000
    }
  ]);

  const [palettes] = useState<ColorPalette[]>([
    {
      id: '1',
      name: 'Ocean Breeze',
      colors: ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
      type: 'monochromatic',
      isPublic: true,
      author: 'Amrikyy Team',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [gradients] = useState<Gradient[]>([
    {
      id: '1',
      name: 'Sunset Vibes',
      colors: ['#f97316', '#ec4899', '#8b5cf6'],
      direction: 135,
      type: 'linear',
      isPublic: true,
      author: 'Amrikyy Team',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [animations] = useState<Animation[]>([
    {
      id: '1',
      name: 'Smooth Fade',
      type: 'fade',
      duration: 300,
      easing: 'ease-in-out',
      keyframes: [],
      isPublic: true,
      author: 'Amrikyy Team',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'color': return <Palette className="w-4 h-4" />;
      case 'gradient': return <Gradient className="w-4 h-4" />;
      case 'animation': return <Play className="w-4 h-4" />;
      case 'icon': return <Star className="w-4 h-4" />;
      case 'layout': return <Grid className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'custom': return <Settings className="w-4 h-4" />;
      default: return <Brush className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'design': return <Palette className="w-4 h-4" />;
      case 'media': return <Image className="w-4 h-4" />;
      case 'development': return <Code className="w-4 h-4" />;
      case 'utility': return <Settings className="w-4 h-4" />;
      case 'custom': return <Brush className="w-4 h-4" />;
      default: return <Brush className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'design': return 'text-pink-500';
      case 'media': return 'text-blue-500';
      case 'development': return 'text-green-500';
      case 'utility': return 'text-orange-500';
      case 'custom': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const openTool = (tool: CreativeTool) => {
    setSelectedTool(tool);
  };

  const createPalette = () => {
    console.log('Creating new color palette...');
  };

  const createGradient = () => {
    console.log('Creating new gradient...');
  };

  const createAnimation = () => {
    console.log('Creating new animation...');
  };

  if (loading) {
    return (
      <div className="creative-tools">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading creative tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="creative-tools">
      <div className="tools-header">
        <div className="header-content">
          <div className="header-title">
            <Brush className="header-icon" />
            <h1>Creative Tools</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={createPalette}>
              <Plus className="button-icon" />
              New Palette
            </button>
            <button className="action-button" onClick={createGradient}>
              <Plus className="button-icon" />
              New Gradient
            </button>
            <button className="action-button" onClick={createAnimation}>
              <Plus className="button-icon" />
              New Animation
            </button>
          </div>
        </div>
      </div>

      <div className="tools-tabs">
        <button 
          className={`tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          <Brush className="tab-icon" />
          Tools
        </button>
        <button 
          className={`tab ${activeTab === 'palettes' ? 'active' : ''}`}
          onClick={() => setActiveTab('palettes')}
        >
          <Palette className="tab-icon" />
          Palettes
        </button>
        <button 
          className={`tab ${activeTab === 'gradients' ? 'active' : ''}`}
          onClick={() => setActiveTab('gradients')}
        >
          <Gradient className="tab-icon" />
          Gradients
        </button>
        <button 
          className={`tab ${activeTab === 'animations' ? 'active' : ''}`}
          onClick={() => setActiveTab('animations')}
        >
          <Play className="tab-icon" />
          Animations
        </button>
        <button 
          className={`tab ${activeTab === 'icons' ? 'active' : ''}`}
          onClick={() => setActiveTab('icons')}
        >
          <Star className="tab-icon" />
          Icons
        </button>
        <button 
          className={`tab ${activeTab === 'layouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('layouts')}
        >
          <Grid className="tab-icon" />
          Layouts
        </button>
      </div>

      <div className="tools-content">
        {activeTab === 'tools' && (
          <div className="tools-tab">
            <div className="tools-grid">
              {tools.map((tool) => (
                <div key={tool.id} className="tool-card">
                  <div className="tool-preview">
                    <div className="preview-icon">{tool.icon}</div>
                    <div className="preview-overlay">
                      <button 
                        className="preview-button"
                        onClick={() => openTool(tool)}
                        title={`Open ${tool.name}`}
                        aria-label={`Open ${tool.name} tool`}
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="tool-info">
                    <div className="tool-header">
                      <h4 className="tool-name">{tool.name}</h4>
                      <div className="tool-badges">
                        <span className={`category-badge ${getCategoryColor(tool.category)}`}>
                          {getCategoryIcon(tool.category)}
                          {tool.category}
                        </span>
                        {tool.isActive && <span className="active-badge">Active</span>}
                        {tool.isCustom && <span className="custom-badge">Custom</span>}
                      </div>
                    </div>
                    <p className="tool-description">{tool.description}</p>
                    <div className="tool-features">
                      {tool.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    <div className="tool-stats">
                      <div className="stat">
                        <Download className="w-4 h-4" />
                        <span>{tool.downloads.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <Star className="w-4 h-4" />
                        <span>{tool.rating}</span>
                      </div>
                      <div className="stat">
                        <User className="w-4 h-4" />
                        <span>{tool.author}</span>
                      </div>
                    </div>
                  </div>
                  <div className="tool-actions">
                    <button 
                      className="action-button primary"
                      onClick={() => openTool(tool)}
                    >
                      <Play className="w-4 h-4" />
                      Open
                    </button>
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'palettes' && (
          <div className="palettes-tab">
            <div className="palettes-grid">
              {palettes.map((palette) => (
                <div key={palette.id} className="palette-card">
                  <div className="palette-preview">
                    <div className="color-strip">
                      {palette.colors.map((color, index) => (
                        <div 
                          key={index} 
                          className="color-swatch"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="palette-info">
                    <h4 className="palette-name">{palette.name}</h4>
                    <p className="palette-type">{palette.type}</p>
                    <div className="palette-colors">
                      {palette.colors.map((color, index) => (
                        <div key={index} className="color-item">
                          <div 
                            className="color-dot"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="color-code">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="palette-actions">
                    <button className="action-button primary">
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="action-button">
                      <Share className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gradients' && (
          <div className="gradients-tab">
            <div className="gradients-grid">
              {gradients.map((gradient) => (
                <div key={gradient.id} className="gradient-card">
                  <div className="gradient-preview">
                    <div 
                      className="gradient-strip"
                      style={{
                        background: `linear-gradient(${gradient.direction}deg, ${gradient.colors.join(', ')})`
                      }}
                    ></div>
                  </div>
                  <div className="gradient-info">
                    <h4 className="gradient-name">{gradient.name}</h4>
                    <p className="gradient-type">{gradient.type}</p>
                    <div className="gradient-details">
                      <div className="detail">
                        <span className="detail-label">Direction:</span>
                        <span className="detail-value">{gradient.direction}°</span>
                      </div>
                      <div className="detail">
                        <span className="detail-label">Colors:</span>
                        <span className="detail-value">{gradient.colors.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="gradient-actions">
                    <button className="action-button primary">
                      <Copy className="w-4 h-4" />
                      Copy CSS
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="action-button">
                      <Share className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'animations' && (
          <div className="animations-tab">
            <div className="animations-grid">
              {animations.map((animation) => (
                <div key={animation.id} className="animation-card">
                  <div className="animation-preview">
                    <div className="preview-box">
                      <div className="animated-element"></div>
                    </div>
                  </div>
                  <div className="animation-info">
                    <h4 className="animation-name">{animation.name}</h4>
                    <p className="animation-type">{animation.type}</p>
                    <div className="animation-details">
                      <div className="detail">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{animation.duration}ms</span>
                      </div>
                      <div className="detail">
                        <span className="detail-label">Easing:</span>
                        <span className="detail-value">{animation.easing}</span>
                      </div>
                    </div>
                  </div>
                  <div className="animation-actions">
                    <button className="action-button primary">
                      <Play className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="action-button">
                      <Copy className="w-4 h-4" />
                      Copy CSS
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="icons-tab">
            <div className="icons-grid">
              <div className="icon-category">
                <h4>System Icons</h4>
                <div className="icon-set">
                  {[Settings, User, Globe, Star, Heart, Shield, Lock, Key].map((Icon, index) => (
                    <div key={index} className="icon-item">
                      <Icon className="w-6 h-6" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="icon-category">
                <h4>Media Icons</h4>
                <div className="icon-set">
                  {[Image, Video, Music, Camera, Mic, Volume2, Headphones, Monitor].map((Icon, index) => (
                    <div key={index} className="icon-item">
                      <Icon className="w-6 h-6" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="icon-category">
                <h4>Action Icons</h4>
                <div className="icon-set">
                  {[Play, Pause, Download, Upload, Save, Copy, Share, Edit].map((Icon, index) => (
                    <div key={index} className="icon-item">
                      <Icon className="w-6 h-6" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layouts' && (
          <div className="layouts-tab">
            <div className="layouts-grid">
              <div className="layout-template">
                <div className="template-preview">
                  <div className="preview-grid">
                    <div className="grid-header"></div>
                    <div className="grid-sidebar"></div>
                    <div className="grid-main"></div>
                    <div className="grid-footer"></div>
                  </div>
                </div>
                <div className="template-info">
                  <h4>Standard Layout</h4>
                  <p>Header, sidebar, main content, and footer</p>
                </div>
                <div className="template-actions">
                  <button className="action-button primary">
                    <Copy className="w-4 h-4" />
                    Use Template
                  </button>
                </div>
              </div>
              <div className="layout-template">
                <div className="template-preview">
                  <div className="preview-grid">
                    <div className="grid-header"></div>
                    <div className="grid-main"></div>
                  </div>
                </div>
                <div className="template-info">
                  <h4>Simple Layout</h4>
                  <p>Header and main content only</p>
                </div>
                <div className="template-actions">
                  <button className="action-button primary">
                    <Copy className="w-4 h-4" />
                    Use Template
                  </button>
                </div>
              </div>
              <div className="layout-template">
                <div className="template-preview">
                  <div className="preview-grid">
                    <div className="grid-sidebar"></div>
                    <div className="grid-main"></div>
                  </div>
                </div>
                <div className="template-info">
                  <h4>Sidebar Layout</h4>
                  <p>Sidebar and main content</p>
                </div>
                <div className="template-actions">
                  <button className="action-button primary">
                    <Copy className="w-4 h-4" />
                    Use Template
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
