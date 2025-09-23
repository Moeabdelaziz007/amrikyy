#!/bin/bash

# AI Travel Agent Deployment Script
echo "🚀 Starting AI Travel Agent Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Project built successfully"
else
    echo "❌ Build failed"
    exit 1
fi

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p ../deployment/ai-travel-agent

# Copy built files to deployment directory
echo "📋 Copying files to deployment directory..."
cp -r dist/* ../deployment/ai-travel-agent/

# Create deployment info file
echo "📝 Creating deployment info..."
cat > ../deployment/ai-travel-agent/deployment-info.json << EOF
{
  "appName": "AI Travel Agent",
  "version": "1.0.0",
  "deploymentDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "buildTime": "$(date)",
  "features": [
    "AI Chat Assistant",
    "Flight Search & Booking",
    "Hotel Reservations",
    "Car Rental Services",
    "Travel Planning",
    "User Profile Management",
    "Responsive Design"
  ],
  "techStack": [
    "React 18",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Framer Motion",
    "React Router",
    "React Hook Form",
    "Zustand",
    "React Hot Toast",
    "Lucide React"
  ],
  "deploymentStatus": "success"
}
EOF

echo "✅ Deployment completed successfully!"
echo "📂 Files deployed to: ../deployment/ai-travel-agent/"
echo "🌐 To serve the app locally, run: cd ../deployment/ai-travel-agent && python3 -m http.server 8000"
echo "🔗 Then open: http://localhost:8000"
echo ""
echo "🎉 AI Travel Agent is ready for deployment!"
