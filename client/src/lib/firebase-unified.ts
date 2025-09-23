// =============================================================================
// 🔐 AuraOS Firebase Configuration - Secure & Unified
// =============================================================================
//
// This file provides a secure, unified Firebase configuration for AuraOS
// Supports multiple environments with proper security practices
//
// =============================================================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFunctions, Functions } from 'firebase/functions';

// =============================================================================
// 🔒 Environment Configuration Types
// =============================================================================

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

interface EnvironmentConfig {
  firebase: FirebaseConfig;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  enableAnalytics: boolean;
  enableEmulator: boolean;
}

// =============================================================================
// 🌍 Environment Detection
// =============================================================================

function getEnvironment(): 'development' | 'production' | 'test' {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const appEnv = process.env.APP_ENV || nodeEnv;

  if (appEnv === 'production') return 'production';
  if (appEnv === 'test') return 'test';
  return 'development';
}

// =============================================================================
// 🔧 Firebase Configuration Factory
// =============================================================================

function createFirebaseConfig(): FirebaseConfig {
  const environment = getEnvironment();

  // Validate required environment variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env file and ensure all Firebase configuration variables are set.'
    );
  }

  const config: FirebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY!,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.VITE_FIREBASE_APP_ID!,
  };

  // Add measurement ID if available (for Analytics)
  if (process.env.VITE_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = process.env.VITE_FIREBASE_MEASUREMENT_ID;
  }

  return config;
}

// =============================================================================
// 🚀 Firebase Initialization
// =============================================================================

