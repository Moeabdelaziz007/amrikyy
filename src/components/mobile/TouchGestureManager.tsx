import React, { useState, useEffect, useRef } from 'react';

interface TouchGesture {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress' | 'doubletap';
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  duration?: number;
  scale?: number;
}

interface TouchGestureConfig {
  swipeThreshold: number;
  pinchThreshold: number;
  longPressDuration: number;
  doubleTapDelay: number;
  enableHapticFeedback: boolean;
}

const defaultConfig: TouchGestureConfig = {
  swipeThreshold: 50,
  pinchThreshold: 0.1,
  longPressDuration: 500,
  doubleTapDelay: 300,
  enableHapticFeedback: true
};

export const TouchGestureManager: React.FC<{
  onGesture: (gesture: TouchGesture) => void;
  config?: Partial<TouchGestureConfig>;
  children: React.ReactNode;
}> = ({ onGesture, config = {}, children }) => {
  const [touchState, setTouchState] = useState({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    touchCount: 0,
    isLongPress: false,
    longPressTimer: null as NodeJS.Timeout | null
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const finalConfig = { ...defaultConfig, ...config };

  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!finalConfig.enableHapticFeedback) return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Touch start handler
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    setTouchState(prev => ({
      ...prev,
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: now,
      touchCount: e.touches.length,
      isLongPress: false
    }));

    // Start long press timer
    const longPressTimer = setTimeout(() => {
      setTouchState(prev => ({ ...prev, isLongPress: true }));
      triggerHaptic('medium');
      onGesture({
        type: 'longpress',
        duration: finalConfig.longPressDuration
      });
    }, finalConfig.longPressDuration);

    setTouchState(prev => ({ ...prev, longPressTimer }));
  };

  // Touch move handler
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
      setTouchState(prev => ({ ...prev, longPressTimer: null }));
    }

    if (e.touches.length === 2) {
      // Handle pinch gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const initialDistance = Math.sqrt(
        Math.pow(touchState.startX - touch1.clientX, 2) +
        Math.pow(touchState.startY - touch1.clientY, 2)
      );
      
      const scale = distance / initialDistance;
      
      if (Math.abs(scale - 1) > finalConfig.pinchThreshold) {
        triggerHaptic('light');
        onGesture({
          type: 'pinch',
          scale: scale
        });
      }
    }
  };

  // Touch end handler
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
      setTouchState(prev => ({ ...prev, longPressTimer: null }));
    }

    if (touchState.isLongPress) {
      return; // Long press already handled
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    const deltaTime = Date.now() - touchState.startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Handle swipe gestures
    if (distance > finalConfig.swipeThreshold && deltaTime < 300) {
      let direction: 'left' | 'right' | 'up' | 'down';
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      triggerHaptic('light');
      onGesture({
        type: 'swipe',
        direction,
        distance,
        duration: deltaTime
      });
      return;
    }

    // Handle tap gestures
    if (distance < 10 && deltaTime < 200) {
      const now = Date.now();
      const timeSinceLastTap = now - touchState.lastTapTime;
      
      if (timeSinceLastTap < finalConfig.doubleTapDelay) {
        // Double tap
        triggerHaptic('medium');
        onGesture({
          type: 'doubletap',
          duration: deltaTime
        });
      } else {
        // Single tap
        triggerHaptic('light');
        onGesture({
          type: 'tap',
          duration: deltaTime
        });
      }
      
      setTouchState(prev => ({ ...prev, lastTapTime: now }));
    }
  };

  // Touch cancel handler
  const handleTouchCancel = () => {
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
      setTouchState(prev => ({ ...prev, longPressTimer: null }));
    }
  };

  return (
    <div
      ref={elementRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
    </div>
  );
};

// Mobile-optimized app launcher component
export const MobileAppLauncher: React.FC<{
  apps: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  onAppSelect: (appId: string) => void;
}> = ({ apps, onAppSelect }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const appsPerPage = 8;
  const totalPages = Math.ceil(apps.length / appsPerPage);

  const handleGesture = (gesture: TouchGesture) => {
    switch (gesture.type) {
      case 'swipe':
        if (gesture.direction === 'left' && currentPage < totalPages - 1) {
          setCurrentPage(prev => prev + 1);
        } else if (gesture.direction === 'right' && currentPage > 0) {
          setCurrentPage(prev => prev - 1);
        }
        break;
      case 'longpress':
        // Show app context menu
        console.log('Long press detected');
        break;
    }
  };

  const handleAppClick = (appId: string) => {
    onAppSelect(appId);
  };

  const renderAppGrid = () => {
    const startIndex = currentPage * appsPerPage;
    const endIndex = Math.min(startIndex + appsPerPage, apps.length);
    const pageApps = apps.slice(startIndex, endIndex);

    return (
      <div className="mobile-app-grid">
        {pageApps.map((app) => (
          <TouchGestureManager
            key={app.id}
            onGesture={handleGesture}
            config={{ enableHapticFeedback: true }}
          >
            <div
              className="mobile-app-icon"
              onClick={() => handleAppClick(app.id)}
              style={{ '--app-color': app.color } as React.CSSProperties}
            >
              <div className="app-icon-content">
                <span className="app-icon-emoji">{app.icon}</span>
                <span className="app-icon-name">{app.name}</span>
              </div>
            </div>
          </TouchGestureManager>
        ))}
      </div>
    );
  };

  return (
    <div className="mobile-app-launcher">
      <div className="launcher-header">
        <h2>Amrikyy AIOS</h2>
        <div className="page-indicator">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={`indicator-dot ${i === currentPage ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      
      <TouchGestureManager onGesture={handleGesture}>
        <div className="app-container">
          {renderAppGrid()}
        </div>
      </TouchGestureManager>
      
      <div className="launcher-footer">
        <button className="nav-btn" onClick={() => setCurrentPage(0)}>
          📱 Apps
        </button>
        <button className="nav-btn" onClick={() => setCurrentPage(1)}>
          🎮 Gaming
        </button>
        <button className="nav-btn" onClick={() => setCurrentPage(2)}>
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
};

// Mobile-optimized window manager
export const MobileWindowManager: React.FC<{
  activeApp: string | null;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ activeApp, onClose, children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [swipeStartY, setSwipeStartY] = useState(0);

  const handleGesture = (gesture: TouchGesture) => {
    switch (gesture.type) {
      case 'swipe':
        if (gesture.direction === 'down' && gesture.distance > 100) {
          onClose();
        }
        break;
      case 'doubletap':
        setIsFullscreen(prev => !prev);
        break;
    }
  };

  return (
    <TouchGestureManager onGesture={handleGesture}>
      <div className={`mobile-window ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="mobile-window-header">
          <div className="window-controls">
            <button className="control-btn" onClick={onClose}>
              ✕
            </button>
            <button 
              className="control-btn" 
              onClick={() => setIsFullscreen(prev => !prev)}
            >
              {isFullscreen ? '⤓' : '⤢'}
            </button>
          </div>
          <div className="window-title">
            {activeApp || 'Amrikyy AIOS'}
          </div>
        </div>
        
        <div className="mobile-window-content">
          {children}
        </div>
        
        {!isFullscreen && (
          <div className="mobile-window-handle">
            <div className="handle-bar" />
          </div>
        )}
      </div>
    </TouchGestureManager>
  );
};

export default TouchGestureManager;
