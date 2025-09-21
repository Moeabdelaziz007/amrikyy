import React from 'react';

interface ControlButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  glowOnHover?: boolean;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  glowOnHover = true,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-glass-primary 
          border-neon-green 
          text-neon-green
          hover:bg-neon-green 
          hover:text-bg-primary
          ${glowOnHover ? 'hover:shadow-glow-green-md' : ''}
        `;
      case 'secondary':
        return `
          bg-glass-primary 
          border-cyber-blue 
          text-cyber-blue
          hover:bg-cyber-blue 
          hover:text-bg-primary
          ${glowOnHover ? 'hover:shadow-glow-blue-md' : ''}
        `;
      case 'success':
        return `
          bg-glass-primary 
          border-status-success 
          text-status-success
          hover:bg-status-success 
          hover:text-bg-primary
          ${glowOnHover ? 'hover:shadow-glow-green-md' : ''}
        `;
      case 'danger':
        return `
          bg-glass-primary 
          border-status-error 
          text-status-error
          hover:bg-status-error 
          hover:text-bg-primary
          ${glowOnHover ? 'hover:shadow-[0_0_16px_rgba(255,0,64,0.7)]' : ''}
        `;
      case 'warning':
        return `
          bg-glass-primary 
          border-status-warning 
          text-status-warning
          hover:bg-status-warning 
          hover:text-bg-primary
          ${glowOnHover ? 'hover:shadow-[0_0_16px_rgba(255,255,0,0.7)]' : ''}
        `;
      default:
        return `
          bg-glass-primary 
          border-glass-border 
          text-text-primary
          hover:bg-glass-secondary
        `;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const disabledClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed hover:bg-glass-primary hover:text-current hover:shadow-none' 
    : 'cursor-pointer';

  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        border
        rounded-md
        backdrop-blur-glass-sm
        font-futuristic
        font-medium
        letter-spacing-wider
        uppercase
        transition-all
        duration-200
        active:scale-95
        disabled:active:scale-100
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabledClasses}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      
      {children}
    </button>
  );
};