class AuraOSFirebase {
  private static instance: AuraOSFirebase;
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;
  private storage: FirebaseStorage | null = null;
  private analytics: Analytics | null = null;
  private functions: Functions | null = null;
  private config: EnvironmentConfig | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): AuraOSFirebase {
    if (!AuraOSFirebase.instance) {
      AuraOSFirebase.instance = new AuraOSFirebase();
    }
    return AuraOSFirebase.instance;
  }

  private initialize(): void {
    try {
      const environment = getEnvironment();
      const firebaseConfig = createFirebaseConfig();

      this.config = {
        firebase: firebaseConfig,
        isDevelopment: environment === 'development',
        isProduction: environment === 'production',
        isTest: environment === 'test',
        enableAnalytics:
          environment === 'production' && !!firebaseConfig.measurementId,
        enableEmulator:
          environment === 'development' &&
          process.env.VITE_USE_FIREBASE_EMULATOR === 'true',
      };

      // Initialize Firebase App (avoid duplicate initialization)
      if (getApps().length === 0) {
        this.app = initializeApp(firebaseConfig);
        console.log('🔥 Firebase initialized successfully');
      } else {
        this.app = getApps()[0];
        console.log('🔥 Firebase app already initialized');
      }

      // Initialize Firebase services
      this.initializeServices();

      // Setup emulator if in development
      if (this.config.enableEmulator) {
        this.setupEmulator();
      }
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      throw error;
    }
  }

  private initializeServices(): void {
    if (!this.app) return;

    try {
      // Initialize Authentication
      this.auth = getAuth(this.app);
      console.log('🔐 Firebase Auth initialized');

      // Initialize Firestore
      this.firestore = getFirestore(this.app);
      console.log('📊 Firebase Firestore initialized');

      // Initialize Storage
      this.storage = getStorage(this.app);
      console.log('💾 Firebase Storage initialized');

      // Initialize Functions
      this.functions = getFunctions(this.app);
      console.log('⚡ Firebase Functions initialized');

      // Initialize Analytics (only in production)
      if (this.config?.enableAnalytics && typeof window !== 'undefined') {
        this.analytics = getAnalytics(this.app);
        console.log('📈 Firebase Analytics initialized');
      }
    } catch (error) {
      console.error('❌ Firebase services initialization failed:', error);
      throw error;
    }
  }

  private async setupEmulator(): Promise<void> {
    if (!this.config?.enableEmulator) return;

    try {
      // Dynamic imports for emulator setup
      const { connectAuthEmulator } = await import('firebase/auth');
      const { connectFirestoreEmulator } = await import('firebase/firestore');
      const { connectStorageEmulator } = await import('firebase/storage');
      const { connectFunctionsEmulator } = await import('firebase/functions');

      const emulatorHost =
        process.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';

      // Connect to emulators
      if (
        this.auth &&
        !this.auth.app.options.authDomain?.includes('localhost')
      ) {
        connectAuthEmulator(this.auth, `http://${emulatorHost}:9099`);
      }

      if (
        this.firestore &&
        !this.firestore.app.options.projectId?.includes('demo')
      ) {
        connectFirestoreEmulator(this.firestore, emulatorHost, 8080);
      }

      if (this.storage) {
        connectStorageEmulator(this.storage, emulatorHost, 9199);
      }

      if (this.functions) {
        connectFunctionsEmulator(this.functions, emulatorHost, 5001);
      }

      console.log('🧪 Firebase emulators connected');
    } catch (error) {
      console.warn('⚠️ Firebase emulator setup failed:', error);
    }
  }

  // =============================================================================
  // 📋 Public API
  // =============================================================================

  public getApp(): FirebaseApp {
    if (!this.app) {
      throw new Error('Firebase app not initialized');
    }
    return this.app;
  }

  public getAuth(): Auth {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized');
    }
    return this.auth;
  }

  public getFirestore(): Firestore {
    if (!this.firestore) {
      throw new Error('Firebase Firestore not initialized');
    }
    return this.firestore;
  }

  public getStorage(): FirebaseStorage {
    if (!this.storage) {
      throw new Error('Firebase Storage not initialized');
    }
    return this.storage;
  }

  public getAnalytics(): Analytics | null {
    return this.analytics;
  }

  public getFunctions(): Functions {
    if (!this.functions) {
      throw new Error('Firebase Functions not initialized');
    }
    return this.functions;
  }

  public getConfig(): EnvironmentConfig {
    if (!this.config) {
      throw new Error('Firebase configuration not initialized');
    }
    return this.config;
  }

  // =============================================================================
  // 🔍 Health Check
  // =============================================================================

  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    services: Record<string, boolean>;
    config: EnvironmentConfig;
  }> {
    const services = {
      app: !!this.app,
      auth: !!this.auth,
      firestore: !!this.firestore,
      storage: !!this.storage,
      analytics: !!this.analytics,
      functions: !!this.functions,
    };

    const allServicesHealthy = Object.values(services).every(Boolean);

    return {
      status: allServicesHealthy ? 'healthy' : 'unhealthy',
      services,
      config: this.config!,
    };
  }

  // =============================================================================
  // 🔄 Reset (for testing)
  // =============================================================================

  public reset(): void {
    this.app = null;
    this.auth = null;
    this.firestore = null;
    this.storage = null;
    this.analytics = null;
    this.functions = null;
    this.config = null;
  }
}

// =============================================================================
// 🚀 Export Singleton Instance
// =============================================================================

const firebase = AuraOSFirebase.getInstance();

// Export individual services for convenience
export const app = firebase.getApp();
export const auth = firebase.getAuth();
export const db = firebase.getFirestore();
export const storage = firebase.getStorage();
export const analytics = firebase.getAnalytics();
export const functions = firebase.getFunctions();

// Export the main instance and utilities
export { firebase, AuraOSFirebase };
export { getEnvironment, createFirebaseConfig };

// Export types
export type { FirebaseConfig, EnvironmentConfig };

// =============================================================================
// 📋 Usage Examples
// =============================================================================

/*
// Basic usage:
import { auth, db, storage } from '@/lib/firebase';

// Health check:
import { firebase } from '@/lib/firebase';
const health = await firebase.healthCheck();
console.log('Firebase status:', health.status);

// Environment detection:
import { getEnvironment } from '@/lib/firebase';
const env = getEnvironment(); // 'development' | 'production' | 'test'
*/

export default firebase;
