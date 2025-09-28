import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Settings, 
  Palette, 
  Layout, 
  Bell, 
  Shield, 
  Globe, 
  Clock, 
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
  Calendar, 
  Users, 
  Star, 
  Heart, 
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
  Info
} from 'lucide-react';

interface PersonalizationProfile {
  id: string;
  name: string;
  description: string;
  avatar: string;
  preferences: UserPreferences;
  settings: PersonalizationSettings;
  themes: ThemePreferences;
  layout: LayoutPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  units: 'metric' | 'imperial';
  workHours: { start: string; end: string };
  breakReminders: boolean;
  focusMode: boolean;
  darkMode: boolean;
  autoSave: boolean;
  autoSync: boolean;
}

interface PersonalizationSettings {
  showWelcome: boolean;
  showTips: boolean;
  showUpdates: boolean;
  showPromotions: boolean;
  collectAnalytics: boolean;
  shareUsageData: boolean;
  allowPersonalization: boolean;
  adaptiveInterface: boolean;
  smartSuggestions: boolean;
  contextualHelp: boolean;
}

interface ThemePreferences {
  primaryColor: string;
  accentColor: string;
  backgroundStyle: 'solid' | 'gradient' | 'image' | 'animated';
  backgroundImage: string;
  opacity: number;
  blur: number;
  animations: boolean;
  transitions: boolean;
  effects: boolean;
  particles: boolean;
}

interface LayoutPreferences {
  sidebarPosition: 'left' | 'right' | 'hidden';
  sidebarWidth: number;
  headerHeight: number;
  footerVisible: boolean;
  gridSize: number;
  compactMode: boolean;
  density: 'comfortable' | 'compact' | 'spacious';
  orientation: 'portrait' | 'landscape' | 'auto';
}

interface NotificationPreferences {
  desktop: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
  vibration: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: { start: string; end: string };
  categories: NotificationCategory[];
}

interface NotificationCategory {
  name: string;
  enabled: boolean;
  sound: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface PrivacyPreferences {
  profileVisibility: 'public' | 'friends' | 'private';
  dataSharing: boolean;
  locationSharing: boolean;
  activityTracking: boolean;
  personalizedAds: boolean;
  thirdPartyAccess: boolean;
  dataRetention: number;
  exportData: boolean;
  deleteData: boolean;
}

interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  colorBlindSupport: boolean;
  focusIndicators: boolean;
  altText: boolean;
  captions: boolean;
  signLanguage: boolean;
}

