import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AmrikyyOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  fullWidth?: boolean;
}

/**
 * 🚀 AmrikyyOS Button Component
 * 
 * Features:
 * - AmrikyyOS brand design language
 * - Multiple variants and sizes
 * - Loading states
 * - Icon support
 * - AI-enhanced effects
 * - Accessibility support
 */
export function AmrikyyOSButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  glow = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: AmrikyyOSButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'amrikyyos-button-primary text-white focus:ring-green-500',
    secondary: 'amrikyyos-button-secondary text-gray-900 dark:text-white focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
    ai: 'amrikyyos-ai-button text-white focus:ring-green-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl',
  };

  const glowClasses = glow ? 'amrikyyos-pulse' : '';
  const widthClasses = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        widthClasses,
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
}

interface AmrikyyOSIconButtonProps extends Omit<AmrikyyOSButtonProps, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export function AmrikyyOSIconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}: AmrikyyOSIconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <AmrikyyOSButton
      variant={variant}
      size={size}
      className={cn(sizeClasses[size], 'p-0', className)}
      {...props}
    >
      {icon}
    </AmrikyyOSButton>
  );
}
