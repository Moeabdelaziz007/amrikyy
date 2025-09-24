'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

interface EnhancedPopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  variant?: 'default' | 'glass' | 'neon' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'auto';
  showArrow?: boolean;
  interactive?: boolean;
}

const sizeClasses = {
  sm: 'w-48',
  md: 'w-64',
  lg: 'w-80',
  auto: 'w-auto min-w-[200px]'
};

const variantClasses = {
  default: 'bg-popover border border-border shadow-md',
  glass: 'bg-background/10 backdrop-blur-xl border border-white/20 shadow-2xl',
  neon: 'bg-background/95 border-2 border-primary/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  minimal: 'bg-background border-0 shadow-none'
};

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  EnhancedPopoverContentProps
>(({ 
  className, 
  children, 
  variant = 'glass', 
  size = 'auto',
  showArrow = true,
  interactive = true,
  align = 'center', 
  sideOffset = 8,
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 rounded-xl p-4 text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        sizeClasses[size],
        variantClasses[variant],
        interactive && 'hover:scale-[1.02] transition-transform duration-200',
        className
      )}
      {...props}
    >
      {children}
      
      {/* Enhanced Arrow */}
      {showArrow && (
        <PopoverPrimitive.Arrow 
          className={cn(
            'fill-current',
            variant === 'glass' && 'fill-white/10',
            variant === 'neon' && 'fill-primary/20'
          )}
        />
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Enhanced Popover Header
const PopoverHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 pb-3 border-b border-border/20',
      className
    )}
    {...props}
  />
));
PopoverHeader.displayName = 'PopoverHeader';

// Enhanced Popover Title
const PopoverTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-sm font-semibold leading-none tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
      className
    )}
    {...props}
  />
));
PopoverTitle.displayName = 'PopoverTitle';

// Enhanced Popover Description
const PopoverDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-sm text-muted-foreground leading-relaxed',
      className
    )}
    {...props}
  />
));
PopoverDescription.displayName = 'PopoverDescription';

// Enhanced Popover Footer
const PopoverFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-3 border-t border-border/20',
      className
    )}
    {...props}
  />
));
PopoverFooter.displayName = 'PopoverFooter';

// Enhanced Popover Body
const PopoverBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'py-2',
      className
    )}
    {...props}
  />
));
PopoverBody.displayName = 'PopoverBody';

// Enhanced Popover Item
interface PopoverItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'ghost';
  icon?: React.ReactNode;
  shortcut?: string;
}

const PopoverItem = React.forwardRef<HTMLButtonElement, PopoverItemProps>(
  ({ className, variant = 'default', icon, shortcut, children, ...props }, ref) => {
    const variantClasses = {
      default: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'hover:bg-destructive hover:text-destructive-foreground',
      ghost: 'hover:bg-transparent hover:text-foreground'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1 text-left">{children}</span>
        {shortcut && (
          <span className="ml-auto text-xs text-muted-foreground font-mono">
            {shortcut}
          </span>
        )}
      </button>
    );
  }
);
PopoverItem.displayName = 'PopoverItem';

// Enhanced Popover Separator
const PopoverSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'my-2 h-px bg-border/20',
      className
    )}
    {...props}
  />
));
PopoverSeparator.displayName = 'PopoverSeparator';

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverFooter,
  PopoverBody,
  PopoverItem,
  PopoverSeparator,
};
