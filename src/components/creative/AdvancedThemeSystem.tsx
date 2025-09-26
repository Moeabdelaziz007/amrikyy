import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Palette, 
  Brush, 
  Sparkles, 
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
  Mic,
  Volume2,
  VolumeX,
  Headphones,
  Monitor,
  Smartphone,
  Laptop,
  Watch,
  Glasses,
  Hand,
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
  Grid,
  Layers,
  Navigation,
  Compass,
  Hexagon,
  Circle,
  Square,
  Triangle,
  Diamond,
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
  Filter as FilterIcon,
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
  Crown,
  Gem,
  Award,
  Trophy,
  Medal,
  Badge,
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
  FileArchive,
  FileCheck,
  FileX,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  FileShare,
  FileMove,
  FileDelete,
  FileRestore,
  FileArchive as FileArchiveIcon,
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
  Info
} from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'dark' | 'light' | 'colorful' | 'minimal' | 'neon' | 'nature' | 'space' | 'custom';
  colors: ThemeColors;
  typography: Typography;
  effects: ThemeEffects;
  layout: LayoutSettings;
  isDefault: boolean;
  isCustom: boolean;
  author: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  rating: number;
  tags: string[];
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  gradient: GradientColors;
}

interface GradientColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
}

interface Typography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

interface ThemeEffects {
  shadows: ShadowSettings;
  borders: BorderSettings;
  animations: AnimationSettings;
  glassmorphism: GlassmorphismSettings;
  particles: ParticleSettings;
}

interface ShadowSettings {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  glow: string;
}

interface BorderSettings {
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  width: {
    thin: string;
    normal: string;
    thick: string;
  };
  style: 'solid' | 'dashed' | 'dotted' | 'double';
}

interface AnimationSettings {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  effects: string[];
}

interface GlassmorphismSettings {
  enabled: boolean;
  blur: string;
  opacity: number;
  saturation: number;
}

interface ParticleSettings {
  enabled: boolean;
  count: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
}

interface LayoutSettings {
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  grid: {
    columns: number;
    gap: string;
  };
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  colors: Partial<ThemeColors>;
  effects: Partial<ThemeEffects>;
  preview: string;
}

