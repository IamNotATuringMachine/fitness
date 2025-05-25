#!/bin/bash

# Fitness App Deployment Script for GitHub Pages
echo "🚀 Starting deployment to GitHub Pages..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production file not found!"
    echo "Please create .env.production with your Supabase credentials:"
    echo "REACT_APP_SUPABASE_URL=https://your-project.supabase.co"
    echo "REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app will be available at: https://IamNotATuringMachine.github.io/fitness"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure Supabase redirect URLs"
    echo "2. Test authentication functionality"
    echo "3. Verify data syncing works"
else
    echo "❌ Deployment failed! Please check the errors above."
    exit 1
fi 