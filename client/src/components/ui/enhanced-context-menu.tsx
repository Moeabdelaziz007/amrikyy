'use client';

import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { 
  Check, 
  ChevronRight, 
  Circle,
  Copy,
  Download,
  Edit,
  ExternalLink,
  File,
  Folder,
  Heart,
  MoreHorizontal,
  Pin,
  PinOff,
  Share,
  Star,
  Trash2,
  User,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

// Enhanced Context Menu Content Props
interface EnhancedContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {
  variant?: 'default' | 'glass' | 'neon' | 'modern' | 'futuristic';
  size?: 'sm' | 'md' | 'lg';
  showIcons?: boolean;
  showShortcuts?: boolean;
  animated?: boolean;
}

// Size configurations
const sizeClasses = {
  sm: 'min-w-[8rem]',
  md: 'min-w-[12rem]',
  lg: 'min-w-[16rem]'
};

// Variant configurations
const variantClasses = {
  default: 'bg-popover border border-border shadow-md',
  glass: 'bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl',
  neon: 'bg-background/95 border-2 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]',
  modern: 'bg-background/95 border border-border/50 shadow-xl backdrop-blur-md',
  futuristic: 'bg-gradient-to-br from-primary/10 via-background/95 to-accent/10 border-primary/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]'
};

// Enhanced Context Menu Content
const EnhancedContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  EnhancedContextMenuContentProps
>(({ 
  className, 
  children, 
  variant = 'modern', 
  size = 'md',
  showIcons = true,
  showShortcuts = true,
  animated = true,
  ...props 
}, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-xl p-1 text-popover-foreground shadow-md',
        sizeClasses[size],
        variantClasses[variant],
        animated && 'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className
      )}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Content>
  </ContextMenuPrimitive.Portal>
));
EnhancedContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

// Enhanced Context Menu Item
interface EnhancedContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  icon?: React.ReactNode;
  shortcut?: string;
  badge?: string | number;
  description?: string;
  rightIcon?: React.ReactNode;
  pinned?: boolean;
  onPin?: () => void;
}

const EnhancedContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  EnhancedContextMenuItemProps
>(({ 
  className, 
  variant = 'default', 
  icon, 
  shortcut, 
  badge,
  description,
  rightIcon,
  pinned = false,
  onPin,
  children, 
  ...props 
}, ref) => {
  const variantClasses = {
    default: 'focus:bg-accent focus:text-accent-foreground',
    destructive: 'focus:bg-destructive focus:text-destructive-foreground text-destructive',
    success: 'focus:bg-green-500/10 focus:text-green-600 text-green-600',
    warning: 'focus:bg-yellow-500/10 focus:text-yellow-600 text-yellow-600'
  };

  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none transition-all duration-200 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        variantClasses[variant],
        'group hover:scale-[1.02] hover:shadow-sm',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="flex-shrink-0 text-muted-foreground group-focus:text-foreground transition-colors">
          {icon}
        </span>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="truncate">{children}</span>
          {badge && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {shortcut && (
          <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">
            {shortcut}
          </span>
        )}
        
        {onPin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background/50 rounded"
            title={pinned ? 'Unpin' : 'Pin'}
          >
            {pinned ? (
              <PinOff className="h-3 w-3 text-primary" />
            ) : (
              <Pin className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        )}
        
        {rightIcon && (
          <span className="flex-shrink-0 text-muted-foreground group-focus:text-foreground transition-colors">
            {rightIcon}
          </span>
        )}
      </div>
    </ContextMenuPrimitive.Item>
  );
});
EnhancedContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

// Enhanced Context Menu Checkbox Item
const EnhancedContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
    icon?: React.ReactNode;
    shortcut?: string;
  }
>(({ className, icon, shortcut, children, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none transition-all duration-200 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'group hover:scale-[1.02] hover:shadow-sm',
      className
    )}
    {...props}
  >
    {icon && (
      <span className="flex-shrink-0 text-muted-foreground group-focus:text-foreground transition-colors">
        {icon}
      </span>
    )}
    
    <div className="flex-1 min-w-0">
      <span className="truncate">{children}</span>
    </div>

    <div className="flex items-center gap-2">
      {shortcut && (
        <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">
          {shortcut}
        </span>
      )}
      
      <ContextMenuPrimitive.ItemIndicator className="flex-shrink-0">
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </div>
  </ContextMenuPrimitive.CheckboxItem>
));
EnhancedContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