export const AdvancedThemeSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'customize' | 'presets' | 'settings'>('browse');
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data
  const [themes] = useState<Theme[]>([
    {
      id: '1',
      name: 'Amrikyy Dark Pro',
      description: 'Professional dark theme with blue accents',
      category: 'dark',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        background: '#0f0f23',
        surface: '#1a1a2e',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        border: '#374151',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
        gradient: {
          primary: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          secondary: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
          surface: 'linear-gradient(135deg, #1a1a2e, #16213e)'
        }
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      effects: {
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          glow: '0 0 20px rgba(59, 130, 246, 0.3)'
        },
        borders: {
          radius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            xl: '1rem'
          },
          width: {
            thin: '1px',
            normal: '2px',
            thick: '4px'
          },
          style: 'solid'
        },
        animations: {
          duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
          },
          easing: {
            linear: 'linear',
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out'
          },
          effects: ['fade', 'slide', 'scale', 'rotate', 'glow']
        },
        glassmorphism: {
          enabled: true,
          blur: '20px',
          opacity: 0.1,
          saturation: 1.2
        },
        particles: {
          enabled: true,
          count: 50,
          speed: 1,
          size: 2,
          color: '#3b82f6',
          opacity: 0.5
        }
      },
      layout: {
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem'
        },
        breakpoints: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        },
        grid: {
          columns: 12,
          gap: '1rem'
        }
      },
      isDefault: true,
      isCustom: false,
      author: 'Amrikyy Team',
      version: '1.0.0',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      downloads: 15000,
      rating: 4.8,
      tags: ['dark', 'professional', 'blue', 'modern']
    }
  ]);

  const [presets] = useState<ThemePreset[]>([
    {
      id: '1',
      name: 'Ocean Breeze',
      description: 'Calming blue and teal theme',
      category: 'nature',
      colors: {
        primary: '#06b6d4',
        secondary: '#0891b2',
        background: '#f0f9ff',
        surface: '#e0f2fe'
      },
      effects: {
        glassmorphism: {
          enabled: true,
          blur: '15px',
          opacity: 0.2,
          saturation: 1.1
        }
      },
      preview: 'linear-gradient(135deg, #06b6d4, #0891b2)'
    },
    {
      id: '2',
      name: 'Sunset Vibes',
      description: 'Warm orange and pink theme',
      category: 'colorful',
      colors: {
        primary: '#f97316',
        secondary: '#ec4899',
        background: '#fef3c7',
        surface: '#fed7aa'
      },
      effects: {
        glassmorphism: {
          enabled: true,
          blur: '25px',
          opacity: 0.15,
          saturation: 1.3
        }
      },
      preview: 'linear-gradient(135deg, #f97316, #ec4899)'
    },
    {
      id: '3',
      name: 'Forest Green',
      description: 'Natural green theme',
      category: 'nature',
      colors: {
        primary: '#059669',
        secondary: '#10b981',
        background: '#f0fdf4',
        surface: '#dcfce7'
      },
      effects: {
        glassmorphism: {
          enabled: true,
          blur: '20px',
          opacity: 0.1,
          saturation: 1.0
        }
      },
      preview: 'linear-gradient(135deg, #059669, #10b981)'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'light': return <Sun className="w-4 h-4" />;
      case 'colorful': return <Palette className="w-4 h-4" />;
      case 'minimal': return <Minimize className="w-4 h-4" />;
      case 'neon': return <Zap className="w-4 h-4" />;
      case 'nature': return <Trees className="w-4 h-4" />;
      case 'space': return <Star className="w-4 h-4" />;
      case 'custom': return <Brush className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dark': return 'text-gray-500';
      case 'light': return 'text-yellow-500';
      case 'colorful': return 'text-pink-500';
      case 'minimal': return 'text-gray-400';
      case 'neon': return 'text-cyan-500';
      case 'nature': return 'text-green-500';
      case 'space': return 'text-purple-500';
      case 'custom': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const applyTheme = (theme: Theme) => {
    console.log('Applying theme:', theme.name);
    // Apply theme to the application
  };

  const createTheme = () => {
    console.log('Creating new theme...');
  };

  const editTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsEditing(true);
  };

  const deleteTheme = (themeId: string) => {
    console.log('Deleting theme:', themeId);
  };

  const exportTheme = (theme: Theme) => {
    console.log('Exporting theme:', theme.name);
  };

  const importTheme = () => {
    console.log('Importing theme...');
  };

  if (loading) {
    return (
      <div className="advanced-theme-system">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading advanced theme system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-theme-system">
      <div className="theme-header">
        <div className="header-content">
          <div className="header-title">
            <Palette className="header-icon" />
            <h1>Advanced Theme System</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={createTheme}>
              <Plus className="button-icon" />
              Create Theme
            </button>
            <button className="action-button" onClick={importTheme}>
              <Upload className="button-icon" />
              Import
            </button>
            <button className="action-button">
              <Settings className="button-icon" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="theme-tabs">
        <button 
          className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          <Eye className="tab-icon" />
          Browse
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <Plus className="tab-icon" />
          Create
        </button>
        <button 
          className={`tab ${activeTab === 'customize' ? 'active' : ''}`}
          onClick={() => setActiveTab('customize')}
        >
          <Edit className="tab-icon" />
          Customize
        </button>
        <button 
          className={`tab ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
        >
          <Sparkles className="tab-icon" />
          Presets
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="theme-content">
        {activeTab === 'browse' && (
          <div className="browse-tab">
            <div className="themes-grid">
              {themes.map((theme) => (
                <div key={theme.id} className="theme-card">
                  <div className="theme-preview theme-preview-gradient">
                    <div className="preview-content">
                      <div className="preview-header preview-header-surface">
                        <div className="preview-title preview-title-text">Preview</div>
                        <div className="preview-actions">
                          <div className="preview-button preview-button-primary"></div>
                          <div className="preview-button preview-button-secondary"></div>
                        </div>
                      </div>
                      <div className="preview-body preview-body-background">
                        <div className="preview-text preview-text-primary">Sample Text</div>
                        <div className="preview-text-secondary preview-text-secondary-color">Secondary Text</div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-info">
                    <div className="theme-header">
                      <h3 className="theme-name">{theme.name}</h3>
                      <div className="theme-badges">
                        <span className={`category-badge ${getCategoryColor(theme.category)}`}>
                          {getCategoryIcon(theme.category)}
                          {theme.category}
                        </span>
                        {theme.isDefault && <span className="default-badge">Default</span>}
                        {theme.isCustom && <span className="custom-badge">Custom</span>}
                      </div>
                    </div>
                    <p className="theme-description">{theme.description}</p>
                    <div className="theme-stats">
                      <div className="stat">
                        <Download className="w-4 h-4" />
                        <span>{theme.downloads.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <Star className="w-4 h-4" />
                        <span>{theme.rating}</span>
                      </div>
                      <div className="stat">
                        <User className="w-4 h-4" />
                        <span>{theme.author}</span>
                      </div>
                    </div>
                    <div className="theme-tags">
                      {theme.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="theme-actions">
                    <button 
                      className="action-button primary"
                      onClick={() => applyTheme(theme)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Apply
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => editTheme(theme)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => exportTheme(theme)}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    {theme.isCustom && (
                      <button 
                        className="action-button danger"
                        onClick={() => deleteTheme(theme.id)}
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
        )}

        {activeTab === 'create' && (
          <div className="create-tab">
            <div className="theme-creator">
              <h3>Create New Theme</h3>
              <div className="creator-interface">
                <div className="creator-preview">
                  <div className="preview-window">
                    <div className="preview-header">
                      <div className="preview-title">Theme Preview</div>
                      <div className="preview-controls">
                        <div className="control-dot"></div>
                        <div className="control-dot"></div>
                        <div className="control-dot"></div>
                      </div>
                    </div>
                    <div className="preview-content">
                      <div className="preview-sidebar">
                        <div className="preview-item">Menu Item 1</div>
                        <div className="preview-item">Menu Item 2</div>
                        <div className="preview-item">Menu Item 3</div>
                      </div>
                      <div className="preview-main">
                        <div className="preview-card">
                          <h4>Sample Card</h4>
                          <p>This is a sample card to preview your theme.</p>
                          <button className="preview-button">Sample Button</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="creator-controls">
                  <div className="control-section">
                    <h4>Colors</h4>
                    <div className="color-controls">
                      <div className="color-input">
                        <label>Primary</label>
                        <input type="color" defaultValue="#3b82f6" title="Select primary color" />
                      </div>
                      <div className="color-input">
                        <label>Secondary</label>
                        <input type="color" defaultValue="#8b5cf6" title="Select secondary color" />
                      </div>
                      <div className="color-input">
                        <label>Background</label>
                        <input type="color" defaultValue="#0f0f23" title="Select background color" />
                      </div>
                      <div className="color-input">
                        <label>Surface</label>
                        <input type="color" defaultValue="#1a1a2e" title="Select surface color" />
                      </div>
                    </div>
                  </div>
                  <div className="control-section">
                    <h4>Typography</h4>
                    <div className="typography-controls">
                      <div className="input-group">
                        <label>Font Family</label>
                        <select defaultValue="Inter" title="Select font family">
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Base Font Size</label>
                        <input type="range" min="12" max="18" defaultValue="16" title="Adjust base font size" />
                      </div>
                    </div>
                  </div>
                  <div className="control-section">
                    <h4>Effects</h4>
                    <div className="effects-controls">
                      <div className="checkbox-group">
                        <label>
                          <input type="checkbox" defaultChecked title="Enable glassmorphism effects" />
                          Glassmorphism
                        </label>
                        <label>
                          <input type="checkbox" defaultChecked title="Enable particle effects" />
                          Particles
                        </label>
                        <label>
                          <input type="checkbox" title="Enable animations" />
                          Animations
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="creator-actions">
                    <button className="action-button primary">
                      <Save className="w-4 h-4" />
                      Save Theme
                    </button>
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customize' && (
          <div className="customize-tab">
            <div className="theme-customizer">
              <h3>Customize Current Theme</h3>
              <div className="customizer-interface">
                <div className="customizer-preview">
                  <div className="preview-window">
                    <div className="preview-header">
                      <div className="preview-title">Live Preview</div>
                    </div>
                    <div className="preview-content">
                      <div className="preview-sidebar">
                        <div className="preview-item">Dashboard</div>
                        <div className="preview-item">Tasks</div>
                        <div className="preview-item">Calendar</div>
                        <div className="preview-item">Settings</div>
                      </div>
                      <div className="preview-main">
                        <div className="preview-card">
                          <h4>Welcome to Amrikyy AIOS</h4>
                          <p>Customize your theme in real-time.</p>
                          <button className="preview-button">Get Started</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="customizer-controls">
                  <div className="control-section">
                    <h4>Color Palette</h4>
                    <div className="palette-grid">
                      <div className="palette-item">
                        <div className="color-swatch color-swatch-primary"></div>
                        <span>Primary</span>
                      </div>
                      <div className="palette-item">
                        <div className="color-swatch color-swatch-secondary"></div>
                        <span>Secondary</span>
                      </div>
                      <div className="palette-item">
                        <div className="color-swatch color-swatch-background"></div>
                        <span>Background</span>
                      </div>
                      <div className="palette-item">
                        <div className="color-swatch color-swatch-surface"></div>
                        <span>Surface</span>
                      </div>
                    </div>
                  </div>
                  <div className="control-section">
                    <h4>Advanced Settings</h4>
                    <div className="advanced-controls">
                      <div className="slider-group">
                        <label>Blur Intensity</label>
                        <input type="range" min="0" max="50" defaultValue="20" title="Adjust blur intensity" />
                      </div>
                      <div className="slider-group">
                        <label>Opacity</label>
                        <input type="range" min="0" max="1" step="0.1" defaultValue="0.1" title="Adjust opacity" />
                      </div>
                      <div className="slider-group">
                        <label>Particle Count</label>
                        <input type="range" min="0" max="100" defaultValue="50" title="Adjust particle count" />
                      </div>
                    </div>
                  </div>
                  <div className="customizer-actions">
                    <button className="action-button primary">
                      <Save className="w-4 h-4" />
                      Apply Changes
                    </button>
                    <button className="action-button">
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="presets-tab">
            <div className="presets-grid">
              {presets.map((preset) => (
                <div key={preset.id} className="preset-card">
                  <div className="preset-preview" style={{ background: preset.preview }}>
                    <div className="preset-overlay">
                      <div className="preset-icon">
                        {getCategoryIcon(preset.category)}
                      </div>
                    </div>
                  </div>
                  <div className="preset-info">
                    <h4 className="preset-name">{preset.name}</h4>
                    <p className="preset-description">{preset.description}</p>
                    <div className="preset-category">
                      <span className={`category-badge ${getCategoryColor(preset.category)}`}>
                        {getCategoryIcon(preset.category)}
                        {preset.category}
                      </span>
                    </div>
                  </div>
                  <div className="preset-actions">
                    <button className="action-button primary">
                      <Plus className="w-4 h-4" />
                      Apply
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
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="theme-settings">
              <h3>Theme Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Theme Switching</h4>
                    <p>Automatically switch between light and dark themes based on time</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable auto theme switching" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Theme Animations</h4>
                    <p>Enable smooth transitions when switching themes</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable theme animations" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Custom Themes</h4>
                    <p>Allow creation and import of custom themes</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable custom themes" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Theme Sharing</h4>
                    <p>Allow sharing themes with other users</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" title="Enable theme sharing" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Theme</h4>
                    <p>Set the default theme for new users</p>
                  </div>
                  <select className="setting-input" title="Select default theme">
                    <option value="amrikyy-dark-pro">Amrikyy Dark Pro</option>
                    <option value="amrikyy-light">Amrikyy Light</option>
                    <option value="ocean-breeze">Ocean Breeze</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Theme Backup</h4>
                    <p>Automatically backup custom themes</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable theme backup" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
