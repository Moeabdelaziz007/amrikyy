'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { 
  ChevronDown, 
  ChevronUp, 
  Search,
  Settings,
  User,
  Heart,
  Star,
  MessageSquare,
  Bell,
  Download,
  Share,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Pin,
  PinOff,
  X,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
// Simple Input component for search
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

// Enhanced Popover Content Props
interface EnhancedPopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  variant?: 'default' | 'glass' | 'neon' | 'modern' | 'futuristic';
  size?: 'sm' | 'md' | 'lg' | 'auto';
  showArrow?: boolean;
  interactive?: boolean;
  searchable?: boolean;
  showCloseButton?: boolean;
  onSearch?: (query: string) => void;
}

// Size configurations
const sizeClasses = {
  sm: 'w-48 min-w-[12rem]',
  md: 'w-64 min-w-[16rem]',
  lg: 'w-80 min-w-[20rem]',
  auto: 'w-auto min-w-[12rem] max-w-[24rem]'
};

// Variant configurations
const variantClasses = {
  default: 'bg-card border border-border shadow-lg',
  glass: 'bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl',
  neon: 'bg-background/95 border-2 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]',
  modern: 'bg-background/95 border border-border/50 shadow-xl backdrop-blur-md',
  futuristic: 'bg-gradient-to-br from-primary/10 via-background/95 to-accent/10 border-primary/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]'
};

// Enhanced Popover Content
const EnhancedPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  EnhancedPopoverContentProps
>(({ 
  className, 
  children, 
  variant = 'modern', 
  size = 'auto',
  showArrow = true,
  interactive = true,
  searchable = false,
  showCloseButton = false,
  onSearch,
  align = 'center', 
  sideOffset = 8,
  ...props 
}, ref) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 rounded-xl text-popover-foreground outline-none transition-all duration-300',
          sizeClasses[size],
          variantClasses[variant],
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          interactive && 'hover:scale-[1.02] hover:shadow-2xl',
          className
        )}
        onOpenAutoFocus={(e) => {
          if (searchable) {
            e.preventDefault();
            const searchInput = document.querySelector('.enhanced-popover-search input') as HTMLInputElement;
            searchInput?.focus();
          }
        }}
        {...props}
      >
        {/* Search Bar */}
        {searchable && (
          <div className="enhanced-popover-search p-3 border-b border-border/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-8 text-sm bg-background/50 border-border/30 focus:border-primary/50"
              />
            </div>
          </div>
        )}

        {/* Close Button */}
        {showCloseButton && (
          <PopoverPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/10"
            >
              <X className="h-3 w-3" />
            </Button>
          </PopoverPrimitive.Close>
        )}

        {/* Content */}
        <div className="max-h-96 overflow-auto">
          {children}
        </div>
        
        {/* Enhanced Arrow */}
        {showArrow && (
          <PopoverPrimitive.Arrow 
            className={cn(
              'fill-current',
              variant === 'glass' && 'fill-white/10',
              variant === 'neon' && 'fill-primary/20',
              variant === 'futuristic' && 'fill-primary/30'
            )}
          />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
EnhancedPopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Enhanced Popover Header
const EnhancedPopoverHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
  }
>(({ className, icon, title, description, actions, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-start gap-3 p-4 border-b border-border/20 bg-gradient-to-r from-background/50 to-transparent',
      className
    )}
    {...props}
  >
    {icon && (
      <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      {title && (
        <h3 className="text-sm font-semibold leading-none tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          {description}
        </p>
      )}
    </div>
    {actions && (
      <div className="flex-shrink-0">
        {actions}
      </div>
    )}
  </div>
));
EnhancedPopoverHeader.displayName = 'EnhancedPopoverHeader';

// Enhanced Popover Item
interface EnhancedPopoverItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'ghost' | 'success';
  icon?: React.ReactNode;
  shortcut?: string;
  badge?: string | number;
  description?: string;
  rightIcon?: React.ReactNode;
  pinned?: boolean;
  onPin?: () => void;
}

const EnhancedPopoverItem = React.forwardRef<HTMLButtonElement, EnhancedPopoverItemProps>(
  ({ 
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
      default: 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
      destructive: 'hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground',
      ghost: 'hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground',
      success: 'hover:bg-green-500/10 hover:text-green-600 focus:bg-green-500/10 focus:text-green-600'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          'group hover:scale-[1.02] hover:shadow-sm',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
            {icon}
          </span>
        )}
        
        <div className="flex-1 text-left min-w-0">
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
            <span className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
              {rightIcon}
            </span>
          )}
        </div>
      </button>
    );
  }
);
EnhancedPopoverItem.displayName = 'EnhancedPopoverItem';

// Enhanced Popover Separator
const EnhancedPopoverSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
  }
>(({ className, label, ...props }, ref) => (
  <div className="relative my-2">
    <div
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
EnhancedPopoverSeparator.displayName = 'EnhancedPopoverSeparator';

// Enhanced Popover Group
const EnhancedPopoverGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
  }
>(({ className, title, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'space-y-1',
      className
    )}
    {...props}
  >
    {title && (
      <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>{title}</span>
      </div>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
));
EnhancedPopoverGroup.displayName = 'EnhancedPopoverGroup';

// Enhanced Popover Trigger
const EnhancedPopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    showIndicator?: boolean;
  }
>(({ className, variant = 'default', size = 'md', showIndicator = true, children, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground'
  };

  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
      {showIndicator && (
        <ChevronDown className="h-4 w-4 opacity-50" />
      )}
    </PopoverPrimitive.Trigger>
  );
});
EnhancedPopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export {
  Popover,
  EnhancedPopoverTrigger,
  EnhancedPopoverContent,
  EnhancedPopoverHeader,
  EnhancedPopoverItem,
  EnhancedPopoverSeparator,
  EnhancedPopoverGroup,
};
