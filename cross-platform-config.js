// React Native Configuration
const ReactNativeConfig = {
    // App Configuration
    app: {
        name: 'AuraOS',
        displayName: 'AuraOS Mobile',
        version: '1.0.0',
        buildNumber: '1',
        bundleId: 'com.auraos.mobile',
        packageName: 'com.auraos.mobile'
    },

    // Platform Configuration
    platforms: {
        ios: {
            deploymentTarget: '11.0',
            bundleId: 'com.auraos.mobile',
            teamId: 'YOUR_TEAM_ID',
            provisioningProfile: 'YOUR_PROVISIONING_PROFILE'
        },
        android: {
            minSdkVersion: 21,
            targetSdkVersion: 33,
            compileSdkVersion: 33,
            packageName: 'com.auraos.mobile',
            signingConfig: 'release'
        }
    },

    // Dependencies
    dependencies: {
        'react-native': '^0.72.0',
        'react-native-webview': '^13.6.0',
        'react-native-gesture-handler': '^2.12.0',
        'react-native-reanimated': '^3.5.0',
        'react-native-safe-area-context': '^4.7.0',
        'react-native-screens': '^3.25.0',
        'react-native-vector-icons': '^10.0.0',
        '@react-native-firebase/app': '^18.6.0',
        '@react-native-firebase/auth': '^18.6.0',
        '@react-native-firebase/firestore': '^18.6.0',
        '@react-native-firebase/messaging': '^18.6.0',
        'react-native-push-notification': '^8.1.1',
        'react-native-device-info': '^10.11.0',
        'react-native-orientation-locker': '^1.5.0',
        'react-native-keychain': '^8.1.3',
        'react-native-async-storage': '^1.19.0',
        'react-native-fs': '^2.20.0',
        'react-native-share': '^9.4.1',
        'react-native-image-picker': '^5.6.0',
        'react-native-camera': '^4.2.1',
        'react-native-permissions': '^3.10.0',
        'react-native-splash-screen': '^3.3.0',
        'react-native-svg': '^13.14.0',
        'react-native-linear-gradient': '^2.8.3',
        'react-native-blur': '^4.3.2',
        'react-native-haptic-feedback': '^2.1.0',
        'react-native-sound': '^0.11.2',
        'react-native-video': '^5.2.1',
        'react-native-document-picker': '^9.1.1',
        'react-native-file-viewer': '^2.1.5',
        'react-native-pdf': '^6.7.0',
        'react-native-print': '^0.8.0',
        'react-native-webview-bridge': '^1.0.0'
    },

    // Metro Configuration
    metro: {
        resolver: {
            platforms: ['ios', 'android', 'web'],
            extensions: ['.ios.js', '.android.js', '.js', '.json', '.ts', '.tsx']
        },
        transformer: {
            babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: true
                }
            })
        }
    },

    // Babel Configuration
    babel: {
        presets: ['module:metro-react-native-babel-preset'],
        plugins: [
            'react-native-reanimated/plugin',
            ['module-resolver', {
                root: ['./src'],
                extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                alias: {
                    '@': './src',
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@utils': './src/utils',
                    '@services': './src/services',
                    '@assets': './src/assets'
                }
            }]
        ]
    },

    // App Structure
    structure: {
        src: {
            components: [
                'Button',
                'Input',
                'Card',
                'Modal',
                'Loading',
                'ErrorBoundary',
                'WebView',
                'Navigation',
                'Header',
                'Footer'
            ],
            screens: [
                'Home',
                'Dashboard',
                'Profile',
                'Settings',
                'Chat',
                'Analytics',
                'Admin',
                'Login',
                'Register',
                'Splash'
            ],
            services: [
                'AuthService',
                'FirebaseService',
                'StorageService',
                'NotificationService',
                'SyncService',
                'AnalyticsService',
                'ApiService'
            ],
            utils: [
                'helpers',
                'constants',
                'validators',
                'formatters',
                'storage',
                'permissions'
            ],
            assets: [
                'images',
                'icons',
                'fonts',
                'sounds',
                'videos'
            ]
        }
    },

    // Navigation Configuration
    navigation: {
        type: 'stack',
        screens: {
            Splash: {
                component: 'SplashScreen',
                options: {
                    headerShown: false
                }
            },
            Auth: {
                component: 'AuthStack',
                options: {
                    headerShown: false
                }
            },
            Main: {
                component: 'MainTabNavigator',
                options: {
                    headerShown: false
                }
            }
        }
    },

    // Firebase Configuration
    firebase: {
        ios: {
            googleServicesFile: './ios/GoogleService-Info.plist'
        },
        android: {
            googleServicesFile: './android/google-services.json'
        },
        config: {
            apiKey: 'YOUR_API_KEY',
            authDomain: 'YOUR_AUTH_DOMAIN',
            projectId: 'YOUR_PROJECT_ID',
            storageBucket: 'YOUR_STORAGE_BUCKET',
            messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
            appId: 'YOUR_APP_ID'
        }
    },

    // Permissions
    permissions: {
        ios: [
            'NSCameraUsageDescription',
            'NSMicrophoneUsageDescription',
            'NSLocationWhenInUseUsageDescription',
            'NSContactsUsageDescription',
            'NSPhotoLibraryUsageDescription',
            'NSFaceIDUsageDescription',
            'NSUserNotificationsUsageDescription'
        ],
        android: [
            'android.permission.CAMERA',
            'android.permission.RECORD_AUDIO',
            'android.permission.ACCESS_FINE_LOCATION',
            'android.permission.READ_CONTACTS',
            'android.permission.READ_EXTERNAL_STORAGE',
            'android.permission.WRITE_EXTERNAL_STORAGE',
            'android.permission.VIBRATE',
            'android.permission.WAKE_LOCK',
            'android.permission.INTERNET',
            'android.permission.ACCESS_NETWORK_STATE'
        ]
    },

    // Build Configuration
    build: {
        ios: {
            scheme: 'AuraOS',
            configuration: 'Release',
            archivePath: './ios/build/AuraOS.xcarchive',
            exportPath: './ios/build/',
            exportOptions: {
                method: 'app-store',
                teamID: 'YOUR_TEAM_ID',
                uploadBitcode: false,
                uploadSymbols: true,
                compileBitcode: false
            }
        },
        android: {
            keystore: './android/app/auraos-release-key.keystore',
            keystorePassword: 'YOUR_KEYSTORE_PASSWORD',
            keyAlias: 'auraos-key-alias',
            keyPassword: 'YOUR_KEY_PASSWORD',
            buildType: 'release',
            gradleCommand: 'assembleRelease'
        }
    },

    // Testing Configuration
    testing: {
        jest: {
            preset: 'react-native',
            setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
            testMatch: ['**/__tests__/**/*.(js|jsx|ts|tsx)', '**/*.(test|spec).(js|jsx|ts|tsx)'],
            collectCoverageFrom: [
                'src/**/*.{js,jsx,ts,tsx}',
                '!src/**/*.d.ts',
                '!src/**/index.{js,jsx,ts,tsx}'
            ],
            coverageThreshold: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80
                }
            }
        },
        detox: {
            ios: {
                binaryPath: './ios/build/Build/Products/Debug-iphonesimulator/AuraOS.app',
                build: 'xcodebuild -workspace ios/AuraOS.xcworkspace -scheme AuraOS -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
                type: 'ios.simulator',
                device: {
                    type: 'iPhone 14'
                }
            },
            android: {
                binaryPath: './android/app/build/outputs/apk/debug/app-debug.apk',
                build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
                type: 'android.emulator',
                device: {
                    avdName: 'Pixel_4_API_30'
                }
            }
        }
    },

    // Deployment Configuration
    deployment: {
        ios: {
            appStore: {
                teamId: 'YOUR_TEAM_ID',
                bundleId: 'com.auraos.mobile',
                version: '1.0.0',
                buildNumber: '1'
            },
            testFlight: {
                teamId: 'YOUR_TEAM_ID',
                bundleId: 'com.auraos.mobile',
                version: '1.0.0',
                buildNumber: '1',
                groups: ['Internal Testers', 'External Testers']
            }
        },
        android: {
            playStore: {
                packageName: 'com.auraos.mobile',
                versionCode: 1,
                versionName: '1.0.0',
                track: 'production'
            },
            internalTesting: {
                packageName: 'com.auraos.mobile',
                versionCode: 1,
                versionName: '1.0.0',
                track: 'internal'
            }
        }
    }
};

