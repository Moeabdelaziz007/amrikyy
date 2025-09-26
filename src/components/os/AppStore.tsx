import {
  Search,
  Star,
  Download,
  TrendingUp,
  Clock,
  Filter,
  Grid3X3,
  List,
  X,
  Check,
  Eye,
  Heart,
  Share,
  Info,
  Zap,
  Crown,
  Shield,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppStoreApp {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<any>;
  color: string;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  downloads: number;
  size: string;
  version: string;
  developer: string;
  price: number;
  isFree: boolean;
  isPremium: boolean;
  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  screenshots: string[];
  features: string[];
  requirements: string[];
  lastUpdated: Date;
  permissions: string[];
  isInstalled: boolean;
  isFavorite: boolean;
}

interface AppStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: (appId: string) => void;
}

const featuredApps: AppStoreApp[] = [
  {
    id: 'ai-code-assistant',
    name: 'AI Code Assistant',
    description: 'Intelligent coding companion with auto-completion',
    longDescription:
      'Revolutionary AI-powered code assistant that understands your coding patterns and provides intelligent suggestions, auto-completion, and real-time error detection. Perfect for developers of all skill levels.',
    icon: () => (
      <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
        C
      </div>
    ),
    color: 'from-cyan-500 to-blue-500',
    category: 'Development',
    tags: ['code', 'programming', 'ai', 'development', 'productivity'],
    rating: 4.8,
    reviews: 1247,
    downloads: 8900,
    size: '32.1 MB',
    version: '1.0.0',
    developer: 'AuraOS Team',
    price: 0,
    isFree: true,
    isPremium: false,
    isNew: true,
    isPopular: true,
    isFeatured: true,
    screenshots: [
      '/screenshots/code-assistant-1.png',
      '/screenshots/code-assistant-2.png',
      '/screenshots/code-assistant-3.png',
    ],
    features: [
      'AI-powered code completion',
      'Real-time error detection',
      'Multi-language support',
      'Intelligent refactoring',
      'Code documentation generation',
    ],
    requirements: ['AuraOS 2.0+', '4GB RAM minimum', '500MB storage'],
    lastUpdated: new Date(),
    permissions: ['File system access', 'Network access'],
    isInstalled: false,
    isFavorite: false,
  },
  {
    id: 'ai-image-editor',
    name: 'AI Image Editor',
    description: 'Advanced image editing with AI enhancement',
    longDescription:
      'Professional-grade image editing tool powered by AI. Transform your photos with intelligent filters, automatic enhancement, and creative effects that adapt to your style.',
    icon: () => (
      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
        I
      </div>
    ),
    color: 'from-pink-500 to-rose-500',
    category: 'Creative',
    tags: ['image', 'photo', 'editing', 'ai', 'creative', 'design'],
    rating: 4.6,
    reviews: 892,
    downloads: 12300,
    size: '45.8 MB',
    version: '1.2.0',
    developer: 'AuraOS Team',
    price: 9.99,
    isFree: false,
    isPremium: true,
    isNew: true,
    isPopular: true,
    isFeatured: true,
    screenshots: [
      '/screenshots/image-editor-1.png',
      '/screenshots/image-editor-2.png',
      '/screenshots/image-editor-3.png',
    ],
    features: [
      'AI-powered photo enhancement',
      'Advanced filters and effects',
      'Batch processing',
      'RAW image support',
      'Cloud sync integration',
    ],
    requirements: ['AuraOS 2.0+', '8GB RAM recommended', '2GB storage'],
    lastUpdated: new Date(),
    permissions: ['File system access', 'Camera access'],
    isInstalled: false,
    isFavorite: false,
  },
];

const categories = [
  'All',
  'Featured',
  'Productivity',
  'Creative',
  'Development',
  'Gaming',
  'Security',
  'AI',
  'Entertainment',
  'Utilities',
];

