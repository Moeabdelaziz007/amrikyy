'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LoadingSpinner = LoadingSpinner;
exports.LoadingOverlay = LoadingOverlay;
exports.LoadingButton = LoadingButton;
exports.LoadingCard = LoadingCard;
exports.Skeleton = Skeleton;
exports.SkeletonText = SkeletonText;
const utils_1 = require('@/lib/utils');
const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};
function LoadingSpinner({ size = 'md', variant = 'default', className, text }) {
  const baseClasses = 'animate-spin';
  const sizeClass = sizeClasses[size];
  const getVariantClasses = () => {
    switch (variant) {
      case 'cyber':
        return 'text-primary border-primary border-t-transparent';
      case 'neon':
        return 'text-primary border-primary border-t-transparent neon-glow-sm';
      case 'pulse':
        return 'text-primary animate-pulse';
      default:
        return 'text-primary border-primary border-t-transparent';
    }
  };
  if (variant === 'pulse') {
    return (
      <div
        className={(0, utils_1.cn)(
          'flex items-center justify-center',
          className
        )}
      >
        <div
          className={(0, utils_1.cn)(
            'rounded-full bg-primary',
            sizeClass,
            'animate-pulse'
          )}
        />
        {text && (
          <span className="ml-2 text-sm text-muted-foreground animate-pulse">
            {text}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className={(0, utils_1.cn)('flex items-center justify-center', className)}
    >
      <div
        className={(0, utils_1.cn)(
          'rounded-full border-2',
          sizeClass,
          baseClasses,
          getVariantClasses()
        )}
      />
      {text && (
        <span className="ml-2 text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
}
function LoadingOverlay({
  isLoading,
  text = 'Loading...',
  variant = 'default',
  className,
  children,
}) {
  if (!isLoading) return <>{children}</>;
  return (
    <div className={(0, utils_1.cn)('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" variant={variant} />
          <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}
function LoadingButton({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  variant = 'default',
  disabled,
  className,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={(0, utils_1.cn)(
        'relative inline-flex items-center justify-center',
        'px-4 py-2 rounded-md font-medium',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'cyber' && 'neon-button',
        variant === 'neon' && 'neon-glow-sm hover:neon-glow-md',
        className
      )}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" variant={variant} />
          <span className="ml-2">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
function LoadingCard({
  isLoading,
  loadingText = 'Loading...',
  variant = 'default',
  className,
  children,
}) {
  if (!isLoading) return <>{children}</>;
  return (
    <div className={(0, utils_1.cn)('glass-card p-8 text-center', className)}>
      <LoadingSpinner size="lg" variant={variant} />
      <p className="mt-4 text-sm text-muted-foreground">{loadingText}</p>
    </div>
  );
}
function Skeleton({ className, variant = 'rectangular', animation = 'pulse' }) {
  const baseClasses = 'bg-muted animate-pulse';
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
      default:
        return 'rounded-md';
    }
  };
  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted';
      case 'none':
        return '';
      case 'pulse':
      default:
        return 'animate-pulse';
    }
  };
  return (
    <div
      className={(0, utils_1.cn)(
        baseClasses,
        getVariantClasses(),
        getAnimationClasses(),
        className
      )}
    />
  );
}
function SkeletonText({ lines = 3, className }) {
  return (
    <div className={(0, utils_1.cn)('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={(0, utils_1.cn)(
            index === lines - 1 && 'w-3/4' // Last line is shorter
          )}
        />
      ))}
    </div>
  );
}
