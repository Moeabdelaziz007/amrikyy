/**
 * 🧠 Smart Desktop Organizer
 * Intelligent desktop layout with automation hub
 */

import {
  Brain,
  Cpu,
  Database,
  Network,
  Shield,
  Zap,
  Settings,
  Search,
  Bell,
  Activity,
  BarChart3,
  Workflow,
  Layers,
  Cog,
  Star,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  XCircle,
  Eye,
  EyeOff,
  Filter,
  Grid,
  List,
  Layout,
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
  Download,
  Upload,
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
  Heart,
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
  Bitcoin,
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
  Star as StarIcon,
  Heart as HeartIcon,
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

interface SmartDesktopProps {
  onClose: () => void;
}

interface AppCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  apps: DesktopApp[];
}

interface DesktopApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  isInstalled: boolean;
  isRunning: boolean;
  priority: 'high' | 'medium' | 'low';
  lastUsed: Date;
  usageCount: number;
  gradient?: string;
  glowColor?: string;
  animationType?: 'float' | 'pulse' | 'rotate' | 'glow' | 'bounce';
  premium?: boolean;
  featured?: boolean;
}

const SmartDesktop: React.FC<SmartDesktopProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string>('automation');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    cpu: 35,
    memory: 60,
    disk: 45,
    network: 12,
    temperature: 42,
    battery: 85,
    uptime: '2d 14h 32m'
  });

  const appCategories: AppCategory[] = [
    {
      id: 'automation',
      name: 'Automation Hub',
      icon: <Brain className="w-6 h-6" />,
      color: 'purple',
      apps: [
        {
          id: 'advanced-automation',
          name: 'AI Automation Hub',
          icon: <Brain className="w-8 h-8" />,
          description: 'Latest MCP Tools & AI-Powered Automation',
          category: 'automation',
          isInstalled: true,
          isRunning: false,
          priority: 'high',
          lastUsed: new Date(),
          usageCount: 45,
          gradient: 'from-purple-500 via-pink-500 to-red-500',
          glowColor: 'purple-500',
          animationType: 'pulse',
          featured: true,
          premium: true,
        },
        {
          id: 'workflow-builder',
          name: 'Workflow Builder',
          icon: <Workflow className="w-8 h-8" />,
          description: 'Visual workflow creation and management',
          category: 'automation',
          isInstalled: true,
          isRunning: false,
          priority: 'high',
          lastUsed: new Date(Date.now() - 3600000),
          usageCount: 23,
          gradient: 'from-blue-500 to-cyan-500',
          glowColor: 'blue-500',
          animationType: 'float',
          premium: true,
        },
        {
          id: 'process-mining',
          name: 'Process Mining',
          icon: <Layers className="w-8 h-8" />,
          description: 'AI-powered process discovery and optimization',
          category: 'automation',
          isInstalled: true,
          isRunning: false,
          priority: 'medium',
          lastUsed: new Date(Date.now() - 7200000),
          usageCount: 12,
          gradient: 'from-green-500 to-emerald-500',
          glowColor: 'green-500',
          animationType: 'glow',
        }
      ]
    },
    {
      id: 'monitoring',
      name: 'System Monitoring',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'blue',
      apps: [
        {
          id: 'performance-dashboard',
          name: 'Performance Dashboard',
          icon: <Activity className="w-8 h-8" />,
          description: 'Real-time system performance monitoring',
          category: 'monitoring',
          isInstalled: true,
          isRunning: true,
          priority: 'high',
          lastUsed: new Date(),
          usageCount: 67,
          gradient: 'from-blue-500 to-indigo-500',
          glowColor: 'blue-500',
          animationType: 'pulse',
          featured: true,
        },
        {
          id: 'health-monitor',
          name: 'Health Monitor',
          icon: <Shield className="w-8 h-8" />,
          description: 'System health and security monitoring',
          category: 'monitoring',
          isInstalled: true,
          isRunning: false,
          priority: 'high',
          lastUsed: new Date(Date.now() - 1800000),
          usageCount: 34,
          gradient: 'from-red-500 to-pink-500',
          glowColor: 'red-500',
          animationType: 'bounce',
        }
      ]
    },
    {
      id: 'development',
      name: 'Development Tools',
      icon: <Code className="w-6 h-6" />,
      color: 'green',
      apps: [
        {
          id: 'mcp-test-runner',
          name: 'MCP Test Runner',
          icon: <TestTube className="w-8 h-8" />,
          description: 'Comprehensive MCP server testing suite',
          category: 'development',
          isInstalled: true,
          isRunning: false,
          priority: 'medium',
          lastUsed: new Date(Date.now() - 10800000),
          usageCount: 8,
          gradient: 'from-green-500 to-teal-500',
          glowColor: 'green-500',
          animationType: 'rotate',
        },
        {
          id: 'code-editor',
          name: 'Code Editor',
          icon: <Terminal className="w-8 h-8" />,
          description: 'Advanced code editing and development',
          category: 'development',
          isInstalled: true,
          isRunning: false,
          priority: 'medium',
          lastUsed: new Date(Date.now() - 14400000),
          usageCount: 15,
          gradient: 'from-gray-500 to-slate-500',
          glowColor: 'gray-500',
          animationType: 'float',
        }
      ]
    },
    {
      id: 'communication',
      name: 'Communication',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'orange',
      apps: [
        {
          id: 'telegram-control',
          name: 'Telegram Control',
          icon: <MessageSquare className="w-8 h-8" />,
          description: 'Telegram bot integration and control',
          category: 'communication',
          isInstalled: true,
          isRunning: false,
          priority: 'medium',
          lastUsed: new Date(Date.now() - 21600000),
          usageCount: 28,
          gradient: 'from-orange-500 to-yellow-500',
          glowColor: 'orange-500',
          animationType: 'pulse',
        }
      ]
    }
  ];

  const filteredApps = appCategories
    .find(cat => cat.id === activeCategory)
    ?.apps.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const getCategoryColor = (color: string) => {
    const colors = {
      purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      orange: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-400 bg-red-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      low: 'text-green-400 bg-green-500/20'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div className="smart-desktop glass-premium">
      {/* Header */}
      <div className="desktop-header flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white gradient-text">Smart Desktop</h2>
            <p className="text-sm text-gray-400">Intelligent automation hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white relative"
          >
            <Bell className="w-4 h-4" />
            {showNotifications && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* System Health Bar */}
      <div className="health-bar p-4 bg-white/5 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="health-item">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">CPU</span>
              <span className="text-white text-sm font-medium">{systemHealth.cpu}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.cpu}%` }}></div>
            </div>
          </div>
          <div className="health-item">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">Memory</span>
              <span className="text-white text-sm font-medium">{systemHealth.memory}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.memory}%` }}></div>
            </div>
          </div>
          <div className="health-item">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">Disk</span>
              <span className="text-white text-sm font-medium">{systemHealth.disk}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.disk}%` }}></div>
            </div>
          </div>
          <div className="health-item">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">Network</span>
              <span className="text-white text-sm font-medium">{systemHealth.network}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.network}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="controls-bar p-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'compact' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Layout className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Uptime: {systemHealth.uptime}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="category-nav p-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          {appCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${getCategoryColor(category.color)} text-white`
                  : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
              }`}
            >
              {category.icon}
              <span className="font-medium">{category.name}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {category.apps.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="apps-container p-6 overflow-y-auto max-h-[60vh]">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="app-card bg-white/5 glass-premium border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-4 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient || 'from-gray-500 to-slate-600'} flex items-center justify-center shadow-lg`}>
                      <div className="text-white">{app.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{app.name}</h3>
                      <p className="text-xs text-gray-400">{app.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {app.premium && <Star className="w-4 h-4 text-yellow-400" />}
                    {app.featured && <Sparkles className="w-4 h-4 text-purple-400" />}
                    {app.isRunning && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(app.priority)}`}>
                    {app.priority}
                  </span>
                  <span>Used {app.usageCount} times</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-2">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="app-list-item bg-white/5 glass-premium border border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg p-3 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.gradient || 'from-gray-500 to-slate-600'} flex items-center justify-center shadow-lg`}>
                      <div className="text-white">{app.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{app.name}</h3>
                      <p className="text-xs text-gray-400">{app.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(app.priority)}`}>
                      {app.priority}
                    </span>
                    <span className="text-xs text-gray-400">{app.usageCount} uses</span>
                    {app.isRunning && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'compact' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="app-compact bg-white/5 glass-premium border border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg p-3 group cursor-pointer text-center"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.gradient || 'from-gray-500 to-slate-600'} flex items-center justify-center shadow-lg mx-auto mb-2`}>
                  <div className="text-white text-sm">{app.icon}</div>
                </div>
                <h3 className="text-xs font-medium text-white truncate">{app.name}</h3>
                {app.isRunning && (
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mx-auto mt-1"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartDesktop;
