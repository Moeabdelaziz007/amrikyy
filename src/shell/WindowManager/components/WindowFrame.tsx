import React, { useRef, useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import type { WindowState } from '../index';

interface Props {
  window: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  children: React.ReactNode;
}

const WindowFrame: React.FC<Props> = ({ 
  window, 
  onClose, 
  onFocus, 
  onDrag, 
  onMinimize, 
  onMaximize, 
  onResize,
  children 
}) => {
  const constraintsRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0,
    mouseX: 0,
    mouseY: 0
  });

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (!window.isMaximized) {
      onDrag(window.id, info.point.x, info.point.y);
    }
  };

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({ 
      x: window.x,
      y: window.y,
      width: window.width, 
      height: window.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.mouseX;
    const deltaY = e.clientY - resizeStart.mouseY;
    
    let newX = window.x;
    let newY = window.y;
    let newWidth = window.width;
    let newHeight = window.height;

    // Handle different resize directions
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(300, resizeStart.width + deltaX);
    }
    if (resizeDirection.includes('w')) {
      newWidth = Math.max(300, resizeStart.width - deltaX);
      newX = resizeStart.x + (resizeStart.width - newWidth);
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(200, resizeStart.height + deltaY);
    }
    if (resizeDirection.includes('n')) {
      newHeight = Math.max(200, resizeStart.height - deltaY);
      newY = resizeStart.y + (resizeStart.height - newHeight);
    }

    // Update position if needed (for north/west resizing)
    if (newX !== window.x || newY !== window.y) {
      onDrag(window.id, newX, newY);
    }
    
    onResize(window.id, newWidth, newHeight);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection('');
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = `${resizeDirection}-resize`;
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.cursor = 'default';
      };
    }
  }, [isResizing, resizeStart, resizeDirection]);

  // Don't render minimized windows
  if (window.isMinimized) {
    return null;
  }

  return (
    <motion.div
      ref={constraintsRef}
      className={`aura-window glass ${window.focused ? 'glow-astro' : 'window-unfocused'}`}
      style={{
        position: 'absolute',
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.z,
      }}
      // Initial animation when window opens
      initial={{ 
        scale: 0.8, 
        opacity: 0,
        y: window.y + 50 
      }}
      // Animate to normal state
      animate={{ 
        scale: 1, 
        opacity: window.focused ? 1 : 0.7,
        y: window.y,
        filter: window.focused ? 'blur(0px)' : 'blur(2px)',
      }}
      // Exit animation when window closes
      exit={{ 
        scale: 0.8, 
        opacity: 0,
        y: window.y + 50,
        transition: { duration: 0.2 }
      }}
      // Drag configuration (disabled when maximized)
      drag={!window.isMaximized}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraintsRef}
      onDragEnd={handleDragEnd}
      // Tap animation - bring to front
      whileTap={{ 
        scale: 1.02,
        transition: { duration: 0.1 }
      }}
      // Hover effect
      whileHover={{
        boxShadow: window.focused 
          ? '0 0 40px rgba(0, 246, 255, 0.6)' 
          : '0 0 20px rgba(255, 255, 255, 0.2)',
      }}
      // Smooth transitions
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 }
      }}
      // Focus on click
      onClick={() => !window.focused && onFocus(window.id)}
    >
      {/* Titlebar - Drag handle */}
      <motion.div 
        className="aura-window__titlebar flex items-center justify-between px-3 py-2 border-b border-white/20 cursor-move"
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      >
        <div className="aura-window__title text-sm font-medium text-white flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-gradient-to-r from-[#00f6ff] to-[#ff00f4]"
            animate={{
              scale: window.focused ? [1, 1.2, 1] : 1,
              opacity: window.focused ? 1 : 0.5,
            }}
            transition={{
              duration: 2,
              repeat: window.focused ? Infinity : 0,
              ease: 'easeInOut'
            }}
          />
          {window.appId}
        </div>
        
        {/* Window Controls */}
        <div className="flex items-center gap-1">
          {/* Minimize Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(window.id);
            }}
            className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Minimize"
            title="Minimize"
          >
            <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor">
              <rect width="12" height="2" rx="1"/>
            </svg>
          </motion.button>
          
          {/* Maximize/Restore Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(window.id);
            }}
            className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={window.isMaximized ? "Restore" : "Maximize"}
            title={window.isMaximized ? "Restore" : "Maximize"}
          >
            {window.isMaximized ? (
              // Restore icon (two overlapping squares)
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <path d="M2 6V2C2 1.44772 2.44772 1 3 1H9"/>
              </svg>
            ) : (
              // Maximize icon (single square)
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="10" height="10" rx="1"/>
              </svg>
            )}
          </motion.button>
          
          {/* Close Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onClose(window.id);
            }}
            className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close"
            title="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2L10 10M10 2L2 10"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Window Content */}
      <div className="aura-window__content h-[calc(100%-40px)] overflow-auto">
        {children}
      </div>

      {/* Resize Handles - Only show when not maximized */}
      {!window.isMaximized && (
        <>
          {/* Corner Resize Handles */}
          <motion.div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(0, 246, 255, 0.3) 50%)',
            }}
            whileHover={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(0, 246, 255, 0.6) 50%)',
              scale: 1.2,
            }}
            onMouseDown={handleResizeStart('se')}
          />
          
          <motion.div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10"
            style={{
              background: 'linear-gradient(225deg, transparent 50%, rgba(0, 246, 255, 0.3) 50%)',
            }}
            whileHover={{
              background: 'linear-gradient(225deg, transparent 50%, rgba(0, 246, 255, 0.6) 50%)',
              scale: 1.2,
            }}
            onMouseDown={handleResizeStart('sw')}
          />
          
          <motion.div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10"
            style={{
              background: 'linear-gradient(45deg, transparent 50%, rgba(0, 246, 255, 0.3) 50%)',
            }}
            whileHover={{
              background: 'linear-gradient(45deg, transparent 50%, rgba(0, 246, 255, 0.6) 50%)',
              scale: 1.2,
            }}
            onMouseDown={handleResizeStart('ne')}
          />
          
          <motion.div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10"
            style={{
              background: 'linear-gradient(315deg, transparent 50%, rgba(0, 246, 255, 0.3) 50%)',
            }}
            whileHover={{
              background: 'linear-gradient(315deg, transparent 50%, rgba(0, 246, 255, 0.6) 50%)',
              scale: 1.2,
            }}
            onMouseDown={handleResizeStart('nw')}
          />
          
          {/* Edge Resize Handles */}
          <motion.div
            className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize hover:bg-[#00f6ff]/30 transition-colors"
            onMouseDown={handleResizeStart('s')}
          />
          
          <motion.div
            className="absolute top-4 bottom-4 right-0 w-2 cursor-e-resize hover:bg-[#00f6ff]/30 transition-colors"
            onMouseDown={handleResizeStart('e')}
          />
          
          <motion.div
            className="absolute top-0 left-4 right-4 h-2 cursor-n-resize hover:bg-[#00f6ff]/30 transition-colors"
            onMouseDown={handleResizeStart('n')}
          />
          
          <motion.div
            className="absolute top-4 bottom-4 left-0 w-2 cursor-w-resize hover:bg-[#00f6ff]/30 transition-colors"
            onMouseDown={handleResizeStart('w')}
          />
        </>
      )}
    </motion.div>
  );
};

export default WindowFrame;