// Electron Configuration
const ElectronConfig = {
    // App Configuration
    app: {
        name: 'AuraOS Desktop',
        version: '1.0.0',
        description: 'AuraOS Desktop Application',
        author: 'AuraOS Team',
        license: 'MIT',
        repository: 'https://github.com/auraos/auraos-desktop',
        homepage: 'https://auraos.com'
    },

    // Main Process Configuration
    main: {
        entry: './src/main/main.js',
        preload: './src/main/preload.js',
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false
    },

    // Renderer Process Configuration
    renderer: {
        entry: './src/renderer/index.html',
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false
    },

    // Window Configuration
    windows: {
        main: {
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            maxWidth: 1920,
            maxHeight: 1080,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            alwaysOnTop: false,
            fullscreenable: true,
            title: 'AuraOS Desktop',
            titleBarStyle: 'default',
            frame: true,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                webSecurity: true,
                allowRunningInsecureContent: false,
                experimentalFeatures: false,
                preload: './src/main/preload.js'
            }
        },
        settings: {
            width: 600,
            height: 500,
            minWidth: 500,
            minHeight: 400,
            resizable: true,
            minimizable: true,
            maximizable: false,
            closable: true,
            alwaysOnTop: true,
            fullscreenable: false,
            title: 'Settings - AuraOS Desktop',
            titleBarStyle: 'default',
            frame: true,
            show: false,
            parent: 'main',
            modal: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                webSecurity: true,
                allowRunningInsecureContent: false,
                experimentalFeatures: false,
                preload: './src/main/preload.js'
            }
        }
    },

    // Menu Configuration
    menu: {
        template: [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New',
                        accelerator: 'CmdOrCtrl+N',
                        click: 'newFile'
                    },
                    {
                        label: 'Open',
                        accelerator: 'CmdOrCtrl+O',
                        click: 'openFile'
                    },
                    {
                        label: 'Save',
                        accelerator: 'CmdOrCtrl+S',
                        click: 'saveFile'
                    },
                    {
                        label: 'Save As',
                        accelerator: 'CmdOrCtrl+Shift+S',
                        click: 'saveFileAs'
                    },
                    { type: 'separator' },
                    {
                        label: 'Exit',
                        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                        click: 'quit'
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Undo',
                        accelerator: 'CmdOrCtrl+Z',
                        role: 'undo'
                    },
                    {
                        label: 'Redo',
                        accelerator: 'CmdOrCtrl+Y',
                        role: 'redo'
                    },
                    { type: 'separator' },
                    {
                        label: 'Cut',
                        accelerator: 'CmdOrCtrl+X',
                        role: 'cut'
                    },
                    {
                        label: 'Copy',
                        accelerator: 'CmdOrCtrl+C',
                        role: 'copy'
                    },
                    {
                        label: 'Paste',
                        accelerator: 'CmdOrCtrl+V',
                        role: 'paste'
                    },
                    {
                        label: 'Select All',
                        accelerator: 'CmdOrCtrl+A',
                        role: 'selectall'
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click: 'reload'
                    },
                    {
                        label: 'Force Reload',
                        accelerator: 'CmdOrCtrl+Shift+R',
                        click: 'forceReload'
                    },
                    {
                        label: 'Toggle Developer Tools',
                        accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
                        click: 'toggleDevTools'
                    },
                    { type: 'separator' },
                    {
                        label: 'Actual Size',
                        accelerator: 'CmdOrCtrl+0',
                        click: 'resetZoom'
                    },
                    {
                        label: 'Zoom In',
                        accelerator: 'CmdOrCtrl+Plus',
                        click: 'zoomIn'
                    },
                    {
                        label: 'Zoom Out',
                        accelerator: 'CmdOrCtrl+-',
                        click: 'zoomOut'
                    },
                    { type: 'separator' },
                    {
                        label: 'Toggle Fullscreen',
                        accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
                        click: 'toggleFullscreen'
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        label: 'Minimize',
                        accelerator: 'CmdOrCtrl+M',
                        role: 'minimize'
                    },
                    {
                        label: 'Close',
                        accelerator: 'CmdOrCtrl+W',
                        role: 'close'
                    }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About AuraOS Desktop',
                        click: 'showAbout'
                    },
                    {
                        label: 'Documentation',
                        click: 'openDocumentation'
                    },
                    {
                        label: 'Report Issue',
                        click: 'reportIssue'
                    }
                ]
            }
        ]
    },

    // Context Menu Configuration
    contextMenu: {
        template: [
            {
                label: 'Cut',
                role: 'cut'
            },
            {
                label: 'Copy',
                role: 'copy'
            },
            {
                label: 'Paste',
                role: 'paste'
            },
            { type: 'separator' },
            {
                label: 'Select All',
                role: 'selectall'
            }
        ]
    },

    // Tray Configuration
    tray: {
        icon: './assets/tray-icon.png',
        tooltip: 'AuraOS Desktop',
        menu: [
            {
                label: 'Show',
                click: 'showWindow'
            },
            {
                label: 'Hide',
                click: 'hideWindow'
            },
            { type: 'separator' },
            {
                label: 'Settings',
                click: 'openSettings'
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: 'quit'
            }
        ]
    },

    // Auto Updater Configuration
    autoUpdater: {
        provider: 'github',
        owner: 'auraos',
        repo: 'auraos-desktop',
        token: 'YOUR_GITHUB_TOKEN',
        private: false,
        draft: false,
        prerelease: false
    },

    // Build Configuration
    build: {
        appId: 'com.auraos.desktop',
        productName: 'AuraOS Desktop',
        directories: {
            output: 'dist',
            buildResources: 'build'
        },
        files: [
            'src/**/*',
            'node_modules/**/*',
            'package.json'
        ],
        extraResources: [
            {
                from: 'assets',
                to: 'assets'
            }
        ],
        win: {
            target: 'nsis',
            icon: './assets/icon.ico'
        },
        mac: {
            target: 'dmg',
            icon: './assets/icon.icns',
            category: 'public.app-category.productivity'
        },
        linux: {
            target: 'AppImage',
            icon: './assets/icon.png',
            category: 'Office'
        },
        nsis: {
            oneClick: false,
            allowToChangeInstallationDirectory: true,
            installerIcon: './assets/icon.ico',
            uninstallerIcon: './assets/icon.ico',
            installerHeaderIcon: './assets/icon.ico',
            createDesktopShortcut: true,
            createStartMenuShortcut: true,
            shortcutName: 'AuraOS Desktop'
        },
        dmg: {
            title: 'AuraOS Desktop',
            icon: './assets/icon.icns',
            background: './assets/dmg-background.png',
            contents: [
                {
                    x: 130,
                    y: 220
                },
                {
                    x: 410,
                    y: 220,
                    type: 'link',
                    path: '/Applications'
                }
            ]
        }
    },

    // Security Configuration
    security: {
        contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false
    },

    // Performance Configuration
    performance: {
        enableHardwareAcceleration: true,
        enableWebGL: true,
        enableWebAudio: true,
        enableWebRTC: true,
        enableWebAssembly: true,
        enableServiceWorkers: true,
        enableIndexedDB: true,
        enableLocalStorage: true,
        enableSessionStorage: true
    }
};

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ReactNativeConfig,
        ElectronConfig
    };
} else {
    window.ReactNativeConfig = ReactNativeConfig;
    window.ElectronConfig = ElectronConfig;
}
