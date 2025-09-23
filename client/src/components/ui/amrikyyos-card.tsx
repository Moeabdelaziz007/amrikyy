import React from 'react';
import { cn } from '@/lib/utils';

interface AmrikyyOSCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'ai';
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

/**
 * 🚀 AmrikyyOS Card Component
 * 
 * Features:
 * - AmrikyyOS brand design language
 * - Glass morphism effects
 * - AI-enhanced animations
 * - Responsive design
 * - Accessibility support
 */
export function AmrikyyOSCard({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false,
  onClick,
}: AmrikyyOSCardProps) {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'amrikyyos-card',
    glass: 'amrikyyos-glass',
    ai: 'amrikyyos-ai-card',
  };

  const hoverClasses = hover ? 'cursor-pointer' : '';
  const glowClasses = glow ? 'amrikyyos-pulse' : '';

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

interface AmrikyyOSCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AmrikyyOSCardHeader({ children, className }: AmrikyyOSCardHeaderProps) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

interface AmrikyyOSCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AmrikyyOSCardContent({ children, className }: AmrikyyOSCardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

interface AmrikyyOSCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function AmrikyyOSCardFooter({ children, className }: AmrikyyOSCardFooterProps) {
  return (
    <div className={cn('p-6 pt-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}