export const AppStore: React.FC<AppStoreProps> = ({
  isOpen,
  onClose,
  onInstall,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<
    'popular' | 'newest' | 'rating' | 'price'
  >('popular');
  const [selectedApp, setSelectedApp] = useState<AppStoreApp | null>(null);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  const [apps] = useState<AppStoreApp[]>(featuredApps);

  // Filter apps based on search and category
  const filteredApps = apps.filter(app => {
    const matchesSearch =
      searchQuery === '' ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Featured' && app.isFeatured) ||
      app.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort apps
  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'newest':
        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const handleInstall = async (appId: string) => {
    setIsInstalling(appId);
    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 2000));
    onInstall(appId);
    setIsInstalling(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] glass-ultra rounded-3xl border border-white/10 shadow-premium overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">
                AuraOS App Store
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              Discover and install amazing apps
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps, developers, or categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select aria-label="Select option"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {categories.map(category => (
                <option
                  key={category}
                  value={category}
                  className="bg-slate-800"
                >
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select aria-label="Select option"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="popular" className="bg-slate-800">
                Popular
              </option>
              <option value="newest" className="bg-slate-800">
                Newest
              </option>
              <option value="rating" className="bg-slate-800">
                Rating
              </option>
              <option value="price" className="bg-slate-800">
                Price
              </option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end space-x-2 mt-4">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'list'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Apps Section */}
        {selectedCategory === 'Featured' && (
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Featured Apps
              </h2>
              <button className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredApps.map(app => {
                const Icon = app.icon;

                return (
                  <div
                    key={app.id}
                    className="group relative card-premium rounded-2xl p-6 transition-premium cursor-pointer hover:scale-105 hover:shadow-xl"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      {/* App Icon */}
                      <div
                        className={cn(
                          'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                          app.color
                        )}
                      >
                        <Icon />
                      </div>

                      {/* App Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-white text-lg">
                            {app.name}
                          </h3>
                          {app.isNew && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Zap className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {app.description}
                        </p>

                        {/* App Stats */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span>{app.rating}</span>
                            <span>({app.reviews})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{Math.floor(app.downloads / 1000)}k</span>
                          </div>
                          <span>{app.size}</span>
                        </div>

                        {/* Price and Install */}
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-white">
                            {app.isFree ? 'Free' : `$${app.price}`}
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleInstall(app.id);
                            }}
                            disabled={isInstalling === app.id}
                            className="flex items-center space-x-2 px-4 py-2 btn-premium text-white rounded-lg transition-all disabled:opacity-50"
                          >
                            {isInstalling === app.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Installing...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>Install</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Apps Grid/List */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {sortedApps.map(app => {
                const Icon = app.icon;

                return (
                  <div
                    key={app.id}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 transition-all duration-300 cursor-pointer hover:bg-white/10 hover:scale-105 hover:shadow-xl"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* App Icon */}
                    <div className="relative mb-3">
                      <div
                        className={cn(
                          'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto',
                          app.color,
                          'shadow-lg group-hover:shadow-xl transition-all'
                        )}
                      >
                        <Icon />
                      </div>

                      {/* Status Badges */}
                      <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
                        {app.isNew && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Zap className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {app.isFeatured && (
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Crown className="w-2 h-2 text-white" />
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
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{app.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{Math.floor(app.downloads / 1000)}k</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-bold text-white">
                        {app.isFree ? 'Free' : `$${app.price}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedApps.map(app => {
                const Icon = app.icon;

                return (
                  <div
                    key={app.id}
                    className="group flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 cursor-pointer hover:bg-white/10 hover:shadow-lg"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* App Icon */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                        app.color
                      )}
                    >
                      <Icon />
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
                          {app.isFeatured && (
                            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Crown className="w-2 h-2 text-white" />
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

                    {/* Price and Install */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div className="text-lg font-bold text-white">
                        {app.isFree ? 'Free' : `$${app.price}`}
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleInstall(app.id);
                        }}
                        disabled={isInstalling === app.id}
                        className="flex items-center space-x-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all disabled:opacity-50"
                      >
                        {isInstalling === app.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Installing...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Install</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* App Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center',
                      selectedApp.color
                    )}
                  >
                    <select aria-label="Select option"edApp.icon />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedApp.name}
                    </h2>
                    <p className="text-gray-400">{selectedApp.developer}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Screenshots */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Screenshots
                    </h3>
                    <div className="space-y-2">
                      {selectedApp.screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center"
                        >
                          <span className="text-gray-400">
                            Screenshot {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Description
                      </h3>
                      <p className="text-gray-400">
                        {selectedApp.longDescription}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Features
                      </h3>
                      <ul className="space-y-1">
                        {selectedApp.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-gray-400"
                          >
                            <Check className="w-4 h-4 text-green-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Requirements
                      </h3>
                      <ul className="space-y-1">
                        {selectedApp.requirements.map((requirement, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-gray-400"
                          >
                            <Info className="w-4 h-4 text-blue-400" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Permissions
                      </h3>
                      <ul className="space-y-1">
                        {selectedApp.permissions.map((permission, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-gray-400"
                          >
                            <Shield className="w-4 h-4 text-yellow-400" />
                            <span>{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-white">
                      {selectedApp.isFree ? 'Free' : `$${selectedApp.price}`}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{selectedApp.rating}</span>
                      <span className="text-gray-400">
                        ({selectedApp.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all">
                      <Heart className="w-4 h-4" />
                      <span>Favorite</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all">
                      <Share className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => handleInstall(selectedApp.id)}
                      disabled={isInstalling === selectedApp.id}
                      className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      {isInstalling === selectedApp.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Installing...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Install</span>
                        </>
                      )}
                    </button>
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
