#!/bin/bash
# JamboHub Deployment Script
# Run from the project root directory

set -e  # Exit on error

echo "🏕️ JamboHub Deployment"
echo "======================"

# Check if Fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Install it with: brew install flyctl"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Run: fly auth login"
    exit 1
fi

echo "✅ Fly CLI ready"

# Build frontend
echo ""
echo "📦 Building frontend..."
cd jambohub-frontend
npm install
npm run build
echo "✅ Frontend built"

# Copy to backend static folder
echo ""
echo "📋 Copying frontend to backend..."
rm -rf ../jambohub-backend/static/*
cp -r dist/* ../jambohub-backend/static/
echo "✅ Frontend copied"

# Deploy backend
echo ""
echo "🚀 Deploying to Fly.io..."
cd ../jambohub-backend
fly deploy

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://jambohub.fly.dev"
