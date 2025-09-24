'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

// Modal types and interfaces
export interface ModalConfig {
  id: string;
  title?: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'glass' | 'neon' | 'minimal';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  draggable?: boolean;
  resizable?: boolean;
  showControls?: boolean;
  closable?: boolean;
  backdrop?: boolean;
  backdropClose?: boolean;
  zIndex?: number;
  onClose?: () => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
}

interface ModalState extends Omit<ModalConfig, 'position' | 'size'> {
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  modalPosition: 'center' | 'top' | 'bottom' | 'left' | 'right';
  modalSize: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface ModalManagerContextType {
  modals: ModalState[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
  maximizeModal: (id: string) => void;
  minimizeModal: (id: string) => void;
  restoreModal: (id: string) => void;
  closeAllModals: () => void;
  bringToFront: (id: string) => void;
}

const ModalManagerContext = React.createContext<ModalManagerContextType | undefined>(undefined);

export const useModalManager = () => {
  const context = React.useContext(ModalManagerContext);
  if (!context) {
    throw new Error('useModalManager must be used within a ModalManagerProvider');
  }
  return context;
};

// Modal Manager Provider
interface ModalManagerProviderProps {
  children: React.ReactNode;
  maxZIndex?: number;
  defaultConfig?: Partial<ModalConfig>;
}

export const ModalManagerProvider: React.FC<ModalManagerProviderProps> = ({
  children,
  maxZIndex = 1000,
  defaultConfig = {},
}) => {
  const [modals, setModals] = React.useState<ModalState[]>([]);
  const [nextZIndex, setNextZIndex] = React.useState(maxZIndex);

  const openModal = React.useCallback((config: Omit<ModalConfig, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal: ModalState = {
      id,
      modalSize: 'md',
      variant: 'glass',
      modalPosition: 'center',
      draggable: true,
      resizable: true,
      showControls: true,
      closable: true,
      backdrop: true,
      backdropClose: true,
      isOpen: true,
      isMaximized: false,
      isMinimized: false,
      position: { x: 0, y: 0 },
      size: { width: 600, height: 400 },
      ...defaultConfig,
      ...config,
      modalSize: config.size || defaultConfig.size || 'md',
      modalPosition: config.position || defaultConfig.position || 'center',
      zIndex: nextZIndex + 1,
    };

    setModals(prev => [...prev, newModal]);
    setNextZIndex(prev => prev + 1);
    return id;
  }, [defaultConfig, nextZIndex]);

  const closeModal = React.useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const updateModal = React.useCallback((id: string, updates: Partial<ModalConfig>) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, ...updates } : modal
    ));
  }, []);

  const maximizeModal = React.useCallback((id: string) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, isMaximized: true, isMinimized: false } : modal
    ));
  }, []);

  const minimizeModal = React.useCallback((id: string) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, isMinimized: true, isMaximized: false } : modal
    ));
  }, []);

  const restoreModal = React.useCallback((id: string) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, isMaximized: false, isMinimized: false } : modal
    ));
  }, []);

  const closeAllModals = React.useCallback(() => {
    setModals([]);
  }, []);

  const bringToFront = React.useCallback((id: string) => {
    setModals(prev => prev.map(modal => 
      modal.id === id 
        ? { ...modal, zIndex: nextZIndex + 1 }
        : modal
    ));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  return (
    <ModalManagerContext.Provider value={{
      modals,
      openModal,
      closeModal,
      updateModal,
      maximizeModal,
      minimizeModal,
      restoreModal,
      closeAllModals,
      bringToFront,
    }}>
      {children}
      <ModalContainer />
    </ModalManagerContext.Provider>
  );
};

// Modal Container
const ModalContainer: React.FC = () => {
  const { modals, closeModal, maximizeModal, minimizeModal, restoreModal, bringToFront } = useModalManager();

  if (modals.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {modals.map((modal) => (
        <ModalInstance
          key={modal.id}
          modal={modal}
          onClose={() => {
            modal.onClose?.();
            closeModal(modal.id);
          }}
          onMaximize={() => {
            modal.onMaximize?.();
            maximizeModal(modal.id);
          }}
          onMinimize={() => {
            modal.onMinimize?.();
            minimizeModal(modal.id);
          }}
          onRestore={() => restoreModal(modal.id)}
          onFocus={() => bringToFront(modal.id)}
        />
      ))}
    </div>,
    document.body
  );
};

// Individual Modal Instance
interface ModalInstanceProps {
  modal: ModalState;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
  onRestore: () => void;
  onFocus: () => void;
}

const ModalInstance: React.FC<ModalInstanceProps> = ({
  modal,
  onClose,
  onMaximize,
  onMinimize,
  onRestore,
  onFocus,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [position, setPosition] = React.useState(modal.position);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modal.draggable || modal.isMaximized) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging && !modal.isMaximized) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragStart.x)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStart.y)),
      });
    }
  }, [isDragging, dragStart, modal.isMaximized]);

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

  const getSizeClasses = () => {
    if (modal.isMaximized) return 'inset-4 w-auto h-auto';
    switch (modal.modalSize) {
      case 'sm': return 'w-96 h-64';
      case 'md': return 'w-[600px] h-[400px]';
      case 'lg': return 'w-[800px] h-[600px]';
      case 'xl': return 'w-[1000px] h-[700px]';
      case 'full': return 'w-[95vw] h-[95vh]';
      default: return 'w-[600px] h-[400px]';
    }
  };

  const getVariantClasses = () => {
    switch (modal.variant) {
      case 'glass':
        return 'bg-background/10 backdrop-blur-xl border border-white/20 shadow-2xl';
      case 'neon':
        return 'bg-background/95 border-2 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]';
      case 'minimal':
        return 'bg-background border-0 shadow-none';
      default:
        return 'bg-background/95 border border-border/50 shadow-lg';
    }
  };

  const getPositionClasses = () => {
    if (modal.isMaximized) return 'inset-4';
    switch (modal.modalPosition) {
      case 'top': return 'top-8 left-1/2 -translate-x-1/2';
      case 'bottom': return 'bottom-8 left-1/2 -translate-x-1/2';
      case 'left': return 'left-8 top-1/2 -translate-y-1/2';
      case 'right': return 'right-8 top-1/2 -translate-y-1/2';
      default: return 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  if (modal.isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 w-64 h-12 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg pointer-events-auto cursor-pointer"
        style={{ zIndex: modal.zIndex }}
        onClick={onRestore}
      >
        <div className="flex items-center justify-between h-full px-4">
          <span className="text-sm font-medium truncate">{modal.title || 'Modal'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      {modal.backdrop && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          style={{ zIndex: modal.zIndex! - 1 }}
          onClick={modal.backdropClose ? onClose : undefined}
        />
      )}

      {/* Modal */}
      <div
        className={cn(
          'fixed pointer-events-auto rounded-2xl overflow-hidden transition-all duration-300',
          getSizeClasses(),
          getVariantClasses(),
          getPositionClasses(),
          isDragging && 'transition-none',
          modal.isMaximized && 'animate-in zoom-in-95 duration-300'
        )}
        style={{ 
          zIndex: modal.zIndex,
          ...(modal.modalPosition === 'center' && !modal.isMaximized && {
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
          })
        }}
        onClick={onFocus}
      >
        {/* Header */}
        {modal.showControls && (
          <div
            className={cn(
              'flex items-center justify-between p-4 border-b border-border/20 cursor-move select-none',
              modal.variant === 'glass' && 'bg-white/5 backdrop-blur-sm',
              modal.variant === 'neon' && 'bg-primary/10 border-primary/30',
              isDragging && 'cursor-grabbing'
            )}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-3">
              {/* Traffic Light Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={onMinimize}
                  className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Minimize"
                />
                <button
                  onClick={modal.isMaximized ? onRestore : onMaximize}
                  className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-all duration-200 hover:scale-110 shadow-sm"
                  title={modal.isMaximized ? 'Restore' : 'Maximize'}
                />
                {modal.closable && (
                  <button
                    onClick={onClose}
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-all duration-200 hover:scale-110 shadow-sm"
                    title="Close"
                  />
                )}
              </div>
              {modal.title && (
                <span className="text-sm font-semibold text-foreground/90 tracking-wide">
                  {modal.title}
                </span>
              )}
            </div>

            {/* Action Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="h-8 w-8 p-0 hover:bg-white/10"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={modal.isMaximized ? onRestore : onMaximize}
                className="h-8 w-8 p-0 hover:bg-white/10"
              >
                {modal.isMaximized ? <RotateCcw className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              {modal.closable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'p-6 overflow-auto h-full',
          modal.variant === 'glass' && 'bg-gradient-to-br from-white/5 to-transparent',
          modal.variant === 'neon' && 'bg-background/95'
        )}>
          {modal.content}
        </div>
      </div>
    </>
  );
};

// Hook for easy modal usage
export const useModal = () => {
  const { openModal, closeModal, updateModal } = useModalManager();

  const showModal = React.useCallback((config: Omit<ModalConfig, 'id'>) => {
    return openModal(config);
  }, [openModal]);

  const hideModal = React.useCallback((id: string) => {
    closeModal(id);
  }, [closeModal]);

  const modifyModal = React.useCallback((id: string, updates: Partial<ModalConfig>) => {
    updateModal(id, updates);
  }, [updateModal]);

  return { showModal, hideModal, modifyModal };
};
