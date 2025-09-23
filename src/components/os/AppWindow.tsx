import React, { useState } from "react";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  style
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
        y: e.clientY - position.y
      });
      onFocus();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      className={cn(
        "absolute glass-strong rounded-xl overflow-hidden border border-white/20 transition-all duration-300",
        isActive ? "shadow-glow-primary" : "shadow-glass",
        isMaximized ? "inset-4" : "w-[800px] h-[600px]",
        isDragging && "transition-none",
        !isActive && "opacity-90"
      )}
      style={{
        ...style,
        ...(isMaximized ? {} : {
          left: position.x,
          top: position.y
        })
      }}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div
        className={cn(
          "h-10 glass border-b border-white/10 flex items-center justify-between px-4 cursor-move",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-3">
          {/* Traffic lights */}
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
            />
            <button
              onClick={toggleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
            />
          </div>
          
          <span className="text-sm font-medium text-foreground">
            {title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-destructive/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-2.5rem)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};
