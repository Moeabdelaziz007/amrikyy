'use client';

import * as React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from './enhanced-dialog';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger, 
  PopoverHeader, 
  PopoverTitle, 
  PopoverDescription,
  PopoverItem,
  PopoverSeparator
} from './enhanced-popover';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuTrigger, 
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel
} from './enhanced-context-menu';
import { 
  ToastProvider, 
  useToastNotifications 
} from './enhanced-toast';
import { 
  ModalManagerProvider, 
  useModal 
} from './modal-manager';
import { Button } from './button';
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
  AlertTriangle
} from 'lucide-react';

// Demo Content Components
const DemoContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Enhanced Popup System</h3>
        <p className="text-sm text-muted-foreground">
          Experience the next generation of popup windows with modern animations, 
          glass morphism effects, and intuitive interactions.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-background/50 rounded-lg border border-border/50">
          <h4 className="font-medium mb-2">✨ Features</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Glass morphism effects</li>
            <li>• Smooth animations</li>
            <li>• Draggable windows</li>
            <li>• Responsive design</li>
          </ul>
        </div>
        <div className="p-4 bg-background/50 rounded-lg border border-border/50">
          <h4 className="font-medium mb-2">🎨 Variants</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Glass effect</li>
            <li>• Neon glow</li>
            <li>• Minimal design</li>
            <li>• Default style</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ToastDemo: React.FC = () => {
  const { success, error, warning, info, loading } = useToastNotifications();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toast Notifications</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => success('Success!', 'Operation completed successfully')} size="sm">
          <CheckCircle className="w-4 h-4 mr-2" />
          Success
        </Button>
        <Button onClick={() => error('Error!', 'Something went wrong')} variant="destructive" size="sm">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Error
        </Button>
        <Button onClick={() => warning('Warning!', 'Please check your input')} variant="outline" size="sm">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Warning
        </Button>
        <Button onClick={() => info('Info', 'Here is some information')} variant="secondary" size="sm">
          <Info className="w-4 h-4 mr-2" />
          Info
        </Button>
        <Button onClick={() => loading('Loading...', 'Please wait')} variant="ghost" size="sm" className="col-span-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Loading
        </Button>
      </div>
    </div>
  );
};

