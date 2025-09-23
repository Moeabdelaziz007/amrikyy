# Firebase Hosting Setup Guide for AI Travel Agent

## 🚀 Quick Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Project
```bash
firebase init hosting
```

When prompted:
- **Select Firebase project**: Create a new project or select existing
- **Project name**: `ai-travel-agent-app` (or your preferred name)
- **Public directory**: `dist`
- **Single-page app**: `Yes`
- **Overwrite index.html**: `No`

### 4. Deploy
```bash
# Make the deployment script executable
chmod +x firebase-deploy.sh

# Run the deployment script
./firebase-deploy.sh
```

## 🔧 Manual Deployment Steps

### Step 1: Build the Project
```bash
npm install
npm run build
```

### Step 2: Deploy to Firebase
```bash
firebase deploy --only hosting
```

## 📁 Firebase Configuration Files

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "ai-travel-agent-app"
  }
}
```

## 🌐 Deployment URLs

After successful deployment, your app will be available at:
- **Primary URL**: `https://ai-travel-agent-app.web.app`
- **Alternative URL**: `https://ai-travel-agent-app.firebaseapp.com`

## 🔒 Security Headers

The Firebase configuration includes security headers:
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`

## ⚡ Performance Optimizations

- **Static Asset Caching**: 1 year for JS/CSS files
- **Image Caching**: 1 year for images
- **Gzip Compression**: Enabled by Firebase
- **CDN**: Global content delivery network

## 📊 Monitoring & Analytics

### Firebase Analytics (Optional)
1. Go to Firebase Console
2. Select your project
3. Enable Analytics
4. Add tracking code to your app

### Performance Monitoring
1. Enable Performance Monitoring in Firebase Console
2. Monitor app performance metrics
3. Track user interactions

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: ai-travel-agent-app
```

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Firebase CLI Not Found**
   ```bash
   # Install globally
   npm install -g firebase-tools
   ```

3. **Authentication Issues**
   ```bash
   # Re-login
   firebase logout
   firebase login
   ```

4. **Deployment Fails**
   ```bash
   # Check Firebase project
   firebase projects:list
   firebase use --add
   ```

### Debug Commands
```bash
# Check Firebase status
firebase projects:list

# Check hosting status
firebase hosting:sites:list

# View deployment logs
firebase hosting:channel:open live
```

## 📈 Post-Deployment

### 1. Test Your App
- Visit the deployed URL
- Test all features:
  - AI Chat
  - Flight Search
  - Hotel Booking
  - Car Rental
  - Travel Planning
  - User Profile

### 2. Set Up Custom Domain (Optional)
1. Go to Firebase Console
2. Select Hosting
3. Add custom domain
4. Follow DNS configuration steps

### 3. Enable Analytics
1. Firebase Console → Analytics
2. Enable Google Analytics
3. Configure tracking

### 4. Monitor Performance
1. Firebase Console → Performance
2. Monitor app metrics
3. Set up alerts

## 🎯 Success Checklist

- [ ] Firebase CLI installed
- [ ] Firebase project created
- [ ] App built successfully
- [ ] Deployed to Firebase Hosting
- [ ] App accessible via URL
- [ ] All features working
- [ ] Performance optimized
- [ ] Security headers configured

## 🆘 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Review deployment logs
3. Verify build process
4. Check Firebase documentation
5. Contact Firebase support

---

**🎉 Your AI Travel Agent is now live on Firebase Hosting!**
