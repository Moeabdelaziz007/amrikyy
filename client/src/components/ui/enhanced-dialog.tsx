'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// Enhanced overlay with gradient backdrop
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-500',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface EnhancedDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: 'default' | 'glass' | 'neon' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showControls?: boolean;
  draggable?: boolean;
  resizable?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]'
};

const variantClasses = {
  default: 'bg-background/95 border border-border/50',
  glass: 'bg-background/10 backdrop-blur-xl border border-white/20 shadow-2xl',
  neon: 'bg-background/95 border-2 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]',
  minimal: 'bg-background border-0 shadow-none'
};

// Enhanced content with modern styling and controls
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  EnhancedDialogContentProps
>(({ 
  className, 
  children, 
  variant = 'glass', 
  size = 'md', 
  showControls = true,
  draggable = true,
  resizable = true,
  ...props 
}, ref) => {
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || isMaximized) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragStart.x)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStart.y)),
      });
    }
  }, [isDragging, dragStart, isMaximized]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full gap-4 p-0 translate-x-[-50%] translate-y-[-50%] duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl overflow-hidden',
          sizeClasses[size],
          variantClasses[variant],
          isMaximized && 'inset-4 max-w-none max-h-none w-auto h-auto',
          isMinimized && 'scale-0 opacity-0 pointer-events-none',
          isDragging && 'transition-none',
          className
        )}
        style={{
          transform: isMaximized 
            ? 'translate(-50%, -50%)' 
            : `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          ...props.style
        }}
        {...props}
      >
        {/* Enhanced Header with Controls */}
        {showControls && (
          <div
            className={cn(
              'flex items-center justify-between p-4 border-b border-border/20 cursor-move select-none',
              variant === 'glass' && 'bg-white/5 backdrop-blur-sm',
              variant === 'neon' && 'bg-primary/10 border-primary/30',
              isDragging && 'cursor-grabbing'
            )}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-3">
              {/* Traffic Light Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Minimize"
                />
                <button
                  onClick={toggleMaximize}
                  className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-all duration-200 hover:scale-110 shadow-sm"
                  title={isMaximized ? 'Restore' : 'Maximize'}
                />
                <DialogClose asChild>
                  <button
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-all duration-200 hover:scale-110 shadow-sm"
                    title="Close"
                  />
                </DialogClose>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="h-8 w-8 p-0 hover:bg-white/10"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMaximize}
                className="h-8 w-8 p-0 hover:bg-white/10"
              >
                {isMaximized ? <RotateCcw className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={cn(
          'p-6 overflow-auto',
          variant === 'glass' && 'bg-gradient-to-br from-white/5 to-transparent',
          variant === 'neon' && 'bg-background/95'
        )}>
          {children}
        </div>

        {/* Resize Handle */}
        {resizable && !isMaximized && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-border/50 rounded-sm" />
          </div>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Enhanced Header
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left mb-4',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

// Enhanced Footer
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 pt-4 border-t border-border/20',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

// Enhanced Title
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Enhanced Description
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
