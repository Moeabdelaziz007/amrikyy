'use client';

import * as React from 'react';
import { Button } from './button';
import { 
  EnhancedToastProvider, 
  useEnhancedToastNotifications 
} from './enhanced-popup-system';
import {
  Popover,
  EnhancedPopoverTrigger,
  EnhancedPopoverContent,
  EnhancedPopoverHeader,
  EnhancedPopoverItem,
} from './enhanced-popover-simple';
import {
  ContextMenu,
  EnhancedContextMenuTrigger,
  EnhancedContextMenuContent,
  EnhancedContextMenuItem,
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
  Zap,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Copy,
  ExternalLink,
  File,
  Folder,
} from 'lucide-react';

// Test Component
const PopupTestContent: React.FC = () => {
  const { success, error, warning, info, loading } = useEnhancedToastNotifications();

  const showToastDemo = (type: string) => {
    switch (type) {
      case 'success':
        success('Success!', 'Operation completed successfully');
        break;
      case 'error':
        error('Error!', 'Something went wrong');
        break;
      case 'warning':
        warning('Warning!', 'Please check your input');
        break;
      case 'info':
        info('Info', 'Here is some information');
        break;
      case 'loading':
        loading('Loading...', 'Please wait');
        break;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background to-background/80 min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Popup System Test
        </h1>
        <p className="text-muted-foreground text-lg">
          Testing the enhanced popup components
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Toast Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Toast Notifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
            <Button onClick={() => showToastDemo('loading')} variant="ghost" size="sm" className="col-span-2 md:col-span-1">
              <Loader2 className="w-4 h-4 mr-2" />
              Loading
            </Button>
          </div>
        </section>

        {/* Popover Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Popovers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Popover>
              <EnhancedPopoverTrigger variant="default" size="sm">
                Basic
              </EnhancedPopoverTrigger>
              <EnhancedPopoverContent variant="modern" size="md">
                <EnhancedPopoverHeader
                  icon={<User className="h-5 w-5" />}
                  title="User Menu"
                  description="Manage your account"
                />
                <div className="p-2">
                  <EnhancedPopoverItem icon={<Settings className="h-4 w-4" />}>
                    Settings
                  </EnhancedPopoverItem>
                  <EnhancedPopoverItem icon={<Heart className="h-4 w-4" />}>
                    Favorites
                  </EnhancedPopoverItem>
                  <EnhancedPopoverItem icon={<Bell className="h-4 w-4" />}>
                    Notifications
                  </EnhancedPopoverItem>
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
                  title="Glass Effect"
                  description="Beautiful glass styling"
                />
                <div className="p-2">
                  <EnhancedPopoverItem icon={<Star className="h-4 w-4" />}>
                    Star Item
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
                  description="Electric styling"
                />
                <div className="p-2">
                  <EnhancedPopoverItem icon={<Download className="h-4 w-4" />}>
                    Download
                  </EnhancedPopoverItem>
                  <EnhancedPopoverItem icon={<Share className="h-4 w-4" />}>
                    Share
                  </EnhancedPopoverItem>
                </div>
              </EnhancedPopoverContent>
            </Popover>

            <Popover>
              <EnhancedPopoverTrigger variant="ghost" size="sm">
                Futuristic
              </EnhancedPopoverTrigger>
              <EnhancedPopoverContent variant="futuristic" size="md">
                <EnhancedPopoverHeader
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Future UI"
                  description="Advanced styling"
                />
                <div className="p-2">
                  <EnhancedPopoverItem icon={<Edit className="h-4 w-4" />}>
                    Edit
                  </EnhancedPopoverItem>
                  <EnhancedPopoverItem icon={<Copy className="h-4 w-4" />}>
                    Copy
                  </EnhancedPopoverItem>
                </div>
              </EnhancedPopoverContent>
            </Popover>
          </div>
        </section>

        {/* Context Menu Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Context Menus</h2>
          <div className="grid grid-cols-2 gap-4">
            <ContextMenu>
              <EnhancedContextMenuTrigger className="w-full h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <File className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Right-click me!</p>
                </div>
              </EnhancedContextMenuTrigger>
              <EnhancedContextMenuContent variant="modern" size="md">
                <EnhancedContextMenuItem icon={<Edit className="h-4 w-4" />}>
                  Edit
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Copy className="h-4 w-4" />}>
                  Copy
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Download className="h-4 w-4" />}>
                  Download
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Share className="h-4 w-4" />}>
                  Share
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem 
                  icon={<Trash2 className="h-4 w-4" />} 
                  variant="destructive"
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
                <EnhancedContextMenuItem icon={<Star className="h-4 w-4" />}>
                  Add to Favorites
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<Heart className="h-4 w-4" />}>
                  Like
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<MessageSquare className="h-4 w-4" />}>
                  Comment
                </EnhancedContextMenuItem>
                <EnhancedContextMenuItem icon={<ExternalLink className="h-4 w-4" />}>
                  Open in New Tab
                </EnhancedContextMenuItem>
              </EnhancedContextMenuContent>
            </ContextMenu>
          </div>
        </section>
      </div>
    </div>
  );
};

// Main Export with Provider
export const PopupTest: React.FC = () => {
  return (
    <EnhancedToastProvider>
      <PopupTestContent />
    </EnhancedToastProvider>
  );
};

export default PopupTest;