// Enhanced Context Menu Radio Item
const EnhancedContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
    icon?: React.ReactNode;
    shortcut?: string;
  }
>(({ className, icon, shortcut, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none transition-all duration-200 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'group hover:scale-[1.02] hover:shadow-sm',
      className
    )}
    {...props}
  >
    {icon && (
      <span className="flex-shrink-0 text-muted-foreground group-focus:text-foreground transition-colors">
        {icon}
      </span>
    )}
    
    <div className="flex-1 min-w-0">
      <span className="truncate">{children}</span>
    </div>

    <div className="flex items-center gap-2">
      {shortcut && (
        <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">
          {shortcut}
        </span>
      )}
      
      <ContextMenuPrimitive.ItemIndicator className="flex-shrink-0">
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </div>
  </ContextMenuPrimitive.RadioItem>
));
EnhancedContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

// Enhanced Context Menu Separator
const EnhancedContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> & {
    label?: string;
  }
>(({ className, label, ...props }, ref) => (
  <div className="relative my-1">
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn(
        'h-px bg-border/20',
        label && 'my-3',
        className
      )}
      {...props}
    />
    {label && (
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
        {label}
      </div>
    )}
  </div>
));
EnhancedContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

// Enhanced Context Menu Label
const EnhancedContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-foreground',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
EnhancedContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

// Enhanced Context Menu Group
const EnhancedContextMenuGroup = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Group> & {
    title?: string;
  }
>(({ className, title, children, ...props }, ref) => (
  <ContextMenuPrimitive.Group
    ref={ref}
    className={cn(
      'space-y-1',
      className
    )}
    {...props}
  >
    {title && (
      <EnhancedContextMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </EnhancedContextMenuLabel>
    )}
    {children}
  </ContextMenuPrimitive.Group>
));
EnhancedContextMenuGroup.displayName = ContextMenuPrimitive.Group.displayName;

// Enhanced Context Menu Sub
const EnhancedContextMenuSub = ContextMenuPrimitive.Sub;

// Enhanced Context Menu Sub Trigger
const EnhancedContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    icon?: React.ReactNode;
    shortcut?: string;
    badge?: string | number;
    description?: string;
  }
>(({ className, icon, shortcut, badge, description, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex w-full cursor-default select-none items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none transition-all duration-200 focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'group hover:scale-[1.02] hover:shadow-sm',
      className
    )}
    {...props}
  >
    {icon && (
      <span className="flex-shrink-0 text-muted-foreground group-focus:text-foreground transition-colors">
        {icon}
      </span>
    )}
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="truncate">{children}</span>
        {badge && (
          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {description}
        </p>
      )}
    </div>

    <div className="flex items-center gap-2">
      {shortcut && (
        <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">
          {shortcut}
        </span>
      )}
      
      <ChevronRight className="h-4 w-4" />
    </div>
  </ContextMenuPrimitive.SubTrigger>
));
EnhancedContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

// Enhanced Context Menu Sub Content
const EnhancedContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & {
    variant?: 'default' | 'glass' | 'neon' | 'modern' | 'futuristic';
  }
>(({ className, variant = 'modern', ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-xl p-1 text-popover-foreground shadow-md',
      variantClasses[variant],
      'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      className
    )}
    {...props}
  />
));
EnhancedContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

// Enhanced Context Menu Trigger
const EnhancedContextMenuTrigger = ContextMenuPrimitive.Trigger;

export {
  ContextMenu,
  EnhancedContextMenuTrigger,
  EnhancedContextMenuContent,
  EnhancedContextMenuItem,
  EnhancedContextMenuCheckboxItem,
  EnhancedContextMenuRadioItem,
  EnhancedContextMenuSeparator,
  EnhancedContextMenuLabel,
  EnhancedContextMenuGroup,
  EnhancedContextMenuSub,
  EnhancedContextMenuSubTrigger,
  EnhancedContextMenuSubContent,
};