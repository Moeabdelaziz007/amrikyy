import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Grid3X3, 
  List, 
  Filter, 
  Plus, 
  Star, 
  Download,
  Trash2,
  Settings,
  Folder,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  Brain,
  Palette,
  Gamepad2,
  Music,
  Camera,
  FileText,
  Calculator,
  Cloud,
  Plane,
  Bot,
  Shield,
  Database,
  Code,
  Globe,
  Mail,
  MessageSquare,
  Video,
  Image,
  File,
  Archive,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Heart,
  Bookmark,
  Share,
  Copy,
  Edit,
  Save,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface App {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: string;
  tags: string[];
  isInstalled: boolean;
  isFavorite: boolean;
  isNew: boolean;
  isPopular: boolean;
  rating: number;
  downloads: number;
  size: string;
  version: string;
  developer: string;
  lastUsed?: Date;
  usageCount: number;
}

interface SmartAppLauncherProps {
  onAppClick: (appId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const allApps: App[] = [
  // Productivity Apps
  {
    id: "ai-notes",
    name: "AI Notes",
    description: "Intelligent note-taking with AI assistance",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
    category: "Productivity",
    tags: ["notes", "ai", "writing", "productivity"],
    isInstalled: true,
    isFavorite: true,
    isNew: false,
    isPopular: true,
    rating: 4.8,
    downloads: 15420,
    size: "12.5 MB",
    version: "2.1.0",
    developer: "AuraOS Team",
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    usageCount: 45
  },
  {
    id: "ai-calculator",
    name: "AI Calculator",
    description: "Advanced calculator with AI problem solving",
    icon: Calculator,
    color: "from-orange-500 to-red-500",
    category: "Productivity",
    tags: ["calculator", "math", "ai", "tools"],
    isInstalled: true,
    isFavorite: false,
    isNew: false,
    isPopular: true,
    rating: 4.6,
    downloads: 12890,
    size: "8.2 MB",
    version: "1.8.0",
    developer: "AuraOS Team",
    lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000),
    usageCount: 23
  },
  {
    id: "ai-travel",
    name: "AI Travel",
    description: "Smart travel planning and booking assistant",
    icon: Plane,
    color: "from-blue-500 to-cyan-500",
    category: "Travel",
    tags: ["travel", "booking", "ai", "planning"],
    isInstalled: true,
    isFavorite: true,
    isNew: false,
    isPopular: true,
    rating: 4.9,
    downloads: 22100,
    size: "25.3 MB",
    version: "3.2.0",
    developer: "AuraOS Team",
    lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000),
    usageCount: 12
  },
  {
    id: "ai-chatbot",
    name: "AI Assistant",
    description: "Your personal AI companion for everything",
    icon: Bot,
    color: "from-green-500 to-emerald-500",
    category: "AI",
    tags: ["ai", "assistant", "chat", "help"],
    isInstalled: true,
    isFavorite: true,
    isNew: false,
    isPopular: true,
    rating: 4.9,
    downloads: 45600,
    size: "18.7 MB",
    version: "4.1.0",
    developer: "AuraOS Team",
    lastUsed: new Date(Date.now() - 30 * 60 * 1000),
    usageCount: 156
  },
  {
    id: "ai-weather",
    name: "AI Weather",
    description: "Intelligent weather forecasting and alerts",
    icon: Cloud,
    color: "from-indigo-500 to-purple-500",
    category: "Weather",
    tags: ["weather", "forecast", "ai", "alerts"],
    isInstalled: true,
    isFavorite: false,
    isNew: false,
    isPopular: true,
    rating: 4.7,
    downloads: 18900,
    size: "15.2 MB",
    version: "2.5.0",
    developer: "AuraOS Team",
    lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000),
    usageCount: 34
  },
  {
    id: "settings",
    name: "Settings",
    description: "System settings and preferences",
    icon: Settings,
    color: "from-slate-500 to-gray-600",
    category: "System",
    tags: ["settings", "system", "preferences", "config"],
    isInstalled: true,
    isFavorite: false,
    isNew: false,
    isPopular: false,
    rating: 4.5,
    downloads: 0,
    size: "5.1 MB",
    version: "1.0.0",
    developer: "AuraOS Team",
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    usageCount: 8
  },
  
  // New Apps
  {
    id: "ai-code-assistant",
    name: "AI Code Assistant",
    description: "Intelligent coding companion with auto-completion",
    icon: Code,
    color: "from-cyan-500 to-blue-500",
    category: "Development",
    tags: ["code", "programming", "ai", "development"],
    isInstalled: false,
    isFavorite: false,
    isNew: true,
    isPopular: false,
    rating: 4.8,
    downloads: 8900,
    size: "32.1 MB",
    version: "1.0.0",
    developer: "AuraOS Team",
    usageCount: 0
  },
  {
    id: "ai-image-editor",
    name: "AI Image Editor",
    description: "Advanced image editing with AI enhancement",
    icon: Image,
    color: "from-pink-500 to-rose-500",
    category: "Creative",
    tags: ["image", "photo", "editing", "ai", "creative"],
    isInstalled: false,
    isFavorite: false,
    isNew: true,
    isPopular: false,
    rating: 4.6,
    downloads: 12300,
    size: "45.8 MB",
    version: "1.2.0",
    developer: "AuraOS Team",
    usageCount: 0
  },
  {
    id: "ai-music-composer",
    name: "AI Music Composer",
    description: "Create music with AI-powered composition",
    icon: Music,
    color: "from-violet-500 to-purple-500",
    category: "Creative",
    tags: ["music", "audio", "composition", "ai", "creative"],
    isInstalled: false,
    isFavorite: false,
    isNew: true,
    isPopular: false,
    rating: 4.7,
    downloads: 6700,
    size: "28.9 MB",
    version: "1.1.0",
    developer: "AuraOS Team",
    usageCount: 0
  },
  {
    id: "ai-game-assistant",
    name: "AI Game Assistant",
    description: "Gaming companion with strategy and tips",
    icon: Gamepad2,
    color: "from-emerald-500 to-teal-500",
    category: "Gaming",
    tags: ["gaming", "games", "ai", "strategy", "entertainment"],
    isInstalled: false,
    isFavorite: false,
    isNew: true,
    isPopular: false,
    rating: 4.5,
    downloads: 15600,
    size: "22.4 MB",
    version: "1.0.0",
    developer: "AuraOS Team",
    usageCount: 0
  },
  {
    id: "ai-security-scanner",
    name: "AI Security Scanner",
    description: "Advanced security analysis and protection",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    category: "Security",
    tags: ["security", "protection", "ai", "scanning", "safety"],
    isInstalled: false,
    isFavorite: false,
    isNew: true,
    isPopular: false,
    rating: 4.9,
    downloads: 9800,
    size: "19.6 MB",
    version: "1.0.0",
    developer: "AuraOS Team",
    usageCount: 0
  },
  {
    id: "ai-database-manager",
    name: "AI Database Manager",
    description: "Intelligent database management and optimization",
    icon: Database,
    color: "from-amber-500 to-yellow-500",
    category: "Development",
    tags: ["database", "data", "management", "ai", "development"],
    isInstalled: false,
    isFavorite: false,
    isNew: true,
    isPopular: false,
    rating: 4.7,
    downloads: 5400,
    size: "35.2 MB",
    version: "1.0.0",
    developer: "AuraOS Team",
    usageCount: 0
  }
];

