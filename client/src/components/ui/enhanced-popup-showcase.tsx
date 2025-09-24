'use client';

import * as React from 'react';
import { Button } from './button';
import { 
  EnhancedToastProvider, 
  useEnhancedToastNotifications 
} from './enhanced-popup-system';
import { PopupNavigation } from './popup-navigation';
import {
  Popover,
  EnhancedPopoverTrigger,
  EnhancedPopoverContent,
  EnhancedPopoverHeader,
  EnhancedPopoverItem,
  EnhancedPopoverSeparator,
  EnhancedPopoverGroup,
} from './enhanced-popover-simple';
import {
  ContextMenu,
  EnhancedContextMenuTrigger,
  EnhancedContextMenuContent,
  EnhancedContextMenuItem,
  EnhancedContextMenuSeparator,
  EnhancedContextMenuGroup,
  EnhancedContextMenuSub,
  EnhancedContextMenuSubTrigger,
  EnhancedContextMenuSubContent,
} from './enhanced-context-menu';
import { 
  Settings, 
  User, 
  Download, 
  Share, 
  Edit, 
  Trash2, 
  Star, 
  Heart, 
  MessageSquare, 
  Bell,
  Palette,
  Zap,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Copy,
  ExternalLink,
  Bookmark,
  Flag,
  MoreHorizontal,
  Pin,
  PinOff,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Folder,
  File,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Sun,
  Moon,
  Cloud,
  Wind,
  Thermometer,
  Droplets,
  Home,
  Building,
  Building2,
  Factory,
  Warehouse,
  Store,
  Hospital,
  School,
  University,
  Library,
  Theater,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  LockKeyhole,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  Database,
  HardDrive,
  Server,
  Cpu,
  MemoryStick,
  Bluetooth,
  Usb,
  Plug,
  Power,
  PowerOff,
  BatteryCharging,
  Lightbulb,
  Lamp,
  LampDesk,
  LampFloor,
  LampCeiling,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  UserCog,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Wallet,
  Banknote,
  Coins,
  Receipt,
  Tag,
  Percent,
  Trophy,
  Medal,
  Award,
  Gift,
  Package,
  Music,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Gamepad2,
  Target,
  Clock,
  Calendar,
  Timer,
  Hourglass,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Shuffle,
  Repeat,
  Volume1,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  CameraOff,
  Image,
} from 'lucide-react';

// Demo Content Component
const DemoContent: React.FC = () => (
  <div className="space-y-4">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Enhanced Popup System</h3>
      <p className="text-muted-foreground text-sm">
        Experience the next generation of popup components with modern design and smooth animations.
      </p>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div>
          <p className="text-sm font-medium">Modern Animations</p>
          <p className="text-xs text-muted-foreground">Smooth, performant transitions</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Shield className="w-5 h-5 text-blue-500" />
        <div>
          <p className="text-sm font-medium">Accessibility First</p>
          <p className="text-xs text-muted-foreground">Full keyboard navigation support</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Zap className="w-5 h-5 text-yellow-500" />
        <div>
          <p className="text-sm font-medium">Performance Optimized</p>
          <p className="text-xs text-muted-foreground">Lightweight and fast rendering</p>
        </div>
      </div>
    </div>
  </div>
);

