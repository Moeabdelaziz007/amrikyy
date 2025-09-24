'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import './enhanced-popups.css';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

// Toast interface
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  position?: ToastPosition;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

// Toast context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
interface ToastProviderProps {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = 'top-right',
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: defaultDuration,
      position: defaultPosition,
      dismissible: true,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [defaultDuration, defaultPosition]);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const updateToast = React.useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer: React.FC = () => {
  const { toasts } = useToast();
  
  // Group toasts by position
  const groupedToasts = React.useMemo(() => {
    const groups: Record<ToastPosition, Toast[]> = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    };

    toasts.forEach(toast => {
      const position = toast.position || 'top-right';
      groups[position].push(toast);
    });

    return groups;
  }, [toasts]);

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <ToastGroup
          key={position}
          position={position as ToastPosition}
          toasts={positionToasts}
        />
      ))}
    </>
  );
};

// Toast Group
interface ToastGroupProps {
  position: ToastPosition;
  toasts: Toast[];
}

const ToastGroup: React.FC<ToastGroupProps> = ({ position, toasts }) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  if (toasts.length === 0) return null;

  return (
    <div className={cn(
      'fixed z-[100] flex flex-col gap-2 max-w-sm w-full',
      positionClasses[position]
    )}>
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
        />
      ))}
    </div>
  );
};

// Individual Toast Item
interface ToastItemProps {
  toast: Toast;
  index: number;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, index }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);

  React.useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return null;
    }
  };

  const getVariantClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-100';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-100';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-100';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-100';
      case 'loading':
        return 'bg-primary/10 border-primary/20 text-primary';
      default:
        return 'bg-background/90 border-border/50 text-foreground';
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform',
        getVariantClasses(),
        isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
        isLeaving && 'translate-x-full opacity-0 scale-95',
        'hover:scale-[1.02] hover:shadow-3xl'
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm mb-1">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90 leading-relaxed">
            {toast.description}
          </div>
        )}
        
        {/* Action Button */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-xs font-medium underline hover:no-underline transition-all duration-200"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Dismiss Button */}
      {toast.dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors duration-200 opacity-70 hover:opacity-100"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-xl animate-progress" />
      )}
    </div>
  );
};

// Hook for easy toast usage
export const useToastNotifications = () => {
  const { addToast } = useToast();

  const success = React.useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'success', title, description, ...options });
  }, [addToast]);

  const error = React.useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'error', title, description, ...options });
  }, [addToast]);

  const warning = React.useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'warning', title, description, ...options });
  }, [addToast]);

  const info = React.useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'info', title, description, ...options });
  }, [addToast]);

  const loading = React.useCallback((title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'loading', title, description, duration: 0, ...options });
  }, [addToast]);

  return { success, error, warning, info, loading };
};