export const PersonalizationFeatures: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'themes' | 'layout' | 'notifications' | 'privacy' | 'accessibility'>('profile');
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<PersonalizationProfile | null>(null);

  // Mock data
  const [profiles] = useState<PersonalizationProfile[]>([
    {
      id: '1',
      name: 'Default Profile',
      description: 'Standard personalization settings',
      avatar: '/api/placeholder/100/100',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        currency: 'USD',
        units: 'metric',
        workHours: { start: '09:00', end: '17:00' },
        breakReminders: true,
        focusMode: false,
        darkMode: true,
        autoSave: true,
        autoSync: true
      },
      settings: {
        showWelcome: true,
        showTips: true,
        showUpdates: true,
        showPromotions: false,
        collectAnalytics: true,
        shareUsageData: false,
        allowPersonalization: true,
        adaptiveInterface: true,
        smartSuggestions: true,
        contextualHelp: true
      },
      themes: {
        primaryColor: '#3b82f6',
        accentColor: '#8b5cf6',
        backgroundStyle: 'gradient',
        backgroundImage: '',
        opacity: 0.9,
        blur: 20,
        animations: true,
        transitions: true,
        effects: true,
        particles: true
      },
      layout: {
        sidebarPosition: 'left',
        sidebarWidth: 250,
        headerHeight: 60,
        footerVisible: true,
        gridSize: 12,
        compactMode: false,
        density: 'comfortable',
        orientation: 'auto'
      },
      notifications: {
        desktop: true,
        email: true,
        push: true,
        sound: true,
        vibration: false,
        frequency: 'immediate',
        quietHours: { start: '22:00', end: '08:00' },
        categories: [
          { name: 'System', enabled: true, sound: true, priority: 'high' },
          { name: 'Updates', enabled: true, sound: false, priority: 'medium' },
          { name: 'Promotions', enabled: false, sound: false, priority: 'low' }
        ]
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false,
        locationSharing: false,
        activityTracking: true,
        personalizedAds: false,
        thirdPartyAccess: false,
        dataRetention: 365,
        exportData: true,
        deleteData: true
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false,
        keyboardNavigation: true,
        reducedMotion: false,
        colorBlindSupport: false,
        focusIndicators: true,
        altText: true,
        captions: false,
        signLanguage: false
      },
      isDefault: true,
      isActive: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const saveProfile = () => {
    console.log('Saving personalization profile...');
  };

  const resetProfile = () => {
    console.log('Resetting personalization profile...');
  };

  const exportProfile = () => {
    console.log('Exporting personalization profile...');
  };

  const importProfile = () => {
    console.log('Importing personalization profile...');
  };

  if (loading) {
    return (
      <div className="personalization-features">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading personalization features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personalization-features">
      <div className="personalization-header">
        <div className="header-content">
          <div className="header-title">
            <User className="header-icon" />
            <h1>Personalization Features</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={saveProfile}>
              <Save className="button-icon" />
              Save
            </button>
            <button className="action-button" onClick={exportProfile}>
              <Download className="button-icon" />
              Export
            </button>
            <button className="action-button" onClick={importProfile}>
              <Upload className="button-icon" />
              Import
            </button>
          </div>
        </div>
      </div>

      <div className="personalization-tabs">
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="tab-icon" />
          Profile
        </button>
        <button 
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Settings className="tab-icon" />
          Preferences
        </button>
        <button 
          className={`tab ${activeTab === 'themes' ? 'active' : ''}`}
          onClick={() => setActiveTab('themes')}
        >
          <Palette className="tab-icon" />
          Themes
        </button>
        <button 
          className={`tab ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          <Layout className="tab-icon" />
          Layout
        </button>
        <button 
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell className="tab-icon" />
          Notifications
        </button>
        <button 
          className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <Shield className="tab-icon" />
          Privacy
        </button>
        <button 
          className={`tab ${activeTab === 'accessibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('accessibility')}
        >
          <Eye className="tab-icon" />
          Accessibility
        </button>
      </div>

      <div className="personalization-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="profile-editor">
              <h3>Personalization Profile</h3>
              <div className="profile-form">
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-group">
                    <label>Profile Name</label>
                    <input type="text" defaultValue="Default Profile" aria-label="Profile name" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea defaultValue="Standard personalization settings" rows={3} aria-label="Profile description"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Avatar</label>
                    <div className="avatar-upload">
                      <img src="/api/placeholder/100/100" alt="Avatar" className="avatar-preview" />
                      <button className="upload-button">Change Avatar</button>
                    </div>
                  </div>
                </div>
                <div className="form-section">
                  <h4>Quick Settings</h4>
                  <div className="quick-settings">
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Dark Mode
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Auto Save
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Smart Suggestions
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" />
                        Focus Mode
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="preferences-tab">
            <div className="preferences-editor">
              <h3>User Preferences</h3>
              <div className="preferences-grid">
                <div className="preference-section">
                  <h4>Language & Region</h4>
                  <div className="form-group">
                    <label>Language</label>
                    <select defaultValue="en">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select defaultValue="UTC">
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date Format</label>
                    <select defaultValue="MM/DD/YYYY">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Time Format</label>
                    <select defaultValue="12h">
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                </div>
                <div className="preference-section">
                  <h4>Work & Productivity</h4>
                  <div className="form-group">
                    <label>Work Hours</label>
                    <div className="time-inputs">
                      <input type="time" defaultValue="09:00" />
                      <span>to</span>
                      <input type="time" defaultValue="17:00" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Units</label>
                    <select defaultValue="metric">
                      <option value="metric">Metric</option>
                      <option value="imperial">Imperial</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select defaultValue="USD">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'themes' && (
          <div className="themes-tab">
            <div className="themes-editor">
              <h3>Theme Preferences</h3>
              <div className="themes-grid">
                <div className="theme-section">
                  <h4>Colors</h4>
                  <div className="color-controls">
                    <div className="color-input">
                      <label>Primary Color</label>
                      <input type="color" defaultValue="#3b82f6" />
                    </div>
                    <div className="color-input">
                      <label>Accent Color</label>
                      <input type="color" defaultValue="#8b5cf6" />
                    </div>
                  </div>
                </div>
                <div className="theme-section">
                  <h4>Background</h4>
                  <div className="background-controls">
                    <div className="form-group">
                      <label>Style</label>
                      <select defaultValue="gradient">
                        <option value="solid">Solid</option>
                        <option value="gradient">Gradient</option>
                        <option value="image">Image</option>
                        <option value="animated">Animated</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Opacity</label>
                      <input type="range" min="0" max="1" step="0.1" defaultValue="0.9" aria-label="Brightness control" />
                    </div>
                    <div className="form-group">
                      <label>Blur</label>
                      <input type="range" min="0" max="50" defaultValue="20" aria-label="Blur control" />
                    </div>
                  </div>
                </div>
                <div className="theme-section">
                  <h4>Effects</h4>
                  <div className="effects-controls">
                    <div className="checkbox-group">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Animations
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        Transitions
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        Effects
                      </label>
                      <label>
                        <input type="checkbox" defaultChecked />
                        Particles
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="layout-tab">
            <div className="layout-editor">
              <h3>Layout Preferences</h3>
              <div className="layout-grid">
                <div className="layout-section">
                  <h4>Interface Layout</h4>
                  <div className="form-group">
                    <label>Sidebar Position</label>
                    <select defaultValue="left">
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sidebar Width</label>
                    <input type="range" min="200" max="400" defaultValue="250" />
                  </div>
                  <div className="form-group">
                    <label>Header Height</label>
                    <input type="range" min="40" max="80" defaultValue="60" />
                  </div>
                </div>
                <div className="layout-section">
                  <h4>Display Settings</h4>
                  <div className="form-group">
                    <label>Density</label>
                    <select defaultValue="comfortable">
                      <option value="comfortable">Comfortable</option>
                      <option value="compact">Compact</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Grid Size</label>
                    <input type="range" min="8" max="16" defaultValue="12" />
                  </div>
                  <div className="form-group">
                    <label>Orientation</label>
                    <select defaultValue="auto">
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <div className="notifications-editor">
              <h3>Notification Preferences</h3>
              <div className="notifications-grid">
                <div className="notification-section">
                  <h4>General Settings</h4>
                  <div className="checkbox-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Desktop Notifications
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked />
                      Email Notifications
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked />
                      Push Notifications
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked />
                      Sound Notifications
                    </label>
                    <label>
                      <input type="checkbox" />
                      Vibration
                    </label>
                  </div>
                </div>
                <div className="notification-section">
                  <h4>Frequency & Timing</h4>
                  <div className="form-group">
                    <label>Frequency</label>
                    <select defaultValue="immediate">
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quiet Hours</label>
                    <div className="time-inputs">
                      <input type="time" defaultValue="22:00" />
                      <span>to</span>
                      <input type="time" defaultValue="08:00" />
                    </div>
                  </div>
                </div>
                <div className="notification-section">
                  <h4>Categories</h4>
                  <div className="category-list">
                    <div className="category-item">
                      <div className="category-info">
                        <span className="category-name">System</span>
                        <span className="category-priority">High</span>
                      </div>
                      <div className="category-controls">
                        <label>
                          <input type="checkbox" defaultChecked />
                          Enabled
                        </label>
                        <label>
                          <input type="checkbox" defaultChecked />
                          Sound
                        </label>
                      </div>
                    </div>
                    <div className="category-item">
                      <div className="category-info">
                        <span className="category-name">Updates</span>
                        <span className="category-priority">Medium</span>
                      </div>
                      <div className="category-controls">
                        <label>
                          <input type="checkbox" defaultChecked />
                          Enabled
                        </label>
                        <label>
                          <input type="checkbox" />
                          Sound
                        </label>
                      </div>
                    </div>
                    <div className="category-item">
                      <div className="category-info">
                        <span className="category-name">Promotions</span>
                        <span className="category-priority">Low</span>
                      </div>
                      <div className="category-controls">
                        <label>
                          <input type="checkbox" />
                          Enabled
                        </label>
                        <label>
                          <input type="checkbox" />
                          Sound
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="privacy-tab">
            <div className="privacy-editor">
              <h3>Privacy Preferences</h3>
              <div className="privacy-grid">
                <div className="privacy-section">
                  <h4>Profile Visibility</h4>
                  <div className="form-group">
                    <label>Profile Visibility</label>
                    <select defaultValue="private">
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
                <div className="privacy-section">
                  <h4>Data Sharing</h4>
                  <div className="checkbox-group">
                    <label>
                      <input type="checkbox" />
                      Share Usage Data
                    </label>
                    <label>
                      <input type="checkbox" />
                      Location Sharing
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked />
                      Activity Tracking
                    </label>
                    <label>
                      <input type="checkbox" />
                      Personalized Ads
                    </label>
                    <label>
                      <input type="checkbox" />
                      Third Party Access
                    </label>
                  </div>
                </div>
                <div className="privacy-section">
                  <h4>Data Management</h4>
                  <div className="form-group">
                    <label>Data Retention (days)</label>
                    <input type="number" min="30" max="3650" defaultValue="365" />
                  </div>
                  <div className="privacy-actions">
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                    <button className="action-button danger">
                      <Trash2 className="w-4 h-4" />
                      Delete Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="accessibility-tab">
            <div className="accessibility-editor">
              <h3>Accessibility Preferences</h3>
              <div className="accessibility-grid">
                <div className="accessibility-section">
                  <h4>Visual</h4>
                  <div className="checkbox-group">
                    <label>
                      <input type="checkbox" />
                      High Contrast
                    </label>
                    <label>
                      <input type="checkbox" />
                      Large Text
                    </label>
                    <label>
                      <input type="checkbox" />
                      Color Blind Support
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked />
                      Focus Indicators
                    </label>
                  </div>
                </div>
                <div className="accessibility-section">
                  <h4>Interaction</h4>
                  <div className="checkbox-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Keyboard Navigation
                    </label>
                    <label>
                      <input type="checkbox" />
                      Screen Reader
                    </label>
                    <label>
                      <input type="checkbox" />
                      Reduced Motion
                    </label>
                  </div>
                </div>
                <div className="accessibility-section">
                  <h4>Content</h4>
                  <div className="checkbox-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Alt Text
                    </label>
                    <label>
                      <input type="checkbox" />
                      Captions
                    </label>
                    <label>
                      <input type="checkbox" />
                      Sign Language
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