const categories = [
  "All",
  "Productivity", 
  "AI", 
  "Creative", 
  "Development", 
  "Gaming", 
  "Security", 
  "Travel", 
  "Weather", 
  "System"
];

export const SmartAppLauncher: React.FC<SmartAppLauncherProps> = ({
  onAppClick,
  onClose,
  isOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'popular' | 'rating'>('recent');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showInstalledOnly, setShowInstalledOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Filter and sort apps
  const filteredApps = useMemo(() => {
    let filtered = allApps;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Additional filters
    if (showFavoritesOnly) {
      filtered = filtered.filter(app => app.isFavorite);
    }
    if (showInstalledOnly) {
      filtered = filtered.filter(app => app.isInstalled);
    }
    if (showNewOnly) {
      filtered = filtered.filter(app => app.isNew);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0);
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, showFavoritesOnly, showInstalledOnly, showNewOnly, sortBy]);

  // Handle app selection
  const handleAppSelect = (appId: string) => {
    if (isSelectMode) {
      setSelectedApps(prev => 
        prev.includes(appId) 
          ? prev.filter(id => id !== appId)
          : [...prev, appId]
      );
    } else {
      onAppClick(appId);
    }
  };

  // Handle bulk actions
  const handleBulkInstall = () => {
    // Implementation for bulk install
    console.log('Installing apps:', selectedApps);
    setSelectedApps([]);
    setIsSelectMode(false);
  };

  const handleBulkUninstall = () => {
    // Implementation for bulk uninstall
    console.log('Uninstalling apps:', selectedApps);
    setSelectedApps([]);
    setIsSelectMode(false);
  };

  const handleBulkFavorite = () => {
    // Implementation for bulk favorite
    console.log('Favoriting apps:', selectedApps);
    setSelectedApps([]);
    setIsSelectMode(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[80vh] glass-ultra rounded-3xl border border-white/10 shadow-premium overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">App Launcher</h1>
            </div>
            <div className="text-sm text-gray-400">
              {filteredApps.length} apps found
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSelectMode(!isSelectMode)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isSelectMode 
                  ? "bg-purple-500 text-white" 
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              )}
            >
              {isSelectMode ? "Cancel" : "Select"}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent" className="bg-slate-800">Recent</option>
              <option value="name" className="bg-slate-800">Name</option>
              <option value="popular" className="bg-slate-800">Popular</option>
              <option value="rating" className="bg-slate-800">Rating</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                showFavoritesOnly 
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              )}
            >
              <Star className="w-4 h-4" />
              <span>Favorites</span>
            </button>
            
            <button
              onClick={() => setShowInstalledOnly(!showInstalledOnly)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                showInstalledOnly 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              )}
            >
              <Check className="w-4 h-4" />
              <span>Installed</span>
            </button>
            
            <button
              onClick={() => setShowNewOnly(!showNewOnly)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                showNewOnly 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              )}
            >
              <Zap className="w-4 h-4" />
              <span>New</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'grid' 
                    ? "bg-purple-500 text-white" 
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'list' 
                    ? "bg-purple-500 text-white" 
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {isSelectMode && selectedApps.length > 0 && (
          <div className="p-4 bg-purple-500/10 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-purple-300">
                {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkInstall}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Install</span>
                </button>
                <button
                  onClick={handleBulkUninstall}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Uninstall</span>
                </button>
                <button
                  onClick={handleBulkFavorite}
                  className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
                >
                  <Star className="w-4 h-4" />
                  <span>Favorite</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Apps Grid/List */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredApps.map((app) => {
                const Icon = app.icon;
                const isSelected = selectedApps.includes(app.id);
                
                return (
                  <div
                    key={app.id}
                    className={cn(
                      "group relative card-premium rounded-2xl p-4 transition-premium cursor-pointer",
                      "hover:scale-105 hover:shadow-xl",
                      isSelected && "ring-2 ring-purple-500 bg-purple-500/10",
                      isSelectMode && "cursor-pointer"
                    )}
                    onClick={() => handleAppSelect(app.id)}
                  >
                    {/* Selection Checkbox */}
                    {isSelectMode && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center",
                          isSelected 
                            ? "bg-purple-500 border-purple-500" 
                            : "border-white/30 bg-white/10"
                        )}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    )}

                    {/* App Icon */}
                    <div className="relative mb-3">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto",
                        app.color,
                        "shadow-lg group-hover:shadow-xl transition-all"
                      )}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Status Badges */}
                      <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
                        {app.isNew && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Zap className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {app.isFavorite && (
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {app.isPopular && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* App Info */}
                    <div className="text-center">
                      <h3 className="font-semibold text-white text-sm mb-1 truncate">
                        {app.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                        {app.description}
                      </p>
                      
                      {/* App Stats */}
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{app.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{Math.floor(app.downloads / 1000)}k</span>
                        </div>
                      </div>
                    </div>

                    {/* Install Status */}
                    <div className="absolute bottom-2 right-2">
                      {app.isInstalled ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <Download className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredApps.map((app) => {
                const Icon = app.icon;
                const isSelected = selectedApps.includes(app.id);
                
                return (
                  <div
                    key={app.id}
                    className={cn(
                      "group flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 cursor-pointer",
                      "hover:bg-white/10 hover:shadow-lg",
                      isSelected && "ring-2 ring-purple-500 bg-purple-500/10"
                    )}
                    onClick={() => handleAppSelect(app.id)}
                  >
                    {/* Selection Checkbox */}
                    {isSelectMode && (
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center",
                        isSelected 
                          ? "bg-purple-500 border-purple-500" 
                          : "border-white/30 bg-white/10"
                      )}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}

                    {/* App Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                      app.color
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* App Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {app.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {app.isNew && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <Zap className="w-2 h-2 text-white" />
                            </div>
                          )}
                          {app.isFavorite && (
                            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Star className="w-2 h-2 text-white" />
                            </div>
                          )}
                          {app.isPopular && (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                        {app.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{app.category}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{app.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{Math.floor(app.downloads / 1000)}k</span>
                        </div>
                        <span>{app.size}</span>
                      </div>
                    </div>

                    {/* Install Status */}
                    <div className="flex-shrink-0">
                      {app.isInstalled ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-green-400">Installed</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Download className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-400">Install</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
