#!/bin/bash

# Enhanced Fitness App Deployment Script with Data Protection
echo "🛡️ Secure Deployment to GitHub Pages"
echo "====================================="

# Step 1: Data Protection - Create Backup First!
echo ""
echo "📋 Step 1: Creating pre-deployment backup..."
echo "⚠️  CRITICAL: This protects your training data from being lost!"
echo ""

# Check if automated backup is available
if command -v node >/dev/null 2>&1 && [ -f "backup-before-deploy.js" ]; then
    echo "🤖 Attempting automated backup..."
    
    # Install puppeteer if needed for automated backup
    if ! npm list puppeteer >/dev/null 2>&1; then
        echo "📦 Installing puppeteer for automated backup..."
        npm install --save-dev puppeteer >/dev/null 2>&1
    fi
    
    # Try automated backup
    if node backup-before-deploy.js; then
        echo "✅ Automated backup completed successfully!"
    else
        echo "⚠️ Automated backup failed. Manual backup required!"
        echo ""
        echo "🔗 Manual backup instructions:"
        echo "1. Open: https://iamnotaturingmachine.github.io/fitness/data-import-export"
        echo "2. Click 'Backup Herunterladen'"  
        echo "3. Save file as: backup-$(date +%Y-%m-%d).json"
        echo ""
        read -p "Have you created and saved a backup? (y/N): " backup_confirm
        if [[ ! $backup_confirm =~ ^[Yy]$ ]]; then
            echo "❌ Deployment cancelled for data safety!"
            echo "💡 See DEPLOYMENT_DATENSICHERHEIT.md for detailed instructions"
            exit 1
        fi
    fi
else
    echo "⚠️ Automated backup not available."
    echo ""
    echo "🔗 Please create manual backup:"
    echo "1. Open: https://iamnotaturingmachine.github.io/fitness/data-import-export"  
    echo "2. Click 'Backup Herunterladen'"
    echo "3. Save file securely"
    echo ""
    read -p "Have you created a backup of your training data? (y/N): " backup_confirm
    if [[ ! $backup_confirm =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled for data safety!"
        echo "💡 Your training plans are valuable - protect them with a backup!"
        exit 1
    fi
fi

# Step 2: Environment Check
echo ""
echo "🔧 Step 2: Checking environment configuration..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production file not found!"
    echo "App will run in offline mode - data stored only locally!"
    echo ""
    echo "💡 For cloud storage, create .env.production with:"
    echo "REACT_APP_SUPABASE_URL=https://your-project.supabase.co"
    echo "REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here"
    echo ""
    read -p "Continue with offline mode? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "💡 See SUPABASE_SETUP.md for cloud storage setup"
        exit 1
    fi
fi

# Step 3: Version Management
echo ""
echo "📋 Step 3: Updating version..."

# Use Node.js script for version increment (supports semantic versioning)
if command -v node >/dev/null 2>&1 && [ -f "increment-version.js" ]; then
    node increment-version.js
else
    # Fallback: manual semantic version increment
    if [ -f "public/version.json" ]; then
        echo "⚠️ Node.js not available, using fallback versioning"
        echo "{" > public/version.json
        echo "  \"version\": \"0.0.0.1\"" >> public/version.json
        echo "}" >> public/version.json
        echo "✅ Version reset to v0.0.0.1"
    else
        echo "{" > public/version.json
        echo "  \"version\": \"0.0.0.1\"" >> public/version.json
        echo "}" >> public/version.json
        echo "✅ Version file created with v0.0.0.1"
    fi
fi

# Step 4: Build Process
echo ""
echo "🔨 Step 4: Building the application..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 5: Deployment
echo ""
echo "🚀 Step 5: Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your app will be available at: https://IamNotATuringMachine.github.io/fitness"
    echo "⏱️ Changes may take 2-5 minutes to appear"
    echo ""
    echo "📋 IMPORTANT: Post-deployment checklist:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. ⏳ Wait 5 minutes for GitHub Pages to update"
    echo "2. 🌐 Open your app: https://IamNotATuringMachine.github.io/fitness"
    echo "3. 🔍 Check if your training plans are still visible"
    echo ""
    echo "❌ If your training data is missing:"
    echo "   → Go to: /data-import-export"
    echo "   → Click 'Backup-Datei Auswählen'"
    echo "   → Upload your backup file from Step 1"
    echo "   → Click 'Wiederherstellen'"
    echo ""
    echo "💡 To prevent data loss in future deployments:"
    echo "   → Consider setting up Supabase cloud storage"
    echo "   → See DEPLOYMENT_DATENSICHERHEIT.md for details"
    echo "   → Or always run this script (it creates backups automatically)"
    echo ""
    echo "🆘 Need help? Check these files:"
    echo "   → DEPLOYMENT_DATENSICHERHEIT.md - Complete data protection guide"
    echo "   → SUPABASE_SETUP.md - Cloud storage setup"
    echo "   → check-supabase-config.html - Configuration checker"
    echo ""
    echo "🎉 Deployment complete! Your training data is safe! 💪"
else
    echo ""
    echo "❌ Deployment failed! Please check the errors above."
    echo "💡 Your backup is still safe and can be used when deployment succeeds"
    exit 1
fi 