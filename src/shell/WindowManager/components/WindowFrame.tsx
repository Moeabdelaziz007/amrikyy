import React from 'react';
import type { WindowState } from '../index';

interface Props {
  window: WindowState;
  onClose: (id: string) => void;
  children: React.ReactNode;
}

const WindowFrame: React.FC<Props> = ({ window, onClose, children }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: window.x,
    top: window.y,
    width: window.width,
    height: window.height,
    zIndex: window.z,
  };
  return (
    <div 
      className={`aura-window glass ${window.focused ? 'glow-astro' : ''}`} 
      style={style}
    >
      <div className="aura-window__titlebar flex items-center justify-between px-3 py-2 border-b border-white/20">
        <div className="aura-window__title text-sm font-medium text-white">{window.appId}</div>
        <button 
          onClick={() => onClose(window.id)} 
          className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="aura-window__content h-[calc(100%-40px)] overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;


