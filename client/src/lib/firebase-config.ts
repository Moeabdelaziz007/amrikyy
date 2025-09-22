// Firebase Configuration and Setup
// Environment-specific Firebase configuration

// Firebase Configuration
export const firebaseConfig = {
  // Production Configuration
  production: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'your-production-api-key',
    authDomain:
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
      'your-project.firebaseapp.com',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'your-project-id',
    storageBucket:
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
      'your-project.appspot.com',
    messagingSenderId:
      process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || 'your-app-id',
    measurementId:
      process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  },

  // Development Configuration
  development: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'your-dev-api-key',
    authDomain:
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
      'your-dev-project.firebaseapp.com',
    projectId:
      process.env.REACT_APP_FIREBASE_PROJECT_ID || 'your-dev-project-id',
    storageBucket:
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
      'your-dev-project.appspot.com',
    messagingSenderId:
      process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '987654321',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || 'your-dev-app-id',
    measurementId:
      process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-YYYYYYYYYY',
  },

  // Test Configuration
  test: {
    apiKey: 'test-api-key',
    authDomain: 'test-project.firebaseapp.com',
    projectId: 'test-project-id',
    storageBucket: 'test-project.appspot.com',
    messagingSenderId: '111111111',
    appId: 'test-app-id',
    measurementId: 'G-TESTTESTTEST',
  },
};

// Get current environment configuration
export const getFirebaseConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return (
    firebaseConfig[env as keyof typeof firebaseConfig] ||
    firebaseConfig.development
  );
};

// Firebase Emulator Configuration
export const emulatorConfig = {
  firestore: {
    host: 'localhost',
    port: 8080,
  },
  auth: {
    host: 'localhost',
    port: 9099,
  },
  storage: {
    host: 'localhost',
    port: 9199,
  },
  functions: {
    host: 'localhost',
    port: 5001,
  },
};

// Firebase Security Rules (for reference)
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data rules
    match /user_history/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /user_sessions/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /user_analytics/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Analytics data rules
    match /predictive_insights/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /performance_metrics/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /security_alerts/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /behavior_patterns/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /automated_reports/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /analytics_dashboards/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // System data rules (admin only)
    match /system_events/{document} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /error_logs/{document} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
`;

// Firebase Storage Rules (for reference)
export const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Analytics exports
    match /analytics_exports/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reports
    match /reports/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`;

// Firebase Functions Configuration
export const functionsConfig = {
  region: 'us-central1',
  timeout: 60,
  memory: '256MB',
  runtime: 'nodejs18',
};

// Analytics Configuration
export const analyticsConfig = {
  // Event names
  events: {
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    PAGE_VIEW: 'page_view',
    USER_INTERACTION: 'user_interaction',
    PERFORMANCE_METRIC: 'performance_metric',
    ERROR_OCCURRED: 'error_occurred',
    PREDICTIVE_INSIGHT_GENERATED: 'predictive_insight_generated',
    SECURITY_ALERT_CREATED: 'security_alert_created',
    REPORT_GENERATED: 'report_generated',
    ANALYTICS_INITIALIZED: 'analytics_initialized',
  },

  // Custom parameters
  parameters: {
    USER_ID: 'user_id',
    SESSION_ID: 'session_id',
    PAGE_NAME: 'page_name',
    ACTION_TYPE: 'action_type',
    TARGET: 'target',
    CATEGORY: 'category',
    SUCCESS: 'success',
    ERROR_MESSAGE: 'error_message',
    INSIGHT_TYPE: 'insight_type',
    CONFIDENCE: 'confidence',
    ALERT_TYPE: 'alert_type',
    SEVERITY: 'severity',
    REPORT_TYPE: 'report_type',
  },
};

// Database Indexes (for reference)
export const firestoreIndexes = {
  user_history: [
    {
      collectionGroup: 'user_history',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'user_history',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'action.category', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' },
      ],
    },
  ],
  user_sessions: [
    {
      collectionGroup: 'user_sessions',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'startTime', order: 'DESCENDING' },
      ],
    },
  ],
  predictive_insights: [
    {
      collectionGroup: 'predictive_insights',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'predictive_insights',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'type', order: 'ASCENDING' },
        { fieldPath: 'confidence', order: 'DESCENDING' },
      ],
    },
  ],
  performance_metrics: [
    {
      collectionGroup: 'performance_metrics',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'performance_metrics',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'metric', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' },
      ],
    },
  ],
  security_alerts: [
    {
      collectionGroup: 'security_alerts',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'security_alerts',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'severity', order: 'ASCENDING' },
        { fieldPath: 'resolved', order: 'ASCENDING' },
      ],
    },
  ],
};

// Environment Variables Template
export const envTemplate = `
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Analytics Configuration
REACT_APP_AI_MODEL_ENDPOINT=/api/ai/analytics
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_PERFORMANCE_MONITORING=true
REACT_APP_SECURITY_MONITORING=true
REACT_APP_PREDICTIVE_ANALYTICS=true
REACT_APP_AUTOMATED_REPORTS=true

# Development Settings
REACT_APP_USE_FIREBASE_EMULATOR=true
REACT_APP_DEBUG_MODE=true
REACT_APP_LOG_LEVEL=verbose
`;

// Setup Instructions
export const setupInstructions = `
# Firebase Setup Instructions

## 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name (e.g., "auraos-analytics")
4. Enable Google Analytics (optional)
5. Choose or create a Google Analytics account

## 2. Add Web App
1. Click "Add app" and select Web (</>) icon
2. Enter app nickname (e.g., "AuraOS Analytics")
3. Copy the Firebase configuration object
4. Paste it into your .env file

## 3. Enable Services
1. **Authentication**: Enable Email/Password and Anonymous auth
2. **Firestore Database**: Create database in production mode
3. **Storage**: Enable Cloud Storage
4. **Functions**: Enable Cloud Functions
5. **Analytics**: Enable Google Analytics

## 4. Set Up Security Rules
1. Go to Firestore Database > Rules
2. Copy the rules from firestoreRules above
3. Publish the rules

## 5. Set Up Storage Rules
1. Go to Storage > Rules
2. Copy the rules from storageRules above
3. Publish the rules

## 6. Create Database Indexes
1. Go to Firestore Database > Indexes
2. Create composite indexes as specified in firestoreIndexes

## 7. Set Up Emulators (Development)
1. Install Firebase CLI: npm install -g firebase-tools
2. Login: firebase login
3. Initialize: firebase init
4. Start emulators: firebase emulators:start

## 8. Environment Variables
1. Copy envTemplate to .env file
2. Fill in your Firebase configuration values
3. Set appropriate flags for your environment

## 9. Test Connection
1. Run the application
2. Check browser console for Firebase connection logs
3. Verify data is being written to Firestore
4. Check Firebase console for incoming data

## 10. Deploy (Production)
1. Build the application: npm run build
2. Deploy to Firebase Hosting: firebase deploy
3. Set up CI/CD pipeline (optional)
4. Monitor usage in Firebase console
`;

export default {
  firebaseConfig,
  getFirebaseConfig,
  emulatorConfig,
  firestoreRules,
  storageRules,
  functionsConfig,
  analyticsConfig,
  firestoreIndexes,
  envTemplate,
  setupInstructions,
};
