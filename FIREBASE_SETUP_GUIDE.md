# Firebase Setup Guide for AuraOS

## Issue Resolution

The current Firebase configuration errors are caused by placeholder API keys in the code. Here's how to fix them:

### Error Messages Fixed:
- `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`
- DOM autocomplete attribute warnings for password inputs
- Deprecated meta tag warnings

## Firebase Configuration Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `auraos-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Enable
   - **Anonymous**: Enable (for guest login)
   - **Google**: Enable and configure OAuth consent screen
   - **GitHub**: Enable (if needed)

### 3. Get Configuration Values
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`) to add web app
4. Register app with nickname: "AuraOS Web App"
5. Copy the configuration object

### 4. Update Configuration

#### Option A: Environment Variables (Recommended)
Create a `.env` file in your project root:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Option B: Direct Configuration Update
Update `script.js` line 106 with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 5. Security Rules (Firestore)
Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access to certain collections
    match /public/{document=**} {
      allow read: if true;
    }
  }
}
```

### 6. Hosting Configuration
Your `firebase.json` is already properly configured for hosting.

## Deployment Steps

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```

4. Deploy to Firebase:
```bash
firebase deploy
```

## Testing Authentication

After configuration, test these features:
- [ ] Email/Password signup
- [ ] Email/Password login
- [ ] Guest login (anonymous)
- [ ] Google OAuth login
- [ ] Password reset
- [ ] User profile management

## Common Issues & Solutions

### API Key Invalid Error
- **Cause**: Using placeholder or incorrect API key
- **Solution**: Update with actual Firebase project API key

### Domain Not Authorized
- **Cause**: Domain not added to authorized domains
- **Solution**: Add your domain to Firebase Auth settings

### CORS Issues
- **Cause**: Cross-origin requests blocked
- **Solution**: Configure authorized domains in Firebase Console

### Service Worker Issues
- **Cause**: Firebase SDK conflicts with PWA service worker
- **Solution**: Ensure proper service worker registration order

## Production Checklist

- [ ] Replace all placeholder API keys with real values
- [ ] Configure proper security rules
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and alerts
- [ ] Test all authentication flows
- [ ] Verify data persistence
- [ ] Check performance metrics

## Support

For additional help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Community](https://firebase.community/)

---

**Note**: Never commit real API keys to version control. Use environment variables or Firebase's built-in security features.
