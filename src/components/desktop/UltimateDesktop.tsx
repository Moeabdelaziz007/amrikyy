/**
 * 🚀 Ultimate AI-Powered Desktop Theme System
 * Advanced UI/UX that surpasses iOS and Windows with neural interfaces
 * Features: Liquid Glass, Holographic UI, Quantum Desktop, Neural Networks
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  Zap,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Network,
  Shield,
  Activity,
  BarChart3,
  Settings,
  Palette,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Star,
  Heart,
  Target,
  Rocket,
  Globe,
  Factory,
  TestTube,
  Accessibility,
  Server,
  HardDrive,
  Wifi,
  Battery,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Cloud,
  GitBranch,
  Code,
  Terminal,
  Bot,
  MessageSquare,
  Users,
  Calendar,
  FileText,
  Image,
  Music,
  Video,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share,
  Lock,
  Unlock,
  Key,
  User,
  UserCheck,
  UserPlus,
  UserMinus,
  UserX,
  Mail,
  Phone,
  MapPin,
  Navigation,
  Compass,
  Home,
  Building,
  Car,
  Plane,
  Train,
  Ship,
  Truck,
  Bike,
  Walk,
  Run,
  Heart as HeartIcon,
  HeartHandshake,
  Handshake,
  Gift,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond,
  Coins,
  CreditCard,
  Wallet,
  PiggyBank,
  Banknote,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Minus,
  X,
  Check,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Sun,
  Moon,
  Star as StarIcon,
  Sparkles as SparklesIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Key as KeyIcon,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Navigation as NavigationIcon,
  Compass as CompassIcon,
  Home as HomeIcon,
  Building as BuildingIcon,
  Car as CarIcon,
  Plane as PlaneIcon,
  Train as TrainIcon,
  Ship as ShipIcon,
  Truck as TruckIcon,
  Bike as BikeIcon,
  Walk as WalkIcon,
  Run as RunIcon,
  Heart as HeartIcon2,
  HeartHandshake as HeartHandshakeIcon,
  Handshake as HandshakeIcon,
  Gift as GiftIcon,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  Crown as CrownIcon,
  Gem as GemIcon,
  Diamond as DiamondIcon,
  Coins as CoinsIcon,
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon,
  PiggyBank as PiggyBankIcon,
  Banknote as BanknoteIcon,
  DollarSign as DollarSignIcon,
  Euro as EuroIcon,
  PoundSterling as PoundSterlingIcon,
  Yen as YenIcon,
  Bitcoin as BitcoinIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowUpRight as ArrowUpRightIcon,
  ArrowDownRight as ArrowDownRightIcon,
  ArrowUpLeft as ArrowUpLeftIcon,
  ArrowDownLeft as ArrowDownLeftIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronsUp as ChevronsUpIcon,
  ChevronsDown as ChevronsDownIcon,
  ChevronsLeft as ChevronsLeftIcon,
  ChevronsRight as ChevronsRightIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  Check as CheckIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  Triangle as TriangleIcon,
  Hexagon as HexagonIcon,
  Octagon as OctagonIcon,
  Pentagon as PentagonIcon
} from 'lucide-react';

interface UltimateTheme {
  id: string;
  name: string;
  type: 'liquid-glass' | 'holographic' | 'quantum' | 'neural' | 'cyberpunk' | 'neon' | 'ai-powered';
  description: string;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  effects: {
    glassmorphism: boolean;
    holographic: boolean;
    neural: boolean;
    quantum: boolean;
    liquid: boolean;
    neon: boolean;
    cyberpunk: boolean;
  };
  animations: {
    type: 'float' | 'pulse' | 'rotate' | 'glow' | 'bounce' | 'neural' | 'quantum' | 'holographic';
    intensity: 'low' | 'medium' | 'high' | 'extreme';
    speed: 'slow' | 'normal' | 'fast' | 'ultra';
  };
  wallpaper: {
    type: 'ai-generated' | 'neural-network' | 'quantum-field' | 'holographic' | 'liquid-glass' | 'cyberpunk';
    animation: boolean;
    interactivity: boolean;
    aiAdaptive: boolean;
  };
  premium: boolean;
  aiPowered: boolean;
}

interface UltimateDesktopProps {
  onClose: () => void;
}

const UltimateDesktop: React.FC<UltimateDesktopProps> = ({ onClose }) => {
  const [activeTheme, setActiveTheme] = useState<UltimateTheme | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAIMode, setIsAIMode] = useState(true);
  const [neuralIntensity, setNeuralIntensity] = useState<'low' | 'medium' | 'high' | 'extreme'>('high');
  const [quantumEffects, setQuantumEffects] = useState(true);
  const [holographicMode, setHolographicMode] = useState(true);
  const [liquidGlassMode, setLiquidGlassMode] = useState(true);

  const ultimateThemes: UltimateTheme[] = [
    {
      id: 'liquid-glass-pro',
      name: 'Liquid Glass Pro',
      type: 'liquid-glass',
      description: 'Apple\'s Liquid Glass interface enhanced with AI-powered reflections and depth',
      features: [
        'AI-powered reflections',
        'Dynamic depth perception',
        'Liquid morphing animations',
        'Neural network integration',
        'Quantum field effects',
        'Holographic overlays'
      ],
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        accent: '#FF2D92',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,40,0.95))',
        surface: 'rgba(255,255,255,0.1)',
        text: '#FFFFFF'
      },
      effects: {
        glassmorphism: true,
        holographic: true,
        neural: true,
        quantum: true,
        liquid: true,
        neon: false,
        cyberpunk: false
      },
      animations: {
        type: 'liquid',
        intensity: 'high',
        speed: 'normal'
      },
      wallpaper: {
        type: 'liquid-glass',
        animation: true,
        interactivity: true,
        aiAdaptive: true
      },
      premium: true,
      aiPowered: true
    },
    {
      id: 'neural-network-ui',
      name: 'Neural Network UI',
      type: 'neural',
      description: 'AI-powered interface with neural network visualizations and brain-inspired design',
      features: [
        'Neural network visualizations',
        'Brain-inspired animations',
        'AI consciousness indicators',
        'Quantum computing themes',
        'Holographic data streams',
        'Neural pathway animations'
      ],
      colors: {
        primary: '#00FF88',
        secondary: '#FF0080',
        accent: '#8000FF',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,20,40,0.98))',
        surface: 'rgba(0,255,136,0.1)',
        text: '#00FF88'
      },
      effects: {
        glassmorphism: true,
        holographic: true,
        neural: true,
        quantum: true,
        liquid: false,
        neon: true,
        cyberpunk: false
      },
      animations: {
        type: 'neural',
        intensity: 'extreme',
        speed: 'fast'
      },
      wallpaper: {
        type: 'neural-network',
        animation: true,
        interactivity: true,
        aiAdaptive: true
      },
      premium: true,
      aiPowered: true
    },
    {
      id: 'quantum-desktop',
      name: 'Quantum Desktop',
      type: 'quantum',
      description: 'Quantum computing-inspired interface with particle effects and quantum field visualizations',
      features: [
        'Quantum particle effects',
        'Quantum field visualizations',
        'Quantum entanglement animations',
        'Quantum tunneling effects',
        'Quantum superposition states',
        'Quantum computing themes'
      ],
      colors: {
        primary: '#00FFFF',
        secondary: '#FF00FF',
        accent: '#FFFF00',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.98), rgba(0,40,80,0.99))',
        surface: 'rgba(0,255,255,0.1)',
        text: '#00FFFF'
      },
      effects: {
        glassmorphism: true,
        holographic: true,
        neural: true,
        quantum: true,
        liquid: false,
        neon: true,
        cyberpunk: false
      },
      animations: {
        type: 'quantum',
        intensity: 'extreme',
        speed: 'ultra'
      },
      wallpaper: {
        type: 'quantum-field',
        animation: true,
        interactivity: true,
        aiAdaptive: true
      },
      premium: true,
      aiPowered: true
    },
    {
      id: 'holographic-pro',
      name: 'Holographic Pro',
      type: 'holographic',
      description: 'Advanced holographic interface with 3D projections and depth illusions',
      features: [
        '3D holographic projections',
        'Depth illusion effects',
        'Holographic data streams',
        '3D floating elements',
        'Holographic reflections',
        'Depth perception enhancement'
      ],
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#45B7D1',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(40,20,60,0.95))',
        surface: 'rgba(255,107,107,0.1)',
        text: '#FF6B6B'
      },
      effects: {
        glassmorphism: true,
        holographic: true,
        neural: false,
        quantum: false,
        liquid: false,
        neon: false,
        cyberpunk: false
      },
      animations: {
        type: 'holographic',
        intensity: 'high',
        speed: 'normal'
      },
      wallpaper: {
        type: 'holographic',
        animation: true,
        interactivity: true,
        aiAdaptive: false
      },
      premium: true,
      aiPowered: false
    },
    {
      id: 'cyberpunk-neon',
      name: 'Cyberpunk Neon',
      type: 'cyberpunk',
      description: 'Futuristic cyberpunk interface with neon lights and dystopian aesthetics',
      features: [
        'Neon light effects',
        'Cyberpunk aesthetics',
        'Dystopian themes',
        'Neon grid patterns',
        'Cyberpunk typography',
        'Neon glow effects'
      ],
      colors: {
        primary: '#00FF00',
        secondary: '#FF0080',
        accent: '#00FFFF',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,40,0,0.98))',
        surface: 'rgba(0,255,0,0.1)',
        text: '#00FF00'
      },
      effects: {
        glassmorphism: false,
        holographic: false,
        neural: false,
        quantum: false,
        liquid: false,
        neon: true,
        cyberpunk: true
      },
      animations: {
        type: 'neon',
        intensity: 'high',
        speed: 'fast'
      },
      wallpaper: {
        type: 'cyberpunk',
        animation: true,
        interactivity: true,
        aiAdaptive: false
      },
      premium: false,
      aiPowered: false
    },
    {
      id: 'ai-consciousness',
      name: 'AI Consciousness',
      type: 'ai-powered',
      description: 'AI-powered interface that adapts and evolves based on user behavior and preferences',
      features: [
        'AI behavior adaptation',
        'Consciousness indicators',
        'Learning animations',
        'Adaptive color schemes',
        'AI personality traits',
        'Evolutionary design'
      ],
      colors: {
        primary: '#FF9500',
        secondary: '#FF2D92',
        accent: '#007AFF',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(40,20,0,0.95))',
        surface: 'rgba(255,149,0,0.1)',
        text: '#FF9500'
      },
      effects: {
        glassmorphism: true,
        holographic: true,
        neural: true,
        quantum: true,
        liquid: true,
        neon: false,
        cyberpunk: false
      },
      animations: {
        type: 'neural',
        intensity: 'medium',
        speed: 'normal'
      },
      wallpaper: {
        type: 'ai-generated',
        animation: true,
        interactivity: true,
        aiAdaptive: true
      },
      premium: true,
      aiPowered: true
    }
  ];

  const applyTheme = useCallback((theme: UltimateTheme) => {
    setActiveTheme(theme);
    
    // Apply theme to document
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    
    // Apply theme class
    root.className = `ultimate-theme ${theme.type}-theme`;
    
    // Apply wallpaper
    applyWallpaper(theme.wallpaper);
    
    console.log(`Applied theme: ${theme.name}`);
  }, []);

  const applyWallpaper = useCallback((wallpaper: UltimateTheme['wallpaper']) => {
    const body = document.body;
    body.className = `wallpaper-${wallpaper.type} ${wallpaper.animation ? 'animated' : ''} ${wallpaper.interactivity ? 'interactive' : ''} ${wallpaper.aiAdaptive ? 'ai-adaptive' : ''}`;
  }, []);

  const getThemeIcon = (type: string) => {
    switch (type) {
      case 'liquid-glass': return <Layers className="w-6 h-6" />;
      case 'neural': return <Brain className="w-6 h-6" />;
      case 'quantum': return <Zap className="w-6 h-6" />;
      case 'holographic': return <Sparkles className="w-6 h-6" />;
      case 'cyberpunk': return <Target className="w-6 h-6" />;
      case 'ai-powered': return <Cpu className="w-6 h-6" />;
      default: return <Palette className="w-6 h-6" />;
    }
  };

  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case 'glassmorphism': return <Layers className="w-4 h-4" />;
      case 'holographic': return <Sparkles className="w-4 h-4" />;
      case 'neural': return <Brain className="w-4 h-4" />;
      case 'quantum': return <Zap className="w-4 h-4" />;
      case 'liquid': return <Activity className="w-4 h-4" />;
      case 'neon': return <Star className="w-4 h-4" />;
      case 'cyberpunk': return <Target className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="ultimate-desktop glass-premium">
      {/* Header */}
      <div className="desktop-header flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white gradient-text">Ultimate AI Desktop</h2>
            <p className="text-sm text-gray-400">Beyond iOS & Windows - AI-Powered Interface</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`p-2 rounded-full transition-colors ${
              isPreviewMode ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            title={isPreviewMode ? 'Exit Preview Mode' : 'Enter Preview Mode'}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAIMode(!isAIMode)}
            className={`p-2 rounded-full transition-colors ${
              isAIMode ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            title={isAIMode ? 'Disable AI Mode' : 'Enable AI Mode'}
          >
            <Brain className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
            title="Close Ultimate Desktop"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Controls */}
      {isAIMode && (
        <div className="ai-controls p-4 bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">Neural Intensity:</span>
                <select
                  value={neuralIntensity}
                  onChange={(e) => setNeuralIntensity(e.target.value as any)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={quantumEffects}
                    onChange={(e) => setQuantumEffects(e.target.checked)}
                    className="rounded"
                  />
                  Quantum Effects
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={holographicMode}
                    onChange={(e) => setHolographicMode(e.target.checked)}
                    className="rounded"
                  />
                  Holographic Mode
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={liquidGlassMode}
                    onChange={(e) => setLiquidGlassMode(e.target.checked)}
                    className="rounded"
                  />
                  Liquid Glass
                </label>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              AI Mode: <span className="text-green-400 font-medium">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Theme Grid */}
      <div className="themes-container p-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ultimateThemes.map(theme => (
            <div
              key={theme.id}
              className={`theme-card bg-white/5 glass-premium border border-white/10 hover:border-white/20 transition-all duration-500 rounded-2xl p-6 group cursor-pointer ${
                activeTheme?.id === theme.id ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
              onClick={() => applyTheme(theme)}
            >
              {/* Theme Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                    theme.type === 'liquid-glass' ? 'from-blue-500 to-cyan-500' :
                    theme.type === 'neural' ? 'from-green-500 to-emerald-500' :
                    theme.type === 'quantum' ? 'from-purple-500 to-pink-500' :
                    theme.type === 'holographic' ? 'from-orange-500 to-red-500' :
                    theme.type === 'cyberpunk' ? 'from-green-400 to-blue-500' :
                    'from-yellow-500 to-orange-500'
                  } flex items-center justify-center shadow-lg`}>
                    {getThemeIcon(theme.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{theme.name}</h3>
                    <p className="text-sm text-gray-400">{theme.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {theme.premium && <Star className="w-4 h-4 text-yellow-400" />}
                  {theme.aiPowered && <Brain className="w-4 h-4 text-blue-400" />}
                </div>
              </div>

              {/* Theme Description */}
              <p className="text-gray-300 text-sm mb-4">{theme.description}</p>

              {/* Theme Features */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-white">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {theme.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                  {theme.features.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                      +{theme.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Theme Effects */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-white">Effects:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(theme.effects).map(([effect, enabled]) => (
                    enabled && (
                      <div
                        key={effect}
                        className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-xs text-gray-300"
                      >
                        {getEffectIcon(effect)}
                        {effect}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Theme Colors Preview */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-white">Colors:</h4>
                <div className="flex gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  ></div>
                  <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  ></div>
                  <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  ></div>
                </div>
              </div>

              {/* Animation Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Animation:</h4>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Type: {theme.animations.type}</span>
                  <span>Intensity: {theme.animations.intensity}</span>
                  <span>Speed: {theme.animations.speed}</span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                className={`w-full mt-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTheme?.id === theme.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {activeTheme?.id === theme.id ? 'Applied' : 'Apply Theme'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Mode */}
      {isPreviewMode && activeTheme && (
        <div className="preview-overlay fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="preview-container bg-white/10 glass-premium border border-white/20 rounded-2xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Theme Preview</h3>
              <button
                onClick={() => setIsPreviewMode(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="preview-content space-y-4">
              <div className="preview-header p-4 rounded-lg" style={{ background: activeTheme.colors.surface }}>
                <h4 className="text-white font-medium">Preview Header</h4>
                <p className="text-gray-300 text-sm">This is how the theme will look</p>
              </div>
              
              <div className="preview-buttons flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: activeTheme.colors.primary }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: activeTheme.colors.secondary }}
                >
                  Secondary Button
                </button>
              </div>
              
              <div className="preview-cards grid grid-cols-2 gap-4">
                <div className="preview-card p-3 rounded-lg" style={{ background: activeTheme.colors.surface }}>
                  <div className="w-8 h-8 rounded-lg mb-2" style={{ backgroundColor: activeTheme.colors.accent }}></div>
                  <h5 className="text-white text-sm font-medium">Card 1</h5>
                </div>
                <div className="preview-card p-3 rounded-lg" style={{ background: activeTheme.colors.surface }}>
                  <div className="w-8 h-8 rounded-lg mb-2" style={{ backgroundColor: activeTheme.colors.primary }}></div>
                  <h5 className="text-white text-sm font-medium">Card 2</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UltimateDesktop;
