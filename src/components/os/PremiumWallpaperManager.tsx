import {
  Palette,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  Mountain,
  Waves,
  Zap,
  Heart,
  Star,
  Crown,
  Gem,
  Flame,
  Snowflake,
  Leaf,
  Droplets,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'nature' | 'abstract' | 'space' | 'cyber' | 'minimal' | 'premium';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  gradient: string;
  particles?: boolean;
  animation?: string;
  premium?: boolean;
}

const premiumThemes: Theme[] = [
  // Premium Nature Themes
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Mesmerizing northern lights with cosmic colors',
    icon: Sparkles,
    category: 'nature',
    colors: {
      primary: '#00f5ff',
      secondary: '#ff00ff',
      accent: '#00ff88',
      background: '#0a0a0f',
      surface: '#1a1a2e',
    },
    gradient:
      'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
    particles: true,
    animation: 'aurora',
    premium: true,
  },
  {
    id: 'cosmic-ocean',
    name: 'Cosmic Ocean',
    description: 'Deep space meets ocean depths',
    icon: Waves,
    category: 'space',
    colors: {
      primary: '#00d4ff',
      secondary: '#0099cc',
      accent: '#ff6b6b',
      background: '#0c0c0c',
      surface: '#1a1a2e',
    },
    gradient:
      'radial-gradient(ellipse at center, #0c0c0c 0%, #1a1a2e 35%, #16213e 70%, #0f3460 100%)',
    particles: true,
    animation: 'cosmic',
    premium: true,
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Futuristic cityscape with neon lights',
    icon: Zap,
    category: 'cyber',
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      accent: '#00d4ff',
      background: '#0a0a0a',
      surface: '#1a1a1a',
    },
    gradient:
      'linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #0a0a0a 100%)',
    particles: true,
    animation: 'cyberpunk',
    premium: true,
  },
  {
    id: 'galaxy-spiral',
    name: 'Galaxy Spiral',
    description: 'Spiral galaxy with cosmic dust and stars',
    icon: Star,
    category: 'space',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      background: '#000000',
      surface: '#1a1a2e',
    },
    gradient:
      'radial-gradient(ellipse at center, #000000 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
    particles: true,
    animation: 'galaxy',
    premium: true,
  },
  {
    id: 'mountain-sunset',
    name: 'Mountain Sunset',
    description: 'Majestic mountains with golden hour lighting',
    icon: Mountain,
    category: 'nature',
    colors: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#ffd23f',
      background: '#1a1a2e',
      surface: '#16213e',
    },
    gradient:
      'linear-gradient(180deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
    particles: false,
    animation: 'sunset',
    premium: true,
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Deep ocean with bioluminescent creatures',
    icon: Droplets,
    category: 'nature',
    colors: {
      primary: '#00d4ff',
      secondary: '#0099cc',
      accent: '#00ff88',
      background: '#0a0a0f',
      surface: '#1a1a2e',
    },
    gradient:
      'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0099cc 100%)',
    particles: true,
    animation: 'ocean',
    premium: true,
  },
  {
    id: 'fire-kingdom',
    name: 'Fire Kingdom',
    description: 'Volcanic landscape with molten lava flows',
    icon: Flame,
    category: 'nature',
    colors: {
      primary: '#ff4500',
      secondary: '#ff6347',
      accent: '#ffd700',
      background: '#1a0a0a',
      surface: '#2a1a1a',
    },
    gradient:
      'radial-gradient(ellipse at center, #1a0a0a 0%, #2a1a1a 25%, #3a2a2a 50%, #4a3a3a 75%, #5a4a4a 100%)',
    particles: true,
    animation: 'fire',
    premium: true,
  },
  {
    id: 'ice-crystal',
    name: 'Ice Crystal',
    description: 'Frozen crystal cave with ethereal beauty',
    icon: Snowflake,
    category: 'nature',
    colors: {
      primary: '#00d4ff',
      secondary: '#87ceeb',
      accent: '#ffffff',
      background: '#0a0a1a',
      surface: '#1a1a2e',
    },
    gradient:
      'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 25%, #2a2a3e 50%, #3a3a4e 75%, #4a4a5e 100%)',
    particles: true,
    animation: 'ice',
    premium: true,
  },
  {
    id: 'forest-magic',
    name: 'Forest Magic',
    description: 'Enchanted forest with mystical atmosphere',
    icon: Leaf,
    category: 'nature',
    colors: {
      primary: '#00ff88',
      secondary: '#32cd32',
      accent: '#ffd700',
      background: '#0a1a0a',
      surface: '#1a2a1a',
    },
    gradient:
      'radial-gradient(ellipse at center, #0a1a0a 0%, #1a2a1a 25%, #2a3a2a 50%, #3a4a3a 75%, #4a5a4a 100%)',
    particles: true,
    animation: 'forest',
    premium: true,
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Luxurious purple theme with gold accents',
    icon: Crown,
    category: 'premium',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      accent: '#fbbf24',
      background: '#1a0a2e',
      surface: '#2a1a3e',
    },
    gradient:
      'linear-gradient(135deg, #1a0a2e 0%, #2a1a3e 25%, #3a2a4e 50%, #4a3a5e 75%, #5a4a6e 100%)',
    particles: true,
    animation: 'royal',
    premium: true,
  },
  {
    id: 'diamond-luxury',
    name: 'Diamond Luxury',
    description: 'Premium diamond theme with crystal effects',
    icon: Gem,
    category: 'premium',
    colors: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      accent: '#fbbf24',
      background: '#0a0a0a',
      surface: '#1a1a1a',
    },
    gradient:
      'radial-gradient(ellipse at center, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #3a3a3a 75%, #4a4a4a 100%)',
    particles: true,
    animation: 'diamond',
    premium: true,
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Clean minimal design with subtle gradients',
    icon: Moon,
    category: 'minimal',
    colors: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      accent: '#3b82f6',
      background: '#0a0a0a',
      surface: '#1a1a1a',
    },
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
    particles: false,
    animation: 'minimal',
    premium: false,
  },
];

interface PremiumWallpaperManagerProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export const PremiumWallpaperManager: React.FC<
  PremiumWallpaperManagerProps
> = ({ currentTheme, onThemeChange }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    premiumThemes.find(t => t.id === currentTheme) || premiumThemes[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const categories = [
    { id: 'all', name: 'All Themes', icon: Palette },
    { id: 'nature', name: 'Nature', icon: Leaf },
    { id: 'space', name: 'Space', icon: Star },
    { id: 'cyber', name: 'Cyber', icon: Zap },
    { id: 'premium', name: 'Premium', icon: Crown },
    { id: 'minimal', name: 'Minimal', icon: Moon },
  ];

  const filteredThemes = premiumThemes.filter(theme => {
    const matchesCategory =
      selectedCategory === 'all' || theme.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || theme.premium;
    return matchesCategory && matchesPremium;
  });

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    onThemeChange(theme.id);
  };

  // Apply theme to document
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', selectedTheme.colors.primary);
    root.style.setProperty('--theme-secondary', selectedTheme.colors.secondary);
    root.style.setProperty('--theme-accent', selectedTheme.colors.accent);
    root.style.setProperty(
      '--theme-background',
      selectedTheme.colors.background
    );
    root.style.setProperty('--theme-surface', selectedTheme.colors.surface);
  }, [selectedTheme]);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: selectedTheme.gradient,
        }}
      />

      {/* Animated Overlay */}
      {selectedTheme.particles && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Aurora Effect */}
          {selectedTheme.animation === 'aurora' && (
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-pulse delay-1000" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse delay-2000" />
            </div>
          )}

          {/* Cosmic Effect */}
          {selectedTheme.animation === 'cosmic' && (
            <div className="absolute inset-0 opacity-20">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Cyberpunk Effect */}
          {selectedTheme.animation === 'cyberpunk' && (
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-400/30 to-transparent animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-pulse delay-500" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse delay-1000" />
            </div>
          )}

          {/* Galaxy Effect */}
          {selectedTheme.animation === 'galaxy' && (
            <div className="absolute inset-0 opacity-15">
              <div
                className="absolute inset-0 bg-gradient-radial from-transparent via-white/10 to-transparent animate-spin"
                style={{ animationDuration: '20s' }}
              />
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Ocean Effect */}
          {selectedTheme.animation === 'ocean' && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-400/20 to-transparent animate-pulse" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-400/20 to-transparent animate-pulse delay-1000" />
            </div>
          )}

          {/* Fire Effect */}
          {selectedTheme.animation === 'fire' && (
            <div className="absolute inset-0 opacity-25">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-500/30 to-transparent animate-pulse" />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-orange-500/30 to-transparent animate-pulse delay-500" />
            </div>
          )}

          {/* Ice Effect */}
          {selectedTheme.animation === 'ice' && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/10 to-transparent animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/10 to-transparent animate-pulse delay-1000" />
            </div>
          )}

          {/* Forest Effect */}
          {selectedTheme.animation === 'forest' && (
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-400/20 to-transparent animate-pulse" />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-600/20 to-transparent animate-pulse delay-1000" />
            </div>
          )}

          {/* Royal Effect */}
          {selectedTheme.animation === 'royal' && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse delay-1000" />
            </div>
          )}

          {/* Diamond Effect */}
          {selectedTheme.animation === 'diamond' && (
            <div className="absolute inset-0 opacity-15">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/10 to-transparent animate-pulse delay-500" />
            </div>
          )}
        </div>
      )}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-grid-pattern" />
      </div>

      {/* Scan Line Effect */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />
    </div>
  );
};

// Theme Selector Component
export const ThemeSelector: React.FC<{
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ currentTheme, onThemeChange, isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', name: 'All Themes', icon: Palette },
    { id: 'nature', name: 'Nature', icon: Leaf },
    { id: 'space', name: 'Space', icon: Star },
    { id: 'cyber', name: 'Cyber', icon: Zap },
    { id: 'premium', name: 'Premium', icon: Crown },
    { id: 'minimal', name: 'Minimal', icon: Moon },
  ];

  const filteredThemes = premiumThemes.filter(theme => {
    const matchesCategory =
      selectedCategory === 'all' || theme.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || theme.premium;
    return matchesCategory && matchesPremium;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[80vh] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <Palette className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Premium Themes</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
          >
            ×
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedCategory === category.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={e => setShowPremiumOnly(e.target.checked)}
                className="rounded border-gray-600 bg-white/10 text-purple-500 focus:ring-purple-500"
              />
              <span>Premium Only</span>
            </label>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredThemes.map(theme => {
              const Icon = theme.icon;
              const isSelected = currentTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={cn(
                    'group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 cursor-pointer',
                    'hover:bg-white/10 hover:scale-105 hover:shadow-xl',
                    isSelected && 'ring-2 ring-purple-500 bg-purple-500/10'
                  )}
                >
                  {/* Premium Badge */}
                  {theme.premium && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    </div>
                  )}

                  {/* Theme Preview */}
                  <div
                    className="w-full h-32 rounded-xl mb-4 relative overflow-hidden"
                    style={{ background: theme.gradient }}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white/80" />
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {theme.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {theme.description}
                    </p>

                    {/* Color Palette */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>

                    {/* Features */}
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                      {theme.particles && (
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Particles</span>
                        </div>
                      )}
                      {theme.animation && (
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>Animated</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 left-4">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
