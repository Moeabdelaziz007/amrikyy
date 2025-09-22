import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  status?: 'running' | 'error' | 'warning' | 'idle';
  title?: string;
  subtitle?: string;
  glowColor?: 'green' | 'blue' | 'purple' | 'red' | 'yellow';
  animate?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  status = 'idle',
  title,
  subtitle,
  glowColor = 'blue',
  animate = false,
}) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'running':
        return 'border-status-success shadow-glow-green-md';
      case 'error':
        return 'border-status-error shadow-[0_0_16px_rgba(255,0,64,0.5)]';
      case 'warning':
        return 'border-status-warning shadow-[0_0_16px_rgba(255,255,0,0.5)]';
      default:
        return 'border-glass-border';
    }
  };

  const getGlowClasses = () => {
    switch (glowColor) {
      case 'green':
        return 'shadow-glow-green-sm hover:shadow-glow-green-md';
      case 'blue':
        return 'shadow-glow-blue-sm hover:shadow-glow-blue-md';
      case 'purple':
        return 'shadow-glow-purple-sm hover:shadow-glow-purple-md';
      case 'red':
        return 'shadow-[0_0_8px_rgba(255,0,64,0.5)] hover:shadow-[0_0_16px_rgba(255,0,64,0.7)]';
      case 'yellow':
        return 'shadow-[0_0_8px_rgba(255,255,0,0.5)] hover:shadow-[0_0_16px_rgba(255,255,0,0.7)]';
      default:
        return 'shadow-glow-blue-sm hover:shadow-glow-blue-md';
    }
  };

  const animationClasses = animate ? 'animate-neon-pulse' : '';

  return (
    <div
      className={`
        relative
        bg-glass-primary
        backdrop-blur-glass-md
        border
        rounded-lg
        p-6
        transition-all
        duration-300
        ease-in-out
        hover:bg-glass-secondary
        hover:border-glass-border-secondary
        group
        ${getStatusClasses()}
        ${getGlowClasses()}
        ${animationClasses}
        ${className}
      `}
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-10 rounded-lg pointer-events-none" />

      {/* Status Indicator */}
      {status !== 'idle' && (
        <div className="absolute top-4 right-4">
          <div
            className={`
              w-3 h-3 rounded-full
              ${status === 'running' ? 'bg-status-success shadow-glow-green-sm animate-pulse' : ''}
              ${status === 'error' ? 'bg-status-error shadow-[0_0_8px_rgba(255,0,64,0.7)] animate-pulse' : ''}
              ${status === 'warning' ? 'bg-status-warning shadow-[0_0_8px_rgba(255,255,0,0.7)] animate-pulse' : ''}
            `}
          />
        </div>
      )}

      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4 relative z-10">
          {title && <h3 className="cyberpunk-heading-2 mb-1">{title}</h3>}
          {subtitle && (
            <p className="cyberpunk-label text-text-secondary">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg pointer-events-none" />
    </div>
  );
};
