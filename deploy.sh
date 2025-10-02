#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Step 1: Installing dependencies..."
npm install

echo "Step 2: Creating production build..."
npm run build

echo "Step 3: Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "Deployment script finished successfully!"
#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "Step 1: Installing dependencies..."
npm install

echo "Step 2: Creating production build..."
npm run build

echo "Step 3: Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "Deployment script finished successfully!"
