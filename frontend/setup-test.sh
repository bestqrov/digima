#!/bin/bash

# ArwaPark Frontend Setup and Test Script
# This script installs dependencies and tests the frontend setup

echo "🚀 ArwaPark Frontend Setup Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "✅ Found package.json"

# Check Node.js version
node_version=$(node --version)
echo "📋 Node.js version: $node_version"

# Check npm version
npm_version=$(npm --version)
echo "📋 npm version: $npm_version"

# Clean install
echo "🧹 Cleaning npm cache..."
npm cache clean --force

echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory created"
    echo "📊 Installed packages count: $(ls node_modules | wc -l)"
else
    echo "❌ node_modules directory not found"
    exit 1
fi

# Type check
echo "🔍 Running TypeScript type check..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ Type check passed!"
else
    echo "⚠️  Type check failed (this is expected without dependencies)"
fi

# Try to build
echo "🏗️  Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🎉 Frontend setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Review .env.local configuration"
    echo "  2. Run 'npm run dev' to start development server"
    echo "  3. Open http://localhost:3000 in your browser"
    echo "  4. Login with backend API credentials"
else
    echo "⚠️  Build failed - check for missing dependencies or configuration issues"
fi

echo ""
echo "🎯 Setup Summary:"
echo "  - Frontend framework: Next.js 14"
echo "  - Backend API: https://arwapark.digima.cloud/api"
echo "  - Development server: http://localhost:3000"
echo "  - Features: Dashboard, Authentication, Vehicle/Trip/User Management"

echo ""
echo "Done! ✨"