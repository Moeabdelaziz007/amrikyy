// Mobile & Cross-Platform System
class MobilePlatform {
    constructor() {
        this.platform = this.detectPlatform();
        this.deviceInfo = {};
        this.capabilities = {};
        this.syncManager = null;
        this.offlineManager = null;
        this.pushManager = null;
        
        this.init();
    }

    init() {
        this.detectDeviceInfo();
        this.setupPlatformCapabilities();
        this.initializeSyncManager();
        this.setupOfflineManager();
        this.setupPushNotifications();
        this.setupMobileOptimizations();
        this.setupCrossPlatformFeatures();
    }

    // Platform Detection
    detectPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/android/.test(userAgent)) {
            return 'android';
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
            return 'ios';
        } else if (/windows/.test(userAgent)) {
            return 'windows';
        } else if (/macintosh|mac os x/.test(userAgent)) {
            return 'macos';
        } else if (/linux/.test(userAgent)) {
            return 'linux';
        } else if (window.electron) {
            return 'electron';
        } else if (window.ReactNativeWebView) {
            return 'react-native';
        } else {
            return 'web';
        }
    }

    detectDeviceInfo() {
        this.deviceInfo = {
            platform: this.platform,
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio,
            orientation: this.getOrientation(),
            touchSupport: 'ontouchstart' in window,
            connectionType: this.getConnectionType(),
            batteryLevel: null,
            isOnline: navigator.onLine,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        // Get battery info if available
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.deviceInfo.batteryLevel = Math.round(battery.level * 100);
                this.deviceInfo.isCharging = battery.charging;
            });
        }

        // Get connection info if available
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.deviceInfo.connectionType = connection.effectiveType;
            this.deviceInfo.downlink = connection.downlink;
            this.deviceInfo.rtt = connection.rtt;
        }
    }

    getOrientation() {
        if (screen.orientation) {
            return screen.orientation.type;
        } else if (window.orientation !== undefined) {
            return window.orientation === 0 ? 'portrait-primary' : 'landscape-primary';
        }
        return 'unknown';
    }

    getConnectionType() {
        if ('connection' in navigator) {
            return navigator.connection.effectiveType || 'unknown';
        }
        return 'unknown';
    }

    // Platform Capabilities
    setupPlatformCapabilities() {
        this.capabilities = {
            // Mobile capabilities
            touch: 'ontouchstart' in window,
            gestures: this.supportsGestures(),
            vibration: 'vibrate' in navigator,
            geolocation: 'geolocation' in navigator,
            camera: this.supportsCamera(),
            microphone: this.supportsMicrophone(),
            notifications: 'Notification' in window,
            serviceWorker: 'serviceWorker' in navigator,
            
            // Desktop capabilities
            keyboard: this.supportsKeyboard(),
            mouse: this.supportsMouse(),
            clipboard: this.supportsClipboard(),
            fileSystem: this.supportsFileSystem(),
            
            // Cross-platform capabilities
            webGL: this.supportsWebGL(),
            webRTC: this.supportsWebRTC(),
            webAssembly: this.supportsWebAssembly(),
            indexedDB: 'indexedDB' in window,
            localStorage: 'localStorage' in window,
            sessionStorage: 'sessionStorage' in window
        };

        // Platform-specific optimizations
        this.applyPlatformOptimizations();
    }

    supportsGestures() {
        return 'ontouchstart' in window && 'ontouchmove' in window;
    }

    supportsCamera() {
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    }

    supportsMicrophone() {
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    }

    supportsKeyboard() {
        return !('ontouchstart' in window) || window.innerWidth > 768;
    }

    supportsMouse() {
        return !('ontouchstart' in window) || window.innerWidth > 768;
    }

    supportsClipboard() {
        return navigator.clipboard && navigator.clipboard.writeText;
    }

    supportsFileSystem() {
        return 'showOpenFilePicker' in window || 'showSaveFilePicker' in window;
    }

    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    supportsWebRTC() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    supportsWebAssembly() {
        return typeof WebAssembly === 'object';
    }

    // Platform Optimizations
    applyPlatformOptimizations() {
        // Mobile optimizations
        if (this.isMobile()) {
            this.applyMobileOptimizations();
        }
        
        // Desktop optimizations
        if (this.isDesktop()) {
            this.applyDesktopOptimizations();
        }
        
        // Electron optimizations
        if (this.platform === 'electron') {
            this.applyElectronOptimizations();
        }
        
        // React Native optimizations
        if (this.platform === 'react-native') {
            this.applyReactNativeOptimizations();
        }
    }

    isMobile() {
        return ['android', 'ios'].includes(this.platform);
    }

    isDesktop() {
        return ['windows', 'macos', 'linux'].includes(this.platform);
    }

    applyMobileOptimizations() {
        // Add mobile-specific CSS classes
        document.body.classList.add('mobile-platform');
        
        // Optimize touch interactions
        this.setupTouchOptimizations();
        
        // Add mobile viewport meta tag if not present
        this.ensureMobileViewport();
        
        // Setup mobile-specific event listeners
        this.setupMobileEventListeners();
        
        // Optimize images for mobile
        this.optimizeImagesForMobile();
        
        // Setup mobile navigation
        this.setupMobileNavigation();
    }

    setupTouchOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add touch feedback
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('touchable')) {
                e.target.classList.add('touch-active');
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('touchable')) {
                setTimeout(() => {
                    e.target.classList.remove('touch-active');
                }, 150);
            }
        });
    }

    ensureMobileViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }

    setupMobileEventListeners() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Handle resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleConnectionChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleConnectionChange(false);
        });
    }

    optimizeImagesForMobile() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add mobile-optimized sizes
            if (!img.hasAttribute('sizes')) {
                img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
            }
        });
    }

    setupMobileNavigation() {
        // Create mobile menu if it doesn't exist
        if (!document.querySelector('.mobile-menu')) {
            this.createMobileMenu();
        }
        
        // Setup swipe gestures for navigation
        this.setupSwipeGestures();
    }

    createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="mobile-menu-content">
                <nav class="mobile-nav">
                    <!-- Navigation items will be populated -->
                </nav>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        
        // Add toggle functionality
        const toggle = mobileMenu.querySelector('.mobile-menu-toggle');
        toggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.handleSwipeLeft();
                } else {
                    this.handleSwipeRight();
                }
            }
            
            // Vertical swipe
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
                if (diffY > 0) {
                    this.handleSwipeUp();
                } else {
                    this.handleSwipeDown();
                }
            }
        });
    }

    applyDesktopOptimizations() {
        document.body.classList.add('desktop-platform');
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup desktop-specific features
        this.setupDesktopFeatures();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            // Ctrl/Cmd + / for help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    setupDesktopFeatures() {
        // Drag and drop support
        this.setupDragAndDrop();
        
        // Right-click context menu
        this.setupContextMenu();
        
        // Window management
        this.setupWindowManagement();
    }

    applyElectronOptimizations() {
        document.body.classList.add('electron-platform');
        
        // Electron-specific features
        if (window.electron) {
            this.setupElectronFeatures();
        }
    }

    setupElectronFeatures() {
        // Menu integration
        if (window.electron.menu) {
            this.setupElectronMenu();
        }
        
        // File system access
        if (window.electron.fs) {
            this.setupElectronFileSystem();
        }
        
        // Native notifications
        if (window.electron.notifications) {
            this.setupElectronNotifications();
        }
    }

    applyReactNativeOptimizations() {
        document.body.classList.add('react-native-platform');
        
        // React Native WebView bridge
        if (window.ReactNativeWebView) {
            this.setupReactNativeBridge();
        }
    }

    setupReactNativeBridge() {
        // Send data to React Native
        this.sendToReactNative = (data) => {
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
        };
        
        // Listen for messages from React Native
        document.addEventListener('message', (e) => {
            try {
                const data = JSON.parse(e.data);
                this.handleReactNativeMessage(data);
            } catch (error) {
                console.error('Error parsing React Native message:', error);
            }
        });
    }

    // Data Synchronization
    initializeSyncManager() {
        this.syncManager = new SyncManager();
    }

    class SyncManager {
        constructor() {
            this.syncQueue = [];
            this.syncInProgress = false;
            this.lastSyncTime = null;
            this.syncInterval = 30000; // 30 seconds
            this.conflictResolution = 'server-wins'; // server-wins, client-wins, manual
            
            this.init();
        }

        init() {
            this.setupSyncListeners();
            this.startPeriodicSync();
            this.setupConflictResolution();
        }

        setupSyncListeners() {
            // Listen for online/offline events
            window.addEventListener('online', () => {
                this.syncAll();
            });

            window.addEventListener('offline', () => {
                this.pauseSync();
            });

            // Listen for data changes
            this.setupDataChangeListeners();
        }

        setupDataChangeListeners() {
            // Listen for Firestore changes
            if (firebase.firestore) {
                this.setupFirestoreSync();
            }
            
            // Listen for localStorage changes
            this.setupLocalStorageSync();
        }

        setupFirestoreSync() {
            // Sync user data
            firebase.firestore()
                .collection('users')
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        this.handleFirestoreChange('users', change);
                    });
                });

            // Sync analytics data
            firebase.firestore()
                .collection('analytics')
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        this.handleFirestoreChange('analytics', change);
                    });
                });
        }

        setupLocalStorageSync() {
            // Override localStorage methods to track changes
            const originalSetItem = localStorage.setItem;
            const originalRemoveItem = localStorage.removeItem;
            
            localStorage.setItem = (key, value) => {
                originalSetItem.call(localStorage, key, value);
                this.handleLocalStorageChange('set', key, value);
            };
            
            localStorage.removeItem = (key) => {
                originalRemoveItem.call(localStorage, key);
                this.handleLocalStorageChange('remove', key);
            };
        }

        handleFirestoreChange(collection, change) {
            const syncItem = {
                type: 'firestore',
                collection,
                changeType: change.type,
                docId: change.doc.id,
                data: change.doc.data(),
                timestamp: Date.now()
            };
            
            this.addToSyncQueue(syncItem);
        }

        handleLocalStorageChange(action, key, value) {
            const syncItem = {
                type: 'localStorage',
                action,
                key,
                value,
                timestamp: Date.now()
            };
            
            this.addToSyncQueue(syncItem);
        }

        addToSyncQueue(item) {
            this.syncQueue.push(item);
            
            // Auto-sync if online
            if (navigator.onLine && !this.syncInProgress) {
                this.syncAll();
            }
        }

        async syncAll() {
            if (this.syncInProgress || !navigator.onLine) {
                return;
            }
            
            this.syncInProgress = true;
            
            try {
                // Process sync queue
                while (this.syncQueue.length > 0) {
                    const item = this.syncQueue.shift();
                    await this.syncItem(item);
                }
                
                // Sync local data with server
                await this.syncLocalData();
                
                this.lastSyncTime = Date.now();
                
            } catch (error) {
                console.error('Sync error:', error);
                // Re-add failed items to queue
                this.syncQueue.unshift(...this.syncQueue);
            } finally {
                this.syncInProgress = false;
            }
        }

        async syncItem(item) {
            try {
                switch (item.type) {
                    case 'firestore':
                        await this.syncFirestoreItem(item);
                        break;
                    case 'localStorage':
                        await this.syncLocalStorageItem(item);
                        break;
                }
            } catch (error) {
                console.error('Error syncing item:', error);
                throw error;
            }
        }

        async syncFirestoreItem(item) {
            // Firestore changes are already synced by default
            // This is for custom sync logic if needed
        }

        async syncLocalStorageItem(item) {
            // Sync localStorage changes to server
            if (item.action === 'set') {
                await this.syncToServer('localStorage', item.key, item.value);
            } else if (item.action === 'remove') {
                await this.syncToServer('localStorage', item.key, null);
            }
        }

        async syncToServer(type, key, value) {
            try {
                await firebase.firestore()
                    .collection('syncData')
                    .doc(`${type}_${key}`)
                    .set({
                        type,
                        key,
                        value,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        userId: firebase.auth().currentUser?.uid
                    });
            } catch (error) {
                console.error('Error syncing to server:', error);
                throw error;
            }
        }

        async syncLocalData() {
            try {
                // Get server data
                const serverData = await this.getServerData();
                
                // Merge with local data
                await this.mergeData(serverData);
                
            } catch (error) {
                console.error('Error syncing local data:', error);
                throw error;
            }
        }

        async getServerData() {
            const snapshot = await firebase.firestore()
                .collection('syncData')
                .where('userId', '==', firebase.auth().currentUser?.uid)
                .get();
            
            const data = {};
            snapshot.forEach(doc => {
                const docData = doc.data();
                data[`${docData.type}_${docData.key}`] = docData.value;
            });
            
            return data;
        }

        async mergeData(serverData) {
            // Merge server data with local data
            Object.entries(serverData).forEach(([key, value]) => {
                const [type, localKey] = key.split('_');
                
                if (type === 'localStorage') {
                    const localValue = localStorage.getItem(localKey);
                    
                    if (this.hasConflict(localValue, value)) {
                        this.resolveConflict(localKey, localValue, value);
                    } else {
                        localStorage.setItem(localKey, value);
                    }
                }
            });
        }

        hasConflict(localValue, serverValue) {
            return localValue !== serverValue && localValue !== null;
        }

        resolveConflict(key, localValue, serverValue) {
            switch (this.conflictResolution) {
                case 'server-wins':
                    localStorage.setItem(key, serverValue);
                    break;
                case 'client-wins':
                    // Keep local value, sync to server
                    this.syncToServer('localStorage', key, localValue);
                    break;
                case 'manual':
                    this.showConflictResolutionDialog(key, localValue, serverValue);
                    break;
            }
        }

        showConflictResolutionDialog(key, localValue, serverValue) {
            // Show conflict resolution dialog
            const dialog = document.createElement('div');
            dialog.className = 'conflict-dialog';
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h3>Data Conflict Detected</h3>
                    <p>Key: ${key}</p>
                    <div class="conflict-options">
                        <div class="option">
                            <h4>Local Value</h4>
                            <p>${localValue}</p>
                            <button onclick="this.resolveConflict('local', '${key}', '${localValue}', '${serverValue}')">Use Local</button>
                        </div>
                        <div class="option">
                            <h4>Server Value</h4>
                            <p>${serverValue}</p>
                            <button onclick="this.resolveConflict('server', '${key}', '${localValue}', '${serverValue}')">Use Server</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
        }

        startPeriodicSync() {
            setInterval(() => {
                if (navigator.onLine && !this.syncInProgress) {
                    this.syncAll();
                }
            }, this.syncInterval);
        }

        pauseSync() {
            this.syncInProgress = false;
        }

        setupConflictResolution() {
            // Load conflict resolution preference
            const preference = localStorage.getItem('syncConflictResolution');
            if (preference) {
                this.conflictResolution = preference;
            }
        }
    }

    // Offline Management
    setupOfflineManager() {
        this.offlineManager = new OfflineManager();
    }

    class OfflineManager {
        constructor() {
            this.offlineData = new Map();
            this.offlineActions = [];
            this.isOffline = !navigator.onLine;
            
            this.init();
        }

        init() {
            this.setupOfflineListeners();
            this.loadOfflineData();
            this.setupOfflineUI();
        }

        setupOfflineListeners() {
            window.addEventListener('online', () => {
                this.handleOnline();
            });

            window.addEventListener('offline', () => {
                this.handleOffline();
            });
        }

        handleOffline() {
            this.isOffline = true;
            this.showOfflineIndicator();
            this.enableOfflineMode();
        }

        handleOnline() {
            this.isOffline = false;
            this.hideOfflineIndicator();
            this.disableOfflineMode();
            this.syncOfflineActions();
        }

        showOfflineIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'offlineIndicator';
            indicator.className = 'offline-indicator';
            indicator.innerHTML = `
                <i class="fas fa-wifi-slash"></i>
                <span>You're offline. Some features may be limited.</span>
            `;
            document.body.appendChild(indicator);
        }

        hideOfflineIndicator() {
            const indicator = document.getElementById('offlineIndicator');
            if (indicator) {
                indicator.remove();
            }
        }

        enableOfflineMode() {
            document.body.classList.add('offline-mode');
            
            // Disable online-only features
            this.disableOnlineFeatures();
            
            // Enable offline features
            this.enableOfflineFeatures();
        }

        disableOfflineMode() {
            document.body.classList.remove('offline-mode');
            
            // Re-enable online features
            this.enableOnlineFeatures();
            
            // Disable offline features
            this.disableOfflineFeatures();
        }

        disableOnlineFeatures() {
            // Disable features that require internet
            const onlineFeatures = document.querySelectorAll('[data-requires-online]');
            onlineFeatures.forEach(feature => {
                feature.disabled = true;
                feature.classList.add('offline-disabled');
            });
        }

        enableOnlineFeatures() {
            const onlineFeatures = document.querySelectorAll('[data-requires-online]');
            onlineFeatures.forEach(feature => {
                feature.disabled = false;
                feature.classList.remove('offline-disabled');
            });
        }

        enableOfflineFeatures() {
            // Enable offline-capable features
            const offlineFeatures = document.querySelectorAll('[data-offline-capable]');
            offlineFeatures.forEach(feature => {
                feature.classList.add('offline-enabled');
            });
        }

        disableOfflineFeatures() {
            const offlineFeatures = document.querySelectorAll('[data-offline-capable]');
            offlineFeatures.forEach(feature => {
                feature.classList.remove('offline-enabled');
            });
        }

        loadOfflineData() {
            // Load cached data for offline use
            const cachedData = localStorage.getItem('offlineData');
            if (cachedData) {
                try {
                    this.offlineData = new Map(JSON.parse(cachedData));
                } catch (error) {
                    console.error('Error loading offline data:', error);
                }
            }
        }

        saveOfflineData() {
            // Save data for offline use
            const dataArray = Array.from(this.offlineData.entries());
            localStorage.setItem('offlineData', JSON.stringify(dataArray));
        }

        addOfflineAction(action) {
            this.offlineActions.push({
                ...action,
                timestamp: Date.now()
            });
            
            this.saveOfflineActions();
        }

        saveOfflineActions() {
            localStorage.setItem('offlineActions', JSON.stringify(this.offlineActions));
        }

        loadOfflineActions() {
            const actions = localStorage.getItem('offlineActions');
            if (actions) {
                try {
                    this.offlineActions = JSON.parse(actions);
                } catch (error) {
                    console.error('Error loading offline actions:', error);
                }
            }
        }

        async syncOfflineActions() {
            // Sync actions performed while offline
            for (const action of this.offlineActions) {
                try {
                    await this.executeOfflineAction(action);
                } catch (error) {
                    console.error('Error executing offline action:', error);
                }
            }
            
            // Clear synced actions
            this.offlineActions = [];
            this.saveOfflineActions();
        }

        async executeOfflineAction(action) {
            // Execute action that was performed offline
            switch (action.type) {
                case 'create':
                    await this.executeCreateAction(action);
                    break;
                case 'update':
                    await this.executeUpdateAction(action);
                    break;
                case 'delete':
                    await this.executeDeleteAction(action);
                    break;
            }
        }

        async executeCreateAction(action) {
            // Execute create action
            await firebase.firestore()
                .collection(action.collection)
                .add(action.data);
        }

        async executeUpdateAction(action) {
            // Execute update action
            await firebase.firestore()
                .collection(action.collection)
                .doc(action.docId)
                .update(action.data);
        }

        async executeDeleteAction(action) {
            // Execute delete action
            await firebase.firestore()
                .collection(action.collection)
                .doc(action.docId)
                .delete();
        }

        setupOfflineUI() {
            // Add offline-specific UI elements
            this.createOfflineUI();
        }

        createOfflineUI() {
            // Create offline-specific UI elements
            const offlineUI = document.createElement('div');
            offlineUI.id = 'offlineUI';
            offlineUI.className = 'offline-ui';
            offlineUI.innerHTML = `
                <div class="offline-message">
                    <i class="fas fa-wifi-slash"></i>
                    <h3>You're Offline</h3>
                    <p>Some features are limited while offline. Your data will sync when you're back online.</p>
                </div>
            `;
            
            document.body.appendChild(offlineUI);
        }
    }

    // Push Notifications
    setupPushNotifications() {
        this.pushManager = new PushManager();
    }

    class PushManager {
        constructor() {
            this.isSupported = 'Notification' in window;
            this.permission = 'default';
            this.serviceWorker = null;
            
            this.init();
        }

        init() {
            if (this.isSupported) {
                this.checkPermission();
                this.setupServiceWorker();
                this.setupNotificationListeners();
            }
        }

        async checkPermission() {
            this.permission = Notification.permission;
            
            if (this.permission === 'default') {
                await this.requestPermission();
            }
        }

        async requestPermission() {
            try {
                this.permission = await Notification.requestPermission();
                return this.permission === 'granted';
            } catch (error) {
                console.error('Error requesting notification permission:', error);
                return false;
            }
        }

        async setupServiceWorker() {
            if ('serviceWorker' in navigator) {
                try {
                    this.serviceWorker = await navigator.serviceWorker.ready;
                } catch (error) {
                    console.error('Error setting up service worker:', error);
                }
            }
        }

        setupNotificationListeners() {
            // Listen for notification clicks
            document.addEventListener('click', (e) => {
                if (e.target.closest('.notification')) {
                    this.handleNotificationClick(e.target.closest('.notification'));
                }
            });
        }

        async showNotification(title, options = {}) {
            if (!this.isSupported || this.permission !== 'granted') {
                return false;
            }

            try {
                const notification = new Notification(title, {
                    icon: options.icon || '/icons/icon-192x192.png',
                    badge: options.badge || '/icons/icon-192x192.png',
                    body: options.body || '',
                    tag: options.tag || 'auraos-notification',
                    data: options.data || {},
                    requireInteraction: options.requireInteraction || false,
                    silent: options.silent || false,
                    vibrate: options.vibrate || [200, 100, 200],
                    actions: options.actions || []
                });

                // Handle notification click
                notification.onclick = () => {
                    this.handleNotificationClick(notification);
                    notification.close();
                };

                // Auto-close after 5 seconds unless requireInteraction is true
                if (!options.requireInteraction) {
                    setTimeout(() => {
                        notification.close();
                    }, 5000);
                }

                return true;
            } catch (error) {
                console.error('Error showing notification:', error);
                return false;
            }
        }

        handleNotificationClick(notification) {
            // Handle notification click
            if (notification.data && notification.data.url) {
                window.focus();
                window.location.href = notification.data.url;
            }
        }

        async scheduleNotification(title, options, delay) {
            setTimeout(() => {
                this.showNotification(title, options);
            }, delay);
        }

        async sendPushNotification(userId, title, options) {
            try {
                // Send push notification to specific user
                await firebase.firestore()
                    .collection('notifications')
                    .add({
                        userId,
                        title,
                        options,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        read: false
                    });
            } catch (error) {
                console.error('Error sending push notification:', error);
            }
        }
    }

    // Cross-Platform Features
    setupCrossPlatformFeatures() {
        this.setupResponsiveDesign();
        this.setupAdaptiveUI();
        this.setupPlatformSpecificFeatures();
    }

    setupResponsiveDesign() {
        // Add responsive design classes
        this.addResponsiveClasses();
        
        // Setup responsive breakpoints
        this.setupResponsiveBreakpoints();
    }

    addResponsiveClasses() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Add size classes
        if (width < 768) {
            document.body.classList.add('mobile-size');
        } else if (width < 1024) {
            document.body.classList.add('tablet-size');
        } else {
            document.body.classList.add('desktop-size');
        }
        
        // Add orientation classes
        if (height > width) {
            document.body.classList.add('portrait');
        } else {
            document.body.classList.add('landscape');
        }
    }

    setupResponsiveBreakpoints() {
        const breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        
        window.addEventListener('resize', this.debounce(() => {
            this.handleResponsiveChange(breakpoints);
        }, 250));
    }

    handleResponsiveChange(breakpoints) {
        const width = window.innerWidth;
        
        // Remove existing size classes
        document.body.classList.remove('mobile-size', 'tablet-size', 'desktop-size');
        
        // Add appropriate size class
        if (width < breakpoints.mobile) {
            document.body.classList.add('mobile-size');
        } else if (width < breakpoints.tablet) {
            document.body.classList.add('tablet-size');
        } else {
            document.body.classList.add('desktop-size');
        }
    }

    setupAdaptiveUI() {
        // Adapt UI based on platform capabilities
        this.adaptUIForPlatform();
    }

    adaptUIForPlatform() {
        // Adapt UI elements based on platform
        if (this.isMobile()) {
            this.adaptUIForMobile();
        } else if (this.isDesktop()) {
            this.adaptUIForDesktop();
        }
    }

    adaptUIForMobile() {
        // Make buttons larger for touch
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(btn => {
            btn.classList.add('touch-friendly');
        });
        
        // Add touch-friendly spacing
        const containers = document.querySelectorAll('.container, .content');
        containers.forEach(container => {
            container.classList.add('mobile-spacing');
        });
    }

    adaptUIForDesktop() {
        // Add hover effects for desktop
        const interactiveElements = document.querySelectorAll('button, .btn, .card');
        interactiveElements.forEach(element => {
            element.classList.add('desktop-hover');
        });
    }

    setupPlatformSpecificFeatures() {
        // Setup features specific to each platform
        if (this.platform === 'ios') {
            this.setupIOSFeatures();
        } else if (this.platform === 'android') {
            this.setupAndroidFeatures();
        } else if (this.platform === 'electron') {
            this.setupElectronFeatures();
        }
    }

    setupIOSFeatures() {
        // iOS-specific features
        this.setupIOSStatusBar();
        this.setupIOSGestures();
    }

    setupIOSStatusBar() {
        // Handle iOS status bar
        if (window.navigator.standalone) {
            document.body.classList.add('ios-standalone');
        }
    }

    setupIOSGestures() {
        // iOS-specific gesture handling
        this.setupIOSPullToRefresh();
    }

    setupIOSPullToRefresh() {
        // Implement pull-to-refresh for iOS
        let startY = 0;
        let currentY = 0;
        let isRefreshing = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                currentY = e.touches[0].clientY;
                const diff = currentY - startY;
                
                if (diff > 0 && diff < 100) {
                    e.preventDefault();
                    this.updatePullToRefresh(diff);
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            if (currentY - startY > 50 && !isRefreshing) {
                this.triggerPullToRefresh();
            }
            this.resetPullToRefresh();
        });
    }

    updatePullToRefresh(diff) {
        // Update pull-to-refresh UI
        const refreshIndicator = document.getElementById('pullToRefresh');
        if (refreshIndicator) {
            refreshIndicator.style.transform = `translateY(${diff}px)`;
            refreshIndicator.style.opacity = Math.min(diff / 50, 1);
        }
    }

    triggerPullToRefresh() {
        // Trigger pull-to-refresh action
        this.isRefreshing = true;
        this.refreshData();
    }

    resetPullToRefresh() {
        // Reset pull-to-refresh UI
        const refreshIndicator = document.getElementById('pullToRefresh');
        if (refreshIndicator) {
            refreshIndicator.style.transform = 'translateY(0)';
            refreshIndicator.style.opacity = '0';
        }
        startY = 0;
        currentY = 0;
        isRefreshing = false;
    }

    setupAndroidFeatures() {
        // Android-specific features
        this.setupAndroidBackButton();
        this.setupAndroidHardwareAcceleration();
    }

    setupAndroidBackButton() {
        // Handle Android back button
        document.addEventListener('backbutton', (e) => {
            e.preventDefault();
            this.handleAndroidBackButton();
        });
    }

    handleAndroidBackButton() {
        // Handle Android back button press
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Close app or show exit confirmation
            this.showExitConfirmation();
        }
    }

    showExitConfirmation() {
        if (confirm('Are you sure you want to exit?')) {
            // Close app
            if (window.navigator.app) {
                window.navigator.app.exitApp();
            }
        }
    }

    setupAndroidHardwareAcceleration() {
        // Enable hardware acceleration for Android
        document.body.style.transform = 'translateZ(0)';
        document.body.style.webkitTransform = 'translateZ(0)';
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleOrientationChange() {
        // Handle orientation change
        this.deviceInfo.orientation = this.getOrientation();
        this.addResponsiveClasses();
    }

    handleResize() {
        // Handle window resize
        this.deviceInfo.screenWidth = window.innerWidth;
        this.deviceInfo.screenHeight = window.innerHeight;
        this.addResponsiveClasses();
    }

    handleConnectionChange(isOnline) {
        // Handle connection change
        this.deviceInfo.isOnline = isOnline;
        
        if (isOnline) {
            this.syncManager?.syncAll();
        }
    }

    handleSwipeLeft() {
        // Handle swipe left gesture
        console.log('Swipe left detected');
    }

    handleSwipeRight() {
        // Handle swipe right gesture
        console.log('Swipe right detected');
    }

    handleSwipeUp() {
        // Handle swipe up gesture
        console.log('Swipe up detected');
    }

    handleSwipeDown() {
        // Handle swipe down gesture
        console.log('Swipe down detected');
    }

    openSearch() {
        // Open search functionality
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    showKeyboardShortcuts() {
        // Show keyboard shortcuts help
        console.log('Show keyboard shortcuts');
    }

    closeModals() {
        // Close all open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    refreshData() {
        // Refresh application data
        if (window.adminPanel) {
            window.adminPanel.refreshAllData();
        }
    }

    // Public API
    getPlatform() {
        return this.platform;
    }

    getDeviceInfo() {
        return this.deviceInfo;
    }

    getCapabilities() {
        return this.capabilities;
    }

    isMobile() {
        return this.isMobile();
    }

    isDesktop() {
        return this.isDesktop();
    }

    async showNotification(title, options) {
        return await this.pushManager?.showNotification(title, options);
    }

    async syncData() {
        return await this.syncManager?.syncAll();
    }
}

// Initialize mobile platform when DOM is loaded
let mobilePlatform = null;

document.addEventListener('DOMContentLoaded', () => {
    mobilePlatform = new MobilePlatform();
    
    // Make mobile platform available globally
    window.MobilePlatform = mobilePlatform;
});

// Export for global access
window.MobilePlatform = MobilePlatform;


