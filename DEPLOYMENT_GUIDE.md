# 🚀 AuraOS Deployment Guide

## 📋 Overview
This guide will walk you through deploying AuraOS to Firebase Hosting.

---

## ✅ Prerequisites

### **1. Node.js & npm**
```bash
# Check if installed
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0

# Install if needed (Mac)
brew install node

# Install if needed (Linux)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **2. Firebase CLI**
```bash
# Install globally
npm install -g firebase-tools

# Verify installation
firebase --version

# Login to Firebase
firebase login
```

### **3. Project Dependencies**
```bash
# Install all dependencies
npm install
```

---

## 🔧 Pre-Deployment Checklist

### **1. Environment Variables**
Ensure `.env` file has all required variables:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI Configuration (Optional but recommended)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Get Firebase Config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → General
4. Scroll to "Your apps" → Web app
5. Copy the config values

**Get Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy and add to `.env`

### **2. Firebase Project Setup**
```bash
# Initialize Firebase (if not done)
firebase init

# Select:
# - Hosting
# - Use existing project or create new one
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No
```

### **3. Code Quality Check**
```bash
# Run linter (if available)
npm run lint

# Check for TypeScript errors
npx tsc --noEmit

# Test build locally
npm run build
npm run preview
```

---

## 🏗️ Build Process

### **Step 1: Clean Previous Build**
```bash
# Remove old build files
rm -rf dist/

# Clear cache (optional)
rm -rf node_modules/.vite/
```

### **Step 2: Build Production Version**
```bash
# Build optimized production bundle
npm run build
```

**Expected Output:**
```
vite v5.0.8 building for production...
✓ 1234 modules transformed.
dist/index.html                   1.23 kB │ gzip: 0.56 kB
dist/assets/index-abc123.css     45.67 kB │ gzip: 12.34 kB
dist/assets/index-def456.js     234.56 kB │ gzip: 78.90 kB
✓ built in 12.34s
```

### **Step 3: Verify Build**
```bash
# Check dist folder
ls -lh dist/

# Should contain:
# - index.html
# - assets/ (CSS and JS files)
# - Any static assets

# Test locally
npm run preview
# Open http://localhost:4173
```

---

## 🚀 Deployment Steps

### **Method 1: Firebase CLI (Recommended)**

#### **Step 1: Deploy to Firebase**
```bash
# Deploy hosting only
firebase deploy --only hosting
```

**Expected Output:**
```
=== Deploying to 'your-project-id'...

i  deploying hosting
i  hosting[your-project-id]: beginning deploy...
i  hosting[your-project-id]: found 123 files in dist
✔  hosting[your-project-id]: file upload complete
i  hosting[your-project-id]: finalizing version...
✔  hosting[your-project-id]: version finalized
i  hosting[your-project-id]: releasing new version...
✔  hosting[your-project-id]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id/overview
Hosting URL: https://your-project-id.web.app
```

#### **Step 2: Verify Deployment**
```bash
# Open in browser
open https://your-project-id.web.app

# Or use Firebase hosting URL
open https://your-project-id.firebaseapp.com
```

---

### **Method 2: One-Line Deploy**
```bash
# Build and deploy in one command
npm run build && firebase deploy --only hosting
```

---

### **Method 3: Deploy with Message**
```bash
# Deploy with custom message
firebase deploy --only hosting -m "Deploy AI Brain activation v2.0"
```

---

## 🧪 Post-Deployment Testing

### **1. Basic Functionality**
- [ ] **Login Screen** - Appears for non-authenticated users
- [ ] **Google Sign-In** - Works correctly
- [ ] **Desktop** - Loads after login
- [ ] **Window Management** - Open, close, minimize, maximize, resize
- [ ] **Taskbar** - Shows minimized windows

### **2. AI Features**
- [ ] **AI Terminal** - Opens and accepts commands
- [ ] **Command Palette** - Opens with Ctrl+Space
- [ ] **System Commands** - `status`, `services`, `processes` work
- [ ] **AI Commands** - `analyze`, `summarize` work (if API key set)
- [ ] **Error Handling** - Shows helpful messages

### **3. UI/UX**
- [ ] **Animations** - Smooth window animations
- [ ] **Focus/Blur** - Windows blur when not focused
- [ ] **Desktop Modes** - Mode indicator shows current mode
- [ ] **Responsive** - Works on different screen sizes
- [ ] **Performance** - No lag or stuttering

### **4. Browser Compatibility**
Test on:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (Mac)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📊 Deployment Checklist

### **Before Deployment:**
- [ ] All code committed to Git
- [ ] All changes pushed to GitHub
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] Local preview works (`npm run preview`)
- [ ] No console errors
- [ ] Firebase project selected

### **During Deployment:**
- [ ] Build completes without errors
- [ ] Firebase deploy succeeds
- [ ] Deployment URL received
- [ ] No deployment warnings

### **After Deployment:**
- [ ] Site loads correctly
- [ ] Login works
- [ ] Desktop appears
- [ ] AI features work
- [ ] No console errors
- [ ] Performance is good
- [ ] Mobile works (if applicable)

---

## 🔍 Troubleshooting

### **Problem: Build Fails**
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite/
rm -rf dist/
npm run build
```

