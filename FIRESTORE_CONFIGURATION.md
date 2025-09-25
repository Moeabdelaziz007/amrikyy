# Firestore Security Rules & Configuration Guide

## Current Firebase Project Configuration
- **Project ID**: aios-97581
- **Auth Domain**: aios-97581.firebaseapp.com
- **Storage Bucket**: aios-97581.firebasestorage.app

## Required Firestore Security Rules

### Basic Rules (for development/testing)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Rules (recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tasks collection
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // User preferences
    match /userPreferences/{prefId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // AI suggestions
    match /aiSuggestions/{suggestionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Collaboration spaces
    match /collaborationSpaces/{spaceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.membersUids;
      allow create: if request.auth != null && 
        request.auth.uid in request.resource.data.membersUids;
    }
    
    // Collaboration messages
    match /collaborationSpaces/{spaceId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/collaborationSpaces/$(spaceId)).data.membersUids;
    }
    
    // Task templates
    match /taskTemplates/{templateId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // AI agents
    match /aiAgents/{agentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Automation rules
    match /automationRules/{ruleId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Automation logs
    match /automationLogs/{logId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Test suites
    match /testSuites/{suiteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Test results
    match /testResults/{resultId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Ultimate features
    match /ultimateFeatures/{featureId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // System insights
    match /systemInsights/{insightId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Connection tests (for debugging)
    match /connectionTests/{testId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Firebase Authentication Setup

### Enable Google Sign-In
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add your domain to authorized domains:
   - `localhost` (for development)
   - `aios-97581.web.app` (for production)
   - `aios-97581.firebaseapp.com` (Firebase hosting)

### Configure OAuth Consent Screen
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Add authorized domains:
   - `localhost`
   - `aios-97581.web.app`
   - `aios-97581.firebaseapp.com`

## Firestore Indexes

### Required Composite Indexes
```javascript
// For tasks collection
{
  "collectionGroup": "tasks",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}

// For collaboration spaces
{
  "collectionGroup": "collaborationSpaces",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "membersUids", "arrayConfig": "CONTAINS"},
    {"fieldPath": "lastActivity", "order": "DESCENDING"}
  ]
}

// For automation rules
{
  "collectionGroup": "automationRules",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}
```

## Testing Firestore Connection

### Manual Testing Steps
1. Open the Firestore Test app in the desktop
2. Sign in with Google
3. Run connection tests
4. Verify all collections are accessible
5. Create sample data
6. Test real-time updates

### Common Issues & Solutions

#### Issue: Permission Denied
**Solution**: Check Firestore security rules and ensure user is authenticated

#### Issue: Index Missing
**Solution**: Create required composite indexes in Firebase Console

#### Issue: Quota Exceeded
**Solution**: Check Firebase usage limits and upgrade plan if needed

#### Issue: Network Error
**Solution**: Check internet connection and Firebase project status

## Data Structure Examples

### Task Document
```javascript
{
  "userId": "user123",
  "title": "Complete project",
  "description": "Finish the AIOS project",
  "status": "pending",
  "priority": "high",
  "category": "work",
  "dueDate": "2024-01-15",
  "tags": ["urgent", "project"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "completedAt": null
}
```

### User Preferences Document
```javascript
{
  "userId": "user123",
  "theme": "dark",
  "wallpaper": "particles",
  "layout": "grid",
  "animations": true,
  "soundEffects": false,
  "personalization": {
    "accentColor": "#00ff88",
    "fontSize": "medium",
    "density": "comfortable",
    "language": "en",
    "timeFormat": "12h"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Monitoring & Analytics

### Enable Firestore Monitoring
1. Go to Firebase Console → Firestore → Usage
2. Monitor read/write operations
3. Set up alerts for quota limits

### Enable Authentication Monitoring
1. Go to Firebase Console → Authentication → Users
2. Monitor user sign-ins
3. Check for suspicious activity

## Backup & Recovery

### Export Data
```bash
gcloud firestore export gs://your-backup-bucket/backup-$(date +%Y%m%d)
```

### Import Data
```bash
gcloud firestore import gs://your-backup-bucket/backup-20240101
```

## Performance Optimization

### Best Practices
1. Use composite indexes for complex queries
2. Limit document reads with pagination
3. Use real-time listeners efficiently
4. Implement proper error handling
5. Cache frequently accessed data

### Query Optimization
```javascript
// Good: Use indexed fields
const q = query(
  collection(db, 'tasks'),
  where('userId', '==', user.uid),
  orderBy('createdAt', 'desc'),
  limit(20)
);

// Bad: Non-indexed query
const q = query(
  collection(db, 'tasks'),
  where('title', '==', 'urgent'),
  where('priority', '==', 'high')
);
```
