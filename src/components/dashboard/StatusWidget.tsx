import React from 'react';

interface StatusWidgetProps {
  label: string;
  value: string | number;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  icon?: React.ReactNode;
  animate?: boolean;
  onClick?: () => void;
}

export const StatusWidget: React.FC<StatusWidgetProps> = ({
  label,
  value,
  type = 'default',
  icon,
  animate = false,
  onClick,
}) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'text-status-success border-status-success bg-status-success-bg';
      case 'error':
        return 'text-status-error border-status-error bg-status-error-bg';
      case 'warning':
        return 'text-status-warning border-status-warning bg-status-warning-bg';
      case 'info':
        return 'text-status-info border-status-info bg-status-info-bg';
      default:
        return 'text-text-primary border-glass-border bg-glass-primary';
    }
  };

  const animationClasses = animate ? 'animate-cyber-pulse' : '';
  const clickableClasses = onClick
    ? 'cursor-pointer hover:scale-105 active:scale-95'
    : '';

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-2
        rounded-md
        border
        backdrop-blur-glass-sm
        transition-all
        duration-200
        ${getTypeClasses()}
        ${animationClasses}
        ${clickableClasses}
      `}
      onClick={onClick}
    >
      {icon && (
        <div className="w-4 h-4 flex items-center justify-center">{icon}</div>
      )}

      <div className="flex flex-col items-center min-w-0">
        <span className="cyberpunk-label text-xs">{label}</span>
        <span className="cyberpunk-status font-mono font-bold text-sm">
          {value}
        </span>
      </div>
    </div>
  );
};