### **Problem: Firebase Deploy Fails**
```bash
# Check Firebase login
firebase login --reauth

# Check project
firebase projects:list
firebase use your-project-id

# Try again
firebase deploy --only hosting
```

### **Problem: Site Shows 404**
```bash
# Check firebase.json
# Ensure "public": "dist"
# Ensure rewrites are configured

# Redeploy
npm run build
firebase deploy --only hosting --force
```

### **Problem: Environment Variables Not Working**
```bash
# Ensure variables start with VITE_
# Example: VITE_FIREBASE_API_KEY

# Rebuild after changing .env
npm run build
firebase deploy --only hosting
```

### **Problem: AI Features Not Working**
```bash
# Check if VITE_GEMINI_API_KEY is set
# Check browser console for errors
# Verify API key is valid
# Try fallback commands (status, services)
```

### **Problem: Slow Performance**
```bash
# Check build size
du -sh dist/

# Optimize if needed
# - Remove unused dependencies
# - Enable code splitting
# - Compress images
# - Use lazy loading
```

---

## 📈 Performance Optimization

### **1. Build Size Analysis**
```bash
# Analyze bundle size
npm run build -- --mode production

# Check dist folder size
du -sh dist/
du -h dist/assets/*
```

### **2. Lighthouse Audit**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-project-id.web.app --view

# Check scores:
# - Performance: > 90
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 90
```

### **3. Optimization Tips**
- ✅ Enable gzip compression (Firebase does this automatically)
- ✅ Use code splitting for large components
- ✅ Lazy load routes and heavy components
- ✅ Optimize images (use WebP format)
- ✅ Remove unused dependencies
- ✅ Enable tree shaking
- ✅ Use production builds only

---

## 🔄 Continuous Deployment

### **Option 1: GitHub Actions**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### **Option 2: Firebase Hosting Auto-Deploy**
```bash
# Enable GitHub integration
firebase init hosting:github

# Follow prompts to connect GitHub repo
# Auto-deploys on push to main branch
```

---

## 📱 Mobile Deployment

### **PWA Configuration**
AuraOS can be installed as a Progressive Web App:

1. **Add to Home Screen** (iOS)
   - Open in Safari
   - Tap Share button
   - Tap "Add to Home Screen"

2. **Install App** (Android)
   - Open in Chrome
   - Tap menu (⋮)
   - Tap "Install app"

3. **Desktop Install** (Chrome)
   - Click install icon in address bar
   - Or: Settings → Install AuraOS

---

## 🎯 Deployment Environments

### **Production**
```bash
# Deploy to production
firebase deploy --only hosting

# URL: https://your-project-id.web.app
```

### **Staging**
```bash
# Deploy to preview channel
firebase hosting:channel:deploy staging

# URL: https://your-project-id--staging-xxx.web.app
```

### **Preview (PR)**
```bash
# Deploy preview for testing
firebase hosting:channel:deploy pr-123

# URL: https://your-project-id--pr-123-xxx.web.app
```

---

## 📊 Monitoring

### **Firebase Console**
- **Hosting Dashboard**: View traffic, bandwidth
- **Performance**: Monitor load times
- **Analytics**: Track user behavior
- **Crashlytics**: Monitor errors

### **Google Analytics**
Already configured if `VITE_FIREBASE_MEASUREMENT_ID` is set.

### **Custom Monitoring**
Add to your code:
```typescript
// Track page views
analytics.logEvent('page_view', {
  page_path: window.location.pathname
});

// Track AI commands
analytics.logEvent('ai_command', {
  command: 'status'
});
```

---

## 🔐 Security

### **1. Environment Variables**
- ✅ Never commit `.env` to Git
- ✅ Use Firebase environment config for secrets
- ✅ Rotate API keys regularly

### **2. Firebase Security Rules**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **3. Content Security Policy**
Already configured in `firebase.json` headers.

---

## 📚 Resources

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Google AI Studio](https://makersuite.google.com/)
- [AuraOS AI Commands](./AI_COMMANDS.md)
- [Cursor Setup](./CURSOR_SETUP.md)

---

## 🎉 Success!

Once deployed, your AuraOS instance will be live at:
- **Primary URL**: `https://your-project-id.web.app`
- **Alternative URL**: `https://your-project-id.firebaseapp.com`

Share it with the world! 🌍✨

---

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Check Firebase Console for errors
3. Check browser console for errors
4. Review deployment logs
5. Check GitHub issues

---

**Made with ❤️ by AuraOS Team**
**Powered by Firebase & Google Gemini AI** 🚀