// Toast Demo Component
const ToastDemo: React.FC = () => {
  const { success, error, warning, info, loading, custom } = useEnhancedToastNotifications();

  const showToastDemo = (type: string) => {
    switch (type) {
      case 'success':
        success('Success!', 'Operation completed successfully', { 
          theme: 'modern',
          sound: true,
          vibration: true,
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo clicked')
          }
        });
        break;
      case 'error':
        error('Error!', 'Something went wrong', { 
          theme: 'neon',
          duration: 0,
          persistent: true 
        });
        break;
      case 'warning':
        warning('Warning!', 'Please check your input', { 
          theme: 'futuristic',
          animation: 'bounceIn' 
        });
        break;
      case 'info':
        info('Info', 'Here is some information', { 
          theme: 'glass',
          animation: 'flipIn' 
        });
        break;
      case 'loading':
        loading('Loading...', 'Please wait while we process your request');
        break;
      case 'custom':
        custom(
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium">Custom Toast</p>
              <p className="text-sm opacity-90">With custom content and styling</p>
            </div>
          </div>,
          { theme: 'glass', duration: 0 }
        );
        break;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enhanced Toast Notifications</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => showToastDemo('success')} variant="outline" size="sm">
          <CheckCircle className="w-4 h-4 mr-2" />
          Success
        </Button>
        <Button onClick={() => showToastDemo('error')} variant="destructive" size="sm">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Error
        </Button>
        <Button onClick={() => showToastDemo('warning')} variant="outline" size="sm">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Warning
        </Button>
        <Button onClick={() => showToastDemo('info')} variant="secondary" size="sm">
          <Info className="w-4 h-4 mr-2" />
          Info
        </Button>
        <Button onClick={() => showToastDemo('loading')} variant="ghost" size="sm">
          <Loader2 className="w-4 h-4 mr-2" />
          Loading
        </Button>
        <Button onClick={() => showToastDemo('custom')} variant="outline" size="sm" className="col-span-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Custom
        </Button>
      </div>
    </div>
  );
};

