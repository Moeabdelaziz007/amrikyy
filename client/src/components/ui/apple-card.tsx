import React from 'react';
import { cn } from '@/lib/utils';

interface AppleCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'ai';
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

/**
 * 🍎 Apple-style Card Component
 * 
 * Features:
 * - Apple-inspired design language
 * - Glass morphism effects
 * - AI-enhanced animations
 * - Responsive design
 * - Accessibility support
 */
export function AppleCard({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false,
  onClick,
}: AppleCardProps) {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'apple-card',
    glass: 'apple-glass',
    ai: 'ai-card',
  };

  const hoverClasses = hover ? 'cursor-pointer' : '';
  const glowClasses = glow ? 'ai-pulse' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        glowClasses,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}

interface AppleCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AppleCardHeader({ children, className }: AppleCardHeaderProps) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

interface AppleCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AppleCardContent({ children, className }: AppleCardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

interface AppleCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function AppleCardFooter({ children, className }: AppleCardFooterProps) {
  return (
    <div className={cn('p-6 pt-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}
