import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setShowInstallBanner(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ PWA installation accepted');
      } else {
        console.log('❌ PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowInstallBanner(false);
    } catch (error) {
      console.error('❌ PWA installation error:', error);
    }
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    // Store dismissal in localStorage to avoid showing again immediately
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled) {
    return (
      <div className="pwa-installed-banner">
        <div className="banner-content">
          <span className="banner-icon">📱</span>
          <span className="banner-text">App installed successfully!</span>
        </div>
      </div>
    );
  }

  if (!showInstallBanner || !isInstallable) {
    return null;
  }

  return (
    <div className="pwa-install-banner">
      <div className="banner-content">
        <div className="banner-info">
          <span className="banner-icon">🚀</span>
          <div className="banner-text">
            <div className="banner-title">Install Amrikyy AIOS</div>
            <div className="banner-subtitle">Add to home screen for quick access</div>
          </div>
        </div>
        <div className="banner-actions">
          <button className="install-btn" onClick={handleInstallClick}>
            Install
          </button>
          <button className="dismiss-btn" onClick={handleDismissBanner}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-indicator">
      <div className="offline-content">
        <span className="offline-icon">📡</span>
        <span className="offline-text">You're offline</span>
      </div>
    </div>
  );
};

export const MobileOptimizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    const checkPWA = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const iosStandalone = (window.navigator as any).standalone;
      setIsPWA(standalone || iosStandalone);
    };

    checkMobile();
    checkPWA();

    window.addEventListener('resize', checkMobile);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPWA);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkPWA);
    };
  }, []);

  return (
    <div className={`mobile-optimization-provider ${isMobile ? 'mobile' : 'desktop'} ${isPWA ? 'pwa' : 'browser'}`}>
      <PWAInstallManager />
      <OfflineIndicator />
      {children}
    </div>
  );
};

export default PWAInstallManager;
