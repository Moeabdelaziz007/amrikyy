import React from 'react';

interface IconProps {
  name?: string;
  fallback?: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, fallback = '🔷', size = 28, className = '' }) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: `icon-svg ${className}`,
  } as any;

  switch (name) {
    case 'rocket':
    case 'ai-powered-desktop':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2c.6 0 1 .4 1 1v3l2.2 2.2c.5.5.7 1.2.6 1.9l-.6 4.2c-.1.8-.5 1.5-1.1 2.1l-3.5 3.5c-.4.4-1 .6-1.6.6-.6 0-1.2-.2-1.6-.6L5 18.6C4.4 18 4 17.3 3.9 16.5L3.3 12.3c-.1-.7.1-1.4.6-1.9L6 8V5c0-.6.4-1 1-1h5z" fill="currentColor" />
        </svg>
      );

    case 'file-manager':
    case 'files':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="currentColor" />
        </svg>
      );

    case 'settings':
    case 'gear':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm8.9-3.5a6.8 6.8 0 0 0-.1-1l2.1-1.6-2-3.5-2.5.6a7 7 0 0 0-1.6-.9L16 2h-4l-.7 4.2c-.6.2-1.1.5-1.6.9L7.2 6.4 5.2 9.9 7.3 11.5c-.1.3-.1.6-.1 1s0 .7.1 1L5.2 15.1l2 3.5 2.5-.6c.5.4 1 .7 1.6.9L12 22h4l.7-4.2c.6-.2 1.1-.5 1.6-.9l2.5.6 2-3.5-2.1-1.6c.1-.3.1-.6.1-1z" fill="currentColor" />
        </svg>
      );

    case 'chat':
    case 'telegram':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M21 2L3 9.5a2 2 0 0 0 .5 3.9l3.9 1.1 1.1 3.9a2 2 0 0 0 3.9.5L22 3z" fill="currentColor" />
        </svg>
      );

    case 'calendar':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="none" fill="currentColor" />
        </svg>
      );

    case 'notes':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="currentColor" />
        </svg>
      );

    case 'weather':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M20 18.5A4.5 4.5 0 0 0 15.5 14H9a4 4 0 1 0 0 8h8.5a3.5 3.5 0 0 0 2.5-3.5z" fill="currentColor" />
        </svg>
      );

    case 'cloud':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M19 18H7a4 4 0 0 1 0-8 5 5 0 0 1 10 0h2a3 3 0 0 1 0 6z" fill="currentColor" />
        </svg>
      );

    default:
      return (
        <span className={`icon-fallback ${className}`} style={{ fontSize: size }}>
          {fallback}
        </span>
      );
  }
};

export default Icon;

