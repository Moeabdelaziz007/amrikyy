import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppWindowProps {
  appId: string;
  title: string;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const AppWindow = ({
  title,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  children,
  style,
}: AppWindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMaximized) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      onFocus();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      className={cn(
        'absolute glass-strong rounded-xl overflow-hidden border border-white/20 transition-all duration-300 backdrop-blur-xl',
        isActive
          ? 'shadow-glow-primary shadow-2xl border-primary/30'
          : 'shadow-glass shadow-lg',
        isMaximized ? 'inset-4' : 'w-[800px] h-[600px]',
        isDragging && 'transition-none',
        !isActive && 'opacity-90 scale-[0.98]'
      )}
      style={{
        ...style,
        ...(isMaximized
          ? {}
          : {
              left: position.x,
              top: position.y,
            }),
      }}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div
        className={cn(
          'h-12 glass border-b border-white/10 flex items-center justify-between px-4 cursor-move backdrop-blur-md',
          isDragging && 'cursor-grabbing',
          isActive && 'bg-gradient-to-r from-primary/10 to-secondary/10'
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-3">
          {/* Traffic lights */}
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-all duration-200 hover:scale-110 shadow-sm"
              title="Close window"
              aria-label="Close window"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all duration-200 hover:scale-110 shadow-sm"
              title="Minimize window"
              aria-label="Minimize window"
            />
            <button
              onClick={toggleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-all duration-200 hover:scale-110 shadow-sm"
              title="Maximize window"
              aria-label="Maximize window"
            />
          </div>

          <span className="text-sm font-semibold text-foreground/90 tracking-wide">
            {title}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-white/10 rounded-md transition-all duration-200 hover:scale-105"
            title="Minimize window"
            aria-label="Minimize window"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMaximize}
            className="p-2 hover:bg-white/10 rounded-md transition-all duration-200 hover:scale-105"
            title={isMaximized ? 'Restore window' : 'Maximize window'}
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-500/20 rounded-md transition-all duration-200 hover:scale-105"
            title="Close window"
            aria-label="Close window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-3rem)] overflow-hidden bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};
