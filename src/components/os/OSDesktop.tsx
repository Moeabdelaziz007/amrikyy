import React, { useState } from "react";
import { Clock, Wifi, Battery, Volume2 } from "lucide-react";
import { AppDock } from "./AppDock";
import { WindowManager } from "./WindowManager";

export const OSDesktop = () => {
  const [time, setTime] = useState(new Date());
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appId: string) => {
    if (!openApps.includes(appId)) {
      setOpenApps(prev => [...prev, appId]);
    }
    setActiveApp(appId);
  };

  const closeApp = (appId: string) => {
    setOpenApps(prev => prev.filter(id => id !== appId));
    if (activeApp === appId) {
      setActiveApp(openApps.find(id => id !== appId) || null);
    }
  };

  const minimizeApp = (appId: string) => {
    if (activeApp === appId) {
      setActiveApp(null);
    }
  };

  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Desktop overlay for glass effect */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Top Menu Bar */}
      <div className="relative z-50 h-8 w-full glass border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium bg-gradient-primary bg-clip-text text-transparent">
            AuraOS AI System
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-foreground/80">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Desktop Content Area */}
      <div className="relative flex-1 h-[calc(100vh-8rem)]">
        <WindowManager 
          openApps={openApps}
          activeApp={activeApp}
          onClose={closeApp}
          onMinimize={minimizeApp}
          onFocus={setActiveApp}
        />
      </div>

      {/* App Dock */}
      <AppDock 
        onAppClick={openApp}
        openApps={openApps}
        activeApp={activeApp}
      />
    </div>
  );
};