// Popover Demo Component
const PopoverDemo: React.FC = () => {
  const [pinnedItems, setPinnedItems] = React.useState<Set<string>>(new Set());

  const handlePin = (itemId: string) => {
    setPinnedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const menuItems = [
    { id: 'profile', icon: <User className="h-4 w-4" />, label: 'Profile', shortcut: '⌘P', description: 'View your profile' },
    { id: 'settings', icon: <Settings className="h-4 w-4" />, label: 'Settings', shortcut: '⌘,', description: 'App preferences' },
    { id: 'favorites', icon: <Heart className="h-4 w-4" />, label: 'Favorites', badge: '3', description: 'Your saved items' },
    { id: 'messages', icon: <MessageSquare className="h-4 w-4" />, label: 'Messages', badge: '12', description: 'Chat conversations' },
    { id: 'notifications', icon: <Bell className="h-4 w-4" />, label: 'Notifications', description: 'Recent updates' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enhanced Popovers</h3>
      <div className="grid grid-cols-2 gap-3">
        <Popover>
          <EnhancedPopoverTrigger variant="default" size="sm">
            Basic
          </EnhancedPopoverTrigger>
          <EnhancedPopoverContent variant="modern" size="md">
            <EnhancedPopoverHeader
              icon={<User className="h-5 w-5" />}
              title="User Menu"
              description="Manage your account and preferences"
            />
            <div className="p-2">
              <EnhancedPopoverGroup title="Account">
                {menuItems.slice(0, 3).map((item) => (
                  <EnhancedPopoverItem
                    key={item.id}
                    icon={item.icon}
                    shortcut={item.shortcut}
                    badge={item.badge}
                    description={item.description}
                    pinned={pinnedItems.has(item.id)}
                    onPin={() => handlePin(item.id)}
                  >
                    {item.label}
                  </EnhancedPopoverItem>
                ))}
              </EnhancedPopoverGroup>
            </div>
          </EnhancedPopoverContent>
        </Popover>

        <Popover>
          <EnhancedPopoverTrigger variant="ghost" size="sm">
            Glass
          </EnhancedPopoverTrigger>
          <EnhancedPopoverContent variant="glass" size="md">
            <EnhancedPopoverHeader
              icon={<Sparkles className="h-5 w-5" />}
              title="Glass Morphism"
              description="Beautiful glass effect popover"
            />
            <div className="p-2">
              <EnhancedPopoverItem icon={<Star className="h-4 w-4" />}>
                Star Item
              </EnhancedPopoverItem>
              <EnhancedPopoverItem icon={<Heart className="h-4 w-4" />}>
                Heart Item
              </EnhancedPopoverItem>
              <EnhancedPopoverItem icon={<Zap className="h-4 w-4" />}>
                Zap Item
              </EnhancedPopoverItem>
            </div>
          </EnhancedPopoverContent>
        </Popover>

        <Popover>
          <EnhancedPopoverTrigger variant="outline" size="sm">
            Neon
          </EnhancedPopoverTrigger>
          <EnhancedPopoverContent variant="neon" size="md">
            <EnhancedPopoverHeader
              icon={<Zap className="h-5 w-5" />}
              title="Neon Glow"
              description="Electric neon styling"
            />
            <div className="p-2">
              <EnhancedPopoverItem icon={<Palette className="h-4 w-4" />}>
                Colors
              </EnhancedPopoverItem>
              <EnhancedPopoverItem icon={<Eye className="h-4 w-4" />}>
                Vision
              </EnhancedPopoverItem>
              <EnhancedPopoverItem icon={<Shield className="h-4 w-4" />}>
                Security
              </EnhancedPopoverItem>
            </div>
          </EnhancedPopoverContent>
        </Popover>

        <Popover>
          <EnhancedPopoverTrigger variant="ghost" size="sm">
            Search
          </EnhancedPopoverTrigger>
          <EnhancedPopoverContent variant="futuristic" searchable showCloseButton>
            <div className="p-2">
              <EnhancedPopoverGroup title="Quick Actions">
                <EnhancedPopoverItem icon={<Search className="h-4 w-4" />}>
                  Search Files
                </EnhancedPopoverItem>
                <EnhancedPopoverItem icon={<Filter className="h-4 w-4" />}>
                  Filter Results
                </EnhancedPopoverItem>
                <EnhancedPopoverItem icon={<SortAsc className="h-4 w-4" />}>
                  Sort A-Z
                </EnhancedPopoverItem>
              </EnhancedPopoverGroup>
            </div>
          </EnhancedPopoverContent>
        </Popover>
      </div>
    </div>
  );
};

// Context Menu Demo Component
const ContextMenuDemo: React.FC = () => {
  const [pinnedItems, setPinnedItems] = React.useState<Set<string>>(new Set());

  const handlePin = (itemId: string) => {
    setPinnedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enhanced Context Menus</h3>
      <div className="grid grid-cols-2 gap-4">
        <ContextMenu>
          <EnhancedContextMenuTrigger className="w-full h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors">
            <div className="text-center">
              <File className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Right-click me!</p>
            </div>
          </EnhancedContextMenuTrigger>
          <EnhancedContextMenuContent variant="modern" size="md">
            <EnhancedContextMenuGroup title="File Actions">
              <EnhancedContextMenuItem icon={<Edit className="h-4 w-4" />} shortcut="⌘E">
                Edit
              </EnhancedContextMenuItem>
              <EnhancedContextMenuItem icon={<Copy className="h-4 w-4" />} shortcut="⌘C">
                Copy
              </EnhancedContextMenuItem>
              <EnhancedContextMenuItem icon={<Download className="h-4 w-4" />}>
                Download
              </EnhancedContextMenuItem>
              <EnhancedContextMenuItem icon={<Share className="h-4 w-4" />}>
                Share
              </EnhancedContextMenuItem>
            </EnhancedContextMenuGroup>
            <EnhancedContextMenuSeparator label="Organization" />
            <EnhancedContextMenuGroup title="Organize">
              <EnhancedContextMenuItem 
                icon={<Pin className="h-4 w-4" />} 
                pinned={pinnedItems.has('pin')}
                onPin={() => handlePin('pin')}
              >
                Pin to Top
              </EnhancedContextMenuItem>
              <EnhancedContextMenuItem icon={<Star className="h-4 w-4" />}>
                Add to Favorites
              </EnhancedContextMenuItem>
              <EnhancedContextMenuItem icon={<Bookmark className="h-4 w-4" />}>
                Bookmark
              </EnhancedContextMenuItem>
            </EnhancedContextMenuGroup>
            <EnhancedContextMenuSeparator />
            <EnhancedContextMenuItem 
              icon={<Trash2 className="h-4 w-4" />} 
              variant="destructive"
              shortcut="⌘⌫"
            >
              Delete
            </EnhancedContextMenuItem>
          </EnhancedContextMenuContent>
        </ContextMenu>

        <ContextMenu>
          <EnhancedContextMenuTrigger className="w-full h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors">
            <div className="text-center">
              <Folder className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Context Menu</p>
            </div>
          </EnhancedContextMenuTrigger>
          <EnhancedContextMenuContent variant="glass" size="lg">
            <EnhancedContextMenuGroup title="View Options">
              <EnhancedContextMenuItem icon={<Grid className="h-4 w-4" />}>
                Grid View
              </EnhancedContextMenuItem>
              <EnhancedContextMenuItem icon={<List className="h-4 w-4" />}>
                List View
              </EnhancedContextMenuItem>
              <EnhancedContextMenuItem icon={<Layout className="h-4 w-4" />}>
                Compact View
              </EnhancedContextMenuItem>
            </EnhancedContextMenuGroup>
            <EnhancedContextMenuSeparator />
            <EnhancedContextMenuSub>
              <EnhancedContextMenuSubTrigger icon={<Settings className="h-4 w-4" />}>
                Settings
              </EnhancedContextMenuSubTrigger>
              <EnhancedContextMenuSubContent>
                <EnhancedContextMenuItem icon={<Monitor className="h-4 w-4" />}>
                  Desktop
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Tablet className="h-4 w-4" />}>
                  Tablet
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Smartphone className="h-4 w-4" />}>
                  Mobile
                </EnhancedContextMenuItem>
              </EnhancedContextMenuSubContent>
            </EnhancedContextMenuSub>
            <EnhancedContextMenuSub>
              <EnhancedContextMenuSubTrigger icon={<Palette className="h-4 w-4" />}>
                Theme
              </EnhancedContextMenuSubTrigger>
              <EnhancedContextMenuSubContent>
                <EnhancedContextMenuItem icon={<Sun className="h-4 w-4" />}>
                  Light
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Moon className="h-4 w-4" />}>
                  Dark
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Eye className="h-4 w-4" />}>
                  Auto
                </EnhancedContextMenuItem>
              </EnhancedContextMenuSubContent>
            </EnhancedContextMenuSub>
          </EnhancedContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
};