const ModalDemo: React.FC = () => {
  const { showModal } = useModal();

  const openGlassModal = () => {
    showModal({
      title: 'Glass Morphism Modal',
      content: <DemoContent />,
      variant: 'glass',
      size: 'lg'
    });
  };

  const openNeonModal = () => {
    showModal({
      title: 'Neon Glow Modal',
      content: <DemoContent />,
      variant: 'neon',
      size: 'md'
    });
  };

  const openFullscreenModal = () => {
    showModal({
      title: 'Fullscreen Modal',
      content: <DemoContent />,
      variant: 'glass',
      size: 'full',
      draggable: false
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Modal Manager</h3>
      <div className="grid grid-cols-1 gap-2">
        <Button onClick={openGlassModal} variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Glass Modal
        </Button>
        <Button onClick={openNeonModal} variant="outline" size="sm">
          <Zap className="w-4 h-4 mr-2" />
          Neon Modal
        </Button>
        <Button onClick={openFullscreenModal} variant="outline" size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Fullscreen Modal
        </Button>
      </div>
    </div>
  );
};

// Main Showcase Component
const PopupShowcaseContent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Enhanced Popup System
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the next generation of popup windows with modern animations, 
          glass morphism effects, and intuitive user interactions.
        </p>
      </div>

      {/* Demo Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enhanced Dialog Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Enhanced Dialogs</h2>
          <div className="grid grid-cols-2 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Palette className="w-4 h-4 mr-2" />
                  Glass
                </Button>
              </DialogTrigger>
              <DialogContent variant="glass" size="md">
                <DialogHeader>
                  <DialogTitle>Glass Morphism Dialog</DialogTitle>
                  <DialogDescription>
                    Experience the beauty of glass morphism with backdrop blur effects.
                  </DialogDescription>
                </DialogHeader>
                <DemoContent />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Neon
                </Button>
              </DialogTrigger>
              <DialogContent variant="neon" size="md">
                <DialogHeader>
                  <DialogTitle>Neon Glow Dialog</DialogTitle>
                  <DialogDescription>
                    Feel the energy with neon glow effects and vibrant colors.
                  </DialogDescription>
                </DialogHeader>
                <DemoContent />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Minimal
                </Button>
              </DialogTrigger>
              <DialogContent variant="minimal" size="sm">
                <DialogHeader>
                  <DialogTitle>Minimal Dialog</DialogTitle>
                  <DialogDescription>
                    Clean and simple design for focused interactions.
                  </DialogDescription>
                </DialogHeader>
                <DemoContent />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Large
                </Button>
              </DialogTrigger>
              <DialogContent variant="glass" size="lg">
                <DialogHeader>
                  <DialogTitle>Large Dialog</DialogTitle>
                  <DialogDescription>
                    Spacious layout for complex content and interactions.
                  </DialogDescription>
                </DialogHeader>
                <DemoContent />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Popover Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Enhanced Popovers</h2>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </PopoverTrigger>
              <PopoverContent variant="glass" size="md">
                <PopoverHeader>
                  <PopoverTitle>User Profile</PopoverTitle>
                  <PopoverDescription>
                    Manage your account settings and preferences.
                  </PopoverDescription>
                </PopoverHeader>
                <PopoverItem icon={<Settings className="w-4 h-4" />}>Settings</PopoverItem>
                <PopoverItem icon={<Edit className="w-4 h-4" />}>Edit Profile</PopoverItem>
                <PopoverSeparator />
                <PopoverItem icon={<Download className="w-4 h-4" />}>Export Data</PopoverItem>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </PopoverTrigger>
              <PopoverContent variant="neon" size="sm">
                <PopoverHeader>
                  <PopoverTitle>Notifications</PopoverTitle>
                  <PopoverDescription>
                    Stay updated with the latest activities.
                  </PopoverDescription>
                </PopoverHeader>
                <PopoverItem icon={<Star className="w-4 h-4" />}>New Features</PopoverItem>
                <PopoverItem icon={<Heart className="w-4 h-4" />}>Likes & Follows</PopoverItem>
                <PopoverItem icon={<MessageSquare className="w-4 h-4" />}>Messages</PopoverItem>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Toast Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Toast Notifications</h2>
          <ToastDemo />
        </div>

        {/* Modal Manager Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Modal Manager</h2>
          <ModalDemo />
        </div>
      </div>

      {/* Context Menu Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Enhanced Context Menu</h2>
        <div className="flex justify-center">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="w-64 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border border-border/50 flex items-center justify-center cursor-pointer hover:from-primary/30 hover:to-accent/30 transition-all duration-200">
                <div className="text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Right-click me!</p>
                  <p className="text-xs text-muted-foreground">Try the context menu</p>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent variant="glass" size="md">
              <ContextMenuLabel>File Actions</ContextMenuLabel>
              <ContextMenuItem icon={<Edit className="w-4 h-4" />} shortcut="⌘E">
                Edit
              </ContextMenuItem>
              <ContextMenuItem icon={<Share className="w-4 h-4" />} shortcut="⌘S">
                Share
              </ContextMenuItem>
              <ContextMenuItem icon={<Download className="w-4 h-4" />} shortcut="⌘D">
                Download
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuLabel>Advanced</ContextMenuLabel>
              <ContextMenuItem icon={<Star className="w-4 h-4" />}>Add to Favorites</ContextMenuItem>
              <ContextMenuItem icon={<Trash2 className="w-4 h-4" />} variant="destructive">
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-primary">🎨 Visual Excellence</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Glass morphism effects</li>
              <li>• Neon glow animations</li>
              <li>• Smooth transitions</li>
              <li>• Modern gradients</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">⚡ Enhanced UX</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Draggable windows</li>
              <li>• Resizable modals</li>
              <li>• Smart positioning</li>
              <li>• Keyboard navigation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">🔧 Developer Friendly</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• TypeScript support</li>
              <li>• Easy customization</li>
              <li>• Responsive design</li>
              <li>• Accessibility ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Export with Providers
export const PopupShowcase: React.FC = () => {
  return (
    <ToastProvider>
      <ModalManagerProvider>
        <PopupShowcaseContent />
      </ModalManagerProvider>
    </ToastProvider>
  );
};