// Main Showcase Component
const EnhancedPopupShowcaseContent: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-background to-background/80 min-h-screen">
      <PopupNavigation />
      
      <div className="p-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              Enhanced Popup System
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-accent/20 blur-xl -z-10" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of popup components with modern design, 
            smooth animations, and enhanced user interactions.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Accessibility First</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Performance Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Modern Animations</span>
            </div>
          </div>
        </div>

      {/* Demo Sections */}
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Toast Notifications */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Enhanced Toast Notifications</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Beautiful, accessible toast notifications with multiple themes, animations, and interactive features.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
            <ToastDemo />
          </div>
        </section>

        {/* Popovers */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Enhanced Popovers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Advanced popover components with search, filtering, and modern styling options.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
            <PopoverDemo />
          </div>
        </section>

        {/* Context Menus */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Enhanced Context Menus</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Rich context menus with submenus, shortcuts, and modern interactions.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
            <ContextMenuDemo />
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built with modern web standards and best practices for optimal user experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Accessibility First</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Full keyboard navigation, screen reader support, ARIA labels, and WCAG compliance for inclusive design.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Performance Optimized</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Lightweight components with optimized rendering, lazy loading, and minimal bundle impact for fast loading.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Modern Animations</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Smooth, performant animations with multiple entrance effects and micro-interactions for delightful UX.
              </p>
            </div>
          </div>
        </section>

        {/* Theme Showcase */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Theme Variants</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Multiple theme options to match your application's design system and user preferences.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Default', variant: 'default', color: 'bg-gray-500' },
              { name: 'Glass', variant: 'glass', color: 'bg-gradient-to-r from-blue-400 to-purple-500' },
              { name: 'Neon', variant: 'neon', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
              { name: 'Modern', variant: 'modern', color: 'bg-gradient-to-r from-green-500 to-blue-500' },
              { name: 'Futuristic', variant: 'futuristic', color: 'bg-gradient-to-r from-purple-500 to-cyan-500' },
            ].map((theme) => (
              <div key={theme.variant} className="text-center space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-xl ${theme.color} flex items-center justify-center shadow-lg`}>
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-xs text-muted-foreground">Modern styling</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Main Export with Provider
export const EnhancedPopupShowcase: React.FC = () => {
  return (
    <EnhancedToastProvider>
      <EnhancedPopupShowcaseContent />
    </EnhancedToastProvider>
  );
};

export default EnhancedPopupShowcase;
